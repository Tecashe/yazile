// lib/voiceflow-auth.ts
import { NextRequest } from 'next/server'
import crypto from 'crypto'

export async function validateVoiceflowRequest(
  request: NextRequest, 
  body: any
): Promise<boolean> {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-voiceflow-signature')
    const timestamp = request.headers.get('x-voiceflow-timestamp')
    
    if (!signature || !timestamp) {
      return false
    }

    // Verify timestamp is recent (within 5 minutes)
    const now = Math.floor(Date.now() / 1000)
    const requestTime = parseInt(timestamp)
    if (Math.abs(now - requestTime) > 300) {
      return false
    }

    // Verify signature using your Voiceflow webhook secret
    const secret = process.env.VOICEFLOW_WEBHOOK_SECRET!
    const payload = `${timestamp}.${JSON.stringify(body)}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Voiceflow validation error:', error)
    return false
  }
}
