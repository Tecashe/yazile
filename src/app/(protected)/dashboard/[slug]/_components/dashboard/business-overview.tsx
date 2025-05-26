import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GroupIcon as CampaignIcon, UsersIcon, TrendingUpIcon, TargetIcon } from "lucide-react"
import { getBusinessOverviewStats } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user" // You'll need to implement this

export async function BusinessOverview() {
  const user = await onCurrentUser() // Get current logged-in user
  const stats = await getBusinessOverviewStats(user.id)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Campaigns</CardTitle>
          <CampaignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          <p className="text-xs text-muted-foreground">{stats.activeCampaigns} active campaigns</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connected Influencers</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.connectedInfluencers}</div>
          <p className="text-xs text-muted-foreground">{stats.newInfluencersThisMonth} new this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <TargetIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLeads}</div>
          <p className="text-xs text-muted-foreground">{stats.qualifiedLeads} qualified leads</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgEngagementRate}%</div>
          <p className="text-xs text-muted-foreground">+{stats.engagementGrowth}% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}
