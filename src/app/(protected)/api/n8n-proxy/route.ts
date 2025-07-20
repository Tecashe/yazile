
import { NextResponse } from "next/server"

// Configuration
const N8N_WEBHOOK_URL = process.env.N8N_WORKFLOWS_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/voiceflow-workflow-builder"
const REQUEST_TIMEOUT = 300000 // 5 minutes timeout
const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds base delay

interface N8nResponse {
  status: string
  workflowDesign?: string
  message?: string
  requestId?: string
  error?: string
}

interface ApiError {
  error: string
  details?: string
  timestamp: string
  requestId?: string
}

// Helper function to create error responses
function createErrorResponse(error: string, details?: string, status: number = 500): NextResponse<ApiError> {
  return NextResponse.json({
    error,
    details,
    timestamp: new Date().toISOString()
  }, { status })
}

// Helper function to add delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper function to make request with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - n8n took too long to respond')
    }
    throw error
  }
}

// Helper function to get user-friendly error messages
function getUserFriendlyError(status: number, details: string): string {
  switch (status) {
    case 400:
      return "⚠️ Invalid request: Please check your input and try again."
    case 408:
      return "⏱️ Request timeout: The AI is working on a complex design. Please try again in a moment."
    case 429:
      return "🚦 Too many requests: Please wait a moment before trying again."
    case 500:
      return "🔧 Server error: Our team has been notified and is investigating."
    case 502:
    case 503:
    case 504:
      return "🔌 Service temporarily unavailable: Please try again in a few minutes."
    default:
      return `🔧 Technical issue (${status}): ${details}`
  }
}

export async function POST(request: Request) {
  const startTime = Date.now()
  let requestBody: any

  // Check if N8N_WEBHOOK_URL is configured
  if (!N8N_WEBHOOK_URL) {
    console.error("❌ N8N_WEBHOOK_URL environment variable is not set.")
    return createErrorResponse(
      "Server configuration error",
      "N8N webhook URL is missing. Please contact support.",
      500
    )
  }

  try {
    // Parse request body with error handling
    try {
      requestBody = await request.json()
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError)
      return createErrorResponse(
        "Invalid JSON in request body",
        "Please check your request format",
        400
      )
    }

    // Validate required fields
    if (!requestBody.action) {
      return createErrorResponse(
        "Missing required field: action",
        'Action must be "initial", "refine", or "approve"',
        400
      )
    }

    // Log the incoming request (with sensitive data redacted)
    console.log("🚀 N8N Proxy - Incoming request:", {
      action: requestBody.action,
      platform: requestBody.platform,
      businessName: requestBody.businessName,
      selectedChannels: requestBody.selectedChannels,
      hasWorkflowRequest: !!requestBody.workflowRequest,
      timestamp: new Date().toISOString()
    })

    // Prepare request for n8n
    const n8nPayload = {
      ...requestBody,
      proxyTimestamp: new Date().toISOString(),
      proxyVersion: "1.0"
    }

    let lastError: Error | null = null
    let attempt = 0

    // Retry logic for n8n requests
    while (attempt < MAX_RETRIES) {
      attempt++
      
      try {
        console.log(`🔄 Attempting n8n request (${attempt}/${MAX_RETRIES})...`)
        
        // Make request to n8n with timeout
        const n8nResponse = await fetchWithTimeout(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "NextJS-N8N-Proxy/1.0",
            "X-Request-Source": "ai-workflow-builder",
            "X-Attempt": attempt.toString(),
            // Add API key if available
            ...(process.env.N8N_API_KEY && { "X-N8N-API-Key": process.env.N8N_API_KEY }),
          },
          body: JSON.stringify(n8nPayload)
        }, REQUEST_TIMEOUT)

        console.log(`📡 N8N Response - Status: ${n8nResponse.status}, Attempt: ${attempt}`)

        // Handle non-200 responses
        if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text()
          console.error(`❌ N8N HTTP Error ${n8nResponse.status}:`, errorText)
          
          // For 5xx errors, retry. For 4xx errors, don't retry
          if (n8nResponse.status >= 500 && attempt < MAX_RETRIES) {
            lastError = new Error(`N8N server error: ${n8nResponse.status} - ${errorText}`)
            console.log(`⏳ Retrying in ${RETRY_DELAY * attempt}ms...`)
            await delay(RETRY_DELAY * attempt) // Exponential backoff
            continue
          } else {
            const userFriendlyMessage = getUserFriendlyError(n8nResponse.status, errorText)
            return createErrorResponse(
              userFriendlyMessage,
              `N8N returned status ${n8nResponse.status}`,
              n8nResponse.status
            )
          }
        }

        // Parse n8n response
        let n8nData: N8nResponse
        try {
          const responseText = await n8nResponse.text()
          console.log("📋 Raw N8N Response preview:", responseText.substring(0, 200) + "...")
          
          n8nData = JSON.parse(responseText)
        } catch (parseError) {
          console.error("❌ Failed to parse N8N response:", parseError)
          
          if (attempt < MAX_RETRIES) {
            lastError = new Error("Invalid response format from N8N")
            console.log(`⏳ Retrying due to parse error in ${RETRY_DELAY * attempt}ms...`)
            await delay(RETRY_DELAY * attempt)
            continue
          } else {
            return createErrorResponse(
              "Invalid response from workflow engine",
              "The workflow returned malformed data"
            )
          }
        }

        // Validate n8n response structure
        if (!n8nData.status) {
          console.error("❌ Invalid N8N response structure:", n8nData)
          
          if (attempt < MAX_RETRIES) {
            lastError = new Error("Invalid response structure from N8N")
            console.log(`⏳ Retrying due to invalid structure in ${RETRY_DELAY * attempt}ms...`)
            await delay(RETRY_DELAY * attempt)
            continue
          } else {
            return createErrorResponse(
              "Invalid workflow response",
              "Missing status field in workflow response"
            )
          }
        }

        // Handle different response statuses
        const processingTime = Date.now() - startTime
        console.log(`✅ N8N request successful in ${processingTime}ms`)

        if (n8nData.status === "success") {
          // Success response
          return NextResponse.json({
            status: "success",
            workflowDesign: n8nData.workflowDesign,
            requestId: n8nData.requestId,
            message: n8nData.message || "Workflow generated successfully",
            processingTime,
            timestamp: new Date().toISOString()
          }, { status: 200 })
        } else if (n8nData.status === "retry_needed") {
          // Handle retry status from n8n
          if (attempt < MAX_RETRIES) {
            console.log("🔄 N8N requested retry, waiting before next attempt...")
            await delay(RETRY_DELAY * attempt) // Exponential backoff
            continue
          } else {
            return createErrorResponse(
              "🔄 Workflow generation failed after multiple attempts",
              "The AI workflow generator is experiencing issues. Please try again later."
            )
          }
        } else if (n8nData.status === "error") {
          // Error response from n8n
          return createErrorResponse(
            "🔧 Workflow generation failed",
            n8nData.message || "Unknown error from workflow engine"
          )
        } else {
          // Unknown status
          console.log("⚠️ Unknown status from N8N:", n8nData.status)
          
          if (attempt < MAX_RETRIES) {
            lastError = new Error(`Unknown status: ${n8nData.status}`)
            console.log(`⏳ Retrying due to unknown status in ${RETRY_DELAY * attempt}ms...`)
            await delay(RETRY_DELAY * attempt)
            continue
          } else {
            return createErrorResponse(
              "🔧 Unknown workflow status",
              `Received unexpected status: ${n8nData.status}`
            )
          }
        }

      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError : new Error("Unknown fetch error")
        console.error(`❌ Attempt ${attempt} failed:`, lastError.message)
        
        if (attempt < MAX_RETRIES) {
          console.log(`⏳ Retrying in ${RETRY_DELAY * attempt}ms...`)
          await delay(RETRY_DELAY * attempt) // Exponential backoff
        }
      }
    }

    // All retries exhausted
    console.error("❌ All retry attempts exhausted. Last error:", lastError?.message)
    const errorMessage = lastError?.message || "Unknown error occurred"
    
    if (errorMessage.includes("timeout")) {
      return createErrorResponse(
        "⏱️ Workflow generation timeout",
        "The AI is taking longer than expected. This usually means it's working on a complex design. Please try again in a moment.",
        408
      )
    } else if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
      return createErrorResponse(
        "🌐 Connection error",
        "Unable to connect to the workflow engine. Please check your internet connection and try again.",
        503
      )
    } else {
      return createErrorResponse(
        "🔧 Workflow generation failed",
        `After ${MAX_RETRIES} attempts: ${errorMessage}`,
        500
      )
    }

  } catch (error) {
    // Catch-all error handler
    console.error("❌ Unexpected error in N8N proxy:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown server error"
    
    return createErrorResponse(
      "🔧 Internal server error",
      errorMessage,
      500
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-Source",
      "Access-Control-Max-Age": "86400", // 24 hours
    },
  })
}