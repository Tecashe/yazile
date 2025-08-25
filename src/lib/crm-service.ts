// /lib/crm-service.ts
import { getDecryptedCredentials } from '@/lib/integration-service'
import { IntegrationType } from '@prisma/client'

export async function createCRMContact(
  integration: any,
  contactData: Record<string, any>
) {
  const credentials = await getDecryptedCredentials(integration)

  switch (integration.type as IntegrationType) {
    case 'HUBSPOT':
      return await createHubSpotContact(credentials, contactData)
    case 'SALESFORCE':
      return await createSalesforceContact(credentials, contactData)
    case 'PIPEDRIVE':
      return await createPipedriveContact(credentials, contactData)
    default:
      throw new Error(`Unsupported CRM type: ${integration.type}`)
  }
}

async function createHubSpotContact(credentials: any, contactData: any) {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        email: contactData.email,
        firstname: contactData.firstName,
        lastname: contactData.lastName,
        phone: contactData.phone,
        company: contactData.company,
        lifecyclestage: 'lead',
        hs_lead_status: 'NEW',
        lead_source: contactData.source || 'voiceflow'
      }
    })
  })

  if (!response.ok) {
    throw new Error(`HubSpot API error: ${response.statusText}`)
  }

  return await response.json()
}

async function createSalesforceContact(credentials: any, contactData: any) {
  // Implement Salesforce contact creation
  throw new Error('Salesforce integration not yet implemented')
}

async function createPipedriveContact(credentials: any, contactData: any) {
  // Implement Pipedrive contact creation
  throw new Error('Pipedrive integration not yet implemented')
}
