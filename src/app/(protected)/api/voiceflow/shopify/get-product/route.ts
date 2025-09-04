import { type NextRequest, NextResponse } from "next/server"
import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
import { getIntegration, logApiCall, getDecryptedCredentials } from "@/lib/integration-service"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null
  let sessionId: string | null = null
  let body: any = null

  try {
    const rawBody = await request.text()
    if (!rawBody || rawBody.trim() === "") {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
    }

    body = JSON.parse(rawBody)
    const { tenantId, sessionId: vfSessionId, productId, productHandle } = body

    if (!tenantId || !vfSessionId || (!productId && !productHandle)) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, and either productId or productHandle are required",
        },
        { status: 400 },
      )
    }

    sessionId = vfSessionId

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integration = await getIntegration(tenantId, "SHOPIFY")
    if (!integration) {
      return NextResponse.json({ error: "Shopify integration not configured" }, { status: 400 })
    }

    integrationId = integration.id
    const credentials = await getDecryptedCredentials(integration)

    let endpoint = `https://${credentials.shop_domain}/admin/api/2023-10/products`
    if (productId) {
      endpoint += `/${productId}.json`
    } else {
      endpoint += `.json?handle=${productHandle}`
    }

    const response = await fetch(endpoint, {
      headers: {
        "X-Shopify-Access-Token": credentials.access_token,
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Shopify API error: ${result.errors || "Unknown error"}`)
    }

    const product = productId ? result.product : result.products[0]

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/shopify/get-product",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(result),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        price: product.variants[0]?.price || "0.00",
        compareAtPrice: product.variants[0]?.compare_at_price,
        available: product.variants[0]?.inventory_quantity > 0,
        inventory: product.variants[0]?.inventory_quantity,
        images: product.images.map((img: any) => img.src),
        description: product.body_html,
      },
    })
  } catch (error) {
    console.error("Shopify product fetch error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/shopify/get-product",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      })
    }

    return NextResponse.json(
      {
        error: "Failed to fetch Shopify product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
