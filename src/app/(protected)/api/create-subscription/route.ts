import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { currentUser } from "@clerk/nextjs/server"
import { updateSubscription } from "@/actions/user/queries"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get request data
    const { plan, paymentMethodId, cardholderName, country } = await req.json()

    // Determine price ID based on plan
    let priceId
    switch (plan) {
      case "pro":
        priceId = process.env.STRIPE_PRICE_PRO
        break
      case "team":
        priceId = process.env.STRIPE_PRICE_TEAM
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 })
    }

    // Check if customer already exists
    let customerId
    const existingCustomers = await stripe.customers.list({
      email: user.emailAddresses[0].emailAddress,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        name: cardholderName || `${user.firstName} ${user.lastName}`,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
        address: {
          country,
        },
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: user.id,
      },
    })

    // Get the client secret for the subscription
    const invoice = subscription.latest_invoice as any
    const clientSecret = invoice?.payment_intent?.client_secret

    // Update user subscription in database
    await updateSubscription(user.id, {
      customerId,
      plan: plan.toUpperCase(), // Convert to uppercase to match your enum
    })

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret,
    })
  } catch (error: any) {
    console.error("Error creating subscription:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create subscription" },
      { status: 500 },
    )
  }
}
