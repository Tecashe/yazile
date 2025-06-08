

// import { cn } from "@/lib/utils"
// import DoubleTickSpinner from "./double-tick-spinner"

// type SpinnerProps = {
//   color?: string
// }

// export const Spinner = ({ color }: SpinnerProps) => {
//   // Map the color prop to the appropriate Tailwind class
//   const colorClass = color ? `text-${color}` : "text-blue-600"

//   return (
//     <div role="status" className="inline-block w-8 h-8">
//       <DoubleTickSpinner className={cn("w-full h-full")} color={colorClass} />
//       <span className="sr-only">Loading</span>
//     </div>
//   )
// }

import { cn } from "@/lib/utils"
import YazzilSpinner from "./double-tick-spinner"

type SpinnerProps = {
  color?: string
}

export const Spinner = ({ color }: SpinnerProps) => {
  const colorClass = color ? `text-${color}` : "text-blue-600"

  return (
    <div role="status" className="inline-block w-8 h-8">
      <YazzilSpinner className={cn("w-full h-full", colorClass)} isSpinning={true} />
      <span className="sr-only">Loading</span>
    </div>
  )
}
