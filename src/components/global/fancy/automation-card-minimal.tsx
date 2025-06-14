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
//   ChevronDown,
//   Clock,
//   Loader2,
//   MoreVertical,
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

// interface AutomationCardMinimalProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
// }

// export const AutomationCardMinimal: React.FC<AutomationCardMinimalProps> = ({ automation, onDelete, pathname }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [showChats, setShowChats] = useState(false)
//   const [showActions, setShowActions] = useState(false)

//   return (
//     <Card className="group relative bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <h2 className="text-xl font-semibold text-foreground">{automation.name}</h2>
//               {automation._isOptimistic && (
//                 <Badge variant="secondary" className="animate-pulse">
//                   <Loader2 size={12} className="mr-1 animate-spin" />
//                   Creating
//                 </Badge>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}

//               {automation.listener?.listener === "SMARTAI" ? (
//                 <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
//                   <Sparkles size={12} className="mr-1" />
//                   Smart AI
//                 </Badge>
//               ) : (
//                 <Badge variant="outline" className="bg-muted/50">
//                   <Zap size={12} className="mr-1" />
//                   Standard
//                 </Badge>
//               )}

//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Clock size={14} className="mr-1" />
//                 {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
//               </div>
//             </div>
//           </div>

//           <div className="relative">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setShowActions(!showActions)}
//               className="opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <MoreVertical size={16} />
//             </Button>

//             {showActions && (
//               <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
//                 <div className="p-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="w-full justify-start text-left"
//                     disabled={automation._isOptimistic}
//                     asChild={!automation._isOptimistic}
//                   >
//                     {automation._isOptimistic ? (
//                       <div className="flex items-center">
//                         <Settings size={14} className="mr-2" />
//                         Configure
//                       </div>
//                     ) : (
//                       <Link href={`${pathname}/${automation.id}`} className="flex items-center">
//                         <Settings size={14} className="mr-2" />
//                         Configure
//                       </Link>
//                     )}
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="w-full justify-start text-destructive hover:text-destructive"
//                     onClick={() => setShowDeleteConfirm(true)}
//                     disabled={automation._isOptimistic}
//                   >
//                     <Trash2 size={14} className="mr-2" />
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Keywords */}
//         {automation.keywords && automation.keywords.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             {automation.keywords.slice(0, 4).map((keyword, key) => (
//               <Badge
//                 key={keyword.id}
//                 variant="outline"
//                 className={cn(
//                   "text-xs",
//                   key % 4 === 0 && "border-green-500/30 text-green-500",
//                   key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                   key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                   key % 4 === 3 && "border-red-500/30 text-red-500",
//                 )}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//             {automation.keywords.length > 4 && (
//               <Badge variant="outline" className="text-xs">
//                 +{automation.keywords.length - 4} more
//               </Badge>
//             )}
//           </div>
//         )}

//         {/* Stats */}
//         <AutomationStats automation={automation} />

//         {/* Chat Section */}
//         {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//           <div className="mt-4 pt-4 border-t border-border">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowChats(!showChats)}
//               className="w-full justify-between"
//             >
//               <div className="flex items-center">
//                 <MessageSquareText size={16} className="mr-2" />
//                 <span>View Conversations</span>
//                 <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
//                   {automation.listener.dmCount}
//                 </Badge>
//               </div>
//               <ChevronDown size={16} className={`transition-transform ${showChats ? "rotate-180" : ""}`} />
//             </Button>
//           </div>
//         )}

//         {/* Delete Confirmation */}
//         {showDeleteConfirm && (
//           <div className="mt-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
//             <p className="text-sm text-destructive mb-3">
//               Are you sure you want to delete this automation? This action cannot be undone.
//             </p>
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

//         {/* Chat Expansion */}
//         <AnimatePresence>
//           {showChats && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
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
import {
  Sparkles,
  Zap,
  Trash2,
  Settings,
  MessageSquareText,
  ChevronDown,
  Clock,
  Loader2,
  MoreVertical,
} from "lucide-react"
import AutomationStats from "./automation-stats"
import AutomationChats from "./automationChats"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

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

interface AutomationCardMinimalProps {
  automation: Automation
  onDelete?: () => void
  pathname: string
}

export const AutomationCardMinimal: React.FC<AutomationCardMinimalProps> = ({ automation, onDelete, pathname }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChats, setShowChats] = useState(false)
  const [showActions, setShowActions] = useState(false)

  return (
    <Card className="group relative bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">{automation.name}</h2>
              {automation._isOptimistic && (
                <Badge variant="secondary" className="animate-pulse">
                  <Loader2 size={12} className="mr-1 animate-spin" />
                  Creating
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}

              {automation.listener?.listener === "SMARTAI" ? (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
                  <Sparkles size={12} className="mr-1" />
                  Smart AI
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted/50">
                  <Zap size={12} className="mr-1" />
                  Standard
                </Badge>
              )}

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
              </div>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={16} />
            </Button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    disabled={automation._isOptimistic}
                    asChild={!automation._isOptimistic}
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
                    <DropdownMenuItem
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-destructive focus:text-destructive"
                      disabled={automation._isOptimistic}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keywords */}
        {automation.keywords && automation.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {automation.keywords.slice(0, 4).map((keyword, key) => (
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
            {automation.keywords.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{automation.keywords.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <AutomationStats automation={automation} />

        {/* Chat Section */}
        {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChats(!showChats)}
              className="w-full justify-between"
            >
              <div className="flex items-center">
                <MessageSquareText size={16} className="mr-2" />
                <span>View Conversations</span>
                <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {automation.listener.dmCount}
                </Badge>
              </div>
              <ChevronDown size={16} className={`transition-transform ${showChats ? "rotate-180" : ""}`} />
            </Button>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
            <p className="text-sm text-destructive mb-3">
              Are you sure you want to delete this automation? This action cannot be undone.
            </p>
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

        {/* Chat Expansion */}
        <AnimatePresence>
          {showChats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
                <AutomationChats automationId={automation.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
