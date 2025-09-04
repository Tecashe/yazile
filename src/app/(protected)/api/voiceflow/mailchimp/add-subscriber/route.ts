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
    const { tenantId, sessionId: vfSessionId, email, firstName, lastName, listId, tags = [], mergeFields = {} } = body

    if (!tenantId || !vfSessionId || !email || !listId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, email, and listId are required",
        },
        { status: 400 },
      )
    }

    sessionId = vfSessionId

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integration = await getIntegration(tenantId, "MAILCHIMP")
    if (!integration) {
      return NextResponse.json({ error: "Mailchimp integration not configured" }, { status: 400 })
    }

    integrationId = integration.id
    const credentials = await getDecryptedCredentials(integration)

    const subscriberData = {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        ...mergeFields,
      },
      tags: tags,
    }

    const response = await fetch(`https://${credentials.server_prefix}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriberData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${result.detail || "Unknown error"}`)
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/mailchimp/add-subscriber",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(result),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      subscriberId: result.id,
      status: result.status,
    })
  } catch (error) {
    console.error("Mailchimp subscriber creation error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/mailchimp/add-subscriber",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      })
    }

    return NextResponse.json(
      {
        error: "Failed to add Mailchimp subscriber",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
