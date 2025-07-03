//WORKING JUST FINE

// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getLeadAnalytics } from "@/lib/lead-qualification"
// import { LeadsDashboard } from "../_components/leads/leads"

// // Server action to get leads data with improved performance
// async function getLeadsData(userId: string) {
//   try {
//     const [analytics, recentLeads, topLeads, duplicateCount] = await Promise.all([
//       getLeadAnalytics(userId),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//           interactions: {
//             take: 1,
//             orderBy: { timestamp: "desc" },
//           },
//         },
//         orderBy: { lastContactDate: "desc" },
//         take: 20, // Increased for better overview
//       }),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//         },
//         orderBy: { score: "desc" },
//         take: 10, // Increased for better insights
//       }),
//       // Check for potential duplicates
//       client.lead.groupBy({
//         by: ["instagramUserId", "pageId"],
//         where: { userId },
//         having: {
//           id: { _count: { gt: 1 } },
//         },
//         _count: { id: true },
//       }),
//     ])

//     return {
//       analytics,
//       recentLeads,
//       topLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//     }
//   } catch (error) {
//     console.error("Error fetching leads data:", error)
//     return {
//       analytics: null,
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//     }
//   }
// }

// export default async function LeadsPage() {
//   const user = await onUserInfor()
//   const userId = user.data?.id

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount } = await getLeadsData(user.data.id)

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <Suspense fallback={<div>Loading...</div>}>
//         <LeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={userId || ""}
//         />
//       </Suspense>
//     </div>
//   )
// }


// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getPremiumLeadAnalytics ,mergeDuplicateLeads} from "@/lib/lead-qualification"
// import { PremiumLeadsDashboard } from "../_components/leads/leads"

// // Enhanced server action to get premium leads data
// async function getPremiumLeadsData(userId: string) {
//   try {
//     const [analytics, recentLeads, topLeads, duplicateCount] = await Promise.all([
//       getPremiumLeadAnalytics(userId),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//           interactions: {
//             take: 1,
//             orderBy: { timestamp: "desc" },
//           },
//         },
//         orderBy: { lastContactDate: "desc" },
//         take: 20,
//       }),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//         },
//         orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
//         take: 10,
//       }),
//       // Check for potential duplicates
//       client.lead.groupBy({
//         by: ["instagramUserId", "pageId"],
//         where: { userId },
//         having: {
//           id: { _count: { gt: 1 } },
//         },
//         _count: { id: true },
//       }),
//     ])

//     return {
//       analytics,
//       recentLeads,
//       topLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//     }
//   } catch (error) {
//     console.error("Error fetching premium leads data:", error)
//     return {
//       analytics: null,
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//     }
//   }
// }

// // Server action to merge duplicates
// async function handleMergeDuplicates(userId: string) {
//   "use server"
//   try {
//     const result = await mergeDuplicateLeads(userId)
//     return { success: true, mergedGroups: result.mergedGroups }
//   } catch (error) {
//     console.error("Error merging duplicates:", error)
//     return { success: false, error: "Failed to merge duplicates" }
//   }
// }

// export default async function PremiumLeadsPage() {
//   const user = await onUserInfor()
//   const userId = user.data?.id

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount } = await getPremiumLeadsData(user.data.id)

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <Suspense fallback={<div>Loading premium analytics...</div>}>
//         <PremiumLeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={userId || ""}
//         />
//       </Suspense>
//     </div>
//   )
// }


// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getPremiumLeadAnalytics, mergeDuplicateLeads } from "@/lib/lead-qualification"
// import { PremiumLeadsDashboard } from "../_components/leads/leads"

// // Enhanced server action to get comprehensive premium leads data
// async function getPremiumLeadsData(userId: string) {
//   try {
//     console.log(`Fetching premium leads data for user: ${userId}`)

//     const [analytics, recentLeads, topLeads, duplicateCount, tierStats, recentInteractions, crmIntegrations] =
//       await Promise.all([
//         getPremiumLeadAnalytics(userId).catch((error) => {
//           console.error("Error getting analytics:", error)
//           return null
//         }),

//         // Enhanced recent leads with more comprehensive data
//         client.lead
//           .findMany({
//             where: { userId },
//             include: {
//               qualificationData: true,
//               interactions: {
//                 take: 3,
//                 orderBy: { timestamp: "desc" },
//               },
//               revenueOpportunities: {
//                 take: 1,
//                 orderBy: { createdAt: "desc" },
//               },
//               scheduledActions: {
//                 where: { status: "PENDING" },
//                 take: 2,
//                 orderBy: { scheduledFor: "asc" },
//               },
//             },
//             orderBy: { lastContactDate: "desc" },
//             take: 50,
//           })
//           .catch((error) => {
//             console.error("Error getting recent leads:", error)
//             return []
//           }),

//         // Top performing leads with enhanced scoring
//         client.lead
//           .findMany({
//             where: {
//               userId,
//               score: { gte: 50 }, // Lower threshold to get more leads
//             },
//             include: {
//               qualificationData: true,
//               interactions: {
//                 take: 2,
//                 orderBy: { timestamp: "desc" },
//               },
//               revenueOpportunities: true,
//             },
//             orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
//             take: 15,
//           })
//           .catch((error) => {
//             console.error("Error getting top leads:", error)
//             return []
//           }),

//         // Check for potential duplicates with more sophisticated logic
//         client.lead
//           .groupBy({
//             by: ["instagramUserId", "pageId"],
//             where: { userId },
//             having: {
//               id: { _count: { gt: 1 } },
//             },
//             _count: { id: true },
//           })
//           .catch((error) => {
//             console.error("Error getting duplicates:", error)
//             return []
//           }),

//         // Get comprehensive tier statistics
//         client.leadQualificationData
//           .groupBy({
//             by: ["leadTier"],
//             where: {
//               lead: { userId },
//               leadTier: { not: null },
//             },
//             _count: { leadTier: true },
//             _avg: {
//               estimatedValue: true,
//               roi: true,
//               engagementScore: true,
//               intentScore: true,
//             },
//             _sum: { estimatedValue: true },
//           })
//           .catch((error) => {
//             console.error("Error getting tier stats:", error)
//             return []
//           }),

//         // Recent AI-analyzed interactions
//         client.leadInteraction
//           .findMany({
//             where: {
//               lead: { userId },
//             },
//             include: {
//               lead: {
//                 select: {
//                   id: true,
//                   name: true,
//                   instagramUserId: true,
//                   status: true,
//                   score: true,
//                   qualificationData: {
//                     select: {
//                       leadTier: true,
//                       estimatedValue: true,
//                       roi: true,
//                     },
//                   },
//                 },
//               },
//             },
//             orderBy: { timestamp: "desc" },
//             take: 20,
//           })
//           .catch((error) => {
//             console.error("Error getting recent interactions:", error)
//             return []
//           }),

//         // Check CRM integration status
//         client.crmIntegration
//           .findMany({
//             where: { userId, isActive: true },
//             select: {
//               id: true,
//               provider: true,
//               name: true,
//               isActive: true,
//               lastSynced: true,
//             },
//           })
//           .catch((error) => {
//             console.error("Error getting CRM integrations:", error)
//             return []
//           }),
//       ])

//     console.log(`Found ${recentLeads.length} recent leads, ${topLeads.length} top leads`)

//     // Calculate additional metrics safely
//     const totalEstimatedRevenue = tierStats.reduce((sum, tier) => sum + Number(tier._sum?.estimatedValue || 0), 0)
//     const avgLeadValue = recentLeads.length > 0 ? totalEstimatedRevenue / recentLeads.length : 0

//     // Enhanced analytics with calculated fields
//     const enhancedAnalytics = {
//       ...analytics,
//       totalEstimatedRevenue,
//       avgLeadValue,
//       tierDistribution: {
//         platinum: tierStats.find((t) => t.leadTier === "PLATINUM")?._count?.leadTier || 0,
//         gold: tierStats.find((t) => t.leadTier === "GOLD")?._count?.leadTier || 0,
//         silver: tierStats.find((t) => t.leadTier === "SILVER")?._count?.leadTier || 0,
//         bronze: tierStats.find((t) => t.leadTier === "BRONZE")?._count?.leadTier || 0,
//       },
//       premiumInsights: {
//         highValueLeads: topLeads.filter(
//           (lead) => lead?.qualificationData?.leadTier === "PLATINUM" || lead?.qualificationData?.leadTier === "GOLD",
//         ).length,
//         averageLeadValue: avgLeadValue,
//         conversionProbability: analytics?.conversionRate || 0,
//         totalPipelineValue: totalEstimatedRevenue,
//       },
//       recentInteractions: recentInteractions.map((interaction) => ({
//         ...interaction,
//         metadata: {
//           leadTier: interaction?.lead?.qualificationData?.leadTier || null,
//           estimatedValue: interaction?.lead?.qualificationData?.estimatedValue || null,
//           roi: interaction?.lead?.qualificationData?.roi || null,
//           notificationMessage: generateAINotification(interaction),
//         },
//       })),
//       crmStatus: {
//         connected: crmIntegrations.length > 0,
//         integrations: crmIntegrations,
//         lastSync: crmIntegrations.reduce(
//           (latest, crm) => (!latest || (crm.lastSynced && crm.lastSynced > latest) ? crm.lastSynced : latest),
//           null as Date | null,
//         ),
//       },
//     }

//     // Process leads with safe access
//     const processedRecentLeads = recentLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: qualData
//               ? {
//                   leadTier: qualData.leadTier || "BRONZE",
//                   estimatedValue: Number(qualData.estimatedValue || 0),
//                   roi: Number(qualData.roi || 0),
//                   notificationMessage: generateLeadNotification(lead),
//                   nextActions: generateNextActions(lead),
//                   followUpStrategy: generateFollowUpStrategy(lead),
//                   buyerPersona: generateBuyerPersona(lead),
//                 }
//               : {
//                   leadTier: "BRONZE",
//                   estimatedValue: 0,
//                   roi: 0,
//                   notificationMessage: "Lead needs analysis",
//                   nextActions: ["initial_analysis"],
//                   followUpStrategy: "standard",
//                   buyerPersona: "unknown",
//                 },
//           },
//         }
//       } catch (error) {
//         console.error(`Error processing lead ${lead?.id}:`, error)
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: {
//               leadTier: "BRONZE",
//               estimatedValue: 0,
//               roi: 0,
//               notificationMessage: "Error processing lead",
//               nextActions: ["manual_review"],
//               followUpStrategy: "manual",
//               buyerPersona: "unknown",
//             },
//           },
//         }
//       }
//     })

//     const processedTopLeads = topLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: qualData
//               ? {
//                   leadTier: qualData.leadTier || "BRONZE",
//                   estimatedValue: Number(qualData.estimatedValue || 0),
//                   roi: Number(qualData.roi || 0),
//                   followUpStrategy: generateFollowUpStrategy(lead),
//                   buyerPersona: generateBuyerPersona(lead),
//                 }
//               : {
//                   leadTier: "BRONZE",
//                   estimatedValue: 0,
//                   roi: 0,
//                   followUpStrategy: "standard",
//                   buyerPersona: "unknown",
//                 },
//           },
//         }
//       } catch (error) {
//         console.error(`Error processing top lead ${lead?.id}:`, error)
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: {
//               leadTier: "BRONZE",
//               estimatedValue: 0,
//               roi: 0,
//               followUpStrategy: "manual",
//               buyerPersona: "unknown",
//             },
//           },
//         }
//       }
//     })

//     return {
//       analytics: enhancedAnalytics,
//       recentLeads: processedRecentLeads,
//       topLeads: processedTopLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//       tierStats: tierStats.filter((stat) => stat.leadTier !== null),
//     }
//   } catch (error) {
//     console.error("Error fetching premium leads data:", error)
//     return {
//       analytics: {
//         totalLeads: 0,
//         qualifiedLeads: 0,
//         convertedLeads: 0,
//         conversionRate: 0,
//         qualificationRate: 0,
//         recentInteractions: [],
//         revenueMetrics: {
//           totalEstimatedRevenue: 0,
//           totalExpectedRevenue: 0,
//           averageROI: 0,
//           revenueGrowth: 0,
//         },
//         tierDistribution: {
//           platinum: 0,
//           gold: 0,
//           silver: 0,
//           bronze: 0,
//         },
//         premiumInsights: {
//           highValueLeads: 0,
//           averageLeadValue: 0,
//           conversionProbability: 0,
//           totalPipelineValue: 0,
//         },
//         crmStatus: {
//           connected: false,
//           integrations: [],
//           lastSync: null,
//         },
//       },
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//       tierStats: [],
//     }
//   }
// }

// // Helper functions for AI-generated insights with safe access
// function generateAINotification(interaction: any): string {
//   try {
//     const intent = interaction?.intent
//     const sentiment = interaction?.sentiment
//     const tier = interaction?.lead?.qualificationData?.leadTier

//     if (intent && typeof intent === "object" && "purchase_intent" in intent && intent.purchase_intent > 0.7) {
//       return `🔥 High purchase intent detected - immediate follow-up recommended`
//     }
//     if (sentiment && sentiment > 0.5 && tier === "PLATINUM") {
//       return `⭐ Platinum lead showing positive sentiment - perfect timing for proposal`
//     }
//     if (intent && typeof intent === "object" && "information_request" in intent && intent.information_request > 0.6) {
//       return `📋 Information request detected - send detailed product info`
//     }
//     return `🤖 AI analysis complete - lead scored and categorized`
//   } catch (error) {
//     console.error("Error generating AI notification:", error)
//     return `🤖 AI analysis complete`
//   }
// }

// function generateLeadNotification(lead: any): string {
//   try {
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const lastInteraction = lead?.interactions?.[0]

//     if (score >= 85 && tier === "PLATINUM") {
//       return `🎯 Premium opportunity - schedule immediate call`
//     }
//     if (score >= 70 && lastInteraction?.sentiment > 0.5) {
//       return `📞 Positive sentiment detected - great time to connect`
//     }
//     if (lead?.scheduledActions?.length > 0) {
//       return `⏰ Scheduled follow-up pending - stay on track`
//     }
//     if (!lead?.qualificationData) {
//       return `📊 Lead needs AI analysis - run qualification`
//     }
//     return `📊 Lead qualified and ready for engagement`
//   } catch (error) {
//     console.error("Error generating lead notification:", error)
//     return `📊 Lead ready for review`
//   }
// }

// function generateNextActions(lead: any): string[] {
//   try {
//     const actions = []
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"

//     if (!lead?.qualificationData) {
//       actions.push("run_ai_analysis")
//     }

//     if (score >= 80) actions.push("immediate_call")
//     if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
//     if (!lead?.interactions || lead.interactions.length === 0) actions.push("initial_outreach")
//     if (lead?.email) actions.push("email_sequence")

//     return actions.slice(0, 3) // Limit to top 3 actions
//   } catch (error) {
//     console.error("Error generating next actions:", error)
//     return ["manual_review"]
//   }
// }

// function generateFollowUpStrategy(lead: any): string {
//   try {
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const score = lead?.score || 0

//     if (!lead?.qualificationData) return "needs_analysis"
//     if (tier === "PLATINUM") return "immediate_personal_outreach"
//     if (tier === "GOLD" && score >= 70) return "priority_nurturing"
//     if (score >= 50) return "automated_sequence"
//     return "long_term_nurturing"
//   } catch (error) {
//     console.error("Error generating follow-up strategy:", error)
//     return "manual"
//   }
// }

// function generateBuyerPersona(lead: any): string {
//   try {
//     const score = lead?.score || 0
//     const engagementScore = lead?.qualificationData?.engagementScore || 0
//     const intentScore = lead?.qualificationData?.intentScore || 0

//     if (!lead?.qualificationData) return "unanalyzed_prospect"
//     if (intentScore >= 80) return "ready_buyer"
//     if (engagementScore >= 70) return "engaged_prospect"
//     if (score >= 60) return "qualified_lead"
//     return "early_stage_prospect"
//   } catch (error) {
//     console.error("Error generating buyer persona:", error)
//     return "unknown"
//   }
// }

// // Enhanced server action to merge duplicates with better error handling
// async function handleMergeDuplicates(userId: string) {
//   "use server"
//   try {
//     const result = await mergeDuplicateLeads(userId)

//     // Log the merge operation for audit purposes
//     await client.auditLog
//       .create({
//         data: {
//           userId,
//           action: "MERGE_DUPLICATE_LEADS",
//           target: "LEADS",
//           details: `Merged ${result.mergedGroups} duplicate lead groups`,
//           metadata: {
//             mergedGroups: result.mergedGroups,
//             timestamp: new Date().toISOString(),
//           },
//         },
//       })
//       .catch(() => {}) // Ignore audit log errors

//     return { success: true, mergedGroups: result.mergedGroups }
//   } catch (error) {
//     console.error("Error merging duplicates:", error)

//     // Log the error for debugging
//     await client.auditLog
//       .create({
//         data: {
//           userId,
//           action: "MERGE_DUPLICATE_LEADS_ERROR",
//           target: "LEADS",
//           details: `Failed to merge duplicates: ${error instanceof Error ? error.message : "Unknown error"}`,
//           metadata: {
//             error: error instanceof Error ? error.message : "Unknown error",
//             timestamp: new Date().toISOString(),
//           },
//         },
//       })
//       .catch(() => {}) // Ignore audit log errors

//     return { success: false, error: "Failed to merge duplicates" }
//   }
// }

// export default async function PremiumLeadsPage() {
//   const user = await onUserInfor()
//   const userId = user.data?.id

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount, tierStats } = await getPremiumLeadsData(
//     user.data.id,
//   )

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//               <div className="text-center">
//                 <p className="text-lg font-medium">Loading Premium Analytics...</p>
//                 <p className="text-sm text-muted-foreground">Analyzing your revenue pipeline with AI</p>
//               </div>
//             </div>
//           </div>
//         }
//       >
//         <PremiumLeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={userId || ""}
//           onMergeDuplicates={handleMergeDuplicates}
//         />
//       </Suspense>
//     </div>
//   )
// }



// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getPremiumLeadAnalytics, mergeDuplicateLeads } from "@/lib/lead-qualification"
// import { PremiumLeadsDashboard } from "../_components/leads/leads"

// // Enhanced server action to get comprehensive premium leads data
// async function getPremiumLeadsData(userId: string) {
//   try {
//     console.log(`Fetching premium leads data for user: ${userId}`)

//     const [analytics, recentLeads, topLeads, duplicateCount, recentInteractions] = await Promise.all([
//       getPremiumLeadAnalytics(userId).catch((error) => {
//         console.error("Error getting analytics:", error)
//         return {
//           totalLeads: 0,
//           qualifiedLeads: 0,
//           convertedLeads: 0,
//           conversionRate: 0,
//           qualificationRate: 0,
//           recentInteractions: [],
//           revenueMetrics: {
//             totalEstimatedRevenue: 0,
//             totalExpectedRevenue: 0,
//             averageROI: 0,
//             revenueGrowth: 0,
//           },
//           tierDistribution: {
//             platinum: 0,
//             gold: 0,
//             silver: 0,
//             bronze: 0,
//           },
//           enhancedInsights: {
//             highValueLeads: 0,
//             averageLeadValue: 0,
//             conversionProbability: 0,
//           },
//           crmStatus: {
//             connected: false,
//             integrations: [],
//             lastSync: null,
//           },
//         }
//       }),

//       // Enhanced recent leads with comprehensive data
//       client.lead
//         .findMany({
//           where: { userId },
//           include: {
//             qualificationData: true,
//             interactions: {
//               take: 3,
//               orderBy: { timestamp: "desc" },
//             },
//           },
//           orderBy: { lastContactDate: "desc" },
//           take: 50,
//         })
//         .catch((error) => {
//           console.error("Error getting recent leads:", error)
//           return []
//         }),

//       // Top performing leads with enhanced scoring
//       client.lead
//         .findMany({
//           where: {
//             userId,
//             score: { gte: 50 },
//           },
//           include: {
//             qualificationData: true,
//             interactions: {
//               take: 2,
//               orderBy: { timestamp: "desc" },
//             },
//           },
//           orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
//           take: 15,
//         })
//         .catch((error) => {
//           console.error("Error getting top leads:", error)
//           return []
//         }),

//       // Check for potential duplicates
//       client.lead
//         .groupBy({
//           by: ["instagramUserId", "pageId"],
//           where: { userId },
//           having: {
//             id: { _count: { gt: 1 } },
//           },
//           _count: { id: true },
//         })
//         .catch((error) => {
//           console.error("Error getting duplicates:", error)
//           return []
//         }),

//       // Recent AI-analyzed interactions
//       client.leadInteraction
//         .findMany({
//           where: {
//             lead: { userId },
//           },
//           include: {
//             lead: {
//               select: {
//                 id: true,
//                 name: true,
//                 instagramUserId: true,
//                 status: true,
//                 score: true,
//                 qualificationData: {
//                   select: {
//                     leadTier: true,
//                     estimatedValue: true,
//                     roi: true,
//                   },
//                 },
//               },
//             },
//           },
//           orderBy: { timestamp: "desc" },
//           take: 20,
//         })
//         .catch((error) => {
//           console.error("Error getting recent interactions:", error)
//           return []
//         }),
//     ])

//     console.log(`Found ${recentLeads.length} recent leads, ${topLeads.length} top leads`)

//     // Process leads with safe access
//     const processedRecentLeads = recentLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: qualData
//               ? {
//                   leadTier: qualData.leadTier || "BRONZE",
//                   estimatedValue: Number(qualData.estimatedValue || 0),
//                   roi: Number(qualData.roi || 0),
//                   notificationMessage: generateLeadNotification(lead),
//                   nextActions: generateNextActions(lead),
//                   followUpStrategy: generateFollowUpStrategy(lead),
//                   buyerPersona: generateBuyerPersona(lead),
//                 }
//               : {
//                   leadTier: "BRONZE",
//                   estimatedValue: 0,
//                   roi: 0,
//                   notificationMessage: "Lead needs analysis",
//                   nextActions: ["initial_analysis"],
//                   followUpStrategy: "standard",
//                   buyerPersona: "unknown",
//                 },
//           },
//         }
//       } catch (error) {
//         console.error(`Error processing lead ${lead?.id}:`, error)
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: {
//               leadTier: "BRONZE",
//               estimatedValue: 0,
//               roi: 0,
//               notificationMessage: "Error processing lead",
//               nextActions: ["manual_review"],
//               followUpStrategy: "manual",
//               buyerPersona: "unknown",
//             },
//           },
//         }
//       }
//     })

//     const processedTopLeads = topLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: qualData
//               ? {
//                   leadTier: qualData.leadTier || "BRONZE",
//                   estimatedValue: Number(qualData.estimatedValue || 0),
//                   roi: Number(qualData.roi || 0),
//                   followUpStrategy: generateFollowUpStrategy(lead),
//                   buyerPersona: generateBuyerPersona(lead),
//                 }
//               : {
//                   leadTier: "BRONZE",
//                   estimatedValue: 0,
//                   roi: 0,
//                   followUpStrategy: "standard",
//                   buyerPersona: "unknown",
//                 },
//           },
//         }
//       } catch (error) {
//         console.error(`Error processing top lead ${lead?.id}:`, error)
//         return {
//           ...lead,
//           metadata: {
//             lastAnalysis: {
//               leadTier: "BRONZE",
//               estimatedValue: 0,
//               roi: 0,
//               followUpStrategy: "manual",
//               buyerPersona: "unknown",
//             },
//           },
//         }
//       }
//     })

//     // Process interactions with metadata
//     const processedInteractions = recentInteractions.map((interaction) => ({
//       ...interaction,
//       metadata: {
//         leadTier: interaction?.lead?.qualificationData?.leadTier || null,
//         estimatedValue: interaction?.lead?.qualificationData?.estimatedValue || null,
//         roi: interaction?.lead?.qualificationData?.roi || null,
//         notificationMessage: generateAINotification(interaction),
//       },
//     }))

//     return {
//       analytics,
//       recentLeads: processedRecentLeads,
//       topLeads: processedTopLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//       interactions: processedInteractions,
//     }
//   } catch (error) {
//     console.error("Error fetching premium leads data:", error)
//     return {
//       analytics: {
//         totalLeads: 0,
//         qualifiedLeads: 0,
//         convertedLeads: 0,
//         conversionRate: 0,
//         qualificationRate: 0,
//         recentInteractions: [],
//         revenueMetrics: {
//           totalEstimatedRevenue: 0,
//           totalExpectedRevenue: 0,
//           averageROI: 0,
//           revenueGrowth: 0,
//         },
//         tierDistribution: {
//           platinum: 0,
//           gold: 0,
//           silver: 0,
//           bronze: 0,
//         },
//         enhancedInsights: {
//           highValueLeads: 0,
//           averageLeadValue: 0,
//           conversionProbability: 0,
//         },
//         crmStatus: {
//           connected: false,
//           integrations: [],
//           lastSync: null,
//         },
//       },
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//       interactions: [],
//     }
//   }
// }

// // Helper functions for AI-generated insights
// function generateAINotification(interaction: any): string {
//   try {
//     const intent = interaction?.intent
//     const sentiment = interaction?.sentiment
//     const tier = interaction?.lead?.qualificationData?.leadTier

//     if (intent && typeof intent === "object" && "purchase_intent" in intent && intent.purchase_intent > 0.7) {
//       return `🔥 High purchase intent detected - immediate follow-up recommended`
//     }
//     if (sentiment && sentiment > 0.5 && tier === "PLATINUM") {
//       return `⭐ Platinum lead showing positive sentiment - perfect timing for proposal`
//     }
//     if (intent && typeof intent === "object" && "information_request" in intent && intent.information_request > 0.6) {
//       return `📋 Information request detected - send detailed product info`
//     }
//     return `🤖 AI analysis complete - lead scored and categorized`
//   } catch (error) {
//     console.error("Error generating AI notification:", error)
//     return `🤖 AI analysis complete`
//   }
// }

// function generateLeadNotification(lead: any): string {
//   try {
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const lastInteraction = lead?.interactions?.[0]

//     if (score >= 85 && tier === "PLATINUM") {
//       return `🎯 Premium opportunity - schedule immediate call`
//     }
//     if (score >= 70 && lastInteraction?.sentiment > 0.5) {
//       return `📞 Positive sentiment detected - great time to connect`
//     }
//     if (!lead?.qualificationData) {
//       return `📊 Lead needs AI analysis - run qualification`
//     }
//     return `📊 Lead qualified and ready for engagement`
//   } catch (error) {
//     console.error("Error generating lead notification:", error)
//     return `📊 Lead ready for review`
//   }
// }

// function generateNextActions(lead: any): string[] {
//   try {
//     const actions = []
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"

//     if (!lead?.qualificationData) {
//       actions.push("run_ai_analysis")
//     }

//     if (score >= 80) actions.push("immediate_call")
//     if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
//     if (!lead?.interactions || lead.interactions.length === 0) actions.push("initial_outreach")
//     if (lead?.email) actions.push("email_sequence")

//     return actions.slice(0, 3)
//   } catch (error) {
//     console.error("Error generating next actions:", error)
//     return ["manual_review"]
//   }
// }

// function generateFollowUpStrategy(lead: any): string {
//   try {
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const score = lead?.score || 0

//     if (!lead?.qualificationData) return "needs_analysis"
//     if (tier === "PLATINUM") return "immediate_personal_outreach"
//     if (tier === "GOLD" && score >= 70) return "priority_nurturing"
//     if (score >= 50) return "automated_sequence"
//     return "long_term_nurturing"
//   } catch (error) {
//     console.error("Error generating follow-up strategy:", error)
//     return "manual"
//   }
// }

// function generateBuyerPersona(lead: any): string {
//   try {
//     const score = lead?.score || 0
//     const engagementScore = lead?.qualificationData?.engagementScore || 0
//     const intentScore = lead?.qualificationData?.intentScore || 0

//     if (!lead?.qualificationData) return "unanalyzed_prospect"
//     if (intentScore >= 80) return "ready_buyer"
//     if (engagementScore >= 70) return "engaged_prospect"
//     if (score >= 60) return "qualified_lead"
//     return "early_stage_prospect"
//   } catch (error) {
//     console.error("Error generating buyer persona:", error)
//     return "unknown"
//   }
// }

// // Enhanced server action to merge duplicates
// async function handleMergeDuplicates(userId: string) {
//   "use server"
//   try {
//     const result = await mergeDuplicateLeads(userId)
//     return { success: true, mergedGroups: result.mergedGroups }
//   } catch (error) {
//     console.error("Error merging duplicates:", error)
//     return { success: false, error: "Failed to merge duplicates" }
//   }
// }

// export default async function PremiumLeadsPage() {
//   const user = await onUserInfor()

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount, interactions } = await getPremiumLeadsData(
//     user.data.id,
//   )

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//               <div className="text-center">
//                 <p className="text-lg font-medium">Loading AI Analytics...</p>
//                 <p className="text-sm text-muted-foreground">Analyzing your revenue pipeline</p>
//               </div>
//             </div>
//           </div>
//         }
//       >
//         <PremiumLeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={user.data.id}
//           onMergeDuplicates={handleMergeDuplicates}
//           interactions={interactions}
//         />
//       </Suspense>
//     </div>
//   )
// }

// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getPremiumLeadAnalytics, mergeDuplicateLeads } from "@/lib/lead-qualification"
// import { PremiumLeadsDashboard } from "../_components/leads/leads"

// // Add this function to calculate marketing completeness
// function calculateMarketingCompleteness(lead: any): number {
//   if (!lead) return 0

//   const fields = ["name", "email", "phone"]
//   const completedFields = fields.filter((field) => lead[field]).length
//   return Math.round((completedFields / fields.length) * 100)
// }

// // Enhanced server action to get comprehensive premium leads data
// async function getPremiumLeadsData(userId: string) {
//   try {
//     console.log(`Fetching premium leads data for user: ${userId}`)

//     const [analytics, recentLeads, topLeads, duplicateCount, recentInteractions] = await Promise.all([
//       getPremiumLeadAnalytics(userId).catch((error) => {
//         console.error("Error getting analytics:", error)
//         return {
//           totalLeads: 0,
//           qualifiedLeads: 0,
//           convertedLeads: 0,
//           conversionRate: 0,
//           qualificationRate: 0,
//           recentInteractions: [],
//           revenueMetrics: {
//             totalEstimatedRevenue: 0,
//             totalExpectedRevenue: 0,
//             averageROI: 0,
//             revenueGrowth: 0,
//           },
//           tierDistribution: {
//             platinum: 0,
//             gold: 0,
//             silver: 0,
//             bronze: 0,
//           },
//           enhancedInsights: {
//             highValueLeads: 0,
//             averageLeadValue: 0,
//             conversionProbability: 0,
//           },
//           crmStatus: {
//             connected: false,
//             integrations: [],
//             lastSync: null,
//           },
//         }
//       }),

//       // Enhanced recent leads
//       client.lead
//         .findMany({
//           where: { userId },
//           include: {
//             qualificationData: true,
//             interactions: {
//               take: 3,
//               orderBy: { timestamp: "desc" },
//             },
//           },
//           orderBy: { lastContactDate: "desc" },
//           take: 50,
//         })
//         .catch((error) => {
//           console.error("Error getting recent leads:", error)
//           return []
//         }),

//       // Top performing leads
//       client.lead
//         .findMany({
//           where: {
//             userId,
//             score: { gte: 50 },
//           },
//           include: {
//             qualificationData: true,
//             interactions: {
//               take: 2,
//               orderBy: { timestamp: "desc" },
//             },
//           },
//           orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
//           take: 15,
//         })
//         .catch((error) => {
//           console.error("Error getting top leads:", error)
//           return []
//         }),

//       // Check for potential duplicates
//       client.lead
//         .groupBy({
//           by: ["instagramUserId", "pageId"],
//           where: { userId },
//           having: {
//             id: { _count: { gt: 1 } },
//           },
//           _count: { id: true },
//         })
//         .catch((error) => {
//           console.error("Error getting duplicates:", error)
//           return []
//         }),

//       // Recent AI-analyzed interactions
//       client.leadInteraction
//         .findMany({
//           where: {
//             lead: { userId },
//           },
//           include: {
//             lead: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 phone: true,
//                 instagramUserId: true,
//                 status: true,
//                 score: true,
//                 qualificationData: {
//                   select: {
//                     leadTier: true,
//                     estimatedValue: true,
//                     roi: true,
//                   },
//                 },
//               },
//             },
//           },
//           orderBy: { timestamp: "desc" },
//           take: 20,
//         })
//         .catch((error) => {
//           console.error("Error getting recent interactions:", error)
//           return []
//         }),
//     ])

//     console.log(`Found ${recentLeads.length} recent leads, ${topLeads.length} top leads`)

//     // Process recent leads
//     const processedRecentLeads = recentLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData

//         // Calculate marketing completeness based on lead fields
//         const marketingCompleteness = calculateMarketingCompleteness(lead)

//         // Safely handle instagramUserId
//         const instagramUserId = lead?.instagramUserId || "unknown"
//         const displayName =
//           lead?.name || `Instagram User ${instagramUserId.length > 4 ? instagramUserId.slice(-4) : instagramUserId}`

//         return {
//           ...lead,
//           // Use lead name or generate display name
//           name: displayName,
//           metadata: {
//             lastAnalysis: qualData
//               ? {
//                   leadTier: qualData.leadTier || "BRONZE",
//                   estimatedValue: Number(qualData.estimatedValue || 0),
//                   roi: Number(qualData.roi || 0),
//                   notificationMessage: generateLeadNotification(lead, marketingCompleteness),
//                   nextActions: generateNextActions(lead, marketingCompleteness),
//                   followUpStrategy: generateFollowUpStrategy(lead),
//                   buyerPersona: generateBuyerPersona(lead),
//                 }
//               : {
//                   leadTier: "BRONZE",
//                   estimatedValue: 0,
//                   roi: 0,
//                   notificationMessage: "Lead needs analysis",
//                   nextActions: ["initial_analysis"],
//                   followUpStrategy: "standard",
//                   buyerPersona: "unknown",
//                 },
//             // Include marketing completeness score
//             marketingCompleteness: marketingCompleteness,
//           },
//         }
//       } catch (error) {
//         console.error(`Error processing lead ${lead?.id}:`, error)
//         return {
//           ...lead,
//           name: lead?.name || "Unknown Lead",
//           metadata: {
//             lastAnalysis: {
//               leadTier: "BRONZE",
//               estimatedValue: 0,
//               roi: 0,
//               notificationMessage: "Error processing lead",
//               nextActions: ["manual_review"],
//               followUpStrategy: "manual",
//               buyerPersona: "unknown",
//             },
//             marketingCompleteness: 0,
//           },
//         }
//       }
//     })

//     // Process top leads
//     const processedTopLeads = topLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData

//         // Safely handle instagramUserId
//         const instagramUserId = lead?.instagramUserId || "unknown"
//         const displayName =
//           lead?.name || `Instagram User ${instagramUserId.length > 4 ? instagramUserId.slice(-4) : instagramUserId}`

//         return {
//           ...lead,
//           name: displayName,
//           metadata: {
//             lastAnalysis: qualData
//               ? {
//                   leadTier: qualData.leadTier || "BRONZE",
//                   estimatedValue: Number(qualData.estimatedValue || 0),
//                   roi: Number(qualData.roi || 0),
//                   followUpStrategy: generateFollowUpStrategy(lead),
//                   buyerPersona: generateBuyerPersona(lead),
//                 }
//               : {
//                   leadTier: "BRONZE",
//                   estimatedValue: 0,
//                   roi: 0,
//                   followUpStrategy: "standard",
//                   buyerPersona: "unknown",
//                 },
//             marketingCompleteness: calculateMarketingCompleteness(lead),
//           },
//         }
//       } catch (error) {
//         console.error(`Error processing top lead ${lead?.id}:`, error)
//         return {
//           ...lead,
//           name: lead?.name || "Unknown Lead",
//           metadata: {
//             lastAnalysis: {
//               leadTier: "BRONZE",
//               estimatedValue: 0,
//               roi: 0,
//               followUpStrategy: "manual",
//               buyerPersona: "unknown",
//             },
//             marketingCompleteness: 0,
//           },
//         }
//       }
//     })

//     // Process interactions
//     const processedInteractions = recentInteractions.map((interaction) => ({
//       ...interaction,
//       metadata: {
//         leadTier: interaction?.lead?.qualificationData?.leadTier || null,
//         estimatedValue: interaction?.lead?.qualificationData?.estimatedValue || null,
//         roi: interaction?.lead?.qualificationData?.roi || null,
//         notificationMessage: generateAINotification(interaction),
//         hasMarketingInfo: !!(interaction?.lead?.name || interaction?.lead?.email || interaction?.lead?.phone),
//         marketingCompleteness: calculateMarketingCompleteness(interaction?.lead),
//       },
//     }))

//     return {
//       analytics,
//       recentLeads: processedRecentLeads,
//       topLeads: processedTopLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//       interactions: processedInteractions,
//     }
//   } catch (error) {
//     console.error("Error fetching premium leads data:", error)
//     return {
//       analytics: {
//         totalLeads: 0,
//         qualifiedLeads: 0,
//         convertedLeads: 0,
//         conversionRate: 0,
//         qualificationRate: 0,
//         recentInteractions: [],
//         revenueMetrics: {
//           totalEstimatedRevenue: 0,
//           totalExpectedRevenue: 0,
//           averageROI: 0,
//           revenueGrowth: 0,
//         },
//         tierDistribution: {
//           platinum: 0,
//           gold: 0,
//           silver: 0,
//           bronze: 0,
//         },
//         enhancedInsights: {
//           highValueLeads: 0,
//           averageLeadValue: 0,
//           conversionProbability: 0,
//         },
//         crmStatus: {
//           connected: false,
//           integrations: [],
//           lastSync: null,
//         },
//       },
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//       interactions: [],
//     }
//   }
// }

// // Helper functions for AI-generated insights
// function generateAINotification(interaction: any): string {
//   try {
//     const intent = interaction?.intent
//     const sentiment = interaction?.sentiment
//     const tier = interaction?.lead?.qualificationData?.leadTier
//     const hasMarketingInfo = !!(interaction?.lead?.name || interaction?.lead?.email || interaction?.lead?.phone)

//     if (intent && typeof intent === "object" && "purchase_intent" in intent && intent.purchase_intent > 0.7) {
//       return `🔥 High purchase intent detected - immediate follow-up recommended`
//     }
//     if (sentiment && sentiment > 0.5 && tier === "PLATINUM") {
//       return `⭐ Platinum lead showing positive sentiment - perfect timing for proposal`
//     }
//     if (hasMarketingInfo) {
//       return `📋 Complete contact information available - ready for CRM sync`
//     }
//     if (intent && typeof intent === "object" && "information_request" in intent && intent.information_request > 0.6) {
//       return `📋 Information request detected - send detailed product info`
//     }
//     return `🤖 AI analysis complete - lead scored and categorized`
//   } catch (error) {
//     console.error("Error generating AI notification:", error)
//     return `🤖 AI analysis complete`
//   }
// }

// function generateLeadNotification(lead: any, marketingCompleteness: number): string {
//   try {
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const lastInteraction = lead?.interactions?.[0]

//     if (score >= 85 && tier === "PLATINUM") {
//       return `🎯 Premium opportunity - schedule immediate call`
//     }
//     if (score >= 70 && lastInteraction?.sentiment && lastInteraction.sentiment > 0.5) {
//       return `📞 Positive sentiment detected - great time to connect`
//     }
//     if (marketingCompleteness >= 80) {
//       return `✅ Complete profile - ready for CRM sync and follow-up`
//     }
//     if (marketingCompleteness >= 50) {
//       return `📝 Partial profile captured - collect remaining details`
//     }
//     if (!lead?.qualificationData) {
//       return `📊 Lead needs AI analysis - run qualification`
//     }
//     return `📊 Lead qualified and ready for engagement`
//   } catch (error) {
//     console.error("Error generating lead notification:", error)
//     return `📊 Lead ready for review`
//   }
// }

// function generateNextActions(lead: any, marketingCompleteness: number): string[] {
//   try {
//     const actions = []
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const interactions = lead?.interactions || []

//     if (!lead?.qualificationData) {
//       actions.push("run_ai_analysis")
//     }

//     if (marketingCompleteness < 50) {
//       actions.push("collect_contact_info")
//     }

//     if (score >= 80) actions.push("immediate_call")
//     if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
//     if (interactions.length === 0) actions.push("initial_outreach")
//     if (lead?.email) actions.push("email_sequence")
//     if (marketingCompleteness >= 80) actions.push("sync_to_crm")

//     return actions.slice(0, 3) // This is likely where the error occurs - ensure actions is not null
//   } catch (error) {
//     console.error("Error generating next actions:", error)
//     return ["manual_review"]
//   }
// }

// function generateFollowUpStrategy(lead: any): string {
//   try {
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const score = lead?.score || 0
//     const completeness = calculateMarketingCompleteness(lead)

//     if (!lead?.qualificationData) return "needs_analysis"
//     if (tier === "PLATINUM" && completeness >= 70) return "immediate_personal_outreach"
//     if (tier === "GOLD" && score >= 70) return "priority_nurturing"
//     if (completeness >= 80) return "automated_crm_sequence"
//     if (score >= 50) return "automated_sequence"
//     return "long_term_nurturing"
//   } catch (error) {
//     console.error("Error generating follow-up strategy:", error)
//     return "manual"
//   }
// }

// function generateBuyerPersona(lead: any): string {
//   try {
//     const score = lead?.score || 0
//     const engagementScore = lead?.qualificationData?.engagementScore || 0
//     const intentScore = lead?.qualificationData?.intentScore || 0

//     if (!lead?.qualificationData) return "unanalyzed_prospect"
//     if (intentScore >= 80) return "ready_buyer"
//     if (engagementScore >= 70) return "engaged_prospect"
//     if (score >= 60) return "qualified_lead"
//     return "early_stage_prospect"
//   } catch (error) {
//     console.error("Error generating buyer persona:", error)
//     return "unknown"
//   }
// }

// // Enhanced server action to merge duplicates
// async function handleMergeDuplicates(userId: string) {
//   "use server"
//   try {
//     const result = await mergeDuplicateLeads(userId)
//     return { success: true, mergedGroups: result.mergedGroups }
//   } catch (error) {
//     console.error("Error merging duplicates:", error)
//     return { success: false, error: "Failed to merge duplicates" }
//   }
// }

// export default async function PremiumLeadsPage() {
//   const user = await onUserInfor()

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount, interactions } = await getPremiumLeadsData(
//     user.data.id,
//   )

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//               <div className="text-center">
//                 <p className="text-lg font-medium">Loading AI Analytics...</p>
//                 <p className="text-sm text-muted-foreground">Analyzing your revenue pipeline</p>
//               </div>
//             </div>
//           </div>
//         }
//       >
//         <PremiumLeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={user.data.id}
//           onMergeDuplicates={handleMergeDuplicates}
//           interactions={interactions}
//         />
//       </Suspense>
//     </div>
//   )
// }


import { Suspense } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics, mergeDuplicateLeads } from "@/lib/lead-qualification"
import { PremiumLeadsDashboard } from "../_components/leads/leads"

// Add this function to calculate marketing completeness
function calculateMarketingCompleteness(lead: any): number {
  if (!lead) return 0
  const fields = ["name", "email", "phone"]
  const completedFields = fields.filter((field) => lead[field]).length
  return Math.round((completedFields / fields.length) * 100)
}

// Enhanced server action to get comprehensive premium leads data
async function getPremiumLeadsData(userId: string) {
  try {
    console.log(`Fetching premium leads data for user: ${userId}`)

    const [analytics, recentLeads, topLeads, duplicateCount, recentInteractions] = await Promise.all([
      getPremiumLeadAnalytics(userId).catch((error) => {
        console.error("Error getting analytics:", error)
        return {
          totalLeads: 0,
          qualifiedLeads: 0,
          convertedLeads: 0,
          conversionRate: 0,
          qualificationRate: 0,
          recentInteractions: [],
          revenueMetrics: {
            totalEstimatedRevenue: 0,
            totalExpectedRevenue: 0,
            averageROI: 0,
            revenueGrowth: 0,
          },
          tierDistribution: {
            platinum: 0,
            gold: 0,
            silver: 0,
            bronze: 0,
          },
          enhancedInsights: {
            highValueLeads: 0,
            averageLeadValue: 0,
            conversionProbability: 0,
          },
          crmStatus: {
            connected: false,
            integrations: [],
            lastSync: null,
          },
        }
      }),

      // Enhanced recent leads
      client.lead
        .findMany({
          where: { userId },
          include: {
            qualificationData: true,
            interactions: {
              take: 5,
              orderBy: { timestamp: "desc" },
            },
          },
          orderBy: { lastContactDate: "desc" },
          take: 50,
        })
        .catch((error) => {
          console.error("Error getting recent leads:", error)
          return []
        }),

      // Top performing leads
      client.lead
        .findMany({
          where: {
            userId,
            score: { gte: 30 }, // Lower threshold to get more leads
          },
          include: {
            qualificationData: true,
            interactions: {
              take: 3,
              orderBy: { timestamp: "desc" },
            },
          },
          orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
          take: 15,
        })
        .catch((error) => {
          console.error("Error getting top leads:", error)
          return []
        }),

      // Check for potential duplicates
      client.lead
        .groupBy({
          by: ["instagramUserId", "pageId"],
          where: { userId },
          having: {
            id: { _count: { gt: 1 } },
          },
          _count: { id: true },
        })
        .catch((error) => {
          console.error("Error getting duplicates:", error)
          return []
        }),

      // Recent AI-analyzed interactions
      client.leadInteraction
        .findMany({
          where: {
            lead: { userId },
          },
          include: {
            lead: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                instagramUserId: true,
                status: true,
                score: true,
                qualificationData: {
                  select: {
                    leadTier: true,
                    estimatedValue: true,
                    roi: true,
                  },
                },
              },
            },
          },
          orderBy: { timestamp: "desc" },
          take: 20,
        })
        .catch((error) => {
          console.error("Error getting recent interactions:", error)
          return []
        }),
    ])

    console.log(`Found ${recentLeads.length} recent leads, ${topLeads.length} top leads`)

    // Process recent leads with enhanced display names
    const processedRecentLeads = recentLeads.map((lead) => {
      try {
        const qualData = lead?.qualificationData
        const marketingCompleteness = calculateMarketingCompleteness(lead)

        // Create a proper display name
        const instagramUserId = lead?.instagramUserId || "unknown"
        let displayName = lead?.name

        if (!displayName) {
          // If no name, create a friendly display name from Instagram handle
          if (instagramUserId && instagramUserId !== "unknown") {
            displayName = `@${instagramUserId}`
          } else {
            displayName = "Unknown User"
          }
        }

        return {
          ...lead,
          name: displayName, // Override with proper display name
          metadata: {
            lastAnalysis: qualData
              ? {
                  leadTier: qualData.leadTier || "BRONZE",
                  estimatedValue: Number(qualData.estimatedValue || 0),
                  roi: Number(qualData.roi || 0),
                  notificationMessage: generateLeadNotification(lead, marketingCompleteness),
                  nextActions: generateNextActions(lead, marketingCompleteness),
                  followUpStrategy: generateFollowUpStrategy(lead),
                  buyerPersona: generateBuyerPersona(lead),
                }
              : {
                  leadTier: "BRONZE",
                  estimatedValue: 0,
                  roi: 0,
                  notificationMessage: "Lead needs analysis",
                  nextActions: ["initial_analysis"],
                  followUpStrategy: "standard",
                  buyerPersona: "unknown",
                },
            marketingCompleteness: marketingCompleteness,
          },
        }
      } catch (error) {
        console.error(`Error processing lead ${lead?.id}:`, error)
        return {
          ...lead,
          name: lead?.name || "Unknown Lead",
          metadata: {
            lastAnalysis: {
              leadTier: "BRONZE",
              estimatedValue: 0,
              roi: 0,
              notificationMessage: "Error processing lead",
              nextActions: ["manual_review"],
              followUpStrategy: "manual",
              buyerPersona: "unknown",
            },
            marketingCompleteness: 0,
          },
        }
      }
    })

    // Process top leads similarly
    const processedTopLeads = topLeads.map((lead) => {
      try {
        const qualData = lead?.qualificationData
        const instagramUserId = lead?.instagramUserId || "unknown"
        let displayName = lead?.name

        if (!displayName) {
          if (instagramUserId && instagramUserId !== "unknown") {
            displayName = `@${instagramUserId}`
          } else {
            displayName = "Unknown User"
          }
        }

        return {
          ...lead,
          name: displayName,
          metadata: {
            lastAnalysis: qualData
              ? {
                  leadTier: qualData.leadTier || "BRONZE",
                  estimatedValue: Number(qualData.estimatedValue || 0),
                  roi: Number(qualData.roi || 0),
                  followUpStrategy: generateFollowUpStrategy(lead),
                  buyerPersona: generateBuyerPersona(lead),
                }
              : {
                  leadTier: "BRONZE",
                  estimatedValue: 0,
                  roi: 0,
                  followUpStrategy: "standard",
                  buyerPersona: "unknown",
                },
            marketingCompleteness: calculateMarketingCompleteness(lead),
          },
        }
      } catch (error) {
        console.error(`Error processing top lead ${lead?.id}:`, error)
        return {
          ...lead,
          name: lead?.name || "Unknown Lead",
          metadata: {
            lastAnalysis: {
              leadTier: "BRONZE",
              estimatedValue: 0,
              roi: 0,
              followUpStrategy: "manual",
              buyerPersona: "unknown",
            },
            marketingCompleteness: 0,
          },
        }
      }
    })

    // Process interactions
    const processedInteractions = recentInteractions.map((interaction) => ({
      ...interaction,
      metadata: {
        leadTier: interaction?.lead?.qualificationData?.leadTier || null,
        estimatedValue: interaction?.lead?.qualificationData?.estimatedValue || null,
        roi: interaction?.lead?.qualificationData?.roi || null,
        notificationMessage: generateAINotification(interaction),
        hasMarketingInfo: !!(interaction?.lead?.name || interaction?.lead?.email || interaction?.lead?.phone),
        marketingCompleteness: calculateMarketingCompleteness(interaction?.lead),
      },
    }))

    return {
      analytics,
      recentLeads: processedRecentLeads,
      topLeads: processedTopLeads,
      hasDuplicates: duplicateCount.length > 0,
      duplicateCount: duplicateCount.length,
      interactions: processedInteractions,
    }
  } catch (error) {
    console.error("Error fetching premium leads data:", error)
    return {
      analytics: {
        totalLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        qualificationRate: 0,
        recentInteractions: [],
        revenueMetrics: {
          totalEstimatedRevenue: 0,
          totalExpectedRevenue: 0,
          averageROI: 0,
          revenueGrowth: 0,
        },
        tierDistribution: {
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
        },
        enhancedInsights: {
          highValueLeads: 0,
          averageLeadValue: 0,
          conversionProbability: 0,
        },
        crmStatus: {
          connected: false,
          integrations: [],
          lastSync: null,
        },
      },
      recentLeads: [],
      topLeads: [],
      hasDuplicates: false,
      duplicateCount: 0,
      interactions: [],
    }
  }
}

// Helper functions for AI-generated insights
function generateAINotification(interaction: any): string {
  try {
    const intent = interaction?.intent
    const sentiment = interaction?.sentiment
    const tier = interaction?.lead?.qualificationData?.leadTier
    const hasMarketingInfo = !!(interaction?.lead?.name || interaction?.lead?.email || interaction?.lead?.phone)

    if (intent && typeof intent === "object" && "purchase_intent" in intent && intent.purchase_intent > 0.7) {
      return `🔥 High purchase intent detected - immediate follow-up recommended`
    }
    if (sentiment && sentiment > 0.5 && tier === "PLATINUM") {
      return `⭐ Platinum lead showing positive sentiment - perfect timing for proposal`
    }
    if (hasMarketingInfo) {
      return `📋 Complete contact information available - ready for CRM sync`
    }
    return `🤖 AI analysis complete - lead scored and categorized`
  } catch (error) {
    console.error("Error generating AI notification:", error)
    return `🤖 AI analysis complete`
  }
}

function generateLeadNotification(lead: any, marketingCompleteness: number): string {
  try {
    const score = lead?.score || 0
    const tier = lead?.qualificationData?.leadTier || "BRONZE"

    if (score >= 85 && tier === "PLATINUM") {
      return `🎯 Premium opportunity - schedule immediate call`
    }
    if (marketingCompleteness >= 80) {
      return `✅ Complete profile - ready for CRM sync and follow-up`
    }
    if (marketingCompleteness >= 50) {
      return `📝 Partial profile captured - collect remaining details`
    }
    return `📊 Lead qualified and ready for engagement`
  } catch (error) {
    console.error("Error generating lead notification:", error)
    return `📊 Lead ready for review`
  }
}

function generateNextActions(lead: any, marketingCompleteness: number): string[] {
  try {
    const actions = []
    const score = lead?.score || 0
    const tier = lead?.qualificationData?.leadTier || "BRONZE"

    if (marketingCompleteness < 50) {
      actions.push("collect_contact_info")
    }
    if (score >= 80) actions.push("immediate_call")
    if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
    if (lead?.email) actions.push("email_sequence")
    if (marketingCompleteness >= 80) actions.push("sync_to_crm")

    return actions.slice(0, 3)
  } catch (error) {
    console.error("Error generating next actions:", error)
    return ["manual_review"]
  }
}

function generateFollowUpStrategy(lead: any): string {
  try {
    const tier = lead?.qualificationData?.leadTier || "BRONZE"
    const score = lead?.score || 0
    const completeness = calculateMarketingCompleteness(lead)

    if (tier === "PLATINUM" && completeness >= 70) return "immediate_personal_outreach"
    if (tier === "GOLD" && score >= 70) return "priority_nurturing"
    if (completeness >= 80) return "automated_crm_sequence"
    return "standard_nurturing"
  } catch (error) {
    console.error("Error generating follow-up strategy:", error)
    return "manual"
  }
}

function generateBuyerPersona(lead: any): string {
  try {
    const score = lead?.score || 0
    const engagementScore = lead?.qualificationData?.engagementScore || 0

    if (engagementScore >= 70) return "engaged_prospect"
    if (score >= 60) return "qualified_lead"
    return "early_stage_prospect"
  } catch (error) {
    console.error("Error generating buyer persona:", error)
    return "unknown"
  }
}

// Enhanced server action to merge duplicates
async function handleMergeDuplicates(userId: string) {
  "use server"
  try {
    const result = await mergeDuplicateLeads(userId)
    return { success: true, mergedGroups: result.mergedGroups }
  } catch (error) {
    console.error("Error merging duplicates:", error)
    return { success: false, error: "Failed to merge duplicates" }
  }
}

export default async function EnhancedLeadsPage() {
  const user = await onUserInfor()

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount, interactions } = await getPremiumLeadsData(
    user.data.id,
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-center">
                <p className="text-lg font-medium">Loading Enhanced Dashboard...</p>
                <p className="text-sm text-muted-foreground">Preparing your professional lead management interface</p>
              </div>
            </div>
          </div>
        }
      >
        <PremiumLeadsDashboard
          analytics={analytics}
          recentLeads={recentLeads}
          topLeads={topLeads}
          hasDuplicates={hasDuplicates}
          duplicateCount={duplicateCount}
          userId={user.data.id}
          onMergeDuplicates={handleMergeDuplicates}
          interactions={interactions}
        />
      </Suspense>
    </div>
  )
}
