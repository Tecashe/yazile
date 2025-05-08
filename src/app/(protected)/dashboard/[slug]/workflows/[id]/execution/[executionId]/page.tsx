import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user" 
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

import { ExecutionDetail } from "@/components/global/workflows/execution-detail"

interface ExecutionDetailPageProps {
  params: {
    id: string
    executionId: string
  }
}

export const metadata: Metadata = {
  title: "Execution Details | n8n Integration Platform",
  description: "View details of a workflow execution",
}

export default async function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id, executionId } = params

  // Verify the workflow and execution exist and belong to the user
  try {
    const workflowResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.data.id}`,
      },
    })

    if (!workflowResponse.ok) {
      notFound()
    }

    const executionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}/executions/${executionId}`,
      {
        headers: {
          Cookie: `next-auth.session-token=${session.data.id}`,
        },
      },
    )

    if (!executionResponse.ok) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  return (
    <div>
      <ExecutionDetail workflowId={id} executionId={executionId} />
    </div>
  )
}
