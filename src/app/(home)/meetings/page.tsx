import { MeetingsView, MeetingViewError, MeetingViewloading } from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

const MeetingPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meeting.getMany.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingViewloading />}>
        <ErrorBoundary fallback={<MeetingViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default MeetingPage
