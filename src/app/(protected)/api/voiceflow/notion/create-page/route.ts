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

    const { tenantId, sessionId: vfSessionId, databaseId, title, properties, content } = body

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 })
    }

    sessionId = vfSessionId

    if (!databaseId || !title) {
      return NextResponse.json({ error: "Database ID and title are required" }, { status: 400 })
    }

    const integration = await getIntegration(tenantId, "NOTION")
    if (!integration) {
      return NextResponse.json({ error: "Notion integration not found" }, { status: 404 })
    }

    integrationId = integration.id

    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))
    const { accessToken } = credentials

    const pageData = {
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        ...properties,
      },
      children: content
        ? [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: content,
                    },
                  },
                ],
              },
            },
          ]
        : [],
    }

    const notionResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(pageData),
    })

    if (!notionResponse.ok) {
      const errorData = await notionResponse.json()
      return NextResponse.json({ error: `Notion API error: ${errorData.message}` }, { status: notionResponse.status })
    }

    const page = await notionResponse.json()

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/notion/create-page",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify({ success: true, pageId: page.id }),
      duration: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      pageId: page.id,
      url: page.url,
      title: page.properties.Name.title[0]?.text.content,
    })
  } catch (error) {
    console.error("Notion create page error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/notion/create-page",
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
3. Set URL: https://yourdomain.com/api/voiceflow/notion/create-page
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "sessionId": "{session_id}",
     "databaseId": "your-database-id",
     "title": "New Lead: John Doe",
     "properties": {
       "Status": {
         "select": {
           "name": "New"
         }
       },
       "Email": {
         "email": "john@example.com"
       }
     },
     "content": "Lead captured from Instagram DM conversation"
   }
6. Response Mapping:
   - success: {response.success}
   - pageId: {response.pageId}
   - url: {response.url}
*/
