import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: {
        automations: {
          select: {
            id: true,
            name: true,
            active: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ automations: user.automations })
  } catch (error) {
    console.error("Error fetching user automations:", error)
    return NextResponse.json({ error: "Failed to fetch automations" }, { status: 500 })
  }
}
