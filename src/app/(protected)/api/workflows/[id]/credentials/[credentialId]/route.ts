
import { NextResponse } from "next/server"
import { deleteWorkflowCredential } from "@/lib/n8n/credentials"

export async function DELETE(req: Request, { params }: { params: { workflowId: string; credentialId: string } }) {
  const { workflowId, credentialId } = params

  try {
    await deleteWorkflowCredential(workflowId, credentialId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting credential:", error)
    return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 })
  }
}
