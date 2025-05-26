import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TargetIcon, MessageCircleIcon, PhoneIcon, MailIcon } from "lucide-react"
import { getMyLeads, getMyLeadStats } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"

export async function MyLeads() {
  const user = await onCurrentUser()
  const [leads, leadStats] = await Promise.all([getMyLeads(user.id), getMyLeadStats(user.id)])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.qualified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.converted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Your latest lead interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {lead.name
                      ? lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{lead.name || "Unknown Lead"}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {lead.email && (
                      <div className="flex items-center space-x-1">
                        <MailIcon className="h-3 w-3" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center space-x-1">
                        <PhoneIcon className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">Score: {lead.score}</p>
                  <p className="text-sm text-muted-foreground">{lead.source}</p>
                </div>
                <Badge
                  variant={
                    lead.status === "QUALIFIED"
                      ? "default"
                      : lead.status === "CONVERTED"
                        ? "secondary"
                        : lead.status === "NEW"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {lead.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <MessageCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {leads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <TargetIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No leads yet</h3>
              <p className="text-muted-foreground text-center">
                Start your automations to begin generating leads from your social media
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
