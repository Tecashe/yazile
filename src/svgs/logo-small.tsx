"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface LogoProps {
  maxWidth?: number
  maxHeight?: number
}

export const LogoSmall: React.FC<LogoProps> = ({ maxWidth = 300, maxHeight = 100 }) => {
  const [dimensions, setDimensions] = useState({ width: maxWidth, height: maxHeight })

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(maxWidth, window.innerWidth * 0.8)
      const height = (width / maxWidth) * maxHeight
      setDimensions({ width, height })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [maxWidth, maxHeight])

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${dimensions.width}px`,
        ...styles.logoWrapper,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 100"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        <defs>
          <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="50%" stopColor="#5851DB" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Instagram-inspired camera outline */}
        <rect x="10" y="10" width="80" height="80" rx="20" ry="20" fill="url(#instagramGradient)" />
        <rect x="15" y="15" width="70" height="70" rx="18" ry="18" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="73" cy="27" r="5" fill="white" />

    


        {/* Company name */}
        <text
          x="110"
          y="50"
          fontFamily="Arial, sans-serif"
          fontSize="28"
          fontWeight="bold"
          fill="#405DE6"
          filter="url(#glow)"
        >
          Chatal
        </text>

        {/* Tagline */}
        <text x="110" y="75" fontFamily="Arial, sans-serif" fontSize="12" fill="#833AB4">
          Engage.Automate.Grow
        </text>
      </svg>
    </div>
  )
}

const styles = {
  logoWrapper: {
    "@media (max-width: 768px)": {
      maxWidth: "240px",
    },
    "@media (max-width: 480px)": {
      maxWidth: "180px",
    },
  },
  svg: {
    display: "block",
    margin: "0",
    verticalAlign: "top",
  },
} as const


export default LogoSmall


