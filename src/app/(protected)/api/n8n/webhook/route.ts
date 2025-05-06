// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { client } from "@/lib/prisma"

// /**
//  * Webhook endpoint for n8n to send data back to our application
//  */
// export async function POST(req: NextRequest) {
//   try {
//     const  userId  = auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const data = await req.json()

//     // Validate the incoming data
//     if (!data.leadId || !data.action) {
//       return NextResponse.json({ error: "Missing required fields: leadId and action" }, { status: 400 })
//     }

//     // Process the webhook based on the action
//     switch (data.action) {
//       case "update_lead_status":
//         if (!data.status) {
//           return NextResponse.json({ error: "Missing status field for update_lead_status action" }, { status: 400 })
//         }

//         await client.lead.update({
//           where: { id: data.leadId },
//           data: {
//             status: data.status,
//             ...(data.notes && { notes: data.notes }),
//             ...(data.tags && { tags: data.tags }),
//             ...(data.metadata && { metadata: data.metadata }),
//             updatedAt: new Date(),
//           },
//         })
//         break

//       case "add_interaction":
//         if (!data.content || !data.type || !data.direction) {
//           return NextResponse.json({ error: "Missing required fields for add_interaction action" }, { status: 400 })
//         }

//         await client.leadInteraction.create({
//           data: {
//             leadId: data.leadId,
//             type: data.type,
//             content: data.content,
//             direction: data.direction,
//             sentiment: data.sentiment,
//             intent: data.intent,
//             metadata: data.metadata,
//           },
//         })
//         break

//       case "convert_lead":
//         await client.lead.update({
//           where: { id: data.leadId },
//           data: {
//             status: "CONVERTED",
//             convertedDate: new Date(),
//             ...(data.notes && { notes: data.notes }),
//             updatedAt: new Date(),
//           },
//         })
//         break

//       default:
//         return NextResponse.json({ error: `Unknown action: ${data.action}` }, { status: 400 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error processing n8n webhook:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

/**
 * Webhook endpoint for n8n to send data back to our application
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validate the incoming data
    if (!data.leadId || !data.action) {
      return NextResponse.json({ error: "Missing required fields: leadId and action" }, { status: 400 })
    }

    // Process the webhook based on the action
    switch (data.action) {
      case "update_lead_status":
        if (!data.status) {
          return NextResponse.json({ error: "Missing status field for update_lead_status action" }, { status: 400 })
        }

        await client.lead.update({
          where: { id: data.leadId },
          data: {
            status: data.status,
            ...(data.notes && { notes: data.notes }),
            ...(data.tags && { tags: data.tags }),
            ...(data.metadata && { metadata: data.metadata }),
            updatedAt: new Date(),
          },
        })
        break

      case "add_interaction":
        if (!data.content || !data.type || !data.direction) {
          return NextResponse.json({ error: "Missing required fields for add_interaction action" }, { status: 400 })
        }

        await client.leadInteraction.create({
          data: {
            leadId: data.leadId,
            type: data.type,
            content: data.content,
            direction: data.direction,
            sentiment: data.sentiment,
            intent: data.intent,
            metadata: data.metadata,
          },
        })
        break

      case "convert_lead":
        await client.lead.update({
          where: { id: data.leadId },
          data: {
            status: "CONVERTED",
            convertedDate: new Date(),
            ...(data.notes && { notes: data.notes }),
            updatedAt: new Date(),
          },
        })
        break

      default:
        return NextResponse.json({ error: `Unknown action: ${data.action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing n8n webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
