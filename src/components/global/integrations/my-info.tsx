// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import {
//   Instagram,
//   TrendingUp,
//   Users,
//   Heart,
//   MessageCircle,
//   Eye,
//   RefreshCw,
//   Search,
//   Calendar,
//   AlertTriangle,
//   CheckCircle,
//   BarChart3,
//   Image as ImageIcon,
//   Hash,
//   Clock,
//   Loader2,
//   Activity,
//   Globe,
//   Link,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { 
//   fetchInstagramMedia,
//   getMediaInsights,
//   getAccountInsights,
//   refreshAccessToken,
//   checkTokenExpiry,
//   searchHashtag,
//   getMediaComments,
//   getUserMentions,
//   bulkRefreshIntegrations,
//   validateConnection
// } from "@/actions/integrations"

// interface InstagramDashboardProps {
//   userId: string
// }

// export default function InstagramDashboard({ userId }: InstagramDashboardProps) {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "days_28">("week")
//   const [hashtagSearch, setHashtagSearch] = useState("")
//   const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const { toast } = useToast()
//   const queryClient = useQueryClient()

//   // Fetch Instagram media
//   const { data: mediaData, isLoading: mediaLoading } = useQuery({
//     queryKey: ["instagram-media", userId],
//     queryFn: () => fetchInstagramMedia(userId, 25),
//     refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
//   })

//   // Fetch account insights
//   const { data: insightsData, isLoading: insightsLoading } = useQuery({
//     queryKey: ["instagram-insights", userId, selectedPeriod],
//     queryFn: () => getAccountInsights(userId, selectedPeriod),
//     refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
//   })

//   // Check token expiry
//   const { data: tokenStatus, isLoading: tokenLoading } = useQuery({
//     queryKey: ["token-status", userId],
//     queryFn: () => checkTokenExpiry(userId),
//     refetchInterval: 60 * 60 * 1000, // Check every hour
//   })

//   // Validate connection
//   const { data: connectionStatus } = useQuery({
//     queryKey: ["connection-status", userId],
//     queryFn: () => validateConnection(userId),
//     refetchInterval: 30 * 60 * 1000, // Check every 30 minutes
//   })

//   // Fetch user mentions
//   const { data: mentionsData, isLoading: mentionsLoading } = useQuery({
//     queryKey: ["instagram-mentions", userId],
//     queryFn: () => getUserMentions(userId, 10),
//   })

//   // Fetch media insights for selected media
//   const { data: selectedMediaInsights } = useQuery({
//     queryKey: ["media-insights", userId, selectedMediaId],
//     queryFn: () => selectedMediaId ? getMediaInsights(userId, selectedMediaId) : null,
//     enabled: !!selectedMediaId,
//   })

//   // Auto-refresh token if needed
//   useEffect(() => {
//     if (tokenStatus?.data?.shouldRefresh && !isRefreshing) {
//       handleRefreshToken()
//     }
//   }, [tokenStatus])

//   const handleRefreshToken = async () => {
//     setIsRefreshing(true)
//     try {
//       const result = await refreshAccessToken(userId)
//       if (result.status === 200) {
//         toast({
//           title: "Token Refreshed",
//           description: "Your Instagram access token has been refreshed successfully.",
//           duration: 3000,
//         })
//         queryClient.invalidateQueries({ queryKey: ["token-status", userId] })
//       } else {
//         toast({
//           title: "Refresh Failed",
//           description: result.message || "Failed to refresh access token.",
//           variant: "destructive",
//           duration: 3000,
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to refresh access token.",
//         variant: "destructive",
//         duration: 3000,
//       })
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const handleBulkRefresh = async () => {
//     setIsRefreshing(true)
//     try {
//       const result = await bulkRefreshIntegrations(userId)
//       if (result.status === 200) {
//         toast({
//           title: "Data Refreshed",
//           description: `Successfully refreshed ${result.data?.successful} integrations.`,
//           duration: 3000,
//         })
//         queryClient.invalidateQueries()
//       } else {
//         toast({
//           title: "Refresh Failed",
//           description: result.message || "Failed to refresh integrations.",
//           variant: "destructive",
//           duration: 3000,
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to refresh integrations.",
//         variant: "destructive",
//         duration: 3000,
//       })
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const handleHashtagSearch = async () => {
//     if (!hashtagSearch.trim()) return

//     try {
//       const result = await searchHashtag(userId, hashtagSearch.replace('#', ''))
//       if (result.status === 200) {
//         toast({
//           title: "Hashtag Found",
//           description: `Found ${result.data?.topMedia.length} top posts for #${hashtagSearch}`,
//           duration: 3000,
//         })
//         // You can store this data in state and display it
//       } else {
//         toast({
//           title: "Search Failed",
//           description: result.message || "Hashtag not found.",
//           variant: "destructive",
//           duration: 3000,
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to search hashtag.",
//         variant: "destructive",
//         duration: 3000,
//       })
//     }
//   }

//   // Render token status alert
//   const renderTokenAlert = () => {
//     if (tokenLoading || !tokenStatus?.data) return null

//     const { isExpired, daysUntilExpiry, shouldRefresh } = tokenStatus.data

//     if (isExpired) {
//       return (
//         <Alert variant="destructive" className="mb-6">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertTitle>Token Expired</AlertTitle>
//           <AlertDescription className="flex items-center justify-between">
//             <span>Your Instagram access token has expired. Please refresh it to continue using the integration.</span>
//             <Button onClick={handleRefreshToken} disabled={isRefreshing} size="sm">
//               {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Token"}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       )
//     }

//     if (shouldRefresh) {
//       return (
//         <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
//           <Clock className="h-4 w-4 text-amber-600" />
//           <AlertTitle className="text-amber-800 dark:text-amber-200">Token Expiring Soon</AlertTitle>
//           <AlertDescription className="text-amber-700 dark:text-amber-300 flex items-center justify-between">
//             <span>Your token expires in {daysUntilExpiry} days. Consider refreshing it soon.</span>
//             <Button onClick={handleRefreshToken} disabled={isRefreshing} size="sm" variant="outline">
//               {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Now"}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       )
//     }

//     return null
//   }

//   // Render connection status
//   const renderConnectionStatus = () => {
//     if (!connectionStatus) return null

//     const isValid = connectionStatus.status === 200 && connectionStatus.data?.isValid

//     return (
//       <div className="flex items-center gap-2 mb-4">
//         {isValid ? (
//           <>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//             {/* <span className="text-sm text-green-700 dark:text-green-400">
//               Connected as @{connectionStatus.data?.username}
//             </span> */}
//           </>
//         ) : (
//           <>
//             <AlertTriangle className="h-4 w-4 text-red-500" />
//             <span className="text-sm text-red-700 dark:text-red-400">
//               Connection invalid
//             </span>
//           </>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Instagram className="h-8 w-8 text-blue-600" />
//           <div>
//             <h2 className="text-2xl font-bold">Instagram Dashboard</h2>
//             <p className="text-muted-foreground">Manage your Instagram content and analytics</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={handleBulkRefresh}
//             disabled={isRefreshing}
//             variant="outline"
//             size="sm"
//           >
//             {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
//             Refresh All
//           </Button>
//         </div>
//       </div>

//       {renderConnectionStatus()}
//       {renderTokenAlert()}

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="content">Content</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//           <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
//           <TabsTrigger value="mentions">Mentions</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           {/* Account Insights Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {insightsLoading ? (
//               Array.from({ length: 4 }).map((_, i) => (
//                 <Card key={i} className="animate-pulse">
//                   <CardContent className="p-6">
//                     <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                     <div className="h-8 bg-gray-200 rounded"></div>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               insightsData?.data?.map((insight: any, index: number) => {
//                 const icons = [Eye, Users, TrendingUp, Globe]
//                 const Icon = icons[index] || Activity
//                 return (
//                   <Card key={insight.name}>
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-medium text-muted-foreground capitalize">
//                             {insight.name.replace('_', ' ')}
//                           </p>
//                           <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
//                         </div>
//                         <Icon className="h-6 w-6 text-blue-600" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })
//             )}
//           </div>

//           {/* Period Selector */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium">Period:</span>
//             <Select value={selectedPeriod} onValueChange={(value: "day" | "week" | "days_28") => setSelectedPeriod(value)}>
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
//         </TabsContent>

//         {/* Content Tab */}
//         <TabsContent value="content" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {mediaLoading ? (
//               Array.from({ length: 6 }).map((_, i) => (
//                 <Card key={i} className="animate-pulse">
//                   <div className="aspect-square bg-gray-200"></div>
//                   <CardContent className="p-4">
//                     <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded"></div>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               mediaData?.data?.map((post: any) => (
//                 <Card key={post.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
//                   <div 
//                     className="aspect-square bg-cover bg-center relative"
//                     style={{ backgroundImage: `url(${post.media_url || post.thumbnail_url})` }}
//                     onClick={() => setSelectedMediaId(post.id)}
//                   >
//                     <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
//                       <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-4 text-white">
//                         <div className="flex items-center gap-1">
//                           <Heart className="h-4 w-4" />
//                           <span className="text-sm">{post.like_count || 0}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <MessageCircle className="h-4 w-4" />
//                           <span className="text-sm">{post.comments_count || 0}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <Badge className="absolute top-2 right-2" variant={post.media_type === 'VIDEO' ? 'default' : 'secondary'}>
//                       {post.media_type}
//                     </Badge>
//                   </div>
//                   <CardContent className="p-4">
//                     <p className="text-sm text-muted-foreground line-clamp-2">
//                       {post.caption || 'No caption'}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-2">
//                       {new Date(post.timestamp).toLocaleDateString()}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>

//           {/* Selected Media Insights */}
//           {selectedMediaId && selectedMediaInsights && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Post Insights</CardTitle>
//                 <CardDescription>Detailed analytics for selected post</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {selectedMediaInsights.data?.map((insight: any) => (
//                     <div key={insight.name} className="text-center">
//                       <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
//                       <p className="text-sm text-muted-foreground capitalize">
//                         {insight.name.replace('_', ' ')}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* Analytics Tab */}
//         <TabsContent value="analytics" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart3 className="h-5 w-5" />
//                 Account Performance
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {insightsData?.data && (
//                 <div className="space-y-4">
//                   {insightsData.data.map((insight: any) => (
//                     <div key={insight.name} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div>
//                         <h4 className="font-medium capitalize">{insight.name.replace('_', ' ')}</h4>
//                         <p className="text-sm text-muted-foreground">
//                           {insight.description || `${insight.period} period data`}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {new Date(insight.values[0]?.end_time).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Hashtags Tab */}
//         <TabsContent value="hashtags" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Hash className="h-5 w-5" />
//                 Hashtag Research
//               </CardTitle>
//               <CardDescription>Search and analyze hashtag performance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-2 mb-4">
//                 <Input
//                   placeholder="Enter hashtag (without #)"
//                   value={hashtagSearch}
//                   onChange={(e) => setHashtagSearch(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleHashtagSearch()}
//                 />
//                 <Button onClick={handleHashtagSearch} disabled={!hashtagSearch.trim()}>
//                   <Search className="h-4 w-4 mr-2" />
//                   Search
//                 </Button>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Search for hashtags to see top performing posts and get insights for your content strategy.
//               </p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Mentions Tab */}
//         <TabsContent value="mentions" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>User Mentions</CardTitle>
//               <CardDescription>Posts where you&apos;ve been tagged</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {mentionsLoading ? (
//                 <div className="space-y-4">
//                   {Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} className="flex items-center space-x-4 animate-pulse">
//                       <div className="w-16 h-16 bg-gray-200 rounded"></div>
//                       <div className="flex-1">
//                         <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                         <div className="h-3 bg-gray-200 rounded"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : mentionsData?.data?.length > 0 ? (
//                 <div className="space-y-4">
//                   {mentionsData?.data.map((mention: any) => (
//                     <div key={mention.id} className="flex items-center space-x-4 p-4 border rounded-lg">
//                       <img
//                         src={mention.media_url || mention.thumbnail_url}
//                         alt="Mention"
//                         className="w-16 h-16 object-cover rounded"
//                       />
//                       <div className="flex-1">
//                         <p className="text-sm line-clamp-2">{mention.caption || 'No caption'}</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           {new Date(mention.timestamp).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <Button variant="outline" size="sm" asChild>
//                         <a href={mention.permalink} target="_blank" rel="noopener noreferrer">
//                           <Link className="h-4 w-4 mr-2" />
//                           View
//                         </a>
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-center text-muted-foreground py-8">
//                   No mentions found. You haven&apos;t been tagged in any posts recently.
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

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
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { fetchInstagramMedia, getAccountInsights } from "@/actions/integrations"
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
//         toast({
//           title: "Caption Generated",
//           description: "AI-powered caption has been created for your content.",
//           duration: 3000,
//         })

//         // Also generate hashtag suggestions
//         refetchHashtags()
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

//   return (
//     <div className="space-y-6">
//       {/* Header with AI Badge */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Instagram className="h-8 w-8 text-blue-600" />
//           <div>
//             <div className="flex items-center gap-2">
//               <h2 className="text-2xl font-bold">AI-Powered Instagram Dashboard</h2>
//               <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                 <Sparkles className="h-3 w-3 mr-1" />
//                 AI Enhanced
//               </Badge>
//             </div>
//             <p className="text-muted-foreground">Intelligent insights and automated growth strategies</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
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
//                   ))}
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
//                   })
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
//                   ))
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
//                           ))}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
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
//             </CardContent>
//           </Card>

//           {/* Hashtag Suggestions */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Hash className="h-5 w-5 text-blue-600" />
//                 Smart Hashtag Suggestions
//               </CardTitle>
//               <CardDescription>AI-curated hashtags to maximize your reach</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {hashtagsLoading ? (
//                 <div className="animate-pulse space-y-4">
//                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
//                 </div>
//               ) : hashtagSuggestions?.data ? (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {Object.entries(hashtagSuggestions.data).map(([category, tags]: [string, any]) => (
//                     <div key={category}>
//                       <h4 className="font-medium mb-2 text-blue-600 capitalize">{category.replace(/_/g, " ")}</h4>
//                       <div className="flex flex-wrap gap-1">
//                         {Array.isArray(tags) &&
//                           tags.map((tag: string, i: number) => (
//                             <Badge key={i} variant="outline">
//                               {tag.startsWith("#") ? tag : `#${tag}`}
//                             </Badge>
//                           ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4">
//                   <p className="text-muted-foreground">Generate a caption to see hashtag suggestions</p>
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
//                       ))}
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
//                       ))}
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
//                         ))}
//                       </div>
//                     </div>
//                   ))}
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
//                     })}
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
//                 {audienceLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <div key={i} className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     {audienceInsights?.data?.automationSettings?.map((setting: any, index: number) => (
//                       <div key={index} className="flex items-center justify-between">
//                         <span>{setting.name}</span>
//                         <Badge variant={setting.active ? "secondary" : "outline"}>
//                           {setting.active ? "Active" : "Inactive"}
//                         </Badge>
//                       </div>
//                     ))}
//                     <Button className="w-full">Configure Settings</Button>
//                   </>
//                 )}
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
//                 {calendarLoading ? (
//                   <div className="animate-pulse space-y-4">
//                     <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
//                     <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
//                       <div className="text-2xl font-bold text-blue-600">
//                         {contentCalendar?.data?.scheduledCount || 0}
//                       </div>
//                       <div className="text-sm text-muted-foreground">Posts scheduled</div>
//                     </div>
//                     <div className="space-y-2">
//                       {contentCalendar?.data?.scheduleSummary?.map((item: any, index: number) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{item.label}</span>
//                           <span>{item.value}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <Button className="w-full">Schedule New Post</Button>
//                   </>
//                 )}
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
//                         <Button size="sm" variant="ghost">
//                           Download
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="border-t pt-4 text-center text-muted-foreground">
//                   <p>No recent reports available</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import {
  Instagram,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Hash,
  Clock,
  Loader2,
  Sparkles,
  Target,
  Zap,
  Brain,
  Trophy,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Camera,
  PenTool,
  CalendarIcon,
  UserPlus,
  Share2,
  Download,
  Settings,
  Play,
  Pause,
  Plus,
  Search,
  Users,
  Eye,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchInstagramMedia,
  getAccountInsights,
  searchHashtag,
  refreshAccessToken,
  bulkRefreshIntegrations,
} from "@/actions/integrations"
import {
  generateContentStrategy,
  getOptimalPostingTimes,
  analyzeCompetitors,
  generateCaptions,
  getAudienceInsights,
  analyzeContentTrends,
  generateReports,
  generateHashtagSuggestions,
  createContentCalendar,
} from "@/actions/integrations"

interface InstagramDashboardProps {
  userId: string
}

export default function EnhancedInstagramDashboard({ userId }: InstagramDashboardProps) {
  const [activeTab, setActiveTab] = useState("ai-insights")
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "days_28">("week")
  const [hashtagSearch, setHashtagSearch] = useState("")
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [contentPrompt, setContentPrompt] = useState("")
   const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTone, setSelectedTone] = useState("professional")
  const [generatedCaption, setGeneratedCaption] = useState<any>(null)
  const [isSearchingHashtag, setIsSearchingHashtag] = useState(false)
  const [hashtagResults, setHashtagResults] = useState<any>(null)
  const [automationSettings, setAutomationSettings] = useState({
    autoLike: false,
    autoFollow: false,
    smartReplies: true,
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Existing queries
  const { data: mediaData, isLoading: mediaLoading } = useQuery({
    queryKey: ["instagram-media", userId],
    queryFn: () => fetchInstagramMedia(userId, 25),
    refetchInterval: 5 * 60 * 1000,
  })

  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ["instagram-insights", userId, selectedPeriod],
    queryFn: () => getAccountInsights(userId, selectedPeriod),
    refetchInterval: 10 * 60 * 1000,
  })

  // AI-powered queries
  const { data: contentStrategy, isLoading: strategyLoading } = useQuery({
    queryKey: ["content-strategy", userId],
    queryFn: () => generateContentStrategy(userId),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })

  const { data: optimalTimes, isLoading: timesLoading } = useQuery({
    queryKey: ["optimal-times", userId],
    queryFn: () => getOptimalPostingTimes(userId),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  const { data: audienceInsights, isLoading: audienceLoading } = useQuery({
    queryKey: ["audience-insights", userId],
    queryFn: () => getAudienceInsights(userId),
    staleTime: 24 * 60 * 60 * 1000,
  })

  const { data: competitorAnalysis, isLoading: competitorLoading } = useQuery({
    queryKey: ["competitor-analysis", userId],
    queryFn: () => analyzeCompetitors(userId),
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })

  const { data: contentTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ["content-trends", userId],
    queryFn: () => analyzeContentTrends(userId),
    staleTime: 24 * 60 * 60 * 1000,
  })

  const {
    data: hashtagSuggestions,
    isLoading: hashtagsLoading,
    refetch: refetchHashtags,
  } = useQuery({
    queryKey: ["hashtag-suggestions", userId, contentPrompt],
    queryFn: () => generateHashtagSuggestions(userId, contentPrompt),
    enabled: false, // Don't run automatically
    staleTime: 24 * 60 * 60 * 1000,
  })

  const { data: contentCalendar, isLoading: calendarLoading } = useQuery({
    queryKey: ["content-calendar", userId],
    queryFn: () => createContentCalendar(userId, 7), // 7-day calendar
    staleTime: 24 * 60 * 60 * 1000,
  })

  const handleGenerateCaption = async () => {
    if (!contentPrompt.trim()) return

    setIsGenerating(true)
    try {
      const result = await generateCaptions(userId, contentPrompt, selectedTone)
      if (result.status === 200) {
        setGeneratedCaption(result.data)
        toast({
          title: "Caption Generated",
          description: "AI-powered caption has been created for your content.",
          duration: 3000,
        })

        // Also generate hashtag suggestions
        refetchHashtags()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate caption.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate caption.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      const result = await generateReports(userId, selectedPeriod)
      if (result.status === 200) {
        toast({
          title: "Report Generated",
          description: "Your comprehensive Instagram report is ready for download.",
          duration: 3000,
        })
        // In a real app, you'd trigger a download here
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate report.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      })
    }
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      // Refresh Instagram data
      await bulkRefreshIntegrations(userId)

      // Invalidate all queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ["instagram-media"] })
      await queryClient.invalidateQueries({ queryKey: ["instagram-insights"] })
      await queryClient.invalidateQueries({ queryKey: ["content-strategy"] })
      await queryClient.invalidateQueries({ queryKey: ["optimal-times"] })
      await queryClient.invalidateQueries({ queryKey: ["audience-insights"] })
      await queryClient.invalidateQueries({ queryKey: ["content-trends"] })

      toast({
        title: "Data Refreshed",
        description: "All dashboard data has been updated.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleHashtagSearch = async () => {
    if (!hashtagSearch.trim()) return

    setIsSearchingHashtag(true)
    try {
      const result = await searchHashtag(userId, hashtagSearch.replace("#", ""))
      if (result.status === 200) {
        setHashtagResults(result.data)
        toast({
          title: "Hashtag Found",
          description: `Found ${result.data?.topMedia?.length || 0} top posts for #${hashtagSearch}`,
          duration: 3000,
        })
      } else {
        toast({
          title: "Search Failed",
          description: result.message || "Hashtag not found.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search hashtag.",
        variant: "destructive",
      })
    } finally {
      setIsSearchingHashtag(false)
    }
  }

  const handleRefreshToken = async () => {
    try {
      const result = await refreshAccessToken(userId)
      if (result.status === 200) {
        toast({
          title: "Token Refreshed",
          description: "Your Instagram access token has been refreshed successfully.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Refresh Failed",
          description: result.message || "Failed to refresh access token.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh access token.",
        variant: "destructive",
      })
    }
  }

  const handleSchedulePost = () => {
    toast({
      title: "Schedule Post",
      description: "Post scheduling feature coming soon!",
      duration: 3000,
    })
  }

  const handleConfigureAutomation = () => {
    toast({
      title: "Automation Settings",
      description: "Automation configuration panel coming soon!",
      duration: 3000,
    })
  }

  const toggleAutomation = (setting: keyof typeof automationSettings) => {
    setAutomationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
    toast({
      title: "Setting Updated",
      description: `${setting} has been ${automationSettings[setting] ? "disabled" : "enabled"}.`,
      duration: 2000,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Instagram className="h-8 w-8 text-blue-600" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">AI-Powered Instagram Dashboard</h2>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
            <p className="text-muted-foreground">Intelligent insights and automated growth strategies</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefreshToken} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Token
          </Button>
          <Button onClick={handleGenerateReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={handleRefreshData} disabled={isRefreshing} variant="outline" size="sm">
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content-lab">Content Lab</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Performance Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Performance Score
              </CardTitle>
              <CardDescription>Your overall Instagram performance analyzed by AI</CardDescription>
            </CardHeader>
            <CardContent>
              {audienceLoading || strategyLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {audienceInsights?.data?.performanceScores?.map((score: any, index: number) => (
                    <div key={index} className="text-center">
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          score.value > 80 ? "text-green-600" : score.value > 60 ? "text-blue-600" : "text-orange-600"
                        }`}
                      >
                        {score.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{score.name}</div>
                      <Progress value={score.value} className="mt-2" />
                    </div>
                  )) || (
                    // Fallback if no performance scores
                    <div className="col-span-3 text-center text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>AI performance analysis will appear here once data is processed</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategyLoading ? (
                  <div className="animate-pulse space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    ))}
                  </div>
                ) : (
                  contentStrategy?.data?.recommendations?.map((rec: any, index: number) => {
                    const icons = [TrendingUp, Hash, Camera]
                    const colors = ["blue", "green", "purple"]
                    const Icon = icons[index % icons.length]
                    const color = colors[index % colors.length]

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 bg-${color}-50 dark:bg-${color}-950 rounded-lg`}
                      >
                        <Icon className={`h-5 w-5 text-${color}-600 mt-0.5`} />
                        <div>
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                      </div>
                    )
                  }) || (
                    <div className="text-center text-muted-foreground py-4">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>AI recommendations will appear here</p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    ))}
                  </div>
                ) : (
                  contentTrends?.data?.growthMetrics?.map((metric: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{metric.name}</h4>
                        <p className="text-sm text-muted-foreground">{metric.description}</p>
                      </div>
                      {metric.trend === "up" ? (
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Growth opportunities will appear here</p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Optimal Posting Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                AI-Optimized Posting Schedule
              </CardTitle>
              <CardDescription>When your audience is most active, powered by AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {timesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                    const dayData = optimalTimes?.data?.schedule?.find((d: any) =>
                      d.day.toLowerCase().startsWith(day.toLowerCase()),
                    )

                    return (
                      <div key={day} className="text-center">
                        <div className="font-medium text-sm mb-2">{day}</div>
                        <div className="space-y-1">
                          {dayData?.times?.map((time: any, i: number) => (
                            <div
                              key={i}
                              className={`${
                                i % 2 === 0
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                              } text-xs p-1 rounded`}
                            >
                              {time}
                            </div>
                          )) || <div className="text-xs text-muted-foreground">Analyzing...</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Period:</span>
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

          {/* Account Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insightsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              : insightsData?.data?.map((insight: any, index: number) => {
                  const icons = [TrendingUp, Users, Eye, Globe]
                  const Icon = icons[index] || TrendingUp
                  return (
                    <Card key={insight.name}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground capitalize">
                              {insight.title || insight.name.replace("_", " ")}
                            </p>
                            <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
                          </div>
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
          </div>

          {/* Content Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest Instagram content performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                      </div>
                    ))
                  : mediaData?.data?.slice(0, 6).map((post: any) => (
                      <div key={post.id} className="space-y-2">
                        <div
                          className="aspect-square bg-cover bg-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundImage: `url(${post.media_url || post.thumbnail_url || "/placeholder.svg?height=300&width=300"})`,
                          }}
                          onClick={() => setSelectedMediaId(post.id)}
                        >
                          <div className="w-full h-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center rounded-lg">
                            <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-4 text-white">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{post.like_count || 0} likes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{post.comments_count || 0} comments</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm line-clamp-2">{post.caption || "No caption"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Lab Tab */}
        <TabsContent value="content-lab" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-purple-600" />
                AI Caption Generator
              </CardTitle>
              <CardDescription>Generate engaging captions tailored to your brand voice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your post or upload an image..."
                value={contentPrompt}
                onChange={(e) => setContentPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleGenerateCaption} disabled={isGenerating || !contentPrompt.trim()}>
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Caption
                </Button>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generated Caption Display */}
              {generatedCaption && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Generated Caption:</h4>
                  <p className="text-sm mb-3">{generatedCaption.caption}</p>
                  {generatedCaption.suggestedHashtags && (
                    <div>
                      <h5 className="font-medium text-sm mb-1">Suggested Hashtags:</h5>
                      <div className="flex flex-wrap gap-1">
                        {generatedCaption.suggestedHashtags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hashtag Research */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                Hashtag Research
              </CardTitle>
              <CardDescription>Search and analyze hashtag performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter hashtag (without #)"
                  value={hashtagSearch}
                  onChange={(e) => setHashtagSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleHashtagSearch()}
                />
                <Button onClick={handleHashtagSearch} disabled={!hashtagSearch.trim() || isSearchingHashtag}>
                  {isSearchingHashtag ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>

              {/* Hashtag Results */}
              {hashtagResults && (
                <div className="mt-4 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">#{hashtagResults.hashtag.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Found {hashtagResults.topMedia?.length || 0} top posts
                  </p>
                  {hashtagResults.topMedia?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {hashtagResults.topMedia.slice(0, 6).map((media: any, i: number) => (
                        <div
                          key={i}
                          className="aspect-square bg-cover bg-center rounded cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundImage: `url(${media.media_url || "/placeholder.svg?height=150&width=150"})`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Smart Hashtag Suggestions */}
              {hashtagSuggestions?.data && (
                <div className="mt-4">
                  <h4 className="font-medium mb-3">Smart Hashtag Suggestions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(hashtagSuggestions.data).map(([category, tags]: [string, any]) => (
                      <div key={category}>
                        <h5 className="font-medium mb-2 text-blue-600 capitalize">{category.replace(/_/g, " ")}</h5>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(tags) &&
                            tags.map((tag: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag.startsWith("#") ? tag : `#${tag}`}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-green-600" />
                  Follower Growth Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {audienceInsights?.data?.growthProjection?.monthly || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">Projected monthly growth</div>
                    </div>
                    <div className="space-y-2">
                      {audienceInsights?.data?.growthFactors?.map((factor: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{factor.name}</span>
                          <span className="text-green-600">{factor.impact}</span>
                        </div>
                      )) || (
                        <div className="text-center text-muted-foreground py-4">
                          <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Growth analysis will appear here</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Engagement Booster
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {audienceInsights?.data?.currentEngagementRate || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">Current engagement rate</div>
                    </div>
                    <div className="space-y-2">
                      {audienceInsights?.data?.engagementFactors?.map((factor: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{factor.name}</span>
                          <span className="text-blue-600">{factor.impact}</span>
                        </div>
                      )) || (
                        <div className="text-center text-muted-foreground py-4">
                          <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Engagement analysis will appear here</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Content Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
                AI-Generated Content Calendar
              </CardTitle>
              <CardDescription>Optimized posting schedule for maximum engagement</CardDescription>
            </CardHeader>
            <CardContent>
              {calendarLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {contentCalendar?.data?.days?.map((day: any, index: number) => (
                    <div key={index} className="border rounded-lg p-2">
                      <div className="font-medium text-sm mb-2">{day.date}</div>
                      <div className="space-y-1">
                        {day.posts?.map((post: any, i: number) => (
                          <div
                            key={i}
                            className={`${
                              post.type === "reel"
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                : post.type === "story"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                            } text-xs p-1 rounded`}
                          >
                            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}: {post.time}
                          </div>
                        )) || <div className="text-xs text-muted-foreground">No posts scheduled</div>}
                      </div>
                    </div>
                  )) ||
                    Array.from({ length: 7 }, (_, i) => (
                      <div key={i} className="border rounded-lg p-2">
                        <div className="font-medium text-sm mb-2">
                          {new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en", {
                            weekday: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">Analyzing...</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                Competitor Analysis
              </CardTitle>
              <CardDescription>See how you stack up against your competition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorLoading ? (
                  <div className="animate-pulse space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {competitorAnalysis?.data?.competitors?.map((competitor: any, index: number) => {
                      const colors = [
                        "from-pink-500 to-purple-500",
                        "from-blue-500 to-cyan-500",
                        "from-green-500 to-emerald-500",
                        "from-orange-500 to-amber-500",
                      ]

                      return (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold`}
                            >
                              {competitor.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium">@{competitor.username}</h4>
                              <p className="text-sm text-muted-foreground">{competitor.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">Engagement: {competitor.engagementRate}</div>
                            <div
                              className={`text-xs ${competitor.comparison === "better" ? "text-green-600" : "text-muted-foreground"}`}
                            >
                              {competitor.comparisonText}
                            </div>
                          </div>
                        </div>
                      )
                    }) || (
                      <div className="text-center text-muted-foreground py-8">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Competitor analysis will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Auto-Engagement
                </CardTitle>
                <CardDescription>Automatically engage with your audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-like relevant posts</span>
                  <Button
                    variant={automationSettings.autoLike ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAutomation("autoLike")}
                  >
                    {automationSettings.autoLike ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-follow back</span>
                  <Button
                    variant={automationSettings.autoFollow ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAutomation("autoFollow")}
                  >
                    {automationSettings.autoFollow ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Smart comment replies</span>
                  <Button
                    variant={automationSettings.smartReplies ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAutomation("smartReplies")}
                  >
                    {automationSettings.smartReplies ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <Button className="w-full" onClick={handleConfigureAutomation}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  Content Scheduling
                </CardTitle>
                <CardDescription>Schedule posts for optimal times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{contentCalendar?.data?.scheduledCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Posts scheduled</div>
                </div>
                <div className="space-y-2">
                  {contentCalendar?.data?.scheduleSummary?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Next post</span>
                        <span>Not scheduled</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>This week</span>
                        <span>0 posts</span>
                      </div>
                    </>
                  )}
                </div>
                <Button className="w-full" onClick={handleSchedulePost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Post
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Performance Reports
              </CardTitle>
              <CardDescription>Comprehensive analytics and insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => handleGenerateReport()}>
                  <Download className="h-6 w-6 mb-2" />
                  Weekly Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => handleGenerateReport()}>
                  <Download className="h-6 w-6 mb-2" />
                  Monthly Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => handleGenerateReport()}>
                  <Download className="h-6 w-6 mb-2" />
                  Custom Report
                </Button>
              </div>

              {contentStrategy?.data?.reports ? (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Recent Reports</h4>
                  <div className="space-y-2">
                    {contentStrategy.data.reports.map((report: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{report.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => handleGenerateReport()}>
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4 text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate your first report to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
