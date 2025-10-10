"use client"

import { motion } from "framer-motion"
import { Timer, Zap, Clock } from "lucide-react"
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

export const DelayNode = ({
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
              <Timer className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Response Delay</h3>
              <p className="text-text-secondary">Add natural timing to avoid appearing automated</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Delay Duration</label>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    2-5 minutes
                  </Badge>
                </div>
                <Slider defaultValue={[3]} max={30} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>Instant</span>
                  <span>30 min</span>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Minimum delay</span>
                  <span className="text-sm font-medium">2 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maximum delay</span>
                  <span className="text-sm font-medium">5 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Randomization</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Enabled
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-300">Natural Timing</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Random delays between 2-5 minutes make responses feel more human and less automated
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-900/30 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-300">Why Delays Matter</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Instant responses can trigger spam filters and make customers suspicious. A brief delay appears
                      more professional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Delay Strategy</h5>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Randomized timing prevents pattern detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Longer delays during high-volume periods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Maintains professional appearance</span>
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
