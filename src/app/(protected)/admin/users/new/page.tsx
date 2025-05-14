import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewUserPage() {
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

      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>Create a new user account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>

            <div className="space-y-4">
              <Label>Subscription Plan</Label>
              <RadioGroup defaultValue="FREE">
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

            <div className="flex items-center space-x-2">
              <Checkbox id="isAdmin" />
              <Label htmlFor="isAdmin">Admin User</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin/users">Cancel</Link>
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
