import { db } from "@/db";
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { } from "@trpc/client";
import { agents, meeting, user } from "@/db/schema";
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingInsertSchema, meetingUpdateSchema } from "../schema";
import { MeetingStatus, StreamTranscriptItem } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { GeneratedAvatarUri } from "@/lib/avatar";
import JSONL from "jsonl-parse-stringify";
import { streamChat } from "@/lib/stream-chat";

export const meetingRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        try {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meeting),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                })
                .from(meeting).innerJoin(
                    agents,
                    eq(meeting.agentId, agents.id)
                ).where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id)));

            if (!existingMeeting) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Meeting not found',
                });
            }

            return existingMeeting;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),
    getMany: protectedProcedure.input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
        ]).nullish(),
    })).query(async ({ ctx, input }) => {
        try {
            const { page, pageSize, search, status, agentId } = input;
            const data = await db.select(
                {
                    ...getTableColumns(meeting),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                }
            ).from(meeting).innerJoin(
                agents,
                eq(meeting.agentId, agents.id)
            ).where(
                and(
                    eq(meeting.userId, ctx.auth.user.id),
                    search ? ilike(meeting.name, `%${search}%`) : undefined,
                    status ? eq(meeting.status, status) : undefined,
                    agentId ? eq(meeting.agentId, agentId) : undefined,
                )
            )
                .orderBy(desc(meeting.createdAt), desc(meeting.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db.select({
                count: count()
            })
                .from(meeting)
                .innerJoin(
                    agents,
                    eq(meeting.agentId, agents.id)
                )
                .where(
                    and(
                        eq(meeting.userId, ctx.auth.user.id),
                        search ? ilike(meeting.name, `%${search}%`) : undefined,
                        status ? eq(meeting.status, status) : undefined,
                        agentId ? eq(meeting.agentId, agentId) : undefined,
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize)
            // await new Promise(resolve => setTimeout(resolve, 5000));

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),

    create: premiumProcedure("meetings").input(meetingInsertSchema).mutation(async ({ input, ctx }) => {
        try {
            console.log('Creating meeting with input:', input);
            console.log('User ID:', ctx.auth.user.id);
            
            const [createdMeeting] = await db.insert(meeting).values({
                ...input,
                userId: ctx.auth.user.id,
            }).returning();
            
            console.log('Meeting created in DB:', createdMeeting);

            console.log('Creating Stream Video call...');
            const call = streamVideo.video.call("default", createdMeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.user.id,
                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name
                    },
                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on",
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p"
                        }
                    }
                }
            });
            
            console.log('Stream Video call created successfully');

            const [existingAgent] = await db.select().from(agents).where(eq(agents.id, createdMeeting.agentId));
            console.log('Found agent:', existingAgent);

            if (!existingAgent) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Agent not found',
                });
            }

            console.log('Upserting user in Stream Video...');
            await streamVideo.upsertUsers([{
                id: existingAgent.id,
                name: existingAgent.name,
                role: "user",
                image: GeneratedAvatarUri({
                    seed: existingAgent.name,
                    variant: "botttsNeutral",
                }),
            }]);
            
            console.log('User upserted successfully');
            console.log('Meeting creation completed:', createdMeeting);

            return createdMeeting;

        } catch (error) {
            console.error('Error in meeting.create:', error);
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred: ' + (error as Error).message,
            });
        }
    }),

    update: protectedProcedure.input(meetingUpdateSchema).mutation(async ({ input, ctx }) => {
        try {
            const [updatedMeeting] = await db.update(meeting).set(input).where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id))).returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Meeting not found',
                });
            }
            return updatedMeeting;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }
    }),
     remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
        try {
            const [deletedMeeting] = await db.delete(meeting).where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id))).returning();
            if (!deletedMeeting) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Meeting not found',
                });
            }
            return deletedMeeting;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unknown error occurred',
            });
        }

    }),

    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([{
            id: ctx.auth.user.id,
            name: ctx.auth.user.name,
            role: "admin",
            image: ctx.auth.user.image ?? GeneratedAvatarUri({
                seed: ctx.auth.user.name,
                variant: "initials",
            }),
        }]);

        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;

        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issuedAt,
        })

        return token;
    }),

    getTranscript: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeeting] = await db.select()
            .from(meeting)
            .where(and(eq(meeting.id, input.id), eq(meeting.userId, ctx.auth.user.id)));

        if (!existingMeeting) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Meeting not found',
            });
        }

        if (!existingMeeting.transcriptUrl) {
            return [];
        }

        const transcript = await fetch(existingMeeting.transcriptUrl)
            .then((res) => res.text())
            .then((text) => JSONL.parse<StreamTranscriptItem>(text))
            .catch(() => {
                return [];
            });
        
        const speakerIds = [
            ...new Set(transcript.map((item) => item.speaker_id)),
        ];

        const userSpeakers = await db.select()
            .from(user)
            .where(inArray(user.id, speakerIds))
            .then((users) => 
                users.map((user) => ({
                    ...user,
                    image: user.image ?? GeneratedAvatarUri({
                        seed: user.name,
                        variant: "initials",
                    }),
                }))
            );

        const agentSpeakers = await db.select()
            .from(agents)
            .where(inArray(agents.id, speakerIds))
            .then((agent) => 
                agent.map((agents) => ({
                    ...agents,
                    image: GeneratedAvatarUri({
                        seed: agents.name,
                        variant: "botttsNeutral",
                    }),
                }))
            );
        
        const speakers = [...userSpeakers, ...agentSpeakers];

        const transcriptWithSpeakers = transcript.map((item) => {
            const speaker = speakers.find(
                (speaker) => speaker.id === item.speaker_id
            );

            if (!speaker) {
                return {
                    ...item,
                    user: {
                        name: "Unknown",
                        image: GeneratedAvatarUri({
                            seed: "Unknown",
                            variant: "initials",
                        }),
                    }
                };
            };

            return {
                ...item,
                user: {
                    name: speaker.name,
                    image: speaker.image,
                }
            }
        })

        return transcriptWithSpeakers;
    }),

    generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
        const token = streamChat.createToken(ctx.auth.user.id);
        await streamChat.upsertUser({
            id: ctx.auth.user.id,
            role: "admin"
        })
        return token;
    }),
})