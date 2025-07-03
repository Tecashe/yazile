import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { mergeDuplicateLeads } from "@/lib/lead-qualification"
import { onUserInfor } from "@/actions/user"

export async function POST() {
  try {
    const  user  = await onUserInfor()
        const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await mergeDuplicateLeads(userId)

    return NextResponse.json({
      success: true,
      mergedGroups: result.mergedGroups,
      message: `Successfully merged ${result.mergedGroups} duplicate groups`,
    })
  } catch (error) {
    console.error("Error merging duplicates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to merge duplicates",
      },
      { status: 500 },
    )
  }
}
