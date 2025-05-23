import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateSubscription } from "@/actions/user/queries"


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }


  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
    
      const customerId = session.customer
      const userId = session.metadata?.userId 

      if (userId && customerId) {
        try {

          await updateSubscription(userId, {
            customerId: customerId as string,
            plan: "PRO", 
          })
        } catch (error) {
          console.error("Error updating subscription:", error)
          return new NextResponse("Error updating subscription", { status: 500 })
        }
      }
      break

    case "invoice.payment_succeeded":
      // Handle successful subscription payment
      const invoice = event.data.object
      // Update subscription status if needed
      break

    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object
      // Handle subscription updates or cancellations
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new NextResponse(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
