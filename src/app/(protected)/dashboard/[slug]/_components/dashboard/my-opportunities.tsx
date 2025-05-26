import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusIcon, EyeIcon, EditIcon, UsersIcon } from "lucide-react"
import { getMyOpportunities } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"

export async function MyOpportunities() {
  const user = await onCurrentUser()
  const opportunities = await getMyOpportunities(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">My Opportunities</h3>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Opportunity
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{opportunity.title}</CardTitle>
                <Badge
                  variant={
                    opportunity.status === "OPEN"
                      ? "default"
                      : opportunity.status === "CLOSED"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {opportunity.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{opportunity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">
                    ${opportunity.budgetMin.toLocaleString()} - ${opportunity.budgetMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{opportunity.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applications:</span>
                  <span className="font-medium">{opportunity.application.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platforms:</span>
                  <span className="font-medium">{opportunity.platforms.join(", ")}</span>
                </div>
                {opportunity.deadline && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">{new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                )}
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

      {opportunities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No opportunities yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create opportunities to attract influencers to work with your brand
            </p>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Opportunity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
