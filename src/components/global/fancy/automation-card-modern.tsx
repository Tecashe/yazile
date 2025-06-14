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
// import { Sparkles, Zap, Trash2, Settings, MessageSquareText, ChevronDown, Clock, Loader2 } from "lucide-react"
// import AutomationStats from "./automation-stats"
// import AutomationChats from "./automationChats"
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

// interface AutomationCardModernProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
// }

// export const AutomationCardModern: React.FC<AutomationCardModernProps> = ({ automation, onDelete, pathname }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   return (
//     <Card className="group relative bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
//       {/* Status Bar */}
//       <div
//         className={`h-1 w-full ${
//           automation._isOptimistic
//             ? "bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse"
//             : automation.active
//               ? "bg-gradient-to-r from-green-500 to-emerald-500"
//               : "bg-gradient-to-r from-muted-foreground to-muted-foreground"
//         }`}
//       />

//       <div className="p-6">
//         {/* Header Section */}
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <h2 className="text-xl font-bold text-foreground">{automation.name}</h2>
//               {automation._isOptimistic && (
//                 <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/30">
//                   <Loader2 size={12} className="animate-spin text-yellow-500" />
//                   <span className="text-xs font-medium text-yellow-500">Creating</span>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
//                 <span
//                   className={`text-sm font-medium ${automation.active ? "text-green-500" : "text-muted-foreground"}`}
//                 >
//                   {automation.active ? "Active" : "Paused"}
//                 </span>
//               </div>

//               {automation.listener?.listener === "SMARTAI" ? (
//                 <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30">
//                   <Sparkles size={12} className="mr-1" />
//                   Smart AI
//                 </Badge>
//               ) : (
//                 <Badge variant="outline" className="bg-muted/50">
//                   <Zap size={12} className="mr-1" />
//                   Standard
//                 </Badge>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="text-right">
//               <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                 <Clock size={12} />
//                 {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
//               </div>
//               {!automation._isOptimistic && automation.keywords && automation.keywords.length > 0 && (
//                 <div className="text-xs text-muted-foreground mt-1">
//                   {automation.keywords.length} keyword{automation.keywords.length !== 1 ? "s" : ""}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Keywords Grid */}
//         {automation.keywords && automation.keywords.length > 0 && (
//           <div className="mb-6">
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {automation.keywords.slice(0, 6).map((keyword, key) => (
//                 <Badge
//                   key={keyword.id}
//                   variant="outline"
//                   className={cn(
//                     "justify-center text-xs py-1",
//                     key % 4 === 0 && "border-green-500/30 text-green-500 bg-green-500/5",
//                     key % 4 === 1 && "border-purple-500/30 text-purple-500 bg-purple-500/5",
//                     key % 4 === 2 && "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
//                     key % 4 === 3 && "border-red-500/30 text-red-500 bg-red-500/5",
//                   )}
//                 >
//                   {keyword.word}
//                 </Badge>
//               ))}
//               {automation.keywords.length > 6 && (
//                 <Badge variant="outline" className="justify-center text-xs py-1 bg-muted/30">
//                   +{automation.keywords.length - 6} more
//                 </Badge>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Stats Section */}
//         <div className="mb-6">
//           <AutomationStats automation={automation} />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center justify-between">
//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={automation._isOptimistic}
//               asChild={!automation._isOptimistic}
//               className="hover:bg-primary/10 hover:border-primary/30"
//             >
//               {automation._isOptimistic ? (
//                 <div className="flex items-center">
//                   <Settings size={14} className="mr-2" />
//                   Configure
//                 </div>
//               ) : (
//                 <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                   <Settings size={14} className="mr-2" />
//                   Configure
//                 </Link>
//               )}
//             </Button>

//             <Button
//               variant="outline"
//               size="sm"
//               className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={automation._isOptimistic}
//             >
//               <Trash2 size={14} className="mr-2" />
//               Delete
//             </Button>
//           </div>

//           {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowChats(!showChats)}
//               className="hover:bg-blue-500/10 hover:border-blue-500/30"
//             >
//               <MessageSquareText size={14} className="mr-2" />
//               Chats ({automation.listener.dmCount})
//               <ChevronDown size={14} className={`ml-2 transition-transform ${showChats ? "rotate-180" : ""}`} />
//             </Button>
//           )}
//         </div>

//         {/* Delete Confirmation */}
//         {showDeleteConfirm && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="mt-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5"
//           >
//             <p className="text-sm text-destructive mb-3">
//               Are you sure you want to delete "{automation.name}"? This action cannot be undone.
//             </p>
//             <div className="flex gap-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Delete Permanently
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </motion.div>
//         )}

//         {/* Chat Expansion */}
//         <AnimatePresence>
//           {showChats && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20">
//                 <AutomationChats automationId={automation.id} />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </Card>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { cn, getRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActiveIndicator } from "../indicators/active-indicator"
import { InactiveIndicator } from "../indicators/inactive-indicator"
import { Sparkles, Zap, Trash2, Settings, MessageSquareText, ChevronDown, Clock, Loader2 } from "lucide-react"
import AutomationStats from "./automation-stats"
import AutomationChats from "./automationChats"
import { motion, AnimatePresence } from "framer-motion"

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

interface Automation {
  id: string
  name: string
  active: boolean
  keywords: Keyword[]
  createdAt: Date
  listener: Listener | null
  _isOptimistic?: boolean
}

interface AutomationCardModernProps {
  automation: Automation
  onDelete?: () => void
  pathname: string
}

export const AutomationCardModern: React.FC<AutomationCardModernProps> = ({ automation, onDelete, pathname }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChats, setShowChats] = useState(false)

  return (
    <Card className="group relative bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* Status Bar */}
      <div
        className={`h-1 w-full ${
          automation._isOptimistic
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse"
            : automation.active
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-muted-foreground to-muted-foreground"
        }`}
      />

      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-foreground">{automation.name}</h2>
              {automation._isOptimistic && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/30">
                  <Loader2 size={12} className="animate-spin text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-500">Creating</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
                <span
                  className={`text-sm font-medium ${automation.active ? "text-green-500" : "text-muted-foreground"}`}
                >
                  {automation.active ? "Active" : "Paused"}
                </span>
              </div>

              {automation.listener?.listener === "SMARTAI" ? (
                <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30">
                  <Sparkles size={12} className="mr-1" />
                  Smart AI
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted/50">
                  <Zap size={12} className="mr-1" />
                  Standard
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={12} />
                {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
              </div>
              {!automation._isOptimistic && automation.keywords && automation.keywords.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {automation.keywords.length} keyword{automation.keywords.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keywords Grid */}
        {automation.keywords && automation.keywords.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {automation.keywords.slice(0, 6).map((keyword, key) => (
                <Badge
                  key={keyword.id}
                  variant="outline"
                  className={cn(
                    "justify-center text-xs py-1",
                    key % 4 === 0 && "border-green-500/30 text-green-500 bg-green-500/5",
                    key % 4 === 1 && "border-purple-500/30 text-purple-500 bg-purple-500/5",
                    key % 4 === 2 && "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
                    key % 4 === 3 && "border-red-500/30 text-red-500 bg-red-500/5",
                  )}
                >
                  {keyword.word}
                </Badge>
              ))}
              {automation.keywords.length > 6 && (
                <Badge variant="outline" className="justify-center text-xs py-1 bg-muted/30">
                  +{automation.keywords.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mb-6">
          <AutomationStats automation={automation} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={automation._isOptimistic}
              asChild={!automation._isOptimistic}
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              {automation._isOptimistic ? (
                <div className="flex items-center">
                  <Settings size={14} className="mr-2" />
                  Configure
                </div>
              ) : (
                <Link href={`${pathname}/${automation.id}`} className="flex items-center">
                  <Settings size={14} className="mr-2" />
                  Configure
                </Link>
              )}
            </Button>

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={automation._isOptimistic}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </Button>
            )}
          </div>

          {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChats(!showChats)}
              className="hover:bg-blue-500/10 hover:border-blue-500/30"
            >
              <MessageSquareText size={14} className="mr-2" />
              Chats ({automation.listener.dmCount})
              <ChevronDown size={14} className={`ml-2 transition-transform ${showChats ? "rotate-180" : ""}`} />
            </Button>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5"
          >
            <p className="text-sm text-destructive mb-3">
              Are you sure you want to delete "{automation.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => onDelete?.()}>
                Delete Permanently
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Chat Expansion */}
        <AnimatePresence>
          {showChats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20">
                <AutomationChats automationId={automation.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
