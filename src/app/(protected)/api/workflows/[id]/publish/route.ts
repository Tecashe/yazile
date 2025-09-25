// still in use - API route for publishing workflows
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflow = await prisma.workflows.update({
      where: { id: params.id },
      data: {
        isActive: true,
        lastRunAt: new Date(),
      },
    })

    // Here you would typically:
    // 1. Validate the workflow structure
    // 2. Register webhooks with social media platforms
    // 3. Set up monitoring and logging
    // 4. Initialize the workflow engine

    return NextResponse.json({
      success: true,
      message: "Workflow published successfully",
      workflow,
    })
  } catch (error) {
    console.error("Failed to publish workflow:", error)
    return NextResponse.json({ error: "Failed to publish workflow" }, { status: 500 })
  }
}
