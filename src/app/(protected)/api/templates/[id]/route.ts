import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user" 
interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/templates/[id]
 * Get a specific workflow template by ID
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.data.id
    const { id } = params

    // Get the template
    const template = await client.workflowTemplate.findUnique({
      where: {
        id,
        isActive: true,
      },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Get user's workflows for this template
    const userWorkflows = await client.userWorkflow.findMany({
      where: {
        userId,
        templateId: id,
      },
      select: {
        id: true,
        name: true,
        status: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Get usage statistics
    const usageStats = await client.userWorkflow.count({
      where: {
        templateId: id,
      },
    })

    return NextResponse.json({
      ...template,
      userWorkflows,
      usageStats: {
        totalInstances: usageStats,
      },
    })
  } catch (error) {
    console.error("Error getting template:", error)
    return NextResponse.json({ error: "Failed to get template" }, { status: 500 })
  }
}

/**
 * PUT /api/templates/[id]
 * Update a workflow template (admin only)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await client.user.findUnique({
      where: { id: session.data.id },
      select: { isAdmin: true },
    })

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Only admins can update templates" }, { status: 403 })
    }

    const { id } = params

    // Check if template exists
    const existingTemplate = await client.workflowTemplate.findUnique({
      where: { id },
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Parse request body
    const body = await req.json()
    const {
      name,
      description,
      category,
      icon,
      featured,
      popular,
      complexity,
      estimatedSetupTime,
      requiredIntegrations,
      configurationSchema,
      n8nTemplateId,
      visualRepresentation,
      expectedOutcomes,
      useCases,
      isActive,
    } = body

    // Update the template
    const updatedTemplate = await client.workflowTemplate.update({
      where: { id },
      data: {
        name,
        description,
        category,
        icon,
        featured,
        popular,
        complexity,
        estimatedSetupTime,
        requiredIntegrations,
        configurationSchema,
        n8nTemplateId,
        visualRepresentation,
        expectedOutcomes,
        useCases,
        isActive,
      },
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a workflow template (admin only)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await client.user.findUnique({
      where: { id: session.data.id },
      select: { isAdmin: true },
    })

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Only admins can delete templates" }, { status: 403 })
    }

    const { id } = params

    // Check if template exists
    const existingTemplate = await client.workflowTemplate.findUnique({
      where: { id },
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Check if there are any workflows using this template
    const workflowCount = await client.userWorkflow.count({
      where: { templateId: id },
    })

    if (workflowCount > 0) {
      // Instead of deleting, mark as inactive
      await client.workflowTemplate.update({
        where: { id },
        data: { isActive: false },
      })

      return NextResponse.json({
        success: true,
        message: "Template marked as inactive because it is in use",
      })
    }

    // Delete the template
    await client.workflowTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}
