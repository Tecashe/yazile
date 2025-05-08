import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ExecutionHistory } from "@/components/global/workflows/execution-history"

interface ExecutionsPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Execution History | n8n Integration Platform",
  description: "View execution history for your workflow",
}

export default async function ExecutionsPage({ params }: ExecutionsPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id } = params

  // Verify the workflow exists and belongs to the user
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.data.id}`,
      },
    })

    if (!response.ok) {
      notFound()
    }

    const workflow = await response.json()

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/workflows/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Execution History</h1>
            <p className="text-muted-foreground">View execution history for workflow: {workflow.name}</p>
          </div>
        </div>

        <ExecutionHistory workflowId={id} limit={50} showWorkflowInfo={false} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
