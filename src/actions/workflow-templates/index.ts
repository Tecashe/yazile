"use server"

import { client } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { onUserInfor } from "../user"

export async function createWorkflowTemplate(data: {
  name: string
  category: string
  description: string
  complexity: "LOW" | "MEDIUM" | "HIGH"
  estimatedSetupTime: number
  operations: string[]
  features: string[]
  integrations: any[]
  commonUseCase?: string
  isPublic: boolean
  isActive: boolean
  workflowDesign?: any
  voiceflowProjectId?: string
  voiceflowVersionId?: string
  originalRequestId?: string
}) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const template = await client.businessWorkflowTemplate.create({
      data: {
        ...data,
        createdByAdmin: true,
        publishedAt: data.isPublic ? new Date() : null,
        publishedBy: data.isPublic ? userId : null,
      },
    })

    revalidatePath("/admin/workflows")
    revalidatePath("/dashboard/workflows")

    return {
      success: true,
      template,
    }
  } catch (error) {
    console.error("Error creating workflow template:", error)
    return {
      success: false,
      error: "Failed to create workflow template",
    }
  }
}

export async function updateWorkflowTemplate(
  templateId: string,
  data: {
    name: string
    category: string
    description: string
    complexity: "LOW" | "MEDIUM" | "HIGH"
    estimatedSetupTime: number
    operations: string[]
    features: string[]
    integrations: any[]
    commonUseCase?: string
    isPublic: boolean
    isActive: boolean
    workflowDesign?: any
    voiceflowProjectId?: string
    voiceflowVersionId?: string
  },
) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const existingTemplate = await client.businessWorkflowTemplate.findUnique({
      where: { id: templateId },
    })

    if (!existingTemplate) {
      return { success: false, error: "Template not found" }
    }

    const wasPublic = existingTemplate.isPublic
    const isNowPublic = data.isPublic

    const template = await client.businessWorkflowTemplate.update({
      where: { id: templateId },
      data: {
        ...data,
        publishedAt: isNowPublic && !wasPublic ? new Date() : existingTemplate.publishedAt,
        publishedBy: isNowPublic && !wasPublic ? userId : existingTemplate.publishedBy,
      },
    })

    revalidatePath("/admin/workflows")
    revalidatePath("/dashboard/workflows")

    return {
      success: true,
      template,
    }
  } catch (error) {
    console.error("Error updating workflow template:", error)
    return {
      success: false,
      error: "Failed to update workflow template",
    }
  }
}

export async function getCustomWorkflowRequests() {
  try {
    const requests = await client.customWorkflowRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        // businesses: {
        //   select: {
        //     id: true,
        //     businessName: true,
        //   },
        // },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      requests,
    }
  } catch (error) {
    console.error("Error fetching custom workflow requests:", error)
    return {
      success: false,
      error: "Failed to fetch workflow requests",
    }
  }
}

export async function getAllWorkflowTemplates() {
  try {
    const templates = await client.businessWorkflowTemplate.findMany({
      include: {
        businessConfigs: {
          select: {
            id: true,
            status: true,
            isActive: true,
          },
        },
        CustomWorkflowRequest: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: [{ isPublic: "desc" }, { createdAt: "desc" }],
    })

    return {
      success: true,
      templates,
    }
  } catch (error) {
    console.error("Error fetching workflow templates:", error)
    return {
      success: false,
      error: "Failed to fetch workflow templates",
    }
  }
}

export async function deleteWorkflowTemplate(templateId: string) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if template has active configurations
    const activeConfigs = await client.businessWorkflowConfig.count({
      where: {
        workflowTemplateId: templateId,
        isActive: true,
      },
    })

    if (activeConfigs > 0) {
      return {
        success: false,
        error: `Cannot delete template with ${activeConfigs} active configurations`,
      }
    }

    await client.businessWorkflowTemplate.delete({
      where: { id: templateId },
    })

    revalidatePath("/admin/workflows")
    revalidatePath("/dashboard/workflows")

    return {
      success: true,
      message: "Template deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting workflow template:", error)
    return {
      success: false,
      error: "Failed to delete workflow template",
    }
  }
}

export async function publishWorkflowTemplate(templateId: string) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const template = await client.businessWorkflowTemplate.update({
      where: { id: templateId },
      data: {
        isPublic: true,
        isActive: true,
        publishedAt: new Date(),
        publishedBy: userId,
      },
    })

    revalidatePath("/admin/workflows")
    revalidatePath("/dashboard/workflows")

    return {
      success: true,
      template,
      message: "Template published successfully",
    }
  } catch (error) {
    console.error("Error publishing workflow template:", error)
    return {
      success: false,
      error: "Failed to publish workflow template",
    }
  }
}

export async function updateCustomWorkflowRequestStatus(
  requestId: string,
  status: "SUBMITTED" | "UNDER_REVIEW" | "IN_DEVELOPMENT" | "COMPLETED" | "REJECTED",
  adminNotes?: string,
) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const request = await client.customWorkflowRequest.update({
      where: { id: requestId },
      data: {
        status,
        adminNotes,
        updatedAt: new Date(),
      },
    })

    // Create notification for user
    await client.generalNotification.create({
      data: {
        userId: request.userId,
        businessId: request.businessObjective,
        type: "WORKFLOW_EDIT_REQUEST",
        title: "Workflow Request Update",
        message: `Your custom workflow request "${request.title}" status has been updated to ${status}`,
        metadata: {
          requestId: request.id,
          status,
          adminNotes,
        },
      },
    })

    revalidatePath("/admin/workflows")

    return {
      success: true,
      request,
      message: "Request status updated successfully",
    }
  } catch (error) {
    console.error("Error updating request status:", error)
    return {
      success: false,
      error: "Failed to update request status",
    }
  }
}
