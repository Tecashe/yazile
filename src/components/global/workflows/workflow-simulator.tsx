// still in use - Enhanced workflow simulator with real store integration
"use client"

import { useState } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Send, User, Bot, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { workflowEngine, type WorkflowExecution, type MessageContext } from "@/lib/workflow-engine"
import { toast } from "sonner"

interface SimulationMessage {
  id: string
  type: "user" | "bot" | "system"
  content: string
  timestamp: Date
  buttons?: Array<{ text: string; action: string }>
  imageUrl?: string
}

export function WorkflowSimulator() {
  const { nodes, isRunning, setIsRunning, testWorkflow, validateWorkflow } = useWorkflowStore()
  const [messages, setMessages] = useState<SimulationMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null)

  const handleStartTest = async () => {
    const validation = validateWorkflow()
    if (!validation.isValid) {
      toast.error(`Workflow has errors: ${validation.errors.join(", ")}`)
      return
    }

    setIsRunning(true)
    setMessages([])
    setCurrentExecution(null)
    toast.success("Test simulation started!")
  }

  const handleStopTest = () => {
    setIsRunning(false)
    toast.info("Test simulation stopped")
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isRunning) return

    const userMessage: SimulationMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    const context: MessageContext = {
      content: inputMessage,
      sender: "test-user",
      platform: "instagram",
      metadata: { simulationId: Date.now() },
    }

    try {
      const result = await testWorkflow(context)
      const execution = result.execution || (await workflowEngine.executeWorkflow(nodes, context))
      setCurrentExecution(execution)

      // Process execution history to generate bot responses
      const botResponses: SimulationMessage[] = []

      for (const step of execution.history) {
        if (step.output && step.status === "success") {
          const output = step.output

          if (output.type === "text") {
            botResponses.push({
              id: `bot-${step.nodeId}-${step.timestamp.getTime()}`,
              type: "bot",
              content: output.content,
              timestamp: step.timestamp,
              buttons: output.buttons?.length > 0 ? output.buttons : undefined,
            })
          } else if (output.type === "image") {
            botResponses.push({
              id: `bot-${step.nodeId}-${step.timestamp.getTime()}`,
              type: "bot",
              content: output.caption || "Image sent",
              timestamp: step.timestamp,
              imageUrl: output.imageUrl,
              buttons: output.buttons?.length > 0 ? output.buttons : undefined,
            })
          } else if (output.type === "buttons") {
            botResponses.push({
              id: `bot-${step.nodeId}-${step.timestamp.getTime()}`,
              type: "bot",
              content: "Choose an option:",
              timestamp: step.timestamp,
              buttons: output.buttons,
            })
          } else if (output.delayed) {
            botResponses.push({
              id: `system-${step.nodeId}-${step.timestamp.getTime()}`,
              type: "system",
              content: `⏱️ Waiting ${output.duration} ${output.unit}...`,
              timestamp: step.timestamp,
            })
          }
        } else if (step.status === "error") {
          botResponses.push({
            id: `error-${step.nodeId}-${step.timestamp.getTime()}`,
            type: "system",
            content: `❌ Error in ${step.nodeId}: ${step.error || "Unknown error"}`,
            timestamp: step.timestamp,
          })
        }
      }

      // Add bot responses with slight delays for realism
      for (let i = 0; i < botResponses.length; i++) {
        setTimeout(
          () => {
            setMessages((prev) => [...prev, botResponses[i]])
          },
          (i + 1) * 500,
        )
      }
    } catch (error) {
      const errorMessage: SimulationMessage = {
        id: `error-${Date.now()}`,
        type: "system",
        content: `❌ Workflow error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      toast.error("Workflow execution failed")
    }

    setInputMessage("")
  }

  const handleButtonClick = (buttonText: string) => {
    setInputMessage(buttonText)
    setTimeout(handleSendMessage, 100)
  }

  const clearMessages = () => {
    setMessages([])
    setCurrentExecution(null)
    workflowEngine.clearExecutions()
    toast.success("Messages cleared")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Simulator Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Workflow Simulator</h3>
            <p className="text-sm text-muted-foreground">Test your automation flow</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearMessages}>
              Clear
            </Button>
            <Button
              onClick={isRunning ? handleStopTest : handleStartTest}
              variant={isRunning ? "destructive" : "default"}
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Stop" : "Start"} Test
            </Button>
          </div>
        </div>

        {/* Execution Status */}
        {currentExecution && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {currentExecution.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {currentExecution.status === "failed" && <XCircle className="w-4 h-4 text-red-500" />}
              {currentExecution.status === "running" && <Clock className="w-4 h-4 text-yellow-500 animate-spin" />}
              <span>Status: {currentExecution.status}</span>
            </div>
            <Badge variant="outline">{currentExecution.history.length} steps executed</Badge>
            {currentExecution.executionTime && <Badge variant="secondary">{currentExecution.executionTime}ms</Badge>}
          </div>
        )}

        {/* Validation Warning */}
        {!validateWorkflow().isValid && (
          <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <span>Workflow has validation errors</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation to test your workflow</p>
              <p className="text-sm">Type a message below and see how your automation responds</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} ${
                message.type === "system" ? "justify-center" : ""
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "system"
                      ? "bg-muted text-muted-foreground text-sm"
                      : "bg-card border"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.type === "user" && <User className="w-4 h-4" />}
                  {message.type === "bot" && <Bot className="w-4 h-4" />}
                  <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                </div>

                {message.imageUrl && (
                  <div className="mb-2">
                    <img src={message.imageUrl || "/placeholder.svg"} alt="Response" className="rounded max-w-full" />
                  </div>
                )}

                <p className="text-sm">{message.content}</p>

                {message.buttons && message.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.buttons.map((button, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleButtonClick(button.text)}
                        disabled={!isRunning}
                      >
                        {button.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            placeholder={isRunning ? "Type your message..." : "Start the simulator to test"}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!isRunning}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || !isRunning}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
