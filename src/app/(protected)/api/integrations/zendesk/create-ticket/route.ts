import { handleIntegrationProxy } from "@/lib/integration-proxy"
import axios from "axios"

// You don't need a new package, axios is sufficient.
export async function POST(req: Request) {
  return handleIntegrationProxy(req, "Zendesk", async (decryptedCredentials, payload) => {
    const { subdomain, email, token } = {
      subdomain: decryptedCredentials.additionalSettings?.subdomain,
      email: decryptedCredentials.additionalSettings?.email,
      token: decryptedCredentials.apiKey, // Mapped from apiKey in your UI
    }

    if (!subdomain || !email || !token) {
      throw new Error("Missing Zendesk credentials (subdomain, email, or token).")
    }

    // Expected payload from Voiceflow:
    // {
    //   "subject": "New Support Inquiry from Instagram DM",
    //   "comment": "Customer {customer_name} reported: {user_message_variable}",
    //   "requesterEmail": "{customer_email_variable}",
    //   "priority": "normal" // or "urgent", "high", "low"
    // }
    const { subject, comment, requesterEmail, priority = "normal" } = payload

    if (!subject || !comment || !requesterEmail) {
      throw new Error("Missing ticket details (subject, comment, or requesterEmail) in payload.")
    }

    const authHeader = Buffer.from(`${requesterEmail}/token:${token}`).toString("base64")

    const ticketData = {
      ticket: {
        subject: subject,
        comment: {
          body: comment,
        },
        requester: {
          name: requesterEmail, // Zendesk will create user if not exists
          email: requesterEmail,
        },
        priority: priority,
        // You can add more fields like tags, custom fields, etc.
        // tags: ["instagram_dm", "automated_ticket"],
      },
    }

    const response = await axios.post(`https://${subdomain}.zendesk.com/api/v2/tickets.json`, ticketData, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    })

    return {
      status: response.status,
      ticketId: response.data.ticket.id,
      ticketUrl: `https://${subdomain}.zendesk.com/agent/tickets/${response.data.ticket.id}`,
      message: "Zendesk ticket created successfully.",
    }
  })
}
