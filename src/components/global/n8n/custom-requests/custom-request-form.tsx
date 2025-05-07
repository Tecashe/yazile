// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Loader2 } from "lucide-react"
// import type { RequestUrgency, WorkflowCategory } from "@prisma/client"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"
// import { toast } from "@/hooks/use-toast"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// interface CustomRequestFormProps {
//   templateId?: string
//   onSuccess?: (requestId: string) => void
// }

// export function CustomRequestForm({ templateId, onSuccess }: CustomRequestFormProps) {
//   const router = useRouter()

//   // State
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     title: "",
//     businessObjective: "",
//     requiredIntegrations: [] as string[],
//     processDescription: "",
//     exampleDataUrl: "",
//     budget: "",
//     urgency: "NORMAL" as RequestUrgency,
//     category: templateId ? undefined : ("CUSTOM" as WorkflowCategory),
//   })

//   // Available integrations
//   const availableIntegrations = [
//     { id: "email", label: "Email Service" },
//     { id: "database", label: "Database" },
//     { id: "crm", label: "CRM System" },
//     { id: "payment", label: "Payment Gateway" },
//     { id: "storage", label: "File Storage" },
//     { id: "social", label: "Social Media" },
//     { id: "analytics", label: "Analytics" },
//     { id: "calendar", label: "Calendar" },
//     { id: "messaging", label: "Messaging" },
//     { id: "other", label: "Other (Please specify in description)" },
//   ]

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validate form
//     if (!formData.title.trim()) {
//       toast({
//         title: "Missing information",
//         description: "Please provide a title for your request",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!formData.businessObjective.trim()) {
//       toast({
//         title: "Missing information",
//         description: "Please describe your business objective",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!formData.processDescription.trim()) {
//       toast({
//         title: "Missing information",
//         description: "Please describe the process you want to automate",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       const response = await fetch("/api/custom-requests", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           templateId,
//           budget: formData.budget ? Number.parseFloat(formData.budget) : null,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to submit custom request")
//       }

//       const data = await response.json()

//       toast({
//         title: "Request submitted",
//         description: "Your custom workflow request has been submitted successfully",
//       })

//       // Call onSuccess callback if provided
//       if (onSuccess) {
//         onSuccess(data.id)
//       } else {
//         // Redirect to the custom request detail page
//         router.push(`/custom-requests/${data.id}`)
//       }
//     } catch (error) {
//       console.error("Error submitting custom request:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Handle checkbox change for integrations
//   const handleIntegrationChange = (integration: string, checked: boolean) => {
//     if (checked) {
//       setFormData({
//         ...formData,
//         requiredIntegrations: [...formData.requiredIntegrations, integration],
//       })
//     } else {
//       setFormData({
//         ...formData,
//         requiredIntegrations: formData.requiredIntegrations.filter((i) => i !== integration),
//       })
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Custom Workflow Request</CardTitle>
//         <CardDescription>Request a custom workflow tailored to your specific needs</CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-6">
//           {/* Title */}
//           <div className="space-y-2">
//             <Label htmlFor="title">
//               Request Title <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="title"
//               placeholder="E.g., Customer Onboarding Automation"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               required
//             />
//           </div>

//           {/* Business Objective */}
//           <div className="space-y-2">
//             <Label htmlFor="businessObjective">
//               Business Objective <span className="text-destructive">*</span>
//             </Label>
//             <Textarea
//               id="businessObjective"
//               placeholder="What business goal are you trying to achieve with this workflow?"
//               value={formData.businessObjective}
//               onChange={(e) => setFormData({ ...formData, businessObjective: e.target.value })}
//               required
//               className="min-h-[100px]"
//             />
//           </div>

//           {/* Category (if no template is selected) */}
//           {!templateId && (
//             <div className="space-y-2">
//               <Label htmlFor="category">Workflow Category</Label>
//               <Select
//                 value={formData.category}
//                 onValueChange={(value) => setFormData({ ...formData, category: value as WorkflowCategory })}
//               >
//                 <SelectTrigger id="category">
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.values(WorkflowCategory).map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category.replace(/_/g, " ")}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Required Integrations */}
//           <div className="space-y-2">
//             <Label>Required Integrations</Label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {availableIntegrations.map((integration) => (
//                 <div key={integration.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`integration-${integration.id}`}
//                     checked={formData.requiredIntegrations.includes(integration.id)}
//                     onCheckedChange={(checked) => handleIntegrationChange(integration.id, checked === true)}
//                   />
//                   <Label htmlFor={`integration-${integration.id}`} className="cursor-pointer">
//                     {integration.label}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Process Description */}
//           <div className="space-y-2">
//             <Label htmlFor="processDescription">
//               Process Description <span className="text-destructive">*</span>
//             </Label>
//             <Textarea
//               id="processDescription"
//               placeholder="Describe the step-by-step process you want to automate. Be as detailed as possible."
//               value={formData.processDescription}
//               onChange={(e) => setFormData({ ...formData, processDescription: e.target.value })}
//               required
//               className="min-h-[150px]"
//             />
//           </div>

//           {/* Example Data URL */}
//           <div className="space-y-2">
//             <Label htmlFor="exampleDataUrl">Example Data URL (Optional)</Label>
//             <Input
//               id="exampleDataUrl"
//               placeholder="Link to a document or spreadsheet with example data"
//               value={formData.exampleDataUrl}
//               onChange={(e) => setFormData({ ...formData, exampleDataUrl: e.target.value })}
//             />
//             <p className="text-sm text-muted-foreground">
//               If you have example data or a document that illustrates your workflow, please provide a link.
//             </p>
//           </div>

//           {/* Budget */}
//           <div className="space-y-2">
//             <Label htmlFor="budget">Budget (Optional)</Label>
//             <Input
//               id="budget"
//               type="number"
//               placeholder="Your budget for this custom workflow"
//               value={formData.budget}
//               onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
//               min="0"
//               step="0.01"
//             />
//           </div>

//           {/* Urgency */}
//           <div className="space-y-2">
//             <Label>Urgency</Label>
//             <RadioGroup
//               value={formData.urgency}
//               onValueChange={(value) => setFormData({ ...formData, urgency: value as RequestUrgency })}
//               className="flex flex-col space-y-1"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="LOW" id="urgency-low" />
//                 <Label htmlFor="urgency-low">Low - No specific deadline</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="NORMAL" id="urgency-normal" />
//                 <Label htmlFor="urgency-normal">Normal - Within a few weeks</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="HIGH" id="urgency-high" />
//                 <Label htmlFor="urgency-high">High - Within a week</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="CRITICAL" id="urgency-critical" />
//                 <Label htmlFor="urgency-critical">Critical - As soon as possible</Label>
//               </div>
//             </RadioGroup>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-end space-x-2">
//           <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Submit Request
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { type RequestUrgency, WorkflowCategory } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomRequestFormProps {
  templateId?: string
  onSuccess?: (requestId: string) => void
}

export function CustomRequestForm({ templateId, onSuccess }: CustomRequestFormProps) {
  const router = useRouter()

  // State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    businessObjective: "",
    requiredIntegrations: [] as string[],
    processDescription: "",
    exampleDataUrl: "",
    budget: "",
    urgency: "NORMAL" as RequestUrgency,
    category: templateId ? undefined : ("CUSTOM" as WorkflowCategory),
  })

  // Available integrations
  const availableIntegrations = [
    { id: "email", label: "Email Service" },
    { id: "database", label: "Database" },
    { id: "crm", label: "CRM System" },
    { id: "payment", label: "Payment Gateway" },
    { id: "storage", label: "File Storage" },
    { id: "social", label: "Social Media" },
    { id: "analytics", label: "Analytics" },
    { id: "calendar", label: "Calendar" },
    { id: "messaging", label: "Messaging" },
    { id: "other", label: "Other (Please specify in description)" },
  ]

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your request",
        variant: "destructive",
      })
      return
    }

    if (!formData.businessObjective.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe your business objective",
        variant: "destructive",
      })
      return
    }

    if (!formData.processDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe the process you want to automate",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/custom-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          templateId,
          budget: formData.budget ? Number.parseFloat(formData.budget) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit custom request")
      }

      const data = await response.json()

      toast({
        title: "Request submitted",
        description: "Your custom workflow request has been submitted successfully",
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data.id)
      } else {
        // Redirect to the custom request detail page
        router.push(`/custom-requests/${data.id}`)
      }
    } catch (error) {
      console.error("Error submitting custom request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle checkbox change for integrations
  const handleIntegrationChange = (integration: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        requiredIntegrations: [...formData.requiredIntegrations, integration],
      })
    } else {
      setFormData({
        ...formData,
        requiredIntegrations: formData.requiredIntegrations.filter((i) => i !== integration),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Workflow Request</CardTitle>
        <CardDescription>Request a custom workflow tailored to your specific needs</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Request Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="E.g., Customer Onboarding Automation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Business Objective */}
          <div className="space-y-2">
            <Label htmlFor="businessObjective">
              Business Objective <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="businessObjective"
              placeholder="What business goal are you trying to achieve with this workflow?"
              value={formData.businessObjective}
              onChange={(e) => setFormData({ ...formData, businessObjective: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          {/* Category (if no template is selected) */}
          {!templateId && (
            <div className="space-y-2">
              <Label htmlFor="category">Workflow Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) => setFormData({ ...formData, category: value as WorkflowCategory })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WorkflowCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Required Integrations */}
          <div className="space-y-2">
            <Label>Required Integrations</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableIntegrations.map((integration) => (
                <div key={integration.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`integration-${integration.id}`}
                    checked={formData.requiredIntegrations.includes(integration.id)}
                    onCheckedChange={(checked) => handleIntegrationChange(integration.id, checked === true)}
                  />
                  <Label htmlFor={`integration-${integration.id}`} className="cursor-pointer">
                    {integration.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Process Description */}
          <div className="space-y-2">
            <Label htmlFor="processDescription">
              Process Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="processDescription"
              placeholder="Describe the step-by-step process you want to automate. Be as detailed as possible."
              value={formData.processDescription}
              onChange={(e) => setFormData({ ...formData, processDescription: e.target.value })}
              required
              className="min-h-[150px]"
            />
          </div>

          {/* Example Data URL */}
          <div className="space-y-2">
            <Label htmlFor="exampleDataUrl">Example Data URL (Optional)</Label>
            <Input
              id="exampleDataUrl"
              placeholder="Link to a document or spreadsheet with example data"
              value={formData.exampleDataUrl}
              onChange={(e) => setFormData({ ...formData, exampleDataUrl: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              If you have example data or a document that illustrates your workflow, please provide a link.
            </p>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Your budget for this custom workflow"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label>Urgency</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value: string) => setFormData({ ...formData, urgency: value as RequestUrgency })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LOW" id="urgency-low" />
                <Label htmlFor="urgency-low">Low - No specific deadline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NORMAL" id="urgency-normal" />
                <Label htmlFor="urgency-normal">Normal - Within a few weeks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HIGH" id="urgency-high" />
                <Label htmlFor="urgency-high">High - Within a week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CRITICAL" id="urgency-critical" />
                <Label htmlFor="urgency-critical">Critical - As soon as possible</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
