'use server'

import { client } from '@/lib/prisma'
import { v4 } from 'uuid'

export const createAutomation = async (clerkId: string, id?: string) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      automations: {
        create: {
          ...(id && { id }),
        },
      },
    },
  })
}

export const getAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      automations: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  })
}

export const findAutomation = async (id: string) => {
  return await client.automation.findUnique({
    where: {
      id,
    },
    include: {
      keywords: true,
      trigger: true,
      posts: true,
      listener: true,
      scheduledPosts:true,
      User: {
        select: {
          subscription: true,
          integrations: true,
        },
      },
    },
  })
}



export const updateAutomationQuery = async (
  id: string,
  update: {
    name?: string
    active?: boolean
    isFallback?: boolean
    fallbackMessage?: string
    buttons?: any
    listenMode?: "KEYWORDS" | "ALL_MESSAGES" // ✓ Add this
  }
) => {
  return await client.automation.update({
    where: { id },
    data: {
      name: update.name,
      active: update.active,
      isFallback: update.isFallback,
      fallbackMessage: update.fallbackMessage,
      buttons: update.buttons,
      listenMode: update.listenMode, // ✓ Add this
    },
  })
}

// Renamed to avoid conflict
export const updateAutomationQueryORIGINAL = async (
  id: string,
  update: {
    name?: string
    active?: boolean
    isFallback?: boolean
    fallbackMessage?: string
    buttons?: any // Use Prisma.JsonValue if you have a specific type
  }
) => {
  return await client.automation.update({
    where: { id },
    data: {
      name: update.name,
      active: update.active,
      isFallback: update.isFallback,
      fallbackMessage: update.fallbackMessage,
      buttons: update.buttons,
    },
  })
}

export const addListener = async (
  automationId: string,
  listener: 'SMARTAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      listener: {
        create: {
          listener,
          prompt,
          commentReply: reply,
        },
      },
    },
  })
}

export const addTrigger = async (automationId: string, trigger: string[]) => {
  if (trigger.length === 2) {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        trigger: {
          createMany: {
            data: [{ type: trigger[0] }, { type: trigger[1] }],
          },
        },
      },
    })
  }
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      trigger: {
        create: {
          type: trigger[0],
        },
      },
    },
  })
}

export const addKeyWord = async (automationId: string, keyword: string) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      keywords: {
        create: {
          word: keyword,
        },
      },
    },
  })
}

export const deleteKeywordQuery = async (id: string) => {
  return client.keyword.delete({
    where: { id },
  })
}

export const addPost = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }[]
) => {
  return await client.automation.update({
    where: {
      id: autmationId,
    },
    data: {
      posts: {
        createMany: {
          data: posts,
        },
      },
    },
  })
}

export const deleteAutomationQuery = async (autmationId: string) => {
  try {
    return await client.automation.delete({
      where: {
        id:autmationId,
      },
    })
  } catch (error) {
    console.error('Error deleting automation:', error)
    return null
  }
}

export async function createOrUpdateConversationState(userId: string, isActive: boolean) {
  return await client.conversationState.upsert({
    where: { userId },
    update: { 
      isActive,
      updatedAt: new Date()
    },
    create: {
      userId,
      isActive,
    }
  })
}

export async function getConversationState(userId: string) {
  return await client.conversationState.findUnique({
    where: { userId }
  })
}

export const addScheduledPosts = async (
  automationId: string,
  scheduledPostIds: string[]
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      scheduledPosts: {
        connect: scheduledPostIds.map(id => ({ id })),
      },
    },
  })
}

