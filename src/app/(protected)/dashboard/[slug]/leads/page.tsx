import { Suspense } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getLeadAnalytics } from "@/lib/lead-qualification"
import { LeadsDashboard } from "../_components/leads/leads"

// Server action to get leads data
async function getLeadsData(userId: string) {
  try {
    const [analytics, recentLeads, topLeads] = await Promise.all([
      getLeadAnalytics(userId),
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
        take: 10,
      }),
      client.lead.findMany({
        where: { userId },
        include: {
          qualificationData: true,
        },
        orderBy: { score: "desc" },
        take: 5,
      }),
    ])

    return { analytics, recentLeads, topLeads }
  } catch (error) {
    console.error("Error fetching leads data:", error)
    return { analytics: null, recentLeads: [], topLeads: [] }
  }
}

export default async function LeadsPage() {
  const user = await onUserInfor()

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const { analytics, recentLeads, topLeads } = await getLeadsData(user.data.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<div>Loading...</div>}>
        <LeadsDashboard 
          analytics={analytics}
          recentLeads={recentLeads}
          topLeads={topLeads}
        />
      </Suspense>
    </div>
  )
}