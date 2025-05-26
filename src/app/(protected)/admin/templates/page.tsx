// "use client"

// import React from "react"
// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "@/hooks/use-toast"
// import {
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Edit,
//   Trash2,
//   Filter,
//   Star,
//   Award,
//   Check,
//   X,
//   RefreshCw,
//   Search,
//   ExternalLink,
//   AlertCircle,
//   CheckCircle2,
//   FileJson,
//   Zap,
// } from "lucide-react"

// // Types
// type Template = {
//   id: string
//   name: string
//   description: string
//   category: string
//   icon?: string
//   featured: boolean
//   popular: boolean
//   complexity: "SIMPLE" | "MEDIUM" | "COMPLEX"
//   estimatedSetupTime: number
//   requiredIntegrations: string[]
//   configurationSchema: any
//   n8nTemplateId?: string
//   visualRepresentation?: string
//   expectedOutcomes: string[]
//   useCases: string[]
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
//   lastVerified?: string
//   isVerified?: boolean
//   _count?: {
//     userWorkflows: number
//   }
//   userWorkflows?: string[]
// }

// type N8nTemplate = {
//   id: string
//   name: string
//   description?: string
//   nodes: any[]
//   connections: any
//   active: boolean
//   createdAt: string
//   updatedAt: string
// }

// type PaginationInfo = {
//   total: number
//   limit: number
//   offset: number
// }

// type VerificationStatus = "idle" | "loading" | "success" | "error"

// export default function TemplatesAdminPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   // State
//   const [templates, setTemplates] = useState<Template[]>([])
//   const [n8nTemplates, setN8nTemplates] = useState<N8nTemplate[]>([])
//   const [isLoadingN8nTemplates, setIsLoadingN8nTemplates] = useState(false)
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     limit: 10,
//     offset: 0,
//   })
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("")
//   const [showFeatured, setShowFeatured] = useState<boolean | undefined>(undefined)
//   const [showPopular, setShowPopular] = useState<boolean | undefined>(undefined)
//   const [selectedComplexity, setSelectedComplexity] = useState<string>("")
//   const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")
//   const [selectedN8nTemplate, setSelectedN8nTemplate] = useState<N8nTemplate | null>(null)
//   const [templatePreview, setTemplatePreview] = useState<any>(null)
//   const [isTemplatePreviewLoading, setIsTemplatePreviewLoading] = useState(false)

//   // Template form state
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isN8nBrowserOpen, setIsN8nBrowserOpen] = useState(false)
//   const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     icon: "",
//     featured: false,
//     popular: false,
//     complexity: "MEDIUM" as "SIMPLE" | "MEDIUM" | "COMPLEX",
//     estimatedSetupTime: 15,
//     requiredIntegrations: [] as string[],
//     configurationSchema: "{}",
//     n8nTemplateId: "",
//     visualRepresentation: "",
//     expectedOutcomes: [] as string[],
//     useCases: [] as string[],
//     isActive: true,
//   })

//   // Categories
//   const categories = [
//     "MARKETING",
//     "SALES",
//     "CUSTOMER_SUPPORT",
//     "DATA_PROCESSING",
//     "DOCUMENT_MANAGEMENT",
//     "SOCIAL_MEDIA",
//     "COMMUNICATION",
//     "INTEGRATION",
//     "UTILITY",
//     "CUSTOM",
//   ]

//   // Fetch templates
//   const fetchTemplates = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       // Build query params
//       const params = new URLSearchParams()
//       if (searchTerm) params.append("search", searchTerm)
//       if (selectedCategory) params.append("category", selectedCategory)
//       if (showFeatured !== undefined) params.append("featured", String(showFeatured))
//       if (showPopular !== undefined) params.append("popular", String(showPopular))
//       if (selectedComplexity) params.append("complexity", selectedComplexity)
//       params.append("limit", String(pagination.limit))
//       params.append("offset", String(pagination.offset))

//       const response = await fetch(`/api/templates?${params.toString()}`)

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`)
//       }

//       const data = await response.json()
//       setTemplates(data.templates)
//       setPagination(data.pagination)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Fetch n8n templates
//   const fetchN8nTemplates = async () => {
//     setIsLoadingN8nTemplates(true)
//     try {
//       const response = await fetch("/api/n8n/templates")
//       if (!response.ok) {
//         throw new Error(`Error fetching n8n templates: ${response.statusText}`)
//       }
//       const data = await response.json()
//       setN8nTemplates(data.templates || [])
//     } catch (err) {
//       toast({
//         title: "Error fetching n8n templates",
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoadingN8nTemplates(false)
//     }
//   }

//   // Fetch n8n template details
//   const fetchN8nTemplateDetails = async (templateId: string) => {
//     setIsTemplatePreviewLoading(true)
//     try {
//       const response = await fetch(`/api/n8n/templates/${templateId}`)
//       if (!response.ok) {
//         throw new Error(`Error fetching template details: ${response.statusText}`)
//       }
//       const data = await response.json()
//       setTemplatePreview(data)
//       return data
//     } catch (err) {
//       toast({
//         title: "Error fetching template details",
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//       return null
//     } finally {
//       setIsTemplatePreviewLoading(false)
//     }
//   }

//   // Verify n8n template
//   const verifyN8nTemplate = async (templateId: string) => {
//     setVerificationStatus("loading")
//     try {
//       const response = await fetch(`/api/n8n/templates/${templateId}/verify`)
//       if (!response.ok) {
//         throw new Error(`Template verification failed: ${response.statusText}`)
//       }
//       const data = await response.json()
//       setVerificationStatus("success")
//       toast({
//         title: "Template verified",
//         description: "The n8n template exists and is valid.",
//         variant: "default",
//       })
//       return data
//     } catch (err) {
//       setVerificationStatus("error")
//       toast({
//         title: "Template verification failed",
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//       return null
//     }
//   }

//   // Generate configuration schema from n8n template
//   const generateSchemaFromTemplate = async (templateId: string) => {
//     try {
//       const response = await fetch(`/api/n8n/templates/${templateId}/schema`)
//       if (!response.ok) {
//         throw new Error(`Failed to generate schema: ${response.statusText}`)
//       }
//       const data = await response.json()
//       return data.schema
//     } catch (err) {
//       toast({
//         title: "Error generating schema",
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//       return null
//     }
//   }

//   // Test template configuration
//   const testTemplateConfiguration = async (templateId: string, configuration: any) => {
//     try {
//       const response = await fetch(`/api/n8n/templates/${templateId}/test`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ configuration }),
//       })

//       if (!response.ok) {
//         throw new Error(`Configuration test failed: ${response.statusText}`)
//       }

//       const data = await response.json()

//       toast({
//         title: "Configuration test successful",
//         description: "The template configuration is valid and works with this n8n template.",
//         variant: "default",
//       })

//       return data
//     } catch (err) {
//       toast({
//         title: "Configuration test failed",
//         description: err instanceof Error ? err.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//       return null
//     }
//   }

//   // Initial fetch
//   useEffect(() => {
//     fetchTemplates()
//   }, [pagination.offset, pagination.limit])

//   // Apply filters
//   const applyFilters = () => {
//     setPagination((prev) => ({ ...prev, offset: 0 })) // Reset to first page
//     fetchTemplates()
//   }

//   // Reset filters
//   const resetFilters = () => {
//     setSearchTerm("")
//     setSelectedCategory("")
//     setShowFeatured(undefined)
//     setShowPopular(undefined)
//     setSelectedComplexity("")
//     setPagination((prev) => ({ ...prev, offset: 0 }))
//     fetchTemplates()
//   }

//   // Handle pagination
//   const handlePreviousPage = () => {
//     if (pagination.offset - pagination.limit >= 0) {
//       setPagination((prev) => ({ ...prev, offset: prev.offset - prev.limit }))
//     }
//   }

//   const handleNextPage = () => {
//     if (pagination.offset + pagination.limit < pagination.total) {
//       setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
//     }
//   }

//   // Form handlers
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleCheckboxChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }))
//   }

//   const handleArrayInputChange = (name: string, value: string) => {
//     // Split by commas and trim whitespace
//     const arrayValue = value
//       .split(",")
//       .map((item) => item.trim())
//       .filter(Boolean)
//     setFormData((prev) => ({ ...prev, [name]: arrayValue }))
//   }

//   // Handle n8n template selection
//   const handleSelectN8nTemplate = async (template: N8nTemplate) => {
//     setSelectedN8nTemplate(template)

//     // Fetch template details for preview
//     const details = await fetchN8nTemplateDetails(template.id)

//     // Generate schema from template
//     const schema = await generateSchemaFromTemplate(template.id)

//     if (schema) {
//       setFormData((prev) => ({
//         ...prev,
//         n8nTemplateId: template.id,
//         name: prev.name || template.name,
//         description: prev.description || template.description || "",
//         configurationSchema: JSON.stringify(schema, null, 2),
//       }))
//     }

//     setIsN8nBrowserOpen(false)
//   }

//   // Template form component
//   const TemplateForm = () => {
//     // Use a ref to track if we're currently updating the form
//     const isUpdatingRef = React.useRef(false)

//     // Create refs for form elements to maintain focus
//     const nameInputRef = React.useRef<HTMLInputElement>(null)
//     const descriptionRef = React.useRef<HTMLTextAreaElement>(null)
//     const iconInputRef = React.useRef<HTMLInputElement>(null)
//     const setupTimeRef = React.useRef<HTMLInputElement>(null)
//     const integrationsRef = React.useRef<HTMLInputElement>(null)
//     const configSchemaRef = React.useRef<HTMLTextAreaElement>(null)
//     const templateIdRef = React.useRef<HTMLInputElement>(null)
//     const visualRepRef = React.useRef<HTMLInputElement>(null)
//     const outcomesRef = React.useRef<HTMLInputElement>(null)
//     const useCasesRef = React.useRef<HTMLInputElement>(null)

//     // Create a local copy of form data to avoid re-renders
//     const [localFormData, setLocalFormData] = useState({ ...formData })
//     const [localVerificationStatus, setLocalVerificationStatus] = useState<VerificationStatus>("idle")
//     const [isTestingConfig, setIsTestingConfig] = useState(false)

//     // Update local form data when parent form data changes
//     useEffect(() => {
//       setLocalFormData({ ...formData })
//     }, [formData])

//     // Update local verification status when parent status changes
//     useEffect(() => {
//       setLocalVerificationStatus(verificationStatus)
//     }, [verificationStatus])

//     // Handle input changes without triggering re-renders
//     const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       const { name, value } = e.target
//       setLocalFormData((prev) => ({ ...prev, [name]: value }))

//       // Reset verification status when n8nTemplateId changes
//       if (name === "n8nTemplateId") {
//         setLocalVerificationStatus("idle")
//         setTemplatePreview(null)
//       }
//     }

//     // Sync local form data to parent form data when needed
//     const syncFormData = () => {
//       if (isUpdatingRef.current) return
//       isUpdatingRef.current = true
//       setFormData(localFormData)
//       setTimeout(() => {
//         isUpdatingRef.current = false
//       }, 100)
//     }

//     // Handle n8n template verification
//     const handleVerifyTemplate = async () => {
//       if (!localFormData.n8nTemplateId) {
//         toast({
//           title: "Verification failed",
//           description: "Please enter an n8n template ID",
//           variant: "destructive",
//         })
//         return
//       }

//       const result = await verifyN8nTemplate(localFormData.n8nTemplateId)
//       if (result) {
//         // Fetch template details for preview
//         await fetchN8nTemplateDetails(localFormData.n8nTemplateId)
//       }
//     }

//     // Handle configuration schema generation
//     const handleGenerateSchema = async () => {
//       if (!localFormData.n8nTemplateId) {
//         toast({
//           title: "Schema generation failed",
//           description: "Please enter an n8n template ID",
//           variant: "destructive",
//         })
//         return
//       }

//       const schema = await generateSchemaFromTemplate(localFormData.n8nTemplateId)
//       if (schema) {
//         setLocalFormData((prev) => ({
//           ...prev,
//           configurationSchema: JSON.stringify(schema, null, 2),
//         }))
//         syncFormData()

//         toast({
//           title: "Schema generated",
//           description: "Configuration schema has been generated from the n8n template",
//           variant: "default",
//         })
//       }
//     }

//     // Handle configuration testing
//     const handleTestConfiguration = async () => {
//       if (!localFormData.n8nTemplateId) {
//         toast({
//           title: "Test failed",
//           description: "Please enter an n8n template ID",
//           variant: "destructive",
//         })
//         return
//       }

//       let configObject
//       try {
//         configObject = JSON.parse(localFormData.configurationSchema)
//       } catch (err) {
//         toast({
//           title: "Invalid JSON",
//           description: "The configuration schema is not valid JSON",
//           variant: "destructive",
//         })
//         return
//       }

//       setIsTestingConfig(true)
//       await testTemplateConfiguration(localFormData.n8nTemplateId, configObject)
//       setIsTestingConfig(false)
//     }

//     // Open n8n template browser
//     const handleOpenN8nBrowser = () => {
//       fetchN8nTemplates()
//       setIsN8nBrowserOpen(true)
//     }

//     return (
//       <div className="grid gap-4 py-4">
//         <Tabs defaultValue="basic" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="basic">Basic Information</TabsTrigger>
//             <TabsTrigger value="n8n">n8n Integration</TabsTrigger>
//             <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
//           </TabsList>

//           <TabsContent value="basic" className="space-y-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name *
//               </Label>
//               <Input
//                 ref={nameInputRef}
//                 id="name"
//                 name="name"
//                 value={localFormData.name}
//                 onChange={handleLocalInputChange}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="description" className="text-right">
//                 Description *
//               </Label>
//               <Textarea
//                 ref={descriptionRef}
//                 id="description"
//                 name="description"
//                 value={localFormData.description}
//                 onChange={handleLocalInputChange}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="category" className="text-right">
//                 Category *
//               </Label>
//               <Select
//                 name="category"
//                 value={localFormData.category || ""}
//                 onValueChange={(value) => {
//                   setLocalFormData((prev) => ({ ...prev, category: value }))
//                   // For select components, sync immediately
//                   setTimeout(() => {
//                     setFormData((prev) => ({ ...prev, category: value }))
//                   }, 0)
//                 }}
//               >
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category || "none"}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="icon" className="text-right">
//                 Icon
//               </Label>
//               <Input
//                 ref={iconInputRef}
//                 id="icon"
//                 name="icon"
//                 value={localFormData.icon}
//                 onChange={handleLocalInputChange}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 placeholder="Icon name or URL"
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label className="text-right">Featured</Label>
//               <div className="col-span-3 flex items-center space-x-2">
//                 <Checkbox
//                   id="featured"
//                   checked={localFormData.featured}
//                   onCheckedChange={(checked) => {
//                     setLocalFormData((prev) => ({ ...prev, featured: checked as boolean }))
//                     // For checkbox components, sync immediately
//                     setTimeout(() => {
//                       setFormData((prev) => ({ ...prev, featured: checked as boolean }))
//                     }, 0)
//                   }}
//                 />
//                 <label
//                   htmlFor="featured"
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   Mark as featured
//                 </label>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label className="text-right">Popular</Label>
//               <div className="col-span-3 flex items-center space-x-2">
//                 <Checkbox
//                   id="popular"
//                   checked={localFormData.popular}
//                   onCheckedChange={(checked) => {
//                     setLocalFormData((prev) => ({ ...prev, popular: checked as boolean }))
//                     // For checkbox components, sync immediately
//                     setTimeout(() => {
//                       setFormData((prev) => ({ ...prev, popular: checked as boolean }))
//                     }, 0)
//                   }}
//                 />
//                 <label
//                   htmlFor="popular"
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   Mark as popular
//                 </label>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="complexity" className="text-right">
//                 Complexity
//               </Label>
//               <Select
//                 name="complexity"
//                 value={localFormData.complexity}
//                 onValueChange={(value) => {
//                   setLocalFormData((prev) => ({ ...prev, complexity: value as "SIMPLE" | "MEDIUM" | "COMPLEX" }))
//                   // For select components, sync immediately
//                   setTimeout(() => {
//                     setFormData((prev) => ({ ...prev, complexity: value as "SIMPLE" | "MEDIUM" | "COMPLEX" }))
//                   }, 0)
//                 }}
//               >
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select complexity" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="SIMPLE">Simple</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="COMPLEX">Complex</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="estimatedSetupTime" className="text-right">
//                 Setup Time (min)
//               </Label>
//               <Input
//                 ref={setupTimeRef}
//                 id="estimatedSetupTime"
//                 name="estimatedSetupTime"
//                 type="number"
//                 value={localFormData.estimatedSetupTime}
//                 onChange={handleLocalInputChange}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//               />
//             </div>
//           </TabsContent>

//           <TabsContent value="n8n" className="space-y-4">
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>n8n Integration</AlertTitle>
//               <AlertDescription>
//                 Connect this template to an n8n workflow. You can either enter a template ID manually or browse
//                 available templates.
//               </AlertDescription>
//             </Alert>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="n8nTemplateId" className="text-right">
//                 n8n Template ID *
//               </Label>
//               <div className="col-span-3 flex gap-2">
//                 <Input
//                   ref={templateIdRef}
//                   id="n8nTemplateId"
//                   name="n8nTemplateId"
//                   value={localFormData.n8nTemplateId}
//                   onChange={handleLocalInputChange}
//                   onBlur={syncFormData}
//                   className="flex-1"
//                   placeholder="Enter n8n template ID"
//                 />
//                 <Button type="button" variant="outline" onClick={handleOpenN8nBrowser} className="whitespace-nowrap">
//                   <Search className="mr-2 h-4 w-4" />
//                   Browse
//                 </Button>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <div className="text-right">
//                 <Label>Template Status</Label>
//               </div>
//               <div className="col-span-3 flex items-center gap-4">
//                 {localVerificationStatus === "idle" && (
//                   <Button type="button" variant="outline" onClick={handleVerifyTemplate}>
//                     <CheckCircle2 className="mr-2 h-4 w-4" />
//                     Verify Template
//                   </Button>
//                 )}

//                 {localVerificationStatus === "loading" && (
//                   <Button type="button" variant="outline" disabled>
//                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                     Verifying...
//                   </Button>
//                 )}

//                 {localVerificationStatus === "success" && (
//                   <div className="flex items-center gap-2 text-green-600">
//                     <Check className="h-5 w-5" />
//                     <span>Template verified successfully</span>
//                   </div>
//                 )}

//                 {localVerificationStatus === "error" && (
//                   <div className="flex items-center gap-2 text-red-600">
//                     <X className="h-5 w-5" />
//                     <span>Template verification failed</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="configurationSchema" className="text-right">
//                 Config Schema *
//               </Label>
//               <div className="col-span-3 space-y-2">
//                 <div className="flex justify-end gap-2 mb-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleGenerateSchema}
//                     disabled={!localFormData.n8nTemplateId || localVerificationStatus !== "success"}
//                   >
//                     <FileJson className="mr-2 h-4 w-4" />
//                     Generate Schema
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleTestConfiguration}
//                     disabled={!localFormData.n8nTemplateId || localVerificationStatus !== "success" || isTestingConfig}
//                   >
//                     {isTestingConfig ? (
//                       <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                     ) : (
//                       <Zap className="mr-2 h-4 w-4" />
//                     )}
//                     Test Configuration
//                   </Button>
//                 </div>
//                 <Textarea
//                   ref={configSchemaRef}
//                   id="configurationSchema"
//                   name="configurationSchema"
//                   value={localFormData.configurationSchema}
//                   onChange={handleLocalInputChange}
//                   onBlur={syncFormData}
//                   className="font-mono text-sm"
//                   rows={10}
//                   required
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   JSON Schema that defines the configuration options for this template.
//                 </p>
//               </div>
//             </div>

//             {templatePreview && (
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="text-right">
//                   <Label>Template Preview</Label>
//                 </div>
//                 <div className="col-span-3">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-lg">{templatePreview.name}</CardTitle>
//                       {templatePreview.description && <CardDescription>{templatePreview.description}</CardDescription>}
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="font-medium">Nodes:</span>
//                           <span>{templatePreview.nodes?.length || 0}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="font-medium">Active:</span>
//                           <span>{templatePreview.active ? "Yes" : "No"}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="font-medium">Last Updated:</span>
//                           <span>{new Date(templatePreview.updatedAt).toLocaleDateString()}</span>
//                         </div>
//                       </div>

//                       {templatePreview.nodes && templatePreview.nodes.length > 0 && (
//                         <Accordion type="single" collapsible className="mt-4">
//                           <AccordionItem value="nodes">
//                             <AccordionTrigger>Workflow Nodes</AccordionTrigger>
//                             <AccordionContent>
//                               <div className="space-y-2">
//                                 {templatePreview.nodes.map((node: any, index: number) => (
//                                   <div key={node.id || index} className="rounded border p-2 text-sm">
//                                     <div className="font-medium">{node.name}</div>
//                                     <div className="text-xs text-muted-foreground">{node.type}</div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </AccordionContent>
//                           </AccordionItem>
//                         </Accordion>
//                       )}
//                     </CardContent>
//                     <CardFooter>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full"
//                         onClick={() =>
//                           window.open(`${process.env.NEXT_PUBLIC_N8N_URL}/workflow/${templatePreview.id}`, "_blank")
//                         }
//                       >
//                         <ExternalLink className="mr-2 h-4 w-4" />
//                         View in n8n
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 </div>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="advanced" className="space-y-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="requiredIntegrations" className="text-right">
//                 Required Integrations
//               </Label>
//               <Input
//                 ref={integrationsRef}
//                 id="requiredIntegrations"
//                 name="requiredIntegrations"
//                 value={localFormData.requiredIntegrations.join(", ")}
//                 onChange={(e) => {
//                   setLocalFormData((prev) => ({
//                     ...prev,
//                     requiredIntegrations: e.target.value
//                       .split(",")
//                       .map((item) => item.trim())
//                       .filter(Boolean),
//                   }))
//                 }}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 placeholder="Comma-separated list"
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="visualRepresentation" className="text-right">
//                 Visual Representation
//               </Label>
//               <Input
//                 ref={visualRepRef}
//                 id="visualRepresentation"
//                 name="visualRepresentation"
//                 value={localFormData.visualRepresentation}
//                 onChange={handleLocalInputChange}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 placeholder="URL to image or diagram"
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="expectedOutcomes" className="text-right">
//                 Expected Outcomes
//               </Label>
//               <Input
//                 ref={outcomesRef}
//                 id="expectedOutcomes"
//                 name="expectedOutcomes"
//                 value={localFormData.expectedOutcomes.join(", ")}
//                 onChange={(e) => {
//                   setLocalFormData((prev) => ({
//                     ...prev,
//                     expectedOutcomes: e.target.value
//                       .split(",")
//                       .map((item) => item.trim())
//                       .filter(Boolean),
//                   }))
//                 }}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 placeholder="Comma-separated list"
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="useCases" className="text-right">
//                 Use Cases
//               </Label>
//               <Input
//                 ref={useCasesRef}
//                 id="useCases"
//                 name="useCases"
//                 value={localFormData.useCases.join(", ")}
//                 onChange={(e) => {
//                   setLocalFormData((prev) => ({
//                     ...prev,
//                     useCases: e.target.value
//                       .split(",")
//                       .map((item) => item.trim())
//                       .filter(Boolean),
//                   }))
//                 }}
//                 onBlur={syncFormData}
//                 className="col-span-3"
//                 placeholder="Comma-separated list"
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label className="text-right">Active</Label>
//               <div className="col-span-3 flex items-center space-x-2">
//                 <Checkbox
//                   id="isActive"
//                   checked={localFormData.isActive}
//                   onCheckedChange={(checked) => {
//                     setLocalFormData((prev) => ({ ...prev, isActive: checked as boolean }))
//                     // For checkbox components, sync immediately
//                     setTimeout(() => {
//                       setFormData((prev) => ({ ...prev, isActive: checked as boolean }))
//                     }, 0)
//                   }}
//                 />
//                 <label
//                   htmlFor="isActive"
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   Template is active
//                 </label>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     )
//   }

//   // N8n Template Browser component
//   const N8nTemplateBrowser = () => {
//     const [searchN8n, setSearchN8n] = useState("")

//     const filteredTemplates = n8nTemplates.filter(
//       (template) =>
//         template.name.toLowerCase().includes(searchN8n.toLowerCase()) ||
//         (template.description && template.description.toLowerCase().includes(searchN8n.toLowerCase())),
//     )

//     return (
//       <div className="space-y-4">
//         <div className="flex items-center gap-2">
//           <Search className="h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search templates..."
//             value={searchN8n}
//             onChange={(e) => setSearchN8n(e.target.value)}
//             className="flex-1"
//           />
//         </div>

//         {isLoadingN8nTemplates ? (
//           <div className="space-y-2">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="flex items-center space-x-4 p-2 border rounded">
//                 <div className="space-y-2">
//                   <Skeleton className="h-4 w-[250px]" />
//                   <Skeleton className="h-4 w-[200px]" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredTemplates.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">No templates found. Try a different search term.</div>
//         ) : (
//           <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
//             {filteredTemplates.map((template) => (
//               <div
//                 key={template.id}
//                 className="flex justify-between items-center p-3 border rounded hover:bg-muted cursor-pointer"
//                 onClick={() => handleSelectN8nTemplate(template)}
//               >
//                 <div>
//                   <h4 className="font-medium">{template.name}</h4>
//                   {template.description && (
//                     <p className="text-sm text-muted-foreground line-clamp-1">{template.description}</p>
//                   )}
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <Plus className="h-4 w-4" />
//                   <span className="sr-only">Select</span>
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Create template
//   const handleCreateTemplate = async () => {
//     try {
//       // Parse the configurationSchema to ensure it's valid JSON
//       let configData = { ...formData }

//       try {
//         // Try to parse the string as JSON if it's a string
//         if (typeof configData.configurationSchema === "string") {
//           const parsedConfig = JSON.parse(configData.configurationSchema)
//           // If successful, update the form data with the parsed object
//           configData = {
//             ...configData,
//             configurationSchema: parsedConfig,
//           }
//         }
//       } catch (jsonError) {
//         // If it's not valid JSON, show an error
//         setError("Configuration Schema must be valid JSON")
//         return
//       }

//       const response = await fetch("/api/templates", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(configData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create template")
//       }

//       // Reset form and close dialog
//       setFormData({
//         name: "",
//         description: "",
//         category: "",
//         icon: "",
//         featured: false,
//         popular: false,
//         complexity: "MEDIUM",
//         estimatedSetupTime: 15,
//         requiredIntegrations: [],
//         configurationSchema: "{}",
//         n8nTemplateId: "",
//         visualRepresentation: "",
//         expectedOutcomes: [],
//         useCases: [],
//         isActive: true,
//       })
//       setIsCreateDialogOpen(false)
//       setVerificationStatus("idle")
//       setTemplatePreview(null)

//       // Refresh templates
//       fetchTemplates()

//       toast({
//         title: "Success",
//         description: "Template created successfully",
//       })
//     } catch (err) {
//       console.error("Error creating template:", err)
//       setError(err instanceof Error ? err.message : "An error occurred")
//     }
//   }

//   const handleUpdateTemplate = async () => {
//     if (!currentTemplate) return

//     try {
//       // Parse the configurationSchema to ensure it's valid JSON
//       let configData = { ...formData }

//       try {
//         // Try to parse the string as JSON if it's a string
//         if (typeof configData.configurationSchema === "string") {
//           const parsedConfig = JSON.parse(configData.configurationSchema)
//           // If successful, update the form data with the parsed object
//           configData = {
//             ...configData,
//             configurationSchema: parsedConfig,
//           }
//         }
//       } catch (jsonError) {
//         // If it's not valid JSON, show an error
//         setError("Configuration Schema must be valid JSON")
//         return
//       }

//       const response = await fetch(`/api/templates/${currentTemplate.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(configData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to update template")
//       }

//       // Reset and close dialog
//       setCurrentTemplate(null)
//       setIsEditDialogOpen(false)
//       setVerificationStatus("idle")
//       setTemplatePreview(null)

//       // Refresh templates
//       fetchTemplates()

//       toast({
//         title: "Success",
//         description: "Template updated successfully",
//       })
//     } catch (err) {
//       console.error("Error updating template:", err)
//       setError(err instanceof Error ? err.message : "An error occurred")
//     }
//   }

//   // Delete template
//   const handleDeleteTemplate = async (id: string) => {
//     try {
//       const response = await fetch(`/api/templates/${id}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to delete template")
//       }

//       // Refresh templates
//       fetchTemplates()

//       toast({
//         title: "Success",
//         description: "Template deleted successfully",
//       })
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred")
//     }
//   }

//   // Verify all templates
//   const verifyAllTemplates = async () => {
//     toast({
//       title: "Verification started",
//       description: "Verifying all templates with n8n. This may take a while.",
//     })

//     let successCount = 0
//     let failCount = 0

//     for (const template of templates) {
//       if (template.n8nTemplateId) {
//         try {
//           await verifyN8nTemplate(template.n8nTemplateId)
//           successCount++
//         } catch (err) {
//           failCount++
//         }
//       }
//     }

//     toast({
//       title: "Verification complete",
//       description: `${successCount} templates verified successfully. ${failCount} templates failed verification.`,
//     })

//     // Refresh templates
//     fetchTemplates()
//   }

//   const openEditDialog = (template: Template) => {
//     setCurrentTemplate(template)
//     setFormData({
//       name: template.name,
//       description: template.description,
//       category: template.category,
//       icon: template.icon || "",
//       featured: template.featured,
//       popular: template.popular,
//       complexity: template.complexity,
//       estimatedSetupTime: template.estimatedSetupTime,
//       requiredIntegrations: template.requiredIntegrations,
//       configurationSchema: JSON.stringify(template.configurationSchema, null, 2),
//       n8nTemplateId: template.n8nTemplateId || "",
//       visualRepresentation: template.visualRepresentation || "",
//       expectedOutcomes: template.expectedOutcomes,
//       useCases: template.useCases,
//       isActive: template.isActive,
//     })
//     setIsEditDialogOpen(true)
//     setVerificationStatus(template.isVerified ? "success" : "idle")

//     // If template has n8n ID, fetch preview
//     if (template.n8nTemplateId) {
//       fetchN8nTemplateDetails(template.n8nTemplateId)
//     } else {
//       setTemplatePreview(null)
//     }
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Workflow Templates</h1>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={verifyAllTemplates}>
//             <CheckCircle2 className="mr-2 h-4 w-4" />
//             Verify All Templates
//           </Button>
//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" /> Add Template
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>Create New Template</DialogTitle>
//                 <DialogDescription>Fill in the details to create a new workflow template.</DialogDescription>
//               </DialogHeader>
//               <TemplateForm />
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleCreateTemplate}>Create Template</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Filters</CardTitle>
//           <CardDescription>Filter templates by various criteria</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <Label htmlFor="search">Search</Label>
//               <div className="flex mt-1">
//                 <Input
//                   id="search"
//                   placeholder="Search templates..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="category">Category</Label>
//               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                 <SelectTrigger className="w-full mt-1">
//                   <SelectValue placeholder="All categories" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All categories</SelectItem>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category || "none"}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="complexity">Complexity</Label>
//               <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
//                 <SelectTrigger className="w-full mt-1">
//                   <SelectValue placeholder="Any complexity" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="any">Any complexity</SelectItem>
//                   <SelectItem value="SIMPLE">Simple</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="COMPLEX">Complex</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex flex-col">
//               <Label className="mb-1">Flags</Label>
//               <div className="flex space-x-4 mt-1">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="featured-filter"
//                     checked={showFeatured === true}
//                     onCheckedChange={(checked) => {
//                       if (checked === true) setShowFeatured(true)
//                       else if (showFeatured === true) setShowFeatured(undefined)
//                       else setShowFeatured(true)
//                     }}
//                   />
//                   <label htmlFor="featured-filter" className="text-sm">
//                     Featured
//                   </label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="popular-filter"
//                     checked={showPopular === true}
//                     onCheckedChange={(checked) => {
//                       if (checked === true) setShowPopular(true)
//                       else if (showPopular === true) setShowPopular(undefined)
//                       else setShowPopular(true)
//                     }}
//                   />
//                   <label htmlFor="popular-filter" className="text-sm">
//                     Popular
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button variant="outline" onClick={resetFilters}>
//             Reset Filters
//           </Button>
//           <Button onClick={applyFilters}>
//             <Filter className="mr-2 h-4 w-4" /> Apply Filters
//           </Button>
//         </CardFooter>
//       </Card>

//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Complexity</TableHead>
//                 <TableHead>n8n Status</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Usage</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8">
//                     Loading templates...
//                   </TableCell>
//                 </TableRow>
//               ) : templates.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8">
//                     No templates found. Try adjusting your filters or create a new template.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 templates.map((template) => (
//                   <TableRow key={template.id}>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center">
//                         <div>
//                           {template.name}
//                           <div className="flex mt-1 space-x-1">
//                             {template.featured && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Star className="h-3 w-3 mr-1 text-yellow-500" />
//                                 Featured
//                               </Badge>
//                             )}
//                             {template.popular && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Award className="h-3 w-3 mr-1 text-purple-500" />
//                                 Popular
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>{template.category}</TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           template.complexity === "SIMPLE"
//                             ? "secondary"
//                             : template.complexity === "MEDIUM"
//                               ? "default"
//                               : "destructive"
//                         }
//                       >
//                         {template.complexity.toLowerCase()}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {template.n8nTemplateId ? (
//                         template.isVerified ? (
//                           <Badge variant="success" className="flex items-center gap-1">
//                             <Check className="h-3 w-3" />
//                             Verified
//                           </Badge>
//                         ) : (
//                           <Badge variant="outline" className="flex items-center gap-1">
//                             <AlertCircle className="h-3 w-3" />
//                             Unverified
//                           </Badge>
//                         )
//                       ) : (
//                         <Badge variant="outline" className="text-muted-foreground">
//                           No n8n ID
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={template.isActive ? "success" : "outline"}>
//                         {template.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{template._count?.userWorkflows || 0} instances</TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end space-x-2">
//                         <Button variant="outline" size="sm" onClick={() => openEditDialog(template)}>
//                           <Edit className="h-4 w-4" />
//                           <span className="sr-only">Edit</span>
//                         </Button>

//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="outline" size="sm">
//                               <Trash2 className="h-4 w-4 text-red-500" />
//                               <span className="sr-only">Delete</span>
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 {template._count && template._count.userWorkflows > 0 ? (
//                                   <>
//                                     This template is currently in use by {template._count.userWorkflows} workflows. It
//                                     will be marked as inactive instead of being deleted.
//                                   </>
//                                 ) : (
//                                   "This action cannot be undone. This will permanently delete the template."
//                                 )}
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDeleteTemplate(template.id)}
//                                 className="bg-red-600 hover:bg-red-700"
//                               >
//                                 {template._count && template._count.userWorkflows > 0 ? "Deactivate" : "Delete"}
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//         <CardFooter className="flex items-center justify-between border-t p-4">
//           <div className="text-sm text-muted-foreground">
//             Showing {pagination.offset + 1}-{Math.min(pagination.offset + templates.length, pagination.total)} of{" "}
//             {pagination.total} templates
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={pagination.offset === 0}>
//               <ChevronLeft className="h-4 w-4" />
//               <span className="sr-only">Previous Page</span>
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleNextPage}
//               disabled={pagination.offset + pagination.limit >= pagination.total}
//             >
//               <ChevronRight className="h-4 w-4" />
//               <span className="sr-only">Next Page</span>
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Template</DialogTitle>
//             <DialogDescription>Update the details of this workflow template.</DialogDescription>
//           </DialogHeader>
//           <TemplateForm />
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdateTemplate}>Update Template</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* n8n Template Browser Dialog */}
//       <Dialog open={isN8nBrowserOpen} onOpenChange={setIsN8nBrowserOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Browse n8n Templates</DialogTitle>
//             <DialogDescription>Select a template from your n8n instance.</DialogDescription>
//           </DialogHeader>
//           <N8nTemplateBrowser />
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsN8nBrowserOpen(false)}>
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Filter,
  Star,
  Award,
  Check,
  X,
  RefreshCw,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  FileJson,
  Zap,
  Sparkles,
  Database,
  Settings,
} from "lucide-react"

// Types
type Template = {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  featured: boolean
  popular: boolean
  complexity: "SIMPLE" | "MEDIUM" | "COMPLEX"
  estimatedSetupTime: number
  requiredIntegrations: string[]
  configurationSchema: any
  n8nTemplateId?: string
  visualRepresentation?: string
  expectedOutcomes: string[]
  useCases: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastVerified?: string
  isVerified?: boolean
  _count?: {
    userWorkflows: number
  }
  userWorkflows?: string[]
}

type N8nTemplate = {
  id: string
  name: string
  description?: string
  nodes: any[]
  connections: any
  active: boolean
  createdAt: string
  updatedAt: string
}

type PaginationInfo = {
  total: number
  limit: number
  offset: number
}

type VerificationStatus = "idle" | "loading" | "success" | "error"

 export default function TemplatesAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [templates, setTemplates] = useState<Template[]>([])
  const [n8nTemplates, setN8nTemplates] = useState<N8nTemplate[]>([])
  const [isLoadingN8nTemplates, setIsLoadingN8nTemplates] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [showFeatured, setShowFeatured] = useState<boolean | undefined>(undefined)
  const [showPopular, setShowPopular] = useState<boolean | undefined>(undefined)
  const [selectedComplexity, setSelectedComplexity] = useState<string>("")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")
  const [selectedN8nTemplate, setSelectedN8nTemplate] = useState<N8nTemplate | null>(null)
  const [templatePreview, setTemplatePreview] = useState<any>(null)
  const [isTemplatePreviewLoading, setIsTemplatePreviewLoading] = useState(false)

  // Template form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isN8nBrowserOpen, setIsN8nBrowserOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [isTestingConfig, setIsTestingConfig] = useState(false) // Moved here to be top-level
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    icon: "",
    featured: false,
    popular: false,
    complexity: "MEDIUM" as "SIMPLE" | "MEDIUM" | "COMPLEX",
    estimatedSetupTime: 15,
    requiredIntegrations: [] as string[],
    configurationSchema: "{}",
    n8nTemplateId: "",
    visualRepresentation: "",
    expectedOutcomes: [] as string[],
    useCases: [] as string[],
    isActive: true,
  })

  // Categories
  const categories = [
    "MARKETING",
    "SALES",
    "CUSTOMER_SUPPORT",
    "DATA_PROCESSING",
    "DOCUMENT_MANAGEMENT",
    "SOCIAL_MEDIA",
    "COMMUNICATION",
    "INTEGRATION",
    "UTILITY",
    "CUSTOM",
  ]

  // Form validation
  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name.trim(),
      formData.description.trim(),
      formData.category.trim(),
      formData.n8nTemplateId.trim(),
      formData.configurationSchema.trim(),
    ]

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every((field) => field.length > 0)

    // Check if configuration schema is valid JSON
    let isValidJson = true
    try {
      JSON.parse(formData.configurationSchema)
    } catch {
      isValidJson = false
    }

    return allFieldsFilled && isValidJson
  }, [formData])

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query params
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("category", selectedCategory)
      if (showFeatured !== undefined) params.append("featured", String(showFeatured))
      if (showPopular !== undefined) params.append("popular", String(showPopular))
      if (selectedComplexity) params.append("complexity", selectedComplexity)
      params.append("limit", String(pagination.limit))
      params.append("offset", String(pagination.offset))

      const response = await fetch(`/api/templates?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setTemplates(Array.isArray(data.templates) ? data.templates : [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedCategory, showFeatured, showPopular, selectedComplexity, pagination.limit, pagination.offset])

  // Fetch n8n templates
  const fetchN8nTemplates = useCallback(async () => {
    setIsLoadingN8nTemplates(true)
    try {
      const response = await fetch("/api/n8n/templates")
      if (!response.ok) {
        throw new Error(`Error fetching n8n templates: ${response.statusText}`)
      }
      const data = await response.json()
      // Ensure we always set an array
      setN8nTemplates(Array.isArray(data.templates) ? data.templates : [])
    } catch (err) {
      setN8nTemplates([])
      toast({
        title: "Error fetching n8n templates",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoadingN8nTemplates(false)
    }
  }, [])

  // Fetch n8n template details
  const fetchN8nTemplateDetails = useCallback(async (templateId: string) => {
    setIsTemplatePreviewLoading(true)
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}`)
      if (!response.ok) {
        throw new Error(`Error fetching template details: ${response.statusText}`)
      }
      const data = await response.json()
      setTemplatePreview(data)
      return data
    } catch (err) {
      toast({
        title: "Error fetching template details",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    } finally {
      setIsTemplatePreviewLoading(false)
    }
  }, [])

  // Verify n8n template
  const verifyN8nTemplate = useCallback(async (templateId: string) => {
    setVerificationStatus("loading")
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}/verify`)
      if (!response.ok) {
        throw new Error(`Template verification failed: ${response.statusText}`)
      }
      const data = await response.json()
      setVerificationStatus("success")
      toast({
        title: "Template verified",
        description: "The n8n template exists and is valid.",
        variant: "default",
      })
      return data
    } catch (err) {
      setVerificationStatus("error")
      toast({
        title: "Template verification failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Generate configuration schema from n8n template
  const generateSchemaFromTemplate = useCallback(async (templateId: string) => {
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}/schema`)
      if (!response.ok) {
        throw new Error(`Failed to generate schema: ${response.statusText}`)
      }
      const data = await response.json()
      return data.schema
    } catch (err) {
      toast({
        title: "Error generating schema",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Test template configuration
  const testTemplateConfiguration = useCallback(async (templateId: string, configuration: any) => {
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configuration }),
      })

      if (!response.ok) {
        throw new Error(`Configuration test failed: ${response.statusText}`)
      }

      const data = await response.json()

      toast({
        title: "Configuration test successful",
        description: "The template configuration is valid and works with this n8n template.",
        variant: "default",
      })

      return data
    } catch (err) {
      toast({
        title: "Configuration test failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Apply filters
  const applyFilters = useCallback(() => {
    setPagination((prev) => ({ ...prev, offset: 0 })) // Reset to first page
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedCategory("")
    setShowFeatured(undefined)
    setShowPopular(undefined)
    setSelectedComplexity("")
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }, [])

  // Handle pagination
  const handlePreviousPage = useCallback(() => {
    if (pagination.offset - pagination.limit >= 0) {
      setPagination((prev) => ({ ...prev, offset: prev.offset - prev.limit }))
    }
  }, [pagination.offset, pagination.limit])

  const handleNextPage = useCallback(() => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
    }
  }, [pagination.offset, pagination.limit, pagination.total])

  // Form handlers with proper comma handling
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCheckboxChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }, [])

  // Fixed comma-separated input handler
  const handleCommaSeparatedInput = useCallback((name: string, value: string) => {
    // Allow typing commas and handle them properly
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item, index, arr) => {
        // Keep empty strings if they're not at the end (user is still typing)
        if (index === arr.length - 1) return item.length > 0
        return true
      })

    setFormData((prev) => ({ ...prev, [name]: arrayValue }))
  }, [])

  // Handle n8n template selection
  const handleSelectN8nTemplate = useCallback(
    async (template: N8nTemplate) => {
      setSelectedN8nTemplate(template)

      // Fetch template details for preview
      const details = await fetchN8nTemplateDetails(template.id)

      // Generate schema from template
      const schema = await generateSchemaFromTemplate(template.id)

      if (schema) {
        setFormData((prev) => ({
          ...prev,
          n8nTemplateId: template.id,
          name: prev.name || template.name,
          description: prev.description || template.description || "",
          configurationSchema: JSON.stringify(schema, null, 2),
        }))
      }

      setIsN8nBrowserOpen(false)
    },
    [fetchN8nTemplateDetails, generateSchemaFromTemplate],
  )

  // Template form component with improved state management
  const TemplateForm = React.memo(() => {
    // Handle n8n template verification
    const handleVerifyTemplate = useCallback(async () => {
      if (!formData.n8nTemplateId) {
        toast({
          title: "Verification failed",
          description: "Please enter an n8n template ID",
          variant: "destructive",
        })
        return
      }

      const result = await verifyN8nTemplate(formData.n8nTemplateId)
      if (result) {
        // Fetch template details for preview
        await fetchN8nTemplateDetails(formData.n8nTemplateId)
      }
    }, [formData.n8nTemplateId, verifyN8nTemplate, fetchN8nTemplateDetails])

    // Handle configuration schema generation
    const handleGenerateSchema = useCallback(async () => {
      if (!formData.n8nTemplateId) {
        toast({
          title: "Schema generation failed",
          description: "Please enter an n8n template ID",
          variant: "destructive",
        })
        return
      }

      const schema = await generateSchemaFromTemplate(formData.n8nTemplateId)
      if (schema) {
        setFormData((prev) => ({
          ...prev,
          configurationSchema: JSON.stringify(schema, null, 2),
        }))

        toast({
          title: "Schema generated",
          description: "Configuration schema has been generated from the n8n template",
          variant: "default",
        })
      }
    }, [formData.n8nTemplateId, generateSchemaFromTemplate])

    // Handle configuration testing
    const handleTestConfiguration = useCallback(async () => {
      if (!formData.n8nTemplateId) {
        toast({
          title: "Test failed",
          description: "Please enter an n8n template ID",
          variant: "destructive",
        })
        return
      }

      let configObject
      try {
        configObject = JSON.parse(formData.configurationSchema)
      } catch (err) {
        toast({
          title: "Invalid JSON",
          description: "The configuration schema is not valid JSON",
          variant: "destructive",
        })
        return
      }

      setIsTestingConfig(true)
      await testTemplateConfiguration(formData.n8nTemplateId, configObject)
      setIsTestingConfig(false)
    }, [formData.n8nTemplateId, formData.configurationSchema, testTemplateConfiguration])

    // Open n8n template browser
    const handleOpenN8nBrowser = useCallback(() => {
      fetchN8nTemplates()
      setIsN8nBrowserOpen(true)
    }, [fetchN8nTemplates])

    return (
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="n8n" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              n8n Integration
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Enter template name"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right font-medium pt-2">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Describe what this template does..."
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right font-medium">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right font-medium">
                  Icon
                </Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Icon name or URL"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Options</Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Mark as featured
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => handleCheckboxChange("popular", checked as boolean)}
                    />
                    <Label htmlFor="popular" className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      Mark as popular
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="complexity" className="text-right font-medium">
                  Complexity
                </Label>
                <Select value={formData.complexity} onValueChange={(value) => handleSelectChange("complexity", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIMPLE">🟢 Simple</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                    <SelectItem value="COMPLEX">🔴 Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedSetupTime" className="text-right font-medium">
                  Setup Time (min)
                </Label>
                <Input
                  id="estimatedSetupTime"
                  name="estimatedSetupTime"
                  type="number"
                  min="1"
                  value={formData.estimatedSetupTime}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="n8n" className="space-y-6 mt-6">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">n8n Integration</AlertTitle>
              <AlertDescription className="text-blue-700">
                Connect this template to an n8n workflow. You can either enter a template ID manually or browse
                available templates.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="n8nTemplateId" className="text-right font-medium">
                  n8n Template ID *
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="n8nTemplateId"
                    name="n8nTemplateId"
                    value={formData.n8nTemplateId}
                    onChange={handleInputChange}
                    className="flex-1"
                    placeholder="Enter n8n template ID"
                    required
                  />
                  <Button type="button" variant="outline" onClick={handleOpenN8nBrowser} className="whitespace-nowrap">
                    <Search className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label className="font-medium">Template Status</Label>
                </div>
                <div className="col-span-3 flex items-center gap-4">
                  {verificationStatus === "idle" && (
                    <Button type="button" variant="outline" onClick={handleVerifyTemplate}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verify Template
                    </Button>
                  )}

                  {verificationStatus === "loading" && (
                    <Button type="button" variant="outline" disabled>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </Button>
                  )}

                  {verificationStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Template verified successfully</span>
                    </div>
                  )}

                  {verificationStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                      <X className="h-5 w-5" />
                      <span className="font-medium">Template verification failed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="configurationSchema" className="text-right font-medium pt-2">
                  Config Schema *
                </Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSchema}
                      disabled={!formData.n8nTemplateId || verificationStatus !== "success"}
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      Generate Schema
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTestConfiguration}
                      disabled={!formData.n8nTemplateId || verificationStatus !== "success" || isTestingConfig}
                    >
                      {isTestingConfig ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      Test Configuration
                    </Button>
                  </div>
                  <Textarea
                    id="configurationSchema"
                    name="configurationSchema"
                    value={formData.configurationSchema}
                    onChange={handleInputChange}
                    className="font-mono text-sm min-h-[200px]"
                    placeholder="JSON Schema for configuration..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    JSON Schema that defines the configuration options for this template.
                  </p>
                </div>
              </div>

              {templatePreview && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-right">
                    <Label className="font-medium">Template Preview</Label>
                  </div>
                  <div className="col-span-3">
                    <Card className="border-2 border-dashed border-muted-foreground/25">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-600" />
                          {templatePreview.name}
                        </CardTitle>
                        {templatePreview.description && (
                          <CardDescription>{templatePreview.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Nodes:</span>
                            <Badge variant="secondary">{templatePreview.nodes?.length || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Active:</span>
                            <Badge variant={templatePreview.active ? "default" : "secondary"}>
                              {templatePreview.active ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span className="font-medium">Last Updated:</span>
                            <span>{new Date(templatePreview.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {templatePreview.nodes && templatePreview.nodes.length > 0 && (
                          <Accordion type="single" collapsible className="mt-4">
                            <AccordionItem value="nodes">
                              <AccordionTrigger>Workflow Nodes ({templatePreview.nodes.length})</AccordionTrigger>
                              <AccordionContent>
                                <div className="grid gap-2">
                                  {templatePreview.nodes.map((node: any, index: number) => (
                                    <div key={node.id || index} className="rounded border p-3 text-sm bg-muted/30">
                                      <div className="font-medium">{node.name}</div>
                                      <div className="text-xs text-muted-foreground">{node.type}</div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            window.open(`${process.env.NEXT_PUBLIC_N8N_URL}/workflow/${templatePreview.id}`, "_blank")
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View in n8n
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requiredIntegrations" className="text-right font-medium">
                  Required Integrations
                </Label>
                <Input
                  id="requiredIntegrations"
                  value={formData.requiredIntegrations.join(", ")}
                  onChange={(e) => handleCommaSeparatedInput("requiredIntegrations", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Slack, Google Sheets, Webhook"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visualRepresentation" className="text-right font-medium">
                  Visual Representation
                </Label>
                <Input
                  id="visualRepresentation"
                  name="visualRepresentation"
                  value={formData.visualRepresentation}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="URL to image or diagram"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expectedOutcomes" className="text-right font-medium">
                  Expected Outcomes
                </Label>
                <Input
                  id="expectedOutcomes"
                  value={formData.expectedOutcomes.join(", ")}
                  onChange={(e) => handleCommaSeparatedInput("expectedOutcomes", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Automated reports, Data sync, Notifications"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="useCases" className="text-right font-medium">
                  Use Cases
                </Label>
                <Input
                  id="useCases"
                  value={formData.useCases.join(", ")}
                  onChange={(e) => handleCommaSeparatedInput("useCases", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Lead management, Customer onboarding, Data backup"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleCheckboxChange("isActive", checked as boolean)}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Template is active and available for use
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  })

  // N8n Template Browser component with fixed filter
  const N8nTemplateBrowser = React.memo(() => {
    const [searchN8n, setSearchN8n] = useState("")

    const filteredTemplates = useMemo(() => {
      if (!Array.isArray(n8nTemplates)) return []

      return n8nTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchN8n.toLowerCase()) ||
          (template.description && template.description.toLowerCase().includes(searchN8n.toLowerCase())),
      )
    }, [searchN8n, n8nTemplates])

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchN8n}
            onChange={(e) => setSearchN8n(e.target.value)}
            className="flex-1"
          />
        </div>

        {isLoadingN8nTemplates ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm">Try a different search term or check your n8n connection.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectN8nTemplate(template)}
              >
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.nodes?.length || 0} nodes
                    </Badge>
                    <Badge variant={template.active ? "default" : "secondary"} className="text-xs">
                      {template.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Select</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  })

  // Create template
  const handleCreateTemplate = useCallback(async () => {
    if (!isFormValid) {
      toast({
        title: "Form validation failed",
        description: "Please fill in all required fields with valid data.",
        variant: "destructive",
      })
      return
    }

    try {
      // Parse the configurationSchema to ensure it's valid JSON
      let configData = { ...formData }

      try {
        // Try to parse the string as JSON if it's a string
        if (typeof configData.configurationSchema === "string") {
          const parsedConfig = JSON.parse(configData.configurationSchema)
          // If successful, update the form data with the parsed object
          configData = {
            ...configData,
            configurationSchema: parsedConfig,
          }
        }
      } catch (jsonError) {
        // If it's not valid JSON, show an error
        setError("Configuration Schema must be valid JSON")
        return
      }

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create template")
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        category: "",
        icon: "",
        featured: false,
        popular: false,
        complexity: "MEDIUM",
        estimatedSetupTime: 15,
        requiredIntegrations: [],
        configurationSchema: "{}",
        n8nTemplateId: "",
        visualRepresentation: "",
        expectedOutcomes: [],
        useCases: [],
        isActive: true,
      })
      setIsCreateDialogOpen(false)
      setActiveTab("basic")
      setVerificationStatus("idle")
      setTemplatePreview(null)

      // Refresh templates
      fetchTemplates()

      toast({
        title: "Success",
        description: "Template created successfully",
      })
    } catch (err) {
      console.error("Error creating template:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [formData, isFormValid, fetchTemplates])

  const handleUpdateTemplate = useCallback(async () => {
    if (!currentTemplate || !isFormValid) {
      toast({
        title: "Form validation failed",
        description: "Please fill in all required fields with valid data.",
        variant: "destructive",
      })
      return
    }

    try {
      // Parse the configurationSchema to ensure it's valid JSON
      let configData = { ...formData }

      try {
        // Try to parse the string as JSON if it's a string
        if (typeof configData.configurationSchema === "string") {
          const parsedConfig = JSON.parse(configData.configurationSchema)
          // If successful, update the form data with the parsed object
          configData = {
            ...configData,
            configurationSchema: parsedConfig,
          }
        }
      } catch (jsonError) {
        // If it's not valid JSON, show an error
        setError("Configuration Schema must be valid JSON")
        return
      }

      const response = await fetch(`/api/templates/${currentTemplate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update template")
      }

      // Reset and close dialog
      setCurrentTemplate(null)
      setIsEditDialogOpen(false)
      setActiveTab("basic")
      setVerificationStatus("idle")
      setTemplatePreview(null)

      // Refresh templates
      fetchTemplates()

      toast({
        title: "Success",
        description: "Template updated successfully",
      })
    } catch (err) {
      console.error("Error updating template:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [currentTemplate, formData, isFormValid, fetchTemplates])

  // Delete template
  const handleDeleteTemplate = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete template")
        }

        // Refresh templates
        fetchTemplates()

        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    },
    [fetchTemplates],
  )

  // Verify all templates
  const verifyAllTemplates = useCallback(async () => {
    toast({
      title: "Verification started",
      description: "Verifying all templates with n8n. This may take a while.",
    })

    let successCount = 0
    let failCount = 0

    for (const template of templates) {
      if (template.n8nTemplateId) {
        try {
          await verifyN8nTemplate(template.n8nTemplateId)
          successCount++
        } catch (err) {
          failCount++
        }
      }
    }

    toast({
      title: "Verification complete",
      description: `${successCount} templates verified successfully. ${failCount} templates failed verification.`,
    })

    // Refresh templates
    fetchTemplates()
  }, [templates, verifyN8nTemplate, fetchTemplates])

  const openEditDialog = useCallback(
    (template: Template) => {
      setCurrentTemplate(template)
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        icon: template.icon || "",
        featured: template.featured,
        popular: template.popular,
        complexity: template.complexity,
        estimatedSetupTime: template.estimatedSetupTime,
        requiredIntegrations: template.requiredIntegrations,
        configurationSchema: JSON.stringify(template.configurationSchema, null, 2),
        n8nTemplateId: template.n8nTemplateId || "",
        visualRepresentation: template.visualRepresentation || "",
        expectedOutcomes: template.expectedOutcomes,
        useCases: template.useCases,
        isActive: template.isActive,
      })
      setIsEditDialogOpen(true)
      setActiveTab("basic")
      setVerificationStatus(template.isVerified ? "success" : "idle")

      // If template has n8n ID, fetch preview
      if (template.n8nTemplateId) {
        fetchN8nTemplateDetails(template.n8nTemplateId)
      } else {
        setTemplatePreview(null)
      }
    },
    [fetchN8nTemplateDetails],
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Workflow Templates
          </h1>
          <p className="text-muted-foreground mt-2">Manage and configure your n8n workflow templates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={verifyAllTemplates} className="shadow-sm">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verify All Templates
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Template</DialogTitle>
                <DialogDescription>Fill in the details to create a new workflow template.</DialogDescription>
              </DialogHeader>
              <TemplateForm />
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!isFormValid}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter templates by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium">
                Search
              </Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complexity" className="text-sm font-medium">
                Complexity
              </Label>
              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Any complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any complexity</SelectItem>
                  <SelectItem value="SIMPLE">🟢 Simple</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="COMPLEX">🔴 Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label className="mb-1 text-sm font-medium">Flags</Label>
              <div className="flex space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured-filter"
                    checked={showFeatured === true}
                    onCheckedChange={(checked) => {
                      if (checked === true) setShowFeatured(true)
                      else if (showFeatured === true) setShowFeatured(undefined)
                      else setShowFeatured(true)
                    }}
                  />
                  <label htmlFor="featured-filter" className="text-sm">
                    Featured
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular-filter"
                    checked={showPopular === true}
                    onCheckedChange={(checked) => {
                      if (checked === true) setShowPopular(true)
                      else if (showPopular === true) setShowPopular(undefined)
                      else setShowPopular(true)
                    }}
                  />
                  <label htmlFor="popular-filter" className="text-sm">
                    Popular
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button
            onClick={applyFilters}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </CardFooter>
      </Card>

      {/* Templates Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Complexity</TableHead>
                <TableHead className="font-semibold">n8n Status</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Usage</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading templates...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground">No templates found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or create a new template.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="flex mt-1 space-x-1">
                            {template.featured && (
                              <Badge
                                variant="outline"
                                className="text-xs border-yellow-300 text-yellow-700 bg-yellow-50"
                              >
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                Featured
                              </Badge>
                            )}
                            {template.popular && (
                              <Badge
                                variant="outline"
                                className="text-xs border-purple-300 text-purple-700 bg-purple-50"
                              >
                                <Award className="h-3 w-3 mr-1 text-purple-500" />
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {template.category.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          template.complexity === "SIMPLE"
                            ? "secondary"
                            : template.complexity === "MEDIUM"
                              ? "default"
                              : "destructive"
                        }
                        className="font-medium"
                      >
                        {template.complexity === "SIMPLE" && "🟢"}
                        {template.complexity === "MEDIUM" && "🟡"}
                        {template.complexity === "COMPLEX" && "🔴"}
                        {" " + template.complexity.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {template.n8nTemplateId ? (
                        template.isVerified ? (
                          <Badge
                            variant="default"
                            className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300"
                          >
                            <Check className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 border-orange-300 text-orange-700 bg-orange-50"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Unverified
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-muted">
                          No n8n ID
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={template.isActive ? "default" : "outline"}
                        className={template.isActive ? "bg-green-100 text-green-800 border-green-300" : ""}
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {template._count?.userWorkflows || 0}
                        </Badge>
                        <span className="text-sm text-muted-foreground">instances</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(template)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="hover:bg-red-50">
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {template._count && template._count.userWorkflows > 0 ? (
                                  <>
                                    This template is currently in use by {template._count.userWorkflows} workflows. It
                                    will be marked as inactive instead of being deleted.
                                  </>
                                ) : (
                                  "This action cannot be undone. This will permanently delete the template."
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {template._count && template._count.userWorkflows > 0 ? "Deactivate" : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.offset + 1}-{Math.min(pagination.offset + templates.length, pagination.total)} of{" "}
            {pagination.total} templates
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={pagination.offset === 0}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pagination.offset + pagination.limit >= pagination.total}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Template</DialogTitle>
            <DialogDescription>Update the details of this workflow template.</DialogDescription>
          </DialogHeader>
          <TemplateForm />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTemplate}
              disabled={!isFormValid}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* n8n Template Browser Dialog */}
      <Dialog open={isN8nBrowserOpen} onOpenChange={setIsN8nBrowserOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              Browse n8n Templates
            </DialogTitle>
            <DialogDescription>
              Select a template from your n8n instance to integrate with this workflow template.
            </DialogDescription>
          </DialogHeader>
          <N8nTemplateBrowser />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsN8nBrowserOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

