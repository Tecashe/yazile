import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user" 
/**
 * GET /api/templates
 * Get all workflow templates
 */
export async function GET(req: NextRequest) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get("category")
    const featured = searchParams.has("featured") ? searchParams.get("featured") === "true" : undefined
    const popular = searchParams.has("popular") ? searchParams.get("popular") === "true" : undefined
    const complexity = searchParams.get("complexity")
    const search = searchParams.get("search")
    const limit = searchParams.has("limit") ? Number.parseInt(searchParams.get("limit") as string, 10) : 50
    const offset = searchParams.has("offset") ? Number.parseInt(searchParams.get("offset") as string, 10) : 0

    // Build the query
    const query: any = {
      where: {
        isActive: true,
      },
      orderBy: [{ featured: "desc" as const }, { popular: "desc" as const }, { name: "asc" as const }],
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: {
            userWorkflows: true,
          },
        },
      },
    }

    // Add filters if provided
    if (category) {
      query.where.category = category
    }

    if (featured !== undefined) {
      query.where.featured = featured
    }

    if (popular !== undefined) {
      query.where.popular = popular
    }

    if (complexity) {
      query.where.complexity = complexity
    }

    if (search) {
      query.where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { useCases: { has: search } },
      ]
    }

    // Get templates
    const templates = await client.workflowTemplate.findMany(query)

    // Get total count for pagination
    const totalCount = await client.workflowTemplate.count({
      where: query.where,
    })

    // Get user's workflows for each template
    const userId = session.data.id
    const userWorkflows = await client.userWorkflow.findMany({
      where: {
        userId,
        templateId: {
          in: templates.map((template) => template.id),
        },
      },
      select: {
        id: true,
        templateId: true,
      },
    })

    // Group user workflows by template ID
    const userWorkflowsByTemplate = userWorkflows.reduce(
      (acc, workflow) => {
        if (!acc[workflow.templateId]) {
          acc[workflow.templateId] = []
        }
        acc[workflow.templateId].push(workflow.id)
        return acc
      },
      {} as Record<string, string[]>,
    )

    // Add user workflows to templates
    const templatesWithUserData = templates.map((template) => ({
      ...template,
      userWorkflows: userWorkflowsByTemplate[template.id] || [],
    }))

    return NextResponse.json({
      templates: templatesWithUserData,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error("Error getting templates:", error)
    return NextResponse.json({ error: "Failed to get templates" }, { status: 500 })
  }
}

/**
 * POST /api/templates
 * Create a new workflow template (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await client.user.findUnique({
      where: { id: session.data.id },
      select: { isAdmin: true },
    })

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Only admins can create templates" }, { status: 403 })
    }

    // Parse request body
    const body = await req.json()
    const {
      name,
      description,
      category,
      icon,
      featured,
      popular,
      complexity,
      estimatedSetupTime,
      requiredIntegrations,
      configurationSchema,
      n8nTemplateId,
      visualRepresentation,
      expectedOutcomes,
      useCases,
    } = body

    // Validate required fields
    if (!name || !description || !category || !configurationSchema) {
      return NextResponse.json(
        { error: "Name, description, category, and configurationSchema are required" },
        { status: 400 },
      )
    }

    // Create the template
    const template = await client.workflowTemplate.create({
      data: {
        name,
        description,
        category,
        icon,
        featured: featured || false,
        popular: popular || false,
        complexity: complexity || "MEDIUM",
        estimatedSetupTime: estimatedSetupTime || 15,
        requiredIntegrations: requiredIntegrations || [],
        configurationSchema,
        n8nTemplateId,
        visualRepresentation,
        expectedOutcomes: expectedOutcomes || [],
        useCases: useCases || [],
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
