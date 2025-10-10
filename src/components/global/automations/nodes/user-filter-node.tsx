"use client"

import { motion } from "framer-motion"
import { Filter, Users, BadgeCheck, TrendingUp, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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

export const UserFilterNode = ({
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
              <Filter className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Lead Qualification</h3>
              <p className="text-text-secondary">Filter and prioritize high-quality leads</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#768BDD]" />
                    <span className="font-medium text-sm">Minimum Followers</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Slider defaultValue={[1000]} max={100000} step={100} className="w-full" />
                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>0</span>
                  <span className="font-medium text-blue-400">1,000+</span>
                  <span>100K</span>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-sm">Verified Accounts Only</span>
                  </div>
                  <Switch />
                </div>
                <p className="text-xs text-text-secondary">Only respond to verified business accounts</p>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="font-medium text-sm">Engagement Rate</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Slider defaultValue={[2]} max={10} step={0.5} className="w-full" />
                <div className="flex justify-between text-xs text-text-secondary mt-2">
                  <span>0%</span>
                  <span className="font-medium text-green-400">2%+</span>
                  <span>10%</span>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span className="font-medium text-sm">Location Filter</span>
                  </div>
                  <Switch />
                </div>
                <p className="text-xs text-text-secondary">Target specific geographic regions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <BadgeCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-300">Qualified Leads</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Automation only engages with users who meet your qualification criteria
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Current Filters</h5>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    1,000+ followers
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    2%+ engagement
                  </Badge>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-3">Filter Impact</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Total interactions</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Qualified leads</span>
                    <span className="font-bold text-green-400">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Filtered out</span>
                    <span className="font-bold text-red-400">905</span>
                  </div>
                  <div className="h-2 bg-background-80 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 w-[27%]" />
                  </div>
                  <p className="text-xs text-text-secondary">27% qualification rate</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h5 className="font-medium text-sm mb-2 text-yellow-300">Why Filter Matters</h5>
                <p className="text-sm text-text-secondary">
                  Focus your team&apos;s time on high-quality leads. Filtering prevents wasted effort on low-intent users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
