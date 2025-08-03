import { NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { onUserInfor } from "@/actions/user"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const  userr  = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is admin (proper database lookup)
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return new NextResponse("Forbidden: Not an admin", { status: 403 })
    }

    const { id } = params

    // Use correct model name
    const template = await client.businessWorkflowTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { businessConfigs: true },
        },
      },
    })

    if (!template) {
      return new NextResponse("Workflow template not found", { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      template 
    })
  } catch (error) {
    console.error("Error fetching workflow template:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const  userr  = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is admin (proper database lookup)
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true },
    })

    if (!user?.isAdmin) {
      return new NextResponse("Forbidden: Not an admin", { status: 403 })
    }

    const { id } = params
    const body = await request.json()

    // Use correct model name and remove non-existent fields
    const updatedTemplate = await client.businessWorkflowTemplate.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        category: body.category ?? undefined,
        description: body.description ?? undefined,
        complexity: body.complexity ?? undefined,
        isPublic: body.isPublic ?? undefined,
        isActive: body.isActive ?? undefined,
        operations: body.operations ?? undefined,
        features: body.features ?? undefined,
        integrations: body.integrations ?? undefined,
        voiceflowProjectId: body.voiceflowProjectId ?? undefined,
        voiceflowVersionId: body.voiceflowVersionId ?? undefined,
        // Removed workflowDesign as it doesn't exist in the schema
      },
    })

    return NextResponse.json({ 
      success: true, 
      template: updatedTemplate 
    })
  } catch (error) {
    console.error("Error updating workflow template:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const  userr  = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is admin (proper database lookup)
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return new NextResponse("Forbidden: Not an admin", { status: 403 })
    }

    const { id } = params

    // Check if template exists
    const template = await client.businessWorkflowTemplate.findUnique({
      where: { id },
    })

    if (!template) {
      return new NextResponse("Workflow template not found", { status: 404 })
    }

    // Delete the template
    await client.businessWorkflowTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ 
      success: true,
      message: "Template deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting workflow template:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}