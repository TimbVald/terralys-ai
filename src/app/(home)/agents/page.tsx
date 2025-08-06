import React, { Suspense } from 'react'
import { AgentView, AgentViewError, AgentViewloading } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import {AgentListHeader} from '@/modules/agents/ui/components/list-header';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SearchParams } from 'nuqs';
import { loadSearchParams } from '@/modules/agents/params';

interface Props {
    searchParams: Promise<SearchParams>;
}

const AgentPage = async ({searchParams}: Props) => {
    const filters = await loadSearchParams(searchParams);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/sign-in');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));
    return (
        <>
            <AgentListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<AgentViewloading />}>
                    <ErrorBoundary fallback={<AgentViewError />}>
                        <AgentView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default AgentPage
