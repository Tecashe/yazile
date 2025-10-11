// "use client"

// import type React from "react"

// import { z } from "zod"
// import {
//   createAutomations,
//   deleteAutomation,
//   deleteKeyword,
//   saveKeyword,
//   saveListener,
//   savePosts,
//   saveScheduledPosts,
//   saveTrigger,
//   updateAutomationName,
// } from "@/actions/automations"
// import { useMutationData } from "./use-mutation-data"
// import { useEffect, useRef, useState } from "react"
// import useZodForm from "./use-zod-form"
// import { type AppDispatch, useAppSelector } from "@/redux/store"
// import { useDispatch } from "react-redux"
// import { TRIGGER } from "@/redux/slices/automation"
// import type { ScheduledPost } from "@/actions/schedule/schedule-post"

// export const useCreateAutomation = (id?: string) => {
//   const { isPending, mutate } = useMutationData(["create-automation"], () => createAutomations(id), "user-automations")

//   return { isPending, mutate }
// }

// export const useEditAutomation = (automationId: string) => {
//   const [edit, setEdit] = useState(false)
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const enableEdit = () => setEdit(true)
//   const disableEdit = () => setEdit(false)

//   const { isPending, mutate } = useMutationData(
//     ["update-automation"],
//     (data: { name: string }) => updateAutomationName(automationId, { name: data.name }),
//     "automation-info",
//     disableEdit,
//   )

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node | null)) {
//         if (inputRef.current.value !== "") {
//           mutate({ name: inputRef.current.value })
//         } else {
//           disableEdit()
//         }
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [mutate])

//   return {
//     edit,
//     enableEdit,
//     disableEdit,
//     inputRef,
//     isPending,
//   }
// }

// export const useListener = (id: string) => {
//   const [listener, setListener] = useState<"MESSAGE" | "SMARTAI" | null>(null)

//   const promptSchema = z.object({
//     prompt: z.string().min(1),
//     reply: z.string(),
//   })

//   const { isPending, mutate } = useMutationData(
//     ["create-listener"],
//     (data: { prompt: string; reply: string }) => saveListener(id, listener || "MESSAGE", data.prompt, data.reply),
//     "automation-info",
//   )

//   const { errors, onFormSubmit, register, reset, watch } = useZodForm(promptSchema, mutate)

//   const onSetListener = (type: "SMARTAI" | "MESSAGE") => setListener(type)
//   return { onSetListener, register, onFormSubmit, listener, isPending }
// }

// export const useTriggers = (id: string) => {
//   const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)

//   const dispatch: AppDispatch = useDispatch()

//   const onSetTrigger = (type: "COMMENT" | "DM") => dispatch(TRIGGER({ trigger: { type } }))

//   const { isPending, mutate } = useMutationData(
//     ["add-trigger"],
//     (data: { types: string[] }) => saveTrigger(id, data.types),
//     "automation-info",
//   )

//   const onSaveTrigger = () => mutate({ types })
//   return { types, onSetTrigger, onSaveTrigger, isPending }
// }

// export const useKeywords = (id: string) => {
//   const [keyword, setKeyword] = useState("")
//   const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

//   const { mutate } = useMutationData(
//     ["add-keyword"],
//     (data: { keyword: string }) => saveKeyword(id, data.keyword),
//     "automation-info",
//     () => setKeyword(""),
//   )

//   const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       mutate({ keyword })
//       setKeyword("")
//     }
//   }

//   const { mutate: deleteMutation } = useMutationData(
//     ["delete-keyword"],
//     (data: { id: string }) => deleteKeyword(data.id),
//     "automation-info",
//   )

//   const addKeyword = (newKeyword: string) => {
//     if (newKeyword.trim()) {
//       mutate({ keyword: newKeyword })
//     }
//   }

//   return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
// }

// export const useAutomationPosts = (id: string) => {
//   const [posts, setPosts] = useState<
//     {
//       postid: string
//       caption?: string
//       media: string
//       mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     }[]
//   >([])

//   // Add state for scheduled posts
//   const [scheduledPosts, setScheduledPosts] = useState<string[]>([])

//   const onSelectPost = (post: {
//     postid: string
//     caption?: string
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//   }) => {
//     setPosts((prevItems) => {
//       if (prevItems.find((p) => p.postid === post.postid)) {
//         return prevItems.filter((item) => item.postid !== post.postid)
//       } else {
//         return [...prevItems, post]
//       }
//     })
//   }

//   // Add function to handle scheduled post selection
//   const onSelectScheduledPost = (post: ScheduledPost) => {
//     // Ensure post.id exists before proceeding
//     if (!post.id) return

//     setScheduledPosts((prevItems) => {
//       if (prevItems.includes(post.id)) {
//         return prevItems.filter((item) => item !== post.id)
//       } else {
//         return [...prevItems, post.id]
//       }
//     })
//   }

//   const { mutate, isPending } = useMutationData(
//     ["attach-posts"],
//     async (data?: { posts?: typeof posts; scheduledPostIds?: string[] }) => {
//       // Use provided posts or current state
//       const postsToSave = data?.posts || posts

//       // Use provided scheduledPostIds or current state
//       const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

//       // Save published posts
//       const publishedResult = await savePosts(id, postsToSave)

//       // Always attempt to save scheduled posts, even if the array is empty
//       // This ensures the backend knows about the current state
//       await saveScheduledPosts(id, scheduledPostIdsToSave)

//       return publishedResult
//     },
//     "automation-info",
//     () => {
//       setPosts([])
//       setScheduledPosts([])
//     },
//   )

//   const { mutate: deleteMutation, isPending: isDeleting } = useMutationData(
//     ["delete-automation"],
//     async (data: { id: string }) => {
//       try {
//         const response = await deleteAutomation(data.id)
//         if (response.status !== 200) throw new Error("Failed to delete automation")
//         return response
//       } catch (err) {
//         console.error("Error deleting automation:", err)
//         throw err
//       }
//     },
//     "automation-info",
//   )

//   return {
//     posts,
//     onSelectPost,
//     scheduledPosts,
//     onSelectScheduledPost,
//     mutate,
//     isPending,
//     deleteMutation,
//     isDeleting,
//   }
// }






// "use client"

// import type React from "react"

// import { z } from "zod"
// import {
//   createAutomations,
//   deleteAutomation,
//   deleteKeyword,
//   saveKeyword,
//   saveListener,
//   savePosts,
//   saveScheduledPosts,
//   saveTrigger,
//   updateAutomationName,
// } from "@/actions/automations"
// import { useMutationData } from "./use-mutation-data"
// import { useEffect, useRef, useState } from "react"
// import useZodForm from "./use-zod-form"
// import { type AppDispatch, useAppSelector } from "@/redux/store"
// import { useDispatch } from "react-redux"
// import { TRIGGER } from "@/redux/slices/automation"
// import type { ScheduledPost } from "@/actions/schedule/schedule-post"
// import { useQueryClient } from "@tanstack/react-query"
// import { useToast } from "@/hooks/use-toast"

// export const useCreateAutomation = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   // Use the existing useMutationData hook but enhance it with optimistic updates
//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations",
//   )

//   // Create an enhanced mutate function with optimistic updates
//   const mutate = (variables: any, options?: any) => {
//     // Generate a temporary ID if none provided
//     const tempId = id || `temp-${Date.now()}`

//     // Get the current automations data
//     const currentData = queryClient.getQueryData(["user-automations"])

//     // Create an optimistic version of the new automation
//     const optimisticAutomation = {
//       ...variables,
//       id: tempId,
//       active: false,
//       keywords: variables.keywords || [],
//       listener: null,
//       _isOptimistic: true, // Flag to identify this is an optimistic update
//     }

//     // Optimistically update the query data
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       return {
//         ...old,
//         data: old?.data ? [optimisticAutomation, ...old.data] : [optimisticAutomation],
//       }
//     })

//     // Call the original mutate function
//     return originalMutate(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Remove the optimistic entry
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           return {
//             ...old,
//             data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Invalidate and refetch to get the real data
//         queryClient.invalidateQueries({ queryKey: ["user-automations"] })

//         // Show success toast
//         toast({
//           title: "Automation created",
//           description: "Your automation has been created successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Remove the optimistic entry on error
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           return {
//             ...old,
//             data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Show error toast
//         toast({
//           title: "Failed to create automation",
//           description: "There was an error creating your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// export const useEditAutomation = (automationId: string) => {
//   const [edit, setEdit] = useState(false)
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const enableEdit = () => setEdit(true)
//   const disableEdit = () => setEdit(false)

//   const { isPending, mutate } = useMutationData(
//     ["update-automation"],
//     (data: { name: string }) => updateAutomationName(automationId, { name: data.name }),
//     "automation-info",
//     disableEdit,
//   )

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node | null)) {
//         if (inputRef.current.value !== "") {
//           mutate({ name: inputRef.current.value })
//         } else {
//           disableEdit()
//         }
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [mutate])

//   return {
//     edit,
//     enableEdit,
//     disableEdit,
//     inputRef,
//     isPending,
//   }
// }

// export const useListener = (id: string) => {
//   const [listener, setListener] = useState<"MESSAGE" | "SMARTAI" | null>(null)

//   const promptSchema = z.object({
//     prompt: z.string().min(1),
//     reply: z.string(),
//   })

//   const { isPending, mutate } = useMutationData(
//     ["create-listener"],
//     (data: { prompt: string; reply: string }) => saveListener(id, listener || "MESSAGE", data.prompt, data.reply),
//     "automation-info",
//   )

//   const { errors, onFormSubmit, register, reset, watch } = useZodForm(promptSchema, mutate)

//   const onSetListener = (type: "SMARTAI" | "MESSAGE") => setListener(type)
//   return { onSetListener, register, onFormSubmit, listener, isPending }
// }

// export const useTriggers = (id: string) => {
//   const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)

//   const dispatch: AppDispatch = useDispatch()

//   const onSetTrigger = (type: "COMMENT" | "DM") => dispatch(TRIGGER({ trigger: { type } }))

//   const { isPending, mutate } = useMutationData(
//     ["add-trigger"],
//     (data: { types: string[] }) => saveTrigger(id, data.types),
//     "automation-info",
//   )

//   const onSaveTrigger = () => mutate({ types })
//   return { types, onSetTrigger, onSaveTrigger, isPending }
// }

// export const useKeywords = (id: string) => {
//   const [keyword, setKeyword] = useState("")
//   const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

//   const { mutate } = useMutationData(
//     ["add-keyword"],
//     (data: { keyword: string }) => saveKeyword(id, data.keyword),
//     "automation-info",
//     () => setKeyword(""),
//   )

//   const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       mutate({ keyword })
//       setKeyword("")
//     }
//   }

//   const { mutate: deleteMutation } = useMutationData(
//     ["delete-keyword"],
//     (data: { id: string }) => deleteKeyword(data.id),
//     "automation-info",
//   )

//   const addKeyword = (newKeyword: string) => {
//     if (newKeyword.trim()) {
//       mutate({ keyword: newKeyword })
//     }
//   }

//   return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
// }


// export const useAutomationPosts = (id: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()
//   const [posts, setPosts] = useState<
//     {
//       postid: string
//       caption?: string
//       media: string
//       mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     }[]
//   >([])

//   // Add state for scheduled posts
//   const [scheduledPosts, setScheduledPosts] = useState<string[]>([])

//   const onSelectPost = (post: {
//     postid: string
//     caption?: string
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//   }) => {
//     setPosts((prevItems) => {
//       if (prevItems.find((p) => p.postid === post.postid)) {
//         return prevItems.filter((item) => item.postid !== post.postid)
//       } else {
//         return [...prevItems, post]
//       }
//     })
//   }

//   // Add function to handle scheduled post selection
//   const onSelectScheduledPost = (post: ScheduledPost) => {
//     // Ensure post.id exists before proceeding
//     if (!post.id) return

//     setScheduledPosts((prevItems) => {
//       if (prevItems.includes(post.id)) {
//         return prevItems.filter((item) => item !== post.id)
//       } else {
//         return [...prevItems, post.id]
//       }
//     })
//   }

//   const { mutate, isPending } = useMutationData(
//     ["attach-posts"],
//     async (data?: { posts?: typeof posts; scheduledPostIds?: string[] }) => {
//       // Use provided posts or current state
//       const postsToSave = data?.posts || posts

//       // Use provided scheduledPostIds or current state
//       const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

//       // Save published posts
//       const publishedResult = await savePosts(id, postsToSave)

//       // Always attempt to save scheduled posts, even if the array is empty
//       // This ensures the backend knows about the current state
//       await saveScheduledPosts(id, scheduledPostIdsToSave)

//       return publishedResult
//     },
//     "automation-info",
//     () => {
//       setPosts([])
//       setScheduledPosts([])
//     },
//   )

//   // Enhanced delete mutation with optimistic updates
//   const { mutate: originalDeleteMutation, isPending: isDeleting } = useMutationData(
//     ["delete-automation"],
//     async (data: { id: string }) => {
//       try {
//         const response = await deleteAutomation(data.id)
//         if (response.status !== 200) throw new Error("Failed to delete automation")
//         return response
//       } catch (err) {
//         console.error("Error deleting automation:", err)
//         throw err
//       }
//     },
//     "automation-info",
//   )

//   // Create an enhanced delete mutation with optimistic updates
//   const deleteMutation = (variables: { id: string }, options?: any) => {
//     // Get the current automations data
//     const currentData = queryClient.getQueryData(["user-automations"])

//     // Optimistically update the query data by removing the automation
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       return {
//         ...old,
//         data: old?.data ? old.data.filter((automation: any) => automation.id !== variables.id) : [],
//       }
//     })

//     // Call the original delete mutation
//     return originalDeleteMutation(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Show success toast
//         toast({
//           title: "Automation deleted",
//           description: "Your automation has been deleted successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Revert the optimistic update on error
//         queryClient.setQueryData(["user-automations"], currentData)

//         // Show error toast
//         toast({
//           title: "Failed to delete automation",
//           description: "There was an error deleting your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return {
//     posts,
//     onSelectPost,
//     scheduledPosts,
//     onSelectScheduledPost,
//     mutate,
//     isPending,
//     deleteMutation,
//     isDeleting,
//   }
// }

//AS OF WED, LATEST RETURN TO THIS

// "use client"

// import type React from "react"

// import { z } from "zod"
// import {
//   createAutomations,
//   deleteAutomation,
//   deleteKeyword,
//   saveKeyword,
//   saveListener,
//   savePosts,
//   saveScheduledPosts,
//   saveTrigger,
//   updateAutomation,
// } from "@/actions/automations"
// import { useMutationData } from "./use-mutation-data"
// import { useEffect, useRef, useState } from "react"
// import useZodForm from "./use-zod-form"
// import { type AppDispatch, useAppSelector } from "@/redux/store"
// import { useDispatch } from "react-redux"
// import { TRIGGER } from "@/redux/slices/automation"
// import type { ScheduledPost } from "@/actions/schedule/schedule-post"
// import { useQueryClient } from "@tanstack/react-query"
// import { useToast } from "@/hooks/use-toast"

// export const useCreateAutomationE = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   // Use the existing useMutationData hook but enhance it with optimistic updates
//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations",
//   )

//   // Create an enhanced mutate function with optimistic updates
//   const mutate = (variables: any, options?: any) => {
//     // Generate a temporary ID if none provided
//     const tempId = id || `temp-${Date.now()}`

//     // Get the current automations data
//     const currentData = queryClient.getQueryData(["user-automations"])

//     // Create an optimistic version of the new automation
//     const optimisticAutomation = {
//       ...variables,
//       id: tempId,
//       active: false,
//       keywords: variables.keywords || [],
//       listener: null,
//       _isOptimistic: true, // Flag to identify this is an optimistic update
//     }

//     // Optimistically update the query data
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       return {
//         ...old,
//         data: old?.data ? [optimisticAutomation, ...old.data] : [optimisticAutomation],
//       }
//     })

//     // Call the original mutate function
//     return originalMutate(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Remove the optimistic entry
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           return {
//             ...old,
//             data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Invalidate and refetch to get the real data
//         queryClient.invalidateQueries({ queryKey: ["user-automations"] })

//         // Show success toast
//         toast({
//           title: "Automation created",
//           description: "Your automation has been created successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Remove the optimistic entry on error
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           return {
//             ...old,
//             data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Show error toast
//         toast({
//           title: "Failed to create automation",
//           description: "There was an error creating your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// export const useCreateAutomation = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   // Use the existing useMutationData hook but enhance it with optimistic updates
//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations", // This should match your query key
//   )

//   // Create an enhanced mutate function with optimistic updates
//   const mutate = (variables: any, options?: any) => {
//     // Generate a temporary ID if none provided
//     const tempId = id || `temp-${Date.now()}`

//     // Create an optimistic version of the new automation
//     const optimisticAutomation = {
//       ...variables,
//       id: tempId,
//       active: false,
//       keywords: variables.keywords || [],
//       listener: null,
//       _isOptimistic: true, // Flag to identify this is an optimistic update
//     }

//     // Optimistically update the query data - use the correct query key
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       if (!old) {
//         return {
//           data: [optimisticAutomation],
//           status: 200,
//         }
//       }
      
//       return {
//         ...old,
//         data: [optimisticAutomation, ...(old.data || [])],
//       }
//     })

//     // Call the original mutate function
//     return originalMutate(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Remove the optimistic entry first
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           if (!old) return old
//           return {
//             ...old,
//             data: old.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Add the real automation data
//         if (data?.data) {
//           queryClient.setQueryData(["user-automations"], (old: any) => {
//             if (!old) {
//               return {
//                 data: [data.data],
//                 status: 200,
//               }
//             }
            
//             // Check if the automation already exists to avoid duplicates
//             const existingIds = old.data?.map((item: any) => item.id) || []
//             const newAutomation = Array.isArray(data.data) ? data.data[0] : data.data
            
//             if (!existingIds.includes(newAutomation.id)) {
//               return {
//                 ...old,
//                 data: [newAutomation, ...(old.data || [])],
//               }
//             }
            
//             return old
//           })
//         }

//         // Show success toast
//         toast({
//           title: "Automation created",
//           description: "Your automation has been created successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Remove the optimistic entry on error
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           if (!old) return old
//           return {
//             ...old,
//             data: old.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Show error toast
//         toast({
//           title: "Failed to create automation",
//           description: "There was an error creating your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// export const useEditAutomation = (automationId: string) => {
//   const [edit, setEdit] = useState(false)
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const enableEdit = () => setEdit(true)
//   const disableEdit = () => setEdit(false)

//   const { isPending, mutate } = useMutationData(
//     ["update-automation"],
//     (data: { name: string }) => updateAutomation(automationId, { name: data.name }),
//     "automation-info",
//     disableEdit,
//   )

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node | null)) {
//         if (inputRef.current.value !== "") {
//           mutate({ name: inputRef.current.value })
//         } else {
//           disableEdit()
//         }
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [mutate])

//   return {
//     edit,
//     enableEdit,
//     disableEdit,
//     inputRef,
//     isPending,
//   }
// }

// export const useListener = (id: string) => {
//   const [listener, setListener] = useState<"MESSAGE" | "SMARTAI" | null>(null)

//   const promptSchema = z.object({
//     prompt: z.string().min(1),
//     reply: z.string(),
//   })

//   const { isPending, mutate } = useMutationData(
//     ["create-listener"],
//     (data: { prompt: string; reply: string }) => saveListener(id, listener || "MESSAGE", data.prompt, data.reply),
//     "automation-info",
//   )

//   const { errors, onFormSubmit, register, reset, watch } = useZodForm(promptSchema, mutate)

//   const onSetListener = (type: "SMARTAI" | "MESSAGE") => setListener(type)
//   return { onSetListener, register, onFormSubmit, listener, isPending }
// }

// export const useTriggers = (id: string) => {
//   const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)
//   const dispatch: AppDispatch = useDispatch()
//   const onSetTrigger = (type: "COMMENT" | "DM") => dispatch(TRIGGER({ trigger: { type } }))

//   // Updated to accept fallback automation parameters
//   const { isPending, mutate } = useMutationData(
//     ["add-trigger"],
//     (data: { 
//       types: string[]; 
//       isFallback?: boolean; 
//       fallbackMessage?: string; 
//       buttons?: { name: string; payload: string }[] 
//     }) => saveTrigger(id, data),
//     "automation-info",
//   )

//   // Updated to accept fallback parameters
//   const onSaveTrigger = (data?: { 
//     isFallback?: boolean; 
//     fallbackMessage?: string; 
//     buttons?: { name: string; payload: string }[] 
//   }) => mutate({ types, ...data })
  
//   return { types, onSetTrigger, onSaveTrigger, isPending }
// }

// export const useKeywords = (id: string) => {
//   const [keyword, setKeyword] = useState("")
//   const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

//   const { mutate } = useMutationData(
//     ["add-keyword"],
//     (data: { keyword: string }) => saveKeyword(id, data.keyword),
//     "automation-info",
//     () => setKeyword(""),
//   )

//   const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       mutate({ keyword })
//       setKeyword("")
//     }
//   }

//   const { mutate: deleteMutation } = useMutationData(
//     ["delete-keyword"],
//     (data: { id: string }) => deleteKeyword(data.id),
//     "automation-info",
//   )

//   const addKeyword = (newKeyword: string) => {
//     if (newKeyword.trim()) {
//       mutate({ keyword: newKeyword })
//     }
//   }

//   return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
// }


// export const useAutomationPosts = (id: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()
//   const [posts, setPosts] = useState<
//     {
//       postid: string
//       caption?: string
//       media: string
//       mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     }[]
//   >([])

//   // Add state for scheduled posts
//   const [scheduledPosts, setScheduledPosts] = useState<string[]>([])

//   const onSelectPost = (post: {
//     postid: string
//     caption?: string
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//   }) => {
//     setPosts((prevItems) => {
//       if (prevItems.find((p) => p.postid === post.postid)) {
//         return prevItems.filter((item) => item.postid !== post.postid)
//       } else {
//         return [...prevItems, post]
//       }
//     })
//   }

//   // Add function to handle scheduled post selection
//   const onSelectScheduledPost = (post: ScheduledPost) => {
//     // Ensure post.id exists before proceeding
//     if (!post.id) return

//     setScheduledPosts((prevItems) => {
//       if (prevItems.includes(post.id)) {
//         return prevItems.filter((item) => item !== post.id)
//       } else {
//         return [...prevItems, post.id]
//       }
//     })
//   }

//   const { mutate, isPending } = useMutationData(
//     ["attach-posts"],
//     async (data?: { posts?: typeof posts; scheduledPostIds?: string[] }) => {
//       // Use provided posts or current state
//       const postsToSave = data?.posts || posts

//       // Use provided scheduledPostIds or current state
//       const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

//       // Save published posts
//       const publishedResult = await savePosts(id, postsToSave)

//       // Always attempt to save scheduled posts, even if the array is empty
//       // This ensures the backend knows about the current state
//       await saveScheduledPosts(id, scheduledPostIdsToSave)

//       return publishedResult
//     },
//     "automation-info",
//     () => {
//       setPosts([])
//       setScheduledPosts([])
//     },
//   )

//   // Enhanced delete mutation with optimistic updates
//   const { mutate: originalDeleteMutation, isPending: isDeleting } = useMutationData(
//     ["delete-automation"],
//     async (data: { id: string }) => {
//       try {
//         const response = await deleteAutomation(data.id)
//         if (response.status !== 200) throw new Error("Failed to delete automation")
//         return response
//       } catch (err) {
//         console.error("Error deleting automation:", err)
//         throw err
//       }
//     },
//     "automation-info",
//   )

//   // Create an enhanced delete mutation with optimistic updates
//   const deleteMutation = (variables: { id: string }, options?: any) => {
//     // Get the current automations data
//     const currentData = queryClient.getQueryData(["user-automations"])

//     // Optimistically update the query data by removing the automation
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       return {
//         ...old,
//         data: old?.data ? old.data.filter((automation: any) => automation.id !== variables.id) : [],
//       }
//     })

//     // Call the original delete mutation
//     return originalDeleteMutation(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Show success toast
//         toast({
//           title: "Automation deleted",
//           description: "Your automation has been deleted successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Revert the optimistic update on error
//         queryClient.setQueryData(["user-automations"], currentData)

//         // Show error toast
//         toast({
//           title: "Failed to delete automation",
//           description: "There was an error deleting your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return {
//     posts,
//     onSelectPost,
//     scheduledPosts,
//     onSelectScheduledPost,
//     mutate,
//     isPending,
//     deleteMutation,
//     isDeleting,
//   }
// }

//LATEST AS OF THE 100
// "use client"

// import type React from "react"

// import { z } from "zod"
// import {
//   createAutomations,
//   deleteAutomation,
//   deleteKeyword,
//   saveKeyword,
//   saveListener,
//   savePosts,
//   saveScheduledPosts,
//   saveTrigger,
//   updateAutomation,
// } from "@/actions/automations"
// import { useMutationData } from "./use-mutation-data"
// import { useEffect, useRef, useState } from "react"
// import useZodForm from "./use-zod-form"
// import { type AppDispatch, useAppSelector } from "@/redux/store"
// import { useDispatch } from "react-redux"
// import { TRIGGER } from "@/redux/slices/automation"
// import type { ScheduledPost } from "@/actions/schedule/schedule-post"
// import { useQueryClient } from "@tanstack/react-query"
// import { useToast } from "@/hooks/use-toast"

// // Simplified version of useCreateAutomation without complex optimistic updates
// export const useCreateAutomation = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations",
//   )

//   const mutate = (variables: any, options?: any) => {
//     // Clean the variables to ensure no problematic data types
//     const cleanVariables = {
//       name: variables.name || "Untitled",
//       keywords: variables.keywords || [],
//       active: variables.active || false,
//       listener: variables.listener || null,
//       // Don't include createdAt - let backend handle it
//       // Don't include id if it's a temp id
//     }

//     console.log("Creating automation with data:", cleanVariables)

//     return originalMutate(cleanVariables, {
//       ...options,
//       onSuccess: (data: any) => {
//         console.log("Automation creation success:", data)
        
//         // Invalidate and refetch queries to get fresh data
//         queryClient.invalidateQueries({ queryKey: ["user-automations"] })

//         toast({
//           title: "Automation created",
//           description: "Your automation has been created successfully.",
//           variant: "default",
//         })

//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         console.error("Automation creation error:", error)
        
//         toast({
//           title: "Failed to create automation",
//           description: "There was an error creating your automation. Please try again.",
//           variant: "destructive",
//         })

//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// // Keep the original complex version as backup
// export const useCreateAutomationComplex = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations",
//   )

//   const mutate = (variables: any, options?: any) => {
//     const tempId = id || `temp-${Date.now()}`

//     const optimisticAutomation = {
//       ...variables,
//       id: tempId,
//       active: false,
//       keywords: variables.keywords || [],
//       listener: null,
//       _isOptimistic: true,
//     }

//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       if (!old) {
//         return {
//           data: [optimisticAutomation],
//           status: 200,
//         }
//       }
      
//       return {
//         ...old,
//         data: [optimisticAutomation, ...(old.data || [])],
//       }
//     })

//     return originalMutate(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           if (!old) return old
//           return {
//             ...old,
//             data: old.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         if (data?.data) {
//           queryClient.setQueryData(["user-automations"], (old: any) => {
//             if (!old) {
//               return {
//                 data: [data.data],
//                 status: 200,
//               }
//             }
            
//             const existingIds = old.data?.map((item: any) => item.id) || []
//             const newAutomation = Array.isArray(data.data) ? data.data[0] : data.data
            
//             if (!existingIds.includes(newAutomation.id)) {
//               return {
//                 ...old,
//                 data: [newAutomation, ...(old.data || [])],
//               }
//             }
            
//             return old
//           })
//         }

//         toast({
//           title: "Automation created",
//           description: "Your automation has been created successfully.",
//           variant: "default",
//         })

//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           if (!old) return old
//           return {
//             ...old,
//             data: old.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         toast({
//           title: "Failed to create automation",
//           description: "There was an error creating your automation. Please try again.",
//           variant: "destructive",
//         })

//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// export const useEditAutomation = (automationId: string) => {
//   const [edit, setEdit] = useState(false)
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const enableEdit = () => setEdit(true)
//   const disableEdit = () => setEdit(false)

//   const { isPending, mutate } = useMutationData(
//     ["update-automation"],
//     (data: { name: string }) => updateAutomation(automationId, { name: data.name }),
//     "automation-info",
//     disableEdit,
//   )

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node | null)) {
//         if (inputRef.current.value !== "") {
//           mutate({ name: inputRef.current.value })
//         } else {
//           disableEdit()
//         }
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [mutate])

//   return {
//     edit,
//     enableEdit,
//     disableEdit,
//     inputRef,
//     isPending,
//   }
// }

// export const useListener = (id: string) => {
//   const [listener, setListener] = useState<"MESSAGE" | "SMARTAI" | null>(null)

//   const promptSchema = z.object({
//     prompt: z.string().min(1),
//     reply: z.string(),
//   })

//   const { isPending, mutate } = useMutationData(
//     ["create-listener"],
//     (data: { prompt: string; reply: string }) => saveListener(id, listener || "MESSAGE", data.prompt, data.reply),
//     "automation-info",
//   )

//   const { errors, onFormSubmit, register, reset, watch } = useZodForm(promptSchema, mutate)

//   const onSetListener = (type: "SMARTAI" | "MESSAGE") => setListener(type)
//   return { onSetListener, register, onFormSubmit, listener, isPending }
// }

// export const useTriggers = (id: string) => {
//   const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)
//   const dispatch: AppDispatch = useDispatch()
//   const onSetTrigger = (type: "COMMENT" | "DM") => dispatch(TRIGGER({ trigger: { type } }))

//   const { isPending, mutate } = useMutationData(
//     ["add-trigger"],
//     (data: { 
//       types: string[]; 
//       isFallback?: boolean; 
//       fallbackMessage?: string; 
//       buttons?: { name: string; payload: string }[] ;

//       listenMode?: "KEYWORDS" | "ALL_MESSAGES"; // Add this
//       keywords?: string[]; // Add this
//     }) => saveTrigger(id, data),
//     "automation-info",
//   )

//   const onSaveTrigger = (data?: { 
//     isFallback?: boolean; 
//     fallbackMessage?: string; 
//     buttons?: { name: string; payload: string }[];

//     listenMode?: "KEYWORDS" | "ALL_MESSAGES"; // Add this
//     keywords?: string[]; // Add this
//   }) => mutate({ types, ...data })
  
//   return { types, onSetTrigger, onSaveTrigger, isPending }
// }



// export const useKeywords = (id: string) => {
//   const [keyword, setKeyword] = useState("")
//   const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

//   const { mutate } = useMutationData(
//     ["add-keyword"],
//     (data: { keyword: string }) => saveKeyword(id, data.keyword),
//     "automation-info",
//     () => setKeyword(""),
//   )

//   const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       mutate({ keyword })
//       setKeyword("")
//     }
//   }

//   const { mutate: deleteMutation } = useMutationData(
//     ["delete-keyword"],
//     (data: { id: string }) => deleteKeyword(data.id),
//     "automation-info",
//   )

//   const addKeyword = (newKeyword: string) => {
//     if (newKeyword.trim()) {
//       mutate({ keyword: newKeyword })
//     }
//   }

//   return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
// }

// export const useAutomationPosts = (id: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()
//   const [posts, setPosts] = useState<
//     {
//       postid: string
//       caption?: string
//       media: string
//       mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     }[]
//   >([])

//   const [scheduledPosts, setScheduledPosts] = useState<string[]>([])

//   const onSelectPost = (post: {
//     postid: string
//     caption?: string
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//   }) => {
//     setPosts((prevItems) => {
//       if (prevItems.find((p) => p.postid === post.postid)) {
//         return prevItems.filter((item) => item.postid !== post.postid)
//       } else {
//         return [...prevItems, post]
//       }
//     })
//   }

//   const onSelectScheduledPost = (post: ScheduledPost) => {
//     if (!post.id) return

//     setScheduledPosts((prevItems) => {
//       if (prevItems.includes(post.id)) {
//         return prevItems.filter((item) => item !== post.id)
//       } else {
//         return [...prevItems, post.id]
//       }
//     })
//   }

//   const { mutate, isPending } = useMutationData(
//     ["attach-posts"],
//     async (data?: { posts?: typeof posts; scheduledPostIds?: string[] }) => {
//       const postsToSave = data?.posts || posts
//       const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

//       const publishedResult = await savePosts(id, postsToSave)
//       await saveScheduledPosts(id, scheduledPostIdsToSave)

//       return publishedResult
//     },
//     "automation-info",
//     () => {
//       setPosts([])
//       setScheduledPosts([])
//     },
//   )

//   // Simplified delete mutation without complex optimistic updates
//   const { mutate: originalDeleteMutation, isPending: isDeleting } = useMutationData(
//     ["delete-automation"],
//     async (data: { id: string }) => {
//       try {
//         const response = await deleteAutomation(data.id)
//         if (response.status !== 200) throw new Error("Failed to delete automation")
//         return response
//       } catch (err) {
//         console.error("Error deleting automation:", err)
//         throw err
//       }
//     },
//     "user-automations", // Changed to user-automations to match the list
//     () => {
//       // This onSuccess callback will be called after the mutation succeeds
//       toast({
//         title: "Automation deleted",
//         description: "Your automation has been deleted successfully.",
//         variant: "default",
//       })
//     }
//   )

//   // Create a wrapper function to handle additional logic
//   const deleteMutation = (variables: { id: string }, options?: any) => {
//     return originalDeleteMutation(variables, {
//       ...options,
//       onError: (error: any) => {
//         toast({
//           title: "Failed to delete automation",
//           description: "There was an error deleting your automation. Please try again.",
//           variant: "destructive",
//         })

//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return {
//     posts,
//     onSelectPost,
//     scheduledPosts,
//     onSelectScheduledPost,
//     mutate,
//     isPending,
//     deleteMutation,
//     isDeleting,
//   }
// }


"use client"

import type React from "react"
import { z } from "zod"
import {
  createAutomations,
  deleteKeyword,
  saveKeyword,
  saveListener,
  savePosts,
  saveScheduledPosts,
  saveTrigger,
  updateAutomation,
  permanentlyDeleteAutomation, // Import permanent delete action
} from "@/actions/automations"
import { moveToTrash } from "@/actions/automations/trash-actions"
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

  const { isPending, mutate: originalMutate } = useMutationData(
    ["create-automation"],
    () => createAutomations(id),
    "user-automations",
  )

  const mutate = (variables: any, options?: any) => {
    const cleanVariables = {
      name: variables.name || "Untitled",
      keywords: variables.keywords || [],
      active: variables.active || false,
      listener: variables.listener || null,
    }

    return originalMutate(cleanVariables, {
      ...options,
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["user-automations"] })

        toast({
          title: "Automation created",
          description: "Your automation has been created successfully.",
          variant: "default",
        })

        if (options?.onSuccess) {
          options.onSuccess(data)
        }
      },
      onError: (error: any) => {
        toast({
          title: "Failed to create automation",
          description: "There was an error creating your automation. Please try again.",
          variant: "destructive",
        })

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
    (data: { name: string }) => updateAutomation(automationId, { name: data.name }),
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
    (data: {
      types: string[]
      isFallback?: boolean
      fallbackMessage?: string
      buttons?: { name: string; payload: string }[]
      listenMode?: "KEYWORDS" | "ALL_MESSAGES"
      keywords?: string[]
    }) => saveTrigger(id, data),
    "automation-info",
  )

  const onSaveTrigger = (data?: {
    isFallback?: boolean
    fallbackMessage?: string
    buttons?: { name: string; payload: string }[]
    listenMode?: "KEYWORDS" | "ALL_MESSAGES"
    keywords?: string[]
  }) => mutate({ types, ...data })

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
      if (keyword.trim()) {
        mutate({ keyword: keyword.trim().toLowerCase() })
        setKeyword("")
      }
    }
  }

  const { mutate: deleteMutation } = useMutationData(
    ["delete-keyword"],
    (data: { id: string }) => deleteKeyword(data.id),
    "automation-info",
  )

  const addKeyword = (newKeyword: string) => {
    if (newKeyword.trim()) {
      mutate({ keyword: newKeyword.trim().toLowerCase() })
    }
  }

  return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
}



export const useKeywordsORIGINAL = (id: string) => {
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

  const onSelectScheduledPost = (post: ScheduledPost) => {
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
      const postsToSave = data?.posts || posts
      const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

      const publishedResult = await savePosts(id, postsToSave)
      await saveScheduledPosts(id, scheduledPostIdsToSave)

      return publishedResult
    },
    "automation-info",
    () => {
      setPosts([])
      setScheduledPosts([])
    },
  )

  const { mutate: originalDeleteMutation, isPending: isDeleting } = useMutationData(
    ["move-to-trash"],
    async (data: { id: string }) => {
      const response = await moveToTrash(data.id)
      if (response.status !== 200) throw new Error("Failed to move automation to trash")
      return response
    },
    "user-automations",
  )

  const deleteMutation = (variables: { id: string }, options?: any) => {
    const currentData = queryClient.getQueryData(["user-automations"])

    queryClient.setQueryData(["user-automations"], (old: any) => {
      if (!old) return old
      return {
        ...old,
        data: old.data ? old.data.filter((automation: any) => automation.id !== variables.id) : [],
      }
    })

    return originalDeleteMutation(variables, {
      ...options,
      onSuccess: (data: any) => {
        toast({
          title: "Moved to trash",
          description: "Automation moved to trash successfully. You can restore it from the trash page.",
          variant: "default",
        })

        if (options?.onSuccess) {
          options.onSuccess(data)
        }
      },
      onError: (error: any) => {
        queryClient.setQueryData(["user-automations"], currentData)

        toast({
          title: "Failed to move to trash",
          description: "There was an error moving your automation to trash. Please try again.",
          variant: "destructive",
        })

        if (options?.onError) {
          options.onError(error)
        }
      },
    })
  }

  const { mutate: originalPermanentDeleteMutation, isPending: isPermanentlyDeleting } = useMutationData(
    ["permanently-delete-automation"],
    async (data: { id: string }) => {
      const response = await permanentlyDeleteAutomation(data.id)
      if (response.status !== 200) throw new Error("Failed to permanently delete automation")
      return response
    },
    "user-automations",
  )

  const permanentDeleteMutation = (variables: { id: string }, options?: any) => {
    const currentData = queryClient.getQueryData(["user-automations"])

    queryClient.setQueryData(["user-automations"], (old: any) => {
      if (!old) return old
      return {
        ...old,
        data: old.data ? old.data.filter((automation: any) => automation.id !== variables.id) : [],
      }
    })

    return originalPermanentDeleteMutation(variables, {
      ...options,
      onSuccess: (data: any) => {
        toast({
          title: "Permanently deleted",
          description: "Automation has been permanently deleted.",
          variant: "default",
        })

        if (options?.onSuccess) {
          options.onSuccess(data)
        }
      },
      onError: (error: any) => {
        queryClient.setQueryData(["user-automations"], currentData)

        toast({
          title: "Failed to delete",
          description: "There was an error deleting your automation. Please try again.",
          variant: "destructive",
        })

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
    permanentDeleteMutation,
    isPermanentlyDeleting,
  }
}







// "use client"

// import type React from "react"

// import { z } from "zod"
// import {
//   createAutomations,
//   deleteAutomation,
//   deleteKeyword,
//   saveKeyword,
//   saveListener,
//   savePosts,
//   saveScheduledPosts,
//   saveTrigger,
//   updateAutomation,
// } from "@/actions/automations"
// import { useMutationData } from "./use-mutation-data"
// import { useEffect, useRef, useState } from "react"
// import useZodForm from "./use-zod-form"
// import { type AppDispatch, useAppSelector } from "@/redux/store"
// import { useDispatch } from "react-redux"
// import { TRIGGER } from "@/redux/slices/automation"
// import type { ScheduledPost } from "@/actions/schedule/schedule-post"
// import { useQueryClient } from "@tanstack/react-query"
// import { useToast } from "@/hooks/use-toast"

// export const useCreateAutomationE = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   // Use the existing useMutationData hook but enhance it with optimistic updates
//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations",
//   )

//   // Create an enhanced mutate function with optimistic updates
//   const mutate = (variables: any, options?: any) => {
//     // Generate a temporary ID if none provided
//     const tempId = id || `temp-${Date.now()}`

//     // Get the current automations data
//     const currentData = queryClient.getQueryData(["user-automations"])

//     // Create an optimistic version of the new automation
//     const optimisticAutomation = {
//       ...variables,
//       id: tempId,
//       active: false,
//       keywords: variables.keywords || [],
//       listener: null,
//       _isOptimistic: true, // Flag to identify this is an optimistic update
//     }

//     // Optimistically update the query data
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       return {
//         ...old,
//         data: old?.data ? [optimisticAutomation, ...old.data] : [optimisticAutomation],
//       }
//     })

//     // Call the original mutate function
//     return originalMutate(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Remove the optimistic entry
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           return {
//             ...old,
//             data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Invalidate and refetch to get the real data
//         queryClient.invalidateQueries({ queryKey: ["user-automations"] })

//         // Show success toast
//         toast({
//           title: "Automation created",
//           description: "Your automation has been created successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Remove the optimistic entry on error
//         queryClient.setQueryData(["user-automations"], (old: any) => {
//           return {
//             ...old,
//             data: old?.data ? old.data.filter((item: any) => item.id !== tempId) : [],
//           }
//         })

//         // Show error toast
//         toast({
//           title: "Failed to create automation",
//           description: "There was an error creating your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// // SIMPLIFIED VERSION - Only this part is modified
// export const useCreateAutomation = (id?: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   const { isPending, mutate: originalMutate } = useMutationData(
//     ["create-automation"],
//     () => createAutomations(id),
//     "user-automations"
//   )

//   const mutate = (variables: any = {}, options?: any) => {
//     // Don't pass complex data - let the backend handle defaults
//     return originalMutate({}, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Simply invalidate and refetch - no complex optimistic updates
//         queryClient.invalidateQueries({ queryKey: ["user-automations"] })
        
//         // Show success toast
//         toast({
//           title: "Success",
//           description: "Automation created successfully!",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Show error toast
//         toast({
//           title: "Error",
//           description: "Failed to create automation. Please try again.",
//           variant: "destructive",
//         })

//         console.error("Create automation error:", error)

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return { isPending, mutate }
// }

// // ALL OTHER FUNCTIONS REMAIN EXACTLY THE SAME
// export const useEditAutomation = (automationId: string) => {
//   const [edit, setEdit] = useState(false)
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const enableEdit = () => setEdit(true)
//   const disableEdit = () => setEdit(false)

//   const { isPending, mutate } = useMutationData(
//     ["update-automation"],
//     (data: { name: string }) => updateAutomation(automationId, { name: data.name }),
//     "automation-info",
//     disableEdit,
//   )

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node | null)) {
//         if (inputRef.current.value !== "") {
//           mutate({ name: inputRef.current.value })
//         } else {
//           disableEdit()
//         }
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [mutate])

//   return {
//     edit,
//     enableEdit,
//     disableEdit,
//     inputRef,
//     isPending,
//   }
// }

// export const useListener = (id: string) => {
//   const [listener, setListener] = useState<"MESSAGE" | "SMARTAI" | null>(null)

//   const promptSchema = z.object({
//     prompt: z.string().min(1),
//     reply: z.string(),
//   })

//   const { isPending, mutate } = useMutationData(
//     ["create-listener"],
//     (data: { prompt: string; reply: string }) => saveListener(id, listener || "MESSAGE", data.prompt, data.reply),
//     "automation-info",
//   )

//   const { errors, onFormSubmit, register, reset, watch } = useZodForm(promptSchema, mutate)

//   const onSetListener = (type: "SMARTAI" | "MESSAGE") => setListener(type)
//   return { onSetListener, register, onFormSubmit, listener, isPending }
// }

// export const useTriggers = (id: string) => {
//   const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)
//   const dispatch: AppDispatch = useDispatch()
//   const onSetTrigger = (type: "COMMENT" | "DM") => dispatch(TRIGGER({ trigger: { type } }))

//   // Updated to accept fallback automation parameters
//   const { isPending, mutate } = useMutationData(
//     ["add-trigger"],
//     (data: { 
//       types: string[]; 
//       isFallback?: boolean; 
//       fallbackMessage?: string; 
//       buttons?: { name: string; payload: string }[] 
//     }) => saveTrigger(id, data),
//     "automation-info",
//   )

//   // Updated to accept fallback parameters
//   const onSaveTrigger = (data?: { 
//     isFallback?: boolean; 
//     fallbackMessage?: string; 
//     buttons?: { name: string; payload: string }[] 
//   }) => mutate({ types, ...data })
  
//   return { types, onSetTrigger, onSaveTrigger, isPending }
// }

// export const useKeywords = (id: string) => {
//   const [keyword, setKeyword] = useState("")
//   const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

//   const { mutate } = useMutationData(
//     ["add-keyword"],
//     (data: { keyword: string }) => saveKeyword(id, data.keyword),
//     "automation-info",
//     () => setKeyword(""),
//   )

//   const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       mutate({ keyword })
//       setKeyword("")
//     }
//   }

//   const { mutate: deleteMutation } = useMutationData(
//     ["delete-keyword"],
//     (data: { id: string }) => deleteKeyword(data.id),
//     "automation-info",
//   )

//   const addKeyword = (newKeyword: string) => {
//     if (newKeyword.trim()) {
//       mutate({ keyword: newKeyword })
//     }
//   }

//   return { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword }
// }


// export const useAutomationPosts = (id: string) => {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()
//   const [posts, setPosts] = useState<
//     {
//       postid: string
//       caption?: string
//       media: string
//       mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     }[]
//   >([])

//   // Add state for scheduled posts
//   const [scheduledPosts, setScheduledPosts] = useState<string[]>([])

//   const onSelectPost = (post: {
//     postid: string
//     caption?: string
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//   }) => {
//     setPosts((prevItems) => {
//       if (prevItems.find((p) => p.postid === post.postid)) {
//         return prevItems.filter((item) => item.postid !== post.postid)
//       } else {
//         return [...prevItems, post]
//       }
//     })
//   }

//   // Add function to handle scheduled post selection
//   const onSelectScheduledPost = (post: ScheduledPost) => {
//     // Ensure post.id exists before proceeding
//     if (!post.id) return

//     setScheduledPosts((prevItems) => {
//       if (prevItems.includes(post.id)) {
//         return prevItems.filter((item) => item !== post.id)
//       } else {
//         return [...prevItems, post.id]
//       }
//     })
//   }

//   const { mutate, isPending } = useMutationData(
//     ["attach-posts"],
//     async (data?: { posts?: typeof posts; scheduledPostIds?: string[] }) => {
//       // Use provided posts or current state
//       const postsToSave = data?.posts || posts

//       // Use provided scheduledPostIds or current state
//       const scheduledPostIdsToSave = data?.scheduledPostIds || scheduledPosts

//       // Save published posts
//       const publishedResult = await savePosts(id, postsToSave)

//       // Always attempt to save scheduled posts, even if the array is empty
//       // This ensures the backend knows about the current state
//       await saveScheduledPosts(id, scheduledPostIdsToSave)

//       return publishedResult
//     },
//     "automation-info",
//     () => {
//       setPosts([])
//       setScheduledPosts([])
//     },
//   )

//   // Enhanced delete mutation with optimistic updates
//   const { mutate: originalDeleteMutation, isPending: isDeleting } = useMutationData(
//     ["delete-automation"],
//     async (data: { id: string }) => {
//       try {
//         const response = await deleteAutomation(data.id)
//         if (response.status !== 200) throw new Error("Failed to delete automation")
//         return response
//       } catch (err) {
//         console.error("Error deleting automation:", err)
//         throw err
//       }
//     },
//     "automation-info",
//   )

//   // Create an enhanced delete mutation with optimistic updates
//   const deleteMutation = (variables: { id: string }, options?: any) => {
//     // Get the current automations data
//     const currentData = queryClient.getQueryData(["user-automations"])

//     // Optimistically update the query data by removing the automation
//     queryClient.setQueryData(["user-automations"], (old: any) => {
//       return {
//         ...old,
//         data: old?.data ? old.data.filter((automation: any) => automation.id !== variables.id) : [],
//       }
//     })

//     // Call the original delete mutation
//     return originalDeleteMutation(variables, {
//       ...options,
//       onSuccess: (data: any) => {
//         // Show success toast
//         toast({
//           title: "Automation deleted",
//           description: "Your automation has been deleted successfully.",
//           variant: "default",
//         })

//         // Call the original onSuccess if provided
//         if (options?.onSuccess) {
//           options.onSuccess(data)
//         }
//       },
//       onError: (error: any) => {
//         // Revert the optimistic update on error
//         queryClient.setQueryData(["user-automations"], currentData)

//         // Show error toast
//         toast({
//           title: "Failed to delete automation",
//           description: "There was an error deleting your automation. Please try again.",
//           variant: "destructive",
//         })

//         // Call the original onError if provided
//         if (options?.onError) {
//           options.onError(error)
//         }
//       },
//     })
//   }

//   return {
//     posts,
//     onSelectPost,
//     scheduledPosts,
//     onSelectScheduledPost,
//     mutate,
//     isPending,
//     deleteMutation,
//     isDeleting,
//   }
// }