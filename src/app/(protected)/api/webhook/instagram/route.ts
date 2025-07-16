import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getEnhancedVoiceflowResponse } from "@/lib/voiceflow" // Import the Voiceflow utility

const testIntegrationSchema = z.object({
  integrationType: z.string(),
  credentials: z.object({
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    webhookUrl: z.string().optional(),
    projectId: z.string().optional(), // For Voiceflow
    versionId: z.string().optional(), // For Voiceflow
    additionalSettings: z.record(z.string()).optional(),
    botToken: z.string().optional(), // For Slack
    subdomain: z.string().optional(), // For Zendesk, Stripe, Slack
    email: z.string().optional(), // For Zendesk
    token: z.string().optional(), // For Zendesk
    secretKey: z.string().optional(), // For Stripe
    shopDomain: z.string().optional(), // For Shopify
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = testIntegrationSchema.parse(body)
    const { integrationType, credentials } = validatedData

    switch (integrationType) {
      case "voiceflow":
        const { apiKey, projectId, versionId } = credentials
        if (!apiKey || !projectId) {
          return NextResponse.json(
            { success: false, message: "Missing Voiceflow API Key or Project ID" },
            { status: 400 },
          )
        }
        // Test Voiceflow credentials by attempting a minimal interaction
        const voiceflowTestResult = await getEnhancedVoiceflowResponse(
          "test message", // userInput
          "test-user-id", // userId (a dummy ID for testing)
          {}, // businessVariables (empty for a simple test)
          apiKey, // voiceflowApiKey
          projectId, // voiceflowProjectId
          versionId, // voiceflowVersionId (optional)
        )
        if (voiceflowTestResult.success) {
          return NextResponse.json({ success: true, message: "Voiceflow credentials are valid." })
        } else {
          return NextResponse.json(
            { success: false, message: `Voiceflow test failed: ${voiceflowTestResult.error}` },
            { status: 400 },
          )
        }
      case "zendesk":
        // For Zendesk, you would typically use the Zendesk API to verify credentials.
        // This is a placeholder for a real API call to Zendesk.
        // Example:
        // const { subdomain, email, token } = credentials;
        // const zendeskResponse = await axios.get(`https://${subdomain}.zendesk.com/api/v2/users/me.json`, {
        //   headers: { Authorization: `Basic ${btoa(`${email}/token:${token}`)}` }
        // });
        // if (zendeskResponse.status === 200) { ... }
        if (!credentials.subdomain || !credentials.email || !credentials.token) {
          return NextResponse.json({ success: false, message: "Missing Zendesk credentials." }, { status: 400 })
        }
        // Simulate success for now
        return NextResponse.json({ success: true, message: "Zendesk credentials are valid (simulated)." })
      case "stripe":
        // For Stripe, you would typically use the Stripe SDK or API to verify credentials.
        // Example:
        // const stripe = new Stripe(credentials.secretKey);
        // await stripe.customers.list({ limit: 1 }); // A simple API call to verify key
        if (!credentials.secretKey) {
          return NextResponse.json({ success: false, message: "Missing Stripe secret key." }, { status: 400 })
        }
        // Simulate success for now
        return NextResponse.json({ success: true, message: "Stripe credentials are valid (simulated)." })
      case "slack":
        // For Slack, you would typically use the Slack API to verify credentials.
        // Example:
        // const slackClient = new WebClient(credentials.botToken);
        // await slackClient.auth.test(); // Test the token
        if (!credentials.botToken) {
          return NextResponse.json({ success: false, message: "Missing Slack bot token." }, { status: 400 })
        }
        // Simulate success for now
        return NextResponse.json({ success: true, message: "Slack credentials are valid (simulated)." })
      default:
        return NextResponse.json({ success: false, message: "Unknown integration type." }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Integration test error:", error)
    // Provide more specific error messages if possible based on the integration type
    return NextResponse.json({ success: false, message: `Test failed: ${error.message}` }, { status: 500 })
  }
}
