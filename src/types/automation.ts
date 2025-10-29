// import type { Platform } from "@/lib/constants/platform"

// export interface Automation {
//   id: string
//   name: string
//   platform: Platform
//   active: boolean
//   isFallback: boolean
//   listenMode: "KEYWORDS" | "ALL_MESSAGES"
//   fallbackMessage?: string | null
//   createdAt: Date
//   updatedAt: Date
//   userId: string | null
//   listener?: {
//     id: string
//     listener: "SMARTAI" | "MESSAGE"
//     automationId: string
//     prompt: string
//     commentReply: string | null
//     lastComment: string | null
//     lastDm: string | null
//     dmCount: number
//     commentCount: number
//   } | null
//   trigger?: Array<{
//     id: string
//     createdAt: Date
//     type: string
//     triggerMode: "KEYWORD" | "UNIVERSAL" | "AI_SMART" | "TIME_BASED" | "EVENT_BASED"
//     configuration: Record<string, any> | null
//     priority: number
//     confidenceThreshold: number
//     businessHoursOnly: boolean
//     isActive: boolean
//     updatedAt: Date
//     automationId: string | null
//   }>
//   keywords?: Array<{
//     id: string
//     word: string
//     automationId: string
//   }>
//   posts?: Array<{
//     id: string
//     postid: string
//     caption?: string | null
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     automationId: string
//   }>
//   scheduledPosts?: Array<{
//     id: string
//     postid: string
//     caption?: string | null
//     media: string
//     mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
//     automationId: string
//   }>
//   User?: {
//     id: string
//     email: string
//     name?: string | null
//   } | null
// }

// export interface AutomationNode {
//   id: string
//   type: "TRIGGER" | "RESPONSE" | "ACTION"
//   platform: Platform
//   config: Record<string, any>
// }

// export interface PlatformIntegration {
//   id: string
//   platform: Platform
//   token: string
//   expiresAt?: Date
//   metadata: Record<string, any>
// }

import type { Platform } from "@/lib/constants/platform"

export interface Automation {
  id: string
  name: string
  platform: Platform
  active: boolean
  isFallback: boolean
  listenMode: "KEYWORDS" | "ALL_MESSAGES"
  fallbackMessage?: string | null
  createdAt: Date
  updatedAt?: Date // Made optional since queries may not always include it
  userId: string | null
  listener?: {
    id: string
    listener: "SMARTAI" | "MESSAGE"
    automationId: string
    prompt: string
    commentReply: string | null
    lastComment: string | null
    lastDm: string | null
    dmCount: number
    commentCount: number
  } | null
  trigger?: Array<{
    id: string
    createdAt: Date
    type: string
    triggerMode: "KEYWORD" | "UNIVERSAL" | "AI_SMART" | "TIME_BASED" | "EVENT_BASED"
    configuration: Record<string, any> | null
    priority: number
    confidenceThreshold: number
    businessHoursOnly: boolean
    isActive: boolean
    updatedAt: Date
    automationId: string | null
  }>
  keywords?: Array<{
    id: string
    word: string
    automationId: string
  }>
  posts?: Array<{
    id: string
    postid: string
    caption?: string | null
    media: string
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
    automationId: string
  }>
  scheduledPosts?: Array<{
    id: string
    postid: string
    caption?: string | null
    media: string
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
    automationId: string
  }>
  User?: {
    id: string
    email: string
    name?: string | null
  } | null
}

export interface AutomationNode {
  id: string
  type: "TRIGGER" | "RESPONSE" | "ACTION"
  platform: Platform
  config: Record<string, any>
}

export interface PlatformIntegration {
  id: string
  platform: Platform
  token: string
  expiresAt?: Date
  metadata: Record<string, any>
}
