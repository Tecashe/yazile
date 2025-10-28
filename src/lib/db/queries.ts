import { prisma } from "@/lib/prisma"
import type {
  LinkedInAccount,
  WhatsAppAccount,
  FacebookPage,
  LinkedInAutomationRule,
  WhatsAppAutomationRule,
  FacebookAutomationRule,
} from "@prisma/client"

// ============================================================================
// LINKEDIN QUERIES
// ============================================================================

export async function createLinkedInAccount(
  userId: string,
  data: {
    linkedInId: string
    accessToken: string
    refreshToken?: string
    expiresAt?: Date
    profileUrl?: string
    firstName?: string
    lastName?: string
    headline?: string
    profilePicture?: string
  },
): Promise<LinkedInAccount> {
  return prisma.linkedInAccount.create({
    data: {
      userId,
      ...data,
    },
  })
}

export async function getLinkedInAccount(accountId: string): Promise<LinkedInAccount | null> {
  return prisma.linkedInAccount.findUnique({
    where: { id: accountId },
  })
}

export async function getLinkedInAccountsByUser(userId: string): Promise<LinkedInAccount[]> {
  return prisma.linkedInAccount.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateLinkedInAccount(
  accountId: string,
  data: Partial<LinkedInAccount>,
): Promise<LinkedInAccount> {
  return prisma.linkedInAccount.update({
    where: { id: accountId },
    data,
  })
}

export async function deleteLinkedInAccount(accountId: string): Promise<void> {
  await prisma.linkedInAccount.delete({
    where: { id: accountId },
  })
}

export async function createLinkedInAutomationRule(
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
  },
): Promise<LinkedInAutomationRule> {
  return prisma.linkedInAutomationRule.create({
    data: {
      linkedInAccountId: accountId,
      ...data,
    },
  })
}

export async function getLinkedInAutomationRules(accountId: string): Promise<LinkedInAutomationRule[]> {
  return prisma.linkedInAutomationRule.findMany({
    where: { linkedInAccountId: accountId },
    orderBy: { priority: "desc" },
  })
}

export async function updateLinkedInAutomationRule(
  ruleId: string,
  data: Partial<LinkedInAutomationRule>,
): Promise<LinkedInAutomationRule> {
  return prisma.linkedInAutomationRule.update({
    where: { id: ruleId },
    data,
  })
}

export async function deleteLinkedInAutomationRule(ruleId: string): Promise<void> {
  await prisma.linkedInAutomationRule.delete({
    where: { id: ruleId },
  })
}

export async function createLinkedInCampaign(
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
): Promise<any> {
  return prisma.linkedInCampaign.create({
    data: {
      linkedInAccountId: accountId,
      ...data,
    },
  })
}

export async function getLinkedInCampaigns(accountId: string): Promise<any[]> {
  return prisma.linkedInCampaign.findMany({
    where: { linkedInAccountId: accountId },
    orderBy: { createdAt: "desc" },
  })
}

// ============================================================================
// WHATSAPP QUERIES
// ============================================================================

export async function createWhatsAppAccount(
  userId: string,
  data: {
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
  },
): Promise<WhatsAppAccount> {
  return prisma.whatsAppAccount.create({
    data: {
      userId,
      ...data,
    },
  })
}

export async function getWhatsAppAccount(accountId: string): Promise<WhatsAppAccount | null> {
  return prisma.whatsAppAccount.findUnique({
    where: { id: accountId },
  })
}

export async function getWhatsAppAccountsByUser(userId: string): Promise<WhatsAppAccount[]> {
  return prisma.whatsAppAccount.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateWhatsAppAccount(
  accountId: string,
  data: Partial<WhatsAppAccount>,
): Promise<WhatsAppAccount> {
  return prisma.whatsAppAccount.update({
    where: { id: accountId },
    data,
  })
}

export async function deleteWhatsAppAccount(accountId: string): Promise<void> {
  await prisma.whatsAppAccount.delete({
    where: { id: accountId },
  })
}

export async function createWhatsAppTemplate(
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
): Promise<any> {
  return prisma.whatsAppTemplate.create({
    data: {
      whatsAppAccountId: accountId,
      ...data,
    },
  })
}

export async function getWhatsAppTemplates(accountId: string): Promise<any[]> {
  return prisma.whatsAppTemplate.findMany({
    where: { whatsAppAccountId: accountId },
    orderBy: { createdAt: "desc" },
  })
}

export async function createWhatsAppAutomationRule(
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
): Promise<WhatsAppAutomationRule> {
  return prisma.whatsAppAutomationRule.create({
    data: {
      whatsAppAccountId: accountId,
      ...data,
    },
  })
}

export async function getWhatsAppAutomationRules(accountId: string): Promise<WhatsAppAutomationRule[]> {
  return prisma.whatsAppAutomationRule.findMany({
    where: { whatsAppAccountId: accountId },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateWhatsAppAutomationRule(
  ruleId: string,
  data: Partial<WhatsAppAutomationRule>,
): Promise<WhatsAppAutomationRule> {
  return prisma.whatsAppAutomationRule.update({
    where: { id: ruleId },
    data,
  })
}

export async function deleteWhatsAppAutomationRule(ruleId: string): Promise<void> {
  await prisma.whatsAppAutomationRule.delete({
    where: { id: ruleId },
  })
}

export async function createWhatsAppCampaign(
  accountId: string,
  data: {
    name: string
    description?: string
    templateId?: string
    targetAudience: any
    status?: string
    scheduledAt?: Date
  },
): Promise<any> {
  return prisma.whatsAppCampaign.create({
    data: {
      whatsAppAccountId: accountId,
      ...data,
    },
  })
}

export async function getWhatsAppCampaigns(accountId: string): Promise<any[]> {
  return prisma.whatsAppCampaign.findMany({
    where: { whatsAppAccountId: accountId },
    orderBy: { createdAt: "desc" },
  })
}

// ============================================================================
// FACEBOOK QUERIES
// ============================================================================

export async function createFacebookPage(
  userId: string,
  data: {
    pageId: string
    accessToken: string
    refreshToken?: string
    expiresAt?: Date
    pageName: string
    category?: string
    profilePicture?: string
    webhookToken?: string
  },
): Promise<FacebookPage> {
  return prisma.facebookPage.create({
    data: {
      userId,
      ...data,
    },
  })
}

export async function getFacebookPage(pageId: string): Promise<FacebookPage | null> {
  return prisma.facebookPage.findUnique({
    where: { id: pageId },
  })
}

export async function getFacebookPagesByUser(userId: string): Promise<FacebookPage[]> {
  return prisma.facebookPage.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateFacebookPage(pageId: string, data: Partial<FacebookPage>): Promise<FacebookPage> {
  return prisma.facebookPage.update({
    where: { id: pageId },
    data,
  })
}

export async function deleteFacebookPage(pageId: string): Promise<void> {
  await prisma.facebookPage.delete({
    where: { id: pageId },
  })
}

export async function createFacebookAutomationRule(
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
): Promise<FacebookAutomationRule> {
  return prisma.facebookAutomationRule.create({
    data: {
      facebookPageId: pageId,
      ...data,
    },
  })
}

export async function getFacebookAutomationRules(pageId: string): Promise<FacebookAutomationRule[]> {
  return prisma.facebookAutomationRule.findMany({
    where: { facebookPageId: pageId },
    orderBy: { priority: "desc" },
  })
}

export async function updateFacebookAutomationRule(
  ruleId: string,
  data: Partial<FacebookAutomationRule>,
): Promise<FacebookAutomationRule> {
  return prisma.facebookAutomationRule.update({
    where: { id: ruleId },
    data,
  })
}

export async function deleteFacebookAutomationRule(ruleId: string): Promise<void> {
  await prisma.facebookAutomationRule.delete({
    where: { id: ruleId },
  })
}

export async function createFacebookCampaign(
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
): Promise<any> {
  return prisma.facebookCampaign.create({
    data: {
      facebookPageId: pageId,
      ...data,
    },
  })
}

export async function getFacebookCampaigns(pageId: string): Promise<any[]> {
  return prisma.facebookCampaign.findMany({
    where: { facebookPageId: pageId },
    orderBy: { createdAt: "desc" },
  })
}
