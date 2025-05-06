import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { n8nService } from "@/services/n8n-service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connectionId = params.id
    const workflows = await n8nService.getWorkflowConfigs(connectionId)

    return NextResponse.json({ workflows })
  } catch (error) {
    console.error("Error fetching n8n workflows:", error)
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

    const connectionId = params.id
    await n8nService.deleteConnection(connectionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting n8n connection:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
