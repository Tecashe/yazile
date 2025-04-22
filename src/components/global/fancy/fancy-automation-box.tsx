
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
import { Sparkles, Zap, Trash2, Settings, MessageSquareText,MessageSquare, ChevronDown, ChevronUp,Clock } from "lucide-react"
import AutomationStats from "./automation-stats"
import AutomationChats from "./automationChats"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts"
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
}

interface FancyAutomationBoxProps {
  automation: Automation
  onDelete: () => void
  pathname: string
}

export const FancyAutomationBox: React.FC<FancyAutomationBoxProps> = ({ automation, onDelete, pathname }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChats, setShowChats] = useState(false)

  // Mock data for current sentiment
  const sentimentData = [
    { name: "Positive", value: 65, color: "#10B981" },
    { name: "Neutral", value: 25, color: "#6B7280" },
    { name: "Negative", value: 10, color: "#EF4444" },
  ]

  return (
    <Card className="bg-background border-2 border-border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-foreground">{automation.name}</h2>
          <div className="flex items-center space-x-2">
            {automation.active ? <ActiveIndicator /> : <InactiveIndicator />}
            {automation.listener?.listener === "SMARTAI" ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Sparkles size={14} className="mr-1" />
                Smart AI
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                <Zap size={14} className="mr-1" />
                FREE
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {automation.keywords.map((keyword, key) => (
            <Badge
              key={keyword.id}
              variant="outline"
              className={cn(
                "capitalize",
                key % 4 === 0 && "border-green-500/30 text-green-500",
                key % 4 === 1 && "border-purple-500/30 text-purple-500",
                key % 4 === 2 && "border-yellow-500/30 text-yellow-500",
                key % 4 === 3 && "border-red-500/30 text-red-500",
              )}
            >
              {keyword.word}
            </Badge>
          ))}
        </div>

        {automation.keywords.length === 0 && (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            No Keywords
          </Badge>
        )}

        <AutomationStats automation={automation} />

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              <Link href={`${pathname}/${automation.id}`} className="flex items-center">
                <Settings size={16} className="mr-2" />
                Configure
              </Link>
            </Button>
          </div>
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-2 border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary transition-all duration-300 pl-3 pr-8"
              onClick={() => setShowChats(!showChats)}
            >
              <MessageSquareText size={18} className="mr-2" />
              <span className="font-medium">Chats</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary/20 group-hover:bg-secondary/40 transition-all duration-300 flex items-center justify-center">
                <ChevronDown
                  size={12}
                  className={`text-secondary transition-transform duration-300 ${showChats ? "rotate-180" : ""}`}
                />
              </div>
            </Button>
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></div>
            <div className="absolute top-full right-0 mt-2 bg-popover text-popover-foreground rounded-md p-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {showChats ? "Close Chats" : "Open Chats"}
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 p-4 border border-destructive/30 rounded-md bg-destructive/10">
            <p className="text-sm text-destructive mb-2">Are you sure you want to delete this automation?</p>
            <div className="flex space-x-2">
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Confirm Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock size={16} />
            <p className="text-sm font-medium">Created {getRelativeTime(automation.createdAt)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Current Sentiment</h3>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value, name, props) => [`${value}%`, props.payload.name]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-2">
              {sentimentData.map((item) => (
                <div key={item.name} className="text-center">
                  <p className="text-sm font-medium" style={{ color: item.color }}>
                    {item.name}
                  </p>
                  <p className="text-lg font-bold text-foreground">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  */}
        <div className="mt-6 border-t border-[#545454] pt-4">
          <button
            className="w-full flex items-center justify-between p-2 rounded-lg border border-[#545454]/50 bg-transparent transition-colors duration-300"
            onClick={() => setShowChats(!showChats)}
          >
            <div className="flex items-center">
              <div className="mr-3 w-8 h-8 rounded-full border border-[#545454] flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D]">
                <MessageSquare size={16} className="text-blue-400" />
              </div>
              <span className="font-medium">View Conversation History</span>
              {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
                <Badge className="ml-2 bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {automation.listener.dmCount} messages
                </Badge>
              )}
            </div>
            <div>
              {showChats ? (
                <ChevronUp size={20} className="text-[#9B9CA0]" />
              ) : (
                <ChevronDown size={20} className="text-[#9B9CA0]" />
              )}
            </div>
          </button>
        </div>

        <AnimatePresence>
          {showChats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              className="w-full overflow-hidden"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="border border-[#545454]/50 rounded-lg p-4 mt-3 bg-[#1D1D1D]/30"
              >
                <AutomationChats automationId={automation.id} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full opacity-50" />
    </Card>
  )
}

export default FancyAutomationBox