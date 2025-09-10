import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Zap } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">DM Automation Hub</h1>
        <p className="text-muted-foreground text-lg">Advanced analytics and insights for your automation workflows</p>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          <Zap className="w-3 h-3 mr-1" />
          Live Data
        </Badge>

        <Button variant="outline" size="sm" className="border-border bg-transparent">
          <Bell className="w-4 h-4 mr-2" />
          Alerts
        </Button>

        <Button variant="outline" size="sm" className="border-border bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
}
