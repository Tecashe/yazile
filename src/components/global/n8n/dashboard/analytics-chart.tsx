// "use client"

// import { useState, useEffect } from "react"
// import { useTheme } from "next-themes"
// import { Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
// import { format, subDays, subMonths, parseISO } from "date-fns"

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "@/hooks/use-toast"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Area,
//   AreaChart,
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts'

// interface AnalyticsChartProps {
//   userId: string
//   defaultPeriod?: "7d" | "30d" | "90d" | "1y"
//   defaultMetric?: "executions" | "duration" | "success_rate" | "resource_usage"
//   showControls?: boolean
//   height?: number
// }

// interface ChartData {
//   date: string
//   totalExecutions: number
//   successfulExecutions: number
//   failedExecutions: number
//   averageDuration: number
//   successRate: number
//   cpuUsage: number
//   memoryUsage: number
// }

// export function AnalyticsChart({
//   userId,
//   defaultPeriod = "30d",
//   defaultMetric = "executions",
//   showControls = true,
//   height = 300,
// }: AnalyticsChartProps) {
//   const { theme } = useTheme()

//   // State
//   const [isLoading, setIsLoading] = useState(true)
//   const [chartData, setChartData] = useState<ChartData[]>([])
//   const [period, setPeriod] = useState(defaultPeriod)
//   const [metric, setMetric] = useState(defaultMetric)
//   const [comparisonData, setComparisonData] = useState<{
//     current: number
//     previous: number
//     change: number
//   } | null>(null)

//   // Fetch chart data
//   useEffect(() => {
//     const fetchChartData = async () => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`/api/dashboard/analytics?period=${period}&metric=${metric}`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch analytics data")
//         }

//         const data = await response.json()
//         setChartData(data.chartData)
//         setComparisonData(data.comparison)
//       } catch (error) {
//         console.error("Error fetching analytics data:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load analytics data. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchChartData()
//   }, [period, metric])

//   // Get period label
//   const getPeriodLabel = () => {
//     const now = new Date()
//     let startDate: Date

//     switch (period) {
//       case "7d":
//         startDate = subDays(now, 7)
//         break
//       case "30d":
//         startDate = subDays(now, 30)
//         break
//       case "90d":
//         startDate = subDays(now, 90)
//         break
//       case "1y":
//         startDate = subMonths(now, 12)
//         break
//       default:
//         startDate = subDays(now, 30)
//     }

//     return `${format(startDate, "MMM d, yyyy")} - ${format(now, "MMM d, yyyy")}`
//   }

//   // Get metric label
//   const getMetricLabel = () => {
//     switch (metric) {
//       case "executions":
//         return "Workflow Executions"
//       case "duration":
//         return "Average Duration"
//       case "success_rate":
//         return "Success Rate"
//       case "resource_usage":
//         return "Resource Usage"
//       default:
//         return "Workflow Executions"
//     }
//   }

//   // Format date for x-axis
//   const formatXAxis = (dateString: string) => {
//     const date = parseISO(dateString)
//     return format(date, period === "1y" ? "MMM" : "MMM d")
//   }

//   // Render loading state
//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <Skeleton className="h-8 w-48" />
//             {showControls && <Skeleton className="h-10 w-32" />}
//           </div>
//           <Skeleton className="h-4 w-64" />
//         </CardHeader>
//         <CardContent>
//           <Skeleton className={`w-full h-[${height}px]`} />
//         </CardContent>
//       </Card>
//     )
//   }

//   // If no data
//   if (!chartData || chartData.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{getMetricLabel()}</CardTitle>
//           <CardDescription>No data available for the selected period</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
//             <p className="text-muted-foreground">Run your workflows to see analytics data</p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Chart colors
//   const colors = {
//     total: theme === "dark" ? "#94a3b8" : "#64748b",
//     success: theme === "dark" ? "#4ade80" : "#22c55e",
//     failed: theme === "dark" ? "#f87171" : "#ef4444",
//     duration: theme === "dark" ? "#60a5fa" : "#3b82f6",
//     cpu: theme === "dark" ? "#a78bfa" : "#8b5cf6",
//     memory: theme === "dark" ? "#fb923c" : "#f97316",
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <CardTitle>{getMetricLabel()}</CardTitle>
//             <CardDescription className="flex items-center">
//               <Calendar className="h-4 w-4 mr-1" />
//               {getPeriodLabel()}
//               {comparisonData && (
//                 <span
//                   className={`ml-2 flex items-center text-xs ${
//                     comparisonData.change >= 0 ? "text-green-500" : "text-destructive"
//                   }`}
//                 >
//                   {comparisonData.change >= 0 ? (
//                     <ArrowUpRight className="h-4 w-4 mr-1" />
//                   ) : (
//                     <ArrowDownRight className="h-4 w-4 mr-1" />
//                   )}
//                   {Math.abs(comparisonData.change)}% vs previous period
//                 </span>
//               )}
//             </CardDescription>
//           </div>

//           {showControls && (
//             <div className="flex flex-wrap gap-2">
//               <Select value={period} onValueChange={setPeriod}>
//                 <SelectTrigger className="w-[100px]">
//                   <SelectValue placeholder="Period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="7d">7 days</SelectItem>
//                   <SelectItem value="30d">30 days</SelectItem>
//                   <SelectItem value="90d">90 days</SelectItem>
//                   <SelectItem value="1y">1 year</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select value={metric} onValueChange={setMetric}>
//                 <SelectTrigger className="w-[140px]">
//                   <SelectValue placeholder="Metric" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="executions">Executions</SelectItem>
//                   <SelectItem value="duration">Duration</SelectItem>
//                   <SelectItem value="success_rate">Success Rate</SelectItem>
//                   <SelectItem value="resource_usage">Resource Usage</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue={metric} value={metric} onValueChange={setMetric} className="space-y-4">
//           {showControls && (
//             <TabsList className="grid grid-cols-4 w-full">
//               <TabsTrigger value="executions">Executions</TabsTrigger>
//               <TabsTrigger value="duration">Duration</TabsTrigger>
//               <TabsTrigger value="success_rate">Success Rate</TabsTrigger>
//               <TabsTrigger value="resource_usage">Resources</TabsTrigger>
//             </TabsList>
//           )}

//           <TabsContent value="executions" className="space-y-4">
//             <div style={{ height }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="date" tickFormatter={formatXAxis} />
//                   <YAxis />
//                   <Tooltip
//                     formatter={(value: number) => [value, "Executions"]}
//                     labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
//                   />
//                   <Legend />
//                   <Area
//                     type="monotone"
//                     dataKey="totalExecutions"
//                     name="Total"
//                     stroke={colors.total}
//                     fill={colors.total}
//                     fillOpacity={0.2}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="successfulExecutions"
//                     name="Successful"
//                     stroke={colors.success}
//                     fill={colors.success}
//                     fillOpacity={0.2}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="failedExecutions"
//                     name="Failed"
//                     stroke={colors.failed}
//                     fill={colors.failed}
//                     fillOpacity={0.2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </TabsContent>

//           <TabsContent value="duration" className="space-y-4">
//             <div style={{ height }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="date" tickFormatter={formatXAxis} />
//                   <YAxis />
//                   <Tooltip
//                     formatter={(value: number) => [`${(value / 1000).toFixed(2)}s`, "Avg Duration"]}
//                     labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
//                   />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="averageDuration"
//                     name="Avg Duration"
//                     stroke={colors.duration}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </TabsContent>

//           <TabsContent value="success_rate" className="space-y-4">
//             <div style={{ height }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="date" tickFormatter={formatXAxis} />
//                   <YAxis domain={[0, 100]} />
//                   <Tooltip
//                     formatter={(value: number) => [`${value.toFixed(1)}%`, "Success Rate"]}
//                     labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
//                   />
//                   <Legend />
//                   <Bar dataKey="successRate" name="Success Rate" fill={colors.success} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </TabsContent>

//           <TabsContent value="resource_usage" className="space-y-4">
//             <div style={{ height }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="date" tickFormatter={formatXAxis} />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip
//                     formatter={(value: number, name) => {
//                       if (name === "CPU Usage") return [`${value.toFixed(1)}%`, name]
//                       if (name === "Memory Usage") return [`${value.toFixed(1)} MB`, name]
//                       return [value, name]
//                     }}
//                     labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
//                   />
//                   <Legend />
//                   <Line
//                     yAxisId="left"
//                     type="monotone"
//                     dataKey="cpuUsage"
//                     name="CPU Usage"
//                     stroke={colors.cpu}
//                     activeDot={{ r: 8 }}
//                   />
//                   <Line
//                     yAxisId="right"
//                     type="monotone"
//                     dataKey="memoryUsage"
//                     name="Memory Usage"
//                     stroke={colors.memory}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" className="ml-auto">
//           Export Data
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format, subDays, subMonths, parseISO } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface AnalyticsChartProps {
  userId: string
  defaultPeriod?: "7d" | "30d" | "90d" | "1y"
  defaultMetric?: "executions" | "duration" | "success_rate" | "resource_usage"
  showControls?: boolean
  height?: number
}

interface ChartData {
  date: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageDuration: number
  successRate: number
  cpuUsage: number
  memoryUsage: number
}

export function AnalyticsChart({
  userId,
  defaultPeriod = "30d",
  defaultMetric = "executions",
  showControls = true,
  height = 300,
}: AnalyticsChartProps) {
  const { theme } = useTheme()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [period, setPeriod] = useState(defaultPeriod)
  const [metric, setMetric] = useState(defaultMetric)
  const [comparisonData, setComparisonData] = useState<{
    current: number
    previous: number
    change: number
  } | null>(null)

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/dashboard/analytics?period=${period}&metric=${metric}`)
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data")
        }

        const data = await response.json()
        setChartData(data.chartData)
        setComparisonData(data.comparison)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [period, metric])

  // Get period label
  const getPeriodLabel = () => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "7d":
        startDate = subDays(now, 7)
        break
      case "30d":
        startDate = subDays(now, 30)
        break
      case "90d":
        startDate = subDays(now, 90)
        break
      case "1y":
        startDate = subMonths(now, 12)
        break
      default:
        startDate = subDays(now, 30)
    }

    return `${format(startDate, "MMM d, yyyy")} - ${format(now, "MMM d, yyyy")}`
  }

  // Get metric label
  const getMetricLabel = () => {
    switch (metric) {
      case "executions":
        return "Workflow Executions"
      case "duration":
        return "Average Duration"
      case "success_rate":
        return "Success Rate"
      case "resource_usage":
        return "Resource Usage"
      default:
        return "Workflow Executions"
    }
  }

  // Format date for x-axis
  const formatXAxis = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, period === "1y" ? "MMM" : "MMM d")
  }

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            {showControls && <Skeleton className="h-10 w-32" />}
          </div>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className={`w-full h-[${height}px]`} />
        </CardContent>
      </Card>
    )
  }

  // If no data
  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getMetricLabel()}</CardTitle>
          <CardDescription>No data available for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Run your workflows to see analytics data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Chart colors
  const colors = {
    total: theme === "dark" ? "#94a3b8" : "#64748b",
    success: theme === "dark" ? "#4ade80" : "#22c55e",
    failed: theme === "dark" ? "#f87171" : "#ef4444",
    duration: theme === "dark" ? "#60a5fa" : "#3b82f6",
    cpu: theme === "dark" ? "#a78bfa" : "#8b5cf6",
    memory: theme === "dark" ? "#fb923c" : "#f97316",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>{getMetricLabel()}</CardTitle>
            <CardDescription className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {getPeriodLabel()}
              {comparisonData && (
                <span
                  className={`ml-2 flex items-center text-xs ${
                    comparisonData.change >= 0 ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {comparisonData.change >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(comparisonData.change)}% vs previous period
                </span>
              )}
            </CardDescription>
          </div>

          {showControls && (
            <div className="flex flex-wrap gap-2">
              <Select value={period} onValueChange={(value) => setPeriod(value as "7d" | "30d" | "90d" | "1y")}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={metric}
                onValueChange={(value) =>
                  setMetric(value as "executions" | "duration" | "success_rate" | "resource_usage")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executions">Executions</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="success_rate">Success Rate</SelectItem>
                  <SelectItem value="resource_usage">Resource Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* <Tabs defaultValue={metric} value={metric} onValueChange={setMetric} className="space-y-4"> */}
        <Tabs defaultValue={metric} value={metric} onValueChange={(value) => setMetric(value as typeof metric)} className="space-y-4">
          {showControls && (
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="executions">Executions</TabsTrigger>
              <TabsTrigger value="duration">Duration</TabsTrigger>
              <TabsTrigger value="success_rate">Success Rate</TabsTrigger>
              <TabsTrigger value="resource_usage">Resources</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="executions" className="space-y-4">
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value, "Executions"]}
                    labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalExecutions"
                    name="Total"
                    stroke={colors.total}
                    fill={colors.total}
                    fillOpacity={0.2}
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="successfulExecutions"
                    name="Successful"
                    stroke={colors.success}
                    fill={colors.success}
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="failedExecutions"
                    name="Failed"
                    stroke={colors.failed}
                    fill={colors.failed}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="duration" className="space-y-4">
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${(value / 1000).toFixed(2)}s`, "Avg Duration"]}
                    labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averageDuration"
                    name="Avg Duration"
                    stroke={colors.duration}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="success_rate" className="space-y-4">
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Success Rate"]}
                    labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                  />
                  <Legend />
                  <Bar dataKey="successRate" name="Success Rate" fill={colors.success} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="resource_usage" className="space-y-4">
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name) => {
                      if (name === "CPU Usage") return [`${value.toFixed(1)}%`, name]
                      if (name === "Memory Usage") return [`${value.toFixed(1)} MB`, name]
                      return [value, name]
                    }}
                    labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cpuUsage"
                    name="CPU Usage"
                    stroke={colors.cpu}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="memoryUsage"
                    name="Memory Usage"
                    stroke={colors.memory}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="ml-auto">
          Export Data
        </Button>
      </CardFooter>
    </Card>
  )
}
