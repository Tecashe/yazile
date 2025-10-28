
// // /api/dashboard/integrations/route.ts - Manage integrations
// import { NextRequest, NextResponse } from 'next/server'
// import {  onUserInfor } from '@/actions/user'
// import { getTenantByUserId } from '@/lib/tenant-service'
// import { createIntegration, getIntegration } from '@/lib/integration-service'
// import { IntegrationType } from '@prisma/client'

// export async function GET(request: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id||"")
    
//     if (!tenant) {
//       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
//     }

//     const { searchParams } = new URL(request.url)
//     const type = searchParams.get('type') as IntegrationType

//     if (type) {
//       const integration = await getIntegration(tenant.id, type)
//       return NextResponse.json({
//         success: true,
//         integration: integration ? {
//           id: integration.id,
//           type: integration.type,
//           name: integration.name,
//           isActive: integration.isActive,
//           lastSyncAt: integration.lastSyncAt,
//           lastErrorAt: integration.lastErrorAt,
//           lastError: integration.lastError,
//           syncCount: integration.syncCount,
//           errorCount: integration.errorCount,
//           hasValidToken: !!integration.accessToken,
//           tokenExpiresAt: integration.tokenExpiresAt
//         } : null
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       integrations: tenant.integrations?.map(integration => ({
//         id: integration.id,
//         type: integration.type,
//         name: integration.name,
//         isActive: integration.isActive,
//         lastSyncAt: integration.lastSyncAt,
//         lastErrorAt: integration.lastErrorAt,
//         lastError: integration.lastError,
//         syncCount: integration.syncCount,
//         errorCount: integration.errorCount,
//         hasValidToken: !!integration.accessToken,
//         tokenExpiresAt: integration.tokenExpiresAt
//       })) || []
//     })
//   } catch (error) {
//     console.error('Get integrations error:', error)
//     return NextResponse.json({ error: 'Failed to get integrations' }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id||"")
    
//     if (!tenant) {
//       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
//     }

//     const body = await request.json()
//     const { type, name, credentials, config, accessToken, refreshToken, tokenExpiresAt, scopes } = body

//     // Validate required fields based on integration type
//     if (!validateIntegrationCredentials(type, credentials)) {
//       return NextResponse.json({ error: 'Invalid credentials for integration type' }, { status: 400 })
//     }

//     // Check if integration already exists
//     const existingIntegration = await getIntegration(tenant.id, type)
//     if (existingIntegration) {
//       return NextResponse.json({ error: 'Integration already exists' }, { status: 400 })
//     }

//     const integration = await createIntegration({
//       tenantId: tenant.id,
//       type,
//       name,
//       credentials,
//       config,
//       accessToken,
//       refreshToken,
//       tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : undefined,
//       scopes
//     })

//     return NextResponse.json({
//       success: true,
//       integration: {
//         id: integration.id,
//         type: integration.type,
//         name: integration.name,
//         isActive: integration.isActive
//       }
//     })
//   } catch (error) {
//     console.error('Create integration error:', error)
//     return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 })
//   }
// }

// function validateIntegrationCredentials(type: IntegrationType, credentials: any): boolean {
//   switch (type) {
//     case 'STRIPE':
//       return credentials.secretKey && credentials.publishableKey
//     case 'HUBSPOT':
//       return credentials.accessToken || credentials.apiKey
//     case 'SALESFORCE':
//       return credentials.clientId && credentials.clientSecret && credentials.instanceUrl
//     case 'PIPEDRIVE':
//       return credentials.apiToken && credentials.companyDomain
//     default:
//       return true
//   }
// }

// /api/dashboard/integrations/route.ts - Manage integrations

// import { type NextRequest, NextResponse } from "next/server"
// import { onUserInfor } from "@/actions/user"
// import { getTenantByUserId } from "@/lib/tenant-service"
// import { createIntegration, getIntegration } from "@/lib/integration-service"
// import type { IntegrationType } from "@prisma/client"

// export async function GET(request: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id || "")

//     if (!tenant) {
//       return NextResponse.json({ error: "Tenant not found!!!!" }, { status: 404 })
//     }

//     const { searchParams } = new URL(request.url)
//     const type = searchParams.get("type") as IntegrationType

//     if (type) {
//       const integration = await getIntegration(tenant.id, type)
//       return NextResponse.json({
//         success: true,
//         integration: integration
//           ? {
//               id: integration.id,
//               type: integration.type,
//               name: integration.name,
//               isActive: integration.isActive,
//               lastSyncAt: integration.lastSyncAt,
//               lastErrorAt: integration.lastErrorAt,
//               lastError: integration.lastError,
//               syncCount: integration.syncCount,
//               errorCount: integration.errorCount,
//               hasValidToken: !!integration.accessToken,
//               tokenExpiresAt: integration.tokenExpiresAt,
//             }
//           : null,
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       integrations:
//         tenant.integrations?.map((integration) => ({
//           id: integration.id,
//           type: integration.type,
//           name: integration.name,
//           isActive: integration.isActive,
//           lastSyncAt: integration.lastSyncAt,
//           lastErrorAt: integration.lastErrorAt,
//           lastError: integration.lastError,
//           syncCount: integration.syncCount,
//           errorCount: integration.errorCount,
//           hasValidToken: !!integration.accessToken,
//           tokenExpiresAt: integration.tokenExpiresAt,
//         })) || [],
//     })
//   } catch (error) {
//     console.error("Get integrations error:", error)
//     return NextResponse.json({ error: "Failed to get integrations" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id || "")

//     if (!tenant) {
//       return NextResponse.json({ error: "Tenant not found !!" }, { status: 404 })
//     }

//     const body = await request.json()
//     const { type, name, credentials, config, accessToken, refreshToken, tokenExpiresAt, scopes } = body

//     // Validate required fields based on integration type
//     if (!validateIntegrationCredentials(type, credentials)) {
//       return NextResponse.json({ error: "Invalid credentials for integration type" }, { status: 400 })
//     }

//     // Check if integration already exists
//     const existingIntegration = await getIntegration(tenant.id, type)
//     if (existingIntegration) {
//       return NextResponse.json({ error: "Integration already exists" }, { status: 400 })
//     }

//     const integration = await createIntegration({
//       tenantId: tenant.id,
//       type,
//       name,
//       credentials,
//       config,
//       accessToken,
//       refreshToken,
//       tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : undefined,
//       scopes,
//     })

//     return NextResponse.json({
//       success: true,
//       integration: {
//         id: integration.id,
//         type: integration.type,
//         name: integration.name,
//         isActive: integration.isActive,
//       },
//     })
//   } catch (error) {
//     console.error("Create integration error:", error)
//     return NextResponse.json({ error: "Failed to create integration" }, { status: 500 })
//   }
// }

// function validateIntegrationCredentials(type: IntegrationType, credentials: any): boolean {
//   switch (type) {
//     case "STRIPE":
//       return credentials.secretKey && credentials.publishableKey
//     case "HUBSPOT":
//       return credentials.accessToken || credentials.apiKey
//     case "SALESFORCE":
//       return credentials.clientId && credentials.clientSecret && credentials.instanceUrl
//     case "PIPEDRIVE":
//       return credentials.apiToken && credentials.companyDomain
//     default:
//       return true
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { getTenantByUserId } from "@/lib/tenant-service"
import { createIntegration, getIntegration } from "@/lib/integration-service"
import type { IntegrationType } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Log the request
    console.log("[GET /api/integrations] Request received", {
      url: request.url,
      timestamp: new Date().toISOString()
    })

    const user = await onUserInfor()
    console.log("[GET /api/integrations] User lookup result:", {
      hasUser: !!user,
      hasData: !!user?.data,
      userId: user?.data?.id || "MISSING",
      userKeys: user ? Object.keys(user) : []
    })

    if (!user?.data?.id) {
      console.error("[GET /api/integrations] User ID not found", {
        user,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { error: "User not authenticated or user ID missing" }, 
        { status: 401 }
      )
    }

    const userId = user.data.id
    console.log("[GET /api/integrations] Looking up tenant for userId:", userId)

    const tenant = await getTenantByUserId(userId)
    
    console.log("[GET /api/integrations] Tenant lookup result:", {
      found: !!tenant,
      tenantId: tenant?.id || "NOT_FOUND",
      userId: userId,
      hasIntegrations: !!tenant?.integrations,
      integrationCount: tenant?.integrations?.length || 0,
      timestamp: new Date().toISOString()
    })

    if (!tenant) {
      console.error("[GET /api/integrations] Tenant not found for user", {
        userId,
        userEmail: user.data.email || "N/A",
        timestamp: new Date().toISOString(),
        suggestion: "User may need to create a tenant first"
      })
      return NextResponse.json(
        { 
          error: "Tenant not found. Please create a tenant first.",
          userId 
        }, 
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as IntegrationType

    if (type) {
      console.log("[GET /api/integrations] Fetching specific integration:", {
        tenantId: tenant.id,
        type
      })
      
      const integration = await getIntegration(tenant.id, type)
      
      console.log("[GET /api/integrations] Integration lookup result:", {
        type,
        found: !!integration,
        integrationId: integration?.id || "NOT_FOUND"
      })

      return NextResponse.json({
        success: true,
        integration: integration
          ? {
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
              tokenExpiresAt: integration.tokenExpiresAt,
            }
          : null,
      })
    }

    console.log("[GET /api/integrations] Returning all integrations:", {
      count: tenant.integrations?.length || 0
    })

    return NextResponse.json({
      success: true,
      integrations:
        tenant.integrations?.map((integration) => ({
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
          tokenExpiresAt: integration.tokenExpiresAt,
        })) || [],
    })
  } catch (error) {
    console.error("[GET /api/integrations] Unexpected error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      { error: "Failed to get integrations" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[POST /api/integrations] Request received", {
      timestamp: new Date().toISOString()
    })

    const user = await onUserInfor()
    console.log("[POST /api/integrations] User lookup result:", {
      hasUser: !!user,
      hasData: !!user?.data,
      userId: user?.data?.id || "MISSING"
    })

    if (!user?.data?.id) {
      console.error("[POST /api/integrations] User ID not found", {
        user,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { error: "User not authenticated or user ID missing" }, 
        { status: 401 }
      )
    }

    const userId = user.data.id
    console.log("[POST /api/integrations] Looking up tenant for userId:", userId)

    const tenant = await getTenantByUserId(userId)
    
    console.log("[POST /api/integrations] Tenant lookup result:", {
      found: !!tenant,
      tenantId: tenant?.id || "NOT_FOUND",
      userId: userId,
      timestamp: new Date().toISOString()
    })

    if (!tenant) {
      console.error("[POST /api/integrations] Tenant not found for user", {
        userId,
        userEmail: user.data.email || "N/A",
        timestamp: new Date().toISOString(),
        suggestion: "User may need to create a tenant first"
      })
      return NextResponse.json(
        { 
          error: "Tenant not found. Please create a tenant first.",
          userId 
        }, 
        { status: 404 }
      )
    }

    const body = await request.json()
    const { type, name, credentials, config, accessToken, refreshToken, tokenExpiresAt, scopes } = body

    console.log("[POST /api/integrations] Creating integration:", {
      tenantId: tenant.id,
      type,
      name,
      hasCredentials: !!credentials,
      hasAccessToken: !!accessToken
    })

    // Validate required fields based on integration type
    if (!validateIntegrationCredentials(type, credentials)) {
      console.error("[POST /api/integrations] Invalid credentials", {
        type,
        tenantId: tenant.id,
        credentialsKeys: credentials ? Object.keys(credentials) : []
      })
      return NextResponse.json(
        { error: "Invalid credentials for integration type" }, 
        { status: 400 }
      )
    }

    // Check if integration already exists
    const existingIntegration = await getIntegration(tenant.id, type)
    if (existingIntegration) {
      console.warn("[POST /api/integrations] Integration already exists", {
        tenantId: tenant.id,
        type,
        existingIntegrationId: existingIntegration.id
      })
      return NextResponse.json(
        { error: "Integration already exists" }, 
        { status: 400 }
      )
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
      scopes,
    })

    console.log("[POST /api/integrations] Integration created successfully:", {
      integrationId: integration.id,
      type: integration.type,
      tenantId: tenant.id
    })

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        type: integration.type,
        name: integration.name,
        isActive: integration.isActive,
      },
    })
  } catch (error) {
    console.error("[POST /api/integrations] Unexpected error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      { error: "Failed to create integration" }, 
      { status: 500 }
    )
  }
}

function validateIntegrationCredentials(type: IntegrationType, credentials: any): boolean {
  switch (type) {
    case "STRIPE":
      return credentials.secretKey && credentials.publishableKey
    case "HUBSPOT":
      return credentials.accessToken || credentials.apiKey
    case "SALESFORCE":
      return credentials.clientId && credentials.clientSecret && credentials.instanceUrl
    case "PIPEDRIVE":
      return credentials.apiToken && credentials.companyDomain
    default:
      return true
  }
}