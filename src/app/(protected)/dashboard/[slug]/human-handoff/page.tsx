import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { client } from "@/lib/prisma"
import { HandoffSettingsForm } from "../_components/handoff/handoff-settings-form"
import { AgentManagement } from "../_components/handoff/agent-management"
import { PerformanceMetrics } from "../_components/handoff/performance-metrics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getHandoffData(userId: string) {

  const  usersid  = await onUserInfor()
  const userid = usersid.data?.clerkId


  const user = await client.user.findUnique({
    where: { clerkId: userid },
    include: {
      businesses: { take: 1 },
      handoffSettings: true,
    },
  })

  if (!user || !user.businesses[0]) {
    throw new Error("Business not ggggfgfound")
  }

  const agents = await client.agent.findMany({
    where: {
      businessAssignments: {
        some: {
          businessId: user.businesses[0].id,
          isActive: true,
        },
      },
    },
    include: {
      businessAssignments: {
        where: { businessId: user.businesses[0].id },
      },
      _count: {
        select: {
          handoffs: {
            where: {
              businessId: user.businesses[0].id,
              status: "IN_PROGRESS",
            },
          },
        },
      },
    },
  })

  const recentHandoffs = await client.humanHandoff.findMany({
    where: { businessId: user.businesses[0].id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      assignedAgent: true,
    },
  })

  return {
    user,
    business: user.businesses[0],
    settings: user.handoffSettings,
    agents,
    recentHandoffs,
  }
}

export default async function HandoffSettingsPage() {
  const  userr  = await onUserInfor()
  const userId = userr.data?.clerkId

  if (!userId) redirect("/sign-in")

  const data = await getHandoffData(userId)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Human Handoff Settings</h1>
        <p className="text-muted-foreground">
          Configure your human handoff system, manage agents, and monitor performance.
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Handoff Configuration</CardTitle>
              <CardDescription>Configure how and when conversations are handed off to human agents.</CardDescription>
            </CardHeader>
            <CardContent>
              <HandoffSettingsForm settings={data.settings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <AgentManagement agents={data.agents} businessId={data.business.id} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMetrics businessId={data.business.id} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Handoffs</CardTitle>
              <CardDescription>View recent handoff activity and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentHandoffs.map((handoff) => (
                  <div key={handoff.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Handoff #{handoff.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {handoff.reason} • {handoff.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          handoff.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : handoff.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : handoff.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {handoff.status}
                      </span>
                      {handoff.assignedAgent && (
                        <p className="text-sm text-muted-foreground mt-1">{handoff.assignedAgent.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
