"use server"

import { client } from "@/lib/prisma"

export async function getBusinessProfileForAutomation(automationId: string) {
  try {
    // Get business profile description
    const businessProfile = await client.businessProfileDescription.findUnique({
      where: { automationId },
    })

    // Get automation with business details
    const automation = await client.automation.findUnique({
      where: { id: automationId },
      include: {
        User: {
          include: {
            businesses: true,
          },
        },
      },
    })

    const business = automation?.User?.businesses?.[0]

    return {
      profileContent: businessProfile?.content || "We are a professional business ready to help you with your needs.",
      businessContext: {
        businessName: business?.businessName || "Our Business",
        industry: business?.industry || "General",
        welcomeMessage: business?.welcomeMessage || "Welcome! How can we help you today?",
        responseLanguage: business?.responseLanguage || "English",
        businessDescription: business?.businessDescription || "",
        targetAudience: business?.targetAudience || "",
        promotionMessage: business?.promotionMessage || "",
      },
    }
  } catch (error) {
    console.error("Error getting business profile:", error)
    return {
      profileContent: "We are a professional business ready to help you with your needs.",
      businessContext: {
        businessName: "Our Business",
        industry: "General",
        welcomeMessage: "Welcome! How can we help you today?",
        responseLanguage: "English",
        businessDescription: "",
        targetAudience: "",
        promotionMessage: "",
      },
    }
  }
}

// Get or create default automation for unmatched messages
export async function getOrCreateDefaultAutomation(pageId: string) {
  try {
    // Find user by Instagram page ID
    const integration = await client.integrations.findFirst({
      where: { instagramId: pageId },
      include: {
        User: {
          include: {
            subscription: true,
          },
        },
      },
    })

    if (!integration?.User) {
      console.log("❌ No user found for page ID:", pageId)
      return null
    }

    // Look for existing default automation
    let defaultAutomation = await client.automation.findFirst({
      where: {
        userId: integration.User.id,
        name: "Default Conversation Handler",
        active: true,
      },
      include: {
        User: {
          select: {
            id: true,
            subscription: { select: { plan: true } },
            integrations: { select: { token: true } },
          },
        },
        listener: true,
        trigger: true,
      },
    })

    // Create default automation if it doesn't exist
    if (!defaultAutomation) {
      console.log("🔧 Creating default automation for user:", integration.User.id)

      defaultAutomation = await client.automation.create({
        data: {
          name: "Default Conversation Handler",
          active: true,
          userId: integration.User.id,
          listener: {
            create: {
              listener: "SMARTAI",
              prompt:
                "You are a helpful customer service representative. Respond naturally and professionally to customer inquiries.",
            },
          },
          trigger: {
            create: [
              {
                type: "DM",
                isActive: true,
              },
              {
                type: "COMMENT",
                isActive: true,
              },
            ],
          },
        },
        include: {
          User: {
            select: {
              id: true,
              subscription: { select: { plan: true } },
              integrations: { select: { token: true } },
            },
          },
          listener: true,
          trigger: true,
        },
      })

      console.log("✅ Default automation created:", defaultAutomation.id)
    }

    return defaultAutomation
  } catch (error) {
    console.error("❌ Error getting/creating default automation:", error)
    return null
  }
}
