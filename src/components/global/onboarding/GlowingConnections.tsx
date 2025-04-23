import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface GlowingConnectionsProps {
  currentSlide: number;
  totalSlides: number;
}

export function GlowingConnections({ currentSlide, totalSlides }: GlowingConnectionsProps) {
  const [points, setPoints] = useState<Point[]>([]);
  
  useEffect(() => {
    // Calculate points in a curve
    const newPoints = Array.from({ length: totalSlides }, (_, i) => {
      const angle = ((i - Math.floor(totalSlides / 2)) * (30 / totalSlides));
      const radius = 100;
      return {
        x: 150 + Math.sin(angle * (Math.PI / 180)) * radius,
        y: 150 - Math.cos(angle * (Math.PI / 180)) * radius
      };
    });
    setPoints(newPoints);
  }, [totalSlides]);

  return (
    <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 300 200">
        {points.map((point, i) => (
          <g key={i}>
            {i < points.length - 1 && (
              <motion.path
                d={`M ${point.x} ${point.y} L ${points[i + 1].x} ${points[i + 1].y}`}
                stroke="url(#glowingLine)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ 
                  pathLength: i === currentSlide ? 1 : 0.2,
                  opacity: i === currentSlide ? 1 : 0.2
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              initial={{ scale: 0 }}
              animate={{ 
                scale: i === currentSlide ? 1.5 : 1,
                opacity: i === currentSlide ? 1 : 0.5
              }}
              transition={{ duration: 0.5 }}
            />
          </g>
        ))}
        <defs>
          <linearGradient id="glowingLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
