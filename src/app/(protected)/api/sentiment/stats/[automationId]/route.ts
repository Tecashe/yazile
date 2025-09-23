// app/api/sentiment/stats/[automationId]/route.ts

import { NextRequest } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { automationId: string } }
) {
  try {
    const { automationId } = params

    if (!automationId) {
      return Response.json(
        { error: 'Automation ID is required' },
        { status: 400 }
      )
    }

    const stats = await getAutomationSentimentStats(automationId)
    return Response.json(stats)
    
  } catch (error) {
    console.error('Error getting sentiment stats:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getAutomationSentimentStats(automationId: string) {
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