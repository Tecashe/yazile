// "use client"

// import type React from "react"
// import { useState } from "react"
// import { cn, getRelativeTime } from "@/lib/utils"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Sparkles,
//   Zap,
//   Trash2,
//   Settings,
//   MessageSquareText,
//   Clock,
//   Loader2,
//   Activity,
//   BarChart3,
//   Users,
//   MessageCircle,
// } from "lucide-react"
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

// interface AutomationCardDashboardProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
// }

// export const AutomationCardDashboard: React.FC<AutomationCardDashboardProps> = ({ automation, onDelete, pathname }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)

//   // Mock metrics for demonstration
//   const metrics = {
//     interactions: Math.floor(Math.random() * 500) + 50,
//     leads: Math.floor(Math.random() * 50) + 5,
//     responses: Math.floor(Math.random() * 100) + 10,
//   }

//   return (
//     <Card className="group bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
//       <div className="p-6">
//         {/* Header with Status */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div
//               className={`p-2 rounded-lg ${
//                 automation._isOptimistic
//                   ? "bg-yellow-500/20 border border-yellow-500/30"
//                   : automation.active
//                     ? "bg-green-500/20 border border-green-500/30"
//                     : "bg-muted border border-border"
//               }`}
//             >
//               {automation._isOptimistic ? (
//                 <Loader2 size={16} className="text-yellow-500 animate-spin" />
//               ) : automation.active ? (
//                 <Activity size={16} className="text-green-500" />
//               ) : (
//                 <Clock size={16} className="text-muted-foreground" />
//               )}
//             </div>

//             <div>
//               <h3 className="font-semibold text-foreground text-lg">{automation.name}</h3>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge variant={automation.active ? "default" : "secondary"} className="text-xs">
//                   {automation._isOptimistic ? "Creating" : automation.active ? "Active" : "Paused"}
//                 </Badge>

//                 {automation.listener?.listener === "SMARTAI" ? (
//                   <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs">
//                     <Sparkles size={10} className="mr-1" />
//                     Smart AI
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="text-xs">
//                     <Zap size={10} className="mr-1" />
//                     Standard
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="text-right text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <Clock size={12} />
//               {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
//             </div>
//           </div>
//         </div>

//         {/* Metrics Row */}
//         {!automation._isOptimistic && (
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <div className="text-center p-3 bg-muted/30 rounded-lg">
//               <div className="flex items-center justify-center gap-1 mb-1">
//                 <BarChart3 size={14} className="text-blue-500" />
//                 <span className="text-xs font-medium text-muted-foreground">Interactions</span>
//               </div>
//               <div className="text-lg font-bold text-foreground">{metrics.interactions}</div>
//             </div>

//             <div className="text-center p-3 bg-muted/30 rounded-lg">
//               <div className="flex items-center justify-center gap-1 mb-1">
//                 <Users size={14} className="text-green-500" />
//                 <span className="text-xs font-medium text-muted-foreground">Leads</span>
//               </div>
//               <div className="text-lg font-bold text-foreground">{metrics.leads}</div>
//             </div>

//             <div className="text-center p-3 bg-muted/30 rounded-lg">
//               <div className="flex items-center justify-center gap-1 mb-1">
//                 <MessageCircle size={14} className="text-purple-500" />
//                 <span className="text-xs font-medium text-muted-foreground">Messages</span>
//               </div>
//               <div className="text-lg font-bold text-foreground">{automation.listener?.dmCount || 0}</div>
//             </div>
//           </div>
//         )}

//         {/* Keywords */}
//         {automation.keywords && automation.keywords.length > 0 && (
//           <div className="mb-4">
//             <div className="flex flex-wrap gap-1">
//               {automation.keywords.slice(0, 5).map((keyword, key) => (
//                 <Badge
//                   key={keyword.id}
//                   variant="outline"
//                   className={cn(
//                     "text-xs",
//                     key % 4 === 0 && "border-green-500/30 text-green-500",
//                     key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                     key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                     key % 4 === 3 && "border-red-500/30 text-red-500",
//                   )}
//                 >
//                   {keyword.word}
//                 </Badge>
//               ))}
//               {automation.keywords.length > 5 && (
//                 <Badge variant="outline" className="text-xs">
//                   +{automation.keywords.length - 5}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="mb-4">
//           <AutomationStats automation={automation} />
//         </div>

//         {/* Actions */}
//         <div className="flex items-center justify-between">
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" disabled={automation._isOptimistic} asChild={!automation._isOptimistic}>
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
//               className="text-destructive hover:text-destructive"
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={automation._isOptimistic}
//             >
//               <Trash2 size={14} />
//             </Button>
//           </div>

//           {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//             <Button variant="outline" size="sm" onClick={() => setShowChats(!showChats)}>
//               <MessageSquareText size={14} className="mr-2" />
//               View Chats
//             </Button>
//           )}
//         </div>

//         {/* Delete Confirmation */}
//         {showDeleteConfirm && (
//           <div className="mt-4 p-3 border border-destructive/30 rounded-lg bg-destructive/5">
//             <p className="text-sm text-destructive mb-2">Delete this automation permanently?</p>
//             <div className="flex gap-2">
//               <Button variant="destructive" size="sm" onClick={onDelete}>
//                 Delete
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Chat Section */}
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
import {
  Sparkles,
  Zap,
  Trash2,
  Settings,
  MessageSquareText,
  Clock,
  Loader2,
  Activity,
  BarChart3,
  Users,
  MessageCircle,
} from "lucide-react"
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

interface AutomationCardDashboardProps {
  automation: Automation
  onDelete?: () => void // Make this optional
  pathname: string
}

export const AutomationCardDashboard: React.FC<AutomationCardDashboardProps> = ({ automation, onDelete, pathname }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChats, setShowChats] = useState(false)

  // Mock metrics for demonstration
  const metrics = {
    interactions: Math.floor(Math.random() * 500) + 50,
    leads: Math.floor(Math.random() * 50) + 5,
    responses: Math.floor(Math.random() * 100) + 10,
  }

  return (
    <Card className="group bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                automation._isOptimistic
                  ? "bg-yellow-500/20 border border-yellow-500/30"
                  : automation.active
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-muted border border-border"
              }`}
            >
              {automation._isOptimistic ? (
                <Loader2 size={16} className="text-yellow-500 animate-spin" />
              ) : automation.active ? (
                <Activity size={16} className="text-green-500" />
              ) : (
                <Clock size={16} className="text-muted-foreground" />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg">{automation.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={automation.active ? "default" : "secondary"} className="text-xs">
                  {automation._isOptimistic ? "Creating" : automation.active ? "Active" : "Paused"}
                </Badge>

                {automation.listener?.listener === "SMARTAI" ? (
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs">
                    <Sparkles size={10} className="mr-1" />
                    Smart AI
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    <Zap size={10} className="mr-1" />
                    Standard
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        {!automation._isOptimistic && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-muted-foreground">Interactions</span>
              </div>
              <div className="text-lg font-bold text-foreground">{metrics.interactions}</div>
            </div>

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={14} className="text-green-500" />
                <span className="text-xs font-medium text-muted-foreground">Leads</span>
              </div>
              <div className="text-lg font-bold text-foreground">{metrics.leads}</div>
            </div>

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle size={14} className="text-purple-500" />
                <span className="text-xs font-medium text-muted-foreground">Messages</span>
              </div>
              <div className="text-lg font-bold text-foreground">{automation.listener?.dmCount || 0}</div>
            </div>
          </div>
        )}

        {/* Keywords */}
        {automation.keywords && automation.keywords.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {automation.keywords.slice(0, 5).map((keyword, key) => (
                <Badge
                  key={keyword.id}
                  variant="outline"
                  className={cn(
                    "text-xs",
                    key % 4 === 0 && "border-green-500/30 text-green-500",
                    key % 4 === 1 && "border-purple-500/30 text-purple-500",
                    key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
                    key % 4 === 3 && "border-red-500/30 text-red-500",
                  )}
                >
                  {keyword.word}
                </Badge>
              ))}
              {automation.keywords.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{automation.keywords.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4">
          <AutomationStats automation={automation} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={automation._isOptimistic} asChild={!automation._isOptimistic}>
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
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={automation._isOptimistic}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>

          {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => setShowChats(!showChats)}>
              <MessageSquareText size={14} className="mr-2" />
              View Chats
            </Button>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-4 p-3 border border-destructive/30 rounded-lg bg-destructive/5">
            <p className="text-sm text-destructive mb-2">Delete this automation permanently?</p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => onDelete?.()}>
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Chat Section */}
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
