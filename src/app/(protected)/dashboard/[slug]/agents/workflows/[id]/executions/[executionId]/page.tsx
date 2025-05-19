// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user" 
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"

// import { ExecutionDetail } from "@/components/global/workflows/execution-detail"

// interface ExecutionDetailPageProps {
//   params: {
//     id: string
//     executionId: string
//   }
// }

// export const metadata: Metadata = {
//   title: "Execution Details | n8n Integration Platform",
//   description: "View details of a workflow execution",
// }

// export default async function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id, executionId } = params

//   // Verify the workflow and execution exist and belong to the user
//   try {
//     const workflowResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}`, {
//       headers: {
//         Cookie: `next-auth.session-token=${session.data.id}`,
//       },
//     })

//     if (!workflowResponse.ok) {
//       notFound()
//     }

//     const executionResponse = await fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}/executions/${executionId}`,
//       {
//         headers: {
//           Cookie: `next-auth.session-token=${session.data.id}`,
//         },
//       },
//     )

//     if (!executionResponse.ok) {
//       notFound()
//     }
//   } catch (error) {
//     notFound()
//   }

//   return (
//     <div>
//       <ExecutionDetail workflowId={id} executionId={executionId} />
//     </div>
//   )
// }

import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user" 
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"

import { ExecutionDetail } from "@/components/global/workflows/execution-detail"

interface WorkflowExecution {
  id: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  success: boolean;
  workflowId: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  userId: string;
}

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
    // First, verify the workflow exists and belongs to the user
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId: session.data.id, // Ensure that the workflow belongs to the authenticated user
      },
      select: {
        id: true,
        name: true,
        userId: true,
      },
    }) as Workflow | null;

    if (!workflow) {
      notFound()
    }

    // Then, verify the execution exists and belongs to the workflow
    const execution = await client.workflowExecution.findUnique({
      where: {
        id: executionId,
        workflowId: id, // Ensure the execution belongs to the workflow
      },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        success: true,
        workflowId: true,
      },
    }) as WorkflowExecution | null;

    if (!execution) {
      notFound()
    }

    // Add debugging
    console.log("Workflow data:", workflow)
    console.log("Execution data:", execution)

    return (
      <div>
        <ExecutionDetail workflowId={id} executionId={executionId} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching workflow or execution:", error)
    notFound()
  }
}