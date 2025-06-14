import { pusherServer } from "@/lib/pusher"

export interface PusherEventData {
  conversationId: string
  messageId?: string
  userId?: string
  data?: any
}

export class PusherService {
  static async triggerNewMessage(automationId: string, data: PusherEventData) {
    try {
      await pusherServer.trigger(`automation-${automationId}`, "new-message", {
        conversationId: data.conversationId,
        message: data.data,
        timestamp: new Date().toISOString(),
      })

      console.log("Pusher event triggered: new-message", data)
      return { success: true }
    } catch (error) {
      console.error("Failed to trigger new-message event:", error)
      return { success: false, error }
    }
  }

  static async triggerMessageRead(automationId: string, data: PusherEventData) {
    try {
      await pusherServer.trigger(`automation-${automationId}`, "message-read", {
        conversationId: data.conversationId,
        messageIds: data.data?.messageIds || [],
        userId: data.userId,
        timestamp: new Date().toISOString(),
      })

      console.log("Pusher event triggered: message-read", data)
      return { success: true }
    } catch (error) {
      console.error("Failed to trigger message-read event:", error)
      return { success: false, error }
    }
  }

  static async triggerConversationUpdated(automationId: string, data: PusherEventData) {
    try {
      await pusherServer.trigger(`automation-${automationId}`, "conversation-updated", {
        conversationId: data.conversationId,
        conversation: data.data,
        timestamp: new Date().toISOString(),
      })

      console.log("Pusher event triggered: conversation-updated", data)
      return { success: true }
    } catch (error) {
      console.error("Failed to trigger conversation-updated event:", error)
      return { success: false, error }
    }
  }

  static async triggerTypingIndicator(automationId: string, data: PusherEventData & { isTyping: boolean }) {
    try {
      await pusherServer.trigger(`automation-${automationId}`, "typing-indicator", {
        conversationId: data.conversationId,
        userId: data.userId,
        isTyping: data.isTyping,
        timestamp: new Date().toISOString(),
      })

      return { success: true }
    } catch (error) {
      console.error("Failed to trigger typing-indicator event:", error)
      return { success: false, error }
    }
  }

  static async getChannelInfo(channelName: string) {
    try {
      const result = await pusherServer.get({ path: `/channels/${channelName}` })
      return { success: true, data: result }
    } catch (error) {
      console.error("Failed to get channel info:", error)
      return { success: false, error }
    }
  }
}
