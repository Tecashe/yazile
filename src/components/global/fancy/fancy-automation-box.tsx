
// "use client"

// import type React from "react"
// import { useState } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ActiveIndicator } from "../indicators/active-indicator"
// import { InactiveIndicator } from "../indicators/inactive-indicator"
// import { Sparkles, Zap, Trash2, Settings, MessageSquareText,MessageSquare, ChevronDown, ChevronUp,Clock } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts"
// import { motion, AnimatePresence } from "framer-motion"


// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
// }

// interface FancyAutomationBoxProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
// }

// export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({ automation, onDelete, pathname }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   // Mock data for current sentiment
//   const sentimentData = [
//     { name: "Positive", value: 65, color: "#10B981" },
//     { name: "Neutral", value: 25, color: "#6B7280" },
//     { name: "Negative", value: 10, color: "#EF4444" },
//   ]

//   return (
//     <Card className="bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden">
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
//           <div className="flex items-center space-x-2">
//             {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                 <Sparkles size={14} className="mr-1" />
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
//                 <Zap size={14} className="mr-1" />
//                 FREE
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {automation.keywords.map((keyword, key) => (
//             <Badge
//               key={keyword.id}
//               variant="outline"
//               className={cn(
//                 "capitalize",
//                 key % 4 === 0 && "border-green-500/30 text-green-500",
//                 key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                 key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                 key % 4 === 3 && "border-red-500/30 text-red-500",
//               )}
//             >
//               {keyword.word}
//             </Badge>
//           ))}
//         </div>

//         {automation.keywords.length === 0 && (
//           <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
//             No Keywords
//           </Badge>
//         )}

//         <AutomationStats automation={automation} />

//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-destructive/30 text-destructive hover:bg-destructive/10"
//               onClick={() => setShowDeleteConfirm(true)}
//             >
//               <Trash2 size={16} className="mr-2" />
//               Delete
//             </Button>
//             <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
//               <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                 <Settings size={16} className="mr-2" />
//                 Configure
//               </Link>
//             </Button>
//           </div>
//           <div className="relative group">
//             <Button
//               variant="outline"
//               size="sm"
//               className="rounded-full border-2 border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary transition-all duration-300 pl-3 pr-8"
//               onClick={() => setShowChats(!showChats)}
//             >
//               <MessageSquareText size={18} className="mr-2" />
//               <span className="font-medium">Chats</span>
//               <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary/20 group-hover:bg-secondary/40 transition-all duration-300 flex items-center justify-center">
//                 <ChevronDown
//                   size={12}
//                   className={`text-secondary transition-transform duration-300 ${showChats ? "rotate-180" : ""}`}
//                 />
//               </div>
//             </Button>
//             <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></div>
//             <div className="absolute top-full right-0 mt-2 bg-popover text-popover-foreground rounded-md p-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//               {showChats ? "Close Chats" : "Open Chats"}
//             </div>
//           </div>
//         </div>

//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
//             <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
//             <div className="flex space-x-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Confirm Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock size={16} />
//             <p className="text-sm font-medium">Created {getRelativeTime(automation.createdAt)}</p>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-foreground">Current Sentiment</h3>
//             <div className="h-24">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={sentimentData} layout="vertical">
//                   <XAxis type="number" hide />
//                   <YAxis dataKey="name" type="category" hide />
//                   <RechartsTooltip
//                     contentStyle={{
//                       backgroundColor: "hsl(var(--background))",
//                       border: "1px solid hsl(var(--border))",
//                       borderRadius: "0.5rem",
//                     }}
//                     formatter={(value, name, props) => [`${value}%`, props.payload.name]}
//                   />
//                   <Bar dataKey="value" radius={[0, 4, 4, 0]}>
//                     {sentimentData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="flex justify-between mt-2">
//               {sentimentData.map((item) => (
//                 <div key={item.name} className="text-center">
//                   <p className="text-sm font-medium" style={{ color: item.color }}>
//                     {item.name}
//                   </p>
//                   <p className="text-lg font-bold text-foreground">{item.value}%</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/*  */}
//         <div className="mt-6 border-t border-[#545454] pt-4">
//           <button
//             className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
//             onClick={() => setShowChats(!showChats)}
//           >
//             <div className="flex items-center">
//               <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                 <MessageSquare size={16} className="text-blue-400" />
//               </div>
//               <span className="font-medium">View Conversation History</span>
//               {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                 <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                   {automation.listener.dmCount} messages
//                 </Badge>
//               )}
//             </div>
//             <div>
//               {showChats ? (
//                 <ChevronUp size={20} className="text-[#9B9CA0]" />
//               ) : (
//                 <ChevronDown size={20} className="text-[#9B9CA0]" />
//               )}
//             </div>
//           </button>
//         </div>

//         <AnimatePresence>
//           {showChats && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{
//                 height: "auto",
//                 opacity: 1,
//                 transition: { duration: 0.3, ease: "easeOut" },
//               }}
//               exit={{
//                 height: 0,
//                 opacity: 0,
//                 transition: { duration: 0.2, ease: "easeIn" },
//               }}
//               className="w-full overflow-hidden"
//             >
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1, duration: 0.3 }}
//                 className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//               >
//                 <AutomationChats automationId={automation.id} />
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Decorative element */}
//       <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50" />
//     </Card>
//   )
// }

// export default FancyAutomationBox


// "use client"

// import type React from "react"
// import { useState } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ActiveIndicator } from "../indicators/active-indicator"
// import { InactiveIndicator } from "../indicators/inactive-indicator"
// import {
//   Sparkles,
//   Zap,
//   Trash2,
//   Settings,
//   MessageSquareText,
//   MessageSquare,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Loader2,
// } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts"
// import { motion, AnimatePresence } from "framer-motion"

// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// interface FancyAutomationBoxProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
//   isOptimistic?: boolean
// }

// export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({
//   automation,
//   onDelete,
//   pathname,
//   isOptimistic,
// }) => {
//   // Use the _isOptimistic flag from the automation object if isOptimistic prop is not provided
//   const isOptimisticState = isOptimistic || automation._isOptimistic

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   // Mock data for current sentiment
//   const sentimentData = [
//     { name: "Positive", value: 65, color: "#10B981" },
//     { name: "Neutral", value: 25, color: "#6B7280" },
//     { name: "Negative", value: 10, color: "#EF4444" },
//   ]

//   return (
//     <Card
//       className={cn(
//         "bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden",
//         isOptimisticState && "border-primary/30 bg-background/95",
//       )}
//     >
//       {isOptimisticState && (
//         <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none">
//           <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center animate-pulse">
//             <Loader2 size={14} className="mr-2 animate-spin" />
//             Creating...
//           </div>
//         </div>
//       )}

//       <div className="p-6 relative z-20">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
//           <div className="flex items-center space-x-2">
//             {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                 <Sparkles size={14} className="mr-1" />
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
//                 <Zap size={14} className="mr-1" />
//                 FREE
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {automation.keywords &&
//             automation.keywords.map((keyword, key) => (
//               <Badge
//                 key={keyword.id}
//                 variant="outline"
//                 className={cn(
//                   "capitalize",
//                   key % 4 === 0 && "border-green-500/30 text-green-500",
//                   key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                   key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                   key % 4 === 3 && "border-red-500/30 text-red-500",
//                 )}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//         </div>

//         {(!automation.keywords || automation.keywords.length === 0) && (
//           <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
//             No Keywords
//           </Badge>
//         )}

//         <AutomationStats automation={automation} />

//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-destructive/30 text-destructive hover:bg-destructive/10"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={isOptimisticState}
//             >
//               <Trash2 size={16} className="mr-2" />
//               Delete
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn(
//                 "border-primary/30 text-primary hover:bg-primary/10",
//                 isOptimisticState && "opacity-50 cursor-not-allowed",
//               )}
//               disabled={isOptimisticState}
//             >
//               {isOptimisticState ? (
//                 <div className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </div>
//               ) : (
//                 <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </Link>
//               )}
//             </Button>
//           </div>
//           {/* <div className="relative group">
//             <Button
//               variant="outline"
//               size="sm"
//               className="rounded-full border-2 border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary transition-all duration-300 pl-3 pr-8"
//               onClick={() => setShowChats(!showChats)}
//               disabled={isOptimisticState}
//             >
//               <MessageSquareText size={18} className="mr-2" />
//               <span className="font-medium">Chats</span>
//               <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary/20 group-hover:bg-secondary/40 transition-all duration-300 flex items-center justify-center">
//                 <ChevronDown
//                   size={12}
//                   className={`text-secondary transition-transform duration-300 ${showChats ? "rotate-180" : ""}`}
//                 />
//               </div>
//             </Button>
//             {!isOptimisticState && (
//               <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></div>
//             )}
//             <div className="absolute top-full right-0 mt-2 bg-popover text-popover-foreground rounded-md p-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//               {showChats ? "Close Chats" : "Open Chats"}
//             </div>
//           </div> */}
//         </div>

//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
//             <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
//             <div className="flex space-x-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Confirm Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock size={16} />
//             <p className="text-sm font-medium">
//               {isOptimisticState ? "Creating..." : `Created ${getRelativeTime(automation.createdAt)}`}
//             </p>
//           </div>

//           {!isOptimisticState && (
//             <div>
//               <h3 className="text-lg font-semibold mb-2 text-foreground">Current Sentiment</h3>
//               <div className="h-24">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={sentimentData} layout="vertical">
//                     <XAxis type="number" hide />
//                     <YAxis dataKey="name" type="category" hide />
//                     <RechartsTooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(var(--background))",
//                         border: "1px solid hsl(var(--border))",
//                         borderRadius: "0.5rem",
//                       }}
//                       formatter={(value, name, props) => [`${value}%`, props.payload.name]}
//                     />
//                     <Bar dataKey="value" radius={[0, 4, 4, 0]}>
//                       {sentimentData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="flex justify-between mt-2">
//                 {sentimentData.map((item) => (
//                   <div key={item.name} className="text-center">
//                     <p className="text-sm font-medium" style={{ color: item.color }}>
//                       {item.name}
//                     </p>
//                     <p className="text-lg font-bold text-foreground">{item.value}%</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {!isOptimisticState && (
//           <>
//             <div className="mt-6 border-t border-[#545454] pt-4">
//               <button
//                 className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
//                 onClick={() => setShowChats(!showChats)}
//                 disabled={isOptimisticState}
//               >
//                 <div className="flex items-center">
//                   <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                     <MessageSquare size={16} className="text-blue-400" />
//                   </div>
//                   <span className="font-medium">View Conversation History</span>
//                   {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                     <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                       {automation.listener.dmCount} messages
//                     </Badge>
//                   )}
//                 </div>
//                 <div>
//                   {showChats ? (
//                     <ChevronUp size={20} className="text-[#9B9CA0]" />
//                   ) : (
//                     <ChevronDown size={20} className="text-[#9B9CA0]" />
//                   )}
//                 </div>
//               </button>
//             </div>

//             <AnimatePresence>
//               {showChats && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{
//                     height: "auto",
//                     opacity: 1,
//                     transition: { duration: 0.3, ease: "easeOut" },
//                   }}
//                   exit={{
//                     height: 0,
//                     opacity: 0,
//                     transition: { duration: 0.2, ease: "easeIn" },
//                   }}
//                   className="w-full overflow-hidden"
//                 >
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.1, duration: 0.3 }}
//                     className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//                   >
//                     <AutomationChats automationId={automation.id} />
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </div>

//       {/* Decorative element */}
//       <div
//         className={cn(
//           "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50",
//           isOptimisticState && "from-primary/30 to-secondary/30 animate-pulse",
//         )}
//       />
//     </Card>
//   )
// }

// export default FancyAutomationBox


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ActiveIndicator } from "../indicators/active-indicator"
// import { InactiveIndicator } from "../indicators/inactive-indicator"
// import { Sparkles, Zap, Trash2, Settings, MessageSquare, ChevronDown, ChevronUp, Clock, Loader2 } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts"
// import { motion, AnimatePresence } from "framer-motion"
// import { getAutomationSentimentStats } from "@/lib/sentiment-tracker"

// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// interface FancyAutomationBoxProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
//   isOptimistic?: boolean
// }

// export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({
//   automation,
//   onDelete,
//   pathname,
//   isOptimistic,
// }) => {
//   // Use the _isOptimistic flag from the automation object if isOptimistic prop is not provided
//   const isOptimisticState = isOptimistic || automation._isOptimistic

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   // Mock data for current sentiment
//   const [sentimentData, setSentimentData] = useState([
//     { name: "Positive", value: 0, color: "#10B981" },
//     { name: "Neutral", value: 0, color: "#6B7280" },
//     { name: "Negative", value: 0, color: "#EF4444" },
//   ])

//   useEffect(() => {
//     if (!isOptimisticState && automation.id) {
//       getAutomationSentimentStats(automation.id).then(setSentimentData)
//     }
//   }, [automation.id, isOptimisticState])

//   return (
//     <Card
//       className={cn(
//         "bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden",
//         isOptimisticState && "border-primary/30 bg-background/95",
//       )}
//     >
//       {isOptimisticState && (
//         <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none">
//           <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center animate-pulse">
//             <Loader2 size={14} className="mr-2 animate-spin" />
//             Creating...
//           </div>
//         </div>
//       )}

//       <div className="p-6 relative z-20">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
//           <div className="flex items-center space-x-2">
//             {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                 <Sparkles size={14} className="mr-1" />
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
//                 <Zap size={14} className="mr-1" />
//                 FREE
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {automation.keywords &&
//             automation.keywords.map((keyword, key) => (
//               <Badge
//                 key={keyword.id}
//                 variant="outline"
//                 className={cn(
//                   "capitalize",
//                   key % 4 === 0 && "border-green-500/30 text-green-500",
//                   key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                   key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                   key % 4 === 3 && "border-red-500/30 text-red-500",
//                 )}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//         </div>

//         {(!automation.keywords || automation.keywords.length === 0) && (
//           <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
//             No Keywords
//           </Badge>
//         )}

//         <AutomationStats automation={automation} />

//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-destructive/30 text-destructive hover:bg-destructive/10"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={isOptimisticState}
//             >
//               <Trash2 size={16} className="mr-2" />
//               Delete
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn(
//                 "border-primary/30 text-primary hover:bg-primary/10",
//                 isOptimisticState && "opacity-50 cursor-not-allowed",
//               )}
//               disabled={isOptimisticState}
//             >
//               {isOptimisticState ? (
//                 <div className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </div>
//               ) : (
//                 <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </Link>
//               )}
//             </Button>
//           </div>
//         </div>

//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
//             <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
//             <div className="flex space-x-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Confirm Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock size={16} />
//             <p className="text-sm font-medium">
//               {isOptimisticState ? "Creating..." : `Created ${getRelativeTime(automation.createdAt)}`}
//             </p>
//           </div>

//           {!isOptimisticState && (
//             <div>
//               <h3 className="text-lg font-semibold mb-2 text-foreground">Current Sentiment</h3>
//               <div className="h-24">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={sentimentData} layout="vertical">
//                     <XAxis type="number" hide />
//                     <YAxis dataKey="name" type="category" hide />
//                     <RechartsTooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(var(--background))",
//                         border: "1px solid hsl(var(--border))",
//                         borderRadius: "0.5rem",
//                       }}
//                       formatter={(value, name, props) => [`${value}%`, props.payload.name]}
//                     />
//                     <Bar dataKey="value" radius={[0, 4, 4, 0]}>
//                       {sentimentData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="flex justify-between mt-2">
//                 {sentimentData.map((item) => (
//                   <div key={item.name} className="text-center">
//                     <p className="text-sm font-medium" style={{ color: item.color }}>
//                       {item.name}
//                     </p>
//                     <p className="text-lg font-bold text-foreground">{item.value}%</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {!isOptimisticState && (
//           <>
//             <div className="mt-6 border-t border-[#545454] pt-4">
//               <button
//                 className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
//                 onClick={() => setShowChats(!showChats)}
//                 disabled={isOptimisticState}
//               >
//                 <div className="flex items-center">
//                   <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                     <MessageSquare size={16} className="text-blue-400" />
//                   </div>
//                   <span className="font-medium">View Conversation History</span>
//                   {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                     <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                       {automation.listener.dmCount} messages
//                     </Badge>
//                   )}
//                 </div>
//                 <div>
//                   {showChats ? (
//                     <ChevronUp size={20} className="text-[#9B9CA0]" />
//                   ) : (
//                     <ChevronDown size={20} className="text-[#9B9CA0]" />
//                   )}
//                 </div>
//               </button>
//             </div>

//             <AnimatePresence>
//               {showChats && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{
//                     height: "auto",
//                     opacity: 1,
//                     transition: { duration: 0.3, ease: "easeOut" },
//                   }}
//                   exit={{
//                     height: 0,
//                     opacity: 0,
//                     transition: { duration: 0.2, ease: "easeIn" },
//                   }}
//                   className="w-full overflow-hidden"
//                 >
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.1, duration: 0.3 }}
//                     className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//                   >
//                     <AutomationChats automationId={automation.id} />
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </div>

//       {/* Decorative element */}
//       <div
//         className={cn(
//           "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50",
//           isOptimisticState && "from-primary/30 to-secondary/30 animate-pulse",
//         )}
//       />
//     </Card>
//   )
// }

// export default FancyAutomationBox


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ActiveIndicator } from "../indicators/active-indicator"
// import { InactiveIndicator } from "../indicators/inactive-indicator"
// import { Sparkles, Zap, Trash2, Settings, MessageSquare, ChevronDown, ChevronUp, Clock, Loader2 } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
// import { motion, AnimatePresence } from "framer-motion"
// import { getAutomationSentimentStats } from "@/lib/sentiment-tracker"

// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// interface FancyAutomationBoxProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
//   isOptimistic?: boolean
// }

// export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({
//   automation,
//   onDelete,
//   pathname,
//   isOptimistic,
// }) => {
//   // Use the _isOptimistic flag from the automation object if isOptimistic prop is not provided
//   const isOptimisticState = isOptimistic || automation._isOptimistic

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   // Mock data for current sentiment
//   const [sentimentData, setSentimentData] = useState([
//     { name: "Positive", value: 0, color: "#10B981" },
//     { name: "Neutral", value: 0, color: "#6B7280" },
//     { name: "Negative", value: 0, color: "#EF4444" },
//   ])

//   useEffect(() => {
//     if (!isOptimisticState && automation.id) {
//       getAutomationSentimentStats(automation.id).then(setSentimentData)
//     }
//   }, [automation.id, isOptimisticState])

//   return (
//     <Card
//       className={cn(
//         "bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden",
//         isOptimisticState && "border-primary/30 bg-background/95",
//       )}
//     >
//       {isOptimisticState && (
//         <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none">
//           <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center animate-pulse">
//             <Loader2 size={14} className="mr-2 animate-spin" />
//             Creating...
//           </div>
//         </div>
//       )}

//       <div className="p-6 relative z-20">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
//           <div className="flex items-center space-x-2">
//             {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                 <Sparkles size={14} className="mr-1" />
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
//                 <Zap size={14} className="mr-1" />
//                 FREE
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {automation.keywords &&
//             automation.keywords.map((keyword, key) => (
//               <Badge
//                 key={keyword.id}
//                 variant="outline"
//                 className={cn(
//                   "capitalize",
//                   key % 4 === 0 && "border-green-500/30 text-green-500",
//                   key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                   key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                   key % 4 === 3 && "border-red-500/30 text-red-500",
//                 )}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//         </div>

//         {(!automation.keywords || automation.keywords.length === 0) && (
//           <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
//             No Keywords
//           </Badge>
//         )}

//         <AutomationStats automation={automation} />

//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-destructive/30 text-destructive hover:bg-destructive/10"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={isOptimisticState}
//             >
//               <Trash2 size={16} className="mr-2" />
//               Delete
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn(
//                 "border-primary/30 text-primary hover:bg-primary/10",
//                 isOptimisticState && "opacity-50 cursor-not-allowed",
//               )}
//               disabled={isOptimisticState}
//             >
//               {isOptimisticState ? (
//                 <div className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </div>
//               ) : (
//                 <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </Link>
//               )}
//             </Button>
//           </div>
//         </div>

//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
//             <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
//             <div className="flex space-x-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Confirm Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock size={16} />
//             <p className="text-sm font-medium">
//               {isOptimisticState ? "Creating..." : `Created ${getRelativeTime(automation.createdAt)}`}
//             </p>
//           </div>

//           {!isOptimisticState && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4 text-foreground">Current Sentiment</h3>
//               <div className="flex items-center justify-center space-x-6">
//                 {sentimentData.map((sentiment) => {
//                   const isPositive = sentiment.name === "Positive"
//                   const isNeutral = sentiment.name === "Neutral"
//                   const isNegative = sentiment.name === "Negative"

//                   const getTooltipMessage = () => {
//                     if (isPositive && sentiment.value > 60) {
//                       return "Your clients are generally satisfied with your responses"
//                     } else if (isPositive && sentiment.value > 30) {
//                       return "Most interactions are going well"
//                     } else if (isNeutral && sentiment.value > 50) {
//                       return "Responses are balanced - room for improvement"
//                     } else if (isNegative && sentiment.value > 40) {
//                       return "Consider reviewing your automation responses"
//                     } else if (isNegative && sentiment.value > 20) {
//                       return "Some clients seem unsatisfied - attention needed"
//                     } else {
//                       return `${sentiment.name} sentiment detected`
//                     }
//                   }

//                   const getSentimentIcon = () => {
//                     if (isPositive) return "😊"
//                     if (isNeutral) return "😐"
//                     if (isNegative) return "😔"
//                     return "📊"
//                   }

//                   const getGlowColor = () => {
//                     if (isPositive) return "shadow-green-500/20"
//                     if (isNeutral) return "shadow-gray-500/20"
//                     if (isNegative) return "shadow-red-500/20"
//                     return ""
//                   }

//                   const getBorderColor = () => {
//                     if (isPositive) return "border-green-500/30"
//                     if (isNeutral) return "border-gray-500/30"
//                     if (isNegative) return "border-red-500/30"
//                     return "border-border"
//                   }

//                   const getBackgroundColor = () => {
//                     if (isPositive) return "bg-green-500/10"
//                     if (isNeutral) return "bg-gray-500/10"
//                     if (isNegative) return "bg-red-500/10"
//                     return "bg-muted/10"
//                   }

//                   return (
//                     <div key={sentiment.name} className="relative group">
//                       <div
//                         className={cn(
//                           "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
//                           "hover:scale-105 hover:shadow-lg",
//                           getBorderColor(),
//                           getBackgroundColor(),
//                           getGlowColor(),
//                           sentiment.value > 0 ? "opacity-100" : "opacity-50",
//                         )}
//                       >
//                         {/* Sentiment Icon */}
//                         <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
//                           {getSentimentIcon()}
//                         </div>

//                         {/* Sentiment Name */}
//                         <p className="text-sm font-medium text-foreground mb-1">{sentiment.name}</p>

//                         {/* Percentage with animated counter effect */}
//                         <div className="flex items-center space-x-1">
//                           <span className="text-2xl font-bold text-foreground">{sentiment.value}%</span>
//                         </div>

//                         {/* Progress ring indicator */}
//                         <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <div
//                             className={cn(
//                               "absolute inset-0 rounded-xl blur-sm",
//                               isPositive && "bg-green-500/20",
//                               isNeutral && "bg-gray-500/20",
//                               isNegative && "bg-red-500/20",
//                             )}
//                           />
//                         </div>
//                       </div>

//                       {/* Tooltip */}
//                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
//                         {getTooltipMessage()}
//                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>

//               {/* Overall sentiment summary */}
//               <div className="mt-4 text-center">
//                 <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
//                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
//                   <span className="text-sm text-muted-foreground">
//                     {sentimentData.find((s) => s.value === Math.max(...sentimentData.map((d) => d.value)))?.name}{" "}
//                     sentiment is dominant
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {!isOptimisticState && (
//           <>
//             <div className="mt-6 border-t border-[#545454] pt-4">
//               <button
//                 className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
//                 onClick={() => setShowChats(!showChats)}
//                 disabled={isOptimisticState}
//               >
//                 <div className="flex items-center">
//                   <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                     <MessageSquare size={16} className="text-blue-400" />
//                   </div>
//                   <span className="font-medium">View Conversation History</span>
//                   {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                     <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                       {automation.listener.dmCount} messages
//                     </Badge>
//                   )}
//                 </div>
//                 <div>
//                   {showChats ? (
//                     <ChevronUp size={20} className="text-[#9B9CA0]" />
//                   ) : (
//                     <ChevronDown size={20} className="text-[#9B9CA0]" />
//                   )}
//                 </div>
//               </button>
//             </div>

//             <AnimatePresence>
//               {showChats && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{
//                     height: "auto",
//                     opacity: 1,
//                     transition: { duration: 0.3, ease: "easeOut" },
//                   }}
//                   exit={{
//                     height: 0,
//                     opacity: 0,
//                     transition: { duration: 0.2, ease: "easeIn" },
//                   }}
//                   className="w-full overflow-hidden"
//                 >
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.1, duration: 0.3 }}
//                     className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//                   >
//                     <AutomationChats automationId={automation.id} />
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </div>

//       {/* Decorative element */}
//       <div
//         className={cn(
//           "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50",
//           isOptimisticState && "from-primary/30 to-secondary/30 animate-pulse",
//         )}
//       />
//     </Card>
//   )
// }

// export default FancyAutomationBox


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ActiveIndicator } from "../indicators/active-indicator"
// import { InactiveIndicator } from "../indicators/inactive-indicator"
// import {
//   Sparkles,
//   Zap,
//   Trash2,
//   Settings,
//   MessageSquare,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Loader2,
//   Eye,
//   TrendingUp,
//   AlertTriangle,
//   Activity,
// } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
// import { motion, AnimatePresence } from "framer-motion"
// import { getAutomationSentimentStats } from "@/lib/sentiment-tracker"
// import { DetailedSentimentModal } from "./sentiment/detailed-sentiment-modal"

// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// interface FancyAutomationBoxProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
//   isOptimistic?: boolean
// }

// export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({
//   automation,
//   onDelete,
//   pathname,
//   isOptimistic,
// }) => {
//   const isOptimisticState = isOptimistic || automation._isOptimistic

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   const [sentimentData, setSentimentData] = useState([
//     { name: "Positive", value: 0, color: "#10B981" },
//     { name: "Neutral", value: 0, color: "#6B7280" },
//     { name: "Negative", value: 0, color: "#EF4444" },
//   ])

//   useEffect(() => {
//     if (!isOptimisticState && automation.id) {
//       getAutomationSentimentStats(automation.id).then(setSentimentData)
//     }
//   }, [automation.id, isOptimisticState])

//   const getSentimentIcon = (sentiment: string) => {
//     switch (sentiment) {
//       case "Positive":
//         return "😊"
//       case "Neutral":
//         return "😐"
//       case "Negative":
//         return "😔"
//       default:
//         return "📊"
//     }
//   }

//   const getSentimentStatus = () => {
//     const positive = sentimentData.find((s) => s.name === "Positive")?.value || 0
//     const negative = sentimentData.find((s) => s.name === "Negative")?.value || 0

//     if (positive > 60) return { status: "Excellent", color: "text-green-600", icon: TrendingUp }
//     if (positive > 30) return { status: "Good", color: "text-blue-600", icon: Activity }
//     if (negative > 40) return { status: "At Risk", color: "text-red-600", icon: AlertTriangle }
//     return { status: "Neutral", color: "text-yellow-600", icon: Activity }
//   }

//   const sentimentStatus = getSentimentStatus()
//   const StatusIcon = sentimentStatus.icon

//   return (
//     <Card
//       className={cn(
//         "bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden",
//         isOptimisticState && "border-primary/30 bg-background/95",
//       )}
//     >
//       {isOptimisticState && (
//         <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none">
//           <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center animate-pulse">
//             <Loader2 size={14} className="mr-2 animate-spin" />
//             Creating...
//           </div>
//         </div>
//       )}

//       <div className="p-6 relative z-20">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
//           <div className="flex items-center space-x-2">
//             {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                 <Sparkles size={14} className="mr-1" />
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
//                 <Zap size={14} className="mr-1" />
//                 FREE
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {automation.keywords &&
//             automation.keywords.map((keyword, key) => (
//               <Badge
//                 key={keyword.id}
//                 variant="outline"
//                 className={cn(
//                   "capitalize",
//                   key % 4 === 0 && "border-green-500/30 text-green-500",
//                   key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                   key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                   key % 4 === 3 && "border-red-500/30 text-red-500",
//                 )}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//         </div>

//         {(!automation.keywords || automation.keywords.length === 0) && (
//           <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
//             No Keywords
//           </Badge>
//         )}

//         <AutomationStats automation={automation} />

//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={isOptimisticState}
//             >
//               <Trash2 size={16} className="mr-2" />
//               Delete
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn(
//                 "border-primary/30 text-primary hover:bg-primary/10",
//                 isOptimisticState && "opacity-50 cursor-not-allowed",
//               )}
//               disabled={isOptimisticState}
//             >
//               {isOptimisticState ? (
//                 <div className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </div>
//               ) : (
//                 <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </Link>
//               )}
//             </Button>
//           </div>
//         </div>

//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
//             <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
//             <div className="flex space-x-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Confirm Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock size={16} />
//             <p className="text-sm font-medium">
//               {isOptimisticState ? "Creating..." : `Created ${getRelativeTime(automation.createdAt)}`}
//             </p>
//           </div>

//           {!isOptimisticState && (
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Sentiment Overview</h3>
//                 <div className="flex items-center space-x-2">
//                   <StatusIcon className={`w-4 h-4 ${sentimentStatus.color}`} />
//                   <span className={`text-sm font-medium ${sentimentStatus.color}`}>{sentimentStatus.status}</span>
//                 </div>
//               </div>

//               {/* Three Simple Indicators */}
//               <div className="flex items-center justify-center space-x-4 mb-4">
//                 {sentimentData.map((sentiment) => {
//                   const isActive = sentiment.value > 0
//                   const isDominant = sentiment.value === Math.max(...sentimentData.map((s) => s.value))

//                   return (
//                     <div
//                       key={sentiment.name}
//                       className={cn(
//                         "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300",
//                         isActive ? "opacity-100" : "opacity-40",
//                         isDominant && isActive ? "scale-110 shadow-lg" : "scale-100",
//                         sentiment.name === "Positive" && "border-green-500/30 bg-green-500/10",
//                         sentiment.name === "Neutral" && "border-gray-500/30 bg-gray-500/10",
//                         sentiment.name === "Negative" && "border-red-500/30 bg-red-500/10",
//                       )}
//                     >
//                       <div className="text-2xl mb-1">{getSentimentIcon(sentiment.name)}</div>
//                       <span className="text-xs font-medium text-muted-foreground">{sentiment.name}</span>
//                       <span className="text-lg font-bold" style={{ color: sentiment.color }}>
//                         {sentiment.value}%
//                       </span>
//                     </div>
//                   )
//                 })}
//               </div>

//               {/* Detailed Analysis Button */}
//               <div className="flex justify-center">
//                 <DetailedSentimentModal
//                   automationId={automation.id}
//                   trigger={
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
//                     >
//                       <Eye size={16} className="mr-2" />
//                       View Detailed Analysis
//                     </Button>
//                   }
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {!isOptimisticState && (
//           <>
//             <div className="mt-6 border-t border-[#545454] pt-4">
//               <button
//                 className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
//                 onClick={() => setShowChats(!showChats)}
//                 disabled={isOptimisticState}
//               >
//                 <div className="flex items-center">
//                   <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                     <MessageSquare size={16} className="text-blue-400" />
//                   </div>
//                   <span className="font-medium">View Conversation History</span>
//                   {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                     <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                       {automation.listener.dmCount} messages
//                     </Badge>
//                   )}
//                 </div>
//                 <div>
//                   {showChats ? (
//                     <ChevronUp size={20} className="text-[#9B9CA0]" />
//                   ) : (
//                     <ChevronDown size={20} className="text-[#9B9CA0]" />
//                   )}
//                 </div>
//               </button>
//             </div>

//             <AnimatePresence>
//               {showChats && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{
//                     height: "auto",
//                     opacity: 1,
//                     transition: { duration: 0.3, ease: "easeOut" },
//                   }}
//                   exit={{
//                     height: 0,
//                     opacity: 0,
//                     transition: { duration: 0.2, ease: "easeIn" },
//                   }}
//                   className="w-full overflow-hidden"
//                 >
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.1, duration: 0.3 }}
//                     className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//                   >
//                     <AutomationChats automationId={automation.id} />
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </div>

//       <div
//         className={cn(
//           "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50",
//           isOptimisticState && "from-primary/30 to-secondary/30 animate-pulse",
//         )}
//       />
//     </Card>
//   )
// }

// export default FancyAutomationBox

// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ActiveIndicator } from "../indicators/active-indicator"
// import { InactiveIndicator } from "../indicators/inactive-indicator"
// import {
//   Sparkles,
//   Zap,
//   Trash2,
//   Settings,
//   MessageSquare,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Loader2,
//   Eye,
//   TrendingUp,
//   AlertTriangle,
//   Activity,
//   Image as ImageIcon,
//   Calendar,
//   Play,
//   Pause,
// } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
// import { motion, AnimatePresence } from "framer-motion"
// import { getAutomationSentimentStats } from "@/lib/sentiment-tracker"
// import { DetailedSentimentModal } from "./sentiment/detailed-sentiment-modal"
// import Image from "next/image"

// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// type AttachedPost = {
//   id: string
//   postid?: string
//   media: string
//   mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
//   caption?: string
//   isScheduled?: boolean
//   scheduledDate?: string
// }

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   attachedPosts?: AttachedPost[]
//   _isOptimistic?: boolean
// }

// interface FancyAutomationBoxProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
//   isOptimistic?: boolean
// }

// export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({
//   automation,
//   onDelete,
//   pathname,
//   isOptimistic,
// }) => {
//   const isOptimisticState = isOptimistic || automation._isOptimistic

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)
//   const [showAttachedPosts, setShowAttachedPosts] = useState(false)

//   const [sentimentData, setSentimentData] = useState([
//     { name: "Positive", value: 0, color: "#10B981" },
//     { name: "Neutral", value: 0, color: "#6B7280" },
//     { name: "Negative", value: 0, color: "#EF4444" },
//   ])

//   useEffect(() => {
//     if (!isOptimisticState && automation.id) {
//       getAutomationSentimentStats(automation.id).then(setSentimentData)
//     }
//   }, [automation.id, isOptimisticState])

//   const getSentimentIcon = (sentiment: string) => {
//     switch (sentiment) {
//       case "Positive":
//         return "😊"
//       case "Neutral":
//         return "😐"
//       case "Negative":
//         return "😔"
//       default:
//         return "📊"
//     }
//   }

//   const getSentimentStatus = () => {
//     const positive = sentimentData.find((s) => s.name === "Positive")?.value || 0
//     const negative = sentimentData.find((s) => s.name === "Negative")?.value || 0

//     if (positive > 60) return { status: "Excellent", color: "text-green-600", icon: TrendingUp }
//     if (positive > 30) return { status: "Good", color: "text-blue-600", icon: Activity }
//     if (negative > 40) return { status: "At Risk", color: "text-red-600", icon: AlertTriangle }
//     return { status: "Neutral", color: "text-yellow-600", icon: Activity }
//   }

//   const getMediaIcon = (mediaType: string) => {
//     switch (mediaType) {
//       case "VIDEO":
//         return <Play className="w-3 h-3" />
//       case "CAROUSEL_ALBUM":
//         return <ImageIcon className="w-3 h-3" />
//       default:
//         return <ImageIcon className="w-3 h-3" />
//     }
//   }

//   const sentimentStatus = getSentimentStatus()
//   const StatusIcon = sentimentStatus.icon
//   const attachedPostsCount = automation.attachedPosts?.length || 0
//   const publishedPosts = automation.attachedPosts?.filter(post => !post.isScheduled) || []
//   const scheduledPosts = automation.attachedPosts?.filter(post => post.isScheduled) || []

//   return (
//     <Card
//       className={cn(
//         "bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden",
//         isOptimisticState && "border-primary/30 bg-background/95",
//       )}
//     >
//       {isOptimisticState && (
//         <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none">
//           <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center animate-pulse">
//             <Loader2 size={14} className="mr-2 animate-spin" />
//             Creating...
//           </div>
//         </div>
//       )}

//       <div className="p-6 relative z-20">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
//           <div className="flex items-center space-x-2">
//             {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                 <Sparkles size={14} className="mr-1" />
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
//                 <Zap size={14} className="mr-1" />
//                 FREE
//               </Badge>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {automation.keywords &&
//             automation.keywords.map((keyword, key) => (
//               <Badge
//                 key={keyword.id}
//                 variant="outline"
//                 className={cn(
//                   "capitalize",
//                   key % 4 === 0 && "border-green-500/30 text-green-500",
//                   key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                   key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                   key % 4 === 3 && "border-red-500/30 text-red-500",
//                 )}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//         </div>

//         {(!automation.keywords || automation.keywords.length === 0) && (
//           <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
//             No Keywords
//           </Badge>
//         )}

//         <AutomationStats automation={automation} />

//         {/* Attached Posts Section */}
//         {!isOptimisticState && attachedPostsCount > 0 && (
//           <div className="mt-6 border-t border-[#545454] pt-4">
//             <button
//               className="w-full flex items-center justify-between p-3 rounded-lg border border-[#545454]/50 bg-transparent hover:bg-[#1D1D1D]/30 transition-colors duration-300"
//               onClick={() => setShowAttachedPosts(!showAttachedPosts)}
//             >
//               <div className="flex items-center">
//                 <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                   <ImageIcon size={16} className="text-purple-400" />
//                 </div>
//                 <div className="flex flex-col items-start">
//                   <span className="font-medium">Attached Posts</span>
//                   <div className="flex items-center space-x-2 mt-1">
//                     {publishedPosts.length > 0 && (
//                       <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
//                         {publishedPosts.length} Published
//                       </Badge>
//                     )}
//                     {scheduledPosts.length > 0 && (
//                       <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs">
//                         {scheduledPosts.length} Scheduled
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 {/* Preview thumbnails */}
//                 <div className="flex -space-x-1">
//                   {automation.attachedPosts?.slice(0, 3).map((post, index) => (
//                     <div
//                       key={post.id}
//                       className="relative w-6 h-6 rounded-full border-2 border-background overflow-hidden"
//                       style={{ zIndex: 3 - index }}
//                     >
//                       <Image
//                         src={post.media || "/placeholder.svg"}
//                         alt="Post preview"
//                         fill
//                         sizes="24px"
//                         className="object-cover"
//                       />
//                       {post.isScheduled && (
//                         <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
//                           <Clock className="w-2 h-2 text-yellow-400" />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                   {attachedPostsCount > 3 && (
//                     <div className="w-6 h-6 rounded-full bg-[#2A2A2A] border-2 border-background flex items-center justify-center">
//                       <span className="text-xs font-medium text-muted-foreground">
//                         +{attachedPostsCount - 3}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 {showAttachedPosts ? (
//                   <ChevronUp size={20} className="text-[#9B9CA0]" />
//                 ) : (
//                   <ChevronDown size={20} className="text-[#9B9CA0]" />
//                 )}
//               </div>
//             </button>
//           </div>
//         )}

//         <AnimatePresence>
//           {showAttachedPosts && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{
//                 height: "auto",
//                 opacity: 1,
//                 transition: { duration: 0.3, ease: "easeOut" },
//               }}
//               exit={{
//                 height: 0,
//                 opacity: 0,
//                 transition: { duration: 0.2, ease: "easeIn" },
//               }}
//               className="w-full overflow-hidden"
//             >
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1, duration: 0.3 }}
//                 className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//               >
//                 <div className="space-y-4">
//                   {/* Published Posts */}
//                   {publishedPosts.length > 0 && (
//                     <div>
//                       <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
//                         <ImageIcon className="w-4 h-4 mr-2" />
//                         Published Posts ({publishedPosts.length})
//                       </h4>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                         {publishedPosts.map((post) => (
//                           <div
//                             key={post.id}
//                             className="relative aspect-square rounded-lg overflow-hidden group border border-[#545454]/30"
//                           >
//                             <Image
//                               src={post.media || "/placeholder.svg"}
//                               alt={post.caption || "Published post"}
//                               fill
//                               sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
//                               className="object-cover transition-transform duration-300 group-hover:scale-110"
//                             />
                            
//                             {/* Media type indicator */}
//                             <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
//                               {getMediaIcon(post.mediaType)}
//                             </div>

//                             {/* Hover overlay */}
//                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                               <div className="text-center p-2">
//                                 <p className="text-white text-xs line-clamp-2">
//                                   {post.caption || "No caption"}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Scheduled Posts */}
//                   {scheduledPosts.length > 0 && (
//                     <div>
//                       <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center">
//                         <Calendar className="w-4 h-4 mr-2" />
//                         Scheduled Posts ({scheduledPosts.length})
//                       </h4>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                         {scheduledPosts.map((post) => (
//                           <div
//                             key={post.id}
//                             className="relative aspect-square rounded-lg overflow-hidden group border border-yellow-500/30"
//                           >
//                             <Image
//                               src={post.media || "/placeholder.svg"}
//                               alt={post.caption || "Scheduled post"}
//                               fill
//                               sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
//                               className="object-cover transition-transform duration-300 group-hover:scale-110"
//                             />
                            
//                             {/* Scheduled indicator */}
//                             <div className="absolute top-2 left-2 bg-yellow-500/80 rounded-full p-1">
//                               <Clock className="w-3 h-3 text-white" />
//                             </div>

//                             {/* Media type indicator */}
//                             <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
//                               {getMediaIcon(post.mediaType)}
//                             </div>

//                             {/* Date badge */}
//                             {post.scheduledDate && (
//                               <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1">
//                                 <p className="text-yellow-400 text-xs font-medium">
//                                   {new Date(post.scheduledDate).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             )}

//                             {/* Hover overlay */}
//                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                               <div className="text-center p-2">
//                                 <p className="text-white text-xs line-clamp-2">
//                                   {post.caption || "No caption"}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Empty state */}
//                   {attachedPostsCount === 0 && (
//                     <div className="text-center py-8">
//                       <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
//                       <p className="text-muted-foreground">No posts attached to this automation</p>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={isOptimisticState}
//             >
//               <Trash2 size={16} className="mr-2" />
//               Delete
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn(
//                 "border-primary/30 text-primary hover:bg-primary/10",
//                 isOptimisticState && "opacity-50 cursor-not-allowed",
//               )}
//               disabled={isOptimisticState}
//             >
//               {isOptimisticState ? (
//                 <div className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </div>
//               ) : (
//                 <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                   <Settings size={16} className="mr-2" />
//                   Configure
//                 </Link>
//               )}
//             </Button>
//           </div>
//         </div>

//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
//             <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
//             <div className="flex space-x-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Confirm Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-2 text-muted-foreground">
//             <Clock size={16} />
//             <p className="text-sm font-medium">
//               {isOptimisticState ? "Creating..." : `Created ${getRelativeTime(automation.createdAt)}`}
//             </p>
//           </div>

//           {!isOptimisticState && (
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Sentiment Overview</h3>
//                 <div className="flex items-center space-x-2">
//                   <StatusIcon className={`w-4 h-4 ${sentimentStatus.color}`} />
//                   <span className={`text-sm font-medium ${sentimentStatus.color}`}>{sentimentStatus.status}</span>
//                 </div>
//               </div>

//               {/* Three Simple Indicators */}
//               <div className="flex items-center justify-center space-x-4 mb-4">
//                 {sentimentData.map((sentiment) => {
//                   const isActive = sentiment.value > 0
//                   const isDominant = sentiment.value === Math.max(...sentimentData.map((s) => s.value))

//                   return (
//                     <div
//                       key={sentiment.name}
//                       className={cn(
//                         "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300",
//                         isActive ? "opacity-100" : "opacity-40",
//                         isDominant && isActive ? "scale-110 shadow-lg" : "scale-100",
//                         sentiment.name === "Positive" && "border-green-500/30 bg-green-500/10",
//                         sentiment.name === "Neutral" && "border-gray-500/30 bg-gray-500/10",
//                         sentiment.name === "Negative" && "border-red-500/30 bg-red-500/10",
//                       )}
//                     >
//                       <div className="text-2xl mb-1">{getSentimentIcon(sentiment.name)}</div>
//                       <span className="text-xs font-medium text-muted-foreground">{sentiment.name}</span>
//                       <span className="text-lg font-bold" style={{ color: sentiment.color }}>
//                         {sentiment.value}%
//                       </span>
//                     </div>
//                   )
//                 })}
//               </div>

//               {/* Detailed Analysis Button */}
//               <div className="flex justify-center">
//                 <DetailedSentimentModal
//                   automationId={automation.id}
//                   trigger={
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
//                     >
//                       <Eye size={16} className="mr-2" />
//                       View Detailed Analysis
//                     </Button>
//                   }
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {!isOptimisticState && (
//           <>
//             <div className="mt-6 border-t border-[#545454] pt-4">
//               <button
//                 className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
//                 onClick={() => setShowChats(!showChats)}
//                 disabled={isOptimisticState}
//               >
//                 <div className="flex items-center">
//                   <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
//                     <MessageSquare size={16} className="text-blue-400" />
//                   </div>
//                   <span className="font-medium">View Conversation History</span>
//                   {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                     <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                       {automation.listener.dmCount} messages
//                     </Badge>
//                   )}
//                 </div>
//                 <div>
//                   {showChats ? (
//                     <ChevronUp size={20} className="text-[#9B9CA0]" />
//                   ) : (
//                     <ChevronDown size={20} className="text-[#9B9CA0]" />
//                   )}
//                 </div>
//               </button>
//             </div>

//             <AnimatePresence>
//               {showChats && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{
//                     height: "auto",
//                     opacity: 1,
//                     transition: { duration: 0.3, ease: "easeOut" },
//                   }}
//                   exit={{
//                     height: 0,
//                     opacity: 0,
//                     transition: { duration: 0.2, ease: "easeIn" },
//                   }}
//                   className="w-full overflow-hidden"
//                 >
//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.1, duration: 0.3 }}
//                     className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
//                   >
//                     <AutomationChats automationId={automation.id} />
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </div>

//       <div
//         className={cn(
//           "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50",
//           isOptimisticState && "from-primary/30 to-secondary/30 animate-pulse",
//         )}
//       />
//     </Card>
//   )
// }

// export default FancyAutomationBox

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn, getRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActiveIndicator } from "../indicators/active-indicator"
import { InactiveIndicator } from "../indicators/inactive-indicator"
import {
  Sparkles,
  Zap,
  Trash2,
  Settings,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Eye,
  TrendingUp,
  AlertTriangle,
  Activity,
  Image as ImageIcon,
  Calendar,
  Play,
  Pause,
} from "lucide-react"
import AutomationStats from "./automation-stats"
import AutomationChats from "./automationChats"
import { motion, AnimatePresence } from "framer-motion"
import { getAutomationSentimentStats } from "@/lib/sentiment-tracker"
import { DetailedSentimentModal } from "./sentiment/detailed-sentiment-modal"
import Image from "next/image"

type Keyword = {
  id: string
  automationId: string | null
  word: string
}

type Listener = {
  id: string
  listener: string
  automationId: string
  prompt: string
  commentReply: string | null
  dmCount: number
  commentCount: number
}

type AttachedPost = {
  id: string
  postid?: string
  media: string
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  caption?: string
  isScheduled?: boolean
  scheduledDate?: string
}

interface Automation {
  id: string
  name: string
  active: boolean
  keywords: Keyword[]
  // Fix: Allow both string and Date, and handle undefined
  createdAt?: string | Date
  listener: Listener | null
  attachedPosts?: AttachedPost[]
  _isOptimistic?: boolean
}

interface FancyAutomationBoxProps {
  automation: Automation
  onDelete: () => void
  pathname: string
  isOptimistic?: boolean
}

// Helper function to safely get relative time
const getSafeRelativeTime = (createdAt?: string | Date): string => {
  if (!createdAt) return "Recently"
  
  try {
    // If it's already a Date object, use it directly
    if (createdAt instanceof Date) {
      return getRelativeTime(createdAt)
    }
    
    // If it's a string, convert it to Date
    const date = new Date(createdAt)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Recently"
    }
    
    return getRelativeTime(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Recently"
  }
}

export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({
  automation,
  onDelete,
  pathname,
  isOptimistic,
}) => {
  const isOptimisticState = isOptimistic || automation._isOptimistic

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChats, setShowChats] = useState(false)
  const [showAttachedPosts, setShowAttachedPosts] = useState(false)

  const [sentimentData, setSentimentData] = useState([
    { name: "Positive", value: 0, color: "#10B981" },
    { name: "Neutral", value: 0, color: "#6B7280" },
    { name: "Negative", value: 0, color: "#EF4444" },
  ])

  useEffect(() => {
    if (!isOptimisticState && automation.id) {
      getAutomationSentimentStats(automation.id).then(setSentimentData)
    }
  }, [automation.id, isOptimisticState])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "😊"
      case "Neutral":
        return "😐"
      case "Negative":
        return "😔"
      default:
        return "📊"
    }
  }

  const getSentimentStatus = () => {
    const positive = sentimentData.find((s) => s.name === "Positive")?.value || 0
    const negative = sentimentData.find((s) => s.name === "Negative")?.value || 0

    if (positive > 60) return { status: "Excellent", color: "text-green-600", icon: TrendingUp }
    if (positive > 30) return { status: "Good", color: "text-blue-600", icon: Activity }
    if (negative > 40) return { status: "At Risk", color: "text-red-600", icon: AlertTriangle }
    return { status: "Neutral", color: "text-yellow-600", icon: Activity }
  }

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "VIDEO":
        return <Play className="w-3 h-3" />
      case "CAROUSEL_ALBUM":
        return <ImageIcon className="w-3 h-3" />
      default:
        return <ImageIcon className="w-3 h-3" />
    }
  }

  const sentimentStatus = getSentimentStatus()
  const StatusIcon = sentimentStatus.icon
  const attachedPostsCount = automation.attachedPosts?.length || 0
  const publishedPosts = automation.attachedPosts?.filter(post => !post.isScheduled) || []
  const scheduledPosts = automation.attachedPosts?.filter(post => post.isScheduled) || []

  return (
    <Card
      className={cn(
        "bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden",
        isOptimisticState && "border-primary/30 bg-background/95",
      )}
    >
      {isOptimisticState && (
        <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none">
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center animate-pulse">
            <Loader2 size={14} className="mr-2 animate-spin" />
            Creating...
          </div>
        </div>
      )}

      <div className="p-6 relative z-20">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
          <div className="flex items-center space-x-2">
            {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
            {automation.listener?.listener === "SMARTAI" ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Sparkles size={14} className="mr-1" />
                Smart AI
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                <Zap size={14} className="mr-1" />
                FREE
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {automation.keywords &&
            automation.keywords.map((keyword, key) => (
              <Badge
                key={keyword.id}
                variant="outline"
                className={cn(
                  "capitalize",
                  key % 4 === 0 && "border-green-500/30 text-green-500",
                  key % 4 === 1 && "border-purple-500/30 text-purple-500",
                  key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
                  key % 4 === 3 && "border-red-500/30 text-red-500",
                )}
              >
                {keyword.word}
              </Badge>
            ))}
        </div>

        {(!automation.keywords || automation.keywords.length === 0) && (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            No Keywords
          </Badge>
        )}

        <AutomationStats automation={automation} />

        {/* Attached Posts Section */}
        {!isOptimisticState && attachedPostsCount > 0 && (
          <div className="mt-6 border-t border-[#545454] pt-4">
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg border border-[#545454]/50 bg-transparent hover:bg-[#1D1D1D]/30 transition-colors duration-300"
              onClick={() => setShowAttachedPosts(!showAttachedPosts)}
            >
              <div className="flex items-center">
                <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
                  <ImageIcon size={16} className="text-purple-400" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Attached Posts</span>
                  <div className="flex items-center space-x-2 mt-1">
                    {publishedPosts.length > 0 && (
                      <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
                        {publishedPosts.length} Published
                      </Badge>
                    )}
                    {scheduledPosts.length > 0 && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs">
                        {scheduledPosts.length} Scheduled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Preview thumbnails */}
                <div className="flex -space-x-1">
                  {automation.attachedPosts?.slice(0, 3).map((post, index) => (
                    <div
                      key={post.id}
                      className="relative w-6 h-6 rounded-full border-2 border-background overflow-hidden"
                      style={{ zIndex: 3 - index }}
                    >
                      <Image
                        src={post.media || "/placeholder.svg"}
                        alt="Post preview"
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                      {post.isScheduled && (
                        <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                          <Clock className="w-2 h-2 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  ))}
                  {attachedPostsCount > 3 && (
                    <div className="w-6 h-6 rounded-full bg-[#2A2A2A] border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        +{attachedPostsCount - 3}
                      </span>
                    </div>
                  )}
                </div>
                {showAttachedPosts ? (
                  <ChevronUp size={20} className="text-[#9B9CA0]" />
                ) : (
                  <ChevronDown size={20} className="text-[#9B9CA0]" />
                )}
              </div>
            </button>
          </div>
        )}

        <AnimatePresence>
          {showAttachedPosts && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              className="w-full overflow-hidden"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
              >
                <div className="space-y-4">
                  {/* Published Posts */}
                  {publishedPosts.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Published Posts ({publishedPosts.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {publishedPosts.map((post) => (
                          <div
                            key={post.id}
                            className="relative aspect-square rounded-lg overflow-hidden group border border-[#545454]/30"
                          >
                            <Image
                              src={post.media || "/placeholder.svg"}
                              alt={post.caption || "Published post"}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            
                            {/* Media type indicator */}
                            <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                              {getMediaIcon(post.mediaType)}
                            </div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-center p-2">
                                <p className="text-white text-xs line-clamp-2">
                                  {post.caption || "No caption"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scheduled Posts */}
                  {scheduledPosts.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Scheduled Posts ({scheduledPosts.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {scheduledPosts.map((post) => (
                          <div
                            key={post.id}
                            className="relative aspect-square rounded-lg overflow-hidden group border border-yellow-500/30"
                          >
                            <Image
                              src={post.media || "/placeholder.svg"}
                              alt={post.caption || "Scheduled post"}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            
                            {/* Scheduled indicator */}
                            <div className="absolute top-2 left-2 bg-yellow-500/80 rounded-full p-1">
                              <Clock className="w-3 h-3 text-white" />
                            </div>

                            {/* Media type indicator */}
                            <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                              {getMediaIcon(post.mediaType)}
                            </div>

                            {/* Date badge */}
                            {post.scheduledDate && (
                              <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1">
                                <p className="text-yellow-400 text-xs font-medium">
                                  {/* Safe date formatting for scheduled posts too */}
                                  {(() => {
                                    try {
                                      return new Date(post.scheduledDate).toLocaleDateString()
                                    } catch {
                                      return "Invalid date"
                                    }
                                  })()}
                                </p>
                              </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-center p-2">
                                <p className="text-white text-xs line-clamp-2">
                                  {post.caption || "No caption"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {attachedPostsCount === 0 && (
                    <div className="text-center py-8">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No posts attached to this automation</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isOptimisticState}
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "border-primary/30 text-primary hover:bg-primary/10",
                isOptimisticState && "opacity-50 cursor-not-allowed",
              )}
              disabled={isOptimisticState}
            >
              {isOptimisticState ? (
                <div className="flex items-center">
                  <Settings size={16} className="mr-2" />
                  Configure
                </div>
              ) : (
                <Link href={`${pathname}/${automation.id}`} className="flex items-center">
                  <Settings size={16} className="mr-2" />
                  Configure
                </Link>
              )}
            </Button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
            <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
            <div className="flex space-x-2">
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Confirm Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock size={16} />
            <p className="text-sm font-medium">
              {/* This is the line that was causing the error - now using safe helper */}
              {isOptimisticState ? "Creating..." : `Created ${getSafeRelativeTime(automation.createdAt)}`}
            </p>
          </div>

          {!isOptimisticState && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Sentiment Overview</h3>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-4 h-4 ${sentimentStatus.color}`} />
                  <span className={`text-sm font-medium ${sentimentStatus.color}`}>{sentimentStatus.status}</span>
                </div>
              </div>

              {/* Three Simple Indicators */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                {sentimentData.map((sentiment) => {
                  const isActive = sentiment.value > 0
                  const isDominant = sentiment.value === Math.max(...sentimentData.map((s) => s.value))

                  return (
                    <div
                      key={sentiment.name}
                      className={cn(
                        "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300",
                        isActive ? "opacity-100" : "opacity-40",
                        isDominant && isActive ? "scale-110 shadow-lg" : "scale-100",
                        sentiment.name === "Positive" && "border-green-500/30 bg-green-500/10",
                        sentiment.name === "Neutral" && "border-gray-500/30 bg-gray-500/10",
                        sentiment.name === "Negative" && "border-red-500/30 bg-red-500/10",
                      )}
                    >
                      <div className="text-2xl mb-1">{getSentimentIcon(sentiment.name)}</div>
                      <span className="text-xs font-medium text-muted-foreground">{sentiment.name}</span>
                      <span className="text-lg font-bold" style={{ color: sentiment.color }}>
                        {sentiment.value}%
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Detailed Analysis Button */}
              <div className="flex justify-center">
                <DetailedSentimentModal
                  automationId={automation.id}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                    >
                      <Eye size={16} className="mr-2" />
                      View Detailed Analysis
                    </Button>
                  }
                />
              </div>
            </div>
          )}
        </div>

        {!isOptimisticState && (
          <>
            <div className="mt-6 border-t border-[#545454] pt-4">
              <button
                className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
                onClick={() => setShowChats(!showChats)}
                disabled={isOptimisticState}
              >
                <div className="flex items-center">
                  <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
                    <MessageSquare size={16} className="text-blue-400" />
                  </div>
                  <span className="font-medium">View Conversation History</span>
                  {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
                    <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {automation.listener.dmCount} messages
                    </Badge>
                  )}
                </div>
                <div>
                  {showChats ? (
                    <ChevronUp size={20} className="text-[#9B9CA0]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#9B9CA0]" />
                  )}
                </div>
              </button>
            </div>

            <AnimatePresence>
              {showChats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { duration: 0.2, ease: "easeIn" },
                  }}
                  className="w-full overflow-hidden"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
                  >
                    <AutomationChats automationId={automation.id} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50",
          isOptimisticState && "from-primary/30 to-secondary/30 animate-pulse",
        )}
      />
    </Card>
  )
}

export default FancyAutomationBox