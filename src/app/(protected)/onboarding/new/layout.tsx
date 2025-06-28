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

// 'use client'

// import { Suspense } from "react";
// import { ThemeProvider } from "@/providers/theme-provider";
// import { Loader2 } from "lucide-react";
// import { AutomationSlide } from "@/components/global/onboarding/AuomationSlide";
// import { GlowingConnections } from "@/components/global/onboarding/GlowingConnections";
// import { cn } from "@/lib/utils";
// import { useState, useEffect } from "react";
// import { Server, Bot, Clock, ChartLine, Infinity } from "lucide-react";

// const slides = [
//   {
//     title: "Workflow Automation",
//     description: "Eliminate repetitive tasks and focus on what truly matters. Our platform streamlines your workflow.",
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
//       {/* Animated background elements */}
//       <div className="absolute inset-0 z-0 opacity-30">
//         <div className="absolute inset-0 bg-grid-white/[0.02]" />
//       </div>

//       {/* Floating geometric shapes */}
//       <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />

//       {/* Glowing lines */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
//       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

//       <div className="relative z-10 flex min-h-screen">
//         {/* Left sidebar with brand elements */}
//         <div className="hidden lg:flex w-1/3 bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
//           <div>
//             <div className="flex items-center space-x-2 mb-12">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">Y</span>
//               </div>
//               <h1 className="text-2xl font-bold text-white">Yazil</h1>
//             </div>

//             {/* Animated slides section */}
//             <div className="relative h-[400px] mb-8">
//               {slides.map((slide, index) => (
//                 <AutomationSlide
//                   key={index}
//                   title={slide.title}
//                   description={slide.description}
//                   icon={slide.icon}
//                   color={slide.color}
//                   stats={slide.stats}
//                   index={index}
//                   active={currentSlide === index}
//                   total={slides.length}
//                 />
//               ))}
              
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

//         {/* Main content area */}
//         <div className="flex-1 flex flex-col">
//           {/* Animated progress bar at the top */}
//           <div className="h-1 bg-gray-800 w-full">
//             <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"></div>
//           </div>

//           <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
//             <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
//               <Suspense
//                 fallback={
//                   <div className="flex items-center justify-center min-h-[600px]">
//                     <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
//                     <span className="ml-2 text-white">Loading your experience...</span>
//                   </div>
//                 }
//               >
//                 {children}
//               </Suspense>
//             </div>
//           </main>

//           {/* Floating help button */}
//           <div className="fixed bottom-6 right-6 z-50">
//             <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30">
//               <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">?</span>
//               <span className="hidden group-hover:inline">Need help?</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import type React from "react"

// import { Suspense } from "react"
// import { Loader2 } from "lucide-react"
// import { CardCarousel } from "@/components/global/onboarding/CardCarousel"
// import { Server, Bot, Clock, LineChartIcon as ChartLine, Infinity } from "lucide-react"

// const slides = [
//   {
//     title: "Workflow Automation",
//     description: "Eliminate repetitive tasks and focus on what truly matters. Our platform streamlines your workflow.",
//     icon: <Clock size={48} className="text-white" />,
//     color: "from-indigo-500 to-purple-600",
//     stats: "Save up to 15 hours per week",
//   },
//   {
//     title: "Smart Integrations",
//     description: "Connect seamlessly with your favorite tools. Everything works together in perfect harmony.",
//     icon: <Infinity size={48} className="text-white" />,
//     color: "from-blue-500 to-cyan-400",
//     stats: "200+ integrations available",
//   },
//   {
//     title: "AI-Powered Insights",
//     description: "Leverage machine learning to uncover patterns and make data-driven decisions.",
//     icon: <Bot size={48} className="text-white" />,
//     color: "from-emerald-500 to-teal-400",
//     stats: "30% better decision making",
//   },
//   {
//     title: "Scalable Architecture",
//     description: "Built for growth. Our platform handles your needs whether you're a startup or enterprise.",
//     icon: <Server size={48} className="text-white" />,
//     color: "from-amber-500 to-orange-400",
//     stats: "99.9% uptime guaranteed",
//   },
//   {
//     title: "Performance Analytics",
//     description: "Measure the impact of automation with comprehensive dashboards and reports.",
//     icon: <ChartLine size={48} className="text-white" />,
//     color: "from-pink-500 to-rose-400",
//     stats: "Track ROI in real-time",
//   },
// ]

// export default function Layout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 z-0 opacity-30">
//         <div className="absolute inset-0 bg-grid-white/[0.02]" />
//       </div>

//       {/* Floating geometric shapes with enhanced glow */}
//       <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse glow" />
//       <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700 glow" />

//       {/* Additional floating elements */}
//       <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-float" />
//       <div
//         className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-float"
//         style={{ animationDelay: "1s" }}
//       />

//       {/* Glowing lines */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shimmerBorder" />
//       <div
//         className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shimmerBorder"
//         style={{ animationDelay: "1.5s" }}
//       />

//       <div className="relative z-10 flex min-h-screen">
//         {/* Left sidebar with brand elements - increased width to 45% */}
//         <div className="hidden lg:flex w-[45%] bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
//           <div>
//             <div className="flex items-center space-x-2 mb-12">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow">
//                 <span className="text-white font-bold text-2xl">Y</span>
//               </div>
//               <h1 className="text-3xl font-bold text-white">Yazil</h1>
//             </div>

//             {/* Three-position card carousel */}
//             <div className="mb-8">
//               <CardCarousel slides={slides} />
//             </div>
//           </div>

//           {/* Footer with enhanced styling */}
//           <div className="text-gray-400 text-sm border-t border-white/5 pt-4 mt-4">
//             <p className="flex items-center">
//               <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>© 2025 Yazil.
//               All rights reserved.
//             </p>
//           </div>
//         </div>

//         {/* Main content area */}
//         <div className="flex-1 flex flex-col">
//           {/* Animated progress bar at the top */}
//           <div className="h-1 bg-gray-800 w-full">
//             <div
//               className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"
//               style={{
//                 width: `20%`,
//                 transition: "width 0.5s ease-out",
//               }}
//             ></div>
//           </div>

//           <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
//             <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
//               <Suspense
//                 fallback={
//                   <div className="flex flex-col items-center justify-center min-h-[600px]">
//                     <div className="relative">
//                       <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
//                       <div className="absolute inset-0 h-12 w-12 rounded-full blur-lg bg-indigo-500/20 animate-pulse"></div>
//                     </div>
//                     <span className="mt-4 text-white">Loading your experience...</span>
//                   </div>
//                 }
//               >
//                 {children}
//               </Suspense>
//             </div>
//           </main>

//           {/* Floating help button with enhanced glow effect */}
//           <div className="fixed bottom-6 right-6 z-50">
//             <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
//               <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(79,70,229,0.8)]">
//                 ?
//               </span>
//               <span className="hidden group-hover:inline transition-all duration-300">Need help?</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// import type React from "react"

// import { Suspense } from "react"
// import { Loader2 } from "lucide-react"
// import { DynamicCardShowcase } from "@/components/global/onboarding/DynamicCards"
// import {
//   Server,
//   Bot,
//   Clock,
//   LineChartIcon as ChartLine,
//   Infinity,
//   Shield,
//   Zap,
//   Users,
//   Code,
//   Database,
//   Globe,
//   Smartphone,
//   Cloud,
//   Layers,
//   Settings,
// } from "lucide-react"

// const slides = [
//   {
//     title: "Workflow Automation",
//     description: "Eliminate repetitive tasks and focus on what truly matters. Our platform streamlines your workflow.",
//     icon: <Clock size={48} className="text-white" />,
//     color: "from-indigo-500 to-purple-600",
//     stats: "Save up to 15 hours per week",
//   },
//   {
//     title: "Smart Integrations",
//     description: "Connect seamlessly with your favorite tools. Everything works together in perfect harmony.",
//     icon: <Infinity size={48} className="text-white" />,
//     color: "from-blue-500 to-cyan-400",
//     stats: "200+ integrations available",
//   },
//   {
//     title: "AI-Powered Insights",
//     description: "Leverage machine learning to uncover patterns and make data-driven decisions.",
//     icon: <Bot size={48} className="text-white" />,
//     color: "from-emerald-500 to-teal-400",
//     stats: "30% better decision making",
//   },
//   {
//     title: "Scalable Architecture",
//     description: "Built for growth. Our platform handles your needs whether you're a startup or enterprise.",
//     icon: <Server size={48} className="text-white" />,
//     color: "from-amber-500 to-orange-400",
//     stats: "99.9% uptime guaranteed",
//   },
//   {
//     title: "Performance Analytics",
//     description: "Measure the impact of automation with comprehensive dashboards and reports.",
//     icon: <ChartLine size={48} className="text-white" />,
//     color: "from-pink-500 to-rose-400",
//     stats: "Track ROI in real-time",
//   },
//   {
//     title: "Enterprise Security",
//     description: "Bank-level security with end-to-end encryption and compliance with global standards.",
//     icon: <Shield size={48} className="text-white" />,
//     color: "from-violet-500 to-purple-400",
//     stats: "SOC 2 and GDPR compliant",
//   },
//   {
//     title: "Lightning Fast",
//     description: "Optimized performance with sub-second response times even for complex operations.",
//     icon: <Zap size={48} className="text-white" />,
//     color: "from-yellow-500 to-amber-400",
//     stats: "50ms average response time",
//   },
//   {
//     title: "Team Collaboration",
//     description: "Work together seamlessly with real-time updates and role-based permissions.",
//     icon: <Users size={48} className="text-white" />,
//     color: "from-red-500 to-rose-400",
//     stats: "Increase team productivity by 40%",
//   },
//   {
//     title: "Developer API",
//     description: "Extend functionality with our comprehensive API and developer tools.",
//     icon: <Code size={48} className="text-white" />,
//     color: "from-sky-500 to-blue-400",
//     stats: "1000+ API endpoints available",
//   },
//   {
//     title: "Data Management",
//     description: "Organize and access your data with powerful search and filtering capabilities.",
//     icon: <Database size={48} className="text-white" />,
//     color: "from-teal-500 to-green-400",
//     stats: "Process up to 10TB of data daily",
//   },
//   {
//     title: "Global CDN",
//     description: "Lightning-fast content delivery with edge locations worldwide for minimal latency.",
//     icon: <Globe size={48} className="text-white" />,
//     color: "from-fuchsia-500 to-purple-400",
//     stats: "200+ edge locations globally",
//   },
//   {
//     title: "Mobile Experience",
//     description: "Full-featured mobile apps with offline capabilities and push notifications.",
//     icon: <Smartphone size={48} className="text-white" />,
//     color: "from-lime-500 to-green-400",
//     stats: "4.8 star rating on app stores",
//   },
//   {
//     title: "Cloud Storage",
//     description: "Secure, scalable storage for all your files with automatic versioning and backups.",
//     icon: <Cloud size={48} className="text-white" />,
//     color: "from-cyan-500 to-blue-400",
//     stats: "Unlimited storage capacity",
//   },
//   {
//     title: "Multi-environment",
//     description: "Separate development, staging, and production environments with one-click deployment.",
//     icon: <Layers size={48} className="text-white" />,
//     color: "from-orange-500 to-red-400",
//     stats: "Deploy in under 30 seconds",
//   },
//   {
//     title: "Custom Workflows",
//     description: "Build your own automation workflows with our intuitive drag-and-drop interface.",
//     icon: <Settings size={48} className="text-white" />,
//     color: "from-purple-500 to-indigo-400",
//     stats: "Create workflows in minutes, not days",
//   },
// ]

// export default function Layout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 z-0 opacity-30">
//         <div className="absolute inset-0 bg-grid-white/[0.02]" />
//       </div>

//       {/* Floating geometric shapes with enhanced glow */}
//       <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse glow" />
//       <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700 glow" />

//       {/* Additional floating elements */}
//       <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-float" />
//       <div
//         className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-float"
//         style={{ animationDelay: "1s" }}
//       />

//       {/* Glowing lines */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shimmerBorder" />
//       <div
//         className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shimmerBorder"
//         style={{ animationDelay: "1.5s" }}
//       />

//       <div className="relative z-10 flex min-h-screen">
//         {/* Left sidebar with brand elements - increased width to 45% */}
//         <div className="hidden lg:flex w-[45%] bg-black/30 flex-col justify-between p-8 border-r border-white/10">
//           <div>
//             <div className="flex items-center space-x-2 mb-12">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow">
//                 <span className="text-white font-bold text-2xl">Y</span>
//               </div>
//               <h1 className="text-3xl font-bold text-white">Yazzil</h1>
//             </div>

//             {/* Dynamic Card Showcase */}
//             <div className="mb-8">
//               <DynamicCardShowcase slides={slides} autoplaySpeed={6000} />
//             </div>
//           </div>

//           {/* Footer with enhanced styling */}
//           <div className="text-gray-400 text-sm border-t border-white/5 pt-4 mt-4">
//             <p className="flex items-center">
//               <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>© 2025 Yazzil.
//               All rights reserved.
//             </p>
//           </div>
//         </div>

//         {/* Main content area */}
//         <div className="flex-1 flex flex-col">
//           {/* Animated progress bar at the top */}
//           <div className="h-1 bg-gray-800 w-full">
//             <div
//               className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"
//               style={{
//                 width: `20%`,
//                 transition: "width 0.5s ease-out",
//               }}
//             ></div>
//           </div>

//           <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
//             <div className="w-full max-w-3xl bg-black/40 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
//               <Suspense
//                 fallback={
//                   <div className="flex flex-col items-center justify-center min-h-[600px]">
//                     <div className="relative">
//                       <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
//                       <div className="absolute inset-0 h-12 w-12 rounded-full blur-lg bg-indigo-500/20 animate-pulse"></div>
//                     </div>
//                     <span className="mt-4 text-white">Loading your experience...</span>
//                   </div>
//                 }
//               >
//                 {children}
//               </Suspense>
//             </div>
//           </main>

//           {/* Floating help button with enhanced glow effect */}
//           <div className="fixed bottom-6 right-6 z-50">
//             <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
//               <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(79,70,229,0.8)]">
//                 ?
//               </span>
//               <span className="hidden group-hover:inline transition-all duration-300">Need help?</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { DynamicCardShowcase } from "@/components/global/onboarding/DynamicCards"
import {
  Server,
  Bot,
  Clock,
  LineChartIcon as ChartLine,
  Infinity,
  Shield,
  Zap,
  Users,
  Code,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Layers,
  Settings,
} from "lucide-react"

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
    description: "Connect seamlessly with your favorite tools. Everything works together in perfect harmony.",
    icon: <Infinity size={48} className="text-white" />,
    color: "from-blue-500 to-cyan-400",
    stats: "200+ integrations available",
  },
  {
    title: "AI-Powered Insights",
    description: "Leverage machine learning to uncover patterns and make data-driven decisions.",
    icon: <Bot size={48} className="text-white" />,
    color: "from-emerald-500 to-teal-400",
    stats: "30% better decision making",
  },
  {
    title: "Scalable Architecture",
    description: "Built for growth. Our platform handles your needs whether you're a startup or enterprise.",
    icon: <Server size={48} className="text-white" />,
    color: "from-amber-500 to-orange-400",
    stats: "99.9% uptime guaranteed",
  },
  {
    title: "Performance Analytics",
    description: "Measure the impact of automation with comprehensive dashboards and reports.",
    icon: <ChartLine size={48} className="text-white" />,
    color: "from-pink-500 to-rose-400",
    stats: "Track ROI in real-time",
  },
  {
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption and compliance with global standards.",
    icon: <Shield size={48} className="text-white" />,
    color: "from-violet-500 to-purple-400",
    stats: "SOC 2 and GDPR compliant",
  },
  {
    title: "Lightning Fast",
    description: "Optimized performance with sub-second response times even for complex operations.",
    icon: <Zap size={48} className="text-white" />,
    color: "from-yellow-500 to-amber-400",
    stats: "50ms average response time",
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates and role-based permissions.",
    icon: <Users size={48} className="text-white" />,
    color: "from-red-500 to-rose-400",
    stats: "Increase team productivity by 40%",
  },
  {
    title: "Developer API",
    description: "Extend functionality with our comprehensive API and developer tools.",
    icon: <Code size={48} className="text-white" />,
    color: "from-sky-500 to-blue-400",
    stats: "1000+ API endpoints available",
  },
  {
    title: "Data Management",
    description: "Organize and access your data with powerful search and filtering capabilities.",
    icon: <Database size={48} className="text-white" />,
    color: "from-teal-500 to-green-400",
    stats: "Process up to 10TB of data daily",
  },
  {
    title: "Global CDN",
    description: "Lightning-fast content delivery with edge locations worldwide for minimal latency.",
    icon: <Globe size={48} className="text-white" />,
    color: "from-fuchsia-500 to-purple-400",
    stats: "200+ edge locations globally",
  },
  {
    title: "Mobile Experience",
    description: "Full-featured mobile apps with offline capabilities and push notifications.",
    icon: <Smartphone size={48} className="text-white" />,
    color: "from-lime-500 to-green-400",
    stats: "4.8 star rating on app stores",
  },
  {
    title: "Cloud Storage",
    description: "Secure, scalable storage for all your files with automatic versioning and backups.",
    icon: <Cloud size={48} className="text-white" />,
    color: "from-cyan-500 to-blue-400",
    stats: "Unlimited storage capacity",
  },
  {
    title: "Multi-environment",
    description: "Separate development, staging, and production environments with one-click deployment.",
    icon: <Layers size={48} className="text-white" />,
    color: "from-orange-500 to-red-400",
    stats: "Deploy in under 30 seconds",
  },
  {
    title: "Custom Workflows",
    description: "Build your own automation workflows with our intuitive drag-and-drop interface.",
    icon: <Settings size={48} className="text-white" />,
    color: "from-purple-500 to-indigo-400",
    stats: "Create workflows in minutes, not days",
  },
]

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.02]" />
      </div>

      {/* Floating geometric shapes with enhanced glow */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse glow" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700 glow" />

      {/* Additional floating elements */}
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      {/* Glowing lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shimmerBorder" />
      <div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shimmerBorder"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 flex min-h-screen">
        {/* Left sidebar with brand elements - increased width to 45% */}
        <div className="hidden lg:flex w-[45%] bg-card/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-border/50">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow shadow-lg">
                <span className="text-white font-bold text-2xl">Y</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">Yazzil</h1>
            </div>

            {/* Dynamic Card Showcase */}
            <div className="mb-8">
              <DynamicCardShowcase slides={slides} autoplaySpeed={6000} />
            </div>
          </div>

          {/* Footer with enhanced styling */}
          <div className="text-muted-foreground text-sm border-t border-border/30 pt-4 mt-4">
            <p className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>© 2025 Yazzil.
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Animated progress bar at the top */}
          <div className="h-1 bg-muted w-full">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"
              style={{
                width: `20%`,
                transition: "width 0.5s ease-out",
              }}
            ></div>
          </div>

          <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[600px]">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <div className="absolute inset-0 h-12 w-12 rounded-full blur-lg bg-primary/20 animate-pulse"></div>
                    </div>
                    <span className="mt-4 text-foreground">Loading your experience...</span>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </main>

          {/* Floating help button with enhanced glow effect */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="group flex items-center space-x-2 bg-card/80 hover:bg-card backdrop-blur-lg rounded-full py-2 px-4 text-foreground transition-all duration-300 border border-border/50 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(79,70,229,0.8)] text-white text-sm font-bold">
                ?
              </span>
              <span className="hidden group-hover:inline transition-all duration-300">Need help?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
