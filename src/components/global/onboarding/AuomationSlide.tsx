import { motion } from "framer-motion";
import { ReactNode } from "react";




interface SlideProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  stats: string;
  index: number;
  active: boolean;
  total: number;
}

export function AutomationSlide({ title, description, icon, color, stats, index, active, total }: SlideProps) {
  // Calculate the position and rotation for the card deck effect
  const angle = 30; // Maximum angle of rotation
  const radius = 500; // Radius of the curve
  const spread = 100; // Spread between cards
  
  const calculatePosition = (idx: number, isActive: boolean) => {
    const baseAngle = ((idx - Math.floor(total / 2)) * (angle / total));
    const x = Math.sin(baseAngle * (Math.PI / 180)) * radius;
    const y = Math.cos(baseAngle * (Math.PI / 180)) * radius;
    
    return {
      x: isActive ? 0 : x,
      y: isActive ? 0 : -y/8,
      rotate: isActive ? 0 : baseAngle,
      scale: isActive ? 1 : 0.9,
      z: isActive ? 50 : 0
    };
  };

  const position = calculatePosition(index, active);

  return (
    <motion.div
      className="absolute w-full"
      initial={position}
      animate={{
        ...position,
        opacity: active ? 1 : 0.3,
        transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
      }}
      style={{ 
        transformOrigin: "center center",
        zIndex: active ? 10 : 0
      }}
    >
      <div className={`bg-gradient-to-br ${color} p-6 rounded-xl border border-white/10 backdrop-blur-sm`}>
        <div className="relative">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-4">
            {icon}
          </div>
          <motion.h3
            className="text-xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.5 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.5 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
          <motion.div
            className="mt-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.3 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white font-semibold">{stats}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
