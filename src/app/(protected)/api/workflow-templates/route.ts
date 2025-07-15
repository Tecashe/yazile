import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const complexity = searchParams.get("complexity")

    const whereClause: any = { isActive: true }

    if (category) {
      whereClause.category = category
    }

    if (complexity) {
      whereClause.complexity = complexity.toUpperCase()
    }

    const templates = await client.businessWorkflowTemplate.findMany({
      where: whereClause,
      orderBy: [{ complexity: "asc" }, { estimatedSetupTime: "asc" }, { name: "asc" }],
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
