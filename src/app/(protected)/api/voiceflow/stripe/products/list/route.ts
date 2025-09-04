import { type NextRequest, NextResponse } from "next/server"
import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
import { getIntegration } from "@/lib/integration-service"
import { decrypt } from "@/lib/encrypt"
import { client } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const active = searchParams.get("active") !== "false"

    if (!tenantId) {
      return NextResponse.json(
        {
          error: "Missing required parameter: tenantId",
        },
        { status: 400 },
      )
    }

    // Validate Voiceflow request
    const isValid = await validateVoiceflowRequest(request, { tenantId })
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Get products using Stripe API
    const stripe = require("stripe")(credentials.secretKey)

    const products = await stripe.products.list({
      limit,
      active,
      expand: ["data.default_price"],
    })

    // Format products for Voiceflow
    const formattedProducts = products.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      price: product.default_price
        ? {
            id: product.default_price.id,
            amount: product.default_price.unit_amount / 100,
            currency: product.default_price.currency,
            type: product.default_price.type,
          }
        : null,
      images: product.images,
      metadata: product.metadata,
      created: product.created,
      updated: product.updated,
    }))

    // Log API call
    await client.apiLog.create({
      data: {
        tenantId,
        endpoint: "/api/voiceflow/stripe/products/list",
        method: "GET",
        requestBody: JSON.stringify({ limit, active }),
        responseBody: JSON.stringify({ productCount: formattedProducts.length }),
        statusCode: 200,
        duration: 0,
        // success: true,
      },
    })

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      hasMore: products.has_more,
      totalCount: formattedProducts.length,
    })
  } catch (error: any) {
    console.error("Stripe products list error:", error)

    // Log error
    try {
      const { searchParams } = new URL(request.url)
      const tenantId = searchParams.get("tenantId")

      await client.apiLog.create({
        data: {
          tenantId: tenantId || "unknown",
          endpoint: "/api/voiceflow/stripe/products/list",
          method: "GET",
          requestBody: JSON.stringify({ tenantId }),
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
        error: error.message || "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}

/*
VOICEFLOW API BLOCK SETUP:
1. Create an API Block in Voiceflow
2. Set Method: GET
3. Set URL: {your_domain}/api/voiceflow/stripe/products/list?tenantId={tenant_id}&limit=10&active=true
4. Headers:
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Response Mapping:
   - success: {response.success}
   - products: {response.products}
   - product_count: {response.totalCount}
   - has_more: {response.hasMore}
*/
