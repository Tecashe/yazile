"use server"

import { client } from "@/lib/prisma"
import { CRMIntegrationManager } from "@/lib/crm-integrations"
import { revalidatePath } from "next/cache"
import type { LeadStatus } from "@prisma/client"

export async function bulkUpdateLeadStatus(leadIds: string[], status: string, userId: string) {
  try {
    // Validate status
    const validStatuses = ["NEW", "QUALIFYING", "QUALIFIED", "DISQUALIFIED", "CONVERTED", "NURTURING", "LOST"]
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" }
    }

    const updateData: any = {
      status: status as LeadStatus,
      updatedAt: new Date(),
    }

    // Add specific date fields based on status
    if (status === "QUALIFIED") {
      updateData.qualifiedDate = new Date()
    } else if (status === "CONVERTED") {
      updateData.convertedDate = new Date()
    }

    await client.lead.updateMany({
      where: {
        id: { in: leadIds },
        userId: userId,
      },
      data: updateData,
    })

    revalidatePath("/dashboard/leads")
    return { success: true }
  } catch (error) {
    console.error("Error updating lead status:", error)
    return { success: false, error: "Failed to update lead status" }
  }
}

export async function bulkDeleteLeads(leadIds: string[], userId: string) {
  try {
    // Use transaction to ensure data integrity
    await client.$transaction(async (tx) => {
      // Delete related data first
      await tx.leadInteraction.deleteMany({
        where: { leadId: { in: leadIds } },
      })

      await tx.leadQualificationData.deleteMany({
        where: { leadId: { in: leadIds } },
      })

      await tx.revenueOpportunity.deleteMany({
        where: { leadId: { in: leadIds } },
      })

      await tx.scheduledAction.deleteMany({
        where: { leadId: { in: leadIds } },
      })

      // Delete leads
      await tx.lead.deleteMany({
        where: {
          id: { in: leadIds },
          userId: userId,
        },
      })
    })

    revalidatePath("/dashboard/leads")
    return { success: true }
  } catch (error) {
    console.error("Error deleting leads:", error)
    return { success: false, error: "Failed to delete leads" }
  }
}

export async function bulkSyncToCRM(leadIds: string[], userId: string) {
  try {
    const crmManager = new CRMIntegrationManager(userId)
    const result = await crmManager.bulkSyncLeadsToCRM(leadIds)

    revalidatePath("/dashboard/leads")
    return {
      success: true,
      syncedCount: result.success,
      failedCount: result.failed,
      results: result.results,
    }
  } catch (error) {
    console.error("Error syncing to CRM:", error)
    return { success: false, error: "Failed to sync to CRM" }
  }
}

export async function updateLeadNotes(leadId: string, notes: string, userId: string) {
  try {
    await client.lead.update({
      where: {
        id: leadId,
        userId: userId,
      },
      data: {
        notes: notes,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/leads")
    return { success: true }
  } catch (error) {
    console.error("Error updating lead notes:", error)
    return { success: false, error: "Failed to update notes" }
  }
}

export async function addLeadTags(leadId: string, tags: string[], userId: string) {
  try {
    const lead = await client.lead.findUnique({
      where: { id: leadId, userId: userId },
      select: { tags: true },
    })

    if (!lead) {
      return { success: false, error: "Lead not found" }
    }

    const updatedTags = Array.from(new Set([...lead.tags, ...tags]))

    await client.lead.update({
      where: { id: leadId },
      data: {
        tags: updatedTags,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/leads")
    return { success: true }
  } catch (error) {
    console.error("Error adding lead tags:", error)
    return { success: false, error: "Failed to add tags" }
  }
}

export async function removeLeadTag(leadId: string, tagToRemove: string, userId: string) {
  try {
    const lead = await client.lead.findUnique({
      where: { id: leadId, userId: userId },
      select: { tags: true },
    })

    if (!lead) {
      return { success: false, error: "Lead not found" }
    }

    const updatedTags = lead.tags.filter((tag) => tag !== tagToRemove)

    await client.lead.update({
      where: { id: leadId },
      data: {
        tags: updatedTags,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/leads")
    return { success: true }
  } catch (error) {
    console.error("Error removing lead tag:", error)
    return { success: false, error: "Failed to remove tag" }
  }
}

export async function updateLeadInfo(
  leadId: string,
  updates: {
    name?: string
    email?: string
    phone?: string
  },
  userId: string,
) {
  try {
    // Validate email format if provided
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return { success: false, error: "Invalid email format" }
    }

    await client.lead.update({
      where: {
        id: leadId,
        userId: userId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/leads")
    return { success: true }
  } catch (error) {
    console.error("Error updating lead info:", error)
    return { success: false, error: "Failed to update lead information" }
  }
}
