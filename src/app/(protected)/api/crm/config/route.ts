import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const config = await client.crmIntegration.findFirst({
      where: { userId, isActive: true },
      select: {
        id: true,
        provider: true,
        name: true,
        isActive: true,
        baseUrl: true,
        lastSynced: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!config) {
      return NextResponse.json({ error: "No active CRM integration found" }, { status: 404 })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching CRM config:", error)
    return NextResponse.json({ error: "Failed to fetch CRM configuration" }, { status: 500 })
  }
}
