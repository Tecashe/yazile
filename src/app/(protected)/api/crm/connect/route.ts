// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getHubSpotOAuthUrl, getSalesforceOAuthUrl, getPipedriveOAuthUrl } from "@/lib/crm-integrations"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { userId, provider, connectionType = "oauth" } = body

//     if (!userId || !provider) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // For OAuth connections
//     if (connectionType === "oauth") {
//       const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`]
//       if (!clientId) {
//         return NextResponse.json({ error: "OAuth not configured for this provider" }, { status: 400 })
//       }

//       const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/oauth`
//       const state = Buffer.from(JSON.stringify({ userId, provider, clientId })).toString("base64")

//       let oauthUrl: string

//       switch (provider.toUpperCase()) {
//         case "HUBSPOT":
//           oauthUrl = getHubSpotOAuthUrl(clientId, redirectUri, state)
//           break
//         case "SALESFORCE":
//           oauthUrl = getSalesforceOAuthUrl(clientId, redirectUri, state)
//           break
//         case "PIPEDRIVE":
//           oauthUrl = getPipedriveOAuthUrl(clientId, redirectUri, state)
//           break
//         default:
//           return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
//       }

//       return NextResponse.json({ oauthUrl })
//     }

//     // For API key connections (fallback)
//     const { name, apiKey, apiSecret, baseUrl } = body

//     if (!name || !apiKey) {
//       return NextResponse.json({ error: "Missing API credentials" }, { status: 400 })
//     }

//     // Test the connection first
//     const testResult = await testCRMConnection(provider, apiKey, apiSecret, baseUrl)
//     if (!testResult.success) {
//       return NextResponse.json({ error: testResult.error }, { status: 400 })
//     }

//     // Store the integration
//     await client.crmIntegration.create({
//       data: {
//         userId,
//         provider: provider.toUpperCase(),
//         name,
//         apiKey,
//         apiSecret,
//         baseUrl,
//         isActive: true,
//         metadata: {
//           connectionType: "api_key",
//           connectedAt: new Date().toISOString(),
//         },
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("CRM connection error:", error)
//     return NextResponse.json({ error: "Failed to connect CRM" }, { status: 500 })
//   }
// }

// async function testCRMConnection(provider: string, apiKey: string, apiSecret?: string, baseUrl?: string) {
//   try {
//     switch (provider.toUpperCase()) {
//       case "HUBSPOT":
//         const hubspotResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//           },
//         })
//         return { success: hubspotResponse.ok }

//       case "SALESFORCE":
//         if (!baseUrl) return { success: false, error: "Base URL required for Salesforce" }
//         const salesforceResponse = await fetch(`${baseUrl}/services/data/v57.0/sobjects/Lead?limit=1`, {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//           },
//         })
//         return { success: salesforceResponse.ok }

//       case "PIPEDRIVE":
//         if (!baseUrl) return { success: false, error: "Base URL required for Pipedrive" }
//         const pipedriveResponse = await fetch(`${baseUrl}/api/v1/persons?limit=1&api_token=${apiKey}`)
//         return { success: pipedriveResponse.ok }

//       default:
//         return { success: false, error: "Unsupported provider" }
//     }
//   } catch (error) {
//     return { success: false, error: "Connection test failed" }
//   }
// }


// app/api/crm/connect/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, provider, connectionType = "oauth", dataCenter } = body

    if (!userId || !provider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For OAuth connections
    if (connectionType === "oauth") {
      const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`]
      if (!clientId) {
        return NextResponse.json({ error: "OAuth not configured for this provider" }, { status: 400 })
      }

      let oauthUrl: string
      let redirectUri: string
      let state: string

      switch (provider.toUpperCase()) {
        case "HUBSPOT":
          redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/hubspot`
          state = Buffer.from(JSON.stringify({ userId, clientId })).toString("base64")
          oauthUrl = getHubSpotOAuthUrl(clientId, redirectUri, state)
          break

        case "SALESFORCE":
          redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/salesforce`
          state = Buffer.from(JSON.stringify({ userId, clientId, instanceUrl: body.instanceUrl })).toString("base64")
          oauthUrl = getSalesforceOAuthUrl(clientId, redirectUri, state, body.instanceUrl)
          break

        case "PIPEDRIVE":
          redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/pipedrive`
          state = Buffer.from(JSON.stringify({ userId, clientId })).toString("base64")
          oauthUrl = getPipedriveOAuthUrl(clientId, redirectUri, state)
          break

        case "ZOHO":
          redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/zoho`
          state = Buffer.from(JSON.stringify({ userId, clientId, dataCenter: dataCenter || "com" })).toString("base64")
          oauthUrl = getZohoOAuthUrl(clientId, redirectUri, state, dataCenter)
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

// OAuth URL generators for each provider
function getHubSpotOAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const scopes = [
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "crm.objects.companies.read",
    "crm.objects.companies.write",
    "crm.objects.deals.read",
    "crm.objects.deals.write",
    "crm.lists.read",
    "crm.lists.write"
  ].join(" ")





  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: state,
    response_type: "code"
  })

  return `https://app.hubspot.com/oauth/authorize?${params.toString()}`
}

function getSalesforceOAuthUrl(clientId: string, redirectUri: string, state: string, instanceUrl?: string): string {
  const loginUrl = instanceUrl || "https://login.salesforce.com"
  const scopes = [
    "api",
    "refresh_token",
    "offline_access"
  ].join(" ")

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: state
  })

  return `${loginUrl}/services/oauth2/authorize?${params.toString()}`
}

function getPipedriveOAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    response_type: "code"
  })

  return `https://oauth.pipedrive.com/oauth/authorize?${params.toString()}`
}

function getZohoOAuthUrl(clientId: string, redirectUri: string, state: string, dataCenter?: string): string {
  const accountsDomain = getZohoAccountsDomain(dataCenter || "com")
  const scopes = [
    "ZohoCRM.modules.ALL",
    "ZohoCRM.settings.ALL",
    "ZohoCRM.users.READ"
  ].join(",")

  const params = new URLSearchParams({
    scope: scopes,
    client_id: clientId,
    state: state,
    response_type: "code",
    redirect_uri: redirectUri,
    access_type: "offline"
  })

  return `https://accounts.${accountsDomain}/oauth/v2/auth?${params.toString()}`
}

function getZohoAccountsDomain(dataCenter: string): string {
  switch (dataCenter.toLowerCase()) {
    case "eu":
      return "zoho.eu"
    case "in":
      return "zoho.in"
    case "com.cn":
      return "zoho.com.cn"
    case "com.au":
      return "zoho.com.au"
    case "jp":
      return "zoho.jp"
    default:
      return "zoho.com"
  }
}

// Connection test functions
async function testCRMConnection(provider: string, apiKey: string, apiSecret?: string, baseUrl?: string) {
  try {
    switch (provider.toUpperCase()) {
      case "HUBSPOT":
        const hubspotResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
        })
        
        if (!hubspotResponse.ok) {
          const errorData = await hubspotResponse.json()
          return { success: false, error: errorData.message || "HubSpot connection failed" }
        }
        return { success: true }

      case "SALESFORCE":
        if (!baseUrl) return { success: false, error: "Base URL required for Salesforce" }
        
        const salesforceResponse = await fetch(`${baseUrl}/services/data/v57.0/sobjects/Lead/describe`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
        })
        
        if (!salesforceResponse.ok) {
          const errorData = await salesforceResponse.json()
          return { success: false, error: errorData[0]?.message || "Salesforce connection failed" }
        }
        return { success: true }

      case "PIPEDRIVE":
        if (!baseUrl) return { success: false, error: "Base URL required for Pipedrive" }
        
        const pipedriveResponse = await fetch(`${baseUrl}/users?api_token=${apiKey}`)
        
        if (!pipedriveResponse.ok) {
          const errorData = await pipedriveResponse.json()
          return { success: false, error: errorData.error || "Pipedrive connection failed" }
        }
        return { success: true }

      case "ZOHO":
        if (!baseUrl) return { success: false, error: "Base URL required for Zoho" }
        
        const zohoResponse = await fetch(`${baseUrl}/users?type=CurrentUser`, {
          headers: {
            Authorization: `Zoho-oauthtoken ${apiKey}`,
            "Content-Type": "application/json"
          },
        })
        
        if (!zohoResponse.ok) {
          const errorData = await zohoResponse.json()
          return { success: false, error: errorData.message || "Zoho connection failed" }
        }
        return { success: true }

      default:
        return { success: false, error: "Unsupported provider" }
    }
  } catch (error) {
    console.error(`${provider} connection test error:`, error)
    return { success: false, error: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}