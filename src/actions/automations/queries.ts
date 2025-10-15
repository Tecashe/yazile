// 'use server'

// import { client } from '@/lib/prisma'
// import { v4 } from 'uuid'

// export const createAutomation = async (clerkId: string, id?: string) => {
//   return await client.user.update({
//     where: {
//       clerkId,
//     },
//     data: {
//       automations: {
//         create: {
//           ...(id && { id }),
//         },
//       },
//     },
//   })
// }

// export const getAutomations = async (clerkId: string) => {
//   return await client.user.findUnique({
//     where: {
//       clerkId,
//     },
//     select: {
//       automations: {
//         orderBy: {
//           createdAt: 'asc',
//         },
//         include: {
//           keywords: true,
//           listener: true,
//         },
//       },
//     },
//   })
// }

// export const findAutomation = async (id: string) => {
//   return await client.automation.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       keywords: true,
//       trigger: true,
//       posts: true,
//       listener: true,
//       scheduledPosts:true,
//       User: {
//         select: {
//           subscription: true,
//           integrations: true,
//         },
//       },
//     },
//   })
// }



// export const updateAutomationQuery = async (
//   id: string,
//   update: {
//     name?: string
//     active?: boolean
//     isFallback?: boolean
//     fallbackMessage?: string
//     buttons?: any
//     listenMode?: "KEYWORDS" | "ALL_MESSAGES" // ✓ Add this
//   }
// ) => {
//   return await client.automation.update({
//     where: { id },
//     data: {
//       name: update.name,
//       active: update.active,
//       isFallback: update.isFallback,
//       fallbackMessage: update.fallbackMessage,
//       buttons: update.buttons,
//       listenMode: update.listenMode, // ✓ Add this
//     },
//   })
// }

// // Renamed to avoid conflict
// export const updateAutomationQueryORIGINAL = async (
//   id: string,
//   update: {
//     name?: string
//     active?: boolean
//     isFallback?: boolean
//     fallbackMessage?: string
//     buttons?: any // Use Prisma.JsonValue if you have a specific type
//   }
// ) => {
//   return await client.automation.update({
//     where: { id },
//     data: {
//       name: update.name,
//       active: update.active,
//       isFallback: update.isFallback,
//       fallbackMessage: update.fallbackMessage,
//       buttons: update.buttons,
//     },
//   })
// }

// export const addListener = async (
//   automationId: string,
//   listener: 'SMARTAI' | 'MESSAGE',
//   prompt: string,
//   reply?: string
// ) => {
//   return await client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       listener: {
//         create: {
//           listener,
//           prompt,
//           commentReply: reply,
//         },
//       },
//     },
//   })
// }

// export const addTrigger = async (automationId: string, trigger: string[]) => {
//   if (trigger.length === 2) {
//     return await client.automation.update({
//       where: { id: automationId },
//       data: {
//         trigger: {
//           createMany: {
//             data: [{ type: trigger[0] }, { type: trigger[1] }],
//           },
//         },
//       },
//     })
//   }
//   return await client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       trigger: {
//         create: {
//           type: trigger[0],
//         },
//       },
//     },
//   })
// }

// export const addKeyWord = async (automationId: string, keyword: string) => {
//   return client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       keywords: {
//         create: {
//           word: keyword,
//         },
//       },
//     },
//   })
// }

// export const deleteKeywordQuery = async (id: string) => {
//   return client.keyword.delete({
//     where: { id },
//   })
// }

// export const addPost = async (
//   autmationId: string,
//   posts: {
//     postid: string
//     caption?: string
//     media: string
//     mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
//   }[]
// ) => {
//   return await client.automation.update({
//     where: {
//       id: autmationId,
//     },
//     data: {
//       posts: {
//         createMany: {
//           data: posts,
//         },
//       },
//     },
//   })
// }

// export const deleteAutomationQuery = async (autmationId: string) => {
//   try {
//     return await client.automation.delete({
//       where: {
//         id:autmationId,
//       },
//     })
//   } catch (error) {
//     console.error('Error deleting automation:', error)
//     return null
//   }
// }

// export async function createOrUpdateConversationState(userId: string, isActive: boolean) {
//   return await client.conversationState.upsert({
//     where: { userId },
//     update: { 
//       isActive,
//       updatedAt: new Date()
//     },
//     create: {
//       userId,
//       isActive,
//     }
//   })
// }

// export async function getConversationState(userId: string) {
//   return await client.conversationState.findUnique({
//     where: { userId }
//   })
// }

// export const addScheduledPosts = async (
//   automationId: string,
//   scheduledPostIds: string[]
// ) => {
//   return await client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       scheduledPosts: {
//         connect: scheduledPostIds.map(id => ({ id })),
//       },
//     },
//   })
// }

"use server"

import { client } from "@/lib/prisma"

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
        where: {
          deletedAt: null, // Only get non-trashed automations
        },
        orderBy: {
          createdAt: "asc",
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
      scheduledPosts: true,
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
    listenMode?: "KEYWORDS" | "ALL_MESSAGES"
  },
) => {
  return await client.automation.update({
    where: { id },
    data: {
      name: update.name,
      active: update.active,
      isFallback: update.isFallback,
      fallbackMessage: update.fallbackMessage,
      buttons: update.buttons,
      listenMode: update.listenMode,
    },
  })
}

export const addListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string,
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

export const addKeyWordORIGINAL = async (automationId: string, keyword: string) => {
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

export const addKeyWord = async (automationId: string, keyword: string, userId: string) => {
  // First, check if this user already has this keyword in any of their automations
  const existingKeyword = await client.keyword.findFirst({
    where: {
      word: keyword,
      Automation: {
        userId: userId,
      },
    },
  })

  if (existingKeyword) {
    return null // Keyword already exists for this user
  }

  // If not, create the keyword
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
  automationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
  }[],
) => {
  return await client.automation.update({
    where: {
      id: automationId,
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

export const deleteAutomationQuery = async (automationId: string) => {
  try {
    return await client.automation.update({
      where: {
        id: automationId,
      },
      data: {
        deletedAt: new Date(),
        active: false, // Deactivate when moving to trash
      },
    })
  } catch (error) {
    console.error("Error moving automation to trash:", error)
    return null
  }
}

export const addScheduledPosts = async (automationId: string, scheduledPostIds: string[]) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      scheduledPosts: {
        connect: scheduledPostIds.map((id) => ({ id })),
      },
    },
  })
}

/////////////////



export const disableOtherDefaultAutomations = async (userId: string, currentAutomationId: string) => {
  // Find all automations for this user that have isFallback = true, excluding the current one
  const defaultAutomations = await client.automation.findMany({
    where: {
      userId,
      isFallback: true,
      id: {
        not: currentAutomationId,
      },
      deletedAt: null,
    },
  })

  // If any exist, set their isFallback to false
  if (defaultAutomations.length > 0) {
    await client.automation.updateMany({
      where: {
        id: {
          in: defaultAutomations.map((a) => a.id),
        },
      },
      data: {
        isFallback: false,
        listenMode: "KEYWORDS", // Reset to keywords mode
      },
    })
  }

  return defaultAutomations.length
}

export const getDefaultAutomation = async (clerkId: string, excludeId?: string) => {
  return await client.automation.findFirst({
    where: {
      User: {
        clerkId,
      },
      isFallback: true,
      deletedAt: null,
      ...(excludeId && {
        id: {
          not: excludeId,
        },
      }),
    },
    select: {
      id: true,
      name: true,
    },
  })
}
