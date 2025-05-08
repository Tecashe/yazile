"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { Clock, Zap, BarChart3 } from "lucide-react"
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



  // Handle view template detail
  const handleViewTemplate = () => {
    router.push(`/templates/${template.id}`)
  }

  // Handle create workflow from template
  const handleCreateWorkflow = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    router.push(`/workflows/new?templateId=${template.id}`)
  }

  // Format complexity for display
  const formatComplexity = (complexity: WorkflowComplexity) => {
    return complexity.charAt(0) + complexity.slice(1).toLowerCase()
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        template.featured && "border-primary/50 bg-primary/5",
      )}
      onClick={handleViewTemplate}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {showCategory && (
              <Badge variant="outline" className="mb-1">
                {template.category.replace(/_/g, " ")}
              </Badge>
            )}
            {template.featured && (
              <Badge variant="default" className="ml-2 mb-1">
                Featured
              </Badge>
            )}
            {template.popular && !template.featured && (
              <Badge variant="secondary" className="ml-2 mb-1">
                Popular
              </Badge>
            )}
          </div>
          {template.icon && <div className="text-2xl">{template.icon}</div>}
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{template.estimatedSetupTime} min setup</span>
          </div>
          <div className="flex items-center">
            <BarChart3 className="mr-1 h-4 w-4" />
            <span>{formatComplexity(template.complexity)}</span>
          </div>
        </div>

        {template.requiredIntegrations.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Required Integrations:</p>
            <div className="flex flex-wrap gap-1">
              {template.requiredIntegrations.map((integration) => (
                <Badge key={integration} variant="outline" className="text-xs">
                  {integration}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {showFooter && (
        <CardFooter className="pt-1 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {template._count?.userWorkflows || template.userWorkflows.length} workflows created
          </div>
          <Button size="sm" onClick={handleCreateWorkflow}>
            <Zap className="mr-1 h-3 w-3" />
            Use Template
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
