"use server"

import { prisma } from "@/lib/prisma"

export interface CreateExecutionData {
  workflowId: string
  triggerData: any
  platform: string
  senderId: string
  senderUsername?: string
}

// Create a new workflow execution
export async function createWorkflowExecution(data: CreateExecutionData) {
  try {
    const execution = await prisma.workflowExecutions.create({
      data: {
        workflowId: data.workflowId,
        triggerData: data.triggerData,
        platform: data.platform,
        senderId: data.senderId,
        senderUsername: data.senderUsername,
        status: "running",
        executedNodes: [],
        startedAt: new Date(),
      },
      include: {
        workflow: true,
      },
    })

    return { success: true, execution }
  } catch (error) {
    console.error("Error creating workflow execution:", error)
    return { success: false, error: "Failed to create execution" }
  }
}

// Update execution status and progress
export async function updateWorkflowExecution(
  executionId: string,
  updates: {
    status?: "running" | "completed" | "failed" | "stopped"
    currentNode?: string
    executedNodes?: any[]
    responses?: any
    errorMessage?: string
  },
) {
  try {
    const execution = await prisma.workflowExecutions.update({
      where: { id: executionId },
      data: {
        ...updates,
        ...(updates.status === "completed" || updates.status === "failed" || updates.status === "stopped"
          ? { completedAt: new Date() }
          : {}),
      },
    })

    return { success: true, execution }
  } catch (error) {
    console.error("Error updating workflow execution:", error)
    return { success: false, error: "Failed to update execution" }
  }
}

// Get workflow executions
export async function getWorkflowExecutions(workflowId: string, limit = 50) {
  try {
    const executions = await prisma.workflowExecutions.findMany({
      where: { workflowId },
      orderBy: { startedAt: "desc" },
      take: limit,
      include: {
        workflow: {
          select: {
            name: true,
            triggerType: true,
          },
        },
      },
    })

    return { success: true, executions }
  } catch (error) {
    console.error("Error fetching executions:", error)
    return { success: false, error: "Failed to fetch executions" }
  }
}

// Get execution by ID
export async function getWorkflowExecution(executionId: string) {
  try {
    const execution = await prisma.workflowExecutions.findUnique({
      where: { id: executionId },
      include: {
        workflow: true,
      },
    })

    if (!execution) {
      return { success: false, error: "Execution not found" }
    }

    return { success: true, execution }
  } catch (error) {
    console.error("Error fetching execution:", error)
    return { success: false, error: "Failed to fetch execution" }
  }
}
