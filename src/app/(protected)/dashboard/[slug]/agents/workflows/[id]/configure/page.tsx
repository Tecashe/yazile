// import type { Metadata } from "next"
// // import { auth } from "@/lib/auth"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"

// import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

// interface WorkflowConfigPageProps {
//   params: {
//     id: string
//   }
//   searchParams: {
//     tab?: string
//   }
// }

// export const metadata: Metadata = {
//   title: "Configure Workflow | n8n Integration Platform",
//   description: "Configure your n8n workflow",
// }

// export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id } = params
//   const { tab } = searchParams

//   // Verify the workflow exists and belongs to the userr
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
//       <WorkflowConfigurationForm workflowId={id} activateAfterSave={false} />
//     </div>
//   )
// }

import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"
import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

interface WorkflowConfigPageProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: string
  }
}

export const metadata: Metadata = {
  title: "Configure Workflow | n8n Integration Platform",
  description: "Configure your n8n workflow",
}

export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
  const session = await onUserInfor()
  
  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id } = params
  const { tab } = searchParams

  // Verify the workflow exists and belongs to the user
  try {
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId: session.data.id, // Ensure the workflow belongs to the authenticated user
      },
      include: {
        template: true,
        credentials: {
          select: {
            id: true,
            name: true,
            type: true,
            expiresAt: true,
          },
        },
      },
    })

    if (!workflow) {
      notFound()
    }

    return (
      <div>
         <WorkflowConfigurationForm workflowId={id} activateAfterSave={false} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching workflow:", error)
    notFound()
  }
}