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

// Force dynamic rendering due to headers usage
export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<SearchParams>;
}

const MeetingPage = async ({searchParams}: Props) => {
  const filters = await loadSearchParams(searchParams);

  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Handle database connection errors gracefully
    console.error('Database connection error in meetings page:', error);
    // Redirect to sign-in if we can't verify session due to DB issues
    redirect('/sign-in');
  }

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
