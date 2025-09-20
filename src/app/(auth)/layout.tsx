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

"use client"

import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Global CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(12deg); }
          50% { transform: translateY(8px) translateX(-5px) rotate(12deg); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(-6deg); }
          50% { transform: translateX(5px) translateY(-5px) rotate(-6deg); }
        }
        
        .bg-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .bg-float-reverse {
          animation: floatReverse 25s ease-in-out infinite;
        }
        
        .bg-float-slow {
          animation: floatSlow 30s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Background Images with Subtle Movement */}
        <div className="absolute inset-0 z-0">
          {/* Main background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 bg-float"
            style={{
              backgroundImage: "url('/images/bg-main.jpg')"
            }}
          />
          
          {/* Secondary overlay images for depth */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat opacity-15 rotate-12 bg-float-reverse"
            style={{
              backgroundImage: "url('/images/bg-secondary.jpg')"
            }}
          />
          
          <div 
            className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cover bg-center bg-no-repeat opacity-20 -rotate-6 bg-float-slow"
            style={{
              backgroundImage: "url('/images/bg-accent.jpg')"
            }}
          />
          
          {/* Subtle gradient for depth without blocking content */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-transparent" />
        </div>
        
        {/* Content - No background wrapping */}
        <main className="relative z-10 flex items-center justify-center min-h-screen p-6">
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
    </>
  )
}