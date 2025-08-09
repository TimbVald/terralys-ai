import { auth } from "@/lib/auth";
import CallView from "@/modules/call/ui/views/call-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


interface Props {
  params: Promise<{ meetingId: string }>;
}

export default async function Page({ params }: Props) {
  const { meetingId } = await params; // ✅ await obligatoire ici

  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Handle database connection errors gracefully
    console.error('Database connection error in call page:', error);
    // Redirect to sign-in if we can't verify session due to DB issues
    redirect('/sign-in');
  }

  if (!session) {
    redirect('/sign-in');
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meeting.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CallView meetingId={meetingId} />
    </HydrationBoundary>
  );
}
