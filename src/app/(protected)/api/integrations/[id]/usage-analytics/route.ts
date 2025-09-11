import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const integrationId = params.id

    // Simulate usage analytics data - replace with real database queries
    const usageData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))

      return {
        date: date.toISOString().split("T")[0],
        requests: Math.floor(Math.random() * 1000) + 100,
        errors: Math.floor(Math.random() * 50),
        avgResponseTime: Math.floor(Math.random() * 500) + 100,
      }
    })

    return NextResponse.json(usageData)
  } catch (error) {
    console.error("Usage analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch usage analytics" }, { status: 500 })
  }
}
