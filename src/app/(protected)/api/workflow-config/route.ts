// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { client } from "@/lib/prisma"
// import { z } from "zod"
// import { onUserInfor } from "@/actions/user"

// const createWorkflowConfigSchema = z.object({
//   workflowTemplateId: z.string().uuid(),
//   businessId: z.string().uuid(),
//   businessInfo: z.object({
//     businessName: z.string().min(1),
//     businessType: z.string().min(1),
//     description: z.string().optional(),
//     website: z.string().optional(),
//     phone: z.string().optional(),
//     email: z.string().email().optional(),
//   }),
//   integrations: z.array(
//     z.object({
//       name: z.string(),
//       config: z.object({
//         apiKey: z.string().optional(),
//         apiSecret: z.string().optional(),
//         webhookUrl: z.string().optional(),
//         additionalSettings: z.record(z.string()).optional(),
//       }),
//     }),
//   ),
// })

// export async function POST(req: NextRequest) {
//   try {
//     const  user = await onUserInfor()
//     const userId = user.data?.id
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     const validatedData = createWorkflowConfigSchema.parse(body)

//     // Check if user owns the business
//     const business = await client.business.findFirst({
//       where: {
//         id: validatedData.businessId,
//         userId: userId,
//       },
//     })

//     if (!business) {
//       return NextResponse.json({ error: "Business not found" }, { status: 404 })
//     }

//     // Check if workflow template exists
//     const workflowTemplate = await client.businessWorkflowTemplate.findUnique({
//       where: { id: validatedData.workflowTemplateId },
//     })

//     if (!workflowTemplate) {
//       return NextResponse.json({ error: "Workflow template not found" }, { status: 404 })
//     }

//     // Create workflow configuration
//     const workflowConfig = await client.businessWorkflowConfig.create({
//       data: {
//         userId: userId,
//         businessId: validatedData.businessId,
//         workflowTemplateId: validatedData.workflowTemplateId,
//         businessInfo: validatedData.businessInfo,
//         integrationConfigs: validatedData.integrations,
//         status: "DRAFT",
//       },
//       include: {
//         workflowTemplate: true,
//         business: true,
//       },
//     })

//     // Create integration credentials (encrypted)
//     for (const integration of validatedData.integrations) {
//       if (integration.config.apiKey || integration.config.apiSecret) {
//         await client.workflowIntegrationCredential.create({
//           data: {
//             workflowConfigId: workflowConfig.id,
//             integrationName: integration.name,
//             integrationType: "api_key",
//             encryptedCredentials: JSON.stringify(integration.config), // In production, encrypt this
//             isActive: true,
//           },
//         })
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       workflowConfig: {
//         id: workflowConfig.id,
//         status: workflowConfig.status,
//         workflowTemplate: workflowConfig.workflowTemplate,
//         businessInfo: workflowConfig.businessInfo,
//       },
//     })
//   } catch (error) {
//     console.error("Error creating workflow config:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const  user = await onUserInfor()
//     const userId = user.data?.id
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(req.url)
//     const businessId = searchParams.get("businessId")

//     const whereClause: any = { userId: userId }
//     if (businessId) {
//       whereClause.businessId = businessId
//     }

//     const workflowConfigs = await client.businessWorkflowConfig.findMany({
//       where: whereClause,
//       include: {
//         workflowTemplate: true,
//         business: {
//           select: {
//             id: true,
//             businessName: true,
//             businessType: true,
//           },
//         },
//         credentials: {
//           select: {
//             id: true,
//             integrationName: true,
//             integrationType: true,
//             isActive: true,
//             lastVerified: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       workflowConfigs,
//     })
//   } catch (error) {
//     console.error("Error fetching workflow configs:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { client } from "@/lib/prisma"
// import { z } from "zod"

// const createWorkflowConfigSchema = z.object({
//   workflowTemplateId: z.string().uuid().nullable().optional(), // Nullable for custom requests
//   businessId: z.string().uuid(),
//   businessInfo: z.object({
//     businessName: z.string().min(1),
//     businessType: z.string().min(1),
//     description: z.string().optional(),
//     website: z.string().optional(),
//     phone: z.string().optional(),
//     email: z.string().email().optional(),
//   }),
//   integrations: z.array(
//     z.object({
//       name: z.string(),
//       config: z.object({
//         apiKey: z.string().optional(),
//         apiSecret: z.string().optional(),
//         webhookUrl: z.string().optional(),
//         additionalSettings: z.record(z.string()).optional(),
//       }),
//     }),
//   ),
//   voiceflowProjectId: z.string().optional(), // New: Passed from frontend for selected template
//   voiceflowVersionId: z.string().optional(), // New: Passed from frontend for selected template
//   customRequest: z.string().optional(), // New: For custom workflow requests
// })

// const updateWorkflowConfigSchema = z.object({
//   id: z.string().uuid(),
//   status: z.enum(["DRAFT", "CONFIGURING", "ACTIVE", "INACTIVE", "CUSTOM_REQUEST"]).optional(),
//   businessInfo: z
//     .object({
//       businessName: z.string().min(1).optional(),
//       businessType: z.string().min(1).optional(),
//       description: z.string().optional(),
//       website: z.string().optional(),
//       phone: z.string().optional(),
//       email: z.string().email().optional(),
//     })
//     .optional(),
//   integrationConfigs: z
//     .array(
//       z.object({
//         name: z.string(),
//         config: z.object({
//           apiKey: z.string().optional(),
//           apiSecret: z.string().optional(),
//           webhookUrl: z.string().optional(),
//           additionalSettings: z.record(z.string()).optional(),
//         }),
//       }),
//     )
//     .optional(),
//   customRequest: z.string().optional(),
//   voiceflowProjectId: z.string().optional(),
//   voiceflowVersionId: z.string().optional(),
// })

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     const validatedData = createWorkflowConfigSchema.parse(body)

//     // Check if user owns the business
//     const business = await client.business.findFirst({
//       where: {
//         id: validatedData.businessId,
//         userId: userId,
//       },
//     })

//     if (!business) {
//       return NextResponse.json({ error: "Business not found" }, { status: 404 })
//     }

//     let workflowTemplate = null
//     if (validatedData.workflowTemplateId) {
//       workflowTemplate = await client.businessWorkflowTemplate.findUnique({
//         where: { id: validatedData.workflowTemplateId },
//       })

//       if (!workflowTemplate) {
//         return NextResponse.json({ error: "Workflow template not found" }, { status: 404 })
//       }
//     } else if (!validatedData.customRequest) {
//       return NextResponse.json(
//         { error: "Either workflowTemplateId or customRequest must be provided" },
//         { status: 400 },
//       )
//     }

//     // Determine initial status
//     const initialStatus = validatedData.customRequest ? "CUSTOM_REQUEST" : "CONFIGURING"

//     // Create workflow configuration
//     const workflowConfig = await client.businessWorkflowConfig.create({
//       data: {
//         userId: userId,
//         businessId: validatedData.businessId,
//         workflowTemplateId: validatedData.workflowTemplateId,
//         businessInfo: validatedData.businessInfo,
//         integrationConfigs: validatedData.integrations,
//         voiceflowProjectId: validatedData.voiceflowProjectId || workflowTemplate?.voiceflowProjectId,
//         voiceflowVersionId: validatedData.voiceflowVersionId || workflowTemplate?.voiceflowVersionId,
//         customRequest: validatedData.customRequest,
//         status: initialStatus,
//       },
//       include: {
//         workflowTemplate: true,
//         business: true,
//       },
//     })

//     // Create integration credentials (encrypted)
//     for (const integration of validatedData.integrations) {
//       if (integration.config.apiKey || integration.config.apiSecret) {
//         await client.workflowIntegrationCredential.create({
//           data: {
//             workflowConfigId: workflowConfig.id,
//             integrationName: integration.name,
//             integrationType: "api_key", // Assuming API key for now
//             encryptedCredentials: JSON.stringify(integration.config), // In production, encrypt this
//             isActive: true,
//           },
//         })
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       workflowConfig: {
//         id: workflowConfig.id,
//         status: workflowConfig.status,
//         workflowTemplate: workflowConfig.workflowTemplate,
//         businessInfo: workflowConfig.businessInfo,
//         voiceflowProjectId: workflowConfig.voiceflowProjectId,
//         voiceflowVersionId: workflowConfig.voiceflowVersionId,
//         customRequest: workflowConfig.customRequest,
//       },
//     })
//   } catch (error) {
//     console.error("Error creating workflow config:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(req.url)
//     const businessId = searchParams.get("businessId")

//     const whereClause: any = { userId: userId }
//     if (businessId) {
//       whereClause.businessId = businessId
//     }

//     const workflowConfigs = await client.businessWorkflowConfig.findMany({
//       where: whereClause,
//       include: {
//         workflowTemplate: true,
//         business: {
//           select: {
//             id: true,
//             businessName: true,
//             businessType: true,
//           },
//         },
//         credentials: {
//           select: {
//             id: true,
//             integrationName: true,
//             integrationType: true,
//             isActive: true,
//             lastVerified: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       workflowConfigs,
//     })
//   } catch (error) {
//     console.error("Error fetching workflow configs:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function PATCH(req: NextRequest) {
//   try {
//     const { userId } = auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     const validatedData = updateWorkflowConfigSchema.parse(body)

//     const { id, ...updateData } = validatedData

//     const existingConfig = await client.businessWorkflowConfig.findUnique({
//       where: { id: id },
//     })

//     if (!existingConfig || existingConfig.userId !== userId) {
//       return NextResponse.json({ error: "Workflow configuration not found or unauthorized" }, { status: 404 })
//     }

//     const updatedConfig = await client.businessWorkflowConfig.update({
//       where: { id: id },
//       data: {
//         ...updateData,
//         updatedAt: new Date(),
//       },
//       include: {
//         workflowTemplate: true,
//         business: true,
//       },
//     })

//     // Update integration credentials if provided
//     if (updateData.integrationConfigs) {
//       for (const integration of updateData.integrationConfigs) {
//         if (integration.config.apiKey || integration.config.apiSecret) {
//           await client.workflowIntegrationCredential.upsert({
//             where: {
//               workflowConfigId_integrationName: {
//                 workflowConfigId: id,
//                 integrationName: integration.name,
//               },
//             },
//             update: {
//               encryptedCredentials: JSON.stringify(integration.config),
//               isActive: true,
//               updatedAt: new Date(),
//             },
//             create: {
//               workflowConfigId: id,
//               integrationName: integration.name,
//               integrationType: "api_key",
//               encryptedCredentials: JSON.stringify(integration.config),
//               isActive: true,
//             },
//           })
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       workflowConfig: updatedConfig,
//     })
//   } catch (error) {
//     console.error("Error updating workflow config:", error)
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
//     }
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { z } from "zod"
import { onUserInfor } from "@/actions/user"

const createWorkflowConfigSchema = z.object({
  workflowTemplateId: z.string().uuid().nullable().optional(), // Nullable for custom requests
  businessId: z.string().uuid(),
  businessInfo: z.object({
    businessName: z.string().min(1),
    businessType: z.string().min(1),
    description: z.string().optional(),
    website: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }),
  integrations: z.array(
    z.object({
      name: z.string(),
      config: z.object({
        apiKey: z.string().optional(),
        apiSecret: z.string().optional(),
        webhookUrl: z.string().optional(),
        additionalSettings: z.record(z.string()).optional(),
      }),
    }),
  ),
  // Removed voiceflowProjectId and voiceflowVersionId as they are now global environment variables
  customRequest: z.string().optional(), // New: For custom workflow requests
})

const updateWorkflowConfigSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["DRAFT", "CONFIGURING", "ACTIVE", "INACTIVE", "CUSTOM_REQUEST"]).optional(),
  businessInfo: z
    .object({
      businessName: z.string().min(1).optional(),
      businessType: z.string().min(1).optional(),
      description: z.string().optional(),
      website: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
  integrationConfigs: z
    .array(
      z.object({
        name: z.string(),
        config: z.object({
          apiKey: z.string().optional(),
          apiSecret: z.string().optional(),
          webhookUrl: z.string().optional(),
          additionalSettings: z.record(z.string()).optional(),
        }),
      }),
    )
    .optional(),
  customRequest: z.string().optional(),
  // Removed voiceflowProjectId and voiceflowVersionId as they are now global environment variables
})

export async function POST(req: NextRequest) {
  try {
    const  user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createWorkflowConfigSchema.parse(body)

    // Check if user owns the business
    const business = await client.business.findFirst({
      where: {
        id: validatedData.businessId,
        userId: userId,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    let workflowTemplate = null
    if (validatedData.workflowTemplateId) {
      workflowTemplate = await client.businessWorkflowTemplate.findUnique({
        where: { id: validatedData.workflowTemplateId },
      })

      if (!workflowTemplate) {
        return NextResponse.json({ error: "Workflow template not found" }, { status: 404 })
      }
    } else if (!validatedData.customRequest) {
      return NextResponse.json(
        { error: "Either workflowTemplateId or customRequest must be provided" },
        { status: 400 },
      )
    }

    // Determine initial status
    const initialStatus = validatedData.customRequest ? "CUSTOM_REQUEST" : "CONFIGURING"

    // Create workflow configuration
    const workflowConfig = await client.businessWorkflowConfig.create({
      data: {
        userId: userId,
        businessId: validatedData.businessId,
        workflowTemplateId: validatedData.workflowTemplateId,
        businessInfo: validatedData.businessInfo,
        integrationConfigs: validatedData.integrations,
        // Removed voiceflowProjectId and voiceflowVersionId from here
        customRequest: validatedData.customRequest,
        status: initialStatus,
      },
      include: {
        workflowTemplate: true,
        business: true,
      },
    })

    // Create integration credentials (encrypted)
    for (const integration of validatedData.integrations) {
      if (integration.config.apiKey || integration.config.apiSecret) {
        await client.workflowIntegrationCredential.create({
          data: {
            workflowConfigId: workflowConfig.id,
            integrationName: integration.name,
            integrationType: "api_key", // Assuming API key for now
            encryptedCredentials: JSON.stringify(integration.config), // In production, encrypt this
            isActive: true,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      workflowConfig: {
        id: workflowConfig.id,
        status: workflowConfig.status,
        workflowTemplate: workflowConfig.workflowTemplate,
        businessInfo: workflowConfig.businessInfo,
        // Removed voiceflowProjectId and voiceflowVersionId from here
        customRequest: workflowConfig.customRequest,
      },
    })
  } catch (error) {
    console.error("Error creating workflow config:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const  user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get("businessId")

    const whereClause: any = { userId: userId }
    if (businessId) {
      whereClause.businessId = businessId
    }

    const workflowConfigs = await client.businessWorkflowConfig.findMany({
      where: whereClause,
      include: {
        workflowTemplate: true,
        business: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
          },
        },
        credentials: {
          select: {
            id: true,
            integrationName: true,
            integrationType: true,
            isActive: true,
            lastVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      workflowConfigs,
    })
  } catch (error) {
    console.error("Error fetching workflow configs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const  user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = updateWorkflowConfigSchema.parse(body)

    const { id, ...updateData } = validatedData

    const existingConfig = await client.businessWorkflowConfig.findUnique({
      where: { id: id },
    })

    if (!existingConfig || existingConfig.userId !== userId) {
      return NextResponse.json({ error: "Workflow configuration not found or unauthorized" }, { status: 404 })
    }

    const updatedConfig = await client.businessWorkflowConfig.update({
      where: { id: id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        workflowTemplate: true,
        business: true,
      },
    })

    // Update integration credentials if provided
    if (updateData.integrationConfigs) {
      for (const integration of updateData.integrationConfigs) {
        if (integration.config.apiKey || integration.config.apiSecret) {
          await client.workflowIntegrationCredential.upsert({
            where: {
              workflowConfigId_integrationName: {
                workflowConfigId: id,
                integrationName: integration.name,
              },
            },
            update: {
              encryptedCredentials: JSON.stringify(integration.config),
              isActive: true,
              updatedAt: new Date(),
            },
            create: {
              workflowConfigId: id,
              integrationName: integration.name,
              integrationType: "api_key",
              encryptedCredentials: JSON.stringify(integration.config),
              isActive: true,
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      workflowConfig: updatedConfig,
    })
  } catch (error) {
    console.error("Error updating workflow config:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
