"use client"

import { useState, useCallback } from "react"
import type { Platform } from "@/lib/constants/platform"
import {
  getPlatformIntegrationStatus,
  getPlatformPosts,
  getPlatformConversations,
} from "@/actions/automations/platform-actions"

export const usePlatformIntegration = (platform: Platform) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkIntegration = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getPlatformIntegrationStatus(platform)
      if (result.status === 200) {
        setIsConnected(result.data?.connected ?? false)
      }
    } catch (err) {
      setError("Failed to check integration status")
    } finally {
      setIsLoading(false)
    }
  }, [platform])

  return { isConnected, isLoading, error, checkIntegration }
}

export const usePlatformPosts = (platform: Platform) => {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getPlatformPosts(platform)
      if (result.status === 200) {
        setPosts(Array.isArray(result.data) ? result.data : [])
      } else {
        setError(typeof result.data === "string" ? result.data : "Failed to fetch posts")
      }
    } catch (err) {
      setError("Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }, [platform])

  return { posts, isLoading, error, fetchPosts }
}

export const usePlatformConversations = (platform: Platform) => {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getPlatformConversations(platform)
      if (result.status === 200) {
        setConversations(Array.isArray(result.data) ? result.data : [])
      } else {
        setError("Failed to fetch conversations")
      }
    } catch (err) {
      setError("Failed to fetch conversations")
    } finally {
      setIsLoading(false)
    }
  }, [platform])

  return { conversations, isLoading, error, fetchConversations }
}
