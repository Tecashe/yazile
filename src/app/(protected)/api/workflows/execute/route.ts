// import { type NextRequest, NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export async function POST(request: NextRequest) {
//   try {
//     const { workflowId, inputData } = await request.json()
//     const tenantId = request.headers.get("x-tenant-id") || "default-tenant-id"

//     if (!workflowId) {
//       return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 })
//     }

//     // Fetch workflow with steps and conditions
//     const workflow = await prisma.workflow.findFirst({
//       where: {
//         id: workflowId,
//         tenantId: tenantId,
//         isActive: true,
//       },
//       include: {
//         steps: {
//           orderBy: { stepOrder: "asc" },
//         },
//         conditions: true,
//       },
//     })

//     if (!workflow) {
//       return NextResponse.json({ error: "Workflow not found or inactive" }, { status: 404 })
//     }

//     // Create execution record
//     const execution = await prisma.workflowExecution.create({
//       data: {
//         workflowId: workflowId,
//         status: "running",
//         inputData: JSON.stringify(inputData || {}),
//         triggeredBy: "manual", // Could be 'webhook', 'schedule', etc.
//       },
//     })

//     // Execute workflow steps (simplified - in production you'd have a proper workflow engine)
//     try {
//       const executionLog = []
//       const currentData = inputData || {}

//       for (const step of workflow.steps) {
//         executionLog.push({
//           stepId: step.stepId,
//           stepName: step.capabilityName,
//           status: "executing",
//           timestamp: new Date().toISOString(),
//         })

//         // Here you would implement actual integration calls
//         // For now, we'll simulate execution
//         await new Promise((resolve) => setTimeout(resolve, 100))

//         executionLog.push({
//           stepId: step.stepId,
//           stepName: step.capabilityName,
//           status: "completed",
//           timestamp: new Date().toISOString(),
//           output: { success: true, message: `${step.capabilityName} executed successfully` },
//         })
//       }

//       // Update execution as completed
//       await prisma.workflowExecution.update({
//         where: { id: execution.id },
//         data: {
//           status: "completed",
//           completedAt: new Date(),
//           outputData: JSON.stringify(currentData),
//           executionLog: JSON.stringify(executionLog),
//         },
//       })

//       return NextResponse.json({
//         executionId: execution.id,
//         status: "completed",
//         executionLog,
//         outputData: currentData,
//       })
//     } catch (stepError) {
//       // Update execution as failed
//       await prisma.workflowExecution.update({
//         where: { id: execution.id },
//         data: {
//           status: "failed",
//           completedAt: new Date(),
//           errorMessage: stepError instanceof Error ? stepError.message : "Unknown error",
//         },
//       })

//       throw stepError
//     }
//   } catch (error) {
//     console.error("Failed to execute workflow:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to execute workflow",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentTenant } from "@/lib/authe"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { workflowId, inputData } = await request.json()
    const { tenantId } = await getCurrentTenant()

    if (!workflowId) {
      return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 })
    }

    // Fetch workflow with steps and conditions
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        tenantId: tenantId,
        isActive: true,
      },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
        conditions: true,
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found or inactive" }, { status: 404 })
    }

    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflowId,
        status: "running",
        inputData: JSON.stringify(inputData || {}),
        triggeredBy: "manual", // Could be 'webhook', 'schedule', etc.
      },
    })

    // Execute workflow steps (simplified - in production you'd have a proper workflow engine)
    try {
      const executionLog = []
      const currentData = inputData || {}

      for (const step of workflow.steps) {
        executionLog.push({
          stepId: step.stepId,
          stepName: step.capabilityName,
          status: "executing",
          timestamp: new Date().toISOString(),
        })

        // Here you would implement actual integration calls
        // For now, we'll simulate execution
        await new Promise((resolve) => setTimeout(resolve, 100))

        executionLog.push({
          stepId: step.stepId,
          stepName: step.capabilityName,
          status: "completed",
          timestamp: new Date().toISOString(),
          output: { success: true, message: `${step.capabilityName} executed successfully` },
        })
      }

      // Update execution as completed
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          outputData: JSON.stringify(currentData),
          executionLog: JSON.stringify(executionLog),
        },
      })

      return NextResponse.json({
        executionId: execution.id,
        status: "completed",
        executionLog,
        outputData: currentData,
      })
    } catch (stepError) {
      // Update execution as failed
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "failed",
          completedAt: new Date(),
          errorMessage: stepError instanceof Error ? stepError.message : "Unknown error",
        },
      })

      throw stepError
    }
  } catch (error) {
    console.error("Failed to execute workflow:", error)
    return NextResponse.json(
      {
        error: "Failed to execute workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
