// // app/api/subscriptions/pesapal/ipn/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { pesapal } from "@/lib/pesapal-client"
// import { updateSubscriptionStatus } from "@/lib/subscription"

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams
//     const orderTrackingId = searchParams.get("OrderTrackingId")
//     const merchantReference = searchParams.get("OrderMerchantReference")

//     if (!orderTrackingId) {
//       return NextResponse.json({ error: "Missing OrderTrackingId" }, { status: 400 })
//     }

//     // Get transaction status from Pesapal
//     const transactionStatus = await pesapal.getTransactionStatus(orderTrackingId)

//     // Extract userId from merchant reference (SUB-userId-timestamp)
//     const userId = merchantReference?.split("-")[1]

//     if (!userId) {
//       return NextResponse.json({ error: "Invalid merchant reference" }, { status: 400 })
//     }

//     // Map Pesapal status codes to subscription status
//     let subscriptionStatus: "active" | "incomplete" | "past_due" | "canceled"
    
//     switch (transactionStatus.payment_status_code) {
//       case "1": // Completed
//         subscriptionStatus = "active"
//         break
//       case "2": // Failed
//         subscriptionStatus = "incomplete"
//         break
//       case "3": // Pending
//         subscriptionStatus = "past_due"
//         break
//       default:
//         subscriptionStatus = "incomplete"
//     }

//     // Update subscription in database
//     await updateSubscriptionStatus(userId, subscriptionStatus, {
//       paymentMethodType: transactionStatus.payment_method,
//       paymentMethodLast4: transactionStatus.payment_account?.slice(-4),
//     })

//     // Log the IPN notification
//     console.log("Pesapal IPN received:", {
//       orderTrackingId,
//       merchantReference,
//       status: transactionStatus.payment_status_code,
//       description: transactionStatus.payment_status_description,
//     })

//     return NextResponse.json({ success: true, message: "IPN processed successfully" })
//   } catch (error: any) {
//     console.error("Error processing Pesapal IPN:", error)
//     return NextResponse.json(
//       { error: error.message || "Failed to process IPN" },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(req: NextRequest) {
//   // Handle POST IPN notifications the same way
//   return GET(req)
// }

// app/api/subscriptions/pesapal/ipn/route.ts
import { NextRequest, NextResponse } from "next/server"
import { pesapal } from "@/lib/pesapal-client"
import { updateSubscriptionStatus } from "@/lib/pesapal-subs"
import type { SUBSCRIPTION_STATUS } from "@/contexts/subscription-context"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const orderTrackingId = searchParams.get("OrderTrackingId")
    const merchantReference = searchParams.get("OrderMerchantReference")

    if (!orderTrackingId) {
      console.error("IPN: Missing OrderTrackingId")
      return NextResponse.json({ error: "Missing OrderTrackingId" }, { status: 400 })
    }

    // Get transaction status from Pesapal
    const transactionStatus = await pesapal.getTransactionStatus(orderTrackingId)

    // Extract userId from merchant reference (SUB-userId-timestamp)
    const userId = merchantReference?.split("-")[1]

    if (!userId) {
      console.error("IPN: Invalid merchant reference format:", merchantReference)
      return NextResponse.json({ error: "Invalid merchant reference" }, { status: 400 })
    }

    // Map Pesapal status codes to subscription status
    let subscriptionStatus: SUBSCRIPTION_STATUS
    
    // Pesapal status codes:
    // 0 = Invalid
    // 1 = Completed
    // 2 = Failed
    // 3 = Reversed
    switch (transactionStatus.payment_status_code) {
      case "1": // Payment completed
        subscriptionStatus = "ACTIVE"
        break
      case "2": // Payment failed
        subscriptionStatus = "UNPAID"
        break
      case "3": // Payment reversed/pending
        subscriptionStatus = "PAST_DUE"
        break
      default:
        subscriptionStatus = "INCOMPLETE"
    }

    // Calculate subscription period (30 days from now for successful payments)
    const now = Math.floor(Date.now() / 1000)
    const periodEnd = subscriptionStatus === "ACTIVE" 
      ? now + (30 * 24 * 60 * 60) // 30 days
      : now // If not active, don't extend period

    // Update subscription in database
    await updateSubscriptionStatus(userId, subscriptionStatus, {
      currentPeriodStart: subscriptionStatus === "ACTIVE" ? now : undefined,
      currentPeriodEnd: subscriptionStatus === "ACTIVE" ? periodEnd : undefined,
      paymentMethodType: transactionStatus.payment_method,
      paymentMethodLast4: transactionStatus.payment_account?.slice(-4),
      orderTrackingId: orderTrackingId,
    })

    // Log the IPN notification
    console.log("Pesapal IPN processed successfully:", {
      orderTrackingId,
      merchantReference,
      userId,
      status: subscriptionStatus,
      paymentStatusCode: transactionStatus.payment_status_code,
      paymentMethod: transactionStatus.payment_method,
      amount: transactionStatus.amount,
      description: transactionStatus.payment_status_description,
    })

    return NextResponse.json({ 
      success: true, 
      message: "IPN processed successfully",
      status: subscriptionStatus 
    })
  } catch (error: any) {
    console.error("Error processing Pesapal IPN:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process IPN" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  // Pesapal can send IPN via POST or GET, handle both the same way
  return GET(req)
}