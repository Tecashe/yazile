"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type Props = {
  state: boolean
  children?: React.ReactNode
  className?: string
}

const Loader = ({ state, children, className }: Props) => {
  return state ? (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className="animate-spin" size={20} />
    </div>
  ) : (
    children
  )
}

export default Loader
