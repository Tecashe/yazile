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

  // Get category icon
  const getCategoryIcon = () => {
    if (template.icon) return template.icon

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
          template.featured
            ? "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10"
            : "hover:border-primary/20 bg-card",
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
        {template.featured && (
          <div className="absolute inset-0 z-0 opacity-30 overflow-hidden rounded-[inherit]">
            <div className="absolute inset-0 z-0 shimmerBorder rounded-[inherit]"></div>
          </div>
        )}

        {/* Popular badge with animation */}
        {template.popular && (
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <Award
                className={cn(
                  "h-5 w-5 text-amber-500 transition-transform duration-500",
                  isHovered ? "scale-125" : "scale-100",
                  "animate-pulse",
                )}
              />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
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
                  "animate-pulse",
                )}
              />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-primary animate-ping"></span>
            </div>
          </div>
        )}

        <CardHeader className="pb-2 relative z-20">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-1.5">
              {showCategory && (
                <Badge
                  variant="outline"
                  className={cn("mb-1 transition-all duration-300", isHovered ? "bg-primary/10 border-primary/30" : "")}
                >
                  {template.category.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
            <div
              className={cn(
                "text-2xl transition-all duration-500 bg-muted/50 h-10 w-10 rounded-full flex items-center justify-center",
                isHovered ? "scale-110 rotate-12 bg-primary/10" : "",
              )}
            >
              {getCategoryIcon()}
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
                {template.requiredIntegrations.map((integration) => (
                  <Badge
                    key={integration}
                    variant="outline"
                    className={cn("text-xs transition-all duration-300", isHovered ? "bg-muted/50" : "")}
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
                "transition-all duration-300 group/button",
                isHovered ? "bg-primary hover:bg-primary/90" : "",
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
