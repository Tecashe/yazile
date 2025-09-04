

// // /api/dashboard/integrations/[id]/route.ts - Update/Delete specific integration
// import { NextRequest, NextResponse } from 'next/server'
// import { onUserInfor } from '@/actions/user'
// import { getTenantByUserId } from '@/lib/tenant-service'
// import { client } from '@/lib/prisma'
// import { encrypt, hashCredentials } from '@/lib/encrypt'

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id||"")
    
//     if (!tenant) {
//       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
//     }

//     const body = await request.json()
//     const { name, isActive, credentials, config, accessToken, refreshToken, tokenExpiresAt } = body

//     const updateData: any = {}

//     if (name !== undefined) updateData.name = name
//     if (isActive !== undefined) updateData.isActive = isActive
//     if (config !== undefined) updateData.config = JSON.stringify(config)
//     if (accessToken !== undefined) updateData.accessToken = accessToken
//     if (refreshToken !== undefined) updateData.refreshToken = refreshToken
//     if (tokenExpiresAt !== undefined) updateData.tokenExpiresAt = new Date(tokenExpiresAt)

//     if (credentials) {
//       const credentialsString = JSON.stringify(credentials)
//       const encrypted = encrypt(credentialsString)
//       updateData.encryptedCredentials = `${encrypted.encrypted}:${encrypted.iv}`
//       updateData.credentialsHash = hashCredentials(credentialsString)
//     }

//     const integration = await client.integration.update({
//       where: {
//         id: params.id,
//         tenantId: tenant.id
//       },
//       data: updateData
//     })

//     return NextResponse.json({
//       success: true,
//       integration: {
//         id: integration.id,
//         type: integration.type,
//         name: integration.name,
//         isActive: integration.isActive,
//         lastSyncAt: integration.lastSyncAt,
//         updatedAt: integration.updatedAt
//       }
//     })
//   } catch (error) {
//     console.error('Update integration error:', error)
//     return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id||"")
    
//     if (!tenant) {
//       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
//     }

//     await client.integration.delete({
//       where: {
//         id: params.id,
//         tenantId: tenant.id
//       }
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Delete integration error:', error)
//     return NextResponse.json({ error: 'Failed to delete integration' }, { status: 500 })
//   }
// }



// /api/dashboard/integrations/[id]/route.ts - Update/Delete specific integration
// import { type NextRequest, NextResponse } from "next/server"
// import { onUserInfor } from "@/actions/user"
// import { getTenantByUserId } from "@/lib/tenant-service"
// import { client } from "@/lib/prisma"
// import { encrypt, hashCredentials } from "@/lib/encrypt"

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id || "")

//     if (!tenant) {
//       return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
//     }

//     const body = await request.json()
//     const { name, isActive, credentials, config, accessToken, refreshToken, tokenExpiresAt } = body

//     const updateData: any = {}

//     if (name !== undefined) updateData.name = name
//     if (isActive !== undefined) updateData.isActive = isActive
//     if (config !== undefined) updateData.config = JSON.stringify(config)
//     if (accessToken !== undefined) updateData.accessToken = accessToken
//     if (refreshToken !== undefined) updateData.refreshToken = refreshToken
//     if (tokenExpiresAt !== undefined) updateData.tokenExpiresAt = new Date(tokenExpiresAt)

//     if (credentials) {
//       const credentialsString = JSON.stringify(credentials)
//       const encrypted = encrypt(credentialsString)
//       updateData.encryptedCredentials = `${encrypted.encrypted}:${encrypted.iv}`
//       updateData.credentialsHash = hashCredentials(credentialsString)
//     }

//     const integration = await client.integration.update({
//       where: {
//         id: params.id,
//         tenantId: tenant.id,
//       },
//       data: updateData,
//     })

//     return NextResponse.json({
//       success: true,
//       integration: {
//         id: integration.id,
//         type: integration.type,
//         name: integration.name,
//         isActive: integration.isActive,
//         lastSyncAt: integration.lastSyncAt,
//         updatedAt: integration.updatedAt,
//       },
//     })
//   } catch (error) {
//     console.error("Update integration error:", error)
//     return NextResponse.json({ error: "Failed to update integration" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const user = await onUserInfor()
//     const tenant = await getTenantByUserId(user.data?.id || "")

//     if (!tenant) {
//       return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
//     }

//     await client.integration.delete({
//       where: {
//         id: params.id,
//         tenantId: tenant.id,
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Delete integration error:", error)
//     return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 })
//   }
// }


// /api/dashboard/integrations/[id]/route.ts - Update/Delete specific integration
import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { getTenantByUserId } from "@/lib/tenant-service"
import { client } from "@/lib/prisma"
import { encrypt, hashCredentials } from "@/lib/encrypt"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const tenant = await getTenantByUserId(user.data?.id || "")

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, isActive, credentials, config, accessToken, refreshToken, tokenExpiresAt, capabilities } = body

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (isActive !== undefined) updateData.isActive = isActive
    if (config !== undefined) updateData.config = JSON.stringify(config)
    if (accessToken !== undefined) updateData.accessToken = accessToken
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken
    if (tokenExpiresAt !== undefined) updateData.tokenExpiresAt = new Date(tokenExpiresAt)

    if (capabilities !== undefined) {
      // Get existing capabilities first
      const existingIntegration = await client.integration.findUnique({
        where: { id: params.id, tenantId: tenant.id },
        select: { capabilities: true },
      })

      let existingCapabilities = {}
      if (existingIntegration?.capabilities) {
        try {
          existingCapabilities = JSON.parse(existingIntegration.capabilities)
        } catch (error) {
          console.error("Failed to parse existing capabilities:", error)
        }
      }

      // Merge new capabilities with existing ones
      const updatedCapabilities = { ...existingCapabilities, ...capabilities }
      updateData.capabilities = JSON.stringify(updatedCapabilities)
    }

    if (credentials) {
      const credentialsString = JSON.stringify(credentials)
      const encrypted = encrypt(credentialsString)
      updateData.encryptedCredentials = `${encrypted.encrypted}:${encrypted.iv}`
      updateData.credentialsHash = hashCredentials(credentialsString)
    }

    const integration = await client.integration.update({
      where: {
        id: params.id,
        tenantId: tenant.id,
      },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        type: integration.type,
        name: integration.name,
        isActive: integration.isActive,
        capabilities: integration.capabilities ? JSON.parse(integration.capabilities) : {},
        lastSyncAt: integration.lastSyncAt,
        updatedAt: integration.updatedAt,
      },
    })
  } catch (error) {
    console.error("Update integration error:", error)
    return NextResponse.json({ error: "Failed to update integration" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const tenant = await getTenantByUserId(user.data?.id || "")

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    await client.integration.delete({
      where: {
        id: params.id,
        tenantId: tenant.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete integration error:", error)
    return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 })
  }
}
