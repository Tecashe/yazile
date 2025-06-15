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


import { Suspense } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics ,mergeDuplicateLeads} from "@/lib/lead-qualification"
import { PremiumLeadsDashboard } from "../_components/leads/leads"

// Enhanced server action to get premium leads data
async function getPremiumLeadsData(userId: string) {
  try {
    const [analytics, recentLeads, topLeads, duplicateCount] = await Promise.all([
      getPremiumLeadAnalytics(userId),
      client.lead.findMany({
        where: { userId },
        include: {
          qualificationData: true,
          interactions: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
        },
        orderBy: { lastContactDate: "desc" },
        take: 20,
      }),
      client.lead.findMany({
        where: { userId },
        include: {
          qualificationData: true,
        },
        orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
        take: 10,
      }),
      // Check for potential duplicates
      client.lead.groupBy({
        by: ["instagramUserId", "pageId"],
        where: { userId },
        having: {
          id: { _count: { gt: 1 } },
        },
        _count: { id: true },
      }),
    ])

    return {
      analytics,
      recentLeads,
      topLeads,
      hasDuplicates: duplicateCount.length > 0,
      duplicateCount: duplicateCount.length,
    }
  } catch (error) {
    console.error("Error fetching premium leads data:", error)
    return {
      analytics: null,
      recentLeads: [],
      topLeads: [],
      hasDuplicates: false,
      duplicateCount: 0,
    }
  }
}

// Server action to merge duplicates
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

export default async function PremiumLeadsPage() {
  const user = await onUserInfor()
  const userId = user.data?.id

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount } = await getPremiumLeadsData(user.data.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<div>Loading premium analytics...</div>}>
        <PremiumLeadsDashboard
          analytics={analytics}
          recentLeads={recentLeads}
          topLeads={topLeads}
          hasDuplicates={hasDuplicates}
          duplicateCount={duplicateCount}
          userId={userId || ""}
        />
      </Suspense>
    </div>
  )
}
