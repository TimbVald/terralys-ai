import React, { Suspense } from 'react'
import { AgentView, AgentViewError, AgentViewloading } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const AgentPage = async () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentViewloading />}>
                <ErrorBoundary fallback={<AgentViewError />}>
                    <AgentView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default AgentPage
