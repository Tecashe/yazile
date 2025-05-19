import { NextResponse } from "next/server"
import { storeWorkflowCredential } from "@/lib/n8n/credentials"

export async function POST(req: Request, { params }: { params: { workflowId: string } }) {
  const { workflowId } = params

  try {
    const body = await req.json()
    const { name, type, value, expiresAt } = body

    if (!name || !type || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const credentialId = await storeWorkflowCredential(workflowId, name, type, value, expiresAt)

    return NextResponse.json({ id: credentialId })
  } catch (error) {
    console.error("Error saving credential:", error)
    return NextResponse.json({ error: "Failed to save credential" }, { status: 500 })
  }
}
