// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"

// import { Instagram, Plus, CheckCircle, AlertCircle, Info, RefreshCw, Loader2, Trash2, Shield } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useToast } from "@/hooks/use-toast"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { onUserInfo } from "@/actions/user"
// import { refreshInstagramData, onOAuthInstagram } from "@/actions/integrations"
// import { deauthorizeInstagram } from "@/lib/deauth"
// import IntegrationCard from "./integration-card"
// import RequirementsModal from "./requirements-modal"
// import AccountsList from "./accounts-list"
// import PlatformBenefits from "./platform-benefits"
// import ConnectionStatus from "./connection-status"
// import InstagramDashboard from "./my-info"
// import { useSearchParams } from "next/navigation"

// export default function IntegrationsPage() {
//   const [activeTab, setActiveTab] = useState("all")
//   const [showRequirements, setShowRequirements] = useState<string | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [isConnecting, setIsConnecting] = useState<{ [key: string]: boolean }>({})
//   const [showDeauthorizeDialog, setShowDeauthorizeDialog] = useState<{
//     show: boolean
//     platform: string
//     accountId: string
//     accountName: string
//   }>({
//     show: false,
//     platform: "",
//     accountId: "",
//     accountName: "",
//   })
//   const [isDeauthorizing, setIsDeauthorizing] = useState(false)
//   const { toast } = useToast()
//   const queryClient = useQueryClient()
//   const searchParams = useSearchParams()

//   const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
//   const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
//   const [deauthorizationProgress, setDeauthorizationProgress] = useState<{
//     show: boolean
//     step: "confirming" | "revoking" | "removing" | "completed" | "error"
//     message: string
//   }>({
//     show: false,
//     step: "confirming",
//     message: "",
//   })

//   // Check for OAuth code in URL (for Instagram callback
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
//       }
//     }

//     try {
//       const instagramAccounts = userData.data.integrations
//         .filter((integration: any) => integration && integration.name === "INSTAGRAM")
//         .map((integration: any) => ({
//           id: integration.id || `instagram-${Math.random().toString(36).substr(2, 9)}`,
//           username: integration.username || integration.instagramId || "",
//           avatar: integration.profilePicture || "",
//           isActive: true, // Assuming all connected accounts are active
//           accessToken: integration.token, // Store access token for deauthorization
//         }))

//       return {
//         instagram: instagramAccounts,
//       }
//     } catch (error) {
//       console.error("Error transforming user data:", error)
//       return {
//         instagram: [],
//       }
//     }
//   }

//   const connectedAccounts = transformUserData()

//   // Enhanced OAuth connection handler
//   const handleOAuthConnection = async (platform: string, strategy: "INSTAGRAM") => {
//     setIsConnecting((prev) => ({ ...prev, [platform]: true }))

//     try {
//       if (strategy === "INSTAGRAM") {
//         // This will redirect to Instagram OAuth
//         await onOAuthInstagram(strategy)
//       }
//     } catch (error) {
//       console.error(`Error connecting ${platform}:`, error)
//       toast({
//         title: "Connection Failed",
//         description: `Failed to connect your ${platform} account. Please try again.`,
//         variant: "destructive",
//         duration: 3000,
//       })
//       setIsConnecting((prev) => ({ ...prev, [platform]: false }))
//     }
//   }

//   const handleAddAccount = async (platform: string) => {
//     // Check if account is already connected - enforce single account limit
//     const isInstagramConnected = connectedAccounts.instagram.length > 0

//     if (platform === "instagram" && isInstagramConnected) {
//       toast({
//         title: "Single Account Limit",
//         description:
//           "You can only connect one Instagram account. Please disconnect your current account first if you want to connect a different one.",
//         duration: 5000,
//       })
//       return
//     }

//     // Show privacy policy dialog first
//     setShowPrivacyDialog(true)
//   }

//   // Handle connection after requirements modal
//   const handleConnectAfterRequirements = async (platform: string) => {
//     setShowRequirements(null)

//     if (platform === "instagram") {
//       await handleOAuthConnection("instagram", "INSTAGRAM")
//     }
//   }

//   // Show deauthorization confirmation dialog

//   const handleShowDeauthorizeDialog = (platform: string, id: string) => {
//     const account = connectedAccounts[platform as keyof typeof connectedAccounts]?.find((acc) => acc.id === id)

//     const accountName = platform === "instagram" ? (account as any)?.username || "Instagram Account" : "Account"

//     setShowDeauthorizeDialog({
//       show: true,
//       platform,
//       accountId: id,
//       accountName,
//     })
//   }

//   // Handle deauthorization
//   const handleDeauthorizeAccount = async () => {
//     const { platform, accountId, accountName } = showDeauthorizeDialog

//     // Start the deauthorization process with progress tracking
//     setDeauthorizationProgress({
//       show: true,
//       step: "revoking",
//       message: `Revoking access permissions for ${accountName}...`,
//     })

//     setShowDeauthorizeDialog({
//       show: false,
//       platform: "",
//       accountId: "",
//       accountName: "",
//     })

//     try {
//       if (platform === "instagram") {
//         // Find the account to get access token
//         const account = connectedAccounts.instagram.find((acc) => acc.id === accountId)

//         if (!account?.accessToken) {
//           throw new Error("Access token not found")
//         }

//         // Step 1: Revoke Instagram permissions
//         setDeauthorizationProgress((prev) => ({
//           ...prev,
//           step: "revoking",
//           message: `Revoking Instagram permissions for ${accountName}...`,
//         }))

//         const result = await deauthorizeInstagram(accountId, account.accessToken)

//         if (result.status === 200) {
//           // Step 2: Remove from our database
//           setDeauthorizationProgress((prev) => ({
//             ...prev,
//             step: "removing",
//             message: "Removing account from your integrations...",
//           }))

//           // Wait a moment to show the removing step
//           await new Promise((resolve) => setTimeout(resolve, 1500))

//           // Step 3: Complete
//           setDeauthorizationProgress((prev) => ({
//             ...prev,
//             step: "completed",
//             message: `${accountName} has been successfully disconnected!`,
//           }))

//           toast({
//             title: "Account Disconnected",
//             description: `${accountName} has been successfully deauthorized and removed.`,
//             duration: 3000,
//           })

//           // Refresh the user data to remove the deauthorized account
//           queryClient.invalidateQueries({ queryKey: ["user-profile"] })

//           // Hide progress after 2 seconds
//           setTimeout(() => {
//             setDeauthorizationProgress({
//               show: false,
//               step: "confirming",
//               message: "",
//             })
//           }, 2000)
//         } else {
//           throw new Error(result.message || "Deauthorization failed")
//         }
//       }
//     } catch (error) {
//       console.error(`Error deauthorizing ${platform}:`, error)

//       setDeauthorizationProgress((prev) => ({
//         ...prev,
//         step: "error",
//         message: `Failed to disconnect ${accountName}. Please try again or remove access manually from your ${platform} settings.`,
//       }))

//       toast({
//         title: "Disconnection Failed",
//         description: `Failed to deauthorize ${accountName}. Please try again or remove access manually from your ${platform} settings.`,
//         variant: "destructive",
//         duration: 5000,
//       })

//       // Hide progress after 5 seconds on error
//       setTimeout(() => {
//         setDeauthorizationProgress({
//           show: false,
//           step: "confirming",
//           message: "",
//         })
//       }, 5000)
//     }
//   }

//   const handleRemoveAccount = (platform: string, id: string) => {
//     // Show deauthorization dialog instead of immediate removal
//     handleShowDeauthorizeDialog(platform, id)
//   }

//   const handleRefreshData = async () => {
//     setIsRefreshing(true)
//     try {
//       // Use the actual user ID from userData
//       const userId = userData?.data?.clerkId || "User"
//       const result = await refreshInstagramData(userId || "237462617")

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

//   // if (isLoading) {
//   //   return (
//   //     <div className="container max-w-5xl py-20 flex flex-col items-center justify-center">
//   //       <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
//   //       <p className="text-muted-foreground">Loading your integrations...</p>
//   //     </div>
//   //   )
//   // }

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
//             className="flex items-center gap-2 bg-transparent"
//           >
//             {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//             Refresh Data
//           </Button>
//         </div>
//         <p className="text-muted-foreground">Connect your Instagram account to enhance your experience</p>
//       </motion.div>

//       <Alert className="float bg-accent border-border">
//         <Info className="h-4 w-4 text-primary" />
//         <AlertTitle className="text-accent-foreground">Integration Benefits</AlertTitle>
//         <AlertDescription className="text-muted-foreground">
//           Connecting your Instagram account enables seamless posting, analytics tracking, and automated responses.
//         </AlertDescription>
//       </Alert>

//       <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="all">All Integrations</TabsTrigger>
//           <TabsTrigger value="instagram">Instagram</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all">
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="staggeredFadeIn grid gap-6 md:grid-cols-1"
//           >
//             <motion.div variants={itemVariants}>
//               <IntegrationCard
//                 title="Instagram"
//                 description="Connect your Instagram account to share content and analyze engagement"
//                 icon={<Instagram className="h-8 w-8 text-primary" />}
//                 strategy="INSTAGRAM"
//               />
//             </motion.div>
//           </motion.div>
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
//                   <Instagram className="h-6 w-6 text-primary" />
//                   <div>
//                     <CardTitle>Instagram Accounts</CardTitle>
//                     <CardDescription>Manage your connected Instagram accounts</CardDescription>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={() => handleAddAccount("instagram")}
//                   disabled={isConnecting.instagram || connectedAccounts.instagram.length > 0}
//                   className="bg-primary hover:bg-primary/90 text-primary-foreground"
//                 >
//                   {isConnecting.instagram ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
//                     </>
//                   ) : connectedAccounts.instagram.length > 0 ? (
//                     <>
//                       <CheckCircle className="mr-2 h-4 w-4" /> Connected
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="mr-2 h-4 w-4" /> Connect Account
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
//                   subtitle: `${account.username}`,
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
//                   <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
//                   Public Instagram account
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
//                   Business or Creator account type
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
//                   Connected Facebook page
//                 </li>
//               </ul>
//             </CardFooter>
//           </Card>
//           <PlatformBenefits platform="instagram" />
//         </TabsContent>
//       </Tabs>

//       <InstagramDashboard userId={userData?.data?.clerkId || "1234556"} />

//       {showRequirements && (
//         <RequirementsModal
//           platform={showRequirements}
//           onClose={() => setShowRequirements(null)}
//           onConnect={() => handleConnectAfterRequirements(showRequirements)}
//         />
//       )}

//       {/* Deauthorization Confirmation Dialog */}
//       <AlertDialog
//         open={showDeauthorizeDialog.show}
//         onOpenChange={(open) =>
//           !open && setShowDeauthorizeDialog({ show: false, platform: "", accountId: "", accountName: "" })
//         }
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-destructive" />
//               Deauthorize Account
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-2">
//               <p>
//                 Are you sure you want to deauthorize <strong>{showDeauthorizeDialog.accountName}</strong>?
//               </p>
//               <p className="text-sm text-muted-foreground">This action will:</p>
//               <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
//                 <li>Revoke all access permissions for this account</li>
//                 <li>Remove the account from your connected integrations</li>
//                 <li>Stop all automated posting and data syncing</li>
//                 <li>Delete stored account data from our servers</li>
//               </ul>
//               <p className="text-sm font-medium text-chart-4">
//                 You&apos;ll need to reconnect the account to use it again.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeauthorizing}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeauthorizeAccount}
//               disabled={isDeauthorizing}
//               className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
//             >
//               {isDeauthorizing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Deauthorizing...
//                 </>
//               ) : (
//                 <>
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Deauthorize
//                 </>
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//       {/* Privacy Policy Agreement Dialog */}
//       <AlertDialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
//         <AlertDialogContent className="max-w-md">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-primary" />
//               Privacy & Data Usage
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-4">
//               <p>
//                 Before connecting your account, please review our privacy policy to understand how we handle your data.
//               </p>
//               <div className="bg-muted/50 p-4 rounded-lg space-y-3">
//                 <h4 className="font-medium text-sm">We will access:</h4>
//                 <ul className="text-sm space-y-1">
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-3 w-3 text-chart-2" />
//                     Basic profile information
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-3 w-3 text-chart-2" />
//                     Posts and media content
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-3 w-3 text-chart-2" />
//                     Engagement metrics
//                   </li>
//                 </ul>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <input
//                   type="checkbox"
//                   id="privacy-checkbox"
//                   checked={privacyPolicyAccepted}
//                   onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
//                   className="mt-1"
//                 />
//                 <label htmlFor="privacy-checkbox" className="text-sm">
//                   I have read and agree to the{" "}
//                   <a
//                     href="https://www.yazzil.com/privacy"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-primary hover:text-primary/80 underline"
//                   >
//                     Privacy Policy
//                   </a>
//                 </label>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               onClick={() => {
//                 setPrivacyPolicyAccepted(false)
//                 setShowPrivacyDialog(false)
//               }}
//             >
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => {
//                 if (privacyPolicyAccepted) {
//                   setShowPrivacyDialog(false)
//                   setShowRequirements(showRequirements || "instagram")
//                   setPrivacyPolicyAccepted(false) // Reset for next time
//                 }
//               }}
//               disabled={!privacyPolicyAccepted}
//               className="bg-primary hover:bg-primary/90 text-primary-foreground"
//             >
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Deauthorization Progress Dialog */}
//       <AlertDialog open={deauthorizationProgress.show} onOpenChange={() => {}}>
//         <AlertDialogContent className="max-w-md">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               {deauthorizationProgress.step === "completed" ? (
//                 <CheckCircle className="h-5 w-5 text-chart-2" />
//               ) : deauthorizationProgress.step === "error" ? (
//                 <AlertCircle className="h-5 w-5 text-destructive" />
//               ) : (
//                 <Loader2 className="h-5 w-5 text-primary animate-spin" />
//               )}
//               {deauthorizationProgress.step === "completed"
//                 ? "Disconnected Successfully"
//                 : deauthorizationProgress.step === "error"
//                   ? "Disconnection Failed"
//                   : "Disconnecting Account"}
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-4">
//               <p>{deauthorizationProgress.message}</p>

//               {deauthorizationProgress.step !== "error" && deauthorizationProgress.step !== "completed" && (
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Progress</span>
//                     <span>{deauthorizationProgress.step === "revoking" ? "1/2" : "2/2"}</span>
//                   </div>
//                   <div className="w-full bg-muted rounded-full h-2">
//                     <div
//                       className="bg-primary h-2 rounded-full transition-all duration-500"
//                       style={{
//                         width: deauthorizationProgress.step === "revoking" ? "50%" : "100%",
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {deauthorizationProgress.step === "completed" && (
//                 <div className="bg-accent p-3 rounded-lg">
//                   <p className="text-sm text-accent-foreground">
//                     Your account has been successfully disconnected. You can now connect a different account if needed.
//                   </p>
//                 </div>
//               )}

//               {deauthorizationProgress.step === "error" && (
//                 <div className="bg-destructive/10 p-3 rounded-lg">
//                   <p className="text-sm text-destructive">
//                     Please try again or manually revoke access from your Instagram settings.
//                   </p>
//                 </div>
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           {(deauthorizationProgress.step === "completed" || deauthorizationProgress.step === "error") && (
//             <AlertDialogFooter>
//               <AlertDialogAction
//                 onClick={() =>
//                   setDeauthorizationProgress({
//                     show: false,
//                     step: "confirming",
//                     message: "",
//                   })
//                 }
//               >
//                 Close
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           )}
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { Instagram, Plus, CheckCircle, AlertCircle, RefreshCw, Loader2, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { onUserInfo } from "@/actions/user"
import { refreshInstagramData, onOAuthInstagram } from "@/actions/integrations"
import { deauthorizeInstagram } from "@/lib/deauth"
import RequirementsModal from "./requirements-modal"
import AccountsList from "./accounts-list"
import ConnectionStatus from "./connection-status"
import InstagramDashboard from "./my-info"
import { useSearchParams } from "next/navigation"

export default function InstagramIntegrationPage() {
  const [showRequirements, setShowRequirements] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isConnecting, setIsConnecting] = useState<{ [key: string]: boolean }>({})
  const [showDeauthorizeDialog, setShowDeauthorizeDialog] = useState<{
    show: boolean
    platform: string
    accountId: string
    accountName: string
  }>({
    show: false,
    platform: "",
    accountId: "",
    accountName: "",
  })
  const [isDeauthorizing, setIsDeauthorizing] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [deauthorizationProgress, setDeauthorizationProgress] = useState<{
    show: boolean
    step: "confirming" | "revoking" | "removing" | "completed" | "error"
    message: string
  }>({
    show: false,
    step: "confirming",
    message: "",
  })

  // Check for OAuth code in URL (for Instagram callback
  const code = searchParams.get("code")

  // Fetch user data including integrations
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: onUserInfo,
  })

  // Handle Instagram OAuth callback
  useEffect(() => {
    if (code) {
      // The code will be processed by your server-side code
      toast({
        title: "Instagram Connected",
        description: "Your Instagram account has been successfully connected.",
        duration: 5000,
      })

      // Refresh the user data to include the new integration
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })

      // Reset any connecting states
      setIsConnecting({})
    }
  }, [code, toast, queryClient])

  // Transform real user data into the format needed for our components
  const transformUserData = () => {
    if (!userData?.data?.integrations || !Array.isArray(userData.data.integrations)) {
      return {
        instagram: [],
      }
    }

    try {
      const instagramAccounts = userData.data.integrations
        .filter((integration: any) => integration && integration.name === "INSTAGRAM")
        .map((integration: any) => ({
          id: integration.id || `instagram-${Math.random().toString(36).substr(2, 9)}`,
          username: integration.username || integration.instagramId || "",
          avatar: integration.profilePicture || "",
          isActive: true, // Assuming all connected accounts are active
          accessToken: integration.token, // Store access token for deauthorization
        }))

      return {
        instagram: instagramAccounts,
      }
    } catch (error) {
      console.error("Error transforming user data:", error)
      return {
        instagram: [],
      }
    }
  }

  const connectedAccounts = transformUserData()

  // Enhanced OAuth connection handler
  const handleOAuthConnection = async (platform: string, strategy: "INSTAGRAM") => {
    setIsConnecting((prev) => ({ ...prev, [platform]: true }))

    try {
      if (strategy === "INSTAGRAM") {
        // This will redirect to Instagram OAuth
        await onOAuthInstagram(strategy)
      }
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect your ${platform} account. Please try again.`,
        variant: "destructive",
        duration: 3000,
      })
      setIsConnecting((prev) => ({ ...prev, [platform]: false }))
    }
  }

  const handleAddAccount = async (platform: string) => {
    // Check if account is already connected - enforce single account limit
    const isInstagramConnected = connectedAccounts.instagram.length > 0

    if (platform === "instagram" && isInstagramConnected) {
      toast({
        title: "Single Account Limit",
        description:
          "You can only connect one Instagram account. Please disconnect your current account first if you want to connect a different one.",
        duration: 5000,
      })
      return
    }

    // Show privacy policy dialog first
    setShowPrivacyDialog(true)
  }

  // Handle connection after requirements modal
  const handleConnectAfterRequirements = async (platform: string) => {
    setShowRequirements(null)

    if (platform === "instagram") {
      await handleOAuthConnection("instagram", "INSTAGRAM")
    }
  }

  // Show deauthorization confirmation dialog

  const handleShowDeauthorizeDialog = (platform: string, id: string) => {
    const account = connectedAccounts[platform as keyof typeof connectedAccounts]?.find((acc) => acc.id === id)

    const accountName = platform === "instagram" ? (account as any)?.username || "Instagram Account" : "Account"

    setShowDeauthorizeDialog({
      show: true,
      platform,
      accountId: id,
      accountName,
    })
  }

  // Handle deauthorization
  const handleDeauthorizeAccount = async () => {
    const { platform, accountId, accountName } = showDeauthorizeDialog

    // Start the deauthorization process with progress tracking
    setDeauthorizationProgress({
      show: true,
      step: "revoking",
      message: `Revoking access permissions for ${accountName}...`,
    })

    setShowDeauthorizeDialog({
      show: false,
      platform: "",
      accountId: "",
      accountName: "",
    })

    try {
      if (platform === "instagram") {
        // Find the account to get access token
        const account = connectedAccounts.instagram.find((acc) => acc.id === accountId)

        if (!account?.accessToken) {
          throw new Error("Access token not found")
        }

        // Step 1: Revoke Instagram permissions
        setDeauthorizationProgress((prev) => ({
          ...prev,
          step: "revoking",
          message: `Revoking Instagram permissions for ${accountName}...`,
        }))

        const result = await deauthorizeInstagram(accountId, account.accessToken)

        if (result.status === 200) {
          // Step 2: Remove from our database
          setDeauthorizationProgress((prev) => ({
            ...prev,
            step: "removing",
            message: "Removing account from your integrations...",
          }))

          // Wait a moment to show the removing step
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Step 3: Complete
          setDeauthorizationProgress((prev) => ({
            ...prev,
            step: "completed",
            message: `${accountName} has been successfully disconnected!`,
          }))

          toast({
            title: "Account Disconnected",
            description: `${accountName} has been successfully deauthorized and removed.`,
            duration: 3000,
          })

          // Refresh the user data to remove the deauthorized account
          queryClient.invalidateQueries({ queryKey: ["user-profile"] })

          // Hide progress after 2 seconds
          setTimeout(() => {
            setDeauthorizationProgress({
              show: false,
              step: "confirming",
              message: "",
            })
          }, 2000)
        } else {
          throw new Error(result.message || "Deauthorization failed")
        }
      }
    } catch (error) {
      console.error(`Error deauthorizing ${platform}:`, error)

      setDeauthorizationProgress((prev) => ({
        ...prev,
        step: "error",
        message: `Failed to disconnect ${accountName}. Please try again or remove access manually from your ${platform} settings.`,
      }))

      toast({
        title: "Disconnection Failed",
        description: `Failed to deauthorize ${accountName}. Please try again or remove access manually from your ${platform} settings.`,
        variant: "destructive",
        duration: 5000,
      })

      // Hide progress after 5 seconds on error
      setTimeout(() => {
        setDeauthorizationProgress({
          show: false,
          step: "confirming",
          message: "",
        })
      }, 5000)
    }
  }

  const handleRemoveAccount = (platform: string, id: string) => {
    // Show deauthorization dialog instead of immediate removal
    handleShowDeauthorizeDialog(platform, id)
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      // Use the actual user ID from userData
      const userId = userData?.data?.clerkId || "User"
      const result = await refreshInstagramData(userId || "237462617")

      if (result.status === 200) {
        toast({
          title: "Data Refreshed",
          description: "Your Instagram data has been successfully updated.",
          duration: 3000,
        })

        // Refresh the user data
        queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      } else {
        toast({
          title: "Refresh Failed",
          description: result.message || "Failed to refresh Instagram data.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  // if (isLoading) {
  //   return (
  //     <div className="container max-w-5xl py-20 flex flex-col items-center justify-center">
  //       <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
  //       <p className="text-muted-foreground">Loading your integrations...</p>
  //     </div>
  //   )
  // }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Instagram className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Instagram Integration</h1>
              <p className="text-muted-foreground">Connect and manage your Instagram account</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-transparent"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh Data
          </Button>
        </div>
      </motion.div>

      <Alert className="float bg-accent border-border">
        <Instagram className="h-4 w-4 text-primary" />
        <AlertTitle className="text-accent-foreground">Instagram Benefits</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Connect your Instagram account to enable seamless posting, detailed analytics tracking, automated responses,
          and comprehensive content management.
        </AlertDescription>
      </Alert>

      <ConnectionStatus
        platform="instagram"
        accounts={connectedAccounts.instagram}
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="staggeredFadeIn space-y-6">
        <motion.div variants={itemVariants}>
          <Card className="glassEffect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Instagram className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Instagram Account</CardTitle>
                    <CardDescription>Connect your Instagram business or creator account</CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => handleAddAccount("instagram")}
                  disabled={isConnecting.instagram || connectedAccounts.instagram.length > 0}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isConnecting.instagram ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                    </>
                  ) : connectedAccounts.instagram.length > 0 ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Connected
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Connect Account
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AccountsList
                accounts={connectedAccounts.instagram.map((account) => ({
                  id: account.id,
                  title: account.username,
                  subtitle: `${account.username}`,
                  avatar: "",
                  isActive: account.isActive,
                  platform: "instagram",
                }))}
                onRemove={(id) => handleRemoveAccount("instagram", id)}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t p-4">
              <h4 className="text-sm font-medium mb-2">Requirements for Instagram Integration:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
                  Business or Creator account type
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
                  Connected Facebook page
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
                  Account must be public or have appropriate permissions
                </li>
              </ul>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      

      <InstagramDashboard userId={userData?.data?.clerkId || "1234556"} />

      {showRequirements && (
        <RequirementsModal
          platform={showRequirements}
          onClose={() => setShowRequirements(null)}
          onConnect={() => handleConnectAfterRequirements(showRequirements)}
        />
      )}

      {/* Deauthorization Confirmation Dialog */}
      <AlertDialog
        open={showDeauthorizeDialog.show}
        onOpenChange={(open) =>
          !open && setShowDeauthorizeDialog({ show: false, platform: "", accountId: "", accountName: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Deauthorize Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to deauthorize <strong>{showDeauthorizeDialog.accountName}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">This action will:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Revoke all access permissions for this account</li>
                <li>Remove the account from your connected integrations</li>
                <li>Stop all automated posting and data syncing</li>
                <li>Delete stored account data from our servers</li>
              </ul>
              <p className="text-sm font-medium text-chart-4">
                You&apos;ll need to reconnect the account to use it again.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeauthorizing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeauthorizeAccount}
              disabled={isDeauthorizing}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeauthorizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deauthorizing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deauthorize
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Privacy Policy Agreement Dialog */}
      <AlertDialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Data Usage
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Before connecting your account, please review our privacy policy to understand how we handle your data.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">We will access:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-chart-2" />
                    Basic profile information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-chart-2" />
                    Posts and media content
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-chart-2" />
                    Engagement metrics
                  </li>
                </ul>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  checked={privacyPolicyAccepted}
                  onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="privacy-checkbox" className="text-sm">
                  I have read and agree to the{" "}
                  <a
                    href="https://www.yazzil.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPrivacyPolicyAccepted(false)
                setShowPrivacyDialog(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (privacyPolicyAccepted) {
                  setShowPrivacyDialog(false)
                  setShowRequirements(showRequirements || "instagram")
                  setPrivacyPolicyAccepted(false) // Reset for next time
                }
              }}
              disabled={!privacyPolicyAccepted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deauthorization Progress Dialog */}
      <AlertDialog open={deauthorizationProgress.show} onOpenChange={() => {}}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {deauthorizationProgress.step === "completed" ? (
                <CheckCircle className="h-5 w-5 text-chart-2" />
              ) : deauthorizationProgress.step === "error" ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              )}
              {deauthorizationProgress.step === "completed"
                ? "Disconnected Successfully"
                : deauthorizationProgress.step === "error"
                  ? "Disconnection Failed"
                  : "Disconnecting Account"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>{deauthorizationProgress.message}</p>

              {deauthorizationProgress.step !== "error" && deauthorizationProgress.step !== "completed" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{deauthorizationProgress.step === "revoking" ? "1/2" : "2/2"}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width: deauthorizationProgress.step === "revoking" ? "50%" : "100%",
                      }}
                    />
                  </div>
                </div>
              )}

              {deauthorizationProgress.step === "completed" && (
                <div className="bg-accent p-3 rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    Your account has been successfully disconnected. You can now connect a different account if needed.
                  </p>
                </div>
              )}

              {deauthorizationProgress.step === "error" && (
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <p className="text-sm text-destructive">
                    Please try again or manually revoke access from your Instagram settings.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {(deauthorizationProgress.step === "completed" || deauthorizationProgress.step === "error") && (
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() =>
                  setDeauthorizationProgress({
                    show: false,
                    step: "confirming",
                    message: "",
                  })
                }
              >
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
