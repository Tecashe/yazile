import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, MessageSquare, DollarSign, Target } from "lucide-react"
import { getDashboardMetrics } from "@/lib/dashboard-actions"

export async function MetricsOverview() {
  const metrics = await getDashboardMetrics()

  const metricCards = [
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      change: metrics.leadsChange,
      icon: Users,
      color: "text-chart-1",
    },
    {
      title: "Active Automations",
      value: metrics.activeAutomations,
      change: metrics.automationsChange,
      icon: MessageSquare,
      color: "text-chart-2",
    },
    {
      title: "Revenue Generated",
      value: `$${metrics.revenue.toLocaleString()}`,
      change: metrics.revenueChange,
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      change: metrics.conversionChange,
      icon: Target,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon
        const isPositive = metric.change >= 0

        return (
          <Card key={index} className="bg-card border-border hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="flex items-center text-xs">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-chart-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                )}
                <span className={isPositive ? "text-chart-3" : "text-destructive"}>{Math.abs(metric.change)}%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
