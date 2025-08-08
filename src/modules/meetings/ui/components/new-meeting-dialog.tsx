import { ResponsiveDialog } from "@/components/responsive-dialog"
import { MeetingForm } from "@/modules/meetings/ui/components/meeting-form"
import { useRouter } from "next/navigation"



interface NewMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
};

export const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      open={open}
      description="Create a new Meeting"
      onOpenChange={onOpenChange}
      title="New Meeting"
    >
      <MeetingForm onSuccess={(id) => {
        onOpenChange(false);
        router.push(`/meetings/${id}`)
      }}
      onCancel={() => {
        onOpenChange(false);
      }} />
    </ResponsiveDialog>

  )
}

