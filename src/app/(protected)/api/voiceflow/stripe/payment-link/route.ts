// /api/voiceflow/stripe/payment-link/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
// import { getIntegration, logApiCall } from '@/lib/integration-service'
// import { createStripePaymentLink } from '@/lib/stripe-service'
// import { updateVoiceflowSession } from '@/lib/session-service'

// export async function POST(request: NextRequest) {
//   const startTime = Date.now()
//   let integrationId: string | null = null
//   let sessionId: string | null = null
//   let body: any = null // Declare body outside try block

//   try {
//     // Debug logging
//     const contentType = request.headers.get('content-type')
//     console.log('Content-Type:', contentType)
    
//     // Check if request has body
//     const clonedRequest = request.clone()
//     const rawBody = await clonedRequest.text()
//     console.log('Raw request body:', rawBody)
//     console.log('Raw body length:', rawBody.length)
    
//     // Handle empty body
//     if (!rawBody || rawBody.trim() === '') {
//       return NextResponse.json({
//         error: 'Request body is empty',
//         details: 'Please provide a valid JSON body with required fields'
//       }, { status: 400 })
//     }

//     // Parse JSON
//     try {
//       body = JSON.parse(rawBody)
//     } catch (parseError) {
//       console.error('JSON parse error:', parseError)
//       return NextResponse.json({
//         error: 'Invalid JSON format',
//         details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
//       }, { status: 400 })
//     }

//     console.log('Parsed body:', body)

//     const {
//       tenantId,
//       sessionId: vfSessionId,
//       amount,
//       currency = 'usd',
//       productName,
//       userEmail,
//       userId,
//       metadata = {}
//     } = body

//     // Validate required fields
//     if (!tenantId || !vfSessionId || !amount || !productName) {
//       return NextResponse.json({
//         error: 'Missing required fields',
//         details: 'tenantId, sessionId, amount, and productName are required',
//         received: { tenantId, sessionId: vfSessionId, amount, productName }
//       }, { status: 400 })
//     }

//     sessionId = vfSessionId

//     // Validate request
//     const isValid = await validateVoiceflowRequest(request, body)
//     if (!isValid) {
//       return NextResponse.json({ error: 'You are Unauthorized' }, { status: 401 })
//     }
    
//     // Get Stripe integration for tenant
//     const integration = await getIntegration(tenantId, 'STRIPE')
//     if (!integration) {
//       return NextResponse.json({
//         error: 'Stripe integration not configured'
//       }, { status: 400 })
//     }

//     integrationId = integration.id

//     // Create payment link using tenant's Stripe credentials
//     const paymentLink = await createStripePaymentLink(integration, {
//       amount,
//       currency,
//       productName,
//       userEmail,
//       metadata: {
//         ...metadata,
//         tenantId,
//         sessionId: vfSessionId,
//         userId,
//         source: 'voiceflow'
//       }
//     })



//     // Update Voiceflow session with payment info
//     await updateVoiceflowSession(vfSessionId, {
//       tenantId, // Pass tenantId for upsert create case
//       userId,   // Pass userId for upsert create case
//       platform: 'voiceflow', // Specify platform
//       variables: JSON.stringify({
//         paymentLinkId: paymentLink.id,
//         paymentUrl: paymentLink.url,
//         amount,
//         currency
//       })
//     })

//     // // Update Voiceflow session with payment info
//     // await updateVoiceflowSession(vfSessionId, {
//     //   variables: JSON.stringify({
//     //     paymentLinkId: paymentLink.id,
//     //     paymentUrl: paymentLink.url,
//     //     amount,
//     //     currency
//     //   })
//     // })

//     // Log successful API call
//     await logApiCall({
//       tenantId,
//       integrationId,
//       sessionId: vfSessionId,
//       endpoint: '/api/voiceflow/stripe/payment-link',
//       method: 'POST',
//       requestBody: JSON.stringify(body),
//       statusCode: 200,
//       responseBody: JSON.stringify({ success: true, paymentUrl: paymentLink.url }),
//       duration: Date.now() - startTime
//     })

//     return NextResponse.json({
//       success: true,
//       paymentUrl: paymentLink.url,
//       paymentId: paymentLink.id,
//       expiresAt: paymentLink.metadata.expires_at
//     })

//   } catch (error) {
//     console.error('Payment link creation error:', error)
    
//     // Only log to database if we have basic info
//     if (body?.tenantId) {
//       await logApiCall({
//         tenantId: body?.tenantId,
//         integrationId,
//         sessionId,
//         endpoint: '/api/voiceflow/stripe/payment-link',
//         method: 'POST',
//         requestBody: body ? JSON.stringify(body) : undefined,
//         statusCode: 500,
//         error: error instanceof Error ? error.message : 'Unknown error',
//         duration: Date.now() - startTime
//       })
//     }

//     return NextResponse.json({
//       error: 'Failed to create payment link',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 })
//   }
// }



import { NextRequest, NextResponse } from 'next/server'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { getIntegration, logApiCall } from '@/lib/integration-service'
import { createStripePaymentLink } from '@/lib/stripe-service'
import { client } from '@/lib/prisma'


export async function POST(request: NextRequest) {

  let sessionId: string | null = null
  let body: any = null // Declare body outside try block
  const startTime = Date.now()
  let integrationId: string | null = null
  let sessionRecord: any = null

  try {
    const body = await request.json()
    
    const {
      tenantId,
      userId, // Changed from sessionId to userId
      amount,
      currency = 'usd',
      productName,
      userEmail,
      metadata = {}
    } = body

    // Validate required fields
    if (!tenantId || !userId || !amount || !productName) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'tenantId, userId, amount, and productName are required'
      }, { status: 400 })
    }

    // Find the session using userId (which equals sessionId in our case)
    sessionRecord = await client.voiceflowSession.findUnique({
      where: { sessionId: userId } // sessionId matches userId
    })

    if (!sessionRecord) {
      return NextResponse.json({
        error: 'Session not found',
        details: 'No active Voiceflow session found for this user'
      }, { status: 404 })
    }

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

    // Create payment link
    const paymentLink = await createStripePaymentLink(integration, {
      amount,
      currency,
      productName,
      userEmail,
      metadata: {
        ...metadata,
        tenantId,
        sessionId: userId, // Use userId as sessionId
        userId,
        source: 'voiceflow'
      }
    })

    // Update session with payment info
    await client.voiceflowSession.update({
      where: { sessionId: userId },
      data: {
        variables: JSON.stringify({
          ...JSON.parse(sessionRecord.variables || '{}'),
          paymentLinkId: paymentLink.id,
          paymentUrl: paymentLink.url,
          amount,
          currency
        }),
        lastActiveAt: new Date()
      }
    })

    // Log successful API call
    await logApiCall({
      tenantId,
      integrationId,
      sessionId: userId,
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
      expiresAt: paymentLink.metadata.expires_at
    })

  } catch (error) {

     console.error('Payment link creation error:', error)
    
    // Only log to database if we have basic info
    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: '/api/voiceflow/stripe/payment-link',
        method: 'POST',
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      })
    }

    return NextResponse.json({
      error: 'Failed to create payment link',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }


    // ... error handling
  
}