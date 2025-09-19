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
      timezone = "UTC",
      // New fields for dynamic selection
      eventTypeName,
      preferredDuration,
      meetingType
    } = body

    if (!tenantId || !vfSessionId || !inviteeEmail) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, and inviteeEmail are required",
        },
        { status: 400 },
      )
    }

    // Must have either specific eventTypeUri OR criteria for selection
    if (!eventTypeUri && !eventTypeName && !preferredDuration && !meetingType) {
      return NextResponse.json(
        {
          error: "Missing event type specification",
          details: "Provide either eventTypeUri or selection criteria (eventTypeName, preferredDuration, meetingType)",
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

    let selectedEventTypeUri = eventTypeUri

    // If no specific eventTypeUri provided, we need to find one
    if (!selectedEventTypeUri) {
      // Get available event types
      const userResponse = await fetch("https://api.calendly.com/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          "Content-Type": "application/json"
        }
      })

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info for event type selection")
      }

      const userData = await userResponse.json()
      const user = userData.resource

      const eventTypesUrl = new URL("https://api.calendly.com/event_types")
      eventTypesUrl.searchParams.set("user", user.uri)
      eventTypesUrl.searchParams.set("active", "true")

      const eventTypesResponse = await fetch(eventTypesUrl.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          "Content-Type": "application/json"
        }
      })

      if (!eventTypesResponse.ok) {
        throw new Error("Failed to fetch event types for selection")
      }

      const eventTypesData = await eventTypesResponse.json()
      const eventTypes = eventTypesData.collection || []

      if (eventTypes.length === 0) {
        throw new Error("No active event types found")
      }

      // Smart selection logic
      let selectedEventType = null

      if (eventTypeName) {
        // Match by name (case insensitive)
        selectedEventType = eventTypes.find((et: any) => 
          et.name.toLowerCase().includes(eventTypeName.toLowerCase()) ||
          eventTypeName.toLowerCase().includes(et.name.toLowerCase())
        )
      }

      if (!selectedEventType && preferredDuration) {
        // Match by duration (exact or closest)
        selectedEventType = eventTypes
          .sort((a: any, b: any) => Math.abs(a.duration - preferredDuration) - Math.abs(b.duration - preferredDuration))
          [0]
      }

      if (!selectedEventType && meetingType) {
        // Match by keywords in name or description
        selectedEventType = eventTypes.find((et: any) => {
          const searchText = `${et.name} ${et.description || ""}`.toLowerCase()
          return searchText.includes(meetingType.toLowerCase())
        })
      }

      // Fallback to first available event type
      selectedEventType = selectedEventType || eventTypes[0]
      selectedEventTypeUri = selectedEventType.uri
    }

    // Generate scheduling link using Calendly's API
    const schedulingLinkData = {
      max_event_count: 1,
      owner: selectedEventTypeUri,
      owner_type: "EventType"
    }

    const response = await fetch("https://api.calendly.com/scheduling_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedulingLinkData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Calendly API error: ${result.message || result.title || "Unknown error"}`)
    }

    // The scheduling link can be customized with query parameters
    const schedulingUrl = new URL(result.resource.booking_url)
    schedulingUrl.searchParams.set('email', inviteeEmail)
    if (inviteeName) {
      schedulingUrl.searchParams.set('name', inviteeName)
    }
    schedulingUrl.searchParams.set('timezone', timezone)

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
      schedulingUrl: schedulingUrl.toString(),
      bookingUrl: result.resource.booking_url,
      ownerName: result.resource.owner_name,
      ownerType: result.resource.owner_type,
    })
  } catch (error) {
    console.error("Calendly scheduling link creation error:", error)

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
        error: "Failed to create Calendly scheduling link",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}