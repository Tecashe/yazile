// /lib/stripe-service.ts
import Stripe from 'stripe'
import { getDecryptedCredentials } from '@/lib/integration-service'

export async function createStripePaymentLink(
  integration: any,
  data: {
    amount: number
    currency: string
    productName: string
    userEmail?: string
    metadata?: Record<string, string>
  }
) {
  const credentials = await getDecryptedCredentials(integration)
  const stripe = new Stripe(credentials.secretKey, {
    apiVersion: '2024-11-20.acacia'
  })

  // Create a price for the payment link
  const price = await stripe.prices.create({
    unit_amount: data.amount,
    currency: data.currency,
    product_data: {
      name: data.productName
    }
  })

  // Create the payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price: price.id,
      quantity: 1
    }],
    metadata: data.metadata || {},
    customer_creation: 'always',
    allow_promotion_codes: true,
    billing_address_collection: 'auto'
  })

  return paymentLink
}

export async function verifyStripePayment(integration: any, paymentIntentId: string) {
  const credentials = await getDecryptedCredentials(integration)
  const stripe = new Stripe(credentials.secretKey, {
    apiVersion: '2024-11-20.acacia'
  })

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  
  return {
    success: paymentIntent.status === 'succeeded',
    status: paymentIntent.status,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    paymentMethod: paymentIntent.payment_method,
    customer: paymentIntent.customer,
    metadata: paymentIntent.metadata
  }
}