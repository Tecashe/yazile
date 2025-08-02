// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"
// import { getAuth } from "@clerk/nextjs/server"

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { userId } = getAuth(request)
//     const { id } = params
//     const { isPublic, isActive } = await request.json()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Check if user is admin
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, isAdmin: true },
//     })

//     if (!user?.isAdmin) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     // Update template visibility and status
//     const updatedTemplate = await client.businessWorkflowTemplate.update({
//       where: { id },
//       data: {
//         isPublic: isPublic,
//         isActive: isActive !== undefined ? isActive : true,
//         publishedAt: new Date(),
//         publishedBy: user.id,
//         updatedAt: new Date(),
//       },
//       include: {
//         _count: {
//           select: {
//             businessConfigs: true,
//           },
//         },
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       template: updatedTemplate,
//     })
//   } catch (error) {
//     console.error("Error publishing workflow template:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request)
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update template visibility and status
    const updatedTemplate = await client.businessWorkflowTemplate.update({
      where: { id: params.id },
      data: {
        isPublic: body.isPublic,
        isActive: body.isActive !== undefined ? body.isActive : true,
        publishedAt: body.isPublic ? new Date() : undefined,
        publishedBy: body.isPublic ? user.id : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      template: updatedTemplate,
    })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
