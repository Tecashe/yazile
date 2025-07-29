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

// 'use client'

// import AutomationList from '@/components/global/automation-list'
// import CreateAutomation from '@/components/global/create-automation'
// import { useQueryAutomations } from '@/hooks/user-queries'
// import { Check, Zap, Sparkles, Rocket, Loader2, TrendingUp, Clock, Activity, Plus, MoreVertical, Settings, Trash2, Edit3 } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import React, { useState } from 'react'

// const AutomationStatus = ({ count, isLoading }: { count: number; isLoading: boolean }) => {
//   if (isLoading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-200/20"
//       >
//         <div className="relative">
//           <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
//           <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
//         </div>
//         <div>
//           <p className="font-medium text-foreground">Loading your automations...</p>
//           <p className="text-sm text-muted-foreground">Preparing your workflow dashboard</p>
//         </div>
//       </motion.div>
//     )
//   }

//   const configs = [
//     {
//       condition: count === 0,
//       icon: Zap,
//       title: "Ready to supercharge your workflow?",
//       subtitle: "Create your first automation and watch the magic happen!",
//       gradient: "from-yellow-400 to-orange-500",
//       bg: "from-yellow-500/10 to-orange-500/10",
//       border: "border-yellow-500/20"
//     },
//     {
//       condition: count < 3,
//       icon: Sparkles,
//       title: "Great momentum!",
//       subtitle: `${count} automation${count !== 1 ? 's' : ''} active. You're building something amazing!`,
//       gradient: "from-green-400 to-emerald-500",
//       bg: "from-green-500/10 to-emerald-500/10",
//       border: "border-green-500/20"
//     },
//     {
//       condition: count >= 3,
//       icon: Rocket,
//       title: "Automation Master!",
//       subtitle: `${count} automations running. Your workflow is optimized!`,
//       gradient: "from-blue-400 to-purple-500",
//       bg: "from-blue-500/10 to-purple-500/10",
//       border: "border-blue-500/20"
//     }
//   ]

//   const config = configs.find(c => c.condition) || configs[0]
//   const Icon = config.icon

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`relative overflow-hidden p-4 bg-gradient-to-br ${config.bg} rounded-xl border ${config.border} backdrop-blur-sm`}
//     >
//       <div className="flex items-center gap-3">
//         <div className={`relative p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg`}>
//           <Icon className="w-6 h-6 text-white" />
//           <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
//         </div>
//         <div>
//           <h3 className="font-semibold text-foreground">{config.title}</h3>
//           <p className="text-sm text-muted-foreground">{config.subtitle}</p>
//         </div>
//       </div>
      
//       {/* Floating elements */}
//       <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-60 animate-bounce" />
//       <div className="absolute top-4 -right-1 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-40 animate-pulse" />
//     </motion.div>
//   )
// }

// const AutomationSkeleton = ({ index }: { index: number }) => (
//   <motion.div 
//     initial={{ opacity: 0, x: -20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay: index * 0.1 }}
//     className="group relative p-4 bg-card rounded-xl border border-border animate-pulse"
//   >
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 bg-muted rounded-lg" />
//         <div>
//           <div className="h-4 bg-muted rounded-md w-24 mb-2" />
//           <div className="h-3 bg-muted/60 rounded-md w-16" />
//         </div>
//       </div>
//       <div className="w-5 h-5 bg-muted rounded-full" />
//     </div>
//   </motion.div>
// )

// const AutomationCard = ({ automation, index }: { automation: any; index: number }) => {
//   const [showActions, setShowActions] = useState(false)
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ 
//         duration: 0.4, 
//         delay: index * 0.1,
//         type: "spring",
//         stiffness: 100
//       }}
//       whileHover={{ 
//         scale: 1.02,
//         transition: { duration: 0.2 }
//       }}
//       className={`group relative p-4 bg-card rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 ${
//         automation._isOptimistic 
//           ? 'border-yellow-500/30 bg-yellow-500/5 animate-pulse' 
//           : 'border-border'
//       }`}
//     >
//       {/* Glow effect on hover */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
//       <div className="relative flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Status indicator */}
//           <div className={`relative p-2.5 rounded-lg shadow-sm ${
//             automation._isOptimistic 
//               ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
//               : automation.active 
//                 ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
//                 : 'bg-gradient-to-br from-muted-foreground to-muted-foreground'
//           }`}>
//             {automation._isOptimistic ? (
//               <Loader2 className="w-4 h-4 text-white animate-spin" />
//             ) : automation.active ? (
//               <Activity className="w-4 h-4 text-white" />
//             ) : (
//               <Clock className="w-4 h-4 text-white" />
//             )}
            
//             {/* Pulse animation for active automations */}
//             {automation.active && !automation._isOptimistic && (
//               <div className="absolute inset-0 bg-green-400 rounded-lg animate-ping opacity-30" />
//             )}
//           </div>
          
//           <div className="flex-1">
//             <div className="flex items-center gap-2">
//               <h3 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">
//                 {automation.name}
//               </h3>
//               {automation._isOptimistic && (
//                 <motion.span 
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30"
//                 >
//                   Creating...
//                 </motion.span>
//               )}
//             </div>
            
//             <div className="flex items-center gap-3 mt-1">
//               <p className="text-sm text-muted-foreground">
//                 {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : 'No Date'}
//               </p>
              
//               {automation.keywords?.length > 0 && (
//                 <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
//                   {automation.keywords.length} keyword{automation.keywords.length !== 1 ? 's' : ''}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <Check className={`w-5 h-5 ${
//               automation._isOptimistic 
//                 ? 'text-yellow-500' 
//                 : 'text-green-500'
//             }`} />
//           </motion.div>
          
//           {!automation._isOptimistic && (
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setShowActions(!showActions)}
//               className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
//             >
//               <MoreVertical className="w-4 h-4" />
//             </motion.button>
//           )}
//         </div>
//       </div>
      
//       {/* Quick stats */}
//       {!automation._isOptimistic && (
//         <motion.div 
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: 'auto' }}
//           className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground"
//         >
//           <span className="flex items-center gap-1">
//             <TrendingUp className="w-3 h-3" />
//             {Math.floor(Math.random() * 100)} interactions
//           </span>
//           <span className={`px-2 py-1 rounded-full ${
//             automation.active 
//               ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
//               : 'bg-muted text-muted-foreground'
//           }`}>
//             {automation.active ? 'Active' : 'Paused'}
//           </span>
//         </motion.div>
//       )}
//     </motion.div>
//   )
// }

// const Page = () => {
//   const { data, isLoading, error, isSuccess } = useQueryAutomations()
  
//   const automations = data?.data || []
//   const hasAutomations = isSuccess && automations.length > 0

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Dark theme floating background elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500/3 to-blue-500/3 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
//       </div>
      
//       <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
//         {/* Main Content */}
//         <div className="lg:col-span-8 space-y-6">
//           {/* Header */}
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center justify-between"
//           >
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">
//                 Automation Dashboard
//               </h1>
//               <p className="text-muted-foreground mt-1">Manage and monitor your automated workflows</p>
//             </div>
            
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="hidden lg:block"
//             >
//               <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
//                 <Activity className="w-4 h-4 text-blue-400" />
//                 <span className="text-sm font-medium text-foreground">
//                   {automations.filter(a => a.active).length} Active
//                 </span>
//               </div>
//             </motion.div>
//           </motion.div>
          
//           {/* Automation List */}
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border shadow-xl overflow-hidden"
//           >
//             {isLoading ? (
//               <div className="p-8 flex items-center justify-center">
//                 <div className="text-center">
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                     className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
//                   >
//                     <Loader2 className="w-6 h-6 text-white" />
//                   </motion.div>
//                   <p className="text-foreground font-medium">Loading your automation workspace...</p>
//                   <p className="text-muted-foreground text-sm mt-1">Setting up your personalized dashboard</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="max-h-[70vh] overflow-y-auto">
//                 <AutomationList id={hasAutomations ? automations[0].id : ''} />
//               </div>
//             )}
//           </motion.div>
//         </div>

//         {/* Sidebar */}
//         <div className="lg:col-span-4">
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="sticky top-6 space-y-6"
//           >
//             {/* Status Card */}
//             <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border shadow-xl p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
//                   <Sparkles className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-foreground">My Automations</h2>
//               </div>
              
//               <AutomationStatus count={automations.length} isLoading={isLoading} />
//             </div>

//             {/* Automation List */}
//             <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border shadow-xl overflow-hidden">
//               <div className="p-6 border-b border-border">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold text-foreground">Recent Automations</h3>
//                   <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
//                     {automations.length}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="max-h-[50vh] overflow-y-auto">
//                 <div className="p-4 space-y-3">
//                   <AnimatePresence mode="popLayout">
//                     {isLoading ? (
//                       Array.from({ length: 3 }).map((_, index) => (
//                         <AutomationSkeleton key={index} index={index} />
//                       ))
//                     ) : error ? (
//                       <motion.div 
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-center p-8"
//                       >
//                         <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-500/30">
//                           <Zap className="w-6 h-6 text-red-400" />
//                         </div>
//                         <p className="text-red-400 font-medium">Failed to load automations</p>
//                         <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page</p>
//                       </motion.div>
//                     ) : automations.length === 0 ? (
//                       <motion.div 
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-center p-8"
//                       >
//                         <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
//                           <Plus className="w-8 h-8 text-muted-foreground" />
//                         </div>
//                         <p className="text-foreground font-medium">No automations yet</p>
//                         <p className="text-muted-foreground text-sm mt-1">Create your first automation to get started</p>
//                       </motion.div>
//                     ) : (
//                       automations.map((automation, index) => (
//                         <AutomationCard 
//                           key={automation.id} 
//                           automation={automation} 
//                           index={index}
//                         />
//                       ))
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>

//             {/* Create Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="relative"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl animate-pulse" />
//               <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl p-6">
//                 <CreateAutomation />
//               </div>
//             </motion.div>
//           </motion.div>
          
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page

// "use client"

// import AutomationList from "@/components/global/automation-list"
// import CreateAutomation from "@/components/global/create-automation"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import { Check, Zap, Sparkles, Rocket, Loader2, TrendingUp, Activity, MessageCircle, BarChart3 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"

// const AutomationStatus = ({ count, isLoading }: { count: number; isLoading: boolean }) => {
//   if (isLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/20"
//       >
//         <div className="relative">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
//           <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
//         </div>
//         <div>
//           <p className="font-semibold text-foreground">Loading your automations...</p>
//           <p className="text-sm text-muted-foreground">Preparing your workflow dashboard</p>
//         </div>
//       </motion.div>
//     )
//   }

//   const configs = [
//     {
//       condition: count === 0,
//       icon: Zap,
//       title: "Ready to automate?",
//       subtitle: "Create your first automation and boost productivity!",
//       gradient: "from-yellow-400 to-orange-500",
//       bg: "from-yellow-500/10 to-orange-500/10",
//       border: "border-yellow-500/20",
//     },
//     {
//       condition: count < 3,
//       icon: Sparkles,
//       title: "Great progress!",
//       subtitle: `${count} automation${count !== 1 ? "s" : ""} running. Keep building!`,
//       gradient: "from-green-400 to-emerald-500",
//       bg: "from-green-500/10 to-emerald-500/10",
//       border: "border-green-500/20",
//     },
//     {
//       condition: count >= 3,
//       icon: Rocket,
//       title: "Automation Expert!",
//       subtitle: `${count} automations optimizing your workflow!`,
//       gradient: "from-blue-400 to-purple-500",
//       bg: "from-blue-500/10 to-purple-500/10",
//       border: "border-blue-500/20",
//     },
//   ]

//   const config = configs.find((c) => c.condition) || configs[0]
//   const Icon = config.icon

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`relative overflow-hidden p-6 bg-gradient-to-br ${config.bg} rounded-xl border ${config.border} backdrop-blur-sm`}
//     >
//       <div className="flex items-center gap-4">
//         <div className={`relative p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg`}>
//           {/* <Icon className="w-6 h-6 text-white" /> */}
//           <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
//         </div>
//         <div>
//           <h3 className="font-bold text-foreground text-lg">{config.title}</h3>
//           <p className="text-muted-foreground">{config.subtitle}</p>
//         </div>
//       </div>

//       {/* Floating elements */}
//       <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-60 animate-bounce" />
//       <div className="absolute top-4 -right-1 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-40 animate-pulse" />
//     </motion.div>
//   )
// }

// const AutomationSkeleton = ({ index }: { index: number }) => (
//   <motion.div
//     initial={{ opacity: 0, x: -20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay: index * 0.1 }}
//     className="group relative p-4 bg-card rounded-xl border border-border animate-pulse"
//   >
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 bg-muted rounded-lg" />
//         <div>
//           <div className="h-4 bg-muted rounded-md w-24 mb-2" />
//           <div className="h-3 bg-muted/60 rounded-md w-16" />
//         </div>
//       </div>
//       <div className="w-5 h-5 bg-muted rounded-full" />
//     </div>
//   </motion.div>
// )

// const AutomationCard = ({ automation, index }: { automation: any; index: number }) => {
//   const [showActions, setShowActions] = useState(false)

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{
//         duration: 0.4,
//         delay: index * 0.1,
//         type: "spring",
//         stiffness: 100,
//       }}
//       whileHover={{
//         scale: 1.02,
//         transition: { duration: 0.2 },
//       }}
//       className={`group relative p-4 bg-card rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 ${
//         automation._isOptimistic ? "border-yellow-500/30 bg-yellow-500/5 animate-pulse" : "border-border"
//       }`}
//     >
//       {/* Glow effect on hover */}
//       <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       <div className="relative flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Status indicator */}
//           <div
//             className={`relative p-2.5 rounded-lg shadow-sm ${
//               automation._isOptimistic
//                 ? "bg-gradient-to-br from-yellow-400 to-orange-500"
//                 : automation.active
//                   ? "bg-gradient-to-br from-green-400 to-emerald-500"
//                   : "bg-gradient-to-br from-muted-foreground to-muted-foreground"
//             }`}
//           >
//             {automation._isOptimistic ? (
//               <Loader2 className="w-4 h-4 text-white animate-spin" />
//             ) : automation.active ? (
//               <Activity className="w-4 h-4 text-white" />
//             ) : (
//               <Activity className="w-4 h-4 text-white opacity-50" />
//             )}

//             {/* Pulse animation for active automations */}
//             {automation.active && !automation._isOptimistic && (
//               <div className="absolute inset-0 bg-green-400 rounded-lg animate-ping opacity-30" />
//             )}
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2">
//               <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
//                 {automation.name}
//               </h3>
//               {automation._isOptimistic && (
//                 <motion.span
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 text-xs font-medium rounded-full border border-yellow-500/30"
//                 >
//                   Creating...
//                 </motion.span>
//               )}
//             </div>

//             <div className="flex items-center gap-3 mt-1">
//               <p className="text-sm text-muted-foreground">
//                 {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : "No Date"}
//               </p>

//               {automation.keywords?.length > 0 && (
//                 <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
//                   {automation.keywords.length} keyword{automation.keywords.length !== 1 ? "s" : ""}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <Check className={`w-5 h-5 ${automation._isOptimistic ? "text-yellow-500" : "text-green-500"}`} />
//           </motion.div>
//         </div>
//       </div>

//       {/* Quick stats */}
//       {!automation._isOptimistic && (
//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground"
//         >
//           <span className="flex items-center gap-1">
//             <TrendingUp className="w-3 h-3" />
//             {Math.floor(Math.random() * 100)} interactions
//           </span>
//           <span
//             className={`px-2 py-1 rounded-full ${
//               automation.active
//                 ? "bg-green-500/20 text-green-600 border border-green-500/30"
//                 : "bg-muted text-muted-foreground"
//             }`}
//           >
//             {automation.active ? "Active" : "Paused"}
//           </span>
//         </motion.div>
//       )}
//     </motion.div>
//   )
// }

// const Page = () => {
//   const { data, isLoading, error, isSuccess } = useQueryAutomations()

//   const automations = data?.data || []
//   const hasAutomations = isSuccess && automations.length > 0

//   // Mock metrics
//   const metrics = {
//     totalInteractions: automations.reduce((acc, auto) => acc + Math.floor(Math.random() * 100), 0),
//     activeAutomations: automations.filter((auto) => auto.active).length,
//     totalMessages: automations.reduce((acc, auto) => acc + (auto.listener?.dmCount || 0), 0),
//     conversionRate: Math.floor(Math.random() * 30) + 10,
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Floating background elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl animate-pulse" />
//       </div>

//       <div className="relative max-w-7xl mx-auto p-6 space-y-8">
//         {/* Header */}

//         {/* Metrics Cards */}
//         {!isLoading && hasAutomations && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           >
//             <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-blue-500/20 rounded-lg">
//                   <BarChart3 className="w-6 h-6 text-blue-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Interactions</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.totalInteractions}</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-green-500/20 rounded-lg">
//                   <Activity className="w-6 h-6 text-green-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Active Automations</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.activeAutomations}</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-purple-500/20 rounded-lg">
//                   <MessageCircle className="w-6 h-6 text-purple-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Messages Sent</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.totalMessages}</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-purple-500/20 rounded-lg">
//                   <MessageCircle className="w-6 h-6 text-purple-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Messages Sent</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.totalMessages}</p>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-3 space-y-6">
//             {isLoading ? (
//               <div className="flex items-center justify-center py-20">
//                 <div className="text-center">
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//                     className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4"
//                   >
//                     <Loader2 className="w-6 h-6 text-white" />
//                   </motion.div>
//                   <p className="text-foreground font-medium">Loading your automation workspace...</p>
//                   <p className="text-muted-foreground text-sm mt-1">Setting up your personalized dashboard</p>
//                 </div>
//               </div>
//             ) : (
//               <AutomationList id={hasAutomations ? automations[0].id : ""} />
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="sticky top-6 space-y-6"
//             >
//               {/* Status Card */}
//               <Card className="p-6 bg-card/70 backdrop-blur-sm border border-border shadow-lg">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-xl font-bold text-foreground">Overview</h2>
//                 </div>

//                 <AutomationStatus count={automations.length} isLoading={isLoading} />
//               </Card>

//               {/* Recent Automations */}
//               <Card className="bg-card/70 backdrop-blur-sm border border-border shadow-lg overflow-hidden">
//                 <div className="p-6 border-b border-border">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-foreground">Recent Activity</h3>
//                     <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                       {automations.length}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div className="max-h-[60vh] overflow-y-auto">
//                   <div className="p-4 space-y-3">
//                     <AnimatePresence mode="popLayout">
//                       {isLoading ? (
//                         Array.from({ length: 3 }).map((_, index) => <AutomationSkeleton key={index} index={index} />)
//                       ) : error ? (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.9 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="text-center p-8"
//                         >
//                           <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-destructive/30">
//                             <Zap className="w-6 h-6 text-destructive" />
//                           </div>
//                           <p className="text-destructive font-medium">Failed to load automations</p>
//                           <p className="text-muted-foreground text-sm mt-1">Please try refreshing the page</p>
//                         </motion.div>
//                       ) : automations.length === 0 ? (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.9 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="text-center p-8"
//                         >
//                           <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
//                             <Zap className="w-8 h-8 text-muted-foreground" />
//                           </div>
//                           <p className="text-foreground font-medium">No automations yet</p>
//                           <p className="text-muted-foreground text-sm mt-1">
//                             Create your first automation to get started
//                           </p>
//                         </motion.div>
//                       ) : (
//                         automations
//                           .slice(0, 5)
//                           .map((automation, index) => (
//                             <AutomationCard key={automation.id} automation={automation} index={index} />
//                           ))
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               </Card>

//               {/* Create Button */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 }}
//                 className="relative"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl animate-pulse" />
//                 <Card className="relative bg-card/80 backdrop-blur-sm border border-border shadow-lg p-6">
//                   <CreateAutomation />
//                 </Card>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page




// "use client"

// import AutomationList from "@/components/global/automation-list"
// import CreateAutomation from "@/components/global/create-automation"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import { Check, Zap, Sparkles, Rocket, Loader2, TrendingUp, Activity, MessageCircle, BarChart3 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"

// const AutomationStatus = ({ count, isLoading }: { count: number; isLoading: boolean }) => {
//   if (isLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/20"
//       >
//         <div className="relative">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
//           <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
//         </div>
//         <div>
//           <p className="font-semibold text-foreground">Loading automations...</p>
//           <p className="text-sm text-muted-foreground">This should only take a moment</p>
//         </div>
//       </motion.div>
//     )
//   }

//   const configs = [
//     {
//       condition: count === 0,
//       icon: Zap,
//       title: "Ready to automate?",
//       subtitle: "Create your first automation and boost productivity!",
//       gradient: "from-yellow-400 to-orange-500",
//       bg: "from-yellow-500/10 to-orange-500/10",
//       border: "border-yellow-500/20",
//     },
//     {
//       condition: count < 3,
//       icon: Sparkles,
//       title: "Great progress!",
//       subtitle: `${count} automation${count !== 1 ? "s" : ""} running. Keep building!`,
//       gradient: "from-green-400 to-emerald-500",
//       bg: "from-green-500/10 to-emerald-500/10",
//       border: "border-green-500/20",
//     },
//     {
//       condition: count >= 3,
//       icon: Rocket,
//       title: "Automation Expert!",
//       subtitle: `${count} automations optimizing your workflow!`,
//       gradient: "from-blue-400 to-purple-500",
//       bg: "from-blue-500/10 to-purple-500/10",
//       border: "border-blue-500/20",
//     },
//   ]

//   const config = configs.find((c) => c.condition) || configs[0]
//   const Icon = config.icon

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`relative overflow-hidden p-6 bg-gradient-to-br ${config.bg} rounded-xl border ${config.border} backdrop-blur-sm`}
//     >
//       <div className="flex items-center gap-4">
//         <div className={`relative p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg`}>
//           <Icon className="w-6 h-6 text-white" />
//           <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
//         </div>
//         <div>
//           <h3 className="font-bold text-foreground text-lg">{config.title}</h3>
//           <p className="text-muted-foreground">{config.subtitle}</p>
//         </div>
//       </div>

//       {/* Floating elements */}
//       <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-60 animate-bounce" />
//       <div className="absolute top-4 -right-1 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-40 animate-pulse" />
//     </motion.div>
//   )
// }

// const AutomationSkeleton = ({ index }: { index: number }) => (
//   <motion.div
//     initial={{ opacity: 0, x: -20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay: index * 0.1 }}
//     className="group relative p-4 bg-card rounded-xl border border-border animate-pulse"
//   >
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 bg-muted rounded-lg" />
//         <div>
//           <div className="h-4 bg-muted rounded-md w-24 mb-2" />
//           <div className="h-3 bg-muted/60 rounded-md w-16" />
//         </div>
//       </div>
//       <div className="w-5 h-5 bg-muted rounded-full" />
//     </div>
//   </motion.div>
// )

// const AutomationCard = ({ automation, index }: { automation: any; index: number }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{
//         duration: 0.4,
//         delay: index * 0.1,
//         type: "spring",
//         stiffness: 100,
//       }}
//       whileHover={{
//         scale: 1.02,
//         transition: { duration: 0.2 },
//       }}
//       className={`group relative p-4 bg-card rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 ${
//         automation._isOptimistic ? "border-yellow-500/30 bg-yellow-500/5 animate-pulse" : "border-border"
//       }`}
//     >
//       {/* Glow effect on hover */}
//       <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       <div className="relative flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Statuss indicator */}
//           <div
//             className={`relative p-2.5 rounded-lg shadow-sm ${
//               automation._isOptimistic
//                 ? "bg-gradient-to-br from-yellow-400 to-orange-500"
//                 : automation.active
//                   ? "bg-gradient-to-br from-green-400 to-emerald-500"
//                   : "bg-gradient-to-br from-muted-foreground to-muted-foreground"
//             }`}
//           >
//             {automation._isOptimistic ? (
//               <Loader2 className="w-4 h-4 text-white animate-spin" />
//             ) : automation.active ? (
//               <Activity className="w-4 h-4 text-white" />
//             ) : (
//               <Activity className="w-4 h-4 text-white opacity-50" />
//             )}

//             {/* Pulse animation for active automations */}
//             {automation.active && !automation._isOptimistic && (
//               <div className="absolute inset-0 bg-green-400 rounded-lg animate-ping opacity-30" />
//             )}
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2">
//               <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
//                 {automation.name}
//               </h3>
//               {automation._isOptimistic && (
//                 <motion.span
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 text-xs font-medium rounded-full border border-yellow-500/30"
//                 >
//                   Creating...
//                 </motion.span>
//               )}
//             </div>

//             <div className="flex items-center gap-3 mt-1">
//               <p className="text-sm text-muted-foreground">
//                 {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : "No Date"}
//               </p>

//               {automation.keywords?.length > 0 && (
//                 <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
//                   {automation.keywords.length} keyword{automation.keywords.length !== 1 ? "s" : ""}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <Check className={`w-5 h-5 ${automation._isOptimistic ? "text-yellow-500" : "text-green-500"}`} />
//           </motion.div>
//         </div>
//       </div>

//       {/* Quick stats */}
//       {!automation._isOptimistic && (
//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground"
//         >
//           <span className="flex items-center gap-1">
//             <TrendingUp className="w-3 h-3" />
//             {Math.floor(Math.random() * 100)} interactions
//           </span>
//           <span
//             className={`px-2 py-1 rounded-full ${
//               automation.active
//                 ? "bg-green-500/20 text-green-600 border border-green-500/30"
//                 : "bg-muted text-muted-foreground"
//             }`}
//           >
//             {automation.active ? "Active" : "Paused"}
//           </span>
//         </motion.div>
//       )}
//     </motion.div>
//   )
// }

// const Page = () => {
//   const { data, isLoading, isFetching } = useQueryAutomations()

//   // Let AutomationList handle its own data states
//   const automations = data?.data || []
//   const hasAutomations = data?.data && data.data.length > 0

//   // Only calculate metrics if we have successful data
//   const metrics = hasAutomations
//     ? {
//         totalInteractions: automations.reduce((acc, auto) => acc + Math.floor(Math.random() * 100), 0),
//         activeAutomations: automations.filter((auto) => auto.active).length,
//         totalMessages: automations.reduce((acc, auto) => acc + (auto.listener?.dmCount || 0), 0),
//         conversionRate: Math.floor(Math.random() * 30) + 10,
//       }
//     : null

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Floating background elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl animate-pulse" />
//       </div>

//       <div className="relative max-w-7xl mx-auto p-6 space-y-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center justify-between"
//         >
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Automation Dashboard</h1>
//             <p className="text-muted-foreground mt-1">
//               Manage and monitor your automated workflows
//               {isFetching && <span className="ml-2 text-primary">• Refreshing...</span>}
//             </p>
//           </div>
//         </motion.div>

//         {/* Metrics Cards - Only show when we have data and it's not the initial load */}
//         {!isLoading && hasAutomations && metrics && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           >
//             <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-blue-500/20 rounded-lg">
//                   <BarChart3 className="w-6 h-6 text-blue-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Interactions</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.totalInteractions}</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-green-500/20 rounded-lg">
//                   <Activity className="w-6 h-6 text-green-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Active Automations</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.activeAutomations}</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-purple-500/20 rounded-lg">
//                   <MessageCircle className="w-6 h-6 text-purple-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Messages Sent</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.totalMessages}</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-orange-500/20 rounded-lg">
//                   <TrendingUp className="w-6 h-6 text-orange-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Conversion Rate</p>
//                   <p className="text-2xl font-bold text-foreground">{metrics.conversionRate}%</p>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Main Content - Let AutomationList handle its own states */}
//           <div className="lg:col-span-3 space-y-6">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//               <AutomationList id={hasAutomations ? automations[0]?.id || "" : ""} />
//             </motion.div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="sticky top-6 space-y-6"
//             >
//               {/* Status Card */}
//               <Card className="p-6 bg-card/70 backdrop-blur-sm border border-border shadow-lg">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-xl font-bold text-foreground">Overview</h2>
//                 </div>

//                 <AutomationStatus count={automations.length} isLoading={isLoading} />
//               </Card>

//               {/* Recent Automations */}
//               <Card className="bg-card/70 backdrop-blur-sm border border-border shadow-lg overflow-hidden">
//                 <div className="p-6 border-b border-border">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-foreground">Recent Activity</h3>
//                     <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                       {automations.length}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div className="max-h-[60vh] overflow-y-auto">
//                   <div className="p-4 space-y-3">
//                     <AnimatePresence mode="popLayout">
//                       {isLoading ? (
//                         Array.from({ length: 3 }).map((_, index) => <AutomationSkeleton key={index} index={index} />)
//                       ) : automations.length === 0 ? (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.9 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="text-center p-8"
//                         >
//                           <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
//                             <Zap className="w-8 h-8 text-muted-foreground" />
//                           </div>
//                           <p className="text-foreground font-medium">No automations yet</p>
//                           <p className="text-muted-foreground text-sm mt-1">
//                             Create your first automation to get started
//                           </p>
//                         </motion.div>
//                       ) : (
//                         automations
//                           .slice(0, 5)
//                           .map((automation, index) => (
//                             <AutomationCard key={automation.id} automation={automation} index={index} />
//                           ))
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               </Card>

//               {/* Create Button */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 }}
//                 className="relative"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl animate-pulse" />
//                 <Card className="relative bg-card/80 backdrop-blur-sm border border-border shadow-lg p-6">
//                   <CreateAutomation />
//                 </Card>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page



"use client"

import AutomationList from "@/components/global/automation-list"
import CreateAutomation from "@/components/global/create-automation"
import { useQueryAutomations } from "@/hooks/user-queries"
import { Activity, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Page = () => {
  const { data, isLoading, isFetching } = useQueryAutomations()
  const automations = data?.data || []
  const activeCount = automations.filter((auto) => auto.active).length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Clean Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Automations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your automated workflows
              {isFetching && <span className="text-primary"> • Syncing...</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Simple Status Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">
                {activeCount} of {automations.length} active
              </span>
            </div>
            
            {/* Create Button */}
            <CreateAutomation />
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-6">
          {/* Key Metrics - Simplified */}
          {!isLoading && automations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Automations</p>
                    <p className="text-2xl font-semibold">{automations.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-semibold text-green-600">{activeCount}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-semibold">94%</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Automation List - Clean Focus */}
          <Card className="border-0 shadow-sm">
            <AutomationList id={automations.length > 0 ? automations[0]?.id || "" : ""} />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page