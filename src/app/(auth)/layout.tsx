// import type React from "react"

// type Props = {
//   children: React.ReactNode
// }

// const Layout = ({ children }: Props) => {
//   return (
//     <div className="relative min-h-screen w-full bg-gray-950 flex flex-col lg:flex-row items-center justify-center p-4 md:p-6 lg:p-8">
//       {/* Subtle background pattern */}
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `radial-gradient(#4B5563 1px, transparent 1px)`,
//           backgroundSize: "40px 40px",
//           opacity: "0.05",
//         }}
//       ></div>

//       {/* Left side with illustration (desktop only) */}
//       <div className="hidden lg:flex lg:w-1/2 lg:h-full items-center justify-center p-8">
//         <div className="relative w-full max-w-lg">
//           {/* Business Solutions Dashboard SVG */}
//           <svg
//             viewBox="0 0 400 400"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-full h-auto drop-shadow-lg"
//           >
//             {/* Main dashboard container */}
//             <rect x="40" y="60" width="320" height="280" rx="12" fill="#1F2937" stroke="#374151" strokeWidth="2" />

//             {/* Header bar */}
//             <rect x="40" y="60" width="320" height="40" rx="12" fill="#374151" />

//             {/* Header dots */}
//             <circle cx="65" cy="80" r="6" fill="#EF4444" fillOpacity="0.8" />
//             <circle cx="85" cy="80" r="6" fill="#F59E0B" fillOpacity="0.8" />
//             <circle cx="105" cy="80" r="6" fill="#10B981" fillOpacity="0.8" />

//             {/* Left sidebar */}
//             <rect x="40" y="100" width="80" height="240" fill="#111827" />

//             {/* Sidebar menu items */}
//             <rect x="55" y="120" width="50" height="8" rx="4" fill="#4B5563" />
//             <rect x="55" y="140" width="50" height="8" rx="4" fill="#4B5563" />
//             <rect x="55" y="160" width="50" height="8" rx="4" fill="#4B5563" />
//             <rect x="55" y="180" width="50" height="8" rx="4" fill="#4B5563" />
//             <rect x="55" y="200" width="50" height="8" rx="4" fill="#4B5563" />

//             {/* Main content area - Analytics */}

//             {/* Title */}
//             <rect x="140" y="120" width="100" height="10" rx="5" fill="#6B7280" />

//             {/* Charts */}
//             <rect x="140" y="145" width="100" height="70" rx="6" fill="#374151" />
//             <rect x="250" y="145" width="100" height="70" rx="6" fill="#374151" />

//             {/* Bar chart elements */}
//             <rect x="150" y="185" width="10" height="20" rx="2" fill="#9CA3AF" />
//             <rect x="165" y="175" width="10" height="30" rx="2" fill="#9CA3AF" />
//             <rect x="180" y="165" width="10" height="40" rx="2" fill="#9CA3AF" />
//             <rect x="195" y="155" width="10" height="50" rx="2" fill="#9CA3AF" />
//             <rect x="210" y="175" width="10" height="30" rx="2" fill="#9CA3AF" />
//             <rect x="225" y="180" width="10" height="25" rx="2" fill="#9CA3AF" />

//             {/* Line chart */}
//             <path
//               d="M260 195 L270 175 L285 185 L300 165 L315 180 L330 160"
//               stroke="#9CA3AF"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />

//             {/* Data cards */}
//             <rect x="140" y="225" width="70" height="50" rx="6" fill="#374151" />
//             <rect x="220" y="225" width="70" height="50" rx="6" fill="#374151" />
//             <rect x="300" y="225" width="50" height="50" rx="6" fill="#374151" />

//             {/* Card icons */}
//             <circle cx="155" cy="240" r="8" fill="#4B5563" />
//             <circle cx="235" cy="240" r="8" fill="#4B5563" />
//             <circle cx="315" cy="240" r="8" fill="#4B5563" />

//             {/* Card data */}
//             <rect x="150" y="255" width="50" height="6" rx="3" fill="#6B7280" />
//             <rect x="150" y="265" width="30" height="6" rx="3" fill="#6B7280" />

//             <rect x="230" y="255" width="50" height="6" rx="3" fill="#6B7280" />
//             <rect x="230" y="265" width="30" height="6" rx="3" fill="#6B7280" />

//             <rect x="310" y="255" width="30" height="6" rx="3" fill="#6B7280" />
//             <rect x="310" y="265" width="20" height="6" rx="3" fill="#6B7280" />
//           </svg>
//         </div>
//       </div>

//       {/* Right side content */}
//       <div className="w-full max-w-md lg:w-1/2 lg:max-w-lg mx-auto">
//         {/* Logo and product name for mobile */}
//         <div className="flex flex-col items-center mb-6 lg:hidden space-y-3">
//           <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/20">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Auth container */}
//         <div className="relative group">
//           {/* Border gradient */}
//           <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>

//           {/* Main content */}
//           <div className="relative bg-gray-900 rounded-xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden">
//             <div className="p-6 sm:p-8 flex justify-center items-center">{children}</div>

//             {/* Footer */}
//             <div className="border-t border-white/10 p-4 bg-black/20">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
//                 <p className="text-xs text-white/60">Secure • Automated • Scalable</p>
//                 <div className="flex items-center space-x-4">
//                   <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">
//                     Privacy
//                   </a>
//                   <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">
//                     Terms
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom text */}
//         <p className="text-center text-xs text-white/40 mt-6">
//           © {new Date().getFullYear()} Yazil. All rights reserved.
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Layout

import type React from "react"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { CardCarousel } from "@/components/global/onboarding/CardCarousel"
import { Server, Bot, Clock, LineChartIcon as ChartLine, Infinity } from "lucide-react"

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
]

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
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
        <div className="hidden lg:flex w-[45%] bg-black/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow">
                <span className="text-white font-bold text-2xl">Y</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Yazil</h1>
            </div>

            {/* Three-position card carousel */}
            <div className="mb-8">
              <CardCarousel slides={slides} />
            </div>
          </div>

          {/* Footer with enhanced styling */}
          <div className="text-gray-400 text-sm border-t border-white/5 pt-4 mt-4">
            <p className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>© 2025 Yazil.
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Animated progress bar at the top */}
          <div className="h-1 bg-gray-800 w-full">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"
              style={{
                width: `20%`,
                transition: "width 0.5s ease-out",
              }}
            ></div>
          </div>

          <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[600px]">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                      <div className="absolute inset-0 h-12 w-12 rounded-full blur-lg bg-indigo-500/20 animate-pulse"></div>
                    </div>
                    <span className="mt-4 text-white">Secure • Automated • Scalable</span>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </main>

          {/* Floating help button with enhanced glow effect */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full py-2 px-4 text-white transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(79,70,229,0.8)]">
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