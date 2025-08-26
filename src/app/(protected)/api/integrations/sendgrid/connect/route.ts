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

    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "Missing SendGrid API key" }, { status: 400 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Test SendGrid connection
    try {
      const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid SendGrid API key" }, { status: 400 })
    }

    // Encrypt credentials
    const credentials = { apiKey }
    const { encrypted, hash } = encryptCredentials(credentials)

    // Upsert integration
    const integration = await client.integration.upsert({
      where: {
        tenantId_type: {
          tenantId: tenant.id,
          type: "SENDGRID",
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
        type: "SENDGRID",
        name: "SendGrid",
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration })
  } catch (error) {
    console.error("SendGrid connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
