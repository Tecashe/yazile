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
      eventTypeUri, // Event type to check availability for
      startDate, // YYYY-MM-DD format
      endDate,   // YYYY-MM-DD format (optional, defaults to same day)
      timezone = "UTC",
      minAvailableSlots = 1, // Minimum slots to consider a time "available"
    } = body

    if (!tenantId || !vfSessionId || !eventTypeUri || !startDate) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, eventTypeUri, and startDate are required"
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

    // Validate date format
    const startDateObj = new Date(startDate + 'T00:00:00.000Z')
    const endDateObj = new Date((endDate || startDate) + 'T23:59:59.999Z')

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD format")
    }

    // Get event type details
    const eventTypeResponse = await fetch(`https://api.calendly.com/event_types/${eventTypeUri.split('/').pop()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    if (!eventTypeResponse.ok) {
      const errorData = await eventTypeResponse.json()
      throw new Error(`Failed to fetch event type: ${errorData.message || "Event type not found"}`)
    }

    const eventTypeData = await eventTypeResponse.json()
    const eventType = eventTypeData.resource

    // Get availability for the specified date range
    const availabilityResponse = await fetch(`https://api.calendly.com/event_type_available_times?event_type=${eventTypeUri}&start_time=${startDateObj.toISOString()}&end_time=${endDateObj.toISOString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    if (!availabilityResponse.ok) {
      const errorData = await availabilityResponse.json()
      throw new Error(`Failed to fetch availability: ${errorData.message || "Unknown error"}`)
    }

    const availabilityData = await availabilityResponse.json()
    const availableTimes = availabilityData.collection || []

    // Process and format the available times
    const processedSlots = availableTimes.map((slot: any) => {
      const startTime = new Date(slot.start_time)
      const endTime = new Date(startTime.getTime() + (eventType.duration * 60 * 1000))
      
      return {
        startTime: slot.start_time,
        endTime: endTime.toISOString(),
        formattedStart: formatTimeForTimezone(startTime, timezone),
        formattedEnd: formatTimeForTimezone(endTime, timezone),
        dayOfWeek: startTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          timeZone: timezone 
        }),
        date: startTime.toLocaleDateString('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        }),
        isToday: isToday(startTime, timezone),
        isTomorrow: isTomorrow(startTime, timezone)
      }
    })

    // Group slots by date for easier consumption
    const slotsByDate = processedSlots.reduce((acc: Record<string, any[]>, slot: { startTime: string }) => {
      const dateKey = slot.startTime.split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(slot)
      return acc
    }, {})

    // Get upcoming events to provide context
    const upcomingEventsResponse = await fetch(`https://api.calendly.com/scheduled_events?user=${eventType.profile.owner}&min_start_time=${new Date().toISOString()}&max_start_time=${endDateObj.toISOString()}&count=10`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    let upcomingEvents = []
    if (upcomingEventsResponse.ok) {
      const upcomingData = await upcomingEventsResponse.json()
      upcomingEvents = upcomingData.collection.map((event: any) => ({
        name: event.name,
        startTime: event.start_time,
        endTime: event.end_time,
        status: event.status
      }))
    }

    // Generate summary statistics
    const totalAvailableSlots = availableTimes.length
    const availableDays = Object.keys(slotsByDate).length
    const nextAvailableSlot = processedSlots[0] || null

    // Generate human-readable availability summary
    let availabilitySummary = ""
    if (totalAvailableSlots === 0) {
      availabilitySummary = `No available slots found for ${eventType.name} between ${startDate} and ${endDate || startDate}`
    } else if (totalAvailableSlots === 1) {
      availabilitySummary = `1 available slot found: ${nextAvailableSlot.formattedStart} on ${nextAvailableSlot.date}`
    } else {
      availabilitySummary = `${totalAvailableSlots} available slots found across ${availableDays} day(s). Next available: ${nextAvailableSlot.formattedStart} on ${nextAvailableSlot.date}`
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/calendly/check-availability",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify({
        totalSlots: totalAvailableSlots,
        availableDays,
        eventTypeName: eventType.name
      }),
      duration: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      eventType: {
        uri: eventType.uri,
        name: eventType.name,
        duration: eventType.duration,
        description: eventType.description_plain || eventType.description_html
      },
      availability: {
        startDate,
        endDate: endDate || startDate,
        timezone,
        totalSlots: totalAvailableSlots,
        availableDays,
        nextAvailable: nextAvailableSlot,
        summary: availabilitySummary
      },
      slots: processedSlots,
      slotsByDate,
      upcomingEvents: upcomingEvents.slice(0, 3), // Limit to first 3 for context
      suggestions: generateBookingSuggestions(processedSlots, eventType)
    })

  } catch (error) {
    console.error("Calendly availability check error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/calendly/check-availability",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime
      })
    }

    return NextResponse.json(
      {
        error: "Failed to check Calendly availability",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Helper functions
function formatTimeForTimezone(date: Date, timezone: string): string {
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function isToday(date: Date, timezone: string): boolean {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone })
  const checkDate = date.toLocaleDateString('en-CA', { timeZone: timezone })
  return today === checkDate
}

function isTomorrow(date: Date, timezone: string): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: timezone })
  const checkDate = date.toLocaleDateString('en-CA', { timeZone: timezone })
  return tomorrowStr === checkDate
}

function generateBookingSuggestions(slots: any[], eventType: any): string[] {
  const suggestions = []
  
  if (slots.length === 0) {
    suggestions.push("Consider checking availability for next week")
    suggestions.push("Try looking at different time slots")
    return suggestions
  }

  const todaySlots = slots.filter(slot => slot.isToday)
  const tomorrowSlots = slots.filter(slot => slot.isTomorrow)
  
  if (todaySlots.length > 0) {
    suggestions.push(`Available today at ${todaySlots[0].formattedStart}`)
  }
  
  if (tomorrowSlots.length > 0) {
    suggestions.push(`Available tomorrow at ${tomorrowSlots[0].formattedStart}`)
  }
  
  if (slots.length >= 3) {
    suggestions.push("Multiple time options available - would you prefer morning or afternoon?")
  }
  
  return suggestions
}