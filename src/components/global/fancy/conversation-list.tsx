// "use client"

// import type React from "react"
// import { memo } from "react"
// import { motion } from "framer-motion"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Pin, Star, Trash2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import type { Conversation } from "@/types/dashboard"

// interface ConversationListProps {
//   conversations: Conversation[]
//   pinnedConversations: Set<string>
//   starredConversations: Set<string>
//   onSelectConversation: (conversation: Conversation) => void
//   onTogglePin: (conversationId: string, e: React.MouseEvent) => void
//   onToggleStar: (conversationId: string, e: React.MouseEvent) => void
//   onDeleteConversation: (conversation: Conversation) => void
// }

// const ConversationItem = memo(
//   ({
//     conversation,
//     isPinned,
//     isStarred,
//     onSelect,
//     onTogglePin,
//     onToggleStar,
//     onDelete,
//   }: {
//     conversation: Conversation
//     isPinned: boolean
//     isStarred: boolean
//     onSelect: () => void
//     onTogglePin: (e: React.MouseEvent) => void
//     onToggleStar: (e: React.MouseEvent) => void
//     onDelete: () => void
//   }) => {
//     const isUnread = conversation.unreadCount > 0
//     const getFancyName = (userId: string) => "Client"
//     const getActivityStatus = (lastActive: Date) => {
//       const now = new Date()
//       const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / 60000)
//       if (diffInMinutes < 1) return "Active now"
//       if (diffInMinutes < 60) return `Active ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
//       const diffInHours = Math.floor(diffInMinutes / 60)
//       if (diffInHours < 24) return `Active ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
//       const diffInDays = Math.floor(diffInHours / 24)
//       return `Active ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
//     }

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.2 }}
//         className={cn(
//           "p-4 bg-background rounded-lg shadow-md hover:bg-muted cursor-pointer transition-colors duration-200 relative",
//           isPinned && "border-l-4 border-blue-500",
//           isUnread && "bg-background/90 border-l-4 border-red-500",
//         )}
//         onClick={onSelect}
//       >
//         <div className="flex items-start space-x-3">
//           <Avatar className="w-12 h-12 relative border-2 border-primary flex-shrink-0">
//             <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.id}`} />
//             <AvatarFallback>{getFancyName(conversation.id).slice(0, 2)}</AvatarFallback>
//             {isUnread && (
//               <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
//             )}
//           </Avatar>

//           <div className="flex-grow overflow-hidden">
//             <div className="flex items-center justify-between mb-1">
//               <div className="flex items-center">
//                 <p className={cn("font-medium text-sm text-foreground", isUnread && "font-bold")}>
//                   {getFancyName(conversation.id)}
//                 </p>
//                 {isPinned && (
//                   <Badge variant="outline" className="ml-2 px-1">
//                     <Pin className="h-3 w-3 text-blue-500" />
//                   </Badge>
//                 )}
//                 {isStarred && (
//                   <Badge variant="outline" className="ml-2 px-1">
//                     <Star className="h-3 w-3 text-yellow-500" />
//                   </Badge>
//                 )}
//               </div>
//               <span className="text-xs text-muted-foreground">
//                 {new Date(conversation.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//               </span>
//             </div>

//             <p className="text-xs text-muted-foreground flex items-center mb-1">
//               {getActivityStatus(conversation.updatedAt)}
//             </p>

//             <p className={cn("text-sm text-muted-foreground truncate", isUnread && "text-foreground font-medium")}>
//               {conversation.messages.length > 0
//                 ? conversation.messages[conversation.messages.length - 1].content
//                 : "No messages"}
//             </p>

//             <div className="flex justify-between items-center mt-2">
//               <div className="flex space-x-1">
//                 <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onTogglePin}>
//                   <Pin className={cn("h-4 w-4", isPinned ? "text-blue-500 fill-blue-500" : "text-muted-foreground")} />
//                 </Button>

//                 <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onToggleStar}>
//                   <Star
//                     className={cn("h-4 w-4", isStarred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")}
//                   />
//                 </Button>

//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-7 w-7 rounded-full"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     onDelete()
//                   }}
//                 >
//                   <Trash2 size={16} className="text-muted-foreground hover:text-red-500" />
//                 </Button>
//               </div>

//               {isUnread && (
//                 <Badge variant="destructive" className="text-xs">
//                   {conversation.unreadCount}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     )
//   },
// )

// ConversationItem.displayName = "ConversationItem"

// export const ConversationList: React.FC<ConversationListProps> = ({
//   conversations,
//   pinnedConversations,
//   starredConversations,
//   onSelectConversation,
//   onTogglePin,
//   onToggleStar,
//   onDeleteConversation,
// }) => {
//   return (
//     <div className="space-y-3">
//       {conversations.map((conversation) => (
//         <ConversationItem
//           key={conversation.id}
//           conversation={conversation}
//           isPinned={pinnedConversations.has(conversation.id)}
//           isStarred={starredConversations.has(conversation.id)}
//           onSelect={() => onSelectConversation(conversation)}
//           onTogglePin={(e) => onTogglePin(conversation.id, e)}
//           onToggleStar={(e) => onToggleStar(conversation.id, e)}
//           onDelete={() => onDeleteConversation(conversation)}
//         />
//       ))}
//     </div>
//   )
// }

"use client"

import type React from "react"
import { memo } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pin, Star, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/dashboard"

interface ConversationListProps {
  conversations: Conversation[]
  pinnedConversations: Set<string>
  starredConversations: Set<string>
  onSelectConversation: (conversation: Conversation) => void
  onTogglePin: (conversationId: string, e: React.MouseEvent) => void
  onToggleStar: (conversationId: string, e: React.MouseEvent) => void
  onDeleteConversation: (conversation: Conversation) => void
}

const ConversationItem = memo(
  ({
    conversation,
    isPinned,
    isStarred,
    onSelect,
    onTogglePin,
    onToggleStar,
    onDelete,
  }: {
    conversation: Conversation
    isPinned: boolean
    isStarred: boolean
    onSelect: () => void
    onTogglePin: (e: React.MouseEvent) => void
    onToggleStar: (e: React.MouseEvent) => void
    onDelete: () => void
  }) => {
    const isUnread = conversation.unreadCount > 0

    const getFancyName = () => "Client"

    const getActivityStatus = (lastActive: Date) => {
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / 60000)
      if (diffInMinutes < 1) return "Active now"
      if (diffInMinutes < 60) return `Active ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `Active ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
      const diffInDays = Math.floor(diffInHours / 24)
      return `Active ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "p-4 bg-background rounded-lg shadow-md hover:bg-muted cursor-pointer transition-colors duration-200 relative",
          isPinned && "border-l-4 border-blue-500",
          isUnread && "bg-background/90 border-l-4 border-red-500",
        )}
        onClick={onSelect}
      >
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12 relative border-2 border-primary flex-shrink-0">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.id}`} />
            <AvatarFallback>{getFancyName().slice(0, 2)}</AvatarFallback>
            {isUnread && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
            )}
          </Avatar>

          <div className="flex-grow overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <p className={cn("font-medium text-sm text-foreground", isUnread && "font-bold")}>{getFancyName()}</p>
                {isPinned && (
                  <Badge variant="outline" className="ml-2 px-1">
                    <Pin className="h-3 w-3 text-blue-500" />
                  </Badge>
                )}
                {isStarred && (
                  <Badge variant="outline" className="ml-2 px-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(conversation.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <p className="text-xs text-muted-foreground flex items-center mb-1">
              {getActivityStatus(conversation.updatedAt)}
            </p>

            <p className={cn("text-sm text-muted-foreground truncate", isUnread && "text-foreground font-medium")}>
              {conversation.messages.length > 0
                ? conversation.messages[conversation.messages.length - 1].content
                : "No messages"}
            </p>

            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onTogglePin}>
                  <Pin className={cn("h-4 w-4", isPinned ? "text-blue-500 fill-blue-500" : "text-muted-foreground")} />
                </Button>

                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onToggleStar}>
                  <Star
                    className={cn("h-4 w-4", isStarred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 size={16} className="text-muted-foreground hover:text-red-500" />
                </Button>
              </div>

              {isUnread && (
                <Badge variant="destructive" className="text-xs">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  },
)

ConversationItem.displayName = "ConversationItem"

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  pinnedConversations,
  starredConversations,
  onSelectConversation,
  onTogglePin,
  onToggleStar,
  onDeleteConversation,
}) => {
  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isPinned={pinnedConversations.has(conversation.id)}
          isStarred={starredConversations.has(conversation.id)}
          onSelect={() => onSelectConversation(conversation)}
          onTogglePin={(e) => onTogglePin(conversation.id, e)}
          onToggleStar={(e) => onToggleStar(conversation.id, e)}
          onDelete={() => onDeleteConversation(conversation)}
        />
      ))}
    </div>
  )
}
