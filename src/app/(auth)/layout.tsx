// import type React from "react"
// import { Suspense } from "react"
// import { Loader2 } from "lucide-react"

// export default function Layout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <main className="flex items-center justify-center min-h-screen p-6">
//         <div className="w-full max-w-md">
//           <Suspense
//             fallback={
//               <div className="flex flex-col items-center justify-center py-12">
//                 <Loader2 className="h-8 w-8 animate-spin text-foreground" />
//                 <span className="mt-4 text-muted-foreground">Loading...</span>
//               </div>
//             }
//           >
//             {children}
//           </Suspense>
//         </div>
//       </main>
//     </div>
//   )
// }

import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {/* Main background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')"
          }}
        />
        
        {/* Secondary overlay images for depth */}
        <div 
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat opacity-5 rotate-12"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80')"
          }}
        />
        
        <div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cover bg-center bg-no-repeat opacity-8 -rotate-6"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        
        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />
      </div>
      
      {/* Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Glass morphism card background */}
          <div className="backdrop-blur-sm bg-background/40 rounded-2xl border border-border/20 shadow-2xl p-1">
            <div className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/10">
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
          </div>
        </div>
      </main>
    </div>
  )
}