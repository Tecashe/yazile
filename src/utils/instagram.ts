/**
 * Webhook verification for Instagram webhooks
 */
export function verifyInstagramWebhook(
  signature: string, 
  body: string, 
  appSecret: string
): boolean {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body)
      .digest('hex')

    return signature === `sha256=${expectedSignature}`
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

/**
 * Check if an Instagram token is still valid
 */
export async function validateInstagramToken(accessToken: string) {
  try {
    const response = await fetch(`https://graph.instagram.com/me?access_token=${accessToken}`)
    
    if (response.ok) {
      const data = await response.json()
      return {
        valid: true,
        data
      }
    } else {
      const error = await response.json()
      return {
        valid: false,
        error: error.error?.message || 'Token validation failed'
      }
    }

  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Token validation failed'
    }
  }
}