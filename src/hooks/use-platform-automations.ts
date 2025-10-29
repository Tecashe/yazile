"use client"

import { useQueryAutomations } from "./user-queries"
import type { Platform } from "@/lib/constants/platform"
import { useMutationData } from "./use-mutation-data"
import { updateAutomation, deleteAutomation } from "@/actions/automations"
import { useCallback } from "react"

export const usePlatformAutomations = () => {
  const { data: automations, isLoading, error } = useQueryAutomations()

  const { mutate: updateMutate, isPending: isUpdating } = useMutationData(
    ["update-automation"],
    (data: { id: string; active: boolean }) => updateAutomation(data.id, { active: data.active }),
    "user-automations",
  )

  const { mutate: deleteMutate, isPending: isDeleting } = useMutationData(
    ["delete-automation"],
    (data: { id: string }) => deleteAutomation(data.id),
    "user-automations",
  )

  const toggleAutomationActive = useCallback(
    (id: string, active: boolean) => {
      updateMutate({ id, active })
    },
    [updateMutate],
  )

  const deleteAutomationById = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this automation?")) {
        deleteMutate({ id })
      }
    },
    [deleteMutate],
  )

  const getAutomationsByPlatform = useCallback(
    (platform: Platform) => {
      return automations?.data?.filter((a: any) => a.platform === platform) || []
    },
    [automations],
  )

  return {
    automations: automations?.data || [],
    isLoading,
    error,
    isUpdating,
    isDeleting,
    toggleAutomationActive,
    deleteAutomationById,
    getAutomationsByPlatform,
  }
}
