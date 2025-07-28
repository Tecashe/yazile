

// "use client"

// import * as React from "react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
// import { ChevronsUpDown, Plus } from "lucide-react"

// export function TeamSwitcher({
//   teams,
// }: {
//   teams: {
//     name: string
//     logo: React.ElementType
//     plan: string
//   }[]
// }) {
//   const { isMobile } = useSidebar()
//   const [activeTeam, setActiveTeam] = React.useState(teams[0])

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent/50"
//             >
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md">
//                 <activeTeam.logo className="size-4" />
//               </div>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">{activeTeam.name}</span>
//                 <span className="truncate text-xs text-muted-foreground">{activeTeam.plan}</span>
//               </div>
//               <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background border-border"
//             align="start"
//             side={isMobile ? "bottom" : "right"}
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
//             {teams.map((team, index) => (
//               <DropdownMenuItem
//                 key={team.name}
//                 onClick={() => setActiveTeam(team)}
//                 className="gap-2 p-2 hover:bg-accent/50"
//               >
//                 <div className="flex size-6 items-center justify-center rounded-sm border bg-gradient-to-tr from-blue-600 to-blue-400 text-white">
//                   <team.logo className="size-4 shrink-0" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{team.name}</span>
//                   <span className="text-xs text-muted-foreground">{team.plan}</span>
//                 </div>
//                 <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="gap-2 p-2 hover:bg-accent/50">
//               <div className="flex size-6 items-center justify-center rounded-md border bg-background">
//                 <Plus className="size-4" />
//               </div>
//               <div className="font-medium text-muted-foreground">Add team</div>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }

"use client"

import * as React from "react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
import { ChevronsUpDown, Crown, User, Users } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { useToast } from "@/hooks/use-toast"
import PaymentPopup from "@/components/global/stripe/payment-popup"

export function PlanSwitcher() {
  const { isMobile } = useSidebar()
  const { subscription, isLoading, refetchSubscription } = useSubscription()
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

  // Get plan display info
  const getPlanInfo = () => {
    // Only show loading if we're actually loading and don't have subscription data yet
    if (isLoading && !subscription) {
      return {
        name: "Loading...",
        logo: User,
        status: "...",
        color: "from-gray-600 to-gray-400"
      }
    }

    switch (subscription?.plan) {
      case "PRO":
        return {
          name: "Pro Plan",
          logo: Crown,
          status: subscription?.status === "ACTIVE" ? "Active" : subscription?.status || "Inactive",
          color: "from-blue-600 to-blue-400"
        }
      case "TEAM":
        return {
          name: "Team Plan",
          logo: Users,
          status: subscription?.status === "ACTIVE" ? "Active" : subscription?.status || "Inactive",
          color: "from-purple-600 to-purple-400"
        }
      default:
        // If no subscription data or FREE plan, show Free Plan
        return {
          name: "Free Plan",
          logo: User,
          status: "Active",
          color: "from-gray-600 to-gray-400"
        }
    }
  }

  const planInfo = getPlanInfo()
  const canUpgrade = subscription?.plan === "FREE" || subscription?.plan === "PRO"

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
                <div className={`flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr ${planInfo.color} text-white shadow-md`}>
                  <planInfo.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{planInfo.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{planInfo.status}</span>
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
              <DropdownMenuLabel className="text-xs text-muted-foreground">Current Plan</DropdownMenuLabel>
              
              <DropdownMenuItem className="gap-2 p-2 cursor-default">
                <div className={`flex size-6 items-center justify-center rounded-sm border bg-gradient-to-tr ${planInfo.color} text-white`}>
                  <planInfo.logo className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{planInfo.name}</span>
                  <span className="text-xs text-muted-foreground">{planInfo.status}</span>
                </div>
              </DropdownMenuItem>

              {canUpgrade && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="gap-2 p-2 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setIsUpgradeOpen(true)}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-gradient-to-tr from-green-600 to-green-400 text-white">
                      <Crown className="size-4" />
                    </div>
                    <div className="font-medium text-foreground">
                      {subscription?.plan === "FREE" ? "Upgrade Plan" : "Change Plan"}
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