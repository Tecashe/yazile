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

    const { botToken, signingSecret, webhookUrl } = await request.json()

    if (!botToken) {
      return NextResponse.json({ error: "Missing Slack bot token" }, { status: 400 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Test Slack connection
    try {
      const response = await fetch("https://slack.com/api/auth.test", {
        headers: {
          Authorization: `Bearer ${botToken}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      if (!data.ok) {
        throw new Error("Invalid token")
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid Slack bot token" }, { status: 400 })
    }

    // Encrypt credentials
    const credentials = {
      botToken,
      signingSecret: signingSecret || null,
      webhookUrl: webhookUrl || null,
    }
    const { encrypted, hash } = encryptCredentials(credentials)

    // Upsert integration
    const integration = await client.integration.upsert({
      where: {
        tenantId_type: {
          tenantId: tenant.id,
          type: "SLACK",
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
        type: "SLACK",
        name: "Slack",
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration })
  } catch (error) {
    console.error("Slack connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
