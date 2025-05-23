import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { onCurrentUser } from "@/actions/user"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await onCurrentUser()
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Parse the request body
    const { clientSecret, plan } = await req.json()

    // Extract the payment intent ID from the client secret
    const paymentIntentId = clientSecret.split("_secret_")[0]

    // Calculate amount based on plan
    const amount = plan === "yearly" ? 9999 : 999 // $99.99 or $9.99 in cents

    // Update the payment intent
    await stripe.paymentIntents.update(paymentIntentId, {
      amount,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    // Return success
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error updating payment intent:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update payment intent" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
