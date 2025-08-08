"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const router = useRouter()
    const queryClient = useQueryClient();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meeting.getOne.queryOptions({
        id: meetingId,
    }));

     const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

     const removeMeeting = useMutation(trpc.meeting.remove.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.meeting.getMany.queryOptions({}));
            router.push("/meetings");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }))

     const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure ?",
        `This action cannot be undone and will remove ${data.name} associated meetings.`,
    )

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) {
            return;
        }
        try {
            await removeMeeting.mutateAsync({ id: meetingId });
            toast.success("Meeting removed");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }

    return (
        <>
            <RemoveConfirmation />
             <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader meetingId={meetingId} meetingName={data.name} onEdit={() => setUpdateMeetingDialogOpen(true)} onRemove={handleRemoveMeeting} />

            </div>
        </>
    )
}

export const MeetingIdViewloading = () => {
    return (
        <LoadingState title="Loading meeting" description="Please wait, this may take a few moments..." />
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState title="Error loading meeting" description="Please try again later." />
    )
}