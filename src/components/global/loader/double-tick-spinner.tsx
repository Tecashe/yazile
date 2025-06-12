// "use client"

// import { cn } from "@/lib/utils"

// interface DoubleTickSpinnerProps {
//   isSpinning?: boolean
//   className?: string
//   color?: string
// }

// export default function DoubleTickSpinner({ isSpinning = true, className, color }: DoubleTickSpinnerProps) {
//   // Default colors if not provided
//   const primaryColor = color || "text-blue-600"
//   const secondaryColor = color === "text-yellow-400" ? "text-yellow-300" : "text-green-500"

//   return (
//     <div className={cn("relative w-full h-full", className)}>
//       {/* Spinning circles container */}
//       <div className={cn("absolute inset-0", isSpinning && "animate-spin-slow")}>
//         <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
//           {/* Complete circles that will be masked */}
//           <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className={primaryColor} />

//           <circle
//             cx="50"
//             cy="50"
//             r="40"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeDasharray="6 3"
//             className={secondaryColor}
//           />
//         </svg>
//       </div>

//       {/* Stationary ticks container - Moved up by adjusting the transform */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
//           {/* Mask to hide part of the circle */}
//           <defs>
//             <mask id="tickMask">
//               <rect width="100" height="100" fill="white" />
//               {/* The black parts of the mask will hide the circle - Moved up by adjusting y position */}
//               <g transform="translate(25, 45)">
//                 {/* First stylized tick mask */}
//                 <path
//                   d="M 5,10 C 10,15 15,20 25,28 C 35,15 45,0 60,-15"
//                   fill="none"
//                   stroke="black"
//                   strokeWidth="10"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 {/* Second stylized tick mask */}
//                 <path
//                   d="M 15,10 C 20,15 25,20 35,28 C 45,15 55,0 70,-15"
//                   fill="none"
//                   stroke="black"
//                   strokeWidth="10"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </g>
//             </mask>
//           </defs>

//           {/* White background for the mask area - Moved up by adjusting y position */}
//           <g transform="translate(25, 45)">
//             <path
//               d="M 5,10 C 10,15 15,20 25,28 C 35,15 45,0 60,-15"
//               fill="none"
//               stroke="white"
//               strokeWidth="10"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M 15,10 C 20,15 25,20 35,28 C 45,15 55,0 70,-15"
//               fill="none"
//               stroke="white"
//               strokeWidth="10"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </g>

//           {/* Stylized double tick marks - Moved up by adjusting y position */}
//           <g transform="translate(25, 45)">
//             {/* First stylized tick - Blue */}
//             <path
//               d="M 5,10 C 10,15 15,20 25,28 C 35,15 45,0 60,-15"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="6"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className={primaryColor}
//             />

//             {/* Second stylized tick - Green */}
//             <path
//               d="M 15,10 C 20,15 25,20 35,28 C 45,15 55,0 70,-15"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="6"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className={secondaryColor}
//             />
//           </g>
//         </svg>
//       </div>

//       {/* This div applies the mask to the spinning circles */}
//       <div className="absolute inset-0 [mask-image:url('#tickMask')]">
//         <div className={cn("w-full h-full", isSpinning && "animate-spin-slow")}>
//           <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
//             <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className={primaryColor} />

//             <circle
//               cx="50"
//               cy="50"
//               r="40"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeDasharray="6 3"
//               className={secondaryColor}
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { cn } from "@/lib/utils"

// interface BarSpinnerProps {
//   isSpinning?: boolean
//   className?: string
//   color?: string
// }

// export default function BarSpinner({ isSpinning = true, className, color }: BarSpinnerProps) {
//   // Default colors if not provided
//   const primaryColor = color || "bg-blue-600"
//   const secondaryColor = color === "bg-yellow-400" ? "bg-yellow-300" : "bg-green-500"

//   return (
//     <div className={cn("flex items-center justify-center gap-1", className)}>
//       {/* 5 animated bars */}
//       {[0, 1, 2, 3, 4].map((i) => (
//         <div
//           key={i}
//           className={cn(
//             "w-1 h-4 rounded-full",
//             i % 2 === 0 ? primaryColor : secondaryColor,
//             isSpinning && "animate-pulse"
//           )}
//           style={{
//             animationDelay: `${i * 0.1}s`,
//             animationDuration: "0.8s"
//           }}
//         />
//       ))}
//     </div>
//   )
// }

// "use client"

// import { cn } from "@/lib/utils"

// interface YazzilSpinnerProps {
//   isSpinning?: boolean
//   className?: string
//   size?: number // optional pixel size
// }

// export default function YazzilSpinner({ isSpinning = true, className, size = 48 }: YazzilSpinnerProps) {
//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center",
//         isSpinning && "animate-spin-slow",
//         className
//       )}
//       style={{ width: size, height: size }}
//     >
//       <svg
//         viewBox="0 0 100 100"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ width: "100%", height: "100%" }}
//       >
//         {/* Colorful snowflake-inspired spinner (6 arms) */}
//         <g strokeWidth="8" strokeLinecap="round">
//           <line x1="50" y1="10" x2="50" y2="30" stroke="#00E0FF" />
//           <line x1="50" y1="90" x2="50" y2="70" stroke="#FF0055" />
//           <line x1="10" y1="50" x2="30" y2="50" stroke="#FFCC00" />
//           <line x1="90" y1="50" x2="70" y2="50" stroke="#00FF85" />
//           <line x1="25" y1="25" x2="38" y2="38" stroke="#9933FF" />
//           <line x1="75" y1="75" x2="62" y2="62" stroke="#FF6600" />
//         </g>
//       </svg>
//     </div>
//   )
// }


// "use client"
// import { cn } from "@/lib/utils"

// interface YazzilSpinnerProps {
//   isSpinning?: boolean
//   className?: string
//   size?: number // optional pixel size
// }

// export default function YazzilSpinner({ isSpinning = true, className, size = 24 }: YazzilSpinnerProps) {
//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center",
//         isSpinning && "animate-spin-slow",
//         className
//       )}
//       style={{ width: size, height: size }}
//     >
//       <svg
//         viewBox="0 0 100 100"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ width: "100%", height: "100%" }}
//       >
//         {/* Colorful snowflake-inspired spinner (6 arms) */}
//         <g strokeWidth="8" strokeLinecap="round">
//           <line x1="50" y1="10" x2="50" y2="30" stroke="#00E0FF" />
//           <line x1="50" y1="90" x2="50" y2="70" stroke="#FF0055" />
//           <line x1="10" y1="50" x2="30" y2="50" stroke="#FFCC00" />
//           <line x1="90" y1="50" x2="70" y2="50" stroke="#00FF85" />
//           <line x1="25" y1="25" x2="38" y2="38" stroke="#9933FF" />
//           <line x1="75" y1="75" x2="62" y2="62" stroke="#FF6600" />
//         </g>
//       </svg>
//     </div>
//   )
// }


"use client"

import { cn } from "@/lib/utils"

interface YazzilSnowflakeSpinnerProps {
  isSpinning?: boolean
  className?: string
  size?: number // pixel size
}

export default function YazzilSpinner({
  isSpinning = true,
  className,
  size = 24, // larger size by default for visual clarity
}: YazzilSnowflakeSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(isSpinning && "animate-yazzil-spin")}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="snowflakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E0FF" />
            <stop offset="50%" stopColor="#FF0055" />
            <stop offset="100%" stopColor="#00FF85" />
          </linearGradient>
        </defs>
        <g
          stroke="url(#snowflakeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        >
          {/* 6 symmetric arms */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180
            const x = 50 + 30 * Math.cos(angle)
            const y = 50 + 30 * Math.sin(angle)
            const x2 = 50 + 45 * Math.cos(angle)
            const y2 = 50 + 45 * Math.sin(angle)

            const wingAngle1 = angle + Math.PI / 8
            const wingAngle2 = angle - Math.PI / 8
            const wx1 = 50 + 45 * Math.cos(wingAngle1)
            const wy1 = 50 + 45 * Math.sin(wingAngle1)
            const wx2 = 50 + 45 * Math.cos(wingAngle2)
            const wy2 = 50 + 45 * Math.sin(wingAngle2)

            return (
              <g key={i}>
                {/* main arm */}
                <line x1="50" y1="50" x2={x2} y2={y2} />
                {/* decorative branches */}
                <line x1={x} y1={y} x2={wx1} y2={wy1} />
                <line x1={x} y1={y} x2={wx2} y2={wy2} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
