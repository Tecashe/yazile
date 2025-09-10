import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { getSentimentData } from "@/lib/dashboard-actions"
import { Heart, AlertTriangle } from "lucide-react"

export async function SentimentAnalysis() {
  const sentimentData = await getSentimentData()

  const COLORS = {
    positive: "hsl(var(--chart-3))",
    neutral: "hsl(var(--chart-4))",
    negative: "hsl(var(--destructive))",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Heart className="h-5 w-5 text-chart-2" />
          Sentiment Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">Customer sentiment distribution</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData.chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => [`${value}%`, "Percentage"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-3"></div>
              <span className="text-sm text-foreground">Positive</span>
            </div>
            <Badge variant="secondary" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
              {sentimentData.positive}%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-4"></div>
              <span className="text-sm text-foreground">Neutral</span>
            </div>
            <Badge variant="secondary" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
              {sentimentData.neutral}%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-sm text-foreground">Negative</span>
            </div>
            <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
              {sentimentData.negative}%
            </Badge>
          </div>
        </div>

        {sentimentData.alerts.length > 0 && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Sentiment Alerts</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {sentimentData.alerts.length} high-risk conversations detected
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
