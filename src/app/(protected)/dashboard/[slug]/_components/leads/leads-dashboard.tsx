"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Crown, Database, RefreshCw, Users, Activity, Zap, AlertTriangle } from "lucide-react"
import {
  generateMockAnalytics,
  generateMockLeads,
  generateMockInteractions,
  generateMockRevenueData,
} from "./mock-data-generator"
import { ProfessionalLeadsDashboard } from "./professional-leads-dashboard"
import { RevenueChart } from "./revenue-chart"

interface LeadsDashboardProps {
  initialData: {
    analytics: any
    recentLeads: any[]
    topLeads: any[]
    hasDuplicates: boolean
    duplicateCount: number
    interactions: any[]
  }
  userId: string
  onMergeDuplicates: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
}

export function LeadsDashboard({ initialData, userId, onMergeDuplicates }: LeadsDashboardProps) {
  const [useMockData, setUseMockData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mockData, setMockData] = useState({
    analytics: generateMockAnalytics(),
    recentLeads: generateMockLeads(25),
    topLeads: generateMockLeads(15),
    interactions: generateMockInteractions(20),
    revenueData: generateMockRevenueData(),
  })

  const refreshMockData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setMockData({
        analytics: generateMockAnalytics(),
        recentLeads: generateMockLeads(25),
        topLeads: generateMockLeads(15),
        interactions: generateMockInteractions(20),
        revenueData: generateMockRevenueData(),
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleMockDataToggle = (enabled: boolean) => {
    setUseMockData(enabled)
    if (enabled) {
      refreshMockData()
    }
  }

  const mockHandleMergeDuplicates = async (userId: string) => {
    return { success: true, mergedGroups: Math.floor(Math.random() * 5) + 1 }
  }

  // Use mock data when enabled, otherwise use real data
  const displayData = useMockData
    ? {
        analytics: mockData.analytics,
        recentLeads: mockData.recentLeads,
        topLeads: mockData.topLeads,
        hasDuplicates: Math.random() > 0.7,
        duplicateCount: Math.floor(Math.random() * 5) + 1,
        interactions: mockData.interactions,
      }
    : initialData

  const hasRealData = initialData.analytics.totalLeads > 0 || initialData.recentLeads.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  Premium AI Revenue Intelligence
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    Real-time Analytics
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Contact Capture
                  </Badge>
                  {useMockData && (
                    <Badge variant="destructive" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="mock-data" checked={useMockData} onCheckedChange={handleMockDataToggle} />
                    <Label htmlFor="mock-data" className="text-sm font-medium">
                      Demo Mode
                    </Label>
                  </div>
                  {useMockData && (
                    <>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="outline" size="sm" onClick={refreshMockData} disabled={isLoading}>
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Refresh
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <p className="text-muted-foreground mt-3 max-w-2xl">
            Advanced AI-powered lead qualification with revenue prediction and contact information capture.
            {useMockData
              ? " Currently showing demo data - toggle off to connect real data sources."
              : hasRealData
                ? " Displaying live data from your connected sources."
                : " Connect your data sources to see real analytics."}
          </p>
        </div>
      </div>

      {/* Alerts */}
      <div className="container mx-auto px-4 py-4 space-y-4">
        {useMockData && (
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              <strong>Demo Mode Active:</strong> Displaying mock data for demonstration. Switch off demo mode to view
              live data when your account starts processing leads.
            </AlertDescription>
          </Alert>
        )}

        {!useMockData && !hasRealData && (
          <Alert className="border-blue-500/30 bg-blue-500/10">
            <Database className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-200">
              <strong>No Data Available:</strong> Connect your Instagram or other lead sources to start seeing
              analytics. Enable demo mode to explore the interface with sample data.
            </AlertDescription>
          </Alert>
        )}

        {displayData.hasDuplicates && !useMockData && (
          <Alert className="border-orange-500/30 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              Found {displayData.duplicateCount} potential duplicate leads.
              <Button
                variant="link"
                className="p-0 h-auto text-orange-300 underline ml-1"
                onClick={() => onMergeDuplicates(userId)}
              >
                Merge duplicates
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Revenue Chart - only show when there's data or in mock mode */}
        {(useMockData || hasRealData) && useMockData && (
          <div className="mb-8">
            <RevenueChart data={mockData.revenueData} />
          </div>
        )}

        {/* Professional Dashboard */}
        <ProfessionalLeadsDashboard
          analytics={displayData.analytics}
          recentLeads={displayData.recentLeads}
          topLeads={displayData.topLeads}
          hasDuplicates={displayData.hasDuplicates}
          duplicateCount={displayData.duplicateCount}
          userId={userId}
          onMergeDuplicates={useMockData ? mockHandleMergeDuplicates : onMergeDuplicates}
          interactions={displayData.interactions}
        />
      </div>
    </div>
  )
}
