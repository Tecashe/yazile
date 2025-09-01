
// // hooks/use-feature-access.ts
// "use client"

// import { useSubscription } from "@/contexts/subscription-context"

// export function useFeatureAccess() {
//   const { subscription, isLoading } = useSubscription()
  
//   const hasAccess = (requiredPlan: "PRO" | "TEAM") => {
//     if (isLoading) return false
//     if (!subscription) return false
    
//     // If subscription is not active, user doesn't have access
//     if (subscription.status !== "ACTIVE" && subscription.status !== "TRIALING") {
//       return false
//     }
    
//     // Check if user's plan meets the required level
//     if (requiredPlan === "PRO") {
//       return ["PRO", "TEAM"].includes(subscription.plan)
//     }
    
//     if (requiredPlan === "TEAM") {
//       return subscription.plan === "TEAM"
//     }
    
//     return false
//   }
  
//   return {
//     isLoading,
//     isPro: hasAccess("PRO"),
//     isTeam: hasAccess("TEAM"),
//     plan: subscription?.plan || "FREE",
//     status: subscription?.status,
//   }
// }





// hooks/use-feature-access.ts
"use client"

import { useSubscription } from "@/contexts/subscription-context"

export function useFeatureAccess() {
  const { subscription, isLoading } = useSubscription()
  
  const hasAccess = (requiredPlan: "PRO" | "ENTERPRISE") => {
    if (isLoading) return false
    if (!subscription) return false
    
    // If subscription is not active, user doesn't have access
    if (subscription.status !== "ACTIVE" && subscription.status !== "TRIALING") {
      return false
    }
    
    // Check if user's plan meets the required level
    if (requiredPlan === "PRO") {
      return ["PRO", "ENTERPRISE"].includes(subscription.plan)
    }
    
    if (requiredPlan === "ENTERPRISE") {
      return subscription.plan === "ENTERPRISE"
    }
    
    return false
  }
  
  return {
    isLoading,
    isPro: hasAccess("PRO"),
    isTeam: hasAccess("ENTERPRISE"),
    plan: subscription?.plan || "FREE",
    status: subscription?.status,
  }
}

