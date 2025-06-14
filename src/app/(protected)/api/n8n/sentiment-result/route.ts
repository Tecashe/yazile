// import { type NextRequest, NextResponse } from "next/server"
// import { storeSentimentResult } from "@/lib/sentiment-tracker"

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()

//     // Verify the request is from n8n (you might want to add authentication)
//     const authHeader = req.headers.get("authorization")
//     if (!authHeader || authHeader !== `Bearer ${process.env.N8N_API_KEY}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { automationId, pageId, senderId, sentiment, confidence, messages } = body

//     if (!automationId || !pageId || !senderId || !sentiment) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     await storeSentimentResult(automationId, pageId, senderId, {
//       sentiment,
//       confidence: confidence || 0.5,
//       messages: messages || [],
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error processing sentiment result:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { storeSentimentResult } from "@/lib/sentiment-tracker"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Verify the request is from n8n
    const authHeader = req.headers.get("authorization")
    const expectedAuth = `Bearer ${process.env.N8N_API_KEY}`

    if (!authHeader || authHeader !== expectedAuth) {
      console.error("Unauthorized n8n request:", {
        received: authHeader,
        expected: expectedAuth ? "Bearer [REDACTED]" : "undefined",
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      automationId,
      pageId,
      senderId,
      sentiment,
      confidence,
      messages,
      sentimentScore,
      metrics,
      emotions,
      insights,
      metadata,
    } = body

    // Validate required fields
    if (!automationId || !pageId || !senderId || !sentiment) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["automationId", "pageId", "senderId", "sentiment"],
        },
        { status: 400 },
      )
    }

    // Store the comprehensive sentiment result
    await storeSentimentResult(automationId, pageId, senderId, {
      sentiment,
      confidence: confidence || 0.5,
      messages: messages || [],
      sentimentScore: sentimentScore || 0,
      metrics: typeof metrics === "string" ? JSON.parse(metrics) : metrics,
      emotions: typeof emotions === "string" ? JSON.parse(emotions) : emotions,
      insights: typeof insights === "string" ? JSON.parse(insights) : insights,
      metadata: typeof metadata === "string" ? JSON.parse(metadata) : metadata,
    })

    return NextResponse.json({
      success: true,
      message: "Sentiment analysis stored successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing sentiment result:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
