import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import axios from "axios"
import { getEnhancedVoiceflowResponse } from "@/lib/voiceflow" // Import the Voiceflow utility

const testIntegrationSchema = z.object({
  integrationName: z.string(),
  credentials: z.object({
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    webhookUrl: z.string().optional(),
    projectId: z.string().optional(), // For Voiceflow
    versionId: z.string().optional(), // For Voiceflow
    additionalSettings: z.record(z.string()).optional(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = testIntegrationSchema.parse(body)
    const { integrationName, credentials } = validatedData

    const testResult = await testIntegrationCredentials(integrationName, credentials)

    if (testResult.success) {
      return NextResponse.json({ success: true, message: testResult.message }, { status: 200 })
    } else {
      return NextResponse.json({ success: false, message: testResult.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Error testing integration:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * This function provides a template for testing credentials for various integrations.
 * In a real application, you would replace the placeholder logic with actual API calls
 * to the respective third-party services using their SDKs or direct API endpoints.
 *
 * IMPORTANT: For security, never expose actual API keys or secrets directly in client-side code.
 * All sensitive operations should be handled on the server.
 *
 * For a truly production-ready test:
 * - Use the actual SDKs or direct API endpoints of each service.
 * - Perform a minimal, non-destructive operation (e.g., list a few items, get user info, send a test message to a private channel).
 * - Handle specific API error codes (e.g., 401 for unauthorized, 403 for forbidden, 404 for not found).
 * - Implement robust retry mechanisms and exponential backoff for transient errors.
 * - Ensure all sensitive credentials are handled securely (e.g., encrypted at rest, used over HTTPS).
 */
async function testIntegrationCredentials(
  integrationName: string,
  credentials: {
    apiKey?: string
    apiSecret?: string
    webhookUrl?: string
    projectId?: string // For Voiceflow
    versionId?: string // For Voiceflow
    additionalSettings?: Record<string, string>
  },
): Promise<{ success: boolean; message: string }> {
  // Simulate network delay for a more realistic user experience
  await new Promise((resolve) => setTimeout(resolve, 1500))

  switch (integrationName) {
    case "Voiceflow":
      if (!credentials.apiKey || !credentials.projectId) {
        return { success: false, message: "Voiceflow API Key and Project ID are required." }
      }
      try {
        // Attempt a simple interaction to validate Voiceflow credentials
        const dummyUserId = `test-user-${Date.now()}`
        const testResponse = await getEnhancedVoiceflowResponse(
          "Hello", // A simple test message
          dummyUserId,
          { test_variable: "true" }, // Pass some dummy variables
          credentials.apiKey,
          credentials.projectId,
          credentials.versionId,
          {
            maxRetries: 1, // Don't retry for a test
            timeoutMs: 5000, // Shorter timeout for test
            enableFallbackDetection: false, // Don't trigger fallback for test
          },
        )

        if (testResponse.success) {
          return { success: true, message: "Voiceflow connected successfully!" }
        } else {
          return { success: false, message: `Voiceflow connection failed: ${testResponse.error || "Unknown error"}` }
        }
      } catch (error: any) {
        return { success: false, message: `Voiceflow connection failed: ${error.message || "Unknown error"}` }
      }

    case "Google Calendar":
      if (!credentials.apiKey) return { success: false, message: "Google Calendar Client ID is required." }
      // In a real scenario, you'd initiate an OAuth flow or use a service account.
      // For demonstration, we'll just check for a plausible format.
      if (credentials.apiKey.startsWith("GOCSP") || credentials.apiKey.endsWith(".apps.googleusercontent.com")) {
        return { success: true, message: "Google Calendar Client ID format valid. (Requires OAuth for full test)" }
      }
      return { success: false, message: "Invalid Google Calendar Client ID format." }

    case "Stripe":
      if (!credentials.apiKey || !credentials.apiSecret)
        return { success: false, message: "Stripe Publishable and Secret Keys are required." }
      try {
        // In a real app, you'd use the Stripe SDK to make a test call, e.g., list customers.
        // This would require the 'stripe' npm package.
        // const stripe = new Stripe(credentials.apiSecret, { apiVersion: '2023-10-16' });
        // await stripe.customers.list({ limit: 1 }); // Should succeed with valid keys
        if (credentials.apiKey.startsWith("pk_") && credentials.apiSecret.startsWith("sk_")) {
          return {
            success: true,
            message: "Stripe API Keys format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Stripe API Key format." }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return { success: false, message: "Stripe API Key is invalid or unauthorized." }
        }
        return { success: false, message: `Stripe connection failed: ${error.message || "Unknown error"}` }
      }

    case "Salesforce":
      if (!credentials.apiKey || !credentials.apiSecret)
        return { success: false, message: "Salesforce Consumer Key and Secret are required." }
      try {
        // Real Salesforce integration involves OAuth 2.0. This is a simplified check.
        // In a real app, you'd use a library like 'jsforce' to attempt a connection.
        // const conn = new jsforce.Connection({
        //   oauth2: { clientId: credentials.apiKey, clientSecret: credentials.apiSecret },
        //   instanceUrl: 'https://your-instance.salesforce.com' // Requires instance URL
        // });
        // await conn.login(); // This would validate credentials
        if (credentials.apiKey.length > 20 && credentials.apiSecret.length > 20) {
          return { success: true, message: "Salesforce credentials format valid. (Requires OAuth for full test)" }
        }
        return { success: false, message: "Invalid Salesforce credentials format." }
      } catch (error: any) {
        return { success: false, message: `Salesforce connection failed: ${error.message || "Unknown error"}` }
      }

    case "Slack":
    case "Discord":
      if (!credentials.webhookUrl) return { success: false, message: `${integrationName} Webhook URL is required.` }
      try {
        // Attempt to send a test message to the webhook URL
        const testMessage = { text: `Test message from your app for ${integrationName} integration.` }
        const response = await axios.post(credentials.webhookUrl, testMessage, {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        })
        if (response.status === 200 || response.status === 204) {
          // Slack returns 200, Discord returns 204
          return { success: true, message: `${integrationName} webhook validated successfully!` }
        }
        return { success: false, message: `Failed to send test message to ${integrationName} webhook.` }
      } catch (error: any) {
        return {
          success: false,
          message: `${integrationName} webhook test failed: ${error.message || "Invalid URL or network issue"}`,
        }
      }

    case "SMS":
      if (!credentials.apiKey || !credentials.apiSecret)
        return { success: false, message: "SMS API Key and Secret are required." }
      // This would typically involve sending a test SMS, which incurs cost.
      // For demonstration, we'll just check for a plausible format.
      // In a real app, you'd use a provider's SDK (e.g., Twilio) to make a non-sending API call if available,
      // or send a test message to a controlled number.
      if (credentials.apiKey.length > 10 && credentials.apiSecret.length > 10) {
        return { success: true, message: "SMS API Key format valid. (Actual SMS sending test not performed)" }
      }
      return { success: false, message: "Invalid SMS API Key format." }

    case "Calendly":
      // Calendly typically uses direct links for basic integration, not API keys.
      // If a more advanced integration (e.g., managing events via API) is needed, it would require OAuth.
      // Since no credentialsFields are defined for Calendly in workflow-selector.tsx, this case won't be reached
      // if the UI correctly hides the test button.
      return { success: true, message: "Calendly integration typically uses direct links. No API key test needed." }

    case "Acuity":
      if (!credentials.apiKey) return { success: false, message: "Acuity API Key is required." }
      try {
        // In a real app, you'd make a simple API call to Acuity, e.g., get a list of appointment types.
        // const response = await axios.get(`https://api.acuityscheduling.com/v1/appointment-types`, {
        //   headers: { 'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}` }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10) {
          return {
            success: true,
            message: "Acuity API Key format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Acuity API Key format." }
      } catch (error: any) {
        return { success: false, message: `Acuity connection failed: ${error.message || "Unknown error"}` }
      }

    case "Zoom":
      if (!credentials.apiKey || !credentials.apiSecret)
        return { success: false, message: "Zoom Client ID and Secret are required." }
      try {
        // In a real app, you'd perform an OAuth token request or a simple authenticated API call.
        // const response = await axios.post('https://zoom.us/oauth/token', new URLSearchParams({
        //   grant_type: 'client_credentials',
        //   client_id: credentials.apiKey,
        //   client_secret: credentials.apiSecret
        // }));
        // if (response.status === 200 && response.data.access_token) { ... }
        if (credentials.apiKey.length > 10 && credentials.apiSecret.length > 10) {
          return { success: true, message: "Zoom credentials format valid. (Requires OAuth for full test)" }
        }
        return { success: false, message: "Invalid Zoom credentials format." }
      } catch (error: any) {
        return { success: false, message: `Zoom connection failed: ${error.message || "Unknown error"}` }
      }

    case "HubSpot":
      if (!credentials.apiKey) return { success: false, message: "HubSpot Access Token is required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., get a list of contacts.
        // const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
        //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.startsWith("pat-")) {
          return {
            success: true,
            message: "HubSpot Access Token format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid HubSpot Access Token format." }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return { success: false, message: "HubSpot Access Token is invalid or unauthorized." }
        }
        return { success: false, message: `HubSpot connection failed: ${error.message || "Unknown error"}` }
      }

    case "PayPal":
      if (!credentials.apiKey || !credentials.apiSecret)
        return { success: false, message: "PayPal Client ID and Secret are required." }
      try {
        // In a real app, you'd request an access token from PayPal.
        // const response = await axios.post('https://api-m.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        //   headers: {
        //     'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64')}`,
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   }
        // });
        // if (response.status === 200 && response.data.access_token) { ... }
        if (credentials.apiKey.length > 10 && credentials.apiSecret.length > 10) {
          return {
            success: true,
            message: "PayPal credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid PayPal credentials format." }
      } catch (error: any) {
        return { success: false, message: `PayPal connection failed: ${error.message || "Unknown error"}` }
      }

    case "Shopify":
      if (!credentials.apiKey) return { success: false, message: "Shopify API Access Token is required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., get shop info.
        // Requires shop domain in additionalSettings.
        // const shopDomain = credentials.additionalSettings?.shopDomain;
        // if (!shopDomain) return { success: false, message: "Shopify Domain is required for testing." };
        // const response = await axios.get(`https://${shopDomain}/admin/api/2023-10/shop.json`, {
        //   headers: { 'X-Shopify-Access-Token': credentials.apiKey }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10) {
          return {
            success: true,
            message: "Shopify API Access Token format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Shopify API Access Token format." }
      } catch (error: any) {
        return { success: false, message: `Shopify connection failed: ${error.message || "Unknown error"}` }
      }

    case "Inventory APIs":
      if (!credentials.apiKey || !credentials.additionalSettings?.endpoint)
        return { success: false, message: "Inventory API Key and Endpoint URL are required." }
      try {
        // This is a generic example. Replace with actual API call to the inventory system.
        const response = await axios.get(credentials.additionalSettings.endpoint, {
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
          timeout: 5000,
        })
        if (response.status === 200) {
          return { success: true, message: "Inventory API connected successfully!" }
        }
        return { success: false, message: "Failed to connect to Inventory API." }
      } catch (error: any) {
        return { success: false, message: `Inventory API connection failed: ${error.message || "Unknown error"}` }
      }

    case "Teachable":
      if (!credentials.apiKey || !credentials.additionalSettings?.schoolUrl)
        return { success: false, message: "Teachable API Key and School URL are required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., list courses.
        // const response = await axios.get(`${credentials.additionalSettings.schoolUrl}/api/v1/courses`, {
        //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10 && credentials.additionalSettings.schoolUrl.startsWith("https://")) {
          return {
            success: true,
            message: "Teachable credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Teachable credentials format." }
      } catch (error: any) {
        return { success: false, message: `Teachable connection failed: ${error.message || "Unknown error"}` }
      }

    case "Thinkific":
      if (!credentials.apiKey || !credentials.additionalSettings?.subdomain)
        return { success: false, message: "Thinkific API Key and Subdomain are required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., list courses.
        // const response = await axios.get(`https://${credentials.additionalSettings.subdomain}.thinkific.com/api/public/v1/courses`, {
        //   headers: { 'X-Auth-API-Key': credentials.apiKey, 'X-Auth-Subdomain': credentials.additionalSettings.subdomain }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10 && credentials.additionalSettings.subdomain.length > 3) {
          return {
            success: true,
            message: "Thinkific credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Thinkific credentials format." }
      } catch (error: any) {
        return { success: false, message: `Thinkific connection failed: ${error.message || "Unknown error"}` }
      }

    case "Moodle":
      if (!credentials.apiKey || !credentials.additionalSettings?.serviceUrl)
        return { success: false, message: "Moodle API Token and Web Service URL are required." }
      try {
        // In a real app, you'd make a simple Moodle web service call, e.g., core_webservice_get_site_info.
        // const response = await axios.get(`${credentials.additionalSettings.serviceUrl}/webservice/rest/server.php`, {
        //   params: {
        //     wstoken: credentials.apiKey,
        //     wsfunction: 'core_webservice_get_site_info',
        //     moodlewsrestformat: 'json'
        //   }
        // });
        // if (response.status === 200 && response.data.sitename) { ... }
        if (credentials.apiKey.length > 10 && credentials.additionalSettings.serviceUrl.startsWith("https://")) {
          return {
            success: true,
            message: "Moodle credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Moodle credentials format." }
      } catch (error: any) {
        return { success: false, message: `Moodle connection failed: ${error.message || "Unknown error"}` }
      }

    case "Email Marketing":
      if (!credentials.apiKey || !credentials.additionalSettings?.listId)
        return { success: false, message: "Email Marketing API Key and List ID are required." }
      try {
        // This is generic. In a real app, you'd use a specific email marketing API (e.g., Mailchimp, ConvertKit)
        // to validate the API key and list ID, perhaps by attempting to get list details.
        // Example (Mailchimp):
        // const [dc, apiKey] = credentials.apiKey.split('-'); // dc is data center
        // const response = await axios.get(`https://${dc}.api.mailchimp.com/3.0/lists/${credentials.additionalSettings.listId}`, {
        //   headers: { 'Authorization': `apikey ${apiKey}` }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10 && credentials.additionalSettings.listId.length > 5) {
          return {
            success: true,
            message: "Email Marketing credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Email Marketing credentials format." }
      } catch (error: any) {
        return { success: false, message: `Email Marketing connection failed: ${error.message || "Unknown error"}` }
      }

    case "Circle":
      if (!credentials.apiKey || !credentials.additionalSettings?.communityUrl)
        return { success: false, message: "Circle.so API Token and Community URL are required." }
      try {
        // In a real app, you'd make a simple authenticated call to Circle.so API.
        // const response = await axios.get(`${credentials.additionalSettings.communityUrl}/api/v1/community`, {
        //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10 && credentials.additionalSettings.communityUrl.startsWith("https://")) {
          return {
            success: true,
            message: "Circle.so credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Circle.so credentials format." }
      } catch (error: any) {
        return { success: false, message: `Circle.so connection failed: ${error.message || "Unknown error"}` }
      }

    case "Mighty Networks":
      // Mighty Networks typically uses webhooks. A simple check for webhook URL presence.
      // If a more advanced integration is needed, it would involve their API.
      if (!credentials.webhookUrl) return { success: false, message: "Mighty Networks Webhook URL is required." }
      if (credentials.webhookUrl.startsWith("https://")) {
        return { success: true, message: "Mighty Networks Webhook URL format valid. (Further webhook test needed)" }
      }
      return { success: false, message: "Invalid Mighty Networks Webhook URL format." }

    case "Patreon":
      if (!credentials.apiKey || !credentials.apiSecret)
        return { success: false, message: "Patreon Client ID and Secret are required." }
      try {
        // In a real app, you'd perform an OAuth token request to Patreon.
        // const response = await axios.post('https://www.patreon.com/oauth2/token', new URLSearchParams({
        //   grant_type: 'client_credentials',
        //   client_id: credentials.apiKey,
        //   client_secret: credentials.apiSecret
        // }));
        // if (response.status === 200 && response.data.access_token) { ... }
        if (credentials.apiKey.length > 10 && credentials.apiSecret.length > 10) {
          return { success: true, message: "Patreon credentials format valid. (Requires OAuth for full test)" }
        }
        return { success: false, message: "Invalid Patreon credentials format." }
      } catch (error: any) {
        return { success: false, message: `Patreon connection failed: ${error.message || "Unknown error"}` }
      }

    case "Zendesk":
      if (!credentials.apiKey || !credentials.additionalSettings?.subdomain || !credentials.additionalSettings?.email)
        return { success: false, message: "Zendesk API Token, Subdomain, and Email are required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., get current user.
        // const response = await axios.get(`https://${credentials.additionalSettings.subdomain}.zendesk.com/api/v2/users/me.json`, {
        //   headers: { 'Authorization': `Basic ${Buffer.from(`${credentials.additionalSettings.email}/token:${credentials.apiKey}`).toString('base64')}` }
        // });
        // if (response.status === 200) { ... }
        if (
          credentials.apiKey.length > 10 &&
          credentials.additionalSettings.subdomain.length > 3 &&
          credentials.additionalSettings.email.includes("@")
        ) {
          return {
            success: true,
            message: "Zendesk credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Zendesk credentials format." }
      } catch (error: any) {
        return { success: false, message: `Zendesk connection failed: ${error.message || "Unknown error"}` }
      }

    case "Freshdesk":
      if (!credentials.apiKey || !credentials.additionalSettings?.domain)
        return { success: false, message: "Freshdesk API Key and Domain are required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., list tickets.
        // const response = await axios.get(`https://${credentials.additionalSettings.domain}.freshdesk.com/api/v2/tickets?per_page=1`, {
        //   headers: { 'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:X`).toString('base64')}` }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10 && credentials.additionalSettings.domain.length > 3) {
          return {
            success: true,
            message: "Freshdesk credentials format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Freshdesk credentials format." }
      } catch (error: any) {
        return { success: false, message: `Freshdesk connection failed: ${error.message || "Unknown error"}` }
      }

    case "Intercom":
      if (!credentials.apiKey) return { success: false, message: "Intercom Access Token is required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., list conversations.
        // const response = await axios.get('https://api.intercom.io/conversations?per_page=1', {
        //   headers: { 'Authorization': `Bearer ${credentials.apiKey}`, 'Accept': 'application/json' }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10) {
          return {
            success: true,
            message: "Intercom Access Token format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Intercom Access Token format." }
      } catch (error: any) {
        return { success: false, message: `Intercom connection failed: ${error.message || "Unknown error"}` }
      }

    case "Square":
      if (!credentials.apiKey) return { success: false, message: "Square Access Token is required." }
      try {
        // In a real app, you'd make a simple authenticated call, e.g., list locations.
        // const response = await axios.get('https://connect.squareup.com/v2/locations', {
        //   headers: { 'Authorization': `Bearer ${credentials.apiKey}`, 'Square-Version': '2023-10-18' }
        // });
        // if (response.status === 200) { ... }
        if (credentials.apiKey.length > 10) {
          return {
            success: true,
            message: "Square Access Token format valid. (Further API call needed for full verification)",
          }
        }
        return { success: false, message: "Invalid Square Access Token format." }
      } catch (error: any) {
        return { success: false, message: `Square connection failed: ${error.message || "Unknown error"}` }
      }

    case "DoorDash":
      if (!credentials.apiKey) return { success: false, message: "DoorDash API Key is required." }
      try {
        // This is highly dependent on DoorDash's merchant API. A real test would involve
        // a non-destructive call, e.g., checking store status if available.
        // For now, a format check.
        if (credentials.apiKey.length > 10) {
          return {
            success: true,
            message: "DoorDash API Key format valid. (Requires specific merchant API call for full verification)",
          }
        }
        return { success: false, message: "Invalid DoorDash API Key format." }
      } catch (error: any) {
        return { success: false, message: `DoorDash connection failed: ${error.message || "Unknown error"}` }
      }

    case "Uber Eats":
      if (!credentials.apiKey) return { success: false, message: "Uber Eats API Key is required." }
      try {
        // Similar to DoorDash, highly dependent on Uber Eats merchant API.
        // For now, a format check.
        if (credentials.apiKey.length > 10) {
          return {
            success: true,
            message: "Uber Eats API Key format valid. (Requires specific merchant API call for full verification)",
          }
        }
        return { success: false, message: "Invalid Uber Eats API Key format." }
      } catch (error: any) {
        return { success: false, message: `Uber Eats connection failed: ${error.message || "Unknown error"}` }
      }

    default:
      // Fallback for any other integration not explicitly handled
      if (credentials.apiKey || credentials.webhookUrl) {
        return { success: true, message: `Generic credentials provided for ${integrationName}.` }
      }
      return { success: false, message: `No credentials provided for ${integrationName}.` }
  }
}
