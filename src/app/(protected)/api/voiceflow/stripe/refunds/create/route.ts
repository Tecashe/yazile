import { type NextRequest, NextResponse } from "next/server"
import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
import { getIntegration } from "@/lib/integration-service"
import { decrypt } from "@/lib/encrypt"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate Voiceflow request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tenantId, paymentIntentId, amount, reason } = body

    if (!tenantId || !paymentIntentId || !amount) {
      return NextResponse.json(
        {
          error: "Missing required fields: tenantId, paymentIntentId, amount",
        },
        { status: 400 },
      )
    }

    // Get Stripe integration
    const integration = await getIntegration(tenantId, "STRIPE")
    if (!integration) {
      return NextResponse.json(
        {
          error: "Stripe integration not found",
        },
        { status: 404 },
      )
    }

    // Decrypt credentials
    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))

    // Create refund using Stripe API
    const stripe = require("stripe")(credentials.secretKey)

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: reason || "requested_by_customer",
      metadata: {
        tenant_id: tenantId,
        refund_source: "voiceflow_dm",
      },
    })

    // Log API call
    await client.apiLog.create({
      data: {
        tenantId,
        endpoint: "/api/voiceflow/stripe/refunds/create",
        method: "POST",
        requestBody: JSON.stringify({ paymentIntentId, amount, reason }),
        responseBody: JSON.stringify({ refundId: refund.id, status: refund.status }),
        statusCode: 200,
        duration: 0,
        // success: true,
      },
    })

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        created: refund.created,
      },
    })
  } catch (error: any) {
    console.error("Stripe refund creation error:", error)

    // Log error
    try {
      const body = await request.json()
      await client.apiLog.create({
        data: {
          tenantId: body.tenantId || "unknown",
          endpoint: "/api/voiceflow/stripe/refunds/create",
          method: "POST",
          requestBody: JSON.stringify(body),
          responseBody: JSON.stringify({ error: error.message }),
          statusCode: 500,
          duration: 0,
        //   success: false,
        },
      })
    } catch (logError) {
      console.error("Failed to log API error:", logError)
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create refund",
      },
      { status: 500 },
    )
  }
}

/*
VOICEFLOW API BLOCK SETUP:
1. Create an API Block in Voiceflow
2. Set Method: POST
3. Set URL: {your_domain}/api/voiceflow/stripe/refunds/create
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "paymentIntentId": "{payment_intent_id}",
     "amount": "{refund_amount}",
     "reason": "requested_by_customer"
   }
6. Response Mapping:
   - success: {response.success}
   - refund_id: {response.refund.id}
   - refund_status: {response.refund.status}
   - refund_amount: {response.refund.amount}
*/
