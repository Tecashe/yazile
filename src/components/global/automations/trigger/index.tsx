
// "use client"

// import { useState } from "react"
// import ActiveTrigger from "./active"
// import { Separator } from "@/components/ui/separator"
// import ThenAction from "../then/then-action"
// import { AUTOMATION_TRIGGERS } from "@/constants/automation"
// import { useTriggers } from "@/hooks/use-automations"
// import { cn } from "@/lib/utils"
// import Keywords from "./keywords"
// import { Button } from "@/components/ui/button"
// import Loader from "../../loader"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import { motion } from "framer-motion"
// import { PlusCircle, PlayCircle, Info, KeySquare, ChevronRight } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import FloatingPanel from "../../panel"
// import { ContextCard } from "../context"
// import { SimulationTab } from "../simulation"
// import { ScheduledPostsSelector } from "../scheduled"
// import { SetupGuide } from "../guide"
// import PostButton from "../post"
// import { WebsiteAnalyzer } from "../analyzer"
// // import { TemplateEditor } from "../editor"

// type Props = {
//   id: string
// }

// const Trigger = ({ id }: Props) => {
//   const { types, onSetTrigger, onSaveTrigger, isPending } = useTriggers(id)
//   const { data } = useQueryAutomation(id)
//   const [showTip, setShowTip] = useState(true)
//   // Add a state for the active tab
//   const [activeTab, setActiveTab] = useState("setup")

//   // Update the onSaveTrigger function to switch to the configure tab
//   const handleSaveTrigger = () => {
//     onSaveTrigger()
//     setActiveTab("configure")
//   }

//   if (data?.data && data?.data?.trigger.length > 0) {
//     return (
//       <div className="flex flex-col items-center w-full">
//         <ActiveTrigger type={data.data.trigger[0].type} keywords={data.data.keywords} />

//         {data?.data?.trigger.length > 1 && (
//           <>
//             <div className="relative w-full md:w-6/12 my-6">
//               <p className="absolute transform px-2 -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 bg-background-90 text-text-secondary">
//                 or
//               </p>
//               <Separator orientation="horizontal" className="border-muted border-[1px]" />
//             </div>
//             <ActiveTrigger type={data.data.trigger[1].type} keywords={data.data.keywords} />
//           </>
//         )}

//         {!data.data.listener && <ThenAction id={id} />}
//       </div>
//     )
//   }

//   const responseType = data?.data?.listener?.listener || "MESSAGE"

//   return (
//     <FloatingPanel
//       title="Create Automation"
//       trigger={
//         <motion.div
//           className="group relative overflow-hidden rounded-xl mt-4 w-full"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           {/* Border with animation */}
//           <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
//           <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

//           {/* Inner content */}
//           <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
//             <div className="flex items-center justify-center gap-3">
//               <PlusCircle className="h-5 w-5 text-[#768BDD]" />
//               <p className="text-[#768BDD] font-bold">Create Automation</p>
//             </div>
//           </div>
//         </motion.div>
//       }
//     >
//       <div className="flex flex-col gap-4">
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid grid-cols-4 mb-4">
//             <TabsTrigger value="setup">
//               <Info className="h-4 w-4 mr-1" />
//               Guide
//             </TabsTrigger>
//             <TabsTrigger value="trigger">
//               <KeySquare className="h-4 w-4 mr-1" />
//               Trigger
//             </TabsTrigger>
//             <TabsTrigger value="configure">
//               <ChevronRight className="h-4 w-4 mr-1" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="simulation">
//               <PlayCircle className="h-4 w-4 mr-1" />
//               Simulation
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="setup">
//             <SetupGuide />
//           </TabsContent>

//           <TabsContent value="trigger" className="space-y-4">
//             {showTip && <ContextCard context="trigger" onClose={() => setShowTip(false)} />}

//             <h3 className="text-lg font-medium">Select Trigger Type</h3>

//             <div className="grid grid-cols-1 gap-3">
//               {AUTOMATION_TRIGGERS.map((trigger) => (
//                 <motion.div
//                   key={trigger.id}
//                   whileHover={{ scale: 1.01 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => onSetTrigger(trigger.type)}
//                   className={cn(
//                     "rounded-xl flex cursor-pointer flex-col p-4 gap-3",
//                     !types?.find((t) => t === trigger.type)
//                       ? "bg-background-80"
//                       : `bg-gradient-to-br from-[#3352CC] to-[#1C2D70]`,
//                   )}
//                 >
//                   <div className="flex gap-3 items-center">
//                     <div className="p-2 bg-black/20 rounded-lg">{trigger.icon}</div>
//                     <p className="font-semibold text-white">{trigger.label}</p>
//                   </div>
//                   <p className="text-sm text-slate-300">{trigger.description}</p>
//                 </motion.div>
//               ))}
//             </div>

//             <Button
//               onClick={handleSaveTrigger}
//               disabled={types?.length === 0}
//               className={cn(
//                 "w-full py-6 text-white font-medium",
//                 types?.length === 0 ? "bg-in-active" : `bg-gradient-to-br from-[#3352CC] to-[#1C2D70]`,
//               )}
//             >
//               <Loader state={isPending}>Configure</Loader>
//             </Button>
//           </TabsContent>

//           <TabsContent value="configure" className="space-y-4">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-medium mb-3">Configure Automation</h3>
//                 <Keywords id={id} />
//               </div>

//               {responseType === "SMARTAI" || 50>20 && (
//                 <div>
//                   <h3 className="text-lg font-medium mb-3">Analyze Your Business</h3>
//                   <WebsiteAnalyzer
//                     onAnalysisComplete={(analysis) => {
//                       console.log("Website analysis complete:", analysis)
//                       // Handle adding the suggested keywords and response
//                     }}
//                   />
//                 </div>
//               )}

//             </div>

//             <Button
//               onClick={onSaveTrigger}
//               disabled={types?.length === 0}
//               className={cn(
//                 "w-full py-6 text-white font-medium",
//                 types?.length === 0 ? "bg-in-active" : `bg-gradient-to-br from-[#3352CC] to-[#1C2D70]`,
//               )}
//             >
//               <Loader state={isPending}>Save Configuration</Loader>
//             </Button>
//           </TabsContent>

//           <TabsContent value="simulation">
//             <SimulationTab
//               keywords={data?.data?.keywords?.map((k) => k.word) || []}
//               responseMessage={data?.data?.listener?.prompt || ""}
//               responseType={data?.data?.listener?.listener || "MESSAGE"}
//             />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </FloatingPanel>
//   )
// }

// export default Trigger

"use client"

import { useState } from "react"
import ActiveTrigger from "./active"
import { Separator } from "@/components/ui/separator"
import ThenAction from "../then/then-action"
import { AUTOMATION_TRIGGERS } from "@/constants/automation"
import { useTriggers } from "@/hooks/use-automations"
import { cn } from "@/lib/utils"
import Keywords from "./keywords"
import { Button } from "@/components/ui/button"
import Loader from "../../loader"
import { useQueryAutomation } from "@/hooks/user-queries"
import { motion } from "framer-motion"
import { PlusCircle, PlayCircle, Info, KeySquare, ChevronRight, MessageSquare, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FloatingPanel from "../../panel"
import { ContextCard } from "../context"
import { SimulationTab } from "../simulation"
import { SetupGuide } from "../guide"
import { WebsiteAnalyzer } from "../analyzer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Props = {
  id: string
}

const Trigger = ({ id }: Props) => {
  const { types, onSetTrigger, onSaveTrigger, isPending } = useTriggers(id)
  const { data } = useQueryAutomation(id)
  const [showTip, setShowTip] = useState(true)
  const [activeTab, setActiveTab] = useState("setup")
  const [listenMode, setListenMode] = useState<"KEYWORDS" | "ALL_MESSAGES">("KEYWORDS")

  const handleSaveTrigger = () => {
    onSaveTrigger()
    setActiveTab("configure")
  }

  if (data?.data && data?.data?.trigger.length > 0) {
    return (
      <div className="flex flex-col items-center w-full">
        <ActiveTrigger type={data.data.trigger[0].type} keywords={data.data.keywords} />

        {data?.data?.trigger.length > 1 && (
          <>
            <div className="relative w-full md:w-6/12 my-6">
              <p className="absolute transform px-2 -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 bg-background-90 text-text-secondary">
                or
              </p>
              <Separator orientation="horizontal" className="border-muted border-[1px]" />
            </div>
            <ActiveTrigger type={data.data.trigger[1].type} keywords={data.data.keywords} />
          </>
        )}

        {!data.data.listener && <ThenAction id={id} />}
      </div>
    )
  }

  const responseType = data?.data?.listener?.listener || "MESSAGE"

  return (
    <FloatingPanel
      title="Create Automation"
      trigger={
        <motion.div
          className="group relative overflow-hidden rounded-xl mt-4 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>
          <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
            <div className="flex items-center justify-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#768BDD]" />
              <p className="text-[#768BDD] font-bold">Create Automation</p>
            </div>
          </div>
        </motion.div>
      }
    >
      <div className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="setup">
              <Info className="h-4 w-4 mr-1" />
              Guide
            </TabsTrigger>
            <TabsTrigger value="trigger">
              <KeySquare className="h-4 w-4 mr-1" />
              Trigger
            </TabsTrigger>
            <TabsTrigger value="configure">
              <ChevronRight className="h-4 w-4 mr-1" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="simulation">
              <PlayCircle className="h-4 w-4 mr-1" />
              Simulation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <SetupGuide />
          </TabsContent>

          <TabsContent value="trigger" className="space-y-4">
            {showTip && <ContextCard context="trigger" onClose={() => setShowTip(false)} />}

            <h3 className="text-lg font-medium">Select Trigger Type</h3>

            <div className="grid grid-cols-1 gap-3">
              {AUTOMATION_TRIGGERS.map((trigger) => (
                <motion.div
                  key={trigger.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSetTrigger(trigger.type)}
                  className={cn(
                    "rounded-xl flex cursor-pointer flex-col p-4 gap-3",
                    !types?.find((t) => t === trigger.type)
                      ? "bg-background-80"
                      : `bg-gradient-to-br from-[#3352CC] to-[#1C2D70]`,
                  )}
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-black/20 rounded-lg">{trigger.icon}</div>
                    <p className="font-semibold text-white">{trigger.label}</p>
                  </div>
                  <p className="text-sm text-slate-300">{trigger.description}</p>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleSaveTrigger}
              disabled={types?.length === 0}
              className={cn(
                "w-full py-6 text-white font-medium",
                types?.length === 0 ? "bg-in-active" : `bg-gradient-to-br from-[#3352CC] to-[#1C2D70]`,
              )}
            >
              <Loader state={isPending}>Configure</Loader>
            </Button>
          </TabsContent>

          <TabsContent value="configure" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Choose Automation Mode</h3>

                <Alert className="bg-blue-500/10 border-blue-500/30 mb-4">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-500 font-medium">Automation Listening Mode</AlertTitle>
                  <AlertDescription className="text-blue-400">
                    Choose how your automation should respond to messages. You can change this anytime.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      listenMode === "KEYWORDS"
                        ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70] border-[#3352CC]"
                        : "bg-background-80 hover:bg-background-70",
                    )}
                    onClick={() => setListenMode("KEYWORDS")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-black/20 rounded-lg">
                          <KeySquare className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">Keyword Triggers</h4>
                            <Badge variant="outline" className="bg-background-90/20 text-xs">
                              Recommended
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            Only respond when customers use specific keywords you define
                          </p>
                          <div className="space-y-1 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                              <span>More targeted responses</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                              <span>Better control over when automation triggers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                              <span>Prevents unwanted responses</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      listenMode === "ALL_MESSAGES"
                        ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480] border-[#7C21D6]"
                        : "bg-background-80 hover:bg-background-70",
                    )}
                    onClick={() => setListenMode("ALL_MESSAGES")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-black/20 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">Listen to Everything</h4>
                            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 text-xs">
                              Advanced
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            Respond to any message, continuing conversations naturally
                          </p>
                          <div className="space-y-1 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                              <span>Natural conversation flow</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                              <span>Continues conversations after hours/days</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                              <span>More human-like interaction</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {listenMode === "KEYWORDS" && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Configure Keywords</h3>
                  <Keywords id={id} />
                </div>
              )}

              {listenMode === "ALL_MESSAGES" && (
                <Alert className="bg-purple-500/10 border-purple-500/30">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <AlertTitle className="text-purple-500 font-medium">Open Listener Mode</AlertTitle>
                  <AlertDescription className="text-purple-400">
                    Your automation will respond to any message from customers, allowing for natural conversation flow.
                    This works great with AI-powered responses that can understand context and provide relevant replies.
                  </AlertDescription>
                </Alert>
              )}

              {responseType === "SMARTAI" && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Analyze Your Business</h3>
                  <WebsiteAnalyzer
                    onAnalysisComplete={(analysis) => {
                      console.log("Website analysis complete:", analysis)
                    }}
                  />
                </div>
              )}
            </div>

            <Button
              onClick={onSaveTrigger}
              disabled={types?.length === 0}
              className={cn(
                "w-full py-6 text-white font-medium",
                types?.length === 0
                  ? "bg-in-active"
                  : listenMode === "ALL_MESSAGES"
                    ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]"
                    : "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]",
              )}
            >
              <Loader state={isPending}>Save Configuration</Loader>
            </Button>
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationTab
              keywords={data?.data?.keywords?.map((k) => k.word) || []}
              responseMessage={data?.data?.listener?.prompt || ""}
              responseType={data?.data?.listener?.listener || "MESSAGE"}
            />
          </TabsContent>
        </Tabs>
      </div>
    </FloatingPanel>
  )
}

export default Trigger
