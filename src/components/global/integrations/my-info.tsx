// "use client"

// import { useState } from "react"
// import {
//   Instagram,
//   TrendingUp,
//   RefreshCw,
//   BarChart3,
//   Hash,
//   Clock,
//   Loader2,
//   Sparkles,
//   Target,
//   Zap,
//   Brain,
//   Trophy,
//   Lightbulb,
//   ArrowUp,
//   ArrowDown,
//   Camera,
//   PenTool,
//   CalendarIcon,
//   UserPlus,
//   Share2,
//   Download,
//   Settings,
//   Play,
//   Pause,
//   Plus,
//   Search,
//   Users,
//   Eye,
//   Globe,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { useToast } from "@/hooks/use-toast"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import {
//   fetchInstagramMedia,
//   getAccountInsights,
//   searchHashtag,
//   refreshAccessToken,
//   bulkRefreshIntegrations,
// } from "@/actions/integrations"
// import {
//   generateContentStrategy,
//   getOptimalPostingTimes,
//   analyzeCompetitors,
//   generateCaptions,
//   getAudienceInsights,
//   analyzeContentTrends,
//   generateReports,
//   generateHashtagSuggestions,
//   createContentCalendar,
// } from "@/actions/integrations"

// interface InstagramDashboardProps {
//   userId: string
// }

// export default function EnhancedInstagramDashboard({ userId }: InstagramDashboardProps) {
//   const [activeTab, setActiveTab] = useState("ai-insights")
//   const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "days_28">("week")
//   const [hashtagSearch, setHashtagSearch] = useState("")
//   const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [contentPrompt, setContentPrompt] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [selectedTone, setSelectedTone] = useState("professional")
//   const [generatedCaption, setGeneratedCaption] = useState<any>(null)
//   const [isSearchingHashtag, setIsSearchingHashtag] = useState(false)
//   const [hashtagResults, setHashtagResults] = useState<any>(null)
//   const [automationSettings, setAutomationSettings] = useState({
//     autoLike: false,
//     autoFollow: false,
//     smartReplies: true,
//   })
//   const { toast } = useToast()
//   const queryClient = useQueryClient()

//   // Existing queries
//   const { data: mediaData, isLoading: mediaLoading } = useQuery({
//     queryKey: ["instagram-media", userId],
//     queryFn: () => fetchInstagramMedia(userId, 25),
//     refetchInterval: 5 * 60 * 1000,
//   })

//   const { data: insightsData, isLoading: insightsLoading } = useQuery({
//     queryKey: ["instagram-insights", userId, selectedPeriod],
//     queryFn: () => getAccountInsights(userId, selectedPeriod),
//     refetchInterval: 10 * 60 * 1000,
//   })

//   // AI-powered queries
//   const { data: contentStrategy, isLoading: strategyLoading } = useQuery({
//     queryKey: ["content-strategy", userId],
//     queryFn: () => generateContentStrategy(userId),
//     staleTime: 24 * 60 * 60 * 1000, // 24 hours
//   })

//   const { data: optimalTimes, isLoading: timesLoading } = useQuery({
//     queryKey: ["optimal-times", userId],
//     queryFn: () => getOptimalPostingTimes(userId),
//     staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
//   })

//   const { data: audienceInsights, isLoading: audienceLoading } = useQuery({
//     queryKey: ["audience-insights", userId],
//     queryFn: () => getAudienceInsights(userId),
//     staleTime: 24 * 60 * 60 * 1000,
//   })

//   const { data: competitorAnalysis, isLoading: competitorLoading } = useQuery({
//     queryKey: ["competitor-analysis", userId],
//     queryFn: () => analyzeCompetitors(userId),
//     staleTime: 7 * 24 * 60 * 60 * 1000,
//   })

//   const { data: contentTrends, isLoading: trendsLoading } = useQuery({
//     queryKey: ["content-trends", userId],
//     queryFn: () => analyzeContentTrends(userId),
//     staleTime: 24 * 60 * 60 * 1000,
//   })

//   const {
//     data: hashtagSuggestions,
//     isLoading: hashtagsLoading,
//     refetch: refetchHashtags,
//   } = useQuery({
//     queryKey: ["hashtag-suggestions", userId, contentPrompt],
//     queryFn: () => generateHashtagSuggestions(userId, contentPrompt),
//     enabled: false, // Don't run automatically
//     staleTime: 24 * 60 * 60 * 1000,
//   })

//   const { data: contentCalendar, isLoading: calendarLoading } = useQuery({
//     queryKey: ["content-calendar", userId],
//     queryFn: () => createContentCalendar(userId, 7), // 7-day calendar
//     staleTime: 24 * 60 * 60 * 1000,
//   })

//   const handleGenerateCaption = async () => {
//     if (!contentPrompt.trim()) return

//     setIsGenerating(true)
//     try {
//       const result = await generateCaptions(userId, contentPrompt, selectedTone)
//       if (result.status === 200) {
//         setGeneratedCaption(result.data)
//         toast({
//           title: "Caption Generated",
//           description: "AI-powered caption has been created for your content.",
//           duration: 3000,
//         })

//         // Also generate hashtag suggestions
//         refetchHashtags()
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to generate caption.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to generate caption.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleGenerateReport = async () => {
//     try {
//       const result = await generateReports(userId, selectedPeriod)
//       if (result.status === 200) {
//         toast({
//           title: "Report Generated",
//           description: "Your comprehensive Instagram report is ready for download.",
//           duration: 3000,
//         })
//         // In a real app, I'd trigger a download here
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to generate report.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to generate report.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleRefreshData = async () => {
//     setIsRefreshing(true)
//     try {
//       // Refresh Instagram data
//       await bulkRefreshIntegrations(userId)

//       // Invalidate all queries to refetch data
//       await queryClient.invalidateQueries({ queryKey: ["instagram-media"] })
//       await queryClient.invalidateQueries({ queryKey: ["instagram-insights"] })
//       await queryClient.invalidateQueries({ queryKey: ["content-strategy"] })
//       await queryClient.invalidateQueries({ queryKey: ["optimal-times"] })
//       await queryClient.invalidateQueries({ queryKey: ["audience-insights"] })
//       await queryClient.invalidateQueries({ queryKey: ["content-trends"] })

//       toast({
//         title: "Data Refreshed",
//         description: "All dashboard data has been updated.",
//         duration: 3000,
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to refresh data.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const handleHashtagSearch = async () => {
//     if (!hashtagSearch.trim()) return

//     setIsSearchingHashtag(true)
//     try {
//       const result = await searchHashtag(userId, hashtagSearch.replace("#", ""))
//       if (result.status === 200) {
//         setHashtagResults(result.data)
//         toast({
//           title: "Hashtag Found",
//           description: `Found ${result.data?.topMedia?.length || 0} top posts for #${hashtagSearch}`,
//           duration: 3000,
//         })
//       } else {
//         toast({
//           title: "Search Failed",
//           description: result.message || "Hashtag not found.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to search hashtag.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSearchingHashtag(false)
//     }
//   }

//   const handleRefreshToken = async () => {
//     try {
//       const result = await refreshAccessToken(userId)
//       if (result.status === 200) {
//         toast({
//           title: "Token Refreshed",
//           description: "Your Instagram access token has been refreshed successfully.",
//           duration: 3000,
//         })
//       } else {
//         toast({
//           title: "Refresh Failed",
//           description: result.message || "Failed to refresh access token.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to refresh access token.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSchedulePost = () => {
//     toast({
//       title: "Schedule Post",
//       description: "Post scheduling feature coming soon!",
//       duration: 3000,
//     })
//   }

//   const handleConfigureAutomation = () => {
//     toast({
//       title: "Automation Settings",
//       description: "Automation configuration panel coming soon!",
//       duration: 3000,
//     })
//   }

//   const toggleAutomation = (setting: keyof typeof automationSettings) => {
//     setAutomationSettings((prev) => ({
//       ...prev,
//       [setting]: !prev[setting],
//     }))
//     toast({
//       title: "Setting Updated",
//       description: `${setting} has been ${automationSettings[setting] ? "disabled" : "enabled"}.`,
//       duration: 2000,
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Button onClick={handleRefreshToken} variant="outline" size="sm">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Refresh Token
//           </Button>
//           <Button onClick={handleGenerateReport} variant="outline" size="sm">
//             <Download className="h-4 w-4 mr-2" />
//             Generate Report
//           </Button>
//           <Button onClick={handleRefreshData} disabled={isRefreshing} variant="outline" size="sm">
//             {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
//             Refresh All
//           </Button>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-7">
//           <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
//           <TabsTrigger value="performance">Performance</TabsTrigger>
//           <TabsTrigger value="content-lab">Content Lab</TabsTrigger>
//           <TabsTrigger value="growth">Growth</TabsTrigger>
//           <TabsTrigger value="competitors">Competitors</TabsTrigger>
//           <TabsTrigger value="automation">Automation</TabsTrigger>
//           <TabsTrigger value="reports">Reports</TabsTrigger>
//         </TabsList>

//         {/* AI Insights Tab */}
//         <TabsContent value="ai-insights" className="space-y-6">
//           {/* AI Performance Score */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Brain className="h-5 w-5 text-purple-600" />
//                 AI Performance Score
//               </CardTitle>
//               <CardDescription>Your overall Instagram performance analyzed by AI</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {audienceLoading || strategyLoading ? (
//                 <div className="animate-pulse space-y-4">
//                   <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {audienceInsights?.data?.performanceScores?.map((score: any, index: number) => (
//                     <div key={index} className="text-center">
//                       <div
//                         className={`text-3xl font-bold mb-2 ${
//                           score.value > 80 ? "text-green-600" : score.value > 60 ? "text-blue-600" : "text-orange-600"
//                         }`}
//                       >
//                         {score.value}
//                       </div>
//                       <div className="text-sm text-muted-foreground">{score.name}</div>
//                       <Progress value={score.value} className="mt-2" />
//                     </div>
//                   )) || (
//                     // Fallback if no performance scores
//                     <div className="col-span-3 text-center text-muted-foreground">
//                       <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>AI performance analysis will appear here once data is processed</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* AI Recommendations */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Lightbulb className="h-5 w-5 text-yellow-600" />
//                   Smart Recommendations
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {strategyLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     ))}
//                   </div>
//                 ) : (
//                   contentStrategy?.data?.recommendations?.map((rec: any, index: number) => {
//                     const icons = [TrendingUp, Hash, Camera]
//                     const colors = ["blue", "green", "purple"]
//                     const Icon = icons[index % icons.length]
//                     const color = colors[index % colors.length]

//                     return (
//                       <div
//                         key={index}
//                         className={`flex items-start gap-3 p-3 bg-${color}-50 dark:bg-${color}-950 rounded-lg`}
//                       >
//                         <Icon className={`h-5 w-5 text-${color}-600 mt-0.5`} />
//                         <div>
//                           <h4 className="font-medium">{rec.title}</h4>
//                           <p className="text-sm text-muted-foreground">{rec.description}</p>
//                         </div>
//                       </div>
//                     )
//                   }) || (
//                     <div className="text-center text-muted-foreground py-4">
//                       <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                       <p>AI recommendations will appear here</p>
//                     </div>
//                   )
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Target className="h-5 w-5 text-red-600" />
//                   Growth Opportunities
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {trendsLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     ))}
//                   </div>
//                 ) : (
//                   contentTrends?.data?.growthMetrics?.map((metric: any, index: number) => (
//                     <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                       <div>
//                         <h4 className="font-medium">{metric.name}</h4>
//                         <p className="text-sm text-muted-foreground">{metric.description}</p>
//                       </div>
//                       {metric.trend === "up" ? (
//                         <ArrowUp className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <ArrowDown className="h-5 w-5 text-red-600" />
//                       )}
//                     </div>
//                   )) || (
//                     <div className="text-center text-muted-foreground py-4">
//                       <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                       <p>Growth opportunities will appear here</p>
//                     </div>
//                   )
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Optimal Posting Times */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-blue-600" />
//                 AI-Optimized Posting Schedule
//               </CardTitle>
//               <CardDescription>When your audience is most active, powered by AI analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {timesLoading ? (
//                 <div className="animate-pulse space-y-4">
//                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-7 gap-2">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
//                     const dayData = optimalTimes?.data?.schedule?.find((d: any) =>
//                       d.day.toLowerCase().startsWith(day.toLowerCase()),
//                     )

//                     return (
//                       <div key={day} className="text-center">
//                         <div className="font-medium text-sm mb-2">{day}</div>
//                         <div className="space-y-1">
//                           {dayData?.times?.map((time: any, i: number) => (
//                             <div
//                               key={i}
//                               className={`${
//                                 i % 2 === 0
//                                   ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
//                                   : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
//                               } text-xs p-1 rounded`}
//                             >
//                               {time}
//                             </div>
//                           )) || <div className="text-xs text-muted-foreground">Analyzing...</div>}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Performance Tab */}
//         <TabsContent value="performance" className="space-y-6">
//           {/* Period Selector */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium">Period:</span>
//             <Select
//               value={selectedPeriod}
//               onValueChange={(value: "day" | "week" | "days_28") => setSelectedPeriod(value)}
//             >
//               <SelectTrigger className="w-32">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="day">Today</SelectItem>
//                 <SelectItem value="week">This Week</SelectItem>
//                 <SelectItem value="days_28">Last 28 Days</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Account Insights Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {insightsLoading
//               ? Array.from({ length: 4 }).map((_, i) => (
//                   <Card key={i} className="animate-pulse">
//                     <CardContent className="p-6">
//                       <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
//                       <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     </CardContent>
//                   </Card>
//                 ))
//               : insightsData?.data?.map((insight: any, index: number) => {
//                   const icons = [TrendingUp, Users, Eye, Globe]
//                   const Icon = icons[index] || TrendingUp
//                   return (
//                     <Card key={insight.name}>
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-muted-foreground capitalize">
//                               {insight.title || insight.name.replace("_", " ")}
//                             </p>
//                             <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
//                           </div>
//                           <Icon className="h-6 w-6 text-blue-600" />
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )
//                 })}
//           </div>

//           {/* Content Grid */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Posts</CardTitle>
//               <CardDescription>Your latest Instagram content performance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {mediaLoading
//                   ? Array.from({ length: 6 }).map((_, i) => (
//                       <div key={i} className="animate-pulse">
//                         <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
//                         <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
//                         <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
//                       </div>
//                     ))
//                   : mediaData?.data?.slice(0, 6).map((post: any) => (
//                       <div key={post.id} className="space-y-2">
//                         <div
//                           className="aspect-square bg-cover bg-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                           style={{
//                             backgroundImage: `url(${post.media_url || post.thumbnail_url || "/placeholder.svg?height=300&width=300"})`,
//                           }}
//                           onClick={() => setSelectedMediaId(post.id)}
//                         >
//                           <div className="w-full h-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center rounded-lg">
//                             <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-4 text-white">
//                               <div className="flex items-center gap-1">
//                                 <span className="text-sm">{post.like_count || 0} likes</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <span className="text-sm">{post.comments_count || 0} comments</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-sm line-clamp-2">{post.caption || "No caption"}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {new Date(post.timestamp).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Content Lab Tab */}
//         <TabsContent value="content-lab" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <PenTool className="h-5 w-5 text-purple-600" />
//                 AI Caption Generator
//               </CardTitle>
//               <CardDescription>Generate engaging captions tailored to your brand voice</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Textarea
//                 placeholder="Describe your post or upload an image..."
//                 value={contentPrompt}
//                 onChange={(e) => setContentPrompt(e.target.value)}
//                 className="min-h-[100px]"
//               />
//               <div className="flex gap-2">
//                 <Button onClick={handleGenerateCaption} disabled={isGenerating || !contentPrompt.trim()}>
//                   {isGenerating ? (
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <Sparkles className="h-4 w-4 mr-2" />
//                   )}
//                   Generate Caption
//                 </Button>
//                 <Select value={selectedTone} onValueChange={setSelectedTone}>
//                   <SelectTrigger className="w-40">
//                     <SelectValue placeholder="Tone" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="professional">Professional</SelectItem>
//                     <SelectItem value="casual">Casual</SelectItem>
//                     <SelectItem value="funny">Funny</SelectItem>
//                     <SelectItem value="inspirational">Inspirational</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Generated Caption Display */}
//               {generatedCaption && (
//                 <div className="mt-4 p-4 border rounded-lg bg-muted/50">
//                   <h4 className="font-medium mb-2">Generated Caption:</h4>
//                   <p className="text-sm mb-3">{generatedCaption.caption}</p>
//                   {generatedCaption.suggestedHashtags && (
//                     <div>
//                       <h5 className="font-medium text-sm mb-1">Suggested Hashtags:</h5>
//                       <div className="flex flex-wrap gap-1">
//                         {generatedCaption.suggestedHashtags.map((tag: string, i: number) => (
//                           <Badge key={i} variant="outline" className="text-xs">
//                             {tag.startsWith("#") ? tag : `#${tag}`}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Hashtag Research */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Hash className="h-5 w-5 text-blue-600" />
//                 Hashtag Research
//               </CardTitle>
//               <CardDescription>Search and analyze hashtag performance</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Enter hashtag (without #)"
//                   value={hashtagSearch}
//                   onChange={(e) => setHashtagSearch(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleHashtagSearch()}
//                 />
//                 <Button onClick={handleHashtagSearch} disabled={!hashtagSearch.trim() || isSearchingHashtag}>
//                   {isSearchingHashtag ? (
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <Search className="h-4 w-4 mr-2" />
//                   )}
//                   Search
//                 </Button>
//               </div>

//               {/* Hashtag Results */}
//               {hashtagResults && (
//                 <div className="mt-4 p-4 border rounded-lg">
//                   <h4 className="font-medium mb-2">#{hashtagResults.hashtag.name}</h4>
//                   <p className="text-sm text-muted-foreground mb-3">
//                     Found {hashtagResults.topMedia?.length || 0} top posts
//                   </p>
//                   {hashtagResults.topMedia?.length > 0 && (
//                     <div className="grid grid-cols-3 gap-2">
//                       {hashtagResults.topMedia.slice(0, 6).map((media: any, i: number) => (
//                         <div
//                           key={i}
//                           className="aspect-square bg-cover bg-center rounded cursor-pointer hover:opacity-80 transition-opacity"
//                           style={{
//                             backgroundImage: `url(${media.media_url || "/placeholder.svg?height=150&width=150"})`,
//                           }}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Smart Hashtag Suggestions */}
//               {hashtagSuggestions?.data && (
//                 <div className="mt-4">
//                   <h4 className="font-medium mb-3">Smart Hashtag Suggestions</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {Object.entries(hashtagSuggestions.data).map(([category, tags]: [string, any]) => (
//                       <div key={category}>
//                         <h5 className="font-medium mb-2 text-blue-600 capitalize">{category.replace(/_/g, " ")}</h5>
//                         <div className="flex flex-wrap gap-1">
//                           {Array.isArray(tags) &&
//                             tags.map((tag: string, i: number) => (
//                               <Badge key={i} variant="outline" className="text-xs">
//                                 {tag.startsWith("#") ? tag : `#${tag}`}
//                               </Badge>
//                             ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Growth Tab */}
//         <TabsContent value="growth" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <UserPlus className="h-5 w-5 text-green-600" />
//                   Follower Growth Strategy
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {audienceLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
//                       <div className="text-2xl font-bold text-green-600">
//                         {audienceInsights?.data?.growthProjection?.monthly || "N/A"}
//                       </div>
//                       <div className="text-sm text-muted-foreground">Projected monthly growth</div>
//                     </div>
//                     <div className="space-y-2">
//                       {audienceInsights?.data?.growthFactors?.map((factor: any, index: number) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{factor.name}</span>
//                           <span className="text-green-600">{factor.impact}</span>
//                         </div>
//                       )) || (
//                         <div className="text-center text-muted-foreground py-4">
//                           <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                           <p>Growth analysis will appear here</p>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Zap className="h-5 w-5 text-yellow-600" />
//                   Engagement Booster
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {audienceLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg">
//                       <div className="text-2xl font-bold text-yellow-600">
//                         {audienceInsights?.data?.currentEngagementRate || "N/A"}
//                       </div>
//                       <div className="text-sm text-muted-foreground">Current engagement rate</div>
//                     </div>
//                     <div className="space-y-2">
//                       {audienceInsights?.data?.engagementFactors?.map((factor: any, index: number) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{factor.name}</span>
//                           <span className="text-blue-600">{factor.impact}</span>
//                         </div>
//                       )) || (
//                         <div className="text-center text-muted-foreground py-4">
//                           <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                           <p>Engagement analysis will appear here</p>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Content Calendar */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CalendarIcon className="h-5 w-5 text-purple-600" />
//                 AI-Generated Content Calendar
//               </CardTitle>
//               <CardDescription>Optimized posting schedule for maximum engagement</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {calendarLoading ? (
//                 <div className="animate-pulse space-y-4">
//                   <div className="grid grid-cols-7 gap-2">
//                     {Array.from({ length: 7 }).map((_, i) => (
//                       <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-7 gap-2">
//                   {contentCalendar?.data?.days?.map((day: any, index: number) => (
//                     <div key={index} className="border rounded-lg p-2">
//                       <div className="font-medium text-sm mb-2">{day.date}</div>
//                       <div className="space-y-1">
//                         {day.posts?.map((post: any, i: number) => (
//                           <div
//                             key={i}
//                             className={`${
//                               post.type === "reel"
//                                 ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
//                                 : post.type === "story"
//                                   ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
//                                   : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
//                             } text-xs p-1 rounded`}
//                           >
//                             {post.type.charAt(0).toUpperCase() + post.type.slice(1)}: {post.time}
//                           </div>
//                         )) || <div className="text-xs text-muted-foreground">No posts scheduled</div>}
//                       </div>
//                     </div>
//                   )) ||
//                     Array.from({ length: 7 }, (_, i) => (
//                       <div key={i} className="border rounded-lg p-2">
//                         <div className="font-medium text-sm mb-2">
//                           {new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en", {
//                             weekday: "short",
//                             day: "numeric",
//                           })}
//                         </div>
//                         <div className="text-xs text-muted-foreground">Analyzing...</div>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Competitors Tab */}
//         <TabsContent value="competitors" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Trophy className="h-5 w-5 text-amber-600" />
//                 Competitor Analysis
//               </CardTitle>
//               <CardDescription>See how you stack up against your competition</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {competitorLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <div key={i} className="flex items-center space-x-4">
//                         <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
//                           <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {competitorAnalysis?.data?.competitors?.map((competitor: any, index: number) => {
//                       const colors = [
//                         "from-pink-500 to-purple-500",
//                         "from-blue-500 to-cyan-500",
//                         "from-green-500 to-emerald-500",
//                         "from-orange-500 to-amber-500",
//                       ]

//                       return (
//                         <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`w-10 h-10 bg-gradient-to-r ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold`}
//                             >
//                               {competitor.username.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <h4 className="font-medium">@{competitor.username}</h4>
//                               <p className="text-sm text-muted-foreground">{competitor.category}</p>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm font-medium">Engagement: {competitor.engagementRate}</div>
//                             <div
//                               className={`text-xs ${competitor.comparison === "better" ? "text-green-600" : "text-muted-foreground"}`}
//                             >
//                               {competitor.comparisonText}
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     }) || (
//                       <div className="text-center text-muted-foreground py-8">
//                         <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                         <p>Competitor analysis will appear here</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Automation Tab */}
//         <TabsContent value="automation" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Zap className="h-5 w-5 text-yellow-600" />
//                   Auto-Engagement
//                 </CardTitle>
//                 <CardDescription>Automatically engage with your audience</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span>Auto-like relevant posts</span>
//                   <Button
//                     variant={automationSettings.autoLike ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => toggleAutomation("autoLike")}
//                   >
//                     {automationSettings.autoLike ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>Auto-follow back</span>
//                   <Button
//                     variant={automationSettings.autoFollow ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => toggleAutomation("autoFollow")}
//                   >
//                     {automationSettings.autoFollow ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>Smart comment replies</span>
//                   <Button
//                     variant={automationSettings.smartReplies ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => toggleAutomation("smartReplies")}
//                   >
//                     {automationSettings.smartReplies ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <Button className="w-full" onClick={handleConfigureAutomation}>
//                   <Settings className="h-4 w-4 mr-2" />
//                   Configure Settings
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Share2 className="h-5 w-5 text-blue-600" />
//                   Content Scheduling
//                 </CardTitle>
//                 <CardDescription>Schedule posts for optimal times</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">{contentCalendar?.data?.scheduledCount || 0}</div>
//                   <div className="text-sm text-muted-foreground">Posts scheduled</div>
//                 </div>
//                 <div className="space-y-2">
//                   {contentCalendar?.data?.scheduleSummary?.map((item: any, index: number) => (
//                     <div key={index} className="flex justify-between text-sm">
//                       <span>{item.label}</span>
//                       <span>{item.value}</span>
//                     </div>
//                   )) || (
//                     <>
//                       <div className="flex justify-between text-sm">
//                         <span>Next post</span>
//                         <span>Not scheduled</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span>This week</span>
//                         <span>0 posts</span>
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <Button className="w-full" onClick={handleSchedulePost}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Schedule New Post
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Reports Tab */}
//         <TabsContent value="reports" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart3 className="h-5 w-5 text-green-600" />
//                 Performance Reports
//               </CardTitle>
//               <CardDescription>Comprehensive analytics and insights</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Button variant="outline" className="h-20 flex flex-col" onClick={() => handleGenerateReport()}>
//                   <Download className="h-6 w-6 mb-2" />
//                   Weekly Report
//                 </Button>
//                 <Button variant="outline" className="h-20 flex flex-col" onClick={() => handleGenerateReport()}>
//                   <Download className="h-6 w-6 mb-2" />
//                   Monthly Report
//                 </Button>
//                 <Button variant="outline" className="h-20 flex flex-col" onClick={() => handleGenerateReport()}>
//                   <Download className="h-6 w-6 mb-2" />
//                   Custom Report
//                 </Button>
//               </div>

//               {contentStrategy?.data?.reports ? (
//                 <div className="border-t pt-4">
//                   <h4 className="font-medium mb-2">Recent Reports</h4>
//                   <div className="space-y-2">
//                     {contentStrategy.data.reports.map((report: any, index: number) => (
//                       <div key={index} className="flex items-center justify-between p-2 border rounded">
//                         <span className="text-sm">{report.name}</span>
//                         <Button size="sm" variant="ghost" onClick={() => handleGenerateReport()}>
//                           Download
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="border-t pt-4 text-center text-muted-foreground">
//                   <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p>Generate your first report to see it here</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


// "use client"

// import { useState, useCallback } from "react"
// import {
//   Instagram,
//   TrendingUp,
//   RefreshCw,
//   BarChart3,
//   Clock,
//   Loader2,
//   Sparkles,
//   Target,
//   Brain,
//   Trophy,
//   Lightbulb,
//   ArrowUp,
//   ArrowDown,
//   Users,
//   Eye,
//   Globe,
//   Calendar,
//   Zap,
//   CheckCircle,
//   XCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { useToast } from "@/hooks/use-toast"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import {
//   fetchInstagramMedia,
//   getAccountInsights,
//   refreshAccessToken,
//   bulkRefreshIntegrations,
//   generateContentStrategy,
//   getOptimalPostingTimes,
//   analyzeCompetitors,
//   getAudienceInsights,
//   analyzeContentTrends,
// } from "@/actions/integrations"

// interface InstagramDashboardProps {
//   userId: string
// }

// // Analysis control stat
// interface AnalysisState {
//   lastAnalysis: Date | null
//   isAnalyzing: boolean
//   analysisType: string | null
// }

// export default function EnhancedInstagramDashboard({ userId }: InstagramDashboardProps) {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "days_28">("week")
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [analysisState, setAnalysisState] = useState<AnalysisState>({
//     lastAnalysis: null,
//     isAnalyzing: false,
//     analysisType: null,
//   })

//   const { toast } = useToast()
//   const queryClient = useQueryClient()

//   // Core data queries - always fetch real data
//   const {
//     data: mediaData,
//     isLoading: mediaLoading,
//     error: mediaError,
//   } = useQuery({
//     queryKey: ["instagram-media", userId],
//     queryFn: () => fetchInstagramMedia(userId, 50),
//     refetchInterval: 5 * 60 * 1000,
//     retry: 2,
//   })

//   const {
//     data: insightsData,
//     isLoading: insightsLoading,
//     error: insightsError,
//   } = useQuery({
//     queryKey: ["instagram-insights", userId, selectedPeriod],
//     queryFn: () => getAccountInsights(userId, selectedPeriod),
//     refetchInterval: 10 * 60 * 1000,
//     retry: 2,
//   })

//   // Controlled AI analysis queries - only fetch when explicitly triggered
//   const {
//     data: contentStrategy,
//     isLoading: strategyLoading,
//     refetch: refetchStrategy,
//   } = useQuery({
//     queryKey: ["content-strategy", userId],
//     queryFn: () => generateContentStrategy(userId),
//     enabled: false, // Don't auto-fetch
//     staleTime: 24 * 60 * 60 * 1000, // 24 hours
//   })

//   const {
//     data: optimalTimes,
//     isLoading: timesLoading,
//     refetch: refetchTimes,
//   } = useQuery({
//     queryKey: ["optimal-times", userId],
//     queryFn: () => getOptimalPostingTimes(userId),
//     enabled: false, // Don't auto-fetch
//     staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
//   })

//   const {
//     data: audienceInsights,
//     isLoading: audienceLoading,
//     refetch: refetchAudience,
//   } = useQuery({
//     queryKey: ["audience-insights", userId],
//     queryFn: () => getAudienceInsights(userId),
//     enabled: false, // Don't auto-fetch
//     staleTime: 24 * 60 * 60 * 1000,
//   })

//   const {
//     data: competitorAnalysis,
//     isLoading: competitorLoading,
//     refetch: refetchCompetitors,
//   } = useQuery({
//     queryKey: ["competitor-analysis", userId],
//     queryFn: () => analyzeCompetitors(userId),
//     enabled: false, // Don't auto-fetch
//     staleTime: 7 * 24 * 60 * 60 * 1000,
//   })

//   const {
//     data: contentTrends,
//     isLoading: trendsLoading,
//     refetch: refetchTrends,
//   } = useQuery({
//     queryKey: ["content-trends", userId],
//     queryFn: () => analyzeContentTrends(userId),
//     enabled: false, // Don't auto-fetch
//     staleTime: 24 * 60 * 60 * 1000,
//   })

//   // Controlled analysis trigger
//   const triggerAnalysis = useCallback(
//     async (analysisType: string) => {
//       const now = new Date()
//       const lastAnalysis = analysisState.lastAnalysis

//       // Rate limiting: prevent analysis more than once every 30 minutes
//       if (lastAnalysis && now.getTime() - lastAnalysis.getTime() < 30 * 60 * 1000) {
//         toast({
//           title: "Analysis Rate Limited",
//           description: "Please wait 30 minutes between AI analyses to avoid rate limits.",
//           variant: "destructive",
//         })
//         return
//       }

//       setAnalysisState({
//         lastAnalysis: now,
//         isAnalyzing: true,
//         analysisType,
//       })

//       try {
//         switch (analysisType) {
//           case "content-strategy":
//             await refetchStrategy()
//             break
//           case "optimal-times":
//             await refetchTimes()
//             break
//           case "audience-insights":
//             await refetchAudience()
//             break
//           case "competitor-analysis":
//             await refetchCompetitors()
//             break
//           case "content-trends":
//             await refetchTrends()
//             break
//           case "full-analysis":
//             await Promise.all([refetchStrategy(), refetchTimes(), refetchAudience(), refetchTrends()])
//             break
//         }

//         toast({
//           title: "Analysis Complete",
//           description: `${analysisType.replace("-", " ")} has been updated with fresh AI insights.`,
//         })
//       } catch (error) {
//         toast({
//           title: "Analysis Failed",
//           description: "Failed to generate AI insights. Please try again later.",
//           variant: "destructive",
//         })
//       } finally {
//         setAnalysisState((prev) => ({
//           ...prev,
//           isAnalyzing: false,
//           analysisType: null,
//         }))
//       }
//     },
//     [
//       analysisState.lastAnalysis,
//       refetchStrategy,
//       refetchTimes,
//       refetchAudience,
//       refetchCompetitors,
//       refetchTrends,
//       toast,
//     ],
//   )

//   // Calculate real metrics from actual data
//   const calculateRealMetrics = useCallback(() => {
//     if (!mediaData?.data || !insightsData?.data) return null

//     const posts = mediaData.data
//     const insights = insightsData.data

//     // Calculate engagement rate from real data
//     const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0)
//     const totalComments = posts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0)
//     const totalEngagement = totalLikes + totalComments
//     const avgEngagementPerPost = posts.length > 0 ? totalEngagement / posts.length : 0

//     // Get follower count from insights or estimate
//     const followerCount = insights.find((i: any) => i.name === "follower_count")?.values?.[0]?.value || 1000
//     const engagementRate = ((avgEngagementPerPost / followerCount) * 100).toFixed(2)

   
//     const postDates = posts.map((post: any) => new Date(post.timestamp))
//     const oldestPost = Math.min(...postDates.map((d: Date) => d.getTime()))
//     const newestPost = Math.max(...postDates.map((d: Date) => d.getTime()))
//     const daysDiff = (newestPost - oldestPost) / (1000 * 60 * 60 * 24)
//     const postsPerWeek = daysDiff > 0 ? ((posts.length / daysDiff) * 7).toFixed(1) : "0"

//     // Identify top performing content
//     const topPost = posts.reduce((best: any, current: any) => {
//       const currentEngagement = (current.like_count || 0) + (current.comments_count || 0)
//       const bestEngagement = (best?.like_count || 0) + (best?.comments_count || 0)
//       return currentEngagement > bestEngagement ? current : best
//     }, null)

//     return {
//       engagementRate,
//       totalPosts: posts.length,
//       totalLikes,
//       totalComments,
//       avgLikesPerPost: Math.round(totalLikes / posts.length),
//       avgCommentsPerPost: Math.round(totalComments / posts.length),
//       postsPerWeek,
//       topPost,
//       followerCount,
//     }
//   }, [mediaData, insightsData])

//   const realMetrics = calculateRealMetrics()

//   const handleRefreshData = async () => {
//     setIsRefreshing(true)
//     try {
//       await bulkRefreshIntegrations(userId)
//       await queryClient.invalidateQueries({ queryKey: ["instagram-media"] })
//       await queryClient.invalidateQueries({ queryKey: ["instagram-insights"] })

//       toast({
//         title: "Data Refreshed",
//         description: "Instagram data has been updated successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Refresh Failed",
//         description: "Failed to refresh Instagram data.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const handleRefreshToken = async () => {
//     try {
//       const result = await refreshAccessToken(userId)
//       if (result.status === 200) {
//         toast({
//           title: "Token Refreshed",
//           description: "Instagram access token refreshed successfully.",
//         })
//       } else {
//         toast({
//           title: "Token Refresh Failed",
//           description: result.message || "Failed to refresh access token.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to refresh access token.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Show loading state for core data
//   if (mediaLoading || insightsLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading Instagram data...</p>
//         </div>
//       </div>
//     )
//   }

//   // Show error state
//   if (mediaError || insightsError) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
//           <p className="text-muted-foreground mb-4">Failed to load Instagram data</p>
//           <Button onClick={handleRefreshData} variant="outline">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with controls */}
//       {/* <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Instagram className="h-6 w-6 text-pink-600" />
//           <h1 className="text-2xl font-bold">Instagram Growth Analytics</h1>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button onClick={handleRefreshToken} variant="outline" size="sm">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Refresh Token
//           </Button>
//           <Button onClick={handleRefreshData} disabled={isRefreshing} variant="outline" size="sm">
//             {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
//             Refresh Data
//           </Button>
//           <Button
//             onClick={() => triggerAnalysis("full-analysis")}
//             disabled={analysisState.isAnalyzing}
//             className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
//           >
//             {analysisState.isAnalyzing ? (
//               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//             ) : (
//               <Sparkles className="h-4 w-4 mr-2" />
//             )}
//             Generate AI Insights
//           </Button>
//         </div>
//       </div> */}

//       {/* Analysis Status */}
//       {analysisState.lastAnalysis && (
//         <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-blue-600" />
//                 <span className="text-sm font-medium">
//                   Last AI analysis: {analysisState.lastAnalysis.toLocaleString()}
//                 </span>
//               </div>
//               <Badge variant="secondary">
//                 Next analysis available in{" "}
//                 {Math.max(0, 30 - Math.floor((Date.now() - analysisState.lastAnalysis.getTime()) / (1000 * 60)))}{" "}
//                 minutes
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="growth-insights">Growth Insights</TabsTrigger>
//           <TabsTrigger value="content-analysis">Content Analysis</TabsTrigger>
//           <TabsTrigger value="competitive-intel">Competitive Intel</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab - Real Performance Metrics */}
//         <TabsContent value="overview" className="space-y-6">
//           {/* Period Selector */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium">Period:</span>
//             <Select
//               value={selectedPeriod}
//               onValueChange={(value: "day" | "week" | "days_28") => setSelectedPeriod(value)}
//             >
//               <SelectTrigger className="w-32">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="day">Today</SelectItem>
//                 <SelectItem value="week">This Week</SelectItem>
//                 <SelectItem value="days_28">Last 28 Days</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Real Performance Metrics */}
//           {realMetrics && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
//                       <p className="text-2xl font-bold text-green-600">{realMetrics.engagementRate}%</p>
//                     </div>
//                     <TrendingUp className="h-6 w-6 text-green-600" />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
//                       <p className="text-2xl font-bold">{realMetrics.totalPosts}</p>
//                     </div>
//                     <BarChart3 className="h-6 w-6 text-blue-600" />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">Avg Likes/Post</p>
//                       <p className="text-2xl font-bold">{realMetrics.avgLikesPerPost}</p>
//                     </div>
//                     <Eye className="h-6 w-6 text-purple-600" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* Account Insights */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {insightsData?.data?.map((insight: any, index: number) => {
//               const icons = [Users, Eye, Globe, TrendingUp]
//               const colors = ["blue", "green", "purple", "orange"]
//               const Icon = icons[index % icons.length]
//               const color = colors[index % colors.length]

//               return (
//                 <Card key={insight.name}>
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-muted-foreground capitalize">
//                           {insight.title || insight.name.replace("_", " ")}
//                         </p>
//                         <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
//                       </div>
//                       <Icon className={`h-6 w-6 text-${color}-600`} />
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>

//           {/* Top Performing Content */}
//           {realMetrics?.topPost && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Trophy className="h-5 w-5 text-amber-600" />
//                   Top Performing Post
//                 </CardTitle>
//                 <CardDescription>Your highest engagement post in this period</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-4">
//                   <div
//                     className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
//                     style={{
//                       backgroundImage: `url(${realMetrics.topPost.media_url || realMetrics.topPost.thumbnail_url || "/placeholder.svg?height=96&width=96"})`,
//                     }}
//                   />
//                   <div className="flex-1">
//                     <p className="text-sm line-clamp-3 mb-2">{realMetrics.topPost.caption || "No caption"}</p>
//                     <div className="flex gap-4 text-sm text-muted-foreground">
//                       <span>{realMetrics.topPost.like_count || 0} likes</span>
//                       <span>{realMetrics.topPost.comments_count || 0} comments</span>
//                       <span>
//                         {(
//                           ((realMetrics.topPost.like_count + realMetrics.topPost.comments_count) /
//                             realMetrics.followerCount) *
//                           100
//                         ).toFixed(2)}
//                         % engagement
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* Growth Insights Tab - AI-Powered Analysis */}
//         <TabsContent value="growth-insights" className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold">AI-Powered Growth Insights</h2>
//             <Button
//               onClick={() => triggerAnalysis("audience-insights")}
//               disabled={analysisState.isAnalyzing}
//               variant="outline"
//             >
//               {analysisState.isAnalyzing && analysisState.analysisType === "audience-insights" ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 <Brain className="h-4 w-4 mr-2" />
//               )}
//               Analyze Audience
//             </Button>
//           </div>

//           {/* AI Performance Scores */}
//           {audienceInsights?.data && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-5 w-5 text-purple-600" />
//                   AI Performance Analysis
//                 </CardTitle>
//                 <CardDescription>Deep insights into your account performance</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {audienceInsights.data.performanceScores?.map((score: any, index: number) => (
//                     <div key={index} className="text-center">
//                       <div
//                         className={`text-3xl font-bold mb-2 ${
//                           score.value > 80 ? "text-green-600" : score.value > 60 ? "text-blue-600" : "text-orange-600"
//                         }`}
//                       >
//                         {score.value}
//                       </div>
//                       <div className="text-sm text-muted-foreground">{score.name}</div>
//                       <Progress value={score.value} className="mt-2" />
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Growth Projections */}
//           {audienceInsights?.data && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Target className="h-5 w-5 text-green-600" />
//                     Growth Projection
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg mb-4">
//                     <div className="text-2xl font-bold text-green-600">
//                       {audienceInsights.data.growthProjection?.monthly || "N/A"}
//                     </div>
//                     <div className="text-sm text-muted-foreground">Projected monthly growth</div>
//                   </div>
//                   <div className="space-y-2">
//                     {audienceInsights.data.growthFactors?.map((factor: any, index: number) => (
//                       <div key={index} className="flex justify-between text-sm">
//                         <span>{factor.name}</span>
//                         <span className="text-green-600 font-medium">{factor.impact}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Zap className="h-5 w-5 text-yellow-600" />
//                     Engagement Optimization
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg mb-4">
//                     <div className="text-2xl font-bold text-yellow-600">
//                       {audienceInsights.data.currentEngagementRate || "N/A"}
//                     </div>
//                     <div className="text-sm text-muted-foreground">Current engagement rate</div>
//                   </div>
//                   <div className="space-y-2">
//                     {audienceInsights.data.engagementFactors?.map((factor: any, index: number) => (
//                       <div key={index} className="flex justify-between text-sm">
//                         <span>{factor.name}</span>
//                         <span className="text-blue-600 font-medium">{factor.impact}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* Optimal Posting Times */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     <Clock className="h-5 w-5 text-blue-600" />
//                     AI-Optimized Posting Schedule
//                   </CardTitle>
//                   <CardDescription>When your audience is most active</CardDescription>
//                 </div>
//                 <Button
//                   onClick={() => triggerAnalysis("optimal-times")}
//                   disabled={analysisState.isAnalyzing}
//                   variant="outline"
//                   size="sm"
//                 >
//                   {analysisState.isAnalyzing && analysisState.analysisType === "optimal-times" ? (
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                   )}
//                   Analyze Times
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {timesLoading ? (
//                 <div className="animate-pulse space-y-4">
//                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
//                 </div>
//               ) : optimalTimes?.data ? (
//                 <div className="grid grid-cols-7 gap-2">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
//                     const dayData = optimalTimes.data.schedule?.find((d: any) =>
//                       d.day.toLowerCase().startsWith(day.toLowerCase()),
//                     )

//                     return (
//                       <div key={day} className="text-center">
//                         <div className="font-medium text-sm mb-2">{day}</div>
//                         <div className="space-y-1">
//                           {dayData?.times?.map((time: any, i: number) => (
//                             <div
//                               key={i}
//                               className={`${
//                                 i % 2 === 0
//                                   ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
//                                   : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
//                               } text-xs p-1 rounded`}
//                             >
//                               {time}
//                             </div>
//                           )) || <div className="text-xs text-muted-foreground">Analyzing...</div>}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center text-muted-foreground py-8">
//                   <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p>Click &ldquo;Analyze Times&rdquo; to get AI-powered posting recommendations</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Content Analysis Tab */}
//         <TabsContent value="content-analysis" className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold">Content Performance Analysis</h2>
//             <Button
//               onClick={() => triggerAnalysis("content-strategy")}
//               disabled={analysisState.isAnalyzing}
//               variant="outline"
//             >
//               {analysisState.isAnalyzing && analysisState.analysisType === "content-strategy" ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 <Lightbulb className="h-4 w-4 mr-2" />
//               )}
//               Analyze Content
//             </Button>
//           </div>

//           {/* Content Strategy Recommendations */}
//           {contentStrategy?.data && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Lightbulb className="h-5 w-5 text-yellow-600" />
//                     AI Recommendations
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {contentStrategy.data.recommendations?.map((rec: any, index: number) => {
//                     const icons = [TrendingUp, Target, Sparkles]
//                     const colors = ["blue", "green", "purple"]
//                     const Icon = icons[index % icons.length]
//                     const color = colors[index % colors.length]

//                     return (
//                       <div
//                         key={index}
//                         className={`flex items-start gap-3 p-3 bg-${color}-50 dark:bg-${color}-950 rounded-lg`}
//                       >
//                         <Icon className={`h-5 w-5 text-${color}-600 mt-0.5`} />
//                         <div>
//                           <h4 className="font-medium">{rec.title}</h4>
//                           <p className="text-sm text-muted-foreground">{rec.description}</p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="h-5 w-5 text-blue-600" />
//                     Content Themes Performance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {contentStrategy.data.contentThemes?.map((theme: any, index: number) => (
//                     <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
//                       <div>
//                         <h4 className="font-medium">{theme.theme}</h4>
//                         <p className="text-sm text-muted-foreground">{theme.performance}</p>
//                       </div>
//                       <Badge variant="secondary">{theme.performance}</Badge>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* Content Trends */}
//           {contentTrends?.data && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5 text-green-600" />
//                   Content Trends & Opportunities
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {contentTrends.data.growthMetrics?.map((metric: any, index: number) => (
//                   <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                     <div>
//                       <h4 className="font-medium">{metric.name}</h4>
//                       <p className="text-sm text-muted-foreground">{metric.description}</p>
//                     </div>
//                     {metric.trend === "up" ? (
//                       <ArrowUp className="h-5 w-5 text-green-600" />
//                     ) : (
//                       <ArrowDown className="h-5 w-5 text-red-600" />
//                     )}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           )}

//           {/* Recent Posts Grid */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Posts Performance</CardTitle>
//               <CardDescription>Your latest content with engagement metrics</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {mediaData?.data?.slice(0, 9).map((post: any) => {
//                   const engagement = (post.like_count || 0) + (post.comments_count || 0)
//                   const engagementRate = realMetrics ? ((engagement / realMetrics.followerCount) * 100).toFixed(2) : "0"

//                   return (
//                     <div key={post.id} className="space-y-2">
//                       <div
//                         className="aspect-square bg-cover bg-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity relative"
//                         style={{
//                           backgroundImage: `url(${post.media_url || post.thumbnail_url || "/placeholder.svg?height=300&width=300"})`,
//                         }}
//                       >
//                         <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center rounded-lg">
//                           <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-center">
//                             <div className="text-sm font-medium">{engagement} total engagement</div>
//                             <div className="text-xs">{engagementRate}% rate</div>
//                           </div>
//                         </div>
//                       </div>
//                       <div>
//                         <p className="text-sm line-clamp-2">{post.caption || "No caption"}</p>
//                         <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                           <span>{post.like_count || 0} likes</span>
//                           <span>{post.comments_count || 0} comments</span>
//                           <span>{new Date(post.timestamp).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Competitive Intelligence Tab */}
//         <TabsContent value="competitive-intel" className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold">Competitive Intelligence</h2>
//             <Button
//               onClick={() => triggerAnalysis("competitor-analysis")}
//               disabled={analysisState.isAnalyzing}
//               variant="outline"
//             >
//               {analysisState.isAnalyzing && analysisState.analysisType === "competitor-analysis" ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 <Trophy className="h-4 w-4 mr-2" />
//               )}
//               Analyze Competitors
//             </Button>
//           </div>

//           {competitorAnalysis?.data ? (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Trophy className="h-5 w-5 text-amber-600" />
//                   Competitor Benchmarking
//                 </CardTitle>
//                 <CardDescription>How you compare to similar accounts</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {competitorAnalysis.data.competitors?.map((competitor: any, index: number) => {
//                     const colors = [
//                       "from-pink-500 to-purple-500",
//                       "from-blue-500 to-cyan-500",
//                       "from-green-500 to-emerald-500",
//                       "from-orange-500 to-amber-500",
//                     ]

//                     return (
//                       <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`w-10 h-10 bg-gradient-to-r ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold`}
//                           >
//                             {competitor.username.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <h4 className="font-medium">@{competitor.username}</h4>
//                             <p className="text-sm text-muted-foreground">{competitor.category}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm font-medium">Engagement: {competitor.engagementRate}</div>
//                           <div
//                             className={`text-xs ${competitor.comparison === "better" ? "text-green-600" : "text-muted-foreground"}`}
//                           >
//                             {competitor.comparisonText}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="text-center text-muted-foreground py-12">
//               <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
//               <p className="text-lg mb-2">Competitive Analysis</p>
//               <p className="text-sm mb-4">Get AI-powered insights on how you compare to competitors</p>
//               <Button onClick={() => triggerAnalysis("competitor-analysis")} disabled={analysisState.isAnalyzing}>
//                 {analysisState.isAnalyzing ? (
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <Trophy className="h-4 w-4 mr-2" />
//                 )}
//                 Start Analysis
//               </Button>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


"use client"

import { useState, useCallback } from "react"
import {
  Instagram,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Clock,
  Loader2,
  Target,
  Brain,
  Lightbulb,
  Users,
  Eye,
  Globe,
  Calendar,
  Zap,
  CheckCircle,
  XCircle,
  DollarSign,
  MessageSquare,
  Heart,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchInstagramMedia,
  getAccountInsights,
  refreshAccessToken,
  bulkRefreshIntegrations,
  generateContentStrategy,
  getOptimalPostingTimes,
  getAudienceInsights,
  analyzeContentTrends,
} from "@/actions/integrations"

interface InstagramDashboardProps {
  userId: string
}

interface AnalysisState {
  lastAnalysis: Date | null
  isAnalyzing: boolean
  analysisType: string | null
}

export default function InstagramBusinessDashboard({ userId }: InstagramDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "days_28">("week")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    lastAnalysis: null,
    isAnalyzing: false,
    analysisType: null,
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Core data queries
  const {
    data: mediaData,
    isLoading: mediaLoading,
    error: mediaError,
  } = useQuery({
    queryKey: ["instagram-media", userId],
    queryFn: () => fetchInstagramMedia(userId, 50),
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  })

  const {
    data: insightsData,
    isLoading: insightsLoading,
    error: insightsError,
  } = useQuery({
    queryKey: ["instagram-insights", userId, selectedPeriod],
    queryFn: () => getAccountInsights(userId, selectedPeriod),
    refetchInterval: 10 * 60 * 1000,
    retry: 2,
  })

  // AI analysis queries - controlled
  const {
    data: contentStrategy,
    isLoading: strategyLoading,
    refetch: refetchStrategy,
  } = useQuery({
    queryKey: ["content-strategy", userId],
    queryFn: () => generateContentStrategy(userId),
    enabled: false,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const {
    data: optimalTimes,
    isLoading: timesLoading,
    refetch: refetchTimes,
  } = useQuery({
    queryKey: ["optimal-times", userId],
    queryFn: () => getOptimalPostingTimes(userId),
    enabled: false,
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })

  const {
    data: audienceInsights,
    isLoading: audienceLoading,
    refetch: refetchAudience,
  } = useQuery({
    queryKey: ["audience-insights", userId],
    queryFn: () => getAudienceInsights(userId),
    enabled: false,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const {
    data: contentTrends,
    isLoading: trendsLoading,
    refetch: refetchTrends,
  } = useQuery({
    queryKey: ["content-trends", userId],
    queryFn: () => analyzeContentTrends(userId),
    enabled: false,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const triggerAnalysis = useCallback(
    async (analysisType: string) => {
      const now = new Date()
      const lastAnalysis = analysisState.lastAnalysis

      if (lastAnalysis && now.getTime() - lastAnalysis.getTime() < 30 * 60 * 1000) {
        toast({
          title: "Analysis Rate Limited",
          description: "Please wait 30 minutes between analyses to avoid rate limits.",
          variant: "destructive",
        })
        return
      }

      setAnalysisState({
        lastAnalysis: now,
        isAnalyzing: true,
        analysisType,
      })

      try {
        switch (analysisType) {
          case "content-strategy":
            await refetchStrategy()
            break
          case "optimal-times":
            await refetchTimes()
            break
          case "audience-insights":
            await refetchAudience()
            break
          case "content-trends":
            await refetchTrends()
            break
          case "full-analysis":
            await Promise.all([refetchStrategy(), refetchTimes(), refetchAudience(), refetchTrends()])
            break
        }

        toast({
          title: "Analysis Complete",
          description: `${analysisType.replace("-", " ")} analysis has been updated.`,
        })
      } catch (error) {
        toast({
          title: "Analysis Failed",
          description: "Failed to generate insights. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setAnalysisState((prev) => ({
          ...prev,
          isAnalyzing: false,
          analysisType: null,
        }))
      }
    },
    [analysisState.lastAnalysis, refetchStrategy, refetchTimes, refetchAudience, refetchTrends, toast]
  )

  const calculateBusinessMetrics = useCallback(() => {
    if (!mediaData?.data || !insightsData?.data) return null

    const posts = mediaData.data
    const insights = insightsData.data

    const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0)
    const totalComments = posts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0)
    const totalEngagement = totalLikes + totalComments

    const followerCount = insights.find((i: any) => i.name === "follower_count")?.values?.[0]?.value || 1000
    const impressions = insights.find((i: any) => i.name === "impressions")?.values?.[0]?.value || 0
    const reach = insights.find((i: any) => i.name === "reach")?.values?.[0]?.value || 0
    const profileViews = insights.find((i: any) => i.name === "profile_views")?.values?.[0]?.value || 0

    const engagementRate = posts.length > 0 ? ((totalEngagement / posts.length / followerCount) * 100).toFixed(2) : "0"
    const reachRate = followerCount > 0 ? ((reach / followerCount) * 100).toFixed(1) : "0"
    const conversionRate = impressions > 0 ? ((profileViews / impressions) * 100).toFixed(2) : "0"

    // Calculate posting frequency
    const postDates = posts.map((post: any) => new Date(post.timestamp))
    const oldestPost = Math.min(...postDates.map((d: Date) => d.getTime()))
    const newestPost = Math.max(...postDates.map((d: Date) => d.getTime()))
    const daysDiff = (newestPost - oldestPost) / (1000 * 60 * 60 * 24)
    const postsPerWeek = daysDiff > 0 ? ((posts.length / daysDiff) * 7).toFixed(1) : "0"

    // Top performing post
    const topPost = posts.reduce((best: any, current: any) => {
      const currentEngagement = (current.like_count || 0) + (current.comments_count || 0)
      const bestEngagement = (best?.like_count || 0) + (best?.comments_count || 0)
      return currentEngagement > bestEngagement ? current : best
    }, null)

    // Content type analysis
    const contentTypes = {
      image: posts.filter((p: any) => p.media_type === "IMAGE").length,
      video: posts.filter((p: any) => p.media_type === "VIDEO").length,
      carousel: posts.filter((p: any) => p.media_type === "CAROUSEL_ALBUM").length,
    }

    return {
      engagementRate,
      reachRate,
      conversionRate,
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      totalEngagement,
      avgLikesPerPost: Math.round(totalLikes / posts.length),
      avgCommentsPerPost: Math.round(totalComments / posts.length),
      postsPerWeek,
      topPost,
      followerCount,
      impressions,
      reach,
      profileViews,
      contentTypes,
    }
  }, [mediaData, insightsData])

  const businessMetrics = calculateBusinessMetrics()

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      await bulkRefreshIntegrations(userId)
      await queryClient.invalidateQueries({ queryKey: ["instagram-media"] })
      await queryClient.invalidateQueries({ queryKey: ["instagram-insights"] })

      toast({
        title: "Data Refreshed",
        description: "Instagram data has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh Instagram data.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  if (mediaLoading || insightsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Instagram analytics...</p>
        </div>
      </div>
    )
  }

  if (mediaError || insightsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Failed to load Instagram data</p>
          <Button onClick={handleRefreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-600" />
          <h1 className="text-2xl font-bold">Instagram Business Analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefreshData} disabled={isRefreshing} variant="outline" size="sm">
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Data
          </Button>
          <Button
            onClick={() => triggerAnalysis("full-analysis")}
            disabled={analysisState.isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {analysisState.isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Generate Insights
          </Button>
        </div>
      </div>

      {analysisState.lastAnalysis && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Last analysis: {analysisState.lastAnalysis.toLocaleString()}
                </span>
              </div>
              <Badge variant="secondary">
                Next analysis available in{" "}
                {Math.max(0, 30 - Math.floor((Date.now() - analysisState.lastAnalysis.getTime()) / (1000 * 60)))}{" "}
                minutes
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="growth-strategy">Growth Strategy</TabsTrigger>
          <TabsTrigger value="content-optimization">Content Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Period:</span>
            <Select
              value={selectedPeriod}
              onValueChange={(value: "day" | "week" | "days_28") => setSelectedPeriod(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="days_28">Last 28 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {businessMetrics && (
            <>
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                        <p className="text-2xl font-bold text-green-600">{businessMetrics.engagementRate}%</p>
                        <p className="text-xs text-muted-foreground">Industry avg: 1.22%</p>
                      </div>
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reach Rate</p>
                        <p className="text-2xl font-bold text-blue-600">{businessMetrics.reachRate}%</p>
                        <p className="text-xs text-muted-foreground">Of your followers</p>
                      </div>
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Profile Conversion</p>
                        <p className="text-2xl font-bold text-purple-600">{businessMetrics.conversionRate}%</p>
                        <p className="text-xs text-muted-foreground">Impressions to profile views</p>
                      </div>
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Posting Frequency</p>
                        <p className="text-2xl font-bold text-orange-600">{businessMetrics.totalPosts}</p>
                        <p className="text-xs text-muted-foreground">Posts per week</p>
                      </div>
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Breakdown</CardTitle>
                    <CardDescription>Total engagement metrics for this period</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Total Likes</span>
                      </div>
                      <span className="font-semibold">{businessMetrics.totalLikes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span>Total Comments</span>
                      </div>
                      <span className="font-semibold">{businessMetrics.totalComments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium">Average per Post</span>
                      <span className="font-semibold">
                        {businessMetrics.avgLikesPerPost} likes, {businessMetrics.avgCommentsPerPost} comments
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reach & Impressions</CardTitle>
                    <CardDescription>How your content is being discovered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-500" />
                        <span>Total Reach</span>
                      </div>
                      <span className="font-semibold">{businessMetrics.reach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        <span>Total Impressions</span>
                      </div>
                      <span className="font-semibold">{businessMetrics.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium">Profile Views</span>
                      <span className="font-semibold">{businessMetrics.profileViews.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Type Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Type Distribution</CardTitle>
                  <CardDescription>Performance by content format</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{businessMetrics.contentTypes.image}</div>
                      <div className="text-sm text-muted-foreground">Single Images</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {((businessMetrics.contentTypes.image / businessMetrics.totalPosts) * 100).toFixed(0)}% of posts
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{businessMetrics.contentTypes.video}</div>
                      <div className="text-sm text-muted-foreground">Videos & Reels</div>
                      <div className="text-xs text-green-600 mt-1">
                        {((businessMetrics.contentTypes.video / businessMetrics.totalPosts) * 100).toFixed(0)}% of posts
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{businessMetrics.contentTypes.carousel}</div>
                      <div className="text-sm text-muted-foreground">Carousels</div>
                      <div className="text-xs text-purple-600 mt-1">
                        {((businessMetrics.contentTypes.carousel / businessMetrics.totalPosts) * 100).toFixed(0)}% of posts
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Post */}
              {businessMetrics.topPost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Best Performing Post
                    </CardTitle>
                    <CardDescription>Learn from your most engaging content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div
                        className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                        style={{
                          backgroundImage: `url(${businessMetrics.topPost.media_url || businessMetrics.topPost.thumbnail_url || "/placeholder.svg?height=96&width=96"})`,
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-3 mb-3">
                          {businessMetrics.topPost.caption?.slice(0, 150)}
                          {businessMetrics.topPost.caption?.length > 150 ? "..." : ""}
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Likes:</span>
                            <div className="font-semibold">{businessMetrics.topPost.like_count || 0}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Comments:</span>
                            <div className="font-semibold">{businessMetrics.topPost.comments_count || 0}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Engagement Rate:</span>
                            <div className="font-semibold text-green-600">
                              {(
                                ((businessMetrics.topPost.like_count + businessMetrics.topPost.comments_count) /
                                  businessMetrics.followerCount) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="growth-strategy" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Growth Strategy Insights</h2>
            <Button
              onClick={() => triggerAnalysis("audience-insights")}
              disabled={analysisState.isAnalyzing}
              variant="outline"
            >
              {analysisState.isAnalyzing && analysisState.analysisType === "audience-insights" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              Analyze Audience
            </Button>
          </div>

          {audienceInsights?.data ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Growth Opportunity Score
                    </CardTitle>
                    <CardDescription>AI-calculated growth potential based on your current metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {audienceInsights.data.growthScore || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">Growth Opportunity Score</div>
                      <Progress value={audienceInsights.data.growthScore || 0} className="mb-2" />
                      <div className="text-xs text-muted-foreground">
                        Based on engagement rate, posting consistency, and content quality
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Audience Quality Score
                    </CardTitle>
                    <CardDescription>How engaged and valuable your audience is</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {audienceInsights.data.audienceQuality || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">Audience Quality Score</div>
                      <Progress value={audienceInsights.data.audienceQuality || 0} className="mb-2" />
                      <div className="text-xs text-muted-foreground">
                        Based on engagement patterns and follower interaction quality
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {audienceInsights.data.growthRecommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Strategic Growth Recommendations
                    </CardTitle>
                    <CardDescription>Actionable insights to accelerate your business growth</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {audienceInsights.data.growthRecommendations.map((rec: any, index: number) => {
                      const priorities = ["High", "Medium", "Low"]
                      const colors = ["red", "yellow", "green"]
                      const priority = priorities[index % priorities.length]
                      const color = colors[index % colors.length]

                      return (
                        <div key={index} className={`flex items-start gap-3 p-4 border-l-4 border-${color}-500 bg-${color}-50 dark:bg-${color}-950 rounded-r-lg`}>
                          <div className={`w-2 h-2 bg-${color}-500 rounded-full mt-2`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <Badge variant="outline" className={`text-${color}-700 border-${color}-300`}>
                                {priority} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Expected impact: {rec.expectedImpact || "Medium"}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Growth Strategy Analysis</p>
              <p className="text-sm mb-4">Get AI-powered insights to accelerate your business growth</p>
              <Button onClick={() => triggerAnalysis("audience-insights")} disabled={analysisState.isAnalyzing}>
                {analysisState.isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Analyze Growth Opportunities
              </Button>
            </div>
          )}

          {/* Optimal Posting Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Optimal Posting Schedule
                  </CardTitle>
                  <CardDescription>Maximize reach by posting when your audience is most active</CardDescription>
                </div>
                <Button
                  onClick={() => triggerAnalysis("optimal-times")}
                  disabled={analysisState.isAnalyzing}
                  variant="outline"
                  size="sm"
                >
                  {analysisState.isAnalyzing && analysisState.analysisType === "optimal-times" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Update Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {timesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              ) : optimalTimes?.data ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                      const dayData = optimalTimes.data.schedule?.find((d: any) =>
                        d.day.toLowerCase() === day.toLowerCase()
                      )

                      return (
                        <div key={day} className="text-center">
                          <div className="font-medium text-sm mb-2">{day.slice(0, 3)}</div>
                          <div className="space-y-1">
                            {dayData?.times?.slice(0, 2).map((time: any, i: number) => (
                              <div
                                key={i}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs p-1 rounded"
                              >
                                {time}
                              </div>
                            )) || <div className="text-xs text-muted-foreground">No data</div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {optimalTimes.data.insights && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium mb-2">Key Insights:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {optimalTimes.data.insights.map((insight: string, index: number) => (
                          <li key={index}>• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click &ldquo;Update Schedule&rdquo; to get optimized posting times based on your audience activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content-optimization" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Content Optimization</h2>
            <Button
              onClick={() => triggerAnalysis("content-strategy")}
              disabled={analysisState.isAnalyzing}
              variant="outline"
            >
              {analysisState.isAnalyzing && analysisState.analysisType === "content-strategy" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Analyze Content Strategy
            </Button>
          </div>

          {contentStrategy?.data ? (
            <div className="space-y-6">
              {/* Content Performance Analysis */}
              {contentStrategy.data.contentAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Content Performance Analysis
                    </CardTitle>
                    <CardDescription>Understanding what content drives the best results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {contentStrategy.data.contentAnalysis.topPerformingTypes?.map((type: any, index: number) => {
                        const colors = ["green", "blue", "purple"]
                        const color = colors[index % colors.length]
                        
                        return (
                          <div key={index} className={`p-4 bg-${color}-50 dark:bg-${color}-950 rounded-lg`}>
                            <div className={`text-2xl font-bold text-${color}-600 mb-1`}>
                              {type.avgEngagementRate}%
                            </div>
                            <div className="font-medium">{type.contentType}</div>
                            <div className="text-sm text-muted-foreground">
                              {type.postCount} posts analyzed
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strategic Recommendations */}
              {contentStrategy.data.recommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Content Strategy Recommendations
                    </CardTitle>
                    <CardDescription>Actionable insights to improve your content performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contentStrategy.data.recommendations.map((rec: any, index: number) => {
                      const impactColors = {
                        high: "green",
                        medium: "yellow",
                        low: "gray"
                      }
                      const color = "blue"

                      return (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`w-3 h-3 bg-${color}-500 rounded-full mt-1.5 flex-shrink-0`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <Badge variant="outline">
                                {rec.impact || "Medium"} Impact
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                            {rec.actionableSteps && (
                              <div className="text-xs text-muted-foreground">
                                Next steps: {rec.actionableSteps}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Content Theme Analysis */}
              {contentStrategy.data.themeAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Content Theme Performance
                    </CardTitle>
                    <CardDescription>Which topics and themes resonate most with your audience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contentStrategy.data.themeAnalysis.map((theme: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{theme.theme}</div>
                            <div className="text-sm text-muted-foreground">
                              {theme.postCount} posts • Avg engagement: {theme.avgEngagement}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              theme.trend === 'up' ? 'text-green-600' : 
                              theme.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {theme.engagementRate}%
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              {theme.trend === 'up' ? (
                                <ArrowUpRight className="h-3 w-3 text-green-600" />
                              ) : theme.trend === 'down' ? (
                                <ArrowDownRight className="h-3 w-3 text-red-600" />
                              ) : null}
                              {theme.trendLabel}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Content Strategy Analysis</p>
              <p className="text-sm mb-4">Get insights on how to optimize your content for better engagement</p>
              <Button onClick={() => triggerAnalysis("content-strategy")} disabled={analysisState.isAnalyzing}>
                {analysisState.isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Lightbulb className="h-4 w-4 mr-2" />
                )}
                Analyze Content Performance
              </Button>
            </div>
          )}

          {/* Recent Posts Performance Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts Analysis</CardTitle>
              <CardDescription>Performance metrics for your latest content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaData?.data?.slice(0, 12).map((post: any) => {
                  const engagement = (post.like_count || 0) + (post.comments_count || 0)
                  const engagementRate = businessMetrics ? ((engagement / businessMetrics.followerCount) * 100).toFixed(2) : "0"
                  const isHighPerforming = parseFloat(engagementRate) > parseFloat(businessMetrics?.engagementRate || "0")

                  return (
                    <div key={post.id} className="space-y-3 p-3 border rounded-lg">
                      <div
                        className="aspect-square bg-cover bg-center rounded-lg relative"
                        style={{
                          backgroundImage: `url(${post.media_url || post.thumbnail_url || "/placeholder.svg?height=300&width=300"})`,
                        }}
                      >
                        {isHighPerforming && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-600 text-white">High Performer</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-60 text-white text-xs p-2 rounded">
                          <div className="flex justify-between">
                            <span>{post.like_count || 0} likes</span>
                            <span>{post.comments_count || 0} comments</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm line-clamp-2 mb-2">
                          {post.caption?.slice(0, 80)}
                          {post.caption?.length > 80 ? "..." : ""}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Engagement: {engagementRate}%</span>
                          <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}