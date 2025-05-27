

// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import {
//   Instagram,
//   PhoneIcon as WhatsApp,
//   Plus,
//   CheckCircle,
//   AlertCircle,
//   Info,
//   RefreshCw,
//   Loader2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { onUserInfo } from "@/actions/user"
// import { refreshInstagramData, onOAuthInstagram } from "@/actions/integrations"
// import IntegrationCard from "./integration-card"
// import RequirementsModal from "./requirements-modal"
// import AccountsList from "./accounts-list"
// import PlatformBenefits from "./platform-benefits"
// import ConnectionStatus from "./connection-status"
// import InstagramDashboard from "./my-info" // Import the new dashboard
// // import UsageStats from "./usage-stats"
// import IntegrationInsights from "./integration-insights"
// import { useSearchParams } from "next/navigation"

// export default function IntegrationsPage() {
//   const [activeTab, setActiveTab] = useState("all")
//   const [showRequirements, setShowRequirements] = useState<string | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [isConnecting, setIsConnecting] = useState<{ [key: string]: boolean }>({})
//   const { toast } = useToast()
//   const queryClient = useQueryClient()
//   const searchParams = useSearchParams()

//   // Check for OAuth code in URL (for Instagram callback)
//   const code = searchParams.get("code")

//   // Fetch user data including integrations
//   const {
//     data: userData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["user-profile"],
//     queryFn: onUserInfo,
//   })

//   // Handle Instagram OAuth callback
//   useEffect(() => {
//     if (code) {
//       // The code will be processed by your server-side code
//       toast({
//         title: "Instagram Connected",
//         description: "Your Instagram account has been successfully connected.",
//         duration: 5000,
//       })

//       // Refresh the user data to include the new integration
//       queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      
//       // Reset any connecting states
//       setIsConnecting({})
//     }
//   }, [code, toast, queryClient])

//   // Transform real user data into the format needed for our components
//   const transformUserData = () => {
//     if (!userData?.data?.integrations || !Array.isArray(userData.data.integrations)) {
//       return {
//         instagram: [],
//         whatsapp: [],
//       }
//     }

//     try {
//       const instagramAccounts = userData.data.integrations
//         .filter((integration: any) => integration && integration.name === "INSTAGRAM")
//         .map((integration: any) => ({
//           id: integration.id || `instagram-${Math.random().toString(36).substr(2, 9)}`,
//           username: integration.username || integration.instagramId || "instagram_user",
//           avatar: integration.profilePicture || "/placeholder.svg?height=40&width=40",
//           isActive: true, // Assuming all connected accounts are active
//         }))

//       const whatsappAccounts = userData.data.integrations
//         .filter((integration: any) => integration && integration.name === "CRM")
//         .map((integration: any) => ({
//           id: integration.id || `whatsapp-${Math.random().toString(36).substr(2, 9)}`,
//           phone: integration.phone || "+1 (555) 123-4567", // Fallback if not available
//           name: integration.name || "Business Line",
//           avatar: integration.profilePicture || "/placeholder.svg?height=40&width=40",
//           isActive: true, // Assuming all connected accounts are active
//         }))

//       return {
//         instagram: instagramAccounts,
//         whatsapp: whatsappAccounts,
//       }
//     } catch (error) {
//       console.error("Error transforming user data:", error)
//       return {
//         instagram: [],
//         whatsapp: [],
//       }
//     }
//   }

//   const connectedAccounts = transformUserData()

//   // Enhanced OAuth connection handler
//   const handleOAuthConnection = async (platform: string, strategy: "INSTAGRAM" | "CRM") => {
//     setIsConnecting(prev => ({ ...prev, [platform]: true }))
    
//     try {
//       if (strategy === "INSTAGRAM") {
//         // This will redirect to Instagram OAuth
//         await onOAuthInstagram(strategy)
//       } else if (strategy === "CRM") {
//         // Handle WhatsApp/CRM OAuth here when implemented
//         toast({
//           title: "Coming Soon",
//           description: "WhatsApp integration is being developed.",
//           duration: 3000,
//         })
//         setIsConnecting(prev => ({ ...prev, [platform]: false }))
//       }
//     } catch (error) {
//       console.error(`Error connecting ${platform}:`, error)
//       toast({
//         title: "Connection Failed",
//         description: `Failed to connect your ${platform} account. Please try again.`,
//         variant: "destructive",
//         duration: 3000,
//       })
//       setIsConnecting(prev => ({ ...prev, [platform]: false }))
//     }
//   }

//   const handleAddAccount = async (platform: string) => {
//     // Check if account is already connected
//     const isInstagramConnected = connectedAccounts.instagram.length > 0
//     const isWhatsAppConnected = connectedAccounts.whatsapp.length > 0
    
//     if (platform === "instagram" && isInstagramConnected) {
//       toast({
//         title: "Already Connected",
//         description: "You already have an Instagram account connected.",
//         duration: 3000,
//       })
//       return
//     }
    
//     if (platform === "whatsapp" && isWhatsAppConnected) {
//       toast({
//         title: "Already Connected", 
//         description: "You already have a WhatsApp account connected.",
//         duration: 3000,
//       })
//       return
//     }

//     // Show requirements modal first, then handle connection
//     setShowRequirements(platform)
//   }

//   // Handle connection after requirements modal
//   const handleConnectAfterRequirements = async (platform: string) => {
//     setShowRequirements(null)
    
//     if (platform === "instagram") {
//       await handleOAuthConnection("instagram", "INSTAGRAM")
//     } else if (platform === "whatsapp") {
//       await handleOAuthConnection("whatsapp", "CRM")
//     }
//   }

//   const handleRemoveAccount = (platform: string, id: string) => {
//     // In a real app, you would call an API to remove the account
//     // For now, we'll just show a toast
//     toast({
//       title: "Account Removed",
//       description: `Your ${platform} account has been successfully removed.`,
//       duration: 3000,
//     })

//     // Refresh the user data
//     queryClient.invalidateQueries({ queryKey: ["user-profile"] })
//   }

//   const handleRefreshData = async () => {
//     setIsRefreshing(true)
//     try {
//       // Use the actual user ID from userData
//       const userId = userData?.data?.id || "User"
//       const result = await refreshInstagramData(userId)

//       if (result.status === 200) {
//         toast({
//           title: "Data Refreshed",
//           description: "Your Instagram data has been successfully updated.",
//           duration: 3000,
//         })

//         // Refresh the user data
//         queryClient.invalidateQueries({ queryKey: ["user-profile"] })
//       } else {
//         toast({
//           title: "Refresh Failed",
//           description: result.message || "Failed to refresh Instagram data.",
//           variant: "destructive",
//           duration: 3000,
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred.",
//         variant: "destructive",
//         duration: 3000,
//       })
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//       },
//     },
//   }

//   if (isLoading) {
//     return (
//       <div className="container max-w-5xl py-20 flex flex-col items-center justify-center">
//         <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
//         <p className="text-muted-foreground">Loading your integrations...</p>
//       </div>
//     )
//   }


//   return (
//     <div className="container max-w-5xl py-10 space-y-8">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="space-y-2"
//       >
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold tracking-tight">Account Integrations</h1>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRefreshData}
//             disabled={isRefreshing}
//             className="flex items-center gap-2"
//           >
//             {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//             Refresh Data
//           </Button>
//         </div>
//         <p className="text-muted-foreground">Connect your social media accounts to enhance your experience</p>
//       </motion.div>

//       <Alert className="float bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
//         <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//         <AlertTitle className="text-blue-800 dark:text-blue-200">Integration Benefits</AlertTitle>
//         <AlertDescription className="text-blue-700 dark:text-blue-300">
//           Connecting your accounts enables seamless cross-platform posting, analytics tracking, and automated responses.
//         </AlertDescription>
//       </Alert>

//       <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="all">All Integrations</TabsTrigger>
//           <TabsTrigger value="instagram">Instagram</TabsTrigger>
//           <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all">
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="staggeredFadeIn grid gap-6 md:grid-cols-2"
//           >
//             <motion.div variants={itemVariants}>
//               <IntegrationCard
//                 title="Instagram"
//                 description="Connect your Instagram accounts to share content and analyze engagement"
//                 icon={<Instagram className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
//                 strategy="INSTAGRAM"
//               />
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <IntegrationCard
//                 title="WhatsApp"
//                 description="Connect WhatsApp to enable messaging and customer support"
//                 icon={<WhatsApp className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
//                 strategy="CRM"
//               />
//             </motion.div>
//           </motion.div>

//           <IntegrationInsights userData={userData?.data} />
//         </TabsContent>

//         <TabsContent value="instagram">
//           <ConnectionStatus
//             platform="instagram"
//             accounts={connectedAccounts.instagram}
//             onRefresh={handleRefreshData}
//             isRefreshing={isRefreshing}
//           />
//           <Card className="glassEffect mt-4">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Instagram className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                   <div>
//                     <CardTitle>Instagram Accounts</CardTitle>
//                     <CardDescription>Manage your connected Instagram accounts</CardDescription>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={() => handleAddAccount("instagram")}
//                   disabled={isConnecting.instagram}
//                   className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
//                 >
//                   {isConnecting.instagram ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="mr-2 h-4 w-4" /> Add Account
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <AccountsList
//                 accounts={connectedAccounts.instagram.map((account) => ({
//                   id: account.id,
//                   title: account.username,
//                   subtitle: `@${account.username}`,
//                   avatar: account.avatar,
//                   isActive: account.isActive,
//                   platform: "instagram",
//                 }))}
//                 onRemove={(id) => handleRemoveAccount("instagram", id)}
//               />
//             </CardContent>
//             <CardFooter className="flex flex-col items-start border-t p-4">
//               <h4 className="text-sm font-medium mb-2">Requirements for Instagram Integration:</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   Public Instagram account
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   Business or Creator account type
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   Connected Facebook page
//                 </li>
//               </ul>
//             </CardFooter>
//           </Card>
//           <PlatformBenefits platform="instagram" />
//         </TabsContent>

//         <TabsContent value="whatsapp">
//           <ConnectionStatus
//             platform="whatsapp"
//             accounts={connectedAccounts.whatsapp}
//             onRefresh={handleRefreshData}
//             isRefreshing={isRefreshing}
//           />
//           <Card className="glassEffect mt-4">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <WhatsApp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                   <div>
//                     <CardTitle>WhatsApp Accounts</CardTitle>
//                     <CardDescription>Manage your connected WhatsApp numbers</CardDescription>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={() => handleAddAccount("whatsapp")}
//                   disabled={isConnecting.whatsapp}
//                   className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
//                 >
//                   {isConnecting.whatsapp ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="mr-2 h-4 w-4" /> Add Account
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <AccountsList
//                 accounts={connectedAccounts.whatsapp.map((account) => ({
//                   id: account.id,
//                   title: account.name,
//                   subtitle: account.phone,
//                   avatar: account.avatar,
//                   isActive: account.isActive,
//                   platform: "whatsapp",
//                 }))}
//                 onRemove={(id) => handleRemoveAccount("whatsapp", id)}
//               />
//             </CardContent>
//             <CardFooter className="flex flex-col items-start border-t p-4">
//               <h4 className="text-sm font-medium mb-2">Requirements for WhatsApp Integration:</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   WhatsApp Business account
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   Verified phone number
//                 </li>
//                 <li className="flex items-center">
//                   <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
//                   Business verification (recommended)
//                 </li>
//               </ul>
//             </CardFooter>
//           </Card>
//           <PlatformBenefits platform="whatsapp" />
//         </TabsContent>
//       </Tabs>
      
//       {showRequirements && (
//         <RequirementsModal 
//           platform={showRequirements} 
//           onClose={() => setShowRequirements(null)}
//           onConnect={() => handleConnectAfterRequirements(showRequirements)}
//         />
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Instagram,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Eye,
  RefreshCw,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Image as ImageIcon,
  Hash,
  Clock,
  Loader2,
  Activity,
  Globe,
  Link,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  fetchInstagramMedia,
  getMediaInsights,
  getAccountInsights,
  refreshAccessToken,
  checkTokenExpiry,
  searchHashtag,
  getMediaComments,
  getUserMentions,
  bulkRefreshIntegrations,
  validateConnection
} from "@/actions/integrations"

interface InstagramDashboardProps {
  userId: string
}

export default function InstagramDashboard({ userId }: InstagramDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "days_28">("week")
  const [hashtagSearch, setHashtagSearch] = useState("")
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch Instagram media
  const { data: mediaData, isLoading: mediaLoading } = useQuery({
    queryKey: ["instagram-media", userId],
    queryFn: () => fetchInstagramMedia(userId, 25),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })

  // Fetch account insights
  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ["instagram-insights", userId, selectedPeriod],
    queryFn: () => getAccountInsights(userId, selectedPeriod),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })

  // Check token expiry
  const { data: tokenStatus, isLoading: tokenLoading } = useQuery({
    queryKey: ["token-status", userId],
    queryFn: () => checkTokenExpiry(userId),
    refetchInterval: 60 * 60 * 1000, // Check every hour
  })

  // Validate connection
  const { data: connectionStatus } = useQuery({
    queryKey: ["connection-status", userId],
    queryFn: () => validateConnection(userId),
    refetchInterval: 30 * 60 * 1000, // Check every 30 minutes
  })

  // Fetch user mentions
  const { data: mentionsData, isLoading: mentionsLoading } = useQuery({
    queryKey: ["instagram-mentions", userId],
    queryFn: () => getUserMentions(userId, 10),
  })

  // Fetch media insights for selected media
  const { data: selectedMediaInsights } = useQuery({
    queryKey: ["media-insights", userId, selectedMediaId],
    queryFn: () => selectedMediaId ? getMediaInsights(userId, selectedMediaId) : null,
    enabled: !!selectedMediaId,
  })

  // Auto-refresh token if needed
  useEffect(() => {
    if (tokenStatus?.data?.shouldRefresh && !isRefreshing) {
      handleRefreshToken()
    }
  }, [tokenStatus])

  const handleRefreshToken = async () => {
    setIsRefreshing(true)
    try {
      const result = await refreshAccessToken(userId)
      if (result.status === 200) {
        toast({
          title: "Token Refreshed",
          description: "Your Instagram access token has been refreshed successfully.",
          duration: 3000,
        })
        queryClient.invalidateQueries({ queryKey: ["token-status", userId] })
      } else {
        toast({
          title: "Refresh Failed",
          description: result.message || "Failed to refresh access token.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh access token.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleBulkRefresh = async () => {
    setIsRefreshing(true)
    try {
      const result = await bulkRefreshIntegrations(userId)
      if (result.status === 200) {
        toast({
          title: "Data Refreshed",
          description: `Successfully refreshed ${result.data?.successful} integrations.`,
          duration: 3000,
        })
        queryClient.invalidateQueries()
      } else {
        toast({
          title: "Refresh Failed",
          description: result.message || "Failed to refresh integrations.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh integrations.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleHashtagSearch = async () => {
    if (!hashtagSearch.trim()) return

    try {
      const result = await searchHashtag(userId, hashtagSearch.replace('#', ''))
      if (result.status === 200) {
        toast({
          title: "Hashtag Found",
          description: `Found ${result.data?.topMedia.length} top posts for #${hashtagSearch}`,
          duration: 3000,
        })
        // You can store this data in state and display it
      } else {
        toast({
          title: "Search Failed",
          description: result.message || "Hashtag not found.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search hashtag.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Render token status alert
  const renderTokenAlert = () => {
    if (tokenLoading || !tokenStatus?.data) return null

    const { isExpired, daysUntilExpiry, shouldRefresh } = tokenStatus.data

    if (isExpired) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Token Expired</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Your Instagram access token has expired. Please refresh it to continue using the integration.</span>
            <Button onClick={handleRefreshToken} disabled={isRefreshing} size="sm">
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Token"}
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    if (shouldRefresh) {
      return (
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">Token Expiring Soon</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <span>Your token expires in {daysUntilExpiry} days. Consider refreshing it soon.</span>
            <Button onClick={handleRefreshToken} disabled={isRefreshing} size="sm" variant="outline">
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Now"}
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  // Render connection status
  const renderConnectionStatus = () => {
    if (!connectionStatus) return null

    const isValid = connectionStatus.status === 200 && connectionStatus.data?.isValid

    return (
      <div className="flex items-center gap-2 mb-4">
        {isValid ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Connected as @{connectionStatus.data?.username}
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-400">
              Connection invalid
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Instagram className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Instagram Dashboard</h2>
            <p className="text-muted-foreground">Manage your Instagram content and analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBulkRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh All
          </Button>
        </div>
      </div>

      {renderConnectionStatus()}
      {renderTokenAlert()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Account Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insightsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              insightsData?.data?.map((insight: any, index: number) => {
                const icons = [Eye, Users, TrendingUp, Globe]
                const Icon = icons[index] || Activity
                return (
                  <Card key={insight.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground capitalize">
                            {insight.name.replace('_', ' ')}
                          </p>
                          <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
                        </div>
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Period:</span>
            <Select value={selectedPeriod} onValueChange={(value: "day" | "week" | "days_28") => setSelectedPeriod(value)}>
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
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              mediaData?.data?.map((post: any) => (
                <Card key={post.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <div 
                    className="aspect-square bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${post.media_url || post.thumbnail_url})` }}
                    onClick={() => setSelectedMediaId(post.id)}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.like_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2" variant={post.media_type === 'VIDEO' ? 'default' : 'secondary'}>
                      {post.media_type}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.caption || 'No caption'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Selected Media Insights */}
          {selectedMediaId && selectedMediaInsights && (
            <Card>
              <CardHeader>
                <CardTitle>Post Insights</CardTitle>
                <CardDescription>Detailed analytics for selected post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedMediaInsights.data?.map((insight: any) => (
                    <div key={insight.name} className="text-center">
                      <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {insight.name.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Account Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insightsData?.data && (
                <div className="space-y-4">
                  {insightsData.data.map((insight: any) => (
                    <div key={insight.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">{insight.name.replace('_', ' ')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {insight.description || `${insight.period} period data`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{insight.values[0]?.value?.toLocaleString() || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(insight.values[0]?.end_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hashtags Tab */}
        <TabsContent value="hashtags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Hashtag Research
              </CardTitle>
              <CardDescription>Search and analyze hashtag performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter hashtag (without #)"
                  value={hashtagSearch}
                  onChange={(e) => setHashtagSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleHashtagSearch()}
                />
                <Button onClick={handleHashtagSearch} disabled={!hashtagSearch.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Search for hashtags to see top performing posts and get insights for your content strategy.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentions Tab */}
        <TabsContent value="mentions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Mentions</CardTitle>
              <CardDescription>Posts where you have been tagged</CardDescription>
            </CardHeader>
            <CardContent>
              {mentionsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : mentionsData?.data?.length > 0 ? (
                <div className="space-y-4">
                  {mentionsData?.data.map((mention: any) => (
                    <div key={mention.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={mention.media_url || mention.thumbnail_url}
                        alt="Mention"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{mention.caption || 'No caption'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(mention.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={mention.permalink} target="_blank" rel="noopener noreferrer">
                          <Link className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No mentions found. You haven&apos;t been tagged in any posts recently.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}