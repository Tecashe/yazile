import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/n8n/templates/[id]/schema
 * Generate a configuration schema from an n8n template
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
      return NextResponse.json({ error: "Only admins can generate schemas" }, { status: 403 })
    }

    const { id } = params

    // Get template from n8n
    const N8N_API_URL = process.env.N8N_API_URL
    const N8N_API_KEY = process.env.N8N_API_KEY

    if (!N8N_API_URL || !N8N_API_KEY) {
      return NextResponse.json({ error: "n8n API configuration is missing" }, { status: 500 })
    }

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

    // Generate schema based on the template structure
    const schema = generateSchemaFromN8nTemplate(template)

    return NextResponse.json({ schema })
  } catch (error) {
    console.error("Error generating schema:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate schema" },
      { status: 500 },
    )
  }
}

/**
 * Generate a JSON Schema from an n8n template
 */
function generateSchemaFromN8nTemplate(template: any): any {
  // Initialize the schema
  const schema: any = {
    type: "object",
    properties: {},
    required: [],
  }

  // Process each node in the template
  if (template.nodes && Array.isArray(template.nodes)) {
    for (const node of template.nodes) {
      // Skip nodes that don't need configuration
      if (!node.parameters || node.type === "n8n-nodes-base.start" || node.type === "n8n-nodes-base.noOp") {
        continue
      }

      // Create a property group for this node
      const nodeKey = node.name.replace(/\s+/g, "_").toLowerCase()

      schema.properties[nodeKey] = {
        type: "object",
        title: `${node.name} Configuration`,
        properties: {},
        required: [],
      }

      // Process node parameters
      for (const [paramKey, paramValue] of Object.entries(node.parameters)) {
        // Skip internal parameters
        if (paramKey.startsWith("_")) continue

        // Determine parameter type and format
        const paramSchema: any = {
          title: formatTitle(paramKey),
        }

        if (typeof paramValue === "string") {
          paramSchema.type = "string"

          // Check if it's an API key or credential
          if (
            paramKey.includes("apiKey") ||
            paramKey.includes("api_key") ||
            paramKey.includes("token") ||
            paramKey.includes("secret")
          ) {
            paramSchema.format = "password"
            schema.properties[nodeKey].required.push(paramKey)
          }
        } else if (typeof paramValue === "number") {
          paramSchema.type = "number"
        } else if (typeof paramValue === "boolean") {
          paramSchema.type = "boolean"
        } else if (Array.isArray(paramValue)) {
          paramSchema.type = "array"
          paramSchema.items = { type: "string" }
        } else if (paramValue === null) {
          paramSchema.type = "string"
        } else if (typeof paramValue === "object") {
          paramSchema.type = "object"
          paramSchema.properties = {}
        }

        // Add the parameter to the node's schema
        schema.properties[nodeKey].properties[paramKey] = paramSchema
      }

      // If the node has required parameters, add the node to the required list
      if (schema.properties[nodeKey].required.length > 0) {
        schema.required.push(nodeKey)
      }
    }
  }

  return schema
}

/**
 * Format a parameter key as a title
 */
function formatTitle(key: string): string {
  return key
    .split(/(?=[A-Z])|_|-/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim()
}
