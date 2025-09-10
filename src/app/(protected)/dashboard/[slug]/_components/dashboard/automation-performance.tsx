import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getAutomationData } from "@/lib/dashboard-actions"
import { Zap, Activity } from "lucide-react"

export async function AutomationPerformance() {
  const automationData = await getAutomationData()

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-chart-1" />
              Automation Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Monitor automation efficiency and response rates</p>
          </div>
          <Badge variant="secondary" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
            <Activity className="w-3 h-3 mr-1" />
            {automationData.activeCount} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{automationData.totalTriggers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Triggers</div>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{automationData.successRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{automationData.avgResponseTime}ms</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{automationData.conversions.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Conversions</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={automationData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Bar dataKey="triggers" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Triggers" />
              <Bar dataKey="responses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Responses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
