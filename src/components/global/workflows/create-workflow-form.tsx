// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { Check, Loader2 } from "lucide-react"
// import { WorkflowCategory, type WorkflowComplexity } from "@prisma/client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { toast } from "@/hooks/use-toast"
// import { Skeleton } from "@/components/ui/skeleton"
// import { cn } from "@/lib/utils"

// // Template type definition
// interface WorkflowTemplate {
//   id: string
//   name: string
//   description: string
//   category: WorkflowCategory
//   icon: string | null
//   complexity: WorkflowComplexity
//   estimatedSetupTime: number
//   featured: boolean
//   popular: boolean
//   userWorkflows: string[]
// }

// interface TemplateGroupProps {
//   title: string
//   templates: WorkflowTemplate[]
//   selectedTemplateId: string | null
//   onSelectTemplate: (templateId: string) => void
// }

// interface CreateWorkflowFormProps {
//   redirectAfterCreate?: boolean
//   defaultTemplateId?: string
//   preSelectedCategory?: WorkflowCategory
// }

// function TemplateGroup({ title, templates, selectedTemplateId, onSelectTemplate }: TemplateGroupProps) {
//   if (templates.length === 0) return null

//   return (
//     <div className="space-y-3">
//       <h3 className="text-lg font-medium">{title}</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {templates.map((template) => (
//           <Card
//             key={template.id}
//             className={cn(
//               "cursor-pointer transition-all hover:border-primary",
//               selectedTemplateId === template.id ? "border-2 border-primary" : "",
//             )}
//             onClick={() => onSelectTemplate(template.id)}
//           >
//             <CardContent className="p-4">
//               <div className="flex justify-between items-start">
//                 <div className="space-y-1">
//                   <h4 className="font-medium">{template.name}</h4>
//                   <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
//                 </div>
//                 {template.icon && (
//                   <div className="text-muted-foreground">
//                     <span className="text-xl">{template.icon}</span>
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
//                 <span>Est. setup: {template.estimatedSetupTime} min</span>
//                 <span className="capitalize">{template.complexity.toLowerCase()}</span>
//               </div>
//             </CardContent>
//             {selectedTemplateId === template.id && (
//               <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
//                 <Check className="h-3 w-3 text-primary-foreground" />
//               </div>
//             )}
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

// export function CreateWorkflowForm({
//   redirectAfterCreate = true,
//   defaultTemplateId,
//   preSelectedCategory,
// }: CreateWorkflowFormProps) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group


//   // State
//   const [isLoading, setIsLoading] = useState(false)
//   const [loadingTemplates, setLoadingTemplates] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory | "ALL">(preSelectedCategory || "ALL")
//   const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(defaultTemplateId || null)
//   const [workflowName, setWorkflowName] = useState("")

//   // Fetch templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoadingTemplates(true)
//       try {
//         const params = new URLSearchParams()
//         if (selectedCategory !== "ALL") {
//           params.append("category", selectedCategory)
//         }

//         const response = await fetch(`/api/templates?${params.toString()}`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch templates")
//         }

//         const data = await response.json()
//         setTemplates(data.templates)

//         // If we have a defaultTemplateId, make sure it's selected
//         if (defaultTemplateId && !selectedTemplateId) {
//           setSelectedTemplateId(defaultTemplateId)

//           // Find the template to get its name for the workflow name suggestion
//           const template = data.templates.find((t: WorkflowTemplate) => t.id === defaultTemplateId)
//           if (template) {
//             setWorkflowName(`My ${template.name}`)
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching templates:", error)
//         toast({
//           title: "Error fetching templates",
//           description: "Failed to load workflow templates. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoadingTemplates(false)
//       }
//     }

//     fetchTemplates()
//   }, [selectedCategory, defaultTemplateId, selectedTemplateId])

//   // Set a default name when a template is selected
//   useEffect(() => {
//     if (selectedTemplateId && !workflowName) {
//       const template = templates.find((t) => t.id === selectedTemplateId)
//       if (template) {
//         setWorkflowName(`My ${template.name}`)
//       }
//     }
//   }, [selectedTemplateId, templates, workflowName])

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedTemplateId) {
//       toast({
//         title: "Select a template",
//         description: "Please select a workflow template to continue.",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!workflowName.trim()) {
//       toast({
//         title: "Enter a name",
//         description: "Please provide a name for your workflow.",
//         variant: "destructive",
//       })
//       return
//     }

//     setSubmitting(true)
//     try {
//       const response = await fetch("/api/workflows", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           templateId: selectedTemplateId,
//           name: workflowName.trim(),
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create workflow")
//       }

//       const workflow = await response.json()

//       toast({
//         title: "Workflow created",
//         description: "Your new workflow has been created successfully.",
//       })

//       if (redirectAfterCreate) {
//         // Redirect to the workflow configuration page
//         router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/configure`)
//       } else {
//         // Reset the form
//         setSelectedTemplateId(null)
//         setWorkflowName("")
//       }
//     } catch (error) {
//       console.error("Error creating workflow:", error)
//       toast({
//         title: "Error creating workflow",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Organize templates by category
//   const featuredTemplates = templates.filter((t) => t.featured)
//   const popularTemplates = templates.filter((t) => t.popular && !t.featured)
//   const otherTemplates = templates.filter((t) => !t.featured && !t.popular)

//   // Get all available categories
//   const categories = Object.values(WorkflowCategory)

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Category Filter */}
//       <div className="space-y-2">
//         <Label htmlFor="category">Filter by Category</Label>
//         <RadioGroup
//           id="category"
//           value={selectedCategory}
//           onValueChange={(value) => setSelectedCategory(value as WorkflowCategory | "ALL")}
//           className="flex flex-wrap gap-2"
//         >
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="ALL" id="category-all" />
//             <Label htmlFor="category-all" className="cursor-pointer">
//               All
//             </Label>
//           </div>

//           {categories.map((category) => (
//             <div key={category} className="flex items-center space-x-2">
//               <RadioGroupItem value={category} id={`category-${category.toLowerCase()}`} />
//               <Label htmlFor={`category-${category.toLowerCase()}`} className="cursor-pointer">
//                 {category
//                   .replace(/_/g, " ")
//                   .toLocaleLowerCase()
//                   .replace(/\b\w/g, (l) => l.toUpperCase())}
//               </Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>

//       {/* Template Selection */}
//       <div className="space-y-6">
//         <Label htmlFor="template-selection">Select a Workflow Template</Label>

//         {loadingTemplates ? (
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-48" />
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[1, 2, 3].map((i) => (
//                 <Skeleton key={i} className="h-40 w-full" />
//               ))}
//             </div>
//           </div>
//         ) : templates.length === 0 ? (
//           <div className="bg-background border rounded-lg p-6 text-center">
//             <p className="text-muted-foreground">No templates found for the selected category.</p>
//             <Button variant="outline" className="mt-2" onClick={() => setSelectedCategory("ALL")}>
//               View All Templates
//             </Button>
//           </div>
//         ) : (
//           <div id="template-selection" className="space-y-6">
//             <TemplateGroup
//               title="Featured Templates"
//               templates={featuredTemplates}
//               selectedTemplateId={selectedTemplateId}
//               onSelectTemplate={setSelectedTemplateId}
//             />

//             <TemplateGroup
//               title="Popular Templates"
//               templates={popularTemplates}
//               selectedTemplateId={selectedTemplateId}
//               onSelectTemplate={setSelectedTemplateId}
//             />

//             <TemplateGroup
//               title={selectedCategory === "ALL" ? "All Templates" : "Other Templates"}
//               templates={otherTemplates}
//               selectedTemplateId={selectedTemplateId}
//               onSelectTemplate={setSelectedTemplateId}
//             />
//           </div>
//         )}
//       </div>

//       {/* Workflow Name */}
//       <div className="space-y-2">
//         <Label htmlFor="workflow-name">Workflow Name</Label>
//         <Input
//           id="workflow-name"
//           placeholder="Enter a name for your workflow"
//           value={workflowName}
//           onChange={(e) => setWorkflowName(e.target.value)}
//           disabled={!selectedTemplateId || submitting}
//         />
//       </div>

//       {/* Form Actions */}
//       <div className="flex justify-end">
//         <Button type="submit" disabled={!selectedTemplateId || !workflowName.trim() || submitting}>
//           {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           Create Workflow
//         </Button>
//       </div>
//     </form>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Check,
//   Loader2,
//   Sparkles,
//   Flame,
//   Clock,
//   BarChart3,
//   ArrowRight,
//   Plus,
//   Search,
//   Filter,
//   Zap,
//   Star,
//   Lightbulb,
//   Layers,
// } from "lucide-react"
// import { WorkflowCategory, type WorkflowComplexity } from "@prisma/client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { toast } from "@/hooks/use-toast"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// // Template type definition
// interface WorkflowTemplate {
//   id: string
//   name: string
//   description: string
//   category: WorkflowCategory
//   icon: string | null
//   complexity: WorkflowComplexity
//   estimatedSetupTime: number
//   featured: boolean
//   popular: boolean
//   userWorkflows: string[]
// }

// interface TemplateGroupProps {
//   title: string
//   icon: React.ReactNode
//   accentColor: string
//   templates: WorkflowTemplate[]
//   selectedTemplateId: string | null
//   onSelectTemplate: (templateId: string) => void
// }

// interface CreateWorkflowFormProps {
//   redirectAfterCreate?: boolean
//   defaultTemplateId?: string
//   preSelectedCategory?: WorkflowCategory
// }

// function TemplateGroup({
//   title,
//   icon,
//   accentColor,
//   templates,
//   selectedTemplateId,
//   onSelectTemplate,
// }: TemplateGroupProps) {
//   if (templates.length === 0) return null

//   return (
//     <motion.div
//       className="space-y-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="flex items-center gap-2">
//         <div className={`p-1.5 rounded-md ${accentColor}`}>{icon}</div>
//         <h3 className="text-lg font-medium">{title}</h3>
//         <Badge variant="outline" className="ml-2 bg-background">
//           {templates.length}
//         </Badge>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <AnimatePresence>
//           {templates.map((template, index) => (
//             <motion.div
//               key={template.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.2, delay: index * 0.05 }}
//             >
//               <Card
//                 className={cn(
//                   "cursor-pointer transition-all overflow-hidden group relative",
//                   "hover:shadow-md dark:hover:shadow-primary/10",
//                   selectedTemplateId === template.id
//                     ? "border-2 border-primary ring-2 ring-primary/20"
//                     : "hover:border-primary/50",
//                   getCategoryCardStyle(template.category),
//                 )}
//                 onClick={() => onSelectTemplate(template.id)}
//               >
//                 {/* Background gradient based on category */}
//                 <div
//                   className={cn(
//                     "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
//                     getCategoryGradient(template.category),
//                   )}
//                 />

//                 <CardContent className="p-4 relative z-10">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-1">
//                       <h4 className="font-medium group-hover:text-primary transition-colors">{template.name}</h4>
//                       <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
//                         {template.description}
//                       </p>
//                     </div>
//                     <div
//                       className={cn(
//                         "text-muted-foreground p-2 rounded-md transition-all",
//                         "group-hover:scale-110 group-hover:rotate-3",
//                         getCategoryIconBackground(template.category),
//                       )}
//                     >
//                       {template.icon ? (
//                         <span className="text-xl">{template.icon}</span>
//                       ) : (
//                         getCategoryIcon(template.category)
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center mt-4 text-xs">
//                     <div className="flex items-center text-muted-foreground group-hover:text-foreground/70 transition-colors">
//                       <Clock className="h-3 w-3 mr-1" />
//                       <span>Est. setup: {template.estimatedSetupTime} min</span>
//                     </div>
//                     <div
//                       className={cn(
//                         "flex items-center px-2 py-0.5 rounded-full text-xs",
//                         getComplexityStyle(template.complexity),
//                       )}
//                     >
//                       <BarChart3 className="h-3 w-3 mr-1" />
//                       <span className="capitalize">{template.complexity.toLowerCase()}</span>
//                     </div>
//                   </div>

//                   {/* Badges for featured/popular */}
//                   <div className="absolute top-1 right-1 flex gap-1">
//                     {template.featured && (
//                       <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-1 rounded-md">
//                         <Star className="h-3 w-3" />
//                       </div>
//                     )}
//                     {template.popular && !template.featured && (
//                       <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 p-1 rounded-md">
//                         <Flame className="h-3 w-3" />
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>

//                 {/* Selection indicator */}
//                 {selectedTemplateId === template.id && (
//                   <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center z-20">
//                     <Check className="h-3 w-3 text-primary-foreground" />
//                   </div>
//                 )}

//                 {/* Hover overlay with "Select" button */}
//                 <div
//                   className={cn(
//                     "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
//                     selectedTemplateId === template.id ? "opacity-0 !bg-transparent" : "",
//                   )}
//                 >
//                   <Button size="sm" variant="secondary" className="shadow-lg">
//                     <Plus className="h-4 w-4 mr-1" />
//                     Select Template
//                   </Button>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   )
// }

// export function CreateWorkflowForm({
//   redirectAfterCreate = true,
//   defaultTemplateId,
//   preSelectedCategory,
// }: CreateWorkflowFormProps) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group

//   // State
//   const [isLoading, setIsLoading] = useState(false)
//   const [loadingTemplates, setLoadingTemplates] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory | "ALL">(preSelectedCategory || "ALL")
//   const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(defaultTemplateId || null)
//   const [workflowName, setWorkflowName] = useState("")
//   const [searchQuery, setSearchQuery] = useState("")

//   // Fetch templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoadingTemplates(true)
//       try {
//         const params = new URLSearchParams()
//         if (selectedCategory !== "ALL") {
//           params.append("category", selectedCategory)
//         }

//         const response = await fetch(`/api/templates?${params.toString()}`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch templates")
//         }

//         const data = await response.json()
//         setTemplates(data.templates)

//         // If we have a defaultTemplateId, make sure it's selected
//         if (defaultTemplateId && !selectedTemplateId) {
//           setSelectedTemplateId(defaultTemplateId)

//           // Find the template to get its name for the workflow name suggestion
//           const template = data.templates.find((t: WorkflowTemplate) => t.id === defaultTemplateId)
//           if (template) {
//             setWorkflowName(`My ${template.name}`)
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching templates:", error)
//         toast({
//           title: "Error fetching templates",
//           description: "Failed to load workflow templates. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoadingTemplates(false)
//       }
//     }

//     fetchTemplates()
//   }, [selectedCategory, defaultTemplateId, selectedTemplateId])

//   // Set a default name when a template is selected
//   useEffect(() => {
//     if (selectedTemplateId && !workflowName) {
//       const template = templates.find((t) => t.id === selectedTemplateId)
//       if (template) {
//         setWorkflowName(`My ${template.name}`)
//       }
//     }
//   }, [selectedTemplateId, templates, workflowName])

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedTemplateId) {
//       toast({
//         title: "Select a template",
//         description: "Please select a workflow template to continue.",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!workflowName.trim()) {
//       toast({
//         title: "Enter a name",
//         description: "Please provide a name for your workflow.",
//         variant: "destructive",
//       })
//       return
//     }

//     setSubmitting(true)
//     try {
//       const response = await fetch("/api/workflows", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           templateId: selectedTemplateId,
//           name: workflowName.trim(),
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create workflow")
//       }

//       const workflow = await response.json()

//       toast({
//         title: "Workflow created",
//         description: "Your new workflow has been created successfully.",
//       })

//       if (redirectAfterCreate) {
//         // Redirect to the workflow configuration page
//         router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/configure`)
//       } else {
//         // Reset the form
//         setSelectedTemplateId(null)
//         setWorkflowName("")
//       }
//     } catch (error) {
//       console.error("Error creating workflow:", error)
//       toast({
//         title: "Error creating workflow",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Filter templates by search query
//   const filteredTemplates = templates.filter((template) => {
//     if (!searchQuery) return true

//     const query = searchQuery.toLowerCase()
//     return (
//       template.name.toLowerCase().includes(query) ||
//       template.description.toLowerCase().includes(query) ||
//       template.category.toLowerCase().includes(query)
//     )
//   })

//   // Organize templates by category
//   const featuredTemplates = filteredTemplates.filter((t) => t.featured)
//   const popularTemplates = filteredTemplates.filter((t) => t.popular && !t.featured)
//   const otherTemplates = filteredTemplates.filter((t) => !t.featured && !t.popular)

//   // Get all available categories
//   const categories = Object.values(WorkflowCategory)

//   // Helper functions for styling
//   function getCategoryCardStyle(category: WorkflowCategory) {
//     switch (category) {
//       case "MARKETING":
//         return "hover:border-blue-300 dark:hover:border-blue-600"
//       case "SALES":
//         return "hover:border-emerald-300 dark:hover:border-emerald-600"
//       case "CUSTOMER_SUPPORT":
//         return "hover:border-purple-300 dark:hover:border-purple-600"
//       case "DATA_PROCESSING":
//         return "hover:border-cyan-300 dark:hover:border-cyan-600"
//       case "DOCUMENT_MANAGEMENT":
//         return "hover:border-amber-300 dark:hover:border-amber-600"
//       case "SOCIAL_MEDIA":
//         return "hover:border-pink-300 dark:hover:border-pink-600"
//       case "COMMUNICATION":
//         return "hover:border-teal-300 dark:hover:border-teal-600"
//       case "INTEGRATION":
//         return "hover:border-indigo-300 dark:hover:border-indigo-600"
//       case "UTILITY":
//         return "hover:border-slate-300 dark:hover:border-slate-600"
//       case "CUSTOM":
//         return "hover:border-orange-300 dark:hover:border-orange-600"
//       default:
//         return "hover:border-gray-300 dark:hover:border-gray-600"
//     }
//   }

//   function getCategoryGradient(category: WorkflowCategory) {
//     switch (category) {
//       case "MARKETING":
//         return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30"
//       case "SALES":
//         return "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30"
//       case "CUSTOMER_SUPPORT":
//         return "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30"
//       case "DATA_PROCESSING":
//         return "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30"
//       case "DOCUMENT_MANAGEMENT":
//         return "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30"
//       case "SOCIAL_MEDIA":
//         return "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30"
//       case "COMMUNICATION":
//         return "bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30"
//       case "INTEGRATION":
//         return "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30"
//       case "UTILITY":
//         return "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30"
//       case "CUSTOM":
//         return "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30"
//       default:
//         return "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30"
//     }
//   }

//   function getCategoryIconBackground(category: WorkflowCategory) {
//     switch (category) {
//       case "MARKETING":
//         return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
//       case "SALES":
//         return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
//       case "CUSTOMER_SUPPORT":
//         return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
//       case "DATA_PROCESSING":
//         return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
//       case "DOCUMENT_MANAGEMENT":
//         return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
//       case "SOCIAL_MEDIA":
//         return "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
//       case "COMMUNICATION":
//         return "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
//       case "INTEGRATION":
//         return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
//       case "UTILITY":
//         return "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
//       case "CUSTOM":
//         return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
//       default:
//         return "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
//     }
//   }

//   function getCategoryIcon(category: WorkflowCategory) {
//     switch (category) {
//       case "MARKETING":
//         return <Zap className="h-4 w-4" />
//       case "SALES":
//         return <Flame className="h-4 w-4" />
//       case "CUSTOMER_SUPPORT":
//         return <Lightbulb className="h-4 w-4" />
//       case "DATA_PROCESSING":
//         return <BarChart3 className="h-4 w-4" />
//       case "DOCUMENT_MANAGEMENT":
//         return <Layers className="h-4 w-4" />
//       case "SOCIAL_MEDIA":
//         return <Star className="h-4 w-4" />
//       case "COMMUNICATION":
//         return <Zap className="h-4 w-4" />
//       case "INTEGRATION":
//         return <Zap className="h-4 w-4" />
//       case "UTILITY":
//         return <Zap className="h-4 w-4" />
//       case "CUSTOM":
//         return <Zap className="h-4 w-4" />
//       default:
//         return <Zap className="h-4 w-4" />
//     }
//   }

//   function getComplexityStyle(complexity: WorkflowComplexity) {
//     switch (complexity) {
//       case "SIMPLE":
//         return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
//       case "MEDIUM":
//         return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
//       case "COMPLEX":
//         return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
//       default:
//         return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">
//       {/* Header with progress indicator */}
//       <div className="relative">
//         <div className="absolute left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
//           <motion.div
//             className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
//             initial={{ width: "0%" }}
//             animate={{
//               width: !selectedTemplateId ? "33%" : !workflowName ? "66%" : "100%",
//             }}
//             transition={{ duration: 0.5 }}
//           />
//         </div>

//         <div className="pt-6 flex justify-between">
//           <div
//             className={`flex flex-col items-center ${!selectedTemplateId ? "text-primary" : "text-muted-foreground"}`}
//           >
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${!selectedTemplateId ? "bg-primary text-primary-foreground" : "bg-muted"}`}
//             >
//               1
//             </div>
//             <span className="text-xs">Select Template</span>
//           </div>

//           <div
//             className={`flex flex-col items-center ${selectedTemplateId && !workflowName ? "text-primary" : "text-muted-foreground"}`}
//           >
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${selectedTemplateId && !workflowName ? "bg-primary text-primary-foreground" : "bg-muted"}`}
//             >
//               2
//             </div>
//             <span className="text-xs">Name Workflow</span>
//           </div>

//           <div
//             className={`flex flex-col items-center ${selectedTemplateId && workflowName ? "text-primary" : "text-muted-foreground"}`}
//           >
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${selectedTemplateId && workflowName ? "bg-primary text-primary-foreground" : "bg-muted"}`}
//             >
//               3
//             </div>
//             <span className="text-xs">Create</span>
//           </div>
//         </div>
//       </div>

//       {/* Search and filter section */}
//       <div className="bg-card border rounded-xl p-4 shadow-sm">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search input */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search templates..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           {/* Category Filter */}
//           <div className="flex-1">
//             <Label htmlFor="category" className="flex items-center gap-2 mb-2 text-sm">
//               <Filter className="h-4 w-4" />
//               Filter by Category
//             </Label>
//             <RadioGroup
//               id="category"
//               value={selectedCategory}
//               onValueChange={(value) => setSelectedCategory(value as WorkflowCategory | "ALL")}
//               className="flex flex-wrap gap-2"
//             >
//               <div className="flex items-center space-x-1">
//                 <RadioGroupItem value="ALL" id="category-all" className="h-3.5 w-3.5" />
//                 <Label htmlFor="category-all" className="cursor-pointer text-sm">
//                   All
//                 </Label>
//               </div>

//               {categories.map((category) => (
//                 <div key={category} className="flex items-center space-x-1">
//                   <RadioGroupItem value={category} id={`category-${category.toLowerCase()}`} className="h-3.5 w-3.5" />
//                   <Label htmlFor={`category-${category.toLowerCase()}`} className="cursor-pointer text-sm">
//                     {category
//                       .replace(/_/g, " ")
//                       .toLocaleLowerCase()
//                       .replace(/\b\w/g, (l) => l.toUpperCase())}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         </div>
//       </div>

//       {/* Template Selection */}
//       <div className="space-y-6">
//         <div className="flex items-center gap-2">
//           <Sparkles className="h-5 w-5 text-primary" />
//           <Label htmlFor="template-selection" className="text-lg font-medium">
//             Select a Workflow Template
//           </Label>
//         </div>

//         {loadingTemplates ? (
//           <div className="space-y-8">
//             <div className="space-y-4">
//               <Skeleton className="h-8 w-48" />
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[1, 2, 3].map((i) => (
//                   <Skeleton key={i} className="h-40 w-full" />
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-4">
//               <Skeleton className="h-8 w-48" />
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[1, 2].map((i) => (
//                   <Skeleton key={i} className="h-40 w-full" />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : filteredTemplates.length === 0 ? (
//           <div className="bg-card border rounded-lg p-8 text-center">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
//               <Search className="h-6 w-6 text-muted-foreground" />
//             </div>
//             <p className="text-muted-foreground mb-4">No templates found for the selected criteria.</p>
//             <div className="flex flex-col sm:flex-row gap-2 justify-center">
//               <Button variant="outline" onClick={() => setSelectedCategory("ALL")}>
//                 View All Categories
//               </Button>
//               <Button variant="outline" onClick={() => setSearchQuery("")}>
//                 Clear Search
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div id="template-selection" className="space-y-10">
//             <TemplateGroup
//               title="Featured Templates"
//               icon={<Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
//               accentColor="bg-amber-100 dark:bg-amber-900/30"
//               templates={featuredTemplates}
//               selectedTemplateId={selectedTemplateId}
//               onSelectTemplate={setSelectedTemplateId}
//             />

//             <TemplateGroup
//               title="Popular Templates"
//               icon={<Flame className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
//               accentColor="bg-purple-100 dark:bg-purple-900/30"
//               templates={popularTemplates}
//               selectedTemplateId={selectedTemplateId}
//               onSelectTemplate={setSelectedTemplateId}
//             />

//             <TemplateGroup
//               title={selectedCategory === "ALL" ? "All Templates" : "Other Templates"}
//               icon={<Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
//               accentColor="bg-blue-100 dark:bg-blue-900/30"
//               templates={otherTemplates}
//               selectedTemplateId={selectedTemplateId}
//               onSelectTemplate={setSelectedTemplateId}
//             />
//           </div>
//         )}
//       </div>

//       {/* Workflow Name */}
//       <motion.div
//         className="space-y-3"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{
//           opacity: selectedTemplateId ? 1 : 0,
//           height: selectedTemplateId ? "auto" : 0,
//         }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="flex items-center gap-2">
//           <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-md">
//             <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//           </div>
//           <Label htmlFor="workflow-name" className="text-lg font-medium">
//             Name Your Workflow
//           </Label>
//         </div>

//         <div className="bg-card border rounded-xl p-6 shadow-sm">
//           <div className="space-y-4">
//             <p className="text-sm text-muted-foreground">
//               Give your workflow a descriptive name that helps you identify its purpose.
//             </p>

//             <div className="relative">
//               <Input
//                 id="workflow-name"
//                 placeholder="Enter a name for your workflow"
//                 value={workflowName}
//                 onChange={(e) => setWorkflowName(e.target.value)}
//                 disabled={!selectedTemplateId || submitting}
//                 className="pr-24"
//               />
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
//                 <Badge variant="outline" className="bg-muted/50">
//                   Workflow
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Form Actions */}
//       <motion.div
//         className="flex justify-end"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Button
//           type="submit"
//           disabled={!selectedTemplateId || !workflowName.trim() || submitting}
//           className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
//         >
//           {/* Background animation */}
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>

//           {/* Content */}
//           <span className="relative flex items-center">
//             {submitting ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Zap className="mr-2 h-4 w-4 group-hover:animate-pulse" />
//             )}
//             Create Workflow
//             <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
//           </span>
//         </Button>
//       </motion.div>
//     </form>
//   )
// }


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  Loader2,
  Sparkles,
  Flame,
  Clock,
  BarChart3,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Zap,
  Star,
  Lightbulb,
  Layers,
} from "lucide-react"
import { WorkflowCategory, type WorkflowComplexity } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Template type definition
interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  icon: string | null
  complexity: WorkflowComplexity
  estimatedSetupTime: number
  featured: boolean
  popular: boolean
  userWorkflows: string[]
}

interface TemplateGroupProps {
  title: string
  icon: React.ReactNode
  accentColor: string
  templates: WorkflowTemplate[]
  selectedTemplateId: string | null
  onSelectTemplate: (templateId: string) => void
}

interface CreateWorkflowFormProps {
  redirectAfterCreate?: boolean
  defaultTemplateId?: string
  preSelectedCategory?: WorkflowCategory
}

// Helper functions moved to the top
function getCategoryCardStyle(category: WorkflowCategory) {
  switch (category) {
    case "MARKETING":
      return "hover:border-blue-300 dark:hover:border-blue-600"
    case "SALES":
      return "hover:border-emerald-300 dark:hover:border-emerald-600"
    case "CUSTOMER_SUPPORT":
      return "hover:border-purple-300 dark:hover:border-purple-600"
    case "DATA_PROCESSING":
      return "hover:border-cyan-300 dark:hover:border-cyan-600"
    case "DOCUMENT_MANAGEMENT":
      return "hover:border-amber-300 dark:hover:border-amber-600"
    case "SOCIAL_MEDIA":
      return "hover:border-pink-300 dark:hover:border-pink-600"
    case "COMMUNICATION":
      return "hover:border-teal-300 dark:hover:border-teal-600"
    case "INTEGRATION":
      return "hover:border-indigo-300 dark:hover:border-indigo-600"
    case "UTILITY":
      return "hover:border-slate-300 dark:hover:border-slate-600"
    case "CUSTOM":
      return "hover:border-orange-300 dark:hover:border-orange-600"
    default:
      return "hover:border-gray-300 dark:hover:border-gray-600"
  }
}

function getCategoryGradient(category: WorkflowCategory) {
  switch (category) {
    case "MARKETING":
      return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30"
    case "SALES":
      return "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30"
    case "CUSTOMER_SUPPORT":
      return "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30"
    case "DATA_PROCESSING":
      return "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30"
    case "DOCUMENT_MANAGEMENT":
      return "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30"
    case "SOCIAL_MEDIA":
      return "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30"
    case "COMMUNICATION":
      return "bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30"
    case "INTEGRATION":
      return "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30"
    case "UTILITY":
      return "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30"
    case "CUSTOM":
      return "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30"
    default:
      return "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30"
  }
}

function getCategoryIconBackground(category: WorkflowCategory) {
  switch (category) {
    case "MARKETING":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
    case "SALES":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
    case "CUSTOMER_SUPPORT":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
    case "DATA_PROCESSING":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
    case "DOCUMENT_MANAGEMENT":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
    case "SOCIAL_MEDIA":
      return "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
    case "COMMUNICATION":
      return "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
    case "INTEGRATION":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
    case "UTILITY":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
    case "CUSTOM":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
  }
}

function getCategoryIcon(category: WorkflowCategory) {
  switch (category) {
    case "MARKETING":
      return <Zap className="h-4 w-4" />
    case "SALES":
      return <Flame className="h-4 w-4" />
    case "CUSTOMER_SUPPORT":
      return <Lightbulb className="h-4 w-4" />
    case "DATA_PROCESSING":
      return <BarChart3 className="h-4 w-4" />
    case "DOCUMENT_MANAGEMENT":
      return <Layers className="h-4 w-4" />
    case "SOCIAL_MEDIA":
      return <Star className="h-4 w-4" />
    case "COMMUNICATION":
      return <Zap className="h-4 w-4" />
    case "INTEGRATION":
      return <Zap className="h-4 w-4" />
    case "UTILITY":
      return <Zap className="h-4 w-4" />
    case "CUSTOM":
      return <Zap className="h-4 w-4" />
    default:
      return <Zap className="h-4 w-4" />
  }
}

function getComplexityStyle(complexity: WorkflowComplexity) {
  switch (complexity) {
    case "SIMPLE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    case "MEDIUM":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    case "COMPLEX":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
  }
}

function TemplateGroup({
  title,
  icon,
  accentColor,
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateGroupProps) {
  if (templates.length === 0) return null

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${accentColor}`}>{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
        <Badge variant="outline" className="ml-2 bg-background">
          {templates.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all overflow-hidden group relative",
                  "hover:shadow-md dark:hover:shadow-primary/10",
                  selectedTemplateId === template.id
                    ? "border-2 border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50",
                  getCategoryCardStyle(template.category),
                )}
                onClick={() => onSelectTemplate(template.id)}
              >
                {/* Background gradient based on category */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    getCategoryGradient(template.category),
                  )}
                />

                <CardContent className="p-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors">{template.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {template.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "text-muted-foreground p-2 rounded-md transition-all",
                        "group-hover:scale-110 group-hover:rotate-3",
                        getCategoryIconBackground(template.category),
                      )}
                    >
                      {template.icon ? (
                        <span className="text-xl">{template.icon}</span>
                      ) : (
                        getCategoryIcon(template.category)
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 text-xs">
                    <div className="flex items-center text-muted-foreground group-hover:text-foreground/70 transition-colors">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Est. setup: {template.estimatedSetupTime} min</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center px-2 py-0.5 rounded-full text-xs",
                        getComplexityStyle(template.complexity),
                      )}
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      <span className="capitalize">{template.complexity.toLowerCase()}</span>
                    </div>
                  </div>

                  {/* Badges for featured/popular */}
                  <div className="absolute top-1 right-1 flex gap-1">
                    {template.featured && (
                      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-1 rounded-md">
                        <Star className="h-3 w-3" />
                      </div>
                    )}
                    {template.popular && !template.featured && (
                      <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 p-1 rounded-md">
                        <Flame className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Selection indicator */}
                {selectedTemplateId === template.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center z-20">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                {/* Hover overlay with "Select" button */}
                <div
                  className={cn(
                    "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    selectedTemplateId === template.id ? "opacity-0 !bg-transparent" : "",
                  )}
                >
                  <Button size="sm" variant="secondary" className="shadow-lg">
                    <Plus className="h-4 w-4 mr-1" />
                    Select Template
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function CreateWorkflowForm({
  redirectAfterCreate = true,
  defaultTemplateId,
  preSelectedCategory,
}: CreateWorkflowFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory | "ALL">(preSelectedCategory || "ALL")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(defaultTemplateId || null)
  const [workflowName, setWorkflowName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory)
        }

        const response = await fetch(`/api/templates?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }

        const data = await response.json()
        setTemplates(data.templates)

        // If we have a defaultTemplateId, make sure it's selected
        if (defaultTemplateId && !selectedTemplateId) {
          setSelectedTemplateId(defaultTemplateId)

          // Find the template to get its name for the workflow name suggestion
          const template = data.templates.find((t: WorkflowTemplate) => t.id === defaultTemplateId)
          if (template) {
            setWorkflowName(`My ${template.name}`)
          }
        }
      } catch (error) {
        console.error("Error fetching templates:", error)
        toast({
          title: "Error fetching templates",
          description: "Failed to load workflow templates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingTemplates(false)
      }
    }

    fetchTemplates()
  }, [selectedCategory, defaultTemplateId, selectedTemplateId])

  // Set a default name when a template is selected
  useEffect(() => {
    if (selectedTemplateId && !workflowName) {
      const template = templates.find((t) => t.id === selectedTemplateId)
      if (template) {
        setWorkflowName(`My ${template.name}`)
      }
    }
  }, [selectedTemplateId, templates, workflowName])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTemplateId) {
      toast({
        title: "Select a template",
        description: "Please select a workflow template to continue.",
        variant: "destructive",
      })
      return
    }

    if (!workflowName.trim()) {
      toast({
        title: "Enter a name",
        description: "Please provide a name for your workflow.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          name: workflowName.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create workflow")
      }

      const workflow = await response.json()

      toast({
        title: "Workflow created",
        description: "Your new workflow has been created successfully.",
      })

      if (redirectAfterCreate) {
        // Redirect to the workflow configuration page
        router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/configure`)
      } else {
        // Reset the form
        setSelectedTemplateId(null)
        setWorkflowName("")
      }
    } catch (error) {
      console.error("Error creating workflow:", error)
      toast({
        title: "Error creating workflow",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Filter templates by search query
  const filteredTemplates = templates.filter((template) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query)
    )
  })

  // Organize templates by category
  const featuredTemplates = filteredTemplates.filter((t) => t.featured)
  const popularTemplates = filteredTemplates.filter((t) => t.popular && !t.featured)
  const otherTemplates = filteredTemplates.filter((t) => !t.featured && !t.popular)

  // Get all available categories
  const categories = Object.values(WorkflowCategory)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header with progress indicator */}
      <div className="relative">
        <div className="absolute left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{
              width: !selectedTemplateId ? "33%" : !workflowName ? "66%" : "100%",
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="pt-6 flex justify-between">
          <div
            className={`flex flex-col items-center ${!selectedTemplateId ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${!selectedTemplateId ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              1
            </div>
            <span className="text-xs">Select Template</span>
          </div>

          <div
            className={`flex flex-col items-center ${selectedTemplateId && !workflowName ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${selectedTemplateId && !workflowName ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              2
            </div>
            <span className="text-xs">Name Workflow</span>
          </div>

          <div
            className={`flex flex-col items-center ${selectedTemplateId && workflowName ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${selectedTemplateId && workflowName ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              3
            </div>
            <span className="text-xs">Create</span>
          </div>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <Label htmlFor="category" className="flex items-center gap-2 mb-2 text-sm">
              <Filter className="h-4 w-4" />
              Filter by Category
            </Label>
            <RadioGroup
              id="category"
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as WorkflowCategory | "ALL")}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="ALL" id="category-all" className="h-3.5 w-3.5" />
                <Label htmlFor="category-all" className="cursor-pointer text-sm">
                  All
                </Label>
              </div>

              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-1">
                  <RadioGroupItem value={category} id={`category-${category.toLowerCase()}`} className="h-3.5 w-3.5" />
                  <Label htmlFor={`category-${category.toLowerCase()}`} className="cursor-pointer text-sm">
                    {category
                      .replace(/_/g, " ")
                      .toLocaleLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Label htmlFor="template-selection" className="text-lg font-medium">
            Select a Workflow Template
          </Label>
        </div>

        {loadingTemplates ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-card border rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No templates found for the selected criteria.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => setSelectedCategory("ALL")}>
                View All Categories
              </Button>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          <div id="template-selection" className="space-y-10">
            <TemplateGroup
              title="Featured Templates"
              icon={<Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
              accentColor="bg-amber-100 dark:bg-amber-900/30"
              templates={featuredTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />

            <TemplateGroup
              title="Popular Templates"
              icon={<Flame className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
              accentColor="bg-purple-100 dark:bg-purple-900/30"
              templates={popularTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />

            <TemplateGroup
              title={selectedCategory === "ALL" ? "All Templates" : "Other Templates"}
              icon={<Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              accentColor="bg-blue-100 dark:bg-blue-900/30"
              templates={otherTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />
          </div>
        )}
      </div>

      {/* Workflow Name */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: selectedTemplateId ? 1 : 0,
          height: selectedTemplateId ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-md">
            <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <Label htmlFor="workflow-name" className="text-lg font-medium">
            Name Your Workflow
          </Label>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Give your workflow a descriptive name that helps you identify its purpose.
            </p>

            <div className="relative">
              <Input
                id="workflow-name"
                placeholder="Enter a name for your workflow"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                disabled={!selectedTemplateId || submitting}
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Badge variant="outline" className="bg-muted/50">
                  Workflow
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

     {/* Form Actions */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          type="submit"
          disabled={!selectedTemplateId || !workflowName.trim() || submitting}
          className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>

          {/* Content */}
          <span className="relative flex items-center">
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            )}
            Create Workflow
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </span>
        </Button>
      </motion.div>
    </form>
  )
}