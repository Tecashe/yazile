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

    const { tenantId, email, name, instagramHandle, phone } = body

    if (!tenantId || !email || !name) {
      return NextResponse.json(
        {
          error: "Missing required fields: tenantId, email, name",
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

    // Create customer using Stripe API
    const stripe = require("stripe")(credentials.secretKey)

    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata: {
        tenant_id: tenantId,
        instagram_handle: instagramHandle || "",
        source: "instagram_dm",
        created_via: "voiceflow",
      },
    })

    // Log API call
    await client.apiLog.create({
      data: {
        tenantId,
        endpoint: "/api/voiceflow/stripe/customers/create",
        method: "POST",
        requestBody: JSON.stringify({ email, name, instagramHandle }),
        responseBody: JSON.stringify({ customerId: customer.id }),
        statusCode: 200,
        duration: 0,
        // success: true,
      },
    })

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        created: customer.created,
        metadata: customer.metadata,
      },
    })
  } catch (error: any) {
    console.error("Stripe customer creation error:", error)


    // tenantId,
    //   integrationId,
    //   sessionId: vfSessionId,
    //   endpoint: '/api/voiceflow/stripe/payment-link',
    //   method: 'POST',
    //   requestBody: JSON.stringify(body),
    //   statusCode: 200,
    //   responseBody: JSON.stringify({ success: true, paymentUrl: paymentLink.url }),
    //   duration: Date.now() - startTime

    // Log error
    try {
      const body = await request.json()
      await client.apiLog.create({
        data: {
          tenantId: body.tenantId || "unknown",
          endpoint: "/api/voiceflow/stripe/customers/create",
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
        error: error.message || "Failed to create customer",
      },
      { status: 500 },
    )
  }
}

/*
VOICEFLOW API BLOCK SETUP:
1. Create an API Block in Voiceflow
2. Set Method: POST
3. Set URL: {your_domain}/api/voiceflow/stripe/customers/create
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "email": "{customer_email}",
     "name": "{customer_name}",
     "instagramHandle": "{instagram_handle}",
     "phone": "{customer_phone}"
   }
6. Response Mapping:
   - success: {response.success}
   - customer_id: {response.customer.id}
   - customer_email: {response.customer.email}
*/
