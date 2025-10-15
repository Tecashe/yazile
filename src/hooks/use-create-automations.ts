// "use client"

// import { useQuery } from "@tanstack/react-query"
// import { getDefaultAutomation } from "@/actions/automations/queries"
// import { useUser } from "@clerk/nextjs"

// export const useDefaultAutomation = (currentAutomationId?: string) => {
//   return useQuery({
//     queryKey: ["default-automation", currentAutomationId],
//     queryFn: async () => {
//       const user = await fetch("/api/user").then((res) => res.json())


//       return getDefaultAutomation(user.clerkId, currentAutomationId)
//     },
//   })
// }

















"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getDefaultAutomation } from "@/actions/automations/queries"
import { useUser } from "@clerk/nextjs"

export const useDefaultAutomation = (currentAutomationId?: string) => {
  const { user } = useUser()

  return useQuery({
    queryKey: ["default-automation", currentAutomationId],
    queryFn: async () => {
      if (!user?.id) return null
      console.log("[v0] Fetching default automation for user:", user.id)
      const result = await getDefaultAutomation(user.id, currentAutomationId)
      console.log("[v0] Default automation result:", result)
      return result
    },
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export const useInvalidateDefaultAutomation = () => {
  const queryClient = useQueryClient()

  return () => {
    console.log("[v0] Invalidating default automation query")
    queryClient.invalidateQueries({ queryKey: ["default-automation"] })
  }
}
