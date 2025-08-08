import { auth } from '@/lib/auth';
import { loadSearchParams } from '@/modules/meetings/params';
import { MeetingListHeader } from '@/modules/meetings/ui/components/meetings-list-header';
import { MeetingsView, MeetingViewError, MeetingViewloading } from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
    searchParams: Promise<SearchParams>;
}

const MeetingPage = async ({searchParams}: Props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/sign-in');
    }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meeting.getMany.queryOptions({
    ...filters,
  }));


  return (
    <>
      <MeetingListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingViewloading />}>
          <ErrorBoundary fallback={<MeetingViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default MeetingPage
