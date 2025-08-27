// // lib/voiceflow-auth.ts
// import { NextRequest } from 'next/server'
// import crypto from 'crypto'

// export async function validateVoiceflowRequest(
//   request: NextRequest, 
//   body: any
// ): Promise<boolean> {
//   try {
//     // Get the signature from headers
//     const signature = request.headers.get('x-voiceflow-signature')
//     const timestamp = request.headers.get('x-voiceflow-timestamp')
    
//     if (!signature || !timestamp) {
//       return false
//     }

//     // Verify timestamp is recent (within 5 minutes)
//     const now = Math.floor(Date.now() / 1000)
//     const requestTime = parseInt(timestamp)
//     if (Math.abs(now - requestTime) > 300) {
//       return false
//     }

//     // Verify signature using your Voiceflow webhook secret
//     const secret = process.env.VOICEFLOW_WEBHOOK_SECRET!
//     const payload = `${timestamp}.${JSON.stringify(body)}`
//     const expectedSignature = crypto
//       .createHmac('sha256', secret)
//       .update(payload)
//       .digest('hex')

//     return crypto.timingSafeEqual(
//       Buffer.from(signature, 'hex'),
//       Buffer.from(expectedSignature, 'hex')
//     )
//   } catch (error) {
//     console.error('Voiceflow validation error:', error)
//     return false
//   }
// }

// lib/voiceflow-auth.ts
import { NextRequest } from 'next/server'

export async function validateVoiceflowRequest(
  request: NextRequest,
  body: any
): Promise<boolean> {
  try {
    // Get API key from headers (multiple possible header names)
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '') ||
                   request.headers.get('x-voiceflow-api-key')
    
    if (!apiKey) {
      console.error('API key missing from request headers')
      return false
    }

    // Get the expected API key from environment variables
    const expectedApiKey = process.env.VOICEFLOW_API_KEY
    
    if (!expectedApiKey) {
      console.error('VOICEFLOW_API_KEY not configured in environment variables')
      return false
    }

    // Simple string comparison for API key validation
    const isValid = apiKey === expectedApiKey
    
    if (!isValid) {
      console.error('Invalid API key provided')
    }
    
    return isValid
    
  } catch (error) {
    console.error('Voiceflow validation error:', error)
    return false
  }
}
