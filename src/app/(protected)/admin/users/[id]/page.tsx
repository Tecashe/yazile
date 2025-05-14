import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"

async function getUserById(id: string) {
  try {
    const user = await client.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        integrations: {
          select: {
            id: true,
          },
        },
        automations: {
          select: {
            id: true,
            active: true,
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
      email: user.email,
      plan: user.subscription?.plan || "FREE",
      createdAt: user.createdAt.toISOString(),
      integrations: user.integrations.length,
      automations: user.automations.length,
      activeAutomations: user.automations.filter((a) => a.active).length,
      status: user.integrations.length > 0 ? "active" : "inactive",
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <Suspense fallback={<UserDetailsSkeleton />}>
        <UserDetails id={params.id} />
      </Suspense>
    </div>
  )
}

async function UserDetails({ id }: { id: string }) {
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="mt-2 flex gap-2">
              <Badge variant={user.plan === "PRO" ? "default" : "outline"}>{user.plan}</Badge>
              <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Joined</h3>
            <p className="mt-1 text-lg">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Integrations</h3>
            <p className="mt-1 text-lg">{user.integrations}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Automations</h3>
            <p className="mt-1 text-lg">
              {user.automations} ({user.activeAutomations} active)
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href={`/admin/users/${user.id}/edit`}>Edit User</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${user.id}/subscription`}>Manage Subscription</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${user.id}/automations`}>View Automations</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function UserDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </CardContent>
    </Card>
  )
}
