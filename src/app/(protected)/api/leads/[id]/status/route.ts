import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { leadQualificationService } from "@/services/lead-qualification-service"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = params.id
    const { status, notes } = await req.json()

    if (!status) {
      return NextResponse.json({ error: "Missing required field: status" }, { status: 400 })
    }

    // Update the lead status
    const lead = await leadQualificationService.updateLeadStatus({
      leadId,
      status: status as any,
      notes,
    })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("Error updating lead status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
