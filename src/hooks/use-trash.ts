"use client"

import { useMutationData } from "./use-mutation-data"
import {
  moveToTrash,
  restoreAutomation,
  permanentlyDeleteAutomation,
  emptyTrash,
} from "@/actions/automations/trash-actions"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export const useMoveToTrash = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutationData(
    ["move-to-trash"],
    (data: { id: string }) => moveToTrash(data.id),
    "user-automations",
    () => {
      toast({
        title: "Moved to trash",
        description: "Automation has been moved to trash",
        variant: "default",
      })
    },
  )

  return { mutate, isPending }
}

export const useRestoreAutomation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutationData(
    ["restore-automation"],
    (data: { id: string }) => restoreAutomation(data.id),
    "trashed-automations",
    () => {
      // Invalidate both trash and main automation lists
      queryClient.invalidateQueries({ queryKey: ["user-automations"] })
      toast({
        title: "Automation restored",
        description: "Automation has been restored successfully",
        variant: "default",
      })
    },
  )

  return { mutate, isPending }
}

export const usePermanentlyDelete = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutationData(
    ["permanently-delete"],
    (data: { id: string }) => permanentlyDeleteAutomation(data.id),
    "trashed-automations",
    () => {
      toast({
        title: "Permanently deleted",
        description: "Automation has been permanently deleted",
        variant: "default",
      })
    },
  )

  return { mutate, isPending }
}

export const useEmptyTrash = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutationData(
    ["empty-trash"],
    (_data: {}) => emptyTrash(),
    "trashed-automations",
    () => {
      toast({
        title: "Trash emptied",
        description: "All trashed automations have been permanently deleted",
        variant: "default",
      })
    },
  )

  return { mutate, isPending }
}
