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
    const { tenantId, sessionId: vfSessionId, to, message, mediaUrl } = body

    if (!tenantId || !vfSessionId || !to || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, to, and message are required",
        },
        { status: 400 },
      )
    }

    sessionId = vfSessionId

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integration = await getIntegration(tenantId, "TWILIO")
    if (!integration) {
      return NextResponse.json({ error: "Twilio integration not configured" }, { status: 400 })
    }

    integrationId = integration.id
    const credentials = await getDecryptedCredentials(integration)

    const smsData = new URLSearchParams({
      From: credentials.phone_number,
      To: to,
      Body: message,
    })

    if (mediaUrl) {
      smsData.append("MediaUrl", mediaUrl)
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${credentials.account_sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${credentials.account_sid}:${credentials.auth_token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: smsData,
      },
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Twilio API error: ${result.message || "Unknown error"}`)
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/twilio/send-sms",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(result),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      messageSid: result.sid,
      status: result.status,
    })
  } catch (error) {
    console.error("Twilio SMS sending error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/twilio/send-sms",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      })
    }

    return NextResponse.json(
      {
        error: "Failed to send SMS",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
