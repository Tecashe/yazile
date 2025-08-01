import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request)
    const { id } = params
    const { adminId } = await request.json()

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

    // Update the workflow request with assigned admin
    const updatedRequest = await client.customWorkflowRequest.update({
      where: { id },
      data: {
        assignedAdminId: adminId || user.id,
        status: "UNDER_REVIEW",
        updatedAt: new Date(),
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
        // assignedAdmin: {
        //   select: {
        //     firstname: true,
        //     lastname: true,
        //   },
        // },
      },
    })

    // Create assignment record
    await client.adminWorkflowAssignment.create({
      data: {
        adminUserId: adminId || user.id,
        requestId: id,
        assignedAt: new Date(),
        notes: "Assigned for review and development",
      },
    })

    // Notify user about assignment
    // await client.generalNotification.create({
    //   data: {
    //     userId: updatedRequest.userId,
    //     type: "WORKFLOW_ASSIGNED",
    //     title: "Workflow Request Assigned",
    //     message: `Your custom workflow request "${updatedRequest.title}" has been assigned to ${updatedRequest.assignedAdmin?.firstname} ${updatedRequest.assignedAdmin?.lastname} for review.`,
    //     metadata: {
    //       requestId: id,
    //       adminName: `${updatedRequest.assignedAdmin?.firstname} ${updatedRequest.assignedAdmin?.lastname}`,
    //     },
    //   },
    // })

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    })
  } catch (error) {
    console.error("Error assigning workflow request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
