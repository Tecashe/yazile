import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const integrationId = params.id

    // Simulate endpoint usage data - replace with real database queries
    const endpointData = [
      { endpoint: "/api/users", requests: 450, percentage: 45 },
      { endpoint: "/api/orders", requests: 300, percentage: 30 },
      { endpoint: "/api/products", requests: 150, percentage: 15 },
      { endpoint: "/api/analytics", requests: 100, percentage: 10 },
    ]

    return NextResponse.json(endpointData)
  } catch (error) {
    console.error("Endpoint usage API error:", error)
    return NextResponse.json({ error: "Failed to fetch endpoint usage data" }, { status: 500 })
  }
}
