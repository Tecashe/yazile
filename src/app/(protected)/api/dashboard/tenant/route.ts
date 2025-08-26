// /api/dashboard/tenant/route.ts - Create/Get tenant
import { NextRequest, NextResponse } from 'next/server'
import { onCurrentUser } from '@/actions/user'
import { createTenant, getTenantByUserId } from '@/lib/tenant-service'

export async function GET() {
  try {
    const user = await onCurrentUser()
    const tenant = await getTenantByUserId(user.id)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        isActive: tenant.isActive,
        integrations: tenant.integrations?.map(integration => ({
          id: integration.id,
          type: integration.type,
          name: integration.name,
          isActive: integration.isActive,
          lastSyncAt: integration.lastSyncAt,
          lastErrorAt: integration.lastErrorAt,
          syncCount: integration.syncCount,
          errorCount: integration.errorCount
        }))
      }
    })
  } catch (error) {
    console.error('Get tenant error:', error)
    return NextResponse.json({ error: 'Failed to get tenant' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await onCurrentUser()
    const body = await request.json()
    const { name, domain } = body

    // Check if tenant already exists
    const existingTenant = await getTenantByUserId(user.id)
    if (existingTenant) {
      return NextResponse.json({ error: 'Tenant already exists' }, { status: 400 })
    }

    const tenant = await createTenant(user.id, name, domain)

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        isActive: tenant.isActive
      }
    })
  } catch (error) {
    console.error('Create tenant error:', error)
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
  }
}
