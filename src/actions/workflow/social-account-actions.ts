"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface CreateSocialAccountData {
  platform: string
  accountId: string
  username: string
  accessToken?: string
  refreshToken?: string
}

// Create a new social account
export async function createSocialAccount(userId: string, data: CreateSocialAccountData) {
  try {
    const socialAccount = await prisma.socialAccount.create({
      data: {
        userId,
        platform: data.platform,
        accountId: data.accountId,
        username: data.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isActive: true,
      },
    })

    revalidatePath("/settings/social-accounts")
    return { success: true, socialAccount }
  } catch (error) {
    console.error("Error creating social account:", error)
    return { success: false, error: "Failed to create social account" }
  }
}

// Get user's social accounts
export async function getUserSocialAccounts(userId: string) {
  try {
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { userId },
      include: {
        workflows: {
          select: {
            id: true,
            name: true,
            isActive: true,
            triggerType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, socialAccounts }
  } catch (error) {
    console.error("Error fetching social accounts:", error)
    return { success: false, error: "Failed to fetch social accounts" }
  }
}

// Update social account
export async function updateSocialAccount(
  socialAccountId: string,
  userId: string,
  updates: {
    username?: string
    accessToken?: string
    refreshToken?: string
    isActive?: boolean
  },
) {
  try {
    const socialAccount = await prisma.socialAccount.update({
      where: {
        id: socialAccountId,
        userId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/settings/social-accounts")
    return { success: true, socialAccount }
  } catch (error) {
    console.error("Error updating social account:", error)
    return { success: false, error: "Failed to update social account" }
  }
}

// Delete social account
export async function deleteSocialAccount(socialAccountId: string, userId: string) {
  try {
    await prisma.socialAccount.delete({
      where: {
        id: socialAccountId,
        userId,
      },
    })

    revalidatePath("/settings/social-accounts")
    return { success: true }
  } catch (error) {
    console.error("Error deleting social account:", error)
    return { success: false, error: "Failed to delete social account" }
  }
}
