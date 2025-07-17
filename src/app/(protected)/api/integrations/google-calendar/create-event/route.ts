import { handleIntegrationProxy } from "@/lib/integration-proxy"
import { google } from "googleapis"

// You need to install googleapis: npm install googleapis
export async function POST(req: Request) {
  return handleIntegrationProxy(req, "Google Calendar", async (decryptedCredentials, payload) => {
    const { clientEmail, privateKey } = {
      clientEmail: decryptedCredentials.apiKey, // Mapped from apiKey in your UI
      privateKey: decryptedCredentials.apiSecret, // Mapped from apiSecret in your UI
    }

    if (!clientEmail || !privateKey) {
      throw new Error("Missing Google Calendar service account credentials (Client Email or Private Key).")
    }

    // Authenticate with Google Calendar API using service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"), // Replace escaped newlines
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    })

    const calendar = google.calendar({ version: "v3", auth })

    // Expected payload from Voiceflow:
    // {
    //   "summary": "Meeting with {customer_name}",
    //   "description": "Discussion about {topic}",
    //   "startDateTime": "2025-07-20T10:00:00-07:00",
    //   "endDateTime": "2025-07-20T11:00:00-07:00",
    //   "attendees": ["customer@example.com", "yourteam@example.com"]
    // }
    const { summary, description, startDateTime, endDateTime, attendees } = payload

    if (!summary || !startDateTime || !endDateTime) {
      throw new Error("Missing event details (summary, startDateTime, endDateTime) in payload.")
    }

    const event = {
      summary: summary,
      description: description,
      start: {
        dateTime: startDateTime,
        timeZone: "America/Los_Angeles", // Or dynamically get from businessInfo
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Los_Angeles", // Or dynamically get from businessInfo
      },
      attendees: attendees?.map((email: string) => ({ email })) || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: "primary", // Use 'primary' for the service account's calendar or a specific calendar ID
      requestBody: event,
    })

    return {
      status: response.status,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    }
  })
}
