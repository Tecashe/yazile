// "use server"

// import { prisma } from "@/lib/prisma"
// import { revalidatePath } from "next/cache"
// import type { WorkflowNode, WorkflowConnection } from "@/types/workflow"
// import { onCurrentUser } from "@/actions/user/"

// export interface CreateWorkflowData {
//   name: string
//   description?: string
//   socialAccountId?: string
//   triggerType: "dm" | "comment" | "mention" | "story_reply"
//   nodes: WorkflowNode[]
//   connections: WorkflowConnection[]
//   variables?: Record<string, any>
// }

// export interface UpdateWorkflowData extends Partial<CreateWorkflowData> {
//   id: string
//   isActive?: boolean
// }

// // Create a new workflow
// export async function createWorkflow(data: CreateWorkflowData) {
//   try {
//     const user = await onCurrentUser()
//     const userId = user.id // This will be the Clerk user ID starting with "user_"

//     const workflow = await prisma.workflows.create({
//       data: {
//         userId,
//         name: data.name,
//         description: data.description,
//         socialAccountId: data.socialAccountId,
//         triggerType: data.triggerType,
//         nodes: data.nodes,
//         connections: data.connections,
//         variables: data.variables || {},
//         isActive: false,
//         version: "1.0.0",
//       },
//       include: {
//         socialAccount: true,
//         user: true,
//       },
//     })

//     revalidatePath("/workflows")
//     return { success: true, workflow }
//   } catch (error) {
//     console.error("Error creating workflow:", error)
//     return { success: false, error: "Failed to create workflow" }
//   }
// }

// // Update an existing workflow
// export async function updateWorkflow(data: UpdateWorkflowData) {
//   try {
//     const user = await onCurrentUser()

//     // Verify the workflow belongs to the current user
//     const existingWorkflow = await prisma.workflows.findFirst({
//       where: {
//         id: data.id,
//         userId: user.id,
//       },
//     })

//     if (!existingWorkflow) {
//       return { success: false, error: "Workflow not found or access denied" }
//     }

//     const workflow = await prisma.workflows.update({
//       where: { id: data.id },
//       data: {
//         ...(data.name && { name: data.name }),
//         ...(data.description !== undefined && { description: data.description }),
//         ...(data.socialAccountId !== undefined && { socialAccountId: data.socialAccountId }),
//         ...(data.triggerType && { triggerType: data.triggerType }),
//         ...(data.nodes && { nodes: data.nodes }),
//         ...(data.connections && { connections: data.connections }),
//         ...(data.variables !== undefined && { variables: data.variables }),
//         ...(data.isActive !== undefined && { isActive: data.isActive }),
//         updatedAt: new Date(),
//       },
//       include: {
//         socialAccount: true,
//         user: true,
//       },
//     })

//     revalidatePath("/workflows")
//     return { success: true, workflow }
//   } catch (error) {
//     console.error("Error updating workflow:", error)
//     return { success: false, error: "Failed to update workflow" }
//   }
// }

// // Get all workflows for a user
// export async function getUserWorkflows() {
//   try {
//     const user = await onCurrentUser()

//     const workflows = await prisma.workflows.findMany({
//       where: { userId: user.id },
//       include: {
//         socialAccount: true,
//         executions: {
//           take: 5,
//           orderBy: { startedAt: "desc" },
//         },
//         analytics: {
//           where: {
//             date: {
//               gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//             },
//           },
//         },
//       },
//       orderBy: { updatedAt: "desc" },
//     })

//     return { success: true, workflows }
//   } catch (error) {
//     console.error("Error fetching workflows:", error)
//     return { success: false, error: "Failed to fetch workflows" }
//   }
// }

// // Get a specific workflow
// export async function getWorkflow(workflowId: string) {
//   try {
//     const user = await onCurrentUser()

//     const workflow = await prisma.workflows.findFirst({
//       where: {
//         id: workflowId,
//         userId: user.id,
//       },
//       include: {
//         socialAccount: true,
//         user: true,
//         executions: {
//           take: 10,
//           orderBy: { startedAt: "desc" },
//         },
//         analytics: {
//           where: {
//             date: {
//               gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
//             },
//           },
//         },
//       },
//     })

//     if (!workflow) {
//       return { success: false, error: "Workflow not found" }
//     }

//     return { success: true, workflow }
//   } catch (error) {
//     console.error("Error fetching workflow:", error)
//     return { success: false, error: "Failed to fetch workflow" }
//   }
// }

// // Delete a workflow
// export async function deleteWorkflow(workflowId: string) {
//   try {
//     const user = await onCurrentUser()

//     await prisma.workflows.delete({
//       where: {
//         id: workflowId,
//         userId: user.id,
//       },
//     })

//     revalidatePath("/workflows")
//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting workflow:", error)
//     return { success: false, error: "Failed to delete workflow" }
//   }
// }

// // Toggle workflow active status
// export async function toggleWorkflowStatus(workflowId: string) {
//   try {
//     const user = await onCurrentUser()

//     const workflow = await prisma.workflows.findFirst({
//       where: { id: workflowId, userId: user.id },
//     })

//     if (!workflow) {
//       return { success: false, error: "Workflow not found" }
//     }

//     const updatedWorkflow = await prisma.workflows.update({
//       where: { id: workflowId },
//       data: {
//         isActive: !workflow.isActive,
//         updatedAt: new Date(),
//       },
//     })

//     revalidatePath("/workflows")
//     return { success: true, workflow: updatedWorkflow }
//   } catch (error) {
//     console.error("Error toggling workflow status:", error)
//     return { success: false, error: "Failed to toggle workflow status" }
//   }
// }

// // Duplicate a workflow
// export async function duplicateWorkflow(workflowId: string) {
//   try {
//     const user = await onCurrentUser()

//     const originalWorkflow = await prisma.workflows.findFirst({
//       where: { id: workflowId, userId: user.id },
//     })

//     if (!originalWorkflow) {
//       return { success: false, error: "Workflow not found" }
//     }

//     const duplicatedWorkflow = await prisma.workflows.create({
//       data: {
//         userId: user.id,
//         name: `${originalWorkflow.name} (Copy)`,
//         description: originalWorkflow.description,
//         socialAccountId: originalWorkflow.socialAccountId,
//         triggerType: originalWorkflow.triggerType,
//         nodes: originalWorkflow.nodes,
//         connections: originalWorkflow.connections,
//         variables: originalWorkflow.variables,
//         isActive: false,
//         version: "1.0.0",
//       },
//     })

//     revalidatePath("/workflows")
//     return { success: true, workflow: duplicatedWorkflow }
//   } catch (error) {
//     console.error("Error duplicating workflow:", error)
//     return { success: false, error: "Failed to duplicate workflow" }
//   }
// }
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { WorkflowNode, WorkflowConnection } from "@/lib/workflow-store"
import { onCurrentUser } from "@/actions/user"

export interface CreateWorkflowData {
  name: string
  description?: string
  socialAccountId?: string
  triggerType: "dm" | "comment" | "mention" | "story_reply"
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  variables?: Record<string, any>
}

export interface UpdateWorkflowData extends Partial<CreateWorkflowData> {
  id: string
  isActive?: boolean
}

// Create a new workflow
export async function createWorkflow(data: CreateWorkflowData) {
  try {
    const user = await onCurrentUser()
    const userId = user.id // This will be the Clerk user ID starting with "user_"

    const workflow = await prisma.workflows.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        socialAccountId: data.socialAccountId,
        triggerType: data.triggerType,
        nodes: JSON.stringify(data.nodes),
        connections: JSON.stringify(data.connections),
        variables: data.variables || {},
        isActive: false,
        version: "1.0.0",
      },
      include: {
        socialAccount: true,
        user: true,
      },
    })

    revalidatePath("/workflows")
    return { success: true, workflow }
  } catch (error) {
    console.error("Error creating workflow:", error)
    return { success: false, error: "Failed to create workflow" }
  }
}

// Update an existing workflow
export async function updateWorkflow(data: UpdateWorkflowData) {
  try {
    const user = await onCurrentUser()

    // Verify the workflow belongs to the current user
    const existingWorkflow = await prisma.workflows.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    })

    if (!existingWorkflow) {
      return { success: false, error: "Workflow not found or access denied" }
    }

    const workflow = await prisma.workflows.update({
      where: { id: data.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.socialAccountId !== undefined && { socialAccountId: data.socialAccountId }),
        ...(data.triggerType && { triggerType: data.triggerType }),
        ...(data.nodes && { nodes: JSON.stringify(data.nodes) }),
        ...(data.connections && { connections: JSON.stringify(data.connections) }),
        ...(data.variables !== undefined && { variables: data.variables }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedAt: new Date(),
      },
      include: {
        socialAccount: true,
        user: true,
      },
    })

    revalidatePath("/workflows")
    return { success: true, workflow }
  } catch (error) {
    console.error("Error updating workflow:", error)
    return { success: false, error: "Failed to update workflow" }
  }
}

// Get all workflows for a user
export async function getUserWorkflows() {
  try {
    const user = await onCurrentUser()

    const workflows = await prisma.workflows.findMany({
      where: { userId: user.id },
      include: {
        socialAccount: true,
        executions: {
          take: 5,
          orderBy: { startedAt: "desc" },
        },
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return { success: true, workflows }
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return { success: false, error: "Failed to fetch workflows" }
  }
}

// Get a specific workflow
export async function getWorkflow(workflowId: string) {
  try {
    const user = await onCurrentUser()

    const workflow = await prisma.workflows.findFirst({
      where: {
        id: workflowId,
        userId: user.id,
      },
      include: {
        socialAccount: true,
        user: true,
        executions: {
          take: 10,
          orderBy: { startedAt: "desc" },
        },
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    })

    if (!workflow) {
      return { success: false, error: "Workflow not found" }
    }

    return { success: true, workflow }
  } catch (error) {
    console.error("Error fetching workflow:", error)
    return { success: false, error: "Failed to fetch workflow" }
  }
}

// Delete a workflow
export async function deleteWorkflow(workflowId: string) {
  try {
    const user = await onCurrentUser()

    await prisma.workflows.delete({
      where: {
        id: workflowId,
        userId: user.id,
      },
    })

    revalidatePath("/workflows")
    return { success: true }
  } catch (error) {
    console.error("Error deleting workflow:", error)
    return { success: false, error: "Failed to delete workflow" }
  }
}

// Toggle workflow active status
export async function toggleWorkflowStatus(workflowId: string) {
  try {
    const user = await onCurrentUser()

    const workflow = await prisma.workflows.findFirst({
      where: { id: workflowId, userId: user.id },
    })

    if (!workflow) {
      return { success: false, error: "Workflow not found" }
    }

    const updatedWorkflow = await prisma.workflows.update({
      where: { id: workflowId },
      data: {
        isActive: !workflow.isActive,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/workflows")
    return { success: true, workflow: updatedWorkflow }
  } catch (error) {
    console.error("Error toggling workflow status:", error)
    return { success: false, error: "Failed to toggle workflow status" }
  }
}

// Duplicate a workflow
export async function duplicateWorkflow(workflowId: string) {
  try {
    const user = await onCurrentUser()

    const originalWorkflow = await prisma.workflows.findFirst({
      where: { id: workflowId, userId: user.id },
    })

    if (!originalWorkflow) {
      return { success: false, error: "Workflow not found" }
    }

    const duplicatedWorkflow = await prisma.workflows.create({
      data: {
        userId: user.id,
        name: `${originalWorkflow.name} (Copy)`,
        description: originalWorkflow.description,
        socialAccountId: originalWorkflow.socialAccountId,
        triggerType: originalWorkflow.triggerType,
        nodes: JSON.stringify(originalWorkflow.nodes),
        connections: JSON.stringify(originalWorkflow.connections),
        variables: JSON.stringify(originalWorkflow.variables),
        isActive: false,
        version: "1.0.0",
      },
    })

    revalidatePath("/workflows")
    return { success: true, workflow: duplicatedWorkflow }
  } catch (error) {
    console.error("Error duplicating workflow:", error)
    return { success: false, error: "Failed to duplicate workflow" }
  }
}
