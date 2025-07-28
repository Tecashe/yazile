"use server"

import { client } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { onUserInfor } from "../user"

export interface SearchResult {
  id: string
  title: string
  description: string
  type: "business" | "lead" | "automation" | "influencer" | "campaign" | "opportunity" | "workflow" | "message" | "user"
  url: string
  metadata?: Record<string, any>
  createdAt: Date
  relevanceScore?: number
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  searchTime: number
  categories: {
    [key: string]: number
  }
}

export async function globalSearch(
  query: string,
  filters?: {
    types?: string[]
    dateRange?: { from: Date; to: Date }
    businessId?: string
    limit?: number
    offset?: number
  },
): Promise<SearchResponse> {
  const startTime = Date.now()

  try {
    const user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const {
      types = ["business", "lead", "automation", "influencer", "campaign", "opportunity", "workflow", "message"],
      dateRange,
      businessId,
      limit = 50,
      offset = 0,
    } = filters || {}

    const searchTerm = query.trim().toLowerCase()
    if (searchTerm.length < 2) {
      return {
        results: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        categories: {},
      }
    }

    const results: SearchResult[] = []
    const categories: { [key: string]: number } = {}

    // Search Businesses
    if (types.includes("business")) {
      const businesses = await client.business.findMany({
        where: {
          userId: userId,
          OR: [
            { businessName: { contains: searchTerm, mode: "insensitive" } },
            { businessDescription: { contains: searchTerm, mode: "insensitive" } },
            { industry: { contains: searchTerm, mode: "insensitive" } },
            { website: { contains: searchTerm, mode: "insensitive" } },
            { instagramHandle: { contains: searchTerm, mode: "insensitive" } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        take: limit,
        skip: offset,
        orderBy: { updatedAt: "desc" },
      })

      businesses.forEach((business) => {
        results.push({
          id: business.id,
          title: business.businessName,
          description: business.businessDescription || `${business.businessType} in ${business.industry}`,
          type: "business",
          url: `/dashboard/${userId}/businesses/${business.id}`,
          metadata: {
            industry: business.industry,
            businessType: business.businessType,
            website: business.website,
            instagramHandle: business.instagramHandle,
          },
          createdAt: business.createdAt,
        })
      })
      categories["business"] = businesses.length
    }

    // Search Leads
    if (types.includes("lead")) {
      const leads = await client.lead.findMany({
        where: {
          userId: userId,
          ...(businessId && {
            automation: {
              User: {
                businesses: {
                  some: { id: businessId },
                },
              },
            },
          }),
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
            { notes: { contains: searchTerm, mode: "insensitive" } },
            { tags: { hasSome: [searchTerm] } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        include: {
          automation: true,
          qualificationData: true,
        },
        take: limit,
        skip: offset,
        orderBy: { lastContactDate: "desc" },
      })

      leads.forEach((lead) => {
        results.push({
          id: lead.id,
          title: lead.name || `Lead ${lead.instagramUserId}`,
          description: `${lead.status} lead - Score: ${lead.score} - ${lead.email || "No email"}`,
          type: "lead",
          url: `/dashboard/${userId}/leads/${lead.id}`,
          metadata: {
            status: lead.status,
            score: lead.score,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            tier: lead.qualificationData?.leadTier,
          },
          createdAt: lead.createdAt,
        })
      })
      categories["lead"] = leads.length
    }

    // Search Automations
    if (types.includes("automation")) {
      const automations = await client.automation.findMany({
        where: {
          userId: userId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { fallbackMessage: { contains: searchTerm, mode: "insensitive" } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        include: {
          keywords: true,
          _count: {
            select: {
              leads: true,
              messages: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      })

      automations.forEach((automation) => {
        results.push({
          id: automation.id,
          title: automation.name,
          description: `${automation.platform} automation - ${automation.active ? "Active" : "Inactive"} - ${automation._count.leads} leads`,
          type: "automation",
          url: `/dashboard/${userId}/automations/${automation.id}`,
          metadata: {
            platform: automation.platform,
            active: automation.active,
            leadsCount: automation._count.leads,
            messagesCount: automation._count.messages,
            keywords: automation.keywords.map((k) => k.word),
          },
          createdAt: automation.createdAt,
        })
      })
      categories["automation"] = automations.length
    }

    // Search Influencers
    if (types.includes("influencer")) {
      const influencers = await client.influencer.findMany({
        where: {
          userId: userId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { username: { contains: searchTerm, mode: "insensitive" } },
            { bio: { contains: searchTerm, mode: "insensitive" } },
            { niche: { contains: searchTerm, mode: "insensitive" } },
            { location: { contains: searchTerm, mode: "insensitive" } },
            { tags: { hasSome: [searchTerm] } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        take: limit,
        skip: offset,
        orderBy: { followers: "desc" },
      })

      influencers.forEach((influencer) => {
        results.push({
          id: influencer.id,
          title: influencer.name,
          description: `@${influencer.username} - ${influencer.followers.toLocaleString()} followers - ${influencer.niche || "No niche"}`,
          type: "influencer",
          url: `/dashboard/${userId}/influencers/${influencer.id}`,
          metadata: {
            username: influencer.username,
            followers: influencer.followers,
            engagementRate: influencer.engagementRate,
            niche: influencer.niche,
            status: influencer.status,
            location: influencer.location,
          },
          createdAt: influencer.createdAt,
        })
      })
      categories["influencer"] = influencers.length
    }

    // Search Campaigns
    if (types.includes("campaign")) {
      const campaigns = await client.campaign.findMany({
        where: {
          userId: userId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { brief: { contains: searchTerm, mode: "insensitive" } },
            { hashtags: { hasSome: [searchTerm] } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        include: {
          _count: {
            select: {
              influencers: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { updatedAt: "desc" },
      })

      campaigns.forEach((campaign) => {
        results.push({
          id: campaign.id,
          title: campaign.name,
          description: `${campaign.status} campaign - Budget: $${campaign.budget || 0} - ${campaign._count.influencers} influencers`,
          type: "campaign",
          url: `/dashboard/${userId}/campaigns/${campaign.id}`,
          metadata: {
            status: campaign.status,
            budget: campaign.budget,
            influencersCount: campaign._count.influencers,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
          },
          createdAt: campaign.createdAt,
        })
      })
      categories["campaign"] = campaigns.length
    }

    // Search Opportunities
    if (types.includes("opportunity")) {
      const opportunities = await client.opportunity.findMany({
        where: {
          business: {
            userId: userId,
          },
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { requirements: { contains: searchTerm, mode: "insensitive" } },
            { category: { contains: searchTerm, mode: "insensitive" } },
            { tags: { hasSome: [searchTerm] } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        include: {
          business: true,
          _count: {
            select: {
              applications: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      })

      opportunities.forEach((opportunity) => {
        results.push({
          id: opportunity.id,
          title: opportunity.title,
          description: `${opportunity.status} - $${opportunity.budgetMin}-$${opportunity.budgetMax} - ${opportunity._count.applications} applications`,
          type: "opportunity",
          url: `/dashboard/${userId}/opportunities/${opportunity.id}`,
          metadata: {
            status: opportunity.status,
            budgetMin: opportunity.budgetMin,
            budgetMax: opportunity.budgetMax,
            category: opportunity.category,
            applicationsCount: opportunity._count.applications,
            businessName: opportunity.business.businessName,
          },
          createdAt: opportunity.createdAt,
        })
      })
      categories["opportunity"] = opportunities.length
    }

    // Search Workflows
    if (types.includes("workflow")) {
      const workflows = await client.businessWorkflowConfig.findMany({
        where: {
          userId: userId,
          OR: [
            { businessInfo: { path: ["businessName"], string_contains: searchTerm } },
            { customRequest: { contains: searchTerm, mode: "insensitive" } },
          ],
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        include: {
          workflowTemplate: true,
          business: true,
        },
        take: limit,
        skip: offset,
        orderBy: { updatedAt: "desc" },
      })

      workflows.forEach((workflow) => {
        const businessInfo = workflow.businessInfo as any
        results.push({
          id: workflow.id,
          title: businessInfo?.businessName || "Workflow Configuration",
          description: `${workflow.status} workflow - ${workflow.workflowTemplate?.name || "Custom"} - ${workflow.business.businessName}`,
          type: "workflow",
          url: `/dashboard/${userId}/workflows/${workflow.id}`,
          metadata: {
            status: workflow.status,
            isActive: workflow.isActive,
            templateName: workflow.workflowTemplate?.name,
            businessName: workflow.business.businessName,
          },
          createdAt: workflow.createdAt,
        })
      })
      categories["workflow"] = workflows.length
    }

    // Search Messages/Conversations
    if (types.includes("message")) {
      const messages = await client.message.findMany({
        where: {
          Automation: {
            userId: userId,
          },
          message: { contains: searchTerm, mode: "insensitive" },
          ...(dateRange && {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          }),
        },
        include: {
          Automation: true,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      })

      messages.forEach((message) => {
        results.push({
          id: message.id,
          title: `Message from ${message.senderId}`,
          description: message.message.substring(0, 100) + (message.message.length > 100 ? "..." : ""),
          type: "message",
          url: `/dashboard/${userId}/conversations/${message.pageId}`,
          metadata: {
            senderId: message.senderId,
            pageId: message.pageId,
            isFromBot: message.isFromBot,
            automationName: message.Automation?.name,
          },
          createdAt: message.createdAt,
        })
      })
      categories["message"] = messages.length
    }

    // Sort results by relevance and date
    results.sort((a, b) => {
      // Simple relevance scoring based on title match
      const aRelevance = a.title.toLowerCase().includes(searchTerm) ? 2 : 1
      const bRelevance = b.title.toLowerCase().includes(searchTerm) ? 2 : 1

      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const totalCount = results.length
    const paginatedResults = results.slice(offset, offset + limit)

    return {
      results: paginatedResults,
      totalCount,
      searchTime: Date.now() - startTime,
      categories,
    }
  } catch (error) {
    console.error("Global search error:", error)
    throw new Error("Search failed. Please try again.")
  }
}

// Quick search for autocomplete/suggestions
export async function quickSearch(query: string, limit = 10): Promise<SearchResult[]> {
  const  user  = await onUserInfor()
  const userId = user.data?.id
  if (!userId || query.length < 2) return []

  try {
    const searchTerm = query.trim().toLowerCase()
    const results: SearchResult[] = []

    // Quick search across most relevant entities
    const [businesses, leads, automations, influencers] = await Promise.all([
      client.business.findMany({
        where: {
          userId: userId,
          businessName: { contains: searchTerm, mode: "insensitive" },
        },
        take: 3,
        orderBy: { updatedAt: "desc" },
      }),
      client.lead.findMany({
        where: {
          userId: userId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 3,
        orderBy: { lastContactDate: "desc" },
      }),
      client.automation.findMany({
        where: {
          userId: userId,
          name: { contains: searchTerm, mode: "insensitive" },
        },
        take: 2,
        orderBy: { createdAt: "desc" },
      }),
      client.influencer.findMany({
        where: {
          userId: userId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { username: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 2,
        orderBy: { followers: "desc" },
      }),
    ])

    // Add results with simplified metadata
    businesses.forEach((business) => {
      results.push({
        id: business.id,
        title: business.businessName,
        description: business.businessType,
        type: "business",
        url: `/dashboard/${userId}/businesses/${business.id}`,
        createdAt: business.createdAt,
      })
    })

    leads.forEach((lead) => {
      results.push({
        id: lead.id,
        title: lead.name || `Lead ${lead.instagramUserId}`,
        description: `${lead.status} - Score: ${lead.score}`,
        type: "lead",
        url: `/dashboard/${userId}/leads/${lead.id}`,
        createdAt: lead.createdAt,
      })
    })

    automations.forEach((automation) => {
      results.push({
        id: automation.id,
        title: automation.name,
        description: `${automation.platform} automation`,
        type: "automation",
        url: `/dashboard/${userId}/automations/${automation.id}`,
        createdAt: automation.createdAt,
      })
    })

    influencers.forEach((influencer) => {
      results.push({
        id: influencer.id,
        title: influencer.name,
        description: `@${influencer.username} - ${influencer.followers.toLocaleString()} followers`,
        type: "influencer",
        url: `/dashboard/${userId}/influencers/${influencer.id}`,
        createdAt: influencer.createdAt,
      })
    })

    return results.slice(0, limit)
  } catch (error) {
    console.error("Quick search error:", error)
    return []
  }
}
