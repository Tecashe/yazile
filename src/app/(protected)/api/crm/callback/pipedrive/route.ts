// app/api/crm/callback/pipedrive/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

interface PipedriveTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  scope: string
  expires_in: number
  api_domain: string
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
      console.error("Pipedrive OAuth error:", error, errorDescription)
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

    const { userId, clientId } = stateData

    if (!userId || !clientId) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=invalid_state", request.url)
      )
    }

    // Get Pipedrive client secret
    const clientSecret = process.env.PIPEDRIVE_CLIENT_SECRET
    if (!clientSecret) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=missing_client_secret", request.url)
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/pipedrive`

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth.pipedrive.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Pipedrive token exchange failed:", errorData)
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=token_exchange_failed", request.url)
      )
    }

    const tokenData: PipedriveTokenResponse = await tokenResponse.json()

    // Get user info from Pipedrive API
    const userInfoResponse = await fetch(`https://${tokenData.api_domain}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    let userInfo = {}
    if (userInfoResponse.ok) {
      const userData = await userInfoResponse.json()
      userInfo = userData.data
    }

    // Store Pipedrive integration in database
    await client.crmIntegration.create({
      data: {
        userId,
        provider: "PIPEDRIVE",
        name: "Pipedrive Integration",
        apiKey: tokenData.access_token,
        apiSecret: tokenData.refresh_token,
        baseUrl: `https://${tokenData.api_domain}/api/v1`,
        isActive: true,
        metadata: {
          expiresIn: tokenData.expires_in,
          tokenType: tokenData.token_type,
          scope: tokenData.scope,
          apiDomain: tokenData.api_domain,
          connectedAt: new Date().toISOString(),
          userInfo,
        },
      },
    })

    return NextResponse.redirect(
      new URL("/dashboard/leads?success=pipedrive_connected", request.url)
    )
  } catch (error) {
    console.error("Pipedrive OAuth callback error:", error)
    return NextResponse.redirect(
      new URL("/dashboard/leads?error=pipedrive_oauth_failed", request.url)
    )
  }
}