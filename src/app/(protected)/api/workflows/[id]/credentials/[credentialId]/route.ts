
// import { NextResponse } from "next/server"
// import { deleteWorkflowCredential } from "@/lib/n8n/credentials"

// export async function DELETE(req: Request, { params }: { params: { workflowId: string; credentialId: string } }) {
//   const { workflowId, credentialId } = params
  
//   if (!workflowId) {
//     return NextResponse.json({ error: "Missing workflowId" }, { status: 400 })
//   }

  
//   if (!credentialId) {
//     return NextResponse.json({ error: "Missing workflowId" }, { status: 400 })
//   }



//   try {
//     await deleteWorkflowCredential(workflowId, credentialId)
//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting credential:", error)
//     return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 })
//   }
// }

// app/api/workflows/[id]/credentials/[credentialId]/route.ts

import { NextResponse } from "next/server"
import { deleteWorkflowCredential } from "@/lib/n8n/credentials"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; credentialId: string } },
) {
  const workflowId = params.id
  const credentialId = params.credentialId

  if (!workflowId || !credentialId) {
    return NextResponse.json({ error: "Missing workflowId or credentialId" }, { status: 400 })
  }

  try {
    await deleteWorkflowCredential(workflowId, credentialId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting credential:", error)
    return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 })
  }
}
