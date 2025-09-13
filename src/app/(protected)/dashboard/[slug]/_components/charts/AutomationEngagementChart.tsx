// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
// import { TrendingUp, MessageSquare, Mail, Loader2 } from "lucide-react"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// // Import your server actions
// import { getAutomationsForUser, getEngagementDataForAutomation } from "@/actions/dashboard"

// const chartConfig = {
//   dms: {
//     label: "Direct Messages",
//     color: "hsl(var(--chart-1))",
//     icon: Mail,
//   },
//   comments: {
//     label: "Comments",
//     color: "hsl(var(--chart-2))",
//     icon: MessageSquare,
//   },
// } satisfies ChartConfig

// export default function AutomationEngagementChart() {
//   const [timeRange, setTimeRange] = React.useState("180d")
//   const [selectedAutomationId, setSelectedAutomationId] = React.useState<string>("")
//   const [automations, setAutomations] = React.useState<any[]>([])
//   const [engagementData, setEngagementData] = React.useState<any[]>([])
//   const [commentData, setCommentData] = React.useState<any>(null)
//   const [loading, setLoading] = React.useState(true)
//   const [error, setError] = React.useState<string | null>(null)

//   // Fetch automations on component mount
//   React.useEffect(() => {
//     const fetchAutomations = async () => {
//       try {
//         const userAutomations = await getAutomationsForUser()
//         setAutomations(userAutomations)
        
//         // Set the first automation as selected by default
//         if (userAutomations.length > 0) {
//           setSelectedAutomationId(userAutomations[0].id)
//         }
//       } catch (err) {
//         setError("Failed to load automations")
//         console.error("Error fetching automations:", err)
//       }
//     }
    
//     fetchAutomations()
//   }, [])

//   // Fetch engagement data when automation changes
//   React.useEffect(() => {
//     const fetchEngagementData = async () => {
//       if (!selectedAutomationId) {
//         setLoading(false)
//         return
//       }

//       setLoading(true)
//       try {
//         const { engagementData: data, commentData: comments } = await getEngagementDataForAutomation(selectedAutomationId)
//         setEngagementData(data)
//         setCommentData(comments)
//         setError(null)
//       } catch (err) {
//         setError("Failed to load engagement data")
//         console.error("Error fetching engagement data:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEngagementData()
//   }, [selectedAutomationId])

//   const filteredData = React.useMemo(() => {
//     if (!engagementData.length) return []
    
//     const referenceDate = new Date()
//     let daysToSubtract = 180
    
//     if (timeRange === "30d") daysToSubtract = 30
//     else if (timeRange === "60d") daysToSubtract = 60
//     else if (timeRange === "90d") daysToSubtract = 90

//     const startDate = new Date(referenceDate)
//     startDate.setDate(startDate.getDate() - daysToSubtract)

//     return engagementData.filter((item) => {
//       const date = new Date(item.date)
//       return date >= startDate
//     }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//   }, [engagementData, timeRange])

//   const totalEngagement = React.useMemo(() => {
//     return filteredData.reduce((acc, curr) => ({
//       dms: acc.dms + curr.dms,
//       comments: acc.comments + curr.comments,
//     }), { dms: 0, comments: 0 })
//   }, [filteredData])

//   const trendPercentage = React.useMemo(() => {
//     if (filteredData.length < 14) return 0
    
//     const recent = filteredData.slice(-7)
//     const previous = filteredData.slice(-14, -7)
    
//     const recentTotal = recent.reduce((acc, curr) => acc + curr.dms + curr.comments, 0)
//     const previousTotal = previous.reduce((acc, curr) => acc + curr.dms + curr.comments, 0)
    
//     if (previousTotal === 0) return recentTotal > 0 ? 100 : 0
//     return ((recentTotal - previousTotal) / previousTotal * 100)
//   }, [filteredData])

//   const selectedAutomation = automations.find(auto => auto.id === selectedAutomationId)

//   if (error) {
//     return (
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="text-red-600">Error Loading Data</CardTitle>
//           <CardDescription>{error}</CardDescription>
//         </CardHeader>
//       </Card>
//     )
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
//         <div className="grid flex-1 gap-1">
//           <CardTitle className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5" />
//             Automation Engagement Analytics
//           </CardTitle>
//           <CardDescription>
//             Track DMs and comments generated by your automations over time
//             {selectedAutomation && ` - ${selectedAutomation.name}`}
//           </CardDescription>
//         </div>
//         <div className="flex gap-2">
//           <Select value={selectedAutomationId} onValueChange={setSelectedAutomationId}>
//             <SelectTrigger className="w-[200px] rounded-lg">
//               <SelectValue placeholder="Select automation" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl">
//               {automations.map((automation) => (
//                 <SelectItem key={automation.id} value={automation.id} className="rounded-lg">
//                   {automation.name}
//                   <span className="ml-2 text-xs text-muted-foreground">
//                     {automation.active ? "Active" : "Inactive"}
//                   </span>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[160px] rounded-lg">
//               <SelectValue placeholder="Select time range" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl">
//               <SelectItem value="30d" className="rounded-lg">
//                 Last 30 days
//               </SelectItem>
//               <SelectItem value="60d" className="rounded-lg">
//                 Last 60 days
//               </SelectItem>
//               <SelectItem value="90d" className="rounded-lg">
//                 Last 90 days
//               </SelectItem>
//               <SelectItem value="180d" className="rounded-lg">
//                 Last 6 months
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         {loading ? (
//           <div className="flex items-center justify-center h-[400px]">
//             <Loader2 className="h-8 w-8 animate-spin" />
//             <span className="ml-2">Loading engagement data...</span>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="flex items-center justify-center h-[400px]">
//             <div className="text-center">
//               <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-semibold">No engagement data</h3>
//               <p className="text-muted-foreground">
//                 {selectedAutomationId ? "No data available for the selected automation and time period." : "Please select an automation to view engagement data."}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-6 grid gap-4 md:grid-cols-3">
//               <div className="rounded-lg border p-4">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-blue-600" />
//                   <span className="text-sm font-medium">Total DMs</span>
//                 </div>
//                 <div className="text-2xl font-bold text-blue-600 mt-2">
//                   {totalEngagement.dms.toLocaleString()}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Last {timeRange === "30d" ? "30 days" : timeRange === "60d" ? "60 days" : timeRange === "90d" ? "90 days" : "6 months"}
//                 </p>
//               </div>
//               <div className="rounded-lg border p-4">
//                 <div className="flex items-center gap-2">
//                   <MessageSquare className="h-4 w-4 text-green-600" />
//                   <span className="text-sm font-medium">Total Comments</span>
//                 </div>
//                 <div className="text-2xl font-bold text-green-600 mt-2">
//                   {totalEngagement.comments.toLocaleString()}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Last {timeRange === "30d" ? "30 days" : timeRange === "60d" ? "60 days" : timeRange === "90d" ? "90 days" : "6 months"}
//                 </p>
//               </div>
//               <div className="rounded-lg border p-4">
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="h-4 w-4 text-purple-600" />
//                   <span className="text-sm font-medium">Weekly Trend</span>
//                 </div>
//                 <div className={`text-2xl font-bold mt-2 ${trendPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   vs previous week
//                 </p>
//               </div>
//             </div>
            
//             <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
//               <AreaChart
//                 data={filteredData}
//                 margin={{
//                   left: 20,
//                   right: 20,
//                   top: 20,
//                   bottom: 20,
//                 }}
//               >
//                 <defs>
//                   <linearGradient id="fillDms" x1="0" y1="0" x2="0" y2="1">
//                     <stop
//                       offset="5%"
//                       stopColor="var(--color-dms)"
//                       stopOpacity={0.8}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="var(--color-dms)"
//                       stopOpacity={0.1}
//                     />
//                   </linearGradient>
//                   <linearGradient id="fillComments" x1="0" y1="0" x2="0" y2="1">
//                     <stop
//                       offset="5%"
//                       stopColor="var(--color-comments)"
//                       stopOpacity={0.8}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor="var(--color-comments)"
//                       stopOpacity={0.1}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                 <XAxis
//                   dataKey="date"
//                   tickLine={false}
//                   axisLine={false}
//                   tickMargin={8}
//                   minTickGap={32}
//                   tickFormatter={(value) => {
//                     const date = new Date(value)
//                     return date.toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     })
//                   }}
//                 />
//                 <YAxis
//                   tickLine={false}
//                   axisLine={false}
//                   tickMargin={8}
//                   tickFormatter={(value) => `${value}`}
//                 />
//                 <ChartTooltip
//                   cursor={false}
//                   content={
//                     <ChartTooltipContent
//                       labelFormatter={(value) => {
//                         return new Date(value).toLocaleDateString("en-US", {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         })
//                       }}
//                       indicator="dot"
//                     />
//                   }
//                 />
//                 <Area
//                   dataKey="comments"
//                   type="monotone"
//                   fill="url(#fillComments)"
//                   stroke="var(--color-comments)"
//                   strokeWidth={2}
//                   stackId="a"
//                 />
//                 <Area
//                   dataKey="dms"
//                   type="monotone"
//                   fill="url(#fillDms)"
//                   stroke="var(--color-dms)"
//                   strokeWidth={2}
//                   stackId="a"
//                 />
//                 <ChartLegend content={<ChartLegendContent />} />
//               </AreaChart>
//             </ChartContainer>
//           </>
//         )}
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           {filteredData.length > 0 && (
//             <>
//               {trendPercentage >= 0 ? 'Trending up' : 'Trending down'} by {Math.abs(trendPercentage).toFixed(1)}% this week 
//               <TrendingUp className="h-4 w-4" />
//             </>
//           )}
//         </div>
//         <div className="leading-none text-muted-foreground">
//           {selectedAutomation && `Automation: ${selectedAutomation.name} (${selectedAutomation.active ? 'Active' : 'Inactive'})`}
//           {commentData && (
//             <span className="ml-2">
//               • Created: {new Date(commentData.Automation.createdAt).toLocaleDateString()}
//             </span>
//           )}
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

"use client"

import * as React from "react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, MessageSquare, Mail, Loader2, Zap, BarChart3 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
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
import { getAutomationsForUser, getEngagementDataForAutomation } from "@/actions/dashboard"

const chartConfig = {
  dms: {
    label: "Direct Messages",
    color: "#3b82f6",
    icon: Mail,
  },
  comments: {
    label: "Comments",
    color: "#10b981",
    icon: MessageSquare,
  },
} satisfies ChartConfig

// Custom Tooltip Component with Glass Effect
const GlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl p-4 shadow-2xl">
        <p className="text-white/70 text-sm font-medium mb-2">
          {new Date(label).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div 
              className="w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white font-semibold text-base">
              {entry.name}: {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AutomationEngagementChart() {
  const [timeRange, setTimeRange] = React.useState("180d")
  const [selectedAutomationId, setSelectedAutomationId] = React.useState<string>("")
  const [automations, setAutomations] = React.useState<any[]>([])
  const [engagementData, setEngagementData] = React.useState<any[]>([])
  const [commentData, setCommentData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isAnimating, setIsAnimating] = React.useState(false)

  // Fetch automations on component mount
  React.useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const userAutomations = await getAutomationsForUser()
        setAutomations(userAutomations)
        
        if (userAutomations.length > 0) {
          setSelectedAutomationId(userAutomations[0].id)
        }
      } catch (err) {
        setError("Failed to load automations")
        console.error("Error fetching automations:", err)
      }
    }
    
    fetchAutomations()
  }, [])

  // Fetch engagement data when automation changes
  React.useEffect(() => {
    const fetchEngagementData = async () => {
      if (!selectedAutomationId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setIsAnimating(true)
      
      try {
        const { engagementData: data, commentData: comments } = await getEngagementDataForAutomation(selectedAutomationId)
        
        // Add slight delay for smooth animation
        setTimeout(() => {
          setEngagementData(data)
          setCommentData(comments)
          setError(null)
          setIsAnimating(false)
        }, 300)
        
      } catch (err) {
        setError("Failed to load engagement data")
        console.error("Error fetching engagement data:", err)
        setIsAnimating(false)
      } finally {
        setLoading(false)
      }
    }

    fetchEngagementData()
  }, [selectedAutomationId])

  const filteredData = React.useMemo(() => {
    if (!engagementData.length) return []
    
    const referenceDate = new Date()
    let daysToSubtract = 180
    
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "60d") daysToSubtract = 60
    else if (timeRange === "90d") daysToSubtract = 90

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return engagementData.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [engagementData, timeRange])

  const totalEngagement = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      dms: acc.dms + curr.dms,
      comments: acc.comments + curr.comments,
    }), { dms: 0, comments: 0 })
  }, [filteredData])

  const trendPercentage = React.useMemo(() => {
    if (filteredData.length < 14) return 0
    
    const recent = filteredData.slice(-7)
    const previous = filteredData.slice(-14, -7)
    
    const recentTotal = recent.reduce((acc, curr) => acc + curr.dms + curr.comments, 0)
    const previousTotal = previous.reduce((acc, curr) => acc + curr.dms + curr.comments, 0)
    
    if (previousTotal === 0) return recentTotal > 0 ? 100 : 0
    return ((recentTotal - previousTotal) / previousTotal * 100)
  }, [filteredData])

  const selectedAutomation = automations.find(auto => auto.id === selectedAutomationId)
  const maxValue = Math.max(...filteredData.map(d => Math.max(d.dms, d.comments)), 1)

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-900/20 via-red-800/10 to-transparent border border-red-500/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent" />
        <div className="relative p-8">
          <div className="flex items-center gap-3 text-red-400">
            <Zap className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Error Loading Data</h3>
          </div>
          <p className="text-red-300/80 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/50 to-transparent border border-white/10 backdrop-blur-xl">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-white/10">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
                Automation Analytics
              </h2>
              <p className="text-white/60 text-sm">
                Real-time engagement insights {selectedAutomation && `• ${selectedAutomation.name}`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedAutomationId} onValueChange={setSelectedAutomationId}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                <SelectValue placeholder="Select automation" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-white/10 backdrop-blur-xl">
                {automations.map((automation) => (
                  <SelectItem key={automation.id} value={automation.id} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${automation.active ? 'bg-green-400' : 'bg-red-400'}`} />
                      {automation.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-white/10 backdrop-blur-xl">
                <SelectItem value="30d" className="text-white hover:bg-white/10">30 days</SelectItem>
                <SelectItem value="60d" className="text-white hover:bg-white/10">60 days</SelectItem>
                <SelectItem value="90d" className="text-white hover:bg-white/10">90 days</SelectItem>
                <SelectItem value="180d" className="text-white hover:bg-white/10">6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                <div className="absolute inset-0 h-12 w-12 animate-ping bg-blue-400/20 rounded-full mx-auto" />
              </div>
              <p className="text-white/80 font-medium">Loading analytics...</p>
              <p className="text-white/40 text-sm mt-1">Analyzing engagement patterns</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 inline-block">
                <BarChart3 className="h-16 w-16 text-white/40" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Data Available</h3>
              <p className="text-white/60 max-w-md">
                {selectedAutomationId ? "No engagement data found for the selected automation and time period." : "Please select an automation to view analytics."}
              </p>
            </div>
          </div>
        ) : (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent border border-blue-500/20 backdrop-blur-sm p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Total DMs</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {totalEngagement.dms.toLocaleString()}
                  </div>
                  <p className="text-blue-300/60 text-sm">
                    Last {timeRange === "30d" ? "30 days" : timeRange === "60d" ? "60 days" : timeRange === "90d" ? "90 days" : "6 months"}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-green-600/10 to-transparent border border-green-500/20 backdrop-blur-sm p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-green-500/20 border border-green-500/30">
                      <MessageSquare className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-green-200 font-medium">Total Comments</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {totalEngagement.comments.toLocaleString()}
                  </div>
                  <p className="text-green-300/60 text-sm">
                    {timeRange === "30d" ? "Last 30 days" : 
                     timeRange === "60d" ? "Last 60 days" : 
                     timeRange === "90d" ? "Last 90 days" : "Last 6 months"}
                    • {filteredData.length} data points
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent border border-purple-500/20 backdrop-blur-sm p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-purple-200 font-medium">Weekly Trend</span>
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${trendPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                  </div>
                  <p className="text-purple-300/60 text-sm">vs previous week</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-[400px] rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="dmGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="commentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <XAxis 
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    domain={[0, maxValue * 1.1]}
                  />
                  
                  <ChartTooltip content={<GlassTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey="comments"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#commentGradient)"
                    filter="url(#glow)"
                    stackId="1"
                  />
                  <Area
                    type="monotone"
                    dataKey="dms"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#dmGradient)"
                    filter="url(#glow)"
                    stackId="1"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">
                  {trendPercentage >= 0 ? 'Trending up' : 'Trending down'} by {Math.abs(trendPercentage).toFixed(1)}% this week
                </span>
              </div>
              <div className="text-white/60 text-sm">
                {selectedAutomation && (
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedAutomation.active ? 'bg-green-400' : 'bg-red-400'}`} />
                    {selectedAutomation.active ? 'Active' : 'Inactive'}
                    {commentData && (
                      <span className="ml-3">
                        Created: {new Date(commentData.Automation.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}