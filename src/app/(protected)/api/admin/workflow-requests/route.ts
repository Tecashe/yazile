// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getAuth } from "@clerk/nextjs/server"

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

//     // Fetch all workflow requests with user details
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
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     // Transform requests to include parsed notification metadata
//     const transformedRequests = await Promise.all(
//       requests.map(async (request) => {
//         // Try to find the notification with workflow design data
//         const notification = await client.generalNotification.findFirst({
//           where: {
//             metadata: {
//               path: ["requestId"],
//               equals: request.id,
//             },
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         })

//         const metadata = (notification?.metadata as any) || {}

//         return {
//           ...request,
//           businessInfo: {
//             businessName: metadata.businessInfo?.businessName || "Not specified",
//             businessType: metadata.businessInfo?.businessType || "Not specified",
//           },
//           workflowDesign: metadata.workflowDesign || null,
//           selectedChannels: metadata.selectedChannels || [],
//           automationFeatures: metadata.automationFeatures || [],
//           customRequest: metadata.customRequest || "",
//           estimatedCost: metadata.estimatedCost || null,
//           roi: metadata.roi || null,
//           complexity: metadata.complexity || "Unknown",
//           steps: metadata.steps || [],
//           metrics: metadata.metrics || {},
//           technicalRequirements: metadata.technicalRequirements || [],
//           deploymentChannels: metadata.deploymentChannels || [],
//         }
//       }),
//     )

//     return NextResponse.json({
//       success: true,
//       requests: transformedRequests,
//     })
//   } catch (error) {
//     console.error("Error fetching workflow requests:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
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
