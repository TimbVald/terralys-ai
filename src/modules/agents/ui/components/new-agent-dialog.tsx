import { ResponsiveDialog } from "@/components/responsive-dialog"
import { AgentForm } from "./agent-form"


interface NewAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
};

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      description="Create a new agent"
      onOpenChange={onOpenChange}
      title="New Agent"
    >
       <AgentForm 
        onSuccess={() => {
          onOpenChange(false)
        }}
        onCancel={() => {
          onOpenChange(false)
        }}

       />
    </ResponsiveDialog>

  )
}

