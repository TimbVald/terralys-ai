"use client"

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CallProvider } from "../components/call-provider";


interface Props {
    meetingId: string;
}

const CallView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter()

    const {data} = useSuspenseQuery(trpc.meeting.getOne.queryOptions({
        id: meetingId,
    }))

    if (data.status === "completed") {
        return (
            <div className="h-screen flex items-center justify-center">
                <ErrorState
                title="Meeting has ended"
                description="The meeting has ended. You cannot join it anymore." />
            </div>
        )
    }

    return (
        <CallProvider meetingId={meetingId} meetingName={data.name} />
    )
}

export default CallView;
