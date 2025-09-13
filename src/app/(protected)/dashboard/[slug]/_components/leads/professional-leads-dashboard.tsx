// "use client"

// import { useState, useMemo } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Switch } from "@/components/ui/switch"
// import {
//   Users,
//   TrendingUp,
//   Target,
//   BarChart3,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Brain,
//   Search,
//   Filter,
//   Mail,
//   Phone,
//   AlertTriangle,
//   Star,
//   Activity,
//   Zap,
//   LineChart,
//   PieChart,
//   Database,
//   TestTube,
// } from "lucide-react"
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart as RechartsPieChart,
//   Cell,
//   Pie, // Import Pie from recharts
// } from "recharts"

// interface ProfessionalLeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions: any[]
// }

// // Mock data generator for demo mode
// const generateMockData = () => ({
//   analytics: {
//     totalLeads: 1247,
//     qualifiedLeads: 342,
//     convertedLeads: 89,
//     conversionRate: 26.0,
//     qualificationRate: 27.4,
//     revenueMetrics: {
//       totalEstimatedRevenue: 2450000,
//       totalExpectedRevenue: 1890000,
//       averageROI: 340,
//       revenueGrowth: 23.5,
//     },
//     tierDistribution: {
//       platinum: 23,
//       gold: 67,
//       silver: 156,
//       bronze: 96,
//     },
//     premiumInsights: {
//       highValueLeads: 90,
//       averageLeadValue: 7150,
//       conversionProbability: 68,
//       totalPipelineValue: 2450000,
//     },
//   },
//   recentLeads: Array.from({ length: 15 }, (_, i) => ({
//     id: `mock-${i}`,
//     name: [`Sarah Johnson`, `Michael Chen`, `Emma Rodriguez`, `David Kim`, `Lisa Thompson`][i % 5],
//     email: [
//       `sarah.j@company.com`,
//       `m.chen@business.co`,
//       `emma.r@startup.io`,
//       `david@techcorp.com`,
//       `lisa@enterprise.net`,
//     ][i % 5],
//     phone: [`+1 (555) 123-4567`, `+1 (555) 234-5678`, `+1 (555) 345-6789`, `+1 (555) 456-7890`, `+1 (555) 567-8901`][
//       i % 5
//     ],
//     instagramUserId: [`sarahj_biz`, `michaelc_pro`, `emmarodriguez`, `davidkim_tech`, `lisathompson`][i % 5],
//     status: [`QUALIFIED`, `NEW`, `CONVERTING`, `QUALIFIED`, `NEW`][i % 5],
//     score: [85, 72, 91, 68, 79][i % 5],
//     lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//     metadata: {
//       lastAnalysis: {
//         leadTier: [`PLATINUM`, `GOLD`, `PLATINUM`, `SILVER`, `GOLD`][i % 5],
//         estimatedValue: [25000, 15000, 35000, 8000, 18000][i % 5],
//         roi: [450, 280, 520, 180, 320][i % 5],
//         notificationMessage: `High-value opportunity detected - immediate follow-up recommended`,
//         nextActions: [`immediate_call`, `send_proposal`, `email_sequence`],
//         followUpStrategy: `immediate_personal_outreach`,
//         buyerPersona: `engaged_prospect`,
//       },
//       marketingCompleteness: [95, 80, 100, 65, 85][i % 5],
//     },
//   })),
// })

// // Chart data generators
// const generateRevenueChartData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return Array.from({ length: 12 }, (_, i) => ({
//       month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
//       revenue: Math.floor(Math.random() * 200000) + 100000,
//       leads: Math.floor(Math.random() * 50) + 20,
//     }))
//   }

//   // Generate from real analytics data
//   return Array.from({ length: 6 }, (_, i) => ({
//     month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en", { month: "short" }),
//     revenue: (analytics?.revenueMetrics?.totalEstimatedRevenue || 0) * (0.8 + Math.random() * 0.4),
//     leads: (analytics?.totalLeads || 0) * (0.1 + Math.random() * 0.2),
//   }))
// }

// const generateConversionFunnelData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return [
//       { stage: "Visitors", count: 5420, color: "hsl(var(--chart-1))" },
//       { stage: "Leads", count: 1247, color: "hsl(var(--chart-2))" },
//       { stage: "Qualified", count: 342, color: "hsl(var(--chart-3))" },
//       { stage: "Converted", count: 89, color: "hsl(var(--chart-4))" },
//     ]
//   }

//   return [
//     { stage: "Visitors", count: (analytics?.totalLeads || 0) * 4, color: "hsl(var(--chart-1))" },
//     { stage: "Leads", count: analytics?.totalLeads || 0, color: "hsl(var(--chart-2))" },
//     { stage: "Qualified", count: analytics?.qualifiedLeads || 0, color: "hsl(var(--chart-3))" },
//     { stage: "Converted", count: analytics?.convertedLeads || 0, color: "hsl(var(--chart-4))" },
//   ]
// }

// // Utility functions
// const getRevenueDisplay = (value: number) => {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
//   return `$${value.toLocaleString()}`
// }

// const getTierBadge = (metadata: any) => {
//   const tier = metadata?.lastAnalysis?.leadTier || "BRONZE"
//   const colors = {
//     PLATINUM: "bg-purple-500/20 text-purple-300 border-purple-500/30",
//     GOLD: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
//     SILVER: "bg-gray-400/20 text-gray-300 border-gray-400/30",
//     BRONZE: "bg-orange-500/20 text-orange-300 border-orange-500/30",
//   }

//   const icons = {
//     PLATINUM: Crown,
//     GOLD: Award,
//     SILVER: Star,
//     BRONZE: Target,
//   }

//   const IconComponent = icons[tier as keyof typeof icons] || Target

//   return (
//     <Badge className={`${colors[tier as keyof typeof colors]} border`}>
//       <IconComponent className="w-3 h-3 mr-1" />
//       {tier}
//     </Badge>
//   )
// }

// const getStatusColor = (status: string) => {
//   const colors = {
//     NEW: "bg-blue-500/20 text-blue-300 border-blue-500/30",
//     QUALIFYING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
//     QUALIFIED: "bg-green-500/20 text-green-300 border-green-500/30",
//     CONVERTING: "bg-purple-500/20 text-purple-300 border-purple-500/30",
//     CONVERTED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
//     LOST: "bg-red-500/20 text-red-300 border-red-500/30",
//   }
//   return colors[status as keyof typeof colors] || colors.NEW
// }

// // Professional Analytics Cards Component
// function ProfessionalAnalyticsCards({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics?.totalLeads || 0,
//       subtitle: "AI-powered generation",
//       icon: Users,
//       color: "from-chart-1/20 to-chart-1/5 border-chart-1/30",
//       textColor: "text-chart-1",
//     },
//     {
//       title: "Qualified Leads",
//       value: analytics?.qualifiedLeads || 0,
//       subtitle: `${analytics?.conversionRate || 0}% conversion rate`,
//       icon: Target,
//       color: "from-chart-2/20 to-chart-2/5 border-chart-2/30",
//       textColor: "text-chart-2",
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics?.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//       color: "from-chart-3/20 to-chart-3/5 border-chart-3/30",
//       textColor: "text-chart-3",
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics?.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: TrendingUp,
//       color: "from-chart-4/20 to-chart-4/5 border-chart-4/30",
//       textColor: "text-chart-4",
//     },
//   ]

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         return (
//           <Card
//             key={index}
//             className={`bg-gradient-to-br ${card.color} border backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
//           >
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
//               <IconComponent className={`h-5 w-5 ${card.textColor}`} />
//             </CardHeader>
//             <CardContent>
//               <div className={`text-3xl font-bold ${card.textColor} mb-1`}>{card.value}</div>
//               <p className="text-xs text-muted-foreground flex items-center">
//                 <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
//                 {card.subtitle}
//               </p>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // Revenue Chart Component
// function RevenueChart({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateRevenueChartData(analytics, isMockMode)

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <LineChart className="h-5 w-5 text-chart-1" />
//           Revenue Trend
//         </CardTitle>
//         <CardDescription>Monthly revenue and lead generation performance</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//               <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
//               <YAxis
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickFormatter={(value) => getRevenueDisplay(value)}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--card))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "8px",
//                 }}
//                 labelStyle={{ color: "hsl(var(--foreground))" }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="hsl(var(--chart-1))"
//                 strokeWidth={2}
//                 fill="url(#revenueGradient)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Conversion Funnel Component
// function ConversionFunnel({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateConversionFunnelData(analytics, isMockMode)

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <BarChart3 className="h-5 w-5 text-chart-2" />
//           Conversion Funnel
//         </CardTitle>
//         <CardDescription>Lead progression through qualification stages</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//               <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
//               <YAxis type="category" dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--card))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "8px",
//                 }}
//               />
//               <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Lead Tier Distribution Component
// function LeadTierDistribution({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const tierData = isMockMode
//     ? generateMockData().analytics.tierDistribution
//     : analytics?.tierDistribution || { platinum: 0, gold: 0, silver: 0, bronze: 0 }

//   const data = [
//     { name: "Platinum", value: tierData.platinum, color: "hsl(var(--chart-1))" },
//     { name: "Gold", value: tierData.gold, color: "hsl(var(--chart-3))" },
//     { name: "Silver", value: tierData.silver, color: "hsl(var(--chart-4))" },
//     { name: "Bronze", value: tierData.bronze, color: "hsl(var(--chart-5))" },
//   ]

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5 text-chart-3" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-classified leads by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <RechartsPieChart>
//               <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--card))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "8px",
//                 }}
//               />
//             </RechartsPieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           {data.map((tier, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
//               <span className="text-sm text-muted-foreground">{tier.name}</span>
//               <span className="text-sm font-medium ml-auto">{tier.value}</span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Professional Leads Table Component
// function ProfessionalLeadsTable({
//   leads,
//   isMockMode,
// }: {
//   leads: any[]
//   isMockMode: boolean
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")

//   const displayLeads = isMockMode ? generateMockData().recentLeads : leads

//   const filteredLeads = useMemo(() => {
//     return displayLeads.filter((lead) => {
//       const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//       const matchesSearch =
//         !searchTerm ||
//         displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [displayLeads, searchTerm, statusFilter, tierFilter])

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5 text-chart-4" />
//               Lead Pipeline
//             </CardTitle>
//             <CardDescription>
//               {isMockMode ? "Demo data - " : "Live data - "}
//               {filteredLeads.length} qualified leads
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search leads..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 bg-background/50"
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-40 bg-background/50">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="NEW">New</SelectItem>
//               <SelectItem value="QUALIFIED">Qualified</SelectItem>
//               <SelectItem value="CONVERTING">Converting</SelectItem>
//               <SelectItem value="CONVERTED">Converted</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={tierFilter} onValueChange={setTierFilter}>
//             <SelectTrigger className="w-40 bg-background/50">
//               <Star className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Tier" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Tiers</SelectItem>
//               <SelectItem value="PLATINUM">Platinum</SelectItem>
//               <SelectItem value="GOLD">Gold</SelectItem>
//               <SelectItem value="SILVER">Silver</SelectItem>
//               <SelectItem value="BRONZE">Bronze</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Leads List */}
//         <ScrollArea className="h-96">
//           <div className="space-y-4">
//             {filteredLeads.length === 0 ? (
//               <div className="text-center py-12 text-muted-foreground">
//                 <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No leads found</p>
//                 <p className="text-sm">Try adjusting your filters</p>
//               </div>
//             ) : (
//               filteredLeads.map((lead) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//                 return (
//                   <div
//                     key={lead.id}
//                     className="p-6 border border-border/50 rounded-xl hover:bg-accent/5 transition-all duration-200 space-y-4"
//                   >
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-4">
//                         <Avatar className="h-12 w-12">
//                           <AvatarFallback className="bg-primary/20 text-primary font-semibold">
//                             {displayName.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-3">
//                             <h3 className="text-lg font-semibold">{displayName}</h3>
//                             {getTierBadge(lead.metadata)}
//                             <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                           </div>
//                           <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold text-chart-1">{lead.score}</div>
//                         <p className="text-xs text-muted-foreground">Lead Score</p>
//                       </div>
//                     </div>

//                     {/* Contact & Revenue Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground">CONTACT INFO</p>
//                         <div className="space-y-1">
//                           {lead.email && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Mail className="h-3 w-3 text-muted-foreground" />
//                               <span className="truncate">{lead.email}</span>
//                             </div>
//                           )}
//                           {lead.phone && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Phone className="h-3 w-3 text-muted-foreground" />
//                               <span>{lead.phone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground">REVENUE POTENTIAL</p>
//                         {lastAnalysis?.estimatedValue ? (
//                           <div className="text-lg font-bold text-chart-2">
//                             {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                           </div>
//                         ) : (
//                           <div className="text-sm text-muted-foreground">Not calculated</div>
//                         )}
//                         {lastAnalysis?.roi && (
//                           <div className="text-xs text-chart-3 font-medium">ROI: {lastAnalysis.roi}%</div>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground">PROFILE STATUS</p>
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs">Completeness</span>
//                             <span className="text-xs font-bold text-chart-4">{marketingCompleteness}%</span>
//                           </div>
//                           <Progress value={marketingCompleteness} className="h-1.5" />
//                         </div>
//                       </div>
//                     </div>

//                     {/* AI Insights */}
//                     {lastAnalysis?.notificationMessage && (
//                       <div className="bg-chart-1/10 border border-chart-1/20 rounded-lg p-3">
//                         <div className="flex items-start gap-2">
//                           <Brain className="w-4 h-4 text-chart-1 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-chart-1 font-medium">{lastAnalysis.notificationMessage}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function ProfessionalLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates,
//   duplicateCount,
//   userId,
//   onMergeDuplicates,
//   interactions,
// }: ProfessionalLeadsDashboardProps) {
//   const [isMockMode, setIsMockMode] = useState(false)

//   // Use mock data when in mock mode
//   const displayData = isMockMode ? generateMockData() : { analytics, recentLeads, topLeads }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
//       <div className="space-y-8 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           {/* <div>
//             <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
//               <div className="p-3 bg-gradient-to-br from-chart-1/20 to-chart-1/5 rounded-xl border border-chart-1/30">
//                 <Crown className="h-8 w-8 text-chart-1" />
//               </div>
//               <div>
//                 <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Revenue Intelligence
//                 </span>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="secondary" className="text-xs">
//                     <Zap className="h-3 w-3 mr-1" />
//                     AI-Powered
//                   </Badge>
//                   <Badge variant="outline" className="text-xs">
//                     <Activity className="h-3 w-3 mr-1" />
//                     Real-time
//                   </Badge>
//                 </div>
//               </div>
//             </h1>
//             <p className="text-muted-foreground mt-2 text-lg">
//               Professional lead qualification with revenue prediction
//             </p>
//           </div> */}

//           {/* Mock Data Toggle */}
//           <div className="flex items-center gap-4">
//             <div className="flex items-center space-x-2">
//               <TestTube className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">Demo Mode</span>
//               <Switch checked={isMockMode} onCheckedChange={setIsMockMode} />
//             </div>
//           </div>
//         </div>

//         {/* Mock Data Notice */}
//         {isMockMode && (
//           <Alert className="border-yellow-500/30 bg-yellow-500/10">
//             <AlertTriangle className="h-4 w-4 text-yellow-500" />
//             <AlertDescription className="text-yellow-200">
//               <strong>Demo Mode Active:</strong> Displaying mock data for demonstration. Switch off demo mode to view
//               live data when your account starts processing leads.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Duplicate Alert */}
//         {hasDuplicates && !isMockMode && (
//           <Alert className="border-orange-500/30 bg-orange-500/10">
//             <AlertTriangle className="h-4 w-4 text-orange-500" />
//             <AlertDescription className="text-orange-200">
//               Found {duplicateCount} potential duplicate leads.
//               <Button
//                 variant="link"
//                 className="p-0 h-auto text-orange-300 underline ml-1"
//                 onClick={() => onMergeDuplicates?.(userId)}
//               >
//                 Merge duplicates
//               </Button>
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Analytics Cards */}
//         <ProfessionalAnalyticsCards analytics={displayData.analytics} isMockMode={isMockMode} />

//         {/* Charts Grid */}
//         <div className="grid gap-6 md:grid-cols-2">
//           <RevenueChart analytics={displayData.analytics} isMockMode={isMockMode} />
//           <ConversionFunnel analytics={displayData.analytics} isMockMode={isMockMode} />
//         </div>

//         {/* Secondary Charts */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="md:col-span-2">
//             <ProfessionalLeadsTable leads={displayData.recentLeads} isMockMode={isMockMode} />
//           </div>
//           <LeadTierDistribution analytics={displayData.analytics} isMockMode={isMockMode} />
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useMemo } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Switch } from "@/components/ui/switch"
// import {
//   Users,
//   TrendingUp,
//   Target,
//   BarChart3,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Brain,
//   Search,
//   Filter,
//   Mail,
//   Phone,
//   AlertTriangle,
//   Star,
//   Activity,
//   Zap,
//   LineChart,
//   PieChart,
//   Database,
//   TestTube,
// } from "lucide-react"
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart as RechartsPieChart,
//   Cell,
//   Pie,
// } from "recharts"

// interface ProfessionalLeadsDashboardProps {
//   analytics?: any
//   recentLeads?: any[]
//   topLeads?: any[]
//   hasDuplicates?: boolean
//   duplicateCount?: number
//   userId?: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions?: any[]
// }

// // Mock data generator for demo mode
// const generateMockData = () => ({
//   analytics: {
//     totalLeads: 1247,
//     qualifiedLeads: 342,
//     convertedLeads: 89,
//     conversionRate: 26.0,
//     qualificationRate: 27.4,
//     revenueMetrics: {
//       totalEstimatedRevenue: 2450000,
//       totalExpectedRevenue: 1890000,
//       averageROI: 340,
//       revenueGrowth: 23.5,
//     },
//     tierDistribution: {
//       platinum: 23,
//       gold: 67,
//       silver: 156,
//       bronze: 96,
//     },
//     premiumInsights: {
//       highValueLeads: 90,
//       averageLeadValue: 7150,
//       conversionProbability: 68,
//       totalPipelineValue: 2450000,
//     },
//   },
//   recentLeads: Array.from({ length: 15 }, (_, i) => ({
//     id: `mock-${i}`,
//     name: [`Sarah Johnson`, `Michael Chen`, `Emma Rodriguez`, `David Kim`, `Lisa Thompson`][i % 5],
//     email: [
//       `sarah.j@company.com`,
//       `m.chen@business.co`,
//       `emma.r@startup.io`,
//       `david@techcorp.com`,
//       `lisa@enterprise.net`,
//     ][i % 5],
//     phone: [`+1 (555) 123-4567`, `+1 (555) 234-5678`, `+1 (555) 345-6789`, `+1 (555) 456-7890`, `+1 (555) 567-8901`][
//       i % 5
//     ],
//     instagramUserId: [`sarahj_biz`, `michaelc_pro`, `emmarodriguez`, `davidkim_tech`, `lisathompson`][i % 5],
//     status: [`QUALIFIED`, `NEW`, `CONVERTING`, `QUALIFIED`, `NEW`][i % 5],
//     score: [85, 72, 91, 68, 79][i % 5],
//     lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//     metadata: {
//       lastAnalysis: {
//         leadTier: [`PLATINUM`, `GOLD`, `PLATINUM`, `SILVER`, `GOLD`][i % 5],
//         estimatedValue: [25000, 15000, 35000, 8000, 18000][i % 5],
//         roi: [450, 280, 520, 180, 320][i % 5],
//         notificationMessage: `High-value opportunity detected - immediate follow-up recommended`,
//         nextActions: [`immediate_call`, `send_proposal`, `email_sequence`],
//         followUpStrategy: `immediate_personal_outreach`,
//         buyerPersona: `engaged_prospect`,
//       },
//       marketingCompleteness: [95, 80, 100, 65, 85][i % 5],
//     },
//   })),
// })

// // Chart data generators
// const generateRevenueChartData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return Array.from({ length: 12 }, (_, i) => ({
//       month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
//       revenue: Math.floor(Math.random() * 200000) + 100000,
//       leads: Math.floor(Math.random() * 50) + 20,
//     }))
//   }

//   return Array.from({ length: 6 }, (_, i) => ({
//     month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en", { month: "short" }),
//     revenue: (analytics?.revenueMetrics?.totalEstimatedRevenue || 0) * (0.8 + Math.random() * 0.4),
//     leads: (analytics?.totalLeads || 0) * (0.1 + Math.random() * 0.2),
//   }))
// }

// const generateConversionFunnelData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return [
//       { stage: "Visitors", count: 5420, color: "hsl(220 70% 50%)" },
//       { stage: "Leads", count: 1247, color: "hsl(160 60% 45%)" },
//       { stage: "Qualified", count: 342, color: "hsl(30 80% 55%)" },
//       { stage: "Converted", count: 89, color: "hsl(280 65% 60%)" },
//     ]
//   }

//   return [
//     { stage: "Visitors", count: (analytics?.totalLeads || 0) * 4, color: "hsl(220 70% 50%)" },
//     { stage: "Leads", count: analytics?.totalLeads || 0, color: "hsl(160 60% 45%)" },
//     { stage: "Qualified", count: analytics?.qualifiedLeads || 0, color: "hsl(30 80% 55%)" },
//     { stage: "Converted", count: analytics?.convertedLeads || 0, color: "hsl(280 65% 60%)" },
//   ]
// }

// // Utility functions
// const getRevenueDisplay = (value: number) => {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
//   return `$${value.toLocaleString()}`
// }

// const getTierBadge = (metadata: any) => {
//   const tier = metadata?.lastAnalysis?.leadTier || "BRONZE"
//   const colors = {
//     PLATINUM: "bg-purple-500/20 text-purple-300 border-purple-500/30",
//     GOLD: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
//     SILVER: "bg-gray-400/20 text-gray-300 border-gray-400/30",
//     BRONZE: "bg-orange-500/20 text-orange-300 border-orange-500/30",
//   }

//   const icons = {
//     PLATINUM: Crown,
//     GOLD: Award,
//     SILVER: Star,
//     BRONZE: Target,
//   }

//   const IconComponent = icons[tier as keyof typeof icons] || Target

//   return (
//     <Badge className={`${colors[tier as keyof typeof colors]} border`}>
//       <IconComponent className="w-3 h-3 mr-1" />
//       {tier}
//     </Badge>
//   )
// }

// const getStatusColor = (status: string) => {
//   const colors = {
//     NEW: "bg-blue-500/20 text-blue-300 border-blue-500/30",
//     QUALIFYING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
//     QUALIFIED: "bg-green-500/20 text-green-300 border-green-500/30",
//     CONVERTING: "bg-purple-500/20 text-purple-300 border-purple-500/30",
//     CONVERTED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
//     LOST: "bg-red-500/20 text-red-300 border-red-500/30",
//   }
//   return colors[status as keyof typeof colors] || colors.NEW
// }

// // Custom Tooltip Component
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-lg border bg-card/95 backdrop-blur-sm p-3 shadow-lg">
//         <p className="text-sm font-medium text-card-foreground mb-2">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <div key={index} className="flex items-center gap-2 text-sm">
//             <div
//               className="w-3 h-3 rounded-sm"
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="text-muted-foreground">{entry.name}:</span>
//             <span className="font-medium text-card-foreground">
//               {entry.name === 'revenue' ? getRevenueDisplay(entry.value) : entry.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

// // Professional Analytics Cards Component
// function ProfessionalAnalyticsCards({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics?.totalLeads || 0,
//       subtitle: "AI-powered generation",
//       icon: Users,
//       color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
//       textColor: "text-blue-400",
//     },
//     {
//       title: "Qualified Leads",
//       value: analytics?.qualifiedLeads || 0,
//       subtitle: `${analytics?.conversionRate || 0}% conversion rate`,
//       icon: Target,
//       color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
//       textColor: "text-emerald-400",
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics?.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//       color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
//       textColor: "text-amber-400",
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics?.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: TrendingUp,
//       color: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
//       textColor: "text-purple-400",
//     },
//   ]

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         return (
//           <Card
//             key={index}
//             className={`bg-gradient-to-br ${card.color} border backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
//           >
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
//               <IconComponent className={`h-5 w-5 ${card.textColor}`} />
//             </CardHeader>
//             <CardContent>
//               <div className={`text-3xl font-bold ${card.textColor} mb-1`}>{card.value}</div>
//               <p className="text-xs text-muted-foreground flex items-center">
//                 <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
//                 {card.subtitle}
//               </p>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // Revenue Chart Component
// function RevenueChart({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateRevenueChartData(analytics, isMockMode)

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <LineChart className="h-5 w-5 text-blue-400" />
//           Revenue Trend
//         </CardTitle>
//         <CardDescription>Monthly revenue and lead generation performance</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="hsl(220 70% 50%)" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="hsl(220 70% 50%)" stopOpacity={0.1} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
//               <XAxis 
//                 dataKey="month" 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//               />
//               <YAxis
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 tickFormatter={(value) => getRevenueDisplay(value)}
//               />
//               <Tooltip content={<CustomTooltip />} cursor={false} />
//               <Area
//                 type="natural"
//                 dataKey="revenue"
//                 stroke="hsl(220 70% 50%)"
//                 strokeWidth={2}
//                 fill="url(#revenueGradient)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Conversion Funnel Component
// function ConversionFunnel({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateConversionFunnelData(analytics, isMockMode)

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <BarChart3 className="h-5 w-5 text-emerald-400" />
//           Conversion Funnel
//         </CardTitle>
//         <CardDescription>Lead progression through qualification stages</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} horizontal={true} vertical={false} />
//               <XAxis 
//                 type="number" 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis 
//                 type="category" 
//                 dataKey="stage" 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12} 
//                 width={80}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.1 }} />
//               {data.map((entry, index) => (
//                 <Bar 
//                   key={index}
//                   dataKey="count" 
//                   fill={entry.color} 
//                   radius={[0, 4, 4, 0]}
//                   fillOpacity={0.8}
//                 />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Lead Tier Distribution Component
// function LeadTierDistribution({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const tierData = isMockMode
//     ? generateMockData().analytics.tierDistribution
//     : analytics?.tierDistribution || { platinum: 0, gold: 0, silver: 0, bronze: 0 }

//   const data = [
//     { name: "Platinum", value: tierData.platinum, color: "hsl(280 65% 60%)" },
//     { name: "Gold", value: tierData.gold, color: "hsl(30 80% 55%)" },
//     { name: "Silver", value: tierData.silver, color: "hsl(160 60% 45%)" },
//     { name: "Bronze", value: tierData.bronze, color: "hsl(220 70% 50%)" },
//   ]

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5 text-amber-400" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-classified leads by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <RechartsPieChart>
//               <Pie 
//                 data={data} 
//                 cx="50%" 
//                 cy="50%" 
//                 innerRadius={60} 
//                 outerRadius={120} 
//                 paddingAngle={5} 
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//             </RechartsPieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           {data.map((tier, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
//               <span className="text-sm text-muted-foreground">{tier.name}</span>
//               <span className="text-sm font-medium ml-auto">{tier.value}</span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Professional Leads Table Component
// function ProfessionalLeadsTable({
//   leads,
//   isMockMode,
// }: {
//   leads: any[]
//   isMockMode: boolean
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")

//   const displayLeads = isMockMode ? generateMockData().recentLeads : leads || []

//   const filteredLeads = useMemo(() => {
//     return displayLeads.filter((lead) => {
//       const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//       const matchesSearch =
//         !searchTerm ||
//         displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [displayLeads, searchTerm, statusFilter, tierFilter])

//   return (
//     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5 text-purple-400" />
//               Lead Pipeline
//             </CardTitle>
//             <CardDescription>
//               {isMockMode ? "Demo data - " : "Live data - "}
//               {filteredLeads.length} qualified leads
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search leads..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 bg-background/50"
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-40 bg-background/50">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="NEW">New</SelectItem>
//               <SelectItem value="QUALIFIED">Qualified</SelectItem>
//               <SelectItem value="CONVERTING">Converting</SelectItem>
//               <SelectItem value="CONVERTED">Converted</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={tierFilter} onValueChange={setTierFilter}>
//             <SelectTrigger className="w-40 bg-background/50">
//               <Star className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Tier" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Tiers</SelectItem>
//               <SelectItem value="PLATINUM">Platinum</SelectItem>
//               <SelectItem value="GOLD">Gold</SelectItem>
//               <SelectItem value="SILVER">Silver</SelectItem>
//               <SelectItem value="BRONZE">Bronze</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Leads List */}
//         <ScrollArea className="h-96">
//           <div className="space-y-4">
//             {filteredLeads.length === 0 ? (
//               <div className="text-center py-12 text-muted-foreground">
//                 <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No leads found</p>
//                 <p className="text-sm">Try adjusting your filters</p>
//               </div>
//             ) : (
//               filteredLeads.map((lead) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//                 return (
//                   <div
//                     key={lead.id}
//                     className="p-6 border border-border/50 rounded-xl hover:bg-accent/5 transition-all duration-200 space-y-4"
//                   >
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-4">
//                         <Avatar className="h-12 w-12">
//                           <AvatarFallback className="bg-primary/20 text-primary font-semibold">
//                             {displayName.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-3">
//                             <h3 className="text-lg font-semibold">{displayName}</h3>
//                             {getTierBadge(lead.metadata)}
//                             <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                           </div>
//                           <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold text-blue-400">{lead.score}</div>
//                         <p className="text-xs text-muted-foreground">Lead Score</p>
//                       </div>
//                     </div>

//                     {/* Contact & Revenue Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground">CONTACT INFO</p>
//                         <div className="space-y-1">
//                           {lead.email && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Mail className="h-3 w-3 text-muted-foreground" />
//                               <span className="truncate">{lead.email}</span>
//                             </div>
//                           )}
//                           {lead.phone && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Phone className="h-3 w-3 text-muted-foreground" />
//                               <span>{lead.phone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground">REVENUE POTENTIAL</p>
//                         {lastAnalysis?.estimatedValue ? (
//                           <div className="text-lg font-bold text-emerald-400">
//                             {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                           </div>
//                         ) : (
//                           <div className="text-sm text-muted-foreground">Not calculated</div>
//                         )}
//                         {lastAnalysis?.roi && (
//                           <div className="text-xs text-amber-400 font-medium">ROI: {lastAnalysis.roi}%</div>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground">PROFILE STATUS</p>
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs">Completeness</span>
//                             <span className="text-xs font-bold text-purple-400">{marketingCompleteness}%</span>
//                           </div>
//                           <Progress value={marketingCompleteness} className="h-1.5" />
//                         </div>
//                       </div>
//                     </div>

//                     {/* AI Insights */}
//                     {lastAnalysis?.notificationMessage && (
//                       <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
//                         <div className="flex items-start gap-2">
//                           <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-blue-300 font-medium">{lastAnalysis.notificationMessage}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function ProfessionalLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates = false,
//   duplicateCount = 0,
//   userId = "",
//   onMergeDuplicates,
//   interactions,
// }: ProfessionalLeadsDashboardProps) {
//   const [isMockMode, setIsMockMode] = useState(true)

//   // Use mock data when in mock mode
//   const displayData = isMockMode ? generateMockData() : { analytics, recentLeads, topLeads }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
//       <div className="space-y-8 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             {/* <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
//               <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl border border-blue-500/30">
//                 <Crown className="h-8 w-8 text-blue-400" />
//               </div>
//               <div>
//                 <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Revenue Intelligence
//                 </span>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="secondary" className="text-xs">
//                     <Zap className="h-3 w-3 mr-1" />
//                     AI-Powered
//                   </Badge>
//                   <Badge variant="outline" className="text-xs">
//                     <Activity className="h-3 w-3 mr-1" />
//                     Real-time
//                   </Badge>
//                 </div>
//               </div>
//             </h1>
//             <p className="text-muted-foreground mt-2 text-lg">
//               Professional lead qualification with revenue prediction
//             </p> */}
//           </div>

//           {/* Mock Data Toggle */}
//           <div className="flex items-center gap-4">
//             <div className="flex items-center space-x-2">
//               <TestTube className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">Demo Mode</span>
//               <Switch checked={isMockMode} onCheckedChange={setIsMockMode} />
//             </div>
//           </div>
//         </div>

//         {/* Mock Data Notice */}
//         {isMockMode && (
//           <Alert className="border-yellow-500/30 bg-yellow-500/10">
//             <AlertTriangle className="h-4 w-4 text-yellow-500" />
//             <AlertDescription className="text-yellow-200">
//               <strong>Demo Mode Active:</strong> Displaying mock data for demonstration. Switch off demo mode to view
//               live data when your account starts processing leads.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Duplicate Alert */}
//         {hasDuplicates && !isMockMode && (
//           <Alert className="border-orange-500/30 bg-orange-500/10">
//             <AlertTriangle className="h-4 w-4 text-orange-500" />
//             <AlertDescription className="text-orange-200">
//               Found {duplicateCount} potential duplicate leads.
//               <Button
//                 variant="link"
//                 className="p-0 h-auto text-orange-300 underline ml-1"
//                 onClick={() => onMergeDuplicates?.(userId)}
//               >
//                 Merge duplicates
//               </Button>
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Analytics Cards */}
//         <ProfessionalAnalyticsCards analytics={displayData.analytics} isMockMode={isMockMode} />

//         {/* Charts Grid */}
//         <div className="grid gap-6 md:grid-cols-2">
//           <RevenueChart analytics={displayData.analytics} isMockMode={isMockMode} />
//           <ConversionFunnel analytics={displayData.analytics} isMockMode={isMockMode} />
//         </div>

//         {/* Secondary Charts */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="md:col-span-2">
//             <ProfessionalLeadsTable leads={displayData.recentLeads || []} isMockMode={isMockMode} />
//           </div>
//           <LeadTierDistribution analytics={displayData.analytics} isMockMode={isMockMode} />
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useMemo } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Switch } from "@/components/ui/switch"
// import {
//   Users,
//   TrendingUp,
//   Target,
//   BarChart3,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Brain,
//   Search,
//   Filter,
//   Mail,
//   Phone,
//   AlertTriangle,
//   Star,
//   Activity,
//   Zap,
//   LineChart,
//   PieChart,
//   Database,
//   TestTube,
// } from "lucide-react"
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart as RechartsPieChart,
//   Cell,
//   Pie,
// } from "recharts"

// interface ProfessionalLeadsDashboardProps {
//   analytics?: any
//   recentLeads?: any[]
//   topLeads?: any[]
//   hasDuplicates?: boolean
//   duplicateCount?: number
//   userId?: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions?: any[]
// }

// // Mock data generator for demo mode
// const generateMockData = () => ({
//   analytics: {
//     totalLeads: 1247,
//     qualifiedLeads: 342,
//     convertedLeads: 89,
//     conversionRate: 26.0,
//     qualificationRate: 27.4,
//     revenueMetrics: {
//       totalEstimatedRevenue: 2450000,
//       totalExpectedRevenue: 1890000,
//       averageROI: 340,
//       revenueGrowth: 23.5,
//     },
//     tierDistribution: {
//       platinum: 23,
//       gold: 67,
//       silver: 156,
//       bronze: 96,
//     },
//     premiumInsights: {
//       highValueLeads: 90,
//       averageLeadValue: 7150,
//       conversionProbability: 68,
//       totalPipelineValue: 2450000,
//     },
//   },
//   recentLeads: Array.from({ length: 15 }, (_, i) => ({
//     id: `mock-${i}`,
//     name: [`Sarah Johnson`, `Michael Chen`, `Emma Rodriguez`, `David Kim`, `Lisa Thompson`][i % 5],
//     email: [
//       `sarah.j@company.com`,
//       `m.chen@business.co`,
//       `emma.r@startup.io`,
//       `david@techcorp.com`,
//       `lisa@enterprise.net`,
//     ][i % 5],
//     phone: [`+1 (555) 123-4567`, `+1 (555) 234-5678`, `+1 (555) 345-6789`, `+1 (555) 456-7890`, `+1 (555) 567-8901`][
//       i % 5
//     ],
//     instagramUserId: [`sarahj_biz`, `michaelc_pro`, `emmarodriguez`, `davidkim_tech`, `lisathompson`][i % 5],
//     status: [`QUALIFIED`, `NEW`, `CONVERTING`, `QUALIFIED`, `NEW`][i % 5],
//     score: [85, 72, 91, 68, 79][i % 5],
//     lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//     metadata: {
//       lastAnalysis: {
//         leadTier: [`PLATINUM`, `GOLD`, `PLATINUM`, `SILVER`, `GOLD`][i % 5],
//         estimatedValue: [25000, 15000, 35000, 8000, 18000][i % 5],
//         roi: [450, 280, 520, 180, 320][i % 5],
//         notificationMessage: `High-value opportunity detected - immediate follow-up recommended`,
//         nextActions: [`immediate_call`, `send_proposal`, `email_sequence`],
//         followUpStrategy: `immediate_personal_outreach`,
//         buyerPersona: `engaged_prospect`,
//       },
//       marketingCompleteness: [95, 80, 100, 65, 85][i % 5],
//     },
//   })),
// })

// // Chart data generators
// const generateRevenueChartData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return Array.from({ length: 12 }, (_, i) => ({
//       month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
//       revenue: Math.floor(Math.random() * 200000) + 100000,
//       leads: Math.floor(Math.random() * 50) + 20,
//     }))
//   }

//   return Array.from({ length: 6 }, (_, i) => ({
//     month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en", { month: "short" }),
//     revenue: (analytics?.revenueMetrics?.totalEstimatedRevenue || 0) * (0.8 + Math.random() * 0.4),
//     leads: (analytics?.totalLeads || 0) * (0.1 + Math.random() * 0.2),
//   }))
// }

// const generateConversionFunnelData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return [
//       { stage: "Visitors", count: 5420, color: "hsl(var(--chart-1))" },
//       { stage: "Leads", count: 1247, color: "hsl(var(--chart-2))" },
//       { stage: "Qualified", count: 342, color: "hsl(var(--chart-3))" },
//       { stage: "Converted", count: 89, color: "hsl(var(--chart-4))" },
//     ]
//   }

//   return [
//     { stage: "Visitors", count: (analytics?.totalLeads || 0) * 4, color: "hsl(var(--chart-1))" },
//     { stage: "Leads", count: analytics?.totalLeads || 0, color: "hsl(var(--chart-2))" },
//     { stage: "Qualified", count: analytics?.qualifiedLeads || 0, color: "hsl(var(--chart-3))" },
//     { stage: "Converted", count: analytics?.convertedLeads || 0, color: "hsl(var(--chart-4))" },
//   ]
// }

// // Utility functions
// const getRevenueDisplay = (value: number) => {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
//   return `$${value.toLocaleString()}`
// }

// const getTierBadge = (metadata: any) => {
//   const tier = metadata?.lastAnalysis?.leadTier || "BRONZE"
  
//   const configs = {
//     PLATINUM: { variant: "default", icon: Crown },
//     GOLD: { variant: "secondary", icon: Award },
//     SILVER: { variant: "outline", icon: Star },
//     BRONZE: { variant: "outline", icon: Target },
//   }

//   const config = configs[tier as keyof typeof configs] || configs.BRONZE
//   const IconComponent = config.icon

//   return (
//     <Badge variant={config.variant as any} className="gap-1">
//       <IconComponent className="w-3 h-3" />
//       {tier}
//     </Badge>
//   )
// }

// const getStatusBadge = (status: string) => {
//   const configs = {
//     NEW: { variant: "outline", className: "" },
//     QUALIFYING: { variant: "secondary", className: "" },
//     QUALIFIED: { variant: "default", className: "" },
//     CONVERTING: { variant: "default", className: "bg-chart-4" },
//     CONVERTED: { variant: "default", className: "bg-chart-2" },
//     LOST: { variant: "destructive", className: "" },
//   }
  
//   const config = configs[status as keyof typeof configs] || configs.NEW
  
//   return (
//     <Badge variant={config.variant as any} className={config.className}>
//       {status}
//     </Badge>
//   )
// }

// // Custom Tooltip Component
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-lg border bg-popover/95 backdrop-blur-sm p-3 shadow-md">
//         <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <div key={index} className="flex items-center gap-2 text-sm">
//             <div
//               className="w-3 h-3 rounded-sm"
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="text-muted-foreground">{entry.name}:</span>
//             <span className="font-medium text-popover-foreground">
//               {entry.name === 'revenue' ? getRevenueDisplay(entry.value) : entry.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

// // Professional Analytics Cards Component
// function ProfessionalAnalyticsCards({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics?.totalLeads || 0,
//       subtitle: "AI-powered generation",
//       icon: Users,
//     },
//     {
//       title: "Qualified Leads",
//       value: analytics?.qualifiedLeads || 0,
//       subtitle: `${analytics?.conversionRate || 0}% conversion rate`,
//       icon: Target,
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics?.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics?.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: TrendingUp,
//     },
//   ]

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         return (
//           <Card key={index} className="relative">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
//               <IconComponent className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{card.value}</div>
//               <p className="text-xs text-muted-foreground flex items-center mt-1">
//                 <ArrowUpRight className="h-3 w-3 mr-1" />
//                 {card.subtitle}
//               </p>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // Revenue Chart Component
// function RevenueChart({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateRevenueChartData(analytics, isMockMode)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <LineChart className="h-5 w-5" />
//           Revenue Trend
//         </CardTitle>
//         <CardDescription>Monthly revenue and lead generation performance</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
//               <XAxis 
//                 dataKey="month" 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => getRevenueDisplay(value)}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="hsl(var(--chart-1))"
//                 strokeWidth={2}
//                 fill="url(#revenueGradient)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Conversion Funnel Component
// function ConversionFunnel({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateConversionFunnelData(analytics, isMockMode)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <BarChart3 className="h-5 w-5" />
//           Conversion Funnel
//         </CardTitle>
//         <CardDescription>Lead progression through qualification stages</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//               <XAxis 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Lead Tier Distribution Component
// function LeadTierDistribution({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const tierData = isMockMode
//     ? generateMockData().analytics.tierDistribution
//     : analytics?.tierDistribution || { platinum: 0, gold: 0, silver: 0, bronze: 0 }

//   const data = [
//     { name: "Platinum", value: tierData.platinum, color: "hsl(var(--chart-4))" },
//     { name: "Gold", value: tierData.gold, color: "hsl(var(--chart-3))" },
//     { name: "Silver", value: tierData.silver, color: "hsl(var(--chart-2))" },
//     { name: "Bronze", value: tierData.bronze, color: "hsl(var(--chart-1))" },
//   ]

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-classified leads by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <RechartsPieChart>
//               <Pie 
//                 data={data} 
//                 cx="50%" 
//                 cy="50%" 
//                 innerRadius={60} 
//                 outerRadius={120} 
//                 paddingAngle={5} 
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//             </RechartsPieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           {data.map((tier, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
//               <span className="text-sm text-muted-foreground">{tier.name}</span>
//               <span className="text-sm font-medium ml-auto">{tier.value}</span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Professional Leads Table Component
// function ProfessionalLeadsTable({
//   leads,
//   isMockMode,
// }: {
//   leads: any[]
//   isMockMode: boolean
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")

//   const displayLeads = isMockMode ? generateMockData().recentLeads : leads || []

//   const filteredLeads = useMemo(() => {
//     return displayLeads.filter((lead) => {
//       const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//       const matchesSearch =
//         !searchTerm ||
//         displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [displayLeads, searchTerm, statusFilter, tierFilter])

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               Lead Pipeline
//             </CardTitle>
//             <CardDescription>
//               {isMockMode ? "Demo data - " : "Live data - "}
//               {filteredLeads.length} qualified leads
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search leads..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-40">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="NEW">New</SelectItem>
//               <SelectItem value="QUALIFIED">Qualified</SelectItem>
//               <SelectItem value="CONVERTING">Converting</SelectItem>
//               <SelectItem value="CONVERTED">Converted</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={tierFilter} onValueChange={setTierFilter}>
//             <SelectTrigger className="w-40">
//               <Star className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Tier" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Tiers</SelectItem>
//               <SelectItem value="PLATINUM">Platinum</SelectItem>
//               <SelectItem value="GOLD">Gold</SelectItem>
//               <SelectItem value="SILVER">Silver</SelectItem>
//               <SelectItem value="BRONZE">Bronze</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Leads List */}
//         <ScrollArea className="h-96">
//           <div className="space-y-4">
//             {filteredLeads.length === 0 ? (
//               <div className="text-center py-12">
//                 <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
//                 <p className="text-lg font-medium">No leads found</p>
//                 <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
//               </div>
//             ) : (
//               filteredLeads.map((lead) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//                 return (
//                   <div
//                     key={lead.id}
//                     className="p-6 border rounded-lg hover:bg-accent/50 transition-colors space-y-4"
//                   >
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-4">
//                         <Avatar className="h-12 w-12">
//                           <AvatarFallback className="bg-muted font-semibold">
//                             {displayName.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-3">
//                             <h3 className="text-lg font-semibold">{displayName}</h3>
//                             {getTierBadge(lead.metadata)}
//                             {getStatusBadge(lead.status)}
//                           </div>
//                           <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold">{lead.score}</div>
//                         <p className="text-xs text-muted-foreground">Lead Score</p>
//                       </div>
//                     </div>

//                     {/* Contact & Revenue Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Info</p>
//                         <div className="space-y-1">
//                           {lead.email && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Mail className="h-3 w-3 text-muted-foreground" />
//                               <span className="truncate">{lead.email}</span>
//                             </div>
//                           )}
//                           {lead.phone && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Phone className="h-3 w-3 text-muted-foreground" />
//                               <span>{lead.phone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revenue Potential</p>
//                         {lastAnalysis?.estimatedValue ? (
//                           <div className="text-lg font-bold">
//                             {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                           </div>
//                         ) : (
//                           <div className="text-sm text-muted-foreground">Not calculated</div>
//                         )}
//                         {lastAnalysis?.roi && (
//                           <div className="text-xs text-muted-foreground">ROI: {lastAnalysis.roi}%</div>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Profile Status</p>
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs">Completeness</span>
//                             <span className="text-xs font-bold">{marketingCompleteness}%</span>
//                           </div>
//                           <Progress value={marketingCompleteness} className="h-2" />
//                         </div>
//                       </div>
//                     </div>

//                     {/* AI Insights */}
//                     {lastAnalysis?.notificationMessage && (
//                       <div className="bg-muted/50 border rounded-md p-3">
//                         <div className="flex items-start gap-2">
//                           <Brain className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
//                           <p className="text-sm font-medium">{lastAnalysis.notificationMessage}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function ProfessionalLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates = false,
//   duplicateCount = 0,
//   userId = "",
//   onMergeDuplicates,
//   interactions,
// }: ProfessionalLeadsDashboardProps) {
//   const [isMockMode, setIsMockMode] = useState(true)

//   // Use mock data when in mock mode
//   const displayData = isMockMode ? generateMockData() : { analytics, recentLeads, topLeads }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="space-y-8 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center space-x-2">
//               <TestTube className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">Demo Mode</span>
//               <Switch checked={isMockMode} onCheckedChange={setIsMockMode} />
//             </div>
//           </div>
//         </div>

//         {/* Mock Data Notice */}
//         {isMockMode && (
//           <Alert>
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription>
//               <strong>Demo Mode Active:</strong> Displaying mock data for demonstration. Switch off demo mode to view
//               live data when your account starts processing leads.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Duplicate Alert */}
//         {hasDuplicates && !isMockMode && (
//           <Alert variant="destructive">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription>
//               Found {duplicateCount} potential duplicate leads.
//               <Button
//                 variant="link"
//                 className="p-0 h-auto ml-1"
//                 onClick={() => onMergeDuplicates?.(userId)}
//               >
//                 Merge duplicates
//               </Button>
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Analytics Cards */}
//         <ProfessionalAnalyticsCards analytics={displayData.analytics} isMockMode={isMockMode} />

//         {/* Charts Grid */}
//         <div className="grid gap-6 md:grid-cols-2">
//           <RevenueChart analytics={displayData.analytics} isMockMode={isMockMode} />
//           <ConversionFunnel analytics={displayData.analytics} isMockMode={isMockMode} />
//         </div>

//         {/* Secondary Charts */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="md:col-span-2">
//             <ProfessionalLeadsTable leads={displayData.recentLeads || []} isMockMode={isMockMode} />
//           </div>
//           <LeadTierDistribution analytics={displayData.analytics} isMockMode={isMockMode} />
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useMemo } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Switch } from "@/components/ui/switch"
// import {
//   Users,
//   TrendingUp,
//   Target,
//   BarChart3,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Brain,
//   Search,
//   Filter,
//   Mail,
//   Phone,
//   AlertTriangle,
//   Star,
//   Activity,
//   Zap,
//   LineChart,
//   PieChart,
//   Database,
//   TestTube,
//   Calendar,
//   TrendingDown,
// } from "lucide-react"
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart as RechartsPieChart,
//   Cell,
//   Pie,
//   Rectangle,
// } from "recharts"

// interface ProfessionalLeadsDashboardProps {
//   analytics?: any
//   recentLeads?: any[]
//   topLeads?: any[]
//   hasDuplicates?: boolean
//   duplicateCount?: number
//   userId?: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions?: any[]
// }

// type TimePeriod = "7d" | "30d" | "90d" | "6m" | "1y" | "all"

// // Mock data generator for demo mode
// const generateMockData = (period: TimePeriod = "30d") => {
//   const periodMultiplier = {
//     "7d": 0.2,
//     "30d": 1,
//     "90d": 3,
//     "6m": 6,
//     "1y": 12,
//     "all": 24
//   }[period]

//   const baseMetrics = {
//     totalLeads: Math.floor(1247 * periodMultiplier),
//     qualifiedLeads: Math.floor(342 * periodMultiplier),
//     convertedLeads: Math.floor(89 * periodMultiplier),
//     conversionRate: 26.0,
//     qualificationRate: 27.4,
//     revenueMetrics: {
//       totalEstimatedRevenue: Math.floor(2450000 * periodMultiplier),
//       totalExpectedRevenue: Math.floor(1890000 * periodMultiplier),
//       averageROI: 340,
//       revenueGrowth: Math.random() > 0.5 ? 23.5 : -8.2,
//     },
//     tierDistribution: {
//       platinum: Math.floor(23 * periodMultiplier),
//       gold: Math.floor(67 * periodMultiplier),
//       silver: Math.floor(156 * periodMultiplier),
//       bronze: Math.floor(96 * periodMultiplier),
//     },
//     premiumInsights: {
//       highValueLeads: Math.floor(90 * periodMultiplier),
//       averageLeadValue: 7150,
//       conversionProbability: 68,
//       totalPipelineValue: Math.floor(2450000 * periodMultiplier),
//     },
//   }

//   return {
//     analytics: baseMetrics,
//     recentLeads: Array.from({ length: 15 }, (_, i) => ({
//       id: `mock-${i}`,
//       name: [`Sarah Johnson`, `Michael Chen`, `Emma Rodriguez`, `David Kim`, `Lisa Thompson`][i % 5],
//       email: [
//         `sarah.j@company.com`,
//         `m.chen@business.co`,
//         `emma.r@startup.io`,
//         `david@techcorp.com`,
//         `lisa@enterprise.net`,
//       ][i % 5],
//       phone: [`+1 (555) 123-4567`, `+1 (555) 234-5678`, `+1 (555) 345-6789`, `+1 (555) 456-7890`, `+1 (555) 567-8901`][
//         i % 5
//       ],
//       instagramUserId: [`sarahj_biz`, `michaelc_pro`, `emmarodriguez`, `davidkim_tech`, `lisathompson`][i % 5],
//       status: [`QUALIFIED`, `NEW`, `CONVERTING`, `QUALIFIED`, `NEW`][i % 5],
//       score: [85, 72, 91, 68, 79][i % 5],
//       lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//       metadata: {
//         lastAnalysis: {
//           leadTier: [`PLATINUM`, `GOLD`, `PLATINUM`, `SILVER`, `GOLD`][i % 5],
//           estimatedValue: [25000, 15000, 35000, 8000, 18000][i % 5],
//           roi: [450, 280, 520, 180, 320][i % 5],
//           notificationMessage: `High-value opportunity detected - immediate follow-up recommended`,
//           nextActions: [`immediate_call`, `send_proposal`, `email_sequence`],
//           followUpStrategy: `immediate_personal_outreach`,
//           buyerPersona: `engaged_prospect`,
//         },
//         marketingCompleteness: [95, 80, 100, 65, 85][i % 5],
//       },
//     })),
//   }
// }

// // Chart data generators
// const generateRevenueChartData = (analytics: any, isMockMode: boolean, period: TimePeriod) => {
//   const dataPoints = {
//     "7d": { count: 7, unit: "day" },
//     "30d": { count: 30, unit: "day" },
//     "90d": { count: 12, unit: "week" },
//     "6m": { count: 6, unit: "month" },
//     "1y": { count: 12, unit: "month" },
//     "all": { count: 24, unit: "month" }
//   }[period]

//   if (isMockMode) {
//     return Array.from({ length: dataPoints.count }, (_, i) => {
//       const date = new Date()
//       if (dataPoints.unit === "day") {
//         date.setDate(date.getDate() - (dataPoints.count - 1 - i))
//         return {
//           period: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
//           revenue: Math.floor(Math.random() * 50000) + 10000,
//           leads: Math.floor(Math.random() * 20) + 5,
//         }
//       } else if (dataPoints.unit === "week") {
//         date.setDate(date.getDate() - (dataPoints.count - 1 - i) * 7)
//         return {
//           period: `Week ${i + 1}`,
//           revenue: Math.floor(Math.random() * 150000) + 50000,
//           leads: Math.floor(Math.random() * 50) + 20,
//         }
//       } else {
//         date.setMonth(date.getMonth() - (dataPoints.count - 1 - i))
//         return {
//           period: date.toLocaleDateString("en", { month: "short", year: "2-digit" }),
//           revenue: Math.floor(Math.random() * 300000) + 100000,
//           leads: Math.floor(Math.random() * 100) + 50,
//         }
//       }
//     })
//   }

//   return Array.from({ length: dataPoints.count }, (_, i) => ({
//     period: new Date(Date.now() - (dataPoints.count - 1 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en", { month: "short" }),
//     revenue: (analytics?.revenueMetrics?.totalEstimatedRevenue || 0) * (0.8 + Math.random() * 0.4),
//     leads: (analytics?.totalLeads || 0) * (0.1 + Math.random() * 0.2),
//   }))
// }

// const generateConversionFunnelData = (analytics: any, isMockMode: boolean) => {
//   if (isMockMode) {
//     return [
//       { stage: "Visitors", count: 5420, fill: "var(--chart-1)" },
//       { stage: "Leads", count: 1247, fill: "var(--chart-2)" },
//       { stage: "Qualified", count: 342, fill: "var(--chart-3)" },
//       { stage: "Converted", count: 89, fill: "var(--chart-4)" },
//     ]
//   }

//   return [
//     { stage: "Visitors", count: (analytics?.totalLeads || 0) * 4, fill: "var(--chart-1)" },
//     { stage: "Leads", count: analytics?.totalLeads || 0, fill: "var(--chart-2)" },
//     { stage: "Qualified", count: analytics?.qualifiedLeads || 0, fill: "var(--chart-3)" },
//     { stage: "Converted", count: analytics?.convertedLeads || 0, fill: "var(--chart-4)" },
//   ]
// }

// // Utility functions
// const getRevenueDisplay = (value: number) => {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
//   return `$${value.toLocaleString()}`
// }

// const getPeriodLabel = (period: TimePeriod) => {
//   const labels = {
//     "7d": "Last 7 days",
//     "30d": "Last 30 days", 
//     "90d": "Last 90 days",
//     "6m": "Last 6 months",
//     "1y": "Last 12 months",
//     "all": "All time"
//   }
//   return labels[period]
// }

// const getTierBadge = (metadata: any) => {
//   const tier = metadata?.lastAnalysis?.leadTier || "BRONZE"
  
//   const configs = {
//     PLATINUM: { variant: "default", icon: Crown },
//     GOLD: { variant: "secondary", icon: Award },
//     SILVER: { variant: "outline", icon: Star },
//     BRONZE: { variant: "outline", icon: Target },
//   }

//   const config = configs[tier as keyof typeof configs] || configs.BRONZE
//   const IconComponent = config.icon

//   return (
//     <Badge variant={config.variant as any} className="gap-1">
//       <IconComponent className="w-3 h-3" />
//       {tier}
//     </Badge>
//   )
// }

// const getStatusBadge = (status: string) => {
//   const configs = {
//     NEW: { variant: "outline", className: "" },
//     QUALIFYING: { variant: "secondary", className: "" },
//     QUALIFIED: { variant: "default", className: "" },
//     CONVERTING: { variant: "default", className: "bg-chart-4" },
//     CONVERTED: { variant: "default", className: "bg-chart-2" },
//     LOST: { variant: "destructive", className: "" },
//   }
  
//   const config = configs[status as keyof typeof configs] || configs.NEW
  
//   return (
//     <Badge variant={config.variant as any} className={config.className}>
//       {status}
//     </Badge>
//   )
// }

// // Custom Tooltip Component
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-lg border bg-popover/95 backdrop-blur-sm p-3 shadow-md">
//         <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <div key={index} className="flex items-center gap-2 text-sm">
//             <div
//               className="w-3 h-3 rounded-sm"
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="text-muted-foreground">{entry.name}:</span>
//             <span className="font-medium text-popover-foreground">
//               {entry.name === 'revenue' ? getRevenueDisplay(entry.value) : entry.value.toLocaleString()}
//             </span>
//           </div>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

// // Time Period Selector Component
// function TimePeriodSelector({ value, onValueChange }: { value: TimePeriod; onValueChange: (value: TimePeriod) => void }) {
//   return (
//     <Select value={value} onValueChange={onValueChange}>
//       <SelectTrigger className="w-40">
//         <Calendar className="h-4 w-4 mr-2" />
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="7d">Last 7 days</SelectItem>
//         <SelectItem value="30d">Last 30 days</SelectItem>
//         <SelectItem value="90d">Last 90 days</SelectItem>
//         <SelectItem value="6m">Last 6 months</SelectItem>
//         <SelectItem value="1y">Last 12 months</SelectItem>
//         <SelectItem value="all">All time</SelectItem>
//       </SelectContent>
//     </Select>
//   )
// }

// // Professional Analytics Cards Component
// function ProfessionalAnalyticsCards({ analytics, isMockMode, period }: { analytics: any; isMockMode: boolean; period: TimePeriod }) {
//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics?.totalLeads || 0,
//       subtitle: "AI-powered generation",
//       icon: Users,
//       trend: analytics?.revenueMetrics?.revenueGrowth > 0 ? "up" : "down",
//       trendValue: "12.5%"
//     },
//     {
//       title: "Qualified Leads", 
//       value: analytics?.qualifiedLeads || 0,
//       subtitle: `${(analytics?.qualificationRate || 0).toFixed(1)}% qualification rate`,
//       icon: Target,
//       trend: "up",
//       trendValue: "8.2%"
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics?.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//       trend: analytics?.revenueMetrics?.revenueGrowth > 0 ? "up" : "down",
//       trendValue: `${Math.abs(analytics?.revenueMetrics?.revenueGrowth || 0).toFixed(1)}%`
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics?.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: TrendingUp,
//       trend: "up",
//       trendValue: "15.3%"
//     },
//   ]

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown
//         return (
//           <Card key={index} className="relative">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
//               <IconComponent className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{card.value}</div>
//               <p className="text-xs text-muted-foreground flex items-center mt-1">
//                 <TrendIcon className={`h-3 w-3 mr-1 ${card.trend === "up" ? "text-green-600" : "text-red-600"}`} />
//                 <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>{card.trendValue}</span>
//                 <span className="ml-1">{card.subtitle}</span>
//               </p>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // Revenue Chart Component
// function RevenueChart({ analytics, isMockMode, period }: { analytics: any; isMockMode: boolean; period: TimePeriod }) {
//   const data = generateRevenueChartData(analytics, isMockMode, period)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <LineChart className="h-5 w-5" />
//           Revenue Trend
//         </CardTitle>
//         <CardDescription>Revenue and lead generation for {getPeriodLabel(period).toLowerCase()}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
//               <XAxis 
//                 dataKey="period" 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => getRevenueDisplay(value)}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="hsl(var(--chart-1))"
//                 strokeWidth={2}
//                 fill="url(#revenueGradient)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 leading-none font-medium">
//           {analytics?.revenueMetrics?.revenueGrowth > 0 ? (
//             <>
//               Trending up by {analytics.revenueMetrics.revenueGrowth.toFixed(1)}% <TrendingUp className="h-4 w-4 text-green-600" />
//             </>
//           ) : (
//             <>
//               Trending down by {Math.abs(analytics?.revenueMetrics?.revenueGrowth || 0).toFixed(1)}% <TrendingDown className="h-4 w-4 text-red-600" />
//             </>
//           )}
//         </div>
//         <div className="text-muted-foreground leading-none">
//           Showing revenue performance for {getPeriodLabel(period).toLowerCase()}
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

// // Enhanced Conversion Funnel Component
// function ConversionFunnel({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const data = generateConversionFunnelData(analytics, isMockMode)
//   const [activeIndex, setActiveIndex] = useState(1)

//   // Calculate conversion rates
//   const conversionRates = data.map((item, index) => {
//     if (index === 0) return null
//     const previousStage = data[index - 1]
//     const rate = previousStage ? ((item.count / previousStage.count) * 100).toFixed(1) : "0"
//     return `${rate}%`
//   }).filter(Boolean)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <BarChart3 className="h-5 w-5" />
//           Conversion Funnel
//         </CardTitle>
//         <CardDescription>Lead progression through qualification stages</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart 
//               data={data} 
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               onMouseMove={(state) => {
//                 if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
//                   setActiveIndex(state.activeTooltipIndex)
//                 }
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
//               <XAxis 
//                 dataKey="stage"
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis 
//                 stroke="hsl(var(--muted-foreground))" 
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => value.toLocaleString()}
//               />
//               <Tooltip 
//                 cursor={false}
//                 content={<CustomTooltip />}
//               />
//               <Bar 
//                 dataKey="count" 
//                 strokeWidth={2}
//                 radius={[8, 8, 0, 0]}
//                 activeBar={({ ...props }) => {
//                   return (
//                     <Rectangle
//                       {...props}
//                       fillOpacity={0.8}
//                       stroke={props.payload.fill}
//                       strokeDasharray={4}
//                       strokeDashoffset={4}
//                     />
//                   )
//                 }}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 leading-none font-medium">
//           Overall conversion rate: {((data[3]?.count / data[0]?.count) * 100).toFixed(1)}% <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="text-muted-foreground leading-none">
//           Stage conversion rates: {conversionRates.join(" → ")}
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

// // Lead Tier Distribution Component
// function LeadTierDistribution({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
//   const tierData = isMockMode
//     ? generateMockData().analytics.tierDistribution
//     : analytics?.tierDistribution || { platinum: 0, gold: 0, silver: 0, bronze: 0 }

//   const data = [
//     { name: "Platinum", value: tierData.platinum, color: "var(--chart-4)" },
//     { name: "Gold", value: tierData.gold, color: "var(--chart-3)" },
//     { name: "Silver", value: tierData.silver, color: "var(--chart-2)" },
//     { name: "Bronze", value: tierData.bronze, color: "var(--chart-1)" },
//   ]

//   const total = data.reduce((sum, tier) => sum + tier.value, 0)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-classified leads by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <RechartsPieChart>
//               <Pie 
//                 data={data} 
//                 cx="50%" 
//                 cy="50%" 
//                 innerRadius={60} 
//                 outerRadius={120} 
//                 paddingAngle={5} 
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//             </RechartsPieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           {data.map((tier, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
//               <span className="text-sm text-muted-foreground">{tier.name}</span>
//               <span className="text-sm font-medium ml-auto">{tier.value}</span>
//               <span className="text-xs text-muted-foreground">
//                 ({total > 0 ? ((tier.value / total) * 100).toFixed(0) : 0}%)
//               </span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Professional Leads Table Component
// function ProfessionalLeadsTable({
//   leads,
//   isMockMode,
// }: {
//   leads: any[]
//   isMockMode: boolean
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")

//   const displayLeads = isMockMode ? generateMockData().recentLeads : leads || []

//   const filteredLeads = useMemo(() => {
//     return displayLeads.filter((lead) => {
//       const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//       const matchesSearch =
//         !searchTerm ||
//         displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [displayLeads, searchTerm, statusFilter, tierFilter])

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               Lead Pipeline
//             </CardTitle>
//             <CardDescription>
//               {isMockMode ? "Demo data - " : "Live data - "}
//               {filteredLeads.length} qualified leads
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search leads..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-40">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="NEW">New</SelectItem>
//               <SelectItem value="QUALIFIED">Qualified</SelectItem>
//               <SelectItem value="CONVERTING">Converting</SelectItem>
//               <SelectItem value="CONVERTED">Converted</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={tierFilter} onValueChange={setTierFilter}>
//             <SelectTrigger className="w-40">
//               <Star className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Tier" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Tiers</SelectItem>
//               <SelectItem value="PLATINUM">Platinum</SelectItem>
//               <SelectItem value="GOLD">Gold</SelectItem>
//               <SelectItem value="SILVER">Silver</SelectItem>
//               <SelectItem value="BRONZE">Bronze</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Leads List */}
//         <ScrollArea className="h-96">
//           <div className="space-y-4">
//             {filteredLeads.length === 0 ? (
//               <div className="text-center py-12">
//                 <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
//                 <p className="text-lg font-medium">No leads found</p>
//                 <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
//               </div>
//             ) : (
//               filteredLeads.map((lead) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//                 return (
//                   <div
//                     key={lead.id}
//                     className="p-6 border rounded-lg hover:bg-accent/50 transition-colors space-y-4"
//                   >
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-4">
//                         <Avatar className="h-12 w-12">
//                           <AvatarFallback className="bg-muted font-semibold">
//                             {displayName.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-3">
//                             <h3 className="text-lg font-semibold">{displayName}</h3>
//                             {getTierBadge(lead.metadata)}
//                             {getStatusBadge(lead.status)}
//                           </div>
//                           <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold">{lead.score}</div>
//                         <p className="text-xs text-muted-foreground">Lead Score</p>
//                       </div>
//                     </div>

//                     {/* Contact & Revenue Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Info</p>
//                         <div className="space-y-1">
//                           {lead.email && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Mail className="h-3 w-3 text-muted-foreground" />
//                               <span className="truncate">{lead.email}</span>
//                             </div>
//                           )}
//                           {lead.phone && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <Phone className="h-3 w-3 text-muted-foreground" />
//                               <span>{lead.phone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revenue Potential</p>
//                         {lastAnalysis?.estimatedValue ? (
//                           <div className="text-lg font-bold">
//                             {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                           </div>
//                         ) : (
//                           <div className="text-sm text-muted-foreground">Not calculated</div>
//                         )}
//                         {lastAnalysis?.roi && (
//                           <div className="text-xs text-muted-foreground">ROI: {lastAnalysis.roi}%</div>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Profile Status</p>
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs">Completeness</span>
//                             <span className="text-xs font-bold">{marketingCompleteness}%</span>
//                           </div>
//                           <Progress value={marketingCompleteness} className="h-2" />
//                         </div>
//                       </div>
//                     </div>

//                     {/* AI Insights */}
//                     {lastAnalysis?.notificationMessage && (
//                       <div className="bg-muted/50 border rounded-md p-3">
//                         <div className="flex items-start gap-2">
//                           <Brain className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
//                           <p className="text-sm font-medium">{lastAnalysis.notificationMessage}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function ProfessionalLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates = false,
//   duplicateCount = 0,
//   userId = "",
//   onMergeDuplicates,
//   interactions,
// }: ProfessionalLeadsDashboardProps) {
//   const [isMockMode, setIsMockMode] = useState(true)
//   const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30d")

//   // Use mock data when in mock mode, incorporating the selected time period
//   const displayData = isMockMode 
//     ? generateMockData(selectedPeriod) 
//     : { analytics, recentLeads, topLeads }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="space-y-8 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center space-x-2">
//               <TestTube className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">Demo Mode</span>
//               <Switch checked={isMockMode} onCheckedChange={setIsMockMode} />
//             </div>
//           </div>
//           <TimePeriodSelector value={selectedPeriod} onValueChange={setSelectedPeriod} />
//         </div>

//         {/* Mock Data Notice */}
//         {isMockMode && (
//           <Alert>
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription>
//               <strong>Demo Mode Active:</strong> Displaying mock data for demonstration. Switch off demo mode to view
//               live data when your account starts processing leads.
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Duplicate Alert */}
//         {hasDuplicates && !isMockMode && (
//           <Alert variant="destructive">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription>
//               Found {duplicateCount} potential duplicate leads.
//               <Button
//                 variant="link"
//                 className="p-0 h-auto ml-1"
//                 onClick={() => onMergeDuplicates?.(userId)}
//               >
//                 Merge duplicates
//               </Button>
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Analytics Cards */}
//         <ProfessionalAnalyticsCards 
//           analytics={displayData.analytics} 
//           isMockMode={isMockMode} 
//           period={selectedPeriod} 
//         />

//         {/* Charts Grid */}
//         <div className="grid gap-6 md:grid-cols-2">
//           <RevenueChart 
//             analytics={displayData.analytics} 
//             isMockMode={isMockMode} 
//             period={selectedPeriod} 
//           />
//           <ConversionFunnel 
//             analytics={displayData.analytics} 
//             isMockMode={isMockMode} 
//           />
//         </div>

//         {/* Secondary Charts */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="md:col-span-2">
//             <ProfessionalLeadsTable 
//               leads={displayData.recentLeads || []} 
//               isMockMode={isMockMode} 
//             />
//           </div>
//           <LeadTierDistribution 
//             analytics={displayData.analytics} 
//             isMockMode={isMockMode} 
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  TrendingUp,
  Target,
  BarChart3,
  DollarSign,
  Crown,
  Award,
  ArrowUpRight,
  Brain,
  Search,
  Filter,
  Mail,
  Phone,
  AlertTriangle,
  Star,
  Activity,
  Zap,
  LineChart,
  PieChart,
  Database,
  TestTube,
  Calendar,
  TrendingDown,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Rectangle,
} from "recharts"

interface ProfessionalLeadsDashboardProps {
  analytics?: any
  recentLeads?: any[]
  topLeads?: any[]
  hasDuplicates?: boolean
  duplicateCount?: number
  userId?: string
  onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
  interactions?: any[]
}

type TimePeriod = "7d" | "30d" | "90d" | "6m" | "1y" | "all"

// Color palettes for charts
const CHART_COLORS = {
  primary: "#3b82f6",    // Blue
  secondary: "#10b981",  // Green  
  tertiary: "#f59e0b",   // Amber
  quaternary: "#ef4444", // Red
  accent: "#8b5cf6",     // Purple
  muted: "#6b7280"       // Gray
}

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
const BAR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"]

// Mock data generator for demo mode
const generateMockData = (period: TimePeriod = "30d") => {
  const periodMultiplier = {
    "7d": 0.2,
    "30d": 1,
    "90d": 3,
    "6m": 6,
    "1y": 12,
    "all": 24
  }[period]

  const baseMetrics = {
    totalLeads: Math.floor(1247 * periodMultiplier),
    qualifiedLeads: Math.floor(342 * periodMultiplier),
    convertedLeads: Math.floor(89 * periodMultiplier),
    conversionRate: 26.0,
    qualificationRate: 27.4,
    revenueMetrics: {
      totalEstimatedRevenue: Math.floor(2450000 * periodMultiplier),
      totalExpectedRevenue: Math.floor(1890000 * periodMultiplier),
      averageROI: 340,
      revenueGrowth: Math.random() > 0.5 ? 23.5 : -8.2,
    },
    tierDistribution: {
      platinum: Math.floor(23 * periodMultiplier),
      gold: Math.floor(67 * periodMultiplier),
      silver: Math.floor(156 * periodMultiplier),
      bronze: Math.floor(96 * periodMultiplier),
    },
    premiumInsights: {
      highValueLeads: Math.floor(90 * periodMultiplier),
      averageLeadValue: 7150,
      conversionProbability: 68,
      totalPipelineValue: Math.floor(2450000 * periodMultiplier),
    },
  }

  return {
    analytics: baseMetrics,
    recentLeads: Array.from({ length: 15 }, (_, i) => ({
      id: `mock-${i}`,
      name: [`Sarah Johnson`, `Michael Chen`, `Emma Rodriguez`, `David Kim`, `Lisa Thompson`][i % 5],
      email: [
        `sarah.j@company.com`,
        `m.chen@business.co`,
        `emma.r@startup.io`,
        `david@techcorp.com`,
        `lisa@enterprise.net`,
      ][i % 5],
      phone: [`+1 (555) 123-4567`, `+1 (555) 234-5678`, `+1 (555) 345-6789`, `+1 (555) 456-7890`, `+1 (555) 567-8901`][
        i % 5
      ],
      instagramUserId: [`sarahj_biz`, `michaelc_pro`, `emmarodriguez`, `davidkim_tech`, `lisathompson`][i % 5],
      status: [`QUALIFIED`, `NEW`, `CONVERTING`, `QUALIFIED`, `NEW`][i % 5],
      score: [85, 72, 91, 68, 79][i % 5],
      lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        lastAnalysis: {
          leadTier: [`PLATINUM`, `GOLD`, `PLATINUM`, `SILVER`, `GOLD`][i % 5],
          estimatedValue: [25000, 15000, 35000, 8000, 18000][i % 5],
          roi: [450, 280, 520, 180, 320][i % 5],
          notificationMessage: `High-value opportunity detected - immediate follow-up recommended`,
          nextActions: [`immediate_call`, `send_proposal`, `email_sequence`],
          followUpStrategy: `immediate_personal_outreach`,
          buyerPersona: `engaged_prospect`,
        },
        marketingCompleteness: [95, 80, 100, 65, 85][i % 5],
      },
    })),
  }
}

// Chart data generators
const generateRevenueChartData = (analytics: any, isMockMode: boolean, period: TimePeriod) => {
  const dataPoints = {
    "7d": { count: 7, unit: "day" },
    "30d": { count: 30, unit: "day" },
    "90d": { count: 12, unit: "week" },
    "6m": { count: 6, unit: "month" },
    "1y": { count: 12, unit: "month" },
    "all": { count: 24, unit: "month" }
  }[period]

  if (isMockMode) {
    return Array.from({ length: dataPoints.count }, (_, i) => {
      const date = new Date()
      if (dataPoints.unit === "day") {
        date.setDate(date.getDate() - (dataPoints.count - 1 - i))
        return {
          period: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
          revenue: Math.floor(Math.random() * 50000) + 10000,
          leads: Math.floor(Math.random() * 20) + 5,
        }
      } else if (dataPoints.unit === "week") {
        date.setDate(date.getDate() - (dataPoints.count - 1 - i) * 7)
        return {
          period: `Week ${i + 1}`,
          revenue: Math.floor(Math.random() * 150000) + 50000,
          leads: Math.floor(Math.random() * 50) + 20,
        }
      } else {
        date.setMonth(date.getMonth() - (dataPoints.count - 1 - i))
        return {
          period: date.toLocaleDateString("en", { month: "short", year: "2-digit" }),
          revenue: Math.floor(Math.random() * 300000) + 100000,
          leads: Math.floor(Math.random() * 100) + 50,
        }
      }
    })
  }

  return Array.from({ length: dataPoints.count }, (_, i) => ({
    period: new Date(Date.now() - (dataPoints.count - 1 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en", { month: "short" }),
    revenue: (analytics?.revenueMetrics?.totalEstimatedRevenue || 0) * (0.8 + Math.random() * 0.4),
    leads: (analytics?.totalLeads || 0) * (0.1 + Math.random() * 0.2),
  }))
}

const generateConversionFunnelData = (analytics: any, isMockMode: boolean) => {
  if (isMockMode) {
    return [
      { stage: "Visitors", count: 5420, fill: BAR_COLORS[0] },
      { stage: "Leads", count: 1247, fill: BAR_COLORS[1] },
      { stage: "Qualified", count: 342, fill: BAR_COLORS[2] },
      { stage: "Converted", count: 89, fill: BAR_COLORS[3] },
    ]
  }

  return [
    { stage: "Visitors", count: (analytics?.totalLeads || 0) * 4, fill: BAR_COLORS[0] },
    { stage: "Leads", count: analytics?.totalLeads || 0, fill: BAR_COLORS[1] },
    { stage: "Qualified", count: analytics?.qualifiedLeads || 0, fill: BAR_COLORS[2] },
    { stage: "Converted", count: analytics?.convertedLeads || 0, fill: BAR_COLORS[3] },
  ]
}

// Utility functions
const getRevenueDisplay = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value.toLocaleString()}`
}

const getPeriodLabel = (period: TimePeriod) => {
  const labels = {
    "7d": "Last 7 days",
    "30d": "Last 30 days", 
    "90d": "Last 90 days",
    "6m": "Last 6 months",
    "1y": "Last 12 months",
    "all": "All time"
  }
  return labels[period]
}

const getTierBadge = (metadata: any) => {
  const tier = metadata?.lastAnalysis?.leadTier || "BRONZE"
  
  const configs = {
    PLATINUM: { variant: "default", icon: Crown, className: "bg-purple-100 text-purple-800 border-purple-200" },
    GOLD: { variant: "secondary", icon: Award, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    SILVER: { variant: "outline", icon: Star, className: "bg-gray-100 text-gray-800 border-gray-200" },
    BRONZE: { variant: "outline", icon: Target, className: "bg-orange-100 text-orange-800 border-orange-200" },
  }

  const config = configs[tier as keyof typeof configs] || configs.BRONZE
  const IconComponent = config.icon

  return (
    <Badge variant={config.variant as any} className={`gap-1 ${config.className}`}>
      <IconComponent className="w-3 h-3" />
      {tier}
    </Badge>
  )
}

const getStatusBadge = (status: string) => {
  const configs = {
    NEW: { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200" },
    QUALIFYING: { variant: "secondary", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    QUALIFIED: { variant: "default", className: "bg-green-50 text-green-700 border-green-200" },
    CONVERTING: { variant: "default", className: "bg-purple-50 text-purple-700 border-purple-200" },
    CONVERTED: { variant: "default", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    LOST: { variant: "destructive", className: "" },
  }
  
  const config = configs[status as keyof typeof configs] || configs.NEW
  
  return (
    <Badge variant={config.variant as any} className={config.className}>
      {status}
    </Badge>
  )
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white/95 backdrop-blur-sm p-3 shadow-md">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {entry.name === 'revenue' ? getRevenueDisplay(entry.value) : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Time Period Selector Component
function TimePeriodSelector({ value, onValueChange }: { value: TimePeriod; onValueChange: (value: TimePeriod) => void }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-40">
        <Calendar className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
        <SelectItem value="6m">Last 6 months</SelectItem>
        <SelectItem value="1y">Last 12 months</SelectItem>
        <SelectItem value="all">All time</SelectItem>
      </SelectContent>
    </Select>
  )
}

// Professional Analytics Cards Component
function ProfessionalAnalyticsCards({ analytics, isMockMode, period }: { analytics: any; isMockMode: boolean; period: TimePeriod }) {
  const cards = [
    {
      title: "Total Leads",
      value: analytics?.totalLeads || 0,
      subtitle: "AI-powered generation",
      icon: Users,
      trend: analytics?.revenueMetrics?.revenueGrowth > 0 ? "up" : "down",
      trendValue: "12.5%"
    },
    {
      title: "Qualified Leads", 
      value: analytics?.qualifiedLeads || 0,
      subtitle: `${(analytics?.qualificationRate || 0).toFixed(1)}% qualification rate`,
      icon: Target,
      trend: "up",
      trendValue: "8.2%"
    },
    {
      title: "Revenue Pipeline",
      value: getRevenueDisplay(analytics?.revenueMetrics?.totalEstimatedRevenue || 0),
      subtitle: "Estimated total value",
      icon: DollarSign,
      trend: analytics?.revenueMetrics?.revenueGrowth > 0 ? "up" : "down",
      trendValue: `${Math.abs(analytics?.revenueMetrics?.revenueGrowth || 0).toFixed(1)}%`
    },
    {
      title: "Avg ROI",
      value: `${analytics?.revenueMetrics?.averageROI || 0}%`,
      subtitle: "Return on investment",
      icon: TrendingUp,
      trend: "up",
      trendValue: "15.3%"
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown
        return (
          <Card key={index} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendIcon className={`h-3 w-3 mr-1 ${card.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>{card.trendValue}</span>
                <span className="ml-1">{card.subtitle}</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Revenue Chart Component
function RevenueChart({ analytics, isMockMode, period }: { analytics: any; isMockMode: boolean; period: TimePeriod }) {
  const data = generateRevenueChartData(analytics, isMockMode, period)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Revenue Trend
        </CardTitle>
        <CardDescription>Revenue and lead generation for {getPeriodLabel(period).toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="period" 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => getRevenueDisplay(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {analytics?.revenueMetrics?.revenueGrowth > 0 ? (
            <>
              Trending up by {analytics.revenueMetrics.revenueGrowth.toFixed(1)}% <TrendingUp className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(analytics?.revenueMetrics?.revenueGrowth || 0).toFixed(1)}% <TrendingDown className="h-4 w-4 text-red-600" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing revenue performance for {getPeriodLabel(period).toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  )
}

// Enhanced Conversion Funnel Component
function ConversionFunnel({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
  const data = generateConversionFunnelData(analytics, isMockMode)
  const [activeIndex, setActiveIndex] = useState(1)

  // Calculate conversion rates
  const conversionRates = data.map((item, index) => {
    if (index === 0) return null
    const previousStage = data[index - 1]
    const rate = previousStage ? ((item.count / previousStage.count) * 100).toFixed(1) : "0"
    return `${rate}%`
  }).filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Conversion Funnel
        </CardTitle>
        <CardDescription>Lead progression through qualification stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                  setActiveIndex(state.activeTooltipIndex)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="stage"
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                cursor={false}
                content={<CustomTooltip />}
              />
              <Bar 
                dataKey="count" 
                strokeWidth={2}
                radius={[8, 8, 0, 0]}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  )
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Overall conversion rate: {((data[3]?.count / data[0]?.count) * 100).toFixed(1)}% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Stage conversion rates: {conversionRates.join(" → ")}
        </div>
      </CardFooter>
    </Card>
  )
}

// Lead Tier Distribution Component
function LeadTierDistribution({ analytics, isMockMode }: { analytics: any; isMockMode: boolean }) {
  const tierData = isMockMode
    ? generateMockData().analytics.tierDistribution
    : analytics?.tierDistribution || { platinum: 0, gold: 0, silver: 0, bronze: 0 }

  const data = [
    { name: "Platinum", value: tierData.platinum, color: PIE_COLORS[0] },
    { name: "Gold", value: tierData.gold, color: PIE_COLORS[1] },
    { name: "Silver", value: tierData.silver, color: PIE_COLORS[2] },
    { name: "Bronze", value: tierData.bronze, color: PIE_COLORS[3] },
  ]

  const total = data.reduce((sum, tier) => sum + tier.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Lead Tier Distribution
        </CardTitle>
        <CardDescription>AI-classified leads by revenue potential</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={120} 
                paddingAngle={5} 
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((tier, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
              <span className="text-sm text-muted-foreground">{tier.name}</span>
              <span className="text-sm font-medium ml-auto">{tier.value}</span>
              <span className="text-xs text-muted-foreground">
                ({total > 0 ? ((tier.value / total) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Professional Leads Table Component
function ProfessionalLeadsTable({
  leads,
  isMockMode,
}: {
  leads: any[]
  isMockMode: boolean
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")

  const displayLeads = isMockMode ? generateMockData().recentLeads : leads || []

  const filteredLeads = useMemo(() => {
    return displayLeads.filter((lead) => {
      const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
      const matchesSearch =
        !searchTerm ||
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter
      const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [displayLeads, searchTerm, statusFilter, tierFilter])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Lead Pipeline
            </CardTitle>
            <CardDescription>
              {isMockMode ? "Demo data - " : "Live data - "}
              {filteredLeads.length} qualified leads
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="QUALIFIED">Qualified</SelectItem>
              <SelectItem value="CONVERTING">Converting</SelectItem>
              <SelectItem value="CONVERTED">Converted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-40">
              <Star className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="PLATINUM">Platinum</SelectItem>
              <SelectItem value="GOLD">Gold</SelectItem>
              <SelectItem value="SILVER">Silver</SelectItem>
              <SelectItem value="BRONZE">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leads List */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No leads found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const lastAnalysis = lead.metadata?.lastAnalysis
                const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
                const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

                return (
                  <div
                    key={lead.id}
                    className="p-6 border rounded-lg hover:bg-accent/50 transition-colors space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-muted font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{displayName}</h3>
                            {getTierBadge(lead.metadata)}
                            {getStatusBadge(lead.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{lead.score}</div>
                        <p className="text-xs text-muted-foreground">Lead Score</p>
                      </div>
                    </div>

                    {/* Contact & Revenue Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Info</p>
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revenue Potential</p>
                        {lastAnalysis?.estimatedValue ? (
                          <div className="text-lg font-bold">
                            {getRevenueDisplay(lastAnalysis.estimatedValue)}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Not calculated</div>
                        )}
                        {lastAnalysis?.roi && (
                          <div className="text-xs text-muted-foreground">ROI: {lastAnalysis.roi}%</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Profile Status</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Completeness</span>
                            <span className="text-xs font-bold">{marketingCompleteness}%</span>
                          </div>
                          <Progress value={marketingCompleteness} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {lastAnalysis?.notificationMessage && (
                      <div className="bg-muted/50 border rounded-md p-3">
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm font-medium">{lastAnalysis.notificationMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function ProfessionalLeadsDashboard({
  analytics,
  recentLeads,
  topLeads,
  hasDuplicates = false,
  duplicateCount = 0,
  userId = "",
  onMergeDuplicates,
  interactions,
}: ProfessionalLeadsDashboardProps) {
  const [isMockMode, setIsMockMode] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30d")

  // Use mock data when in mock mode, incorporating the selected time period
  const displayData = isMockMode 
    ? generateMockData(selectedPeriod) 
    : { analytics, recentLeads, topLeads }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Demo Mode</span>
              <Switch checked={isMockMode} onCheckedChange={setIsMockMode} />
            </div>
          </div>
          <TimePeriodSelector value={selectedPeriod} onValueChange={setSelectedPeriod} />
        </div>

        {/* Mock Data Notice */}
        {isMockMode && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode Active:</strong> Displaying mock data for demonstration. Switch off demo mode to view
              live data when your account starts processing leads.
            </AlertDescription>
          </Alert>
        )}

        {/* Duplicate Alert */}
        {hasDuplicates && !isMockMode && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Found {duplicateCount} potential duplicate leads.
              <Button
                variant="link"
                className="p-0 h-auto ml-1"
                onClick={() => onMergeDuplicates?.(userId)}
              >
                Merge duplicates
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Analytics Cards */}
        <ProfessionalAnalyticsCards 
          analytics={displayData.analytics} 
          isMockMode={isMockMode} 
          period={selectedPeriod} 
        />

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueChart 
            analytics={displayData.analytics} 
            isMockMode={isMockMode} 
            period={selectedPeriod} 
          />
          <ConversionFunnel 
            analytics={displayData.analytics} 
            isMockMode={isMockMode} 
          />
        </div>

        {/* Secondary Charts */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <ProfessionalLeadsTable 
              leads={displayData.recentLeads || []} 
              isMockMode={isMockMode} 
            />
          </div>
          <LeadTierDistribution 
            analytics={displayData.analytics} 
            isMockMode={isMockMode} 
          />
        </div>
      </div>
    </div>
  )
}


