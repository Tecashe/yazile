import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

/**
 * API endpoint to send a lead to n8n for processing
 */
export async function POST(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId  = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate the incoming data
    if (!data.leadId || !data.workflowId) {
      return NextResponse.json({ error: "Missing required fields: leadId and workflowId" }, { status: 400 })
    }

    // Get the lead data
    const lead = await client.lead.findUnique({
      where: { id: data.leadId },
      include: {
        interactions: true,
        qualificationData: true,
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Get the workflow data
    const workflow = await client.n8nWorkflow.findFirst({
      where: {
        userId,
        workflowId: data.workflowId,
      },
    })

    if (!workflow || !workflow.triggerUrl) {
      return NextResponse.json({ error: "Workflow not found or missing trigger URL" }, { status: 404 })
    }

    // Send the lead data to n8n
    const response = await fetch(workflow.triggerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          score: lead.score,
          status: lead.status,
          source: lead.source,
          firstContactDate: lead.firstContactDate,
          lastContactDate: lead.lastContactDate,
          qualifiedDate: lead.qualifiedDate,
          convertedDate: lead.convertedDate,
          notes: lead.notes,
          tags: lead.tags,
          metadata: lead.metadata,
        },
        qualificationData: lead.qualificationData,
        interactions: lead.interactions,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error sending lead to n8n:", errorText)
      return NextResponse.json({ error: "Failed to send lead to n8n" }, { status: 500 })
    }

    // Update the lead with n8n information
    const responseData = await response.json()
    await client.lead.update({
      where: { id: lead.id },
      data: {
        sentToN8n: true,
        n8nWorkflowId: workflow.workflowId,
        n8nExecutionId: responseData.executionId || null,
        updatedAt: new Date(),
      },
    })

    // Update workflow execution stats
    await client.n8nWorkflow.update({
      where: { id: workflow.id },
      data: {
        lastExecuted: new Date(),
        executionCount: { increment: 1 },
        successCount: { increment: 1 },
      },
    })

    return NextResponse.json({
      success: true,
      executionId: responseData.executionId,
    })
  } catch (error) {
    console.error("Error sending lead to n8n:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
