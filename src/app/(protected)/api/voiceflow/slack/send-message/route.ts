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
    // Parse request body
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

    const { tenantId, sessionId: vfSessionId, channel, message, threadTs } = body

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 })
    }

    sessionId = vfSessionId

    if (!channel || !message) {
      return NextResponse.json({ error: "Channel and message are required" }, { status: 400 })
    }

    // Get Slack integration
    const integration = await getIntegration(tenantId, "SLACK")
    if (!integration) {
      return NextResponse.json({ error: "Slack integration not found" }, { status: 404 })
    }

    integrationId = integration.id

    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))
    const { botToken } = credentials

    // Send message to Slack
    const slackResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel,
        text: message,
        thread_ts: threadTs,
      }),
    })

    const slackData = await slackResponse.json()

    if (!slackData.ok) {
      return NextResponse.json({ error: `Slack API error: ${slackData.error}` }, { status: 400 })
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/slack/send-message",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify({ success: true, messageId: slackData.ts }),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      messageId: slackData.ts,
      channel: slackData.channel,
    })
  } catch (error) {
    console.error("Slack send message error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/slack/send-message",
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
3. Set URL: https://yourdomain.com/api/voiceflow/slack/send-message
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "sessionId": "{session_id}",
     "channel": "#general",
     "message": "Hello from your AI assistant!",
     "threadTs": "optional_thread_timestamp"
   }
6. Response Mapping:
   - success: {response.success}
   - messageId: {response.messageId}
   - channel: {response.channel}
*/
