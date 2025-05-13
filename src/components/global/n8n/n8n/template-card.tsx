// "use client"

// import type React from "react"

// import { useRouter, usePathname } from "next/navigation"
// import { Clock, Zap, BarChart3 } from "lucide-react"
// import type { WorkflowCategory, WorkflowComplexity } from "@prisma/client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// interface TemplateCardProps {
//   template: {
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
//     _count?: {
//       userWorkflows: number
//     }
//   }
//   showCategory?: boolean
//   showFooter?: boolean
// }

// export function TemplateCard({ template, showCategory = true, showFooter = true }: TemplateCardProps) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group



//   // Handle view template detail
//   const handleViewTemplate = () => {
//     router.push(`/dashboard/${slug}/agents/templates/${template.id}`)
//   }

//   // Handle create workflow from template
//   const handleCreateWorkflow = (e: React.MouseEvent) => {
//     e.stopPropagation() // Prevent triggering the card click
//     router.push(`/dashboard/${slug}/agents/workflows/new?templateId=${template.id}`)
//   }

//   // Format complexity for display
//   const formatComplexity = (complexity: WorkflowComplexity) => {
//     return complexity.charAt(0) + complexity.slice(1).toLowerCase()
//   }

//   return (
//     <Card
//       className={cn(
//         "hover:shadow-md transition-shadow cursor-pointer",
//         template.featured && "border-primary/50 bg-primary/5",
//       )}
//       onClick={handleViewTemplate}
//     >
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-start">
//           <div>
//             {showCategory && (
//               <Badge variant="outline" className="mb-1">
//                 {template.category.replace(/_/g, " ")}
//               </Badge>
//             )}
//             {template.featured && (
//               <Badge variant="default" className="ml-2 mb-1">
//                 Featured
//               </Badge>
//             )}
//             {template.popular && !template.featured && (
//               <Badge variant="secondary" className="ml-2 mb-1">
//                 Popular
//               </Badge>
//             )}
//           </div>
//           {template.icon && <div className="text-2xl">{template.icon}</div>}
//         </div>
//         <CardTitle className="text-lg">{template.name}</CardTitle>
//         <CardDescription className="line-clamp-2">{template.description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <div className="flex items-center">
//             <Clock className="mr-1 h-4 w-4" />
//             <span>{template.estimatedSetupTime} min setup</span>
//           </div>
//           <div className="flex items-center">
//             <BarChart3 className="mr-1 h-4 w-4" />
//             <span>{formatComplexity(template.complexity)}</span>
//           </div>
//         </div>

//         {template.requiredIntegrations.length > 0 && (
//           <div className="mt-3">
//             <p className="text-xs text-muted-foreground mb-1">Required Integrations:</p>
//             <div className="flex flex-wrap gap-1">
//               {template.requiredIntegrations.map((integration) => (
//                 <Badge key={integration} variant="outline" className="text-xs">
//                   {integration}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}
//       </CardContent>
//       {showFooter && (
//         <CardFooter className="pt-1 flex justify-between items-center">
//           <div className="text-sm text-muted-foreground">
//             {template._count?.userWorkflows || template.userWorkflows.length} workflows created
//           </div>
//           <Button size="sm" onClick={handleCreateWorkflow}>
//             <Zap className="mr-1 h-3 w-3" />
//             Use Template
//           </Button>
//         </CardFooter>
//       )}
//     </Card>
//   )
// }


"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Clock, Zap, BarChart3, Star, Award, ArrowRight } from "lucide-react"
import type { WorkflowCategory, WorkflowComplexity } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TemplateCardProps {
  template: {
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
    _count?: {
      userWorkflows: number
    }
  }
  showCategory?: boolean
  showFooter?: boolean
}

export function TemplateCard({ template, showCategory = true, showFooter = true }: TemplateCardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group

  // Refs for animations
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [animateIn, setAnimateIn] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Animation on mount
  useEffect(() => {
    setAnimateIn(true)
  }, [])

  // Handle 3D effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setRotation({ x: rotateX, y: rotateY })
  }

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 })
  }

  // Handle view template detail
  const handleViewTemplate = () => {
    router.push(`/dashboard/${slug}/agents/templates/${template.id}`)
  }

  // Handle create workflow from template
  const handleCreateWorkflow = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    router.push(`/dashboard/${slug}/agents/workflows/new?templateId=${template.id}`)
  }

  // Format complexity for display
  const formatComplexity = (complexity: WorkflowComplexity) => {
    return complexity.charAt(0) + complexity.slice(1).toLowerCase()
  }

  // Get complexity color
  const getComplexityColor = (complexity: WorkflowComplexity) => {
    switch (complexity) {
      case "SIMPLE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      case "COMPLEX":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400"
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    }
  }

  // Get category color
  const getCategoryColor = (category: WorkflowCategory) => {
    switch (category) {
      case "MARKETING":
        return "from-blue-400/20 to-indigo-400/20 text-blue-600 dark:text-blue-300"
      case "SALES":
        return "from-emerald-400/20 to-green-400/20 text-emerald-600 dark:text-emerald-300"
      case "CUSTOMER_SUPPORT":
        return "from-purple-400/20 to-violet-400/20 text-purple-600 dark:text-purple-300"
      case "DATA_PROCESSING":
        return "from-cyan-400/20 to-sky-400/20 text-cyan-600 dark:text-cyan-300"
      case "DOCUMENT_MANAGEMENT":
        return "from-amber-400/20 to-yellow-400/20 text-amber-600 dark:text-amber-300"
      case "SOCIAL_MEDIA":
        return "from-pink-400/20 to-rose-400/20 text-pink-600 dark:text-pink-300"
      case "COMMUNICATION":
        return "from-teal-400/20 to-green-400/20 text-teal-600 dark:text-teal-300"
      case "INTEGRATION":
        return "from-blue-400/20 to-sky-400/20 text-blue-600 dark:text-blue-300"
      case "UTILITY":
        return "from-slate-400/20 to-gray-400/20 text-slate-600 dark:text-slate-300"
      case "CUSTOM":
        return "from-orange-400/20 to-amber-400/20 text-orange-600 dark:text-orange-300"
      default:
        return "from-gray-400/20 to-slate-400/20 text-gray-600 dark:text-gray-300"
    }
  }

  // Check if icon is a URL
  const isIconUrl = (icon: string | null): boolean => {
    if (!icon) return false
    return icon.startsWith("http") || icon.startsWith("https") || icon.startsWith("/")
  }

  // Get fallback icon if URL fails or no icon provided
  const getFallbackIcon = () => {
    // Default icons based on category
    switch (template.category) {
      case "MARKETING":
        return "📣"
      case "SALES":
        return "💰"
      case "CUSTOMER_SUPPORT":
        return "🎧"
      case "DATA_PROCESSING":
        return "📊"
      case "DOCUMENT_MANAGEMENT":
        return "📄"
      case "SOCIAL_MEDIA":
        return "📱"
      case "COMMUNICATION":
        return "💬"
      case "INTEGRATION":
        return "🔄"
      case "UTILITY":
        return "🛠️"
      case "CUSTOM":
        return "⚙️"
      default:
        return "📋"
    }
  }

  // Get a random image URL if the icon is not provided or fails to load
  const getRandomImageUrl = () => {
    const imageIds = [
      "Kd7Dj4jvwpw", // workflow
      "5fNmWej4tAA", // automation
      "iar-afB0QQw", // tech
      "m_HRfLhgABo", // data
      "QBpZGqEMsKg", // analytics
      "FO7JIlwjOtU", // business
      "npxXWgQ33ZQ", // marketing
    ]
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)]
    return `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&w=100&h=100&q=80`
  }

  // Use icon URL or fallback
  const iconUrl = template.icon && isIconUrl(template.icon) && !imageError ? template.icon : getRandomImageUrl()

  // Get category-specific card classes
  const getCategoryCardClasses = (category: WorkflowCategory) => {
    switch (category) {
      case "MARKETING":
        return "card-shape-marketing card-border-marketing"
      case "SALES":
        return "card-shape-sales card-border-sales"
      case "CUSTOMER_SUPPORT":
        return "card-shape-customer-support card-border-customer-support"
      case "DATA_PROCESSING":
        return "card-shape-data-processing card-border-data-processing"
      case "DOCUMENT_MANAGEMENT":
        return "card-shape-document card-border-document"
      case "SOCIAL_MEDIA":
        return "card-shape-social card-border-social"
      case "COMMUNICATION":
        return "card-shape-communication card-border-communication"
      case "INTEGRATION":
        return "card-shape-integration card-border-integration"
      case "UTILITY":
        return "card-shape-utility card-border-utility"
      case "CUSTOM":
        return "card-shape-custom card-border-custom"
      default:
        return ""
    }
  }

  return (
    <div
      className={cn(
        "group perspective-1000 transition-all duration-500",
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      style={{
        transitionDelay: `${Math.random() * 0.3}s`,
      }}
    >
      <Card
        ref={cardRef}
        className={cn(
          "relative overflow-hidden transition-all duration-300 border-2",
          "hover:shadow-xl dark:hover:shadow-primary/20",
          "transform-gpu backface-hidden",
          isHovered && "scale-[1.02] z-10",
          getCategoryCardClasses(template.category),
          "bg-card",
          "before:absolute before:inset-0 before:z-10 before:bg-gradient-to-br before:from-transparent before:to-primary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
          "after:absolute after:inset-0 after:z-10 after:bg-gradient-to-br after:from-white/5 after:via-transparent after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
        onClick={handleViewTemplate}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          resetRotation()
        }}
      >
        {/* Animated gradient border effect for featured templates */}

        {/* Popular badge with animation */}
        {template.popular && (
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <Award
                className={cn(
                  "h-5 w-5 text-amber-500 transition-transform duration-500",
                  isHovered ? "scale-125" : "scale-100",
                )}
              />
            </div>
          </div>
        )}

        {/* Featured star with animation */}
        {template.featured && (
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <Star
                className={cn(
                  "h-5 w-5 text-primary transition-transform duration-500",
                  isHovered ? "scale-125" : "scale-100",
                )}
              />
            </div>
          </div>
        )}

        <CardHeader className="pb-2 relative z-20">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-1.5">
              {showCategory && (
                <Badge
                  variant="outline"
                  className={cn(
                    "mb-1 transition-all duration-300 bg-gradient-to-r",
                    getCategoryColor(template.category),
                    isHovered ? "border-primary/30" : "",
                  )}
                >
                  {template.category.replace(/_/g, " ")}
                </Badge>
              )}
            </div>

            {/* Icon container with fancy styling */}
            <div
              className={cn(
                "relative h-12 w-12 rounded-lg overflow-hidden transition-all duration-500",
                "bg-gradient-to-br",
                getCategoryColor(template.category),
                "shadow-md",
                isHovered ? "scale-110 rotate-3" : "",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
              )}
            >
              {isIconUrl(template.icon) && !imageError ? (
                <Image
                  src={iconUrl || "/placeholder.svg"}
                  alt={template.name}
                  width={48}
                  height={48}
                  className="object-cover h-full w-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl">{getFallbackIcon()}</div>
              )}

              {/* Animated overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10",
                  "opacity-0 transition-opacity duration-300",
                  isHovered ? "opacity-100" : "",
                )}
              ></div>
            </div>
          </div>
          <CardTitle className={cn("text-lg mt-2 transition-all duration-300", isHovered ? "text-primary" : "")}>
            {template.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 mt-1 relative">
            {template.description}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-card to-transparent opacity-0",
                isHovered ? "opacity-30" : "",
              )}
            ></div>
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-20">
          <div className="flex items-center justify-between text-sm">
            <div
              className={cn(
                "flex items-center px-2 py-1 rounded-md transition-all duration-300",
                isHovered ? "bg-muted/50" : "",
              )}
            >
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{template.estimatedSetupTime} min setup</span>
            </div>
            <div className={cn("flex items-center px-2 py-1 rounded-md", getComplexityColor(template.complexity))}>
              <BarChart3 className="mr-1 h-4 w-4" />
              <span>{formatComplexity(template.complexity)}</span>
            </div>
          </div>

          {template.requiredIntegrations.length > 0 && (
            <div
              className={cn(
                "mt-3 transition-all duration-300",
                isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-90",
              )}
            >
              <p className="text-xs text-muted-foreground mb-1">Required Integrations:</p>
              <div className="flex flex-wrap gap-1">
                {template.requiredIntegrations.map((integration, index) => (
                  <Badge
                    key={integration}
                    variant="outline"
                    className={cn(
                      "text-xs transition-all duration-300",
                      isHovered ? "bg-muted/50" : "",
                      // Add subtle different colors to each integration badge
                      index % 5 === 0
                        ? "border-blue-200 dark:border-blue-800"
                        : index % 5 === 1
                          ? "border-green-200 dark:border-green-800"
                          : index % 5 === 2
                            ? "border-purple-200 dark:border-purple-800"
                            : index % 5 === 3
                              ? "border-amber-200 dark:border-amber-800"
                              : "border-teal-200 dark:border-teal-800",
                    )}
                  >
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {showFooter && (
          <CardFooter
            className={cn(
              "pt-1 flex justify-between items-center relative z-20",
              "before:absolute before:left-4 before:right-4 before:top-0 before:h-px before:bg-border",
            )}
          >
            <div className="text-sm text-muted-foreground flex items-center">
              <div
                className={cn(
                  "h-2 w-2 rounded-full mr-2 transition-all duration-300",
                  template._count?.userWorkflows || template.userWorkflows.length > 0
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                )}
              ></div>
              <span>{template._count?.userWorkflows || template.userWorkflows.length} workflows</span>
            </div>
            <Button
              size="sm"
              className={cn(
                "transition-all duration-300 group/button bg-gradient-to-r",
                isHovered
                  ? "from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  : "from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90",
              )}
              onClick={handleCreateWorkflow}
            >
              <Zap className={cn("mr-1 h-3 w-3 transition-all duration-300", isHovered ? "animate-pulse" : "")} />
              <span>Use Template</span>
              <ArrowRight
                className={cn(
                  "ml-1 h-3 w-3 transition-all duration-300 opacity-0 -translate-x-2",
                  isHovered ? "opacity-100 translate-x-0" : "",
                )}
              />
            </Button>
          </CardFooter>
        )}

        {/* Hover overlay effect */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 pointer-events-none",
            isHovered ? "opacity-100" : "",
          )}
        ></div>
      </Card>
    </div>
  )
}
