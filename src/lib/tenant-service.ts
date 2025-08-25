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
  return await client.tenant.create({
    data: {
      userId,
      name,
      domain
    }
  })
}
