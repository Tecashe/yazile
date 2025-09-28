// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { BlockConfiguration } from "./block-configuration"
// import { WorkflowTester } from "./workflow-tester"
// import { WorkflowSettings } from "./workflow-settings"
// import { Settings, TestTube, Wrench } from "lucide-react"

// export function ConfigurationPanel() {
//   const { selectedNode, nodes } = useWorkflowStore()
//   const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

//   return (
//     <div className="h-full bg-card border-l border-border flex flex-col">
//       <Tabs defaultValue="configure" className="h-full flex flex-col">
//         <div className="p-4 border-b border-border">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="configure" className="flex items-center gap-2">
//               <Wrench className="h-4 w-4" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="test" className="flex items-center gap-2">
//               <TestTube className="h-4 w-4" />
//               Test
//             </TabsTrigger>
//             <TabsTrigger value="settings" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Settings
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         <div className="flex-1 overflow-hidden">
//           <TabsContent value="configure" className="h-full m-0">
//             <ScrollArea className="h-full">
//               {selectedNodeData ? (
//                 <BlockConfiguration node={selectedNodeData} />
//               ) : (
//                 <div className="p-6 text-center">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//                     <Wrench className="h-8 w-8 text-muted-foreground" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No Block Selected</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     Click on a block in the canvas to configure its properties and settings.
//                   </p>
//                 </div>
//               )}
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent value="test" className="h-full m-0">
//             <ScrollArea className="h-full">
//               <div className="p-4">
//                 <WorkflowTester />
//               </div>
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent value="settings" className="h-full m-0">
//             <WorkflowSettings />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   )
// }
// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store-production"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { BlockConfiguration } from "./block-configuration"
// import { WorkflowTester } from "./workflow-tester"
// import { WorkflowSettings } from "./workflow-settings"
// import { Settings, TestTube, Wrench } from "lucide-react"

// export function ConfigurationPanel() {
//   const { selectedNode, nodes } = useWorkflowStore()
//   const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

//   return (
//     <div className="h-full bg-card border-l border-border flex flex-col">
//       <Tabs defaultValue="configure" className="h-full flex flex-col">
//         <div className="p-4 border-b border-border">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="configure" className="flex items-center gap-2">
//               <Wrench className="h-4 w-4" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="test" className="flex items-center gap-2">
//               <TestTube className="h-4 w-4" />
//               Test
//             </TabsTrigger>
//             <TabsTrigger value="settings" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Settings
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         <div className="flex-1 overflow-hidden">
//           <TabsContent value="configure" className="h-full m-0">
//             <ScrollArea className="h-full">
//               {selectedNodeData ? (
//                 <BlockConfiguration node={selectedNodeData} />
//               ) : (
//                 <div className="p-6 text-center">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//                     <Wrench className="h-8 w-8 text-muted-foreground" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No Block Selected</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     Click on a block in the canvas to configure its properties and settings.
//                   </p>
//                 </div>
//               )}
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent value="test" className="h-full m-0">
//             <ScrollArea className="h-full">
//               <div className="p-4">
//                 <WorkflowTester />
//               </div>
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent value="settings" className="h-full m-0">
//             <WorkflowSettings />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import { useWorkflowStore } from "@/lib/workflow-store-production"
import { WorkflowEngine, type WorkflowContext } from "@/lib/workflow-engine"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings, 
  TestTube, 
  Wrench, 
  Play,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Bot,
  User,
  Zap,
  AlertTriangle,
  Send
} from "lucide-react"

interface TestMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  nodeId?: string
  nodeType?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  readyToTest: boolean
}

export function ConfigurationPanel() {
  const { selectedNode, nodes, connections } = useWorkflowStore()
  const [testInput, setTestInput] = useState("Hello! I'm interested in your services.")
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testMessages, setTestMessages] = useState<TestMessage[]>([])
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  useEffect(() => {
    validateWorkflow()
  }, [nodes, connections])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [testMessages])

  const validateWorkflow = () => {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for trigger node
    const triggerNodes = nodes.filter(n => n.type === 'trigger')
    if (triggerNodes.length === 0) {
      errors.push("Workflow needs at least one trigger node")
    } else if (triggerNodes.length > 1) {
      warnings.push("Multiple trigger nodes detected - only the first will be used")
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set([
      ...connections.map(c => c.fromNodeId),
      ...connections.map(c => c.toNodeId)
    ])
    
    const disconnectedNodes = nodes.filter(n => 
      n.type !== 'trigger' && !connectedNodeIds.has(n.id)
    )
    
    if (disconnectedNodes.length > 0) {
      warnings.push(`${disconnectedNodes.length} node(s) are not connected to the workflow`)
    }

    // Check node configurations
    nodes.forEach(node => {
      switch (node.type) {
        case 'text':
          if (!node.data.message?.trim()) {
            errors.push(`Text node "${getNodeTitle(node)}" needs a message`)
          }
          break
        case 'condition':
          if (!node.data.condition || !node.data.value) {
            errors.push(`Condition node "${getNodeTitle(node)}" needs condition and value`)
          }
          break
        case 'api':
          if (!node.data.endpoint) {
            errors.push(`API node "${getNodeTitle(node)}" needs an endpoint URL`)
          }
          break
        case 'webhook':
          if (!node.data.url) {
            errors.push(`Webhook node "${getNodeTitle(node)}" needs a URL`)
          }
          break
      }
    })

    // Check for condition node connections
    const conditionNodes = nodes.filter(n => n.type === 'condition')
    conditionNodes.forEach(node => {
      const trueConnection = connections.find(c => c.fromNodeId === node.id && c.fromHandle === 'true')
      const falseConnection = connections.find(c => c.fromNodeId === node.id && c.fromHandle === 'false')
      
      if (!trueConnection) {
        warnings.push(`Condition node "${getNodeTitle(node)}" missing "true" path`)
      }
      if (!falseConnection) {
        warnings.push(`Condition node "${getNodeTitle(node)}" missing "false" path`)
      }
    })

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      readyToTest: errors.length === 0 && triggerNodes.length > 0
    }

    setValidation(result)
  }

  const getNodeTitle = (node: any) => {
    return node.data.title || node.type.charAt(0).toUpperCase() + node.type.slice(1)
  }

  const runWorkflowTest = async () => {
    if (!validation?.readyToTest) return

    setIsTestRunning(true)
    setTestMessages([])

    // Add user message
    const userMessage: TestMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: testInput,
      timestamp: new Date()
    }
    setTestMessages([userMessage])

    try {
      // Create mock context
      const context: WorkflowContext = {
        variables: { message: testInput },
        triggerData: { message: testInput },
        userId: 'test-user',
        workflowId: 'test-workflow',
        executionId: `test-${Date.now()}`,
        platform: 'instagram',
        senderId: 'test-sender',
        senderUsername: 'testuser'
      }

      // Create workflow engine
      const engine = new WorkflowEngine(nodes, connections, context)
      
      // Mock the execution with step-by-step updates
      const result = await executeWorkflowWithUpdates(engine, context)

    } catch (error) {
      const errorMessage: TestMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }
      setTestMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTestRunning(false)
    }
  }

  const executeWorkflowWithUpdates = async (engine: any, context: WorkflowContext) => {
    const triggerNode = nodes.find(n => n.type === 'trigger')
    if (!triggerNode) return

    let currentNodeId = triggerNode.id
    const visitedNodes = new Set<string>()
    
    while (currentNodeId && !visitedNodes.has(currentNodeId)) {
      visitedNodes.add(currentNodeId)
      const node = nodes.find(n => n.id === currentNodeId)
      if (!node) break

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Add processing message
      const processingMessage: TestMessage = {
        id: `processing-${Date.now()}`,
        type: 'bot',
        content: `Processing ${node.type} node...`,
        timestamp: new Date(),
        nodeId: node.id,
        nodeType: node.type
      }
      setTestMessages(prev => [...prev, processingMessage])

      // Execute node logic
      const response = await simulateNodeExecution(node, context)
      
      if (response.content) {
        const botMessage: TestMessage = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: response.content,
          timestamp: new Date(),
          nodeId: node.id,
          nodeType: node.type
        }
        setTestMessages(prev => [...prev.slice(0, -1), botMessage]) // Replace processing message
      } else {
        // Remove processing message if no output
        setTestMessages(prev => prev.slice(0, -1))
      }

      // Find next node
      if (response.nextNodeId) {
        currentNodeId = response.nextNodeId
      } else {
        const connection = connections.find(c => c.fromNodeId === currentNodeId)
        currentNodeId = connection?.toNodeId ||""
      }
    }
  }

  const simulateNodeExecution = async (node: any, context: WorkflowContext) => {
    switch (node.type) {
      case 'trigger':
        return { content: '', nextNodeId: null }
        
      case 'text':
        return { 
          content: node.data.message || 'Hello!',
          nextNodeId: null 
        }
        
      case 'button':
        const buttons = node.data.buttons || []
        const buttonText = buttons.map((btn: any) => btn.text).join(', ')
        return { 
          content: `${node.data.message || ''}\n\nButtons: ${buttonText}`,
          nextNodeId: null 
        }
        
      case 'condition':
        const message = context.variables.message?.toLowerCase() || ''
        const value = node.data.value?.toLowerCase() || ''
        const condition = node.data.condition
        
        let conditionMet = false
        switch (condition) {
          case 'contains':
            conditionMet = message.includes(value)
            break
          case 'equals':
            conditionMet = message === value
            break
          case 'starts_with':
            conditionMet = message.startsWith(value)
            break
        }

        const trueConnection = connections.find(c => c.fromNodeId === node.id && c.fromHandle === 'true')
        const falseConnection = connections.find(c => c.fromNodeId === node.id && c.fromHandle === 'false')
        
        return {
          content: `Condition "${condition}" with "${value}": ${conditionMet ? 'TRUE' : 'FALSE'}`,
          nextNodeId: conditionMet ? trueConnection?.toNodeId : falseConnection?.toNodeId
        }
        
      case 'delay':
        const duration = node.data.duration || 1
        return { 
          content: `Waiting ${duration} second(s)...`,
          nextNodeId: null 
        }
        
      case 'api':
        return { 
          content: `API call to: ${node.data.endpoint || 'Not configured'}`,
          nextNodeId: null 
        }
        
      case 'webhook':
        return { 
          content: `Webhook sent to: ${node.data.url || 'Not configured'}`,
          nextNodeId: null 
        }
        
      default:
        return { content: `Executed ${node.type} node`, nextNodeId: null }
    }
  }

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <Tabs defaultValue="configure" className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="configure" className="h-full m-0">
            <ScrollArea className="h-full">
              {selectedNodeData ? (
                <div className="p-4">
                  <NodeConfiguration node={selectedNodeData} />
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Node Selected</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Click on a node in the canvas to configure its properties and settings.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="test" className="h-full m-0 p-4">
            <div className="space-y-4 h-full flex flex-col">
              {/* Validation Status */}
              {validation && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {validation.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      Workflow Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {validation.errors.map((error, idx) => (
                      <Alert key={idx} variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ))}
                    {validation.warnings.map((warning, idx) => (
                      <Alert key={idx}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{warning}</AlertDescription>
                      </Alert>
                    ))}
                    {validation.readyToTest && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Workflow is ready to test!</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Test Input */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Test Your Workflow</CardTitle>
                  <CardDescription>
                    Send a test message to see how your workflow responds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test Message</Label>
                    <div className="flex gap-2">
                      <Input
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Type your test message..."
                        onKeyPress={(e) => e.key === 'Enter' && validation?.readyToTest && !isTestRunning && runWorkflowTest()}
                      />
                      <Button
                        onClick={runWorkflowTest}
                        disabled={!validation?.readyToTest || isTestRunning || !testInput.trim()}
                        className="min-w-[80px]"
                      >
                        {isTestRunning ? (
                          <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Conversation Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 max-h-96 pr-4">
                    <div className="space-y-3">
                      {testMessages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Test your workflow to see the conversation flow</p>
                        </div>
                      )}
                      {testMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              message.type === 'user'
                                ? 'bg-primary text-primary-foreground ml-4'
                                : 'bg-muted mr-4'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {message.type === 'user' ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                              <span className="text-xs opacity-70">
                                {message.type === 'user' ? 'You' : 'Bot'}
                                {message.nodeType && ` (${message.nodeType})`}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0">
            <ScrollArea className="h-full">
              <WorkflowSettings />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

// Simple node configuration component
function NodeConfiguration({ node }: { node: any }) {
  const { updateNode } = useWorkflowStore()

  const handleUpdateData = (updates: any) => {
    updateNode(node.id, { data: { ...node.data, ...updates } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base capitalize">{node.type} Configuration</CardTitle>
        <CardDescription>Configure this {node.type} node</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {node.type === 'trigger' && (
          <>
            <div className="space-y-2">
              <Label>Trigger Title</Label>
              <Input
                value={node.data.title || ''}
                onChange={(e) => handleUpdateData({ title: e.target.value })}
                placeholder="Enter trigger name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={node.data.description || ''}
                onChange={(e) => handleUpdateData({ description: e.target.value })}
                placeholder="Describe when this trigger activates"
              />
            </div>
          </>
        )}

        {node.type === 'text' && (
          <div className="space-y-2">
            <Label>Message Text</Label>
            <Textarea
              value={node.data.message || ''}
              onChange={(e) => handleUpdateData({ message: e.target.value })}
              placeholder="Enter your message text"
              rows={3}
            />
          </div>
        )}

        {node.type === 'condition' && (
          <>
            <div className="space-y-2">
              <Label>Condition Type</Label>
              <select
                className="w-full p-2 border rounded"
                value={node.data.condition || 'contains'}
                onChange={(e) => handleUpdateData({ condition: e.target.value })}
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
                <option value="starts_with">Starts With</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Value to Check</Label>
              <Input
                value={node.data.value || ''}
                onChange={(e) => handleUpdateData({ value: e.target.value })}
                placeholder="Enter value to check for"
              />
            </div>
          </>
        )}

        {node.type === 'delay' && (
          <div className="space-y-2">
            <Label>Delay Duration (seconds)</Label>
            <Input
              type="number"
              value={node.data.duration || 1}
              onChange={(e) => handleUpdateData({ duration: parseInt(e.target.value) || 1 })}
              min="1"
              max="300"
            />
          </div>
        )}

        {node.type === 'api' && (
          <div className="space-y-2">
            <Label>API Endpoint</Label>
            <Input
              value={node.data.endpoint || ''}
              onChange={(e) => handleUpdateData({ endpoint: e.target.value })}
              placeholder="https://api.example.com/endpoint"
            />
          </div>
        )}

        {node.type === 'webhook' && (
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={node.data.url || ''}
              onChange={(e) => handleUpdateData({ url: e.target.value })}
              placeholder="https://webhook.example.com"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function WorkflowSettings() {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow Settings</CardTitle>
          <CardDescription>Configure your workflow preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Settings panel - implement based on your needs</p>
        </CardContent>
      </Card>
    </div>
  )
}