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


// import { type NextRequest, NextResponse } from "next/server"
// import { onUserInfor } from "@/actions/user"
// import { manualSendLeadToN8n } from "@/services/lead-qualification"

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const user = await onUserInfor()
//     const  userId = user.data?.id

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

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
import { onUserInfor } from "@/actions/user"
import { leadQualificationService } from "@/services/lead-qualification-service"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id


    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leadId = params.id

    // Send the lead to n8n
    const success = await leadQualificationService.sendLeadToN8n(leadId)

    if (!success) {
      return NextResponse.json({ error: "Failed to send lead to n8n" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending lead to n8n:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
