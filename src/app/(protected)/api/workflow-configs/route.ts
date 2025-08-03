// import { NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { auth } from "@clerk/nextjs/server"

// export async function GET(request: Request) {
//   try {
//     const { userId } = auth()

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const businessId = searchParams.get("businessId")
//     const status = searchParams.get("status")

//     if (!businessId || businessId !== userId) {
//       return new NextResponse("Forbidden: You can only view your own workflow configurations", { status: 403 })
//     }

//     const whereClause: any = { businessId }
//     if (status) {
//       whereClause.status = status
//     }

//     const workflowConfigs = await client.businessWorkflowConfig.findMany({
//       where: whereClause,
//       include: {
//         template: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             category: true,
//             complexity: true,
//             isPublic: true,
//             isActive: true,
//             operations: true,
//             features: true,
//             integrations: true, // Include detailed integrations from template
//             voiceflowProjectId: true,
//             voiceflowVersionId: true,
//           },
//         },
//         credentials: true, // Include associated credentials
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({ workflowConfigs })
//   } catch (error) {
//     console.error("Error fetching workflow configurations:", error)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const { userId } = auth()

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 })
//     }

//     const { workflowTemplateId, businessId, businessInfo, customRequest, status, isActive } = await request.json()

//     if (!businessId || businessId !== userId) {
//       return new NextResponse("Forbidden: Cannot create workflow for another business", { status: 403 })
//     }

//     if (!workflowTemplateId && !customRequest) {
//       return new NextResponse("Either workflowTemplateId or customRequest must be provided", { status: 400 })
//     }

//     let templateName = "Custom Workflow"
//     let templateDescription = "A custom workflow tailored to your business needs."

//     if (workflowTemplateId) {
//       const template = await client.workflowTemplate.findUnique({
//         where: { id: workflowTemplateId },
//       })
//       if (template) {
//         templateName = template.name
//         templateDescription = template.description
//       }
//     }

//     const newWorkflowConfig = await client.businessWorkflowConfig.create({
//       data: {
//         businessId,
//         templateId: workflowTemplateId || undefined,
//         name: templateName,
//         description: templateDescription,
//         status: status || "ACTIVE",
//         isActive: isActive ?? true,
//         customizations: businessInfo || {}, // Store businessInfo as customizations for now
//         customRequest: customRequest || undefined,
//       },
//     })

//     return NextResponse.json({ success: true, workflowConfig: newWorkflowConfig }, { status: 201 })
//   } catch (error) {
//     console.error("Error creating workflow configuration:", error)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

// export async function PATCH(request: Request) {
//   try {
//     const { userId } = auth()

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 })
//     }

//     const { id, isActive, status } = await request.json()

//     if (!id) {
//       return new NextResponse("Workflow config ID is required", { status: 400 })
//     }

//     const existingConfig = await client.businessWorkflowConfig.findUnique({
//       where: { id },
//     })

//     if (!existingConfig || existingConfig.businessId !== userId) {
//       return new NextResponse("Forbidden: You can only update your own workflow configurations", { status: 403 })
//     }

//     const updatedConfig = await client.businessWorkflowConfig.update({
//       where: { id },
//       data: {
//         isActive: isActive ?? undefined,
//         status: status || undefined,
//       },
//     })

//     return NextResponse.json({ success: true, workflowConfig: updatedConfig })
//   } catch (error) {
//     console.error("Error updating workflow configuration:", error)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }


import { NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

export async function GET(request: Request) {
  try {
    const userr = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")
    const status = searchParams.get("status")

    if (!businessId || businessId !== userId) {
      return new NextResponse("Forbidden: You can only view your own workflow configurations", { status: 403 })
    }

    const whereClause: any = { businessId }
    if (status) {
      whereClause.status = status
    }

    const workflowConfigs = await client.businessWorkflowConfig.findMany({
      where: whereClause,
      include: {
        workflowTemplate: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            complexity: true,
            isPublic: true,
            isActive: true,
            operations: true,
            features: true,
            integrations: true,
            voiceflowProjectId: true,
            voiceflowVersionId: true,
          },
        },
        credentials: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ 
      success: true,
      workflowConfigs 
    })
  } catch (error) {
    console.error("Error fetching workflow configurations:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userr = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { workflowTemplateId, businessId, businessInfo, customRequest, status, isActive } = await request.json()

    if (!businessId || businessId !== userId) {
      return new NextResponse("Forbidden: Cannot create workflow for another business", { status: 403 })
    }

    if (!workflowTemplateId && !customRequest) {
      return new NextResponse("Either workflowTemplateId or customRequest must be provided", { status: 400 })
    }

    let templateName = "Custom Workflow"
    let templateDescription = "A custom workflow tailored to your business needs."

    if (workflowTemplateId) {
      // Use correct model name
      const template = await client.businessWorkflowTemplate.findUnique({
        where: { id: workflowTemplateId },
      })
      if (template) {
        templateName = template.name
        templateDescription = template.description
      }
    }

    const newWorkflowConfig = await client.businessWorkflowConfig.create({
        data: {
          userId, // REQUIRED - you need to provide this
          businessId,
          name: templateName,
          description: templateDescription,
          workflowTemplateId: workflowTemplateId || undefined,
          businessInfo: businessInfo || {}, // Changed from 'customizations'
          integrationConfigs: [], // Optional, has default value
          customRequest: customRequest || undefined,
          status: status || "DRAFT", // Default is DRAFT, not ACTIVE
          isActive: isActive ?? false, // Default is false, not true
        },
      });


    return NextResponse.json({ 
      success: true, 
      workflowConfig: newWorkflowConfig 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating workflow configuration:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const userr = await onUserInfor()
    const userId = userr.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id, isActive, status } = await request.json()

    if (!id) {
      return new NextResponse("Workflow config ID is required", { status: 400 })
    }

    const existingConfig = await client.businessWorkflowConfig.findUnique({
      where: { id },
    })

    if (!existingConfig || existingConfig.businessId !== userId) {
      return new NextResponse("Forbidden: You can only update your own workflow configurations", { status: 403 })
    }

    const updatedConfig = await client.businessWorkflowConfig.update({
      where: { id },
      data: {
        isActive: isActive ?? undefined,
        status: status || undefined,
      },
    })

    return NextResponse.json({ 
      success: true, 
      workflowConfig: updatedConfig 
    })
  } catch (error) {
    console.error("Error updating workflow configuration:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}