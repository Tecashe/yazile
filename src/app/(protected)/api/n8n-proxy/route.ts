import { NextResponse } from "next/server"

// This is your actual n8n webhook URL.
// You should set this as an environment variable in your Next.js project (e.g., .env.local or Vercel project settings).
const N8N_WEBHOOK_URL = "https://yaziln8n.onrender.com/webhook/voiceflow-workflow-builder"

export async function POST(request: Request) {
  if (!N8N_WEBHOOK_URL) {
    console.error("N8N_WEBHOOK_URL environment variable is not set.")
    return NextResponse.json(
      { status: "error", message: "Server configuration error: N8N webhook URL is missing." },
      { status: 500 },
    )
  }

  try {
    const body = await request.json()
    console.log("Proxying request to n8n:", body)

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You might add an API key here if your n8n webhook requires authentication
        // 'X-N8N-API-Key': process.env.N8N_API_KEY,
      },
      body: JSON.stringify(body),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error(`Error from n8n: ${n8nResponse.status} - ${errorText}`)
      return NextResponse.json(
        {
          status: "error",
          message: `n8n returned an error: ${n8nResponse.status} ${n8nResponse.statusText}. Details: ${errorText}`,
        },
        { status: n8nResponse.status },
      )
    }

    const n8nResult = await n8nResponse.json()
    console.log("Received response from n8n:", n8nResult)
    return NextResponse.json(n8nResult, { status: 200 })
  } catch (error) {
    console.error("Error in n8n proxy route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: `Failed to communicate with n8n: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
