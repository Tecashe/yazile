import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/n8n/templates/[id]/verify
 * Verify that a template exists in n8n and is valid
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await onUserInfor()

    if (!session?.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await client.user.findUnique({
      where: { id: session.data.id },
      select: { isAdmin: true },
    })

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Only admins can verify n8n templates" }, { status: 403 })
    }

    const { id } = params

    // Get template from n8n
    const N8N_API_URL = process.env.N8N_API_URL
    const N8N_API_KEY = process.env.N8N_API_KEY

    if (!N8N_API_URL || !N8N_API_KEY) {
      return NextResponse.json({ error: "n8n API configuration is missing" }, { status: 500 })
    }

    // First, check if the template exists
    const response = await fetch(`${N8N_API_URL}/workflows/${id}`, {
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Template not found in n8n" }, { status: 404 })
      }
      throw new Error(`Failed to fetch template from n8n: ${response.statusText}`)
    }

    const template = await response.json()

    // Check if the template has the required structure
    if (!template.nodes || !Array.isArray(template.nodes)) {
      return NextResponse.json({ error: "Invalid template structure: missing nodes" }, { status: 400 })
    }

    // Update our database to mark this template as verified
    const templateInDb = await client.workflowTemplate.findFirst({
      where: { n8nTemplateId: id },
    })

    if (templateInDb) {
      await client.workflowTemplate.update({
        where: { id: templateInDb.id },
        data: {
          isVerified: true,
          lastVerified: new Date(),
        },
      })
    }


    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        active: template.active,
        nodeCount: template.nodes.length,
      },
    })
  } catch (error) {
    console.error("Error verifying n8n template:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify n8n template" },
      { status: 500 },
    )
  }
}
