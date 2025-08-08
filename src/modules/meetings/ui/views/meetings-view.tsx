"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meeting.getMany.queryOptions({}))
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={columns}
                data={data.items}
            />
            {data.items.length === 0 && (
            <EmptyState title="Create your first meeting" description="Shedule a meeting to connect with others. Each meeting let's you collaborate, share ideas, and interact with participants in real-time." />
           )}
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