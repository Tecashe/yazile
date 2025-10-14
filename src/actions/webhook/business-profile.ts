// "use server"

// import { client } from "@/lib/prisma"

// export async function getBusinessProfileForAutomation(automationId: string) {
//   try {
//     // Get business directly using automationId since Business has automationId field
//     const business = await client.business.findUnique({
//       where: { automationId },
//       include: {
//         User: true,
//       },
//     })

//     if (!business) {
//       // Fallback to finding automation and then business through userId
//       const automation = await client.automation.findUnique({
//         where: { id: automationId },
//         include: {
//           User: {
//             include: {
//               businesses: true,
//             },
//           },
//         },
//       })

//       const fallbackBusiness = automation?.User?.businesses?.[0]

//       return {
//         profileContent: fallbackBusiness?.businessDescription || "We are a professional business ready to help you with your needs.",
//         businessContext: {
//           businessName: fallbackBusiness?.businessName || "Our Business",
//           businessType: fallbackBusiness?.businessType || "Service",
//           website: fallbackBusiness?.website || "",
//           responseLanguage: fallbackBusiness?.responseLanguage || "English",
//           businessDescription: fallbackBusiness?.businessDescription || "",
//           name: fallbackBusiness?.name || "",
//         },
//       }
//     }

//     return {
//       profileContent: business.businessDescription || "We are a professional business ready to help you with your needs.",
//       businessContext: {
//         businessName: business.businessName || "Our Business",
//         businessType: business.businessType || "Service",
//         website: business.website || "",
//         responseLanguage: business.responseLanguage || "English",
//         businessDescription: business.businessDescription || "",
//         name: business.name || "",
//       },
//     }
//   } catch (error) {
//     console.error("Error getting business profile:", error)
//     return {
//       profileContent: "We are a professional business ready to help you with your needs.",
//       businessContext: {
//         businessName: "Our Business",
//         businessType: "Service",
//         website: "",
//         responseLanguage: "English",
//         businessDescription: "",
//         name: "",
//       },
//     }
//   }
// }

// // Get or create default automation for unmatched messages
// export async function getOrCreateDefaultAutomation(instagramId: string) {
//   try {
//     // Find user by Instagram page ID
//     const integration = await client.integrations.findFirst({
//       where: { instagramId: instagramId },
//       include: {
//         User: {
//           include: {
//             subscription: true,
//           },
//         },
//       },
//     })

//     if (!integration?.User) {
//       console.log("❌ No user found for page ID:", instagramId)
//       return null
//     }

//     // Look for existing default automation
//     // let defaultAutomation = await client.automation.findFirst({
//     //   where: {
//     //     userId: integration.User.id,
//     //     name: "Default Conversation Handler",
//     //     active: true,
//     //   },
//     //   include: {
//     //     User: {
//     //       select: {
//     //         id: true,
//     //         subscription: { select: { plan: true } },
//     //         integrations: { select: { token: true } },
//     //       },
//     //     },
//     //     listener: true,
//     //     trigger: true,
//     //   },
//     // })



//     // Look for existing fallback automation for this platform
// let defaultAutomation = await client.automation.findFirst({
//   where: {
//     userId: integration.User.id,
//     isFallback: true,
//     platform: "INSTAGRAM", // Match the platform
  
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









//     // Create default automation if it doesn't exist
//     // if (!defaultAutomation) {
//     //   console.log("🔧 Creating default automation for user:", integration.User.id)

//     //   defaultAutomation = await client.automation.create({
//     //     data: {
//     //       name: "Default Conversation Handler",
//     //       active: true,
//     //       userId: integration.User.id,
//     //       listener: {
//     //         create: {
//     //           listener: "SMARTAI",
//     //           prompt:
//     //             "You are a helpful customer service representative. Respond naturally and professionally to customer inquiries.",
//     //         },
//     //       },
//     //       trigger: {
//     //         create: [
//     //           {
//     //             type: "DM",
//     //             isActive: true,
//     //           },
//     //           {
//     //             type: "COMMENT",
//     //             isActive: true,
//     //           },
//     //         ],
//     //       },
//     //     },
//     //     include: {
//     //       User: {
//     //         select: {
//     //           id: true,
//     //           subscription: { select: { plan: true } },
//     //           integrations: { select: { token: true } },
//     //         },
//     //       },
//     //       listener: true,
//     //       trigger: true,
//     //     },
//     //   })

//     //   console.log("✅ Default automation created:", defaultAutomation.id)
//     // }
//     if (!defaultAutomation) {
//   console.log("🔧 Creating default automation for user:", integration.User.id)

//   defaultAutomation = await client.automation.create({
//     data: {
//       name: "Default Conversation Handler",
//       active: true,
//       isFallback: true, // Add this
//       platform: "INSTAGRAM", // Add this
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

//     return defaultAutomation
//   } catch (error) {
//     console.error("❌ Error getting/creating default automation:", error)
//     return null
//   }
// }


// "use server"

// import { client } from "@/lib/prisma"

// export async function getBusinessProfileForAutomation(automationId: string) {
//   try {
//     // Get business directly using automationId since Business has automationId field
//     const business = await client.business.findUnique({
//       where: { automationId },
//       include: {
//         User: true,
//       },
//     })

//     if (!business) {
//       // Fallback to finding automation and then business through userId
//       const automation = await client.automation.findUnique({
//         where: { id: automationId },
//         include: {
//           User: {
//             include: {
//               businesses: true,
//             },
//           },
//         },
//       })

//       const fallbackBusiness = automation?.User?.businesses?.[0]

//       return {
//         profileContent: fallbackBusiness?.businessDescription || "We are a professional business ready to help you with your needs.",
//         businessContext: {
//           businessName: fallbackBusiness?.businessName || "Our Business",
//           businessType: fallbackBusiness?.businessType || "Service",
//           website: fallbackBusiness?.website || "",
//           responseLanguage: fallbackBusiness?.responseLanguage || "English",
//           businessDescription: fallbackBusiness?.businessDescription || "",
//           name: fallbackBusiness?.name || "",
//         },
//       }
//     }

//     return {
//       profileContent: business.businessDescription || "We are a professional business ready to help you with your needs.",
//       businessContext: {
//         businessName: business.businessName || "Our Business",
//         businessType: business.businessType || "Service",
//         website: business.website || "",
//         responseLanguage: business.responseLanguage || "English",
//         businessDescription: business.businessDescription || "",
//         name: business.name || "",
//       },
//     }
//   } catch (error) {
//     console.error("Error getting business profile:", error)
//     return {
//       profileContent: "We are a professional business ready to help you with your needs.",
//       businessContext: {
//         businessName: "Our Business",
//         businessType: "Service",
//         website: "",
//         responseLanguage: "English",
//         businessDescription: "",
//         name: "",
//       },
//     }
//   }
// }

// // Get or create fallback automation by Instagram page ID
// export async function getOrCreateDefaultAutomation(
//   pageId: string, 
//   platform: "INSTAGRAM" | "WHATSAPP" | "FACEBOOK" = "INSTAGRAM"
// ) {
//   try {
//     console.log(`🔍 Looking up user for pageId: ${pageId}`)

//     // Find user through integration - try multiple ID fields
//     const integration = await client.integrations.findFirst({
//       where: { 
//         OR: [
//           { instagramId: pageId },
//           { pageId: pageId },
//         ]
//       },
//       select: {
//         userId: true,
//         User: {
//           select: {
//             id: true,
//             subscription: { select: { plan: true } },
//             integrations: { select: { token: true } },
//           },
//         },
//       },
//     })

//     if (!integration?.userId) {
//       console.log("❌ No user found for page ID:", pageId)
      
//       // Debug: Show what integrations exist
//       const sampleIntegrations = await client.integrations.findMany({
//         select: { id: true, instagramId: true, pageId: true, userId: true },
//         take: 3,
//       })
//       console.log("📋 Sample integrations in DB:", JSON.stringify(sampleIntegrations, null, 2))
      
//       return null
//     }

//     console.log("✅ Found userId:", integration.userId, "for pageId:", pageId)

//     // Look for existing fallback automation for this user and platform
//     let defaultAutomation = await client.automation.findFirst({
//       where: {
//         userId: integration.userId,
//         isFallback: true,
//         platform: platform,
//         active: true,
//         deletedAt: null,
//       },
//       include: {
//         User: {
//           select: {
//             id: true,
//             subscription: { select: { plan: true } },
//             integrations: { select: { token: true } },
//           },
//         },
//         listener: true,
//         trigger: true,
//       },
//     })

//     if (defaultAutomation) {
//       console.log("✅ Found existing fallback automation:", defaultAutomation.id)
//       return defaultAutomation
//     }

//     // Create default automation if it doesn't exist
//     console.log(`🔧 Creating fallback automation for user: ${integration.userId}, platform: ${platform}`)

//     defaultAutomation = await client.automation.create({
//       data: {
//         name: `Default ${platform} Handler`,
//         active: true,
//         isFallback: true,
//         platform: platform,
//         userId: integration.userId,
//         listener: {
//           create: {
//             listener: "SMARTAI",
//             prompt:
//               "You are a helpful customer service representative. Respond naturally and professionally to customer inquiries.",
//           },
//         },
//         trigger: {
//           create: [
//             {
//               type: "DM",
//               isActive: true,
//             },
//             {
//               type: "COMMENT",
//               isActive: true,
//             },
//           ],
//         },
//       },
//       include: {
//         User: {
//           select: {
//             id: true,
//             subscription: { select: { plan: true } },
//             integrations: { select: { token: true } },
//           },
//         },
//         listener: true,
//         trigger: true,
//       },
//     })

//     console.log("✅ Fallback automation created:", defaultAutomation.id)
//     return defaultAutomation
//   } catch (error) {
//     console.error("❌ Error in getOrCreateDefaultAutomation:", error)
//     return null
//   }
// }


"use server"

import { client } from "@/lib/prisma"

export async function getBusinessProfileForAutomation(automationId: string) {
  try {
    console.log("🔍 [getBusinessProfile] Starting with automationId:", automationId)
    
    // Get business directly using automationId since Business has automationId field
    const business = await client.business.findUnique({
      where: { automationId },
      include: {
        User: true,
      },
    })

    console.log("📊 [getBusinessProfile] Business found:", business ? "YES" : "NO")
    if (business) {
      console.log("📊 [getBusinessProfile] Business details:", {
        id: business.id,
        businessName: business.businessName,
        hasDescription: !!business.businessDescription,
      })
    }

    if (!business) {
      console.log("🔄 [getBusinessProfile] Falling back to automation lookup")
      
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

      console.log("📊 [getBusinessProfile] Automation found:", automation ? "YES" : "NO")
      if (automation) {
        console.log("📊 [getBusinessProfile] Automation user businesses count:", automation.User?.businesses?.length || 0)
      }

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
    console.error("❌ [getBusinessProfile] Error getting business profile:", error)
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

// Get or create fallback automation by Instagram page ID
export async function getOrCreateDefaultAutomation(
  pageId: string, 
  platform: "INSTAGRAM" | "WHATSAPP" | "FACEBOOK" = "INSTAGRAM"
) {
  try {
    console.log("🚀 [getOrCreateDefault] ============ STARTING ============")
    console.log("🚀 [getOrCreateDefault] PageId:", pageId)
    console.log("🚀 [getOrCreateDefault] Platform:", platform)

    // Find user through integration - try multiple ID fields
    const integration = await client.integrations.findFirst({
      where: { 
        OR: [
          { instagramId: pageId },
          { pageId: pageId },
        ]
      },
      select: {
        userId: true,
        instagramId: true,
        pageId: true,
        User: {
          select: {
            id: true,
            subscription: { select: { plan: true } },
            integrations: { select: { token: true } },
          },
        },
      },
    })

    console.log("📊 [getOrCreateDefault] Integration found:", integration ? "YES" : "NO")
    if (integration) {
      console.log("📊 [getOrCreateDefault] Integration details:", {
        userId: integration.userId,
        instagramId: integration.instagramId,
        pageId: integration.pageId,
      })
    }

    if (!integration?.userId) {
      console.log("❌ [getOrCreateDefault] No user found for page ID:", pageId)
      
      // Debug: Show what integrations exist
      const sampleIntegrations = await client.integrations.findMany({
        select: { id: true, instagramId: true, pageId: true, userId: true },
        take: 5,
      })
      console.log("📋 [getOrCreateDefault] Sample integrations in DB:", JSON.stringify(sampleIntegrations, null, 2))
      
      return null
    }

    console.log("✅ [getOrCreateDefault] Found userId:", integration.userId)

    // Debug: Show ALL automations for this user
    const allUserAutomations = await client.automation.findMany({
      where: { userId: integration.userId },
      select: { 
        id: true, 
        name: true,
        isFallback: true, 
        platform: true, 
        active: true, 
        deletedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    console.log("📋 [getOrCreateDefault] ALL automations for user:", JSON.stringify(allUserAutomations, null, 2))
    console.log("📋 [getOrCreateDefault] Total automations count:", allUserAutomations.length)

    // Show what we're searching for
    console.log("🔍 [getOrCreateDefault] Search criteria:")
    console.log("   - userId:", integration.userId)
    console.log("   - isFallback:", true)
    console.log("   - platform:", platform)
    console.log("   - active:", true)
    console.log("   - deletedAt:", null)

    // Look for existing fallback automation for this user and platform
    let defaultAutomation = await client.automation.findFirst({
      where: {
        userId: integration.userId,
        isFallback: true,
        platform: platform,
        active: true,
        deletedAt: null,
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
      orderBy: { createdAt: 'desc' }
    })

    if (defaultAutomation) {
      console.log("✅ [getOrCreateDefault] Found existing fallback automation!")
      console.log("📊 [getOrCreateDefault] Automation details:", {
        id: defaultAutomation.id,
        name: defaultAutomation.name,
        platform: defaultAutomation.platform,
        isFallback: defaultAutomation.isFallback,
        active: defaultAutomation.active,
        deletedAt: defaultAutomation.deletedAt,
        hasListener: !!defaultAutomation.listener,
        triggerCount: defaultAutomation.trigger?.length || 0,
      })
      console.log("🏁 [getOrCreateDefault] ============ COMPLETED (FOUND) ============\n")
      return defaultAutomation
    }

    console.log("⚠️ [getOrCreateDefault] No fallback automation found, creating new one...")

    // Create default automation if it doesn't exist
    console.log(`🔧 [getOrCreateDefault] Creating fallback automation for user: ${integration.userId}, platform: ${platform}`)

    defaultAutomation = await client.automation.create({
      data: {
        name: `Default ${platform} Handler`,
        active: true,
        isFallback: true,
        platform: platform,
        userId: integration.userId,
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

    console.log("✅ [getOrCreateDefault] Fallback automation created!")
    console.log("📊 [getOrCreateDefault] New automation ID:", defaultAutomation.id)
    console.log("🏁 [getOrCreateDefault] ============ COMPLETED (CREATED) ============\n")
    
    return defaultAutomation
  } catch (error) {
    console.error("❌ [getOrCreateDefault] ============ ERROR ============")
    console.error("❌ [getOrCreateDefault] Error details:", error)
    console.error("❌ [getOrCreateDefault] Stack:", error instanceof Error ? error.stack : "No stack trace")
    console.log("🏁 [getOrCreateDefault] ============ FAILED ============\n")
    return null
  }
}