"use client"

import { motion } from "framer-motion"
import { Gauge, Shield, AlertTriangle, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

export const RateLimiterNode = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
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
              <Gauge className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Rate Limiting</h3>
              <p className="text-text-secondary">Prevent spam flags and maintain professional appearance</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
              Protected
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Messages per Hour</label>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    20 max
                  </Badge>
                </div>
                <Slider defaultValue={[20]} max={100} step={5} className="w-full" />
                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>5</span>
                  <span>100</span>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Messages per Day</label>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    200 max
                  </Badge>
                </div>
                <Slider defaultValue={[200]} max={1000} step={50} className="w-full" />
                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>50</span>
                  <span>1000</span>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Same User Cooldown</label>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    24 hours
                  </Badge>
                </div>
                <Slider defaultValue={[24]} max={168} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>1h</span>
                  <span>7 days</span>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Prevent messaging the same user multiple times within this period
                </p>
              </div>

              <div className="bg-background-90 p-4 rounded-lg space-y-3">
                <h5 className="font-medium text-sm">Current Usage</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">This hour</span>
                    <span className="font-medium">12 / 20</span>
                  </div>
                  <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 w-[60%]" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Today</span>
                    <span className="font-medium">87 / 200</span>
                  </div>
                  <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 w-[43%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-300">Account Protection</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Rate limiting prevents your account from being flagged for spam or automated behavior
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-900/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-red-300">Instagram Limits</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Instagram has strict limits on automated actions. Exceeding them can result in temporary or
                      permanent bans.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-400" />
                  Recommended Limits
                </h5>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">20-30 per hour</strong> - Safe for most accounts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">150-200 per day</strong> - Sustainable long-term
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">24h cooldown</strong> - Prevents user annoyance
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h5 className="font-medium text-sm mb-2 text-yellow-300">When Limit Reached</h5>
                <p className="text-sm text-text-secondary">
                  Messages are queued and sent when capacity becomes available. No interactions are lost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
