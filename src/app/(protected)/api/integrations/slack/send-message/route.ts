import { handleIntegrationProxy } from "@/lib/integration-proxy"
import axios from "axios"

// You don't need a new package if you're just using webhooks, axios is sufficient.
export async function POST(req: Request) {
  return handleIntegrationProxy(req, "Slack", async (decryptedCredentials, payload) => {
    const webhookUrl = decryptedCredentials.webhookUrl // Mapped from webhookUrl in your UI

    if (!webhookUrl) {
      throw new Error("Missing Slack Webhook URL.")
    }

    // Expected payload from Voiceflow:
    // {
    //   "channel": "#general", // Optional, if webhook is for a specific channel
    //   "messageText": "New lead from Instagram: {customer_name} - {customer_email}"
    // }
    const { channel, messageText } = payload

    if (!messageText) {
      throw new Error("Missing messageText in payload.")
    }

    const slackPayload = {
      text: messageText,
      channel: channel, // If provided, overrides default webhook channel
    }

    const response = await axios.post(webhookUrl, slackPayload)

    return {
      status: response.status,
      statusText: response.statusText,
      message: "Slack message sent successfully.",
    }
  })
}
