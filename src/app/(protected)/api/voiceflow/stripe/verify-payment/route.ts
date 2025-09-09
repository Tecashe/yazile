
// // /api/voiceflow/stripe/verify-payment/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
// import { getIntegration, logApiCall } from '@/lib/integration-service'
// import { verifyStripePayment } from '@/lib/stripe-service'

// export async function POST(request: NextRequest) {
//   const startTime = Date.now()
//   let integrationId: string | null = null

//   try {
//     const body = await request.json()
//     const { tenantId, sessionId, paymentId } = body

//     // Validate request
//     const isValid = await validateVoiceflowRequest(request, body)
//     if (!isValid) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Get Stripe integration
//     const integration = await getIntegration(tenantId, 'STRIPE')
//     if (!integration) {
//       return NextResponse.json({ 
//         error: 'Stripe integration not configured' 
//       }, { status: 400 })
//     }

//     integrationId = integration.id

//     // Verify payment status
//     const paymentStatus = await verifyStripePayment(integration, paymentId)

//     // Log API call
//     await logApiCall({
//       tenantId,
//       integrationId,
//       sessionId,
//       endpoint: '/api/voiceflow/stripe/verify-payment',
//       method: 'POST',
//       requestBody: JSON.stringify(body),
//       statusCode: 200,
//       responseBody: JSON.stringify(paymentStatus),
//       duration: Date.now() - startTime
//     })

//     return NextResponse.json(paymentStatus)

//   } catch (error) {
//     console.error('Payment verification error:', error)
    
//     // await logApiCall({
//     //   tenantId: body?.tenantId,
//     //   integrationId,
//     //   sessionId: body?.sessionId,
//     //   endpoint: '/api/voiceflow/stripe/verify-payment',
//     //   method: 'POST',
//     //   requestBody: JSON.stringify(body),
//     //   statusCode: 500,
//     //   error: error instanceof Error ? error.message : 'Unknown error',
//     //   duration: Date.now() - startTime
//     // })

//     return NextResponse.json({ 
//       error: 'Failed to verify payment' 
//     }, { status: 500 })
//   }
// }

// /api/voiceflow/stripe/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { getIntegration, logApiCall } from '@/lib/integration-service'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null
  let body: any = null

  try {
    // Parse request body
    const contentType = request.headers.get('content-type')
    const rawBody = await request.text()
    
    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json({
        error: 'Request body is empty',
        details: 'Please provide a valid JSON body with tenantId, sessionId, and paymentId'
      }, { status: 400 })
    }

    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      return NextResponse.json({
        error: 'Invalid JSON format',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 400 })
    }

    const { tenantId, sessionId, paymentId } = body

    // Validate required fields
    if (!tenantId || !sessionId || !paymentId) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'tenantId, sessionId, and paymentId are required',
        received: { tenantId, sessionId, paymentId }
      }, { status: 400 })
    }

    // Validate that paymentId is a Payment Link ID
    if (!paymentId.startsWith('plink_')) {
      return NextResponse.json({
        error: 'Invalid payment ID format',
        details: 'Expected Payment Link ID starting with "plink_"',
        received: paymentId
      }, { status: 400 })
    }

    // Validate Voiceflow request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Stripe integration for tenant
    const integration = await getIntegration(tenantId, 'STRIPE')
    if (!integration) {
      return NextResponse.json({
        error: 'Stripe integration not configured',
        details: `No Stripe integration found for tenant: ${tenantId}`
      }, { status: 400 })
    }

    integrationId = integration.id

    // Initialize Stripe with tenant's credentials
    const stripe = new Stripe(integration.encryptedCredentials, {
      apiVersion: "2024-11-20.acacia"
    })

    // Verify the payment link exists
    let paymentLink: Stripe.PaymentLink
    try {
      paymentLink = await stripe.paymentLinks.retrieve(paymentId)
    } catch (stripeError: any) {
      return NextResponse.json({
        error: 'Payment link not found',
        details: stripeError.message || 'Invalid payment link ID',
        paymentId
      }, { status: 404 })
    }

    // Look for completed checkout sessions associated with this payment link
    // Search in the last 7 days to cover reasonable payment timeframes
    const sevenDaysAgo = Math.floor((Date.now() - (7 * 24 * 60 * 60 * 1000)) / 1000)
    
    let allSessions: Stripe.Checkout.Session[] = []
    let hasMore = true
    let startingAfter: string | undefined

    // Paginate through sessions to find completed payments
    while (hasMore && allSessions.length < 1000) { // Safety limit
      const sessionsResponse = await stripe.checkout.sessions.list({
        limit: 100,
        created: { gte: sevenDaysAgo },
        ...(startingAfter && { starting_after: startingAfter })
      })

      allSessions = [...allSessions, ...sessionsResponse.data]
      hasMore = sessionsResponse.has_more
      
      if (sessionsResponse.data.length > 0) {
        startingAfter = sessionsResponse.data[sessionsResponse.data.length - 1].id
      } else {
        hasMore = false
      }
    }

    // Find completed sessions that used this payment link
    const completedSessions = allSessions.filter(session => 
      session.payment_link === paymentId && 
      session.payment_status === 'paid' &&
      session.status === 'complete'
    )

    const paymentStatus = {
      paymentLinkId: paymentId,
      paymentLinkActive: paymentLink.active,
      paymentLinkUrl: paymentLink.url,
      totalSessions: allSessions.filter(s => s.payment_link === paymentId).length,
      completedPayments: completedSessions.length,
      verified: completedSessions.length > 0
    }

    if (completedSessions.length > 0) {
      // Payment completed
      const latestSession = completedSessions.sort((a, b) => b.created - a.created)[0]
      
      const successResponse = {
        success: true,
        status: 'completed',
        verified: true,
        paymentDetails: {
          paymentLinkId: paymentId,
          stripeSessionId: latestSession.id,
          amountPaid: latestSession.amount_total,
          currency: latestSession.currency,
          customerEmail: latestSession.customer_details?.email,
          customerName: latestSession.customer_details?.name,
          paymentDate: new Date(latestSession.created * 1000).toISOString(),
          paymentIntentId: latestSession.payment_intent
        },
        metadata: latestSession.metadata || {}
      }

      // Log successful verification
      await logApiCall({
        tenantId,
        integrationId,
        sessionId,
        endpoint: '/api/voiceflow/stripe/verify-payment',
        method: 'POST',
        requestBody: JSON.stringify(body),
        statusCode: 200,
        responseBody: JSON.stringify(successResponse),
        duration: Date.now() - startTime
      })

      return NextResponse.json(successResponse)

    } else {
      // Payment not completed yet
      const pendingResponse = {
        success: true,
        status: 'pending',
        verified: false,
        paymentDetails: {
          paymentLinkId: paymentId,
          paymentLinkActive: paymentLink.active,
          paymentLinkUrl: paymentLink.url,
          message: paymentLink.active 
            ? 'Payment link is active but no completed payments found' 
            : 'Payment link is inactive'
        }
      }

      // Log pending verification
      await logApiCall({
        tenantId,
        integrationId,
        sessionId,
        endpoint: '/api/voiceflow/stripe/verify-payment',
        method: 'POST',
        requestBody: JSON.stringify(body),
        statusCode: 200,
        responseBody: JSON.stringify(pendingResponse),
        duration: Date.now() - startTime
      })

      return NextResponse.json(pendingResponse)
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    
    const errorResponse = {
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error',
      paymentId: body?.paymentId
    }

    // Log error to database if we have tenant info
    if (body?.tenantId) {
      await logApiCall({
        tenantId: body.tenantId,
        integrationId,
        sessionId: body.sessionId,
        endpoint: '/api/voiceflow/stripe/verify-payment',
        method: 'POST',
        requestBody: JSON.stringify(body),
        statusCode: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      })
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}