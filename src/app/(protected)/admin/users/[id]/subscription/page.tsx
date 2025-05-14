import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"

async function getUserSubscription(id: string) {
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
      name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
      email: user.email,
      subscriptionId: user.subscription?.id,
      plan: user.subscription?.plan || "FREE",
      createdAt: user.subscription?.createdAt?.toISOString(),
      updatedAt: user.subscription?.updatedAt?.toISOString(),
      customerId: user.subscription?.customerId,
    }
  } catch (error) {
    console.error("Error fetching user subscription:", error)
    return null
  }
}

export default async function UserSubscriptionPage({ params }: { params: { id: string } }) {
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

      <Suspense fallback={<SubscriptionFormSkeleton />}>
        <SubscriptionForm id={params.id} />
      </Suspense>
    </div>
  )
}

async function SubscriptionForm({ id }: { id: string }) {
  const subscription = await getUserSubscription(id)

  if (!subscription) {
    notFound()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Subscription</CardTitle>
        <CardDescription>Update subscription plan for {subscription.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
              <p>{subscription.name}</p>
              <p className="text-sm text-muted-foreground">{subscription.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer ID</h3>
              <p>{subscription.customerId || "Not available"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Plan</h3>
              <p>{subscription.plan}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
              <p>{formatDate(subscription.createdAt)}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Change Plan</h3>
            <RadioGroup defaultValue={subscription.plan}>
              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="FREE" id="free" />
                <div className="grid gap-1.5">
                  <Label htmlFor="free" className="font-medium">
                    Free Plan
                  </Label>
                  <p className="text-sm text-muted-foreground">Basic features with limited usage</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="PRO" id="pro" />
                <div className="grid gap-1.5">
                  <Label htmlFor="pro" className="font-medium">
                    Pro Plan
                  </Label>
                  <p className="text-sm text-muted-foreground">Full access to all features and premium support</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/admin/users/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit">Update Subscription</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SubscriptionFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          <div className="border-t pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
