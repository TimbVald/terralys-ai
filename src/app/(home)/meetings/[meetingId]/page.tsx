import { auth } from "@/lib/auth";
import { MeetingIdView, MeetingIdViewError, MeetingIdViewloading } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Force dynamic rendering due to headers usage
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{meetingId: string}>
}

export default async function Page({params}: Props) {
    const {meetingId} = await params;

    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch (error) {
        // Handle database connection errors gracefully
        console.error('Database connection error in meeting page:', error);
        // Redirect to sign-in if we can't verify session due to DB issues
        redirect('/sign-in');
    }

    if (!session) {
        redirect('/sign-in');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meeting.getOne.queryOptions({
        id: meetingId,
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingIdViewloading />}>
                <ErrorBoundary fallback={<MeetingIdViewError />}>
                    <MeetingIdView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )

}