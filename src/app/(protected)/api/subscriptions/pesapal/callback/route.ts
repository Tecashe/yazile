// // app/api/subscriptions/pesapal/callback/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { pesapal } from "@/lib/pesapal-client"
// import { updateSubscriptionStatus } from "@/lib/subscription"
// import { client } from "@/lib/prisma" // Adjust to your database client

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams
//     const orderTrackingId = searchParams.get("OrderTrackingId")
//     const merchantReference = searchParams.get("OrderMerchantReference")

//     if (!orderTrackingId) {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`
//       )
//     }

//     // Get transaction status from Pesapal
//     const transactionStatus = await pesapal.getTransactionStatus(orderTrackingId)

//     // Find user by merchant reference (SUB-userId-timestamp)
//     const userId = merchantReference?.split("-")[1]

//     if (!userId) {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`
//       )
//     }

//     // Map Pesapal status codes to subscription status
//     let subscriptionStatus: "active" | "incomplete" | "past_due"
    
//     if (transactionStatus.payment_status_code === "1") {
//       // Payment completed
//       subscriptionStatus = "active"
//     } else if (transactionStatus.payment_status_code === "2") {
//       // Payment failed
//       subscriptionStatus = "incomplete"
//     } else if (transactionStatus.payment_status_code === "3") {
//       // Payment pending
//       subscriptionStatus = "past_due"
//     } else {
//       subscriptionStatus = "incomplete"
//     }

//     // Update subscription in database
//     await updateSubscriptionStatus(userId, subscriptionStatus, {
//       paymentMethodType: transactionStatus.payment_method,
//       paymentMethodLast4: transactionStatus.payment_account?.slice(-4),
//     })

//     // Redirect based on payment status
//     if (subscriptionStatus === "active") {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`
//       )
//     } else {
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`
//       )
//     }
//   } catch (error: any) {
//     console.error("Error processing Pesapal callback:", error)
//     return NextResponse.redirect(
//       `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`
//     )
//   }
// }


// app/api/subscriptions/pesapal/callback/route.ts
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
      return NextResponse.redirect(
        `https://yazzil.com/dashboard?payment=failed&reason=missing_tracking_id`
      )
    }

    // Get transaction status from Pesapal
    const transactionStatus = await pesapal.getTransactionStatus(orderTrackingId)

    // Find user by merchant reference (SUB-userId-timestamp)
    const userId = merchantReference?.split("-")[1]

    if (!userId) {
      return NextResponse.redirect(
        `https://yazzil.com/dashboard?payment=failed&reason=invalid_reference`
      )
    }

    // Map Pesapal status codes to subscription status
    let subscriptionStatus: SUBSCRIPTION_STATUS
    let shouldRedirectToSuccess = false
    
    // Pesapal status codes:
    // 0 = Invalid
    // 1 = Completed
    // 2 = Failed
    // 3 = Reversed
    switch (transactionStatus.payment_status_code) {
      case "1": // Payment completed
        subscriptionStatus = "ACTIVE"
        shouldRedirectToSuccess = true
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

    // Calculate subscription period (30 days from now)
    const now = Math.floor(Date.now() / 1000)
    const periodEnd = now + (30 * 24 * 60 * 60) // 30 days

    // Update subscription in database
    await updateSubscriptionStatus(userId, subscriptionStatus, {
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      paymentMethodType: transactionStatus.payment_method,
      paymentMethodLast4: transactionStatus.payment_account?.slice(-4),
      orderTrackingId: orderTrackingId,
    })

    console.log("Pesapal payment callback processed:", {
      userId,
      orderTrackingId,
      status: subscriptionStatus,
      paymentStatusCode: transactionStatus.payment_status_code,
    })

    // Redirect based on payment status
    if (shouldRedirectToSuccess) {
      return NextResponse.redirect(
        `https://yazzil.com/dashboard?payment=success`
      )
    } else {
      return NextResponse.redirect(
        `https://yazzil.com/dashboard?payment=failed&reason=payment_${transactionStatus.payment_status_code}`
      )
    }
  } catch (error: any) {
    console.error("Error processing Pesapal callback:", error)
    return NextResponse.redirect(
      `https://yazzil.com/dashboard?payment=error&reason=processing_failed`
    )
  }
}