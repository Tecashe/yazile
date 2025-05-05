// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { manualSendLeadToN8n } from "@/services/lead-qualification"

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // const { userId } = auth()

//     // if (!userId) {
//     //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     // }

//     const leadId = params.id
//     const { workflowId } = await req.json()

//     if (!workflowId) {
//       return NextResponse.json({ error: "Missing workflowId in request body" }, { status: 400 })
//     }

//     const result = await manualSendLeadToN8n(leadId, workflowId)

//     if (!result.success) {
//       return NextResponse.json({ error: result.message }, { status: 400 })
//     }

//     return NextResponse.json({ success: true, message: result.message })
//   } catch (error) {
//     console.error("Error sending lead to n8n:", error)
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { manualSendLeadToN8n } from "@/services/lead-qualification"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // const { userId } = auth()

    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const leadId = params.id
    const { workflowId } = await req.json()

    if (!workflowId) {
      return NextResponse.json({ error: "Missing workflowId in request body" }, { status: 400 })
    }

    const result = await manualSendLeadToN8n(leadId, workflowId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error sending lead to n8n:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
