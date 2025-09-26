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
      description="Modifier un agent"
      onOpenChange={onOpenChange}
      title="Modifier l'agent"
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

