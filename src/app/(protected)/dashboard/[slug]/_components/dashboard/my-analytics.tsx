import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"
import { getMyAnalytics } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"

export async function MyAnalytics() {
  const user = await onCurrentUser()
  const analytics = await getMyAnalytics(user.id)

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUpIcon className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDownIcon className="h-4 w-4 text-red-500" />
    return <MinusIcon className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-500"
    if (trend < 0) return "text-red-500"
    return "text-gray-500"
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.campaignPerformance.toFixed(1)}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(analytics.campaignTrend)}
              <span className={getTrendColor(analytics.campaignTrend)}>
                {analytics.campaignTrend > 0 ? "+" : ""}
                {analytics.campaignTrend.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lead Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.leadConversion.toFixed(1)}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(analytics.leadTrend)}
              <span className={getTrendColor(analytics.leadTrend)}>
                {analytics.leadTrend > 0 ? "+" : ""}
                {analytics.leadTrend.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Automation Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.automationSuccess.toFixed(1)}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(analytics.automationTrend)}
              <span className={getTrendColor(analytics.automationTrend)}>
                {analytics.automationTrend > 0 ? "+" : ""}
                {analytics.automationTrend.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.roi.toFixed(1)}x</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(analytics.roiTrend)}
              <span className={getTrendColor(analytics.roiTrend)}>
                {analytics.roiTrend > 0 ? "+" : ""}
                {analytics.roiTrend.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>Your best campaigns this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">#{index + 1}</div>
                    <div>
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.influencers.length} influencers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{campaign.performance}%</p>
                    <p className="text-xs text-muted-foreground">performance</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
