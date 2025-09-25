
// import { type NextRequest, NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
// import { getCurrentTenant } from "@/lib/authe"
// import { randomUUID } from "crypto"

// const prisma = new PrismaClient()

// export async function GET(request: NextRequest) {
//   try {
//     const { tenantId } = await getCurrentTenant()

//     const workflows = await prisma.workflow.findMany({
//       where: {
//         tenantId: tenantId,
//       },
//       include: {
//         steps: {
//           orderBy: {
//             stepOrder: "asc",
//           },
//         },
//         conditions: true,
//         _count: {
//           select: {
//             executions: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     })

//     return NextResponse.json({ workflows })
//   } catch (error) {
//     console.error("Failed to fetch workflows:", error)
//     return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const workflowData = await request.json()
//     const { tenantId } = await getCurrentTenant()

//     const workflow = await prisma.$transaction(async (tx) => {
//       // Create the workflow
//       const newWorkflow = await tx.workflow.create({
//         data: {
//           tenantId: tenantId,
//           name: workflowData.name,
//           description: workflowData.description,
//           isActive: workflowData.isActive || false,
//           aiPrompt: workflowData.aiPrompt,
//           aiGenerated: workflowData.aiGenerated || false,
//         },
//       })

//       if (workflowData.steps && workflowData.steps.length > 0) {
//         const stepIdMap = new Map<string, string>()

//         // First pass: create UUID mapping for all steps
//         workflowData.steps.forEach((step: any) => {
//           if (!stepIdMap.has(step.stepId)) {
//             stepIdMap.set(step.stepId, randomUUID())
//           }
//         })

//         await tx.workflowStep.createMany({
//           data: workflowData.steps.map((step: any) => ({
//             workflowId: newWorkflow.id,
//             stepId: stepIdMap.get(step.stepId)!,
//             stepType: step.stepType,
//             integrationId: step.integrationId || null,
//             integrationName: step.integrationName,
//             capabilityId: step.capabilityId || randomUUID(),
//             capabilityName: step.capabilityName,
//             config: JSON.stringify(step.config || {}),
//             positionX: step.positionX || 0,
//             positionY: step.positionY || 0,
//             stepOrder: step.stepOrder || 0,
//             parentStepId: step.parentStepId ? stepIdMap.get(step.parentStepId) : null,
//           })),
//         })
//       }

//       if (workflowData.conditions && workflowData.conditions.length > 0) {
//         await tx.workflowCondition.createMany({
//           data: workflowData.conditions.map((condition: any) => ({
//             workflowId: newWorkflow.id,
//             conditionId: randomUUID(),
//             field: condition.field,
//             operator: condition.operator,
//             value: condition.value,
//             trueStepId: condition.trueStepId || null,
//             falseStepId: condition.falseStepId || null,
//           })),
//         })
//       }

//       // Return workflow with relations
//       return await tx.workflow.findUnique({
//         where: { id: newWorkflow.id },
//         include: {
//           steps: {
//             orderBy: { stepOrder: "asc" },
//           },
//           conditions: true,
//         },
//       })
//     })

//     return NextResponse.json(workflow)
//   } catch (error) {
//     console.error("Failed to create workflow:", error)
//     return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const workflowData = await request.json()
//     const { tenantId } = await getCurrentTenant()

//     const workflow = await prisma.$transaction(async (tx) => {
//       // Verify workflow belongs to tenant
//       const existingWorkflow = await tx.workflow.findFirst({
//         where: {
//           id: workflowData.id,
//           tenantId: tenantId,
//         },
//       })

//       if (!existingWorkflow) {
//         throw new Error("Workflow not found")
//       }

//       // Update the workflow
//       const updatedWorkflow = await tx.workflow.update({
//         where: { id: workflowData.id },
//         data: {
//           name: workflowData.name,
//           description: workflowData.description,
//           isActive: workflowData.isActive,
//           aiPrompt: workflowData.aiPrompt,
//           aiGenerated: workflowData.aiGenerated,
//         },
//       })

//       // Delete existing steps and conditions
//       await tx.workflowStep.deleteMany({
//         where: { workflowId: workflowData.id },
//       })
//       await tx.workflowCondition.deleteMany({
//         where: { workflowId: workflowData.id },
//       })

//       if (workflowData.steps && workflowData.steps.length > 0) {
//         const stepIdMap = new Map<string, string>()

//         workflowData.steps.forEach((step: any) => {
//           if (!stepIdMap.has(step.stepId)) {
//             stepIdMap.set(step.stepId, randomUUID())
//           }
//         })

//         await tx.workflowStep.createMany({
//           data: workflowData.steps.map((step: any) => ({
//             workflowId: workflowData.id,
//             stepId: stepIdMap.get(step.stepId)!,
//             stepType: step.stepType,
//             integrationId: step.integrationId || null,
//             integrationName: step.integrationName,
//             capabilityId: step.capabilityId || randomUUID(),
//             capabilityName: step.capabilityName,
//             config: JSON.stringify(step.config || {}),
//             positionX: step.positionX || 0,
//             positionY: step.positionY || 0,
//             stepOrder: step.stepOrder || 0,
//             parentStepId: step.parentStepId ? stepIdMap.get(step.parentStepId) : null,
//           })),
//         })
//       }

//       if (workflowData.conditions && workflowData.conditions.length > 0) {
//         await tx.workflowCondition.createMany({
//           data: workflowData.conditions.map((condition: any) => ({
//             workflowId: workflowData.id,
//             conditionId: randomUUID(),
//             field: condition.field,
//             operator: condition.operator,
//             value: condition.value,
//             trueStepId: condition.trueStepId || null,
//             falseStepId: condition.falseStepId || null,
//           })),
//         })
//       }

//       // Return updated workflow with relations
//       return await tx.workflow.findUnique({
//         where: { id: workflowData.id },
//         include: {
//           steps: {
//             orderBy: { stepOrder: "asc" },
//           },
//           conditions: true,
//         },
//       })
//     })

//     return NextResponse.json(workflow)
//   } catch (error) {
//     console.error("Failed to update workflow:", error)
//     return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id")
//     const { tenantId } = await getCurrentTenant()

//     if (!id) {
//       return NextResponse.json({ error: "Workflow ID required" }, { status: 400 })
//     }

//     await prisma.workflow.deleteMany({
//       where: {
//         id: id,
//         tenantId: tenantId,
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Failed to delete workflow:", error)
//     return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 })
//   }
// }

// still in use - API route for workflow CRUD operations
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createWorkflowSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(z.any()),
  connections: z.array(z.any()),
  socialAccountId: z.string().optional(),
  triggerType: z.string().default("dm"),
  variables: z.any().optional(),
})

const updateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
  variables: z.any().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const workflows = await prisma.workflows.findMany({
      where: { userId },
      include: {
        socialAccount: true,
        _count: {
          select: {
            executions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(workflows)
  } catch (error) {
    console.error("Failed to fetch workflows:", error)
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createWorkflowSchema.parse(body)

    const workflow = await prisma.workflows.create({
      data: {
        ...validatedData,
        nodes: validatedData.nodes,
        connections: validatedData.connections,
      },
      include: {
        socialAccount: true,
      },
    })

    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    console.error("Failed to create workflow:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
  }
}
