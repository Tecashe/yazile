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
      eventTypeUri, // Optional - will be used if provided
      name, // Optional - will be used to find matching event type if eventTypeUri not provided
      startDate, // YYYY-MM-DD format
      endDate,   // YYYY-MM-DD format (optional, defaults to same day)
      timezone = "UTC",
      minAvailableSlots = 1, // Minimum slots to consider a time "available"
    } = body

    if (!tenantId || !vfSessionId || !startDate) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, and startDate are required"
        },
        { status: 400 }
      )
    }

    if (!eventTypeUri && !name) {
      return NextResponse.json(
        {
          error: "Missing event identification",
          details: "Either eventTypeUri or name must be provided"
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

    let finalEventTypeUri = eventTypeUri
    let matchedEventType = null

    // If no eventTypeUri provided, find it using the name
    if (!eventTypeUri && name) {
      // First, get the current user
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

      // Fetch all active event types for this user
      const eventTypesUrl = new URL("https://api.calendly.com/event_types")
      eventTypesUrl.searchParams.set("user", user.uri)
      eventTypesUrl.searchParams.set("active", "true")
      eventTypesUrl.searchParams.set("count", "100") // Get all event types

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

      // Find the best matching event type
      matchedEventType = findBestMatchingEventType(name, eventTypes)

      if (!matchedEventType) {
        const availableNames = eventTypes.map((et: any) => et.name).join(", ")
        return NextResponse.json(
          {
            error: "Event type not found",
            details: `No event type found matching "${name}". Available event types: ${availableNames}`,
            availableEventTypes: eventTypes.map((et: any) => ({
              name: et.name,
              uri: et.uri,
              duration: et.duration
            }))
          },
          { status: 404 }
        )
      }

      finalEventTypeUri = matchedEventType.uri
    }

    // Validate date format
    const startDateObj = new Date(startDate + 'T00:00:00.000Z')
    const endDateObj = new Date((endDate || startDate) + 'T23:59:59.999Z')

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD format")
    }

    // Get event type details
    const eventTypeResponse = await fetch(`https://api.calendly.com/event_types/${finalEventTypeUri.split('/').pop()}`, {
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
    const availabilityResponse = await fetch(`https://api.calendly.com/event_type_available_times?event_type=${finalEventTypeUri}&start_time=${startDateObj.toISOString()}&end_time=${endDateObj.toISOString()}`, {
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
        eventTypeName: eventType.name,
        matchMethod: eventTypeUri ? "uri" : "name"
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
      matchInfo: matchedEventType ? {
        searchTerm: name,
        matchedName: matchedEventType.name,
        matchMethod: "name",
        confidence: calculateMatchConfidence(name, matchedEventType.name)
      } : {
        matchMethod: "uri"
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

function findBestMatchingEventType(searchName: string, eventTypes: any[]): any | null {
  const normalizedSearch = searchName.toLowerCase().trim()
  
  // 1. Exact name match (case-insensitive)
  let exactMatch = eventTypes.find(et => et.name.toLowerCase() === normalizedSearch)
  if (exactMatch) return exactMatch

  // 2. Exact slug match
  exactMatch = eventTypes.find(et => et.slug?.toLowerCase() === normalizedSearch)
  if (exactMatch) return exactMatch

  // 3. Name contains search term
  let containsMatch = eventTypes.find(et => et.name.toLowerCase().includes(normalizedSearch))
  if (containsMatch) return containsMatch

  // 4. Search term contains event type name (for partial matches)
  containsMatch = eventTypes.find(et => normalizedSearch.includes(et.name.toLowerCase()))
  if (containsMatch) return containsMatch

  // 5. Fuzzy matching using keywords
  for (const eventType of eventTypes) {
    const keywords = [
      eventType.name.toLowerCase(),
      eventType.slug?.toLowerCase(),
      ...(eventType.description?.toLowerCase().split(/\s+/) || [])
    ].filter(Boolean)

    for (const keyword of keywords) {
      if (keyword.includes(normalizedSearch) || normalizedSearch.includes(keyword)) {
        return eventType
      }
    }
  }

  // 6. Levenshtein distance for typos (basic implementation)
  let bestMatch = null
  let bestScore = Infinity
  const threshold = Math.ceil(normalizedSearch.length * 0.4) // Allow 40% character difference

  for (const eventType of eventTypes) {
    const distance = levenshteinDistance(normalizedSearch, eventType.name.toLowerCase())
    if (distance < bestScore && distance <= threshold) {
      bestScore = distance
      bestMatch = eventType
    }
  }

  return bestMatch
}

function calculateMatchConfidence(searchTerm: string, matchedName: string): number {
  const normalizedSearch = searchTerm.toLowerCase().trim()
  const normalizedMatch = matchedName.toLowerCase()

  if (normalizedSearch === normalizedMatch) return 100
  if (normalizedMatch.includes(normalizedSearch)) return 90
  if (normalizedSearch.includes(normalizedMatch)) return 85

  const distance = levenshteinDistance(normalizedSearch, normalizedMatch)
  const maxLength = Math.max(normalizedSearch.length, normalizedMatch.length)
  const similarity = ((maxLength - distance) / maxLength) * 100

  return Math.round(similarity)
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
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