import ProfileView from '@/modules/profile/ui/views/profile-view';

import React, { Suspense } from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

// Force dynamic rendering due to headers usage
export const dynamic = 'force-dynamic';

const ProfilePage = async () => {
    let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error('Database connection error in profile page:', error);
    redirect('/sign-in');
  }

  if (!session) {
    redirect('/sign-in');
  }

  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState title="Chargement de l'explorateur de données" description="Veuillez patienter, cela peut prendre quelques instants..." />}>
        <ErrorBoundary fallback={<ErrorState title="Erreur lors du chargement de l'explorateur de données" description="Veuillez réessayer plus tard." />}>
          <ProfileView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}; 

export default ProfilePage;
