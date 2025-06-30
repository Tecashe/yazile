import { client } from "@/lib/prisma"

interface ComprehensiveSentimentResult {
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  messages: string[]
  sentimentScore?: number
  metrics?: any
  emotions?: any
  insights?: any
  metadata?: any
}

export async function trackMessageForSentiment(
  automationId: string,
  pageId: string,
  senderId: string,
  message: string,
): Promise<boolean> {
  try {
    // Get or create message tracker for this user/automation
    const tracker = await client.messageTracker.upsert({
      where: {
        automationId_pageId_senderId: {
          automationId,
          pageId,
          senderId,
        },
      },
      update: {
        messageCount: {
          increment: 1,
        },
        messages: {
          push: message,
        },
        lastMessageAt: new Date(),
      },
      create: {
        automationId,
        pageId,
        senderId,
        messageCount: 1,
        messages: [message],
        lastMessageAt: new Date(),
      },
    })

    // Check if we've reached 4 messages
    if (tracker.messageCount % 4 === 0) {
      // Get the last 4 messages
      const lastFourMessages = tracker.messages.slice(-4)

      // Trigger sentiment analysis
      await triggerSentimentAnalysis(automationId, pageId, senderId, lastFourMessages)

      return true
    }

    return false
  } catch (error) {
    console.error("Error tracking message for sentiment:", error)
    return false
  }
}

async function triggerSentimentAnalysis(
  automationId: string,
  pageId: string,
  senderId: string,
  messages: string[],
): Promise<void> {
  try {
    // Call n8n webhook for sentiment analysis
    const n8nWebhookUrl = process.env.N8N_SENTIMENT_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      console.error("N8N_SENTIMENT_WEBHOOK_URL not configured")
      return
    }

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        automationId,
        pageId,
        senderId,
        messages,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log("Sentiment analysis triggered successfully:", result)
  } catch (error) {
    console.error("Error triggering sentiment analysis:", error)
  }
}

export async function storeSentimentResult(
  automationId: string,
  pageId: string,
  senderId: string,
  sentimentData: ComprehensiveSentimentResult,
): Promise<void> {
  try {
    await client.sentimentAnalysis.create({
      data: {
        automationId,
        pageId,
        senderId,
        sentiment: sentimentData.sentiment,
        confidence: sentimentData.confidence,
        messages: sentimentData.messages,
        sentimentScore: sentimentData.sentimentScore || 0,
        metrics: sentimentData.metrics ? JSON.stringify(sentimentData.metrics) : null,
        emotions: sentimentData.emotions ? JSON.stringify(sentimentData.emotions) : null,
        insights: sentimentData.insights ? JSON.stringify(sentimentData.insights) : null,
        metadata: sentimentData.metadata ? JSON.stringify(sentimentData.metadata) : null,
        analyzedAt: new Date(),
      },
    })

    console.log("Comprehensive sentiment result stored for automation:", automationId)
  } catch (error) {
    console.error("Error storing sentiment result:", error)
    throw error
  }
}

export async function getAutomationSentimentStats(automationId: string) {
  try {
    const sentimentData = await client.sentimentAnalysis.groupBy({
      by: ["sentiment"],
      where: {
        automationId,
        analyzedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _count: {
        sentiment: true,
      },
    })

    const total = sentimentData.reduce((sum, item) => sum + item._count.sentiment, 0)

    if (total === 0) {
      return [
        { name: "Positive", value: 0, color: "#10B981" },
        { name: "Neutral", value: 0, color: "#6B7280" },
        { name: "Negative", value: 0, color: "#EF4444" },
      ]
    }

    const stats = sentimentData.map((item) => {
      const percentage = Math.round((item._count.sentiment / total) * 100)
      return {
        name: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
        value: percentage,
        color: item.sentiment === "positive" ? "#10B981" : item.sentiment === "negative" ? "#EF4444" : "#6B7280",
      }
    })

    // Ensure all three sentiments are represented
    const sentiments = ["positive", "neutral", "negative"]
    const colors = { positive: "#10B981", neutral: "#6B7280", negative: "#EF4444" }

    return sentiments.map((sentiment) => {
      const existing = stats.find((s) => s.name.toLowerCase() === sentiment)
      return (
        existing || {
          name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
          value: 0,
          color: colors[sentiment as keyof typeof colors],
        }
      )
    })
  } catch (error) {
    console.error("Error getting sentiment stats:", error)
    return [
      { name: "Positive", value: 0, color: "#10B981" },
      { name: "Neutral", value: 0, color: "#6B7280" },
      { name: "Negative", value: 0, color: "#EF4444" },
    ]
  }
}
