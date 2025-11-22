// import {
//   MutationFunction,
//   MutationKey,
//   useMutation,
//   useMutationState,
//   useQueryClient,
// } from '@tanstack/react-query'
// import { toast } from 'sonner'

// export const useMutationData = (
//   mutationKey: MutationKey,
//   mutationFn: MutationFunction<any, any>,
//   queryKey?: string,
//   onSuccess?: () => void
// ) => {
//   const client = useQueryClient()
//   const { mutate, isPending } = useMutation({
//     mutationKey,
//     mutationFn,
//     onSuccess: (data) => {
//       if (onSuccess) onSuccess()
//       return toast(data?.status === 200 ? 'Success' : 'Error', {
//         description: data.data,
//       })
//     },
//     onSettled: async () => {
//       await client.invalidateQueries({ queryKey: [queryKey] })
//     },
//   })

//   return { mutate, isPending }
// }

// export const useMutationDataState = (mutationKey: MutationKey) => {
//   const data = useMutationState({
//     filters: { mutationKey },
//     select: (mutation) => {
//       return {
//         variables: mutation.state.variables as any,
//         status: mutation.state.status,
//       }
//     },
//   })

//   const latestVariable = data[data.length - 1]
//   return { latestVariable }
// }




// import {
//   type MutationFunction,
//   type MutationKey,
//   useMutation,
//   useMutationState,
//   useQueryClient,
// } from "@tanstack/react-query"
// import { toast } from "sonner"

// export const useMutationData = (
//   mutationKey: MutationKey,
//   mutationFn: MutationFunction<any, any>,
//   queryKey?: string,
//   onSuccess?: () => void,
// ) => {
//   const client = useQueryClient()
//   const { mutate, isPending } = useMutation({
//     mutationKey,
//     mutationFn,
//     onSuccess: (data) => {
//       if (onSuccess) onSuccess()
//       return toast(data?.status === 200 ? "Success" : "Error", {
//         description: data.data,
//       })
//     },
//     onSettled: async () => {
//       await client.invalidateQueries({ queryKey: [queryKey] })
//     },
//   })

//   return { mutate, isPending }
// }

// export const useMutationDataState = (mutationKey: MutationKey) => {
//   const data = useMutationState({
//     filters: { mutationKey },
//     select: (mutation) => {
//       return {
//         variables: mutation.state.variables as any,
//         status: mutation.state.status,
//       }
//     },
//   })

//   const latestVariable = data[data.length - 1]
//   return { latestVariable }
// }


// import {
//   type MutationFunction,
//   type MutationKey,
//   useMutation,
//   useMutationState,
//   useQueryClient,
// } from "@tanstack/react-query"
// import { toast } from "sonner"

// export const useMutationData = (
//   mutationKey: MutationKey,
//   mutationFn: MutationFunction<any, any>,
//   queryKey?: string,
//   onSuccess?: () => void,
// ) => {
//   const client = useQueryClient()
//   const { mutate, isPending } = useMutation({
//     mutationKey,
//     mutationFn,
//     onSuccess: (data) => {
//       if (onSuccess) onSuccess()
      
//       // Handle different status codes
//       if (data?.status === 409) {
//         return toast.error("Keyword Already Used", {
//           description: data.data,
//         })
//       }
      
//       return toast(data?.status === 200 ? "Success" : "Error", {
//         description: data.data,
//       })
//     },
//     onError: (error: any) => {
//       // Handle errors that throw
//       toast.error("Error", {
//         description: error.message || "Something went wrong",
//       })
//     },
//     onSettled: async () => {
//       if (queryKey) {
//         await client.invalidateQueries({ queryKey: [queryKey] })
//       }
//     },
//   })

//   return { mutate, isPending }
// }

// export const useMutationDataState = (mutationKey: MutationKey) => {
//   const data = useMutationState({
//     filters: { mutationKey },
//     select: (mutation) => {
//       return {
//         variables: mutation.state.variables as any,
//         status: mutation.state.status,
//       }
//     },
//   })

//   const latestVariable = data[data.length - 1]
//   return { latestVariable }
// }

import {
  type MutationFunction,
  type MutationKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKey?: string,
  onSuccess?: () => void,
) => {
  const client = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (data) => {
      if (onSuccess) onSuccess()

      // Handle different status codes
      if (data?.status === 409) {
        return toast.error("Keyword Already Used", {
          description: data.data,
        })
      }

      return toast(data?.status === 200 ? "Success" : "Error", {
        description: data.data,
      })
    },
    onError: (error: any) => {
      // Handle errors that throw
      toast.error("Error", {
        description: error.message || "Something went wrong",
      })
    },
    onSettled: async () => {
      if (queryKey) {
        await client.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  return { mutate, isPending }
}

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      }
    },
  })

  const latestVariable = data[data.length - 1]
  return { latestVariable }
}
