import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { n8nService } from "@/services/n8n-service"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
     const user = await onUserInfor()
        const  userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workflowId = params.id
    await n8nService.deleteWorkflow(workflowId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting n8n workflow:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
