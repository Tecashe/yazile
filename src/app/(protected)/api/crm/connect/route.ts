import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getHubSpotOAuthUrl, getSalesforceOAuthUrl, getPipedriveOAuthUrl } from "@/lib/crm-integrations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, provider, connectionType = "oauth" } = body

    if (!userId || !provider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For OAuth connections
    if (connectionType === "oauth") {
      const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`]
      if (!clientId) {
        return NextResponse.json({ error: "OAuth not configured for this provider" }, { status: 400 })
      }

      const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/oauth`
      const state = Buffer.from(JSON.stringify({ userId, provider, clientId })).toString("base64")

      let oauthUrl: string

      switch (provider.toUpperCase()) {
        case "HUBSPOT":
          oauthUrl = getHubSpotOAuthUrl(clientId, redirectUri, state)
          break
        case "SALESFORCE":
          oauthUrl = getSalesforceOAuthUrl(clientId, redirectUri, state)
          break
        case "PIPEDRIVE":
          oauthUrl = getPipedriveOAuthUrl(clientId, redirectUri, state)
          break
        default:
          return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
      }

      return NextResponse.json({ oauthUrl })
    }

    // For API key connections (fallback)
    const { name, apiKey, apiSecret, baseUrl } = body

    if (!name || !apiKey) {
      return NextResponse.json({ error: "Missing API credentials" }, { status: 400 })
    }

    // Test the connection first
    const testResult = await testCRMConnection(provider, apiKey, apiSecret, baseUrl)
    if (!testResult.success) {
      return NextResponse.json({ error: testResult.error }, { status: 400 })
    }

    // Store the integration
    await client.crmIntegration.create({
      data: {
        userId,
        provider: provider.toUpperCase(),
        name,
        apiKey,
        apiSecret,
        baseUrl,
        isActive: true,
        metadata: {
          connectionType: "api_key",
          connectedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("CRM connection error:", error)
    return NextResponse.json({ error: "Failed to connect CRM" }, { status: 500 })
  }
}

async function testCRMConnection(provider: string, apiKey: string, apiSecret?: string, baseUrl?: string) {
  try {
    switch (provider.toUpperCase()) {
      case "HUBSPOT":
        const hubspotResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
        return { success: hubspotResponse.ok }

      case "SALESFORCE":
        if (!baseUrl) return { success: false, error: "Base URL required for Salesforce" }
        const salesforceResponse = await fetch(`${baseUrl}/services/data/v57.0/sobjects/Lead?limit=1`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
        return { success: salesforceResponse.ok }

      case "PIPEDRIVE":
        if (!baseUrl) return { success: false, error: "Base URL required for Pipedrive" }
        const pipedriveResponse = await fetch(`${baseUrl}/api/v1/persons?limit=1&api_token=${apiKey}`)
        return { success: pipedriveResponse.ok }

      default:
        return { success: false, error: "Unsupported provider" }
    }
  } catch (error) {
    return { success: false, error: "Connection test failed" }
  }
}
