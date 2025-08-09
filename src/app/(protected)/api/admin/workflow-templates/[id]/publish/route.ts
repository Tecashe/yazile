import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request)
    const { id } = params
    const { isPublic, isActive } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user for publishedBy field
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update template visibility and status
    const updatedTemplate = await client.businessWorkflowTemplate.update({
      where: { id },
      data: {
        isPublic: isPublic,
        isActive: isActive !== undefined ? isActive : true,
        publishedAt: new Date(),
        publishedBy: user.id,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            businessConfigs: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      template: updatedTemplate,
    })
  } catch (error) {
    console.error("Error publishing workflow template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}