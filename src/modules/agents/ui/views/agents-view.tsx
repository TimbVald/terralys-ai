'use client';

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";

export const AgentView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());
    
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
           <DataTable columns={columns} data={data} />
           {data.length === 0 && (
            <EmptyState title="No agents found" description="No agents have been created yet." />
           )}
        </div>
    )
}

export const AgentViewloading = () => {
    return (
        <LoadingState title="Loading agents" description="Please wait, this may take a few moments..." />
    )
}

export const AgentViewError = () => {
    return (
        <ErrorState title="Error loading agents" description="Please try again later." />
    )
}