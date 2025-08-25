// /api/voiceflow/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { getTenantBySessionId } from '@/lib/tenant-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, tenantId } = body

    // Validate the request is from Voiceflow (implement signature validation)
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tenant information
    const tenant = await getTenantBySessionId(sessionId, tenantId)
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      tenantId: tenant.id,
      tenantName: tenant.name 
    })
  } catch (error) {
    console.error('Voiceflow auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
