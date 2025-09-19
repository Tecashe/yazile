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
      active = true, // Only fetch active event types by default
      limit = 20
    } = body

    if (!tenantId || !vfSessionId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId and sessionId are required"
        },
        { status: 400 }
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

    // First, get the current user to get their organization
    const userResponse = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    if (!userResponse.ok) {
      const errorData = await userResponse.json()
      throw new Error(`Failed to fetch user info: ${errorData.message || errorData.title || "Unknown error"}`)
    }

    const userData = await userResponse.json()
    const user = userData.resource

    // Now fetch event types for this user
    const eventTypesUrl = new URL("https://api.calendly.com/event_types")
    eventTypesUrl.searchParams.set("user", user.uri)
    if (active) {
      eventTypesUrl.searchParams.set("active", "true")
    }
    eventTypesUrl.searchParams.set("count", limit.toString())

    const eventTypesResponse = await fetch(eventTypesUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    if (!eventTypesResponse.ok) {
      const errorData = await eventTypesResponse.json()
      throw new Error(`Failed to fetch event types: ${errorData.message || errorData.title || "Unknown error"}`)
    }

    const eventTypesData = await eventTypesResponse.json()
    const eventTypes = eventTypesData.collection || []

    // Format event types for easy consumption by Voiceflow
    const formattedEventTypes = eventTypes.map((eventType: any) => ({
      uri: eventType.uri,
      name: eventType.name,
      duration: eventType.duration,
      description: eventType.description,
      active: eventType.active,
      slug: eventType.slug,
      schedulingUrl: eventType.scheduling_url,
      // Add some helper fields for AI matching
      keywords: [
        eventType.name.toLowerCase(),
        eventType.slug,
        `${eventType.duration} minute`,
        `${eventType.duration}min`
      ].concat(
        eventType.description ? [eventType.description.toLowerCase()] : []
      )
    }))

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/calendly/event-types",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(formattedEventTypes),
      duration: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        uri: user.uri
      },
      eventTypes: formattedEventTypes,
      total: formattedEventTypes.length,
      // Helper for AI agent
      defaultEventType: formattedEventTypes.length > 0 ? formattedEventTypes[0] : null,
      suggestions: generateEventTypeSuggestions(formattedEventTypes)
    })

  } catch (error) {
    console.error("Calendly event types fetch error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/calendly/event-types",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime
      })
    }

    return NextResponse.json(
      {
        error: "Failed to fetch Calendly event types",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

function generateEventTypeSuggestions(eventTypes: any[]): string[] {
  const suggestions = []
  
  if (eventTypes.length === 0) {
    return ["No event types found. Please set up your Calendly event types first."]
  }
  
  if (eventTypes.length === 1) {
    suggestions.push(`I can help you schedule a ${eventTypes[0].name} (${eventTypes[0].duration} minutes)`)
  } else {
    suggestions.push(`I can help you schedule one of these meetings:`)
    eventTypes.slice(0, 3).forEach(et => {
      suggestions.push(`• ${et.name} (${et.duration} minutes)`)
    })
    if (eventTypes.length > 3) {
      suggestions.push(`...and ${eventTypes.length - 3} more options`)
    }
  }
  
  return suggestions
}