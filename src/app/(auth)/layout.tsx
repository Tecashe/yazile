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
import { Loader2, Instagram, Heart, MessageCircle, Bookmark, Send, Play } from "lucide-react"

const floatingCards = [
  {
    id: 1,
    type: "post",
    image: "/images/auth/post-coffee.jpg",
    likes: "12.4K",
    parallaxMultiplier: 0.5,
  },
  {
    id: 2,
    type: "post",
    image: "/images/auth/post-fashion.jpg",
    likes: "8.7K",
    parallaxMultiplier: -0.3,
  },
  {
    id: 3,
    type: "reel",
    image: "/images/auth/reel-dance.jpg",
    views: "234K",
    parallaxMultiplier: 0.4,
  },
  {
    id: 4,
    type: "post",
    image: "/images/auth/post-food.jpg",
    likes: "5.2K",
    parallaxMultiplier: -0.6,
  },
  {
    id: 5,
    type: "story",
    image: "/images/auth/story-travel.jpg",
    parallaxMultiplier: 0.2,
  },
  {
    id: 6,
    type: "post",
    image: "/images/auth/post-lifestyle.jpg",
    likes: "18.9K",
    parallaxMultiplier: -0.4,
  },
]

function FloatingCard({
  card,
  mousePosition,
  className,
  animationClass,
  delay,
}: {
  card: (typeof floatingCards)[0]
  mousePosition: { x: number; y: number }
  className: string
  animationClass: string
  delay: string
}) {
  const transformStyle = {
    transform: `translate(${mousePosition.x * card.parallaxMultiplier}px, ${mousePosition.y * card.parallaxMultiplier}px)`,
    animationDelay: delay,
  }

  if (card.type === "story") {
    return (
      <div className={`absolute ${className} ${animationClass}`} style={transformStyle}>
        <div className="p-1 bg-coral rounded-2xl shadow-2xl">
          <img
            src={card.image || "/placeholder.svg"}
            alt="Instagram Story"
            className="w-full aspect-[9/16] object-cover rounded-xl"
          />
        </div>
      </div>
    )
  }

  if (card.type === "reel") {
    return (
      <div className={`absolute ${className} ${animationClass}`} style={transformStyle}>
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              src={card.image || "/placeholder.svg"}
              alt="Instagram Reel"
              className="w-full aspect-[9/16] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-card/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-6 h-6 text-foreground fill-foreground ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-foreground/80 px-2 py-1 rounded-full">
              <span className="text-card text-xs font-medium">{card.views} views</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`absolute ${className} ${animationClass}`} style={transformStyle}>
      <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
        <img
          src={card.image || "/placeholder.svg"}
          alt="Instagram Post"
          className="w-full aspect-square object-cover"
        />
        <div className="p-3 flex items-center justify-between">
          <div className="flex gap-3">
            <Heart className="w-5 h-5 text-coral fill-coral animate-pulse" />
            <MessageCircle className="w-5 h-5 text-foreground" />
            <Send className="w-5 h-5 text-foreground" />
          </div>
          <Bookmark className="w-5 h-5 text-foreground" />
        </div>
        <p className="px-3 pb-3 text-sm font-medium text-foreground">{card.likes} likes</p>
      </div>
    </div>
  )
}

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
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-sky/20 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-coral/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-mint/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sunflower/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Floating Instagram Cards */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Card 1 - Top Left - Large Post */}
          <FloatingCard
            card={floatingCards[0]}
            mousePosition={mousePosition}
            className="top-16 left-[3%] w-44 md:w-56 lg:w-64"
            animationClass="animate-float"
            delay="0s"
          />

          {/* Card 2 - Top Right - Medium Post */}
          <FloatingCard
            card={floatingCards[1]}
            mousePosition={mousePosition}
            className="top-24 right-[5%] w-36 md:w-48 lg:w-56 hidden md:block"
            animationClass="animate-float-reverse"
            delay="0.5s"
          />

          {/* Card 3 - Bottom Left - Reel */}
          <FloatingCard
            card={floatingCards[2]}
            mousePosition={mousePosition}
            className="bottom-16 left-[5%] w-28 md:w-36 lg:w-44 hidden lg:block"
            animationClass="animate-bounce-subtle"
            delay="1s"
          />

          {/* Card 4 - Bottom Right - Post */}
          <FloatingCard
            card={floatingCards[3]}
            mousePosition={mousePosition}
            className="bottom-24 right-[3%] w-36 md:w-44 lg:w-52 hidden md:block"
            animationClass="animate-wave"
            delay="1.5s"
          />

          {/* Card 5 - Middle Right - Story */}
          <FloatingCard
            card={floatingCards[4]}
            mousePosition={mousePosition}
            className="top-1/2 -translate-y-1/2 right-[12%] w-20 md:w-28 lg:w-32 hidden xl:block"
            animationClass="animate-float"
            delay="2s"
          />

          {/* Card 6 - Middle Left - Additional Post */}
          <FloatingCard
            card={floatingCards[5]}
            mousePosition={mousePosition}
            className="top-[60%] left-[8%] w-32 md:w-40 hidden xl:block"
            animationClass="animate-float-reverse"
            delay="0.8s"
          />
        </div>
      )}

      {/* Center Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div
          className={`
            bg-card/95 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl 
            max-w-md w-full border border-border/50
            ${mounted ? "animate-slide-up" : "opacity-0"}
          `}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-coral rounded-2xl flex items-center justify-center animate-pulse-scale shadow-lg shadow-coral/30">
              <Instagram className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
              Your content, <span className="text-coral">automated</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Join 50,000+ creators who grow their Instagram on autopilot
            </p>
          </div>

          {/* Clerk Component Placeholder */}
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-coral" />
                <span className="mt-4 text-muted-foreground text-sm">Loading...</span>
              </div>
            }
          >
            {children}
          </Suspense>

          {/* Decorative dots */}
          <div className="mt-8 flex justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-coral animate-bounce-subtle"
                style={{
                  opacity: 1 - i * 0.15,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground/60 text-xs">
        Trusted by creators worldwide
      </div>
    </div>
  )
}
