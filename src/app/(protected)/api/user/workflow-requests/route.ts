import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's database ID
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If a specific userId is requested, check if current user is admin or the same user
    const targetUserId = requestedUserId || user.id
    if (requestedUserId && requestedUserId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch user's workflow requests
    const requests = await client.customWorkflowRequest.findMany({
      where: {
        userId: targetUserId,
      },
      include: {
        assignedAdmin: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error("Error fetching user workflow requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
