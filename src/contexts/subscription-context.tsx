
// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// // Define the subscription plan and status types to match your Prisma schema
// export type SUBSCRIPTION_PLAN = "FREE" | "PRO" | "TEAM"
// export type SUBSCRIPTION_STATUS = "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "INCOMPLETE" | "TRIALING"

// type SubscriptionStatus = {
//   plan: SUBSCRIPTION_PLAN
//   status: SUBSCRIPTION_STATUS
//   currentPeriodEnd: Date | null
//   cancelAtPeriodEnd: boolean
//   paymentMethod: string | null
// }

// type SubscriptionContextType = {
//   subscription: SubscriptionStatus | null
//   isLoading: boolean
//   error: string | null
//   refetchSubscription: () => Promise<void>
// }

// const SubscriptionContext = createContext<SubscriptionContextType>({
//   subscription: null,
//   isLoading: true,
//   error: null,
//   refetchSubscription: async () => {},
// })

// export function SubscriptionProvider({ children }: { children: ReactNode }) {
//   const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchSubscription = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)
      
//       const response = await fetch("/api/subscriptions/status")
//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || "Failed to fetch subscription")
//       }
      
//       setSubscription(data.subscription)
//     } catch (err: any) {
//       console.error("Error fetching subscription:", err)
//       setError(err.message || "An error occurred while fetching subscription")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchSubscription()
//   }, [])

//   return (
//     <SubscriptionContext.Provider
//       value={{
//         subscription,
//         isLoading,
//         error,
//         refetchSubscription: fetchSubscription,
//       }}
//     >
//       {children}
//     </SubscriptionContext.Provider>
//   )
// }

// export const useSubscription = () => useContext(SubscriptionContext)


"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Define the subscription plan and status types to match your UI
export type SUBSCRIPTION_PLAN = "FREE" | "PRO" | "ENTERPRISE"
export type SUBSCRIPTION_STATUS = "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "INCOMPLETE" | "TRIALING"

type SubscriptionStatus = {
  plan: SUBSCRIPTION_PLAN
  status: SUBSCRIPTION_STATUS
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  paymentMethod: string | null
}

type SubscriptionContextType = {
  subscription: SubscriptionStatus | null
  isLoading: boolean
  error: string | null
  refetchSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isLoading: true,
  error: null,
  refetchSubscription: async () => {},
})

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("/api/subscriptions/status")
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch subscription")
      }
      
      setSubscription(data.subscription)
    } catch (err: any) {
      console.error("Error fetching subscription:", err)
      setError(err.message || "An error occurred while fetching subscription")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetchSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)


