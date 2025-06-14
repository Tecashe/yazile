import { client } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

// Define proper types for our message structure
interface ChatMessage {
  id: string
  role: string
  content: string
  senderId: string
  createdAt: string
  read: boolean
  [key: string]: any // Add index signature for Prisma compatibility
}

export class ChatDatabase {
  // Get conversations for an automation
  static async getConversations(automationId: string, userId: string) {
    try {
      const conversations = await client.conversation.findMany({
        where: {
          automationId,
          Automation: {
            userId,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })

      return conversations.map((conv) => {
        // Safely parse messages from JSON
        let messages: ChatMessage[] = []

        if (Array.isArray(conv.messages)) {
          messages = conv.messages
            .filter((msg): msg is Prisma.JsonObject => msg !== null && typeof msg === "object" && !Array.isArray(msg))
            .map((msg) => ({
              id: String(msg.id || Date.now()),
              role: String(msg.role || "user"),
              content: String(msg.content || msg.message || ""),
              senderId: String(msg.senderId || conv.pageId),
              createdAt: String(msg.createdAt || new Date().toISOString()),
              read: Boolean(msg.read || false),
            }))
        }

        return {
          id: conv.id,
          pageId: conv.pageId,
          userId: conv.pageId, // Using pageId as userId for compatibility
          messages: messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            senderId: msg.senderId,
            createdAt: new Date(msg.createdAt),
            read: msg.read,
          })),
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          unreadCount: messages.filter((msg) => !msg.read).length,
          Automation: null,
        }
      })
    } catch (error) {
      console.error("Error fetching conversations:", error)
      return []
    }
  }

  // Add message to conversation
  static async addMessage(conversationId: string, message: any) {
    try {
      const conversation = await client.conversation.findUnique({
        where: { id: conversationId },
      })

      if (!conversation) {
        throw new Error("Conversation not found")
      }

      // Safely handle existing messages
      let existingMessages: ChatMessage[] = []

      if (Array.isArray(conversation.messages)) {
        existingMessages = conversation.messages
          .filter((msg): msg is Prisma.JsonObject => msg !== null && typeof msg === "object" && !Array.isArray(msg))
          .map((msg) => ({
            id: String(msg.id || Date.now()),
            role: String(msg.role || "user"),
            content: String(msg.content || msg.message || ""),
            senderId: String(msg.senderId || conversation.pageId),
            createdAt: String(msg.createdAt || new Date().toISOString()),
            read: Boolean(msg.read || false),
          }))
      }

      const newMessage: ChatMessage = {
        id: String(message.id || Date.now()),
        role: String(message.role || "user"),
        content: String(message.content || ""),
        senderId: String(message.senderId || conversation.pageId),
        createdAt: new Date().toISOString(),
        read: Boolean(message.read || false),
      }

      // Convert to plain objects for Prisma
      const updatedMessages = [...existingMessages, newMessage].map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
        read: msg.read,
      }))

      await client.conversation.update({
        where: { id: conversationId },
        data: {
          messages: updatedMessages,
          updatedAt: new Date(),
        },
      })

      return {
        id: newMessage.id,
        role: newMessage.role,
        content: newMessage.content,
        senderId: newMessage.senderId,
        createdAt: new Date(newMessage.createdAt),
        read: newMessage.read,
      }
    } catch (error) {
      console.error("Error adding message:", error)
      throw error
    }
  }

  // Mark conversation as read
  static async markConversationAsRead(conversationId: string) {
    try {
      const conversation = await client.conversation.findUnique({
        where: { id: conversationId },
      })

      if (!conversation) return

      // Safely handle existing messages
      let existingMessages: ChatMessage[] = []

      if (Array.isArray(conversation.messages)) {
        existingMessages = conversation.messages
          .filter((msg): msg is Prisma.JsonObject => msg !== null && typeof msg === "object" && !Array.isArray(msg))
          .map((msg) => ({
            id: String(msg.id || Date.now()),
            role: String(msg.role || "user"),
            content: String(msg.content || msg.message || ""),
            senderId: String(msg.senderId || conversation.pageId),
            createdAt: String(msg.createdAt || new Date().toISOString()),
            read: true, // Mark all as read
          }))
      }

      const updatedMessages: Prisma.InputJsonValue[] = existingMessages

      await client.conversation.update({
        where: { id: conversationId },
        data: {
          messages: updatedMessages,
          updatedAt: new Date(),
        },
      })
    } catch (error) {
      console.error("Error marking conversation as read:", error)
    }
  }

  // Get user preferences
  static async getUserPreferences(userId: string) {
    try {
      const user = await client.user.findUnique({
        where: { clerkId: userId },
        include: {
          preferences: true, // Now this will work with your schema
        },
      })

      if (!user) {
        throw new Error("User not found")
      }

      // Return user preferences if they exist
      if (user.preferences) {
        return {
          soundEnabled: user.preferences.soundEnabled,
          desktopNotifications: user.preferences.desktopNotifications,
          emailNotifications: user.preferences.emailNotifications,
          autoMarkAsRead: user.preferences.autoMarkAsRead,
          theme: user.preferences.theme,
          language: user.preferences.language,
        }
      }

      // Return defaults if no preferences exist
      return {
        soundEnabled: true,
        desktopNotifications: true,
        emailNotifications: false,
        autoMarkAsRead: false,
        theme: "system",
        language: "en",
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error)
      return {
        soundEnabled: true,
        desktopNotifications: true,
        emailNotifications: false,
        autoMarkAsRead: false,
        theme: "system",
        language: "en",
      }
    }
  }

  // Save user preferences
  static async saveUserPreferences(userId: string, preferences: any) {
    try {
      const user = await client.user.findUnique({
        where: { clerkId: userId },
      })

      if (!user) {
        throw new Error("User not found")
      }

      // Use upsert to create or update preferences
      await client.userPreferences.upsert({
        where: { userId: user.id },
        update: {
          soundEnabled: preferences.soundEnabled,
          desktopNotifications: preferences.desktopNotifications,
          emailNotifications: preferences.emailNotifications,
          autoMarkAsRead: preferences.autoMarkAsRead,
          theme: preferences.theme,
          language: preferences.language,
        },
        create: {
          userId: user.id,
          soundEnabled: preferences.soundEnabled,
          desktopNotifications: preferences.desktopNotifications,
          emailNotifications: preferences.emailNotifications,
          autoMarkAsRead: preferences.autoMarkAsRead,
          theme: preferences.theme,
          language: preferences.language,
        },
      })

      console.log("User preferences saved successfully for user:", userId)
    } catch (error) {
      console.error("Error saving user preferences:", error)
      throw error
    }
  }

  // Delete conversation
  static async deleteConversation(conversationId: string) {
    try {
      await client.conversation.delete({
        where: { id: conversationId },
      })
    } catch (error) {
      console.error("Error deleting conversation:", error)
      throw error
    }
  }

  // Create a new conversation
  static async createConversation(pageId: string, automationId: string, initialMessage?: any) {
    try {
      const messages: Prisma.InputJsonValue[] = initialMessage
        ? [
            {
              id: String(initialMessage.id || Date.now()),
              role: String(initialMessage.role || "user"),
              content: String(initialMessage.content || ""),
              senderId: String(initialMessage.senderId || pageId),
              createdAt: new Date().toISOString(),
              read: Boolean(initialMessage.read || false),
            },
          ]
        : []

      const conversation = await client.conversation.create({
        data: {
          pageId,
          automationId,
          messages,
        },
      })

      return conversation
    } catch (error) {
      console.error("Error creating conversation:", error)
      throw error
    }
  }

  // Get conversation by pageId
  static async getConversationByPageId(pageId: string, automationId: string) {
    try {
      const conversation = await client.conversation.findFirst({
        where: {
          pageId,
          automationId,
        },
      })

      return conversation
    } catch (error) {
      console.error("Error fetching conversation by pageId:", error)
      return null
    }
  }
}
