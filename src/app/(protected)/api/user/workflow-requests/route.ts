// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getAuth } from "@clerk/nextjs/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)
//     const { searchParams } = new URL(request.url)
//     const requestedUserId = searchParams.get("userId")

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get the user's database ID
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, isAdmin: true },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // If a specific userId is requested, check if current user is admin or the same user
//     const targetUserId = requestedUserId || user.id
//     if (requestedUserId && requestedUserId !== user.id && !user.isAdmin) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     // Fetch user's workflow requests
//     const requests = await client.customWorkflowRequest.findMany({
//       where: {
//         userId: targetUserId,
//       },
//       // include: {
//       //   assignedAdmin: {
//       //     select: {
//       //       firstname: true,
//       //       lastname: true,
//       //     },
//       //   },
//       // },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       requests,
//     })
//   } catch (error) {
//     console.error("Error fetching user workflow requests:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's workflow requests
    const requests = await client.customWorkflowRequest.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        completedTemplate: {
          select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error("Error fetching workflow requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const body = await request.json()
    const { requestId, status } = body

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing requestId or status" }, { status: 400 })
    }

    const existingRequest = await client.customWorkflowRequest.findUnique({
      where: { id: requestId, userId: user.id },
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Workflow request not found or unauthorized" }, { status: 404 })
    }

    // Logic for cancellation
    if (status === "CANCELED") {
      const submittedAt = new Date(existingRequest.createdAt)
      const now = new Date()
      const hoursElapsed = (now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60)

      // Allow cancellation only if status is SUBMITTED or UNDER_REVIEW and within 48 hours
      if ((existingRequest.status === "SUBMITTED" || existingRequest.status === "UNDER_REVIEW") && hoursElapsed <= 48) {
        const updatedRequest = await client.customWorkflowRequest.update({
          where: { id: requestId },
          data: { status: "CANCELED" },
        })
        return NextResponse.json({ success: true, request: updatedRequest, message: "Workflow request canceled." })
      } else if (hoursElapsed > 48) {
        return NextResponse.json({ error: "Cancellation window has expired (48 hours)." }, { status: 403 })
      } else {
        return NextResponse.json(
          { error: `Cannot cancel workflow in ${existingRequest.status} status.` },
          { status: 403 },
        )
      }
    }

    return NextResponse.json({ error: "Invalid status update request." }, { status: 400 })
  } catch (error) {
    console.error("Error updating workflow request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

