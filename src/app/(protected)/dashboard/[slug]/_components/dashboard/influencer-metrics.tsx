import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInfluencerStats, getTopInfluencers } from "@/actions/dashboard/dashboard-actions"

export async function InfluencerMetrics() {
  const [influencerStats, topInfluencers] = await Promise.all([getInfluencerStats(), getTopInfluencers()])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencerStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencerStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencerStats.avgEngagement}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${influencerStats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Influencers</CardTitle>
          <CardDescription>Based on engagement rate and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topInfluencers.map((influencer, index) => (
              <div key={influencer.id} className="flex items-center space-x-4">
                <div className="text-sm font-medium w-6">#{index + 1}</div>
                <Avatar>
                  <AvatarImage src={influencer.profilePicture || `/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {influencer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{influencer.name}</p>
                  <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{influencer.followers.toLocaleString()} followers</p>
                  <p className="text-sm text-muted-foreground">{influencer.engagementRate}% engagement</p>
                </div>
                <Badge variant={influencer.status === "ACTIVE" ? "default" : "secondary"}>{influencer.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
