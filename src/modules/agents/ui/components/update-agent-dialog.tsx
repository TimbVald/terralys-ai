import { ResponsiveDialog } from "@/components/responsive-dialog"
import { AgentForm } from "./agent-form"
import { AgentGetOne } from "../../types"


interface UpdateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: AgentGetOne
};

export const UpdateAgentDialog = ({ open, onOpenChange, initialValues }: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      description="Edit an agent"
      onOpenChange={onOpenChange}
      title="Edit Agent"
    >
      <AgentForm
        onSuccess={() => {
          onOpenChange(false)
        }}
        onCancel={() => {
          onOpenChange(false)
        }}
        initialValues={initialValues}
      />
    </ResponsiveDialog>

  )
}

