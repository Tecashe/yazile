// app/api/crm/callback/zoho/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

interface ZohoTokenResponse {
  access_token: string
  refresh_token: string
  api_domain: string
  token_type: string
  expires_in: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")
    const location = searchParams.get("location") // Zoho data center location

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description")
      console.error("Zoho OAuth error:", error, errorDescription)
      return NextResponse.redirect(
        new URL(`/dashboard/leads?error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=missing_parameters", request.url)
      )
    }

    // Parse and validate state
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString())
    } catch {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=invalid_state", request.url)
      )
    }

    const { userId, clientId, dataCenter } = stateData

    if (!userId || !clientId) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=invalid_state", request.url)
      )
    }

    // Get Zoho client secret
    const clientSecret = process.env.ZOHO_CLIENT_SECRET
    if (!clientSecret) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=missing_client_secret", request.url)
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/zoho`
    
    // Determine the correct Zoho accounts domain based on data center
    const accountsDomain = getZohoAccountsDomain(dataCenter || location || "com")

    // Exchange authorization code for access token
    const tokenResponse = await fetch(`https://accounts.${accountsDomain}/oauth/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Zoho token exchange failed:", errorData)
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=token_exchange_failed", request.url)
      )
    }

    const tokenData: ZohoTokenResponse = await tokenResponse.json()

    // Get user info from Zoho
    const userInfoResponse = await fetch(`https://${tokenData.api_domain}/crm/v6/users?type=CurrentUser`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
      },
    })

    let userInfo = {}
    if (userInfoResponse.ok) {
      const userData = await userInfoResponse.json()
      userInfo = userData.users?.[0] || {}
    }

    // Store Zoho integration in database
    await client.crmIntegration.create({
      data: {
        userId,
        provider: "ZOHO",
        name: "Zoho CRM Integration",
        apiKey: tokenData.access_token,
        apiSecret: tokenData.refresh_token,
        baseUrl: `https://${tokenData.api_domain}/crm/v6`,
        isActive: true,
        metadata: {
          expiresIn: tokenData.expires_in,
          tokenType: tokenData.token_type,
          apiDomain: tokenData.api_domain,
          dataCenter: dataCenter || location || "com",
          accountsDomain,
          connectedAt: new Date().toISOString(),
          userInfo,
        },
      },
    })

    return NextResponse.redirect(
      new URL("/dashboard/leads?success=zoho_connected", request.url)
    )
  } catch (error) {
    console.error("Zoho OAuth callback error:", error)
    return NextResponse.redirect(
      new URL("/dashboard/leads?error=zoho_oauth_failed", request.url)
    )
  }
}

// Helper function to determine Zoho accounts domain based on data center
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