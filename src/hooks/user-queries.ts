import {
  getAllAutomations,
  getAutomationInfo,
  getProfilePosts,
} from '@/actions/automations'
import { onUserInfo } from '@/actions/user'
import { useQuery } from '@tanstack/react-query'
import type { Automation } from "@/types/automations"

export const useQueryAutomations = () => {
  return useQuery({
    queryKey: ['user-automations'],
    queryFn: getAllAutomations,
  })
}


export const useQueryAutomation = (id: string) => {
  return useQuery({
    queryKey: ['automation-info'],
    queryFn: () => getAutomationInfo(id),
  })
}

export const useQueryUser = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: onUserInfo,
  })
}

export const useQueryAutomationPosts = () => {
  const fetchPosts = async () => await getProfilePosts()
  return useQuery({
    queryKey: ['instagram-media'],
    queryFn: fetchPosts,
  })
}


// import {
//   getAllAutomations,
//   getAutomationInfo,
//   getProfilePosts,
// } from '@/actions/automations'
// import { onUserInfo } from '@/actions/user'
// import { useQuery } from '@tanstack/react-query'
// import type { Automation } from "@/types/automations"

// export const useQueryAutomations = () => {
//   return useQuery({
//     queryKey: ['user-automations'],
//     queryFn: getAllAutomations,
//     // Improve caching and loading behavior
//     staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
//     gcTime: 10 * 60 * 1000, // 10 minutes - cache time
//     refetchOnWindowFocus: false, // Prevent unnecessary refetches
//     refetchOnMount: true, // Always fetch on component mount
//     // Retry configuration
//     retry: (failureCount, error) => {
//       // Don't retry on 4xx errors (client errors)
//       if (error && 'status' in error && typeof error.status === 'number') {
//         return error.status >= 500 && failureCount < 3
//       }
//       return failureCount < 3
//     },
//     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//   })
// }

// export const useQueryAutomation = (id: string) => {
//   return useQuery({
//     queryKey: ['automation-info', id], // Include id in query key for proper caching
//     queryFn: () => getAutomationInfo(id),
//     enabled: !!id, // Only run query if id exists
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     gcTime: 5 * 60 * 1000, // 5 minutes
//     retry: 2,
//   })
// }

// export const useQueryUser = () => {
//   return useQuery({
//     queryKey: ['user-profile'],
//     queryFn: onUserInfo,
//     staleTime: 10 * 60 * 1000, // 10 minutes - user data changes less frequently
//     gcTime: 30 * 60 * 1000, // 30 minutes
//     retry: 2,
//   })
// }

// export const useQueryAutomationPosts = () => {
//   return useQuery({
//     queryKey: ['instagram-media'],
//     queryFn: getProfilePosts, // Simplified - no need for wrapper function
//     staleTime: 1 * 60 * 1000, // 1 minute - social media posts change frequently
//     gcTime: 5 * 60 * 1000, // 5 minutes
//     retry: 2,
//   })
// }
