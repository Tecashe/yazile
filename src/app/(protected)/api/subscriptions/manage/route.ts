
import { NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { getUserSubscription, createBillingPortalSession } from "@/lib/subscription"

export async function GET(req: NextRequest) {
  try {
    // Get the current user
    const user = await onUserInfor()
    const userid = user.data?.id
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's subscription
    const subscription = await getUserSubscription(userid||"7654321")
    
    if (!subscription || !subscription.customerId) {
      return NextResponse.json(
        { success: false, error: "No active subscription found" },
        { status: 404 }
      )
    }

    // Create a billing portal session
    const url = await createBillingPortalSession(subscription.customerId)

    return NextResponse.json({ success: true, url })
  } catch (error: any) {
    console.error("Error creating billing portal session:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create billing portal session" },
      { status: 500 },
    )
  }
}







