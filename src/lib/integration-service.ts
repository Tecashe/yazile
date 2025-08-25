//lib/integration-service.ts
import { client } from '@/lib/prisma'
import { encrypt, decrypt, hashCredentials } from '@/lib/encrypt'
import { Integrations, IntegrationType } from '@prisma/client'

export async function getIntegration(tenantId: string, type: IntegrationType) {
  return await client.integration.findFirst({
    where: {
      tenantId,
      type,
      isActive: true
    }
  })
}

export async function createIntegration(data: {
  tenantId: string
  type: IntegrationType
  name: string
  credentials: Record<string, any>
  config?: Record<string, any>
  accessToken?: string
  refreshToken?: string
  tokenExpiresAt?: Date
  scopes?: string[]
}) {
  const credentialsString = JSON.stringify(data.credentials)
  const encrypted = encrypt(credentialsString)
  const hash = hashCredentials(credentialsString)

  return await client.integration.create({
    data: {
      tenantId: data.tenantId,
      type: data.type,
      name: data.name,
      encryptedCredentials: `${encrypted.encrypted}:${encrypted.iv}`,
      credentialsHash: hash,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenExpiresAt: data.tokenExpiresAt,
      scopes: data.scopes ? JSON.stringify(data.scopes) : null,
      config: data.config ? JSON.stringify(data.config) : null
    }
  })
}

export async function getDecryptedCredentials(integration: any): Promise<Record<string, any>> {
  const [encrypted, iv] = integration.encryptedCredentials.split(':')
  const decrypted = decrypt(encrypted, iv)
  return JSON.parse(decrypted)
}

export async function logApiCall(data: {
  tenantId?: string
  integrationId?: string | null
  sessionId?: string | null
  endpoint: string
  method: string
  requestHeaders?: string
  requestBody?: string
  statusCode: number
  responseHeaders?: string
  responseBody?: string
  duration?: number
  error?: string
  retryCount?: number
}) {
  try {
    await client.apiLog.create({
      data: {
        ...data,
        // Truncate large response bodies
        responseBody: data.responseBody ? 
          data.responseBody.substring(0, 10000) : null
      }
    })
  } catch (error) {
    console.error('Failed to log API call:', error)
  }
}
