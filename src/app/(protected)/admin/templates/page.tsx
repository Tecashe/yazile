// import { MessageTemplates } from "../components/message-template"

// export default function TemplatesPage() {
//   return (
//     <div className="container p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
//         <p className="text-muted-foreground">Create and manage reusable message templates for your automations</p>
//       </div>

//       <MessageTemplates />
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Filter, Star, Award } from "lucide-react"

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
  _count?: {
    userWorkflows: number
  }
  userWorkflows?: string[]
}

type PaginationInfo = {
  total: number
  limit: number
  offset: number
}

export default function TemplatesAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [templates, setTemplates] = useState<Template[]>([])
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

  // Template form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
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

  // Categories (you might want to fetch these from an API)
  const categories = ["EMAIL", "CRM", "MARKETING", "SALES", "SUPPORT", "ANALYTICS", "OTHER"]

  // Fetch templates
  const fetchTemplates = async () => {
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
      setTemplates(data.templates)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchTemplates()
  }, [pagination.offset, pagination.limit])

  // Apply filters
  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, offset: 0 })) // Reset to first page
    fetchTemplates()
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setShowFeatured(undefined)
    setShowPopular(undefined)
    setSelectedComplexity("")
    setPagination((prev) => ({ ...prev, offset: 0 }))
    fetchTemplates()
  }

  // Handle pagination
  const handlePreviousPage = () => {
    if (pagination.offset - pagination.limit >= 0) {
      setPagination((prev) => ({ ...prev, offset: prev.offset - prev.limit }))
    }
  }

  const handleNextPage = () => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
    }
  }

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleArrayInputChange = (name: string, value: string) => {
    // Split by commas and trim whitespace
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, [name]: arrayValue }))
  }

  // Create template
  const handleCreateTemplate = async () => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

      // Refresh templates
      fetchTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Edit template
  const openEditDialog = (template: Template) => {
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
  }

  const handleUpdateTemplate = async () => {
    if (!currentTemplate) return

    try {
      const response = await fetch(`/api/templates/${currentTemplate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update template")
      }

      // Reset and close dialog
      setCurrentTemplate(null)
      setIsEditDialogOpen(false)

      // Refresh templates
      fetchTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Delete template
  const handleDeleteTemplate = async (id: string) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Template form component
  const TemplateForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description *
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category *
        </Label>
        <Select
          name="category"
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
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
        <Label className="text-right">Featured</Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mark as featured
          </label>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Popular</Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Checkbox
            id="popular"
            checked={formData.popular}
            onCheckedChange={(checked) => handleCheckboxChange("popular", checked as boolean)}
          />
          <label
            htmlFor="popular"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mark as popular
          </label>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="complexity" className="text-right">
          Complexity
        </Label>
        <Select
          name="complexity"
          value={formData.complexity}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, complexity: value as "SIMPLE" | "MEDIUM" | "COMPLEX" }))
          }
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select complexity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIMPLE">Simple</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="COMPLEX">Complex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estimatedSetupTime" className="text-right">
          Setup Time (min)
        </Label>
        <Input
          id="estimatedSetupTime"
          name="estimatedSetupTime"
          type="number"
          value={formData.estimatedSetupTime}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="requiredIntegrations" className="text-right">
          Required Integrations
        </Label>
        <Input
          id="requiredIntegrations"
          name="requiredIntegrations"
          value={formData.requiredIntegrations.join(", ")}
          onChange={(e) => handleArrayInputChange("requiredIntegrations", e.target.value)}
          className="col-span-3"
          placeholder="Comma-separated list"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="configurationSchema" className="text-right">
          Config Schema *
        </Label>
        <Textarea
          id="configurationSchema"
          name="configurationSchema"
          value={formData.configurationSchema}
          onChange={handleInputChange}
          className="col-span-3 font-mono text-sm"
          rows={5}
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="n8nTemplateId" className="text-right">
          n8n Template ID
        </Label>
        <Input
          id="n8nTemplateId"
          name="n8nTemplateId"
          value={formData.n8nTemplateId}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="visualRepresentation" className="text-right">
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
        <Label htmlFor="expectedOutcomes" className="text-right">
          Expected Outcomes
        </Label>
        <Input
          id="expectedOutcomes"
          name="expectedOutcomes"
          value={formData.expectedOutcomes.join(", ")}
          onChange={(e) => handleArrayInputChange("expectedOutcomes", e.target.value)}
          className="col-span-3"
          placeholder="Comma-separated list"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="useCases" className="text-right">
          Use Cases
        </Label>
        <Input
          id="useCases"
          name="useCases"
          value={formData.useCases.join(", ")}
          onChange={(e) => handleArrayInputChange("useCases", e.target.value)}
          className="col-span-3"
          placeholder="Comma-separated list"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Active</Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleCheckboxChange("isActive", checked as boolean)}
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Template is active
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workflow Templates</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Fill in the details to create a new workflow template.</DialogDescription>
            </DialogHeader>
            <TemplateForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter templates by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
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
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complexity">Complexity</Label>
              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Any complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any complexity</SelectItem>
                  <SelectItem value="SIMPLE">Simple</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="COMPLEX">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label className="mb-1">Flags</Label>
              <div className="flex space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={showFeatured === true}
                    onCheckedChange={(checked) => {
                      if (checked === true) setShowFeatured(true)
                      else if (showFeatured === true) setShowFeatured(undefined)
                      else setShowFeatured(true)
                    }}
                  />
                  <label htmlFor="featured" className="text-sm">
                    Featured
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={showPopular === true}
                    onCheckedChange={(checked) => {
                      if (checked === true) setShowPopular(true)
                      else if (showPopular === true) setShowPopular(undefined)
                      else setShowPopular(true)
                    }}
                  />
                  <label htmlFor="popular" className="text-sm">
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
          <Button onClick={applyFilters}>
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Complexity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading templates...
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No templates found. Try adjusting your filters or create a new template.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div>
                          {template.name}
                          <div className="flex mt-1 space-x-1">
                            {template.featured && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                Featured
                              </Badge>
                            )}
                            {template.popular && (
                              <Badge variant="outline" className="text-xs">
                                <Award className="h-3 w-3 mr-1 text-purple-500" />
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{template.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          template.complexity === "SIMPLE"
                            ? "secondary"
                            : template.complexity === "MEDIUM"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {template.complexity.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isActive ? "success" : "outline"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{template._count?.userWorkflows || 0} instances</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(template)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
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
        <CardFooter className="flex items-center justify-between border-t p-4">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update the details of this workflow template.</DialogDescription>
          </DialogHeader>
          <TemplateForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate}>Update Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
