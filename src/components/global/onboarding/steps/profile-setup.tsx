"use client"

import type React from "react"

import { useRef } from "react"
import { Camera, Building2, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileSetupProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  userType: "influencer" | "regular"
}

export default function ProfileSetup({ formData, updateFormData, userType }: ProfileSetupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateFormData("profileImage", e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const isInfluencer = userType === "influencer"

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div
            className={`h-16 w-16 bg-gradient-to-r ${isInfluencer ? "from-purple-500 to-pink-500" : "from-blue-500 to-cyan-500"} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {isInfluencer ? <Star className="h-8 w-8 text-white" /> : <Building2 className="h-8 w-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isInfluencer ? "Create your creator profile" : "Tell us about your business"}
          </h2>
          <p className="text-muted-foreground">
            {isInfluencer ? "This is how brands will discover you" : "This helps us personalize your experience"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                {formData.profileImage ? (
                  <AvatarImage src={formData.profileImage || "/placeholder.svg"} alt="Profile" />
                ) : (
                  <AvatarFallback
                    className={`${isInfluencer ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-muted"} text-white`}
                  >
                    {isInfluencer ? (
                      <Star className="h-8 w-8" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isInfluencer ? "Upload your profile photo" : "Upload your company logo"}
            </p>
          </div>

          {/* Profile Details */}
          <div className="grid gap-4">
            {isInfluencer ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={formData.firstName || ""}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      value={formData.lastName || ""}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="Your unique username"
                    value={formData.username || ""}
                    onChange={(e) => updateFormData("username", e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName || ""}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    value={formData.businessName || ""}
                    onChange={(e) => updateFormData("businessName", e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location || ""}
                onChange={(e) => updateFormData("location", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder={isInfluencer ? "https://yourwebsite.com" : "https://yourcompany.com"}
                value={formData.website || ""}
                onChange={(e) => updateFormData("website", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bio">{isInfluencer ? "Bio" : "Business Description"}</Label>
              <Textarea
                id="bio"
                placeholder={
                  isInfluencer
                    ? "Tell brands about yourself and what makes you unique..."
                    : "Tell us what your business does..."
                }
                value={formData.bio || formData.businessDescription || ""}
                onChange={(e) => updateFormData(isInfluencer ? "bio" : "businessDescription", e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {((isInfluencer ? formData.bio : formData.businessDescription) || "").length}/500 characters
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
