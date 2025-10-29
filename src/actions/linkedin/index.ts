// "use server"

// import { onUserInfor } from "../user"
// import {
//   createLinkedInAccount,
//   getLinkedInAccountsByUser,
//   deleteLinkedInAccount,
//   createLinkedInAutomationRule,
//   getLinkedInAutomationRules,
//   updateLinkedInAutomationRule,
//   deleteLinkedInAutomationRule,
//   createLinkedInCampaign,
//   getLinkedInCampaigns,
// } from "@/lib/db/queries"

// export async function onConnectLinkedInAccount(data: {
//   linkedInId: string
//   accessToken: string
//   refreshToken?: string
//   expiresAt?: Date
//   profileUrl?: string
//   firstName?: string
//   lastName?: string
//   headline?: string
//   profilePicture?: string
// }) {
//   try {
//     const user = await onCurrentUser()
//     const account = await createLinkedInAccount(user.id, data)
//     return { status: 200, data: account }
//   } catch (error) {
//     console.error("Error connecting LinkedIn account:", error)
//     return { status: 500, error: "Failed to connect LinkedIn account" }
//   }
// }

// export async function onGetLinkedInAccounts() {
//   try {
//     const user = await onCurrentUser()
//     const accounts = await getLinkedInAccountsByUser(user.id)
//     return { status: 200, data: accounts }
//   } catch (error) {
//     console.error("Error fetching LinkedIn accounts:", error)
//     return { status: 500, error: "Failed to fetch LinkedIn accounts" }
//   }
// }

// export async function onDisconnectLinkedInAccount(accountId: string) {
//   try {
//     const user = await onCurrentUser()
//     const account = await getLinkedInAccountsByUser(user.id)
//     const exists = account.some((a) => a.id === accountId)
//     if (!exists) return { status: 403, error: "Unauthorized" }
//     await deleteLinkedInAccount(accountId)
//     return { status: 200 }
//   } catch (error) {
//     console.error("Error disconnecting LinkedIn account:", error)
//     return { status: 500, error: "Failed to disconnect LinkedIn account" }
//   }
// }

// export async function onCreateLinkedInAutomation(
//   accountId: string,
//   data: {
//     name: string
//     trigger: string
//     triggerValue?: string
//     responseType: string
//     responseContent: string
//     isActive?: boolean
//     businessHoursOnly?: boolean
//     priority?: number
//   },
// ) {
//   try {
//     const user = await onCurrentUser()
//     const accounts = await getLinkedInAccountsByUser(user.id)
//     const exists = accounts.some((a) => a.id === accountId)
//     if (!exists) return { status: 403, error: "Unauthorized" }
//     const rule = await createLinkedInAutomationRule(accountId, data)
//     return { status: 200, data: rule }
//   } catch (error) {
//     console.error("Error creating LinkedIn automation:", error)
//     return { status: 500, error: "Failed to create automation" }
//   }
// }

// export async function onGetLinkedInAutomations(accountId: string) {
//   try {
//     const user = await onCurrentUser()
//     const accounts = await getLinkedInAccountsByUser(user.id)
//     const exists = accounts.some((a) => a.id === accountId)
//     if (!exists) return { status: 403, error: "Unauthorized" }
//     const rules = await getLinkedInAutomationRules(accountId)
//     return { status: 200, data: rules }
//   } catch (error) {
//     console.error("Error fetching LinkedIn automations:", error)
//     return { status: 500, error: "Failed to fetch automations" }
//   }
// }

// export async function onUpdateLinkedInAutomation(ruleId: string, data: Partial<any>) {
//   try {
//     const user = await onCurrentUser()
//     const rule = await updateLinkedInAutomationRule(ruleId, data)
//     return { status: 200, data: rule }
//   } catch (error) {
//     console.error("Error updating LinkedIn automation:", error)
//     return { status: 500, error: "Failed to update automation" }
//   }
// }

// export async function onDeleteLinkedInAutomation(ruleId: string) {
//   try {
//     await deleteLinkedInAutomationRule(ruleId)
//     return { status: 200 }
//   } catch (error) {
//     console.error("Error deleting LinkedIn automation:", error)
//     return { status: 500, error: "Failed to delete automation" }
//   }
// }

// export async function onCreateLinkedInCampaign(
//   accountId: string,
//   data: {
//     name: string
//     description?: string
//     campaignType: string
//     targetAudience: any
//     messageTemplate: string
//     status?: string
//     scheduledAt?: Date
//   },
// ) {
//   try {
//     const user = await onCurrentUser()
//     const accounts = await getLinkedInAccountsByUser(user.id)
//     const exists = accounts.some((a) => a.id === accountId)
//     if (!exists) return { status: 403, error: "Unauthorized" }
//     const campaign = await createLinkedInCampaign(accountId, data)
//     return { status: 200, data: campaign }
//   } catch (error) {
//     console.error("Error creating LinkedIn campaign:", error)
//     return { status: 500, error: "Failed to create campaign" }
//   }
// }

// export async function onGetLinkedInCampaigns(accountId: string) {
//   try {
//     const user = await onCurrentUser()
//     const accounts = await getLinkedInAccountsByUser(user.id)
//     const exists = accounts.some((a) => a.id === accountId)
//     if (!exists) return { status: 403, error: "Unauthorized" }
//     const campaigns = await getLinkedInCampaigns(accountId)
//     return { status: 200, data: campaigns }
//   } catch (error) {
//     console.error("Error fetching LinkedIn campaigns:", error)
//     return { status: 500, error: "Failed to fetch campaigns" }
//   }
// }


"use server"

import { onUserInfor } from "../user"
import {
  createLinkedInAccount,
  getLinkedInAccountsByUser,
  deleteLinkedInAccount,
  createLinkedInAutomationRule,
  getLinkedInAutomationRules,
  updateLinkedInAutomationRule,
  deleteLinkedInAutomationRule,
  createLinkedInCampaign,
  getLinkedInCampaigns,
} from "@/lib/db/queries"

export async function onConnectLinkedInAccount(data: {
  linkedInId: string
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  profileUrl?: string
  firstName?: string
  lastName?: string
  headline?: string
  profilePicture?: string
}) {
  try {
    const user = await onUserInfor()
    const account = await createLinkedInAccount(user.data?.id||"", data)
    return { status: 200, data: account }
  } catch (error) {
    console.error("Error connecting LinkedIn account:", error)
    return { status: 500, error: "Failed to connect LinkedIn account" }
  }
}

export async function onGetLinkedInAccounts() {
  try {
    const user = await onUserInfor()
    const accounts = await getLinkedInAccountsByUser(user.data?.id||"")
    return { status: 200, data: accounts }
  } catch (error) {
    console.error("Error fetching LinkedIn accounts:", error)
    return { status: 500, error: "Failed to fetch LinkedIn accounts" }
  }
}

export async function onDisconnectLinkedInAccount(accountId: string) {
  try {
    const user = await onUserInfor()
    const account = await getLinkedInAccountsByUser(user.data?.id||"")
    const exists = account.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    await deleteLinkedInAccount(accountId)
    return { status: 200 }
  } catch (error) {
    console.error("Error disconnecting LinkedIn account:", error)
    return { status: 500, error: "Failed to disconnect LinkedIn account" }
  }
}

export async function onCreateLinkedInAutomation(
  accountId: string,
  data: {
    name: string
    trigger: string
    triggerValue?: string
    responseType: string
    responseContent: string
    isActive?: boolean
    businessHoursOnly?: boolean
    priority?: number
    useVoiceflow?: boolean
    voiceflowApiKey?: string
    voiceflowBotId?: string
  },
) {
  try {
    const user = await onUserInfor()
    const accounts = await getLinkedInAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }

    const automationData = {
      name: data.name,
      trigger: data.trigger,
      triggerValue: data.triggerValue,
      responseType: data.responseType,
      responseContent: data.responseContent,
      isActive: data.isActive ?? true,
      businessHoursOnly: data.businessHoursOnly ?? false,
      priority: data.priority ?? 1,
      voiceflowConfig: data.useVoiceflow
        ? JSON.stringify({
            enabled: true,
            apiKey: data.voiceflowApiKey,
            botId: data.voiceflowBotId,
          })
        : undefined,
    }

    const rule = await createLinkedInAutomationRule(accountId, automationData)
    return { status: 200, data: rule }
  } catch (error) {
    console.error("Error creating LinkedIn automation:", error)
    return { status: 500, error: "Failed to create automation" }
  }
}

export async function onGetLinkedInAutomations(accountId: string) {
  try {
    const user = await onUserInfor()
    const accounts = await getLinkedInAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const rules = await getLinkedInAutomationRules(accountId)
    return { status: 200, data: rules }
  } catch (error) {
    console.error("Error fetching LinkedIn automations:", error)
    return { status: 500, error: "Failed to fetch automations" }
  }
}

export async function onUpdateLinkedInAutomation(ruleId: string, data: Partial<any>) {
  try {
    const user = await onUserInfor()
    const rule = await updateLinkedInAutomationRule(ruleId, data)
    return { status: 200, data: rule }
  } catch (error) {
    console.error("Error updating LinkedIn automation:", error)
    return { status: 500, error: "Failed to update automation" }
  }
}

export async function onDeleteLinkedInAutomation(ruleId: string) {
  try {
    await deleteLinkedInAutomationRule(ruleId)
    return { status: 200 }
  } catch (error) {
    console.error("Error deleting LinkedIn automation:", error)
    return { status: 500, error: "Failed to delete automation" }
  }
}

export async function onCreateLinkedInCampaign(
  accountId: string,
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
    const user = await onUserInfor()
    const accounts = await getLinkedInAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const campaign = await createLinkedInCampaign(accountId, data)
    return { status: 200, data: campaign }
  } catch (error) {
    console.error("Error creating LinkedIn campaign:", error)
    return { status: 500, error: "Failed to create campaign" }
  }
}

export async function onGetLinkedInCampaigns(accountId: string) {
  try {
    const user = await onUserInfor()
    const accounts = await getLinkedInAccountsByUser(user.data?.id||"")
    const exists = accounts.some((a) => a.id === accountId)
    if (!exists) return { status: 403, error: "Unauthorized" }
    const campaigns = await getLinkedInCampaigns(accountId)
    return { status: 200, data: campaigns }
  } catch (error) {
    console.error("Error fetching LinkedIn campaigns:", error)
    return { status: 500, error: "Failed to fetch campaigns" }
  }
}

