import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PlusIcon, SettingsIcon, PlayIcon, PauseIcon } from "lucide-react"
import { getMyAutomations } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"

export async function MyAutomations() {
  const user = await onCurrentUser()
  const automations = await getMyAutomations(user.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">My Automations</h3>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{automation.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch checked={automation.active} />
                  <Badge variant={automation.active ? "default" : "secondary"}>
                    {automation.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardDescription>{automation.platform} automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Keywords:</span>
                  <span className="font-medium">{automation.keywords.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Posts Tracked:</span>
                  <span className="font-medium">{automation.posts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leads Generated:</span>
                  <span className="font-medium">{automation.leads.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Messages Sent:</span>
                  <span className="font-medium">{automation.messages.length}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  {automation.active ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {automations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No automations yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set up your first automation to start engaging with your audience automatically
            </p>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Automation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
