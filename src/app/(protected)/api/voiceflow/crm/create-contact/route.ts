
// /api/voiceflow/crm/create-contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { getIntegration, logApiCall } from '@/lib/integration-service'
import { createCRMContact } from '@/lib/crm-service'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null

  try {
    const body = await request.json()
    const { 
      tenantId, 
      sessionId, 
      contact,
      crmType = 'HUBSPOT' // Default to HubSpot, but support others
    } = body

    // Validate request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get CRM integration
    const integration = await getIntegration(tenantId, crmType)
    if (!integration) {
      return NextResponse.json({ 
        error: `${crmType} integration not configured` 
      }, { status: 400 })
    }

    integrationId = integration.id

    // Create contact in CRM
    const crmContact = await createCRMContact(integration, {
      ...contact,
      source: 'voiceflow',
      sessionId,
      createdVia: 'instagram_dm_automation'
    })

    // Log successful API call
    await logApiCall({
      tenantId,
      integrationId,
      sessionId,
      endpoint: '/api/voiceflow/crm/create-contact',
      method: 'POST',
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(crmContact),
      duration: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      contactId: crmContact.id,
      contact: crmContact
    })

  } catch (error) {
    console.error('CRM contact creation error:', error)
    
    // await logApiCall({
    //   tenantId: body?.tenantId,
    //   integrationId,
    //   sessionId: body?.sessionId,
    //   endpoint: '/api/voiceflow/crm/create-contact',
    //   method: 'POST',
    //   requestBody: JSON.stringify(body),
    //   statusCode: 500,
    //   error: error instanceof Error ? error.message : 'Unknown error',
    //   duration: Date.now() - startTime
    // })

    return NextResponse.json({ 
      error: 'Failed to create contact' 
    }, { status: 500 })
  }
}