"use client"

import { useState, useCallback, useEffect } from "react"
import { globalSearch, quickSearch, type SearchResult, type SearchResponse } from "@/actions/search/global-search"
import { useDebounce } from "./use-debounce"

export interface SearchFilters {
  types?: string[]
  dateRange?: { from: Date; to: Date }
  businessId?: string
  limit?: number
  offset?: number
}

export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [categories, setCategories] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [searchTime, setSearchTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  const search = useCallback(async (searchQuery: string, filters?: SearchFilters) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      setTotalCount(0)
      setCategories({})
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response: SearchResponse = await globalSearch(searchQuery, filters)
      setResults(response.results)
      setTotalCount(response.totalCount)
      setCategories(response.categories)
      setSearchTime(response.searchTime)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
      setTotalCount(0)
      setCategories({})
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery)
    } else {
      setResults([])
      setTotalCount(0)
      setCategories({})
    }
  }, [debouncedQuery, search])

  const clearSearch = useCallback(() => {
    setQuery("")
    setResults([])
    setTotalCount(0)
    setCategories({})
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    totalCount,
    categories,
    isLoading,
    searchTime,
    error,
    search,
    clearSearch,
  }
}

export function useQuickSearch() {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const results = await quickSearch(query, 8)
      setSuggestions(results)
    } catch (error) {
      console.error("Quick search error:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    suggestions,
    isLoading,
    getSuggestions,
    clearSuggestions: () => setSuggestions([]),
  }
}
