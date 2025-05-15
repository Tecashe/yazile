import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import {client} from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * POST /api/n8n/templates/[id]/test
 * Test a configuration against an n8n template
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
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
      return NextResponse.json({ error: "Only admins can test configurations" }, { status: 403 })
    }

    const { id } = params
    const { configuration } = await req.json()

    if (!configuration) {
      return NextResponse.json({ error: "Configuration is required" }, { status: 400 })
    }

    // Get template from n8n
    const N8N_API_URL = process.env.N8N_API_URL
    const N8N_API_KEY = process.env.N8N_API_KEY

    if (!N8N_API_URL || !N8N_API_KEY) {
      return NextResponse.json({ error: "n8n API configuration is missing" }, { status: 500 })
    }

    // First, get the template
    const templateResponse = await fetch(`${N8N_API_URL}/workflows/${id}`, {
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
      },
    })

    if (!templateResponse.ok) {
      if (templateResponse.status === 404) {
        return NextResponse.json({ error: "Template not found in n8n" }, { status: 404 })
      }
      throw new Error(`Failed to fetch template from n8n: ${templateResponse.statusText}`)
    }

    const template = await templateResponse.json()

    // Apply the configuration to the template
    const testWorkflow = applyConfigurationToTemplate(template, configuration)

    // Test the workflow by executing it with test data
    const testResponse = await fetch(`${N8N_API_URL}/workflows/test`, {
      method: "POST",
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflowData: testWorkflow,
        // You can provide test data here if needed
        // testData: { ... }
      }),
    })

    if (!testResponse.ok) {
      const errorData = await testResponse.json()
      return NextResponse.json(
        {
          error: "Configuration test failed",
          details: errorData,
        },
        { status: 400 },
      )
    }

    const testResult = await testResponse.json()

    return NextResponse.json({
      success: true,
      message: "Configuration test successful",
      result: testResult,
    })
  } catch (error) {
    console.error("Error testing configuration:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to test configuration" },
      { status: 500 },
    )
  }
}

/**
 * Apply a configuration to an n8n template
 */
function applyConfigurationToTemplate(template: any, configuration: any): any {
  // Create a deep copy of the template
  const workflowCopy = JSON.parse(JSON.stringify(template))

  // Apply configuration to each node
  if (workflowCopy.nodes && Array.isArray(workflowCopy.nodes)) {
    for (const node of workflowCopy.nodes) {
      const nodeKey = node.name.replace(/\s+/g, "_").toLowerCase()

      // If we have configuration for this node, apply it
      if (configuration[nodeKey]) {
        // Merge the configuration with the node parameters
        node.parameters = {
          ...node.parameters,
          ...configuration[nodeKey],
        }
      }
    }
  }

  return workflowCopy
}
