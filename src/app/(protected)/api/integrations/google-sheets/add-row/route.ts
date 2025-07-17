import { handleIntegrationProxy } from "@/lib/integration-proxy"
import { google } from "googleapis"

export async function POST(req: Request) {
  return handleIntegrationProxy(req, "Google Sheets", async (decryptedCredentials, payload) => {
    const { clientEmail, privateKey, spreadsheetId, sheetName } = {
      clientEmail: decryptedCredentials.apiKey, // Mapped from apiKey in your UI
      privateKey: decryptedCredentials.apiSecret, // Mapped from apiSecret in your UI
      spreadsheetId: decryptedCredentials.additionalSettings?.spreadsheetId,
      sheetName: decryptedCredentials.additionalSettings?.sheetName,
    }

    if (!clientEmail || !privateKey || !spreadsheetId || !sheetName) {
      throw new Error("Missing Google Sheets credentials or sheet details.")
    }

    // Authenticate with Google Sheets API using service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"), // Replace escaped newlines
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Assuming payload contains an array of values to add as a row
    const values = payload.row_data || [] // e.g., { row_data: ["John Doe", "john@example.com"] }

    if (!Array.isArray(values)) {
      throw new Error("Invalid payload: 'row_data' must be an array.")
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`, // Append to the first available row
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    })

    return {
      status: response.status,
      statusText: response.statusText,
      updatedRange: response.data.updates?.updatedRange,
    }
  })
}
