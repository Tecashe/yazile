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

    const { webhookUrl, secret, headers } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Missing webhook URL" }, { status: 400 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Test webhook URL
    try {
      const testPayload = { test: true, timestamp: new Date().toISOString() }
      const customHeaders = headers ? JSON.parse(headers) : {}

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...customHeaders,
        },
        body: JSON.stringify(testPayload),
      })

      if (!response.ok && response.status !== 200) {
        throw new Error("Webhook test failed")
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid webhook URL or connection failed" }, { status: 400 })
    }

    // Encrypt credentials
    const credentials = {
      webhookUrl,
      secret: secret || null,
      headers: headers || null,
    }
    const { encrypted, hash } = encryptCredentials(credentials)

    // Upsert integration
    const integration = await client.integration.upsert({
      where: {
        tenantId_type: {
          tenantId: tenant.id,
          type: "WEBHOOK",
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
        type: "WEBHOOK",
        name: "Custom Webhook",
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration })
  } catch (error) {
    console.error("Webhook connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
