// scripts/debug-pesapal-auth.ts
import axios from 'axios'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function debugAuth() {
  console.log('🔍 Debugging Pesapal Authentication\n')
  
  // Step 1: Check environment variables
  console.log('Step 1: Checking environment variables...')
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET
  const env = process.env.PESAPAL_ENV || 'sandbox'
  
  console.log('Environment:', env)
  console.log('Consumer Key:', consumerKey ? `${consumerKey.substring(0, 10)}...` : '❌ NOT SET')
  console.log('Consumer Secret:', consumerSecret ? `${consumerSecret.substring(0, 10)}...` : '❌ NOT SET')
  
  if (!consumerKey || !consumerSecret) {
    console.error('\n❌ ERROR: Missing credentials!')
    console.error('Please set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET in .env.local')
    process.exit(1)
  }
  
  // Step 2: Determine the correct base URL
  const baseUrl = env === 'production' 
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3'
  
  console.log('\nStep 2: Using Pesapal URL:', baseUrl)
  
  // Step 3: Test authentication
  console.log('\nStep 3: Testing authentication...')
  
  try {
    const authUrl = `${baseUrl}/api/Auth/RequestToken`
    console.log('Auth URL:', authUrl)
    
    const requestBody = {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }
    
    console.log('\nSending authentication request...')
    console.log('Request body:', {
      consumer_key: `${consumerKey.substring(0, 10)}...`,
      consumer_secret: '***hidden***'
    })
    
    const response = await axios.post(authUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    console.log('\n✅ Authentication successful!')
    console.log('Response status:', response.status)
    console.log('Token received:', response.data.token ? 'Yes ✓' : 'No ✗')
    console.log('Token preview:', response.data.token ? `${response.data.token.substring(0, 20)}...` : 'N/A')
    console.log('Token expiry:', response.data.expiryDate || 'Not provided')
    console.log('Message:', response.data.message || 'None')
    
    // Step 4: Test IPN registration with the token
    console.log('\n\nStep 4: Testing IPN registration...')
    const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.yazzil.com'}/api/subscriptions/pesapal/ipn`
    console.log('IPN URL:', ipnUrl)
    
    const ipnResponse = await axios.post(
      `${baseUrl}/api/URLSetup/RegisterIPN`,
      {
        url: ipnUrl,
        ipn_notification_type: 'GET',
      },
      {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )
    
    console.log('\n✅ IPN Registration successful!')
    console.log('IPN ID:', ipnResponse.data.ipn_id)
    console.log('URL:', ipnResponse.data.url)
    console.log('Notification Type:', ipnResponse.data.ipn_notification_type)
    console.log('Status:', ipnResponse.data.status)
    
    console.log('\n═══════════════════════════════════════════════════')
    console.log('🎉 SUCCESS! Add this to your .env.local:')
    console.log(`PESAPAL_IPN_ID=${ipnResponse.data.ipn_id}`)
    console.log('═══════════════════════════════════════════════════\n')
    
    process.exit(0)
    
  } catch (error: any) {
    console.error('\n❌ Authentication/Registration failed!')
    
    if (error.response) {
      console.error('\nResponse status:', error.response.status)
      console.error('Response data:', JSON.stringify(error.response.data, null, 2))
      
      if (error.response.data?.error) {
        const err = error.response.data.error
        console.error('\nError details:')
        console.error('- Type:', err.error_type)
        console.error('- Code:', err.code)
        console.error('- Message:', err.message)
      }
      
      console.error('\n🔍 Common issues:')
      console.error('1. Wrong credentials - Check your Pesapal dashboard')
      console.error('2. Wrong environment - Are you using production keys with sandbox URL (or vice versa)?')
      console.error('3. Expired/Invalid credentials - Generate new ones from Pesapal')
      console.error('4. Account not activated - Verify your Pesapal account is active')
      
    } else if (error.request) {
      console.error('\nNo response received from Pesapal')
      console.error('Possible issues:')
      console.error('- Network connectivity problem')
      console.error('- Firewall blocking the request')
      console.error('- Pesapal service is down')
    } else {
      console.error('\nError:', error.message)
    }
    
    process.exit(1)
  }
}

debugAuth()