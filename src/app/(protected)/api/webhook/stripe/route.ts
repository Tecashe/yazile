
// app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from "next/server"
import { stripe, mapStripeStatusToEnum } from "@/lib/stripe"
import { upsertSubscription } from "@/lib/subscription"
import { headers } from "next/headers"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature") as string
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }
  
  try {
    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object
        
        // Get the customer to find the user
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if (!customer || customer.deleted) {
          return new NextResponse("Customer not found or deleted", { status: 400 })
        }
        
        // Get payment method details if available
        let paymentMethodId = null
        let paymentMethodType = null
        let paymentMethodLast4 = null
        
        if (subscription.default_payment_method) {
          try {
            const paymentMethod = await stripe.paymentMethods.retrieve(
              subscription.default_payment_method as string
            )
            
            paymentMethodId = paymentMethod.id
            paymentMethodType = paymentMethod.type
            paymentMethodLast4 = paymentMethod.card?.last4
          } catch (error) {
            console.error("Error retrieving payment method:", error)
          }
        }
        
        // Find the user by customer ID
        const userId = customer.metadata.userId
        
        if (!userId) {
          return new NextResponse("User ID not found in customer metadata", { status: 400 })
        }
        
        // Update subscription in database
        await upsertSubscription(userId, {
          customerId: subscription.customer,
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at,
          paymentMethodId,
          paymentMethodType,
          paymentMethodLast4,
        })
        
        break
        
      case "invoice.payment_succeeded":
        // Handle successful payment
        const invoice = event.data.object
        
        // If this is a subscription invoice, update the subscription
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          
          const customer = await stripe.customers.retrieve(subscription.customer as string)
          
          if (!customer || customer.deleted) {
            return new NextResponse("Customer not found or deleted", { status: 400 })
          }
          
          const userId = customer.metadata.userId
          
          if (!userId) {
            return new NextResponse("User ID not found in customer metadata", { status: 400 })
          }
          
          // Update subscription in database
          await upsertSubscription(userId, {
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            canceledAt: subscription.canceled_at,
          })
        }
        
        break
        
      case "invoice.payment_failed":
        // Handle failed payment
        const failedInvoice = event.data.object
        
        if (failedInvoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(failedInvoice.subscription as string)
          
          const customer = await stripe.customers.retrieve(subscription.customer as string)
          
          if (!customer || customer.deleted) {
            return new NextResponse("Customer not found or deleted", { status: 400 })
          }
          
          const userId = customer.metadata.userId
          
          if (!userId) {
            return new NextResponse("User ID not found in customer metadata", { status: 400 })
          }
          
          // Update subscription status in database
          await upsertSubscription(userId, {
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
            status: subscription.status, // Will be past_due or unpaid
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            canceledAt: subscription.canceled_at,
          })
        }
        
        break
        
      case "payment_method.attached":
      case "payment_method.updated":
      case "payment_method.detached":
        // Handle payment method changes
        const paymentMethod = event.data.object
        
        if (paymentMethod.customer) {
          const customer = await stripe.customers.retrieve(paymentMethod.customer as string)
          
          if (!customer || customer.deleted) {
            return new NextResponse("Customer not found or deleted", { status: 400 })
          }
          
          const userId = customer.metadata.userId
          
          if (!userId) {
            return new NextResponse("User ID not found in customer metadata", { status: 400 })
          }
          
          // Get the subscription for this customer
          const subscriptions = await stripe.subscriptions.list({
            customer: paymentMethod.customer as string,
            limit: 1,
          })
          
          if (subscriptions.data.length > 0) {
            const subscription = subscriptions.data[0]
            
            // Update payment method details in database
            if (event.type !== "payment_method.detached") {
              await upsertSubscription(userId, {
                customerId: subscription.customer,
                subscriptionId: subscription.id,
                priceId: subscription.items.data[0].price.id,
                status: subscription.status,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                canceledAt: subscription.canceled_at,
                paymentMethodId: paymentMethod.id,
                paymentMethodType: paymentMethod.type,
                paymentMethodLast4: paymentMethod.card?.last4,
              })
            }
          }
        }
        
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}

















