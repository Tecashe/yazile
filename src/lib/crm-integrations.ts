import { client } from "@/lib/prisma"
import type { CrmProvider } from "@prisma/client"

// CRM Integration Types
export interface CRMConfig {
  provider: CrmProvider
  apiKey: string
  apiSecret?: string
  baseUrl?: string
  isActive: boolean
}

export interface CRMContact {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  leadSource?: string
  leadStatus?: string
  dealValue?: number
  notes?: string
  customFields?: Record<string, any>
}

/**
 * HubSpot CRM Integration
 */
export class HubSpotIntegration {
  private apiKey: string
  private baseUrl = "https://api.hubapi.com"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createContact(contact: CRMContact): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            firstname: contact.firstName,
            lastname: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            jobtitle: contact.jobTitle,
            hs_lead_status: contact.leadStatus || "NEW",
            lifecyclestage: "lead",
            ...contact.customFields,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating HubSpot contact:", error)
      throw error
    }
  }

  async createDeal(deal: {
    contactId: string
    dealName: string
    amount: number
    pipeline?: string
    stage?: string
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/deals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            dealname: deal.dealName,
            amount: deal.amount,
            dealstage: deal.stage || "appointmentscheduled",
            pipeline: deal.pipeline || "default",
          },
          associations: [
            {
              to: { id: deal.contactId },
              types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`HubSpot Deal API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating HubSpot deal:", error)
      throw error
    }
  }
}

/**
 * Salesforce CRM Integration
 */
export class SalesforceIntegration {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async createLead(lead: CRMContact): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/services/data/v57.0/sobjects/Lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          FirstName: lead.firstName,
          LastName: lead.lastName || "Unknown",
          Email: lead.email,
          Phone: lead.phone,
          Company: lead.company || "Unknown",
          Title: lead.jobTitle,
          LeadSource: lead.leadSource || "Instagram",
          Status: lead.leadStatus || "Open - Not Contacted",
        }),
      })

      if (!response.ok) {
        throw new Error(`Salesforce API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating Salesforce lead:", error)
      throw error
    }
  }
}

/**
 * Pipedrive CRM Integration
 */
export class PipedriveIntegration {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async createPerson(person: CRMContact): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/persons?api_token=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${person.firstName || ""} ${person.lastName || ""}`.trim(),
          email: [{ value: person.email, primary: true }],
          phone: [{ value: person.phone, primary: true }],
          org_name: person.company,
        }),
      })

      if (!response.ok) {
        throw new Error(`Pipedrive API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating Pipedrive person:", error)
      throw error
    }
  }

  async createDeal(deal: {
    personId: number
    title: string
    value: number
    currency?: string
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/deals?api_token=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: deal.title,
          value: deal.value,
          currency: deal.currency || "USD",
          person_id: deal.personId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Pipedrive Deal API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating Pipedrive deal:", error)
      throw error
    }
  }
}

/**
 * CRM Integration Manager
 */
export class CRMIntegrationManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async getCRMConfig(): Promise<CRMConfig | null> {
    try {
      const config = await client.crmIntegration.findFirst({
        where: { userId: this.userId, isActive: true },
      })

      if (!config) return null

      return {
        provider: config.provider,
        apiKey: config.apiKey,
        apiSecret: config.apiSecret || undefined,
        baseUrl: config.baseUrl || undefined,
        isActive: config.isActive,
      }
    } catch (error) {
      console.error("Error getting CRM config:", error)
      return null
    }
  }

  async syncLeadToCRM(leadId: string): Promise<{ success: boolean; crmId?: string; error?: string }> {
    try {
      const lead = await client.lead.findUnique({
        where: { id: leadId },
        include: { qualificationData: true },
      })

      if (!lead) {
        return { success: false, error: "Lead not found" }
      }

      const crmConfig = await this.getCRMConfig()
      if (!crmConfig) {
        return { success: false, error: "No active CRM integration found" }
      }

      const contact: CRMContact = {
        firstName: lead.name?.split(" ")[0] || "Unknown",
        lastName: lead.name?.split(" ").slice(1).join(" ") || "",
        email: lead.email || undefined,
        phone: lead.phone || undefined,
        leadSource: "Instagram Lead Qualification System",
        leadStatus: this.mapLeadStatus(lead.status),
        dealValue: Number(lead.qualificationData?.estimatedValue || 0),
        notes: `Lead Score: ${lead.score}\nTier: ${lead.qualificationData?.leadTier || "Unknown"}\nSource: ${lead.source}`,
        customFields: {
          lead_score: lead.score,
          lead_tier: lead.qualificationData?.leadTier,
          instagram_user_id: lead.instagramUserId,
          qualification_date: lead.qualifiedDate?.toISOString(),
        },
      }

      let crmResult: any
      let crmId: string

      switch (crmConfig.provider) {
        case "HUBSPOT":
          const hubspot = new HubSpotIntegration(crmConfig.apiKey)
          crmResult = await hubspot.createContact(contact)
          crmId = crmResult.id

          // Create deal if lead is qualified
          if (lead.status === "QUALIFIED" && contact.dealValue && contact.dealValue > 0) {
            await hubspot.createDeal({
              contactId: crmId,
              dealName: `Instagram Lead - ${contact.firstName} ${contact.lastName}`,
              amount: contact.dealValue,
            })
          }
          break

        case "SALESFORCE":
          if (!crmConfig.baseUrl) {
            return { success: false, error: "Salesforce instance URL not configured" }
          }
          const salesforce = new SalesforceIntegration(crmConfig.apiKey, crmConfig.baseUrl)
          crmResult = await salesforce.createLead(contact)
          crmId = crmResult.id
          break

        case "PIPEDRIVE":
          if (!crmConfig.baseUrl) {
            return { success: false, error: "Pipedrive base URL not configured" }
          }
          const pipedrive = new PipedriveIntegration(crmConfig.apiKey, crmConfig.baseUrl)
          const personResult = await pipedrive.createPerson(contact)
          crmId = personResult.data.id

          // Create deal if lead is qualified
          if (lead.status === "QUALIFIED" && contact.dealValue && contact.dealValue > 0) {
            await pipedrive.createDeal({
              personId: Number.parseInt(crmId),
              title: `Instagram Lead - ${contact.firstName} ${contact.lastName}`,
              value: contact.dealValue,
            })
          }
          break

        default:
          return { success: false, error: `Unsupported CRM provider: ${crmConfig.provider}` }
      }

      // Update lead with CRM sync info
      await client.lead.update({
        where: { id: leadId },
        data: {
          metadata: {
            ...((lead.metadata as Record<string, any>) || {}),
            crmSync: {
              provider: crmConfig.provider,
              syncedAt: new Date().toISOString(),
              crmId: crmId,
            },
          },
          updatedAt: new Date(),
        },
      })

      console.log(`✅ Lead ${leadId} synced to ${crmConfig.provider} CRM with ID: ${crmId}`)

      return { success: true, crmId }
    } catch (error) {
      console.error("Error syncing lead to CRM:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async bulkSyncLeadsToCRM(leadIds: string[]): Promise<{
    success: number
    failed: number
    results: Array<{ leadId: string; success: boolean; crmId?: string; error?: string }>
  }> {
    const results = []
    let successCount = 0
    let failedCount = 0

    for (const leadId of leadIds) {
      try {
        const result = await this.syncLeadToCRM(leadId)
        results.push({ leadId, ...result })

        if (result.success) {
          successCount++
        } else {
          failedCount++
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        results.push({
          leadId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        failedCount++
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      results,
    }
  }

  private mapLeadStatus(status: string): string {
    const statusMap: Record<string, string> = {
      NEW: "New",
      QUALIFYING: "Working - Contacted",
      QUALIFIED: "Open - Not Contacted",
      CONVERTED: "Closed - Converted",
      LOST: "Closed - Not Converted",
      DISQUALIFIED: "Closed - Not Converted",
      NURTURING: "Working - Contacted",
    }

    return statusMap[status] || "New"
  }
}

/**
 * OAuth URL generators for CRM integrations
 */
export function getHubSpotOAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const scopes = ["crm.objects.contacts.write", "crm.objects.deals.write", "crm.objects.companies.write"]
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    response_type: "code",
    state: state,
  })

  return `https://app.hubspot.com/oauth/authorize?${params.toString()}`
}

export function getSalesforceOAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: "api refresh_token",
  })

  return `https://login.salesforce.com/services/oauth2/authorize?${params.toString()}`
}

export function getPipedriveOAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state: state,
  })

  return `https://oauth.pipedrive.com/oauth/authorize?${params.toString()}`
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeOAuthCode(
  provider: string,
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<{
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  instanceUrl?: string
}> {
  let tokenUrl: string
  let body: Record<string, string>

  switch (provider) {
    case "hubspot":
      tokenUrl = "https://api.hubapi.com/oauth/v1/token"
      body = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      }
      break

    case "salesforce":
      tokenUrl = "https://login.salesforce.com/services/oauth2/token"
      body = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      }
      break

    case "pipedrive":
      tokenUrl = "https://oauth.pipedrive.com/oauth/token"
      body = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      }
      break

    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`)
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  })

  if (!response.ok) {
    throw new Error(`OAuth token exchange failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    instanceUrl: data.instance_url, // For Salesforce
  }
}
