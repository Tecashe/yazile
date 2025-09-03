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
