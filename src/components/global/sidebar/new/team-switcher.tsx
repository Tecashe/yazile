// "use client"

// import * as React from "react"
// import { useState } from "react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
// import { ChevronsUpDown, Crown, User, Building2, CreditCard, ChevronDown, ChevronUp } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import PaymentPopup from "@/components/global/stripe/payment-popup"
// import { SubscriptionPlan } from "../../subscription-plan"
// import UpgradeCard from "../upgrade"
// import UpgradedCard from "../upgraded"

// export function PlanSwitcher() {
//   const { isMobile } = useSidebar()
//   const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
//   const { toast } = useToast()
  

//   const handleUpgradeSuccess = () => {
//     toast({
//       title: "Subscription activated",
//       description: "Your account has been upgraded successfully!",
//       duration: 5000,
//     })
//   }

//   // Simple constant plan info
//   const planInfo = {
//     name: "Current Plan",
//     logo: CreditCard,
//     status: "USAGE",
//     color: "from-blue-600 to-blue-400"
//   }

//   return (
//     <>
//       <SidebarMenu>
//         <SidebarMenuItem>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <SidebarMenuButton
//                 size="lg"
//                 className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent/50"
//               >
//                 <div className={`flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr ${planInfo.color} text-white shadow-md`}>
//                   <planInfo.logo className="size-4" />
//                 </div>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">{planInfo.name}</span>
//                   <span className="truncate text-xs text-muted-foreground">{planInfo.status}</span>
//                 </div>
//                 <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
//               </SidebarMenuButton>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background border-border"
//               align="start"
//               side={isMobile ? "bottom" : "right"}
//               sideOffset={4}
//             >
//               <DropdownMenuLabel className="text-xs text-muted-foreground">Current Context</DropdownMenuLabel>
              
//               <DropdownMenuItem className="gap-2 p-2 cursor-default">
//                 {/* <div className={`flex size-6 items-center justify-center rounded-sm border bg-gradient-to-tr ${planInfo.color} text-white`}>
//                   <planInfo.logo className="size-4 shrink-0" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{planInfo.name}</span>
//                   <span className="text-xs text-muted-foreground">{planInfo.status}</span>
//                 </div> */}
//                 <div className="mt-4">                
//                   <SubscriptionPlan type="PRO">
//                     <div className="flex-1 flex flex-col justify-end">
//                       <UpgradedCard userName={"Member"} />
//                     </div>
//                   </SubscriptionPlan>
//                   <SubscriptionPlan type="FREE">
//                     <div className="flex-1 flex flex-col justify-end">
//                       <UpgradeCard />
//                     </div>
//                   </SubscriptionPlan>                
//               </div> 
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 className="gap-2 p-2 hover:bg-accent/50 cursor-pointer"
//                 onClick={() => setIsUpgradeOpen(true)}
//               >
//                 <div className="flex size-6 items-center justify-center rounded-md border bg-gradient-to-tr from-green-600 to-green-400 text-white">
//                   <Crown className="size-4" />
//                 </div>
//                 <div className="font-medium text-foreground">Upgrade Plan</div>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </SidebarMenuItem>
//       </SidebarMenu>

//       <PaymentPopup
//         isOpen={isUpgradeOpen}
//         onClose={() => setIsUpgradeOpen(false)}
//         onSuccess={handleUpgradeSuccess}
//       />
//     </>
//   )
// }



"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
import { ChevronsUpDown, Crown, User, Building2, CreditCard, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PaymentPopup from "@/components/global/stripe/payment-popup"
import { SubscriptionPlan } from "../../subscription-plan"
import UpgradeCard from "../upgrade"
import UpgradedCard from "../upgraded"


interface PlanInfo {
  name: string
  displayName: string
  logo: React.ElementType
  status: string
  color: string
  features: string[]
  isActive: boolean
  type: 'FREE' | 'PRO' | 'ENTERPRISE'
}

interface UserSubscription {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING' | 'UNPAID' | 'PAST_DUE'
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  paymentMethod?: string | null
}

interface SubscriptionResponse {
  success: boolean
  subscription?: UserSubscription
  error?: string
}

export function PlanSwitcher() {
  const { isMobile } = useSidebar()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Plan configurations
  const planConfigs: Record<string, PlanInfo> = {
    FREE: {
      name: "Free Plan",
      displayName: "Free",
      logo: User,
      status: "Basic Access",
      color: "from-gray-600 to-gray-400",
      features: ["Basic features", "Limited usage"],
      isActive: false,
      type: 'FREE'
    },
    PRO: {
      name: "Pro Plan",
      displayName: "Pro",
      logo: CreditCard,
      status: "Premium Access",
      color: "from-purple-600 to-pink-400",
      features: ["Smart AI responses", "Unlimited automations", "Priority support"],
      isActive: false,
      type: 'PRO'
    },
    ENTERPRISE: {
      name: "Enterprise Plan",
      displayName: "Enterprise",
      logo: Building2,
      status: "Enterprise Access",
      color: "from-blue-600 to-indigo-400",
      features: ["Everything in Pro", "Custom integrations", "Dedicated support"],
      isActive: false,
      type: 'ENTERPRISE'
    }
  }

  // Fetch user subscription data from your API
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        setIsLoading(true)
        
        const response = await fetch('/api/subscriptions/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        const data: SubscriptionResponse = await response.json()
        
        if (!data.success) {
          if (response.status === 401) {
            // User is not authenticated, handle appropriately
            console.log('User not authenticated')
            setUserSubscription({
              plan: 'FREE',
              status: 'ACTIVE',
              currentPeriodEnd: null,
              cancelAtPeriodEnd: false
            })
          } else {
            throw new Error(data.error || 'Failed to fetch subscription')
          }
        } else {
          setUserSubscription(data.subscription || {
            plan: 'FREE',
            status: 'ACTIVE',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false
          })
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
        toast({
          title: "Error",
          description: "Failed to load subscription information. Please refresh the page.",
          variant: "destructive",
          duration: 5000,
        })
        
        // Fallback to free plan
        setUserSubscription({
          plan: 'FREE',
          status: 'ACTIVE',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserSubscription()
  }, [])

  const handleUpgradeSuccess = () => {
    toast({
      title: "Subscription activated",
      description: "Your account has been upgraded successfully!",
      duration: 5000,
    })
    
    // Refresh subscription data after successful upgrade
    const refreshSubscription = async () => {
      try {
        const response = await fetch('/api/subscriptions/status')
        const data: SubscriptionResponse = await response.json()
        
        if (data.success && data.subscription) {
          setUserSubscription(data.subscription)
        }
      } catch (error) {
        console.error('Failed to refresh subscription:', error)
      }
    }
    
    refreshSubscription()
  }

  // Get current plan info with real subscription data
  const getCurrentPlanInfo = (): PlanInfo => {
    if (!userSubscription) {
      return { ...planConfigs.FREE, isActive: true }
    }
    
    const currentPlan = { ...planConfigs[userSubscription.plan], isActive: true }
    
    // Update status based on subscription status and period end
    const getStatusText = () => {
      switch (userSubscription.status) {
        case 'ACTIVE':
          if (userSubscription.cancelAtPeriodEnd && userSubscription.currentPeriodEnd) {
            const endDate = new Date(userSubscription.currentPeriodEnd)
            return `Expires ${endDate.toLocaleDateString()}`
          }
          return userSubscription.currentPeriodEnd 
            ? `Active until ${new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}`
            : 'Active'
            
        case 'TRIALING':
          return userSubscription.currentPeriodEnd 
            ? `Trial ends ${new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}`
            : 'Trial Period'
            
        case 'CANCELLED':
          return 'Cancelled'
          
        case 'PAST_DUE':
          return 'Payment Past Due'
          
        case 'UNPAID':
          return 'Payment Required'
          
        case 'INCOMPLETE':
          return 'Setup Required'
          
        case 'INCOMPLETE_EXPIRED':
          return 'Setup Expired'
          
        case 'EXPIRED':
          return 'Expired'
          
        default:
          return currentPlan.status
      }
    }
    
    currentPlan.status = getStatusText()
    return currentPlan
  }

  const currentPlan = getCurrentPlanInfo()

  // Get available upgrade options
  const getUpgradeOptions = () => {
    if (!userSubscription) return []
    
    const currentPlanIndex = ['FREE', 'PRO', 'ENTERPRISE'].indexOf(userSubscription.plan)
    return ['FREE', 'PRO', 'ENTERPRISE']
      .slice(currentPlanIndex + 1)
      .map(planType => planConfigs[planType])
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-16 mt-1" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent/50"
              >
                <div className={`flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr ${currentPlan.color} text-white shadow-md`}>
                  <currentPlan.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{currentPlan.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{currentPlan.status}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background border-border"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Current Subscription
              </DropdownMenuLabel>
              
              <DropdownMenuItem className="gap-2 p-2 cursor-default">
                <div className="w-full">
                  {userSubscription?.plan === 'PRO' ? (
                    <SubscriptionPlan type="PRO">
                      <div className="flex-1 flex flex-col justify-end">
                        <UpgradedCard userName={"Member"} />
                      </div>
                    </SubscriptionPlan>
                  ) : (
                    <SubscriptionPlan type="FREE">
                      <div className="flex-1 flex flex-col justify-end">
                        <UpgradeCard />
                      </div>
                    </SubscriptionPlan>
                  )}
                </div>
              </DropdownMenuItem>

              {/* Show subscription details */}
              {userSubscription && userSubscription.plan !== 'FREE' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2 cursor-default">
                    <div className="w-full space-y-2">
                      {/* Payment Method */}
                      {userSubscription.paymentMethod && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Payment: </span>
                          <span className="font-medium">{userSubscription.paymentMethod}</span>
                        </div>
                      )}
                      
                      {/* Subscription Status */}
                      {userSubscription.currentPeriodEnd && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            {userSubscription.cancelAtPeriodEnd ? 'Expires: ' : 'Next billing: '}
                          </span>
                          <span className="font-medium">
                            {new Date(userSubscription.currentPeriodEnd).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      
                      {/* Cancellation Notice */}
                      {userSubscription.cancelAtPeriodEnd && (
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                          Your subscription will not renew automatically
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                </>
              )}

              {/* Upgrade options - only show if user can upgrade and subscription is not cancelled */}
              {getUpgradeOptions().length > 0 && 
               userSubscription?.status !== 'CANCELLED' && 
               userSubscription?.status !== 'INCOMPLETE_EXPIRED' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="gap-2 p-2 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setIsUpgradeOpen(true)}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-gradient-to-tr from-green-600 to-green-400 text-white">
                      <Crown className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {userSubscription?.plan === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {userSubscription?.plan === 'FREE' ? 'Unlock premium features' : 'Explore other options'}
                      </span>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <PaymentPopup
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={handleUpgradeSuccess}
      />
    </>
  )
}