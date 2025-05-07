import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { n8nService } from "@/lib/n8n/service"
import { onUserInfor } from "@/actions/user"
import { WorkflowStatus } from "@prisma/client"

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/workflows/[id]
 * Get a specific workflow by ID
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
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
        executions: {
          take: 5,
          orderBy: { startedAt: "desc" },
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            success: true,
          },
        },
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    // If the workflow has an n8n workflow ID, get additional details from n8n
    let n8nWorkflowDetails = null
    if (workflow.n8nWorkflowId) {
      try {
        n8nWorkflowDetails = await n8nService.getWorkflow(workflow.n8nWorkflowId)
      } catch (error) {
        console.error("Error getting workflow details from n8n:", error)
        // Continue without n8n details
      }
    }

    return NextResponse.json({
      ...workflow,
      n8nDetails: n8nWorkflowDetails,
    })
  } catch (error) {
    console.error("Error getting workflow:", error)
    return NextResponse.json({ error: "Failed to get workflow" }, { status: 500 })
  }
}

/**
 * PUT /api/workflows/[id]
 * Update a workflow
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id
    const { id } = params

    // Parse request body
    const body = await req.json()
    const { name, configuration } = body

    // Get the current workflow
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId, // Ensure the workflow belongs to the authenticated user
      },
      include: {
        template: true,
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    if (name !== undefined) {
      updateData.name = name
    }

    if (configuration !== undefined) {
      updateData.configuration = configuration

      // If the workflow is already created in n8n, update it
      if (workflow.n8nWorkflowId) {
        try {
          await n8nService.updateWorkflow(workflow.n8nWorkflowId, {
            name: name || workflow.name,
            // Apply configuration changes to the n8n workflow
            // This would need to be implemented based on your specific needs
          })
        } catch (error) {
          console.error("Error updating workflow in n8n:", error)
          return NextResponse.json({ error: "Failed to update workflow in n8n" }, { status: 500 })
        }
      } else if (workflow.status === WorkflowStatus.DRAFT) {
        // If the workflow is in draft status and not yet created in n8n, create it
        try {
          const n8nWorkflowId = await n8nService.createWorkflow({ ...workflow, configuration }, workflow.template)

          updateData.n8nWorkflowId = n8nWorkflowId
          updateData.status = WorkflowStatus.READY
        } catch (error) {
          console.error("Error creating workflow in n8n:", error)
          updateData.status = WorkflowStatus.ERROR

          return NextResponse.json({ error: "Failed to create workflow in n8n" }, { status: 500 })
        }
      }
    }

    // Update the workflow
    const updatedWorkflow = await client.userWorkflow.update({
      where: { id },
      data: updateData,
      include: {
        template: true,
      },
    })

    return NextResponse.json(updatedWorkflow)
  } catch (error) {
    console.error("Error updating workflow:", error)
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}

/**
 * DELETE /api/workflows/[id]
 * Delete a workflow
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    // If the workflow has an n8n workflow ID, delete it from n8n
    if (workflow.n8nWorkflowId) {
      try {
        await n8nService.deleteWorkflow(workflow.n8nWorkflowId)
      } catch (error) {
        console.error("Error deleting workflow from n8n:", error)
        // Continue with deletion from database even if n8n deletion fails
      }
    }

    // Delete the workflow from the database
    await client.userWorkflow.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting workflow:", error)
    return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 })
  }
}
