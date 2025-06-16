import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { exchangeOAuthCode } from "@/lib/crm-integrations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(new URL(`/dashboard/leads?error=${encodeURIComponent(error)}`, request.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/dashboard/leads?error=missing_parameters", request.url))
    }

    // Parse state to get userId and provider
    const stateData = JSON.parse(Buffer.from(state, "base64").toString())
    const { userId, provider, clientId } = stateData

    if (!userId || !provider || !clientId) {
      return NextResponse.redirect(new URL("/dashboard/leads?error=invalid_state", request.url))
    }

    // Get client secret from environment
    const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]
    if (!clientSecret) {
      return NextResponse.redirect(new URL("/dashboard/leads?error=missing_client_secret", request.url))
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/oauth`

    // Exchange code for tokens
    const tokenData = await exchangeOAuthCode(provider.toLowerCase(), code, clientId, clientSecret, redirectUri)

    // Store integration in database
    await client.crmIntegration.create({
      data: {
        userId,
        provider: provider.toUpperCase(),
        name: `${provider} Integration`,
        apiKey: tokenData.accessToken,
        apiSecret: tokenData.refreshToken,
        baseUrl: tokenData.instanceUrl,
        isActive: true,
        metadata: {
          expiresIn: tokenData.expiresIn,
          tokenType: "Bearer",
          connectedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.redirect(new URL("/dashboard/leads?success=crm_connected", request.url))
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(new URL(`/dashboard/leads?error=${encodeURIComponent("oauth_failed")}`, request.url))
  }
}
