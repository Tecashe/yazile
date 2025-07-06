import { type NextRequest, NextResponse } from "next/server"
import { storeSentimentResult } from "@/lib/sentiment-tracker"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request has required fields
    if (!body.automationId || !body.pageId || !body.senderId || !body.sentimentData) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Extract sentiment data from n8n callback
    const { automationId, pageId, senderId, sentimentData } = body

    // Transform n8n data to match our interface
    const comprehensiveSentimentResult = {
      sentiment: sentimentData.sentiment as "positive" | "negative" | "neutral",
      confidence: sentimentData.confidence,
      messages: sentimentData.messages,
      sentimentScore: sentimentData.sentimentScore,
      metrics: sentimentData.metrics,
      emotions: sentimentData.emotions,
      insights: sentimentData.insights,
      metadata: sentimentData.metadata,
    }

    // Store the sentiment result in database
    await storeSentimentResult(automationId, pageId, senderId, comprehensiveSentimentResult)

    console.log(`Sentiment result stored for automation ${automationId}:`, {
      sentiment: sentimentData.sentiment,
      confidence: sentimentData.confidence,
      riskLevel: sentimentData.insights?.riskLevel,
    })

    return NextResponse.json({
      success: true,
      message: "Sentiment result stored successfully",
      data: {
        automationId,
        sentiment: sentimentData.sentiment,
        confidence: sentimentData.confidence,
        riskLevel: sentimentData.insights?.riskLevel,
      },
    })
  } catch (error) {
    console.error("Error processing sentiment result:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
