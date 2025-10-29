import type { Platform } from "@/lib/constants/platform"
import { PLATFORM_CONFIG } from "@/lib/constants/platform"

export const getPlatformName = (platform: Platform): string => {
  return PLATFORM_CONFIG[platform].name
}

export const getPlatformColor = (platform: Platform): string => {
  return PLATFORM_CONFIG[platform].color
}

export const getPlatformCapabilities = (platform: Platform) => {
  return PLATFORM_CONFIG[platform].capabilities
}

export const getTriggerTypesForPlatform = (platform: Platform): string[] => {
  return PLATFORM_CONFIG[platform].triggerTypes
}

export const getResponseTypesForPlatform = (platform: Platform): string[] => {
  return PLATFORM_CONFIG[platform].responseTypes
}

export const canPlatformHandleComments = (platform: Platform): boolean => {
  return PLATFORM_CONFIG[platform].capabilities.hasComments
}

export const canPlatformHandleDMs = (platform: Platform): boolean => {
  return PLATFORM_CONFIG[platform].capabilities.hasDMs
}

export const canPlatformHandlePosts = (platform: Platform): boolean => {
  return PLATFORM_CONFIG[platform].capabilities.hasPosts
}

export const canPlatformHandlePages = (platform: Platform): boolean => {
  return PLATFORM_CONFIG[platform].capabilities.hasPages
}
