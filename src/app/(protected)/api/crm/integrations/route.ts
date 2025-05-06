import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { crmService } from "@/services/crm-service"

export async function GET(req: NextRequest) {
  try {
    const user = await onUserInfor()
        const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integrations = await crmService.getIntegrations(userId)

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error("Error fetching CRM integrations:", error)
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

    const data = await req.json()

    // Validate the incoming data
    if (!data.provider || !data.name || !data.apiKey) {
      return NextResponse.json({ error: "Missing required fields: provider, name, and apiKey" }, { status: 400 })
    }

    // Create a new integration
    const integration = await crmService.createIntegration({
      userId,
      provider: data.provider,
      name: data.name,
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
      baseUrl: data.baseUrl,
    })

    return NextResponse.json({ integration })
  } catch (error) {
    console.error("Error creating CRM integration:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
