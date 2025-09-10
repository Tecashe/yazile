
// export const dynamic = 'force-dynamic'

// import { Suspense } from "react"
// import  InstagramDashboard  from "./_components/insta/profile"
// import { getDashboardData } from "@/actions/dashboard"
// import { onCurrentUser } from "@/actions/user"
// import { Card, CardContent } from "@/components/ui/card"
// import { AutomationList } from "./_components/newdash/automation-list"
// import { BarDuoToneBlue } from "@/icons"
// import EnhancedMetricsCard from "./_components/dash/EnhancedMetricsCard"
// import EngagementInsights from "./_components/dash/EngagementInsights"
// import { EnhancedDashboardCards } from "@/components/global/dashboard/dashboard-cards"


// import type { Automation } from "@/types/dashboard"

// export default async function DashboardPage() {
//   const user = await onCurrentUser()
//   const dashboardData = await getDashboardData()

//   return (
//     <div className="flex flex-col gap-y-10">
//        <div className="grid grid-cols-1 gap-6">      
//         <EnhancedDashboardCards />       
//       </div>       

//       <div className="flex gap-5 lg:flex-row flex-col">
//         <EngagementInsights />
//       </div>
      

//       <div className="border-[1px] relative border-in-active/50 p-5 rounded-xl">
//         <span className="flex gap-x-1 z-50 items-center mb-5">
//           <BarDuoToneBlue />
//           <div className="z-0">
//             <h2 className="text-2xl font-medium text-white">Engagement Analytics</h2>
//             <p className="text-text-secondary text-sm">Monitor Your Engagement in Real Time</p>
//           </div>
//         </span>
//         <div className="w-full flex lg:flex-row flex-col gap-5">
//           <div className="lg:w-6/12">
//             <InstagramDashboard />
//           </div>
//           <div className="lg:w-6/12">
//             <EnhancedMetricsCard />
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto p-6 space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Suspense fallback={<Card className="w-full h-[300px] animate-pulse" />}>
//             {dashboardData.data ? (
//               <AutomationList automations={dashboardData.data.automations as Automation[]} />
//             ) : (
//               <Card className="w-full h-[300px]">
//                 <CardContent className="flex items-center justify-center h-full">
//                   <p>Failed to load automations</p>
//                 </CardContent>
//               </Card>
//             )}
//           </Suspense>
        
//         </div>
//       </div>
//     </div>
//   )
// }

export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import { DashboardHeader } from "./_components/dashboard/dashboard-header"
import { MetricsOverview } from "./_components/dashboard/metrics-overview"
import { RevenueAnalytics } from "./_components/dashboard/revenue-analytics"
import { LeadManagement } from "./_components/dashboard/lead-management"
import { AutomationPerformance } from "./_components/dashboard/automation-performance"
import { SentimentAnalysis } from "./_components/dashboard/sentiment-analysis"
import { RealtimeActivity } from "./_components/dashboard/realtime-activity"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-background dark">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader />

        <Suspense fallback={<MetricsSkeleton />}>
          <MetricsOverview />
        </Suspense>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueAnalytics />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
              <AutomationPerformance />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<ActivitySkeleton />}>
              <RealtimeActivity />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
              <SentimentAnalysis />
            </Suspense>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<TableSkeleton />}>
            <LeadManagement />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  )
}

function ActivitySkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}



