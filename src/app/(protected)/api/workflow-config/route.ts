import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { z } from "zod"
import { onUserInfor } from "@/actions/user"

const createWorkflowConfigSchema = z.object({
  workflowTemplateId: z.string().uuid(),
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

    // Check if workflow template exists
    const workflowTemplate = await client.businessWorkflowTemplate.findUnique({
      where: { id: validatedData.workflowTemplateId },
    })

    if (!workflowTemplate) {
      return NextResponse.json({ error: "Workflow template not found" }, { status: 404 })
    }

    // Create workflow configuration
    const workflowConfig = await client.businessWorkflowConfig.create({
      data: {
        userId: userId,
        businessId: validatedData.businessId,
        workflowTemplateId: validatedData.workflowTemplateId,
        businessInfo: validatedData.businessInfo,
        integrationConfigs: validatedData.integrations,
        status: "DRAFT",
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
            integrationType: "api_key",
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
