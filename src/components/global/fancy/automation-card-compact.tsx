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
// import { Sparkles, Zap, Trash2, Settings, MessageSquareText, Clock, Loader2, ChevronRight } from "lucide-react"
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

// interface AutomationCardCompactProps {
//   automation: Automation
//   onDelete: () => void
//   pathname: string
// }

// export const AutomationCardCompact: React.FC<AutomationCardCompactProps> = ({ automation, onDelete, pathname }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [expanded, setExpanded] = useState(false)

//   return (
//     <Card className="group bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
//       <div className="p-4">
//         {/* Main Row */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4 flex-1">
//             {/* Status Indicator */}
//             <div className="flex-shrink-0">{automation.active ? <ActiveIndicator /> : <InactiveIndicator />}</div>

//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="font-semibold text-foreground truncate">{automation.name}</h3>
//                 {automation._isOptimistic && (
//                   <Badge variant="secondary" className="animate-pulse text-xs">
//                     <Loader2 size={10} className="mr-1 animate-spin" />
//                     Creating
//                   </Badge>
//                 )}
//               </div>

//               <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-1">
//                   <Clock size={12} />
//                   {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
//                 </div>

//                 {automation.listener?.listener === "SMARTAI" ? (
//                   <Badge
//                     variant="outline"
//                     className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs px-2 py-0"
//                   >
//                     <Sparkles size={10} className="mr-1" />
//                     Smart AI
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="bg-muted/50 text-xs px-2 py-0">
//                     <Zap size={10} className="mr-1" />
//                     Standard
//                   </Badge>
//                 )}

//                 {automation.keywords && automation.keywords.length > 0 && (
//                   <span className="text-xs">
//                     {automation.keywords.length} keyword{automation.keywords.length !== 1 ? "s" : ""}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-2">
//             {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//               <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
//                 <MessageSquareText size={10} className="mr-1" />
//                 {automation.listener.dmCount}
//               </Badge>
//             )}

//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setExpanded(!expanded)}
//               className="opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <ChevronRight size={16} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
//             </Button>
//           </div>
//         </div>

//         {/* Expanded Content */}
//         <AnimatePresence>
//           {expanded && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="mt-4 pt-4 border-t border-border space-y-4">
//                 {/* Keywords */}
//                 {automation.keywords && automation.keywords.length > 0 && (
//                   <div className="flex flex-wrap gap-1">
//                     {automation.keywords.slice(0, 6).map((keyword, key) => (
//                       <Badge
//                         key={keyword.id}
//                         variant="outline"
//                         className={cn(
//                           "text-xs",
//                           key % 4 === 0 && "border-green-500/30 text-green-500",
//                           key % 4 === 1 && "border-purple-500/30 text-purple-500",
//                           key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
//                           key % 4 === 3 && "border-red-500/30 text-red-500",
//                         )}
//                       >
//                         {keyword.word}
//                       </Badge>
//                     ))}
//                     {automation.keywords.length > 6 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{automation.keywords.length - 6}
//                       </Badge>
//                     )}
//                   </div>
//                 )}

//                 {/* Stats */}
//                 <AutomationStats automation={automation} />

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
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
//                     variant="outline"
//                     size="sm"
//                     className="text-destructive hover:text-destructive"
//                     onClick={() => setShowDeleteConfirm(true)}
//                     disabled={automation._isOptimistic}
//                   >
//                     <Trash2 size={14} className="mr-2" />
//                     Delete
//                   </Button>
//                 </div>

//                 {/* Delete Confirmation */}
//                 {showDeleteConfirm && (
//                   <div className="p-3 border border-destructive/30 rounded-lg bg-destructive/5">
//                     <p className="text-sm text-destructive mb-2">
//                       Delete this automation? This action cannot be undone.
//                     </p>
//                     <div className="flex gap-2">
//                       <Button variant="destructive" size="sm" onClick={onDelete}>
//                         Confirm
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Chat Section */}
//                 {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
//                   <div className="p-3 border border-border rounded-lg bg-muted/30">
//                     <AutomationChats automationId={automation.id} />
//                   </div>
//                 )}
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
import { Sparkles, Zap, Trash2, Settings, MessageSquareText, Clock, Loader2, ChevronRight } from "lucide-react"
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

interface AutomationCardCompactProps {
  automation: Automation
  onDelete?: () => void
  pathname: string
}

export const AutomationCardCompact: React.FC<AutomationCardCompactProps> = ({ automation, onDelete, pathname }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="group bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
      <div className="p-4">
        {/* Main Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Status Indicator */}
            <div className="flex-shrink-0">{automation.active ? <ActiveIndicator /> : <InactiveIndicator />}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{automation.name}</h3>
                {automation._isOptimistic && (
                  <Badge variant="secondary" className="animate-pulse text-xs">
                    <Loader2 size={10} className="mr-1 animate-spin" />
                    Creating
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
                </div>

                {automation.listener?.listener === "SMARTAI" ? (
                  <Badge
                    variant="outline"
                    className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs px-2 py-0"
                  >
                    <Sparkles size={10} className="mr-1" />
                    Smart AI
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted/50 text-xs px-2 py-0">
                    <Zap size={10} className="mr-1" />
                    Standard
                  </Badge>
                )}

                {automation.keywords && automation.keywords.length > 0 && (
                  <span className="text-xs">
                    {automation.keywords.length} keyword{automation.keywords.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                <MessageSquareText size={10} className="mr-1" />
                {automation.listener.dmCount}
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Keywords */}
                {automation.keywords && automation.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {automation.keywords.slice(0, 6).map((keyword, key) => (
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
                    {automation.keywords.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{automation.keywords.length - 6}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <AutomationStats automation={automation} />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={automation._isOptimistic}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
                  )}
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                  <div className="p-3 border border-destructive/30 rounded-lg bg-destructive/5">
                    <p className="text-sm text-destructive mb-2">
                      Delete this automation? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={() => onDelete?.()}>
                        Confirm
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Chat Section */}
                {!automation._isOptimistic && automation.listener?.dmCount && automation.listener.dmCount > 0 && (
                  <div className="p-3 border border-border rounded-lg bg-muted/30">
                    <AutomationChats automationId={automation.id} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
