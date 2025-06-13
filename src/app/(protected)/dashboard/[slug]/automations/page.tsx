// 'use client'

// import AutomationList from '@/components/global/automation-list'
// import CreateAutomation from '@/components/global/create-automation'
// import { useQueryAutomations } from '@/hooks/user-queries'
// import { Check, Zap, Sparkles, Rocket } from 'lucide-react'
// import React from 'react'

// const AutomationStatus = ({ count }: { count: number }) => {
//   if (count === 0) {
//     return (
//       <div className="flex items-center gap-2 text-yellow-500">
//         <Zap className="w-10 h-10" />
//         <p>Ready to supercharge your workflow? Create your first automation!</p>
//       </div>
//     )
//   } else if (count < 3) {
//     return (
//       <div className="flex items-center gap-2 text-green-500">
//         <Sparkles className="w-10 h-10" />
//         <p>Great start! You are on your way to automation mastery.</p>
//       </div>
//     )
//   } else {
//     return (
//       <div className="flex items-center gap-2 text-blue-500">
//         <Rocket className="w-10 h-10" />
//         <p>Wow! You are an automation pro. Keep optimizing your workflow!</p>
//       </div>
//     )
//   }
// }

// const Page = () => {
//   const { data } = useQueryAutomations()
//   const automations = data?.data || []

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
//       <div className="lg:col-span-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
//         <AutomationList 
//           id={automations.length > 0 ? automations[0].id : ''}
//         />
//       </div>
//       <div className="lg:col-span-2 lg:sticky lg:top-16">
//         <div className="flex flex-col rounded-xl bg-gradient-to-br from-background-80 to-background-100 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active shadow-lg transition-all duration-300 hover:shadow-xl">
//           <div>
//             <h2 className="text-2xl font-bold mb-4 text-primary">My Automations</h2>
//             <AutomationStatus count={automations.length} />
//           </div>
//           <div className="flex flex-col gap-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background-100">
//             {automations.map((automation) => (
//               <div
//                 key={automation.id}
//                 className="flex items-start justify-between bg-background-90 p-3 rounded-lg transition-all duration-200 hover:bg-background-100"
//               >
//                 <div className="flex flex-col">
//                   <h3 className="font-medium text-primary">
//                     {automation.name}
//                   </h3>
//                   <p className="text-text-secondary text-sm">
//                     {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : 'No Date'}
//                   </p>
//                 </div>
//                 <Check className="text-green-500" />
//               </div>
//             ))}
//           </div>
//           <CreateAutomation />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page

// 'use client'

// import AutomationList from '@/components/global/automation-list'
// import CreateAutomation from '@/components/global/create-automation'
// import { useQueryAutomations } from '@/hooks/user-queries'
// import { Check, Zap, Sparkles, Rocket, Loader2 } from 'lucide-react'
// import { motion } from 'framer-motion'
// import React from 'react'

// const AutomationStatus = ({ count, isLoading }: { count: number; isLoading: boolean }) => {
//   if (isLoading) {
//     return (
//       <div className="flex items-center gap-2 text-gray-500">
//         <Loader2 className="w-10 h-10 animate-spin" />
//         <p>Loading your automations...</p>
//       </div>
//     )
//   }

//   if (count === 0) {
//     return (
//       <div className="flex items-center gap-2 text-yellow-500">
//         <Zap className="w-10 h-10" />
//         <p>Ready to supercharge your workflow? Create your first automation!</p>
//       </div>
//     )
//   } else if (count < 3) {
//     return (
//       <div className="flex items-center gap-2 text-green-500">
//         <Sparkles className="w-10 h-10" />
//         <p>Great start! You are on your way to automation mastery.</p>
//       </div>
//     )
//   } else {
//     return (
//       <div className="flex items-center gap-2 text-blue-500">
//         <Rocket className="w-10 h-10" />
//         <p>Wow! You are an automation pro. Keep optimizing your workflow!</p>
//       </div>
//     )
//   }
// }

// const AutomationSkeleton = () => (
//   <div className="flex items-start justify-between bg-background-90 p-3 rounded-lg animate-pulse">
//     <div className="flex flex-col gap-2">
//       <div className="h-4 bg-gray-300 rounded w-24"></div>
//       <div className="h-3 bg-gray-200 rounded w-16"></div>
//     </div>
//     <div className="w-5 h-5 bg-gray-300 rounded"></div>
//   </div>
// )

// const Page = () => {
//   const { data, isLoading, error, isSuccess } = useQueryAutomations()
  
//   // Handle the response structure from your getAllAutomations action
//   const automations = data?.data || []
//   const hasAutomations = isSuccess && automations.length > 0

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
//       <div className="lg:col-span-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
//         {isLoading ? (
//           <div className="flex items-center justify-center h-96">
//             <Loader2 className="w-8 h-8 animate-spin" />
//             <span className="ml-2">Loading automations...</span>
//           </div>
//         ) : (
//           <AutomationList 
//             id={hasAutomations ? automations[0].id : ''} 
//           />
//         )}
//       </div>
//       <div className="lg:col-span-2 lg:sticky lg:top-16">
//         <div className="flex flex-col rounded-xl bg-gradient-to-br from-background-80 to-background-100 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active shadow-lg transition-all duration-300 hover:shadow-xl">
//           <div>
//             <h2 className="text-2xl font-bold mb-4 text-primary">My Automations</h2>
//             <AutomationStatus count={automations.length} isLoading={isLoading} />
//           </div>
          
//           <div className="flex flex-col gap-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background-100">
//             {isLoading ? (
//               // Show skeleton loading state
//               Array.from({ length: 3 }).map((_, index) => (
//                 <AutomationSkeleton key={index} />
//               ))
//             ) : error ? (
//               <div className="text-red-500 text-center p-4">
//                 Failed to load automations. Please try again.
//               </div>
//             ) : automations.length === 0 ? (
//               <div className="text-center p-4 text-text-secondary">
//                 No automations yet. Click the button to create one.
//               </div>
//             ) : (
//               automations.map((automation) => (
//                 <div
//                   key={automation.id}
//                   className="flex items-start justify-between bg-background-90 p-3 rounded-lg transition-all duration-200 hover:bg-background-100"
//                 >
//                   <div className="flex flex-col">
//                     <h3 className="font-medium text-primary">
//                       {automation.name}
//                     </h3>
//                     <p className="text-text-secondary text-sm">
//                       {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : 'No Date'}
//                     </p>
//                   </div>
//                   <Check className="text-green-500" />
//                 </div>
//               ))
//             )}
//           </div>
          
//           <CreateAutomation />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page

'use client'

import AutomationList from '@/components/global/automation-list'
import CreateAutomation from '@/components/global/create-automation'
import { useQueryAutomations } from '@/hooks/user-queries'
import { Check, Zap, Sparkles, Rocket, Loader2, TrendingUp, Clock, Activity, Plus, MoreVertical, Settings, Trash2, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'

const AutomationStatus = ({ count, isLoading }: { count: number; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-200/30"
      >
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
        </div>
        <div>
          <p className="font-medium text-gray-800">Loading your automations...</p>
          <p className="text-sm text-gray-500">Preparing your workflow dashboard</p>
        </div>
      </motion.div>
    )
  }

  const configs = [
    {
      condition: count === 0,
      icon: Zap,
      title: "Ready to supercharge your workflow?",
      subtitle: "Create your first automation and watch the magic happen!",
      gradient: "from-yellow-400 to-orange-500",
      bg: "from-yellow-50 to-orange-50",
      border: "border-yellow-200/50"
    },
    {
      condition: count < 3,
      icon: Sparkles,
      title: "Great momentum!",
      subtitle: `${count} automation${count !== 1 ? 's' : ''} active. You're building something amazing!`,
      gradient: "from-green-400 to-emerald-500",
      bg: "from-green-50 to-emerald-50",
      border: "border-green-200/50"
    },
    {
      condition: count >= 3,
      icon: Rocket,
      title: "Automation Master!",
      subtitle: `${count} automations running. Your workflow is optimized!`,
      gradient: "from-blue-400 to-purple-500",
      bg: "from-blue-50 to-purple-50",
      border: "border-blue-200/50"
    }
  ]

  const config = configs.find(c => c.condition) || configs[0]
  const Icon = config.icon

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden p-4 bg-gradient-to-br ${config.bg} rounded-xl border ${config.border} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3">
        <div className={`relative p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
          <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{config.title}</h3>
          <p className="text-sm text-gray-600">{config.subtitle}</p>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-60 animate-bounce" />
      <div className="absolute top-4 -right-1 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-40 animate-pulse" />
    </motion.div>
  )
}

const AutomationSkeleton = ({ index }: { index: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 animate-pulse"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg" />
        <div>
          <div className="h-4 bg-gray-300 rounded-md w-24 mb-2" />
          <div className="h-3 bg-gray-200 rounded-md w-16" />
        </div>
      </div>
      <div className="w-5 h-5 bg-gray-300 rounded-full" />
    </div>
  </motion.div>
)

const AutomationCard = ({ automation, index }: { automation: any; index: number }) => {
  const [showActions, setShowActions] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`group relative p-4 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${
        automation._isOptimistic 
          ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 animate-pulse' 
          : 'border-gray-200/50 hover:border-blue-300/50'
      }`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className={`relative p-2.5 rounded-lg shadow-sm ${
            automation._isOptimistic 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
              : automation.active 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            {automation._isOptimistic ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : automation.active ? (
              <Activity className="w-4 h-4 text-white" />
            ) : (
              <Clock className="w-4 h-4 text-white" />
            )}
            
            {/* Pulse animation for active automations */}
            {automation.active && !automation._isOptimistic && (
              <div className="absolute inset-0 bg-green-400 rounded-lg animate-ping opacity-30" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {automation.name}
              </h3>
              {automation._isOptimistic && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full"
                >
                  Creating...
                </motion.span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">
                {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : 'No Date'}
              </p>
              
              {automation.keywords?.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {automation.keywords.length} keyword{automation.keywords.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check className={`w-5 h-5 ${
              automation._isOptimistic 
                ? 'text-yellow-500' 
                : 'text-green-500'
            }`} />
          </motion.div>
          
          {!automation._isOptimistic && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Quick stats */}
      {!automation._isOptimistic && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500"
        >
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {Math.floor(Math.random() * 100)} interactions
          </span>
          <span className={`px-2 py-1 rounded-full ${
            automation.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {automation.active ? 'Active' : 'Paused'}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

const Page = () => {
  const { data, isLoading, error, isSuccess } = useQueryAutomations()
  
  const automations = data?.data || []
  const hasAutomations = isSuccess && automations.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
      </div>
      
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Automation Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor your automated workflows</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden lg:block"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/30">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {automations.filter(a => a.active).length} Active
                </span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Automation List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Loader2 className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-gray-600 font-medium">Loading your automation workspace...</p>
                  <p className="text-gray-400 text-sm mt-1">Setting up your personalized dashboard</p>
                </div>
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                <AutomationList id={hasAutomations ? automations[0].id : ''} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-6 space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">My Automations</h2>
              </div>
              
              <AutomationStatus count={automations.length} isLoading={isLoading} />
            </div>

            {/* Automation List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Recent Automations</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {automations.length}
                  </span>
                </div>
              </div>
              
              <div className="max-h-[50vh] overflow-y-auto">
                <div className="p-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <AutomationSkeleton key={index} index={index} />
                      ))
                    ) : error ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-8"
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-red-600 font-medium">Failed to load automations</p>
                        <p className="text-red-400 text-sm mt-1">Please try refreshing the page</p>
                      </motion.div>
                    ) : automations.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-8"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium">No automations yet</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first automation to get started</p>
                      </motion.div>
                    ) : (
                      automations.map((automation, index) => (
                        <AutomationCard 
                          key={automation.id} 
                          automation={automation} 
                          index={index}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50 p-6">
                <CreateAutomation />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Page