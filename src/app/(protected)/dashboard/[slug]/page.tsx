
export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import  InstagramDashboard  from "./_components/insta/profile"
import { getDashboardData } from "@/actions/dashboard"
import { onCurrentUser } from "@/actions/user"
import { Card, CardContent } from "@/components/ui/card"
import { AutomationList } from "./_components/newdash/automation-list"
import { BarDuoToneBlue } from "@/icons"
import EnhancedMetricsCard from "./_components/dash/EnhancedMetricsCard"
import EngagementInsights from "./_components/dash/EngagementInsights"
import HashtagCloud from "./_components/dash/HashtagCloud"
import { EnhancedDashboardCards } from "@/components/global/dashboard/dashboard-cards"


import type { Automation } from "@/types/dashboard"

export default async function DashboardPage() {
  const user = await onCurrentUser()
  const dashboardData = await getDashboardData()

  return (
    <div className="flex flex-col gap-y-10">
       <div className="grid grid-cols-1 gap-6">      
        <EnhancedDashboardCards />       
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
        
        </div>
        <div className="grid grid-cols-1 gap-6">      
        <HashtagCloud />
       
      </div>
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentSuggestions />
        <AIPerformance />
      </div>       */}
    </div>
  )
}

