import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { leadId, userId, leadData, forceSync } = body

    console.log(`🔄 CRM sync request for lead ${leadId}`)

    // Get lead with full data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          take: 1,
          orderBy: { timestamp: "desc" },
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Get user's CRM integration
    const crmIntegration = await client.crmIntegration.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
    })

    if (!crmIntegration) {
      return NextResponse.json(
        {
          error: "No active CRM integration found",
          requiresSetup: true,
        },
        { status: 400 },
      )
    }

    // Prepare CRM data
    const crmData = {
      leadId: lead.id,
      name: lead.name || `Instagram User ${lead.instagramUserId}`,
      email: lead.email,
      phone: lead.phone,
      source: "Instagram",
      status: leadData.stage || lead.status,
      score: leadData.score || lead.score,
      leadTier: leadData.tier,
      estimatedValue: leadData.revenueData?.estimatedValue,
      lastInteraction: leadData.lastInteraction,
      tags: [`Score:${lead.score}`, `Tier:${leadData.tier}`, ...lead.tags],
    }

    // Sync to CRM based on provider
    let syncResult
    try {
      switch (crmIntegration.provider) {
        case "HUBSPOT":
          syncResult = await syncToHubSpot(crmData, crmIntegration)
          break
        case "SALESFORCE":
          syncResult = await syncToSalesforce(crmData, crmIntegration)
          break
        case "PIPEDRIVE":
          syncResult = await syncToPipedrive(crmData, crmIntegration)
          break
        default:
          throw new Error(`Unsupported CRM provider: ${crmIntegration.provider}`)
      }

      // Update lead with sync info
      await client.lead.update({
        where: { id: leadId },
        data: {
          metadata: {
            ...((lead.metadata as any) || {}),
            crmSyncData: {
              syncedAt: new Date().toISOString(),
              crmId: syncResult.crmId,
              provider: crmIntegration.provider,
              syncStatus: "success",
            },
          },
        },
      })

      console.log(`✅ Lead ${leadId} synced to ${crmIntegration.provider}`)

      return NextResponse.json({
        success: true,
        crmId: syncResult.crmId,
        provider: crmIntegration.provider,
        syncedAt: new Date().toISOString(),
      })
    } catch (syncError) {
      console.error(`❌ CRM sync failed:`, syncError)

      // Update lead with error info
      await client.lead.update({
        where: { id: leadId },
        data: {
          metadata: {
            ...((lead.metadata as any) || {}),
            crmSyncData: {
              syncedAt: new Date().toISOString(),
              provider: crmIntegration.provider,
              syncStatus: "failed",
              error: syncError instanceof Error ? syncError.message : "Unknown error",
            },
          },
        },
      })

      return NextResponse.json(
        {
          success: false,
          error: syncError instanceof Error ? syncError.message : "CRM sync failed",
          provider: crmIntegration.provider,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ CRM sync webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// CRM sync functions (simplified versions)
async function syncToHubSpot(crmData: any, crmIntegration: any) {
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${crmIntegration.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        firstname: crmData.name.split(" ")[0] || "",
        lastname: crmData.name.split(" ").slice(1).join(" ") || "",
        email: crmData.email || "",
        phone: crmData.phone || "",
        lifecyclestage: "lead",
        lead_status: crmData.status,
        hs_lead_status: crmData.leadTier,
        lead_score: crmData.score,
        estimated_value: crmData.estimatedValue,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`HubSpot sync failed: ${response.statusText}`)
  }

  const contact = await response.json()
  return { crmId: contact.id, provider: "HUBSPOT" }
}

async function syncToSalesforce(crmData: any, crmIntegration: any) {
  const response = await fetch(`${crmIntegration.baseUrl}/services/data/v57.0/sobjects/Lead`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${crmIntegration.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FirstName: crmData.name.split(" ")[0] || "",
      LastName: crmData.name.split(" ").slice(1).join(" ") || "Unknown",
      Email: crmData.email || "",
      Phone: crmData.phone || "",
      Status: "Open - Not Contacted",
      LeadSource: crmData.source,
      Lead_Score__c: crmData.score,
    }),
  })

  if (!response.ok) {
    throw new Error(`Salesforce sync failed: ${response.statusText}`)
  }

  const lead = await response.json()
  return { crmId: lead.id, provider: "SALESFORCE" }
}

async function syncToPipedrive(crmData: any, crmIntegration: any) {
  const response = await fetch(`${crmIntegration.baseUrl}/v1/persons?api_token=${crmIntegration.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: crmData.name,
      email: [{ value: crmData.email, primary: true }],
      phone: [{ value: crmData.phone, primary: true }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Pipedrive sync failed: ${response.statusText}`)
  }

  const person = await response.json()
  return { crmId: person.data.id, provider: "PIPEDRIVE" }
}
