
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getUserSubscription } from "@/lib/subscription"

export async function GET(req: NextRequest) {
  try {
    // Get the current user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's subscription
    const subscription = await getUserSubscription(user.id)
    
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






