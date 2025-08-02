import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request)
    const { id: requestId } = params
    const body = await request.json()
    const { editDetails } = body

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, firstname: true, lastname: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!requestId || !editDetails) {
      return NextResponse.json({ error: "Missing request ID or edit details" }, { status: 400 })
    }

    const existingRequest = await client.customWorkflowRequest.findUnique({
      where: { id: requestId, userId: user.id },
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Workflow request not found or unauthorized" }, { status: 404 })
    }

    // Ensure the workflow is in a state where edits can be requested (e.g., COMPLETED or ACTIVE)
    if (existingRequest.status !== "COMPLETED" && existingRequest.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Edits can only be requested for completed or active workflows." },
        { status: 403 },
      )
    }

    // Update the workflow request status to "EDIT_REQUESTED"
    await client.customWorkflowRequest.update({
      where: { id: requestId },
      data: {
        status: "EDIT_REQUESTED",
        editRequestDetails: editDetails, // Store the edit details
      },
    })

    // Create a new notification for admins about the edit request
    const admins = await client.user.findMany({
      where: { isAdmin: true },
      select: { id: true },
    })

    for (const admin of admins) {
      await client.generalNotification.create({
        data: {
          userId: admin.id,
          type: "WORKFLOW_EDIT_REQUEST",
          title: "Custom Workflow Edit Request",
          message: `${user.firstname} ${user.lastname} has requested an edit for workflow "${existingRequest.title}".`,
          metadata: {
            requestId: existingRequest.id,
            requestTitle: existingRequest.title,
            userEmail: user.email,
            editDetails: editDetails,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Edit request submitted successfully and workflow status updated.",
    })
  } catch (error) {
    console.error("Error submitting workflow edit request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
