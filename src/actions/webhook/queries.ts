"use server"


import { type TriggerMode, CustomerType } from "@prisma/client"
import crypto from "crypto"
import { client } from '@/lib/prisma'
import type { Message, Conversation } from "@/types/chat"

export const matchKeyword = async (keyword: string) => {
  return await client.keyword.findFirst({
    where: {
      word: {
        equals: keyword,
        mode: 'insensitive',
      },
    },
  })
}

export const getKeywordAutomation = async (
  automationId: string,
  dm: boolean
) => {
  return await client.automation.findUnique({
    where: {
      id: automationId,
    },

    include: {
      dms: dm,
      trigger: {
        where: {
          type: dm ? 'DM' : 'COMMENT',
        },
      },
      listener: true,
      User: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: {
            select: {
              token: true,              
            },
          },
        },
      },
    },
  })
}
export const trackResponses = async (
  automationId: string,
  type: 'COMMENT' | 'DM'
) => {
  if (type === 'COMMENT') {
    return await client.listener.update({
      where: { automationId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    })
  }

  if (type === 'DM') {
    return await client.listener.update({
      where: { automationId },
      data: {
        dmCount: {
          increment: 1,
        },
      },
    })
  }
}

export const createChatHistory = (
  automationId: string,
  sender: string,
  reciever: string,
  message: string
) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      dms: {
        create: {
          reciever,
          senderId: sender,
          message,
        },
      },
    },
  })
}

export const getKeywordPost = async (postId: string, automationId: string) => {
  return await client.post.findFirst({
    where: {
      AND: [{ postid: postId }, { automationId }],
    },
    select: { automationId: true },
  })
}

export const getChatHistory = async (sender: string, reciever: string) => {
  const history = await client.dms.findMany({
    where: {
      AND: [{ senderId: sender }, { reciever }],
    },
    orderBy: { createdAt: 'asc' },
  })
  const chatSession: {
    role: 'assistant' | 'user'
    content: string
  }[] = history.map((chat) => {
    return {
      role: chat.reciever ? 'assistant' : 'user',
      content: chat.message!,
    }
  })

  return {
    history: chatSession,
    automationId: history[history.length - 1].automationId,
  }
}



// Enhanced trigger evaluation functions
export const getActiveTriggersForAutomation = async (automationId: string) => {
  return await client.trigger.findMany({
    where: {
      automationId,
      isActive: true,
    },
    orderBy: {
      priority: "desc", // Higher priority first
    },
    include: {
      Automation: {
        include: {
          User: {
            select: {
              subscription: {
                select: {
                  plan: true,
                },
              },
              integrations: {
                select: {
                  token: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

export const getAllActiveAutomationsForPage = async (pageId: string) => {
  return await client.automation.findMany({
    where: {
      active: true,
      User: {
        integrations: {
          some: {
            instagramId: pageId,
          },
        },
      },
    },
    include: {
      trigger: {
        where: {
          isActive: true,
        },
        orderBy: {
          priority: "desc",
        },
      },
      keywords: true,
      User: {
        include: {
          subscription: true,
          integrations: true,
        },
      },
    },
  })
}

export const updateConversationState = async (
  userId: string,
  updates: {
    isActive?: boolean
    lastTriggerType?: string
    lastTriggerReason?: string
    customerType?: CustomerType
    interactionCount?: number
    sentiment?: number
  },
) => {
  return await client.conversationState.upsert({
    where: { userId },
    update: {
      ...updates,
      lastInteractionAt: new Date(),
      updatedAt: new Date(),
    },
    create: {
      userId,
      isActive: updates.isActive ?? true,
      lastTriggerType: updates.lastTriggerType,
      lastTriggerReason: updates.lastTriggerReason,
      customerType: updates.customerType ?? CustomerType.NEW,
      interactionCount: updates.interactionCount ?? 1,
      sentiment: updates.sentiment,
    },
  })
}

export const logTriggerExecution = async (data: {
  triggerId: string
  automationId: string
  userId: string
  messageContent: string
  triggerType: TriggerMode
  confidence?: number
  reason?: string
  success: boolean
  responseTime?: number
  errorMessage?: string
  metadata?: any
}) => {
  return await client.triggerExecution.create({
    data,
  })
}

export const getAIAnalysisFromCache = async (messageContent: string) => {
  const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")

  return await client.aIAnalysisCache.findFirst({
    where: {
      messageHash,
      expiresAt: {
        gt: new Date(),
      },
    },
  })
}

export const cacheAIAnalysis = async (
  messageContent: string,
  analysis: {
    confidence: number
    intent?: string
    sentiment?: number
    isSpam: boolean
    businessRelevant: boolean
  },
) => {
  const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // Cache for 24 hours

  return await client.aIAnalysisCache.upsert({
    where: { messageHash },
    update: {
      analysis,
      confidence: analysis.confidence,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      isSpam: analysis.isSpam,
      businessRelevant: analysis.businessRelevant,
      expiresAt,
    },
    create: {
      messageHash,
      analysis,
      confidence: analysis.confidence,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      isSpam: analysis.isSpam,
      businessRelevant: analysis.businessRelevant,
      expiresAt,
    },
  })
}

export const getBusinessHours = async (userId: string) => {
  return await client.businessHours.findUnique({
    where: { userId },
  })
}

export const isWithinBusinessHours = async (userId: string, timestamp: Date) => {
  const businessHours = await getBusinessHours(userId)

  if (!businessHours || !businessHours.isActive) {
    return true // If no business hours set, always allow
  }

  const day = timestamp.getDay() // 0 = Sunday, 1 = Monday, etc.
  const time = timestamp.toTimeString().slice(0, 5) // "HH:MM"

  const daySchedule = {
    0: { start: businessHours.sundayStart, end: businessHours.sundayEnd },
    1: { start: businessHours.mondayStart, end: businessHours.mondayEnd },
    2: { start: businessHours.tuesdayStart, end: businessHours.tuesdayEnd },
    3: { start: businessHours.wednesdayStart, end: businessHours.wednesdayEnd },
    4: { start: businessHours.thursdayStart, end: businessHours.thursdayEnd },
    5: { start: businessHours.fridayStart, end: businessHours.fridayEnd },
    6: { start: businessHours.saturdayStart, end: businessHours.saturdayEnd },
  }

  const schedule = daySchedule[day as keyof typeof daySchedule]

  if (!schedule.start || !schedule.end) {
    return false // Day is closed
  }

  return time >= schedule.start && time <= schedule.end
}

export const getCustomerType = async (pageId: string, senderId: string): Promise<CustomerType> => {
  const existingHistory = await client.dms.findFirst({
    where: {
      senderId,
      reciever: pageId,
    },
  })

  if (!existingHistory) {
    return CustomerType.NEW
  }

  // Check interaction frequency to determine if VIP
  const interactionCount = await client.dms.count({
    where: {
      senderId,
      reciever: pageId,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
  })

  if (interactionCount >= 10) {
    return CustomerType.VIP
  }

  return CustomerType.RETURNING
}

export const updateTriggerAnalytics = async (
  triggerId: string,
  execution: {
    success: boolean
    confidence?: number
    responseTime?: number
    wasSpam?: boolean
  },
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return await client.triggerAnalytics.upsert({
    where: {
      triggerId_date: {
        triggerId,
        date: today,
      },
    },
    update: {
      totalExecutions: { increment: 1 },
      successfulExecutions: execution.success ? { increment: 1 } : undefined,
      failedExecutions: !execution.success ? { increment: 1 } : undefined,
      spamFiltered: execution.wasSpam ? { increment: 1 } : undefined,
    },
    create: {
      triggerId,
      date: today,
      totalExecutions: 1,
      successfulExecutions: execution.success ? 1 : 0,
      failedExecutions: execution.success ? 0 : 1,
      spamFiltered: execution.wasSpam ? 1 : 0,
      averageConfidence: execution.confidence,
      averageResponseTime: execution.responseTime,
    },
  })
}

export const updateWebhookPerformance = async (
  userId: string,
  execution: {
    success: boolean
    responseTime?: number
    triggerType?: TriggerMode
    errorType?: string
  },
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const currentHour = new Date().getHours()

  return await client.webhookPerformance.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      totalRequests: { increment: 1 },
      successfulRequests: execution.success ? { increment: 1 } : undefined,
      failedRequests: !execution.success ? { increment: 1 } : undefined,
      peakHour: currentHour,
    },
    create: {
      userId,
      date: today,
      totalRequests: 1,
      successfulRequests: execution.success ? 1 : 0,
      failedRequests: execution.success ? 0 : 1,
      averageResponseTime: execution.responseTime,
      peakHour: currentHour,
    },
  })
}
