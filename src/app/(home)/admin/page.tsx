import React, { Suspense } from 'react';
import { AdminDashboard } from '@/modules/admin';
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

/**
 * Page d'administration sécurisée avec authentification
 */
const AdminPage = async () => {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Handle database connection errors gracefully
    console.error('Database connection error in admin page:', error);
    // Redirect to sign-in if we can't verify session due to DB issues
    redirect('/sign-in');
  }

  if (!session) {
    redirect('/sign-in');
  }

  const queryClient = getQueryClient();
  
  // Préchargement des données
  await queryClient.prefetchQuery(trpc.admin.getGlobalStats.queryOptions({ period: 'week' }));
  await queryClient.prefetchQuery(trpc.admin.getTableData.queryOptions({
    table: 'users',
    page: 1,
    limit: 20,
    sortOrder: 'desc'
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState title={''} description={''} />}>
        <ErrorBoundary fallback={<ErrorState title={''} description={''} />}>
          <AdminDashboard />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AdminPage;