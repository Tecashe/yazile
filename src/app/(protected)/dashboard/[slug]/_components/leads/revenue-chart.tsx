"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { TrendingUp, DollarSign } from "lucide-react"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  pipeline: {
    label: "Pipeline",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface RevenueChartProps {
  data: Array<{
    month: string
    revenue: number
    pipeline: number
  }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalPipeline = data.reduce((sum, item) => sum + item.pipeline, 0)
  const growth = data.length > 1 ? ((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Revenue Analytics
            </CardTitle>
            <CardDescription>Monthly revenue and pipeline progression</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">${(totalRevenue / 1000).toFixed(1)}K</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              {growth > 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPipeline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pipeline)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-pipeline)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `$${(Number(value) / 1000).toFixed(1)}K`,
                      name === "revenue" ? "Revenue" : "Pipeline",
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="pipeline"
                stroke="var(--color-pipeline)"
                fillOpacity={1}
                fill="url(#fillPipeline)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fillOpacity={1}
                fill="url(#fillRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
