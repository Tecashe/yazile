
"use client"

import { useState, useEffect, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardShell } from "@/components/global/influencer-relation/dashboard/updat/dashboard-shell"
import { DashboardHeader } from "@/components/global/influencer-relation/dashboard/header"
import { InfluencerOverview } from "@/components/global/influencer-relation/influencer/overview"
import { InfluencerStats } from "@/components/global/influencer-relation/influencer/stats"
import { ContentPerformance } from "@/components/global/influencer-relation/influencer/content-performance"
import { UpcomingCampaigns } from "@/components/global/influencer-relation/influencer/upcoming-campaigns"
import { AudienceInsights } from "@/components/global/influencer-relation/influencer/audience-insights"
import { RevenueAnalytics } from "@/components/global/influencer-relation/influencer/revenue-analytics"
import { GrowthMetrics } from "@/components/global/influencer-relation/influencer/growth-metrics"
import { BrandOpportunity } from "@/components/global/influencer-relation/influencer/available-opportunities"
import { ContentCalendar } from "@/components/global/influencer-relation/influencer/content-calendar"
import { ProfileCompletion } from "@/components/global/influencer-relation/influencer/profile-completion"
import { getInfluencerProfile } from "@/actions/influencer-relations/influencer"
import { User, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { EnhancedTabs } from "@/components/global/influencer-relation/dashboard/updat/enhanced-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InfluencerDashboardPage() {
  const [profileExists, setProfileExists] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkProfile() {
      try {
        const response = await getInfluencerProfile()
        setProfileExists(response.status === 200)
      } catch (error) {
        console.error("Error checking profile:", error)
        setProfileExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkProfile()
  }, [])

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Influencer Dashboard"
          text="Manage your content, campaigns, and analytics in one place."
        />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Skeleton className="h-[200px] w-full" />
        </motion.div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <DashboardHeader
          heading="Influencer Dashboard"
          text="Manage your content, campaigns, and analytics in one place."
        />
      </div>

      {/* Profile Completion Banner - only shows if profile is incomplete */}
      <ProfileCompletion className="mb-6" />

      {/* Only show dashboard content if profile exists */}
      {profileExists && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Enhanced Dashboard Section */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <CardTitle>Enhanced Dashboard</CardTitle>
              </div>
              <CardDescription>Interactive analytics and tools to boost your influencer performance</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <EnhancedTabs />
            </CardContent>
          </Card>

          {/* Standard Dashboard Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-semibold">Detailed Metrics</h2>
              <span className="text-sm text-muted-foreground">Comprehensive analytics and insights</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <InfluencerOverview />
                </motion.div>
              </Suspense>

              <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <InfluencerStats />
                </motion.div>
              </Suspense>

              <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <GrowthMetrics />
                </motion.div>
              </Suspense>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full lg:col-span-2">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ContentPerformance />
                  </motion.div>
                </Suspense>
              </div>

              <div className="md:col-span-2 lg:col-span-1">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <UpcomingCampaigns />
                  </motion.div>
                </Suspense>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <AudienceInsights />
                </motion.div>
              </Suspense>

              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <RevenueAnalytics />
                </motion.div>
              </Suspense>
            </div>

            <div className="mt-4">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <ContentCalendar />
                </motion.div>
              </Suspense>
            </div>

            <div className="mt-4">
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <BrandOpportunity />
                </motion.div>
              </Suspense>
            </div>
          </div>
        </motion.div>
      )}

      {/* Show a full page profile setup prompt if profile doesn't exist */}
      {profileExists === false && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-8 text-center shadow-md"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <User className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-amber-800">Set Up Your Influencer Profile</h2>
          <p className="mx-auto mb-6 max-w-md text-amber-700">
            Complete your profile to unlock all features of the influencer dashboard, get discovered by brands, and
            receive personalized campaign opportunities.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/onboarding")}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-colors hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Start Onboarding Process
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/settings/profile")}
              className="inline-flex items-center justify-center rounded-md border border-amber-600 bg-transparent px-6 py-3 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Go to Profile Settings
            </motion.button>
          </div>
        </motion.div>
      )}
    </DashboardShell>
  )
}
