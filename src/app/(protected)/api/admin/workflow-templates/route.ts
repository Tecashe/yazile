// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getAuth } from "@clerk/nextjs/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Check if user is admin
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { isAdmin: true },
//     })

//     if (!user?.isAdmin) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     // Fetch all workflow templates
//     const templates = await client.businessWorkflowTemplate.findMany({
//       include: {
//         _count: {
//           select: {
//             businessConfigs: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       templates,
//     })
//   } catch (error) {
//     console.error("Error fetching workflow templates:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)
//     const body = await request.json()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Check if user is admin
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, isAdmin: true },
//     })

//     if (!user?.isAdmin) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     // Create new workflow template from the custom request
//     const template = await client.businessWorkflowTemplate.create({
//       data: {
//         name: body.name,
//         category: body.category,
//         description: body.description,
//         complexity: body.complexity || "MEDIUM",
//         operations: body.operations || [],
//         features: body.features || [],
//         integrations: body.integrations || [],
//         isPublic: body.isPublic || false,
//         isActive: true,
//         createdByAdmin: body.createdByAdmin || true,
//         originalRequestId: body.originalRequestId,
//         voiceflowProjectId: body.voiceflowProjectId,
//         voiceflowVersionId: body.voiceflowVersionId,
//         publishedBy: user.id,
//         publishedAt: new Date(),
//       },
//     })

//     // If this template was created from a request, link it
//     if (body.originalRequestId) {
//       await client.customWorkflowRequest.update({
//         where: { id: body.originalRequestId },
//         data: {
//           completedTemplateId: template.id,
//           status: "COMPLETED",
//           actualDelivery: new Date(),
//         },
//       })

//       // Notify the user that their custom workflow is ready
//       const originalRequest = await client.customWorkflowRequest.findUnique({
//         where: { id: body.originalRequestId },
//         include: {
//           user: {
//             select: { id: true, firstname: true, lastname: true },
//           },
//         },
//       })

//       if (originalRequest) {
//         await client.generalNotification.create({
//           data: {
//             userId: originalRequest.userId,
//             type: "WORKFLOW_COMPLETED",
//             title: "Custom Workflow Ready!",
//             message: `Your custom workflow "${template.name}" has been completed and is now available for use.`,
//             metadata: {
//               templateId: template.id,
//               templateName: template.name,
//               requestId: body.originalRequestId,
//             },
//           },
//         })
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       template,
//     })
//   } catch (error) {
//     console.error("Error creating workflow template:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all workflow templates
    const templates = await client.businessWorkflowTemplate.findMany({
      include: {
        _count: {
          select: {
            businessConfigs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      templates,
    })
  } catch (error) {
    console.error("Error fetching workflow templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create new workflow template from the custom request
    const template = await client.businessWorkflowTemplate.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description,
        complexity: body.complexity || "MEDIUM",
        operations: body.operations || [],
        features: body.features || [],
        integrations: body.integrations || [],
        isPublic: body.isPublic || false,
        isActive: true,
        createdByAdmin: body.createdByAdmin || true,
        originalRequestId: body.originalRequestId,
        voiceflowProjectId: body.voiceflowProjectId,
        voiceflowVersionId: body.voiceflowVersionId,
        publishedBy: user.id,
        publishedAt: new Date(),
      },
    })

    // If this template was created from a request, link it and update status
    if (body.originalRequestId) {
      await client.customWorkflowRequest.update({
        where: { id: body.originalRequestId },
        data: {
          completedTemplateId: template.id,
          status: "COMPLETED",
          actualDelivery: new Date(),
        },
      })

      // Notify the user that their custom workflow is ready
      const originalRequest = await client.customWorkflowRequest.findUnique({
        where: { id: body.originalRequestId },
        include: {
          user: {
            select: { id: true, firstname: true, lastname: true },
          },
        },
      })

      if (originalRequest) {
        await client.generalNotification.create({
          data: {
            userId: originalRequest.userId,
            type: "WORKFLOW_COMPLETED",
            title: "Custom Workflow Ready!",
            message: `Your custom workflow "${template.name}" has been completed and is now available for use.`,
            metadata: {
              templateId: template.id,
              templateName: template.name,
              requestId: body.originalRequestId,
              isPublic: body.isPublic,
            },
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error("Error creating workflow template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
