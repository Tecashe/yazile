// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { toast } from "sonner"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Instagram,
//   Twitter,
//   Facebook,
//   Linkedin,
//   Youtube,
//   MessageCircle,
//   Webhook,
//   Key,
//   TestTube,
//   CheckCircle,
//   XCircle,
//   Loader2,
// } from "lucide-react"

// const platforms = [
//   { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
//   { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
//   { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
//   { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
//   { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
//   { id: "telegram", name: "Telegram", icon: MessageCircle, color: "text-blue-500" },
// ]

// export function ApiIntegrationPanel() {
//   const [selectedPlatform, setSelectedPlatform] = useState<string>("")
//   const [apiKey, setApiKey] = useState("")
//   const [webhookUrl, setWebhookUrl] = useState("")
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [connectionStatus, setConnectionStatus] = useState<Record<string, "connected" | "disconnected" | "testing">>({})

//   const handleConnect = async (platform: string) => {
//     if (!apiKey.trim()) {
//       toast.error("Please enter an API key")
//       return
//     }

//     setIsConnecting(true)
//     setConnectionStatus((prev) => ({ ...prev, [platform]: "testing" }))

//     try {
//       // Simulate API connection
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // In real implementation, this would make actual API calls
//       const response = await fetch("/api/integrations/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           platform,
//           apiKey,
//           webhookUrl,
//         }),
//       })

//       if (response.ok) {
//         setConnectionStatus((prev) => ({ ...prev, [platform]: "connected" }))
//         toast.success(`Successfully connected to ${platform}`)
//       } else {
//         throw new Error("Connection failed")
//       }
//     } catch (error) {
//       setConnectionStatus((prev) => ({ ...prev, [platform]: "disconnected" }))
//       toast.error(`Failed to connect to ${platform}`)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleTestWebhook = async () => {
//     if (!webhookUrl.trim()) {
//       toast.error("Please enter a webhook URL")
//       return
//     }

//     try {
//       const testPayload = {
//         event: "test",
//         timestamp: new Date().toISOString(),
//         data: {
//           message: "This is a test webhook from your workflow builder",
//           user: "test_user",
//           platform: selectedPlatform,
//         },
//       }

//       const response = await fetch(webhookUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(testPayload),
//       })

//       if (response.ok) {
//         toast.success("Webhook test successful!")
//       } else {
//         throw new Error(`HTTP ${response.status}`)
//       }
//     } catch (error) {
//       toast.error("Webhook test failed")
//       console.error("Webhook test error:", error)
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "connected":
//         return <CheckCircle className="h-4 w-4 text-green-500" />
//       case "testing":
//         return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
//       case "disconnected":
//         return <XCircle className="h-4 w-4 text-red-500" />
//       default:
//         return null
//     }
//   }

//   return (
//     <ScrollArea className="h-full">
//       <div className="space-y-6">
//         <div>
//           <h3 className="text-lg font-semibold mb-2">API Integrations</h3>
//           <p className="text-sm text-muted-foreground">Connect your social media platforms and configure webhooks</p>
//         </div>

//         <Tabs defaultValue="platforms" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="platforms">Platforms</TabsTrigger>
//             <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
//           </TabsList>

//           <TabsContent value="platforms" className="space-y-4">
//             <div className="space-y-4">
//               <Label>Select Platform</Label>
//               <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose a platform to connect" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {platforms.map((platform) => (
//                     <SelectItem key={platform.id} value={platform.id}>
//                       <div className="flex items-center gap-2">
//                         <platform.icon className={`h-4 w-4 ${platform.color}`} />
//                         {platform.name}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {selectedPlatform && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     {(() => {
//                         const platform = platforms.find((p) => p.id === selectedPlatform);
//                         const IconComponent = platform?.icon;
//                         return IconComponent ? <IconComponent size={20} /> : null;
//                     })()}
//                     Connect {platforms.find((p) => p.id === selectedPlatform)?.name}
//                     {getStatusIcon(connectionStatus[selectedPlatform])}
//                     </CardTitle>
//                   <CardDescription>Enter your API credentials to connect this platform</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="apiKey">API Key / Access Token</Label>
//                     <Input
//                       id="apiKey"
//                       type="password"
//                       value={apiKey}
//                       onChange={(e) => setApiKey(e.target.value)}
//                       placeholder="Enter your API key"
//                     />
//                   </div>

//                   <Button
//                     onClick={() => handleConnect(selectedPlatform)}
//                     disabled={isConnecting || !apiKey.trim()}
//                     className="w-full"
//                   >
//                     {isConnecting ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Connecting...
//                       </>
//                     ) : (
//                       <>
//                         <Key className="h-4 w-4 mr-2" />
//                         Connect Platform
//                       </>
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Connected platforms overview */}
//             <div className="space-y-2">
//               <Label>Connected Platforms</Label>
//               <div className="grid grid-cols-2 gap-2">
//                 {platforms.map((platform) => (
//                   <div
//                     key={platform.id}
//                     className={`p-3 rounded-lg border ${
//                       connectionStatus[platform.id] === "connected"
//                         ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
//                         : "border-border bg-card"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <platform.icon className={`h-4 w-4 ${platform.color}`} />
//                         <span className="text-sm font-medium">{platform.name}</span>
//                       </div>
//                       {getStatusIcon(connectionStatus[platform.id])}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="webhooks" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Webhook className="h-5 w-5" />
//                   Webhook Configuration
//                 </CardTitle>
//                 <CardDescription>Configure webhooks to receive real-time notifications</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="webhookUrl">Webhook URL</Label>
//                   <Input
//                     id="webhookUrl"
//                     value={webhookUrl}
//                     onChange={(e) => setWebhookUrl(e.target.value)}
//                     placeholder="https://your-app.com/webhook"
//                   />
//                 </div>

//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={handleTestWebhook}
//                     disabled={!webhookUrl.trim()}
//                     className="flex-1 bg-transparent"
//                   >
//                     <TestTube className="h-4 w-4 mr-2" />
//                     Test Webhook
//                   </Button>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Webhook Events</Label>
//                   <div className="space-y-2">
//                     {[
//                       "message.received",
//                       "comment.created",
//                       "workflow.started",
//                       "workflow.completed",
//                       "error.occurred",
//                     ].map((event) => (
//                       <div key={event} className="flex items-center justify-between p-2 rounded border">
//                         <span className="text-sm font-mono">{event}</span>
//                         <Badge variant="secondary">Active</Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </ScrollArea>
//   )
// }
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  MessageCircle,
  Webhook,
  Key,
  TestTube,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
  { id: "telegram", name: "Telegram", icon: MessageCircle, color: "text-blue-500" },
]

export function ApiIntegrationPanel() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [apiKey, setApiKey] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, "connected" | "disconnected" | "testing">>({})

  const handleConnect = async (platform: string) => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    setIsConnecting(true)
    setConnectionStatus((prev) => ({ ...prev, [platform]: "testing" }))

    try {
      // Simulate API connection
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, this would make actual API calls
      const response = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          apiKey,
          webhookUrl,
        }),
      })

      if (response.ok) {
        setConnectionStatus((prev) => ({ ...prev, [platform]: "connected" }))
        toast.success(`Successfully connected to ${platform}`)
      } else {
        throw new Error("Connection failed")
      }
    } catch (error) {
      setConnectionStatus((prev) => ({ ...prev, [platform]: "disconnected" }))
      toast.error(`Failed to connect to ${platform}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error("Please enter a webhook URL")
      return
    }

    try {
      const testPayload = {
        event: "test",
        timestamp: new Date().toISOString(),
        data: {
          message: "This is a test webhook from your workflow builder",
          user: "test_user",
          platform: selectedPlatform,
        },
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      })

      if (response.ok) {
        toast.success("Webhook test successful!")
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      toast.error("Webhook test failed")
      console.error("Webhook test error:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "testing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">API Integrations</h3>
          <p className="text-sm text-muted-foreground">Connect your social media platforms and configure webhooks</p>
        </div>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-4">
            <div className="space-y-4">
              <Label>Select Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a platform to connect" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <platform.icon className={`h-4 w-4 ${platform.color}`} />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlatform && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const platform = platforms.find((p) => p.id === selectedPlatform)
                      const IconComponent = platform?.icon
                      return IconComponent ? <IconComponent size={20} /> : null
                    })()}
                    Connect {platforms.find((p) => p.id === selectedPlatform)?.name}
                    {getStatusIcon(connectionStatus[selectedPlatform])}
                  </CardTitle>
                  <CardDescription>Enter your API credentials to connect this platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key / Access Token</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>

                  <Button
                    onClick={() => handleConnect(selectedPlatform)}
                    disabled={isConnecting || !apiKey.trim()}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Connect Platform
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Connected platforms overview */}
            <div className="space-y-2">
              <Label>Connected Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`p-3 rounded-lg border ${
                      connectionStatus[platform.id] === "connected"
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <platform.icon className={`h-4 w-4 ${platform.color}`} />
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      {getStatusIcon(connectionStatus[platform.id])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Configuration
                </CardTitle>
                <CardDescription>Configure webhooks to receive real-time notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-app.com/webhook"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleTestWebhook}
                    disabled={!webhookUrl.trim()}
                    className="flex-1 bg-transparent"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Webhook Events</Label>
                  <div className="space-y-2">
                    {[
                      "message.received",
                      "comment.created",
                      "workflow.started",
                      "workflow.completed",
                      "error.occurred",
                    ].map((event) => (
                      <div key={event} className="flex items-center justify-between p-2 rounded border">
                        <span className="text-sm font-mono">{event}</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
