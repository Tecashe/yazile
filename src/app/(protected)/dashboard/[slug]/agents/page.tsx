import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"

import { WorkflowStats } from "@/components/global/n8n/dashboard/workflow-stats"
import { ExecutionStats } from "@/components/global/n8n/dashboard/execution-stats"
import { AnalyticsChart } from "@/components/global/n8n/dashboard/analytics-chart"
import { RecentExecutions } from "@/components/global/n8n/dashboard/recent-executions"
import { WorkflowStatusSummary } from "@/components/global/n8n/dashboard/workflow-status-summary"

export const metadata: Metadata = {
  title: "Dashboard | n8n Integration Platform",
  description: "Overview of your n8n workflows and executions",
}

export default async function DashboardPage() {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const userId = session.data.id

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your n8n workflows and executions</p>
      </div>

      <div className="grid gap-6">
        {/* Workflow Stats */}
        <WorkflowStats userId={userId} />

        {/* Analytics Chart */}
        <AnalyticsChart userId={userId} defaultPeriod="30d" defaultMetric="executions" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Executions */}
          <RecentExecutions limit={5} showWorkflowInfo={true} />

          {/* Workflow Status Summary */}
          <WorkflowStatusSummary />
        </div>

        {/* Execution Stats */}
        <ExecutionStats userId={userId} period="week" />
      </div>
    </div>
  )
}
