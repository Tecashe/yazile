import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { onCurrentUser, onUserInfor } from "@/actions/user"
import { updateSubscription } from "@/actions/user/queries"

export async function POST(req: NextRequest) {
  try {
    const details = await onCurrentUser()
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
    const { paymentIntentId, plan } = await req.json()

    // Retrieve the payment intent to verify it's successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return new NextResponse(JSON.stringify({ error: "Payment not successful" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Get or create a customer
    let customerId = paymentIntent.customer as string

    if (!customerId) {
      // Create a customer if one doesn't exist
      const customer = await stripe.customers.create({
        email: details.emailAddresses[0].emailAddress,
        name: `${details.firstName} ${details.lastName}`,
        metadata: {
          userId: userid ||"321",
        },
      })
      customerId = customer.id
    }

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: plan === "yearly" ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY,
        },
      ],
      metadata: {
        userId: userid ||"321",
      },
    })

    // Update user subscription in database
    await updateSubscription(userid ||"321", {
      customerId,
      plan: "PRO", // Update to match your plan name
    })

    // Return success
    return new NextResponse(JSON.stringify({ success: true, subscriptionId: subscription.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error updating subscription:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update subscription" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
