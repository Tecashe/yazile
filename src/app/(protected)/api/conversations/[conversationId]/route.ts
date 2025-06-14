import { type NextRequest, NextResponse } from "next/server"
import { ChatDatabase } from "@/lib/db-operations"
import { onUserInfor } from "@/actions/user"

export async function DELETE(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const userr =  await onUserInfor()
        const  userId  = userr.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ChatDatabase.deleteConversation(params.conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
  }
}
