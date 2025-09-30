
// import { NextRequest, NextResponse } from "next/server"
// import { onUserInfor } from "@/actions/user"
// import { getUserSubscription } from "@/lib/subscription"

// export async function GET(req: NextRequest) {
//   try {
//     // Get the current user
//     const user = await onUserInfor()
//     const userid = user.data?.id
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     // Get the user's subscription
//     const subscription = await getUserSubscription(userid||"7821064")
    
//     if (!subscription) {
//       return NextResponse.json({ 
//         success: true, 
//         subscription: { 
//           plan: "FREE",
//           status: "ACTIVE",
//           currentPeriodEnd: null,
//           cancelAtPeriodEnd: false,
//         } 
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       subscription: {
//         plan: subscription.plan,
//         status: subscription.status,
//         currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
//         cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
//         paymentMethod: subscription.paymentMethodLast4 
//           ? `${subscription.paymentMethodType} ending in ${subscription.paymentMethodLast4}`
//           : null,
//       }
//     })
//   } catch (error: any) {
//     console.error("Error fetching subscription status:", error)
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to fetch subscription status" },
//       { status: 500 },
//     )
//   }
// }

// import { NextRequest, NextResponse } from "next/server"
// import { onUserInfor } from "@/actions/user"
// import { getUserSubscription } from "@/lib/subscription"

// export async function GET(req: NextRequest) {
//   try {
//     // Get the current user - wrap in try-catch to handle redirect
//     let user;
//     let userid;
    
//     try {
//       user = await onUserInfor()
//       userid = user.data?.id
//     } catch (error: any) {
//       // If onUserInfor throws a redirect, treat as unauthenticated
//       if (error.digest?.includes('NEXT_REDIRECT')) {
//         return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
//       }
//       throw error; // Re-throw if it's not a redirect
//     }
    
//     // Check if user is authenticated
//     if (!user || !user.data || !userid) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     // Get the user's subscription - remove the hardcoded fallback ID
//     const subscription = await getUserSubscription(userid)
    
//     if (!subscription) {
//       return NextResponse.json({ 
//         success: true, 
//         subscription: { 
//           plan: "FREE",
//           status: "ACTIVE",
//           currentPeriodEnd: null,
//           cancelAtPeriodEnd: false,
//         } 
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       subscription: {
//         plan: subscription.plan,
//         status: subscription.status,
//         currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
//         cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
//         paymentMethod: subscription.paymentMethodLast4 
//           ? `${subscription.paymentMethodType} ending in ${subscription.paymentMethodLast4}`
//           : null,
//       }
//     })
//   } catch (error: any) {
//     console.error("Error fetching subscription status:", error)
    
//     // Handle specific redirect errors to avoid treating them as server errors
//     if (error.digest?.includes('NEXT_REDIRECT')) {
//       return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
//     }
    
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to fetch subscription status" },
//       { status: 500 },
//     )
//   }
// }

// app/api/subscriptions/status/route.ts
import { NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { getUserSubscription, getSubscriptionPlan, isSubscriptionActive } from "@/lib/pesapal-subs"
import type { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from "@/contexts/subscription-context"

export async function GET(req: NextRequest) {
  try {
    // Get the current user
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!user || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's subscription from database
    const dbSubscription = await getUserSubscription(userId)

    // If no subscription exists, return FREE plan
    if (!dbSubscription) {
      return NextResponse.json({
        success: true,
        subscription: {
          plan: "FREE" as SUBSCRIPTION_PLAN,
          status: "ACTIVE" as SUBSCRIPTION_STATUS,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          paymentMethod: null,
        },
      })
    }

    // Check if subscription is still active based on period end
    const isActive = isSubscriptionActive(dbSubscription)
    
    // If subscription has expired, automatically downgrade to FREE
    if (!isActive && dbSubscription.status === "ACTIVE") {
      // The subscription period has ended, mark as expired
      const subscriptionData = {
        plan: "FREE" as SUBSCRIPTION_PLAN,
        status: "CANCELED" as SUBSCRIPTION_STATUS,
        currentPeriodEnd: dbSubscription.stripeCurrentPeriodEnd 
          ? dbSubscription.stripeCurrentPeriodEnd 
          : null,
        cancelAtPeriodEnd: true,
        paymentMethod: dbSubscription.paymentMethodType 
          ? `${dbSubscription.paymentMethodType} •••• ${dbSubscription.paymentMethodLast4}`
          : null,
      }

      return NextResponse.json({
        success: true,
        subscription: subscriptionData,
      })
    }

    // Return active subscription details
    const subscriptionData = {
      plan: dbSubscription.plan as SUBSCRIPTION_PLAN,
      status: dbSubscription.status as SUBSCRIPTION_STATUS,
      currentPeriodEnd: dbSubscription.stripeCurrentPeriodEnd 
        ? dbSubscription.stripeCurrentPeriodEnd 
        : null,
      cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd || false,
      paymentMethod: dbSubscription.paymentMethodType 
        ? `${dbSubscription.paymentMethodType} •••• ${dbSubscription.paymentMethodLast4}`
        : null,
    }

    return NextResponse.json({
      success: true,
      subscription: subscriptionData,
    })
  } catch (error: any) {
    console.error("Error fetching subscription status:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch subscription status" },
      { status: 500 }
    )
  }
}