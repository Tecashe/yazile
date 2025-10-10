"use client"

import { motion } from "framer-motion"
import { GitBranch, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

export const BranchNode = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const conditions = [
    {
      type: "Follower Count",
      operator: "greater than",
      value: "10,000",
      action: "Send premium response",
      color: "blue",
    },
    {
      type: "Keyword Category",
      operator: "equals",
      value: "pricing",
      action: "Send pricing info",
      color: "green",
    },
    {
      type: "Account Type",
      operator: "equals",
      value: "verified",
      action: "Priority response",
      color: "purple",
    },
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
              <GitBranch className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Conditional Routing</h3>
              <p className="text-text-secondary">Route leads to different responses based on conditions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {conditions.map((condition, index) => (
                <div key={index} className="bg-background-90 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-${condition.color}-900/30 rounded-lg mt-1`}>
                      <CheckCircle2 className={`h-5 w-5 text-${condition.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`bg-${condition.color}-500/20 text-${condition.color}-400 border-${condition.color}-500/30 text-xs`}
                        >
                          IF
                        </Badge>
                        <span className="text-sm font-medium">{condition.type}</span>
                      </div>
                      <div className="text-sm text-text-secondary mb-2">
                        {condition.operator} <span className="font-medium text-foreground">{condition.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm font-medium">{condition.action}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-900/30 rounded-lg mt-1">
                    <XCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                        ELSE
                      </Badge>
                      <span className="text-sm font-medium">Default Action</span>
                    </div>
                    <div className="text-sm text-text-secondary mb-2">If no conditions match</div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-text-secondary" />
                      <span className="text-sm font-medium">Send standard response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <GitBranch className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-300">Smart Routing</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Different leads get different responses based on their profile and behavior
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Routing Statistics</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-secondary">High-value leads</span>
                      <span className="font-medium text-blue-400">23%</span>
                    </div>
                    <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[23%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-secondary">Pricing inquiries</span>
                      <span className="font-medium text-green-400">41%</span>
                    </div>
                    <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[41%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-secondary">Priority accounts</span>
                      <span className="font-medium text-purple-400">15%</span>
                    </div>
                    <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[15%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-secondary">Standard response</span>
                      <span className="font-medium text-red-400">21%</span>
                    </div>
                    <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[21%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Available Conditions</h5>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Follower count thresholds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Keyword categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Account verification status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Engagement rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Time of day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Previous interactions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h5 className="font-medium text-sm mb-2 text-green-300">B2B Use Case</h5>
                <p className="text-sm text-text-secondary">
                  Send enterprise pricing to verified accounts with 50K+ followers, standard pricing to others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
