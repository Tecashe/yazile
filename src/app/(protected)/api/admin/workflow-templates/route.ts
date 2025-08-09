import { NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

export async function POST(request: Request) {
  try {
    const userr = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()

    // Create new workflow template
    const newTemplate = await client.businessWorkflowTemplate.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description,
        complexity: body.complexity || "MEDIUM",
        operations: body.operations || [],
        features: body.features || [],
        integrations: body.integrations || [],
        isPublic: body.isPublic || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        voiceflowProjectId: body.voiceflowProjectId,
        voiceflowVersionId: body.voiceflowVersionId,
        
        // Add any other required fields based on your schema
      },
      include: {
        _count: {
          select: { businessConfigs: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      template: newTemplate,
    })
  } catch (error) {
    console.error("Error creating workflow template:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const userr = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Fetch all workflow templates
    const templates = await client.businessWorkflowTemplate.findMany({
      include: {
        _count: {
          select: { businessConfigs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      templates,
    })
  } catch (error) {
    console.error("Error fetching workflow templates:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}