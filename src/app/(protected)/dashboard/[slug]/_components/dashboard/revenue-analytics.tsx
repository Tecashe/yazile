import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { getRevenueData } from "@/lib/dashboard-actions"
import { DollarSign, TrendingUp } from "lucide-react"

export async function RevenueAnalytics() {
  const revenueData = await getRevenueData()

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-3" />
              Revenue Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Track revenue generation and growth trends</p>
          </div>
          <Badge variant="secondary" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
            <TrendingUp className="w-3 h-3 mr-1" />+{revenueData.growthRate}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">${revenueData.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">${revenueData.avgDealSize.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Avg Deal Size</div>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{revenueData.conversionRate}%</div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData.chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
