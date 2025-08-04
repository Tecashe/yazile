

// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getAuth } from "@clerk/nextjs/server"
// import { onUserInfor } from "@/actions/user"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }
    

//     // Check if user is admin
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { isAdmin: true },
//     })

//     if (!user?.isAdmin) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     // Fetch all workflow requests with complete data
//     const requests = await client.customWorkflowRequest.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             firstname: true,
//             lastname: true,
//             email: true,
//           },
//         },
//         completedTemplate: {
//           select: {
//             id: true,
//             name: true,
//             isPublic: true,
//             isActive: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return NextResponse.json({
//       success: true,
//       requests,
//     })
//   } catch (error) {
//     console.error("Error fetching workflow requests:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

export async function GET(request: NextRequest) {
  try {
    // Use your working onUserInfor function
    const userInfo = await onUserInfor()

    if (!userInfo.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin using the user ID from onUserInfor
    const user = await client.user.findUnique({
      where: { id: userInfo.data.id },
      select: { isAdmin: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    if (!user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all workflow requests with complete data
    const requests = await client.customWorkflowRequest.findMany({
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