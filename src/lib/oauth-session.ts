// lib/oauth-session.ts
import { cookies } from 'next/headers'
import { encryptCredential, decryptCredential } from './n8n/credentials' // You'll need to implement encryption

const SESSION_COOKIE_NAME = 'oauth_ctx'
const SESSION_MAX_AGE = 300 // 5 minutes

export function setOAuthSession(data: { workflowId: string, integration: string }) {
  const encrypted = encryptCredential(JSON.stringify({
    ...data,
    expires: Date.now() + SESSION_MAX_AGE * 1000
  }))
  
  cookies().set(SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export function getOAuthSession() {
  const cookie = cookies().get(SESSION_COOKIE_NAME)?.value
  if (!cookie) return null
  
  try {
    const decrypted = decryptCredential(cookie)
    const session = JSON.parse(decrypted)
    
    if (session.expires < Date.now()) {
      return null // Session expired
    }
    
    return {
      workflowId: session.workflowId,
      integration: session.integration
    }
  } catch {
    return null
  }
}

export function clearOAuthSession() {
  cookies().delete(SESSION_COOKIE_NAME)
}