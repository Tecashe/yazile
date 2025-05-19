// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"

// import { WorkflowDetail } from "@/components/global/workflows/workflow-detail"

// interface WorkflowDetailPageProps {
//   params: {
//     id: string
//   }
// }

// export async function generateMetadata({ params }: WorkflowDetailPageProps): Promise<Metadata> {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     return {
//       title: "Workflow | n8n Integration Platform",
//     }
//   }

//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${params.id}`, {
//       headers: {
//         Cookie: `next-auth.session-token=${session.data.id}`,
//       },
//     })

//     if (!response.ok) {
//       return {
//         title: "Workflow | n8n Integration Platform",
//       }
//     }

//     const workflow = await response.json()

//     return {
//       title: `${workflow.name} | n8n Integration Platform`,
//       description: `Details for workflow: ${workflow.name}`,
//     }
//   } catch (error) {
//     return {
//       title: "Workflow | n8n Integration Platform",
//     }
//   }
// }

// export default async function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id } = params

//   // Verify the workflow exists and belongs to the user
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}`, {
//       headers: {
//         Cookie: `next-auth.session-token=${session.data.id}`,
//       },
//     })

//     if (!response.ok) {
//       notFound()
//     }
//   } catch (error) {
//     notFound()
//   }

//   return (
//     <div>
//       <WorkflowDetail workflowId={id} showExecutionHistory={true} />
//     </div>
//   )
// }

import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"

import { WorkflowDetail } from "@/components/global/workflows/workflow-detail"

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  userId: string;
}

interface WorkflowDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: WorkflowDetailPageProps): Promise<Metadata> {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    return {
      title: "Workflow | n8n Integration Platform",
    }
  }

  try {
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id: params.id,
        userId: session.data.id, // Ensure that the workflow belongs to the authenticated user
      },
      select: {
        id: true,
        name: true,
        userId: true,
      },
    }) as Workflow | null;

    if (!workflow) {
      return {
        title: "Workflow | n8n Integration Platform",
      }
    }

    return {
      title: `${workflow.name} | n8n Integration Platform`,
      description: `Details for workflow: ${workflow.name}`,
    }
  } catch (error) {
    console.error("Error fetching workflow for metadata:", error)
    return {
      title: "Workflow | n8n Integration Platform",
    }
  }
}

export default async function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id } = params

  // Verify the workflow exists and belongs to the user
  try {
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

    // Add debugging
    console.log("Workflow data:", workflow)

    return (
      <div>
        <WorkflowDetail workflowId={id} showExecutionHistory={true} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching workflow:", error)
    notFound()
  }
}