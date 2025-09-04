import { type NextRequest, NextResponse } from "next/server"
import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
import { getIntegration, logApiCall } from "@/lib/integration-service"
import { decrypt } from "@/lib/encrypt"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null
  let sessionId: string | null = null
  let body: any = null

  try {
    const clonedRequest = request.clone()
    const rawBody = await clonedRequest.text()

    if (!rawBody || rawBody.trim() === "") {
      return NextResponse.json(
        {
          error: "Request body is empty",
          details: "Please provide a valid JSON body with required fields",
        },
        { status: 400 },
      )
    }

    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      return NextResponse.json(
        {
          error: "Invalid JSON format",
          details: parseError instanceof Error ? parseError.message : "Unknown parse error",
        },
        { status: 400 },
      )
    }

    const { tenantId, sessionId: vfSessionId, amount, currency, description, returnUrl, cancelUrl } = body

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 })
    }

    sessionId = vfSessionId

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    const integration = await getIntegration(tenantId, "PAYPAL")
    if (!integration) {
      return NextResponse.json({ error: "PayPal integration not found" }, { status: 404 })
    }

    integrationId = integration.id

    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))
    const { clientId, clientSecret, environment } = credentials

    // Get PayPal access token
    const authResponse = await fetch(
      `https://api-m.${environment === "live" ? "" : "sandbox."}paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": "en_US",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      },
    )

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Create payment
    const paymentData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toString(),
          },
          description: description || "Payment via AI Assistant",
        },
      ],
      application_context: {
        return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      },
    }

    const paymentResponse = await fetch(
      `https://api-m.${environment === "live" ? "" : "sandbox."}paypal.com/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(paymentData),
      },
    )

    const payment = await paymentResponse.json()

    if (!paymentResponse.ok) {
      return NextResponse.json({ error: `PayPal API error: ${payment.message}` }, { status: paymentResponse.status })
    }

    const approvalUrl = payment.links.find((link: any) => link.rel === "approve")?.href

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/paypal/create-payment",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify({ success: true, paymentId: payment.id }),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      approvalUrl,
      status: payment.status,
    })
  } catch (error) {
    console.error("PayPal create payment error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/paypal/create-payment",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/*
VOICEFLOW API BLOCK SETUP:
1. Create an API Block in Voiceflow
2. Set Method: POST
3. Set URL: https://yourdomain.com/api/voiceflow/paypal/create-payment
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "sessionId": "{session_id}",
     "amount": 29.99,
     "currency": "USD",
     "description": "Premium Plan Subscription",
     "returnUrl": "https://yoursite.com/success",
     "cancelUrl": "https://yoursite.com/cancel"
   }
6. Response Mapping:
   - success: {response.success}
   - paymentId: {response.paymentId}
   - approvalUrl: {response.approvalUrl}
*/
