import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Workflow Templates",
  description: "Manage workflow templates for your application",
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
