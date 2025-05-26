import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusIcon, EyeIcon, EditIcon } from "lucide-react"
import { getMyCampaigns } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"
import { GroupIcon as CampaignIcon } from "lucide-react"

export async function MyCampaigns() {
  const user = await onCurrentUser()
  const campaigns = await getMyCampaigns(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">My Campaigns</h3>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{campaign.name}</CardTitle>
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
              <CardDescription className="line-clamp-2">
                {campaign.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">${campaign.budget?.toLocaleString() || "Not set"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Influencers:</span>
                  <span className="font-medium">{campaign.influencers.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">
                    {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "Not set"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CampaignIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first campaign to start collaborating with influencers
            </p>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
