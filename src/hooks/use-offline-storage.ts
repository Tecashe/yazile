// "use client"

// import { useEffect, useState } from "react"
// import type { Conversation } from "@/types/dashboard"

// interface OfflineStorage {
//   cachedConversations: Conversation[]
//   isOffline: boolean
//   saveConversations: (conversations: Conversation[]) => void
//   loadConversations: () => Conversation[]
//   saveReadStatus: (readConversations: Set<string>) => void
//   loadReadStatus: () => Set<string>
// }

// export const useOfflineStorage = (): OfflineStorage => {
//   const [cachedConversations, setCachedConversations] = useState<Conversation[]>([])
//   const [isOffline, setIsOffline] = useState(false)

//   useEffect(() => {
//     // Load cached data on mount
//     const loadedConversations = loadConversations()
//     if (loadedConversations.length > 0) {
//       setCachedConversations(loadedConversations)
//     }

//     // Monitor online/offline status
//     const handleOnline = () => setIsOffline(false)
//     const handleOffline = () => setIsOffline(true)

//     setIsOffline(!navigator.onLine)
//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)

//     return () => {
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])

//   const saveConversations = (conversations: Conversation[]) => {
//     try {
//       localStorage.setItem("cachedConversations", JSON.stringify(conversations))
//       setCachedConversations(conversations)
//     } catch (error) {
//       console.error("Failed to save conversations to localStorage:", error)
//     }
//   }

//   const loadConversations = (): Conversation[] => {
//     try {
//       const saved = localStorage.getItem("cachedConversations")
//       if (saved) {
//         const parsed = JSON.parse(saved)
//         return parsed.map((conv: any) => ({
//           ...conv,
//           createdAt: new Date(conv.createdAt),
//           updatedAt: new Date(conv.updatedAt),
//           messages: conv.messages.map((msg: any) => ({
//             ...msg,
//             createdAt: new Date(msg.createdAt),
//           })),
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load conversations from localStorage:", error)
//     }
//     return []
//   }

//   const saveReadStatus = (readConversations: Set<string>) => {
//     try {
//       localStorage.setItem("readConversations", JSON.stringify(Array.from(readConversations)))
//     } catch (error) {
//       console.error("Failed to save read status to localStorage:", error)
//     }
//   }

//   const loadReadStatus = (): Set<string> => {
//     try {
//       const saved = localStorage.getItem("readConversations")
//       if (saved) {
//         return new Set(JSON.parse(saved))
//       }
//     } catch (error) {
//       console.error("Failed to load read status from localStorage:", error)
//     }
//     return new Set()
//   }

//   return {
//     cachedConversations,
//     isOffline,
//     saveConversations,
//     loadConversations,
//     saveReadStatus,
//     loadReadStatus,
//   }
// }


"use client"

import { useEffect, useState } from "react"
import type { Conversation } from "@/types/dashboard"

interface OfflineStorage {
  cachedConversations: Conversation[]
  isOffline: boolean
  saveConversations: (conversations: Conversation[]) => void
  loadConversations: () => Conversation[]
  saveReadStatus: (readConversations: Set<string>) => void
  loadReadStatus: () => Set<string>
}

export const useOfflineStorage = (): OfflineStorage => {
  const [cachedConversations, setCachedConversations] = useState<Conversation[]>([])
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const loadedConversations = loadConversations()
    if (loadedConversations.length > 0) {
      setCachedConversations(loadedConversations)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine)
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  const saveConversations = (conversations: Conversation[]) => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("cachedConversations", JSON.stringify(conversations))
      setCachedConversations(conversations)
    } catch (error) {
      console.error("Failed to save conversations to localStorage:", error)
    }
  }

  const loadConversations = (): Conversation[] => {
    if (typeof window === "undefined") return []

    try {
      const saved = localStorage.getItem("cachedConversations")
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })),
        }))
      }
    } catch (error) {
      console.error("Failed to load conversations from localStorage:", error)
    }
    return []
  }

  const saveReadStatus = (readConversations: Set<string>) => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("readConversations", JSON.stringify(Array.from(readConversations)))
    } catch (error) {
      console.error("Failed to save read status to localStorage:", error)
    }
  }

  const loadReadStatus = (): Set<string> => {
    if (typeof window === "undefined") return new Set()

    try {
      const saved = localStorage.getItem("readConversations")
      if (saved) {
        return new Set(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load read status from localStorage:", error)
    }
    return new Set()
  }

  return {
    cachedConversations,
    isOffline,
    saveConversations,
    loadConversations,
    saveReadStatus,
    loadReadStatus,
  }
}
