"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

interface ContactInfoProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}

export default function ContactInfo({ formData, updateFormData }: ContactInfoProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
          <p className="text-muted-foreground">How can we reach you?</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email || ""}
              onChange={(e) => updateFormData("email", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll use this email for important notifications and updates
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={formData.name || ""}
              onChange={(e) => updateFormData("name", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
