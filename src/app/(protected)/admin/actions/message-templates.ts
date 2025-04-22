"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

type TemplateInput = {
  name: string
  content: string
  category: string | null
  tags: string[]
}

export async function getMessageTemplates() {
  try {
    // Get current user
    const user = await currentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if user is admin
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { isAdmin: true },
    })

    if (!dbUser?.isAdmin) {
      throw new Error("Not authorized")
    }

    // Get all templates
    const templates = await client.messageTemplate.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })

    return templates
  } catch (error) {
    console.error("Error fetching message templates:", error)
    throw new Error("Failed to fetch message templates")
  }
}

export async function createMessageTemplate(data: TemplateInput) {
  try {
    // Get current user
    const user = await currentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if user is admin
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { isAdmin: true },
    })

    if (!dbUser?.isAdmin) {
      throw new Error("Not authorized")
    }

    // Create template
    const template = await client.messageTemplate.create({
      data: {
        name: data.name,
        content: data.content,
        category: data.category,
        tags: data.tags,
      },
    })

    revalidatePath("/admin/templates")
    return template
  } catch (error) {
    console.error("Error creating message template:", error)
    throw new Error("Failed to create message template")
  }
}

export async function updateMessageTemplate(id: string, data: TemplateInput) {
  try {
    // Get current user
    const user = await currentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if user is admin
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { isAdmin: true },
    })

    if (!dbUser?.isAdmin) {
      throw new Error("Not authorized")
    }

    // Update template
    const template = await client.messageTemplate.update({
      where: { id },
      data: {
        name: data.name,
        content: data.content,
        category: data.category,
        tags: data.tags,
      },
    })

    revalidatePath("/admin/templates")
    return template
  } catch (error) {
    console.error("Error updating message template:", error)
    throw new Error("Failed to update message template")
  }
}

export async function deleteMessageTemplate(id: string) {
  try {
    // Get current user
    const user = await currentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if user is admin
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { isAdmin: true },
    })

    if (!dbUser?.isAdmin) {
      throw new Error("Not authorized")
    }

    // Delete template
    await client.messageTemplate.delete({
      where: { id },
    })

    revalidatePath("/admin/templates")
    return { success: true }
  } catch (error) {
    console.error("Error deleting message template:", error)
    throw new Error("Failed to delete message template")
  }
}

export async function generateAITemplate(prompt: string) {
  try {
    // Get current user
    const user = await currentUser()
    if (!user) {
      throw new Error("Not authenticated")
    }

    // Check if user is admin
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { isAdmin: true },
    })

    if (!dbUser?.isAdmin) {
      throw new Error("Not authorized")
    }

    // In a real implementation, you would call an AI service here
    // For now, we'll return a mock template based on the prompt

    // Simple template generation based on prompt keywords
    let category = "general"
    if (prompt.toLowerCase().includes("welcome")) {
      category = "welcome"
    } else if (prompt.toLowerCase().includes("follow")) {
      category = "follow-up"
    } else if (prompt.toLowerCase().includes("promo")) {
      category = "promotion"
    } else if (prompt.toLowerCase().includes("support")) {
      category = "support"
    }

    // Extract potential name from prompt
    const nameMatch = prompt.match(/for\s+([a-zA-Z\s]+)/)
    const name = nameMatch ? `${nameMatch[1].trim()} Template` : `AI Generated Template`

    // Generate tags from prompt words
    const words = prompt.toLowerCase().split(/\s+/)
    const commonWords = [
      "a",
      "the",
      "and",
      "or",
      "but",
      "for",
      "with",
      "about",
      "create",
      "generate",
      "template",
      "message",
    ]
    const tags = words.filter((word) => word.length > 3 && !commonWords.includes(word)).slice(0, 5)

    // Generate content based on category
    let content = ""
    switch (category) {
      case "welcome":
        content =
          "Hi {{name}},\n\nWelcome to our platform! We're excited to have you on board.\n\nOur automation tools will help you save time and grow your audience. Feel free to explore the dashboard and let us know if you have any questions.\n\nBest regards,\nThe Team"
        break
      case "follow-up":
        content =
          "Hi {{name}},\n\nI noticed you've been using our platform for a while now. How are you finding it?\n\nI'd love to hear your feedback and see if there's anything we can do to improve your experience.\n\nBest regards,\nThe Team"
        break
      case "promotion":
        content =
          "Hi {{name}},\n\nWe're excited to announce our new premium features! For a limited time, you can upgrade your account with a 20% discount.\n\nUse code PREMIUM20 at checkout.\n\nBest regards,\nThe Team"
        break
      case "support":
        content =
          "Hi {{name}},\n\nThank you for reaching out to our support team. We're here to help!\n\nCould you please provide more details about the issue you're experiencing? Screenshots or screen recordings would be helpful.\n\nBest regards,\nSupport Team"
        break
      default:
        content =
          "Hi {{name}},\n\nThank you for your interest in our platform. We're here to help you achieve your goals.\n\nLet me know if you have any questions or need assistance with anything.\n\nBest regards,\nThe Team"
    }

    return {
      name,
      content,
      category,
      tags,
    }
  } catch (error) {
    console.error("Error generating AI template:", error)
    throw new Error("Failed to generate AI template")
  }
}

