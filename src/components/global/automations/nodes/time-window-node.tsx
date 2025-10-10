"use client"

import { motion } from "framer-motion"
import { Clock, Calendar, Sun, Moon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

export const TimeWindowNode = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const businessHours = [
    { day: "Monday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { day: "Tuesday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { day: "Wednesday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { day: "Thursday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { day: "Friday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { day: "Saturday", start: "10:00 AM", end: "2:00 PM", enabled: false },
    { day: "Sunday", start: "Closed", end: "", enabled: false },
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
              <Clock className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Business Hours Filter</h3>
              <p className="text-text-secondary">Only respond during your business hours</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
              Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {businessHours.map((schedule) => (
                <div key={schedule.day} className="flex items-center justify-between p-3 bg-background-90 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch checked={schedule.enabled} />
                    <div>
                      <p className="font-medium text-sm">{schedule.day}</p>
                      <p className="text-xs text-text-secondary">
                        {schedule.start} {schedule.end && `- ${schedule.end}`}
                      </p>
                    </div>
                  </div>
                  {schedule.enabled && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <Sun className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-300">During Business Hours</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Automation responds immediately when triggered during active hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <Moon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-300">Outside Business Hours</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Messages are queued and sent when business hours resume
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-90 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#768BDD]" />
                  <h5 className="font-medium text-sm">Timezone</h5>
                </div>
                <p className="text-sm text-text-secondary">EST (UTC-5)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
