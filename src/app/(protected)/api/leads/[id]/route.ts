import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { updateLeadStatus } from "@/services/lead-qualification"
import { onUserInfor } from "@/actions/user"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = params.id

    // Fetch the lead with all related data
    const lead = await client.lead.findUnique({
      where: {
        id: leadId,
        userId, // Ensure the lead belongs to the authenticated user
      },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 20, // Get more interactions for the detail view
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = params.id
    const { status, notes } = await req.json()

    // Verify the lead belongs to the user
    const lead = await client.lead.findUnique({
      where: {
        id: leadId,
        userId,
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Update the lead status
    const updatedLead = await updateLeadStatus(leadId, status, notes)

    return NextResponse.json({ lead: updatedLead })
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = params.id

    // Verify the lead belongs to the user
    const lead = await client.lead.findUnique({
      where: {
        id: leadId,
        userId,
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Delete the lead
    await client.lead.delete({
      where: { id: leadId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
