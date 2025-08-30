import { db } from "@/db";
import { agents, meeting } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { CallEndedEvent, CallRecordingReadyEvent, CallSessionParticipantLeftEvent, CallSessionStartedEvent, CallTranscriptionReadyEvent } from "@stream-io/node-sdk";
import { eq, and, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


function  verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key")

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or api key" }, 
            { status: 400 }
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json(
            { error: "Invalid signature" }, 
            { status: 401 }
        );
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json(
            { error: "Invalid payload" }, 
            { status: 400 }
        );
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" }, 
                { status: 400 }
            );
        }

        const [existingMeeting] = await db
            .select()
            .from(meeting)
            .where(
                and(
                    eq(meeting.id, meetingId),
                    not(eq(meeting.status, "completed")),
                    not(eq(meeting.status, "active")),
                    not(eq(meeting.status, "cancelled")),
                    not(eq(meeting.status, "processing")),
                )
            );

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" }, 
                { status: 404 }
            );
        }

        await db.update(meeting).set({
            status: "active",
            startedAt: new Date(),
        })
        .where(eq(meeting.id, existingMeeting.id));

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json(
                { error: "Agent not found" }, 
                { status: 404 }
            );
        }

        // Creation de l'appel Video
        const call = streamVideo.video.call("default", meetingId);

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id,
        });

        realtimeClient.updateSession({
            instructions: existingAgent.instruction,
        });

    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" }, 
                { status: 400 }
            );
        }

        // Creation de l'appel Video
        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    }

    return NextResponse.json({ status: "ok" });
}
