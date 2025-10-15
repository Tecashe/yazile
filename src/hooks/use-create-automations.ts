"use client"

import { useQuery } from "@tanstack/react-query"
import { getDefaultAutomation } from "@/actions/automations/queries"

export const useDefaultAutomation = (currentAutomationId?: string) => {
  return useQuery({
    queryKey: ["default-automation", currentAutomationId],
    queryFn: async () => {
      const user = await fetch("/api/user").then((res) => res.json())
      return getDefaultAutomation(user.clerkId, currentAutomationId)
    },
  })
}
