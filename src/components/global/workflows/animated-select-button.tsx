"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AnimatedSelectButtonProps {
  onClick?: () => void
  className?: string
}

export function AnimatedSelectButton({ onClick, className }: AnimatedSelectButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={cn("relative", className)}
    >
      <Button
        onClick={onClick}
        size="sm"
        className="shadow-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-1" />
        <span className="relative">
          Select Template
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/40 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </span>
      </Button>
      <div className="absolute -inset-px rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 blur-sm group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
    </motion.div>
  )
}
