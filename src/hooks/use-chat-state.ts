// "use client"

// import { useState, useCallback } from "react"
// import type { Conversation, Message } from "@/types/dashboard"

// interface ChatState {
//   conversations: Conversation[]
//   selectedConversation: Conversation | null
//   unreadChats: Set<string>
//   totalUnreadMessages: number
//   readConversations: Set<string>
// }

// interface ChatActions {
//   setConversations: (conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void
//   setSelectedConversation: (conversation: Conversation | null) => void
//   markConversationAsRead: (conversationId: string) => void
//   markAllAsRead: () => void
//   addMessage: (conversationId: string, message: Message) => void
//   updateConversation: (conversationId: string, updates: Partial<Conversation>) => void
//   deleteConversation: (conversationId: string) => void
// }

// export const useChatState = (): [ChatState, ChatActions] => {
//   const [conversations, setConversations] = useState<Conversation[]>([])
//   const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
//   const [readConversations, setReadConversations] = useState<Set<string>>(new Set())

//   // Derived state
//   const unreadChats = new Set(
//     conversations.filter((conv) => !readConversations.has(conv.id) && conv.unreadCount > 0).map((conv) => conv.id),
//   )

//   const totalUnreadMessages = conversations.reduce((total, conv) => {
//     return total + (readConversations.has(conv.id) ? 0 : conv.unreadCount)
//   }, 0)

//   const markConversationAsRead = useCallback((conversationId: string) => {
//     setReadConversations((prev) => {
//       const newSet = new Set(prev)
//       newSet.add(conversationId)
//       return newSet
//     })

//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? { ...conv, messages: conv.messages.map((msg) => ({ ...msg, read: true })), unreadCount: 0 }
//           : conv,
//       ),
//     )
//   }, [])

//   const markAllAsRead = useCallback(() => {
//     const allIds = new Set(conversations.map((conv) => conv.id))
//     setReadConversations(allIds)

//     setConversations((prev) =>
//       prev.map((conv) => ({
//         ...conv,
//         messages: conv.messages.map((msg) => ({ ...msg, read: true })),
//         unreadCount: 0,
//       })),
//     )
//   }, [conversations])

//   const addMessage = useCallback(
//     (conversationId: string, message: Message) => {
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv.id === conversationId ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date() } : conv,
//         ),
//       )

//       if (selectedConversation?.id === conversationId) {
//         setSelectedConversation((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 messages: [...prev.messages, message],
//                 updatedAt: new Date(),
//               }
//             : null,
//         )
//       }
//     },
//     [selectedConversation],
//   )

//   const updateConversation = useCallback(
//     (conversationId: string, updates: Partial<Conversation>) => {
//       setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, ...updates } : conv)))

//       if (selectedConversation?.id === conversationId) {
//         setSelectedConversation((prev) => (prev ? { ...prev, ...updates } : null))
//       }
//     },
//     [selectedConversation],
//   )

//   const deleteConversation = useCallback(
//     (conversationId: string) => {
//       setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

//       if (selectedConversation?.id === conversationId) {
//         setSelectedConversation(null)
//       }

//       setReadConversations((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(conversationId)
//         return newSet
//       })
//     },
//     [selectedConversation],
//   )

//   return [
//     {
//       conversations,
//       selectedConversation,
//       unreadChats,
//       totalUnreadMessages,
//       readConversations,
//     },
//     {
//       setConversations,
//       setSelectedConversation,
//       markConversationAsRead,
//       markAllAsRead,
//       addMessage,
//       updateConversation,
//       deleteConversation,
//     },
//   ]
// }


"use client"

import { useState, useCallback } from "react"
import type { Conversation, Message } from "@/types/dashboard"

interface ChatState {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  unreadChats: Set<string>
  totalUnreadMessages: number
  readConversations: Set<string>
}

interface ChatActions {
  setConversations: (conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void
  setSelectedConversation: (conversation: Conversation | null) => void
  markConversationAsRead: (conversationId: string) => void
  markAllAsRead: () => void
  addMessage: (conversationId: string, message: Message) => void
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void
  deleteConversation: (conversationId: string) => void
}

export const useChatState = (): [ChatState, ChatActions] => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set())

  const unreadChats = new Set(
    conversations.filter((conv) => !readConversations.has(conv.id) && conv.unreadCount > 0).map((conv) => conv.id),
  )

  const totalUnreadMessages = conversations.reduce((total, conv) => {
    return total + (readConversations.has(conv.id) ? 0 : conv.unreadCount)
  }, 0)

  const markConversationAsRead = useCallback((conversationId: string) => {
    setReadConversations((prev) => {
      const newSet = new Set(prev)
      newSet.add(conversationId)
      return newSet
    })

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: conv.messages.map((msg) => ({ ...msg, read: true })), unreadCount: 0 }
          : conv,
      ),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    const allIds = new Set(conversations.map((conv) => conv.id))
    setReadConversations(allIds)

    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) => ({ ...msg, read: true })),
        unreadCount: 0,
      })),
    )
  }, [conversations])

  const addMessage = useCallback(
    (conversationId: string, message: Message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date() } : conv,
        ),
      )

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, message],
                updatedAt: new Date(),
              }
            : null,
        )
      }
    },
    [selectedConversation],
  )

  const updateConversation = useCallback(
    (conversationId: string, updates: Partial<Conversation>) => {
      setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, ...updates } : conv)))

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation((prev) => (prev ? { ...prev, ...updates } : null))
      }
    },
    [selectedConversation],
  )

  const deleteConversation = useCallback(
    (conversationId: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null)
      }

      setReadConversations((prev) => {
        const newSet = new Set(prev)
        newSet.delete(conversationId)
        return newSet
      })
    },
    [selectedConversation],
  )

  return [
    {
      conversations,
      selectedConversation,
      unreadChats,
      totalUnreadMessages,
      readConversations,
    },
    {
      setConversations,
      setSelectedConversation,
      markConversationAsRead,
      markAllAsRead,
      addMessage,
      updateConversation,
      deleteConversation,
    },
  ]
}
