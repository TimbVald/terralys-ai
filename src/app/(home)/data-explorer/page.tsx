
/**
 * Page principale du module Data Explorer
 */
import React, { Suspense } from 'react';
import { ExplorerView } from '@/modules/data-explorer';
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

const DataExplorerPage = async () => {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error('Database connection error in data-explorer page:', error);
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
          <ExplorerView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default DataExplorerPage;