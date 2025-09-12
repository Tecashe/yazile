"use client"

// Mock data generators for the dashboard
export const generateMockAnalytics = () => ({
  totalLeads: Math.floor(Math.random() * 500) + 200,
  qualifiedLeads: Math.floor(Math.random() * 150) + 50,
  convertedLeads: Math.floor(Math.random() * 30) + 10,
  conversionRate: Math.floor(Math.random() * 20) + 10,
  qualificationRate: Math.floor(Math.random() * 40) + 30,
  recentInteractions: [],
  revenueMetrics: {
    totalEstimatedRevenue: Math.floor(Math.random() * 500000) + 100000,
    totalExpectedRevenue: Math.floor(Math.random() * 300000) + 50000,
    averageROI: Math.floor(Math.random() * 200) + 100,
    revenueGrowth: Math.floor(Math.random() * 40) - 10,
  },
  tierDistribution: {
    platinum: Math.floor(Math.random() * 20) + 5,
    gold: Math.floor(Math.random() * 40) + 15,
    silver: Math.floor(Math.random() * 60) + 25,
    bronze: Math.floor(Math.random() * 80) + 40,
  },
  premiumInsights: {
    highValueLeads: Math.floor(Math.random() * 25) + 10,
    averageLeadValue: Math.floor(Math.random() * 5000) + 1000,
    conversionProbability: Math.floor(Math.random() * 30) + 15,
    totalPipelineValue: Math.floor(Math.random() * 1000000) + 200000,
  },
  crmStatus: {
    connected: Math.random() > 0.5,
    integrations: ["HubSpot"],
    lastSync: new Date().toISOString(),
  },
})

export const generateMockLeads = (count = 20) => {
  const statuses = ["NEW", "QUALIFYING", "QUALIFIED", "CONVERTED", "LOST"]
  const tiers = ["PLATINUM", "GOLD", "SILVER", "BRONZE"]
  const names = [
    "Sarah Johnson",
    "Mike Chen",
    "Emily Rodriguez",
    "David Kim",
    "Jessica Taylor",
    "Alex Thompson",
    "Maria Garcia",
    "James Wilson",
    "Lisa Anderson",
    "Ryan Martinez",
    "Amanda Brown",
    "Kevin Lee",
    "Nicole Davis",
    "Chris Miller",
    "Rachel White",
  ]
  const companies = [
    "TechCorp",
    "InnovateLab",
    "DataSystems",
    "CloudWorks",
    "StartupHub",
    "DigitalFlow",
    "NextGen",
    "SmartSolutions",
    "FutureTech",
    "GrowthCo",
  ]

  return Array.from({ length: count }, (_, i) => {
    const score = Math.floor(Math.random() * 100)
    const hasFullContact = Math.random() > 0.3
    const name = Math.random() > 0.2 ? names[Math.floor(Math.random() * names.length)] : null
    const email = hasFullContact
      ? `${name?.toLowerCase().replace(" ", ".")}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase()}.com`
      : null
    const phone =
      hasFullContact && Math.random() > 0.4 ? `+1${Math.floor(Math.random() * 9000000000) + 1000000000}` : null

    const marketingCompleteness = [name, email, phone].filter(Boolean).length * 33.33

    return {
      id: `lead-${i + 1}`,
      name,
      email,
      phone,
      instagramUserId: `user${Math.floor(Math.random() * 10000)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score,
      lastContactDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      pageId: `page-${Math.floor(Math.random() * 5) + 1}`,
      metadata: {
        lastAnalysis: {
          leadTier: tiers[Math.floor(Math.random() * tiers.length)],
          estimatedValue: Math.floor(Math.random() * 10000) + 1000,
          roi: Math.floor(Math.random() * 300) + 50,
          notificationMessage: [
            "🎯 High purchase intent detected - immediate follow-up recommended",
            "⭐ Platinum lead showing positive sentiment - perfect timing for proposal",
            "📋 Complete contact information available - ready for CRM sync",
            "🤖 AI analysis complete - lead scored and categorized",
          ][Math.floor(Math.random() * 4)],
          nextActions: ["immediate_call", "send_proposal", "email_sequence"].slice(
            0,
            Math.floor(Math.random() * 3) + 1,
          ),
          followUpStrategy: ["immediate_personal_outreach", "priority_nurturing", "automated_crm_sequence"][
            Math.floor(Math.random() * 3)
          ],
          buyerPersona: ["engaged_prospect", "qualified_lead", "early_stage_prospect"][Math.floor(Math.random() * 3)],
        },
        marketingCompleteness: Math.round(marketingCompleteness),
      },
      interactions: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
        id: `interaction-${i}-${j}`,
        type: ["message", "comment", "story_reply"][Math.floor(Math.random() * 3)],
        content: [
          "Interested in learning more about your services",
          "Can you send me pricing information?",
          "When would be a good time to schedule a call?",
          "This looks exactly like what we need",
          "How does your solution compare to competitors?",
        ][Math.floor(Math.random() * 5)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        sentiment: Math.random() > 0.3 ? Math.random() * 0.5 + 0.5 : Math.random() * 0.5,
      })),
      qualificationData: {
        leadTier: tiers[Math.floor(Math.random() * tiers.length)],
        estimatedValue: Math.floor(Math.random() * 10000) + 1000,
        roi: Math.floor(Math.random() * 300) + 50,
        intentScore: Math.random(),
        sentimentScore: Math.random(),
        engagementScore: Math.floor(Math.random() * 100),
      },
    }
  })
}

export const generateMockInteractions = (count = 15) => {
  const leads = generateMockLeads(count)

  return leads
    .flatMap((lead) =>
      lead.interactions.map((interaction) => ({
        ...interaction,
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          instagramUserId: lead.instagramUserId,
          status: lead.status,
          score: lead.score,
          qualificationData: lead.qualificationData,
        },
        metadata: {
          leadTier: lead.metadata.lastAnalysis.leadTier,
          estimatedValue: lead.metadata.lastAnalysis.estimatedValue,
          roi: lead.metadata.lastAnalysis.roi,
          notificationMessage: lead.metadata.lastAnalysis.notificationMessage,
          hasMarketingInfo: !!(lead.name || lead.email || lead.phone),
          marketingCompleteness: lead.metadata.marketingCompleteness,
        },
      })),
    )
    .slice(0, count)
}

export const generateMockRevenueData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    pipeline: Math.floor(Math.random() * 80000) + 40000,
  }))
}
