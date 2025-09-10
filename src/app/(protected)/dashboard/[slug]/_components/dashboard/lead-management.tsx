import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getLeadData } from "@/lib/dashboard-actions"
import { Users, Star, TrendingUp, Eye } from "lucide-react"

export async function LeadManagement() {
  const leadData = await getLeadData()

  const getLeadTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "gold":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "silver":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      case "bronze":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "qualified":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
      case "nurturing":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
      case "new":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <Card className="bg-card border-border lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-chart-2" />
              High-Value Leads
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Top prospects and their qualification status</p>
          </div>
          <Button variant="outline" size="sm" className="border-border bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leadData.topLeads.map((lead, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-border hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{lead.name}</span>
                    <Badge variant="secondary" className={getLeadTierColor(lead.tier)}>
                      <Star className="w-3 h-3 mr-1" />
                      {lead.tier}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{lead.source}</span>
                    <span>•</span>
                    <span>Score: {lead.score}</span>
                    <span>•</span>
                    <span>{lead.lastContact}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold text-foreground">${lead.estimatedValue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Est. Value</div>
                </div>

                <Badge variant="secondary" className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>

                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{leadData.totalQualified}</div>
            <div className="text-sm text-muted-foreground">Qualified Leads</div>
          </div>

          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">${leadData.totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Pipeline Value</div>
          </div>

          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">{leadData.conversionRate}%</div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
