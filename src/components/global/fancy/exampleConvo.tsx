
"use client"

import type React from "react"
import type { Conversation } from "@/types/dashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ExampleConversationsProps {
  onSelectConversation: (conversation: Conversation) => void
  className?: string
}

const ExampleConversations: React.FC<ExampleConversationsProps> = ({ onSelectConversation, className }) => {
  // Single, comprehensive example conversation
  const exampleConversation: Conversation = {
    id: "example-1",
    userId: "user123",
    pageId: "example-page",
    messages: [
      {
        id: "msg1",
        role: "user",
        content:
          "Hi there! I'm interested in automating my Instagram responses. Can you tell me how your service works?",
        senderId: "user123",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        read: true,
      },
      {
        id: "msg2",
        role: "assistant",
        content:
          "Hello! Thanks for your interest. Our service connects to your Instagram account and uses AI to automatically respond to messages and comments based on triggers you set up.",
        senderId: "assistant",
        createdAt: new Date(Date.now() - 86300000),
        read: true,
      },
      {
        id: "msg3",
        role: "user",
        content: "That sounds great! Do you have a free plan I can try before committing?",
        senderId: "user123",
        createdAt: new Date(Date.now() - 86200000),
        read: true,
      },
      {
        id: "msg4",
        role: "assistant",
        content:
          "Yes, we offer a free plan that includes basic automation features. You can set up keyword triggers and use our AI to generate responses. The PRO plan at $89/month unlocks advanced features like Voiceflow integration and sentiment analysis.",
        senderId: "assistant",
        createdAt: new Date(Date.now() - 86100000),
        read: true,
      },
      {
        id: "msg5",
        role: "user",
        content: "Perfect! How do I get started?",
        senderId: "user123",
        createdAt: new Date(Date.now() - 86000000),
        read: true,
      },
      {
        id: "msg6",
        role: "assistant",
        content:
          "Just connect your Instagram account using the 'Connect Instagram' button below, and we'll guide you through setting up your first automation. You'll be up and running in minutes!",
        senderId: "assistant",
        createdAt: new Date(Date.now() - 85900000),
        read: true,
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 85900000),
    unreadCount: 0,
    Automation: null,
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <MessageSquare className="h-4 w-4 mr-2 text-primary" />
        Example Conversation
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => onSelectConversation(exampleConversation)}
        className="flex items-start p-4 space-x-3 rounded-lg border border-primary/20 bg-secondary/20 hover:bg-secondary/30 cursor-pointer transition-colors"
      >
        <Avatar className="w-12 h-12 border-2 border-primary">
          <AvatarImage src={`https://api.dicebear.com/6.x/micah/svg?seed=${exampleConversation.id}`} />
          <AvatarFallback>EX</AvatarFallback>
        </Avatar>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <p className="font-medium text-sm text-foreground">New Customer</p>
              <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary">
                Example
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(exampleConversation.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-2">This is an example of a typical customer conversation</p>

          <div className="bg-background/50 rounded-lg p-2 text-xs">
            <p className="line-clamp-2 text-foreground/80">
              <span className="font-medium">Latest: </span>
              {exampleConversation.messages[exampleConversation.messages.length - 1].content}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ExampleConversations

