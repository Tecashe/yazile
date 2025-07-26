
// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { z } from "zod"
// import { encrypt } from "@/lib/encryption"
// import { onUserInfor } from "@/actions/user"

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
//         projectId: z.string().optional(), // For Voiceflow
//         versionId: z.string().optional(), // For Voiceflow
//         additionalSettings: z.record(z.string()).optional(),
//       }),
//     }),
//   ),
//   customRequest: z.string().optional(), // New: For custom workflow requests
//   isActive: z.boolean().optional(), // New: For initial deployment status
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
//   integrations: z
//     .array(
//       z.object({
//         name: z.string(),
//         config: z.object({
//           apiKey: z.string().optional(),
//           apiSecret: z.string().optional(),
//           webhookUrl: z.string().optional(),
//           projectId: z.string().optional(), // For Voiceflow
//           versionId: z.string().optional(), // For Voiceflow
//           additionalSettings: z.record(z.string()).optional(),
//         }),
//       }),
//     )
//     .optional(),
//   customRequest: z.string().optional(),
//   isActive: z.boolean().optional(), // Allow updating isActive status
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

//     // Determine initial status and isActive
//     const initialStatus = validatedData.customRequest ? "CUSTOM_REQUEST" : "ACTIVE"
//     const initialIsActive = validatedData.customRequest ? false : true // Custom requests are not active immediately

//     // Create workflow configuration
//     const workflowConfig = await client.businessWorkflowConfig.create({
//       data: {
//         userId: userId,
//         businessId: validatedData.businessId,
//         workflowTemplateId: validatedData.workflowTemplateId,
//         businessInfo: validatedData.businessInfo,
//         // integrationConfigs will be stored in WorkflowIntegrationCredential
//         customRequest: validatedData.customRequest,
//         status: initialStatus,
//         isActive: initialIsActive,
//       },
//       include: {
//         workflowTemplate: true,
//         business: true,
//       },
//     })

//     // Create integration credentials (encrypted)
//     for (const integration of validatedData.integrations) {
//       // Ensure credentials object is properly structured for storage
//       const credentialsToStore: Record<string, any> = {}
//       if (integration.config.apiKey) credentialsToStore.apiKey = integration.config.apiKey
//       if (integration.config.apiSecret) credentialsToStore.apiSecret = integration.config.apiSecret
//       if (integration.config.webhookUrl) credentialsToStore.webhookUrl = integration.config.webhookUrl
//       if (integration.config.projectId) credentialsToStore.projectId = integration.config.projectId
//       if (integration.config.versionId) credentialsToStore.versionId = integration.config.versionId
//       if (integration.config.additionalSettings)
//         credentialsToStore.additionalSettings = integration.config.additionalSettings

//       if (Object.keys(credentialsToStore).length > 0) {
//         await client.workflowIntegrationCredential.create({
//           data: {
//             workflowConfigId: workflowConfig.id,
//             integrationName: integration.name,
//             integrationType: "api_key", // Generic type, can be refined
//             encryptedCredentials: encrypt(JSON.stringify(credentialsToStore)), // In production, encrypt this
//             isActive: true, // Credentials are active by default when created
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
//         customRequest: workflowConfig.customRequest,
//         isActive: workflowConfig.isActive,
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
//     const status = searchParams.get("status") as
//       | "DRAFT"
//       | "CONFIGURING"
//       | "ACTIVE"
//       | "INACTIVE"
//       | "CUSTOM_REQUEST"
//       | null

//     const whereClause: any = { userId: userId }
//     if (businessId) {
//       whereClause.businessId = businessId
//     }
//     if (status) {
//       whereClause.status = status
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
//             encryptedCredentials: true, // Include encrypted credentials for client-side parsing
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
//     const  user = await onUserInfor()
//     const userId = user.data?.id
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     const validatedData = updateWorkflowConfigSchema.parse(body)

//     const { id, integrations, ...updateData } = validatedData

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
//     if (integrations) {
//       for (const integration of integrations) {
//         const credentialsToStore: Record<string, any> = {}
//         if (integration.config.apiKey) credentialsToStore.apiKey = integration.config.apiKey
//         if (integration.config.apiSecret) credentialsToStore.apiSecret = integration.config.apiSecret
//         if (integration.config.webhookUrl) credentialsToStore.webhookUrl = integration.config.webhookUrl
//         if (integration.config.projectId) credentialsToStore.projectId = integration.config.projectId
//         if (integration.config.versionId) credentialsToStore.versionId = integration.config.versionId
//         if (integration.config.additionalSettings)
//           credentialsToStore.additionalSettings = integration.config.additionalSettings

//         if (Object.keys(credentialsToStore).length > 0) {
//           await client.workflowIntegrationCredential.upsert({
//             where: {
//               workflowConfigId_integrationName: {
//                 workflowConfigId: id,
//                 integrationName: integration.name,
//               },
//             },
//             update: {
//               encryptedCredentials: encrypt(JSON.stringify(credentialsToStore)),
//               isActive: true, // Assume credentials are active when updated
//               updatedAt: new Date(),
//             },
//             create: {
//               workflowConfigId: id,
//               integrationName: integration.name,
//               integrationType: "api_key", // Generic type
//               encryptedCredentials: encrypt(JSON.stringify(credentialsToStore)),
//               isActive: true,
//             },
//           })
//         }
//       }
//     }

//     // If workflow is being deactivated, also deactivate its credentials
//     if (updateData.isActive === false) {
//       await client.workflowIntegrationCredential.updateMany({
//         where: { workflowConfigId: id },
//         data: { isActive: false },
//       })
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
import { client } from "@/lib/prisma"
import { z } from "zod"
import { encrypt } from "@/lib/encryption"
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
        projectId: z.string().optional(), // For Voiceflow
        versionId: z.string().optional(), // For Voiceflow
        additionalSettings: z.record(z.string()).optional(),
      }),
    }),
  ),
  customRequest: z.string().optional(), // New: For custom workflow requests
  isActive: z.boolean().optional(), // New: For initial deployment status
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
  integrations: z
    .array(
      z.object({
        name: z.string(),
        config: z.object({
          apiKey: z.string().optional(),
          apiSecret: z.string().optional(),
          webhookUrl: z.string().optional(),
          projectId: z.string().optional(), // For Voiceflow
          versionId: z.string().optional(), // For Voiceflow
          additionalSettings: z.record(z.string()).optional(),
        }),
      }),
    )
    .optional(),
  customRequest: z.string().optional(),
  isActive: z.boolean().optional(), // Allow updating isActive status
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

    // Determine initial status and isActive
    const initialStatus = validatedData.customRequest ? "CUSTOM_REQUEST" : "ACTIVE"
    const initialIsActive = validatedData.customRequest ? false : true // Custom requests are not active immediately

    // Create workflow configuration
    const workflowConfig = await client.businessWorkflowConfig.create({
      data: {
        userId: userId,
        businessId: validatedData.businessId,
        workflowTemplateId: validatedData.workflowTemplateId,
        businessInfo: validatedData.businessInfo,
        // integrationConfigs will be stored in WorkflowIntegrationCredential
        customRequest: validatedData.customRequest,
        status: initialStatus,
        isActive: initialIsActive,
      },
      include: {
        workflowTemplate: true,
        business: true,
      },
    })

    // Create integration credentials (encrypted)
    for (const integration of validatedData.integrations) {
      // Ensure credentials object is properly structured for storage
      const credentialsToStore: Record<string, any> = {}
      if (integration.config.apiKey) credentialsToStore.apiKey = integration.config.apiKey
      if (integration.config.apiSecret) credentialsToStore.apiSecret = integration.config.apiSecret
      if (integration.config.webhookUrl) credentialsToStore.webhookUrl = integration.config.webhookUrl
      if (integration.config.projectId) credentialsToStore.projectId = integration.config.projectId
      if (integration.config.versionId) credentialsToStore.versionId = integration.config.versionId
      if (integration.config.additionalSettings)
        credentialsToStore.additionalSettings = integration.config.additionalSettings

      if (Object.keys(credentialsToStore).length > 0) {
        await client.workflowIntegrationCredential.create({
          data: {
            workflowConfigId: workflowConfig.id,
            integrationName: integration.name,
            integrationType: "api_key", // Generic type, can be refined
            encryptedCredentials: encrypt(JSON.stringify(credentialsToStore)), // In production, encrypt this
            isActive: true, // Credentials are active by default when created
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
        customRequest: workflowConfig.customRequest,
        isActive: workflowConfig.isActive,
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
    const status = searchParams.get("status") as
      | "DRAFT"
      | "CONFIGURING"
      | "ACTIVE"
      | "INACTIVE"
      | "CUSTOM_REQUEST"
      | null

    const whereClause: any = { userId: userId }
    if (businessId) {
      whereClause.businessId = businessId
    }
    if (status) {
      whereClause.status = status
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
            encryptedCredentials: true, // Include encrypted credentials for client-side parsing
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

    const { id, integrations, ...updateData } = validatedData

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
    if (integrations) {
      for (const integration of integrations) {
        const credentialsToStore: Record<string, any> = {}
        if (integration.config.apiKey) credentialsToStore.apiKey = integration.config.apiKey
        if (integration.config.apiSecret) credentialsToStore.apiSecret = integration.config.apiSecret
        if (integration.config.webhookUrl) credentialsToStore.webhookUrl = integration.config.webhookUrl
        if (integration.config.projectId) credentialsToStore.projectId = integration.config.projectId
        if (integration.config.versionId) credentialsToStore.versionId = integration.config.versionId
        if (integration.config.additionalSettings)
          credentialsToStore.additionalSettings = integration.config.additionalSettings

        if (Object.keys(credentialsToStore).length > 0) {
          await client.workflowIntegrationCredential.upsert({
            where: {
              workflowConfigId_integrationName: {
                workflowConfigId: id,
                integrationName: integration.name,
              },
            },
            update: {
              encryptedCredentials: encrypt(JSON.stringify(credentialsToStore)),
              isActive: true, // Assume credentials are active when updated
              updatedAt: new Date(),
            },
            create: {
              workflowConfigId: id,
              integrationName: integration.name,
              integrationType: "api_key", // Generic type
              encryptedCredentials: encrypt(JSON.stringify(credentialsToStore)),
              isActive: true,
            },
          })
        }
      }
    }

    // If workflow is being deactivated, also deactivate its credentials
    if (updateData.isActive === false) {
      await client.workflowIntegrationCredential.updateMany({
        where: { workflowConfigId: id },
        data: { isActive: false },
      })
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