import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { n8nService } from "@/services/n8n-service"

export async function POST(req: NextRequest) {
  try {
   const user = await onUserInfor()
       const  userId = user.data?.id
   
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate the incoming data
    if (!data.workflowId || !data.data) {
      return NextResponse.json({ error: "Missing required fields: workflowId and data" }, { status: 400 })
    }

    // Execute the workflow
    const result = await n8nService.executeWorkflow({
      workflowId: data.workflowId,
      data: data.data,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing n8n workflow:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
