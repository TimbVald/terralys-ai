'use client';

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";


export const AgentView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    // if (isError) {
    //     return (
    //         <ErrorState title="Error loading agents" description="Please try again later." />
    //     )
    // }
    return (
        <div>
           {JSON.stringify(data, null, 2)}
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