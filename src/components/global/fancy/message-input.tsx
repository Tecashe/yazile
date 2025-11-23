// "use client"

// import type React from "react"
// import { useRef, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Send, Smile, Paperclip, Mic } from "lucide-react"
// import { cn } from "@/lib/utils"
// import data from "@emoji-mart/data"
// import Picker from "@emoji-mart/react"

// interface MessageInputProps {
//   message: string
//   isOffline: boolean
//   isRecording: boolean
//   onMessageChange: (message: string) => void
//   onSendMessage: () => void
//   onVoiceMessage: () => void
//   onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
// }

// export const MessageInput: React.FC<MessageInputProps> = ({
//   message,
//   isOffline,
//   isRecording,
//   onMessageChange,
//   onSendMessage,
//   onVoiceMessage,
//   onFileUpload,
// }) => {
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false)
//   const messageInputRef = useRef<HTMLTextAreaElement>(null)

//   const handleEmojiSelect = (emoji: any) => {
//     onMessageChange(message + emoji.native)
//     setShowEmojiPicker(false)
//     messageInputRef.current?.focus()
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey && !isOffline) {
//       e.preventDefault()
//       onSendMessage()
//     }
//   }

//   const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
//     const target = e.target as HTMLTextAreaElement
//     target.style.height = "36px"
//     target.style.height = `${Math.min(target.scrollHeight, 96)}px`
//   }

//   return (
//     <div className="p-2 sm:p-4 bg-background border-t border-primary/10">
//       {/* Quick replies */}
//       <div className="flex space-x-2 mb-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
//         {["Hello!", "Thank you!", "How can I help?", "I'll get back to you soon.", "You're welcome"].map(
//           (response, index) => (
//             <button
//               key={index}
//               className={cn(
//                 "bg-primary/20 text-primary px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-primary/30 transition-colors",
//                 isOffline && "opacity-50 cursor-not-allowed",
//               )}
//               onClick={() => !isOffline && onMessageChange(response)}
//               disabled={isOffline}
//             >
//               {response}
//             </button>
//           ),
//         )}
//       </div>

//       <div className="flex items-center space-x-2 relative">
//         <Popover open={showEmojiPicker && !isOffline} onOpenChange={(open) => !isOffline && setShowEmojiPicker(open)}>
//           <PopoverTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className={cn("h-6 w-6 rounded-full flex-shrink-0", isOffline && "opacity-50 cursor-not-allowed")}
//               disabled={isOffline}
//             >
//               <Smile className="h-5 w-5" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0">
//             <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
//           </PopoverContent>
//         </Popover>

//         <div className="flex-grow relative">
//           <Textarea
//             ref={messageInputRef}
//             placeholder={isOffline ? "Can't send messages while offline..." : "Type here..."}
//             value={message}
//             onChange={(e) => onMessageChange(e.target.value)}
//             onKeyPress={handleKeyPress}
//             onInput={handleInput}
//             className={cn(
//               "flex-grow text-sm bg-muted border-primary/20 text-foreground placeholder-muted-foreground min-h-[36px] max-h-[96px] py-2 px-2 rounded-lg resize-none overflow-hidden w-full",
//               isOffline && "opacity-75",
//             )}
//             style={{ height: "36px", transition: "height 0.1s ease" }}
//             disabled={isOffline}
//           />
//         </div>

//         <div className="flex space-x-1">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   onClick={!isOffline ? onSendMessage : undefined}
//                   className={cn(
//                     "bg-primary hover:bg-primary/90 text-primary-foreground h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center",
//                     isOffline && "opacity-50 cursor-not-allowed",
//                   )}
//                   disabled={isOffline}
//                 >
//                   <Send className="h-5 w-5" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{isOffline ? "Can't send while offline" : "Send Message"}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className={cn(
//                     "h-6 w-6 rounded-full",
//                     isRecording ? "text-red" : "",
//                     isOffline && "opacity-50 cursor-not-allowed",
//                   )}
//                   onClick={!isOffline ? onVoiceMessage : undefined}
//                   disabled={isOffline}
//                 >
//                   <Mic className="h-5 w-5" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{isOffline ? "Voice unavailable offline" : "Record voice message"}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <label htmlFor="file-upload" className={isOffline ? "cursor-not-allowed" : "cursor-pointer"}>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={cn("h-6 w-6 rounded-full", isOffline && "opacity-50 cursor-not-allowed")}
//                     disabled={isOffline}
//                   >
//                     <Paperclip className="h-5 w-5" />
//                   </Button>
//                 </label>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{isOffline ? "Attachments unavailable offline" : "Attach file"}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>

//         <input type="file" id="file-upload" onChange={onFileUpload} style={{ display: "none" }} disabled={isOffline} />
//       </div>
//     </div>
//   )
// }



"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Send, Smile, Paperclip, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

interface MessageInputProps {
  message: string
  isOffline: boolean
  isRecording: boolean
  onMessageChange: (message: string) => void
  onSendMessage: () => void
  onVoiceMessage: () => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  isOffline,
  isRecording,
  onMessageChange,
  onSendMessage,
  onVoiceMessage,
  onFileUpload,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const handleEmojiSelect = (emoji: any) => {
    onMessageChange(message + emoji.native)
    setShowEmojiPicker(false)
    messageInputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isOffline) {
      e.preventDefault()
      onSendMessage()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    target.style.height = "36px"
    target.style.height = `${Math.min(target.scrollHeight, 96)}px`
  }

  const quickReplies = ["Hello!", "Thank you!", "How can I help?", "I'll get back to you soon.", "You're welcome"]

  return (
    <div className="p-2 sm:p-4 bg-background border-t border-primary/10">
      <div className="flex space-x-2 mb-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        {quickReplies.map((response, index) => (
          <button
            key={index}
            className={cn(
              "bg-primary/20 text-primary px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-primary/30 transition-colors",
              isOffline && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => !isOffline && onMessageChange(response)}
            disabled={isOffline}
          >
            {response}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2 relative">
        <Popover open={showEmojiPicker && !isOffline} onOpenChange={(open) => !isOffline && setShowEmojiPicker(open)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-6 w-6 rounded-full flex-shrink-0", isOffline && "opacity-50 cursor-not-allowed")}
              disabled={isOffline}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
          </PopoverContent>
        </Popover>

        <div className="flex-grow relative">
          <Textarea
            ref={messageInputRef}
            placeholder={isOffline ? "Can't send messages while offline..." : "Type here..."}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onInput={handleInput}
            className={cn(
              "flex-grow text-sm bg-muted border-primary/20 text-foreground placeholder-muted-foreground min-h-[36px] max-h-[96px] py-2 px-2 rounded-lg resize-none overflow-hidden w-full",
              isOffline && "opacity-75",
            )}
            style={{ height: "36px", transition: "height 0.1s ease" }}
            disabled={isOffline}
          />
        </div>

        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={!isOffline ? onSendMessage : undefined}
                  className={cn(
                    "bg-primary hover:bg-primary/90 text-primary-foreground h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center",
                    isOffline && "opacity-50 cursor-not-allowed",
                  )}
                  disabled={isOffline}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOffline ? "Can't send while offline" : "Send Message"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 rounded-full",
                    isRecording ? "text-red" : "",
                    isOffline && "opacity-50 cursor-not-allowed",
                  )}
                  onClick={!isOffline ? onVoiceMessage : undefined}
                  disabled={isOffline}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOffline ? "Voice unavailable offline" : "Record voice message"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label htmlFor="file-upload" className={isOffline ? "cursor-not-allowed" : "cursor-pointer"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-6 w-6 rounded-full", isOffline && "opacity-50 cursor-not-allowed")}
                    disabled={isOffline}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOffline ? "Attachments unavailable offline" : "Attach file"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <input type="file" id="file-upload" onChange={onFileUpload} style={{ display: "none" }} disabled={isOffline} />
      </div>
    </div>
  )
}
