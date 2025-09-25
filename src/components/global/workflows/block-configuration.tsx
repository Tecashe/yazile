// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Trash2, Upload, Globe, Send } from "lucide-react"
// import type { EnhancedWorkflowBuilder } from "./workflow-builder"

// interface BlockConfigurationProps {
//   node: WorkflowNode
//   onUpdate: (updates: Partial<WorkflowNode>) => void
// }

// export function BlockConfiguration({ node, onUpdate }: BlockConfigurationProps) {
//   const [newButtonText, setNewButtonText] = useState("")
//   const [newHeaderKey, setNewHeaderKey] = useState("")
//   const [newHeaderValue, setNewHeaderValue] = useState("")

//   const updateData = (key: string, value: any) => {
//     onUpdate({
//       data: {
//         ...node.data,
//         [key]: value,
//       },
//     })
//   }

//   const addButton = () => {
//     if (!newButtonText.trim()) return

//     const buttons = node.data.buttons || []
//     updateData("buttons", [
//       ...buttons,
//       {
//         text: newButtonText,
//         action: "continue",
//         id: Date.now().toString(),
//       },
//     ])
//     setNewButtonText("")
//   }

//   const removeButton = (index: number) => {
//     const buttons = [...(node.data.buttons || [])]
//     buttons.splice(index, 1)
//     updateData("buttons", buttons)
//   }

//   const updateButton = (index: number, field: string, value: string) => {
//     const buttons = [...(node.data.buttons || [])]
//     buttons[index] = { ...buttons[index], [field]: value }
//     updateData("buttons", buttons)
//   }

//   const addHeader = () => {
//     if (!newHeaderKey.trim() || !newHeaderValue.trim()) return

//     const headers = { ...(node.data.headers || {}) }
//     headers[newHeaderKey] = newHeaderValue
//     updateData("headers", headers)
//     setNewHeaderKey("")
//     setNewHeaderValue("")
//   }

//   const removeHeader = (key: string) => {
//     const headers = { ...(node.data.headers || {}) }
//     delete headers[key]
//     updateData("headers", headers)
//   }

//   return (
//     <div className="p-4 space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold mb-2">Block Configuration</h3>
//         <p className="text-sm text-muted-foreground">Configure the {node.type} block properties</p>
//       </div>

//       {node.type === "text" && (
//         <Card className="p-4 space-y-4">
//           <div>
//             <Label htmlFor="message">Message Text</Label>
//             <Textarea
//               id="message"
//               placeholder="Enter your response message..."
//               value={node.data.message || ""}
//               onChange={(e) => updateData("message", e.target.value)}
//               className="mt-1"
//               rows={4}
//             />
//           </div>

//           <div>
//             <Label>Quick Reply Buttons (Optional)</Label>
//             <div className="space-y-2 mt-2">
//               {(node.data.buttons || []).map((button: any, index: number) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <Input
//                     placeholder="Button text"
//                     value={button.text}
//                     onChange={(e) => updateButton(index, "text", e.target.value)}
//                     className="flex-1"
//                   />
//                   <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               ))}
//               <div className="flex items-center gap-2">
//                 <Input
//                   placeholder="Add button text..."
//                   value={newButtonText}
//                   onChange={(e) => setNewButtonText(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && addButton()}
//                   className="flex-1"
//                 />
//                 <Button onClick={addButton} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       {node.type === "button" && (
//         <Card className="p-4 space-y-4">
//           <div>
//             <Label>Button Options</Label>
//             <div className="space-y-2 mt-2">
//               {(node.data.buttons || []).map((button: any, index: number) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <Input
//                     placeholder="Button text"
//                     value={button.text}
//                     onChange={(e) => updateButton(index, "text", e.target.value)}
//                     className="flex-1"
//                   />
//                   <Select value={button.action} onValueChange={(value) => updateButton(index, "action", value)}>
//                     <SelectTrigger className="w-32">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="continue">Continue</SelectItem>
//                       <SelectItem value="end">End Flow</SelectItem>
//                       <SelectItem value="restart">Restart</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               ))}
//               <div className="flex items-center gap-2">
//                 <Input
//                   placeholder="Add button text..."
//                   value={newButtonText}
//                   onChange={(e) => setNewButtonText(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && addButton()}
//                   className="flex-1"
//                 />
//                 <Button onClick={addButton} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       {node.type === "image" && (
//         <Card className="p-4 space-y-4">
//           <div>
//             <Label htmlFor="imageUrl">Image</Label>
//             <div className="mt-2 space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id="imageUrl"
//                   placeholder="Image URL or upload..."
//                   value={node.data.imageUrl || ""}
//                   onChange={(e) => updateData("imageUrl", e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button variant="outline" size="sm">
//                   <Upload className="w-4 h-4" />
//                 </Button>
//               </div>
//               {node.data.imageUrl && (
//                 <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
//                   <img
//                     src={node.data.imageUrl || "/placeholder.svg"}
//                     alt="Preview"
//                     className="max-h-full max-w-full rounded"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="caption">Caption (Optional)</Label>
//             <Textarea
//               id="caption"
//               placeholder="Add a caption for your image..."
//               value={node.data.caption || ""}
//               onChange={(e) => updateData("caption", e.target.value)}
//               className="mt-1"
//               rows={2}
//             />
//           </div>

//           <div>
//             <Label>Action Buttons (Optional)</Label>
//             <div className="space-y-2 mt-2">
//               {(node.data.buttons || []).map((button: any, index: number) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <Input
//                     placeholder="Button text"
//                     value={button.text}
//                     onChange={(e) => updateButton(index, "text", e.target.value)}
//                     className="flex-1"
//                   />
//                   <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               ))}
//               <div className="flex items-center gap-2">
//                 <Input
//                   placeholder="Add button text..."
//                   value={newButtonText}
//                   onChange={(e) => setNewButtonText(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && addButton()}
//                   className="flex-1"
//                 />
//                 <Button onClick={addButton} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       {node.type === "condition" && (
//         <Card className="p-4 space-y-4">
//           <div>
//             <Label htmlFor="condition">Condition Type</Label>
//             <Select value={node.data.condition || "contains"} onValueChange={(value) => updateData("condition", value)}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="contains">Contains</SelectItem>
//                 <SelectItem value="equals">Equals</SelectItem>
//                 <SelectItem value="starts_with">Starts with</SelectItem>
//                 <SelectItem value="ends_with">Ends with</SelectItem>
//                 <SelectItem value="regex">Regex match</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="value">Value to Check</Label>
//             <Input
//               id="value"
//               placeholder="Enter keyword or pattern..."
//               value={node.data.value || ""}
//               onChange={(e) => updateData("value", e.target.value)}
//               className="mt-1"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>If True</Label>
//               <Select
//                 value={node.data.trueAction || "continue"}
//                 onValueChange={(value) => updateData("trueAction", value)}
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="continue">Continue</SelectItem>
//                   <SelectItem value="end">End Flow</SelectItem>
//                   <SelectItem value="restart">Restart</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>If False</Label>
//               <Select
//                 value={node.data.falseAction || "continue"}
//                 onValueChange={(value) => updateData("falseAction", value)}
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="continue">Continue</SelectItem>
//                   <SelectItem value="end">End Flow</SelectItem>
//                   <SelectItem value="restart">Restart</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Card>
//       )}

//       {node.type === "delay" && (
//         <Card className="p-4 space-y-4">
//           <div>
//             <Label htmlFor="duration">Delay Duration</Label>
//             <div className="flex items-center gap-2 mt-1">
//               <Input
//                 id="duration"
//                 type="number"
//                 min="1"
//                 placeholder="5"
//                 value={node.data.duration || ""}
//                 onChange={(e) => updateData("duration", Number.parseInt(e.target.value) || 1)}
//                 className="flex-1"
//               />
//               <Select value={node.data.unit || "seconds"} onValueChange={(value) => updateData("unit", value)}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="seconds">Seconds</SelectItem>
//                   <SelectItem value="minutes">Minutes</SelectItem>
//                   <SelectItem value="hours">Hours</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="text-sm text-muted-foreground">
//             The workflow will pause for {node.data.duration || 5} {node.data.unit || "seconds"} before continuing to the
//             next block.
//           </div>
//         </Card>
//       )}

//       {node.type === "api" && (
//         <Card className="p-4 space-y-4">
//           <div className="flex items-center gap-2 mb-4">
//             <Globe className="h-5 w-5 text-cyan-500" />
//             <h4 className="font-semibold">API Configuration</h4>
//           </div>

//           <div>
//             <Label htmlFor="endpoint">API Endpoint</Label>
//             <Input
//               id="endpoint"
//               placeholder="https://api.example.com/endpoint"
//               value={node.data.endpoint || ""}
//               onChange={(e) => updateData("endpoint", e.target.value)}
//               className="mt-1 font-mono"
//             />
//           </div>

//           <div>
//             <Label htmlFor="method">HTTP Method</Label>
//             <Select value={node.data.method || "POST"} onValueChange={(value) => updateData("method", value)}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="GET">GET</SelectItem>
//                 <SelectItem value="POST">POST</SelectItem>
//                 <SelectItem value="PUT">PUT</SelectItem>
//                 <SelectItem value="PATCH">PATCH</SelectItem>
//                 <SelectItem value="DELETE">DELETE</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Headers</Label>
//             <div className="space-y-2 mt-2">
//               {Object.entries(node.data.headers || {}).map(([key, value]) => (
//                 <div key={key} className="flex items-center gap-2">
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {key}: {value as string}
//                   </Badge>
//                   <Button variant="ghost" size="sm" onClick={() => removeHeader(key)}>
//                     <Trash2 className="w-3 h-3" />
//                   </Button>
//                 </div>
//               ))}
//               <div className="flex items-center gap-2">
//                 <Input
//                   placeholder="Header name"
//                   value={newHeaderKey}
//                   onChange={(e) => setNewHeaderKey(e.target.value)}
//                   className="flex-1 font-mono text-sm"
//                 />
//                 <Input
//                   placeholder="Header value"
//                   value={newHeaderValue}
//                   onChange={(e) => setNewHeaderValue(e.target.value)}
//                   className="flex-1 font-mono text-sm"
//                 />
//                 <Button onClick={addHeader} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="body">Request Body</Label>
//             <Textarea
//               id="body"
//               placeholder='{"message": "{{user_message}}", "user_id": "{{user_id}}"}'
//               value={node.data.body || ""}
//               onChange={(e) => updateData("body", e.target.value)}
//               className="mt-1 font-mono text-sm"
//               rows={4}
//             />
//             <p className="text-xs text-muted-foreground mt-1">Use {"{{variable_name}}"} for dynamic values</p>
//           </div>

//           <div>
//             <Label htmlFor="timeout">Timeout (seconds)</Label>
//             <Input
//               id="timeout"
//               type="number"
//               min="1"
//               max="300"
//               placeholder="30"
//               value={node.data.timeout || ""}
//               onChange={(e) => updateData("timeout", Number.parseInt(e.target.value) || 30)}
//               className="mt-1"
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <Switch
//               id="retryOnFailure"
//               checked={node.data.retryOnFailure || false}
//               onCheckedChange={(checked) => updateData("retryOnFailure", checked)}
//             />
//             <Label htmlFor="retryOnFailure">Retry on failure</Label>
//           </div>
//         </Card>
//       )}

//       {node.type === "webhook" && (
//         <Card className="p-4 space-y-4">
//           <div className="flex items-center gap-2 mb-4">
//             <Send className="h-5 w-5 text-pink-500" />
//             <h4 className="font-semibold">Webhook Configuration</h4>
//           </div>

//           <div>
//             <Label htmlFor="webhookUrl">Webhook URL</Label>
//             <Input
//               id="webhookUrl"
//               placeholder="https://webhook.example.com/endpoint"
//               value={node.data.url || ""}
//               onChange={(e) => updateData("url", e.target.value)}
//               className="mt-1 font-mono"
//             />
//           </div>

//           <div>
//             <Label htmlFor="webhookMethod">HTTP Method</Label>
//             <Select value={node.data.method || "POST"} onValueChange={(value) => updateData("method", value)}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="POST">POST</SelectItem>
//                 <SelectItem value="PUT">PUT</SelectItem>
//                 <SelectItem value="PATCH">PATCH</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Headers</Label>
//             <div className="space-y-2 mt-2">
//               {Object.entries(node.data.headers || {}).map(([key, value]) => (
//                 <div key={key} className="flex items-center gap-2">
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {key}: {value as string}
//                   </Badge>
//                   <Button variant="ghost" size="sm" onClick={() => removeHeader(key)}>
//                     <Trash2 className="w-3 h-3" />
//                   </Button>
//                 </div>
//               ))}
//               <div className="flex items-center gap-2">
//                 <Input
//                   placeholder="Header name"
//                   value={newHeaderKey}
//                   onChange={(e) => setNewHeaderKey(e.target.value)}
//                   className="flex-1 font-mono text-sm"
//                 />
//                 <Input
//                   placeholder="Header value"
//                   value={newHeaderValue}
//                   onChange={(e) => setNewHeaderValue(e.target.value)}
//                   className="flex-1 font-mono text-sm"
//                 />
//                 <Button onClick={addHeader} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="payload">Payload</Label>
//             <Textarea
//               id="payload"
//               placeholder='{"event": "dm_received", "message": "{{user_message}}", "user": "{{user_id}}"}'
//               value={node.data.payload || ""}
//               onChange={(e) => updateData("payload", e.target.value)}
//               className="mt-1 font-mono text-sm"
//               rows={4}
//             />
//             <p className="text-xs text-muted-foreground mt-1">Use {"{{variable_name}}"} for dynamic values</p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="retries">Max Retries</Label>
//               <Input
//                 id="retries"
//                 type="number"
//                 min="0"
//                 max="10"
//                 placeholder="3"
//                 value={node.data.retries || ""}
//                 onChange={(e) => updateData("retries", Number.parseInt(e.target.value) || 3)}
//                 className="mt-1"
//               />
//             </div>
//             <div>
//               <Label htmlFor="webhookTimeout">Timeout (seconds)</Label>
//               <Input
//                 id="webhookTimeout"
//                 type="number"
//                 min="1"
//                 max="300"
//                 placeholder="30"
//                 value={node.data.timeout || ""}
//                 onChange={(e) => updateData("timeout", Number.parseInt(e.target.value) || 30)}
//                 className="mt-1"
//               />
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Switch
//               id="verifySSL"
//               checked={node.data.verifySSL !== false}
//               onCheckedChange={(checked) => updateData("verifySSL", checked)}
//             />
//             <Label htmlFor="verifySSL">Verify SSL certificate</Label>
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Upload, Globe, Send } from "lucide-react"

// Use the WorkflowNode type from the updated interface
type WorkflowNode = {
  id: string
  type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
  position: { x: number; y: number }
  data: any
  connections: string[]
}

interface BlockConfigurationProps {
  node: WorkflowNode
  onUpdate: (updates: Partial<WorkflowNode>) => void
}

export function BlockConfiguration({ node, onUpdate }: BlockConfigurationProps) {
  const [newButtonText, setNewButtonText] = useState("")
  const [newHeaderKey, setNewHeaderKey] = useState("")
  const [newHeaderValue, setNewHeaderValue] = useState("")

  // Use the direct node.type since it now includes all types
  const nodeType = node.type

  const updateData = (key: string, value: any) => {
    onUpdate({
      data: {
        ...node.data,
        [key]: value,
      },
    })
  }

  const addButton = () => {
    if (!newButtonText.trim()) return

    const buttons = node.data.buttons || []
    updateData("buttons", [
      ...buttons,
      {
        text: newButtonText,
        action: "continue",
        id: Date.now().toString(),
      },
    ])
    setNewButtonText("")
  }

  const removeButton = (index: number) => {
    const buttons = [...(node.data.buttons || [])]
    buttons.splice(index, 1)
    updateData("buttons", buttons)
  }

  const updateButton = (index: number, field: string, value: string) => {
    const buttons = [...(node.data.buttons || [])]
    buttons[index] = { ...buttons[index], [field]: value }
    updateData("buttons", buttons)
  }

  const addHeader = () => {
    if (!newHeaderKey.trim() || !newHeaderValue.trim()) return

    const headers = { ...(node.data.headers || {}) }
    headers[newHeaderKey] = newHeaderValue
    updateData("headers", headers)
    setNewHeaderKey("")
    setNewHeaderValue("")
  }

  const removeHeader = (key: string) => {
    const headers = { ...(node.data.headers || {}) }
    delete headers[key]
    updateData("headers", headers)
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Block Configuration</h3>
        <p className="text-sm text-muted-foreground">Configure the {nodeType} block properties</p>
      </div>

      {nodeType === "text" && (
        <Card className="p-4 space-y-4">
          <div>
            <Label htmlFor="message">Message Text</Label>
            <Textarea
              id="message"
              placeholder="Enter your response message..."
              value={node.data.message || ""}
              onChange={(e) => updateData("message", e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label>Quick Reply Buttons (Optional)</Label>
            <div className="space-y-2 mt-2">
              {(node.data.buttons || []).map((button: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Button text"
                    value={button.text}
                    onChange={(e) => updateButton(index, "text", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add button text..."
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addButton()}
                  className="flex-1"
                />
                <Button onClick={addButton} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {nodeType === "button" && (
        <Card className="p-4 space-y-4">
          <div>
            <Label>Button Options</Label>
            <div className="space-y-2 mt-2">
              {(node.data.buttons || []).map((button: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Button text"
                    value={button.text}
                    onChange={(e) => updateButton(index, "text", e.target.value)}
                    className="flex-1"
                  />
                  <Select value={button.action} onValueChange={(value) => updateButton(index, "action", value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continue">Continue</SelectItem>
                      <SelectItem value="end">End Flow</SelectItem>
                      <SelectItem value="restart">Restart</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add button text..."
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addButton()}
                  className="flex-1"
                />
                <Button onClick={addButton} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {nodeType === "image" && (
        <Card className="p-4 space-y-4">
          <div>
            <Label htmlFor="imageUrl">Image</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="imageUrl"
                  placeholder="Image URL or upload..."
                  value={node.data.imageUrl || ""}
                  onChange={(e) => updateData("imageUrl", e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              {node.data.imageUrl && (
                <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                  <img
                    src={node.data.imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-full max-w-full rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption for your image..."
              value={node.data.caption || ""}
              onChange={(e) => updateData("caption", e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label>Action Buttons (Optional)</Label>
            <div className="space-y-2 mt-2">
              {(node.data.buttons || []).map((button: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Button text"
                    value={button.text}
                    onChange={(e) => updateButton(index, "text", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add button text..."
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addButton()}
                  className="flex-1"
                />
                <Button onClick={addButton} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {nodeType === "condition" && (
        <Card className="p-4 space-y-4">
          <div>
            <Label htmlFor="condition">Condition Type</Label>
            <Select value={node.data.condition || "contains"} onValueChange={(value) => updateData("condition", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="starts_with">Starts with</SelectItem>
                <SelectItem value="ends_with">Ends with</SelectItem>
                <SelectItem value="regex">Regex match</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Value to Check</Label>
            <Input
              id="value"
              placeholder="Enter keyword or pattern..."
              value={node.data.value || ""}
              onChange={(e) => updateData("value", e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>If True</Label>
              <Select
                value={node.data.trueAction || "continue"}
                onValueChange={(value) => updateData("trueAction", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continue">Continue</SelectItem>
                  <SelectItem value="end">End Flow</SelectItem>
                  <SelectItem value="restart">Restart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>If False</Label>
              <Select
                value={node.data.falseAction || "continue"}
                onValueChange={(value) => updateData("falseAction", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continue">Continue</SelectItem>
                  <SelectItem value="end">End Flow</SelectItem>
                  <SelectItem value="restart">Restart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {nodeType === "delay" && (
        <Card className="p-4 space-y-4">
          <div>
            <Label htmlFor="duration">Delay Duration</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="5"
                value={node.data.duration || ""}
                onChange={(e) => updateData("duration", Number.parseInt(e.target.value) || 1)}
                className="flex-1"
              />
              <Select value={node.data.unit || "seconds"} onValueChange={(value) => updateData("unit", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            The workflow will pause for {node.data.duration || 5} {node.data.unit || "seconds"} before continuing to the
            next block.
          </div>
        </Card>
      )}

      {nodeType === "api" && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-cyan-500" />
            <h4 className="font-semibold">API Configuration</h4>
          </div>

          <div>
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Input
              id="endpoint"
              placeholder="https://api.example.com/endpoint"
              value={node.data.endpoint || ""}
              onChange={(e) => updateData("endpoint", e.target.value)}
              className="mt-1 font-mono"
            />
          </div>

          <div>
            <Label htmlFor="method">HTTP Method</Label>
            <Select value={node.data.method || "POST"} onValueChange={(value) => updateData("method", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Headers</Label>
            <div className="space-y-2 mt-2">
              {Object.entries(node.data.headers || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {key}: {value as string}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => removeHeader(key)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Header name"
                  value={newHeaderKey}
                  onChange={(e) => setNewHeaderKey(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Input
                  placeholder="Header value"
                  value={newHeaderValue}
                  onChange={(e) => setNewHeaderValue(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={addHeader} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="body">Request Body</Label>
            <Textarea
              id="body"
              placeholder='{"message": "{{user_message}}", "user_id": "{{user_id}}"}'
              value={node.data.body || ""}
              onChange={(e) => updateData("body", e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">Use {"{{variable_name}}"} for dynamic values</p>
          </div>

          <div>
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input
              id="timeout"
              type="number"
              min="1"
              max="300"
              placeholder="30"
              value={node.data.timeout || ""}
              onChange={(e) => updateData("timeout", Number.parseInt(e.target.value) || 30)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="retryOnFailure"
              checked={node.data.retryOnFailure || false}
              onCheckedChange={(checked) => updateData("retryOnFailure", checked)}
            />
            <Label htmlFor="retryOnFailure">Retry on failure</Label>
          </div>
        </Card>
      )}

      {nodeType === "webhook" && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Send className="h-5 w-5 text-pink-500" />
            <h4 className="font-semibold">Webhook Configuration</h4>
          </div>

          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://webhook.example.com/endpoint"
              value={node.data.url || ""}
              onChange={(e) => updateData("url", e.target.value)}
              className="mt-1 font-mono"
            />
          </div>

          <div>
            <Label htmlFor="webhookMethod">HTTP Method</Label>
            <Select value={node.data.method || "POST"} onValueChange={(value) => updateData("method", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Headers</Label>
            <div className="space-y-2 mt-2">
              {Object.entries(node.data.headers || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {key}: {value as string}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => removeHeader(key)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Header name"
                  value={newHeaderKey}
                  onChange={(e) => setNewHeaderKey(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Input
                  placeholder="Header value"
                  value={newHeaderValue}
                  onChange={(e) => setNewHeaderValue(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={addHeader} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="payload">Payload</Label>
            <Textarea
              id="payload"
              placeholder='{"event": "dm_received", "message": "{{user_message}}", "user": "{{user_id}}"}'
              value={node.data.payload || ""}
              onChange={(e) => updateData("payload", e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">Use {"{{variable_name}}"} for dynamic values</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="retries">Max Retries</Label>
              <Input
                id="retries"
                type="number"
                min="0"
                max="10"
                placeholder="3"
                value={node.data.retries || ""}
                onChange={(e) => updateData("retries", Number.parseInt(e.target.value) || 3)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="webhookTimeout">Timeout (seconds)</Label>
              <Input
                id="webhookTimeout"
                type="number"
                min="1"
                max="300"
                placeholder="30"
                value={node.data.timeout || ""}
                onChange={(e) => updateData("timeout", Number.parseInt(e.target.value) || 30)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="verifySSL"
              checked={node.data.verifySSL !== false}
              onCheckedChange={(checked) => updateData("verifySSL", checked)}
            />
            <Label htmlFor="verifySSL">Verify SSL certificate</Label>
          </div>
        </Card>
      )}
    </div>
  )
}