import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { client } from "@/lib/prisma"
import { BarChart3, Clock, Users, CheckCircle } from "lucide-react"

interface PerformanceMetricsProps {
  businessId: string
}

async function getMetrics(businessId: string) {
  const [totalHandoffs, pendingHandoffs, completedHandoffs, avgWaitTime] = await Promise.all([
    client.humanHandoff.count({
      where: { businessId },
    }),
    client.humanHandoff.count({
      where: { businessId, status: "PENDING" },
    }),
    client.humanHandoff.count({
      where: { businessId, status: "COMPLETED" },
    }),
    client.humanHandoff.aggregate({
      where: {
        businessId,
        customerWaitTime: { not: null },
      },
      _avg: { customerWaitTime: true },
    }),
  ])

  return {
    totalHandoffs,
    pendingHandoffs,
    completedHandoffs,
    avgWaitTime: Math.round(avgWaitTime._avg.customerWaitTime || 0),
  }
}

export async function PerformanceMetrics({ businessId }: PerformanceMetricsProps) {
  const metrics = await getMetrics(businessId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        <p className="text-muted-foreground">Monitor your handoff system performance and agent efficiency.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Handoffs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalHandoffs}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingHandoffs}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedHandoffs}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgWaitTime}s</div>
            <p className="text-xs text-muted-foreground">Customer wait time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Detailed analytics and trends will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <p>Advanced analytics coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
