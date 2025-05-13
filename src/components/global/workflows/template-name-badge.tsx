"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TemplateNameBadgeProps {
  name: string
  category: string
  className?: string
}

export function TemplateNameBadge({ name, category, className }: TemplateNameBadgeProps) {
  // Get a color based on the category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MARKETING":
        return "from-blue-500 to-indigo-500"
      case "SALES":
        return "from-emerald-500 to-green-500"
      case "CUSTOMER_SUPPORT":
        return "from-purple-500 to-violet-500"
      case "DATA_PROCESSING":
        return "from-cyan-500 to-sky-500"
      case "DOCUMENT_MANAGEMENT":
        return "from-amber-500 to-yellow-500"
      case "SOCIAL_MEDIA":
        return "from-pink-500 to-rose-500"
      case "COMMUNICATION":
        return "from-teal-500 to-green-500"
      case "INTEGRATION":
        return "from-indigo-500 to-blue-500"
      case "UTILITY":
        return "from-slate-500 to-gray-500"
      case "CUSTOM":
        return "from-orange-500 to-amber-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.05, y: -2 }} className={className}>
      <Badge
        variant="outline"
        className={cn(
          "px-2.5 py-1 font-medium text-white shadow-md",
          "bg-gradient-to-r",
          getCategoryColor(category),
          "border-none relative overflow-hidden",
        )}
      >
        <span className="relative z-10">{name}</span>
        <span className="absolute inset-0 bg-white mix-blend-overlay opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
      </Badge>
    </motion.div>
  )
}
