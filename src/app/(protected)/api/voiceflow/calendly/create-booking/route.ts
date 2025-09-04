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
    const {
      tenantId,
      sessionId: vfSessionId,
      eventTypeUri,
      inviteeEmail,
      inviteeName,
      startTime: bookingStartTime,
      timezone = "UTC",
    } = body

    if (!tenantId || !vfSessionId || !eventTypeUri || !inviteeEmail || !bookingStartTime) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, eventTypeUri, inviteeEmail, and startTime are required",
        },
        { status: 400 },
      )
    }

    sessionId = vfSessionId

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integration = await getIntegration(tenantId, "CALENDLY")
    if (!integration) {
      return NextResponse.json({ error: "Calendly integration not configured" }, { status: 400 })
    }

    integrationId = integration.id
    const credentials = await getDecryptedCredentials(integration)

    // Create Calendly booking
    const bookingData = {
      event_type: eventTypeUri,
      invitee: {
        email: inviteeEmail,
        name: inviteeName,
      },
      start_time: bookingStartTime,
      timezone,
    }

    const response = await fetch("https://api.calendly.com/scheduled_events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Calendly API error: ${result.message || "Unknown error"}`)
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/calendly/create-booking",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(result),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      bookingId: result.resource.uri,
      bookingUrl: result.resource.location.join_url,
      startTime: result.resource.start_time,
    })
  } catch (error) {
    console.error("Calendly booking creation error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/calendly/create-booking",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      })
    }

    return NextResponse.json(
      {
        error: "Failed to create Calendly booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
