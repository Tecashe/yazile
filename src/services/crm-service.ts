import { client } from "@/lib/prisma"
import type { CrmIntegration, CrmProvider } from "@prisma/client"

interface CreateIntegrationParams {
  userId: string
  provider: CrmProvider
  name: string
  apiKey: string
  apiSecret?: string
  baseUrl?: string
}

interface SyncLeadParams {
  leadId: string
  integrationId: string
}

/**
 * Service for managing CRM integrations
 */
export class CrmService {
  /**
   * Create a new CRM integration
   */
  async createIntegration(params: CreateIntegrationParams): Promise<CrmIntegration> {
    const { userId, provider, name, apiKey, apiSecret, baseUrl } = params

    // Validate the integration by testing the API
    const isValid = await this.testIntegration(provider, apiKey, apiSecret, baseUrl)
    if (!isValid) {
      throw new Error("Could not connect to CRM with the provided credentials")
    }

    // Create the integration in the database
    const integration = await client.crmIntegration.create({
      data: {
        userId,
        provider,
        name,
        apiKey,
        apiSecret,
        baseUrl,
      },
    })

    // Create default field mappings based on the provider
    await this.createDefaultMappings(integration.id, provider)

    return integration
  }

  /**
   * Test a CRM integration
   */
  async testIntegration(provider: CrmProvider, apiKey: string, apiSecret?: string, baseUrl?: string): Promise<boolean> {
    try {
      // Implementation depends on the CRM provider
      switch (provider) {
        case "HUBSPOT":
          return await this.testHubspotIntegration(apiKey)
        case "SALESFORCE":
          return await this.testSalesforceIntegration(apiKey, apiSecret)
        case "ZOHO":
          return await this.testZohoIntegration(apiKey, apiSecret, baseUrl)
        case "PIPEDRIVE":
          return await this.testPipedriveIntegration(apiKey)
        case "AIRTABLE":
          return await this.testAirtableIntegration(apiKey, baseUrl)
        case "NOTION":
          return await this.testNotionIntegration(apiKey)
        default:
          return false
      }
    } catch (error) {
      console.error(`Error testing ${provider} integration:`, error)
      return false
    }
  }

  /**
   * Create default field mappings for a CRM integration
   */
  async createDefaultMappings(integrationId: string, provider: CrmProvider): Promise<void> {
    // Default mappings depend on the CRM provider
    const mappings: { localField: string; remoteField: string; isRequired: boolean }[] = []

    switch (provider) {
      case "HUBSPOT":
        mappings.push(
          { localField: "name", remoteField: "firstname", isRequired: true },
          { localField: "email", remoteField: "email", isRequired: true },
          { localField: "phone", remoteField: "phone", isRequired: false },
          { localField: "score", remoteField: "lead_score", isRequired: false },
          { localField: "status", remoteField: "lifecyclestage", isRequired: true },
        )
        break
      case "SALESFORCE":
        mappings.push(
          { localField: "name", remoteField: "Name", isRequired: true },
          { localField: "email", remoteField: "Email", isRequired: true },
          { localField: "phone", remoteField: "Phone", isRequired: false },
          { localField: "score", remoteField: "Lead_Score__c", isRequired: false },
          { localField: "status", remoteField: "Status", isRequired: true },
        )
        break
      // Add mappings for other providers
      default:
        mappings.push(
          { localField: "name", remoteField: "name", isRequired: true },
          { localField: "email", remoteField: "email", isRequired: true },
          { localField: "phone", remoteField: "phone", isRequired: false },
          { localField: "score", remoteField: "score", isRequired: false },
          { localField: "status", remoteField: "status", isRequired: true },
        )
    }

    // Create the mappings in the database
    for (const mapping of mappings) {
      await client.crmFieldMapping.create({
        data: {
          integrationId,
          ...mapping,
        },
      })
    }
  }

  /**
   * Sync a lead to a CRM
   */
  async syncLead(params: SyncLeadParams): Promise<boolean> {
    const { leadId, integrationId } = params

    // Get the lead and integration
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 5,
        },
      },
    })

    const integration = await client.crmIntegration.findUnique({
      where: { id: integrationId },
      include: {
        mappings: true,
      },
    })

    if (!lead || !integration) {
      throw new Error("Lead or integration not found")
    }

    // Map the lead data to the CRM fields
    const crmData: Record<string, any> = {}
    for (const mapping of integration.mappings) {
      const localField = mapping.localField
      const remoteField = mapping.remoteField

      // Get the value from the lead
      let value: any = null
      if (localField in lead) {
        value = (lead as any)[localField]
      } else if (lead.qualificationData && localField in lead.qualificationData) {
        value = (lead.qualificationData as any)[localField]
      }

      // Apply transformation if needed
      if (mapping.transformFunction && value !== null) {
        try {
          // This is a simplified approach - in production, you'd want a more secure way to execute transformations
          const transformFn = new Function("value", mapping.transformFunction)
          value = transformFn(value)
        } catch (error) {
          console.error(`Error applying transformation for field ${localField}:`, error)
        }
      }

      // Add to CRM data if value exists or field is required
      if (value !== null || mapping.isRequired) {
        crmData[remoteField] = value === null ? "" : value
      }
    }

    // Send the data to the CRM
    try {
      
    const apiSecret = integration.apiSecret ?? undefined
    const baseUrl = integration.baseUrl ?? undefined

    const success = await this.sendToCrm(
    integration.provider,
    integration.apiKey,
    apiSecret,
    baseUrl,
    crmData,
    )

      if (success) {
        // Update the lead to mark it as synced to CRM
        await client.lead.update({
          where: { id: leadId },
          data: {
            metadata: {
              ...((lead.metadata as object) || {}),
              crmSync: {
                provider: integration.provider,
                syncedAt: new Date().toISOString(),
                success: true,
              },
            },
          },
        })
      }

      return success
    } catch (error) {
      console.error(`Error syncing lead to ${integration.provider}:`, error)
      return false
    }
  }

  /**
   * Send data to a CRM
   */
  private async sendToCrm(
    provider: CrmProvider,
    apiKey: string,
    apiSecret?: string,
    baseUrl?: string,
    data?: any,
  ): Promise<boolean> {
    // Implementation depends on the CRM provider
    switch (provider) {
      case "HUBSPOT":
        return await this.sendToHubspot(apiKey, data)
      case "SALESFORCE":
        return await this.sendToSalesforce(apiKey, apiSecret, data)
      // Implement other providers
      default:
        return false
    }
  }

  // Provider-specific implementations
  private async testHubspotIntegration(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  private async sendToHubspot(apiKey: string, data: any): Promise<boolean> {
    try {
      const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: data,
        }),
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  //TODOS

  // Implement other provider-specific methods
  private async testSalesforceIntegration(apiKey: string, apiSecret?: string): Promise<boolean> {
    // Implement Salesforce API test
    return true
  }

  private async sendToSalesforce(apiKey: string, apiSecret?: string, data?: any): Promise<boolean> {
    // Implement Salesforce API call
    return true
  }

  private async testZohoIntegration(apiKey: string, apiSecret?: string, baseUrl?: string): Promise<boolean> {
    // Implement Zoho API test
    return true
  }

  private async testPipedriveIntegration(apiKey: string): Promise<boolean> {
    // Implement Pipedrive API test
    return true
  }

  private async testAirtableIntegration(apiKey: string, baseUrl?: string): Promise<boolean> {
    // Implement Airtable API test
    return true
  }

  private async testNotionIntegration(apiKey: string): Promise<boolean> {
    // Implement Notion API test
    return true
  }

  /**
   * Get all integrations for a user
   */
  async getIntegrations(userId: string): Promise<CrmIntegration[]> {
    return client.crmIntegration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Delete an integration
   */
  async deleteIntegration(integrationId: string): Promise<boolean> {
    await client.crmIntegration.delete({
      where: { id: integrationId },
    })

    return true
  }
}

// Export a singleton instance
export const crmService = new CrmService()
