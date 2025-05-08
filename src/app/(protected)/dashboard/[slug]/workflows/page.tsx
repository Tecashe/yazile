import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user" 
import { redirect } from "next/navigation"

import { WorkflowList } from "@/components/global/workflows/workflow-list"

export const metadata: Metadata = {
  title: "Workflows | n8n Integration Platform",
  description: "Manage your n8n workflows",
}

export default async function WorkflowsPage() {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground">Create and manage your automated workflows</p>
      </div>

      <WorkflowList
        title="My Workflows"
        description="View and manage your configured workflows"
        showFilters={true}
        showSearch={true}
        showCreate={true}
      />
    </div>
  )
}
