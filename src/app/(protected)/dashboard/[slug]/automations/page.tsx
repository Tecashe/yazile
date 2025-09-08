
"use client"

import AutomationList from "@/components/global/automation-list"
import CreateAutomation from "@/components/global/create-automation"
import { useQueryAutomations } from "@/hooks/user-queries"
import { Activity, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"


const Page = () => {
  const { data, isLoading, isFetching } = useQueryAutomations()
  const automations = data?.data || []
  const activeCount = automations.filter((auto) => auto.active).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Clean Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Automations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your automated workflows
              {isFetching && <span className="text-primary"> • Syncing...</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Simple Status Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">
                {activeCount} of {automations.length} active
              </span>
            </div>
            
            {/* Create Button */}
            <CreateAutomation />
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-6">
          {/* Key Metrics - Simplified */}
          {!isLoading && automations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Automations</p>
                    <p className="text-2xl font-semibold">{automations.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-semibold text-green-600">{activeCount}</p>
                  </div>
                </div>
              </Card>
              
            </div>
          )}

          {/* Automation List - Clean Focus */}
          <Card className="border-0 shadow-sm">
            <AutomationList id={automations.length > 0 ? automations[0]?.id || "" : ""} />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page