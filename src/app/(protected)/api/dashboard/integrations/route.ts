
// /api/dashboard/integrations/route.ts - Manage integrations
import { NextRequest, NextResponse } from 'next/server'
import {  onUserInfor } from '@/actions/user'
import { getTenantByUserId } from '@/lib/tenant-service'
import { createIntegration, getIntegration } from '@/lib/integration-service'
import { IntegrationType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const user = await onUserInfor()
    const tenant = await getTenantByUserId(user.data?.id||"")
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as IntegrationType

    if (type) {
      const integration = await getIntegration(tenant.id, type)
      return NextResponse.json({
        success: true,
        integration: integration ? {
          id: integration.id,
          type: integration.type,
          name: integration.name,
          isActive: integration.isActive,
          lastSyncAt: integration.lastSyncAt,
          lastErrorAt: integration.lastErrorAt,
          lastError: integration.lastError,
          syncCount: integration.syncCount,
          errorCount: integration.errorCount,
          hasValidToken: !!integration.accessToken,
          tokenExpiresAt: integration.tokenExpiresAt
        } : null
      })
    }

    return NextResponse.json({
      success: true,
      integrations: tenant.integrations?.map(integration => ({
        id: integration.id,
        type: integration.type,
        name: integration.name,
        isActive: integration.isActive,
        lastSyncAt: integration.lastSyncAt,
        lastErrorAt: integration.lastErrorAt,
        lastError: integration.lastError,
        syncCount: integration.syncCount,
        errorCount: integration.errorCount,
        hasValidToken: !!integration.accessToken,
        tokenExpiresAt: integration.tokenExpiresAt
      })) || []
    })
  } catch (error) {
    console.error('Get integrations error:', error)
    return NextResponse.json({ error: 'Failed to get integrations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await onUserInfor()
    const tenant = await getTenantByUserId(user.data?.id||"")
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const body = await request.json()
    const { type, name, credentials, config, accessToken, refreshToken, tokenExpiresAt, scopes } = body

    // Validate required fields based on integration type
    if (!validateIntegrationCredentials(type, credentials)) {
      return NextResponse.json({ error: 'Invalid credentials for integration type' }, { status: 400 })
    }

    // Check if integration already exists
    const existingIntegration = await getIntegration(tenant.id, type)
    if (existingIntegration) {
      return NextResponse.json({ error: 'Integration already exists' }, { status: 400 })
    }

    const integration = await createIntegration({
      tenantId: tenant.id,
      type,
      name,
      credentials,
      config,
      accessToken,
      refreshToken,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : undefined,
      scopes
    })

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        type: integration.type,
        name: integration.name,
        isActive: integration.isActive
      }
    })
  } catch (error) {
    console.error('Create integration error:', error)
    return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 })
  }
}

function validateIntegrationCredentials(type: IntegrationType, credentials: any): boolean {
  switch (type) {
    case 'STRIPE':
      return credentials.secretKey && credentials.publishableKey
    case 'HUBSPOT':
      return credentials.accessToken || credentials.apiKey
    case 'SALESFORCE':
      return credentials.clientId && credentials.clientSecret && credentials.instanceUrl
    case 'PIPEDRIVE':
      return credentials.apiToken && credentials.companyDomain
    default:
      return true
  }
}