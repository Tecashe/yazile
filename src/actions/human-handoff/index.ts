"use server"

import { onUserInfor } from "../user"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { client } from "@/lib/prisma"

const handoffSettingsSchema = z.object({
  isEnabled: z.boolean(),
  notificationEmail: z.string().email().optional().or(z.literal("")),
  slackWebhookUrl: z.string().url().optional().or(z.literal("")),
  slackChannel: z.string().optional().or(z.literal("")),
  teamsWebhookUrl: z.string().url().optional().or(z.literal("")),
  n8nWorkflowId: z.string().optional().or(z.literal("")),
  defaultPriority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  businessHoursOnly: z.boolean(),
  autoAssign: z.boolean(),
  maxWaitTime: z.number().min(30).max(3600),
})

const agentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  slackUserId: z.string().optional().or(z.literal("")),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  maxConcurrent: z.number().min(1).max(10),
  timezone: z.string(),
})

export async function updateHandoffSettings(formData: FormData) {
  const userr = await onUserInfor()
  const userId = userr.data?.id
  if (!userId) redirect("/sign-in")

  try {
    const data = {
      isEnabled: formData.get("isEnabled") === "true",
      notificationEmail: formData.get("notificationEmail") as string,
      slackWebhookUrl: formData.get("slackWebhookUrl") as string,
      slackChannel: formData.get("slackChannel") as string,
      teamsWebhookUrl: formData.get("teamsWebhookUrl") as string,
      n8nWorkflowId: formData.get("n8nWorkflowId") as string,
      defaultPriority: formData.get("defaultPriority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      businessHoursOnly: formData.get("businessHoursOnly") === "true",
      autoAssign: formData.get("autoAssign") === "true",
      maxWaitTime: Number.parseInt(formData.get("maxWaitTime") as string),
    }

    const validatedData = handoffSettingsSchema.parse(data)

    // Get user's business
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: { businesses: { take: 1 } },
    })

    if (!user || !user.businesses[0]) {
      throw new Error("Business not found!!")
    }

    await client.handoffSettings.upsert({
      where: { userId: user.id },
      update: {
        ...validatedData,
        businessId: user.businesses[0].id,
      },
      create: {
        ...validatedData,
        userId: user.id,
        businessId: user.businesses[0].id,
      },
    })

    revalidatePath("/settings/handoff")
    return { success: true, message: "Settings updated successfully" }
  } catch (error) {
    console.error("Error updating handoff settings:", error)
    return { success: false, message: "Failed to update settings" }
  }
}

export async function createAgent(formData: FormData) {
  const userr = await onUserInfor()
  const userId = userr.data?.id
  if (!userId) redirect("/sign-in")

  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      slackUserId: formData.get("slackUserId") as string,
      skills: JSON.parse((formData.get("skills") as string) || "[]"),
      languages: JSON.parse((formData.get("languages") as string) || "[]"),
      maxConcurrent: Number.parseInt(formData.get("maxConcurrent") as string),
      timezone: formData.get("timezone") as string,
    }

    const validatedData = agentSchema.parse(data)

    // Get user's business
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: { businesses: { take: 1 } },
    })

    if (!user || !user.businesses[0]) {
      throw new Error("Business not found")
    }

    // Create agent
    const agent = await client.agent.create({
      data: {
        ...validatedData,
        workingHours: undefined, // Can be configured later
      },
    })

    // Assign agent to business
    await client.agentBusinessAssignment.create({
      data: {
        agentId: agent.id,
        businessId: user.businesses[0].id,
        assignedBy: user.id,
      },
    })

    revalidatePath("/settings/handoff")
    return { success: true, message: "Agent created successfully" }
  } catch (error) {
    console.error("Error creating agent:", error)
    return { success: false, message: "Failed to create agent" }
  }
}

export async function toggleAgentStatus(agentId: string, isActive: boolean) {
  const userr = await onUserInfor()
  const userId = userr.data?.id
  if (!userId) redirect("/sign-in")

  try {
    await client.agent.update({
      where: { id: agentId },
      data: { isActive },
    })

    revalidatePath("/settings/handoff")
    return { success: true, message: `Agent ${isActive ? "activated" : "deactivated"} successfully` }
  } catch (error) {
    console.error("Error toggling agent status:", error)
    return { success: false, message: "Failed to update agent status" }
  }
}
