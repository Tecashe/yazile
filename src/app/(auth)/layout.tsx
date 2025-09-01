import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                <span className="mt-4 text-muted-foreground">Loading...</span>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  )
}