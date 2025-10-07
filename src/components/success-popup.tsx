"use client"

import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SuccessPopupProps {
  show: boolean
  onClose: () => void
  message?: string
}

export function SuccessPopup({ show, onClose, message = "Success!" }: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto rounded-lg border bg-background p-4 shadow-lg transition-all duration-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        )}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}
