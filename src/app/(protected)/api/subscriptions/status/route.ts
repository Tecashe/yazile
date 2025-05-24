
import { NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { getUserSubscription } from "@/lib/subscription"

export async function GET(req: NextRequest) {
  try {
    // Get the current user
    const user = await onUserInfor()
    const userid = user.data?.id
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's subscription
    const subscription = await getUserSubscription(userid||"7821064")
    
    if (!subscription) {
      return NextResponse.json({ 
        success: true, 
        subscription: { 
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        } 
      })
    }

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        paymentMethod: subscription.paymentMethodLast4 
          ? `${subscription.paymentMethodType} ending in ${subscription.paymentMethodLast4}`
          : null,
      }
    })
  } catch (error: any) {
    console.error("Error fetching subscription status:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch subscription status" },
      { status: 500 },
    )
  }
}






