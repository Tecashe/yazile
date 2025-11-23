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
//                       <AlertTitle className="text-red">You are offline</AlertTitle>
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
//                       <AlertTitle className="text-red">You are offline</AlertTitle>
//                       <AlertDescription className="text-sm">
//                         Showing cached conversations. Real-time updates are unavailable.
//                         <Badge variant="outline" className="ml-2 bg-red-500/10 text-red border-red-500">
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
import { ArrowLeft, MessageSquare, Loader2, Zap, Brain, TrendingUp, Users, Clock, BarChart3, MessageCircle, Star, AlertTriangle, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { Conversation, Message } from "@/types/dashboard"
import { fetchChatsAndBusinessVariables } from "@/actions/messageAction/messageAction"
import { sendDMs } from "@/lib/fetch"
import { cn } from "@/lib/utils"
import FancyLoader from "./fancy-loader"
import ExampleConversations from "./exampleConvo"
import DeleteConfirmationModal from "./confirmDelete"
import { usePusher } from "@/hooks/use-pusher"
import { useChatState } from "@/hooks/use-chat-state"
import { useOfflineStorage } from "@/hooks/use-offline-storage"
import { useDatabaseSync } from "@/hooks/use-database-sync"
import { ChatHeader } from "./chat-header"
import { ConversationList } from "./conversation-list"
import { MessageInput } from "./message-input"

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
  id: string
  overallSentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  customerSatisfaction: number
  responseTime: {
    average: number
    trend: 'improving' | 'declining' | 'stable'
  }
  keyTopics: string[]
  urgencyLevel: 'low' | 'medium' | 'high'
  customerIntent: string
  recommendedActions: string[]
  conversationHealth: number
  engagementLevel: 'low' | 'medium' | 'high'
  summary: string
  insights: string[]
  risks: string[]
  opportunities: string[]
}

const BOT_NAME = "AiAssist"
const BOT_AVATAR = "/fancy-profile-pic.svg"
const EXCLUDED_CHAT_ID = "17841471075473962"

const gradientBorder = "bg-gradient-to-r from-primary via-purple-500 to-secondary p-[2px] rounded-lg"
const fancyBackground = "bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1d1d1d]"

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

const FancyErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Zap className="w-16 h-16 text-yellow-400 mb-4" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">Hang tight!</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </motion.div>
    </div>
  )
}

const AnalysisModal = ({ 
  isOpen, 
  onClose, 
  analysis, 
  isLoading 
}: { 
  isOpen: boolean
  onClose: () => void
  analysis: ConversationAnalysis | null
  isLoading: boolean
}) => {
  if (!isOpen) return null

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-400/20'
      case 'negative': return 'text-red-400 bg-red-400/20'
      default: return 'text-yellow-400 bg-yellow-400/20'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-green-400 bg-green-400/20'
    }
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'text-green-400 bg-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-red-400 bg-red-400/20'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background border border-border rounded-lg max-w-4xl max-h-[90h] overflow-hidden w-full"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">AI Conversation Analysis</h2>
                <p className="text-muted-foreground">Insights and recommendations</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              ✕
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium mb-2">Analyzing conversation...</p>
                <p className="text-muted-foreground text-center">
                  DeepSeek AI is processing the conversation data to provide detailed insights
                </p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Health Score</span>
                      </div>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">{analysis.conversationHealth}%</div>
                        <Progress value={analysis.conversationHealth} className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Sentiment</span>
                      </div>
                      <div className="mt-2">
                        <Badge className={cn("text-xs", getSentimentColor(analysis.overallSentiment))}>
                          {analysis.overallSentiment.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          Score: {analysis.sentimentScore.toFixed(1)}/10
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Response Time</span>
                      </div>
                      <div className="mt-2">
                        <div className="text-lg font-semibold">{analysis.responseTime.average}m</div>
                        <Badge variant={analysis.responseTime.trend === 'improving' ? 'default' : 'secondary'} className="text-xs mt-1">
                          {analysis.responseTime.trend}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Satisfaction</span>
                      </div>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">{analysis.customerSatisfaction}%</div>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < Math.floor(analysis.customerSatisfaction / 20) ? "fill-current" : "")} />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="insights" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="topics">Topics</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights" className="space-y-4">
                    <Card className="bg-card/50 border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5" />
                          <span>Key Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysis.insights.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-card/50 border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Customer Intent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{analysis.customerIntent}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-card/50 border-border">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>Engagement Level</span>
                            <Badge className={cn("text-xs", getEngagementColor(analysis.engagementLevel))}>
                              {analysis.engagementLevel}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-2">
                            <span>Urgency:</span>
                            <Badge className={cn("text-xs", getUrgencyColor(analysis.urgencyLevel))}>
                              {analysis.urgencyLevel} Priority
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="topics" className="space-y-4">
                    <Card className="bg-card/50 border-border">
                      <CardHeader>
                        <CardTitle>Key Topics Discussed</CardTitle>
                        <CardDescription>Main themes and subjects in this conversation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keyTopics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                              #{topic}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    <Card className="bg-card/50 border-border">
                      <CardHeader>
                        <CardTitle>Recommended Actions</CardTitle>
                        <CardDescription>AI-suggested next steps to improve customer experience</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysis.recommendedActions.map((action, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-sm">{action}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risks" className="space-y-4">
                    <div className="grid gap-4">
                      <Card className="bg-card/50 border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Potential Risks</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {analysis.risks.map((risk, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{risk}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="bg-card/50 border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            <span>Opportunities</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {analysis.opportunities.map((opportunity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{opportunity}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="space-y-4">
                    <Card className="bg-card/50 border-border">
                      <CardHeader>
                        <CardTitle>Conversation Summary</CardTitle>
                        <CardDescription>AI-generated overview of the entire conversation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          {analysis.summary}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
                <p className="text-muted-foreground">
                  Unable to analyze the conversation. Please try again later.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  )
}



const AutomationChats: React.FC<AutomationChatsProps> = ({ automationId, userId = "" }) => {
  const [chatState, chatActions] = useChatState()
  const { cachedConversations, isOffline, saveConversations, loadReadStatus, saveReadStatus } = useOfflineStorage()
  const { pusher, isConnected: isPusherConnected, subscribe } = usePusher()
  const { loadConversations, saveUserPreferences, loadUserPreferences } = useDatabaseSync(automationId, userId)

  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)

  // Analysis states
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<ConversationAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/message-notification.mp3")
      audio.load()
      audioRef.current = audio

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [])

  // DeepSeek Analysis Function
  const analyzeConversation = async (conversation: Conversation) => {
    setIsAnalyzing(true)
    setIsAnalysisModalOpen(true)
    
    try {
      const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt.toISOString()
      }))

      const analysisPrompt = `
        Analyze this customer service conversation and provide detailed insights in JSON format.
        
        Conversation Messages:
        ${JSON.stringify(messages, null, 2)}
        
        Business Context:
        - Business Name: ${businessVariables.business_name || 'Unknown Business'}
        - Industry: ${businessVariables.business_industry || 'Unknown Industry'}
        
        Please analyze the conversation and return a JSON object with the following structure:
        {
          "overallSentiment": "positive|negative|neutral",
          "sentimentScore": number (0-10),
          "customerSatisfaction": number (0-100),
          "responseTime": {
            "average": number (minutes),
            "trend": "improving|declining|stable"
          },
          "keyTopics": ["topic1", "topic2", ...],
          "urgencyLevel": "low|medium|high",
          "customerIntent": "brief description of what customer wants",
          "recommendedActions": ["action1", "action2", ...],
          "conversationHealth": number (0-100),
          "engagementLevel": "low|medium|high",
          "summary": "comprehensive summary of the conversation",
          "insights": ["insight1", "insight2", ...],
          "risks": ["risk1", "risk2", ...],
          "opportunities": ["opportunity1", "opportunity2", ...]
        }
        
        Focus on actionable insights that can help improve customer experience and business outcomes.
      `

      const response = await fetch('/api/analyze-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: analysisPrompt,
          conversationId: conversation.id
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      setCurrentAnalysis({
        id: conversation.id,
        ...result.analysis
      })
      
    } catch (error) {
      console.error('Error analyzing conversation:', error)
      setCurrentAnalysis(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Load user preferences on mount
  useEffect(() => {
    const loadPrefs = async () => {
      if (!userId) return

      try {
        const prefs = await loadUserPreferences()
        if (prefs) {
          setSoundEnabled(prefs.soundEnabled)
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
      }
    }

    loadPrefs()
  }, [userId, loadUserPreferences])

  // Save preferences when they change
  useEffect(() => {
    if (!userId) return

    const savePrefs = async () => {
      try {
        await saveUserPreferences({
          soundEnabled,
          desktopNotifications: true,
          emailNotifications: false,
          autoMarkAsRead: false,
          theme: "system",
          language: "en",
        })
      } catch (error) {
        console.error("Error saving preferences:", error)
      }
    }

    savePrefs()
  }, [soundEnabled, userId, saveUserPreferences])

  // Load conversations from database
  const fetchChats = useCallback(async () => {
    if (isOffline || !automationId) return

    try {
      setError(null)
      setIsLoading(true)

      // Try to load from database first
      const dbConversations = await loadConversations()
      if (dbConversations.length > 0) {
        chatActions.setConversations(dbConversations)
        saveConversations(dbConversations)
        setIsLoading(false)
        return
      }

      // Fallback to existing API
      const result = await fetchChatsAndBusinessVariables(automationId)

      if (!result || typeof result !== "object") {
        throw new Error("Invalid response from server")
      }

      const { conversations, token, businessVariables } = result as {
        conversations: any[]
        token: string
        businessVariables: BusinessVariables
      }

      if (!Array.isArray(conversations)) {
        throw new Error("Conversations data is not in the expected format")
      }

      const transformedConversations = conversations
        .filter((conv) => conv.chatId !== EXCLUDED_CHAT_ID)
        .map(
          (conv): Conversation => ({
            id: conv.chatId,
            userId: conv.messages[0]?.senderId || conv.chatId,
            pageId: conv.pageId,
            messages: conv.messages.map(
              (msg: any): Message => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                senderId: msg.senderId,
                createdAt: new Date(msg.createdAt),
                read: chatState.readConversations.has(conv.chatId) ? true : Boolean(msg.read),
              }),
            ),
            createdAt: new Date(conv.messages[0]?.createdAt ?? Date.now()),
            updatedAt: new Date(conv.messages[conv.messages.length - 1]?.createdAt ?? Date.now()),
            unreadCount: chatState.readConversations.has(conv.chatId)
              ? 0
              : conv.messages.filter((msg: any) => !msg.read).length,
            Automation: null,
          }),
        )

      transformedConversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      chatActions.setConversations(transformedConversations)
      saveConversations(transformedConversations)

      if (transformedConversations.length > 0 && !pageId) {
        setPageId(transformedConversations[0].pageId)
      }

      if (token) setToken(token)
      if (businessVariables) setBusinessVariables(businessVariables)
    } catch (error) {
      console.error("Error fetching chats:", error)
      if (cachedConversations.length > 0) {
        chatActions.setConversations(cachedConversations)
      } else {
        setError(`Error loading conversations: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    automationId,
    isOffline,
    loadConversations,
    chatActions,
    saveConversations,
    cachedConversations,
    chatState.readConversations,
    pageId,
  ])

  // Initial load
  useEffect(() => {
    fetchChats()
  }, [])

  // Set up Pusher subscriptions
  useEffect(() => {
    if (!pusher || !isPusherConnected || !automationId) return

    const channelName = `automation-${automationId}`
    const channel = subscribe(channelName)

    if (channel) {
      const handleNewMessage = (data: { conversationId: string; message: Message }) => {
        console.log("New message received via Pusher:", data)
        chatActions.addMessage(data.conversationId, data.message)

        if (soundEnabled && chatState.selectedConversation?.id !== data.conversationId) {
          playNotificationSound()
        }

        setHasNewMessages(true)
      }

      const handleMessageRead = (data: { conversationId: string; messageIds: string[] }) => {
        console.log("Message read status updated via Pusher:", data)
        const conversation = chatState.conversations.find((c) => c.id === data.conversationId)
        if (conversation) {
          const updatedMessages = conversation.messages.map((msg) =>
            data.messageIds.includes(msg.id) ? { ...msg, read: true } : msg,
          )
          chatActions.updateConversation(data.conversationId, { messages: updatedMessages })
        }
      }

      channel.bind("new-message", handleNewMessage)
      channel.bind("message-read", handleMessageRead)

      return () => {
        channel.unbind("new-message", handleNewMessage)
        channel.unbind("message-read", handleMessageRead)
      }
    }
  }, [
    pusher,
    isPusherConnected,
    automationId,
    soundEnabled,
    chatState.selectedConversation?.id,
    chatActions,
    chatState.conversations,
  ])

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || !audioRef.current) return

    try {
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio play failed:", error)
        })
      }
    } catch (e) {
      console.error("Error playing sound:", e)
    }
  }, [soundEnabled])

  const filteredConversations = useMemo(() => {
    let filtered = [...chatState.conversations]

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
  }, [chatState.conversations, searchQuery, activeFilter, pinnedConversations])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatState.selectedConversation || isOffline) return

    if (!token || !pageId) {
      setError("Missing authentication token or page ID")
      return
    }

    setIsTyping(true)
    setError(null)

    try {
      console.log("🚀 Sending message with new sendDM function:", {
        pageId,
        receiverId: chatState.selectedConversation.userId,
        message: newMessage.substring(0, 50) + "...",
        hasToken: !!token,
      })

      const result = await sendDMs(
        pageId,
        chatState.selectedConversation.userId || "123456",
        newMessage,
        token,
        undefined,
      )

      console.log("🔥 sendDM response:", {
        status: result.status,
        statusText: result.statusText,
        success: result.status === 200,
      })

      if (result.status === 200) {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: newMessage,
          senderId: chatState.selectedConversation.userId,
          receiverId: pageId,
          createdAt: new Date(),
          status: "sent",
          read: true,
        }

        await chatActions.addMessage(chatState.selectedConversation.id, userMessage)
        setNewMessage("")

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }, 100)

        console.log("✅ Message sent successfully and added to UI")
      } else {
        throw new Error(`Instagram API returned status ${result.status}: ${result.statusText}`)
      }
    } catch (error) {
      console.error("❌ Error sending message:", error)

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setError("You are offline. Messages can't be sent until you reconnect.")
      } else if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          setError("Instagram authentication failed. Please reconnect your Instagram account.")
        } else if (error.message.includes("400") || error.message.includes("bad request")) {
          setError("Invalid message format. Please try again.")
        } else if (error.message.includes("429") || error.message.includes("rate limit")) {
          setError("Too many messages sent. Please wait a moment before trying again.")
        } else {
          setError(`Failed to send message: ${error.message}`)
        }
      } else {
        setError("Failed to send message. Please try again.")
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    chatActions.markConversationAsRead(conversation.id)
    chatActions.setSelectedConversation(conversation)
    setHasNewMessages(false)
  }

  const togglePinConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPinnedConversations((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId)
      } else {
        newSet.add(conversationId)
      }
      return newSet
    })
  }

  const toggleStarConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStarredConversations((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId)
      } else {
        newSet.add(conversationId)
      }
      return newSet
    })
  }

  const handleDeleteConversation = (conversation: Conversation) => {
    setConversationToDelete(conversation)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!conversationToDelete) return

    try {
      await chatActions.deleteConversation(conversationToDelete.id)
      if (pinnedConversations.has(conversationToDelete.id)) {
        setPinnedConversations((prev) => {
          const newSet = new Set(prev)
          newSet.delete(conversationToDelete.id)
          return newSet
        })
      }
      if (starredConversations.has(conversationToDelete.id)) {
        setStarredConversations((prev) => {
          const newSet = new Set(prev)
          newSet.delete(conversationToDelete.id)
          return newSet
        })
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
      setError(`Failed to delete conversation: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsDeleteModalOpen(false)
      setConversationToDelete(null)
    }
  }

  return (
    <>
      <ShimmeringBorder>
        <div
          className={`flex flex-col ${fancyBackground} text-foreground rounded-lg overflow-hidden h-full max-h-[90vh] sm:max-h-[80vh]`}
        >
          {isLoading ? (
            <FancyLoader />
          ) : error ? (
            <FancyErrorMessage message={error} />
          ) : (
            <>
              {chatState.selectedConversation ? (
                <>
                  <div className="p-2 sm:p-4 bg-background border-b border-primary/10 flex items-center">
                    <Button
                      variant="ghost"
                      className="mr-4 p-2"
                      onClick={() => chatActions.setSelectedConversation(null)}
                    >
                      <ArrowLeft size={20} />
                    </Button>
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${chatState.selectedConversation.id}`}
                      />
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-grow">
                      <h4 className="font-medium text-lg">Client</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        {isPusherConnected ? (
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Connected
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {isOffline ? "Offline" : "Connecting..."}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {/* AI Analysis Button */}
                    <Button
                      onClick={() => analyzeConversation(chatState.selectedConversation!)}
                      disabled={isAnalyzing || chatState.selectedConversation.messages.length === 0}
                      className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Conversation"
                      )}
                    </Button>
                  </div>

                  {isOffline && (
                    <Alert variant="destructive" className="m-4 border-red-400">
                      <AlertTitle className="text-red">You are offline</AlertTitle>
                      <AlertDescription className="text-sm">
                        Showing cached messages. New messages can&apos;t be sent.
                      </AlertDescription>
                    </Alert>
                  )}

                  <ScrollArea className="flex-grow h-[calc(100vh-300px)] overflow-hidden">
                    <div className="p-4 space-y-4" ref={scrollRef}>
                      {chatState.selectedConversation.messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                          <p className="text-muted-foreground max-w-md">
                            Start the conversation by sending a message below.
                          </p>
                        </div>
                      ) : (
                        chatState.selectedConversation.messages.map((message, index) => (
                          <motion.div
                            key={`${message.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-end mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                          >
                            {message.role === "assistant" ? (
                              <Avatar className="w-8 h-8 mr-2 border-2 border-primary">
                                <AvatarImage src={BOT_AVATAR || "/placeholder.svg"} />
                                <AvatarFallback>{BOT_NAME.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="w-8 h-8 ml-2 order-last border-2 border-primary">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${message.senderId}`} />
                                <AvatarFallback>CL</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-3xl text-sm relative",
                                message.role === "assistant"
                                  ? "bg-gradient-to-br from-blue-400/30 to-blue-600/30 border-2 border-blue-500/50 text-white"
                                  : "bg-gradient-to-br from-purple-400/30 to-purple-600/30 border-2 border-purple-500/50 text-white",
                              )}
                              style={{
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                              }}
                            >
                              <p className="break-words relative z-10">{message.content}</p>
                              <div className="flex justify-between items-center mt-1 text-xs text-gray-300">
                                <span>
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  <MessageInput
                    message={newMessage}
                    isOffline={isOffline}
                    isRecording={isRecording}
                    onMessageChange={setNewMessage}
                    onSendMessage={handleSendMessage}
                    onVoiceMessage={() => setIsRecording(!isRecording)}
                    onFileUpload={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        console.log("File selected:", file.name)
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <ChatHeader
                    totalUnreadMessages={chatState.totalUnreadMessages}
                    hasNewMessages={hasNewMessages}
                    soundEnabled={soundEnabled}
                    searchQuery={searchQuery}
                    isSearchFocused={isSearchFocused}
                    onToggleSound={() => setSoundEnabled(!soundEnabled)}
                    onMarkAllAsRead={chatActions.markAllAsRead}
                    onShowHelp={() => {}}
                    onSearchChange={setSearchQuery}
                    onSearchFocus={() => setIsSearchFocused(true)}
                    onSearchBlur={() => setIsSearchFocused(false)}
                    onClearSearch={() => setSearchQuery("")}
                  />

                  {isOffline && (
                    <Alert variant="destructive" className="mx-4 mb-4 border-red-400">
                      <AlertTitle className="text-red">You are offline</AlertTitle>
                      <AlertDescription className="text-sm">
                        Showing cached conversations. Real-time updates are unavailable.
                        <Badge variant="outline" className="ml-2 bg-red-500/10 text-red border-red-500">
                          Offline Mode
                        </Badge>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="px-4">
                    <Tabs
                      defaultValue="all"
                      className="w-full"
                      onValueChange={(value) => setActiveFilter(value as any)}
                    >
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="all" className="text-xs">
                          All Chats
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs">
                          Unread
                          {chatState.totalUnreadMessages > 0 && (
                            <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                              {chatState.totalUnreadMessages}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="recent" className="text-xs">
                          Recent
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <ScrollArea className="flex-grow">
                    <div className="flex flex-col p-4 space-y-4">
                      {!token ? (
                        <div className="w-full p-4 bg-background rounded-lg shadow-md">
                          <ExampleConversations onSelectConversation={handleSelectConversation} className="mb-4" />
                          <div className="text-center">
                            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                              Connect your Instagram account to start receiving real messages.
                            </p>
                            <Button
                              onClick={() => console.log("Navigate to integration page")}
                              className="bg-[#3352CC] hover:bg-[#3352CC]/90 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 w-full"
                              disabled={isOffline}
                            >
                              Connect Instagram
                            </Button>
                          </div>
                        </div>
                      ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                          <p className="text-muted-foreground max-w-md">
                            {isOffline
                              ? "You're currently offline. Saved conversations will appear here."
                              : "Connect your account to start receiving messages."}
                          </p>
                          <ExampleConversations onSelectConversation={handleSelectConversation} className="mt-6" />
                        </div>
                      ) : (
                        <ConversationList
                          conversations={filteredConversations}
                          pinnedConversations={pinnedConversations}
                          starredConversations={starredConversations}
                          onSelectConversation={handleSelectConversation}
                          onTogglePin={togglePinConversation}
                          onToggleStar={toggleStarConversation}
                          onDeleteConversation={handleDeleteConversation}
                        />
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </>
          )}

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />

          <AnalysisModal
            isOpen={isAnalysisModalOpen}
            onClose={() => {
              setIsAnalysisModalOpen(false)
              setCurrentAnalysis(null)
            }}
            analysis={currentAnalysis}
            isLoading={isAnalyzing}
          />
        </div>
      </ShimmeringBorder>
    </>
  )
}

export default AutomationChats