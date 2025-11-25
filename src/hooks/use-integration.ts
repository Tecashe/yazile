"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useCallback, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

// Types matching your Prisma schema
export interface Integration {
  id: string
  token: string
  expiresAt: Date | null
  name: string
  instagramId?: string | null
  username?: string | null
  fullName?: string | null
  profilePicture?: string | null
  followersCount?: number | null
  followingCount?: number | null
  postsCount?: number | null
  pageId?: string | null
  phoneNumber?: string | null
  linkedinId?: string | null
  lastUpdated?: Date | null
}

export interface UserProfile {
  id: string
  clerkId: string
  email: string
  firstname: string
  lastname: string
  integrations: Integration[]
  subscription?: {
    plan: string
    customerId?: string
  } | null
}

export type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error" | "refreshing"

export type IntegrationStrategy = "INSTAGRAM" | "CRM"

const STORAGE_KEY = "integration_pending_state"
const OAUTH_INITIATED_KEY = "oauth_initiated_at"

function getPendingState(): { connecting: IntegrationStrategy[] } {
  if (typeof window === "undefined") return { connecting: [] }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return { connecting: [] }

    // Check if OAuth was initiated recently (within 5 minutes)
    const initiatedAt = sessionStorage.getItem(OAUTH_INITIATED_KEY)
    if (initiatedAt) {
      const elapsed = Date.now() - Number.parseInt(initiatedAt, 10)
      if (elapsed > 5 * 60 * 1000) {
        // OAuth took too long, clear pending state
        sessionStorage.removeItem(STORAGE_KEY)
        sessionStorage.removeItem(OAUTH_INITIATED_KEY)
        return { connecting: [] }
      }
    }

    return JSON.parse(stored)
  } catch {
    return { connecting: [] }
  }
}

function setPendingConnection(strategy: IntegrationStrategy) {
  if (typeof window === "undefined") return
  const state = getPendingState()
  if (!state.connecting.includes(strategy)) {
    state.connecting.push(strategy)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    sessionStorage.setItem(OAUTH_INITIATED_KEY, Date.now().toString())
  }
}

function clearPendingConnection(strategy: IntegrationStrategy) {
  if (typeof window === "undefined") return
  const state = getPendingState()
  state.connecting = state.connecting.filter((s) => s !== strategy)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  if (state.connecting.length === 0) {
    sessionStorage.removeItem(OAUTH_INITIATED_KEY)
  }
}

function clearAllPendingConnections() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(OAUTH_INITIATED_KEY)
}

interface UseIntegrationsOptions {
  onUserInfo: () => Promise<{ status: number; data?: any; message?: string }>
  refetchInterval?: number
}

export function useIntegrations({ onUserInfo, refetchInterval = 30000 }: UseIntegrationsOptions) {
  const queryClient = useQueryClient()
  const previousDataRef = useRef<any>(null)
  const searchParams = useSearchParams()

  // Check for OAuth code in URL (for Instagram callback)
  const oauthCode = searchParams.get("code")

  // Main query for user profile with integrations
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const result = await onUserInfo()
      if (result.status === 200 && result.data) {
        // Check if new integrations were added (OAuth success)
        const prevIntegrations = previousDataRef.current?.integrations || []
        const newIntegrations = result.data.integrations || []

        if (newIntegrations.length > prevIntegrations.length) {
          // New integration detected - clear all pending states
          clearAllPendingConnections()
        }

        previousDataRef.current = result.data
        return result.data
      }
      throw new Error(result.message || "Failed to fetch user profile")
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: refetchInterval,
    retry: 2,
  })

  // Get pending state for optimistic UI
  const pendingState = getPendingState()

  // Handle OAuth callback - refetch immediately when code is present
  useEffect(() => {
    if (oauthCode) {
      clearAllPendingConnections()
      refetch()
    }
  }, [oauthCode, refetch])

  // Handle window focus - refetch if OAuth was initiated
  useEffect(() => {
    const handleFocus = () => {
      const pending = getPendingState()
      if (pending.connecting.length > 0) {
        refetch()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleFocus()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [refetch])

  // Check if a strategy is connected
  const isConnected = useCallback(
    (strategy: IntegrationStrategy): boolean => {
      if (!userData?.integrations) return false
      return userData.integrations.some((i: Integration) => i.name === strategy)
    },
    [userData],
  )

  // Get connection status with optimistic state
  const getConnectionStatus = useCallback(
    (strategy: IntegrationStrategy): ConnectionStatus => {
      const isPending = pendingState.connecting.includes(strategy)
      const hasIntegration = isConnected(strategy)

      if (isPending && !hasIntegration) {
        return "connecting"
      }
      if (hasIntegration) {
        if (isPending) {
          clearPendingConnection(strategy)
        }
        return "connected"
      }
      if (isFetching) {
        return "refreshing"
      }
      return "disconnected"
    },
    [isConnected, pendingState.connecting, isFetching],
  )

  // Get integration data for a strategy
  const getIntegration = useCallback(
    (strategy: IntegrationStrategy): Integration | undefined => {
      return userData?.integrations?.find((i: Integration) => i.name === strategy)
    },
    [userData],
  )

  // Get all integrations
  const getAllIntegrations = useCallback((): Integration[] => {
    return userData?.integrations || []
  }, [userData])

  // Start connection (call before OAuth redirect)
  const startConnection = useCallback((strategy: IntegrationStrategy) => {
    setPendingConnection(strategy)
  }, [])

  // Invalidate and refetch
  const invalidateIntegrations = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["user-profile"] })
  }, [queryClient])

  // Optimistic disconnect
  const optimisticDisconnect = useCallback(
    (integrationId: string) => {
      queryClient.setQueryData(["user-profile"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          integrations: old.integrations.filter((i: Integration) => i.id !== integrationId),
        }
      })
    },
    [queryClient],
  )

  // Revert optimistic disconnect on error
  const revertDisconnect = useCallback(
    (integration: Integration) => {
      queryClient.setQueryData(["user-profile"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          integrations: [...old.integrations, integration],
        }
      })
    },
    [queryClient],
  )

  return {
    userData,
    userProfile: userData,
    integrations: userData?.integrations || [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isConnected,
    getConnectionStatus,
    getIntegration,
    getAllIntegrations,
    startConnection,
    invalidateIntegrations,
    optimisticDisconnect,
    revertDisconnect,
    clearPendingConnection,
    clearAllPendingConnections,
  }
}

// Hook for disconnect mutation with optimistic updates
interface UseDisconnectOptions {
  onDisconnect: (accountId: string, accessToken: string) => Promise<{ status: number; message: string }>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useDisconnectIntegration({ onDisconnect, onSuccess, onError }: UseDisconnectOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ accountId, accessToken }: { accountId: string; accessToken: string }) => {
      const result = await onDisconnect(accountId, accessToken)
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return result
    },
    onMutate: async ({ accountId }) => {
      await queryClient.cancelQueries({ queryKey: ["user-profile"] })
      const previousProfile = queryClient.getQueryData(["user-profile"])
      queryClient.setQueryData(["user-profile"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          integrations: old.integrations.filter((i: Integration) => i.id !== accountId),
        }
      })
      return { previousProfile }
    },
    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["user-profile"], context.previousProfile)
      }
      onError?.(err as Error)
    },
    onSuccess: () => {
      onSuccess?.()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
  })
}
