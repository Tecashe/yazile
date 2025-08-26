// // /api/dashboard/tenant/route.ts - Create/Get tenant
// import { NextRequest, NextResponse } from 'next/server'
// import { onUserInfor } from '@/actions/user'
// import { createTenant, getTenantByUserId } from '@/lib/tenant-service'

// export async function GET() {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id||"undefined")
    
//     if (!tenant) {
//       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
//     }

//     return NextResponse.json({
//       success: true,
//       tenant: {
//         id: tenant.id,
//         name: tenant.name,
//         domain: tenant.domain,
//         isActive: tenant.isActive,
//         integrations: tenant.integrations?.map(integration => ({
//           id: integration.id,
//           type: integration.type,
//           name: integration.name,
//           isActive: integration.isActive,
//           lastSyncAt: integration.lastSyncAt,
//           lastErrorAt: integration.lastErrorAt,
//           syncCount: integration.syncCount,
//           errorCount: integration.errorCount
//         }))
//       }
//     })
//   } catch (error) {
//     console.error('Get tenant error:', error)
//     return NextResponse.json({ error: 'Failed to get tenant' }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const body = await request.json()
//     const { name, domain } = body

//     // Check if tenant already exist
//     const existingTenant = await getTenantByUserId(user.data?.id||"")
//     if (existingTenant) {
//       return NextResponse.json({ error: 'Tenant already exists' }, { status: 400 })
//     }

//     const tenant = await createTenant(user.data?.id||"", name, domain)

//     return NextResponse.json({
//       success: true,
//       tenant: {
//         id: tenant.id,
//         name: tenant.name,
//         domain: tenant.domain,
//         isActive: tenant.isActive
//       }
//     })
//   } catch (error) {
//     console.error('Create tenant error:', error)
//     return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
//   }
// }
// /api/dashboard/tenant/route.ts - Enhanced with comprehensive debugging
import { NextRequest, NextResponse } from 'next/server'
import { onUserInfor } from '@/actions/user'
import { createTenant, getTenantByUserId } from '@/lib/tenant-service'

// Add a simple test endpoint to verify the route is accessible
export async function OPTIONS() {
  console.log('OPTIONS request received - route is accessible')
  return new NextResponse(null, { status: 200 })
}

export async function GET() {
  console.log('=== GET /api/dashboard/tenant START ===')
  console.log('Route handler invoked at:', new Date().toISOString())
  
  try {
    console.log('Step 1: Getting user info...')
    const user = await onUserInfor()
    console.log('User response:', JSON.stringify(user, null, 2))
    
    if (user.status !== 200) {
      console.log('User authentication failed with status:', user.status)
      return NextResponse.json(
        { error: 'User authentication failed', details: user }, 
        { status: user.status }
      )
    }
    
    if (!user.data?.id) {
      console.log('No user ID found in response')
      return NextResponse.json(
        { error: 'User ID not found', userData: user.data }, 
        { status: 400 }
      )
    }
    
    console.log('Step 2: Looking for tenant with userId:', user.data.id)
    const tenant = await getTenantByUserId(user.data.id)
    console.log('Tenant query result:', tenant)
    
    if (!tenant) {
      console.log('No tenant found for userId:', user.data.id)
      return NextResponse.json({ 
        error: 'Tenant not found', 
        userId: user.data.id,
        searchedWith: 'database UUID'
      }, { status: 404 })
    }
    
    console.log('Step 3: Tenant found, preparing response')
    const response = {
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
    }
    
    console.log('Step 4: Returning successful response')
    console.log('=== GET /api/dashboard/tenant END SUCCESS ===')
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('=== GET /api/dashboard/tenant ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Failed to get tenant', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('=== POST /api/dashboard/tenant START ===')
  console.log('Route handler invoked at:', new Date().toISOString())
  
  try {
    console.log('Step 1: Getting user info...')
    const user = await onUserInfor()
    console.log('User response:', JSON.stringify(user, null, 2))
    
    if (user.status !== 200 || !user.data?.id) {
      console.log('User authentication failed')
      return NextResponse.json(
        { error: 'User authentication failed', details: user }, 
        { status: 401 }
      )
    }
    
    console.log('Step 2: Parsing request body...')
    const body = await request.json()
    console.log('Request body:', body)
    const { name, domain } = body
    
    if (!name) {
      console.log('Missing required field: name')
      return NextResponse.json(
        { error: 'Name is required' }, 
        { status: 400 }
      )
    }
    
    console.log('Step 3: Checking for existing tenant...')
    const existingTenant = await getTenantByUserId(user.data.id)
    console.log('Existing tenant check result:', existingTenant)
    
    if (existingTenant) {
      console.log('Tenant already exists for user:', user.data.id)
      return NextResponse.json({ 
        error: 'Tenant already exists',
        existingTenant: {
          id: existingTenant.id,
          name: existingTenant.name
        }
      }, { status: 400 })
    }
    
    console.log('Step 4: Creating new tenant...')
    const tenant = await createTenant(user.data.id, name, domain)
    console.log('Created tenant:', tenant)
    
    const response = {
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        isActive: tenant.isActive
      }
    }
    
    console.log('Step 5: Returning successful response')
    console.log('=== POST /api/dashboard/tenant END SUCCESS ===')
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('=== POST /api/dashboard/tenant ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Failed to create tenant', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
