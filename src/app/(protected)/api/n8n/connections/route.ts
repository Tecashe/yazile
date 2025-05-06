import { type NextRequest, NextResponse } from "next/server"
import { n8nService } from "@/services/n8n-service"
import { onUserInfor } from "@/actions/user"

export async function GET(req: NextRequest) {
  try {
    const user = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connections = await n8nService.getConnections(userId)

    return NextResponse.json({ connections })
  } catch (error) {
    console.error("Error fetching n8n connections:", error)
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
    if (!data.name || !data.n8nUrl || !data.apiKey) {
      return NextResponse.json({ error: "Missing required fields: name, n8nUrl, and apiKey" }, { status: 400 })
    }

    // Create a new connection
    const connection = await n8nService.createConnection({
      userId,
      name: data.name,
      n8nUrl: data.n8nUrl,
      apiKey: data.apiKey,
    })

    return NextResponse.json({ connection })
  } catch (error) {
    console.error("Error creating n8n connection:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
