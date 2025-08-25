// /lib/environment.ts - Environment validation
export function validateEnvironment() {
  const required = [
    'ENCRYPTION_KEY',
    'VOICEFLOW_WEBHOOK_SECRET',
    'STRIPE_WEBHOOK_SECRET',
    'DATABASE_URL'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}