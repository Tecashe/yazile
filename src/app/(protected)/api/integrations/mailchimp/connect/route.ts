import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { encryptCredentials } from "@/lib/encrypt"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { apiKey, serverPrefix } = await request.json()

    if (!apiKey || !serverPrefix) {
      return NextResponse.json({ error: "Missing required Mailchimp credentials" }, { status: 400 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Test Mailchimp connection
    try {
      const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/ping`, {
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid Mailchimp credentials" }, { status: 400 })
    }

    // Encrypt credentials
    const credentials = { apiKey, serverPrefix }
    const { encrypted, hash } = encryptCredentials(credentials)

    // Upsert integration
    const integration = await client.integration.upsert({
      where: {
        tenantId_type: {
          tenantId: tenant.id,
          type: "MAILCHIMP",
        },
      },
      update: {
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
        lastErrorAt: null,
        lastError: null,
      },
      create: {
        tenantId: tenant.id,
        type: "MAILCHIMP",
        name: "Mailchimp",
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration })
  } catch (error) {
    console.error("Mailchimp connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
