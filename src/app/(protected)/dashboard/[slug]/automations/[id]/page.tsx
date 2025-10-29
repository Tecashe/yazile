// "use client"

// import { useParams } from "next/navigation"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import { useAutomationPosts } from "@/hooks/use-automations"
// import { useTriggers } from "@/hooks/use-automations"
// import { useKeywords } from "@/hooks/use-automations"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { PlatformTriggerNode } from "@/components/global/automations/platform-tabs/automations/platform-trigger-node"
// import { PlatformResponseNode } from "@/components/global/automations/platform-tabs/automations/platform-response-node"
// import { PlatformActionNode } from "@/components/global/automations/platform-tabs/automations/platform-action-node"
// import { PLATFORM_CONFIG } from "@/lib/constants/platform"
// import { useState } from "react"

// export default function AutomationDetailPage() {
//   const params = useParams()
//   const automationId = params.id as string
//   const { data: automation, isLoading } = useQueryAutomation(automationId)
//   const { types, onSetTrigger, onSaveTrigger } = useTriggers(automationId)
//   const { keyword, onValueChange, onKeyPress, addKeyword } = useKeywords(automationId)
//   const { posts, onSelectPost, mutate: savePosts, isPending } = useAutomationPosts(automationId)

//   const [isEditingTrigger, setIsEditingTrigger] = useState(false)
//   const [isEditingResponse, setIsEditingResponse] = useState(false)
//   const [isEditingActions, setIsEditingActions] = useState(false)
//   const [responseContent, setResponseContent] = useState("")
//   const [selectedActions, setSelectedActions] = useState<string[]>([])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading automation...</p>
//       </div>
//     )
//   }

//   if (!automation?.data) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Automation not found</p>
//       </div>
//     )
//   }

//   const automationData = automation.data
//   const platformConfig = PLATFORM_CONFIG[automationData.platform]

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto py-8 px-4">
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <span className="text-3xl">{platformConfig.icon}</span>
//             <div>
//               <h1 className="text-3xl font-bold">{automationData.name}</h1>
//               <p className="text-muted-foreground">{platformConfig.name} Automation</p>
//             </div>
//           </div>
//         </div>

//         <Tabs defaultValue="flow" className="space-y-6">
//           <TabsList>
//             <TabsTrigger value="flow">Automation Flow</TabsTrigger>
//             <TabsTrigger value="keywords">Keywords</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>

//           <TabsContent value="flow" className="space-y-6">
//             <div className="grid gap-6">
//               <PlatformTriggerNode
//                 platform={automationData.platform}
//                 triggerType={automationData.trigger?.type}
//                 onTriggerSelect={(type) => onSetTrigger(type as any)}
//                 isEditing={isEditingTrigger}
//               />

//               <PlatformResponseNode
//                 platform={automationData.platform}
//                 responseType={automationData.listener?.listener}
//                 responseContent={responseContent}
//                 onResponseTypeSelect={() => {}}
//                 onResponseContentChange={setResponseContent}
//                 isEditing={isEditingResponse}
//               />

//               <PlatformActionNode
//                 platform={automationData.platform}
//                 selectedActions={selectedActions}
//                 onActionToggle={(action) => {
//                   setSelectedActions((prev) =>
//                     prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action],
//                   )
//                 }}
//                 isEditing={isEditingActions}
//               />

//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => setIsEditingTrigger(!isEditingTrigger)}
//                   variant={isEditingTrigger ? "default" : "outline"}
//                 >
//                   {isEditingTrigger ? "Done" : "Edit Trigger"}
//                 </Button>
//                 <Button
//                   onClick={() => setIsEditingResponse(!isEditingResponse)}
//                   variant={isEditingResponse ? "default" : "outline"}
//                 >
//                   {isEditingResponse ? "Done" : "Edit Response"}
//                 </Button>
//                 <Button
//                   onClick={() => setIsEditingActions(!isEditingActions)}
//                   variant={isEditingActions ? "default" : "outline"}
//                 >
//                   {isEditingActions ? "Done" : "Edit Actions"}
//                 </Button>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="keywords" className="space-y-4">
//             <Card className="p-4">
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">Add Keywords</label>
//                   <div className="flex gap-2 mt-2">
//                     <input
//                       type="text"
//                       value={keyword}
//                       onChange={onValueChange}
//                       onKeyPress={onKeyPress}
//                       placeholder="Enter keyword and press Enter"
//                       className="flex-1 px-3 py-2 border rounded-md"
//                     />
//                     <Button onClick={() => addKeyword(keyword)}>Add</Button>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium mb-2">Current Keywords</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {automationData.keywords?.map((kw: any) => (
//                       <div
//                         key={kw.id}
//                         className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
//                       >
//                         {kw.word}
//                         <button onClick={() => {}} className="hover:opacity-70">
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </TabsContent>

//           <TabsContent value="settings" className="space-y-4">
//             <Card className="p-4">
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">Automation Name</label>
//                   <input
//                     type="text"
//                     defaultValue={automationData.name}
//                     className="w-full px-3 py-2 border rounded-md mt-1"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Listen Mode</label>
//                   <select className="w-full px-3 py-2 border rounded-md mt-1">
//                     <option value="KEYWORDS">Keywords Only</option>
//                     <option value="ALL_MESSAGES">All Messages</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Fallback Message</label>
//                   <textarea
//                     defaultValue={automationData.fallbackMessage || ""}
//                     placeholder="Message to send when no keywords match"
//                     className="w-full px-3 py-2 border rounded-md mt-1 min-h-24"
//                   />
//                 </div>
//               </div>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }



"use client"

import { useParams } from "next/navigation"
import { useQueryAutomation } from "@/hooks/user-queries"
import { useAutomationPosts } from "@/hooks/use-automations"
import { useTriggers } from "@/hooks/use-automations"
import { useKeywords } from "@/hooks/use-automations"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformTriggerNode } from "@/components/global/automations/platform-tabs/automations/platform-trigger-node"
import { PlatformResponseNode } from "@/components/global/automations/platform-tabs/automations/platform-response-node"
import { PlatformActionNode } from "@/components/global/automations/platform-tabs/automations/platform-action-node"
import { PLATFORM_CONFIG } from "@/lib/constants/platform"
import { useState } from "react"
import type { Automation } from "@/types/automation"

export default function AutomationDetailPage() {
  const params = useParams()
  const automationId = params.id as string
  const { data: automation, isLoading } = useQueryAutomation(automationId)
  const { types, onSetTrigger, onSaveTrigger } = useTriggers(automationId)
  const { keyword, onValueChange, onKeyPress, addKeyword } = useKeywords(automationId)
  const { posts, onSelectPost, mutate: savePosts, isPending } = useAutomationPosts(automationId)

  const [isEditingTrigger, setIsEditingTrigger] = useState(false)
  const [isEditingResponse, setIsEditingResponse] = useState(false)
  const [isEditingActions, setIsEditingActions] = useState(false)
  const [responseContent, setResponseContent] = useState("")
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading automation...</p>
      </div>
    )
  }

  if (!automation?.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Automation not found</p>
      </div>
    )
  }

  const automationData = automation.data as unknown as Automation
  const platformConfig = PLATFORM_CONFIG[automationData.platform]
  const firstTrigger = automationData.trigger?.[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{platformConfig.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{automationData.name}</h1>
              <p className="text-muted-foreground">{platformConfig.name} Automation</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="flow" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flow">Automation Flow</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="space-y-6">
            <div className="grid gap-6">
              <PlatformTriggerNode
                platform={automationData.platform}
                triggerType={firstTrigger?.type}
                onTriggerSelect={(type) => onSetTrigger(type as any)}
                isEditing={isEditingTrigger}
              />

              <PlatformResponseNode
                platform={automationData.platform}
                responseType={automationData.listener?.listener}
                responseContent={automationData.listener?.prompt || responseContent}
                onResponseTypeSelect={() => {}}
                onResponseContentChange={setResponseContent}
                isEditing={isEditingResponse}
              />

              <PlatformActionNode
                platform={automationData.platform}
                selectedActions={selectedActions}
                onActionToggle={(action) => {
                  setSelectedActions((prev) =>
                    prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action],
                  )
                }}
                isEditing={isEditingActions}
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditingTrigger(!isEditingTrigger)}
                  variant={isEditingTrigger ? "default" : "outline"}
                >
                  {isEditingTrigger ? "Done" : "Edit Trigger"}
                </Button>
                <Button
                  onClick={() => setIsEditingResponse(!isEditingResponse)}
                  variant={isEditingResponse ? "default" : "outline"}
                >
                  {isEditingResponse ? "Done" : "Edit Response"}
                </Button>
                <Button
                  onClick={() => setIsEditingActions(!isEditingActions)}
                  variant={isEditingActions ? "default" : "outline"}
                >
                  {isEditingActions ? "Done" : "Edit Actions"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Add Keywords</label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={onValueChange}
                      onKeyPress={onKeyPress}
                      placeholder="Enter keyword and press Enter"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button onClick={() => addKeyword(keyword)}>Add</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Current Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {automationData.keywords?.map((kw) => (
                      <div
                        key={kw.id}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {kw.word}
                        <button onClick={() => {}} className="hover:opacity-70">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Automation Name</label>
                  <input
                    type="text"
                    defaultValue={automationData.name}
                    className="w-full px-3 py-2 border rounded-md mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Listen Mode</label>
                  <select className="w-full px-3 py-2 border rounded-md mt-1">
                    <option value="KEYWORDS">Keywords Only</option>
                    <option value="ALL_MESSAGES">All Messages</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Fallback Message</label>
                  <textarea
                    defaultValue={automationData.fallbackMessage || ""}
                    placeholder="Message to send when no keywords match"
                    className="w-full px-3 py-2 border rounded-md mt-1 min-h-24"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}













// import { getAutomationInfo } from "@/actions/automations"
// import PostNode from "@/components/global/automations/post/node"
// import ThenNode from "@/components/global/automations/then/node"
// import TestAutomation from "@/components/global/automations/test/test-automation"
// import Trigger from "@/components/global/automations/trigger"
// import AutomationsBreadCrumb from "@/components/global/bread-crumbs/automations"


// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
// import { PrefetchUserAutomation } from "@/react-query/prefetch"

// type Props = {
//   params: { id: string }
// }

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const info = await getAutomationInfo(params.id)
//   return {
//     title: info.data?.name,
//   }
// }

// const Page = async ({ params }: Props) => {
//   const query = new QueryClient()
//   await PrefetchUserAutomation(query, params.id)

//   return (
//     <HydrationBoundary state={dehydrate(query)}>
//       <div className="flex flex-col items-center gap-y-12 py-6">
//         <div className="w-full max-w-4xl">
//           <AutomationsBreadCrumb id={params.id} />
//         </div>

//         {/* Header with gradient */}
//         <div className="w-full max-w-4xl bg-gradient-to-r from-[#2A2A2A] to-[#1D1D1D] p-6 rounded-xl shadow-lg">
//           <h1 className="text-2xl font-bold text-white/90 mb-2">Automation Flow</h1>
//           <p className="text-white/60 text-sm">Configure your automation sequence below</p>
//         </div>

      

//         {/* When section with improved styling and animated SVG */}
//         <div className="w-full max-w-4xl p-6 rounded-xl flex flex-col bg-[#1D1D1D] gap-y-4 border border-[#333333] shadow-lg relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
//           <div className="flex items-center gap-x-3">
//             <div className="p-2 rounded-full bg-[#2A2A2A] flex items-center justify-center">
//               <svg
//                 className="w-6 h-6 text-yellow-500 animate-spin-slow"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
//                   fill="currentColor"
//                 />
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M12 3C12.5523 3 13 3.44772 13 4V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V4C11 3.44772 11.4477 3 12 3ZM3 12C3 11.4477 3.44772 11 4 11H6C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H4C3.44772 13 3 12.5523 3 12ZM17 12C17 11.4477 17.4477 11 18 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H18C17.4477 13 17 12.5523 17 12ZM12 17C12.5523 17 13 17.4477 13 18V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V18C11 17.4477 11.4477 17 12 17Z"
//                   fill="currentColor"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-white/90">When...</h2>
//           </div>
//           <Trigger id={params.id} />
//         </div>

       
//         {/* Then section */}
//         <div className="w-full max-w-4xl">
//           <ThenNode id={params.id} />
//         </div>

  
//         {/* Post section */}
//         <div className="w-full max-w-4xl">
//           <PostNode id={params.id} />
//         </div>

       

//         {/* Test Automation section */}
//         <div className="w-full max-w-4xl mb-10">
//           <TestAutomation id={params.id} />
//         </div>

//         {/* Status indicator */}
//         <div className="fixed bottom-6 right-6 bg-[#1D1D1D] p-3 rounded-full shadow-lg border border-[#333333] flex items-center gap-x-2">
//           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//           <span className="text-white/80 text-sm">Automated</span>
//         </div>
//       </div>
//     </HydrationBoundary>
//   )
// }

// export default Page










//WITH ADDITIONAL NODES
// import { getAutomationInfo } from "@/actions/automations"
// import PostNode from "@/components/global/automations/post/node"
// import ThenNode from "@/components/global/automations/then/node"
// import TestAutomation from "@/components/global/automations/test/test-automation"
// import Trigger from "@/components/global/automations/trigger"
// import AutomationsBreadCrumb from "@/components/global/bread-crumbs/automations"
// import { UserFilterNode } from "@/components/global/automations/nodes/user-filter-node"
// import { BranchNode } from "@/components/global/automations/nodes/branch-node"
// import { TimeWindowNode } from "@/components/global/automations/nodes/time-window-node"
// import { DelayNode } from "@/components/global/automations/nodes/delay-node"
// import { RateLimiterNode } from "@/components/global/automations/nodes/rate-limiter-node"
// import { WebhookNode } from "@/components/global/automations/nodes/webhook-node"

// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
// import { PrefetchUserAutomation } from "@/react-query/prefetch"

// type Props = {
//   params: { id: string }
// }

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const info = await getAutomationInfo(params.id)
//   return {
//     title: info.data?.name,
//   }
// }

// const Page = async ({ params }: Props) => {
//   const query = new QueryClient()
//   await PrefetchUserAutomation(query, params.id)

//   return (
//     <HydrationBoundary state={dehydrate(query)}>
//       <div className="flex flex-col items-center gap-y-12 py-6">
//         <div className="w-full max-w-4xl">
//           <AutomationsBreadCrumb id={params.id} />
//         </div>

//         {/* Header with gradient */}
//         <div className="w-full max-w-4xl bg-gradient-to-r from-[#2A2A2A] to-[#1D1D1D] p-6 rounded-xl shadow-lg">
//           <h1 className="text-2xl font-bold text-white/90 mb-2">Automation Flow</h1>
//           <p className="text-white/60 text-sm">Configure your automation sequence below</p>
//         </div>

//         {/* When section with improved styling and animated SVG */}
//         <div className="w-full max-w-4xl p-6 rounded-xl flex flex-col bg-[#1D1D1D] gap-y-4 border border-[#333333] shadow-lg relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
//           <div className="flex items-center gap-x-3">
//             <div className="p-2 rounded-full bg-[#2A2A2A] flex items-center justify-center">
//               <svg
//                 className="w-6 h-6 text-yellow-500 animate-spin-slow"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
//                   fill="currentColor"
//                 />
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M12 3C12.5523 3 13 3.44772 13 4V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V4C11 3.44772 11.4477 3 12 3ZM3 12C3 11.4477 3.44772 11 4 11H6C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H4C3.44772 13 3 12.5523 3 12ZM17 12C17 11.4477 17.4477 11 18 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H18C17.4477 13 17 12.5523 17 12ZM12 17C12.5523 17 13 17.4477 13 18V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V18C11 17.4477 11.4477 17 12 17Z"
//                   fill="currentColor"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-white/90">When...</h2>
//           </div>
//           <Trigger id={params.id} />
//         </div>

//         <div className="w-full max-w-4xl">
//           <UserFilterNode id={params.id} />
//         </div>

//         <div className="w-full max-w-4xl">
//           <BranchNode id={params.id} />
//         </div>

//         <div className="w-full max-w-4xl">
//           <TimeWindowNode id={params.id} />
//         </div>

//         <div className="w-full max-w-4xl">
//           <DelayNode id={params.id} />
//         </div>

//         <div className="w-full max-w-4xl">
//           <RateLimiterNode id={params.id} />
//         </div>

//         {/* Then section */}
//         <div className="w-full max-w-4xl">
//           <ThenNode id={params.id} />
//         </div>

//         {/* Post section */}
//         <div className="w-full max-w-4xl">
//           <PostNode id={params.id} />
//         </div>

//         <div className="w-full max-w-4xl">
//           <WebhookNode id={params.id} />
//         </div>

//         {/* Test Automation section */}
//         <div className="w-full max-w-4xl mb-10">
//           <TestAutomation id={params.id} />
//         </div>

//         {/* Status indicator */}
//         <div className="fixed bottom-6 right-6 bg-[#1D1D1D] p-3 rounded-full shadow-lg border border-[#333333] flex items-center gap-x-2">
//           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//           <span className="text-white/80 text-sm">Automated</span>
//         </div>
//       </div>
//     </HydrationBoundary>
//   )
// }

// export default Page
