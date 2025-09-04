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

    const { tenantId, sessionId: vfSessionId, to, subject, htmlContent, textContent, from } = body

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 })
    }

    sessionId = vfSessionId

    if (!to || !subject || (!htmlContent && !textContent)) {
      return NextResponse.json(
        {
          error: "To, subject, and content (html or text) are required",
        },
        { status: 400 },
      )
    }

    const integration = await getIntegration(tenantId, "SENDGRID")
    if (!integration) {
      return NextResponse.json({ error: "SendGrid integration not found" }, { status: 404 })
    }

    integrationId = integration.id

    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))
    const { apiKey, fromEmail } = credentials

    const emailData = {
      personalizations: [
        {
          to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
          subject,
        },
      ],
      from: { email: from || fromEmail },
      content: [
        ...(textContent ? [{ type: "text/plain", value: textContent }] : []),
        ...(htmlContent ? [{ type: "text/html", value: htmlContent }] : []),
      ],
    }

    const sendGridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!sendGridResponse.ok) {
      const errorData = await sendGridResponse.text()
      return NextResponse.json(
        {
          error: `SendGrid API error: ${errorData}`,
        },
        { status: sendGridResponse.status },
      )
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/sendgrid/send-email",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 202,
      responseBody: JSON.stringify({ success: true }),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("SendGrid send email error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/sendgrid/send-email",
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
3. Set URL: https://yourdomain.com/api/voiceflow/sendgrid/send-email
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "sessionId": "{session_id}",
     "to": "customer@example.com",
     "subject": "Thank you for your purchase!",
     "htmlContent": "<h1>Welcome!</h1><p>Your order has been confirmed.</p>",
     "textContent": "Welcome! Your order has been confirmed.",
     "from": "noreply@yourdomain.com"
   }
6. Response Mapping:
   - success: {response.success}
   - message: {response.message}
*/
