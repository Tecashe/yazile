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
//           premiumInsights: {
//             highValueLeads: 0,
//             averageLeadValue: 0,
//             conversionProbability: 0,
//             totalPipelineValue: 0,
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
//               take: 5,
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
//             score: { gte: 30 }, // Lower threshold to get more leads
//           },
//           include: {
//             qualificationData: true,
//             interactions: {
//               take: 3,
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

//     // Process recent leads with enhanced display names and safe metadata access
//     const processedRecentLeads = recentLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         const marketingCompleteness = calculateMarketingCompleteness(lead)

//         // Create a proper display name
//         const instagramUserId = lead?.instagramUserId || "unknown"
//         let displayName = lead?.name

//         if (!displayName) {
//           // If no name, create a friendly display name from Instagram handle
//           if (instagramUserId && instagramUserId !== "unknown") {
//             displayName = `@${instagramUserId}`
//           } else {
//             displayName = "Unknown User"
//           }
//         }

//         return {
//           ...lead,
//           name: displayName, // Override with proper display name
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

//     // Process top leads similarly
//     const processedTopLeads = topLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         const instagramUserId = lead?.instagramUserId || "unknown"
//         let displayName = lead?.name

//         if (!displayName) {
//           if (instagramUserId && instagramUserId !== "unknown") {
//             displayName = `@${instagramUserId}`
//           } else {
//             displayName = "Unknown User"
//           }
//         }

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

//     // Process interactions with safe metadata access
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
//       interactions: [],
//     }
//   }
// }

// // Helper functions for AI-generated insights with safe null checking
// function generateAINotification(interaction: any): string {
//   try {
//     if (!interaction) return "🤖 AI analysis complete"

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
//     return `🤖 AI analysis complete - lead scored and categorized`
//   } catch (error) {
//     console.error("Error generating AI notification:", error)
//     return `🤖 AI analysis complete`
//   }
// }

// function generateLeadNotification(lead: any, marketingCompleteness: number): string {
//   try {
//     if (!lead) return "📊 Lead ready for review"

//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"

//     if (score >= 85 && tier === "PLATINUM") {
//       return `🎯 Premium opportunity - schedule immediate call`
//     }
//     if (marketingCompleteness >= 80) {
//       return `✅ Complete profile - ready for CRM sync and follow-up`
//     }
//     if (marketingCompleteness >= 50) {
//       return `📝 Partial profile captured - collect remaining details`
//     }
//     return `📊 Lead qualified and ready for engagement`
//   } catch (error) {
//     console.error("Error generating lead notification:", error)
//     return `📊 Lead ready for review`
//   }
// }

// function generateNextActions(lead: any, marketingCompleteness: number): string[] {
//   try {
//     if (!lead) return ["manual_review"]

//     const actions = []
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"

//     if (marketingCompleteness < 50) {
//       actions.push("collect_contact_info")
//     }
//     if (score >= 80) actions.push("immediate_call")
//     if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
//     if (lead?.email) actions.push("email_sequence")
//     if (marketingCompleteness >= 80) actions.push("sync_to_crm")

//     return actions.slice(0, 3)
//   } catch (error) {
//     console.error("Error generating next actions:", error)
//     return ["manual_review"]
//   }
// }

// function generateFollowUpStrategy(lead: any): string {
//   try {
//     if (!lead) return "manual"

//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const score = lead?.score || 0
//     const completeness = calculateMarketingCompleteness(lead)

//     if (tier === "PLATINUM" && completeness >= 70) return "immediate_personal_outreach"
//     if (tier === "GOLD" && score >= 70) return "priority_nurturing"
//     if (completeness >= 80) return "automated_crm_sequence"
//     return "standard_nurturing"
//   } catch (error) {
//     console.error("Error generating follow-up strategy:", error)
//     return "manual"
//   }
// }

// function generateBuyerPersona(lead: any): string {
//   try {
//     if (!lead) return "unknown"

//     const score = lead?.score || 0
//     const engagementScore = lead?.qualificationData?.engagementScore || 0

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

// export default async function EnhancedLeadsPage() {
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
//                 <p className="text-lg font-medium">Loading Enhanced Dashboard...</p>
//                 <p className="text-sm text-muted-foreground">Preparing your professional lead management interface</p>
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
// import { ProfessionalLeadsDashboard } from "../_components/leads/professional-leads-dashboard"

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
//           premiumInsights: {
//             highValueLeads: 0,
//             averageLeadValue: 0,
//             conversionProbability: 0,
//             totalPipelineValue: 0,
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
//               take: 5,
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
//             score: { gte: 30 }, // Lower threshold to get more leads
//           },
//           include: {
//             qualificationData: true,
//             interactions: {
//               take: 3,
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

//     // Process recent leads with enhanced display names and safe metadata access
//     const processedRecentLeads = recentLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         const marketingCompleteness = calculateMarketingCompleteness(lead)

//         // Create a proper display name
//         const instagramUserId = lead?.instagramUserId || "unknown"
//         let displayName = lead?.name

//         if (!displayName) {
//           // If no name, create a friendly display name from Instagram handle
//           if (instagramUserId && instagramUserId !== "unknown") {
//             displayName = `@${instagramUserId}`
//           } else {
//             displayName = "Unknown User"
//           }
//         }

//         return {
//           ...lead,
//           name: displayName, // Override with proper display name
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

//     // Process top leads similarly
//     const processedTopLeads = topLeads.map((lead) => {
//       try {
//         const qualData = lead?.qualificationData
//         const instagramUserId = lead?.instagramUserId || "unknown"
//         let displayName = lead?.name

//         if (!displayName) {
//           if (instagramUserId && instagramUserId !== "unknown") {
//             displayName = `@${instagramUserId}`
//           } else {
//             displayName = "Unknown User"
//           }
//         }

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

//     // Process interactions with safe metadata access
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
//       interactions: [],
//     }
//   }
// }

// // Helper functions for AI-generated insights with safe null checking
// function generateAINotification(interaction: any): string {
//   try {
//     if (!interaction) return "🤖 AI analysis complete"

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
//     return `🤖 AI analysis complete - lead scored and categorized`
//   } catch (error) {
//     console.error("Error generating AI notification:", error)
//     return `🤖 AI analysis complete`
//   }
// }

// function generateLeadNotification(lead: any, marketingCompleteness: number): string {
//   try {
//     if (!lead) return "📊 Lead ready for review"

//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"

//     if (score >= 85 && tier === "PLATINUM") {
//       return `🎯 Premium opportunity - schedule immediate call`
//     }
//     if (marketingCompleteness >= 80) {
//       return `✅ Complete profile - ready for CRM sync and follow-up`
//     }
//     if (marketingCompleteness >= 50) {
//       return `📝 Partial profile captured - collect remaining details`
//     }
//     return `📊 Lead qualified and ready for engagement`
//   } catch (error) {
//     console.error("Error generating lead notification:", error)
//     return `📊 Lead ready for review`
//   }
// }

// function generateNextActions(lead: any, marketingCompleteness: number): string[] {
//   try {
//     if (!lead) return ["manual_review"]

//     const actions = []
//     const score = lead?.score || 0
//     const tier = lead?.qualificationData?.leadTier || "BRONZE"

//     if (marketingCompleteness < 50) {
//       actions.push("collect_contact_info")
//     }
//     if (score >= 80) actions.push("immediate_call")
//     if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
//     if (lead?.email) actions.push("email_sequence")
//     if (marketingCompleteness >= 80) actions.push("sync_to_crm")

//     return actions.slice(0, 3)
//   } catch (error) {
//     console.error("Error generating next actions:", error)
//     return ["manual_review"]
//   }
// }

// function generateFollowUpStrategy(lead: any): string {
//   try {
//     if (!lead) return "manual"

//     const tier = lead?.qualificationData?.leadTier || "BRONZE"
//     const score = lead?.score || 0
//     const completeness = calculateMarketingCompleteness(lead)

//     if (tier === "PLATINUM" && completeness >= 70) return "immediate_personal_outreach"
//     if (tier === "GOLD" && score >= 70) return "priority_nurturing"
//     if (completeness >= 80) return "automated_crm_sequence"
//     return "standard_nurturing"
//   } catch (error) {
//     console.error("Error generating follow-up strategy:", error)
//     return "manual"
//   }
// }

// function generateBuyerPersona(lead: any): string {
//   try {
//     if (!lead) return "unknown"

//     const score = lead?.score || 0
//     const engagementScore = lead?.qualificationData?.engagementScore || 0

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

// export default async function EnhancedLeadsPage() {
//   const user = await onUserInfor()

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount, interactions } = await getPremiumLeadsData(
//     user.data.id,
//   )

//   return (
//     <div className="min-h-screen">
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//               <div className="text-center">
//                 <p className="text-lg font-medium">Loading Professional Dashboard...</p>
//                 <p className="text-sm text-muted-foreground">Preparing your revenue intelligence interface</p>
//               </div>
//             </div>
//           </div>
//         }
//       >
//         <ProfessionalLeadsDashboard
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
import { ProfessionalLeadsDashboard } from "../_components/leads/professional-leads-dashboard"

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
          premiumInsights: {
            highValueLeads: 0,
            averageLeadValue: 0,
            conversionProbability: 0,
            totalPipelineValue: 0,
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

    // Process recent leads with enhanced display names and safe metadata access
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

    // Process interactions with safe metadata access
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
        premiumInsights: {
          highValueLeads: 0,
          averageLeadValue: 0,
          conversionProbability: 0,
          totalPipelineValue: 0,
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

// Helper functions for AI-generated insights with safe null checking
function generateAINotification(interaction: any): string {
  try {
    if (!interaction) return "AI analysis complete"

    const intent = interaction?.intent
    const sentiment = interaction?.sentiment
    const tier = interaction?.lead?.qualificationData?.leadTier
    const hasMarketingInfo = !!(interaction?.lead?.name || interaction?.lead?.email || interaction?.lead?.phone)

    if (intent && typeof intent === "object" && "purchase_intent" in intent && intent.purchase_intent > 0.7) {
      return `High purchase intent detected - immediate follow-up recommended`
    }
    if (sentiment && sentiment > 0.5 && tier === "PLATINUM") {
      return `Platinum lead showing positive sentiment - perfect timing for proposal`
    }
    if (hasMarketingInfo) {
      return `Complete contact information available - ready for CRM sync`
    }
    return `AI analysis complete - lead scored and categorized`
  } catch (error) {
    console.error("Error generating AI notification:", error)
    return `AI analysis complete`
  }
}

function generateLeadNotification(lead: any, marketingCompleteness: number): string {
  try {
    if (!lead) return "Lead ready for review"

    const score = lead?.score || 0
    const tier = lead?.qualificationData?.leadTier || "BRONZE"

    if (score >= 85 && tier === "PLATINUM") {
      return `Premium opportunity - schedule immediate call`
    }
    if (marketingCompleteness >= 80) {
      return `Complete profile - ready for CRM sync and follow-up`
    }
    if (marketingCompleteness >= 50) {
      return `Partial profile captured - collect remaining details`
    }
    return `Lead qualified and ready for engagement`
  } catch (error) {
    console.error("Error generating lead notification:", error)
    return `Lead ready for review`
  }
}

function generateNextActions(lead: any, marketingCompleteness: number): string[] {
  try {
    if (!lead) return ["manual_review"]

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
    if (!lead) return "manual"

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
    if (!lead) return "unknown"

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

// Enhanced loading component
function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8 p-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-card border rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-card border rounded-lg animate-pulse" />
          <div className="h-96 bg-card border rounded-lg animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 h-96 bg-card border rounded-lg animate-pulse" />
          <div className="h-96 bg-card border rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
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
    <div className="min-h-screen bg-background">
      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <ProfessionalLeadsDashboard
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
