// import { client } from '@/lib/prisma'

// export async function getTenantByUserId(userId: string) {
//   return await client.tenant.findUnique({
//     where: { userId },
//     include: {
//       integrations: {
//         where: { isActive: true }
//       }
//     }
//   })
// }

// export async function getTenantBySessionId(sessionId: string, tenantId?: string) {
//   // First try to find by session
//   const session = await client.voiceflowSession.findUnique({
//     where: { sessionId },
//     include: { tenant: true }
//   })

//   if (session) {
//     return session.tenant
//   }

//   // Fallback to direct tenant lookup
//   if (tenantId) {
//     return await client.tenant.findUnique({
//       where: { id: tenantId }
//     })
//   }

//   return null
// }

// export async function createTenant(userId: string, name: string, domain?: string) {
//   return await client.tenant.create({
//     data: {
//       userId,
//       name,
//       domain
//     }
//   })
// }

// /lib/tenant-service.ts - Updated to include integrations in create function
import { client } from '@/lib/prisma'

export async function getTenantByUserId(userId: string) {
  return await client.tenant.findUnique({
    where: { userId },
    include: {
      integrations: {
        where: { isActive: true }
      }
    }
  })
}

export async function getTenantBySessionId(sessionId: string, tenantId?: string) {
  // First try to find by session
  const session = await client.voiceflowSession.findUnique({
    where: { sessionId },
    include: { tenant: true }
  })

  if (session) {
    return session.tenant
  }

  // Fallback to direct tenant lookup
  if (tenantId) {
    return await client.tenant.findUnique({
      where: { id: tenantId }
    })
  }

  return null
}

export async function createTenant(userId: string, name: string, domain?: string) {
  // Create tenant and immediately fetch it with integrations to match the return type
  const createdTenant = await client.tenant.create({
    data: {
      userId,
      name,
      domain
    }
  })

  // Fetch the created tenant with integrations to match getTenantByUserId return type
  return await client.tenant.findUnique({
    where: { id: createdTenant.id },
    include: {
      integrations: {
        where: { isActive: true }
      }
    }
  })
}