import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user" 
import { redirect } from "next/navigation"

import { CreateWorkflowForm } from "@/components/global/workflows/create-workflow-form"

interface NewWorkflowPageProps {
  searchParams: {
    templateId?: string
  }
}

export const metadata: Metadata = {
  title: "Create Workflow | n8n Integration Platform",
  description: "Create a new n8n workflow",
}

export default async function NewWorkflowPage({ searchParams }: NewWorkflowPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { templateId } = searchParams

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Workflow</h1>
        <p className="text-muted-foreground">Select a template and configure your new workflow</p>
      </div>

      <CreateWorkflowForm redirectAfterCreate={true} defaultTemplateId={templateId} />
    </div>
  )
}
