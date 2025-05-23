
import { NextRequest, NextResponse } from "next/server"
import { onCurrentUser } from "@/actions/user"
import { getUserSubscription, createBillingPortalSession } from "@/lib/subscription"

export async function GET(req: NextRequest) {
  try {
    // Get the current user
    const user = await onCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's subscription
    const subscription = await getUserSubscription(user.id)
    
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







