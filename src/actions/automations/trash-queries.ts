"use server"

import { client } from "@/lib/prisma"

// Soft delete - move automation to trash
export const moveToTrashQuery = async (automationId: string) => {
  try {
    return await client.automation.update({
      where: { id: automationId },
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

// Get all trashed automations for a user
export const getTrashedAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: { clerkId },
    select: {
      automations: {
        where: {
          deletedAt: {
            not: null,
          },
        },
        orderBy: {
          deletedAt: "desc",
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  })
}

// Restore automation from trash
export const restoreAutomationQuery = async (automationId: string) => {
  try {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        deletedAt: null,
      },
    })
  } catch (error) {
    console.error("Error restoring automation:", error)
    return null
  }
}

// Permanently delete automation
export const permanentlyDeleteAutomationQuery = async (automationId: string) => {
  try {
    return await client.automation.delete({
      where: { id: automationId },
    })
  } catch (error) {
    console.error("Error permanently deleting automation:", error)
    return null
  }
}

// Empty trash - permanently delete all trashed automations
export const emptyTrashQuery = async (clerkId: string) => {
  try {
    // First get all trashed automation IDs
    const user = await client.user.findUnique({
      where: { clerkId },
      select: {
        automations: {
          where: {
            deletedAt: {
              not: null,
            },
          },
          select: {
            id: true,
          },
        },
      },
    })

    if (!user || !user.automations.length) {
      return { count: 0 }
    }

    const automationIds = user.automations.map((a) => a.id)

    // Delete all trashed automations
    const result = await client.automation.deleteMany({
      where: {
        id: {
          in: automationIds,
        },
      },
    })

    return result
  } catch (error) {
    console.error("Error emptying trash:", error)
    return null
  }
}
