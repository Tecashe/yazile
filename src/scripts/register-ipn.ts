// scripts/register-ipn.ts
import { pesapal } from '@/lib/pesapal-client'

async function registerIPN() {
  try {
    const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/pesapal/ipn`
    const ipnId = await pesapal.registerIPN(ipnUrl, 'GET')
    console.log('IPN registered successfully!')
    console.log('IPN ID:', ipnId)
    console.log('Add this to your .env.local as PESAPAL_IPN_ID')
  } catch (error) {
    console.error('Failed to register IPN:', error)
  }
}

registerIPN()
