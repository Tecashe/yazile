// /lib/webhook-service.ts
import { client } from '@/lib/prisma'

export async function logWebhook(data: {
  tenantId: string
  source: string
  eventType: string
  headers?: string
  payload: string
  signature?: string
  processed?: boolean
  processedAt?: Date
  error?: string
  retryCount?: number
}) {
  return await client.webhookLog.create({
    data: {
      ...data,
      processedAt: data.processed ? new Date() : null
    }
  })
}