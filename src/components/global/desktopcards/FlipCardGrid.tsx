import React from 'react';
import FlipCard from './FlipCards';
import { Layers, RotateCw, Settings, FlipHorizontal } from 'lucide-react';

const FlipCardGrid = () => {
  const cardData = [
    {
      frontTitle: "Workflow Automation",
      frontSubtitle: "Streamline your processes",
      frontIcon: <Layers className="h-6 w-6" />,
      frontGradient: "bg-gradient-to-br from-blue-400/90 to-cyan-300/90 hover:from-blue-500/90 hover:to-cyan-400/90 dark:from-indigo-700/80 dark:to-blue-900/80 dark:hover:from-indigo-600/80 dark:hover:to-blue-800/80",
      backTitle: "Workflow Efficiency",
      backContent: "Eliminate repetitive tasks by creating automated workflows that trigger based on specific events. Boost productivity by up to 40% while reducing human error and standardizing processes.",
      backGradient: "bg-gradient-to-br from-indigo-600/95 to-blue-700/95 shadow-lg shadow-indigo-500/20 dark:from-indigo-800/90 dark:to-blue-900/90 dark:shadow-indigo-900/20",
    },
    {
      frontTitle: "Data Processing",
      frontSubtitle: "Transform information seamlessly",
      frontIcon: <RotateCw className="h-6 w-6" />,
      frontGradient: "bg-gradient-to-br from-purple-400/90 to-pink-300/90 hover:from-purple-500/90 hover:to-pink-400/90 dark:from-purple-800/80 dark:to-pink-900/80 dark:hover:from-purple-700/80 dark:hover:to-pink-800/80",
      backTitle: "Smart Data Handling",
      backContent: "Automatically clean, transform and analyze large datasets without manual intervention. Create intelligent data pipelines that extract meaningful insights and prepare data for business intelligence.",
      backGradient: "bg-gradient-to-br from-purple-700/95 to-indigo-800/95 shadow-lg shadow-purple-500/20 dark:from-purple-900/90 dark:to-indigo-950/90 dark:shadow-purple-900/20",
    },
    {
      frontTitle: "System Integration",
      frontSubtitle: "Connect your digital ecosystem",
      frontIcon: <Settings className="h-6 w-6" />,
      frontGradient: "bg-gradient-to-br from-amber-400/90 to-orange-300/90 hover:from-amber-500/90 hover:to-orange-400/90 dark:from-amber-700/80 dark:to-orange-900/80 dark:hover:from-amber-600/80 dark:hover:to-orange-800/80",
      backTitle: "Seamless Connections",
      backContent: "Build powerful integrations between applications and services with API automation. Synchronize data across platforms and create a cohesive technology ecosystem that eliminates data silos.",
      backGradient: "bg-gradient-to-br from-amber-700/95 to-orange-800/95 shadow-lg shadow-amber-500/20 dark:from-amber-800/90 dark:to-orange-900/90 dark:shadow-amber-900/20",
    },
    {
      frontTitle: "Scheduled Tasks",
      frontSubtitle: "Perfect timing, every time",
      frontIcon: <FlipHorizontal className="h-6 w-6" />,
      frontGradient: "bg-gradient-to-br from-emerald-400/90 to-teal-300/90 hover:from-emerald-500/90 hover:to-teal-400/90 dark:from-emerald-700/80 dark:to-teal-900/80 dark:hover:from-emerald-600/80 dark:hover:to-teal-800/80",
      backTitle: "Intelligent Scheduling",
      backContent: "Set up recurring processes that run on precise schedules without supervision. From daily backups to monthly reports, ensure critical tasks are executed with perfect timing and consistency.",
      backGradient: "bg-gradient-to-br from-emerald-700/95 to-teal-800/95 shadow-lg shadow-emerald-500/20 dark:from-emerald-800/90 dark:to-teal-900/90 dark:shadow-emerald-900/20",
    },
  ];

  const getAnimationDelay = (index: number) => {
    return `${index * 0.2}s`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <FlipCard
          key={index}
          frontTitle={card.frontTitle}
          frontSubtitle={card.frontSubtitle}
          frontIcon={card.frontIcon}
          frontGradient={card.frontGradient}
          backTitle={card.backTitle}
          backContent={card.backContent}
          backGradient={card.backGradient}
          className="animate-float hover:shadow-xl transition-shadow duration-300 dark:hover:shadow-glow"
          style={{ 
            animationDelay: getAnimationDelay(index),
            animationDuration: `${6 + index * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

export default FlipCardGrid;
