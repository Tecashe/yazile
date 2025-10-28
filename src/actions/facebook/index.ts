"use server"

import { onCurrentUser } from "../user"
import {
  createFacebookPage,
  getFacebookPagesByUser,
  deleteFacebookPage,
  createFacebookAutomationRule,
  getFacebookAutomationRules,
  updateFacebookAutomationRule,
  deleteFacebookAutomationRule,
  createFacebookCampaign,
  getFacebookCampaigns,
} from "@/lib/db/queries"

export async function onConnectFacebookPage(data: {
  pageId: string
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  pageName: string
  category?: string
  profilePicture?: string
  webhookToken?: string
}) {
  try {
    const user = await onCurrentUser()
    const page = await createFacebookPage(user.id, data)
    return { status: 200, data: page }
  } catch (error) {
    console.error("Error connecting Facebook page:", error)
    return { status: 500, error: "Failed to connect Facebook page" }
  }
}

export async function onGetFacebookPages() {
  try {
    const user = await onCurrentUser()
    const pages = await getFacebookPagesByUser(user.id)
    return { status: 200, data: pages }
  } catch (error) {
    console.error("Error fetching Facebook pages:", error)
    return { status: 500, error: "Failed to fetch Facebook pages" }
  }
}

export async function onDisconnectFacebookPage(pageId: string) {
  try {
    const user = await onCurrentUser()
    const pages = await getFacebookPagesByUser(user.id)
    const exists = pages.some((p) => p.id === pageId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    await deleteFacebookPage(pageId)
    return { status: 200 }
  } catch (error) {
    console.error("Error disconnecting Facebook page:", error)
    return { status: 500, error: "Failed to disconnect Facebook page" }
  }
}

export async function onCreateFacebookAutomation(
  pageId: string,
  data: {
    name: string
    trigger: string
    triggerValue?: string
    responseType: string
    responseContent: string
    isActive?: boolean
    businessHoursOnly?: boolean
    priority?: number
  },
) {
  try {
    const user = await onCurrentUser()
    const pages = await getFacebookPagesByUser(user.id)
    const exists = pages.some((p) => p.id === pageId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const rule = await createFacebookAutomationRule(pageId, data)
    return { status: 200, data: rule }
  } catch (error) {
    console.error("Error creating Facebook automation:", error)
    return { status: 500, error: "Failed to create automation" }
  }
}

export async function onGetFacebookAutomations(pageId: string) {
  try {
    const user = await onCurrentUser()
    const pages = await getFacebookPagesByUser(user.id)
    const exists = pages.some((p) => p.id === pageId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const rules = await getFacebookAutomationRules(pageId)
    return { status: 200, data: rules }
  } catch (error) {
    console.error("Error fetching Facebook automations:", error)
    return { status: 500, error: "Failed to fetch automations" }
  }
}

export async function onUpdateFacebookAutomation(ruleId: string, data: Partial<any>) {
  try {
    const rule = await updateFacebookAutomationRule(ruleId, data)
    return { status: 200, data: rule }
  } catch (error) {
    console.error("Error updating Facebook automation:", error)
    return { status: 500, error: "Failed to update automation" }
  }
}

export async function onDeleteFacebookAutomation(ruleId: string) {
  try {
    await deleteFacebookAutomationRule(ruleId)
    return { status: 200 }
  } catch (error) {
    console.error("Error deleting Facebook automation:", error)
    return { status: 500, error: "Failed to delete automation" }
  }
}

export async function onCreateFacebookCampaign(
  pageId: string,
  data: {
    name: string
    description?: string
    campaignType: string
    targetAudience: any
    messageTemplate: string
    status?: string
    scheduledAt?: Date
  },
) {
  try {
    const user = await onCurrentUser()
    const pages = await getFacebookPagesByUser(user.id)
    const exists = pages.some((p) => p.id === pageId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const campaign = await createFacebookCampaign(pageId, data)
    return { status: 200, data: campaign }
  } catch (error) {
    console.error("Error creating Facebook campaign:", error)
    return { status: 500, error: "Failed to create campaign" }
  }
}

export async function onGetFacebookCampaigns(pageId: string) {
  try {
    const user = await onCurrentUser()
    const pages = await getFacebookPagesByUser(user.id)
    const exists = pages.some((p) => p.id === pageId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const campaigns = await getFacebookCampaigns(pageId)
    return { status: 200, data: campaigns }
  } catch (error) {
    console.error("Error fetching Facebook campaigns:", error)
    return { status: 500, error: "Failed to fetch campaigns" }
  }
}
