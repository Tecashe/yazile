// src/hooks/useSyncAutomations.ts
import { useEffect } from 'react'
import { useQueryAutomations } from './user-queries'

// This hook handles automatic synchronization of automation data
export const useSyncAutomations = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useQueryAutomations()
  
  const automations = data?.data || []

  useEffect(() => {
    // Initial fetch when component mounts
    refetch()
    
    // Set up automatic refresh when window regains focus
    // This is useful when users come back after creating an automation
    const handleFocus = () => {
      refetch()
    }
    
    // Set up polling to check for new automations every 30 seconds
    const intervalId = setInterval(() => {
      refetch()
    }, 30000) // 30 seconds
    
    window.addEventListener('focus', handleFocus)
    
    // Clean up
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(intervalId)
    }
  }, [refetch])

  return {
    automations,
    isLoading,
    isError,
    refetch
  }
}

export default useSyncAutomations