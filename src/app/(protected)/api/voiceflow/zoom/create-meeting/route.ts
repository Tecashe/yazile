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

    const { tenantId, sessionId: vfSessionId, topic, startTime: meetingStartTime, duration, agenda, password } = body

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 })
    }

    sessionId = vfSessionId

    if (!topic) {
      return NextResponse.json({ error: "Meeting topic is required" }, { status: 400 })
    }

    const integration = await getIntegration(tenantId, "ZOOM")
    if (!integration) {
      return NextResponse.json({ error: "Zoom integration not found" }, { status: 404 })
    }

    integrationId = integration.id

    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))
    const { accessToken } = credentials

    const meetingData = {
      topic,
      type: 2, // Scheduled meeting
      start_time: meetingStartTime || new Date(Date.now() + 3600000).toISOString(), // Default 1 hour from now
      duration: duration || 60,
      agenda: agenda || "",
      password: password || Math.random().toString(36).substring(2, 8),
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
      },
    }

    const zoomResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    })

    if (!zoomResponse.ok) {
      const errorData = await zoomResponse.json()
      return NextResponse.json({ error: `Zoom API error: ${errorData.message}` }, { status: zoomResponse.status })
    }

    const meeting = await zoomResponse.json()

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/zoom/create-meeting",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify({ success: true, meetingId: meeting.id }),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      meetingId: meeting.id,
      joinUrl: meeting.join_url,
      startUrl: meeting.start_url,
      password: meeting.password,
      topic: meeting.topic,
      startTime: meeting.start_time,
    })
  } catch (error) {
    console.error("Zoom create meeting error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/zoom/create-meeting",
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
3. Set URL: https://yourdomain.com/api/voiceflow/zoom/create-meeting
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "sessionId": "{session_id}",
     "topic": "Customer Consultation",
     "startTime": "2024-01-15T14:00:00Z",
     "duration": 30,
     "agenda": "Discuss product requirements",
     "password": "optional_custom_password"
   }
6. Response Mapping:
   - success: {response.success}
   - meetingId: {response.meetingId}
   - joinUrl: {response.joinUrl}
   - password: {response.password}
*/
