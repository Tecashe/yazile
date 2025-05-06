// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const userId = searchParams.get("userId")

//     if (!userId) {
//       return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
//     }

//     // Fetch all leads for the user with their qualification data
//     const leads = await client.lead.findMany({
//       where: {
//         userId: userId,
//       },
//       include: {
//         qualificationData: true,
//         interactions: {
//           orderBy: { timestamp: "desc" },
//           take: 5,
//         },
//       },
//       orderBy: {
//         lastInteractionAt: "desc",
//       },
//     })

//     // Calculate summary statistics
//     const summary = {
//       total: leads.length,
//       qualified: leads.filter((l) => l.status === "QUALIFIED").length,
//       nurturing: leads.filter((l) => l.status === "NURTURING").length,
//       engaged: leads.filter((l) => l.status === "ENGAGED").length,
//       new: leads.filter((l) => l.status === "NEW").length,
//       averageScore: leads.length > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length : 0,
//     }

//     return NextResponse.json({
//       leads,
//       summary,
//     })
//   } catch (error) {
//     console.error("Error fetching leads:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { leadId } = await req.json()

//     if (!leadId) {
//       return NextResponse.json({ error: "Missing leadId in request body" }, { status: 400 })
//     }

//     // Mark lead as sent to n8n
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         sentToN8n: true,
//         sentToN8nAt: new Date(),
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error updating lead:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { client } from "@/lib/prisma"
// import { onUserInfor } from "@/actions/user"

// export async function GET(req: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const  userId = user.data?.id

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(req.url)
//     const filterStatus = searchParams.get("status")

//     // Build the where clause
//     const whereClause: any = { userId }
//     if (filterStatus && filterStatus !== "all") {
//       whereClause.status = filterStatus
//     }

//     // Fetch all leads for the user with their qualification data
//     const leads = await client.lead.findMany({
//       where: whereClause,
//       include: {
//         qualificationData: true,
//         interactions: {
//           orderBy: { timestamp: "desc" },
//           take: 5,
//         },
//       },
//       orderBy: {
//         updatedAt: "desc", // Use updatedAt instead of lastInteractionAt
//       },
//     })

//     // Add totalInteractions to each lead
//     const leadsWithTotalInteractions = leads.map((lead) => ({
//       ...lead,
//       totalInteractions: lead.interactions.length,
//     }))

//     // Calculate summary statistics
//     const summary = {
//       total: leads.length,
//       qualified: leads.filter((l) => l.status === "QUALIFIED").length,
//       nurturing: leads.filter((l) => l.status === "NURTURING").length,
//       // Use correct status values from your schema
//       new: leads.filter((l) => l.status === "NEW").length,
//       qualifying: leads.filter((l) => l.status === "QUALIFYING").length,
//       converted: leads.filter((l) => l.status === "CONVERTED").length,
//       disqualified: leads.filter((l) => l.status === "DISQUALIFIED").length,
//       averageScore: leads.length > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length : 0,
//     }

//     return NextResponse.json({
//       leads: leadsWithTotalInteractions,
//       summary,
//     })
//   } catch (error) {
//     console.error("Error fetching leads:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user = await onUserInfor()
//     const  userId = user.data?.id

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { leadId, workflowId } = await req.json()

//     if (!leadId) {
//       return NextResponse.json({ error: "Missing leadId in request body" }, { status: 400 })
//     }

//     // Mark lead as sent to n8n
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         sentToN8n: true,
//         // sentToN8nAt is removed as it doesn't exist in your schema
//         n8nWorkflowId: workflowId || null,
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error updating lead:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { leadQualificationService } from "@/services/lead-qualification-service"

export async function GET(req: NextRequest) {
  try {
    
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    // Get leads with optional status filter
    const leads = await leadQualificationService.getLeads(userId, { status: status || undefined })

    // Get lead statistics
    const stats = await leadQualificationService.getLeadStats(userId)

    return NextResponse.json({
      leads,
      stats,
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function GETE(req: NextRequest) {
  try {
    
    const user = await onUserInfor()
    const  userId = user.data?.id
    // const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const filterStatus = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build the where clause
    const whereClause: any = { userId }
    if (filterStatus && filterStatus !== "all") {
      whereClause.status = filterStatus
    }

    // Fetch leads with pagination
    const leads = await client.lead.findMany({
      where: whereClause,
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 5,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
    })

    // Get total count for pagination
    const totalLeads = await client.lead.count({
      where: whereClause,
    })

    // Add totalInteractions to each lead
    const leadsWithTotalInteractions = leads.map((lead) => ({
      ...lead,
      totalInteractions: lead.interactions.length,
    }))

    // Calculate summary statistics
    const summary = {
      total: await client.lead.count({ where: { userId } }),
      new: await client.lead.count({ where: { userId, status: "NEW" } }),
      qualifying: await client.lead.count({ where: { userId, status: "QUALIFYING" } }),
      qualified: await client.lead.count({ where: { userId, status: "QUALIFIED" } }),
      nurturing: await client.lead.count({ where: { userId, status: "NURTURING" } }),
      converted: await client.lead.count({ where: { userId, status: "CONVERTED" } }),
      disqualified: await client.lead.count({ where: { userId, status: "DISQUALIFIED" } }),
      lost: await client.lead.count({ where: { userId, status: "LOST" } }),
      averageScore:
        (
          await client.lead.aggregate({
            where: { userId },
            _avg: { score: true },
          })
        )._avg.score || 0,
    }

    return NextResponse.json({
      leads: leadsWithTotalInteractions,
      summary,
      pagination: {
        total: totalLeads,
        page,
        limit,
        pages: Math.ceil(totalLeads / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
     
    const user = await onUserInfor()
    const  userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { leadId, workflowId } = await req.json()

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId in request body" }, { status: 400 })
    }

    // Mark lead as sent to n8n
    await client.lead.update({
      where: { id: leadId },
      data: {
        sentToN8n: true,
        n8nWorkflowId: workflowId || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
