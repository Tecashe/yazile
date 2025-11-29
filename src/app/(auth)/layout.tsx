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
//         {/* Background Images with Subtle Movement */}
//         <div className="absolute inset-0 z-0">
//           {/* Main background image */}
//           <div 
//             className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 bg-float"
//             style={{
//               backgroundImage: "url('/images/bg-main.png')"
//             }}
//           />
          
//           {/* Secondary overlay images for depth */}
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

import { motion } from "framer-motion"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FEF3E2] relative overflow-hidden">
      {/* Floating Bento Grid Background */}
      <div className="absolute inset-0 p-8 pointer-events-none">
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
          {/* Large floating image - top left */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="col-span-4 row-span-3 rounded-3xl overflow-hidden animate-float shadow-xl"
          >
            <img
              src="/colorful-instagram-feed-grid-with-pink-and-orange-.jpg"
              alt="Instagram feed"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Stats card - floating */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-2 row-span-2 col-start-1 row-start-4 bg-[#FF6B6B] rounded-3xl p-6 animate-float-reverse shadow-xl flex flex-col justify-center"
          >
            <span className="text-5xl font-bold text-white">10x</span>
            <span className="text-white/80 text-sm mt-2">Growth Rate</span>
          </motion.div>

          {/* Phone mockup - top right area */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="col-span-3 row-span-4 col-start-10 row-start-1 rounded-3xl overflow-hidden animate-float-delay shadow-2xl"
          >
            <img
              src="/iphone-mockup-showing-instagram-analytics-dashboar.jpg"
              alt="Analytics"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Engagement card - bottom right */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-2 row-span-2 col-start-10 row-start-5 bg-[#4ECDC4] rounded-3xl p-6 animate-bounce-gentle shadow-xl flex flex-col justify-center"
          >
            <span className="text-4xl font-bold text-white">+847%</span>
            <span className="text-white/80 text-sm mt-2">Engagement</span>
          </motion.div>

          {/* Bottom left decorative */}
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="col-span-2 row-span-2 col-start-1 row-start-5 rounded-3xl overflow-hidden animate-wiggle shadow-xl"
          >
            <img
              src="/abstract-colorful-geometric-shapes-coral-and-mint.jpg"
              alt="Decorative"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Small floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="col-span-1 row-span-1 col-start-5 row-start-1 bg-[#FFE66D] rounded-full shadow-lg"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="col-span-1 row-span-1 col-start-9 row-start-6 bg-[#FF6B6B] rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Center Auth Card - wraps children (Clerk components) */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white"
        >
          {/* Badge */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Join 50,000+ creators
            </div>
          </motion.div>

          {/* Clerk component slot */}
          {children}
        </motion.div>
      </div>
    </div>
  )
}
