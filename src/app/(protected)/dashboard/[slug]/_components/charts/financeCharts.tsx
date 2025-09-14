// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
// import { TrendingUp } from "lucide-react"

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
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// // Import your server actions
// import { getLeadAnalytics } from "@/actions/dashboard/d-actions"

// // Type definitions
// interface DailyLeadData {
//   total: number;
//   qualified: number;
//   converted: number;
//   date: string;
// }

// const chartConfig = {
//   total: {
//     label: "New Leads",
//     color: "var(--chart-1)",
//   },
//   qualified: {
//     label: "Qualified Leads",
//     color: "var(--chart-2)",
//   },
//   converted: {
//     label: "Converted Leads",
//     color: "var(--chart-3)",
//   },
// } satisfies ChartConfig

// export default function LeadFunnelChart() {
//   const [data, setData] = React.useState<DailyLeadData[]>([])
//   const [loading, setLoading] = React.useState(true)

//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getLeadAnalytics()
//         setData(result.dailyLeads)
//       } catch (error) {
//         console.error("Error fetching lead analytics:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   if (loading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6 flex items-center justify-center h-[400px]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//             <p className="text-muted-foreground">Loading analytics...</p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Calculate performance metrics
//   const totalNewLeads = data.reduce((sum, item) => sum + item.total, 0)
//   const totalQualified = data.reduce((sum, item) => sum + item.qualified, 0)
//   const totalConverted = data.reduce((sum, item) => sum + item.converted, 0)
//   const conversionRate = totalNewLeads > 0 ? ((totalConverted / totalNewLeads) * 100).toFixed(1) : "0.0"
//   const qualificationRate = totalNewLeads > 0 ? ((totalQualified / totalNewLeads) * 100).toFixed(1) : "0.0"
  
//   // Calculate trend (comparing last half vs first half of data)
//   const midpoint = Math.floor(data.length / 2)
//   const recentData = data.slice(midpoint)
//   const previousData = data.slice(0, midpoint)
  
//   const recentAvg = recentData.length > 0 ? recentData.reduce((sum, item) => sum + item.converted, 0) / recentData.length : 0
//   const previousAvg = previousData.length > 0 ? previousData.reduce((sum, item) => sum + item.converted, 0) / previousData.length : 0
//   const trendPercentage = previousAvg > 0 ? (((recentAvg - previousAvg) / previousAvg) * 100).toFixed(1) : "0.0"

//   return (
//     <Card className="w-full">
//       <CardHeader className="pb-4">
//         <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//           <div>
//             <CardTitle className="text-lg sm:text-xl">Lead Generation Funnel</CardTitle>
//             <CardDescription className="text-sm">
//               Complete lead journey over the last 30 days
//             </CardDescription>
//           </div>
//           <div className="flex flex-col space-y-1 text-right">
//             <div className="text-2xl font-bold text-primary">{conversionRate}%</div>
//             <div className="text-xs text-muted-foreground">Conversion Rate</div>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="px-3 sm:px-6">
//         <ChartContainer config={chartConfig} className="h-[300px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart
//               data={data}
//               margin={{
//                 top: 10,
//                 right: 10,
//                 left: 0,
//                 bottom: 0,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
//               <XAxis
//                 dataKey="date"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 fontSize={12}
//                 tickFormatter={(value) => {
//                   const date = new Date(value)
//                   return date.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   })
//                 }}
//                 interval="preserveStartEnd"
//               />
//               <YAxis 
//                 tickLine={false}
//                 axisLine={false}
//                 fontSize={12}
//                 width={35}
//               />
//               <ChartTooltip 
//                 cursor={{ strokeDasharray: "3 3", opacity: 0.5 }}
//                 content={({ active, payload, label }) => {
//                   if (active && payload && payload.length) {
//                     const newLeads = Number(payload.find(p => p.dataKey === 'total')?.value || 0)
//                     const qualified = Number(payload.find(p => p.dataKey === 'qualified')?.value || 0)
//                     const converted = Number(payload.find(p => p.dataKey === 'converted')?.value || 0)
//                     const dayConversionRate = newLeads > 0 ? ((converted / newLeads) * 100).toFixed(1) : "0.0"
                    
//                     return (
//                       <div className="bg-background border border-border rounded-lg shadow-lg p-3">
//                         <p className="font-medium mb-2">
//                           {new Date(label).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </p>
//                         {payload.map((entry, index) => (
//                           <div key={index} className="flex items-center gap-2 text-sm">
//                             <div 
//                               className="w-3 h-3 rounded-sm" 
//                               style={{ backgroundColor: entry.color }}
//                             />
//                             <span className="text-muted-foreground">{entry.name}:</span>
//                             <span className="font-medium">{entry.value}</span>
//                           </div>
//                         ))}
//                         <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
//                           Conversion Rate: {dayConversionRate}%
//                         </div>
//                       </div>
//                     )
//                   }
//                   return null
//                 }}
//               />
              
//               <defs>
//                 <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.05} />
//                 </linearGradient>
//                 <linearGradient id="fillQualified" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="var(--color-qualified)" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="var(--color-qualified)" stopOpacity={0.05} />
//                 </linearGradient>
//                 <linearGradient id="fillConverted" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="var(--color-converted)" stopOpacity={0.4} />
//                   <stop offset="95%" stopColor="var(--color-converted)" stopOpacity={0.1} />
//                 </linearGradient>
//               </defs>
              
//               <Area
//                 dataKey="total"
//                 stackId="1"
//                 stroke="var(--color-total)"
//                 fill="url(#fillTotal)"
//                 strokeWidth={2}
//                 type="monotone"
//               />
//               <Area
//                 dataKey="qualified"
//                 stackId="2"
//                 stroke="var(--color-qualified)"
//                 fill="url(#fillQualified)"
//                 strokeWidth={2}
//                 type="monotone"
//               />
//               <Area
//                 dataKey="converted"
//                 stackId="3"
//                 stroke="var(--color-converted)"
//                 fill="url(#fillConverted)"
//                 strokeWidth={2}
//                 type="monotone"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
      
//       <CardFooter className="pt-4">
//         <div className="flex flex-col space-y-3 w-full">
//           {/* Key Metrics Row */}
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div className="space-y-1">
//               <div className="text-lg sm:text-xl font-bold text-blue-600">{totalNewLeads}</div>
//               <div className="text-xs text-muted-foreground">New Leads</div>
//             </div>
//             <div className="space-y-1">
//               <div className="text-lg sm:text-xl font-bold text-orange-600">{totalQualified}</div>
//               <div className="text-xs text-muted-foreground">Qualified ({qualificationRate}%)</div>
//             </div>
//             <div className="space-y-1">
//               <div className="text-lg sm:text-xl font-bold text-green-600">{totalConverted}</div>
//               <div className="text-xs text-muted-foreground">Converted</div>
//             </div>
//           </div>
          
//           {/* Trend Information */}
//           <div className="flex items-center justify-center gap-2 text-sm border-t pt-3">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               {Number(trendPercentage) > 0 ? (
//                 <>
//                   <TrendingUp className="h-4 w-4 text-green-600" />
//                   <span className="text-green-600">+{trendPercentage}%</span>
//                 </>
//               ) : Number(trendPercentage) < 0 ? (
//                 <>
//                   <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
//                   <span className="text-red-600">{trendPercentage}%</span>
//                 </>
//               ) : (
//                 <>
//                   <div className="h-4 w-4 bg-gray-400 rounded-full" />
//                   <span className="text-gray-600">No change</span>
//                 </>
//               )}
//               <span className="text-muted-foreground">recent trend</span>
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
// import { TrendingUp } from "lucide-react"

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
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// // Type definitions
// interface DailyLeadData {
//   total: number;
//   qualified: number;
//   converted: number;
//   date: string;
// }

// // Mock data for demo purposes
// const mockData: DailyLeadData[] = [
//   { date: "2024-02-15", total: 45, qualified: 32, converted: 12 },
//   { date: "2024-02-16", total: 52, qualified: 38, converted: 15 },
//   { date: "2024-02-17", total: 38, qualified: 28, converted: 10 },
//   { date: "2024-02-18", total: 67, qualified: 48, converted: 18 },
//   { date: "2024-02-19", total: 73, qualified: 55, converted: 22 },
//   { date: "2024-02-20", total: 58, qualified: 42, converted: 16 },
//   { date: "2024-02-21", total: 84, qualified: 61, converted: 25 },
//   { date: "2024-02-22", total: 79, qualified: 58, converted: 23 },
//   { date: "2024-02-23", total: 91, qualified: 68, converted: 28 },
//   { date: "2024-02-24", total: 76, qualified: 56, converted: 21 },
//   { date: "2024-02-25", total: 89, qualified: 67, converted: 26 },
//   { date: "2024-02-26", total: 95, qualified: 72, converted: 30 },
//   { date: "2024-02-27", total: 82, qualified: 64, converted: 25 },
//   { date: "2024-02-28", total: 88, qualified: 71, converted: 29 },
//   { date: "2024-02-29", total: 103, qualified: 81, converted: 35 },
//   { date: "2024-03-01", total: 97, qualified: 76, converted: 32 },
//   { date: "2024-03-02", total: 85, qualified: 68, converted: 28 },
//   { date: "2024-03-03", total: 92, qualified: 74, converted: 31 },
//   { date: "2024-03-04", total: 108, qualified: 87, converted: 38 },
//   { date: "2024-03-05", total: 94, qualified: 78, converted: 33 },
//   { date: "2024-03-06", total: 101, qualified: 83, converted: 36 },
//   { date: "2024-03-07", total: 87, qualified: 71, converted: 29 },
//   { date: "2024-03-08", total: 99, qualified: 81, converted: 34 },
//   { date: "2024-03-09", total: 105, qualified: 89, converted: 39 },
//   { date: "2024-03-10", total: 93, qualified: 77, converted: 32 },
//   { date: "2024-03-11", total: 111, qualified: 92, converted: 41 },
//   { date: "2024-03-12", total: 98, qualified: 82, converted: 35 },
//   { date: "2024-03-13", total: 106, qualified: 88, converted: 38 },
//   { date: "2024-03-14", total: 89, qualified: 74, converted: 31 },
//   { date: "2024-03-15", total: 115, qualified: 96, converted: 43 }
// ]

// const chartConfig = {
//   total: {
//     label: "New Leads",
//     color: "var(--chart-1)",
//   },
//   qualified: {
//     label: "Qualified Leads",
//     color: "var(--chart-2)",
//   },
//   converted: {
//     label: "Converted Leads",
//     color: "var(--chart-3)",
//   },
// } satisfies ChartConfig

// export default function LeadFunnelChart() {
//   const [data, setData] = React.useState<DailyLeadData[]>(mockData)
//   const [loading, setLoading] = React.useState(false)

//   // Uncomment below to use real data from server action
//   // const [data, setData] = React.useState<DailyLeadData[]>([])
//   // const [loading, setLoading] = React.useState(true)
//   // 
//   // React.useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const result = await getLeadAnalytics()
//   //       setData(result.dailyLeads)
//   //     } catch (error) {
//   //       console.error("Error fetching lead analytics:", error)
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }
//   //   fetchData()
//   // }, [])

//   if (loading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6 flex items-center justify-center h-[400px]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//             <p className="text-muted-foreground">Loading analytics...</p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Calculate performance metrics
//   const totalNewLeads = data.reduce((sum, item) => sum + item.total, 0)
//   const totalQualified = data.reduce((sum, item) => sum + item.qualified, 0)
//   const totalConverted = data.reduce((sum, item) => sum + item.converted, 0)
//   const conversionRate = totalNewLeads > 0 ? ((totalConverted / totalNewLeads) * 100).toFixed(1) : "0.0"
//   const qualificationRate = totalNewLeads > 0 ? ((totalQualified / totalNewLeads) * 100).toFixed(1) : "0.0"
  
//   // Calculate trend (comparing last half vs first half of data)
//   const midpoint = Math.floor(data.length / 2)
//   const recentData = data.slice(midpoint)
//   const previousData = data.slice(0, midpoint)
  
//   const recentAvg = recentData.length > 0 ? recentData.reduce((sum, item) => sum + item.converted, 0) / recentData.length : 0
//   const previousAvg = previousData.length > 0 ? previousData.reduce((sum, item) => sum + item.converted, 0) / previousData.length : 0
//   const trendPercentage = previousAvg > 0 ? (((recentAvg - previousAvg) / previousAvg) * 100).toFixed(1) : "0.0"

//   return (
//     <Card className="w-full">
//       <CardHeader className="pb-4">
//         <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//           <div>
//             <CardTitle className="text-lg sm:text-xl">Lead Generation Funnel</CardTitle>
//             <CardDescription className="text-sm">
//               Complete lead journey over the last 30 days
//             </CardDescription>
//           </div>
//           <div className="flex flex-col space-y-1 text-right">
//             <div className="text-2xl font-bold text-primary">{conversionRate}%</div>
//             <div className="text-xs text-muted-foreground">Conversion Rate</div>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="px-3 sm:px-6">
//         <ChartContainer config={chartConfig} className="h-[300px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart
//               data={data}
//               margin={{
//                 top: 10,
//                 right: 10,
//                 left: 0,
//                 bottom: 0,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
//               <XAxis
//                 dataKey="date"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 fontSize={12}
//                 tickFormatter={(value) => {
//                   const date = new Date(value)
//                   return date.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   })
//                 }}
//                 interval="preserveStartEnd"
//               />
//               <YAxis 
//                 tickLine={false}
//                 axisLine={false}
//                 fontSize={12}
//                 width={35}
//               />
//               <ChartTooltip 
//                 cursor={{ strokeDasharray: "3 3", opacity: 0.5 }}
//                 content={({ active, payload, label }) => {
//                   if (active && payload && payload.length) {
//                     const newLeads = Number(payload.find(p => p.dataKey === 'total')?.value || 0)
//                     const qualified = Number(payload.find(p => p.dataKey === 'qualified')?.value || 0)
//                     const converted = Number(payload.find(p => p.dataKey === 'converted')?.value || 0)
//                     const dayConversionRate = newLeads > 0 ? ((converted / newLeads) * 100).toFixed(1) : "0.0"
                    
//                     return (
//                       <div className="bg-background border border-border rounded-lg shadow-lg p-3">
//                         <p className="font-medium mb-2">
//                           {new Date(label).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </p>
//                         {payload.map((entry, index) => (
//                           <div key={index} className="flex items-center gap-2 text-sm">
//                             <div 
//                               className="w-3 h-3 rounded-sm" 
//                               style={{ backgroundColor: entry.color }}
//                             />
//                             <span className="text-muted-foreground">{entry.name}:</span>
//                             <span className="font-medium">{entry.value}</span>
//                           </div>
//                         ))}
//                         <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
//                           Conversion Rate: {dayConversionRate}%
//                         </div>
//                       </div>
//                     )
//                   }
//                   return null
//                 }}
//               />
              
//               <defs>
//                 <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.05} />
//                 </linearGradient>
//                 <linearGradient id="fillQualified" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="var(--color-qualified)" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="var(--color-qualified)" stopOpacity={0.05} />
//                 </linearGradient>
//                 <linearGradient id="fillConverted" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="var(--color-converted)" stopOpacity={0.4} />
//                   <stop offset="95%" stopColor="var(--color-converted)" stopOpacity={0.1} />
//                 </linearGradient>
//               </defs>
              
//               <Area
//                 dataKey="total"
//                 stackId="1"
//                 stroke="var(--color-total)"
//                 fill="url(#fillTotal)"
//                 strokeWidth={2}
//                 type="monotone"
//               />
//               <Area
//                 dataKey="qualified"
//                 stackId="2"
//                 stroke="var(--color-qualified)"
//                 fill="url(#fillQualified)"
//                 strokeWidth={2}
//                 type="monotone"
//               />
//               <Area
//                 dataKey="converted"
//                 stackId="3"
//                 stroke="var(--color-converted)"
//                 fill="url(#fillConverted)"
//                 strokeWidth={2}
//                 type="monotone"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
      
//       <CardFooter className="pt-4">
//         <div className="flex flex-col space-y-3 w-full">
//           {/* Key Metrics Row */}
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div className="space-y-1">
//               <div className="text-lg sm:text-xl font-bold text-blue-600">{totalNewLeads}</div>
//               <div className="text-xs text-muted-foreground">New Leads</div>
//             </div>
//             <div className="space-y-1">
//               <div className="text-lg sm:text-xl font-bold text-orange-600">{totalQualified}</div>
//               <div className="text-xs text-muted-foreground">Qualified ({qualificationRate}%)</div>
//             </div>
//             <div className="space-y-1">
//               <div className="text-lg sm:text-xl font-bold text-green-600">{totalConverted}</div>
//               <div className="text-xs text-muted-foreground">Converted</div>
//             </div>
//           </div>
          
//           {/* Trend Information */}
//           <div className="flex items-center justify-center gap-2 text-sm border-t pt-3">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               {Number(trendPercentage) > 0 ? (
//                 <>
//                   <TrendingUp className="h-4 w-4 text-green-600" />
//                   <span className="text-green-600">+{trendPercentage}%</span>
//                 </>
//               ) : Number(trendPercentage) < 0 ? (
//                 <>
//                   <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
//                   <span className="text-red-600">{trendPercentage}%</span>
//                 </>
//               ) : (
//                 <>
//                   <div className="h-4 w-4 bg-gray-400 rounded-full" />
//                   <span className="text-gray-600">No change</span>
//                 </>
//               )}
//               <span className="text-muted-foreground">recent trend</span>
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Import your server actions
import { getLeadAnalytics } from "@/actions/dashboard/d-actions"

// Type definitions
interface DailyLeadData {
  total: number;
  qualified: number;
  converted: number;
  date: string;
}

const chartConfig = {
  total: {
    label: "New Leads",
    color: "hsl(220, 70%, 50%)", // Blue
  },
  qualified: {
    label: "Qualified Leads",
    color: "hsl(160, 60%, 45%)", // Green
  },
  converted: {
    label: "Converted Leads",
    color: "hsl(30, 80%, 55%)", // Orange
  },
} satisfies ChartConfig

export default function LeadFunnelChart() {
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

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate performance metrics
  const totalNewLeads = data.reduce((sum, item) => sum + item.total, 0)
  const totalQualified = data.reduce((sum, item) => sum + item.qualified, 0)
  const totalConverted = data.reduce((sum, item) => sum + item.converted, 0)
  const conversionRate = totalNewLeads > 0 ? ((totalConverted / totalNewLeads) * 100).toFixed(1) : "0.0"
  const qualificationRate = totalNewLeads > 0 ? ((totalQualified / totalNewLeads) * 100).toFixed(1) : "0.0"
  
  // Calculate trend (comparing last half vs first half of data)
  const midpoint = Math.floor(data.length / 2)
  const recentData = data.slice(midpoint)
  const previousData = data.slice(0, midpoint)
  
  const recentAvg = recentData.length > 0 ? recentData.reduce((sum, item) => sum + item.converted, 0) / recentData.length : 0
  const previousAvg = previousData.length > 0 ? previousData.reduce((sum, item) => sum + item.converted, 0) / previousData.length : 0
  const trendPercentage = previousAvg > 0 ? (((recentAvg - previousAvg) / previousAvg) * 100).toFixed(1) : "0.0"

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Lead Generation Funnel</CardTitle>
            <CardDescription className="text-sm">
              Complete lead journey over the last 30 days
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-1 text-right">
            <div className="text-2xl font-bold text-primary">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Conversion Rate</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={35}
              />
              <ChartTooltip 
                cursor={{ strokeDasharray: "3 3", opacity: 0.5 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const newLeads = Number(payload.find(p => p.dataKey === 'total')?.value || 0)
                    const qualified = Number(payload.find(p => p.dataKey === 'qualified')?.value || 0)
                    const converted = Number(payload.find(p => p.dataKey === 'converted')?.value || 0)
                    const dayConversionRate = newLeads > 0 ? ((converted / newLeads) * 100).toFixed(1) : "0.0"
                    
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium mb-2">
                          {new Date(label).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-medium">{entry.value}</span>
                          </div>
                        ))}
                        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                          Conversion Rate: {dayConversionRate}%
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillQualified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(30, 80%, 55%)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="hsl(30, 80%, 55%)" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              
              <Area
                dataKey="total"
                stackId="1"
                stroke="hsl(220, 70%, 50%)"
                fill="url(#fillTotal)"
                strokeWidth={3}
                type="monotone"
              />
              <Area
                dataKey="qualified"
                stackId="2"
                stroke="hsl(160, 60%, 45%)"
                fill="url(#fillQualified)"
                strokeWidth={3}
                type="monotone"
              />
              <Area
                dataKey="converted"
                stackId="3"
                stroke="hsl(30, 80%, 55%)"
                fill="url(#fillConverted)"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="flex flex-col space-y-3 w-full">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold" style={{ color: "hsl(220, 70%, 50%)" }}>{totalNewLeads}</div>
              <div className="text-xs text-muted-foreground">New Leads</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold" style={{ color: "hsl(160, 60%, 45%)" }}>{totalQualified}</div>
              <div className="text-xs text-muted-foreground">Qualified ({qualificationRate}%)</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold" style={{ color: "hsl(30, 80%, 55%)" }}>{totalConverted}</div>
              <div className="text-xs text-muted-foreground">Converted</div>
            </div>
          </div>
          
          {/* Trend Information */}
          <div className="flex items-center justify-center gap-2 text-sm border-t pt-3">
            <div className="flex items-center gap-2 font-medium leading-none">
              {Number(trendPercentage) > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{trendPercentage}%</span>
                </>
              ) : Number(trendPercentage) < 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                  <span className="text-red-600">{trendPercentage}%</span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 bg-gray-400 rounded-full" />
                  <span className="text-gray-600">No change</span>
                </>
              )}
              <span className="text-muted-foreground">recent trend</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}