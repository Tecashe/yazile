"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "framer-motion"

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      x.set(e.clientX)
      y.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [x, y])

  return (
    <>
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-cyan-500 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-cyan-500 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  )
}
