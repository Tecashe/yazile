import { client } from "@/lib/prisma"
import { HandoffPriority } from '@prisma/client'

interface HandoffRequest {
  userId: string
  pageId: string
  senderId: string
  automationId?: string
  reason: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  context?: any
}

interface HandoffResult {
  success: boolean
  handoffId?: string
  message?: string
  error?: string
  estimatedWaitTime?: number
}

/**
 * Initiates a human handoff request with proper business isolation
 */
export async function initiateHumanHandoff(request: HandoffRequest): Promise<HandoffResult> {
  try {
    // Get business information for proper routing
    const business = await client.business.findFirst({
      where: { userId: request.userId },
      include: {
        User: {
          include: {
            subscription: true,
          },
        },
      },
    })

    if (!business) {
      throw new Error("Business not found")
    }

    // Check if there's already an active handoff for this user
    const existingHandoff = await client.humanHandoff.findFirst({
      where: {
        pageId: request.pageId,
        senderId: request.senderId,
        status: {
          in: ["PENDING", "ASSIGNED", "IN_PROGRESS"],
        },
      },
    })

    if (existingHandoff) {
      return {
        success: true,
        handoffId: existingHandoff.id,
        message: "You already have an active handoff request. An agent will be with you shortly.",
      }
    }

    // Create handoff record in database
    const handoff = await client.humanHandoff.create({
      data: {
        userId: request.userId,
        pageId: request.pageId,
        senderId: request.senderId,
        automationId: request.automationId,
        reason: request.reason,
        priority: request.priority,
        status: "PENDING",
        context: request.context ? JSON.stringify(request.context) : null,
        businessId: business.id, // Add business ID for isolation
      },
    })

    // Get handoff settings for this specific business
    const settings = await client.handoffSettings.findUnique({
      where: { userId: request.userId },
    })

    // Calculate estimated wait time
    const estimatedWaitTime = await calculateWaitTime(request.priority, request.userId)

    // Trigger n8n workflow with business-specific routing
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const webhookUrl = `${process.env.N8N_WEBHOOK_URL}/human-handoff`

        // Enhanced payload with business isolation data
        const n8nPayload = {
          ...request,
          handoffId: handoff.id,
          businessId: business.id,
          businessName: business.businessName,
          businessEmail: business.User?.email,
          businessPlan: business.User?.subscription?.plan || "FREE",

          // Business-specific notification settings
          notificationSettings: {
            slackEnabled: !!settings?.slackWebhookUrl,
            emailEnabled: !!settings?.notificationEmail,
            teamsEnabled: !!settings?.teamsWebhookUrl,
            slackWebhookUrl: settings?.slackWebhookUrl,
            slackChannel: settings?.slackChannel || `#handoffs-${business.id.slice(0, 8)}`,
            notificationEmail: settings?.notificationEmail || business.User?.email,
            teamsWebhookUrl: settings?.teamsWebhookUrl,
            autoAssign: settings?.autoAssign || false,
          },

          // Business-specific agent routing
          agentRouting: {
            businessId: business.id,
            requiredSkills: getRequiredSkills(business.businessType, request.reason),
            preferredLanguage: business.responseLanguage || "en",
            businessHours: "24/7",
            timezone: "UTC",
          },

          // Dashboard URLs with business context
          dashboardUrl: process.env.NEXT_PUBLIC_HOST_URL,
          handoffUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard/${business.id}/handoffs/${handoff.id}`,

          // Security token for webhook validation
          webhookToken: generateWebhookToken(business.id, handoff.id),
        }

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Business-ID": business.id,
            "X-Handoff-ID": handoff.id,
            Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}`,
          },
          body: JSON.stringify(n8nPayload),
        })

        if (!response.ok) {
          console.error("Error triggering n8n workflow:", await response.text())
        } else {
          console.log("Successfully triggered n8n workflow for handoff:", handoff.id)

          // Update handoff with n8n execution info
          await client.humanHandoff.update({
            where: { id: handoff.id },
            data: {
              n8nWorkflowId: "human-handoff-workflow",
              n8nExecutionId: response.headers.get("x-execution-id") || undefined,
            },
          })
        }
      } catch (error) {
        console.error("Error triggering n8n workflow:", error)
        // Continue even if n8n fails - we've already created the handoff record
      }
    }

    // Create system message
    await client.handoffMessage.create({
      data: {
        handoffId: handoff.id,
        content: "Handoff request created and waiting for an agent.",
        isSystemMessage: true,
      },
    })

    // Try to auto-assign if enabled for this business
    if (settings?.autoAssign) {
      const assignmentResult = await tryAutoAssign(handoff.id, business.id)
      if (assignmentResult.success) {
        return {
          success: true,
          handoffId: handoff.id,
          message: assignmentResult.message || "You've been connected to an agent.",
          estimatedWaitTime: 0,
        }
      }
    }

    return {
      success: true,
      handoffId: handoff.id,
      message: `Your request has been received. Estimated wait time: ${Math.ceil(estimatedWaitTime / 60000)} minutes.`,
      estimatedWaitTime,
    }
  } catch (error) {
    console.error("Error initiating human handoff:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Tries to auto-assign a handoff to an available agent for specific business
 */
async function tryAutoAssign(handoffId: string, businessId: string): Promise<HandoffResult> {
  try {
    // Find available agent assigned to this business or with matching skills
    const handoff = await client.humanHandoff.findUnique({
      where: { id: handoffId },
      include: {
        business: true,
      },
    })

    if (!handoff) {
      return { success: false, message: "Handoff not found" }
    }

    const requiredSkills = getRequiredSkills(handoff.business?.businessType || "", handoff.reason)
    const preferredLanguage = handoff.business?.responseLanguage || "en"

    // Find available agent with business assignment or matching skills
    const availableAgent = await client.agent.findFirst({
      where: {
        isActive: true,
        isAvailable: true,
        OR: [
          // Agents specifically assigned to this business
          {
            businessAssignments: {
              some: {
                businessId: businessId,
                isActive: true,
              },
            },
          },
          // General agents with matching skills and no specific business assignments
          {
            AND: [
              {
                businessAssignments: {
                  none: {},
                },
              },
              {
                skills: {
                  hasSome: requiredSkills,
                },
              },
              {
                languages: {
                  has: preferredLanguage,
                },
              },
            ],
          },
        ],
      },
      include: {
        handoffs: {
          where: {
            status: {
              in: ["ASSIGNED", "IN_PROGRESS"],
            },
          },
        },
        businessAssignments: {
          where: {
            businessId: businessId,
            isActive: true,
          },
        },
      },
      orderBy: {
        handoffs: {
          _count: "asc",
        },
      },
    })

    if (!availableAgent) {
      return {
        success: false,
        message: "No agents available for this business",
      }
    }

    // Check if agent is under their max concurrent limit
    if (availableAgent.handoffs.length >= availableAgent.maxConcurrent) {
      return {
        success: false,
        message: "Agent at maximum capacity",
      }
    }

    // Assign the handoff
    const result = await assignHandoff(handoffId, availableAgent.id)
    return result
  } catch (error) {
    console.error("Error in auto-assignment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}


async function calculateWaitTime(priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT", userId: string): Promise<number> {
  try {
    const priorityOrder = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const
    const priorityIndex = priorityOrder.indexOf(priority)
    const higherPriorities = priorityOrder.slice(0, priorityIndex + 1)

    const queueCount = await client.humanHandoff.count({
      where: {
        userId: userId, // Only count handoffs for this business
        status: "PENDING",
        priority: {
          in: higherPriorities as HandoffPriority[],
        },
      },
    })

    // Get number of available agents for this business
    const business = await client.business.findFirst({
      where: { userId },
    })

    if (!business) {
      return 5 * 60 * 1000 // Default to 5 minutes
    }

    const availableAgents = await client.agent.count({
      where: {
        isActive: true,
        isAvailable: true,
        OR: [
          {
            businessAssignments: {
              some: {
                businessId: business.id,
                isActive: true,
              },
            },
          },
          {
            businessAssignments: {
              none: {},
            },
          },
        ],
      },
    })

    // Estimate based on average handling time and queue position
    const avgHandlingTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    const priorityMultiplier = getPriorityMultiplier(priority)

    if (availableAgents === 0) {
      return queueCount * avgHandlingTime * priorityMultiplier
    }

    return Math.max((queueCount / availableAgents) * avgHandlingTime * priorityMultiplier, 60000) // Minimum 1 minute
  } catch (error) {
    console.error("Error calculating wait time:", error)
    return 5 * 60 * 1000 // Default to 5 minutes
  }
}

/**
 * Gets required skills based on business type and reason
 */
function getRequiredSkills(businessType: string, reason: string): string[] {
  const skills: string[] = []

  // Add skills based on business type
  switch (businessType.toLowerCase()) {
    case "ecommerce":
    case "retail":
      skills.push("sales", "product-support")
      break
    case "saas":
    case "software":
      skills.push("technical", "product-support")
      break
    case "healthcare":
      skills.push("healthcare", "compliance")
      break
    case "finance":
      skills.push("finance", "compliance")
      break
    default:
      skills.push("general-support")
  }

  // Add skills based on reason
  if (reason.toLowerCase().includes("technical")) {
    skills.push("technical")
  }
  if (reason.toLowerCase().includes("billing") || reason.toLowerCase().includes("payment")) {
    skills.push("billing", "finance")
  }
  if (reason.toLowerCase().includes("sales") || reason.toLowerCase().includes("purchase")) {
    skills.push("sales")
  }

  return skills.length > 0 ? skills : ["general-support"]
}

/**
 * Gets priority multiplier for wait time calculation
 */
function getPriorityMultiplier(priority: string): number {
  switch (priority) {
    case "URGENT":
      return 0.5
    case "HIGH":
      return 0.7
    case "MEDIUM":
      return 1.0
    case "LOW":
      return 1.5
    default:
      return 1.0
  }
}

/**
 * Generates a secure webhook token for validation
 */
function generateWebhookToken(businessId: string, handoffId: string): string {
  const crypto = require("crypto")
  const secret = process.env.N8N_WEBHOOK_SECRET || "default-secret"
  const payload = `${businessId}:${handoffId}:${Date.now()}`
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

/**
 * Assigns a handoff to an agent
 */
export async function assignHandoff(handoffId: string, agentId: string): Promise<HandoffResult> {
  try {
    const handoff = await client.humanHandoff.update({
      where: { id: handoffId },
      data: {
        assignedAgentId: agentId,
        assignedAt: new Date(),
        status: "ASSIGNED",
      },
      include: {
        assignedAgent: true,
      },
    })

    // Create system message
    await client.handoffMessage.create({
      data: {
        handoffId: handoff.id,
        content: `Handoff assigned to agent ${handoff.assignedAgent?.name || agentId}.`,
        isSystemMessage: true,
      },
    })

    return {
      success: true,
      handoffId: handoff.id,
      message: `Handoff assigned to ${handoff.assignedAgent?.name || "agent"} successfully`,
    }
  } catch (error) {
    console.error("Error assigning handoff:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Completes a handoff
 */
export async function completeHandoff(handoffId: string, resolution?: string): Promise<HandoffResult> {
  try {
    const handoff = await client.humanHandoff.update({
      where: { id: handoffId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        resolution,
      },
    })

    // Create system message
    await client.handoffMessage.create({
      data: {
        handoffId: handoff.id,
        content: `Handoff completed${resolution ? `: ${resolution}` : ""}.`,
        isSystemMessage: true,
      },
    })

    return {
      success: true,
      handoffId: handoff.id,
      message: "Handoff completed successfully",
    }
  } catch (error) {
    console.error("Error completing handoff:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Adds a message to a handoff conversation
 */
export async function addHandoffMessage(
  handoffId: string,
  content: string,
  isFromCustomer = false,
  isFromAgent = false,
): Promise<HandoffResult> {
  try {
    await client.handoffMessage.create({
      data: {
        handoffId,
        content,
        isFromCustomer,
        isFromAgent,
        isSystemMessage: !isFromCustomer && !isFromAgent,
      },
    })

    return {
      success: true,
      handoffId,
      message: "Message added successfully",
    }
  } catch (error) {
    console.error("Error adding handoff message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets handoff status for a user
 */
export async function getHandoffStatus(
  pageId: string,
  senderId: string,
): Promise<{
  status: string
  agent?: string
  queuePosition?: number
  estimatedWaitTime?: number
} | null> {
  try {
    const handoff = await client.humanHandoff.findFirst({
      where: {
        pageId,
        senderId,
        status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
      },
      include: {
        assignedAgent: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!handoff) {
      return null
    }

    if (handoff.status === "ASSIGNED" || handoff.status === "IN_PROGRESS") {
      return {
        status: handoff.status.toLowerCase(),
        agent: handoff.assignedAgent?.name || "Agent",
      }
    }

    // Calculate queue position for pending handoffs within the same business
    const queuePosition = await client.humanHandoff.count({
  where: {
    userId: handoff.userId, // Same business
    status: "PENDING",
    createdAt: { lt: handoff.createdAt },
    priority: { in: getPriorityQueue(handoff.priority) as HandoffPriority[] },
  },
})

    const estimatedWaitTime = await calculateWaitTime(handoff.priority, handoff.userId)

    return {
      status: "pending",
      queuePosition: queuePosition + 1,
      estimatedWaitTime,
    }
  } catch (error) {
    console.error("Error getting handoff status:", error)
    return null
  }
}

/**
 * Gets priority queue for calculating position
 */
function getPriorityQueue(priority: string): string[] {
  switch (priority) {
    case "URGENT":
      return ["URGENT"]
    case "HIGH":
      return ["URGENT", "HIGH"]
    case "MEDIUM":
      return ["URGENT", "HIGH", "MEDIUM"]
    case "LOW":
      return ["URGENT", "HIGH", "MEDIUM", "LOW"]
    default:
      return ["URGENT", "HIGH", "MEDIUM", "LOW"]
  }
}

/**
 * Checks if user is in handoff mode
 */
export async function isUserInHandoff(pageId: string, senderId: string): Promise<boolean> {
  try {
    const activeHandoff = await client.humanHandoff.findFirst({
      where: {
        pageId,
        senderId,
        status: {
          in: ["PENDING", "ASSIGNED", "IN_PROGRESS"],
        },
      },
    })

    return !!activeHandoff
  } catch (error) {
    console.error("Error checking handoff status:", error)
    return false
  }
}
