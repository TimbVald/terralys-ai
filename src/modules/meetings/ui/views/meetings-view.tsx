"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meeting.getMany.queryOptions({}))
    return (
        <div>
            {JSON.stringify(data?.items)}
        </div>
    )
}

export const MeetingViewloading = () => {
    return (
        <LoadingState title="Loading meetings" description="Please wait, this may take a few moments..." />
    )
}

export const MeetingViewError = () => {
    return (
        <ErrorState title="Error loading meetings" description="Please try again later." />
    )
}