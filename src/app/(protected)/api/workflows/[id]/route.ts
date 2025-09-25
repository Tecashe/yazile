// still in use - API route for individual workflow operations
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
  variables: z.any().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workflow = await prisma.workflows.findUnique({
      where: { id: params.id },
      include: {
        socialAccount: true,
        executions: {
          take: 10,
          orderBy: { startedAt: "desc" },
        },
        analytics: {
          take: 30,
          orderBy: { date: "desc" },
        },
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    return NextResponse.json(workflow)
  } catch (error) {
    console.error("Failed to fetch workflow:", error)
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateWorkflowSchema.parse(body)

    const workflow = await prisma.workflows.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        socialAccount: true,
      },
    })

    return NextResponse.json(workflow)
  } catch (error) {
    console.error("Failed to update workflow:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.workflow.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete workflow:", error)
    return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 })
  }
}
