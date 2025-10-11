"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export const AutomationSkeleton = ({ index = 0 }: { index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="bg-background border-2 border-border relative overflow-hidden">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="h-8 bg-muted/50 rounded-lg w-48 animate-pulse" />
            <div className="flex items-center space-x-2">
              <div className="h-6 w-16 bg-muted/50 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-muted/50 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 bg-muted/50 rounded-full animate-pulse"
                style={{ width: `${60 + i * 20}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-border/50 bg-muted/20 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="h-4 bg-muted/50 rounded w-20 mb-2" />
                <div className="h-6 bg-muted/50 rounded w-12" />
              </div>
            ))}
          </div>

          {/* Sentiment Section */}
          <div className="space-y-4 mb-6">
            <div className="h-5 bg-muted/50 rounded w-40 animate-pulse" />
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-3 rounded-xl border-2 border-muted/30 bg-muted/10 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="w-8 h-8 bg-muted/50 rounded-full mb-2" />
                  <div className="h-3 bg-muted/50 rounded w-12 mb-1" />
                  <div className="h-5 bg-muted/50 rounded w-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <div className="h-9 bg-muted/50 rounded-md w-24 animate-pulse" />
            <div className="h-9 bg-muted/50 rounded-md w-28 animate-pulse" style={{ animationDelay: "0.1s" }} />
          </div>

          {/* Time indicator */}
          <div className="mt-6 flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted/50 rounded-full animate-pulse" />
            <div className="h-4 bg-muted/50 rounded w-32 animate-pulse" />
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full opacity-50 animate-pulse" />
      </Card>
    </motion.div>
  )
}

export const AutomationListSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <div className="h-12 bg-muted/50 rounded-lg w-80 mb-3 animate-pulse" />
              <div className="h-6 bg-muted/50 rounded w-64 animate-pulse" />
            </div>
            <div className="h-10 bg-muted/50 rounded-lg w-48 animate-pulse" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-border/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-muted/50 rounded w-24 mb-2 animate-pulse" />
                      <div className="h-8 bg-muted/50 rounded w-16 animate-pulse" />
                    </div>
                    <div className="w-12 h-12 bg-muted/50 rounded-xl animate-pulse" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search Bar Skeleton */}
          <Card className="border-border/50 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-10 bg-muted/50 rounded-md animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-muted/50 rounded-md w-16 animate-pulse" />
                ))}
              </div>
              <div className="flex gap-2 border-l border-border/50 pl-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-10 bg-muted/50 rounded-md w-10 animate-pulse" />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Automation Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((index) => (
            <AutomationSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
