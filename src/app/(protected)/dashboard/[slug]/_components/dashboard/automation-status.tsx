import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAutomationStats, getActiveAutomations } from "@/actions/dashboard/dashboard-actions"

export async function AutomationStatus() {
  const [automationStats, activeAutomations] = await Promise.all([getAutomationStats(), getActiveAutomations()])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats.successRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats.messagesSent.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Automations</CardTitle>
          <CardDescription>Currently running automation workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAutomations.map((automation) => (
              <div key={automation.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{automation.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {automation.platform} • {automation.keywords.length} keywords
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{automation.posts.length} posts</p>
                  <p className="text-sm text-muted-foreground">{automation.leads.length} leads</p>
                </div>
                <Badge variant={automation.active ? "default" : "secondary"}>
                  {automation.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
