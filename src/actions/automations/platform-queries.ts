"use server"

import { client } from "@/lib/prisma"
import type { Platform } from "@/lib/constants/platform"

export const getAutomationsByPlatform = async (userId: string, platform: Platform) => {
  return await client.automation.findMany({
    where: {
      userId,
      platform,
      deletedAt: null,
    },
    include: {
      keywords: true,
      trigger: true,
      listener: true,
      posts: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}

export const createPlatformAutomation = async (userId: string, platform: Platform, name?: string) => {
  return await client.automation.create({
    data: {
      userId,
      platform,
      name: name || `${platform} Automation`,
      active: false,
    },
  })
}

export const updatePlatformAutomation = async (
  automationId: string,
  data: {
    name?: string
    active?: boolean
    platform?: Platform
    trigger?: any
    listener?: any
  },
) => {
  return await client.automation.update({
    where: { id: automationId },
    data: {
      name: data.name,
      active: data.active,
      platform: data.platform,
    },
  })
}

export const getPlatformIntegration = async (userId: string, platform: Platform) => {
  return await client.integrations.findFirst({
    where: {
      userId,
      name: platform,
    },
  })
}

export const getAllPlatformIntegrations = async (userId: string) => {
  return await client.integrations.findMany({
    where: {
      userId,
    },
  })
}
