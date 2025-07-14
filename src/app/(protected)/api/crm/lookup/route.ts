import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    // const authHeader = request.headers.get("authorization")
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const customerEmail = searchParams.get("email")
    const customerPhone = searchParams.get("phone")
    const customerName = searchParams.get("name")
    const crmId = searchParams.get("crmId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // At least one search parameter must be provided
    if (!customerEmail && !customerPhone && !customerName && !crmId) {
      return NextResponse.json({ 
        error: "At least one search parameter (email, phone, name, or crmId) is required" 
      }, { status: 400 })
    }

    console.log(`🔍 CRM lookup request for user ${userId}`)

    // Get user's CRM integration
    const crmIntegration = await client.crmIntegration.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
    })

    if (!crmIntegration) {
      return NextResponse.json({
        error: "No active CRM integration found",
        requiresSetup: true,
      }, { status: 400 })
    }

    // First, try to find in our local database
    let localLead = null
    const whereClause: any = {}

    if (customerEmail) whereClause.email = customerEmail
    if (customerPhone) whereClause.phone = customerPhone
    if (customerName) whereClause.name = { contains: customerName, mode: 'insensitive' }

    if (Object.keys(whereClause).length > 0) {
      localLead = await client.lead.findFirst({
        where: whereClause,
        include: {
          qualificationData: true,
          interactions: {
            orderBy: { timestamp: "desc" },
            take: 5, // Get recent interactions
          },
        },
      })
    }

    // Search in CRM
    let crmData = null
    try {
      switch (crmIntegration.provider) {
        case "HUBSPOT":
          crmData = await searchHubSpotContact(
            { email: customerEmail, phone: customerPhone, name: customerName, crmId },
            crmIntegration
          )
          break
        case "SALESFORCE":
          crmData = await searchSalesforceContact(
            { email: customerEmail, phone: customerPhone, name: customerName, crmId },
            crmIntegration
          )
          break
        case "PIPEDRIVE":
          crmData = await searchPipedriveContact(
            { email: customerEmail, phone: customerPhone, name: customerName, crmId },
            crmIntegration
          )
          break
        default:
          console.warn(`Unsupported CRM provider: ${crmIntegration.provider}`)
      }
    } catch (crmError) {
      console.error(`❌ CRM search failed:`, crmError)
      // Continue with local data if CRM search fails
    }

    // Combine local and CRM data
    const customerData = {
      found: !!(localLead || crmData),
      isReturningCustomer: !!(localLead || crmData),
      source: localLead ? "local" : crmData ? "crm" : "none",
      
      // Customer basic info
      name: localLead?.name || crmData?.name || customerName,
      email: localLead?.email || crmData?.email || customerEmail,
      phone: localLead?.phone || crmData?.phone || customerPhone,
      
      // Lead/Customer status
      status: localLead?.status || crmData?.lastActivity,
      score: localLead?.score || crmData?.name,
      tier: localLead?.qualificationData?.leadTier || crmData?.phone,
      
      // CRM specific data
      crmId: crmData?.id || localLead?.metadata,
      crmProvider: crmIntegration.provider,
      
      // Interaction history (formatted for AI consumption)
      recentInteractions: localLead?.interactions?.map(interaction => ({
        date: interaction.timestamp,
        type: interaction.type,
        summary: interaction.content,
        sentiment: interaction.sentiment,
      })) || [],
      
      // Customer journey info
      firstContactDate: localLead?.createdAt || crmData?.createdAt,
      lastInteractionDate: localLead?.interactions?.[0]?.timestamp || crmData?.lastActivity,
      
      // Additional context for AI
      tags: localLead?.tags || crmData?.email || [],
      notes: crmData?.name || localLead?.qualificationData?.intentScore,
      
      // Formatted summary for AI agent
      aiSummary: generateAISummary(localLead, crmData),
      
      // Quick facts for agent
      quickFacts: generateQuickFacts(localLead, crmData),
    }

    console.log(`✅ Customer lookup completed for ${customerEmail || customerPhone || customerName}`)

    return NextResponse.json({
      success: true,
      customer: customerData,
      retrievedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("❌ CRM lookup error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      success: false 
    }, { status: 500 })
  }
}

// Helper function to generate AI-friendly summary
function generateAISummary(localLead: any, crmData: any) {
  const lead = localLead || crmData
  if (!lead) return "No previous customer data found."

  const parts = []
  
  if (lead.name) parts.push(`Customer name: ${lead.name}`)
  if (lead.status) parts.push(`Status: ${lead.status}`)
  if (lead.score) parts.push(`Lead score: ${lead.score}`)
  if (lead.tier) parts.push(`Tier: ${lead.tier}`)
  
  if (localLead?.interactions?.length > 0) {
    const lastInteraction = localLead.interactions[0]
    parts.push(`Last interaction: ${lastInteraction.type} on ${new Date(lastInteraction.timestamp).toLocaleDateString()}`)
    if (lastInteraction.summary) parts.push(`Summary: ${lastInteraction.summary}`)
  }
  
  if (lead.tags?.length > 0) {
    parts.push(`Tags: ${lead.tags.join(", ")}`)
  }
  
  return parts.join(". ")
}

// Helper function to generate quick facts
function generateQuickFacts(localLead: any, crmData: any) {
  const lead = localLead || crmData
  if (!lead) return []

  const facts = []
  
  if (lead.score >= 80) facts.push("High-value lead")
  if (lead.tier === "PLATINUM" || lead.tier === "GOLD") facts.push("Premium customer")
  if (localLead?.interactions?.length > 5) facts.push("Frequent contact")
  if (lead.estimatedValue) facts.push(`Est. value: $${lead.estimatedValue}`)
  
  return facts
}

// CRM Search Functions
async function searchHubSpotContact(searchParams: any, crmIntegration: any) {
  let accessToken = await getValidHubSpotToken(crmIntegration)
  
  let searchUrl = "https://api.hubapi.com/crm/v3/objects/contacts/search"
  
  // Build search query
  let searchBody: any = {
    limit: 1,
    properties: ["firstname", "lastname", "email", "phone", "lifecyclestage", "lead_status", "hs_lead_status", "notes", "createdate", "lastmodifieddate"]
  }

  if (searchParams.crmId) {
    searchUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${searchParams.crmId}`
    searchBody = { properties: searchBody.properties }
  } else {
    // Search by email, phone, or name
    const filters = []
    if (searchParams.email) {
      filters.push({
        propertyName: "email",
        operator: "EQ",
        value: searchParams.email
      })
    }
    if (searchParams.phone) {
      filters.push({
        propertyName: "phone",
        operator: "EQ",
        value: searchParams.phone
      })
    }
    if (searchParams.name) {
      filters.push({
        propertyName: "firstname",
        operator: "CONTAINS_TOKEN",
        value: searchParams.name.split(" ")[0]
      })
    }
    
    if (filters.length === 0) return null
    
    searchBody.filterGroups = [{
      filters: filters
    }]
  }

  const response = await fetch(searchUrl, {
    method: searchParams.crmId ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: searchParams.crmId ? undefined : JSON.stringify(searchBody),
  })

  if (!response.ok) {
    throw new Error(`HubSpot search failed: ${response.statusText}`)
  }

  const data = await response.json()
  const contact = searchParams.crmId ? data : data.results?.[0]
  
  if (!contact) return null

  return {
    id: contact.id,
    name: `${contact.properties.firstname || ""} ${contact.properties.lastname || ""}`.trim(),
    email: contact.properties.email,
    phone: contact.properties.phone,
    status: contact.properties.lead_status,
    tier: contact.properties.hs_lead_status,
    createdAt: contact.properties.createdate,
    lastActivity: contact.properties.lastmodifieddate,
    notes: contact.properties.notes,
  }
}

async function searchSalesforceContact(searchParams: any, crmIntegration: any) {
  let searchQuery = "SELECT Id, FirstName, LastName, Email, Phone, Status, CreatedDate, LastModifiedDate FROM Lead WHERE "
  const conditions = []
  
  if (searchParams.email) conditions.push(`Email = '${searchParams.email}'`)
  if (searchParams.phone) conditions.push(`Phone = '${searchParams.phone}'`)
  if (searchParams.name) conditions.push(`FirstName LIKE '%${searchParams.name}%' OR LastName LIKE '%${searchParams.name}%'`)
  if (searchParams.crmId) conditions.push(`Id = '${searchParams.crmId}'`)
  
  if (conditions.length === 0) return null
  
  searchQuery += conditions.join(" OR ") + " LIMIT 1"

  const response = await fetch(`${crmIntegration.baseUrl}/services/data/v57.0/query?q=${encodeURIComponent(searchQuery)}`, {
    headers: {
      Authorization: `Bearer ${crmIntegration.accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Salesforce search failed: ${response.statusText}`)
  }

  const data = await response.json()
  const lead = data.records?.[0]
  
  if (!lead) return null

  return {
    id: lead.Id,
    name: `${lead.FirstName || ""} ${lead.LastName || ""}`.trim(),
    email: lead.Email,
    phone: lead.Phone,
    status: lead.Status,
    createdAt: lead.CreatedDate,
    lastActivity: lead.LastModifiedDate,
  }
}

async function searchPipedriveContact(searchParams: any, crmIntegration: any) {
  let searchUrl = `${crmIntegration.baseUrl}/v1/persons/search?api_token=${crmIntegration.apiKey}`
  
  if (searchParams.email) {
    searchUrl += `&term=${encodeURIComponent(searchParams.email)}&fields=email`
  } else if (searchParams.phone) {
    searchUrl += `&term=${encodeURIComponent(searchParams.phone)}&fields=phone`
  } else if (searchParams.name) {
    searchUrl += `&term=${encodeURIComponent(searchParams.name)}&fields=name`
  } else if (searchParams.crmId) {
    searchUrl = `${crmIntegration.baseUrl}/v1/persons/${searchParams.crmId}?api_token=${crmIntegration.apiKey}`
  } else {
    return null
  }

  const response = await fetch(searchUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Pipedrive search failed: ${response.statusText}`)
  }

  const data = await response.json()
  const person = searchParams.crmId ? data.data : data.data?.items?.[0]?.item
  
  if (!person) return null

  return {
    id: person.id,
    name: person.name,
    email: person.email?.[0]?.value,
    phone: person.phone?.[0]?.value,
    createdAt: person.add_time,
    lastActivity: person.last_activity_date,
  }
}

// Helper function to get valid HubSpot token (reusing logic from sync route)
async function getValidHubSpotToken(crmIntegration: any) {
  let accessToken = crmIntegration.accessToken || crmIntegration.apiKey;
  let refreshToken = crmIntegration.refreshToken || crmIntegration.apiSecret;

  // Check if token needs refresh
  if (crmIntegration.tokenExpiresAt && new Date() > new Date(crmIntegration.tokenExpiresAt)) {
    accessToken = await refreshHubSpotToken(crmIntegration, refreshToken);
  }

  if (!accessToken && refreshToken) {
    accessToken = await refreshHubSpotToken(crmIntegration, refreshToken);
  }

  if (!accessToken) {
    throw new Error("HubSpot access token is missing");
  }

  return accessToken;
}

async function refreshHubSpotToken(crmIntegration: any, refreshToken: string) {
  if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_CLIENT_SECRET) {
    throw new Error("HubSpot OAuth credentials not configured");
  }

  const tokenResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to refresh HubSpot token");
  }

  const tokenData = await tokenResponse.json();
  
  // Update database
  await client.crmIntegration.update({
    where: { id: crmIntegration.id },
    data: {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      tokenExpiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
    },
  });

  return tokenData.access_token;
}