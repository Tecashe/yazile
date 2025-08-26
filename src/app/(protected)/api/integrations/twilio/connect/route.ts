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

    const { accountSid, authToken, phoneNumber } = await request.json()

    if (!accountSid || !authToken) {
      return NextResponse.json({ error: "Missing required Twilio credentials" }, { status: 400 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Test Twilio connection
    try {
      const twilio = require("twilio")(accountSid, authToken)
      await twilio.api.accounts(accountSid).fetch()
    } catch (error) {
      return NextResponse.json({ error: "Invalid Twilio credentials" }, { status: 400 })
    }

    // Encrypt credentials
    const credentials = { accountSid, authToken, phoneNumber: phoneNumber || null }
    const { encrypted, hash } = encryptCredentials(credentials)

    // Upsert integration
    const integration = await client.integration.upsert({
      where: {
        tenantId_type: {
          tenantId: tenant.id,
          type: "TWILIO",
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
        type: "TWILIO",
        name: "Twilio",
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration })
  } catch (error) {
    console.error("Twilio connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
