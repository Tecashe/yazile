//lib/webhook-handlers/stripe.ts
import Stripe from 'stripe'
import { client } from '@/lib/prisma'
import { updateVoiceflowSession } from '@/lib/session-service'

// Helper function to safely extract metadata
function extractMetadata(obj: any): { tenantId?: string; sessionId?: string } {
  if (obj && typeof obj === 'object' && 'metadata' in obj && obj.metadata) {
    return {
      tenantId: obj.metadata.tenantId,
      sessionId: obj.metadata.sessionId
    }
  }
  return {}
}

export async function handleStripeWebhook(body: string, signature: string) {
  try {
    // Parse the webhook event
    const event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Extract tenant ID from metadata safely
    const { tenantId, sessionId } = extractMetadata(event.data.object)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, tenantId, sessionId)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, tenantId, sessionId)
        break
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, tenantId, sessionId)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, tenantId, sessionId)
        break
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }

    return {
      success: true,
      tenantId,
      eventType: event.type
    }
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: null,
      eventType: 'unknown'
    }
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent, tenantId?: string, sessionId?: string) {
  if (sessionId) {
    // Update Voiceflow session with payment success
    await updateVoiceflowSession(sessionId, {
      variables: JSON.stringify({
        paymentStatus: 'succeeded',
        paymentIntentId: paymentIntent.id,
        amountPaid: paymentIntent.amount,
        currency: paymentIntent.currency
      }),
      lastActiveAt: new Date()
    })

    // You can also trigger a Voiceflow event here to continue the conversation
    // await triggerVoiceflowEvent(sessionId, 'payment_succeeded', { paymentIntent })
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, tenantId?: string, sessionId?: string) {
  if (sessionId) {
    await updateVoiceflowSession(sessionId, {
      variables: JSON.stringify({
        paymentStatus: 'failed',
        paymentIntentId: paymentIntent.id,
        failureReason: paymentIntent.last_payment_error?.message
      }),
      lastActiveAt: new Date()
    })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, tenantId?: string, vfSessionId?: string) {
  if (vfSessionId) {
    await updateVoiceflowSession(vfSessionId, {
      variables: JSON.stringify({
        checkoutStatus: 'completed',
        checkoutSessionId: session.id,
        customerId: session.customer,
        subscriptionId: session.subscription
      }),
      lastActiveAt: new Date()
    })
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, tenantId?: string, sessionId?: string) {
  // Handle recurring subscription payments
  console.log('Invoice payment succeeded:', invoice.id)
}