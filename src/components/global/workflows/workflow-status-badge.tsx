import type { WorkflowStatus } from "@prisma/client"
import { AlertCircle, Cog, FileCode, Pause, Power, ThumbsUp } from "lucide-react"
import { Badge, type BadgeProps } from "@/components/ui/badge"

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
  isActive?: boolean
  size?: "sm" | "default" | "lg"
}

export function WorkflowStatusBadge({ status, isActive, size = "default" }: WorkflowStatusBadgeProps) {
  let variant: BadgeProps["variant"] = "outline"
  let label = status
  let Icon = null

  // Determine badge styling based on status
  switch (status) {
    case "DRAFT":
      variant = "outline"
      Icon = FileCode
      break
    case "CONFIGURING":
      variant = "outline"
      Icon = Cog
      break
    case "READY":
      variant = "secondary"
      Icon = ThumbsUp
      break
    case "ACTIVE":
      variant = "default"
      Icon = isActive ? Power : Pause
      break
    case "INACTIVE":
      variant = "secondary"
      Icon = Pause
      break
    case "ERROR":
      variant = "destructive"
      Icon = AlertCircle
      break
    case "ARCHIVED":
      variant = "outline"
      break
  }

  // Override label if inactive but status is ACTIVE
  if (status === "ACTIVE" && isActive === false) {
    label = "INACTIVE"
    variant = "secondary"
    Icon = Pause
  }

  // Size-specific classes
  const sizeClasses = {
    sm: "text-xs py-0 px-2",
    default: "",
    lg: "text-sm py-1",
  }

  return (
    <Badge variant={variant} className={sizeClasses[size]}>
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  )
}
