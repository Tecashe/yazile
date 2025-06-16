import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Deactivate all CRM integrations for the user
    await client.crmIntegration.updateMany({
      where: { userId, isActive: true },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("CRM disconnect error:", error)
    return NextResponse.json({ error: "Failed to disconnect CRM" }, { status: 500 })
  }
}
