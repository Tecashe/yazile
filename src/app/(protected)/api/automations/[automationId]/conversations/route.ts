import { type NextRequest, NextResponse } from "next/server"
import { ChatDatabase } from "@/lib/db-operations"
import { onUserInfor } from "@/actions/user"

export async function GET(request: NextRequest, { params }: { params: { automationId: string } }) {
  try {
    const userr =  await onUserInfor()
        const  userId  = userr.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversations = await ChatDatabase.getConversations(params.automationId, userId)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
