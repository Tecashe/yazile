// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Search, SlidersHorizontal } from "lucide-react"
// import type { WorkflowCategory, WorkflowComplexity } from "@prisma/client"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "@/hooks/use-toast"
// import { TemplateCard } from "./template-card"

// // Types for our component
// interface TemplateListProps {
//   title?: string
//   description?: string
//   limit?: number
//   showFilters?: boolean
//   showSearch?: boolean
//   categoryFilter?: WorkflowCategory | "ALL"
//   complexityFilter?: WorkflowComplexity | "ALL"
//   featuredOnly?: boolean
//   popularOnly?: boolean
// }

// // Types for our API response
// interface TemplateListResponse {
//   templates: Array<{
//     id: string
//     name: string
//     description: string
//     category: WorkflowCategory
//     icon: string | null
//     complexity: WorkflowComplexity
//     estimatedSetupTime: number
//     featured: boolean
//     popular: boolean
//     requiredIntegrations: string[]
//     userWorkflows: string[]
//     _count: {
//       userWorkflows: number
//     }
//   }>
//   pagination: {
//     total: number
//     limit: number
//     offset: number
//   }
// }

// export function TemplateList({
//   title = "Workflow Templates",
//   description = "Browse and select from our library of pre-built workflow templates",
//   limit = 20,
//   showFilters = true,
//   showSearch = true,
//   categoryFilter = "ALL",
//   complexityFilter = "ALL",
//   featuredOnly = false,
//   popularOnly = false,
// }: TemplateListProps) {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   // States
//   const [isLoading, setIsLoading] = useState(true)
//   const [templates, setTemplates] = useState<TemplateListResponse["templates"]>([])
//   const [totalTemplates, setTotalTemplates] = useState(0)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [category, setCategory] = useState<WorkflowCategory | "ALL">(
//     (searchParams.get("category") as WorkflowCategory | "ALL") || categoryFilter,
//   )
//   const [complexity, setComplexity] = useState<WorkflowComplexity | "ALL">(
//     (searchParams.get("complexity") as WorkflowComplexity | "ALL") || complexityFilter,
//   )
//   const [featured, setFeatured] = useState<boolean | "ALL">(
//     searchParams.has("featured") ? searchParams.get("featured") === "true" : featuredOnly ? true : "ALL",
//   )
//   const [popular, setPopular] = useState<boolean | "ALL">(
//     searchParams.has("popular") ? searchParams.get("popular") === "true" : popularOnly ? true : "ALL",
//   )
//   const [activeTab, setActiveTab] = useState<string>("all")

//   // Load templates
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setIsLoading(true)
//       try {
//         // Build query parameters
//         const queryParams = new URLSearchParams()
//         if (category !== "ALL") {
//           queryParams.append("category", category)
//         }
//         if (complexity !== "ALL") {
//           queryParams.append("complexity", complexity)
//         }
//         if (featured !== "ALL") {
//           queryParams.append("featured", String(featured))
//         }
//         if (popular !== "ALL") {
//           queryParams.append("popular", String(popular))
//         }
//         if (searchQuery) {
//           queryParams.append("search", searchQuery)
//         }
//         queryParams.append("limit", limit.toString())

//         // Fetch templates from API
//         const response = await fetch(`/api/templates?${queryParams.toString()}`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch templates")
//         }

//         const data: TemplateListResponse = await response.json()
//         setTemplates(data.templates)
//         setTotalTemplates(data.pagination.total)
//       } catch (error) {
//         console.error("Error fetching templates:", error)
//         toast({
//           title: "Error fetching templates",
//           description: "Failed to load workflow templates. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchTemplates()
//   }, [limit, category, complexity, featured, popular, searchQuery])

//   // Filter templates based on tab
//   const getFilteredTemplates = () => {
//     switch (activeTab) {
//       case "featured":
//         return templates.filter((template) => template.featured)
//       case "popular":
//         return templates.filter((template) => template.popular)
//       case "my-workflows":
//         return templates.filter((template) => template.userWorkflows.length > 0)
//       default:
//         return templates
//     }
//   }

//   const filteredTemplates = getFilteredTemplates()

//   // Group templates by category
//   const templatesByCategory = filteredTemplates.reduce(
//     (acc, template) => {
//       if (!acc[template.category]) {
//         acc[template.category] = []
//       }
//       acc[template.category].push(template)
//       return acc
//     },
//     {} as Record<string, typeof filteredTemplates>,
//   )

//   // Render loading state
//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <Skeleton className="h-8 w-48 mb-2" />
//             <Skeleton className="h-4 w-64" />
//           </div>
//         </div>

//         {showFilters && (
//           <div className="flex items-center justify-between my-4">
//             {showSearch && <Skeleton className="h-10 w-64" />}
//             <Skeleton className="h-10 w-32" />
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Skeleton key={index} className="h-40 w-full rounded-lg" />
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">{title}</h2>
//           <p className="text-muted-foreground">{description}</p>
//         </div>
//       </div>

//       <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
//         <div className="flex justify-between items-center">
//           <TabsList>
//             <TabsTrigger value="all">All Templates</TabsTrigger>
//             <TabsTrigger value="featured">Featured</TabsTrigger>
//             <TabsTrigger value="popular">Popular</TabsTrigger>
//             <TabsTrigger value="my-workflows">My Workflows</TabsTrigger>
//           </TabsList>

//           {showFilters && (
//             <div className="flex items-center space-x-2">
//               {showSearch && (
//                 <div className="relative w-full max-w-sm">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="search"
//                     placeholder="Search templates..."
//                     className="pl-8"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//               )}

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="ml-auto">
//                     <SlidersHorizontal className="mr-2 h-4 w-4" />
//                     Filters
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>Filter Templates</DropdownMenuLabel>
//                   <DropdownMenuSeparator />

//                   <DropdownMenuGroup>
//                     <DropdownMenuLabel className="text-xs">Category</DropdownMenuLabel>
//                     <DropdownMenuRadioGroup
//                       value={category}
//                       onValueChange={(value) => setCategory(value as WorkflowCategory | "ALL")}
//                     >
//                       <DropdownMenuRadioItem value="ALL">All Categories</DropdownMenuRadioItem>
//                       {Object.values(WorkflowCategory).map((cat) => (
//                         <DropdownMenuRadioItem key={cat} value={cat}>
//                           {cat.replace(/_/g, " ")}
//                         </DropdownMenuRadioItem>
//                       ))}
//                     </DropdownMenuRadioGroup>
//                   </DropdownMenuGroup>

//                   <DropdownMenuSeparator />

//                   <DropdownMenuGroup>
//                     <DropdownMenuLabel className="text-xs">Complexity</DropdownMenuLabel>
//                     <DropdownMenuRadioGroup
//                       value={complexity}
//                       onValueChange={(value) => setComplexity(value as WorkflowComplexity | "ALL")}
//                     >
//                       <DropdownMenuRadioItem value="ALL">All Complexities</DropdownMenuRadioItem>
//                       {Object.values(WorkflowComplexity).map((comp) => (
//                         <DropdownMenuRadioItem key={comp} value={comp}>
//                           {comp.charAt(0) + comp.slice(1).toLowerCase()}
//                         </DropdownMenuRadioItem>
//                       ))}
//                     </DropdownMenuRadioGroup>
//                   </DropdownMenuGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           )}
//         </div>

//         <TabsContent value="all" className="space-y-6">
//           {Object.keys(templatesByCategory).length === 0 ? (
//             <div className="text-center py-12 bg-background rounded-lg border border-dashed">
//               {searchQuery ? (
//                 <div className="space-y-2">
//                   <p>No templates match your search</p>
//                   <Button variant="outline" onClick={() => setSearchQuery("")}>
//                     Clear Search
//                   </Button>
//                 </div>
//               ) : (
//                 <p>No templates available</p>
//               )}
//             </div>
//           ) : (
//             Object.entries(templatesByCategory).map(([category, templates]) => (
//               <div key={category} className="space-y-3">
//                 <h3 className="text-lg font-medium">{category.replace(/_/g, " ")}</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {templates.map((template) => (
//                     <TemplateCard key={template.id} template={template} />
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//         </TabsContent>

//         <TabsContent value="featured" className="space-y-6">
//           {filteredTemplates.length === 0 ? (
//             <div className="text-center py-12 bg-background rounded-lg border border-dashed">
//               <p>No featured templates available</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredTemplates.map((template) => (
//                 <TemplateCard key={template.id} template={template} />
//               ))}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="popular" className="space-y-6">
//           {filteredTemplates.length === 0 ? (
//             <div className="text-center py-12 bg-background rounded-lg border border-dashed">
//               <p>No popular templates available</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredTemplates.map((template) => (
//                 <TemplateCard key={template.id} template={template} />
//               ))}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="my-workflows" className="space-y-6">
//           {filteredTemplates.length === 0 ? (
//             <div className="text-center py-12 bg-background rounded-lg border border-dashed">
//               <p>You haven&apos;t created any workflows from templates yet</p>
//               <Button className="mt-4" onClick={() => router.push("/workflows/new")}>
//                 Create Your First Workflow
//               </Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredTemplates.map((template) => (
//                 <TemplateCard key={template.id} template={template} />
//               ))}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>

//       {totalTemplates > filteredTemplates.length && !searchQuery && activeTab === "all" && (
//         <div className="flex justify-center mt-4">
//           <Button variant="outline" onClick={() => router.push("/templates")}>
//             View All Templates
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { WorkflowCategory, WorkflowComplexity } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { TemplateCard } from "./template-card"

// Types for our component
interface TemplateListProps {
  title?: string
  description?: string
  limit?: number
  showFilters?: boolean
  showSearch?: boolean
  categoryFilter?: WorkflowCategory | "ALL"
  complexityFilter?: WorkflowComplexity | "ALL"
  featuredOnly?: boolean
  popularOnly?: boolean
}

// Types for our API response
interface TemplateListResponse {
  templates: Array<{
    id: string
    name: string
    description: string
    category: WorkflowCategory
    icon: string | null
    complexity: WorkflowComplexity
    estimatedSetupTime: number
    featured: boolean
    popular: boolean
    requiredIntegrations: string[]
    userWorkflows: string[]
    _count: {
      userWorkflows: number
    }
  }>
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export function TemplateList({
  title = "Workflow Templates",
  description = "Browse and select from our library of pre-built workflow templates",
  limit = 20,
  showFilters = true,
  showSearch = true,
  categoryFilter = "ALL",
  complexityFilter = "ALL",
  featuredOnly = false,
  popularOnly = false,
}: TemplateListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // States
  const [isLoading, setIsLoading] = useState(true)
  const [templates, setTemplates] = useState<TemplateListResponse["templates"]>([])
  const [totalTemplates, setTotalTemplates] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<WorkflowCategory | "ALL">(
    (searchParams.get("category") as WorkflowCategory | "ALL") || categoryFilter,
  )
  const [complexity, setComplexity] = useState<WorkflowComplexity | "ALL">(
    (searchParams.get("complexity") as WorkflowComplexity | "ALL") || complexityFilter,
  )
  const [featured, setFeatured] = useState<boolean | "ALL">(
    searchParams.has("featured") ? searchParams.get("featured") === "true" : featuredOnly ? true : "ALL",
  )
  const [popular, setPopular] = useState<boolean | "ALL">(
    searchParams.has("popular") ? searchParams.get("popular") === "true" : popularOnly ? true : "ALL",
  )
  const [activeTab, setActiveTab] = useState<string>("all")

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true)
      try {
        // Build query parameters
        const queryParams = new URLSearchParams()
        if (category !== "ALL") {
          queryParams.append("category", category)
        }
        if (complexity !== "ALL") {
          queryParams.append("complexity", complexity)
        }
        if (featured !== "ALL") {
          queryParams.append("featured", String(featured))
        }
        if (popular !== "ALL") {
          queryParams.append("popular", String(popular))
        }
        if (searchQuery) {
          queryParams.append("search", searchQuery)
        }
        queryParams.append("limit", limit.toString())

        // Fetch templates from API
        const response = await fetch(`/api/templates?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }

        const data: TemplateListResponse = await response.json()
        setTemplates(data.templates)
        setTotalTemplates(data.pagination.total)
      } catch (error) {
        console.error("Error fetching templates:", error)
        toast({
          title: "Error fetching templates",
          description: "Failed to load workflow templates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [limit, category, complexity, featured, popular, searchQuery])

  // Filter templates based on tab
  const getFilteredTemplates = () => {
    switch (activeTab) {
      case "featured":
        return templates.filter((template) => template.featured)
      case "popular":
        return templates.filter((template) => template.popular)
      case "my-workflows":
        return templates.filter((template) => template.userWorkflows.length > 0)
      default:
        return templates
    }
  }

  const filteredTemplates = getFilteredTemplates()

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    },
    {} as Record<string, typeof filteredTemplates>,
  )

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center justify-between my-4">
            {showSearch && <Skeleton className="h-10 w-64" />}
            <Skeleton className="h-10 w-32" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="my-workflows">My Workflows</TabsTrigger>
          </TabsList>

          {showFilters && (
            <div className="flex items-center space-x-2">
              {showSearch && (
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search templates..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter Templates</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs">Category</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={category}
                      onValueChange={(value: string) => setCategory(value as WorkflowCategory | "ALL")}
                    >
                      <DropdownMenuRadioItem value="ALL">All Categories</DropdownMenuRadioItem>
                      {Object.values(WorkflowCategory).map((cat) => (
                        <DropdownMenuRadioItem key={cat} value={cat}>
                          {cat.replace(/_/g, " ")}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs">Complexity</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={complexity}
                      onValueChange={(value: string) => setComplexity(value as WorkflowComplexity | "ALL")}
                    >
                      <DropdownMenuRadioItem value="ALL">All Complexities</DropdownMenuRadioItem>
                      {Object.values(WorkflowComplexity).map((comp) => (
                        <DropdownMenuRadioItem key={comp} value={comp}>
                          {comp.charAt(0) + comp.slice(1).toLowerCase()}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <TabsContent value="all" className="space-y-6">
          {Object.keys(templatesByCategory).length === 0 ? (
            <div className="text-center py-12 bg-background rounded-lg border border-dashed">
              {searchQuery ? (
                <div className="space-y-2">
                  <p>No templates match your search</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <p>No templates available</p>
              )}
            </div>
          ) : (
            Object.entries(templatesByCategory).map(([category, templates]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-medium">{category.replace(/_/g, " ")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-background rounded-lg border border-dashed">
              <p>No featured templates available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-background rounded-lg border border-dashed">
              <p>No popular templates available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-workflows" className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-background rounded-lg border border-dashed">
              <p>You haven&apos;t created any workflows from templates yet</p>
              <Button className="mt-4" onClick={() => router.push("/workflows/new")}>
                Create Your First Workflow
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {totalTemplates > filteredTemplates.length && !searchQuery && activeTab === "all" && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => router.push("/templates")}>
            View All Templates
          </Button>
        </div>
      )}
    </div>
  )
}
