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
//   })
// }


// export const useQueryAutomation = (id: string) => {
//   return useQuery({
//     queryKey: ['automation-info'],
//     queryFn: () => getAutomationInfo(id),
//   })
// }

// export const useQueryUser = () => {
//   return useQuery({
//     queryKey: ['user-profile'],
//     queryFn: onUserInfo,
//   })
// }

// export const useQueryAutomationPosts = () => {
//   const fetchPosts = async () => await getProfilePosts()
//   return useQuery({
//     queryKey: ['instagram-media'],
//     queryFn: fetchPosts,
//   })
// }

import { getAllAutomations, getAutomationInfo, getProfilePosts } from "@/actions/automations"
import { onUserInfo } from "@/actions/user"
import { useQuery } from "@tanstack/react-query"

export const useQueryAutomations = () => {
  return useQuery({
    queryKey: ["user-automations"],
    queryFn: getAllAutomations,
    // Improved caching and loading behavior
    staleTime: 3 * 60 * 1000, // 3 minutes - reasonable for automations
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: "always", // Always fetch fresh data on mount
    // Smart retry logic
    retry: (failureCount, error: any) => {
      // Don't retry on authentication or client errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      // Retry up to 3 times for server errors
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10s delay
  })
}

export const useQueryAutomation = (id: string) => {
  return useQuery({
    queryKey: ["automation-info", id], // Include id for proper cache separation
    queryFn: () => getAutomationInfo(id),
    enabled: !!id && id.length > 0, // Only run if valid id exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false // Don't retry if automation not found
      if (error?.status >= 400 && error?.status < 500) return false
      return failureCount < 2
    },
  })
}

export const useQueryUser = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: onUserInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes - user data is relatively stable
    gcTime: 15 * 60 * 1000, // 15 minutes - keep user data cached longer
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always get fresh user data on mount
    retry: (failureCount, error: any) => {
      // Don't retry auth errors
      if (error?.status === 401 || error?.status === 403) return false
      return failureCount < 2
    },
  })
}

export const useQueryAutomationPosts = (userId?: string) => {
  return useQuery({
    queryKey: ["instagram-media", userId], // Include userId for better cache management
    queryFn: async () => {
      console.log("🔄 Fetching Instagram posts...")
      const result = await getProfilePosts()
      console.log("✅ Instagram posts fetched:", result)
      return result
    },
    enabled: true, // Always enabled - remove any blocking conditions
    staleTime: 30 * 1000, // 30 seconds - Instagram posts can change frequently
    gcTime: 2 * 60 * 1000, // 2 minutes - shorter cache for social media
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always fetch on mount
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    retry: (failureCount, error: any) => {
      console.error("❌ Instagram posts fetch error:", error)
      // Don't retry on auth errors or rate limits
      if (error?.status === 401 || error?.status === 429) return false
      if (error?.status >= 400 && error?.status < 500) return false
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 15000), // Longer delays for Instagram API
  })
}

// Additional hook for manual refetch of posts
export const useRefreshAutomationPosts = () => {
  const { refetch } = useQueryAutomationPosts()

  const refreshPosts = async () => {
    console.log("🔄 Manually refreshing Instagram posts...")
    const result = await refetch()
    if (result.isSuccess) {
      console.log("✅ Posts refreshed successfully")
    } else {
      console.error("❌ Failed to refresh posts:", result.error)
    }
    return result
  }

  return { refreshPosts }
}

// Hook for checking if any queries are loading
export const useQueriesStatus = () => {
  const automationsQuery = useQueryAutomations()
  const userQuery = useQueryUser()
  const postsQuery = useQueryAutomationPosts()

  return {
    isLoading: automationsQuery.isLoading || userQuery.isLoading || postsQuery.isLoading,
    isError: automationsQuery.isError || userQuery.isError || postsQuery.isError,
    errors: {
      automations: automationsQuery.error,
      user: userQuery.error,
      posts: postsQuery.error,
    },
    refetchAll: () => {
      automationsQuery.refetch()
      userQuery.refetch()
      postsQuery.refetch()
    },
  }
}

// Debug hook to check query states
export const useQueryDebug = () => {
  const automationsQuery = useQueryAutomations()
  const userQuery = useQueryUser()
  const postsQuery = useQueryAutomationPosts()

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Query Debug Info:", {
      automations: {
        status: automationsQuery.status,
        isFetching: automationsQuery.isFetching,
        dataUpdatedAt: automationsQuery.dataUpdatedAt,
        error: automationsQuery.error,
      },
      user: {
        status: userQuery.status,
        isFetching: userQuery.isFetching,
        dataUpdatedAt: userQuery.dataUpdatedAt,
        error: userQuery.error,
      },
      posts: {
        status: postsQuery.status,
        isFetching: postsQuery.isFetching,
        dataUpdatedAt: postsQuery.dataUpdatedAt,
        error: postsQuery.error,
      },
    })
  }

  return {
    automations: automationsQuery,
    user: userQuery,
    posts: postsQuery,
  }
}





