"use server"

import { client } from "@/lib/prisma"

export async function getBusinessProfileForAutomation(automationId: string) {
  try {
    // Get business directly using automationId since Business has automationId field
    const business = await client.business.findUnique({
      where: { automationId },
      include: {
        User: true,
      },
    })

    if (!business) {
      // Fallback to finding automation and then business through userId
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

      const fallbackBusiness = automation?.User?.businesses?.[0]

      return {
        profileContent: fallbackBusiness?.businessDescription || "We are a professional business ready to help you with your needs.",
        businessContext: {
          businessName: fallbackBusiness?.businessName || "Our Business",
          businessType: fallbackBusiness?.businessType || "Service",
          website: fallbackBusiness?.website || "",
          responseLanguage: fallbackBusiness?.responseLanguage || "English",
          businessDescription: fallbackBusiness?.businessDescription || "",
          name: fallbackBusiness?.name || "",
        },
      }
    }

    return {
      profileContent: business.businessDescription || "We are a professional business ready to help you with your needs.",
      businessContext: {
        businessName: business.businessName || "Our Business",
        businessType: business.businessType || "Service",
        website: business.website || "",
        responseLanguage: business.responseLanguage || "English",
        businessDescription: business.businessDescription || "",
        name: business.name || "",
      },
    }
  } catch (error) {
    console.error("Error getting business profile:", error)
    return {
      profileContent: "We are a professional business ready to help you with your needs.",
      businessContext: {
        businessName: "Our Business",
        businessType: "Service",
        website: "",
        responseLanguage: "English",
        businessDescription: "",
        name: "",
      },
    }
  }
}

// Get or create default automation for unmatched messages
export async function getOrCreateDefaultAutomation(pageId: string) {
  try {
    // Find user by Instagram page ID
    const integration = await client.integrations.findFirst({
      where: { pageId: pageId },
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
    // let defaultAutomation = await client.automation.findFirst({
    //   where: {
    //     userId: integration.User.id,
    //     name: "Default Conversation Handler",
    //     active: true,
    //   },
    //   include: {
    //     User: {
    //       select: {
    //         id: true,
    //         subscription: { select: { plan: true } },
    //         integrations: { select: { token: true } },
    //       },
    //     },
    //     listener: true,
    //     trigger: true,
    //   },
    // })



    // Look for existing fallback automation for this platform
let defaultAutomation = await client.automation.findFirst({
  where: {
    userId: integration.User.id,
    isFallback: true,
    platform: "INSTAGRAM", // Match the platform
  
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
    // if (!defaultAutomation) {
    //   console.log("🔧 Creating default automation for user:", integration.User.id)

    //   defaultAutomation = await client.automation.create({
    //     data: {
    //       name: "Default Conversation Handler",
    //       active: true,
    //       userId: integration.User.id,
    //       listener: {
    //         create: {
    //           listener: "SMARTAI",
    //           prompt:
    //             "You are a helpful customer service representative. Respond naturally and professionally to customer inquiries.",
    //         },
    //       },
    //       trigger: {
    //         create: [
    //           {
    //             type: "DM",
    //             isActive: true,
    //           },
    //           {
    //             type: "COMMENT",
    //             isActive: true,
    //           },
    //         ],
    //       },
    //     },
    //     include: {
    //       User: {
    //         select: {
    //           id: true,
    //           subscription: { select: { plan: true } },
    //           integrations: { select: { token: true } },
    //         },
    //       },
    //       listener: true,
    //       trigger: true,
    //     },
    //   })

    //   console.log("✅ Default automation created:", defaultAutomation.id)
    // }
    if (!defaultAutomation) {
  console.log("🔧 Creating default automation for user:", integration.User.id)

  defaultAutomation = await client.automation.create({
    data: {
      name: "Default Conversation Handler",
      active: true,
      isFallback: true, // Add this
      platform: "INSTAGRAM", // Add this
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