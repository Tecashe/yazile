"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export interface IntegrationCapability {
  id: string
  name: string
  description: string
  category: string
}

export interface Integration {
  id: string
  name: string
  type: string
  isActive: boolean
  capabilities: IntegrationCapability[]
  config?: Record<string, any>
}

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadIntegrations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/integrations")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load integrations"
      setError(errorMessage)
      console.error("Failed to load integrations:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleIntegration = useCallback(
    async (integrationId: string): Promise<boolean> => {
      try {
        const integration = integrations.find((i) => i.id === integrationId)
        if (!integration) return false

        const response = await fetch(`/api/integrations/${integrationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !integration.isActive }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const updatedIntegration = await response.json()

        setIntegrations((prev) => prev.map((i) => (i.id === integrationId ? updatedIntegration : i)))

        toast({
          title: "Success",
          description: `${integration.name} ${updatedIntegration.isActive ? "enabled" : "disabled"}`,
        })

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update integration"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      }
    },
    [integrations],
  )

  useEffect(() => {
    loadIntegrations()
  }, [loadIntegrations])

  return {
    integrations,
    isLoading,
    error,
    toggleIntegration,
    refetch: loadIntegrations,
  }
}
