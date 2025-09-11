import { type NextRequest, NextResponse } from "next/server"
import { rateLimitService } from "@/lib/rate-limit-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const integrationId = params.id
    const stats = rateLimitService.getUsageStats(integrationId)

    if (!stats) {
      return NextResponse.json({ error: "Integration not found or no rate limit data available" }, { status: 404 })
    }

    return NextResponse.json({
      integrationId,
      ...stats,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Rate limit API error:", error)
    return NextResponse.json({ error: "Failed to fetch rate limit data" }, { status: 500 })
  }
}
