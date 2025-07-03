"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Crown,
  AlertTriangle,
  Merge,
  RefreshCw,
  Brain,
  Sparkles,
  ExternalLink,
  Activity,
  Zap,
  User,
  Plus,
  LineChart,
  Calendar,
} from "lucide-react"
import { RealTimeLeadsTable } from "./real-time-leads-table"
import { useLeadsData } from "@/hooks/use-leads-data"
import { toast } from "sonner"

function getRevenueDisplay(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

function DuplicateAlert({
  hasDuplicates,
  duplicateCount,
  onMergeDuplicates,
}: {
  hasDuplicates: boolean
  duplicateCount: number
  onMergeDuplicates: () => Promise<any>
}) {
  const [isPending, setIsPending] = useState(false)

  if (!hasDuplicates) return null

  const handleMerge = async () => {
    setIsPending(true)
    try {
      const result = await onMergeDuplicates()
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.error || "Failed to merge duplicates")
      }
    } catch (error) {
      toast.error("An error occurred while merging duplicates")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Alert className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-400">Duplicate Leads Detected</AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300">
        Found {duplicateCount} groups of duplicate leads. Merge them to improve your data quality and analytics.
        <Button
          variant="outline"
          size="sm"
          className="ml-2 border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20 bg-transparent"
          onClick={handleMerge}
          disabled={isPending}
        >
          {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
          {isPending ? "Merging..." : "Merge Duplicates"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function AnalyticsCards({ analytics, isLoading }: { analytics: any; isLoading: boolean }) {
  if (isLoading || !analytics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Leads",
      value: analytics.totalLeads || 0,
      subtitle: "AI-powered lead generation",
      icon: Users,
      color: "border-l-blue-500",
    },
    {
      title: "Qualified Leads",
      value: analytics.qualifiedLeads || 0,
      subtitle: `${analytics.conversionRate || 0}% conversion rate`,
      icon: Target,
      color: "border-l-green-500",
    },
    {
      title: "Revenue Pipeline",
      value: getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0),
      subtitle: "Estimated total value",
      icon: DollarSign,
      color: "border-l-purple-500",
    },
    {
      title: "Expected Revenue",
      value: getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0),
      subtitle: `${Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week`,
      icon: TrendingUp,
      color: "border-l-yellow-500",
    },
    {
      title: "Avg ROI",
      value: `${analytics.revenueMetrics?.averageROI || 0}%`,
      subtitle: "Return on investment",
      icon: BarChart3,
      color: "border-l-orange-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <Card key={index} className={`${card.color} border-l-4 hover:shadow-lg transition-all duration-200 group`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {card.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.subtitle}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function RealTimeDashboard() {
  const { analytics, duplicateInfo, isLoading, mergeDuplicates } = useLeadsData()

  const handleExport = (format: string, selectedIds: string[]) => {
    toast.success(`Exporting ${selectedIds.length} leads as ${format.toUpperCase()}`)
  }

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    toast.success(`Performing ${action} on ${selectedIds.length} leads`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div>
              <span>Live Lead Intelligence</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Analytics
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Contact Capture
                </Badge>
              </div>
            </div>
          </h2>
          <p className="text-muted-foreground mt-2">
            Real-time AI-powered lead qualification with comprehensive contact information and revenue intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <LineChart className="mr-2 h-4 w-4" />
            Revenue Report
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Duplicate Alert */}
      <DuplicateAlert
        hasDuplicates={duplicateInfo.hasDuplicates}
        duplicateCount={duplicateInfo.duplicateCount}
        onMergeDuplicates={mergeDuplicates}
      />

      {/* Analytics Cards */}
      <AnalyticsCards analytics={analytics} isLoading={isLoading} />

      {/* Main Content */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Lead Pipeline
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Revenue Insights
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <RealTimeLeadsTable onExport={handleExport} onBulkAction={handleBulkAction} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="text-center py-12">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">AI Analysis Dashboard</h3>
            <p className="text-muted-foreground">Advanced AI insights and analysis tools coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Revenue Insights</h3>
            <p className="text-muted-foreground">Comprehensive revenue analytics and forecasting tools</p>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="text-center py-12">
            <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">CRM Integrations</h3>
            <p className="text-muted-foreground">Connect with your favorite CRM platforms</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
