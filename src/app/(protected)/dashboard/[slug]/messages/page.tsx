// "use client"

// import { useEffect, useState } from "react"
// import { useRouter,usePathname } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Avatar } from "@/components/ui/avatar"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Send, Search } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "@/hooks/use-toast"
// import { getUserChats } from "@/actions/collab/chat-actions"
// import { pusherClient } from "@/lib/pusher"
// import { onUserInfor } from "@/actions/user"

// export default function MessagesListPage() {
//   const router = useRouter()
//   const [conversations, setConversations] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("all")
//   const [userId, setUserId] = useState<string | null>(null)

//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : ""

//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       const user = await onUserInfor()
//       if (user.data?.id) {
//         setUserId(user.data.id)
//       } else {
//         // Redirect to login if not authenticated
//         router.push("/sign-up")
//       }
//     }

//     fetchCurrentUser()
//   }, [router])

//   // Fetch conversations
//   useEffect(() => {
//     const fetchConversations = async () => {
//       if (!userId) return

//       try {
//         const { status, data, message } = await getUserChats()

//         if (status === 200 && data) {
//           setConversations(data)
//         } else {
//           toast({
//             title: "Error",
//             description: message || "Failed to load conversations",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "An unexpected error occurred",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (userId) {
//       fetchConversations()
//     }
//   }, [userId])

//   // Set up real-time subscription for new messages
//   useEffect(() => {
//     if (!userId) return

//     // Subscribe to user's notification channel
//     const channel = pusherClient.subscribe(`user-${userId}`)

//     // Handle new message notifications
//     channel.bind("notification", (data: any) => {
//       if (data.type === "chat") {
//         // Refresh the conversations list
//         getUserChats().then(({ status, data }) => {
//           if (status === 200 && data) {
//             setConversations(data)
//           }
//         })

//         // Show toast notification
//         toast({
//           title: data.title,
//           description: data.message,
//         })
//       }
//     })

//     return () => {
//       pusherClient.unsubscribe(`user-${userId}`)
//     }
//   }, [userId])

//   const formatTime = (timestamp: string) => {
//     const date = new Date(timestamp)
//     const now = new Date()

//     // If today, show time
//     if (date.toDateString() === now.toDateString()) {
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     }

//     // If this week, show day nam e
//     const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
//     if (diffDays < 7) {
//       return date.toLocaleDateString([], { weekday: "short" })
//     }

//     // Otherwise show date
//     return date.toLocaleDateString([], { month: "short", day: "numeric" })
//   }

//   const filteredConversations = conversations.filter((conv) => {
//     // Apply search filter
//     const matchesSearch =
//       searchQuery === "" ||
//       conv.participants.some(
//         (p: any) =>
//           (p.businessName && p.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
//           (p.influencerName && p.influencerName.toLowerCase().includes(searchQuery.toLowerCase())),
//       )

//     // Apply type filter (influencer/business)
//     const matchesType =
//       filter === "all" ||
//       (filter === "influencers" && conv.participants.some((p: any) => p.influencerId)) ||
//       (filter === "businesses" && conv.participants.some((p: any) => p.businessId))

//     return matchesSearch && matchesType
//   })

//   const selectConversation = (conversationId: string) => {
//     router.push(`/dashboard/${slug}/messages/${conversationId}`)
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-950">
//         <div className="container mx-auto p-4 flex flex-1 overflow-hidden">
//           <div className="flex w-full h-full overflow-hidden bg-gray-900 rounded-lg shadow-xl border border-gray-800">
//             <div className="w-full flex flex-col">
//               <div className="p-4 border-b border-gray-800">
//                 <Skeleton className="h-8 w-48" />
//                 <Skeleton className="h-4 w-32 mt-2" />
//               </div>
//               <div className="p-4">
//                 <Skeleton className="h-10 w-full mb-4" />
//                 <Skeleton className="h-8 w-full mb-6" />

//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="flex items-start gap-3 mb-4">
//                     <Skeleton className="h-12 w-12 rounded-full" />
//                     <div className="flex-1">
//                       <Skeleton className="h-5 w-32 mb-1" />
//                       <Skeleton className="h-4 w-48" />
//                     </div>
//                     <Skeleton className="h-4 w-16" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-950">
//       <div className="container mx-auto p-4 flex flex-1 overflow-hidden">
//         <div className="flex w-full h-full overflow-hidden bg-gray-900 rounded-lg shadow-xl border border-gray-800">
//           <div className="w-full flex flex-col">
//             <div className="p-4 border-b border-gray-800">
//               <h2 className="text-xl font-semibold text-white">Messages</h2>
//               <p className="text-gray-400 text-sm">Communicate with influencers and businesses</p>
//             </div>

//             <div className="p-4 border-b border-gray-800">
//               <div className="relative mb-4">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Search conversations..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-gray-800 border-gray-700 text-white"
//                 />
//               </div>

//               <Tabs value={filter} onValueChange={setFilter} className="w-full">
//                 <TabsList className="w-full bg-gray-800">
//                   <TabsTrigger value="all" className="flex-1">
//                     All
//                   </TabsTrigger>
//                   <TabsTrigger value="influencers" className="flex-1">
//                     Influencers
//                   </TabsTrigger>
//                   <TabsTrigger value="businesses" className="flex-1">
//                     Businesses
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {filteredConversations.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-6">
//                   <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
//                     <Send className="h-6 w-6 text-gray-400" />
//                   </div>
//                   <h3 className="text-xl font-medium text-white mb-2">No conversations yet</h3>
//                   <p className="text-gray-400 max-w-md">
//                     {searchQuery
//                       ? "No conversations match your search criteria."
//                       : "Start messaging influencers or businesses to collaborate on opportunities."}
//                   </p>
//                 </div>
//               ) : (
//                 filteredConversations.map((conversation) => (
//                   <div
//                     key={conversation.id}
//                     className="p-3 cursor-pointer transition-colors hover:bg-gray-800/50"
//                     onClick={() => selectConversation(conversation.id)}
//                   >
//                     <div className="flex items-start gap-3">
//                     <Avatar className="h-12 w-12 bg-gray-700 flex items-center justify-center overflow-hidden">
//                         {conversation.participants[0]?.influencerId ? (
//                           <img src="/influencer-svg.svg" alt="Influencer" className="w-8 h-8" />
//                         ) : conversation.participants[0]?.businessId ? (
//                           <img src="/business-svg.svg" alt="Business" className="w-8 h-8" />
//                         ) : (
//                           <div className="text-lg font-semibold text-white">?</div>
//                         )}
//                       </Avatar>
//                       {/* <Avatar className="h-12 w-12 bg-gray-700">
//                         <div className="text-lg font-semibold text-white">
//                           {conversation.participants[0]?.influencerName?.charAt(0) ||
//                             conversation.participants[0]?.businessName?.charAt(0) ||
//                             "?"}
//                         </div>
//                       </Avatar> */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-baseline">
//                           <h3 className="font-medium text-white truncate">
//                             {conversation.participants[0]?.influencerName ||
//                               conversation.participants[0]?.businessName ||
//                               "Unknown"}
//                           </h3>
//                           <span className="text-xs text-gray-400 whitespace-nowrap">
//                             {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ""}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <p
//                             className={`text-sm truncate ${
//                               conversation.hasUnread ? "text-white font-medium" : "text-gray-400"
//                             }`}
//                           >
//                             {conversation.lastMessage?.content || "No messages yet"}
//                           </p>
//                           {conversation.hasUnread && (
//                             <div className="min-w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center ml-1 text-xs px-1.5">
//                               •
//                             </div>
//                           )}
//                         </div>
//                         <div className="mt-1">
//                           <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
//                             {conversation.participants[0]?.influencerId ? "influencer" : "business"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Send,
  Search,
  MessageSquare,
  Users,
  Building,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { getUserChats } from "@/actions/collab/chat-actions"
import { pusherClient } from "@/lib/pusher"
import { onUserInfor } from "@/actions/user"
import { motion, AnimatePresence } from "framer-motion"

export default function MessagesListPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const conversationsRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await onUserInfor()
      if (user.data?.id) {
        setUserId(user.data.id)
      } else {
        // Redirect to login if not authenticated
        router.push("/sign-up")
      }
    }

    fetchCurrentUser()
  }, [router])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) return

      try {
        const { status, data, message } = await getUserChats()

        if (status === 200 && data) {
          setConversations(data)
        } else {
          toast({
            title: "Error",
            description: message || "Failed to load conversations",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchConversations()
    }
  }, [userId])

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!userId) return

    // Subscribe to user's notification channel
    const channel = pusherClient.subscribe(`user-${userId}`)

    // Handle new message notifications
    channel.bind("notification", (data: any) => {
      if (data.type === "chat") {
        // Refresh the conversations list
        getUserChats().then(({ status, data }) => {
          if (status === 200 && data) {
            setConversations(data)
          }
        })

        // Show toast notification
        toast({
          title: data.title,
          description: data.message,
        })
      }
    })

    return () => {
      pusherClient.unsubscribe(`user-${userId}`)
    }
  }, [userId])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If this week, show day name
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    }

    // Otherwise show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const filteredConversations = conversations.filter((conv) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      conv.participants.some(
        (p: any) =>
          (p.businessName && p.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.influencerName && p.influencerName.toLowerCase().includes(searchQuery.toLowerCase())),
      )

    // Apply type filter (influencer/business)
    const matchesType =
      filter === "all" ||
      (filter === "influencers" && conv.participants.some((p: any) => p.influencerId)) ||
      (filter === "businesses" && conv.participants.some((p: any) => p.businessId))

    return matchesSearch && matchesType
  })

  const selectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    router.push(`/dashboard/${slug}/messages/${conversationId}`)
  }

  // Get unread count
  const unreadCount = conversations.filter((conv) => conv.hasUnread).length

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="container mx-auto p-4 flex flex-1 overflow-hidden">
          <div className="flex w-full h-full overflow-hidden bg-card rounded-lg shadow-xl border">
            <div className="w-full flex flex-col">
              <div className="p-4 border-b">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
              <div className="p-4">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-8 w-full mb-6" />

                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="container mx-auto p-4 flex flex-1 overflow-hidden">
        <div className="flex w-full h-full overflow-hidden bg-card rounded-lg shadow-xl border glassEffect">
          <div className="w-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Messages
                    {unreadCount > 0 && (
                      <Badge className="ml-2 bg-primary/20 text-primary border border-primary/30">
                        {unreadCount} unread
                      </Badge>
                    )}
                  </h2>
                  <p className="text-muted-foreground text-sm">Communicate with influencers and businesses</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => router.push(`/dashboard/${slug}/messages/new`)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            </div>

            {/* Search and filters */}
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={filter} onValueChange={setFilter} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="influencers" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Influencers
                  </TabsTrigger>
                  <TabsTrigger value="businesses" className="flex-1">
                    <Building className="h-4 w-4 mr-2" />
                    Businesses
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto" ref={conversationsRef}>
              <AnimatePresence>
                {filteredConversations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full text-center p-6"
                  >
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Send className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      {searchQuery
                        ? "No conversations match your search criteria."
                        : "Start messaging influencers or businesses to collaborate on opportunities."}
                    </p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-[#3352CC] to-[#1C2D70] hover:opacity-90"
                      onClick={() => router.push(`/dashboard/${slug}/messages/new`)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Start a Conversation
                    </Button>
                  </motion.div>
                ) : (
                  <div className="staggeredFadeIn">
                    {filteredConversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          p-3 cursor-pointer transition-all duration-200 border-l-4 relative
                          ${
                            selectedConversationId === conversation.id
                              ? "bg-primary/10 border-l-primary"
                              : conversation.hasUnread
                                ? "hover:bg-muted/50 border-l-primary/50"
                                : "hover:bg-muted/50 border-l-transparent"
                          }
                        `}
                        onClick={() => selectConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border border-border">
                            {conversation.participants[0]?.influencerId ? (
                              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                              </div>
                            ) : conversation.participants[0]?.businessId ? (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                <Building className="h-6 w-6 text-primary" />
                              </div>
                            ) : (
                              <AvatarFallback className="bg-muted">
                                {conversation.participants[0]?.influencerName?.charAt(0) ||
                                  conversation.participants[0]?.businessName?.charAt(0) ||
                                  "?"}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className={`font-medium truncate ${conversation.hasUnread ? "text-primary" : ""}`}>
                                {conversation.participants[0]?.influencerName ||
                                  conversation.participants[0]?.businessName ||
                                  "Unknown"}
                              </h3>
                              <div className="flex items-center">
                                {conversation.hasUnread && (
                                  <Badge
                                    variant="outline"
                                    className="mr-2 bg-primary/20 border-primary/30 text-primary"
                                  >
                                    New
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ""}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 mt-1">
                              <p
                                className={`text-sm truncate ${conversation.hasUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}
                              >
                                {conversation.lastMessage?.content || "No messages yet"}
                              </p>
                              {conversation.hasUnread && (
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse ml-1"></div>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={`
                                  px-2 py-0.5 text-xs
                                  ${
                                    conversation.participants[0]?.influencerId
                                      ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                                      : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                  }
                                `}
                              >
                                {conversation.participants[0]?.influencerId ? (
                                  <Users className="h-3 w-3 mr-1" />
                                ) : (
                                  <Building className="h-3 w-3 mr-1" />
                                )}
                                {conversation.participants[0]?.influencerId ? "influencer" : "business"}
                              </Badge>

                              <div className="text-muted-foreground">
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status indicators */}
                        {conversation.lastMessage?.status === "delivered" && (
                          <div className="absolute bottom-2 right-2 text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        )}
                        {conversation.lastMessage?.status === "failed" && (
                          <div className="absolute bottom-2 right-2 text-destructive">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
