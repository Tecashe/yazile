"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface Lead {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  instagramUserId: string
  status: string
  score: number
  displayName: string
  marketingCompleteness: number
  revenueData: {
    estimatedValue: number
    roi: number
    tier: string
  }
  aiInsights: {
    buyerPersona?: string
    followUpStrategy?: string
    nextActions: string[]
    urgencyLevel?: number
    notificationMessage?: string
  }
  interactions?: any[]
  metadata?: any
  firstContactDate: string
  lastContactDate: string
  qualifiedDate?: string
}

interface Analytics {
  totalLeads: number
  qualifiedLeads: number
  convertedLeads: number
  conversionRate: number
  qualificationRate: number
  revenueMetrics?: {
    totalEstimatedRevenue: number
    totalExpectedRevenue: number
    averageROI: number
    revenueGrowth: number
  }
  tierDistribution?: {
    platinum: number
    gold: number
    silver: number
    bronze: number
  }
}

interface DuplicateInfo {
  hasDuplicates: boolean
  duplicateCount: number
}

export function useLeadsData() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [duplicateInfo, setDuplicateInfo] = useState<DuplicateInfo>({ hasDuplicates: false, duplicateCount: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    tier: "all",
    page: 1,
    limit: 50,
  })

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.tier !== "all" && { tier: filters.tier }),
        ...(filters.search && { search: filters.search }),
      })

      const response = await fetch(`/api/leads?${params}`)
      if (!response.ok) throw new Error("Failed to fetch leads")

      const data = await response.json()
      setLeads(data.leads)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads")
      toast.error("Failed to fetch leads")
    }
  }, [filters])

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) throw new Error("Failed to fetch analytics")

      const data = await response.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err)
    }
  }, [])

  // Check for duplicates
  const checkDuplicates = useCallback(async () => {
    try {
      const response = await fetch("/api/duplicates/check")
      if (!response.ok) throw new Error("Failed to check duplicates")

      const data = await response.json()
      setDuplicateInfo({
        hasDuplicates: data.hasDuplicates,
        duplicateCount: data.duplicateCount,
      })
    } catch (err) {
      console.error("Failed to check duplicates:", err)
    }
  }, [])

  // Sync leads to CRM
  const syncToCRM = async (leadIds: string[]) => {
    try {
      const response = await fetch("/api/leads/sync-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Successfully synced ${result.summary?.successful || 0} leads to CRM`)
        await fetchLeads() // Refresh data
      } else {
        toast.error(result.error || "CRM sync failed")
      }

      return result
    } catch (error) {
      toast.error("CRM sync failed")
      return { success: false, error }
    }
  }

  // Merge duplicates
  const mergeDuplicates = async () => {
    try {
      const response = await fetch("/api/leads/merge-duplicates", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        await Promise.all([fetchLeads(), checkDuplicates()]) // Refresh data
      } else {
        toast.error(result.error || "Failed to merge duplicates")
      }

      return result
    } catch (error) {
      toast.error("Failed to merge duplicates")
      return { success: false, error }
    }
  }

  // Re-analyze lead
  const reanalyzeLead = async (leadId: string, message: string) => {
    try {
      const response = await fetch("/api/leads/reanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, message }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Lead re-analysis completed")
        await fetchLeads() // Refresh data
      } else {
        toast.error(result.error || "Re-analysis failed")
      }

      return result
    } catch (error) {
      toast.error("Re-analysis failed")
      return { success: false, error }
    }
  }

  // Update filters
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })) // Reset to page 1 when filtering
  }

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await Promise.all([fetchLeads(), fetchAnalytics(), checkDuplicates()])
      setIsLoading(false)
    }

    loadInitialData()
  }, [fetchLeads, fetchAnalytics, checkDuplicates])

  // Real-time updates - poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeads()
      fetchAnalytics()
      checkDuplicates()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchLeads, fetchAnalytics, checkDuplicates])

  // Refresh data manually
  const refreshData = async () => {
    setIsLoading(true)
    await Promise.all([fetchLeads(), fetchAnalytics(), checkDuplicates()])
    setIsLoading(false)
    toast.success("Data refreshed")
  }

  return {
    // Data
    leads,
    analytics,
    duplicateInfo,
    isLoading,
    error,
    filters,

    // Actions
    syncToCRM,
    mergeDuplicates,
    reanalyzeLead,
    updateFilters,
    refreshData,

    // Pagination
    setPage: (page: number) => setFilters((prev) => ({ ...prev, page })),
  }
}
