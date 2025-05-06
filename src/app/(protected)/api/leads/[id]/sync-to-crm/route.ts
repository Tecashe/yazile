import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { crmService } from "@/services/crm-service"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = params.id
    const { integrationId } = await req.json()

    if (!integrationId) {
      return NextResponse.json({ error: "Missing required field: integrationId" }, { status: 400 })
    }

    // Sync the lead to the CRM
    const success = await crmService.syncLead({
      leadId,
      integrationId,
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to sync lead to CRM" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error syncing lead to CRM:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
