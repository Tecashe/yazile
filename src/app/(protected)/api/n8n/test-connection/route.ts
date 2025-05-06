import { type NextRequest, NextResponse } from "next/server"

/**
 * Tests a connection to an n8n instance
 *
 * This endpoint makes a real request to the provided n8n instance
 * to verify that the connection is working properly.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { n8nUrl, apiKey } = body

    // Validate required fields
    if (!n8nUrl) {
      return NextResponse.json({ error: "n8n URL is required" }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Normalize the URL (ensure it doesn't end with a slash)
    const normalizedUrl = n8nUrl.endsWith("/") ? n8nUrl.slice(0, -1) : n8nUrl

    // Test the connection by fetching the n8n health endpoint
    // Most n8n instances have a /health endpoint that returns basic info
    const healthEndpoint = `${normalizedUrl}/health`

    const response = await fetch(healthEndpoint, {
      method: "GET",
      headers: {
        "X-N8N-API-KEY": apiKey,
        Accept: "application/json",
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    })

    // If we can't reach the health endpoint, try the workflows endpoint
    if (!response.ok) {
      // Try the workflows endpoint as a fallback
      const workflowsEndpoint = `${normalizedUrl}/api/v1/workflows`

      const workflowsResponse = await fetch(workflowsEndpoint, {
        method: "GET",
        headers: {
          "X-N8N-API-KEY": apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!workflowsResponse.ok) {
        // If both endpoints fail, return an error
        const errorText = await workflowsResponse.text().catch(() => "Unknown error")
        return NextResponse.json(
          {
            error: `Failed to connect to n8n instance: ${workflowsResponse.status} ${workflowsResponse.statusText}`,
            details: errorText,
          },
          { status: 400 },
        )
      }

      // If workflows endpoint works, connection is valid
      return NextResponse.json({
        success: true,
        message: "Successfully connected to n8n instance",
        details: "Connected via workflows API",
      })
    }

    // If health endpoint works, connection is valid
    const healthData = await response.json().catch(() => ({}))

    return NextResponse.json({
      success: true,
      message: "Successfully connected to n8n instance",
      details: healthData,
    })
  } catch (error) {
    console.error("Error testing n8n connection:", error)

    // Provide a helpful error message based on the error type
    let errorMessage = "Failed to connect to n8n instance"

    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage =
        "Network error: Unable to reach the n8n instance. Please check the URL and your network connection."
    } else if (error instanceof DOMException && error.name === "AbortError") {
      errorMessage = "Connection timed out. The n8n instance took too long to respond."
    } else if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 },
    )
  }
}
