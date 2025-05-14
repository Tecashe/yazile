import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
      },
    })

    if (!user) return null

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      plan: user.subscription?.plan || "FREE",
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
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

      <Suspense fallback={<EditUserFormSkeleton />}>
        <EditUserForm id={params.id} />
      </Suspense>
    </div>
  )
}

async function EditUserForm({ id }: { id: string }) {
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
        <CardDescription>Update user information and settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" defaultValue={user.firstname || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" defaultValue={user.lastname || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isAdmin" defaultChecked={user.isAdmin} />
            <Label htmlFor="isAdmin">Admin User</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/admin/users/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function EditUserFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
