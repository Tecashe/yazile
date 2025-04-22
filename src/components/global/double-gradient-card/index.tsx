"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquareIcon as MessageSquareAuto, BrainCircuit, Sparkles } from "lucide-react"

type Props = {
  id: string
  label: string
  subLabel: string
  description: string
}

const DoubleGradientCard = ({ label, subLabel, description }: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = (label: string) => {
    switch (label) {
      case "Set-up Auto Replies":
        return <MessageSquareAuto className="w-10 h-10 text-blue-300" />
      case "Answer Questions with AI":
        return <BrainCircuit className="w-10 h-10 text-blue-300" />
      case "Give quality replies":
        return <Sparkles className="w-10 h-10 text-blue-300" />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="relative p-0.5 rounded-2xl overflow-hidden shadow-2xl group perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Solid blue border effect */}
      <div className="absolute inset-0 bg-blue-500 opacity-75" />

      {/* Inner content area with dark background */}
      <motion.div
        className="relative p-6 bg-black/60 backdrop-blur-xl rounded-xl overflow-hidden h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateY(10deg) rotateX(5deg)" : "rotateY(0deg) rotateX(0deg)",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Hexagonal grid background */}
        <div className="absolute inset-0 bg-hexagon-pattern opacity-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-y-6">
          <motion.div
            className="flex items-start gap-4"
            style={{
              transform: isHovered ? "translateZ(40px)" : "translateZ(0px)",
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm shadow-blue relative overflow-hidden group-hover:shadow-blue-intense transition-all duration-300">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
              {getIcon(label)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 text-shadow">{label}</h3>
              <h5 className="text-blue-200 text-shadow-sm text-sm">{subLabel}</h5>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-between items-end"
            style={{
              transform: isHovered ? "translateZ(60px)" : "translateZ(0px)",
              transition: "transform 0.3s ease-out",
            }}
          >
            <h6 className="text-white/80 text-sm max-w-[70%]">{description}</h6>
            <Button className="rounded-full bg-white/10 text-white hover:bg-blue-500/20 w-12 h-12 backdrop-blur-sm shadow-blue group-hover:shadow-blue-intense transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
              <ArrowRight className="w-6 h-6 relative z-10" />
            </Button>
          </motion.div>
        </div>

        {/* Blue accent lines */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-blue-500 opacity-50" />
        <div className="absolute top-0 right-0 w-px h-full bg-blue-500 opacity-50" />
      </motion.div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        .text-shadow-sm {
          text-shadow: 0 0 5px rgba(255,255,255,0.3);
        }
        .shadow-blue {
          box-shadow: 0 0 5px theme('colors.blue.500'),
                      0 0 20px theme('colors.blue.500');
        }
        .shadow-blue-intense {
          box-shadow: 0 0 10px theme('colors.blue.500'),
                      0 0 30px theme('colors.blue.500'),
                      0 0 50px theme('colors.blue.500');
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .bg-hexagon-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 L15 0 L45 0 L60 30 L45 60 L15 60 Z' fill='none' stroke='white' strokeOpacity='0.1'/%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
      `}</style>
    </motion.div>
  )
}

export default DoubleGradientCard

