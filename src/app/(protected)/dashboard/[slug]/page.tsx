// Add this line at the top of your file
export const dynamic = 'force-dynamic'

// Rest of your page component
import { Suspense } from "react"
import  InstagramDashboard  from "./_components/insta/profile"
import { getDashboardData } from "@/actions/dashboard"
import { getDashboardDati } from "@/actions/dashboard/dashboard"
import { onCurrentUser } from "@/actions/user"
import { Card, CardContent } from "@/components/ui/card"
import { AutomationList } from "./_components/newdash/automation-list"
import { RecentConversations } from "./_components/newdash/recent-dms"
import ContentSuggestions from "./_components/dash/ContentSuggestions"
import { BarDuoToneBlue } from "@/icons"
import DoubleGradientCard from "@/components/global/double-gradient-card"
import { DASHBOARD_CARDS } from "@/constants/dashboard"
import EnhancedMetricsCard from "./_components/dash/EnhancedMetricsCard"
import SentimentAnalysis from "./_components/dash/SentimentAnalysis"
import EngagementPredictor from "./_components/dash/EngagementPredictor"
import AIPerformance from "./_components/dash/AIPerformance"
import EngagementInsights from "./_components/dash/EngagementInsights"
import HashtagCloud from "./_components/dash/HashtagCloud"



import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Import business dashboard components
import { BusinessOverview } from "./_components/dashboard/business-overview"
import { MyCampaigns } from "./_components/dashboard/my-campaigns"
import { MyAutomations } from "./_components/dashboard/my-automations"
import { MyLeads } from "./_components/dashboard/my-leads"
import { MyInfluencers } from "./_components/dashboard/my-influencers"
import { MyAnalytics } from "./_components/dashboard/my-analytics"
import { MyOpportunities } from "./_components/dashboard/my-opportunities"
import { RecentActivity } from "./_components/dashboard/recent-activity"

import type { Automation, Conversation } from "@/types/dashboard"

export default async function DashboardPage() {
  const user = await onCurrentUser()
  const dashboardData = await getDashboardData()

  return (
    <div className="flex flex-col gap-y-10">

      <div className="flex gap-5 lg:flex-row flex-col">
        {DASHBOARD_CARDS.map((card) => (
          <DoubleGradientCard key={card.id} {...card} />
        ))}
      </div>
       

      <div className="flex gap-5 lg:flex-row flex-col">
        <EngagementInsights />
      </div>
      

      <div className="border-[1px] relative border-in-active/50 p-5 rounded-xl">
        <span className="flex gap-x-1 z-50 items-center mb-5">
          <BarDuoToneBlue />
          <div className="z-0">
            <h2 className="text-2xl font-medium text-white">Engagement Analytics</h2>
            <p className="text-text-secondary text-sm">Monitor Your Engagement in Real Time</p>
          </div>
        </span>
        <div className="w-full flex lg:flex-row flex-col gap-5">
          <div className="lg:w-6/12">
            <InstagramDashboard />
          </div>
          <div className="lg:w-6/12">
            <EnhancedMetricsCard />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<Card className="w-full h-[300px] animate-pulse" />}>
            {dashboardData.data ? (
              <AutomationList automations={dashboardData.data.automations as Automation[]} />
            ) : (
              <Card className="w-full h-[300px]">
                <CardContent className="flex items-center justify-center h-full">
                  <p>Failed to load automations</p>
                </CardContent>
              </Card>
            )}
          </Suspense>
          <EngagementPredictor />
        </div>
        <div className="grid grid-cols-1 gap-6">
        {/* <SentimentAnalysis /> */}
        <HashtagCloud />
      </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentSuggestions />
        <AIPerformance />
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="influencers">My Influencers</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<OverviewSkeleton />}>
            <BusinessOverview />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest business activities</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<ActivitySkeleton />}>
                  <RecentActivity />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<QuickStatsSkeleton />}>
                  <MyAnalytics />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Suspense fallback={<CampaignsSkeleton />}>
            <MyCampaigns />
          </Suspense>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-4">
          <Suspense fallback={<InfluencersSkeleton />}>
            <MyInfluencers />
          </Suspense>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Suspense fallback={<OpportunitiesSkeleton />}>
            <MyOpportunities />
          </Suspense>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Suspense fallback={<AutomationsSkeleton />}>
            <MyAutomations />
          </Suspense>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <Suspense fallback={<LeadsSkeleton />}>
            <MyLeads />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <MyAnalytics />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
      
    </div>

    



  )
}





// Skeleton components for loading states
function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function QuickStatsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
          <Skeleton className="h-6 w-[60px]" />
        </div>
      ))}
    </div>
  )
}

function CampaignsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InfluencersSkeleton() {
  return <CampaignsSkeleton />
}

function OpportunitiesSkeleton() {
  return <CampaignsSkeleton />
}

function AutomationsSkeleton() {
  return <CampaignsSkeleton />
}

function LeadsSkeleton() {
  return <CampaignsSkeleton />
}

function AnalyticsSkeleton() {
  return <CampaignsSkeleton />
}























// import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Skeleton } from "@/components/ui/skeleton"

// // Import business dashboard components
// import { BusinessOverview } from "./_components/dashboard/business-overview"
// import { MyCampaigns } from "./_components/dashboard/my-campaigns"
// import { MyAutomations } from "./_components/dashboard/my-automations"
// import { MyLeads } from "./_components/dashboard/my-leads"
// import { MyInfluencers } from "./_components/dashboard/my-influencers"
// import { MyAnalytics } from "./_components/dashboard/my-analytics"
// import { MyOpportunities } from "./_components/dashboard/my-opportunities"
// import { RecentActivity } from "./_components/dashboard/recent-activity"

// export default function BusinessDashboardPage() {
//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
//           <TabsTrigger value="influencers">My Influencers</TabsTrigger>
//           <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
//           <TabsTrigger value="automations">Automations</TabsTrigger>
//           <TabsTrigger value="leads">Leads</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <Suspense fallback={<OverviewSkeleton />}>
//             <BusinessOverview />
//           </Suspense>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <Card className="col-span-4">
//               <CardHeader>
//                 <CardTitle>Recent Activity</CardTitle>
//                 <CardDescription>Your latest business activities</CardDescription>
//               </CardHeader>
//               <CardContent className="pl-2">
//                 <Suspense fallback={<ActivitySkeleton />}>
//                   <RecentActivity />
//                 </Suspense>
//               </CardContent>
//             </Card>

//             <Card className="col-span-3">
//               <CardHeader>
//                 <CardTitle>Quick Stats</CardTitle>
//                 <CardDescription>Key performance indicators</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Suspense fallback={<QuickStatsSkeleton />}>
//                   <MyAnalytics />
//                 </Suspense>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="campaigns" className="space-y-4">
//           <Suspense fallback={<CampaignsSkeleton />}>
//             <MyCampaigns />
//           </Suspense>
//         </TabsContent>

//         <TabsContent value="influencers" className="space-y-4">
//           <Suspense fallback={<InfluencersSkeleton />}>
//             <MyInfluencers />
//           </Suspense>
//         </TabsContent>

//         <TabsContent value="opportunities" className="space-y-4">
//           <Suspense fallback={<OpportunitiesSkeleton />}>
//             <MyOpportunities />
//           </Suspense>
//         </TabsContent>

//         <TabsContent value="automations" className="space-y-4">
//           <Suspense fallback={<AutomationsSkeleton />}>
//             <MyAutomations />
//           </Suspense>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-4">
//           <Suspense fallback={<LeadsSkeleton />}>
//             <MyLeads />
//           </Suspense>
//         </TabsContent>

//         <TabsContent value="analytics" className="space-y-4">
//           <Suspense fallback={<AnalyticsSkeleton />}>
//             <MyAnalytics />
//           </Suspense>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// // Skeleton components for loading states
// function OverviewSkeleton() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <Card key={i}>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <Skeleton className="h-4 w-[100px]" />
//             <Skeleton className="h-4 w-4" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-8 w-[60px] mb-2" />
//             <Skeleton className="h-3 w-[120px]" />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

// function ActivitySkeleton() {
//   return (
//     <div className="space-y-4">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <div key={i} className="flex items-center space-x-4">
//           <Skeleton className="h-12 w-12 rounded-full" />
//           <div className="space-y-2">
//             <Skeleton className="h-4 w-[200px]" />
//             <Skeleton className="h-3 w-[100px]" />
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// function QuickStatsSkeleton() {
//   return (
//     <div className="space-y-4">
//       {Array.from({ length: 3 }).map((_, i) => (
//         <div key={i} className="flex items-center justify-between">
//           <div className="space-y-1">
//             <Skeleton className="h-4 w-[120px]" />
//             <Skeleton className="h-3 w-[80px]" />
//           </div>
//           <Skeleton className="h-6 w-[60px]" />
//         </div>
//       ))}
//     </div>
//   )
// }

// function CampaignsSkeleton() {
//   return (
//     <div className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <Card key={i}>
//             <CardHeader>
//               <Skeleton className="h-4 w-[150px]" />
//               <Skeleton className="h-3 w-[100px]" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-20 w-full" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

// function InfluencersSkeleton() {
//   return <CampaignsSkeleton />
// }

// function OpportunitiesSkeleton() {
//   return <CampaignsSkeleton />
// }

// function AutomationsSkeleton() {
//   return <CampaignsSkeleton />
// }

// function LeadsSkeleton() {
//   return <CampaignsSkeleton />
// }

// function AnalyticsSkeleton() {
//   return <CampaignsSkeleton />
// }
