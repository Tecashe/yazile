"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useWorkflowStore } from "@/lib/workflow-store"
import { Play, Square, MessageCircle, User, Bot } from "lucide-react"

interface SimulationMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  nodeId?: string
}

export function WorkflowSimulator() {
  const { nodes, isRunning } = useWorkflowStore()
  const [messages, setMessages] = useState<SimulationMessage[]>([])
  const [testMessage, setTestMessage] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)

  const startSimulation = async () => {
    if (!testMessage.trim()) return

    setIsSimulating(true)

    // Add user message
    const userMessage: SimulationMessage = {
      id: Date.now().toString(),
      type: "user",
      content: testMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setTestMessage("")

    // Simulate workflow execution
    await simulateWorkflow(testMessage)
    setIsSimulating(false)
  }

  const simulateWorkflow = async (message: string) => {
    // Find trigger nodes
    const triggerNodes = nodes.filter((node) => node.type === "trigger")
    if (triggerNodes.length === 0) return

    // Start with first trigger
    const startNode = triggerNodes[0]
    await processNode(startNode, message)
  }

  const processNode = async (node: any, context: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing time

    let response = ""
    const shouldContinue = true

    switch (node.type) {
      case "trigger":
        // Triggers don't generate responses, just continue to connected nodes
        break

      case "text":
        response = node.data.message || "Hello! Thanks for your message."
        break

      case "button":
        const buttons = node.data.buttons || []
        response = `Please choose an option:\n${buttons.map((btn: any, i: number) => `${i + 1}. ${btn.text}`).join("\n")}`
        break

      case "image":
        response = node.data.caption || "Here's an image for you!"
        break

      case "condition":
        const condition = node.data.condition || "contains"
        const value = node.data.value || ""
        const caseSensitive = node.data.caseSensitive || false

        const messageToCheck = caseSensitive ? context : context.toLowerCase()
        const valueToCheck = caseSensitive ? value : value.toLowerCase()

        let conditionMet = false
        switch (condition) {
          case "contains":
            conditionMet = messageToCheck.includes(valueToCheck)
            break
          case "equals":
            conditionMet = messageToCheck === valueToCheck
            break
          case "starts_with":
            conditionMet = messageToCheck.startsWith(valueToCheck)
            break
          case "ends_with":
            conditionMet = messageToCheck.endsWith(valueToCheck)
            break
        }

        response = `Condition "${value}" ${conditionMet ? "met" : "not met"}`
        break

      case "delay":
        const duration = node.data.duration || 5
        const unit = node.data.unit || "seconds"
        response = `Waiting ${duration} ${unit}...`
        break

      case "api":
        response = `Making API call to ${node.data.endpoint || "endpoint"}...`
        break

      case "webhook":
        response = `Sending webhook to ${node.data.url || "URL"}...`
        break
    }

    if (response) {
      const botMessage: SimulationMessage = {
        id: Date.now().toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
        nodeId: node.id,
      }

      setMessages((prev) => [...prev, botMessage])
    }

    // Continue to connected nodes
    if (shouldContinue && node.connections.length > 0) {
      for (const connectionId of node.connections) {
        const nextNode = nodes.find((n) => n.id === connectionId)
        if (nextNode) {
          await processNode(nextNode, context)
        }
      }
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold mb-2">Workflow Simulator</h3>
        <p className="text-sm text-muted-foreground">Test your workflow with sample messages</p>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Send a test message to start the simulation.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                      {message.nodeId && (
                        <Badge variant="outline" className="text-xs">
                          {nodes.find((n) => n.id === message.nodeId)?.type}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-4">
          <div className="flex gap-2">
            <Input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Type a test message..."
              onKeyPress={(e) => e.key === "Enter" && !isSimulating && startSimulation()}
              disabled={isSimulating}
            />
            <Button onClick={startSimulation} disabled={!testMessage.trim() || isSimulating} size="sm">
              {isSimulating ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>

          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearMessages} className="w-full bg-transparent">
              Clear Messages
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
