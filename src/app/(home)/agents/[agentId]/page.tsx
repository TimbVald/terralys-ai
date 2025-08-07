import { AgentIdView, AgentIdViewError, AgentIdViewloading } from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{agentId: string}>
}

export default async function Page({params}: Props) {
    const {agentId} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({
        id: agentId,
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIdViewloading />}>
                <ErrorBoundary fallback={<AgentIdViewError />}>
                    <AgentIdView agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )

}