// app/api/subscriptions/cancel/route.ts
import { NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { cancelSubscription } from "@/lib/subscription"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Cancel the subscription in database
    await cancelSubscription(userId || "unknown")

    return NextResponse.json({ 
      success: true, 
      message: "Subscription canceled successfully" 
    })
  } catch (error: any) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    )
  }
}