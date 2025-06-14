// "use client"

// import type React from "react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Bell, BellOff, Check, Search, X } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"

// interface ChatHeaderProps {
//   totalUnreadMessages: number
//   hasNewMessages: boolean
//   soundEnabled: boolean
//   searchQuery: string
//   isSearchFocused: boolean
//   onToggleSound: () => void
//   onMarkAllAsRead: () => void
//   onShowHelp: () => void
//   onSearchChange: (query: string) => void
//   onSearchFocus: () => void
//   onSearchBlur: () => void
//   onClearSearch: () => void
// }

// export const ChatHeader: React.FC<ChatHeaderProps> = ({
//   totalUnreadMessages,
//   hasNewMessages,
//   soundEnabled,
//   searchQuery,
//   isSearchFocused,
//   onToggleSound,
//   onMarkAllAsRead,
//   onShowHelp,
//   onSearchChange,
//   onSearchFocus,
//   onSearchBlur,
//   onClearSearch,
// }) => {
//   return (
//     <div className="p-4 bg-background border-b border-primary/10">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold flex items-center">
//           <span>Recent Chats</span>
//           {hasNewMessages && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
//           {totalUnreadMessages > 0 && (
//             <Badge variant="destructive" className="ml-2">
//               {totalUnreadMessages}
//             </Badge>
//           )}
//         </h3>

//         <div className="flex items-center space-x-2">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggleSound}>
//                   {soundEnabled ? (
//                     <Bell className="h-5 w-5 text-primary" />
//                   ) : (
//                     <BellOff className="h-5 w-5 text-muted-foreground" />
//                   )}
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{soundEnabled ? "Mute notifications" : "Unmute notifications"}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="rounded-full" onClick={onMarkAllAsRead}>
//                   <Check className="h-5 w-5 text-muted-foreground" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Mark all as read</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="rounded-full" onClick={onShowHelp}>
//                   <span className="text-sm font-semibold">?</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Help</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>

//       <div className="relative mb-4">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search conversations..."
//           value={searchQuery}
//           onChange={(e) => onSearchChange(e.target.value)}
//           onFocus={onSearchFocus}
//           onBlur={onSearchBlur}
//           className={cn("pl-10 pr-10 py-2 bg-muted border-primary/20", isSearchFocused && "ring-2 ring-primary/50")}
//         />
//         {searchQuery && (
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
//             onClick={onClearSearch}
//           >
//             <X className="h-4 w-4 text-muted-foreground" />
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bell, BellOff, Check, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  totalUnreadMessages: number
  hasNewMessages: boolean
  soundEnabled: boolean
  searchQuery: string
  isSearchFocused: boolean
  onToggleSound: () => void
  onMarkAllAsRead: () => void
  onShowHelp: () => void
  onSearchChange: (query: string) => void
  onSearchFocus: () => void
  onSearchBlur: () => void
  onClearSearch: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  totalUnreadMessages,
  hasNewMessages,
  soundEnabled,
  searchQuery,
  isSearchFocused,
  onToggleSound,
  onMarkAllAsRead,
  onShowHelp,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onClearSearch,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="p-4 bg-background border-b border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span>Recent Chats</span>
          {hasNewMessages && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          {totalUnreadMessages > 0 && (
            <Badge variant="destructive" className="ml-2">
              {totalUnreadMessages}
            </Badge>
          )}
        </h3>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggleSound}>
                  {soundEnabled ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{soundEnabled ? "Mute notifications" : "Unmute notifications"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={onMarkAllAsRead}>
                  <Check className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark all as read</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={onShowHelp}>
                  <span className="text-sm font-semibold">?</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          className={cn("pl-10 pr-10 py-2 bg-muted border-primary/20", isSearchFocused && "ring-2 ring-primary/50")}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  )
}
