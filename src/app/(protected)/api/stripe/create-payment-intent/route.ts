import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { onUserInfor } from "@/actions/user"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await onUserInfor()
    const userid = user.data?.id
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

    // Calculate amount based on plan
    const amount = plan === "yearly" ? 9999 : 999 // $99.99 or $9.99 in cents

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        userId: userid ||"123",
        plan,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Return the client secret
    return new NextResponse(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to create payment intent" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
