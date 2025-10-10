"use client"

import {
  getAllTrashedAutomations,
  restoreAutomation as restoreAutomationAction,
  permanentlyDeleteAutomation as permanentlyDeleteAutomationAction,
} from "@/actions/automations/trash-actions"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export const useQueryTrashedAutomations = () => {
  return useQuery({
    queryKey: ["trashed-automations"],
    queryFn: async () => {
      console.log("[v0] useQueryTrashedAutomations: Fetching trashed automations")
      const result = await getAllTrashedAutomations()
      console.log("[v0] useQueryTrashedAutomations: Result:", result)
      return result
    },
  })
}

export const useRestoreAutomation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await restoreAutomationAction(data.id)
      if (response.status !== 200) throw new Error("Failed to restore automation")
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashed-automations"] })
      queryClient.invalidateQueries({ queryKey: ["user-automations"] })

      toast({
        title: "Automation restored",
        description: "Your automation has been restored successfully.",
        variant: "default",
      })
    },
    onError: () => {
      toast({
        title: "Failed to restore",
        description: "There was an error restoring your automation. Please try again.",
        variant: "destructive",
      })
    },
  })
}

export const usePermanentlyDeleteAutomation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await permanentlyDeleteAutomationAction(data.id)
      if (response.status !== 200) throw new Error("Failed to permanently delete automation")
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trashed-automations"] })

      toast({
        title: "Permanently deleted",
        description: "Automation has been permanently deleted.",
        variant: "default",
      })
    },
    onError: () => {
      toast({
        title: "Failed to delete",
        description: "There was an error deleting your automation. Please try again.",
        variant: "destructive",
      })
    },
  })
}
