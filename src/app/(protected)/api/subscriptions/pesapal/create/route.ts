// // app/api/subscriptions/pesapal/create/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { pesapal, PLAN_CONFIGS } from "@/lib/pesapal-client"
// import { onCurrentUser, onUserInfor } from "@/actions/user"
// import { upsertSubscription } from "@/lib/subscription"

// export async function POST(req: NextRequest) {
//   try {
//     // Get the current user
//     const details = await onCurrentUser()
//     const user = await onUserInfor()
//     const userId = user.data?.id

//     if (!user || !details) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     // Get request data
//     const { plan, phone, countryCode } = await req.json()

//     // Validate plan
//     const planKey = plan.toUpperCase() as keyof typeof PLAN_CONFIGS
//     const planConfig = PLAN_CONFIGS[planKey]

//     if (!planConfig || planConfig.price === 0) {
//       return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 })
//     }

//     // Create Pesapal order
//     const orderResponse = await pesapal.createSubscriptionOrder({
//       userId: userId || "unknown",
//       email: details.emailAddresses[0].emailAddress,
//       firstName: details.firstName || "",
//       lastName: details.lastName || "",
//       phone: phone || undefined,
//       plan: planKey,
//       countryCode: countryCode || "KE",
//     })

//     // Calculate subscription period (30 days for monthly)
//     const currentPeriodStart = Math.floor(Date.now() / 1000)
//     const currentPeriodEnd = currentPeriodStart + 30 * 24 * 60 * 60 // 30 days

//     // Store pending subscription in database
//     await upsertSubscription(userId || "unknown", {
//       subscriptionId: orderResponse.merchant_reference,
//       orderTrackingId: orderResponse.order_tracking_id,
//       priceId: plan,
//       status: "incomplete", // Will be updated via IPN callback
//       currentPeriodStart,
//       currentPeriodEnd,
//       cancelAtPeriodEnd: false,
//       canceledAt: null,
//       paymentProvider: "pesapal",
//     })

//     return NextResponse.json({
//       success: true,
//       orderTrackingId: orderResponse.order_tracking_id,
//       merchantReference: orderResponse.merchant_reference,
//       redirectUrl: orderResponse.redirect_url,
//     })
//   } catch (error: any) {
//     console.error("Error creating Pesapal order:", error)
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to create subscription" },
//       { status: 500 }
//     )
//   }
// }

// app/api/subscriptions/pesapal/create/route.ts
import { NextRequest, NextResponse } from "next/server"
import { pesapal, PLAN_CONFIGS } from "@/lib/pesapal-client"
import { onCurrentUser, onUserInfor } from "@/actions/user"
import { upsertSubscription, createPesapalSubscriptionData, PESAPAL_PLAN_IDS } from "@/lib/pesapal-subs"
import type { SUBSCRIPTION_PLAN } from "@/contexts/subscription-context"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const details = await onCurrentUser()
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!user || !details) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get request data
    const { plan, phone, countryCode } = await req.json()

    // Validate plan
    const planUpper = plan.toUpperCase()
    if (!["PRO", "ENTERPRISE"].includes(planUpper)) {
      return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 })
    }

    // Map plan to Pesapal plan ID
    const pesapalPlanId = planUpper === "PRO" ? PESAPAL_PLAN_IDS.PRO : PESAPAL_PLAN_IDS.ENTERPRISE

    // Create Pesapal order
    const orderResponse = await pesapal.createSubscriptionOrder({
      userId: userId || "unknown",
      email: details.emailAddresses[0].emailAddress,
      firstName: details.firstName || "",
      lastName: details.lastName || "",
      phone: phone || undefined,
      plan: planUpper as keyof typeof PLAN_CONFIGS,
      countryCode: countryCode || "KE",
    })

    // Create subscription data using helper function
    const subscriptionData = createPesapalSubscriptionData(
      orderResponse.merchant_reference,
      orderResponse.order_tracking_id,
      pesapalPlanId,
      "INCOMPLETE", // Payment not yet completed
      1 // 1 month subscription
    )

    // Store pending subscription in database
    await upsertSubscription(userId || "unknown", subscriptionData)

    return NextResponse.json({
      success: true,
      orderTrackingId: orderResponse.order_tracking_id,
      merchantReference: orderResponse.merchant_reference,
      redirectUrl: orderResponse.redirect_url,
    })
  } catch (error: any) {
    console.error("Error creating Pesapal order:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create subscription" },
      { status: 500 }
    )
  }
}