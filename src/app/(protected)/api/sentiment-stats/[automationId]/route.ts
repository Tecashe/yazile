import { type NextRequest, NextResponse } from "next/server"
import { getAutomationSentimentStats } from "@/lib/sentiment-tracker"
import { client } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { automationId: string } }) {
  try {
    const { automationId } = params

    if (!automationId) {
      return NextResponse.json({ success: false, error: "Automation ID is required" }, { status: 400 })
    }

    // Get basic sentiment stats
    const sentimentStats = await getAutomationSentimentStats(automationId)

    // Get detailed sentiment analysis data
    const detailedAnalysis = await client.sentimentAnalysis.findMany({
      where: {
        automationId,
        analyzedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: {
        analyzedAt: "desc",
      },
      take: 50, // Limit to recent analyses
    })

    // Calculate advanced metrics
    const totalAnalyses = detailedAnalysis.length
    const averageConfidence =
      totalAnalyses > 0 ? detailedAnalysis.reduce((sum, analysis) => sum + analysis.confidence, 0) / totalAnalyses : 0

    const riskLevels = detailedAnalysis.map((analysis) => {
      try {
        const insights = analysis.insights ? JSON.parse(analysis.insights as string) : {}
        return insights.riskLevel || "low"
      } catch {
        return "low"
      }
    })

    const highRiskCount = riskLevels.filter((level) => level === "high").length
    const mediumRiskCount = riskLevels.filter((level) => level === "medium").length
    const lowRiskCount = riskLevels.filter((level) => level === "low").length

    // Lead conversion indicators
    const conversionIndicators = detailedAnalysis.map((analysis) => {
      try {
        const insights = analysis.insights ? JSON.parse(analysis.insights as string) : {}
        return {
          satisfactionLevel: insights.satisfactionLevel || "neutral",
          customerJourney: insights.customerJourney || "neutral",
          urgencyLevel: insights.urgencyLevel || "low",
        }
      } catch {
        return {
          satisfactionLevel: "neutral",
          customerJourney: "neutral",
          urgencyLevel: "low",
        }
      }
    })

    const advocateCount = conversionIndicators.filter((i) => i.customerJourney === "advocate").length
    const atRiskCount = conversionIndicators.filter((i) => i.customerJourney === "at_risk").length

    return NextResponse.json({
      success: true,
      data: {
        basicStats: sentimentStats,
        advanced: {
          totalAnalyses,
          averageConfidence: Math.round(averageConfidence * 100) / 100,
          riskDistribution: {
            high: highRiskCount,
            medium: mediumRiskCount,
            low: lowRiskCount,
          },
          conversionMetrics: {
            advocates: advocateCount,
            atRisk: atRiskCount,
            neutral: totalAnalyses - advocateCount - atRiskCount,
            conversionRate: totalAnalyses > 0 ? Math.round((advocateCount / totalAnalyses) * 100) : 0,
            churnRisk: totalAnalyses > 0 ? Math.round((atRiskCount / totalAnalyses) * 100) : 0,
          },
          recentTrend: detailedAnalysis.slice(0, 10).map((analysis) => ({
            sentiment: analysis.sentiment,
            confidence: analysis.confidence,
            date: analysis.analyzedAt.toISOString().split("T")[0],
          })),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching sentiment stats:", error)
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
