// app/api/crm/callback/salesforce/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

interface SalesforceTokenResponse {
  access_token: string
  refresh_token: string
  instance_url: string
  id: string
  token_type: string
  issued_at: string
  signature: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description")
      console.error("Salesforce OAuth error:", error, errorDescription)
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

    const { userId, clientId, instanceUrl } = stateData

    if (!userId || !clientId) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=invalid_state", request.url)
      )
    }

    // Get Salesforce client secret
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET
    if (!clientSecret) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=missing_client_secret", request.url)
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/salesforce`
    
    // Determine the login URL (production vs sandbox)
    const loginUrl = instanceUrl || "https://login.salesforce.com"

    // Exchange authorization code for access token
    const tokenResponse = await fetch(`${loginUrl}/services/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
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
      console.error("Salesforce token exchange failed:", errorData)
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=token_exchange_failed", request.url)
      )
    }

    const tokenData: SalesforceTokenResponse = await tokenResponse.json()

    // Get user info from Salesforce
    const userInfoResponse = await fetch(`${tokenData.instance_url}/services/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    let userInfo = {}
    if (userInfoResponse.ok) {
      userInfo = await userInfoResponse.json()
    }

    // Store Salesforce integration in database
    await client.crmIntegration.create({
      data: {
        userId,
        provider: "SALESFORCE",
        name: "Salesforce Integration",
        apiKey: tokenData.access_token,
        apiSecret: tokenData.refresh_token,
        baseUrl: tokenData.instance_url,
        isActive: true,
        metadata: {
          tokenType: tokenData.token_type,
          issuedAt: tokenData.issued_at,
          signature: tokenData.signature,
          identityUrl: tokenData.id,
          connectedAt: new Date().toISOString(),
          userInfo,
          loginUrl,
        },
      },
    })

    return NextResponse.redirect(
      new URL("/dashboard/leads?success=salesforce_connected", request.url)
    )
  } catch (error) {
    console.error("Salesforce OAuth callback error:", error)
    return NextResponse.redirect(
      new URL("/dashboard/leads?error=salesforce_oauth_failed", request.url)
    )
  }
}