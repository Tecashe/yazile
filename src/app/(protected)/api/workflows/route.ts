import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { n8nService } from "@/lib/n8n/service"
import { onUserInfor } from "@/actions/user"
import { WorkflowStatus } from "@prisma/client"

/**
 * GET /api/workflows
 * Get all workflows for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await onUserInfor()
    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get("status")
    const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined
    const limit = searchParams.has("limit") ? Number.parseInt(searchParams.get("limit") as string, 10) : 50
    const offset = searchParams.has("offset") ? Number.parseInt(searchParams.get("offset") as string, 10) : 0

    // Build the query
    const query: any = {
      where: { userId },
      include: {
        template: {
          select: {
            name: true,
            description: true,
            category: true,
            icon: true,
          },
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" as const },
      take: limit,
      skip: offset,
    }

    // Add filters if provided
    if (status) {
      query.where.status = status
    }

    if (isActive !== undefined) {
      query.where.isActive = isActive
    }

    // Get workflows
    const workflows = await client.userWorkflow.findMany(query)

    // Get total count for pagination
    const totalCount = await client.userWorkflow.count({
      where: query.where,
    })

    return NextResponse.json({
      workflows,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error("Error getting workflows:", error)
    return NextResponse.json({ error: "Failed to get workflows" }, { status: 500 })
  }
}

/**
 * POST /api/workflows
 * Create a new workflow for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id

    // Parse request body
    const body = await req.json()
    const { templateId, name, configuration } = body

    if (!templateId || !name) {
      return NextResponse.json({ error: "Template ID and name are required" }, { status: 400 })
    }

    // Get the template
    const template = await client.workflowTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Create the workflow
    const workflow = await client.userWorkflow.create({
      data: {
        userId,
        templateId,
        name,
        configuration: configuration || {},
        status: WorkflowStatus.DRAFT,
      },
    })

    // If configuration is provided, create the workflow in n8n
    if (configuration) {
      try {
        const n8nWorkflowId = await n8nService.createWorkflow(workflow, template)

        // Update the workflow with the n8n workflow ID
        await client.userWorkflow.update({
          where: { id: workflow.id },
          data: {
            n8nWorkflowId,
            status: WorkflowStatus.READY,
          },
        })

        // Get the updated workflow
        const updatedWorkflow = await client.userWorkflow.findUnique({
          where: { id: workflow.id },
          include: {
            template: {
              select: {
                name: true,
                description: true,
                category: true,
                icon: true,
              },
            },
          },
        })

        return NextResponse.json(updatedWorkflow)
      } catch (error) {
        console.error("Error creating workflow in n8n:", error)

        // Update the workflow status to ERROR
        await client.userWorkflow.update({
          where: { id: workflow.id },
          data: {
            status: WorkflowStatus.ERROR,
          },
        })

        return NextResponse.json({ error: "Failed to create workflow in n8n", workflow }, { status: 500 })
      }
    }

    // Return the created workflow
    return NextResponse.json(workflow)
  } catch (error) {
    console.error("Error creating workflow:", error)
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
  }
}
