// "use client"

// import { useCallback } from "react"
// import { ChatDatabase } from "@/lib/db-operations"

// export const useDatabaseSync = (automationId: string, userId: string) => {
//   const loadConversations = useCallback(async () => {
//     if (!automationId || !userId) return []

//     try {
//       const conversations = await fetch(`/api/conversations/${automationId}`)
//       if (!conversations.ok) throw new Error("Failed to fetch conversations")

//       const data = await conversations.json()
//       return data.conversations || []
//     } catch (error) {
//       console.error("Error loading conversations:", error)
//       return []
//     }
//   }, [automationId, userId])

//   const saveUserPreferences = useCallback(
//     async (preferences: any) => {
//       if (!userId) return

//       try {
//         await ChatDatabase.saveUserPreferences(userId, preferences)
//       } catch (error) {
//         console.error("Error saving preferences:", error)
//       }
//     },
//     [userId],
//   )

//   const loadUserPreferences = useCallback(async () => {
//     if (!userId) return null

//     try {
//       return await ChatDatabase.getUserPreferences(userId)
//     } catch (error) {
//       console.error("Error loading preferences:", error)
//       return null
//     }
//   }, [userId])

//   return {
//     loadConversations,
//     saveUserPreferences,
//     loadUserPreferences,
//   }
// }

"use client"

import { useCallback } from "react"
import { ChatDatabase } from "@/lib/db-operations"

export const useDatabaseSync = (automationId: string, userId: string) => {
  const loadConversations = useCallback(async () => {
    if (!automationId || !userId) return []

    try {
      // Updated API endpoint to match new route structure
      const conversations = await fetch(`/api/automations/${automationId}/conversations`)
      if (!conversations.ok) throw new Error("Failed to fetch conversations")

      const data = await conversations.json()
      return data.conversations || []
    } catch (error) {
      console.error("Error loading conversations:", error)
      return []
    }
  }, [automationId, userId])

  const saveUserPreferences = useCallback(
    async (preferences: any) => {
      if (!userId) return

      try {
        await ChatDatabase.saveUserPreferences(userId, preferences)
      } catch (error) {
        console.error("Error saving preferences:", error)
      }
    },
    [userId],
  )

  const loadUserPreferences = useCallback(async () => {
    if (!userId) return null

    try {
      return await ChatDatabase.getUserPreferences(userId)
    } catch (error) {
      console.error("Error loading preferences:", error)
      return null
    }
  }, [userId])

  return {
    loadConversations,
    saveUserPreferences,
    loadUserPreferences,
  }
}
