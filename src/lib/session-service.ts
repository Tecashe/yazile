// // /lib/session-service.ts
// import { client } from '@/lib/prisma'
// import { SessionStatus } from '@prisma/client'

// export async function createVoiceflowSession(data: {
//   tenantId: string
//   sessionId: string
//   userId?: string
//   platform?: string
//   variables?: string
//   context?: string
// }) {
//   return await client.voiceflowSession.create({
//     data: {
//       ...data,
//       platform: data.platform || 'instagram'
//     }
//   })
// }

// export async function updateVoiceflowSession(
//   sessionId: string,
//   data: {
//     variables?: string
//     context?: string
//     lastStep?: string
//     status?: SessionStatus
//     lastActiveAt?: Date
//     endedAt?: Date
//   }
// ) {
//   return await client.voiceflowSession.update({
//     where: { sessionId },
//     data
//   })
// }

// export async function getVoiceflowSession(sessionId: string) {
//   return await client.voiceflowSession.findUnique({
//     where: { sessionId },
//     include: { tenant: true }
//   })
// }

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
    tenantId?: string
    userId?: string
    platform?: string
  }
) {
  // Use upsert to create the session if it doesn't exist
  return await client.voiceflowSession.upsert({
    where: { sessionId },
    update: {
      ...data,
      lastActiveAt: new Date()
    },
    create: {
      sessionId,
      tenantId: data.tenantId || '', // You'll need to pass this
      userId: data.userId,
      platform: data.platform || 'voiceflow',
      variables: data.variables,
      context: data.context,
      lastStep: data.lastStep,
      status: data.status || SessionStatus.ACTIVE,
      lastActiveAt: new Date(),
      endedAt: data.endedAt
    }
  })
}

export async function getVoiceflowSession(sessionId: string) {
  return await client.voiceflowSession.findUnique({
    where: { sessionId },
    include: { tenant: true }
  })
}