import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"

/**
 * GET /api/n8n/templates
 * Get all templates from n8n
 */
export async function GET(req: NextRequest) {
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
      return NextResponse.json({ error: "Only admins can access n8n templates" }, { status: 403 })
    }

    // Get templates from n8n
    const N8N_API_URL = process.env.N8N_API_URL
    const N8N_API_KEY = process.env.N8N_API_KEY

    if (!N8N_API_URL || !N8N_API_KEY) {
      return NextResponse.json({ error: "n8n API configuration is missing" }, { status: 500 })
    }

    const response = await fetch(`${N8N_API_URL}/workflows`, {
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch templates from n8n: ${response.statusText}`)
    }

    const templates = await response.json()

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching n8n templates:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch n8n templates" },
      { status: 500 },
    )
  }
}
