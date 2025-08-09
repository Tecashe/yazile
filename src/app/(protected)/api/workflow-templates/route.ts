
// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const category = searchParams.get("category")
//     const complexity = searchParams.get("complexity")

//     const whereClause: any = { isActive: true }

//     if (category) {
//       whereClause.category = category
//     }

//     if (complexity) {
//       whereClause.complexity = complexity.toUpperCase()
//     }

//     const templates = await client.businessWorkflowTemplate.findMany({
//       where: whereClause,
//       orderBy: [{ complexity: "asc" }, { estimatedSetupTime: "asc" }, { name: "asc" }],
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

import { type NextRequest, NextResponse } from "next/server"
import { createWorkflowTemplate, getAllWorkflowTemplates } from "@/actions/workflow-templates"
import { auth } from "@clerk/nextjs/server"
import { onUserInfor } from "@/actions/user"

export async function GET(request: NextRequest) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await getAllWorkflowTemplates()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      templates: result.templates,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const result = await createWorkflowTemplate(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      template: result.template,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

