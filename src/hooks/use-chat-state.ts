"use client"

import { useState, useCallback, useMemo } from "react"
import type { Conversation, Message } from "@/types/dashboard"

interface ChatState {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  readConversations: Set<string>
}

interface ChatActions {
  setConversations: (conversations: Conversation[]) => void
  setSelectedConversation: (conversation: Conversation | null) => void
  markConversationAsRead: (conversationId: string) => void
  markAllAsRead: () => void
  addMessage: (conversationId: string, message: Message) => void
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void
  deleteConversation: (conversationId: string) => void
}

export const useChatState = (): [
  ChatState & { unreadChats: Set<string>; totalUnreadMessages: number },
  ChatActions,
] => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set())

  // Memoize derived state to prevent infinite loops
  const derivedState = useMemo(() => {
    const unreadChats = new Set(
      conversations.filter((conv) => !readConversations.has(conv.id) && conv.unreadCount > 0).map((conv) => conv.id),
    )

    const totalUnreadMessages = conversations.reduce((total, conv) => {
      return total + (readConversations.has(conv.id) ? 0 : conv.unreadCount)
    }, 0)

    return { unreadChats, totalUnreadMessages }
  }, [conversations, readConversations])

  const markConversationAsRead = useCallback(
    async (conversationId: string) => {
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

      // Call API to persist read status
      try {
        await fetch(`/api/conversations/${conversationId}/read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ automationId: conversations.find((c) => c.id === conversationId)?.Automation?.id }),
        })
      } catch (error) {
        console.error("Failed to mark conversation as read:", error)
      }
    },
    [conversations],
  )

  const markAllAsRead = useCallback(async () => {
    const allIds = new Set(conversations.map((conv) => conv.id))
    setReadConversations(allIds)

    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) => ({ ...msg, read: true })),
        unreadCount: 0,
      })),
    )

    // Call API for each conversation
    try {
      await Promise.all(
        conversations.map((conv) =>
          fetch(`/api/conversations/${conv.id}/read`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ automationId: conv.Automation?.id }),
          }),
        ),
      )
    } catch (error) {
      console.error("Failed to mark all conversations as read:", error)
    }
  }, [conversations])

  const addMessage = useCallback(
    async (conversationId: string, message: Message) => {
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

      // Call API to persist message
      try {
        await fetch(`/api/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: message.content,
            role: message.role,
            senderId: message.senderId,
            automationId: conversations.find((c) => c.id === conversationId)?.Automation?.id,
          }),
        })
      } catch (error) {
        console.error("Failed to add message:", error)
      }
    },
    [selectedConversation, conversations],
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
    async (conversationId: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null)
      }

      setReadConversations((prev) => {
        const newSet = new Set(prev)
        newSet.delete(conversationId)
        return newSet
      })

      // Call API to delete conversation
      try {
        await fetch(`/api/conversations/${conversationId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to delete conversation:", error)
      }
    },
    [selectedConversation],
  )

  return [
    {
      conversations,
      selectedConversation,
      readConversations,
      ...derivedState,
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
