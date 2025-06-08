
// "use client"

// import { Input } from "@/components/ui/input"
// import { useKeywords } from "@/hooks/use-automations"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import { X, Tag } from "lucide-react"
// import { motion } from "framer-motion"
// import { KeywordSuggestions } from "../suggestions"
// import { useState } from "react"
// import { ContextCard } from "../context"

// type Props = {
//   id: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
//   animationSpeed?: number
// }

// export const Keywords = ({
//   id,
//   theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
//   animationSpeed = 1,
// }: Props) => {
//   const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
//   const { latestVariable } = useMutationDataState(["add-keyword"])
//   const { data } = useQueryAutomation(id)
//   const [showTip, setShowTip] = useState(true)

//   // Function to handle adding a keyword from suggestions
//   const handleAddKeyword = (newKeyword: string) => {
//     // Call the addKeyword function directly
//     addKeyword(newKeyword)
//   }

//   // Get the first keyword for suggestions, or use a default
//   const getFirstKeyword = () => {
//     if (data?.data?.keywords && data.data.keywords.length > 0) {
//       return data.data.keywords[0].word
//     }
//     return "help" // Default keyword if none exists
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       style={{ transition: `all ${0.3 / animationSpeed}s ease-in-out` }}
//       className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl"
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <Tag className="h-4 w-4 mr-2 text-light-blue" />
//           <p className="text-sm font-medium">Trigger Keywords</p>
//         </div>
//         {data?.data?.keywords && data?.data?.keywords.length > 0 && (
//           <KeywordSuggestions keyword={getFirstKeyword()} onAddKeyword={handleAddKeyword} />
//         )}
//       </div>

//       {showTip && <ContextCard context="keywords" onClose={() => setShowTip(false)} />}

//       <div className="flex flex-wrap justify-start gap-2 items-center p-2 bg-background-90 rounded-lg min-h-[50px]">
//         {data?.data?.keywords &&
//           data?.data?.keywords.length > 0 &&
//           data?.data?.keywords.map(
//             (word) =>
//               word.id !== latestVariable?.variables?.id && (
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   key={word.id}
//                   style={{ transition: `all ${0.2 / animationSpeed}s ease-in-out` }}
//                   className={`bg-${theme.primary}/20 text-${theme.primary} flex items-center gap-x-2 capitalize py-1 px-4 rounded-full group`}
//                 >
//                   <p>{word.word}</p>
//                   <X className="cursor-pointer hover:text-red-500" onClick={() => deleteMutation({ id: word.id })} />
//                 </motion.div>
//               ),
//           )}

//         {latestVariable && latestVariable.status === "pending" && (
//           <div
//             className={`bg-${theme.primary}/20 text-${theme.primary} flex items-center gap-x-2 capitalize py-1 px-4 rounded-full`}
//           >
//             {latestVariable.variables.keyword}
//           </div>
//         )}

//         <Input
//           placeholder="Add a keyword..."
//           style={{
//             width: Math.min(Math.max(keyword.length || 10, 2), 50) + "ch",
//           }}
//           value={keyword}
//           className="p-0 bg-transparent ring-0 border-none outline-none"
//           onChange={onValueChange}
//           onKeyUp={onKeyPress}
//         />
//       </div>

//       <div className="text-xs text-text-secondary flex items-center">
//         <span className="bg-light-blue/20 text-light-blue rounded-full w-4 h-4 inline-flex items-center justify-center mr-1 text-[10px]">
//           i
//         </span>
//         Press Enter to add each keyword. Add 3-5 keywords for best results.
//       </div>
//     </motion.div>
//   )
// }

// export default Keywords

// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Trash2, Plus, AlertCircle, Brain, Clock, Target, Zap } from "lucide-react"
// import { useKeywords } from "@/hooks/use-automations"
// import { Textarea } from "@/components/ui/textarea"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// type Props = {
//   id: string
//   triggerType?: string
//   keywords?: { id: string; word: string }[]
// }

// const Keywords = ({ id, triggerType = "KEYWORDS", keywords = [] }: Props) => {
//   const { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
//   const [businessHours, setBusinessHours] = useState({
//     enabled: false,
//     startTime: "09:00",
//     endTime: "17:00",
//     timezone: "America/New_York",
//     daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
//   })
//   const [aiSettings, setAiSettings] = useState({
//     sensitivity: 70,
//     priorityTopics: "",
//     ignoreSpam: true,
//     detectLanguage: true,
//   })

//   const onAddKeyword = (keywordToAdd: string) => {
//     addKeyword(keywordToAdd)
//   }

//   const onRemoveKeyword = (keywordId: string) => {
//     deleteMutation({ id: keywordId })
//   }

//   const renderTriggerModeUI = () => {
//     switch (triggerType) {
//       case "KEYWORDS":
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Target className="h-5 w-5 text-blue-500" />
//               <h3 className="text-base font-medium">Keyword Triggers</h3>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Enter keywords or phrases that will trigger your automation. Be specific to avoid false positives.
//             </p>
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Enter keyword or phrase..."
//                 value={keyword}
//                 onChange={onValueChange}
//                 onKeyDown={onKeyPress}
//               />
//               <Button
//                 onClick={() => onAddKeyword(keyword)}
//                 disabled={!keyword}
//                 variant="outline"
//               >
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>

//             <div className="flex flex-wrap gap-2 mt-2">
//               {keywords?.map((k: { id: string; word: string }) => (
//                 <div key={k.id} className="bg-background-80 rounded-full px-3 py-1 flex items-center gap-1 text-sm">
//                   <span>{k.word}</span>
//                   <button onClick={() => onRemoveKeyword(k.id)}>
//                     <Trash2 className="h-3 w-3 text-red-500" />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {keywords?.length === 0 && (
//               <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>No keywords added</AlertTitle>
//                 <AlertDescription>Add at least one keyword to trigger your automation.</AlertDescription>
//               </Alert>
//             )}
//           </div>
//         )

//       case "ANY_MESSAGE":
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Zap className="h-5 w-5 text-purple-500" />
//               <h3 className="text-base font-medium">Universal Response</h3>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Your automation will respond to any message or comment. This is great for general inquiries.
//             </p>

//             <Alert className="bg-purple-500/10 border-purple-500/20">
//               <AlertCircle className="h-4 w-4 text-purple-500" />
//               <AlertTitle>Universal Response Mode</AlertTitle>
//               <AlertDescription>
//                 This mode will respond to all messages. Consider setting business hours to avoid responding at
//                 inappropriate times.
//               </AlertDescription>
//             </Alert>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm">Business Hours</CardTitle>
//                 <CardDescription>Only respond during specific hours</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="business-hours"
//                       checked={businessHours.enabled}
//                       onCheckedChange={(checked) => setBusinessHours({ ...businessHours, enabled: checked })}
//                     />
//                     <Label htmlFor="business-hours">Enable business hours</Label>
//                   </div>

//                   {businessHours.enabled && (
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="start-time">Start Time</Label>
//                         <Input
//                           id="start-time"
//                           type="time"
//                           value={businessHours.startTime}
//                           onChange={(e) => setBusinessHours({ ...businessHours, startTime: e.target.value })}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="end-time">End Time</Label>
//                         <Input
//                           id="end-time"
//                           type="time"
//                           value={businessHours.endTime}
//                           onChange={(e) => setBusinessHours({ ...businessHours, endTime: e.target.value })}
//                         />
//                       </div>
//                       <div className="col-span-2 space-y-2">
//                         <Label htmlFor="timezone">Timezone</Label>
//                         <Select
//                           value={businessHours.timezone}
//                           onValueChange={(value) => setBusinessHours({ ...businessHours, timezone: value })}
//                         >
//                           <SelectTrigger id="timezone">
//                             <SelectValue placeholder="Select timezone" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
//                             <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
//                             <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
//                             <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
//                             <SelectItem value="Europe/London">London (GMT)</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )

//       case "SMART_AI":
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Brain className="h-5 w-5 text-yellow-500" />
//               <h3 className="text-base font-medium">AI Smart Filter</h3>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Our AI will analyze message intent and respond intelligently. Configure how the AI should behave.
//             </p>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm">AI Sensitivity</CardTitle>
//                 <CardDescription>How selective should the AI be when deciding to respond?</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-xs text-muted-foreground">Respond to more messages</span>
//                       <span className="text-xs text-muted-foreground">Be more selective</span>
//                     </div>
//                     <Slider
//                       defaultValue={[aiSettings.sensitivity]}
//                       max={100}
//                       step={1}
//                       onValueChange={(value) => setAiSettings({ ...aiSettings, sensitivity: value[0] })}
//                     />
//                     <div className="text-center text-sm font-medium">{aiSettings.sensitivity}%</div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="priority-topics">Priority Topics</Label>
//                     <Textarea
//                       id="priority-topics"
//                       placeholder="Enter topics your business specializes in, separated by commas..."
//                       value={aiSettings.priorityTopics}
//                       onChange={(e) => setAiSettings({ ...aiSettings, priorityTopics: e.target.value })}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       The AI will prioritize messages related to these topics
//                     </p>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="ignore-spam"
//                       checked={aiSettings.ignoreSpam}
//                       onCheckedChange={(checked) => setAiSettings({ ...aiSettings, ignoreSpam: checked })}
//                     />
//                     <Label htmlFor="ignore-spam">Ignore spam and promotional messages</Label>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="detect-language"
//                       checked={aiSettings.detectLanguage}
//                       onCheckedChange={(checked) => setAiSettings({ ...aiSettings, detectLanguage: checked })}
//                     />
//                     <Label htmlFor="detect-language">Auto-detect message language</Label>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )

//       case "SCHEDULED":
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Clock className="h-5 w-5 text-green-500" />
//               <h3 className="text-base font-medium">Time-Based Triggers</h3>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Schedule your automations to run at specific times or intervals.
//             </p>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm">Schedule Configuration</CardTitle>
//                 <CardDescription>Set when your automation should run</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="schedule-type">Schedule Type</Label>
//                     <Select defaultValue="daily">
//                       <SelectTrigger id="schedule-type">
//                         <SelectValue placeholder="Select schedule type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="daily">Daily</SelectItem>
//                         <SelectItem value="weekly">Weekly</SelectItem>
//                         <SelectItem value="monthly">Monthly</SelectItem>
//                         <SelectItem value="custom">Custom</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="time">Time</Label>
//                       <Input id="time" type="time" defaultValue="09:00" />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="timezone">Timezone</Label>
//                       <Select defaultValue="America/New_York">
//                         <SelectTrigger id="timezone">
//                           <SelectValue placeholder="Select timezone" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
//                           <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
//                           <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
//                           <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
//                           <SelectItem value="Europe/London">London (GMT)</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )

//       default:
//         return (
//           <div className="space-y-4">
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Select a trigger mode</AlertTitle>
//               <AlertDescription>Please select a trigger mode to configure your automation.</AlertDescription>
//             </Alert>
//           </div>
//         )
//     }
//   }

//   return <div className="space-y-6">{renderTriggerModeUI()}</div>
// }

// export default Keywords


"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, AlertCircle, Brain, Clock, Target, Zap } from "lucide-react"
import { useKeywords } from "@/hooks/use-automations"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  id: string
  triggerType?: string
  keywords?: { id: string; word: string }[]
}

const Keywords = ({ id, triggerType = "KEYWORDS", keywords = [] }: Props) => {
  const { keyword, onValueChange, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
  const [businessHours, setBusinessHours] = useState({
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
    timezone: "America/New_York",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  })
  const [aiSettings, setAiSettings] = useState({
    sensitivity: 70,
    priorityTopics: "",
    ignoreSpam: true,
    detectLanguage: true,
  })

  const onAddKeyword = (keywordToAdd: string) => {
    addKeyword(keywordToAdd)
  }

  const onRemoveKeyword = (keywordId: string) => {
    deleteMutation({ id: keywordId })
  }

  const renderTriggerModeUI = () => {
    switch (triggerType) {
      case "KEYWORDS":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="text-base font-medium">Keyword Triggers</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter keywords or phrases that will trigger your automation. Be specific to avoid false positives.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword or phrase..."
                value={keyword}
                onChange={onValueChange}
                onKeyDown={onKeyPress}
              />
              <Button
                onClick={() => onAddKeyword(keyword)}
                disabled={!keyword}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {keywords?.length === 0 ? (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No keywords added</AlertTitle>
                <AlertDescription>Add at least one keyword to trigger your automation.</AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-wrap gap-2">
                {keywords?.map((k: { id: string; word: string }) => (
                  <div key={k.id} className="bg-background-80 rounded-full px-3 py-1 flex items-center gap-1 text-sm">
                    <span>{k.word}</span>
                    <button onClick={() => onRemoveKeyword(k.id)}>
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "ANY_MESSAGE":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <h3 className="text-base font-medium">Universal Response</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your automation will respond to any message or comment. This is great for general inquiries.
            </p>

            <Alert className="bg-purple-500/10 border-purple-500/20">
              <AlertCircle className="h-4 w-4 text-purple-500" />
              <AlertTitle>Universal Response Mode</AlertTitle>
              <AlertDescription>
                This mode will respond to all messages. Consider setting business hours to avoid responding at
                inappropriate times.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Business Hours</CardTitle>
                <CardDescription>Only respond during specific hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="business-hours"
                      checked={businessHours.enabled}
                      onCheckedChange={(checked) => setBusinessHours({ ...businessHours, enabled: checked })}
                    />
                    <Label htmlFor="business-hours">Enable business hours</Label>
                  </div>

                  {businessHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={businessHours.startTime}
                          onChange={(e) => setBusinessHours({ ...businessHours, startTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={businessHours.endTime}
                          onChange={(e) => setBusinessHours({ ...businessHours, endTime: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={businessHours.timezone}
                          onValueChange={(value) => setBusinessHours({ ...businessHours, timezone: value })}
                        >
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "SMART_AI":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-yellow-500" />
              <h3 className="text-base font-medium">AI Smart Filter</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Our AI will analyze message intent and respond intelligently. Configure how the AI should behave.
            </p>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Sensitivity</CardTitle>
                <CardDescription>How selective should the AI be when deciding to respond?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Respond to more messages</span>
                      <span className="text-xs text-muted-foreground">Be more selective</span>
                    </div>
                    <Slider
                      defaultValue={[aiSettings.sensitivity]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setAiSettings({ ...aiSettings, sensitivity: value[0] })}
                    />
                    <div className="text-center text-sm font-medium">{aiSettings.sensitivity}%</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority-topics">Priority Topics</Label>
                    <Textarea
                      id="priority-topics"
                      placeholder="Enter topics your business specializes in, separated by commas..."
                      value={aiSettings.priorityTopics}
                      onChange={(e) => setAiSettings({ ...aiSettings, priorityTopics: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      The AI will prioritize messages related to these topics
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ignore-spam"
                      checked={aiSettings.ignoreSpam}
                      onCheckedChange={(checked) => setAiSettings({ ...aiSettings, ignoreSpam: checked })}
                    />
                    <Label htmlFor="ignore-spam">Ignore spam and promotional messages</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="detect-language"
                      checked={aiSettings.detectLanguage}
                      onCheckedChange={(checked) => setAiSettings({ ...aiSettings, detectLanguage: checked })}
                    />
                    <Label htmlFor="detect-language">Auto-detect message language</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "SCHEDULED":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <h3 className="text-base font-medium">Time-Based Triggers</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Schedule your automations to run at specific times or intervals.
            </p>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Schedule Configuration</CardTitle>
                <CardDescription>Set when your automation should run</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-type">Schedule Type</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="schedule-type">
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="America/New_York">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Select a trigger mode</AlertTitle>
              <AlertDescription>Please select a trigger mode to configure your automation.</AlertDescription>
            </Alert>
          </div>
        )
    }
  }

  return <div className="space-y-6">{renderTriggerModeUI()}</div>
}

export default Keywords