
import { redirect } from "next/navigation"
import Link from "next/link"
import { client } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Settings, Database } from "lucide-react"
import { onUserInfor } from "@/actions/user"
import { useRouter, usePathname  } from "next/navigation"

export default async function CrmIntegrationsPage() {
    const user = await onUserInfor()
    const  userId  = user.data?.id
    
    const pathname = usePathname()
    const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
    const slug = slugMatch ? slugMatch[1] : ""

  if (!userId) {
    redirect("/sign-in")
  }

  // Fetch CRM integrations
  const integrations = await client.crmIntegration.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      mappings: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">CRM Integrations</h1>
        <Button asChild>
          <Link href={`/dashboard/${slug}/connections/crm/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Integration
          </Link>
        </Button>
      </div>

      {integrations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No CRM Integrations</CardTitle>
            <CardDescription>Connect your CRM to sync qualified leads automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connecting your CRM allows you to automatically sync qualified leads from your lead qualification system.
              This ensures that your sales team always has the most up-to-date information.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/integrations/crm/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Integration
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{integration.name}</CardTitle>
                  <Badge variant={integration.isActive ? "default" : "outline"}>
                    {integration.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  {integration.provider} • Connected {new Date(integration.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Field Mappings</h3>
                    {integration.mappings.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No field mappings configured</p>
                    ) : (
                      <div className="mt-2 rounded-md border">
                        <div className="grid grid-cols-3 gap-2 p-2 border-b bg-muted/50">
                          <div className="text-xs font-medium">Local Field</div>
                          <div className="text-xs font-medium">CRM Field</div>
                          <div className="text-xs font-medium">Required</div>
                        </div>
                        <div className="divide-y">
                          {integration.mappings.map((mapping) => (
                            <div key={mapping.id} className="grid grid-cols-3 gap-2 p-2">
                              <div className="text-sm">{mapping.localField}</div>
                              <div className="text-sm">{mapping.remoteField}</div>
                              <div className="text-sm">
                                {mapping.isRequired ? (
                                  <Badge variant="default">Required</Badge>
                                ) : (
                                  <Badge variant="outline">Optional</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/integrations/crm/${integration.id}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/integrations/crm/${integration.id}/sync`}>
                    <Database className="mr-2 h-4 w-4" />
                    Sync Leads
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
