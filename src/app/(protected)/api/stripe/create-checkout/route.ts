import { type NextRequest, NextResponse } from "next/server"
import { createCheckoutSession, SUBSCRIPTION_PRICES } from "@/lib/stripe"
import { onUserInfor } from "@/actions/user"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await onUserInfor()
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Parse the request body
    const { plan } = await req.json()

    // Determine the price ID based on the plan
    const priceId = plan === "yearly" ? SUBSCRIPTION_PRICES.YEARLY : SUBSCRIPTION_PRICES.MONTHLY

    // Create a checkout session
    const { sessionId } = await createCheckoutSession({
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    })

    // Return the session ID
    return new NextResponse(JSON.stringify({ sessionId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to create checkout session" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
