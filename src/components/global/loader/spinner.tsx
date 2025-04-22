

import { cn } from "@/lib/utils"
import DoubleTickSpinner from "./double-tick-spinner"

type SpinnerProps = {
  color?: string
}

export const Spinner = ({ color }: SpinnerProps) => {
  // Map the color prop to the appropriate Tailwind class
  const colorClass = color ? `text-${color}` : "text-blue-600"

  return (
    <div role="status" className="inline-block w-8 h-8">
      <DoubleTickSpinner className={cn("w-full h-full")} color={colorClass} />
      <span className="sr-only">Loading</span>
    </div>
  )
}

