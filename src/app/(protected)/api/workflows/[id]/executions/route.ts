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
 * GET /api/workflows/[id]/executions
 * Get executions for a specific workflow
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id
    const { id } = params

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get("status")
    const success = searchParams.has("success") ? searchParams.get("success") === "true" : undefined
    const limit = searchParams.has("limit") ? Number.parseInt(searchParams.get("limit") as string, 10) : 20
    const offset = searchParams.has("offset") ? Number.parseInt(searchParams.get("offset") as string, 10) : 0

    // Verify the workflow belongs to the user
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    // Build the query
    const query: any = {
      where: { workflowId: id },
      orderBy: { startedAt: "desc" as const },
      take: limit,
      skip: offset,
      include: {
        events: {
          take: 5,
          orderBy: { timestamp: "asc" },
        },
      },
    }

    // Add filters if provided
    if (status) {
      query.where.status = status
    }

    if (success !== undefined) {
      query.where.success = success
    }

    // Get executions
    const executions = await client.workflowExecution.findMany(query)

    // Get total count for pagination
    const totalCount = await client.workflowExecution.count({
      where: query.where,
    })

    return NextResponse.json({
      executions,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error("Error getting workflow executions:", error)
    return NextResponse.json({ error: "Failed to get workflow executions" }, { status: 500 })
  }
}

/**
 * POST /api/workflows/[id]/executions
 * Execute a workflow
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id
    const { id } = params

    // Parse request body
    const body = await req.json()
    const { inputData } = body

    // Verify the workflow belongs to the user
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    // Check if the workflow is active
    if (!workflow.isActive) {
      return NextResponse.json({ error: "Workflow is not active" }, { status: 400 })
    }

    // Check if the workflow has an n8n workflow ID
    if (!workflow.n8nWorkflowId) {
      return NextResponse.json({ error: "Workflow has not been created in n8n yet" }, { status: 400 })
    }

    // Execute the workflow
    const executionId = await n8nService.executeWorkflow(id, inputData || {})

    // Get the execution
    const execution = await client.workflowExecution.findUnique({
      where: { id: executionId },
    })

    // Create a notification for the user
    await client.workflowNotification.create({
      data: {
        userId,
        workflowId: id,
        executionId,
        type: "EXECUTION_STARTED",
        title: "Workflow Execution Started",
        message: `Your workflow "${workflow.name}" has started executing.`,
      },
    })

    return NextResponse.json(execution)
  } catch (error) {
    console.error("Error executing workflow:", error)
    return NextResponse.json({ error: "Failed to execute workflow" }, { status: 500 })
  }
}
