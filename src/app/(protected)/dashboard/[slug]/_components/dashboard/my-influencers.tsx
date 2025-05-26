import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UsersIcon, MessageCircleIcon, StarIcon } from "lucide-react"
import { getMyInfluencers } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"

export async function MyInfluencers() {
  const user = await onCurrentUser()
  const influencers = await getMyInfluencers(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Connected Influencers</h3>
        <Button>
          <UsersIcon className="h-4 w-4 mr-2" />
          Find Influencers
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {influencers.map((influencer) => (
          <Card key={influencer.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={influencer.profilePicture || `/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    Inf
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{influencer.name}</CardTitle>
                  <CardDescription>@{influencer.username}</CardDescription>
                </div>
                {influencer.verified && <Badge variant="secondary">Verified</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Followers:</span>
                  <span className="font-medium">{influencer.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Engagement:</span>
                  <span className="font-medium">{influencer.engagementRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Niche:</span>
                  <span className="font-medium">{influencer.niche || "General"}</span>
                </div>
                {influencer.rating > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{influencer.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {influencers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No influencers connected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start connecting with influencers to grow your brand reach
            </p>
            <Button>
              <UsersIcon className="h-4 w-4 mr-2" />
              Find Influencers
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
