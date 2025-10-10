"use client"

import { motion } from "framer-motion"
import { Webhook, Database, ExternalLink, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

export const WebhookNode = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const integrations = [
    { name: "Salesforce", status: "connected", icon: "🔷" },
    { name: "HubSpot", status: "connected", icon: "🟠" },
    { name: "Zapier", status: "available", icon: "⚡" },
    { name: "Make", status: "available", icon: "🔵" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl px-4 sm:px-0"
    >
      <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
        <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-background-90 rounded-xl">
              <Webhook className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">CRM Integration</h3>
              <p className="text-text-secondary">Send lead data to your business systems</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                <Input
                  placeholder="https://your-crm.com/api/webhook"
                  className="bg-background-90 border-none"
                  defaultValue="https://hooks.zapier.com/hooks/catch/12345/abcde/"
                />
                <p className="text-xs text-text-secondary mt-2">
                  Lead data will be sent to this endpoint when automation triggers
                </p>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Data Payload</h5>
                <div className="space-y-2 text-xs font-mono bg-background-80 p-3 rounded">
                  <div>
                    <span className="text-blue-400">&ldquo;username&rdquo;</span>: <span className="text-green-400">&ldquo;@user&rdquo;</span>
                  </div>
                  <div>
                    <span className="text-blue-400">&ldquo;comment&rdquo;</span>:{" "}
                    <span className="text-green-400">&ldquo;message text&rdquo;</span>
                  </div>
                  <div>
                    <span className="text-blue-400">&ldquo;post_url&rdquo;</span>:{" "}
                    <span className="text-green-400">&ldquo;instagram.com/...&rdquo;</span>
                  </div>
                  <div>
                    <span className="text-blue-400">&ldquo;timestamp&rdquo;</span>:{" "}
                    <span className="text-green-400">&ldquo;2025-01-10...&rdquo;</span>
                  </div>
                  <div>
                    <span className="text-blue-400">&ldquo;keyword&rdquo;</span>: <span className="text-green-400">&ldquo;pricing&rdquo;</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-br from-[#3352CC] to-[#1C2D70] text-white">Test Webhook</Button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-300">Automatic Lead Capture</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Every interaction is automatically logged in your CRM with full context and metadata
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-3">Connected Integrations</h5>
                <div className="space-y-2">
                  {integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-3 bg-background-90 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <span className="font-medium text-sm">{integration.name}</span>
                      </div>
                      {integration.status === "connected" ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          Connect
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Use Cases</h5>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Create new leads in Salesforce/HubSpot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Trigger email sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Update contact records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Notify sales team in Slack</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
