// // app/api/crm/callback/hubspot/route.ts
// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"

// interface HubSpotTokenResponse {
//   access_token: string
//   refresh_token: string
//   expires_in: number
//   token_type: string
//   hub_domain?: string
//   hub_id?: number
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const code = searchParams.get("code")
//     const state = searchParams.get("state")
//     const error = searchParams.get("error")

//     // Handle OAuth errors
//     if (error) {
//       const errorDescription = searchParams.get("error_description")
//       console.error("HubSpot OAuth error:", error, errorDescription)
//       return NextResponse.redirect(
//         new URL(`/dashboard/leads?error=${encodeURIComponent(error)}`, request.url)
//       )
//     }

//     if (!code || !state) {
//       return NextResponse.redirect(
//         new URL("/dashboard/leads?error=missing_parameters", request.url)
//       )
//     }

//     // Parse and validate state
//     let stateData
//     try {
//       stateData = JSON.parse(Buffer.from(state, "base64").toString())
//     } catch {
//       return NextResponse.redirect(
//         new URL("/dashboard/leads?error=invalid_state", request.url)
//       )
//     }

//     const { userId, clientId } = stateData

//     if (!userId || !clientId) {
//       return NextResponse.redirect(
//         new URL("/dashboard/leads?error=invalid_state", request.url)
//       )
//     }

//     // Get HubSpot client secret
//     const clientSecret = process.env.HUBSPOT_CLIENT_SECRET
//     if (!clientSecret) {
//       return NextResponse.redirect(
//         new URL("/dashboard/leads?error=missing_client_secret", request.url)
//       )
//     }

//     const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/hubspot`

//     // Exchange authorization code for access token
//     const tokenResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "authorization_code",
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: redirectUri,
//         code,
//       }),
//     })

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json()
//       console.error("HubSpot token exchange failed:", errorData)
//       return NextResponse.redirect(
//         new URL("/dashboard/leads?error=token_exchange_failed", request.url)
//       )
//     }

//     const tokenData: HubSpotTokenResponse = await tokenResponse.json()

//     // Get account info to store additional metadata
//     const accountResponse = await fetch("https://api.hubapi.com/oauth/v1/access-tokens/" + tokenData.access_token, {
//       headers: {
//         Authorization: `Bearer ${tokenData.access_token}`,
//       },
//     })

//     let accountInfo = {}
//     if (accountResponse.ok) {
//       accountInfo = await accountResponse.json()
//     }

//     // Store HubSpot integration in database
//     await client.crmIntegration.create({
//       data: {
//         userId,
//         provider: "HUBSPOT",
//         name: "HubSpot Integration",
//         apiKey: tokenData.access_token,
//         apiSecret: tokenData.refresh_token,
//         baseUrl: "https://api.hubapi.com",
//         isActive: true,
//         metadata: {
//           expiresIn: tokenData.expires_in,
//           tokenType: tokenData.token_type,
//           hubDomain: tokenData.hub_domain,
//           hubId: tokenData.hub_id,
//           connectedAt: new Date().toISOString(),
//           accountInfo,
//         },
//       },
//     })

//     return NextResponse.redirect(
//       new URL("/dashboard/leads?success=hubspot_connected", request.url)
//     )
//   } catch (error) {
//     console.error("HubSpot OAuth callback error:", error)
//     return NextResponse.redirect(
//       new URL("/dashboard/leads?error=hubspot_oauth_failed", request.url)
//     )
//   }
// }








// app/api/crm/callback/hubspot/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

interface HubSpotTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  hub_domain?: string
  hub_id?: number
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
      console.error("HubSpot OAuth error:", error, errorDescription)
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

    // Get HubSpot client secret
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET
    if (!clientSecret) {
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=missing_client_secret", request.url)
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/crm/callback/hubspot`

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
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
      console.error("HubSpot token exchange failed:", errorData)
      return NextResponse.redirect(
        new URL("/dashboard/leads?error=token_exchange_failed", request.url)
      )
    }

    const tokenData: HubSpotTokenResponse = await tokenResponse.json()

    // Get account info to store additional metadata
    const accountResponse = await fetch("https://api.hubapi.com/oauth/v1/access-tokens/" + tokenData.access_token, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    let accountInfo = {}
    if (accountResponse.ok) {
      accountInfo = await accountResponse.json()
    }

    // Store HubSpot integration in database with correct field names
    await client.crmIntegration.create({
      data: {
        userId,
        provider: "HUBSPOT",
        name: "HubSpot Integration",
        apiKey: tokenData.access_token,  // Store access token as apiKey for schema compatibility
        apiSecret: tokenData.refresh_token, // Store refresh token as apiSecret for schema compatibility
        accessToken: tokenData.access_token,  // Also store as accessToken for OAuth logic
        refreshToken: tokenData.refresh_token, // Also store as refreshToken for OAuth logic
        baseUrl: "https://api.hubapi.com",
        isActive: true,
        metadata: {
          expiresIn: tokenData.expires_in,
          tokenType: tokenData.token_type,
          hubDomain: tokenData.hub_domain,
          hubId: tokenData.hub_id,
          connectedAt: new Date().toISOString(),
          accountInfo,
          connectionType: "oauth",
        },
      },
    })

    return NextResponse.redirect(
      new URL("/dashboard/leads?success=hubspot_connected", request.url)
    )
  } catch (error) {
    console.error("HubSpot OAuth callback error:", error)
    return NextResponse.redirect(
      new URL("/dashboard/leads?error=hubspot_oauth_failed", request.url)
    )
  }
}