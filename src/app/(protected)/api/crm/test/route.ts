import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { CRMIntegrationManager } from "@/lib/crm-integrations"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const crmManager = new CRMIntegrationManager(userId)
    const config = await crmManager.getCRMConfig()

    if (!config) {
      return NextResponse.json({ error: "No CRM integration found" }, { status: 404 })
    }

    // Test the connection based on provider
    let testResult = false

    switch (config.provider) {
      case "HUBSPOT":
        const hubspotResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
          },
        })
        testResult = hubspotResponse.ok
        break

      case "SALESFORCE":
        if (!config.baseUrl) {
          return NextResponse.json({ error: "Salesforce instance URL not configured" }, { status: 400 })
        }
        const salesforceResponse = await fetch(`${config.baseUrl}/services/data/v57.0/sobjects/Lead?limit=1`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
          },
        })
        testResult = salesforceResponse.ok
        break

      case "PIPEDRIVE":
        if (!config.baseUrl) {
          return NextResponse.json({ error: "Pipedrive base URL not configured" }, { status: 400 })
        }
        const pipedriveResponse = await fetch(`${config.baseUrl}/api/v1/persons?limit=1&api_token=${config.apiKey}`)
        testResult = pipedriveResponse.ok
        break

      default:
        return NextResponse.json({ error: "Unsupported CRM provider" }, { status: 400 })
    }

    if (testResult) {
      // Update last tested timestamp
      await client.crmIntegration.updateMany({
        where: { userId, isActive: true },
        data: { lastSynced: new Date() },
      })
    }

    return NextResponse.json({ success: testResult })
  } catch (error) {
    console.error("CRM test error:", error)
    return NextResponse.json({ error: "Connection test failed" }, { status: 500 })
  }
}
