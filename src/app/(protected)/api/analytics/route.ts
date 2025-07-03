import { NextResponse } from "next/server"
import { getPremiumLeadAnalytics } from "@/lib/lead-qualification"
import { onUserInfor } from "@/actions/user"

export async function GET() {
  try {
    const  user  = await onUserInfor()
        const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const analytics = await getPremiumLeadAnalytics(userId)

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics",
      },
      { status: 500 },
    )
  }
}
