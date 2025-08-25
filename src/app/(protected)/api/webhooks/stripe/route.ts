



// /api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { handleStripeWebhook } from '@/lib/webhook-handler/stripe'
import { logWebhook } from '@/lib/webhook-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Parse webhook and handle
    const result = await handleStripeWebhook(body, signature)
    
    // Log webhook
    await logWebhook({
      tenantId: result.tenantId||"undefinedd",
      source: 'STRIPE',
      eventType: result.eventType,
      payload: body,
      signature,
      processed: result.success,
      error: result.error
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}