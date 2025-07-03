import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

export async function GET(request: NextRequest) {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")
    const tier = searchParams.get("tier")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId }

    if (status && status !== "all") {
      where.status = status
    }

    if (tier && tier !== "all") {
      where.qualificationData = {
        leadTier: tier,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { instagramUserId: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch leads with all related data
    const [leads, totalCount] = await Promise.all([
      client.lead.findMany({
        where,
        include: {
          qualificationData: true,
          interactions: {
            take: 5,
            orderBy: { timestamp: "desc" },
          },
          revenueOpportunities: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          scheduledActions: {
            where: { status: "PENDING" },
            take: 3,
            orderBy: { scheduledFor: "asc" },
          },
        },
        orderBy: { lastContactDate: "desc" },
        skip,
        take: limit,
      }),
      client.lead.count({ where }),
    ])

    // Process leads for dashboard display
    const processedLeads = leads.map((lead) => {
      const metadata = lead.metadata as Record<string, any>
      const lastAnalysis = metadata?.lastEnhancedAnalysis || metadata?.lastAnalysis

      // Calculate marketing completeness
      let marketingCompleteness = 0
      if (lead.name?.trim()) marketingCompleteness += 40
      if (lead.email?.trim()) marketingCompleteness += 35
      if (lead.phone?.trim()) marketingCompleteness += 25

      return {
        ...lead,
        displayName: lead.name || `Instagram User ${lead.instagramUserId?.slice(-4) || "Unknown"}`,
        marketingCompleteness,
        revenueData: {
          estimatedValue: lastAnalysis?.revenueData?.estimatedValue || lastAnalysis?.estimatedValue || 0,
          roi: lastAnalysis?.revenueData?.conversionProbability
            ? lastAnalysis.revenueData.conversionProbability * 100
            : lastAnalysis?.roi || 0,
          tier: lastAnalysis?.leadTier || "BRONZE",
        },
        aiInsights: {
          buyerPersona: lastAnalysis?.buyerPersona,
          followUpStrategy: lastAnalysis?.followUpStrategy,
          nextActions: lastAnalysis?.nextActions || lastAnalysis?.recommendedActions?.immediate || [],
          urgencyLevel: lastAnalysis?.urgencyLevel,
          notificationMessage: lastAnalysis?.notificationData?.message || lastAnalysis?.notificationMessage,
        },
        enhancedScore: lastAnalysis?.enhancedScore || {
          totalScore: lead.score,
          baseScore: lead.score,
          intentBonus: 0,
          urgencyBonus: 0,
          sentimentBonus: 0,
          personaBonus: 0,
          stageBonus: 0,
        },
      }
    })

    return NextResponse.json({
      leads: processedLeads,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
