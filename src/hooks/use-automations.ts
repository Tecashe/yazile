


"use client"

import type React from "react"

import { z } from "zod"
import {
  createAutomations,
  deleteAutomation,
  deleteKeyword,
  saveKeyword,
  saveListener,
  savePosts,
  saveScheduledPosts,
  saveTrigger,
  updateAutomationName,
} from "@/actions/automations"
import { useMutationData } from "./use-mutation-data"
import { useEffect, useRef, useState } from "react"
import useZodForm from "./use-zod-form"
import { type AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { TRIGGER } from "@/redux/slices/automation"
import type { ScheduledPost } from "@/actions/schedule/schedule-post"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export const useCreateAutomation = (id?: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Use the existing useMutationData hook but enhance it with optimistic updates
  const { isPending, mutate: originalMutate } = useMutationData(
    ["create-automation"],
    () => createAutomations(id),
    "user-automations",
  )

  // Create an enhanced mutate function with optimistic updates
  const mutate = (variables: any, options?: any) => {
    // Generate a temporary ID if none provided
    const tempId = id || `temp-${Date.now()}`

    // Get the current automations data
    const currentData = queryClient.getQueryData(["user-automations"])

    // Create an optimistic version of the new automation
    const optimisticAutomation = {
      ...variables,
      id: tempId,
      active: false,
      keywords: variables.keywords || [],
      listener: null,
      _isOptimistic: true, // Flag to identify this is an optimistic update
    }

    // Optimistically update the query data
    queryClient.setQueryData(["user-automations"], (old: any) => {
      return {
        ...old,
        data: old?.data ? [optimisticAutomation, ...old.data] : [optimisticAutomation],
      }
    })

    // Call the original mutate function
    return originalMutate(variables, {
      ...options,
      onSuccess: (data: any) => {
        // Remove the optimistic entry
        queryClient.setQueryData(["user-automations"], (old: any) => {
          return {
            ...old,
            data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
          }
        })

        // Invalidate and refetch to get the real data
        queryClient.invalidateQueries({ queryKey: ["user-automations"] })

        // Show success toast
        toast({
          title: "Automation created",
          description: "Your automation has been created successfully.",
          variant: "default",
        })

        // Call the original onSuccess if provided
        if (options?.onSuccess) {
          options.onSuccess(data)
        }
      },
      onError: (error: any) => {
        // Remove the optimistic entry on error
        queryClient.setQueryData(["user-automations"], (old: any) => {
          return {
            ...old,
            data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
          }
        })

        // Show error toast
        toast({
          title: "Failed to create automation",
          description: "There was an error creating your automation. Please try again.",
          variant: "destructive",
        })

        // Call the original onError if provided
        if (options?.onError) {
          options.onError(error)
        }
      },
    })
  }

  return { isPending, mutate }
}

export const useEditAutomation = (automationId: string) => {
  const [edit, setEdit] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const enableEdit = () => setEdit(true)
  const disableEdit = () => setEdit(false)

  const { isPending, mutate } = useMutationData(
    ["update-automation"],
    (data: { name: string }) => updateAutomationName(automationId, { name: data.name }),
    "automation-info",
    disableEdit,
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node | null)) {
        if (inputRef.current.value !== "") {
          mutate({ name: inputRef.current.value })
        } else {
          disableEdit()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mutate])

  return {
    edit,
    enableEdit,
    disableEdit,
    inputRef,
    isPending,
  }
}

export const useListener = (id: string) => {
  const [listener, setListener] = useState<"MESSAGE" | "SMARTAI" | null>(null)

  const promptSchema = z.object({
    prompt: z.string().min(1),
    reply: z.string(),
  })

  const { isPending, mutate } = useMutationData(
    ["create-listener"],
    (data: { prompt: string; reply: string }) => saveListener(id, listener || "MESSAGE", data.prompt, data.reply),
    "automation-info",
  )

  const { errors, onFormSubmit, register, reset, watch } = useZodForm(promptSchema, mutate)

  const onSetListener = (type: "SMARTAI" | "MESSAGE") => setListener(type)
  return { onSetListener, register, onFormSubmit, listener, isPending }
}

export const useTriggers = (id: string) => {
  const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)

  const dispatch: AppDispatch = useDispatch()

  const onSetTrigger = (type: "COMMENT" | "DM") => dispatch(TRIGGER({ trigger: { type } }))

  const { isPending, mutate } = useMutationData(
    ["add-trigger"],
    (data: { types: string[] }) => saveTrigger(id, data.types),
    "automation-info",
  )

  const onSaveTrigger = () => mutate({ types })
  return { types, onSetTrigger, onSaveTrigger, isPending }
}

export const useKeywords = (id: string) => {
  const [keyword, setKeyword] = useState("")
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

  const { mutate } = useMutationData(
    ["add-keyword"],
    (data: { keyword: string }) => saveKeyword(id, data.keyword),
    "automation-info",
    () => setKeyword(""),
  )

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      mutate({ keyword })
      setKeyword("")
    }
  }

  const { mutate: deleteMutation } = useMutationData(
    ["delete-keyword"],
    (data: { id: string }) => deleteKeyword(data.id),
    "automation-info",
  )

  const addKeyword = (newKeyword: string) => {
    if (newKeyword.trim()) {
      mutate({ keyword: newKeyword })
    }
  }

  return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
}


export const useAutomationPosts = (id: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [posts, setPosts] = useState<
    {
      postid: string
      caption?: string
      media: string
      mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
    }[]
  >([])

  // Add state for scheduled posts
  const [scheduledPosts, setScheduledPosts] = useState<string[]>([])

  const onSelectPost = (post: {
    postid: string
    caption?: string
    media: string
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
  }) => {
    setPosts((prevItems) => {
      if (prevItems.find((p) => p.postid === post.postid)) {
        return prevItems.filter((item) => item.postid !== post.postid)
      } else {
        return [...prevItems, post]
      }
    })
  }

  // Add function to handle scheduled post selection
  const onSelectScheduledPost = (post: ScheduledPost) => {
    // Ensure post.id exists before proceeding
    if (!post.id) return

    setScheduledPosts((prevItems) => {
      if (prevItems.includes(post.id)) {
        return prevItems.filter((item) => item !== post.id)
      } else {
        return [...prevItems, post.id]
      }
    })
  }

  const { mutate, isPending } = useMutationData(
    ["attach-posts"],
    async (data?: { posts?: typeof posts; scheduledPostIds?: string[] }) => {
      // Use provided posts or current state
      const postsToSave = data?.posts || posts

      // Use provided scheduledPostIds or current state
      const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

      // Save published posts
      const publishedResult = await savePosts(id, postsToSave)

      // Always attempt to save scheduled posts, even if the array is empty
      // This ensures the backend knows about the current state
      await saveScheduledPosts(id, scheduledPostIdsToSave)

      return publishedResult
    },
    "automation-info",
    () => {
      setPosts([])
      setScheduledPosts([])
    },
  )

  // Enhanced delete mutation with optimistic updates
  const { mutate: originalDeleteMutation, isPending: isDeleting } = useMutationData(
    ["delete-automation"],
    async (data: { id: string }) => {
      try {
        const response = await deleteAutomation(data.id)
        if (response.status !== 200) throw new Error("Failed to delete automation")
        return response
      } catch (err) {
        console.error("Error deleting automation:", err)
        throw err
      }
    },
    "automation-info",
  )

  // Create an enhanced delete mutation with optimistic updates
  const deleteMutation = (variables: { id: string }, options?: any) => {
    // Get the current automations data
    const currentData = queryClient.getQueryData(["user-automations"])

    // Optimistically update the query data by removing the automation
    queryClient.setQueryData(["user-automations"], (old: any) => {
      return {
        ...old,
        data: old?.data ? old.data.filter((automation: any) => automation.id !== variables.id) : [],
      }
    })

    // Call the original delete mutation
    return originalDeleteMutation(variables, {
      ...options,
      onSuccess: (data: any) => {
        // Show success toast
        toast({
          title: "Automation deleted",
          description: "Your automation has been deleted successfully.",
          variant: "default",
        })

        // Call the original onSuccess if provided
        if (options?.onSuccess) {
          options.onSuccess(data)
        }
      },
      onError: (error: any) => {
        // Revert the optimistic update on error
        queryClient.setQueryData(["user-automations"], currentData)

        // Show error toast
        toast({
          title: "Failed to delete automation",
          description: "There was an error deleting your automation. Please try again.",
          variant: "destructive",
        })

        // Call the original onError if provided
        if (options?.onError) {
          options.onError(error)
        }
      },
    })
  }

  return {
    posts,
    onSelectPost,
    scheduledPosts,
    onSelectScheduledPost,
    mutate,
    isPending,
    deleteMutation,
    isDeleting,
  }
}
