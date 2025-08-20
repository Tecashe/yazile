"use server"

import { type TriggerMode, CustomerType } from "@prisma/client"
import crypto from "crypto"
import { client } from "@/lib/prisma"

export const matchKeyword = async (keyword: string) => {
  return await client.keyword.findFirst({
    where: {
      word: {
        equals: keyword,
        mode: "insensitive",
      },
    },
    include: {
      Automation: {
        include: {
          trigger: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  })
}

export const getKeywordAutomation = async (automationId: string, dm: boolean) => {
  return await client.automation.findUnique({
    where: {
      id: automationId,
    },
    include: {
      dms: dm,
      trigger: {
        where: {
          type: dm ? "DM" : "COMMENT",
          isActive: true,
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

export const getFallbackAutomation = async (pageId: string, messageType: "DM" | "COMMENT") => {
  return await client.automation.findFirst({
    where: {
      active: true,
      isFallback: true,
      User: {
        integrations: {
          some: {
            instagramId: pageId,
          },
        },
      },
      trigger: {
        some: {
          type: messageType,
          isActive: true,
        },
      },
    },
    include: {
      trigger: {
        where: {
          type: messageType,
          isActive: true,
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

export const trackResponses = async (automationId: string, type: "COMMENT" | "DM") => {
  if (type === "COMMENT") {
    return await client.listener.update({
      where: { automationId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    })
  }

  if (type === "DM") {
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

export const createChatHistory = (automationId: string, sender: string, reciever: string, message: string) => {
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
    orderBy: { createdAt: "asc" },
  })
  const chatSession: {
    role: "assistant" | "user"
    content: string
  }[] = history.map((chat) => {
    return {
      role: chat.reciever ? "assistant" : "user",
      content: chat.message!,
    }
  })

  return {
    history: chatSession,
    automationId: history[history.length - 1]?.automationId,
  }
}

export const checkProcessedMessage = async (messageKey: string): Promise<boolean> => {
  try {
    const messageHash = crypto.createHash("sha256").update(messageKey).digest("hex")

    const processed = await client.processedMessage.findFirst({
      where: {
        messageKey: messageHash,
        createdAt: {
          gte: new Date(Date.now() - 30000),
        },
      },
    })

    if (processed) {
      const timeDiff = Date.now() - processed.createdAt.getTime()
      if (timeDiff < 10000) {
        console.log(`Duplicate message detected within ${timeDiff}ms: ${messageKey.substring(0, 50)}...`)
        return true
      } else {
        console.log(`Message found in cache but older than 10s, allowing processing: ${messageKey.substring(0, 50)}...`)
        return false
      }
    }

    return false
  } catch (error) {
    console.error("Error checking processed message:", error)
    return false
  }
}

export const markMessageAsProcessed = async (messageKey: string): Promise<void> => {
  try {
    const messageHash = crypto.createHash("sha256").update(messageKey).digest("hex")
    const now = new Date()

    await client.processedMessage.upsert({
      where: {
        messageKey: messageHash,
      },
      update: {
        updatedAt: now,
        processCount: {
          increment: 1,
        },
      },
      create: {
        messageKey: messageHash,
        createdAt: now,
        processCount: 1,
        updatedAt: now,
      },
    })

    // Clean up old processed messages
    await client.processedMessage.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 300000),
        },
      },
    })
  } catch (error) {
    console.error("Error marking message as processed:", error)
  }
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
    lastMessageLength?: number
    averageResponseTime?: number
    isInHandoff?: boolean
    handoffReason?: string
    automationId?: string
    listenMode?: "KEYWORDS" | "ALL_MESSAGES"
  },
) => {
  return await client.conversationState.upsert({
    where: { userId },
    update: {
      ...updates,
      lastInteractionAt: new Date(),
      updatedAt: new Date(),
      interactionCount: updates.interactionCount ? { increment: 1 } : undefined,
    },
    create: {
      userId,
      isActive: updates.isActive ?? true,
      lastTriggerType: updates.lastTriggerType,
      lastTriggerReason: updates.lastTriggerReason,
      customerType: updates.customerType ?? CustomerType.NEW,
      interactionCount: updates.interactionCount ?? 1,
      sentiment: updates.sentiment,
      lastInteractionAt: new Date(),
      lastMessageLength: updates.lastMessageLength,
      averageResponseTime: updates.averageResponseTime,
      isInHandoff: updates.isInHandoff ?? false,
      handoffReason: updates.handoffReason,
      automationId: updates.automationId,
      listenMode: updates.listenMode,
    },
  })
}

export const getPageToken = async (pageId: string) => {
  const integration = await client.integrations.findFirst({
    where: {
      instagramId: pageId,
    },
    select: {
      token: true,
    },
  })
  return integration?.token || process.env.DEFAULT_PAGE_TOKEN!
}

export const logResponseMetrics = async (data: {
  automationId: string
  userId: string
  messageLength: number
  responseTime: number
  typingDelay: number
  wasSuccessful: boolean
  messageType: "DM" | "COMMENT"
  hasButtons: boolean
  sentiment?: "positive" | "neutral" | "negative"
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
}) => {
  try {
    await client.responseMetrics.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("Error logging response metrics:", error)
  }
}

export const checkConversationTimeout = async (userId: string, timeoutMinutes = 30): Promise<boolean> => {
  try {
    const conversationState = await client.conversationState.findUnique({
      where: { userId },
    })

    if (!conversationState || !conversationState.isActive) {
      return false
    }

    const timeoutThreshold = new Date(Date.now() - timeoutMinutes * 60 * 1000)

    if (conversationState.lastInteractionAt < timeoutThreshold) {
      await client.conversationState.update({
        where: { userId },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking conversation timeout:", error)
    return false
  }
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
  expiresAt.setHours(expiresAt.getHours() + 24)

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
    return true
  }

  const day = timestamp.getDay()
  const time = timestamp.toTimeString().slice(0, 5)

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
    return false
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

  const interactionCount = await client.dms.count({
    where: {
      senderId,
      reciever: pageId,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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

// FIXED: Enhanced trigger decision system with proper schema understanding
export const decideTriggerAction = async (
  pageId: string,
  senderId: string,
  userMessage: string,
  messageType: "DM" | "COMMENT",
) => {
  const userId = `${pageId}_${senderId}`

  // Step 1: Check for exact keyword match (highest priority)
  const keywordMatch = await matchKeyword(userMessage)
  if (keywordMatch?.automationId) {
    // Get the actual trigger ID from the automation's triggers
    const triggerForMessageType = keywordMatch.Automation?.trigger?.find((t) => t.type === messageType && t.isActive)

    console.log(`🎯 Keyword trigger matched: "${keywordMatch.word}" -> ${keywordMatch.automationId}`)
    console.log(`🔍 Found trigger for ${messageType}:`, triggerForMessageType?.id || "none")

    return {
      triggerType: "KEYWORD" as const,
      automationId: keywordMatch.automationId,
      triggerId: triggerForMessageType?.id || null,
      reason: `Keyword match: "${keywordMatch.word}"`,
      confidence: 1.0,
    }
  }

  // Step 2: Check if conversation is already active
  const conversationState = await client.conversationState.findUnique({
    where: { userId },
  })

  if (conversationState?.isActive && conversationState.automationId) {
    // Get the actual trigger for this automation
    const automation = await getAutomationWithTriggers(conversationState.automationId, messageType)
    const actualTriggerId = automation?.trigger?.[0]?.id || null

    console.log(`💬 Active conversation continues with automation: ${conversationState.automationId}`)
    return {
      triggerType: "CONVERSATION_CONTINUE" as const,
      automationId: conversationState.automationId,
      triggerId: actualTriggerId,
      reason: "Active conversation continuation",
      confidence: 0.9,
    }
  }

  // Step 3: Check for fallback automation
  const fallbackAutomation = await getFallbackAutomation(pageId, messageType)
  if (fallbackAutomation) {
    const actualTriggerId = fallbackAutomation.trigger?.[0]?.id || null

    console.log(`🔄 Fallback automation triggered: ${fallbackAutomation.id}`)
    return {
      triggerType: "FALLBACK" as const,
      automationId: fallbackAutomation.id,
      triggerId: actualTriggerId,
      reason: "No keyword match, using fallback",
      confidence: 0.5,
    }
  }

  // Step 4: Check for existing chat history (for free users)
  const chatHistory = await getChatHistory(pageId, senderId)
  if (chatHistory.history.length > 0 && chatHistory.automationId) {
    // Get the actual trigger for this automation
    const automation = await getAutomationWithTriggers(chatHistory.automationId, messageType)
    const actualTriggerId = automation?.trigger?.[0]?.id || null

    console.log(`📚 Chat history found, continuing with automation: ${chatHistory.automationId}`)
    return {
      triggerType: "HISTORY_CONTINUE" as const,
      automationId: chatHistory.automationId,
      triggerId: actualTriggerId,
      reason: "Existing chat history found",
      confidence: 0.7,
    }
  }

  console.log(`❌ No trigger matched for message: "${userMessage.substring(0, 50)}..."`)
  return {
    triggerType: "NO_MATCH" as const,
    automationId: null,
    triggerId: null,
    reason: "No matching triggers found",
    confidence: 0.0,
  }
}

// FIXED: Get automation with full trigger context using correct schema
export const getAutomationWithTriggers = async (automationId: string, messageType: "DM" | "COMMENT") => {
  return await client.automation.findUnique({
    where: {
      id: automationId,
    },
    include: {
      trigger: {
        where: {
          type: messageType,
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      listener: true,
      User: {
        select: {
          id: true,
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: {
            select: {
              token: true,
              instagramId: true,
            },
          },
        },
      },
      keywords: true,
      posts: messageType === "COMMENT" ? true : false,
    },
  })
}

export const checkDuplicateResponse = async (
  pageId: string,
  senderId: string,
  responseContent: string,
  messageType: "DM" | "COMMENT",
): Promise<boolean> => {
  try {
    // Create a hash of the response content for comparison
    const responseHash = crypto.createHash("sha256").update(responseContent.trim()).digest("hex")
    const recipientKey = `${pageId}_${senderId}_${messageType}`

    // Check if we've sent this exact response to this user in the last 5 minutes
    const recentResponse = await client.sentResponse.findFirst({
      where: {
        recipientKey,
        responseHash,
        sentAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
        },
      },
    })

    if (recentResponse) {
      const timeDiff = Date.now() - recentResponse.sentAt.getTime()
      console.log(
        `🚫 Duplicate response detected within ${Math.round(timeDiff / 1000)}s: "${responseContent.substring(0, 50)}..."`,
      )
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking duplicate response:", error)
    return false // Allow sending if check fails
  }
}

export const markResponseAsSent = async (
  pageId: string,
  senderId: string,
  responseContent: string,
  messageType: "DM" | "COMMENT",
  automationId?: string,
): Promise<void> => {
  try {
    const responseHash = crypto.createHash("sha256").update(responseContent.trim()).digest("hex")
    const recipientKey = `${pageId}_${senderId}_${messageType}`

    await client.sentResponse.create({
      data: {
        recipientKey,
        responseHash,
        responseContent: responseContent.substring(0, 1000), // Store first 1000 chars for debugging
        messageType,
        automationId,
        sentAt: new Date(),
      },
    })

    // Clean up old sent responses (older than 1 hour)
    await client.sentResponse.deleteMany({
      where: {
        sentAt: {
          lt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour
        },
      },
    })

    console.log(`✅ Response marked as sent: ${recipientKey} - "${responseContent.substring(0, 50)}..."`)
  } catch (error) {
    console.error("Error marking response as sent:", error)
  }
}

export const getRecentResponseCount = async (
  pageId: string,
  senderId: string,
  messageType: "DM" | "COMMENT",
  timeWindowMinutes = 5,
): Promise<number> => {
  try {
    const recipientKey = `${pageId}_${senderId}_${messageType}`

    const count = await client.sentResponse.count({
      where: {
        recipientKey,
        sentAt: {
          gte: new Date(Date.now() - timeWindowMinutes * 60 * 1000),
        },
      },
    })

    return count
  } catch (error) {
    console.error("Error getting recent response count:", error)
    return 0
  }
}
