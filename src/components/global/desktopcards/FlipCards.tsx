
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { RotateCw, FlipHorizontal } from "lucide-react";

interface FlipCardProps {
  frontTitle: string;
  frontSubtitle?: string;
  frontIcon?: React.ReactNode;
  frontGradient: string;
  backTitle: string;
  backContent: string;
  backGradient: string;
  className?: string;
  style?: React.CSSProperties;
}

const FlipCard = ({
  frontTitle,
  frontSubtitle,
  frontIcon,
  backTitle,
  backContent,
  frontGradient,
  backGradient,
  className,
  style,
}: FlipCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className={cn(
        "flip-card w-full h-[300px] sm:h-[350px] relative perspective-1000 card3d",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={cn(
        "flip-card-inner relative w-full h-full transition-transform duration-700 ease-in-out",
        isHovering ? "rotate-y-180" : ""
      )}>
        {/* Front of Card */}
        <div 
          className={cn(
            "flip-card-front absolute w-full h-full rounded-xl p-6 shadow-lg flex flex-col justify-between",
            "dark:border dark:border-border/30 dark:glassEffect",
            frontGradient,
            "transform-style-3d backface-hidden transition-all duration-500",
            isHovering ? "" : "glowHover hover:shadow-glow-hover dark:glow",
            "overflow-hidden"
          )}
        >
          {/* Electric border effect container */}
          <div className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
            isHovering ? "opacity-40" : "", 
            "shimmerBorder"
          )} 
          style={{
            borderRadius: "0.75rem",
            background: "linear-gradient(90deg, transparent, rgba(51, 82, 204, 0.5), transparent)",
            backgroundSize: "200% 100%",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "xor",
            maskBorder: "1px",
            padding: "1px",
          }}
          />
          
          {/* Card content with special curved borders */}
          <div className="flex justify-between items-start relative z-10">
            <div className="card3dContent">
              <h3 className="font-exo font-semibold text-xl sm:text-2xl tracking-wide text-white/90 dark:text-white transform transition-transform duration-300 hover:scale-105">
                {frontTitle}
              </h3>
              {frontSubtitle && (
                <p className="font-exo text-sm text-white/70 dark:text-white/70 mt-2">{frontSubtitle}</p>
              )}
            </div>
            <div className={cn(
              "text-white/80 dark:text-white/80 transition-transform card3dContent",
              isHovering ? "animate-spin-slow" : "animate-pulse-subtle"
            )}>
              {frontIcon || <FlipHorizontal className="h-6 w-6" />}
            </div>
          </div>
          
          <div className="mt-auto flex justify-end relative z-10">
            <div className={cn(
              "rounded-full px-3 py-1.5 text-xs bg-white/10 backdrop-blur-sm transition-all duration-300",
              isHovering ? "opacity-0 translate-y-2" : "opacity-100" 
            )}>
              <span className="text-white/70 dark:text-white/80">Hover to reveal</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className={cn(
            "flip-card-back absolute w-full h-full rounded-xl p-6 shadow-lg transform-style-3d backface-hidden rotate-y-180 transition-all duration-500",
            "dark:border dark:border-border/30 dark:glassEffect",
            backGradient,
            "overflow-hidden"
          )}
        >
          {/* Electric border effect for back */}
          <div className={cn(
            "absolute inset-0 opacity-40 pointer-events-none shimmerBorder"
          )} 
          style={{
            borderRadius: "0.75rem",
            background: "linear-gradient(90deg, transparent, rgba(51, 82, 204, 0.5), transparent)",
            backgroundSize: "200% 100%",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "xor",
            maskBorder: "1px",
            padding: "1px",
          }}
          />
          
          {/* Back content with curved elements */}
          <div className="card3dContent relative z-10">
            <h3 className="font-exo font-bold text-xl sm:text-2xl tracking-wide text-white/90 dark:text-white mb-4 float">
              {backTitle}
            </h3>
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-4">
              <p className="font-exo text-white/80 dark:text-white/80 text-sm sm:text-base leading-relaxed">
                {backContent}
              </p>
            </div>
            
            <div className="absolute bottom-4 right-4">
              <div className="rounded-full px-3 py-1.5 text-xs bg-white/10 backdrop-blur-sm">
                <span className="text-white/70 dark:text-white/80">Click anywhere to explore</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;