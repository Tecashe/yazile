"use server"

import { onUserInfor } from "../user"
import {
  createWhatsAppAccount,
  getWhatsAppAccountsByUser,
  deleteWhatsAppAccount,
  createWhatsAppTemplate,
  getWhatsAppTemplates,
  createWhatsAppAutomationRule,
  getWhatsAppAutomationRules,
  updateWhatsAppAutomationRule,
  deleteWhatsAppAutomationRule,
  createWhatsAppCampaign,
  getWhatsAppCampaigns,
} from "@/lib/db/queries"

export async function onConnectWhatsAppAccount(data: {
  wabaId: string
  businessPhoneNumberId: string
  phoneNumber: string
  displayName?: string
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  appId: string
  appSecret: string
  webhookToken?: string
}) {
  try {
    const user = await onUserInfor()
    const account = await createWhatsAppAccount(user.data?.id||"", data)
    return { status: 200, data: account }
  } catch (error) {
    console.error("Error connecting WhatsApp account:", error)
    return { status: 500, error: "Failed to connect WhatsApp account" }
  }
}

export async function onGetWhatsAppAccounts() {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    return { status: 200, data: accounts }
  } catch (error) {
    console.error("Error fetching WhatsApp accounts:", error)
    return { status: 500, error: "Failed to fetch WhatsApp accounts" }
  }
}

export async function onDisconnectWhatsAppAccount(accountId: string) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    await deleteWhatsAppAccount(accountId)
    return { status: 200 }
  } catch (error) {
    console.error("Error disconnecting WhatsApp account:", error)
    return { status: 500, error: "Failed to disconnect WhatsApp account" }
  }
}

export async function onCreateWhatsAppTemplate(
  accountId: string,
  data: {
    templateName: string
    templateId: string
    language: string
    category: string
    status: string
    headerType?: string
    headerText?: string
    bodyText: string
    footerText?: string
    buttonType?: string
    buttonText?: string
    buttonUrl?: string
  },
) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const template = await createWhatsAppTemplate(accountId, data)
    return { status: 200, data: template }
  } catch (error) {
    console.error("Error creating WhatsApp template:", error)
    return { status: 500, error: "Failed to create template" }
  }
}

export async function onGetWhatsAppTemplates(accountId: string) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const templates = await getWhatsAppTemplates(accountId)
    return { status: 200, data: templates }
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error)
    return { status: 500, error: "Failed to fetch templates" }
  }
}

export async function onCreateWhatsAppAutomation(
  accountId: string,
  data: {
    name: string
    trigger: string
    triggerValue?: string
    responseType: string
    responseContent: string
    responseTemplateId?: string
    isActive?: boolean
    businessHoursOnly?: boolean
    delayMinutes?: number
    maxResponses?: number
  },
) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const rule = await createWhatsAppAutomationRule(accountId, data)
    return { status: 200, data: rule }
  } catch (error) {
    console.error("Error creating WhatsApp automation:", error)
    return { status: 500, error: "Failed to create automation" }
  }
}

export async function onGetWhatsAppAutomations(accountId: string) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const rules = await getWhatsAppAutomationRules(accountId)
    return { status: 200, data: rules }
  } catch (error) {
    console.error("Error fetching WhatsApp automations:", error)
    return { status: 500, error: "Failed to fetch automations" }
  }
}

export async function onUpdateWhatsAppAutomation(ruleId: string, data: Partial<any>) {
  try {
    const rule = await updateWhatsAppAutomationRule(ruleId, data)
    return { status: 200, data: rule }
  } catch (error) {
    console.error("Error updating WhatsApp automation:", error)
    return { status: 500, error: "Failed to update automation" }
  }
}

export async function onDeleteWhatsAppAutomation(ruleId: string) {
  try {
    await deleteWhatsAppAutomationRule(ruleId)
    return { status: 200 }
  } catch (error) {
    console.error("Error deleting WhatsApp automation:", error)
    return { status: 500, error: "Failed to delete automation" }
  }
}

export async function onCreateWhatsAppCampaign(
  accountId: string,
  data: {
    name: string
    description?: string
    templateId?: string
    targetAudience: any
    status?: string
    scheduledAt?: Date
  },
) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const campaign = await createWhatsAppCampaign(accountId, data)
    return { status: 200, data: campaign }
  } catch (error) {
    console.error("Error creating WhatsApp campaign:", error)
    return { status: 500, error: "Failed to create campaign" }
  }
}

export async function onGetWhatsAppCampaigns(accountId: string) {
  try {
    const user = await onUserInfor()
    const accounts = await getWhatsAppAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const campaigns = await getWhatsAppCampaigns(accountId)
    return { status: 200, data: campaigns }
  } catch (error) {
    console.error("Error fetching WhatsApp campaigns:", error)
    return { status: 500, error: "Failed to fetch campaigns" }
  }
}
