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

// "use client"

// import type React from "react"
// import { Suspense } from "react"
// import { Loader2 } from "lucide-react"

// export default function Layout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <>
//       {/* Global CSS animations */}
//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) scale(1); }
//           50% { transform: translateY(-10px) scale(1.02); }
//         }
        
//         @keyframes floatReverse {
//           0%, 100% { transform: translateY(0px) translateX(0px) rotate(12deg); }
//           50% { transform: translateY(8px) translateX(-5px) rotate(12deg); }
//         }
        
//         @keyframes floatSlow {
//           0%, 100% { transform: translateX(0px) translateY(0px) rotate(-6deg); }
//           50% { transform: translateX(5px) translateY(-5px) rotate(-6deg); }
//         }
        
//         .bg-float {
//           animation: float 20s ease-in-out infinite;
//         }
        
//         .bg-float-reverse {
//           animation: floatReverse 25s ease-in-out infinite;
//         }
        
//         .bg-float-slow {
//           animation: floatSlow 30s ease-in-out infinite;
//         }
//       `}</style>

//       <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
       
//         <div className="absolute inset-0 z-0">
        
//           <div 
//             className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 bg-float"
//             style={{
//               backgroundImage: "url('/images/bg-main.jpg')"
//             }}
//           />
          
      
//           <div 
//             className="absolute top-0 right-0 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat opacity-15 rotate-12 bg-float-reverse"
//             style={{
//               backgroundImage: "url('/images/bg-secondary.png')"
//             }}
//           />
          
//           <div 
//             className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cover bg-center bg-no-repeat opacity-20 -rotate-6 bg-float-slow"
//             style={{
//               backgroundImage: "url('/images/bg-accent.png')"
//             }}
//           />
          
//           {/* Subtle gradient for depth without blocking content */}
//           <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-transparent" />
//         </div>
        
//         {/* Content - No background wrapping */}
//         <main className="relative z-10 flex items-center justify-center min-h-screen p-6">
//           <div className="w-full max-w-md">
//             <Suspense
//               fallback={
//                 <div className="flex flex-col items-center justify-center py-12">
//                   <Loader2 className="h-8 w-8 animate-spin text-foreground" />
//                   <span className="mt-4 text-muted-foreground">Loading...</span>
//                 </div>
//               }
//             >
//               {children}
//             </Suspense>
//           </div>
//         </main>
//       </div>
//     </>
//   )
// }


"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { Loader2, Instagram } from "lucide-react"

const bentoImages = [
  { id: 1, image: "/images/auth/post-coffee.jpg", parallax: 0.4 },
  { id: 2, image: "/images/auth/post-fashion.jpg", parallax: -0.3 },
  { id: 3, image: "/images/auth/reel-dance.jpg", parallax: 0.5 },
  { id: 4, image: "/images/auth/post-food.jpg", parallax: -0.4 },
  { id: 5, image: "/images/auth/story-travel.jpg", parallax: 0.3 },
  { id: 6, image: "/images/auth/post-lifestyle.jpg", parallax: -0.5 },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const getParallaxStyle = (parallax: number, delay: string) => ({
    transform: `translate(${mousePosition.x * parallax}px, ${mousePosition.y * parallax}px)`,
    animationDelay: delay,
  })

  return (
    <div className="h-screen bg-sky/20 relative overflow-hidden flex">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-coral/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-mint/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sunflower/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <div
          className={`
            grid grid-cols-3 grid-rows-3 gap-4 w-full max-w-2xl h-[85vh]
            ${mounted ? "animate-slide-up" : "opacity-0"}
          `}
        >
          {/* Large featured image - spans 2 cols, 2 rows */}
          <div
            className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl animate-float"
            style={getParallaxStyle(bentoImages[0].parallax, "0s")}
          >
            <img
              src={bentoImages[0].image || "/placeholder.svg"}
              alt="Featured content"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Top right - square */}
          <div
            className="rounded-3xl overflow-hidden shadow-xl animate-float-reverse"
            style={getParallaxStyle(bentoImages[1].parallax, "0.2s")}
          >
            <img
              src={bentoImages[1].image || "/placeholder.svg"}
              alt="Content preview"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Middle right - square */}
          <div
            className="rounded-3xl overflow-hidden shadow-xl animate-bounce-subtle"
            style={getParallaxStyle(bentoImages[2].parallax, "0.4s")}
          >
            <img
              src={bentoImages[2].image || "/placeholder.svg"}
              alt="Content preview"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Bottom left - square */}
          <div
            className="rounded-3xl overflow-hidden shadow-xl animate-wave"
            style={getParallaxStyle(bentoImages[3].parallax, "0.6s")}
          >
            <img
              src={bentoImages[3].image || "/placeholder.svg"}
              alt="Content preview"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Bottom middle - square */}
          <div
            className="rounded-3xl overflow-hidden shadow-xl animate-float"
            style={getParallaxStyle(bentoImages[4].parallax, "0.8s")}
          >
            <img
              src={bentoImages[4].image || "/placeholder.svg"}
              alt="Content preview"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Bottom right - square */}
          <div
            className="rounded-3xl overflow-hidden shadow-xl animate-float-reverse"
            style={getParallaxStyle(bentoImages[5].parallax, "1s")}
          >
            <img
              src={bentoImages[5].image || "/placeholder.svg"}
              alt="Content preview"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div
          className={`
            bg-card/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl 
            w-full max-w-md border border-border/50
            ${mounted ? "animate-slide-up" : "opacity-0"}
          `}
          style={{ animationDelay: "0.2s" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-coral rounded-2xl flex items-center justify-center animate-pulse-scale shadow-lg shadow-coral/30">
              <Instagram className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Clerk Component */}
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-coral" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>

      {mounted && (
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div
            className="absolute top-8 left-4 w-32 h-32 rounded-2xl overflow-hidden shadow-xl animate-float opacity-60"
            style={getParallaxStyle(0.3, "0s")}
          >
            <img src={bentoImages[0].image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute top-16 right-4 w-28 h-28 rounded-2xl overflow-hidden shadow-xl animate-float-reverse opacity-60"
            style={getParallaxStyle(-0.4, "0.3s")}
          >
            <img src={bentoImages[1].image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute bottom-20 left-6 w-24 h-24 rounded-2xl overflow-hidden shadow-xl animate-bounce-subtle opacity-60"
            style={getParallaxStyle(0.5, "0.6s")}
          >
            <img src={bentoImages[2].image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute bottom-12 right-8 w-28 h-28 rounded-2xl overflow-hidden shadow-xl animate-wave opacity-60"
            style={getParallaxStyle(-0.3, "0.9s")}
          >
            <img src={bentoImages[3].image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  )
}
