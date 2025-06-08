
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
import { AUTOMATION_TRIGGERS } from "@/constants/automation-triggers"
import { useTriggers } from "@/hooks/use-automations"
import { cn } from "@/lib/utils"
import Keywords from "./keywords"
import { Button } from "@/components/ui/button"
import Loader from "../../loader"
import { useQueryAutomation } from "@/hooks/user-queries"
import { motion } from "framer-motion"
import { PlusCircle, PlayCircle, Info, KeySquare, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FloatingPanel from "../../panel"
import { ContextCard } from "../context"
import { SimulationTab } from "../simulation"
import { SetupGuide } from "../guide"
import { WebsiteAnalyzer } from "../analyzer"
import TriggerModeSelector from "./trigger-selector"

type Props = {
  id: string
}

const Trigger = ({ id }: Props) => {
  const { types, onSetTrigger, onSaveTrigger, isPending } = useTriggers(id)
  const { data } = useQueryAutomation(id)
  const [showTip, setShowTip] = useState(true)
  const [activeTab, setActiveTab] = useState("setup")
  const [triggerMode, setTriggerMode] = useState("KEYWORDS") // Default to KEYWORDS

  const handleSaveTrigger = () => {
    onSaveTrigger()
    setActiveTab("configure")
  }

  const handleTriggerModeSelect = (type: string) => {
    setTriggerMode(type)
  }

  if (data?.data && data?.data?.trigger.length > 0) {
    return (
      <div className="flex flex-col items-center w-full">
        <ActiveTrigger type={data.data.trigger[0].type} keywords={data.data.keywords} triggerMode={triggerMode} />

        {data?.data?.trigger.length > 1 && (
          <>
            <div className="relative w-full md:w-6/12 my-6">
              <p className="absolute transform px-2 -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 bg-background-90 text-text-secondary">
                or
              </p>
              <Separator orientation="horizontal" className="border-muted border-[1px]" />
            </div>
            <ActiveTrigger type={data.data.trigger[1].type} keywords={data.data.keywords} triggerMode={triggerMode} />
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
          {/* Border with animation */}
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

          {/* Inner content */}
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
                <h3 className="text-lg font-medium mb-3">Select Trigger Mode</h3>
                <TriggerModeSelector selectedType={triggerMode} onSelect={handleTriggerModeSelect} />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Configure Automation</h3>
                <Keywords id={id} triggerType={triggerMode} />
              </div>

              {(triggerMode === "SMART_AI" || responseType === "SMARTAI") && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Analyze Your Business</h3>
                  <WebsiteAnalyzer
                    onAnalysisComplete={(analysis) => {
                      console.log("Website analysis complete:", analysis)
                      // Handle adding the suggested keywords and response
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
                types?.length === 0 ? "bg-in-active" : `bg-gradient-to-br from-[#3352CC] to-[#1C2D70]`,
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
              triggerMode={triggerMode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </FloatingPanel>
  )
}

export default Trigger
