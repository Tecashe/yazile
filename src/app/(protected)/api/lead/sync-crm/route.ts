import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { manualSyncToCRM } from "@/lib/lead-qualification"

export async function POST(request: NextRequest) {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { leadIds } = await request.json()

    if (!leadIds || !Array.isArray(leadIds)) {
      return NextResponse.json({ error: "Invalid lead IDs" }, { status: 400 })
    }

    const result = await manualSyncToCRM(leadIds, userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error syncing to CRM:", error)
    return NextResponse.json(
      {
        success: false,
        error: "CRM sync failed",
      },
      { status: 500 },
    )
  }
}
