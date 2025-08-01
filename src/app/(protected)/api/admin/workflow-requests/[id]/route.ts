import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request)
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the workflow request
    const updatedRequest = await client.customWorkflowRequest.update({
      where: { id: params.id },
      data: {
        status: body.status,
        developmentNotes: body.developmentNotes,
        estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : undefined,
        actualDelivery: body.actualDelivery ? new Date(body.actualDelivery) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    })

    // Create notification for the user about status update
    await client.generalNotification.create({
      data: {
        userId: updatedRequest.user.id,
        type: "WORKFLOW_COMPLETED",
        title: "Workflow Request Update",
        message: `Your workflow request "${updatedRequest.title}" status has been updated to: ${body.status}`,
        metadata: {
          requestId: updatedRequest.id,
          newStatus: body.status,
          developmentNotes: body.developmentNotes,
        },
      },
    })

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    })
  } catch (error) {
    console.error("Error updating workflow request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workflowRequest = await client.customWorkflowRequest.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    })

    if (!workflowRequest) {
      return NextResponse.json({ error: "Workflow request not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      request: workflowRequest,
    })
  } catch (error) {
    console.error("Error fetching workflow request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
