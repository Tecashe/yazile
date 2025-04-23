// import type React from "react"
// import { Suspense } from "react"
// import type { Metadata } from "next"
// import { ThemeProvider } from "@/providers/theme-provider"
// import { Particles } from "@/components/ui/particles"
// import { cn } from "@/lib/utils"
// import { Montserrat } from "next/font/google"
// import { Loader2 } from "lucide-react"

// const montserrat = Montserrat({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Yazil | Onboarding",
//   description: "Complete your profile and get started with dm automation",
// }

// export default function OnboardingLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
//       <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 z-0 opacity-30">
//           <Particles className="absolute inset-0" quantity={300} staticity={30} />
//         </div>

//         {/* Floating geometric shapes */}
//         <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />

//         {/* Glowing lines */}
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
//         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

//         {/* Content container */}
//         <div className="relative z-10 flex min-h-screen">
//           {/* Left sidebar with brand elements */}
//           <div className="hidden lg:flex w-1/3 bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
//             <div>
//               <div className="flex items-center space-x-2 mb-12">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">Y</span>
//                 </div>
//                 <h1 className={cn("text-2xl font-bold text-white", montserrat.className)}>Yazil</h1>
//               </div>

//               <h2 className={cn("text-3xl font-bold text-white mb-4", montserrat.className)}>
//                 Welcome to the future of collaboration
//               </h2>
//               <p className="text-gray-300 mb-6">
//                 Complete your profile to unlock the full potential of our platform. We&apos;re excited to have you on board.
//               </p>

//               {/* Testimonial */}
//               <div className="mt-12 bg-white/5 p-6 rounded-xl border border-white/10">
//                 <p className="text-gray-300 italic mb-4">
//                   &ldquo;This platform transformed how our team works together. The onboarding was smooth and the features are
//                   incredible.&rdquo;
//                 </p>
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400"></div>
//                   <div className="ml-3">
//                     <p className="text-white font-medium">Lady Cashe</p>
//                     <p className="text-gray-400 text-sm">Product Manager, Vavi Crotchets Ltd</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="text-gray-400 text-sm">
//               <p>© 2025 Yazil. All rights reserved.</p>
//               {/* <div className="flex space-x-4 mt-2">
//                 <a href="#" className="hover:text-white transition-colors">
//                   Terms
//                 </a>
//                 <a href="#" className="hover:text-white transition-colors">
//                   Privacy
//                 </a>
//                 <a href="#" className="hover:text-white transition-colors">
//                   Help
//                 </a>
//               </div> */}
//             </div>
//           </div>

//           {/* Main content area */}
//           <div className="flex-1 flex flex-col">
//             {/* Animated progress bar at the top */}
//             <div className="h-1 bg-gray-800 w-full">
//               <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"></div>
//             </div>

//             <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
//               <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
//                 <Suspense
//                   fallback={
//                     <div className="flex items-center justify-center min-h-[600px]">
//                       <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
//                       <span className="ml-2 text-white">Loading your experience...</span>
//                     </div>
//                   }
//                 >
//                   {children}
//                 </Suspense>
//               </div>
//             </main>

//             {/* Floating help button */}
//             <div className="fixed bottom-6 right-6 z-50">
//               <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30">
//                 <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">?</span>
//                 <span className="hidden group-hover:inline">Need help?</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ThemeProvider>
//   )
// }


// import type React from "react"
// import { Suspense, useState, useEffect } from "react"
// import type { Metadata } from "next"
// import { ThemeProvider } from "@/providers/theme-provider"
// import { Particles } from "@/components/ui/particles"
// import { cn } from "@/lib/utils"
// import { motion, AnimatePresence } from "framer-motion"
// import { Server, Bot, Clock, ChartLine, Infinity } from "lucide-react"
// import { Loader2 } from "lucide-react"

// // Use standard web font instead of Next.js font
// const montserratClassName = "font-sans" // Using the default font from Tailwind config

// const slides = [
//   {
//     title: "Workflow Automation",
//     description:
//       "Eliminate repetitive tasks and focus on what truly matters. Our platform streamlines your workflow.",
//     icon: <Clock size={48} className="text-white" />,
//     color: "from-indigo-500 to-purple-600",
//     stats: "Save up to 15 hours per week",
//   },
//   {
//     title: "Smart Integrations",
//     description:
//       "Connect seamlessly with your favorite tools. Everything works together in perfect harmony.",
//     icon: <Infinity size={48} className="text-white" />,
//     color: "from-blue-500 to-cyan-400",
//     stats: "200+ integrations available",
//   },
//   {
//     title: "AI-Powered Insights",
//     description:
//       "Leverage machine learning to uncover patterns and make data-driven decisions.",
//     icon: <Bot size={48} className="text-white" />,
//     color: "from-emerald-500 to-teal-400",
//     stats: "30% better decision making",
//   },
//   {
//     title: "Scalable Architecture",
//     description:
//       "Built for growth. Our platform handles your needs whether you're a startup or enterprise.",
//     icon: <Server size={48} className="text-white" />,
//     color: "from-amber-500 to-orange-400",
//     stats: "99.9% uptime guaranteed",
//   },
//   {
//     title: "Performance Analytics",
//     description:
//       "Measure the impact of automation with comprehensive dashboards and reports.",
//     icon: <ChartLine size={48} className="text-white" />,
//     color: "from-pink-500 to-rose-400",
//     stats: "Track ROI in real-time",
//   },
// ];

// export const metadata: Metadata = {
//   title: "Yazil | Onboarding",
//   description: "Complete your profile and get started with dm automation",
// }

// // Animation slide component
// const AutomationSlide = ({ slide }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       transition={{ duration: 0.5 }}
//       className="absolute inset-0"
//     >
//       <div className={`h-full p-6 rounded-xl bg-gradient-to-br ${slide.color} bg-opacity-10`}>
//         <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-4">
//           {slide.icon}
//         </div>
//         <h3 className="text-xl font-bold text-white mb-2">{slide.title}</h3>
//         <p className="text-gray-300 mb-4">{slide.description}</p>
//         <div className="mt-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
//           <p className="text-white font-semibold">{slide.stats}</p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default function OnboardingLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
//       <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 z-0 opacity-30">
//           <Particles className="absolute inset-0" quantity={300} staticity={30} />
//         </div>

//         {/* Floating geometric shapes */}
//         <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />

//         {/* Glowing lines */}
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
//         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

//         {/* Content container */}
//         <div className="relative z-10 flex min-h-screen">
//           {/* Left sidebar with brand elements */}
//           <div className="hidden lg:flex w-1/3 bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
//             <div>
//               <div className="flex items-center space-x-2 mb-12">
//                 <motion.div
//                   initial={{ rotate: -10 }}
//                   animate={{ rotate: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
//                 >
//                   <span className="text-white font-bold text-xl">Y</span>
//                 </motion.div>
//                 <motion.h1
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2, duration: 0.5 }}
//                   className={cn("text-2xl font-bold text-white", montserratClassName)}
//                 >
//                   Yazil
//                 </motion.h1>
//               </div>

//               <motion.h2
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4, duration: 0.7 }}
//                 className={cn("text-3xl font-bold text-white mb-4", montserratClassName)}
//               >
//                 Automation that works for you
//               </motion.h2>

//               {/* Animated slides */}
//               <div className="relative h-[320px] mt-8">
//                 <AnimatePresence mode="wait">
//                   <AutomationSlide key={currentSlide} slide={slides[currentSlide]} />
//                 </AnimatePresence>
//               </div>

//               {/* Progress indicators */}
//               <div className="flex justify-center space-x-2 mt-6">
//                 {slides.map((_, index) => (
//                   <motion.button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={cn(
//                       "w-2 h-2 rounded-full transition-all",
//                       index === currentSlide ? "w-8 bg-white" : "bg-white/30"
//                     )}
//                     animate={{ width: index === currentSlide ? 32 : 8 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Copyright information */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8, duration: 0.5 }}
//               className="text-gray-400 text-sm"
//             >
//               <p>© 2025 Yazil. All rights reserved.</p>
//             </motion.div>
//           </div>

//           {/* Main content area */}
//           <div className="flex-1 flex flex-col">
//             {/* Animated progress bar at the top */}
//             <div className="h-1 bg-gray-800 w-full">
//               <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"></div>
//             </div>

//             <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
//               <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
//                 <Suspense
//                   fallback={
//                     <div className="flex items-center justify-center min-h-[600px]">
//                       <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
//                       <span className="ml-2 text-white">Loading your experience...</span>
//                     </div>
//                   }
//                 >
//                   {children}
//                 </Suspense>
//               </div>
//             </main>

//             {/* Floating help button */}
//             <div className="fixed bottom-6 right-6 z-50">
//               <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30">
//                 <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">?</span>
//                 <span className="hidden group-hover:inline">Need help?</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ThemeProvider>
//   )
// }

// import React, { useState, useEffect } from "react";
// import { AnimatePresence } from "framer-motion";
// import { Server, Bot, Clock, ChartLine, Infinity } from "lucide-react";
// import { Loader2 } from "lucide-react";
// import { AutomationSlide } from "@/components/global/onboarding/AuomationSlide";
// import { GlowingConnections } from "@/components/global/onboarding/GlowingConnections";
// import { cn } from "@/lib/utils";

// // Use standard web font instead of Next.js font
// const montserratClassName = "font-sans"; // Using the default font from Tailwind config

// const slides = [
//   {
//     title: "Workflow Automation",
//     description: "Eliminate repetitive tasks and focus on what truly matters. Our platform streamlines your workflow.",
//     icon: <Clock size={48} className="text-white" />,
//     color: "from-indigo-500 to-purple-600",
//     stats: "Save up to 15 hours per week",
//   },
//   // ... keep existing code (slides array items)
// ];

// export default function Layout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
//       {/* ... keep existing code (background particles and shapes) */}

//       <div className="relative z-10 flex min-h-screen">
//         {/* Left sidebar with animations */}
//         <div className="hidden lg:flex w-1/3 bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
//           <div>
//             {/* Brand header */}
//             <div className="flex items-center space-x-2 mb-12">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">Y</span>
//               </div>
//               <h1 className={cn("text-2xl font-bold text-white", montserratClassName)}>
//                 Yazil
//               </h1>
//             </div>

//             {/* Animated slides section */}
//             <div className="relative h-[400px] mb-8">
//               <AnimatePresence>
//                 {slides.map((slide, index) => (
//                   <AutomationSlide
//                     key={index}
//                     {...slide}
//                     index={index}
//                     active={currentSlide === index}
//                     total={slides.length}
//                   />
//                 ))}
//               </AnimatePresence>
              
//               <GlowingConnections
//                 currentSlide={currentSlide}
//                 totalSlides={slides.length}
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-gray-400 text-sm">
//             <p>© 2025 Yazil. All rights reserved.</p>
//           </div>
//         </div>

//         {/* ... keep existing code (main content area) */}
//       </div>
//     </div>
//   );
// }

'use client'

import { Suspense } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Loader2 } from "lucide-react";
import { AutomationSlide } from "@/components/global/onboarding/AuomationSlide";
import { GlowingConnections } from "@/components/global/onboarding/GlowingConnections";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Server, Bot, Clock, ChartLine, Infinity } from "lucide-react";

const slides = [
  {
    title: "Workflow Automation",
    description: "Eliminate repetitive tasks and focus on what truly matters. Our platform streamlines your workflow.",
    icon: <Clock size={48} className="text-white" />,
    color: "from-indigo-500 to-purple-600",
    stats: "Save up to 15 hours per week",
  },
  {
    title: "Smart Integrations",
    description:
      "Connect seamlessly with your favorite tools. Everything works together in perfect harmony.",
    icon: <Infinity size={48} className="text-white" />,
    color: "from-blue-500 to-cyan-400",
    stats: "200+ integrations available",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Leverage machine learning to uncover patterns and make data-driven decisions.",
    icon: <Bot size={48} className="text-white" />,
    color: "from-emerald-500 to-teal-400",
    stats: "30% better decision making",
  },
  {
    title: "Scalable Architecture",
    description:
      "Built for growth. Our platform handles your needs whether you're a startup or enterprise.",
    icon: <Server size={48} className="text-white" />,
    color: "from-amber-500 to-orange-400",
    stats: "99.9% uptime guaranteed",
  },
  {
    title: "Performance Analytics",
    description:
      "Measure the impact of automation with comprehensive dashboards and reports.",
    icon: <ChartLine size={48} className="text-white" />,
    color: "from-pink-500 to-rose-400",
    stats: "Track ROI in real-time",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Glowing lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="relative z-10 flex min-h-screen">
        {/* Left sidebar with brand elements */}
        <div className="hidden lg:flex w-1/3 bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Yazil</h1>
            </div>

            {/* Animated slides section */}
            <div className="relative h-[400px] mb-8">
              {slides.map((slide, index) => (
                <AutomationSlide
                  key={index}
                  title={slide.title}
                  description={slide.description}
                  icon={slide.icon}
                  color={slide.color}
                  stats={slide.stats}
                  index={index}
                  active={currentSlide === index}
                  total={slides.length}
                />
              ))}
              
              <GlowingConnections
                currentSlide={currentSlide}
                totalSlides={slides.length}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-gray-400 text-sm">
            <p>© 2025 Yazil. All rights reserved.</p>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Animated progress bar at the top */}
          <div className="h-1 bg-gray-800 w-full">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"></div>
          </div>

          <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[600px]">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <span className="ml-2 text-white">Loading your experience...</span>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </main>

          {/* Floating help button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30">
              <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">?</span>
              <span className="hidden group-hover:inline">Need help?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
