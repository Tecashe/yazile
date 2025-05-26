import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLeadStats, getRecentLeads } from "@/actions/dashboard/dashboard-actions"

export async function LeadManagement() {
  const [leadStats, recentLeads] = await Promise.all([getLeadStats(), getRecentLeads()])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.qualified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.conversionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.avgScore}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest lead activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{lead.name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{lead.email || lead.phone || "No contact info"}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">Score: {lead.score}</p>
                  <p className="text-sm text-muted-foreground">{lead.source}</p>
                </div>
                <Badge
                  variant={
                    lead.status === "QUALIFIED"
                      ? "default"
                      : lead.status === "CONVERTED"
                        ? "secondary"
                        : lead.status === "NEW"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {lead.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
