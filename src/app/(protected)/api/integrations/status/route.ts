import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tenant
    const tenant = await client.tenant.findUnique({
      where: { userId },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get all integrations for this tenant
    const integrations = await client.integration.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
      },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        lastSyncAt: true,
        lastErrorAt: true,
        lastError: true,
        createdAt: true,
      },
    })

    // Group integrations by category
    const socialMedia = integrations.filter((i) => ["INSTAGRAM", "WHATSAPP"].includes(i.type))
    const crm = integrations.filter((i) => ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"].includes(i.type))
    const payments = integrations.filter((i) => ["STRIPE"].includes(i.type))
    const messaging = integrations.filter((i) => ["MAILCHIMP", "SENDGRID", "TWILIO", "SLACK"].includes(i.type))
    const automation = integrations.filter((i) => ["ZAPIER", "WEBHOOK"].includes(i.type))

    return NextResponse.json({
      categories: {
        socialMedia: {
          connected: socialMedia.length > 0,
          count: socialMedia.length,
          integrations: socialMedia,
        },
        crm: {
          connected: crm.length > 0,
          count: crm.length,
          integrations: crm,
        },
        payments: {
          connected: payments.length > 0,
          count: payments.length,
          integrations: payments,
        },
        messaging: {
          connected: messaging.length > 0,
          count: messaging.length,
          integrations: messaging,
        },
        automation: {
          connected: automation.length > 0,
          count: automation.length,
          integrations: automation,
        },
      },
      total: integrations.length,
    })
  } catch (error) {
    console.error("Integration status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
