import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { client } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Settings, Workflow, ExternalLink } from "lucide-react"
import { onUserInfor } from "@/actions/user"
import { useSearchParams, useRouter, usePathname  } from "next/navigation"

export default async function N8nIntegrationsPage() {
    const user = await onUserInfor()
    const  userId  = user.data?.id

    const router = useRouter()
    const pathname = usePathname()
    const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
    const slug = slugMatch ? slugMatch[1] : ""
  

  if (!userId) {
    redirect("/sign-in")
  }

  // Fetch n8n connections
  const connections = await client.n8nConnection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      workflows: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">n8n Integrations</h1>
        <Button asChild>
          <Link href="/dashboard/integrations/n8n/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Connection
          </Link>
        </Button>
      </div>

      {connections.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No n8n Connections</CardTitle>
            <CardDescription>Connect your n8n instance to automate lead qualification and nurturing.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              n8n is a powerful workflow automation tool that can help you automate your lead qualification process.
              Connect your n8n instance to get started.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>              
               <Link href={`/dashboard/${slug}/connections/n8n/new`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Connection
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{connection.name}</CardTitle>
                  <Badge variant={connection.isActive ? "default" : "outline"}>
                    {connection.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>Connected {new Date(connection.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">n8n URL</h3>
                    <p className="text-sm text-muted-foreground">{connection.n8nUrl}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Workflows</h3>
                    {connection.workflows.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No workflows configured</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {connection.workflows.map((workflow) => (
                          <li key={workflow.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center">
                              <Workflow className="mr-2 h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{workflow.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {workflow.workflowType.replace("_", " ")}
                                </p>
                              </div>
                            </div>
                            <Badge variant={workflow.isActive ? "default" : "outline"}>
                              {workflow.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={connection.n8nUrl} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open n8n
                  </Link>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/${slug}/connections/n8n/new/${connection.id}`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/dashboard/${slug}/connections/n8n/new/${connection.id}//workflow/new`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Workflow
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
