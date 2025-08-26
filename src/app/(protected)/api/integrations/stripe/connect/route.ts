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

    const { publishableKey, secretKey, webhookSecret } = await request.json()

    if (!publishableKey || !secretKey) {
      return NextResponse.json({ error: "Missing required Stripe credentials" }, { status: 400 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Test Stripe connection
    const stripe = require("stripe")(secretKey)
    try {
      await stripe.accounts.retrieve()
    } catch (error) {
      return NextResponse.json({ error: "Invalid Stripe credentials" }, { status: 400 })
    }

    // Encrypt credentials
    const credentials = {
      publishableKey,
      secretKey,
      webhookSecret: webhookSecret || null,
    }
    const { encrypted, hash } = encryptCredentials(credentials)

    // Upsert integration
    const integration = await client.integration.upsert({
      where: {
        tenantId_type: {
          tenantId: tenant.id,
          type: "STRIPE",
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
        type: "STRIPE",
        name: "Stripe",
        encryptedCredentials: encrypted,
        credentialsHash: hash,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration })
  } catch (error) {
    console.error("Stripe connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
