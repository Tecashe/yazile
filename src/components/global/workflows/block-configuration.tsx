
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

// // Use the WorkflowNode type from the updated interface
// type WorkflowNode = {
//   id: string
//   type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
//   position: { x: number; y: number }
//   data: any
//   connections: string[]
// }

// interface BlockConfigurationProps {
//   node: WorkflowNode
//   onUpdate: (updates: Partial<WorkflowNode>) => void
// }

// export function BlockConfiguration({ node, onUpdate }: BlockConfigurationProps) {
//   const [newButtonText, setNewButtonText] = useState("")
//   const [newHeaderKey, setNewHeaderKey] = useState("")
//   const [newHeaderValue, setNewHeaderValue] = useState("")

//   // Use the direct node.type since it now includes all types
//   const nodeType = node.type

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
//         <p className="text-sm text-muted-foreground">Configure the {nodeType} block properties</p>
//       </div>

//       {nodeType === "text" && (
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

//       {nodeType === "button" && (
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

//       {nodeType === "image" && (
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

//       {nodeType === "condition" && (
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

//       {nodeType === "delay" && (
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

//       {nodeType === "api" && (
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

//       {nodeType === "webhook" && (
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { WorkflowNode } from "@/types/workflow"
import { Plus, Trash2, Upload } from "lucide-react"

interface BlockConfigurationProps {
  node: WorkflowNode
  onUpdate: (updates: Partial<WorkflowNode>) => void
}

export function BlockConfiguration({ node, onUpdate }: BlockConfigurationProps) {
  const [newButton, setNewButton] = useState("")

  const updateData = (key: string, value: any) => {
    onUpdate({
      data: {
        ...node.data,
        [key]: value,
      },
    })
  }

  const addButton = () => {
    if (!newButton.trim()) return

    const buttons = node.data.buttons || []
    updateData("buttons", [
      ...buttons,
      {
        id: crypto.randomUUID(),
        text: newButton,
        action: "continue",
      },
    ])
    setNewButton("")
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

  const renderTriggerConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Trigger Title</Label>
        <Input
          id="title"
          value={node.data.title || ""}
          onChange={(e) => updateData("title", e.target.value)}
          placeholder="Enter trigger title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={node.data.description || ""}
          onChange={(e) => updateData("description", e.target.value)}
          placeholder="Describe when this trigger activates"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Trigger Type</Label>
        <Select value={node.data.triggerType || "dm"} onValueChange={(value) => updateData("triggerType", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dm">Direct Message</SelectItem>
            <SelectItem value="comment">Comment</SelectItem>
            <SelectItem value="mention">Mention</SelectItem>
            <SelectItem value="story_reply">Story Reply</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Platforms</Label>
        <div className="flex flex-wrap gap-2">
          {["instagram", "facebook", "twitter", "linkedin"].map((platform) => (
            <Badge
              key={platform}
              variant={node.data.platforms?.includes(platform) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const platforms = node.data.platforms || []
                const updated = platforms.includes(platform)
                  ? platforms.filter((p: string) => p !== platform)
                  : [...platforms, platform]
                updateData("platforms", updated)
              }}
            >
              {platform}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTextConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Message Text</Label>
        <Textarea
          id="message"
          value={node.data.message || ""}
          onChange={(e) => updateData("message", e.target.value)}
          placeholder="Enter your message text..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Buttons (Optional)</Label>
        <div className="space-y-2">
          {(node.data.buttons || []).map((button: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={button.text}
                onChange={(e) => updateButton(index, "text", e.target.value)}
                placeholder="Button text"
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newButton}
              onChange={(e) => setNewButton(e.target.value)}
              placeholder="Add button..."
              onKeyPress={(e) => e.key === "Enter" && addButton()}
              className="flex-1"
            />
            <Button onClick={addButton} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderButtonConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Button Options</Label>
        <div className="space-y-2">
          {(node.data.buttons || []).map((button: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={button.text}
                onChange={(e) => updateButton(index, "text", e.target.value)}
                placeholder="Button text"
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => removeButton(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newButton}
              onChange={(e) => setNewButton(e.target.value)}
              placeholder="Add button..."
              onKeyPress={(e) => e.key === "Enter" && addButton()}
              className="flex-1"
            />
            <Button onClick={addButton} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderImageConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Method</Label>
        <Select value={node.data.uploadMethod || "url"} onValueChange={(value) => updateData("uploadMethod", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">Image URL</SelectItem>
            <SelectItem value="upload">Upload File</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {node.data.uploadMethod === "url" ? (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={node.data.imageUrl || ""}
            onChange={(e) => updateData("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <Button variant="outline" className="w-full bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="caption">Caption (Optional)</Label>
        <Textarea
          id="caption"
          value={node.data.caption || ""}
          onChange={(e) => updateData("caption", e.target.value)}
          placeholder="Image caption..."
          rows={3}
        />
      </div>
    </div>
  )

  const renderConditionConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Condition Type</Label>
        <Select value={node.data.condition || "contains"} onValueChange={(value) => updateData("condition", value)}>
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label htmlFor="value">Value to Check</Label>
        <Input
          id="value"
          value={node.data.value || ""}
          onChange={(e) => updateData("value", e.target.value)}
          placeholder="Enter value to match..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="caseSensitive"
          checked={node.data.caseSensitive || false}
          onCheckedChange={(checked) => updateData("caseSensitive", checked)}
        />
        <Label htmlFor="caseSensitive">Case sensitive</Label>
      </div>
    </div>
  )

  const renderDelayConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={node.data.duration || 5}
            onChange={(e) => updateData("duration", Number.parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Select value={node.data.unit || "seconds"} onValueChange={(value) => updateData("unit", value)}>
            <SelectTrigger>
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

      <div className="flex items-center space-x-2">
        <Switch
          id="randomize"
          checked={node.data.randomize || false}
          onCheckedChange={(checked) => updateData("randomize", checked)}
        />
        <Label htmlFor="randomize">Add random variation (±20%)</Label>
      </div>
    </div>
  )

  const renderApiConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="endpoint">API Endpoint</Label>
        <Input
          id="endpoint"
          value={node.data.endpoint || ""}
          onChange={(e) => updateData("endpoint", e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div className="space-y-2">
        <Label>HTTP Method</Label>
        <Select value={node.data.method || "POST"} onValueChange={(value) => updateData("method", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Request Body (JSON)</Label>
        <Textarea
          id="body"
          value={node.data.body || ""}
          onChange={(e) => updateData("body", e.target.value)}
          placeholder='{"key": "value"}'
          rows={4}
        />
      </div>
    </div>
  )

  const renderWebhookConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Webhook URL</Label>
        <Input
          id="url"
          value={node.data.url || ""}
          onChange={(e) => updateData("url", e.target.value)}
          placeholder="https://your-app.com/webhook"
        />
      </div>

      <div className="space-y-2">
        <Label>HTTP Method</Label>
        <Select value={node.data.method || "POST"} onValueChange={(value) => updateData("method", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payload">Payload (JSON)</Label>
        <Textarea
          id="payload"
          value={node.data.payload || ""}
          onChange={(e) => updateData("payload", e.target.value)}
          placeholder='{"event": "workflow_event", "data": {}}'
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="retries">Retry Attempts</Label>
        <Input
          id="retries"
          type="number"
          min="0"
          max="10"
          value={node.data.retries || 3}
          onChange={(e) => updateData("retries", Number.parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  )

  const renderConfig = () => {
    switch (node.type) {
      case "trigger":
        return renderTriggerConfig()
      case "text":
        return renderTextConfig()
      case "button":
        return renderButtonConfig()
      case "image":
        return renderImageConfig()
      case "condition":
        return renderConditionConfig()
      case "delay":
        return renderDelayConfig()
      case "api":
        return renderApiConfig()
      case "webhook":
        return renderWebhookConfig()
      default:
        return <div className="text-center text-muted-foreground">No configuration available</div>
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Block Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure the settings for this {node.type} block</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Settings
            </CardTitle>
            <CardDescription>Customize how this block behaves in your workflow</CardDescription>
          </CardHeader>
          <CardContent>{renderConfig()}</CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
