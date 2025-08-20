
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"
import { AutomationsTableClient } from "../../../components/automations-table"

async function getUserAutomations(id: string) {
  try {
    const user = await client.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        automations: {
          include: {
            listener: true,
            keywords: true,
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
      email: user.email,
      automations: user.automations.map((auto) => ({
        id: auto.id,
        name: auto.name,
        type: auto.listener?.listener || "UNKNOWN",
        active: auto.active,
        createdAt: auto.createdAt.toISOString(),
        lastTriggered: auto.messages[0]?.createdAt.toISOString() || null,
        keywords: auto.keywords.map((k) => k.word),
      })),
    }
  } catch (error) {
    console.error("Error fetching user automations:", error)
    return null
  }
}

export default async function UserAutomationsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href={`/admin/users/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Link>
        </Button>
      </div>

      <Suspense fallback={<AutomationsTableSkeleton />}>
        <AutomationsTableWrapper id={params.id} />
      </Suspense>
    </div>
  )
}

async function AutomationsTableWrapper({ id }: { id: string }) {
  const userData = await getUserAutomations(id)

  if (!userData) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>User Automations</CardTitle>
            <CardDescription>Manage automations for {userData.name}</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/admin/users/${id}/automations/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Automation
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {userData.automations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No automations found for this user.</p>
            <Button className="mt-4" asChild>
              <Link href={`/admin/users/${id}/automations/new`}>Create First Automation</Link>
            </Button>
          </div>
        ) : (
          <AutomationsTableClient automations={userData.automations} userId={id} />
        )}
      </CardContent>
    </Card>
  )
}

function AutomationsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  )
}
