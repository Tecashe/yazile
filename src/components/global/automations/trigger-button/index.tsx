"use client"
import type React from "react"
import FloatingPanel from "../../panel"
import { motion } from "framer-motion"
import { PlusCircle } from "lucide-react"

type Props = {
  children: React.ReactNode
  label: string
}

const TriggerButton = ({ children, label }: Props) => {
  return (
    <FloatingPanel
      title={label}
      trigger={
        <motion.div className="group relative overflow-hidden rounded-xl mt-4 w-full">
          {/* Border with animation */}
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

          {/* Inner content */}
          <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
            <div className="flex items-center justify-center gap-3">
              <PlusCircle size={20} color="#768BDD" />
              <p className="text-[#768BDD] font-bold">{label}</p>
            </div>
          </div>
        </motion.div>
      }
    >
      <div className="staggeredFadeIn">{children}</div>
    </FloatingPanel>
  )
}

export default TriggerButton

