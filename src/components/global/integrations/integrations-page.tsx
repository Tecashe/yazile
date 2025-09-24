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

// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"

// import { Instagram, Plus, CheckCircle, AlertCircle, RefreshCw, Loader2, Trash2, Shield } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
// import RequirementsModal from "./requirements-modal"
// import AccountsList from "./accounts-list"
// import ConnectionStatus from "./connection-status"
// import InstagramDashboard from "./my-info"
// import { useSearchParams } from "next/navigation"

// export default function InstagramIntegrationPage() {
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
//           <div className="flex items-center space-x-3">
//             <Instagram className="h-8 w-8 text-primary" />
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">Instagram Integration</h1>
//               <p className="text-muted-foreground">Connect and manage your Instagram account</p>
//             </div>
//           </div>
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
//       </motion.div>

//       <Alert className="float bg-accent border-border">
//         <Instagram className="h-4 w-4 text-primary" />
//         <AlertTitle className="text-accent-foreground">Instagram Benefits</AlertTitle>
//         <AlertDescription className="text-muted-foreground">
//           Connect your Instagram account to enable seamless posting, detailed analytics tracking, automated responses,
//           and comprehensive content management.
//         </AlertDescription>
//       </Alert>

//       <ConnectionStatus
//         platform="instagram"
//         accounts={connectedAccounts.instagram}
//         onRefresh={handleRefreshData}
//         isRefreshing={isRefreshing}
//       />

//       <motion.div variants={containerVariants} initial="hidden" animate="visible" className="staggeredFadeIn space-y-6">
//         <motion.div variants={itemVariants}>
//           <Card className="glassEffect">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Instagram className="h-6 w-6 text-primary" />
//                   <div>
//                     <CardTitle>Instagram Account</CardTitle>
//                     <CardDescription>Connect your Instagram business or creator account</CardDescription>
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
//                   avatar: "",
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
//                   Business or Creator account type
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
//                   Connected Facebook page
//                 </li>
//                 <li className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-chart-2 mr-2" />
//                   Account must be public or have appropriate permissions
//                 </li>
//               </ul>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </motion.div>

      

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

import { 
  Instagram, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Loader2, 
  Trash2, 
  Shield,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Clock,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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

// Custom WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
)

// Custom Telegram icon component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

interface SocialPlatform {
  id: string
  name: string
  displayName: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  features: string[]
  requirements: string[]
  comingSoon?: boolean
  category: 'messaging' | 'social' | 'video'
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'INSTAGRAM',
    displayName: 'Instagram',
    icon: Instagram,
    description: 'Connect your Instagram business or creator account',
    features: ['Automated posting', 'DM automation', 'Analytics tracking', 'Content management'],
    requirements: ['Business or Creator account type', 'Connected Facebook page', 'Public account or appropriate permissions'],
    category: 'social'
  },
  {
    id: 'whatsapp',
    name: 'WHATSAPP',
    displayName: 'WhatsApp Business',
    icon: WhatsAppIcon,
    description: 'Automate customer conversations and support',
    features: ['Automated replies', 'Customer support bots', 'Message templates', 'Broadcast messaging'],
    requirements: ['WhatsApp Business account', 'Verified business profile', 'Phone number verification'],
    category: 'messaging',
    comingSoon: true
  },
  {
    id: 'telegram',
    name: 'TELEGRAM',
    displayName: 'Telegram',
    icon: TelegramIcon,
    description: 'Create bots and automate channel management',
    features: ['Bot automation', 'Channel management', 'Group moderation', 'Custom commands'],
    requirements: ['Telegram account', 'Bot token from BotFather', 'Channel/group admin rights'],
    category: 'messaging',
    comingSoon: true
  },
  {
    id: 'facebook',
    name: 'FACEBOOK',
    displayName: 'Facebook',
    icon: Facebook,
    description: 'Manage pages and automate customer interactions',
    features: ['Page management', 'Messenger automation', 'Post scheduling', 'Comment management'],
    requirements: ['Facebook Business account', 'Page admin access', 'Business verification'],
    category: 'social',
    comingSoon: true
  },
  {
    id: 'twitter',
    name: 'TWITTER',
    displayName: 'X (Twitter)',
    icon: Twitter,
    description: 'Automate tweets and engage with your audience',
    features: ['Tweet scheduling', 'DM automation', 'Engagement tracking', 'Hashtag monitoring'],
    requirements: ['Twitter account', 'API access approval', 'Verified account (recommended)'],
    category: 'social',
    comingSoon: true
  },
  {
    id: 'linkedin',
    name: 'LINKEDIN',
    displayName: 'LinkedIn',
    icon: Linkedin,
    description: 'Professional networking and content automation',
    features: ['Post scheduling', 'Connection automation', 'Lead generation', 'Company page management'],
    requirements: ['LinkedIn account', 'Premium or Sales Navigator (recommended)', 'Company page access'],
    category: 'social',
    comingSoon: true
  },
  {
    id: 'youtube',
    name: 'YOUTUBE',
    displayName: 'YouTube',
    icon: Youtube,
    description: 'Video content management and audience engagement',
    features: ['Video scheduling', 'Comment moderation', 'Analytics tracking', 'Community management'],
    requirements: ['YouTube channel', 'Google account', 'Channel verification'],
    category: 'video',
    comingSoon: true
  }
]

export default function SocialIntegrationsPage() {
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [deauthorizationProgress, setDeauthorizationProgress] = useState<{
    show: boolean
    step: "confirming" | "revoking" | "removing" | "completed" | "error"
    message: string
  }>({
    show: false,
    step: "confirming",
    message: "",
  })

  // Check for OAuth code in URL (for Instagram callback)
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
      toast({
        title: "Instagram Connected",
        description: "Your Instagram account has been successfully connected.",
        duration: 5000,
      })
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
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
          isActive: true,
          accessToken: integration.token,
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

  const handleAddAccount = async (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId)
    
    if (platform?.comingSoon) {
      toast({
        title: "Coming Soon!",
        description: `${platform.displayName} integration is currently under development. Stay tuned!`,
        duration: 3000,
      })
      return
    }

    // Check if account is already connected - enforce single account limit for Instagram
    const isInstagramConnected = connectedAccounts.instagram.length > 0

    if (platformId === "instagram" && isInstagramConnected) {
      toast({
        title: "Single Account Limit",
        description: "You can only connect one Instagram account. Please disconnect your current account first if you want to connect a different one.",
        duration: 5000,
      })
      return
    }

    setSelectedPlatform(platformId)
    setShowPrivacyDialog(true)
  }

  // Handle connection after requirements modal
  const handleConnectAfterRequirements = async (platform: string) => {
    setShowRequirements(null)

    if (platform === "instagram") {
      await handleOAuthConnection("instagram", "INSTAGRAM")
    }
  }

  const handleShowDeauthorizeDialog = (platform: string, id: string) => {
    const account = connectedAccounts[platform as keyof typeof connectedAccounts]?.find((acc) => acc.id === id)
    const platformData = socialPlatforms.find(p => p.id === platform)
    const accountName = platform === "instagram" ? (account as any)?.username || "Instagram Account" : `${platformData?.displayName} Account`

    setShowDeauthorizeDialog({
      show: true,
      platform,
      accountId: id,
      accountName,
    })
  }

  // Handle deauthorization (currently only works for Instagram)
  const handleDeauthorizeAccount = async () => {
    const { platform, accountId, accountName } = showDeauthorizeDialog

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
        const account = connectedAccounts.instagram.find((acc) => acc.id === accountId)

        if (!account?.accessToken) {
          throw new Error("Access token not found")
        }

        setDeauthorizationProgress((prev) => ({
          ...prev,
          step: "revoking",
          message: `Revoking Instagram permissions for ${accountName}...`,
        }))

        const result = await deauthorizeInstagram(accountId, account.accessToken)

        if (result.status === 200) {
          setDeauthorizationProgress((prev) => ({
            ...prev,
            step: "removing",
            message: "Removing account from your integrations...",
          }))

          await new Promise((resolve) => setTimeout(resolve, 1500))

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

          queryClient.invalidateQueries({ queryKey: ["user-profile"] })

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
    handleShowDeauthorizeDialog(platform, id)
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      const userId = userData?.data?.clerkId || "User"
      const result = await refreshInstagramData(userId || "237462617")

      if (result.status === 200) {
        toast({
          title: "Data Refreshed",
          description: "Your Instagram data has been successfully updated.",
          duration: 3000,
        })
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

  const filteredPlatforms = selectedCategory === 'all' 
    ? socialPlatforms 
    : socialPlatforms.filter(platform => platform.category === selectedCategory)

  const categoryColors = {
    all: 'bg-primary',
    messaging: 'bg-green-500',
    social: 'bg-blue-500',
    video: 'bg-red-500'
  }

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Social Media Integrations</h1>
              <p className="text-muted-foreground">Connect and automate your social media accounts</p>
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
        <Zap className="h-4 w-4 text-primary" />
        <AlertTitle className="text-accent-foreground">Automation Benefits</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Connect your social media accounts to enable automated posting, customer support, engagement tracking, 
          and comprehensive content management across all platforms.
        </AlertDescription>
      </Alert>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Platforms', icon: Zap },
          { id: 'messaging', label: 'Messaging', icon: MessageCircle },
          { id: 'social', label: 'Social Networks', icon: Instagram },
          { id: 'video', label: 'Video Platforms', icon: Youtube }
        ].map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`${selectedCategory === category.id ? categoryColors[category.id as keyof typeof categoryColors] : ''}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.label}
            </Button>
          )
        })}
      </div>

      <ConnectionStatus
        platform="instagram"
        accounts={connectedAccounts.instagram}
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform) => {
          const Icon = platform.icon
          const isConnected = platform.id === 'instagram' ? connectedAccounts.instagram.length > 0 : false
          const isPlatformConnecting = isConnecting[platform.id]
          
          return (
            <motion.div key={platform.id} variants={itemVariants}>
              <Card className="glassEffect h-full flex flex-col relative">
                {platform.comingSoon && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-4 right-4 z-10 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Coming Soon
                  </Badge>
                )}
                
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${platform.comingSoon ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Icon className={`h-6 w-6 ${platform.comingSoon ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.displayName}</CardTitle>
                      <CardDescription className="text-sm">{platform.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {platform.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-chart-2 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!platform.comingSoon && platform.id === 'instagram' && (
                    <div>
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
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex-shrink-0 border-t p-4">
                  <Button
                    onClick={() => handleAddAccount(platform.id)}
                    disabled={isPlatformConnecting || (platform.id === 'instagram' && isConnected)}
                    className={`w-full ${
                      platform.comingSoon 
                        ? 'bg-muted hover:bg-muted/80 text-muted-foreground cursor-not-allowed' 
                        : isConnected 
                          ? 'bg-chart-2 hover:bg-chart-2/90 text-chart-2-foreground' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                    variant={platform.comingSoon ? "secondary" : "default"}
                  >
                    {platform.comingSoon ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" /> Coming Soon
                      </>
                    ) : isPlatformConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                      </>
                    ) : isConnected ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Connected
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Connect Account
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
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
                Before connecting your {socialPlatforms.find(p => p.id === selectedPlatform)?.displayName} account, 
                please review our privacy policy to understand how we handle your data.
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
                setSelectedPlatform('')
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (privacyPolicyAccepted) {
                  setShowPrivacyDialog(false)
                  setShowRequirements(selectedPlatform)
                  setPrivacyPolicyAccepted(false)
                  setSelectedPlatform('')
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
                    Please try again or manually revoke access from your social media settings.
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