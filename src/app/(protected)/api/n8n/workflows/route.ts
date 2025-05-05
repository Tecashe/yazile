import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

/**
 * API endpoint to manage n8n workflows
 */
export async function GET(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId  = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workflows = await client.n8nWorkflow.findMany({
      where: { userId },
    })

    return NextResponse.json({ workflows })
  } catch (error) {
    console.error("Error fetching n8n workflows:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId  = user.data?.id


    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate the incoming data
    if (!data.name || !data.workflowId) {
      return NextResponse.json({ error: "Missing required fields: name and workflowId" }, { status: 400 })
    }

    // Create a new workflow
    const workflow = await client.n8nWorkflow.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        workflowId: data.workflowId,
        triggerUrl: data.triggerUrl,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error("Error creating n8n workflow:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
