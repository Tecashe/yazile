"use client"

import { getAllTrashedAutomations } from "@/actions/automations/trash-actions"
import { useQuery } from "@tanstack/react-query"

export const useQueryTrashedAutomations = () => {
  return useQuery({
    queryKey: ["trashed-automations"],
    queryFn: getAllTrashedAutomations,
  })
}
