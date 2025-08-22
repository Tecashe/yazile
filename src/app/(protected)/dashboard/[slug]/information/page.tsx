// BusinessSetupPage.tsx - Updated component
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createBusinessProfile, getUserAutomations } from "@/actions/business"
import { Building2, Globe, MessageSquare, Briefcase, Loader2 } from "lucide-react"

interface Automation {
  id: string
  name: string
  active: boolean
  platform: string
  createdAt: Date
}

export default function BusinessSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [automationsLoading, setAutomationsLoading] = useState(true)
  const [automations, setAutomations] = useState<Automation[]>([])
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessType: "",
    businessDescription: "",
    website: "",
    responseLanguage: "English",
    automationId: "", // Remove temp value
  })

  const businessTypes = [
    "Restaurant",
    "Retail Store",
    "E-commerce",
    "Professional Services",
    "Healthcare",
    "Technology",
    "Education",
    "Real Estate",
    "Manufacturing",
    "Other",
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ]

  // Load user automations on component mount
  useEffect(() => {
    const loadAutomations = async () => {
      try {
        const result = await getUserAutomations()
        if (result.status === 200) {
          setAutomations(result.data)
          // Auto-select first automation if available
          if (result.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              automationId: result.data[0].id
            }))
          }
        } else {
          toast({
            title: "Warning",
            description: "Could not load your automations. You may need to create one first.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error loading automations:', error)
        toast({
          title: "Error",
          description: "Failed to load automations.",
          variant: "destructive",
        })
      } finally {
        setAutomationsLoading(false)
      }
    }

    loadAutomations()
  }, [toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.businessName || !formData.businessType || !formData.businessDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!formData.automationId) {
      toast({
        title: "Missing Automation",
        description: "Please select an automation or create one first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await createBusinessProfile(formData)

      if (result.status === 201) {
        toast({
          title: "Success!",
          description: "Your business profile has been created successfully.",
        })
        router.push("/dashboard") // Redirect to dashboard
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create business profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Setup</h1>
          <p className="text-gray-600">Tell us about your business to get started</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Business Information
            </CardTitle>
            <CardDescription>
              Provide details about your business to personalize your automation experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Acme Corporation"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
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

              {/* Add Automation Selection */}
              <div className="space-y-2">
                <Label htmlFor="automation">Select Automation *</Label>
                {automationsLoading ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading automations...
                  </div>
                ) : automations.length > 0 ? (
                  <Select
                    value={formData.automationId}
                    onValueChange={(value) => handleInputChange("automationId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an automation" />
                    </SelectTrigger>
                    <SelectContent>
                      {automations.map((automation) => (
                        <SelectItem key={automation.id} value={automation.id}>
                          {automation.name} ({automation.platform})
                          {!automation.active && " - Inactive"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800">
                    <p>No automations found. Please create an automation first.</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => router.push("/create-automation")}
                    >
                      Create Automation
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseLanguage">Response Language</Label>
                <Select
                  value={formData.responseLanguage}
                  onValueChange={(value) => handleInputChange("responseLanguage", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="businessDescription"
                    placeholder="Describe your business, what you do, your target audience, and what makes you unique..."
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                    className="pl-10 min-h-[120px]"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  This information helps personalize automated responses to your customers.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading || automationsLoading || !formData.automationId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Business Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

