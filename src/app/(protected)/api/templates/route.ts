// import { type NextRequest, NextResponse } from "next/server"
// import { onCurrentUser } from "@/actions/user"
// import * as XLSX from "xlsx"

// export async function GET(request: NextRequest) {
//   const user = await onCurrentUser()

//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const { searchParams } = new URL(request.url)
//   const type = searchParams.get("type") || "basic"

//   try {
//     let templateData: Array<Record<string, any>> = []

//     if (type === "basic") {
//       templateData = [
//         {
//           Name: "Example Influencer",
//           Username: "@example_influencer",
//           Followers: 10000,
//           "Engagement Rate": 3.5,
//           Niche: "Fashion",
//           Location: "New York, USA",
//           Email: "contact@example.com",
//         },
//       ]
//     } else if (type === "advanced") {
//       templateData = [
//         {
//           Name: "Example Influencer",
//           Username: "@example_influencer",
//           "Instagram Handle": "@example_influencer",
//           "TikTok Handle": "@example_influencer",
//           "YouTube Channel": "Example Influencer",
//           Bio: "Fashion and lifestyle content creator based in NYC",
//           Followers: 10000,
//           Following: 1200,
//           "Posts Count": 350,
//           "Engagement Rate": 3.5,
//           "Average Likes": 1500,
//           "Average Comments": 120,
//           Verified: true,
//           Location: "New York, USA",
//           Niche: "Fashion",
//           Email: "contact@example.com",
//           Website: "https://example.com",
//           "Contact Info": "Phone: +1234567890",
//           Notes: "Previously worked with us on summer campaign",
//           Tags: "fashion,beauty,lifestyle",
//           "Brand Fit": 85,
//           "Audience Match": 78,
//           "Estimated Cost": 500,
//           "Audience Demographics": "70% Female, 25-34 age group",
//           Authenticity: 92,
//           "Growth Rate": 5.2,
//         },
//       ]
//     } else if (type === "campaign") {
//       templateData = [
//         {
//           Name: "Example Influencer",
//           Username: "@example_influencer",
//           Followers: 10000,
//           "Engagement Rate": 3.5,
//           "Campaign Rate": 500,
//           Deliverables: "1 feed post, 3 stories",
//           "Past Performance": "4.2% engagement on previous campaign",
//           Notes: "Prefers early outreach",
//         },
//       ]
//     }

//     // Generate Excel file
//     const worksheet = XLSX.utils.json_to_sheet(templateData)
//     const workbook = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Template")

//     // Add column width specifications
//     const colWidths = Object.keys(templateData[0]).map((key) => ({ wch: Math.max(key.length, 15) }))
//     worksheet["!cols"] = colWidths

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

//     return new NextResponse(buffer, {
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": `attachment; filename="${type}_template.xlsx"`,
//       },
//     })
//   } catch (error) {
//     console.error("Template generation error:", error)
//     return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
//   }
// }






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
