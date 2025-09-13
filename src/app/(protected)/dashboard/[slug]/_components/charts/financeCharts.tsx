"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Funnel, FunnelChart, LabelList } from "recharts"
import { TrendingUp, Users, Target, Activity, Zap } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Import your server actions
import { 
  getLeadAnalytics, 
  getTimeBasedAnalytics, 
  getPlatformPerformance,
  getLeadFunnelAnalytics,
  getLeadSourceAnalytics,
  getAutomationPerformance
} from "@/actions/dashboard/d-actions"

// Type definitions
interface DailyLeadData {
  total: number;
  qualified: number;
  converted: number;
  date: string;
}

interface PlatformData {
  platform: string;
  totalLeads: number;
}

interface LeadSourceData {
  source: string;
  totalLeads: number;
  conversions: number;
  conversionRate: number;
  value: number;
}

interface WeeklyData {
  week: string;
  newLeads: number;
  conversions: number;
}

interface AutomationData {
  id: string;
  name: string;
  active: boolean;
  platform: string; // Using string instead of INTEGRATIONS enum for simplicity
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  postsCount: number;
  dmsCount: number;
  createdAt: Date;
}

// Chart configurations
const leadAnalyticsConfig = {
  total: {
    label: "New Leads",
    color: "hsl(var(--chart-1))",
  },
  qualified: {
    label: "Qualified",
    color: "hsl(var(--chart-2))",
  },
  converted: {
    label: "Converted",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const platformConfig = {
  instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-1))",
  },
  facebook: {
    label: "Facebook", 
    color: "hsl(var(--chart-2))",
  },
  linkedin: {
    label: "LinkedIn",
    color: "hsl(var(--chart-3))",
  },
  twitter: {
    label: "Twitter",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const sourceConfig = {
  organic: {
    label: "Organic",
    color: "hsl(var(--chart-1))",
  },
  paid: {
    label: "Paid Ads",
    color: "hsl(var(--chart-2))",
  },
  referral: {
    label: "Referral",
    color: "hsl(var(--chart-3))",
  },
  direct: {
    label: "Direct",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

// Lead Analytics Time Series Chart
function LeadAnalyticsChart() {
  const [data, setData] = React.useState<DailyLeadData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLeadAnalytics()
        setData(result.dailyLeads)
      } catch (error) {
        console.error("Error fetching lead analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card><CardContent className="p-6">Loading...</CardContent></Card>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Generation Trends</CardTitle>
        <CardDescription>Daily lead creation over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={leadAnalyticsConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              fillOpacity={0.4}
              stroke="var(--color-total)"
              stackId="a"
            />
            <Area
              dataKey="qualified"
              type="natural"
              fill="var(--color-qualified)"
              fillOpacity={0.4}
              stroke="var(--color-qualified)"
              stackId="a"
            />
            <Area
              dataKey="converted"
              type="natural"
              fill="var(--color-converted)"
              fillOpacity={0.4}
              stroke="var(--color-converted)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Lead generation performance <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing daily lead metrics
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

// Platform Performance Bar Chart
function PlatformPerformanceChart() {
  const [data, setData] = React.useState<PlatformData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPlatformPerformance()
        setData(result)
      } catch (error) {
        console.error("Error fetching platform performance:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card><CardContent className="p-6">Loading...</CardContent></Card>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Lead generation by platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={platformConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="platform"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalLeads" fill="var(--color-instagram)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Platform comparison <Activity className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total leads generated per platform
        </div>
      </CardFooter>
    </Card>
  )
}

// Lead Source Pie Chart
function LeadSourceChart() {
  const [data, setData] = React.useState<LeadSourceData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLeadSourceAnalytics()
        setData(result)
      } catch (error) {
        console.error("Error fetching lead source analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  if (loading) return <Card><CardContent className="p-6">Loading...</CardContent></Card>

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>Distribution of lead sources</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={sourceConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="totalLeads"
              nameKey="source"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="source"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof sourceConfig) =>
                  sourceConfig[value]?.label || value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Lead source breakdown <Target className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing lead distribution by source
        </div>
      </CardFooter>
    </Card>
  )
}

// Weekly Performance Time Series
function WeeklyPerformanceChart() {
  const [data, setData] = React.useState<WeeklyData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTimeBasedAnalytics()
        setData(result)
      } catch (error) {
        console.error("Error fetching time-based analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card><CardContent className="p-6">Loading...</CardContent></Card>

  const config = {
    newLeads: {
      label: "New Leads",
      color: "hsl(var(--chart-1))",
    },
    conversions: {
      label: "Conversions",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
        <CardDescription>Weekly lead generation and conversion trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="newLeads" fill="var(--color-newLeads)" radius={4} />
            <Bar dataKey="conversions" fill="var(--color-conversions)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Weekly trends <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Comparing new leads vs conversions by week
        </div>
      </CardFooter>
    </Card>
  )
}

// Automation Performance Chart
function AutomationPerformanceChart() {
  const [data, setData] = React.useState<AutomationData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAutomationPerformance()
        setData(result.slice(0, 10)) // Limit to top 10 for readability
      } catch (error) {
        console.error("Error fetching automation performance:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card><CardContent className="p-6">Loading...</CardContent></Card>

  const config = {
    totalLeads: {
      label: "Total Leads",
      color: "hsl(var(--chart-1))",
    },
    convertedLeads: {
      label: "Conversions",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Performance</CardTitle>
        <CardDescription>Lead generation by individual automations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="horizontal"
            margin={{
              left: 80,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={70}
              fontSize={12}
              tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
            />
            <XAxis dataKey="totalLeads" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="totalLeads" fill="var(--color-totalLeads)" radius={4} />
            <Bar dataKey="convertedLeads" fill="var(--color-convertedLeads)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Top performing automations <Zap className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Individual automation lead generation performance
        </div>
      </CardFooter>
    </Card>
  )
}

export default function DashboardAnalyticsCharts() {
  return (
    <div className="grid gap-6">
      {/* Lead Analytics - Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadAnalyticsChart />
        <WeeklyPerformanceChart />
      </div>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformPerformanceChart />
        <LeadSourceChart />
      </div>

      {/* Automation Performance - Full Width */}
      <AutomationPerformanceChart />
    </div>
  )
}