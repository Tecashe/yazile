// /lib/session-service.ts
import { client } from '@/lib/prisma'
import { SessionStatus } from '@prisma/client'

export async function createVoiceflowSession(data: {
  tenantId: string
  sessionId: string
  userId?: string
  platform?: string
  variables?: string
  context?: string
}) {
  return await client.voiceflowSession.create({
    data: {
      ...data,
      platform: data.platform || 'instagram'
    }
  })
}

export async function updateVoiceflowSession(
  sessionId: string,
  data: {
    variables?: string
    context?: string
    lastStep?: string
    status?: SessionStatus
    lastActiveAt?: Date
    endedAt?: Date
  }
) {
  return await client.voiceflowSession.update({
    where: { sessionId },
    data
  })
}

export async function getVoiceflowSession(sessionId: string) {
  return await client.voiceflowSession.findUnique({
    where: { sessionId },
    include: { tenant: true }
  })
}
