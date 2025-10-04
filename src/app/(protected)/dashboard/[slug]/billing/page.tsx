
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { CreditCard, Calendar, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
// import { useSubscription } from "@/contexts/subscription-context"
// import { useToast } from "@/hooks/use-toast"
// import PaymentPopup from "@/components/global/stripe/payment-popup"

// export default function BillingPage() {
//   const { subscription, isLoading, error, refetchSubscription } = useSubscription()
//   const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
//   const [isManaging, setIsManaging] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const handleManageSubscription = async () => {
//     try {
//       setIsManaging(true)
//       const response = await fetch("/api/subscriptions/manage")
//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || "Failed to create billing portal session")
//       }
      
//       // Redirect to Stripe Billing Portal
//       window.location.href = data.url
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred",
//         variant: "destructive",
//       })
//       setIsManaging(false)
//     }
//   }

//   const handleUpgradeSuccess = () => {
//     refetchSubscription()
//     toast({
//       title: "Subscription activated",
//       description: "Your account has been upgraded successfully!",
//       duration: 5000,
//     })
//   }

//   // Format date
//   const formatDate = (date: Date | null) => {
//     if (!date) return "N/A"
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   return (
//     <div className="container max-w-4xl py-8">
//       <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

//       {isLoading ? (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//         </div>
//       ) : error ? (
//         <Card className="bg-red-950 border-red-900">
//           <CardHeader>
//             <CardTitle className="flex items-center text-red-400">
//               <AlertTriangle className="mr-2 h-5 w-5" />
//               Error Loading Subscription
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-red-300">{error}</p>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={refetchSubscription} variant="outline" className="border-red-800 text-red-300">
//               Try Again
//             </Button>
//           </CardFooter>
//         </Card>
//       ) : (
//         <>
//           <Card className="mb-8 bg-black border-gray-800">
//             <CardHeader>
//               <CardTitle className="text-white">Current Plan</CardTitle>
//               <CardDescription className="text-gray-400">
//                 Your current subscription plan and status
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Plan</p>
//                   <p className="text-xl font-semibold text-white">
//                     {subscription?.plan === "FREE"
//                       ? "Free Plan"
//                       : subscription?.plan === "PRO"
//                         ? "Pro Plan"
//                         : "Team Plan"}
//                   </p>
//                 </div>
//                 <div className="flex items-center">
//                   {subscription?.status === "ACTIVE" ? (
//                     <span className="flex items-center text-green-400 text-sm">
//                       <CheckCircle className="mr-1 h-4 w-4" />
//                       Active
//                     </span>
//                   ) : subscription?.status === "TRIALING" ? (
//                     <span className="flex items-center text-blue-400 text-sm">
//                       <Calendar className="mr-1 h-4 w-4" />
//                       Trial
//                     </span>
//                   ) : (
//                     <span className="flex items-center text-red-400 text-sm">
//                       <AlertTriangle className="mr-1 h-4 w-4" />
//                       {subscription?.status}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {subscription?.plan !== "FREE" && (
//                 <>
//                   <div className="pt-2 border-t border-gray-800">
//                     <p className="text-sm text-gray-400">Payment Method</p>
//                     <p className="text-white flex items-center">
//                       <CreditCard className="mr-2 h-4 w-4" />
//                       {subscription?.paymentMethod || "No payment method on file"}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-gray-400">Billing Period</p>
//                     <p className="text-white">
//                       {subscription?.currentPeriodEnd
//                         ? `Current period ends on ${formatDate(subscription.currentPeriodEnd)}`
//                         : "No active billing period"}
//                     </p>
//                     {subscription?.cancelAtPeriodEnd && (
//                       <p className="text-amber-400 text-sm mt-1">
//                         Your subscription will be canceled at the end of the current billing period.
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col sm:flex-row gap-3">
//               {subscription?.plan === "FREE" ? (
//                 <Button onClick={() => setIsUpgradeOpen(true)} className="w-full sm:w-auto bg-white text-black">
//                   Upgrade Plan
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     onClick={handleManageSubscription}
//                     disabled={isManaging}
//                     className="w-full sm:w-auto bg-white text-black"
//                   >
//                     {isManaging ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Loading...
//                       </>
//                     ) : (
//                       "Manage Subscription"
//                     )}
//                   </Button>
//                   <Button
//                     onClick={() => setIsUpgradeOpen(true)}
//                     variant="outline"
//                     className="w-full sm:w-auto border-gray-700 text-white"
//                   >
//                     Change Plan
//                   </Button>
//                 </>
//               )}
//             </CardFooter>
//           </Card>

//           <Card className="bg-black border-gray-800">
//             <CardHeader>
//               <CardTitle className="text-white">Billing History</CardTitle>
//               <CardDescription className="text-gray-400">
//                 View and download your past invoices
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {subscription?.plan === "FREE" ? (
//                 <p className="text-gray-400 py-4 text-center">
//                   No billing history available on the free plan.
//                 </p>
//               ) : (
//                 <p className="text-gray-400 py-4 text-center">
//                   Access your complete billing history in the Stripe customer portal.
//                 </p>
//               )}
//             </CardContent>
//             <CardFooter>
//               {subscription?.plan !== "FREE" && (
//                 <Button
//                   onClick={handleManageSubscription}
//                   disabled={isManaging}
//                   variant="outline"
//                   className="w-full border-gray-700 text-white"
//                 >
//                   View Billing History
//                 </Button>
//               )}
//             </CardFooter>
//           </Card>
//         </>
//       )}

//       <PaymentPopup
//         isOpen={isUpgradeOpen}
//         onClose={() => setIsUpgradeOpen(false)}
//         onSuccess={handleUpgradeSuccess}
//       />
//     </div>
//   )
// }




// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { CreditCard, Calendar, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
// import { useSubscription } from "@/contexts/subscription-context"
// import { useToast } from "@/hooks/use-toast"
// import PaymentPopup from "@/components/global/stripe/payment-popup"

// export default function BillingPage() {
//   const { subscription, isLoading, error, refetchSubscription } = useSubscription()
//   const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
//   const [isManaging, setIsManaging] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const handleManageSubscription = async () => {
//     try {
//       setIsManaging(true)
//       const response = await fetch("/api/subscriptions/manage")
//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || "Failed to create billing portal session")
//       }
      
//       // Redirect to Stripe Billing Portal
//       window.location.href = data.url
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred",
//         variant: "destructive",
//       })
//       setIsManaging(false)
//     }
//   }

//   const handleUpgradeSuccess = () => {
//     refetchSubscription()
//     toast({
//       title: "Subscription activated",
//       description: "Your account has been upgraded successfully!",
//       duration: 5000,
//     })
//   }

//   // Format date
//   const formatDate = (date: Date | null) => {
//     if (!date) return "N/A"
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   return (
//     <div className="container max-w-4xl py-8">
//       <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

//       {isLoading ? (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//         </div>
//       ) : error ? (
//         <Card className="bg-destructive/10 border-destructive/20">
//           <CardHeader>
//             <CardTitle className="flex items-center text-destructive">
//               <AlertTriangle className="mr-2 h-5 w-5" />
//               Error Loading Subscription
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-destructive/80">{error}</p>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={refetchSubscription} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
//               Try Again
//             </Button>
//           </CardFooter>
//         </Card>
//       ) : (
//         <>
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Current Plan</CardTitle>
//               <CardDescription>
//                 Your current subscription plan and status
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Plan</p>
//                   <p className="text-xl font-semibold">
//                     {subscription?.plan === "FREE"
//                       ? "Free Plan"
//                       : subscription?.plan === "PRO"
//                         ? "Pro Plan"
//                         : "Team Plan"}
//                   </p>
//                 </div>
//                 <div className="flex items-center">
//                   {subscription?.status === "ACTIVE" ? (
//                     <span className="flex items-center text-emerald-500 text-sm">
//                       <CheckCircle className="mr-1 h-4 w-4" />
//                       Active
//                     </span>
//                   ) : subscription?.status === "TRIALING" ? (
//                     <span className="flex items-center text-blue-500 text-sm">
//                       <Calendar className="mr-1 h-4 w-4" />
//                       Trial
//                     </span>
//                   ) : (
//                     <span className="flex items-center text-destructive text-sm">
//                       <AlertTriangle className="mr-1 h-4 w-4" />
//                       {subscription?.status}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {subscription?.plan !== "FREE" && (
//                 <>
//                   <div className="pt-2 border-t border-border">
//                     <p className="text-sm text-muted-foreground">Payment Method</p>
//                     <p className="flex items-center">
//                       <CreditCard className="mr-2 h-4 w-4" />
//                       {subscription?.paymentMethod || "No payment method on file"}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-muted-foreground">Billing Period</p>
//                     <p>
//                       {subscription?.currentPeriodEnd
//                         ? `Current period ends on ${formatDate(subscription.currentPeriodEnd)}`
//                         : "No active billing period"}
//                     </p>
//                     {subscription?.cancelAtPeriodEnd && (
//                       <p className="text-amber-500 text-sm mt-1">
//                         Your subscription will be canceled at the end of the current billing period.
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col sm:flex-row gap-3">
//               {subscription?.plan === "FREE" ? (
//                 <Button onClick={() => setIsUpgradeOpen(true)} className="w-full sm:w-auto">
//                   Upgrade Plan
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     onClick={handleManageSubscription}
//                     disabled={isManaging}
//                     className="w-full sm:w-auto"
//                   >
//                     {isManaging ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Loading...
//                       </>
//                     ) : (
//                       "Manage Subscription"
//                     )}
//                   </Button>
//                   <Button
//                     onClick={() => setIsUpgradeOpen(true)}
//                     variant="outline"
//                     className="w-full sm:w-auto"
//                   >
//                     Change Plan
//                   </Button>
//                 </>
//               )}
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Billing History</CardTitle>
//               <CardDescription>
//                 View and download your past invoices
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {subscription?.plan === "FREE" ? (
//                 <p className="text-muted-foreground py-4 text-center">
//                   No billing history available on the free plan.
//                 </p>
//               ) : (
//                 <p className="text-muted-foreground py-4 text-center">
//                   Access your complete billing history in the Stripe customer portal.
//                 </p>
//               )}
//             </CardContent>
//             <CardFooter>
//               {subscription?.plan !== "FREE" && (
//                 <Button
//                   onClick={handleManageSubscription}
//                   disabled={isManaging}
//                   variant="outline"
//                   className="w-full"
//                 >
//                   View Billing History
//                 </Button>
//               )}
//             </CardFooter>
//           </Card>
//         </>
//       )}

//       <PaymentPopup
//         isOpen={isUpgradeOpen}
//         onClose={() => setIsUpgradeOpen(false)}
//         onSuccess={handleUpgradeSuccess}
//       />
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Calendar, AlertTriangle, CheckCircle, Loader2, Info } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { useToast } from "@/hooks/use-toast"
import PaymentPopup from "@/components/global/stripe/payment-popup"

export default function BillingPage() {
  const { subscription, isLoading, error, refetchSubscription } = useSubscription()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const { toast } = useToast()

  const handleUpgradeSuccess = () => {
    refetchSubscription()
    toast({
      title: "Subscription activated",
      description: "Your account has been upgraded successfully!",
      duration: 5000,
    })
  }

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "FREE":
        return "Free Plan"
      case "PRO":
        return "Pro Plan"
      case "ENTERPRISE":
        return "Enterprise Plan"
      default:
        return plan
    }
  }

  const canUpgradeToPlan = (targetPlan: string) => {
    const currentPlan = subscription?.plan || "FREE"
    return currentPlan !== targetPlan
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Billing & Subscription</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error Loading Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/80">{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={refetchSubscription}
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your current subscription plan and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-xl font-semibold">{getPlanDisplayName(subscription?.plan || "FREE")}</p>
                </div>
                <div className="flex items-center">
                  {subscription?.status === "ACTIVE" ? (
                    <span className="flex items-center text-emerald-500 text-sm">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Active
                    </span>
                  ) : subscription?.status === "TRIALING" ? (
                    <span className="flex items-center text-blue-500 text-sm">
                      <Calendar className="mr-1 h-4 w-4" />
                      Trial
                    </span>
                  ) : subscription?.status === "INCOMPLETE" ? (
                    <span className="flex items-center text-amber-500 text-sm">
                      <Info className="mr-1 h-4 w-4" />
                      Incomplete
                    </span>
                  ) : subscription?.status === "PAST_DUE" ? (
                    <span className="flex items-center text-orange-500 text-sm">
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      Past Due
                    </span>
                  ) : (
                    <span className="flex items-center text-destructive text-sm">
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      {subscription?.status || "Unknown"}
                    </span>
                  )}
                </div>
              </div>

              {subscription?.plan !== "FREE" && subscription?.status === "ACTIVE" && (
                <>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {subscription?.paymentMethod
                        ? `${subscription.paymentMethod} ending in ${subscription.paymentMethod.slice(-4)}`
                        : "Pesapal Payment"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Billing Period</p>
                    <p>
                      {subscription?.currentPeriodEnd
                        ? `Current period ends on ${formatDate(subscription.currentPeriodEnd)}`
                        : "No active billing period"}
                    </p>
                    {subscription?.cancelAtPeriodEnd && (
                      <p className="text-amber-500 text-sm mt-1 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Your subscription will be canceled at the end of the current billing period.
                      </p>
                    )}
                  </div>
                </>
              )}

              {subscription?.status === "INCOMPLETE" && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Info className="h-4 w-4 shrink-0" />
                    Your payment is incomplete. Please complete the payment to activate your subscription.
                  </p>
                </div>
              )}

              {subscription?.status === "PAST_DUE" && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Your payment is past due. Please update your payment method to continue your subscription.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              {subscription?.plan === "FREE" || !subscription ? (
                <Button onClick={() => setIsUpgradeOpen(true)} className="w-full sm:w-auto">
                  Upgrade Plan
                </Button>
              ) : (
                <>
                  {canUpgradeToPlan("PRO") || canUpgradeToPlan("ENTERPRISE") ? (
                    <Button onClick={() => setIsUpgradeOpen(true)} className="w-full sm:w-auto">
                      Change Plan
                    </Button>
                  ) : (
                    <Button onClick={() => setIsUpgradeOpen(true)} variant="outline" className="w-full sm:w-auto">
                      View Plans
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Information about your current subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan Type</p>
                  <p className="font-medium">{getPlanDisplayName(subscription?.plan || "FREE")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{subscription?.status?.toLowerCase() || "Unknown"}</p>
                </div>
                {subscription?.plan !== "FREE" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Started On</p>
                      <p className="font-medium">
                        {subscription?.currentPeriodEnd
                          ? formatDate(
                              new Date(new Date(subscription.currentPeriodEnd).getTime() - 30 * 24 * 60 * 60 * 1000),
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Renews On</p>
                      <p className="font-medium">
                        {subscription?.cancelAtPeriodEnd
                          ? "Canceled"
                          : formatDate(subscription?.currentPeriodEnd || null)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {subscription?.plan === "PRO" && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-2">Your Plan Includes:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      AI-powered Intelligent replies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      50 automations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      Detailed Sentiment Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      Lead Qualification and CRM syncing
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              {subscription?.plan === "FREE" ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No billing history available on the free plan.
                </p>
              ) : (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  Your payment history is managed through Pesapal. Contact support for detailed billing information.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <PaymentPopup isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} onSuccess={handleUpgradeSuccess} />
    </div>
  )
}
