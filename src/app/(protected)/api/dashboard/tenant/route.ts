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





// /api/dashboard/tenant/route.ts - Auto-create tenant if not exists
import { NextRequest, NextResponse } from 'next/server'
import { onUserInfor } from '@/actions/user'
import { createTenant, getTenantByUserId } from '@/lib/tenant-service'

export async function GET() {
  console.log('=== GET /api/dashboard/tenant START ===')
  console.log('Route handler invoked at:', new Date().toISOString())
  
  try {
    console.log('Step 1: Getting user info...')
    const user = await onUserInfor()
    console.log('User response status:', user.status)
    
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
        { error: 'User ID not found' }, 
        { status: 400 }
      )
    }
    
    console.log('Step 2: Looking for existing tenant with userId:', user.data.id)
    let tenant = await getTenantByUserId(user.data.id)
    console.log('Initial tenant query result:', tenant ? 'Found' : 'Not found')
    
    if (!tenant) {
      console.log('Step 3: No tenant found, auto-creating one...')
      
      // Generate a default tenant name from user data
      const defaultName = user.data.firstname 
        ? `${user.data.firstname}${user.data.lastname ? ` ${user.data.lastname}` : ''}'s Business`
        : 'My Business'
      
      console.log('Creating tenant with name:', defaultName)
      
      try {
        tenant = await createTenant(user.data.id, defaultName)
        
        if (!tenant) {
          throw new Error('Tenant creation returned null')
        }
        
        console.log('Successfully auto-created tenant:', {
          id: tenant.id,
          name: tenant.name,
          userId: tenant.userId,
          integrations: tenant.integrations.length
        })
      } catch (createError) {
        console.error('Failed to auto-create tenant:', createError)
        console.error('Create error stack:', createError instanceof Error ? createError.stack : 'No stack')
        return NextResponse.json({
          error: 'Failed to create tenant automatically',
          details: createError instanceof Error ? createError.message : 'Unknown error'
        }, { status: 500 })
      }
    } else {
      console.log('Step 3: Existing tenant found:', tenant.name)
    }
    
    console.log('Step 4: Preparing response with tenant data')
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
        })) || []
      }
    }
    
    console.log('Step 5: Returning successful response')
    console.log('=== GET /api/dashboard/tenant END SUCCESS ===')
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('=== GET /api/dashboard/tenant UNEXPECTED ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred', 
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
    console.log('User response status:', user.status)
    
    if (user.status !== 200 || !user.data?.id) {
      console.log('User authentication failed')
      return NextResponse.json(
        { error: 'User authentication failed' }, 
        { status: 401 }
      )
    }
    
    console.log('Step 2: Parsing request body...')
    const body = await request.json()
    console.log('Request body:', body)
    const { name, domain } = body
    
    if (!name?.trim()) {
      console.log('Missing or empty name field')
      return NextResponse.json(
        { error: 'Tenant name is required and cannot be empty' }, 
        { status: 400 }
      )
    }
    
    console.log('Step 3: Checking for existing tenant...')
    const existingTenant = await getTenantByUserId(user.data.id)
    console.log('Existing tenant check:', existingTenant ? 'Found existing' : 'None found')
    
    if (existingTenant) {
      console.log('Tenant already exists, returning existing tenant info')
      return NextResponse.json({ 
        success: false,
        error: 'Tenant already exists for this user',
        existingTenant: {
          id: existingTenant.id,
          name: existingTenant.name,
          domain: existingTenant.domain,
          isActive: existingTenant.isActive
        }
      }, { status: 400 })
    }
    
    console.log('Step 4: Creating new tenant with name:', name.trim())
    const tenant = await createTenant(user.data.id, name.trim(), domain?.trim() || undefined)
    
    if (!tenant) {
      throw new Error('Tenant creation returned null')
    }
    
    console.log('Successfully created tenant:', {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      integrations: tenant.integrations.length
    })
    
    const response = {
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        isActive: tenant.isActive
      },
      message: 'Tenant created successfully'
    }
    
    console.log('Step 5: Returning successful response')
    console.log('=== POST /api/dashboard/tenant END SUCCESS ===')
    return NextResponse.json(response, { status: 201 })
    
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