import type React from "react"
import type { Metadata } from "next"


export default function EmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

