// "use client"

// import type React from "react"
// import { useEffect, useState, useRef, useCallback, useMemo } from "react"
// import { motion } from "framer-motion"
// import { useSpring, animated } from "react-spring"
// import { ArrowLeft, MessageSquare, Loader2, Zap } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import type { Conversation, Message } from "@/types/dashboard"
// import { fetchChatsAndBusinessVariables } from "@/actions/messageAction/messageAction"
// import { sendDMz } from "@/lib/fetch"
// import { cn } from "@/lib/utils"
// import FancyLoader from "./fancy-loader"
// import ExampleConversations from "./exampleConvo"
// import DeleteConfirmationModal from "./confirmDelete"
// import { usePusher } from "@/hooks/use-pusher"
// import { useChatState } from "@/hooks/use-chat-state"
// import { useOfflineStorage } from "@/hooks/use-offline-storage"
// import { useDatabaseSync } from "@/hooks/use-database-sync"
// import { ChatHeader } from "./chat-header"
// import { ConversationList } from "./conversation-list"
// import { MessageInput } from "./message-input"

// interface AutomationChatsProps {
//   automationId: string
//   userId?: string
// }

// interface BusinessVariables {
//   [key: string]: string
//   business_name: string
//   welcome_message: string
//   business_industry: string
// }

// const BOT_NAME = "AiAssist"
// const BOT_AVATAR = "/fancy-profile-pic.svg"
// const EXCLUDED_CHAT_ID = "17841471075473962"

// const gradientBorder = "bg-gradient-to-r from-primary via-purple-500 to-secondary p-[2px] rounded-lg"
// const fancyBackground = "bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1d1d1d]"

// const ShimmeringBorder = ({ children }: { children: React.ReactNode }) => {
//   const styles = useSpring({
//     from: { backgroundPosition: "0% 50%" },
//     to: { backgroundPosition: "100% 50%" },
//     config: { duration: 5000 },
//     loop: true,
//   })

//   return (
//     <animated.div
//       style={{
//         ...styles,
//         backgroundSize: "200% 200%",
//       }}
//       className={`${gradientBorder} p-[2px] rounded-lg`}
//     >
//       {children}
//     </animated.div>
//   )
// }

// const FancyErrorMessage: React.FC<{ message: string }> = ({ message }) => {
//   return (
//     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ type: "spring", stiffness: 260, damping: 20 }}
//       >
//         <Zap className="w-16 h-16 text-yellow-400 mb-4" />
//       </motion.div>
//       <h3 className="text-xl font-semibold mb-2">Hang tight!</h3>
//       <p className="text-muted-foreground mb-4">{message}</p>
//       <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
//         <Loader2 className="w-6 h-6 text-primary animate-spin" />
//       </motion.div>
//     </div>
//   )
// }

// const AutomationChats: React.FC<AutomationChatsProps> = ({ automationId, userId = "" }) => {
//   const [chatState, chatActions] = useChatState()
//   const { cachedConversations, isOffline, saveConversations, loadReadStatus, saveReadStatus } = useOfflineStorage()
//   const { pusher, isConnected: isPusherConnected, subscribe } = usePusher()
//   const { loadConversations, saveUserPreferences, loadUserPreferences } = useDatabaseSync(automationId, userId)

//   const [newMessage, setNewMessage] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const [token, setToken] = useState<string | null>(null)
//   const [pageId, setPageId] = useState<string | null>(null)
//   const [businessVariables, setBusinessVariables] = useState<BusinessVariables>({
//     business_name: "",
//     welcome_message: "",
//     business_industry: "",
//   })
//   const [soundEnabled, setSoundEnabled] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "recent">("all")
//   const [isSearchFocused, setIsSearchFocused] = useState(false)
//   const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(new Set())
//   const [starredConversations, setStarredConversations] = useState<Set<string>>(new Set())
//   const [hasNewMessages, setHasNewMessages] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)

//   const scrollRef = useRef<HTMLDivElement>(null)
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   // Initialize audio
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const audio = new Audio("/message-notification.mp3")
//       audio.load()
//       audioRef.current = audio

//       return () => {
//         if (audioRef.current) {
//           audioRef.current.pause()
//           audioRef.current = null
//         }
//       }
//     }
//   }, [])

//   // Load user preferences on mount
//   useEffect(() => {
//     const loadPrefs = async () => {
//       if (!userId) return

//       try {
//         const prefs = await loadUserPreferences()
//         if (prefs) {
//           setSoundEnabled(prefs.soundEnabled)
//         }
//       } catch (error) {
//         console.error("Error loading preferences:", error)
//       }
//     }

//     loadPrefs()
//   }, [userId, loadUserPreferences])

//   // Save preferences when they change
//   useEffect(() => {
//     if (!userId) return

//     const savePrefs = async () => {
//       try {
//         await saveUserPreferences({
//           soundEnabled,
//           desktopNotifications: true,
//           emailNotifications: false,
//           autoMarkAsRead: false,
//           theme: "system",
//           language: "en",
//         })
//       } catch (error) {
//         console.error("Error saving preferences:", error)
//       }
//     }

//     savePrefs()
//   }, [soundEnabled, userId, saveUserPreferences])

//   // Load conversations from database
//   const fetchChats = useCallback(async () => {
//     if (isOffline || !automationId) return

//     try {
//       setError(null)
//       setIsLoading(true)

//       // Try to load from database first
//       const dbConversations = await loadConversations()
//       if (dbConversations.length > 0) {
//         chatActions.setConversations(dbConversations)
//         saveConversations(dbConversations)
//         setIsLoading(false)
//         return
//       }

//       // Fallback to existing API
//       const result = await fetchChatsAndBusinessVariables(automationId)

//       if (!result || typeof result !== "object") {
//         throw new Error("Invalid response from server")
//       }

//       const { conversations, token, businessVariables } = result as {
//         conversations: any[]
//         token: string
//         businessVariables: BusinessVariables
//       }

//       if (!Array.isArray(conversations)) {
//         throw new Error("Conversations data is not in the expected format")
//       }

//       const transformedConversations = conversations
//         .filter((conv) => conv.chatId !== EXCLUDED_CHAT_ID)
//         .map(
//           (conv): Conversation => ({
//             id: conv.chatId,
//             userId: conv.messages[0]?.senderId || conv.chatId,
//             pageId: conv.pageId,
//             messages: conv.messages.map(
//               (msg: any): Message => ({
//                 id: msg.id,
//                 role: msg.role,
//                 content: msg.content,
//                 senderId: msg.senderId,
//                 createdAt: new Date(msg.createdAt),
//                 read: chatState.readConversations.has(conv.chatId) ? true : Boolean(msg.read),
//               }),
//             ),
//             createdAt: new Date(conv.messages[0]?.createdAt ?? Date.now()),
//             updatedAt: new Date(conv.messages[conv.messages.length - 1]?.createdAt ?? Date.now()),
//             unreadCount: chatState.readConversations.has(conv.chatId)
//               ? 0
//               : conv.messages.filter((msg: any) => !msg.read).length,
//             Automation: null,
//           }),
//         )

//       transformedConversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

//       chatActions.setConversations(transformedConversations)
//       saveConversations(transformedConversations)

//       if (transformedConversations.length > 0 && !pageId) {
//         setPageId(transformedConversations[0].pageId)
//       }

//       if (token) setToken(token)
//       if (businessVariables) setBusinessVariables(businessVariables)
//     } catch (error) {
//       console.error("Error fetching chats:", error)
//       if (cachedConversations.length > 0) {
//         chatActions.setConversations(cachedConversations)
//       } else {
//         setError(`Error loading conversations: ${error instanceof Error ? error.message : "Unknown error"}`)
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }, [
//     automationId,
//     isOffline,
//     loadConversations,
//     chatActions,
//     saveConversations,
//     cachedConversations,
//     chatState.readConversations,
//     pageId,
//   ])

//   // Initial load
//   useEffect(() => {
//     fetchChats()
//   }, []) // Remove fetchChats from dependencies to prevent infinite loop

//   // Set up Pusher subscriptions
//   useEffect(() => {
//     if (!pusher || !isPusherConnected || !automationId) return

//     const channelName = `automation-${automationId}`
//     const channel = subscribe(channelName)

//     if (channel) {
//       const handleNewMessage = (data: { conversationId: string; message: Message }) => {
//         console.log("New message received via Pusher:", data)
//         chatActions.addMessage(data.conversationId, data.message)

//         if (soundEnabled && chatState.selectedConversation?.id !== data.conversationId) {
//           playNotificationSound()
//         }

//         setHasNewMessages(true)
//       }

//       const handleMessageRead = (data: { conversationId: string; messageIds: string[] }) => {
//         console.log("Message read status updated via Pusher:", data)
//         const conversation = chatState.conversations.find((c) => c.id === data.conversationId)
//         if (conversation) {
//           const updatedMessages = conversation.messages.map((msg) =>
//             data.messageIds.includes(msg.id) ? { ...msg, read: true } : msg,
//           )
//           chatActions.updateConversation(data.conversationId, { messages: updatedMessages })
//         }
//       }

//       channel.bind("new-message", handleNewMessage)
//       channel.bind("message-read", handleMessageRead)

//       return () => {
//         channel.unbind("new-message", handleNewMessage)
//         channel.unbind("message-read", handleMessageRead)
//       }
//     }
//   }, [
//     pusher,
//     isPusherConnected,
//     automationId,
//     soundEnabled,
//     chatState.selectedConversation?.id,
//     chatActions,
//     chatState.conversations,
//   ])

//   const playNotificationSound = useCallback(() => {
//     if (!soundEnabled || !audioRef.current) return

//     try {
//       audioRef.current.currentTime = 0
//       const playPromise = audioRef.current.play()
//       if (playPromise !== undefined) {
//         playPromise.catch((error) => {
//           console.error("Audio play failed:", error)
//         })
//       }
//     } catch (e) {
//       console.error("Error playing sound:", e)
//     }
//   }, [soundEnabled])

//   const filteredConversations = useMemo(() => {
//     let filtered = [...chatState.conversations]

//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter((conv) => {
//         const hasMatchingMessage = conv.messages.some((msg) => msg.content.toLowerCase().includes(query))
//         const matchesId = conv.id.toLowerCase().includes(query)
//         return hasMatchingMessage || matchesId
//       })
//     }

//     if (activeFilter === "unread") {
//       filtered = filtered.filter((conv) => conv.unreadCount > 0)
//     } else if (activeFilter === "recent") {
//       filtered = filtered.slice(0, 5)
//     }

//     filtered.sort((a, b) => {
//       if (pinnedConversations.has(a.id) && !pinnedConversations.has(b.id)) return -1
//       if (!pinnedConversations.has(a.id) && pinnedConversations.has(b.id)) return 1
//       return b.updatedAt.getTime() - a.updatedAt.getTime()
//     })

//     return filtered
//   }, [chatState.conversations, searchQuery, activeFilter, pinnedConversations])

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !chatState.selectedConversation || isOffline) return

//     if (!token || !pageId) {
//       setError("Missing authentication token or page ID")
//       return
//     }

//     setIsTyping(true)
//     setError(null)

//     try {
//       console.log("🚀 Sending message with new sendDM function:", {
//         pageId,
//         receiverId: chatState.selectedConversation.userId,
//         message: newMessage.substring(0, 50) + "...",
//         hasToken: !!token,
//       })

//       // Use the new sendDM function directly
//       const result = await sendDMz(
//         pageId, // userId (the page sending the message)
//         chatState.selectedConversation.userId || "123456", // receiverId (the user receiving the message)
//         newMessage, // prompt (the message content)
//         token, // token
//         undefined, // buttons (not used in this context)
//       )

//       console.log("📥 sendDM response:", {
//         status: result.status,
//         statusText: result.statusText,
//         success: result.status === 200,
//       })

//       if (result.status === 200) {
//         // Create user message for the UI
//         const userMessage: Message = {
//           id: Date.now().toString(),
//           role: "user",
//           content: newMessage,
//           senderId: chatState.selectedConversation.userId,
//           receiverId: pageId,
//           createdAt: new Date(),
//           status: "sent",
//           read: true,
//         }

//         await chatActions.addMessage(chatState.selectedConversation.id, userMessage)
//         setNewMessage("")

//         // Scroll to bottom
//         setTimeout(() => {
//           if (scrollRef.current) {
//             scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//           }
//         }, 100)

//         console.log("✅ Message sent successfully and added to UI")
//       } else {
//         throw new Error(`Instagram API returned status ${result.status}: ${result.statusText}`)
//       }
//     } catch (error) {
//       console.error("❌ Error sending message:", error)

//       if (typeof navigator !== "undefined" && !navigator.onLine) {
//         setError("You are offline. Messages can't be sent until you reconnect.")
//       } else if (error instanceof Error) {
//         // Handle specific error types
//         if (error.message.includes("401") || error.message.includes("unauthorized")) {
//           setError("Instagram authentication failed. Please reconnect your Instagram account.")
//         } else if (error.message.includes("400") || error.message.includes("bad request")) {
//           setError("Invalid message format. Please try again.")
//         } else if (error.message.includes("429") || error.message.includes("rate limit")) {
//           setError("Too many messages sent. Please wait a moment before trying again.")
//         } else {
//           setError(`Failed to send message: ${error.message}`)
//         }
//       } else {
//         setError("Failed to send message. Please try again.")
//       }
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   const handleSelectConversation = (conversation: Conversation) => {
//     chatActions.markConversationAsRead(conversation.id)
//     chatActions.setSelectedConversation(conversation)
//     setHasNewMessages(false)
//   }

//   const togglePinConversation = (conversationId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setPinnedConversations((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(conversationId)) {
//         newSet.delete(conversationId)
//       } else {
//         newSet.add(conversationId)
//       }
//       return newSet
//     })
//   }

//   const toggleStarConversation = (conversationId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setStarredConversations((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(conversationId)) {
//         newSet.delete(conversationId)
//       } else {
//         newSet.add(conversationId)
//       }
//       return newSet
//     })
//   }

//   const handleDeleteConversation = (conversation: Conversation) => {
//     setConversationToDelete(conversation)
//     setIsDeleteModalOpen(true)
//   }

//   const confirmDelete = async () => {
//     if (!conversationToDelete) return

//     try {
//       await chatActions.deleteConversation(conversationToDelete.id)
//       if (pinnedConversations.has(conversationToDelete.id)) {
//         setPinnedConversations((prev) => {
//           const newSet = new Set(prev)
//           newSet.delete(conversationToDelete.id)
//           return newSet
//         })
//       }
//       if (starredConversations.has(conversationToDelete.id)) {
//         setStarredConversations((prev) => {
//           const newSet = new Set(prev)
//           newSet.delete(conversationToDelete.id)
//           return newSet
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting conversation:", error)
//       setError(`Failed to delete conversation: ${error instanceof Error ? error.message : String(error)}`)
//     } finally {
//       setIsDeleteModalOpen(false)
//       setConversationToDelete(null)
//     }
//   }

//   return (
//     <>
//       <ShimmeringBorder>
//         <div
//           className={`flex flex-col ${fancyBackground} text-foreground rounded-lg overflow-hidden h-full max-h-[90vh] sm:max-h-[80vh]`}
//         >
//           {isLoading ? (
//             <FancyLoader />
//           ) : error ? (
//             <FancyErrorMessage message={error} />
//           ) : (
//             <>
//               {chatState.selectedConversation ? (
//                 <>
//                   <div className="p-2 sm:p-4 bg-background border-b border-primary/10 flex items-center">
//                     <Button
//                       variant="ghost"
//                       className="mr-4 p-2"
//                       onClick={() => chatActions.setSelectedConversation(null)}
//                     >
//                       <ArrowLeft size={20} />
//                     </Button>
//                     <Avatar className="w-10 h-10">
//                       <AvatarImage
//                         src={`https://api.dicebear.com/6.x/initials/svg?seed=${chatState.selectedConversation.id}`}
//                       />
//                       <AvatarFallback>CL</AvatarFallback>
//                     </Avatar>
//                     <div className="ml-3 flex-grow">
//                       <h4 className="font-medium text-lg">Client</h4>
//                       <p className="text-sm text-muted-foreground flex items-center">
//                         {isPusherConnected ? (
//                           <span className="flex items-center">
//                             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                             Connected
//                           </span>
//                         ) : (
//                           <span className="flex items-center">
//                             <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//                             {isOffline ? "Offline" : "Connecting..."}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>

//                   {isOffline && (
//                     <Alert variant="destructive" className="m-4 border-red-400">
//                       <AlertTitle className="text-red-500">You are offline</AlertTitle>
//                       <AlertDescription className="text-sm">
//                         Showing cached messages. New messages can&apos;t be sent.
//                       </AlertDescription>
//                     </Alert>
//                   )}

//                   <ScrollArea className="flex-grow h-[calc(100vh-300px)] overflow-hidden">
//                     <div className="p-4 space-y-4" ref={scrollRef}>
//                       {chatState.selectedConversation.messages.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-64 text-center">
//                           <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
//                           <h3 className="text-lg font-medium mb-2">No messages yet</h3>
//                           <p className="text-muted-foreground max-w-md">
//                             Start the conversation by sending a message below.
//                           </p>
//                         </div>
//                       ) : (
//                         chatState.selectedConversation.messages.map((message, index) => (
//                           <motion.div
//                             key={`${message.id}-${index}`}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className={`flex items-end mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
//                           >
//                             {message.role === "assistant" ? (
//                               <Avatar className="w-8 h-8 mr-2 border-2 border-primary">
//                                 <AvatarImage src={BOT_AVATAR || "/placeholder.svg"} />
//                                 <AvatarFallback>{BOT_NAME.slice(0, 2)}</AvatarFallback>
//                               </Avatar>
//                             ) : (
//                               <Avatar className="w-8 h-8 ml-2 order-last border-2 border-primary">
//                                 <AvatarImage src={`https://i.pravatar.cc/150?u=${message.senderId}`} />
//                                 <AvatarFallback>CL</AvatarFallback>
//                               </Avatar>
//                             )}
//                             <div
//                               className={cn(
//                                 "max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-3xl text-sm relative",
//                                 message.role === "assistant"
//                                   ? "bg-gradient-to-br from-blue-400/30 to-blue-600/30 border-2 border-blue-500/50 text-white"
//                                   : "bg-gradient-to-br from-purple-400/30 to-purple-600/30 border-2 border-purple-500/50 text-white",
//                               )}
//                               style={{
//                                 backdropFilter: "blur(10px)",
//                                 WebkitBackdropFilter: "blur(10px)",
//                               }}
//                             >
//                               <p className="break-words relative z-10">{message.content}</p>
//                               <div className="flex justify-between items-center mt-1 text-xs text-gray-300">
//                                 <span>
//                                   {new Date(message.createdAt).toLocaleTimeString([], {
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                   })}
//                                 </span>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))
//                       )}
//                     </div>
//                   </ScrollArea>

//                   <MessageInput
//                     message={newMessage}
//                     isOffline={isOffline}
//                     isRecording={isRecording}
//                     onMessageChange={setNewMessage}
//                     onSendMessage={handleSendMessage}
//                     onVoiceMessage={() => setIsRecording(!isRecording)}
//                     onFileUpload={(event) => {
//                       const file = event.target.files?.[0]
//                       if (file) {
//                         console.log("File selected:", file.name)
//                       }
//                     }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <ChatHeader
//                     totalUnreadMessages={chatState.totalUnreadMessages}
//                     hasNewMessages={hasNewMessages}
//                     soundEnabled={soundEnabled}
//                     searchQuery={searchQuery}
//                     isSearchFocused={isSearchFocused}
//                     onToggleSound={() => setSoundEnabled(!soundEnabled)}
//                     onMarkAllAsRead={chatActions.markAllAsRead}
//                     onShowHelp={() => {}}
//                     onSearchChange={setSearchQuery}
//                     onSearchFocus={() => setIsSearchFocused(true)}
//                     onSearchBlur={() => setIsSearchFocused(false)}
//                     onClearSearch={() => setSearchQuery("")}
//                   />

//                   {isOffline && (
//                     <Alert variant="destructive" className="mx-4 mb-4 border-red-400">
//                       <AlertTitle className="text-red-500">You are offline</AlertTitle>
//                       <AlertDescription className="text-sm">
//                         Showing cached conversations. Real-time updates are unavailable.
//                         <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500">
//                           Offline Mode
//                         </Badge>
//                       </AlertDescription>
//                     </Alert>
//                   )}

//                   <div className="px-4">
//                     <Tabs
//                       defaultValue="all"
//                       className="w-full"
//                       onValueChange={(value) => setActiveFilter(value as any)}
//                     >
//                       <TabsList className="grid grid-cols-3 mb-4">
//                         <TabsTrigger value="all" className="text-xs">
//                           All Chats
//                         </TabsTrigger>
//                         <TabsTrigger value="unread" className="text-xs">
//                           Unread
//                           {chatState.totalUnreadMessages > 0 && (
//                             <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
//                               {chatState.totalUnreadMessages}
//                             </Badge>
//                           )}
//                         </TabsTrigger>
//                         <TabsTrigger value="recent" className="text-xs">
//                           Recent
//                         </TabsTrigger>
//                       </TabsList>
//                     </Tabs>
//                   </div>

//                   <ScrollArea className="flex-grow">
//                     <div className="flex flex-col p-4 space-y-4">
//                       {!token ? (
//                         <div className="w-full p-4 bg-background rounded-lg shadow-md">
//                           <ExampleConversations onSelectConversation={handleSelectConversation} className="mb-4" />
//                           <div className="text-center">
//                             <p className="text-muted-foreground mb-4 text-sm sm:text-base">
//                               Connect your Instagram account to start receiving real messages.
//                             </p>
//                             <Button
//                               onClick={() => console.log("Navigate to integration page")}
//                               className="bg-[#3352CC] hover:bg-[#3352CC]/90 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 w-full"
//                               disabled={isOffline}
//                             >
//                               Connect Instagram
//                             </Button>
//                           </div>
//                         </div>
//                       ) : filteredConversations.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-64 text-center">
//                           <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
//                           <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
//                           <p className="text-muted-foreground max-w-md">
//                             {isOffline
//                               ? "You're currently offline. Saved conversations will appear here."
//                               : "Connect your account to start receiving messages."}
//                           </p>
//                           <ExampleConversations onSelectConversation={handleSelectConversation} className="mt-6" />
//                         </div>
//                       ) : (
//                         <ConversationList
//                           conversations={filteredConversations}
//                           pinnedConversations={pinnedConversations}
//                           starredConversations={starredConversations}
//                           onSelectConversation={handleSelectConversation}
//                           onTogglePin={togglePinConversation}
//                           onToggleStar={toggleStarConversation}
//                           onDeleteConversation={handleDeleteConversation}
//                         />
//                       )}
//                     </div>
//                   </ScrollArea>
//                 </>
//               )}
//             </>
//           )}

//           <DeleteConfirmationModal
//             isOpen={isDeleteModalOpen}
//             onClose={() => setIsDeleteModalOpen(false)}
//             onConfirm={confirmDelete}
//           />
//         </div>
//       </ShimmeringBorder>
//     </>
//   )
// }

// export default AutomationChats

"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "react-spring"
import { 
  ArrowLeft, MessageSquare, Loader2, Zap, Brain, TrendingUp, 
  Heart, AlertCircle, Star, Pin, Trash2, Volume2, VolumeX,
  Search, MoreHorizontal, BarChart3, MessageCircle, Users,
  Clock, Target, Sparkles, Eye, ThumbsUp, ThumbsDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import type { Conversation, Message } from "@/types/dashboard"

// Mock functions - replace with your actual implementations
const fetchChatsAndBusinessVariables = async (automationId: string) => ({ conversations: [], token: "", businessVariables: {} })
const sendDMz = async (pageId: string, receiverId: string, message: string, token: string, buttons?: any) => ({ status: 200, statusText: "OK" })

interface AutomationChatsProps {
  automationId: string
  userId?: string
}

interface BusinessVariables {
  [key: string]: string
  business_name: string
  welcome_message: string
  business_industry: string
}

interface ConversationAnalysis {
  sentiment: {
    positive: number
    neutral: number
    negative: number
    overall: 'positive' | 'neutral' | 'negative'
  }
  engagement: {
    responseRate: number
    averageResponseTime: string
    messageLength: number
    conversationFlow: 'smooth' | 'choppy' | 'excellent'
  }
  insights: {
    customerSatisfaction: number
    conversionPotential: number
    urgencyLevel: 'low' | 'medium' | 'high'
    topKeywords: string[]
    suggestedActions: string[]
  }
  summary: string
  aiRecommendations: string[]
}

const BOT_NAME = "AiAssist"
const BOT_AVATAR = "/fancy-profile-pic.svg"
const EXCLUDED_CHAT_ID = "17841471075473962"

// Enhanced gradient with dark theme consistency
const gradientBorder = "bg-gradient-to-r from-primary via-chart-1 to-chart-2 p-[2px] rounded-lg"
const darkBackground = "bg-gradient-to-br from-background via-card to-muted/20"
const glassEffect = "backdrop-blur-md bg-card/30 border border-border/50"

const ShimmeringBorder = ({ children }: { children: React.ReactNode }) => {
  const styles = useSpring({
    from: { backgroundPosition: "0% 50%" },
    to: { backgroundPosition: "100% 50%" },
    config: { duration: 5000 },
    loop: true,
  })

  return (
    <animated.div
      style={{
        ...styles,
        backgroundSize: "200% 200%",
      }}
      className={`${gradientBorder} p-[2px] rounded-lg`}
    >
      {children}
    </animated.div>
  )
}

const AIInsightCard: React.FC<{ 
  analysis: ConversationAnalysis, 
  onClose: () => void,
  isLoading: boolean 
}> = ({ analysis, onClose, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${glassEffect} p-6 rounded-xl mb-4`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-chart-1 animate-pulse" />
            <h3 className="text-lg font-semibold">AI Analysis in Progress...</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-chart-1" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${glassEffect} p-6 rounded-xl mb-4 border-l-4 border-chart-1`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-chart-1/20">
            <Brain className="w-5 h-5 text-chart-1" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Conversation Analysis</h3>
            <p className="text-sm text-muted-foreground">Powered by DeepSeek AI</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-destructive/10">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sentiment Analysis */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-chart-2" />
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Positive</span>
                <span className="text-sm font-medium text-green-400">{analysis.sentiment.positive}%</span>
              </div>
              <Progress value={analysis.sentiment.positive} className="h-2 bg-muted" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Neutral</span>
                <span className="text-sm font-medium text-yellow-400">{analysis.sentiment.neutral}%</span>
              </div>
              <Progress value={analysis.sentiment.neutral} className="h-2 bg-muted" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Negative</span>
                <span className="text-sm font-medium text-red-400">{analysis.sentiment.negative}%</span>
              </div>
              <Progress value={analysis.sentiment.negative} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-chart-3" />
              Engagement Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/30">
                  {analysis.engagement.responseRate}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Response</span>
                <span className="text-sm font-medium">{analysis.engagement.averageResponseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Flow Quality</span>
                <Badge variant={analysis.engagement.conversationFlow === 'excellent' ? 'default' : 'secondary'}>
                  {analysis.engagement.conversationFlow}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="bg-card/50 border-border/50 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-chart-4" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">{analysis.insights.customerSatisfaction}%</div>
              <div className="text-xs text-muted-foreground">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-5">{analysis.insights.conversionPotential}%</div>
              <div className="text-xs text-muted-foreground">Conversion</div>
            </div>
            <div className="text-center">
              <Badge variant={
                analysis.insights.urgencyLevel === 'high' ? 'destructive' : 
                analysis.insights.urgencyLevel === 'medium' ? 'default' : 'secondary'
              }>
                {analysis.insights.urgencyLevel} priority
              </Badge>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Top Keywords</h4>
            <div className="flex flex-wrap gap-1">
              {analysis.insights.topKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/10">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary & Recommendations */}
      <Card className="bg-gradient-to-br from-chart-1/5 to-chart-2/5 border-chart-1/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-chart-1" />
            AI Summary & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 text-foreground/90">{analysis.summary}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recommended Actions:</h4>
            {analysis.aiRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2 flex-shrink-0"></div>
                <span className="text-foreground/80">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const EnhancedChatHeader: React.FC<{
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
}> = ({ 
  totalUnreadMessages, hasNewMessages, soundEnabled, searchQuery, isSearchFocused,
  onToggleSound, onMarkAllAsRead, onShowHelp, onSearchChange, onSearchFocus, onSearchBlur, onClearSearch 
}) => {
  return (
    <div className={`${glassEffect} p-4 border-b border-border/50`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-chart-1 to-chart-2">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              Instagram DMs
            </h2>
            <p className="text-sm text-muted-foreground">AI-powered conversation management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {totalUnreadMessages > 0 && (
            <Badge className="bg-destructive/20 text-destructive border-destructive/30 animate-pulse">
              {totalUnreadMessages} unread
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleSound}>
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          className={`pl-10 bg-background/50 border-border/50 focus:border-chart-1 transition-colors ${
            isSearchFocused ? 'ring-2 ring-chart-1/20' : ''
          }`}
        />
      </div>
    </div>
  )
}

const ConversationCard: React.FC<{
  conversation: Conversation
  isPinned: boolean
  isStarred: boolean
  onSelect: () => void
  onTogglePin: (e: React.MouseEvent) => void
  onToggleStar: (e: React.MouseEvent) => void
  onDelete: () => void
}> = ({ conversation, isPinned, isStarred, onSelect, onTogglePin, onToggleStar, onDelete }) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1]
  const isUnread = conversation.unreadCount > 0
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${glassEffect} p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isUnread ? 'ring-2 ring-chart-1/30 bg-chart-1/5' : ''
      } ${isPinned ? 'border-l-4 border-chart-2' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10 ring-2 ring-border">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.id}`} />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
          {isUnread && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-chart-1 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium truncate">Client #{conversation.id.slice(-4)}</h4>
            <div className="flex items-center gap-1">
              {isPinned && <Pin className="w-3 h-3 text-chart-2" />}
              {isStarred && <Star className="w-3 h-3 text-chart-4 fill-current" />}
              <span className="text-xs text-muted-foreground">
                {new Date(conversation.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {lastMessage && (
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage.role === 'assistant' ? '🤖 ' : '👤 '}
              {lastMessage.content}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs bg-background/50">
              {conversation.messages.length} messages
            </Badge>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onTogglePin}
                className="h-6 w-6 p-0 hover:bg-chart-2/20"
              >
                <Pin className={`w-3 h-3 ${isPinned ? 'text-chart-2' : 'text-muted-foreground'}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleStar}
                className="h-6 w-6 p-0 hover:bg-chart-4/20"
              >
                <Star className={`w-3 h-3 ${isStarred ? 'text-chart-4 fill-current' : 'text-muted-foreground'}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const AutomationChats: React.FC<AutomationChatsProps> = ({ automationId, userId = "" }) => {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [pageId, setPageId] = useState<string | null>(null)
  const [businessVariables, setBusinessVariables] = useState<BusinessVariables>({
    business_name: "",
    welcome_message: "",
    business_industry: "",
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "recent">("all")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(new Set())
  const [starredConversations, setStarredConversations] = useState<Set<string>>(new Set())
  const [hasNewMessages, setHasNewMessages] = useState(false)
  
  // AI Analysis states
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Mock AI Analysis function - replace with actual DeepSeek API call
  const analyzeConversationWithAI = async (conversation: Conversation): Promise<ConversationAnalysis> => {
    setAnalysisLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock analysis - replace with actual DeepSeek API integration
    const mockAnalysis: ConversationAnalysis = {
      sentiment: {
        positive: 65,
        neutral: 25,
        negative: 10,
        overall: 'positive'
      },
      engagement: {
        responseRate: 87,
        averageResponseTime: '2.3 min',
        messageLength: 45,
        conversationFlow: 'smooth'
      },
      insights: {
        customerSatisfaction: 78,
        conversionPotential: 82,
        urgencyLevel: 'medium',
        topKeywords: ['interested', 'pricing', 'features', 'demo', 'support'],
        suggestedActions: [
          'Follow up with pricing information',
          'Schedule a product demo',
          'Address specific feature questions'
        ]
      },
      summary: "This conversation shows strong engagement with positive sentiment. The customer is actively interested in your product and has asked specific questions about pricing and features. They appear ready for the next step in the sales process.",
      aiRecommendations: [
        "Send detailed pricing breakdown within 24 hours",
        "Offer a personalized demo session",
        "Highlight key features mentioned in conversation",
        "Set up automated follow-up for next week"
      ]
    }
    
    setAnalysisLoading(false)
    return mockAnalysis
  }

  const handleAnalyzeConversation = async () => {
    if (!selectedConversation) return
    
    setShowAnalysis(true)
    try {
      const analysis = await analyzeConversationWithAI(selectedConversation)
      setConversationAnalysis(analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Failed to analyze conversation')
    }
  }

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        userId: 'user1',
        pageId: 'page1',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'Hi, I\'m interested in your product. Can you tell me more about the pricing?',
            senderId: 'user1',
            createdAt: new Date(),
            read: false
          },
          {
            id: '2',
            role: 'assistant',
            content: 'Hello! I\'d be happy to help you with pricing information. We have several plans available. What specific features are you most interested in?',
            senderId: 'bot',
            createdAt: new Date(),
            read: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        unreadCount: 1,
        Automation: null
      },
      {
        id: '2',
        userId: 'user2',
        pageId: 'page1',
        messages: [
          {
            id: '3',
            role: 'user',
            content: 'Great product! When can I schedule a demo?',
            senderId: 'user2',
            createdAt: new Date(),
            read: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        unreadCount: 0,
        Automation: null
      }
    ]
    
    setTimeout(() => {
      setConversations(mockConversations)
      setIsLoading(false)
      setToken('mock-token')
    }, 1000)
  }, [])

  const totalUnreadMessages = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
  }, [conversations])

  const filteredConversations = useMemo(() => {
    let filtered = [...conversations]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((conv) => {
        const hasMatchingMessage = conv.messages.some((msg) => msg.content.toLowerCase().includes(query))
        const matchesId = conv.id.toLowerCase().includes(query)
        return hasMatchingMessage || matchesId
      })
    }

    if (activeFilter === "unread") {
      filtered = filtered.filter((conv) => conv.unreadCount > 0)
    } else if (activeFilter === "recent") {
      filtered = filtered.slice(0, 5)
    }

    filtered.sort((a, b) => {
      if (pinnedConversations.has(a.id) && !pinnedConversations.has(b.id)) return -1
      if (!pinnedConversations.has(a.id) && pinnedConversations.has(b.id)) return 1
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

    return filtered
  }, [conversations, searchQuery, activeFilter, pinnedConversations])

  if (isLoading) {
    return (
      <div className={`${darkBackground} rounded-lg h-full flex items-center justify-center`}>
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-gradient-to-r from-chart-1 to-chart-2"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    )
  }

  return (
    <ShimmeringBorder>
      <div className={`flex flex-col ${darkBackground} text-foreground rounded-lg overflow-hidden h-full max-h-[90vh]`}>
        {selectedConversation ? (
          <>
            {/* Enhanced Chat Header */}
            <div className={`${glassEffect} p-4 border-b border-border/50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="p-2 hover:bg-chart-1/20"
                    onClick={() => {
                      setSelectedConversation(null)
                      setShowAnalysis(false)
                      setConversationAnalysis(null)
                    }}
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <Avatar className="w-10 h-10 ring-2 ring-chart-1">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedConversation.id}`} />
                    <AvatarFallback>CL</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-lg">Client #{selectedConversation.id.slice(-4)}</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Online
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAnalyzeConversation}
                    className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/80 hover:to-chart-2/80 text-white"
                    disabled={analysisLoading}
                  >
                    {analysisLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    Analyze Conversation
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Analysis Panel */}
            {showAnalysis && (
              <div className="max-h-[50vh] overflow-y-auto">
                <AIInsightCard 
                  analysis={conversationAnalysis!}
                  onClose={() => {
                    setShowAnalysis(false)
                    setConversationAnalysis(null)
                  }}
                  isLoading={analysisLoading}
                />
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-grow">
              <div className="p-4 space-y-4" ref={scrollRef}>
                {selectedConversation.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Start the conversation by sending a message below.
                    </p>
                  </div>
                ) : (
                  selectedConversation.messages.map((message, index) => (
                    <motion.div
                      key={`${message.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-end mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      {message.role === "assistant" ? (
                        <Avatar className="w-8 h-8 mr-3 ring-2 ring-chart-1/50">
                          <AvatarImage src={BOT_AVATAR || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-br from-chart-1 to-chart-2 text-white text-xs">
                            {BOT_NAME.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="w-8 h-8 ml-3 order-last ring-2 ring-chart-3/50">
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderId}`} />
                          <AvatarFallback className="bg-gradient-to-br from-chart-3 to-chart-4 text-white text-xs">
                            CL
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="relative group">
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-sm relative transition-all duration-200 ${
                            message.role === "assistant"
                              ? "bg-gradient-to-br from-chart-1/20 to-chart-2/20 border border-chart-1/30 text-foreground mr-2"
                              : "bg-gradient-to-br from-chart-3/20 to-chart-4/20 border border-chart-3/30 text-foreground ml-2"
                          }`}
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                          }}
                        >
                          <p className="break-words leading-relaxed">{message.content}</p>
                          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                            <span>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.role === "user" && (
                              <div className="flex items-center gap-1">
                                {message.read ? (
                                  <Eye className="w-3 h-3 text-chart-3" />
                                ) : (
                                  <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Message Actions (appear on hover) */}
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 p-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-chart-1/20">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-destructive/20">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Enhanced Message Input */}
            <div className={`${glassEffect} p-4 border-t border-border/50`}>
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="min-h-[44px] bg-background/50 border-border/50 focus:border-chart-1 resize-none"
                    disabled={isTyping}
                  />
                  {isTyping && (
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending...
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/80 hover:to-chart-2/80 text-white h-11 px-6"
                >
                  Send
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mt-3 bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Enhanced Chat List Header */}
            <EnhancedChatHeader
              totalUnreadMessages={totalUnreadMessages}
              hasNewMessages={hasNewMessages}
              soundEnabled={soundEnabled}
              searchQuery={searchQuery}
              isSearchFocused={isSearchFocused}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              onMarkAllAsRead={() => {
                const updatedConversations = conversations.map(conv => ({
                  ...conv,
                  unreadCount: 0,
                  messages: conv.messages.map(msg => ({ ...msg, read: true }))
                }))
                setConversations(updatedConversations)
              }}
              onShowHelp={() => {}}
              onSearchChange={setSearchQuery}
              onSearchFocus={() => setIsSearchFocused(true)}
              onSearchBlur={() => setIsSearchFocused(false)}
              onClearSearch={() => setSearchQuery("")}
            />

            {/* Enhanced Analytics Dashboard */}
            <div className="px-4 mb-4">
              <Card className={`${glassEffect} border-border/50`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-chart-1" />
                    Quick Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-chart-1">{conversations.length}</div>
                      <div className="text-xs text-muted-foreground">Total Chats</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-chart-2">{totalUnreadMessages}</div>
                      <div className="text-xs text-muted-foreground">Unread</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-chart-3">87%</div>
                      <div className="text-xs text-muted-foreground">Response Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-chart-4">2.3m</div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 mb-4">
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveFilter(value as any)}>
                <TabsList className={`grid grid-cols-3 ${glassEffect} border-border/50`}>
                  <TabsTrigger value="all" className="text-xs data-[state=active]:bg-chart-1/20 data-[state=active]:text-chart-1">
                    All Chats
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs data-[state=active]:bg-chart-2/20 data-[state=active]:text-chart-2">
                    Unread
                    {totalUnreadMessages > 0 && (
                      <Badge className="ml-2 h-4 min-w-4 px-1 bg-chart-2/20 text-chart-2 border-chart-2/30">
                        {totalUnreadMessages}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs data-[state=active]:bg-chart-3/20 data-[state=active]:text-chart-3">
                    Recent
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-grow">
              <div className="px-4 pb-4 space-y-3">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      {token 
                        ? "Start engaging with your customers through Instagram DMs"
                        : "Connect your Instagram account to start receiving messages"
                      }
                    </p>
                    {!token && (
                      <Button className="mt-4 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/80 hover:to-chart-2/80 text-white">
                        Connect Instagram Account
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ConversationCard
                        conversation={conversation}
                        isPinned={pinnedConversations.has(conversation.id)}
                        isStarred={starredConversations.has(conversation.id)}
                        onSelect={() => setSelectedConversation(conversation)}
                        onTogglePin={(e) => {
                          e.stopPropagation()
                          setPinnedConversations(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(conversation.id)) {
                              newSet.delete(conversation.id)
                            } else {
                              newSet.add(conversation.id)
                            }
                            return newSet
                          })
                        }}
                        onToggleStar={(e) => {
                          e.stopPropagation()
                          setStarredConversations(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(conversation.id)) {
                              newSet.delete(conversation.id)
                            } else {
                              newSet.add(conversation.id)
                            }
                            return newSet
                          })
                        }}
                        onDelete={() => {
                          setConversations(prev => prev.filter(c => c.id !== conversation.id))
                        }}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </ShimmeringBorder>
  )

  // Helper function to handle message sending
  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedConversation) return

    setIsTyping(true)
    setError(null)

    try {
      // Mock sending - replace with actual API call
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: newMessage,
        senderId: selectedConversation.userId,
        createdAt: new Date(),
        read: true
      }

      // Update conversation
      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, userMessage],
        updatedAt: new Date()
      }

      setSelectedConversation(updatedConversation)
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id ? updatedConversation : conv
        )
      )

      setNewMessage("")

      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 100)

    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsTyping(false)
    }
  }
}

export default AutomationChats