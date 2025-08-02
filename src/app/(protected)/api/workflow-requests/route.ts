// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getAuth } from "@clerk/nextjs/server"

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)
//     const body = await request.json()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get the user's database ID
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, firstname: true, lastname: true, email: true },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Extract workflow design data from the builder
//     const workflowDesign = body.workflowDesign || {}
//     const businessInfo = body.businessInfo || {}

//     // Create the workflow request with complete design data
//     const workflowRequest = await client.customWorkflowRequest.create({
//       data: {
//         userId: user.id,
//         title: workflowDesign.title || body.title || "Custom AI Workflow",
//         businessObjective: workflowDesign.description || body.businessObjective || "Custom automation solution",
//         processDescription: body.customRequest || "Custom workflow generated through AI builder",
//         requiredIntegrations: workflowDesign.integrations?.map((i: any) => i.name) || body.selectedChannels || [],
//         budget: workflowDesign.estimatedCost
//           ? Number.parseFloat(workflowDesign.estimatedCost.replace(/[^0-9.-]+/g, "").split("-")[0])
//           : null,
//         urgency: body.urgency || "NORMAL",
//         status: "SUBMITTED",
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             firstname: true,
//             lastname: true,
//             email: true,
//           },
//         },
//       },
//     })

//     // Create notification for admins about new custom workflow request
//     const admins = await client.user.findMany({
//       where: { isAdmin: true },
//       select: { id: true },
//     })

//     // Notify all admins
//     for (const admin of admins) {
//       await client.generalNotification.create({
//         data: {
//           userId: admin.id,
//           type: "BUSINESS_UPDATE",
//           title: "New Custom Workflow Request",
//           message: `${user.firstname} ${user.lastname} has submitted a custom workflow request: "${workflowRequest.title}"`,
//           metadata: {
//             requestId: workflowRequest.id,
//             requestTitle: workflowRequest.title,
//             userEmail: user.email,
//             complexity: workflowDesign.complexity,
//             estimatedCost: workflowDesign.estimatedCost,
//             workflowDesign: workflowDesign,
//             businessInfo: businessInfo,
//             selectedChannels: body.selectedChannels || [],
//             automationFeatures: body.automationFeatures || [],
//             customRequest: body.customRequest || "",
//             baseWorkflowId: body.baseWorkflowId,
//             submittedAt: body.submittedAt,
//             roi: workflowDesign.roi,
//             steps: workflowDesign.steps || [],
//             metrics: workflowDesign.metrics || {},
//             technicalRequirements: workflowDesign.technicalRequirements || [],
//             deploymentChannels: workflowDesign.deploymentChannels || [],
//           },
//         },
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       request: workflowRequest,
//       message: "Custom workflow request submitted successfully",
//     })
//   } catch (error) {
//     console.error("Error creating workflow request:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get the user's database ID
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Fetch user's workflow requests
//     const requests = await client.customWorkflowRequest.findMany({
//       where: {
//         userId: user.id,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       requests,
//     })
//   } catch (error) {
//     console.error("Error fetching workflow requests:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user details
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, firstname: true, lastname: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create the custom workflow request with complete design data
    const workflowRequest = await client.customWorkflowRequest.create({
      data: {
        userId: user.id,
        title: body.title,
        businessObjective: body.businessObjective,
        processDescription: body.customRequest || body.businessObjective,
        requiredIntegrations: body.selectedChannels || [],
        urgency: body.urgency || "NORMAL",
        status: "SUBMITTED",
        // Store complete workflow design in a JSON field
        aiSuggestions: {
          workflowDesign: body.workflowDesign,
          businessInfo: body.businessInfo,
          selectedChannels: body.selectedChannels,
          automationFeatures: body.automationFeatures,
          customRequest: body.customRequest,
          baseWorkflowId: body.baseWorkflowId,
          submittedAt: body.submittedAt,
          estimatedCost: body.estimatedCost,
          roi: body.roi,
          complexity: body.complexity,
          steps: body.steps,
          metrics: body.metrics,
          technicalRequirements: body.technicalRequirements,
          deploymentChannels: body.deploymentChannels,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    })

    // Create notification for admins about new workflow request
    const admins = await client.user.findMany({
      where: { isAdmin: true },
      select: { id: true },
    })

    for (const admin of admins) {
      await client.generalNotification.create({
        data: {
          userId: admin.id,
          type: "WORKFLOW_ACTIVATED",
          title: "New Custom Workflow Request",
          message: `${workflowRequest.user.firstname} ${workflowRequest.user.lastname} has submitted a custom workflow request: "${workflowRequest.title}"`,
          metadata: {
            requestId: workflowRequest.id,
            requestTitle: workflowRequest.title,
            userEmail: workflowRequest.user.email,
            workflowDesign: body.workflowDesign,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      request: workflowRequest,
    })
  } catch (error) {
    console.error("Error creating workflow request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's workflow requests
    const requests = await client.customWorkflowRequest.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error("Error fetching workflow requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
