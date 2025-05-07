import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { n8nService } from "@/lib/n8n/service"
import { onUserInfor } from "@/actions/user"
interface RouteParams {
  params: {
    id: string
  }
}

/**
 * POST /api/workflows/[id]/activate
 * Activate a workflow
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id
    const { id } = params

    // Get the workflow
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId, // Ensure the workflow belongs to the authenticated user
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    // Check if the workflow is already active
    if (workflow.isActive) {
      return NextResponse.json({ error: "Workflow is already active" }, { status: 400 })
    }

    // Check if the workflow has an n8n workflow ID
    if (!workflow.n8nWorkflowId) {
      return NextResponse.json({ error: "Workflow has not been created in n8n yet" }, { status: 400 })
    }

    // Activate the workflow
    const result = await n8nService.activateWorkflow(id)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    // Get the updated workflow
    const updatedWorkflow = await client.userWorkflow.findUnique({
      where: { id },
    })

    // Create a notification for the user
    await client.workflowNotification.create({
      data: {
        userId,
        workflowId: id,
        type: "WORKFLOW_ACTIVATED",
        title: "Workflow Activated",
        message: `Your workflow "${workflow.name}" has been activated successfully.`,
      },
    })

    return NextResponse.json({
      ...updatedWorkflow,
      webhookUrl: result.webhookUrl,
    })
  } catch (error) {
    console.error("Error activating workflow:", error)
    return NextResponse.json({ error: "Failed to activate workflow" }, { status: 500 })
  }
}
