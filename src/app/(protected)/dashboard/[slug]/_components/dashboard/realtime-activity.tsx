import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getRealtimeActivity } from "@/lib/dashboard-actions"
import { Activity, MessageCircle, UserPlus, DollarSign } from "lucide-react"

export async function RealtimeActivity() {
  const activities = await getRealtimeActivity()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4 text-chart-1" />
      case "lead":
        return <UserPlus className="h-4 w-4 text-chart-2" />
      case "conversion":
        return <DollarSign className="h-4 w-4 text-chart-3" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20"
      case "lead":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      case "conversion":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-chart-2" />
          Live Activity Feed
        </CardTitle>
        <p className="text-sm text-muted-foreground">Real-time updates from your automations</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg border border-border">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {activity.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityIcon(activity.type)}
                  <span className="text-sm font-medium text-foreground">{activity.title}</span>
                  <Badge variant="secondary" className={getActivityColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  {activity.value && <span className="text-xs font-medium text-chart-3">{activity.value}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">View all activity →</button>
        </div>
      </CardContent>
    </Card>
  )
}
