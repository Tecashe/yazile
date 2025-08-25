
// /api/voiceflow/stripe/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { getIntegration, logApiCall } from '@/lib/integration-service'
import { verifyStripePayment } from '@/lib/stripe-service'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null

  try {
    const body = await request.json()
    const { tenantId, sessionId, paymentId } = body

    // Validate request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Stripe integration
    const integration = await getIntegration(tenantId, 'STRIPE')
    if (!integration) {
      return NextResponse.json({ 
        error: 'Stripe integration not configured' 
      }, { status: 400 })
    }

    integrationId = integration.id

    // Verify payment status
    const paymentStatus = await verifyStripePayment(integration, paymentId)

    // Log API call
    await logApiCall({
      tenantId,
      integrationId,
      sessionId,
      endpoint: '/api/voiceflow/stripe/verify-payment',
      method: 'POST',
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(paymentStatus),
      duration: Date.now() - startTime
    })

    return NextResponse.json(paymentStatus)

  } catch (error) {
    console.error('Payment verification error:', error)
    
    // await logApiCall({
    //   tenantId: body?.tenantId,
    //   integrationId,
    //   sessionId: body?.sessionId,
    //   endpoint: '/api/voiceflow/stripe/verify-payment',
    //   method: 'POST',
    //   requestBody: JSON.stringify(body),
    //   statusCode: 500,
    //   error: error instanceof Error ? error.message : 'Unknown error',
    //   duration: Date.now() - startTime
    // })

    return NextResponse.json({ 
      error: 'Failed to verify payment' 
    }, { status: 500 })
  }
}
