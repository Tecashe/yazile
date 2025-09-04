"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Code, CheckCircle } from "lucide-react"

interface VoiceflowCall {
  method: string
  url: string
  headers: Record<string, string>
  body: Record<string, any>
}

interface Capability {
  id: string
  name: string
  description: string
  endpoint: string
  voiceflowCall: VoiceflowCall
}

interface VoiceflowApiDocsProps {
  capabilities: Capability[]
  integrationName: string
}

export function VoiceflowApiDocs({ capabilities, integrationName }: VoiceflowApiDocsProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = async (text: string, endpointId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpointId)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Code className="h-4 w-4 mr-2" />
          API Docs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {integrationName} API Documentation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-3">
              All API calls must include your Voiceflow API key in the headers:
            </p>
            <div className="bg-background p-3 rounded border font-mono text-sm">
              <div className="flex items-center justify-between">
                <span>&ldquo;x-api-key&rdquo;: &ldquo;your-voiceflow-api-key&rdquo;</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('"x-api-key": "your-voiceflow-api-key"', "auth")}
                >
                  {copiedEndpoint === "auth" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue={capabilities[0]?.id} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-muted/50">
              {capabilities.map((capability) => (
                <TabsTrigger key={capability.id} value={capability.id} className="text-xs">
                  {capability.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {capabilities.map((capability) => (
              <TabsContent key={capability.id} value={capability.id} className="space-y-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{capability.name}</CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {capability.voiceflowCall.method}
                      </Badge>
                    </div>
                    <CardDescription>{capability.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Endpoint URL */}
                    <div>
                      <h4 className="font-medium mb-2">Endpoint</h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>{capability.endpoint}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(capability.endpoint, `endpoint-${capability.id}`)}
                          >
                            {copiedEndpoint === `endpoint-${capability.id}` ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Request Headers */}
                    <div>
                      <h4 className="font-medium mb-2">Headers</h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm space-y-1">
                        {Object.entries(capability.voiceflowCall.headers).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span>
                              &ldquo;{key}&rdquo;: &ldquo;{value}&rdquo;
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`"${key}": "${value}"`, `header-${capability.id}-${key}`)}
                            >
                              {copiedEndpoint === `header-${capability.id}-${key}` ? (
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request Body */}
                    <div>
                      <h4 className="font-medium mb-2">Request Body</h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground">JSON</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(capability.voiceflowCall.body, null, 2),
                                `body-${capability.id}`,
                              )
                            }
                          >
                            {copiedEndpoint === `body-${capability.id}` ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(capability.voiceflowCall.body, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Complete cURL Example */}
                    <div>
                      <h4 className="font-medium mb-2">Complete cURL Example</h4>
                      <div className="bg-background p-3 rounded border font-mono text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground">Copy & paste into Voiceflow API block</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const curlCommand = `curl -X ${capability.voiceflowCall.method} \\
                              "${capability.voiceflowCall.url}" \\
                              ${Object.entries(capability.voiceflowCall.headers)
                                .map(([key, value]) => `-H "${key}: ${value}"`)
                                .join(" \\\n  ")} \\
                              -d '${JSON.stringify(capability.voiceflowCall.body)}'`
                              copyToClipboard(curlCommand, `curl-${capability.id}`)
                            }}
                          >
                            {copiedEndpoint === `curl-${capability.id}` ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap">
                          {`curl -X ${capability.voiceflowCall.method} \\
                          "${capability.voiceflowCall.url}" \\
                          ${Object.entries(capability.voiceflowCall.headers)
                            .map(([key, value]) => `-H "${key}: ${value}"`)
                            .join(" \\\n  ")} \\
                          -d '${JSON.stringify(capability.voiceflowCall.body)}'`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
