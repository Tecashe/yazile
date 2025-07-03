import { NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

export async function GET() {
  try {
    const  user  = await onUserInfor()
        const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find potential duplicates
    const duplicateGroups = await client.lead.groupBy({
      by: ["instagramUserId", "pageId"],
      where: { userId },
      having: {
        id: { _count: { gt: 1 } },
      },
      _count: { id: true },
    })

    const hasDuplicates = duplicateGroups.length > 0
    const duplicateCount = duplicateGroups.length

    return NextResponse.json({
      hasDuplicates,
      duplicateCount,
      groups: duplicateGroups,
    })
  } catch (error) {
    console.error("Error checking duplicates:", error)
    return NextResponse.json(
      {
        error: "Failed to check duplicates",
      },
      { status: 500 },
    )
  }
}
