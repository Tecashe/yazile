"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateBusinessProfile } from "@/actions/ai-agents"
import { Loader2, Building2 } from "lucide-react"

interface BusinessEditModalProps {
  business: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedBusiness: any) => void
}

export function BusinessEditModal({ business, isOpen, onClose, onSave }: BusinessEditModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: business?.businessName || "",
    businessType: business?.businessType || "",
    businessDescription: business?.businessDescription || "",
    website: business?.website || "",
    responseLanguage: business?.responseLanguage || "English",
  })

  const businessTypes = [
    "E-commerce",
    "SaaS",
    "Consulting",
    "Healthcare",
    "Education",
    "Real Estate",
    "Restaurant",
    "Retail",
    "Technology",
    "Finance",
    "Marketing",
    "Other",
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Dutch",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!formData.businessName.trim()) {
      toast({
        title: "Error",
        description: "Business name is required.",
        variant: "destructive",
      })
      return
    }

    if (!formData.businessDescription.trim()) {
      toast({
        title: "Error",
        description: "Business description is required.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await updateBusinessProfile(business.id, formData)

      if (result.status === 200 && "data" in result) {
        onSave(result.data)
        onClose()
        toast({
          title: "Success!",
          description: "Business profile updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "error" in result ? result.error : "Failed to update business profile.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating business:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      businessName: business?.businessName || "",
      businessType: business?.businessType || "",
      businessDescription: business?.businessDescription || "",
      website: business?.website || "",
      responseLanguage: business?.responseLanguage || "English",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Edit Business Profile
          </DialogTitle>
          <DialogDescription>
            Update your business information to help your AI agent better represent your company.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              placeholder="Enter your business name"
              disabled={isLoading}
            />
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => handleInputChange("businessType", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
              disabled={isLoading}
            />
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description *</Label>
            <Textarea
              id="businessDescription"
              value={formData.businessDescription}
              onChange={(e) => handleInputChange("businessDescription", e.target.value)}
              placeholder="Describe what your business does, your target audience, and key services..."
              rows={4}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This helps your AI agent understand your business context and provide better responses.
            </p>
          </div>

          {/* Response Language */}
          <div className="space-y-2">
            <Label htmlFor="responseLanguage">Primary Response Language</Label>
            <Select
              value={formData.responseLanguage}
              onValueChange={(value) => handleInputChange("responseLanguage", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Business"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
