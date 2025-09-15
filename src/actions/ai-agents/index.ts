

// "use server"

// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { revalidatePath } from "next/cache"

// export interface CreateAIAgentData {
//   name: string
//   description: string
//   avatar?: string
//   agentType: string
//   friendliness: number
//   formality: number
//   enthusiasm: number
//   empathy: number
//   humor: number
//   patience: number
//   expertise: number
//   primaryLanguage: string
//   detectLanguage: boolean
//   supportedLanguages: string[]
//   responseStyle: string
//   isCustom?: boolean
//   introductoryStatement?: string
//   tone?: string
// }

// export async function createAIAgent(data: CreateAIAgentData) {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     // Get user's business
//     const business = await client.business.findFirst({
//       where: { userId: user.data.id },
//     })

//     if (!business) {
//       return { status: 404, error: "Business profile not found" }
//     }

//     // Deactivate other agents if this is being set as active
//     await client.aIAgent.updateMany({
//       where: { businessId: business.id },
//       data: { isActive: false },
//     })

//     const agent = await client.aIAgent.create({
//       data: {
//         ...data,
//         businessId: business.id,
//         isActive: true, // New agent becomes active by default
//         introductoryStatement: data.introductoryStatement,
//         tone: data.tone,
//       },
//     })

//     revalidatePath("/")
//     return { status: 201, data: agent }
//   } catch (error) {
//     console.error("Error creating AI agent:", error)
//     return { status: 500, error: "Failed to create AI agent" }
//   }
// }

// export async function getAIAgents() {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, data: [], error: "User not authenticated" }
//     }

//     const business = await client.business.findFirst({
//       where: { userId: user.data.id },
//     })

//     if (!business) {
//       return { status: 404, data: [], error: "Business profile not found" }
//     }

//     const agents = await client.aIAgent.findMany({
//       where: { businessId: business.id },
//       orderBy: { createdAt: "desc" },
//     })

//     return { status: 200, data: agents }
//   } catch (error) {
//     console.error("Error fetching AI agents:", error)
//     return { status: 500, data: [], error: "Failed to fetch AI agents" }
//   }
// }

// export async function updateAIAgent(agentId: string, data: Partial<CreateAIAgentData>) {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     // Verify agent belongs to user's business
//     const agent = await client.aIAgent.findFirst({
//       where: {
//         id: agentId,
//         business: { userId: user.data.id },
//       },
//     })

//     if (!agent) {
//       return { status: 404, error: "AI agent not found" }
//     }

//     const updatedAgent = await client.aIAgent.update({
//       where: { id: agentId },
//       data: {
//         ...data,
//         updatedAt: new Date(),
//       },
//     })

//     revalidatePath("/")
//     return { status: 200, data: updatedAgent }
//   } catch (error) {
//     console.error("Error updating AI agent:", error)
//     return { status: 500, error: "Failed to update AI agent" }
//   }
// }

// export async function setActiveAIAgent(agentId: string) {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     const business = await client.business.findFirst({
//       where: { userId: user.data.id },
//     })

//     if (!business) {
//       return { status: 404, error: "Business profile not found" }
//     }

//     // Deactivate all agents
//     await client.aIAgent.updateMany({
//       where: { businessId: business.id },
//       data: { isActive: false },
//     })

//     // Activate selected agent
//     const agent = await client.aIAgent.update({
//       where: { id: agentId },
//       data: { isActive: true },
//     })

//     revalidatePath("/")
//     return { status: 200, data: agent }
//   } catch (error) {
//     console.error("Error setting active AI agent:", error)
//     return { status: 500, error: "Failed to set active AI agent" }
//   }
// }

// export async function deleteAIAgent(agentId: string) {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     // Verify agent belongs to user's business
//     const agent = await client.aIAgent.findFirst({
//       where: {
//         id: agentId,
//         business: { userId: user.data.id },
//       },
//     })

//     if (!agent) {
//       return { status: 404, error: "AI agent not found" }
//     }

//     await client.aIAgent.delete({
//       where: { id: agentId },
//     })

//     revalidatePath("/")
//     return { status: 200, message: "AI agent deleted successfully" }
//   } catch (error) {
//     console.error("Error deleting AI agent:", error)
//     return { status: 500, error: "Failed to delete AI agent" }
//   }
// }

// export async function getAvailableIntegrations() {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, data: [], error: "User not authenticated" }
//     }

//     // Get user's tenant first (based on the schema, Tenant has userId field)
//     const tenant = await client.tenant.findUnique({
//       where: { userId: user.data.id },
//       include: {
//         integrations: {
//           where: { isActive: true },
//           select: {
//             id: true,
//             type: true,
//             name: true,
//             capabilities: true,
//             config: true,
//             lastSyncAt: true,
//           },
//         },
//       },
//     })

//     if (!tenant) {
//       return { status: 404, data: [], error: "Tenant not found" }
//     }

//     const integrationsWithParsedCapabilities = tenant.integrations.map((integration) => {
//       let parsedCapabilities = {}
//       try {
//         if (integration.capabilities) {
//           parsedCapabilities = JSON.parse(integration.capabilities)
//         }
//       } catch (error) {
//         console.error(`Error parsing capabilities for integration ${integration.id}:`, error)
//         parsedCapabilities = {}
//       }

//       return {
//         ...integration,
//         parsedCapabilities,
//       }
//     })

//     return { status: 200, data: integrationsWithParsedCapabilities }
//   } catch (error) {
//     console.error("Error fetching integrations:", error)
//     return { status: 500, data: [], error: "Failed to fetch integrations" }
//   }
// }

// export async function generateAgentWithAI(businessContext: {
//   businessName: string
//   businessType: string
//   businessDescription: string
//   integrations: any[]
// }) {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     // Check if DEEPSEEK_API_KEY is available
//     if (!process.env.DEEPSEEK_API_KEY) {
//       return { status: 400, error: "DeepSeek API key not configured" }
//     }

//     // Prepare context for AI generation
//     const integrationContext = businessContext.integrations.map((int) => int.type).join(", ")

//     const prompt = `Based on this business information, create an AI agent personality:
    
// Business: ${businessContext.businessName}
// Type: ${businessContext.businessType}
// Description: ${businessContext.businessDescription}
// Available Integrations: ${integrationContext || "None"}

// Generate a JSON response with these fields:
// - name: A suitable agent name
// - description: Agent description
// - agentType: One of (customer-support, sales-assistant, technical-support, social-media-manager, personal-concierge, appointment-scheduler, general-assistant)
// - tone: One of (professional, friendly, casual, formal, enthusiastic, empathetic)
// - introductoryStatement: A personalized greeting
// - personality: Object with values 1-10 for (friendliness, formality, enthusiasm, empathy, humor, patience, expertise)
// - languageSettings: Object with (primaryLanguage: "English", detectLanguage: true, supportedLanguages: ["English"], responseStyle: "professional")

// Make the agent suitable for this specific business and its available integrations.`

//     const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "deepseek-chat",
//         messages: [
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.7,
//         max_tokens: 1000,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`DeepSeek API error: ${response.statusText}`)
//     }

//     const data = await response.json()
//     const aiResponse = data.choices[0]?.message?.content

//     if (!aiResponse) {
//       throw new Error("No response from DeepSeek API")
//     }

//     // Parse the AI response
//     let generatedAgent
//     try {
//       generatedAgent = JSON.parse(aiResponse)
//     } catch (parseError) {
//       // If JSON parsing fails, create a fallback agent
//       generatedAgent = {
//         name: "AI Assistant",
//         description: "An AI assistant tailored for your business",
//         agentType: "general-assistant",
//         tone: "professional",
//         introductoryStatement: `Hi, I'm your AI assistant from ${businessContext.businessName}. How can I help you today?`,
//         personality: {
//           friendliness: 7,
//           formality: 6,
//           enthusiasm: 6,
//           empathy: 7,
//           humor: 4,
//           patience: 8,
//           expertise: 7,
//         },
//         languageSettings: {
//           primaryLanguage: "English",
//           detectLanguage: true,
//           supportedLanguages: ["English"],
//           responseStyle: "professional",
//         },
//       }
//     }

//     return { status: 200, data: generatedAgent }
//   } catch (error) {
//     console.error("Error generating agent with AI:", error)
//     return { status: 500, error: "Failed to generate agent with AI" }
//   }
// }

// export async function getBusinessWithActiveAgent() {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     const business = await client.business.findFirst({
//       where: { userId: user.data.id },
//       include: {
//         aiAgents: {
//           where: { isActive: true },
//           take: 1,
//         },
//       },
//     })

//     if (!business) {
//       return { status: 404, error: "Business profile not found" }
//     }

//     return { status: 200, data: business }
//   } catch (error) {
//     console.error("Error fetching business with active agent:", error)
//     return { status: 500, error: "Failed to fetch business profile" }
//   }
// }

"use server"

import { client } from "@/lib/prisma"
import { onUserInfor } from "../user"
import { revalidatePath } from "next/cache"

export interface CreateAIAgentData {
  name: string
  description: string
  avatar?: string
  agentType: string
  friendliness: number
  formality: number
  enthusiasm: number
  empathy: number
  humor: number
  patience: number
  expertise: number
  primaryLanguage: string
  detectLanguage: boolean
  supportedLanguages: string[]
  responseStyle: string
  isCustom?: boolean
  introductoryStatement?: string
  tone?: string
}

export async function createAIAgent(data: CreateAIAgentData) {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Get user's business
    const business = await client.business.findFirst({
      where: { userId: user.data.id },
    })

    if (!business) {
      return { status: 404, error: "Business profile not found" }
    }

    // Deactivate other agents if this is being set as active
    await client.aIAgent.updateMany({
      where: { businessId: business.id },
      data: { isActive: false },
    })

    const agent = await client.aIAgent.create({
      data: {
        ...data,
        businessId: business.id,
        isActive: true, // New agent becomes active by default
        introductoryStatement: data.introductoryStatement,
        tone: data.tone,
      },
    })

    revalidatePath("/")
    return { status: 201, data: agent }
  } catch (error) {
    console.error("Error creating AI agent:", error)
    return { status: 500, error: "Failed to create AI agent" }
  }
}

export async function getAIAgents() {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, data: [], error: "User not authenticated" }
    }

    const business = await client.business.findFirst({
      where: { userId: user.data.id },
    })

    if (!business) {
      return { status: 404, data: [], error: "Business profile not found" }
    }

    const agents = await client.aIAgent.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    })

    return { status: 200, data: agents }
  } catch (error) {
    console.error("Error fetching AI agents:", error)
    return { status: 500, data: [], error: "Failed to fetch AI agents" }
  }
}

export async function updateAIAgent(agentId: string, data: Partial<CreateAIAgentData>) {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Verify agent belongs to user's business
    const agent = await client.aIAgent.findFirst({
      where: {
        id: agentId,
        business: { userId: user.data.id },
      },
    })

    if (!agent) {
      return { status: 404, error: "AI agent not found" }
    }

    const updatedAgent = await client.aIAgent.update({
      where: { id: agentId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/")
    return { status: 200, data: updatedAgent }
  } catch (error) {
    console.error("Error updating AI agent:", error)
    return { status: 500, error: "Failed to update AI agent" }
  }
}

export async function setActiveAIAgent(agentId: string) {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    const business = await client.business.findFirst({
      where: { userId: user.data.id },
    })

    if (!business) {
      return { status: 404, error: "Business profile not found" }
    }

    // Deactivate all agents
    await client.aIAgent.updateMany({
      where: { businessId: business.id },
      data: { isActive: false },
    })

    // Activate selected agent
    const agent = await client.aIAgent.update({
      where: { id: agentId },
      data: { isActive: true },
    })

    revalidatePath("/")
    return { status: 200, data: agent }
  } catch (error) {
    console.error("Error setting active AI agent:", error)
    return { status: 500, error: "Failed to set active AI agent" }
  }
}

export async function deleteAIAgent(agentId: string) {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Verify agent belongs to user's business
    const agent = await client.aIAgent.findFirst({
      where: {
        id: agentId,
        business: { userId: user.data.id },
      },
    })

    if (!agent) {
      return { status: 404, error: "AI agent not found" }
    }

    await client.aIAgent.delete({
      where: { id: agentId },
    })

    revalidatePath("/")
    return { status: 200, message: "AI agent deleted successfully" }
  } catch (error) {
    console.error("Error deleting AI agent:", error)
    return { status: 500, error: "Failed to delete AI agent" }
  }
}

export async function getAvailableIntegrations() {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, data: [], error: "User not authenticated" }
    }

    // Get user's tenant first (based on the schema, Tenant has userId field)
    const tenant = await client.tenant.findUnique({
      where: { userId: user.data.id },
      include: {
        integrations: {
          where: { isActive: true },
          select: {
            id: true,
            type: true,
            name: true,
            capabilities: true,
            config: true,
            lastSyncAt: true,
          },
        },
      },
    })

    if (!tenant) {
      return { status: 404, data: [], error: "Tenant not found" }
    }

    const integrationsWithParsedCapabilities = tenant.integrations.map((integration) => {
      let parsedCapabilities = {}
      try {
        if (integration.capabilities) {
          parsedCapabilities = JSON.parse(integration.capabilities)
        }
      } catch (error) {
        console.error(`Error parsing capabilities for integration ${integration.id}:`, error)
        parsedCapabilities = {}
      }

      return {
        ...integration,
        parsedCapabilities,
      }
    })

    return { status: 200, data: integrationsWithParsedCapabilities }
  } catch (error) {
    console.error("Error fetching integrations:", error)
    return { status: 500, data: [], error: "Failed to fetch integrations" }
  }
}

export async function generateAIAgent(businessName: string, integrations: any[]) {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Get business context
    const business = await client.business.findFirst({
      where: { userId: user.data.id },
    })

    if (!business) {
      return { status: 404, error: "Business profile not found" }
    }

    return await generateAgentWithAI({
      businessName: business.businessName,
      businessType: business.businessType,
      businessDescription: business.businessDescription,
      integrations,
    })
  } catch (error) {
    console.error("Error generating AI agent:", error)
    return { status: 500, error: "Failed to generate AI agent" }
  }
}

export async function generateAgentWithAI(businessContext: {
  businessName: string
  businessType: string
  businessDescription: string
  integrations: any[]
}) {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Check if DEEPSEEK_API_KEY is available
    if (!process.env.DEEPSEEK_API_KEY) {
      return { status: 400, error: "DeepSeek API key not configured" }
    }

    // Prepare context for AI generation
    const integrationContext = businessContext.integrations.map((int) => int.type).join(", ")

    const prompt = `Based on this business information, create an AI agent personality:
    
Business: ${businessContext.businessName}
Type: ${businessContext.businessType}
Description: ${businessContext.businessDescription}
Available Integrations: ${integrationContext || "None"}

Generate a JSON response with these fields:
- name: A suitable agent name
- description: Agent description
- agentType: One of (customer-support, sales-assistant, technical-support, social-media-manager, personal-concierge, appointment-scheduler, general-assistant)
- tone: One of (professional, friendly, casual, formal, enthusiastic, empathetic)
- introductoryStatement: A personalized greeting
- personality: Object with values 1-10 for (friendliness, formality, enthusiasm, empathy, humor, patience, expertise)
- languageSettings: Object with (primaryLanguage: "English", detectLanguage: true, supportedLanguages: ["English"], responseStyle: "professional")

Make the agent suitable for this specific business and its available integrations.`

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error("No response from DeepSeek API")
    }

    // Parse the AI response
    let generatedAgent
    try {
      generatedAgent = JSON.parse(aiResponse)
    } catch (parseError) {
      // If JSON parsing fails, create a fallback agent
      generatedAgent = {
        name: "AI Assistant",
        description: "An AI assistant tailored for your business",
        agentType: "general-assistant",
        tone: "professional",
        introductoryStatement: `Hi, I'm your AI assistant from ${businessContext.businessName}. How can I help you today?`,
        personality: {
          friendliness: 7,
          formality: 6,
          enthusiasm: 6,
          empathy: 7,
          humor: 4,
          patience: 8,
          expertise: 7,
        },
        languageSettings: {
          primaryLanguage: "English",
          detectLanguage: true,
          supportedLanguages: ["English"],
          responseStyle: "professional",
        },
      }
    }

    return { status: 200, data: generatedAgent }
  } catch (error) {
    console.error("Error generating agent with AI:", error)
    return { status: 500, error: "Failed to generate agent with AI" }
  }
}

export async function getBusinessWithActiveAgent() {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    const business = await client.business.findFirst({
      where: { userId: user.data.id },
      include: {
        aiAgents: {
          where: { isActive: true },
          take: 1,
        },
      },
    })

    if (!business) {
      return { status: 404, error: "Business profile not found" }
    }

    return { status: 200, data: business }
  } catch (error) {
    console.error("Error fetching business with active agent:", error)
    return { status: 500, error: "Failed to fetch business profile" }
  }
}
