// /api/voiceflow/stripe/payment-link/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { getIntegration, logApiCall } from '@/lib/integration-service'
import { createStripePaymentLink } from '@/lib/stripe-service'
import { updateVoiceflowSession } from '@/lib/session-service'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null
  let sessionId: string | null = null

  try {
    const body = await request.json()
    const { 
      tenantId, 
      sessionId: vfSessionId, 
      amount, 
      currency = 'usd',
      productName,
      userEmail,
      userId,
      metadata = {}
    } = body

    sessionId = vfSessionId

    // Validate request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Stripe integration for tenant
    const integration = await getIntegration(tenantId, 'STRIPE')
    if (!integration) {
      return NextResponse.json({ 
        error: 'Stripe integration not configured' 
      }, { status: 400 })
    }

    integrationId = integration.id

    // Create payment link using tenant's Stripe credentials
    const paymentLink = await createStripePaymentLink(integration, {
      amount,
      currency,
      productName,
      userEmail,
      metadata: {
        ...metadata,
        tenantId,
        sessionId: vfSessionId,
        userId,
        source: 'voiceflow'
      }
    })

    // Update Voiceflow session with payment info
    await updateVoiceflowSession(vfSessionId, {
      variables: JSON.stringify({
        paymentLinkId: paymentLink.id,
        paymentUrl: paymentLink.url,
        amount,
        currency
      })
    })

    // Log successful API call
    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: '/api/voiceflow/stripe/payment-link',
      method: 'POST',
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify({ success: true, paymentUrl: paymentLink.url }),
      duration: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      paymentUrl: paymentLink.url,
      paymentId: paymentLink.id,
      // expiresAt: paymentLink.metadata.expires_at ? new Date(paymentLink.metadata.expiresAt * 1000).toISOString() : null
      expiresAt: paymentLink.metadata.expires_at
    })

  } catch (error) {
    console.error('Payment link creation error:', error)
    
    // Log failed API call
    // await logApiCall({
    //   tenantId: body?.tenantId,
    //   integrationId,
    //   sessionId,
    //   endpoint: '/api/voiceflow/stripe/payment-link',
    //   method: 'POST',
    //   requestBody: JSON.stringify(body),
    //   statusCode: 500,
    //   error: error instanceof Error ? error.message : 'Unknown error',
    //   duration: Date.now() - startTime
    // })

    return NextResponse.json({ 
      error: 'Failed to create payment link',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}