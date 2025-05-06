// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { client } from "@/lib/prisma"
// import { onUserInfor } from "@/actions/user"

// /**
//  * API endpoint to manage n8n workflows
//  */
// export async function GET(req: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const  userId  = user.data?.id

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const workflows = await client.n8nWorkflow.findMany({
//       where: { userId },
//     })

//     return NextResponse.json({ workflows })
//   } catch (error) {
//     console.error("Error fetching n8n workflows:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const  userId  = user.data?.id


//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const data = await req.json()

//     // Validate the incoming data
//     if (!data.name || !data.workflowId) {
//       return NextResponse.json({ error: "Missing required fields: name and workflowId" }, { status: 400 })
//     }

//     // Create a new workflow
//     const workflow = await client.n8nWorkflow.create({
//       data: {
//         userId,
//         name: data.name,
//         description: data.description,
//         workflowId: data.workflowId,
//         triggerUrl: data.triggerUrl,
//         isActive: data.isActive ?? true,
//       },
//     })

//     return NextResponse.json({ workflow })
//   } catch (error) {
//     console.error("Error creating n8n workflow:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { createLeadQualificationWorkflow } from "@/services/n8n-integration"
import { n8nService } from "@/services/n8n-service"


export async function GET(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workflows = await client.n8nWorkflow.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ workflows })
  } catch (error) {
    console.error("Error fetching n8n workflows:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POSTE(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate the incoming data
    if (!data.name || !data.workflowId) {
      return NextResponse.json({ error: "Missing required fields: name and workflowId" }, { status: 400 })
    }

    // Create a new workflow
    const workflow = await client.n8nWorkflow.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        workflowId: data.workflowId,
        triggerUrl: data.triggerUrl,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error("Error creating n8n workflow:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { n8nUrl, n8nApiKey } = await req.json()

    if (!n8nUrl || !n8nApiKey) {
      return NextResponse.json({ error: "Missing required fields: n8nUrl and n8nApiKey" }, { status: 400 })
    }

    try {
      // Create a lead qualification workflow template
      const workflow = await createLeadQualificationWorkflow(
        n8nUrl,
        n8nApiKey,
        `Lead Qualification - ${new Date().toISOString().split("T")[0]}`,
      )

      // Save the workflow to the database
      const savedWorkflow = await client.n8nWorkflow.create({
        data: {
          userId,
          name: workflow.name,
          description: "Automatically created lead qualification workflow",
          workflowId: workflow.id,
          triggerUrl: workflow.webhookUrl || "",
          isActive: true,
        },
      })

      return NextResponse.json({
        success: true,
        workflow: savedWorkflow,
        message: "Lead qualification workflow created successfully",
      })
    } catch (error) {
      console.error("Error creating lead qualification workflow:", error)
      return NextResponse.json(
        {
          error: "Failed to create workflow in n8n",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error setting up n8n integration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate the incoming data
    if (!data.connectionId || !data.name || !data.workflowId || !data.triggerUrl) {
      return NextResponse.json(
        {
          error: "Missing required fields: connectionId, name, workflowId, and triggerUrl",
        },
        { status: 400 },
      )
    }

    // Create a new workflow
    const workflow = await n8nService.createWorkflow({
      connectionId: data.connectionId,
      name: data.name,
      description: data.description,
      workflowId: data.workflowId,
      workflowType: data.workflowType || "LEAD_QUALIFICATION",
      triggerUrl: data.triggerUrl,
      webhookUrl: data.webhookUrl,
      configuration: data.configuration,
    })

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error("Error creating n8n workflow:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
