import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCampaignStats, getRecentCampaigns } from "@/actions/dashboard/dashboard-actions"

export async function CampaignOverview() {
  const [campaignStats, recentCampaigns] = await Promise.all([getCampaignStats(), getRecentCampaigns()])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaignStats.totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Latest campaign activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">${campaign.budget?.toLocaleString() || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">{campaign.influencers.length} influencers</p>
                </div>
                <Badge
                  variant={
                    campaign.status === "ACTIVE"
                      ? "default"
                      : campaign.status === "COMPLETED"
                        ? "secondary"
                        : campaign.status === "DRAFT"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {campaign.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
