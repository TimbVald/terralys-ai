import { ResponsiveDialog } from "@/components/responsive-dialog"
import { MeetingForm } from "@/modules/meetings/ui/components/meeting-form"
import { useRouter } from "next/navigation"
import { MeetingGetOne } from "../../types"



interface UpdateMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: MeetingGetOne
};

export const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: UpdateMeetingDialogProps) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      open={open}
      description="Modifier les détails de cette réunion"
      onOpenChange={onOpenChange}
      title="Modifier la réunion"
      
    >
      <MeetingForm onSuccess={(id) => {
        onOpenChange(false);
        router.push(`/meetings/${id}`)
      }}
      onCancel={() => {
        onOpenChange(false);
      }}
      initialValues={initialValues}
      />
    </ResponsiveDialog>

  )
}

