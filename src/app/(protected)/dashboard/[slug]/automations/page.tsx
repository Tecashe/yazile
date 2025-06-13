// 'use client'

// import AutomationList from '@/components/global/automation-list'
// import CreateAutomation from '@/components/global/create-automation'
// import { useQueryAutomations } from '@/hooks/user-queries'
// import { Check, Zap, Sparkles, Rocket } from 'lucide-react'
// import React from 'react'

// const AutomationStatus = ({ count }: { count: number }) => {
//   if (count === 0) {
//     return (
//       <div className="flex items-center gap-2 text-yellow-500">
//         <Zap className="w-10 h-10" />
//         <p>Ready to supercharge your workflow? Create your first automation!</p>
//       </div>
//     )
//   } else if (count < 3) {
//     return (
//       <div className="flex items-center gap-2 text-green-500">
//         <Sparkles className="w-10 h-10" />
//         <p>Great start! You are on your way to automation mastery.</p>
//       </div>
//     )
//   } else {
//     return (
//       <div className="flex items-center gap-2 text-blue-500">
//         <Rocket className="w-10 h-10" />
//         <p>Wow! You are an automation pro. Keep optimizing your workflow!</p>
//       </div>
//     )
//   }
// }

// const Page = () => {
//   const { data } = useQueryAutomations()
//   const automations = data?.data || []

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
//       <div className="lg:col-span-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
//         <AutomationList 
//           id={automations.length > 0 ? automations[0].id : ''}
//         />
//       </div>
//       <div className="lg:col-span-2 lg:sticky lg:top-16">
//         <div className="flex flex-col rounded-xl bg-gradient-to-br from-background-80 to-background-100 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active shadow-lg transition-all duration-300 hover:shadow-xl">
//           <div>
//             <h2 className="text-2xl font-bold mb-4 text-primary">My Automations</h2>
//             <AutomationStatus count={automations.length} />
//           </div>
//           <div className="flex flex-col gap-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background-100">
//             {automations.map((automation) => (
//               <div
//                 key={automation.id}
//                 className="flex items-start justify-between bg-background-90 p-3 rounded-lg transition-all duration-200 hover:bg-background-100"
//               >
//                 <div className="flex flex-col">
//                   <h3 className="font-medium text-primary">
//                     {automation.name}
//                   </h3>
//                   <p className="text-text-secondary text-sm">
//                     {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : 'No Date'}
//                   </p>
//                 </div>
//                 <Check className="text-green-500" />
//               </div>
//             ))}
//           </div>
//           <CreateAutomation />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page

'use client'

import AutomationList from '@/components/global/automation-list'
import CreateAutomation from '@/components/global/create-automation'
import { useQueryAutomations } from '@/hooks/user-queries'
import { Check, Zap, Sparkles, Rocket, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

const AutomationStatus = ({ count, isLoading }: { count: number; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p>Loading your automations...</p>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <Zap className="w-10 h-10" />
        <p>Ready to supercharge your workflow? Create your first automation!</p>
      </div>
    )
  } else if (count < 3) {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <Sparkles className="w-10 h-10" />
        <p>Great start! You are on your way to automation mastery.</p>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2 text-blue-500">
        <Rocket className="w-10 h-10" />
        <p>Wow! You are an automation pro. Keep optimizing your workflow!</p>
      </div>
    )
  }
}

const AutomationSkeleton = () => (
  <div className="flex items-start justify-between bg-background-90 p-3 rounded-lg animate-pulse">
    <div className="flex flex-col gap-2">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="w-5 h-5 bg-gray-300 rounded"></div>
  </div>
)

const Page = () => {
  const { data, isLoading, error, isSuccess } = useQueryAutomations()
  
  // Handle the response structure from your getAllAutomations action
  const automations = data?.data || []
  const hasAutomations = isSuccess && automations.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
      <div className="lg:col-span-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading automations...</span>
          </div>
        ) : (
          <AutomationList 
            id={hasAutomations ? automations[0].id : ''} 
          />
        )}
      </div>
      <div className="lg:col-span-2 lg:sticky lg:top-16">
        <div className="flex flex-col rounded-xl bg-gradient-to-br from-background-80 to-background-100 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active shadow-lg transition-all duration-300 hover:shadow-xl">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">My Automations</h2>
            <AutomationStatus count={automations.length} isLoading={isLoading} />
          </div>
          
          <div className="flex flex-col gap-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background-100">
            {isLoading ? (
              // Show skeleton loading state
              Array.from({ length: 3 }).map((_, index) => (
                <AutomationSkeleton key={index} />
              ))
            ) : error ? (
              <div className="text-red-500 text-center p-4">
                Failed to load automations. Please try again.
              </div>
            ) : automations.length === 0 ? (
              <div className="text-center p-4 text-text-secondary">
                No automations yet. Click the button to create one.
              </div>
            ) : (
              automations.map((automation) => (
                <div
                  key={automation.id}
                  className="flex items-start justify-between bg-background-90 p-3 rounded-lg transition-all duration-200 hover:bg-background-100"
                >
                  <div className="flex flex-col">
                    <h3 className="font-medium text-primary">
                      {automation.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {automation.createdAt ? new Date(automation.createdAt).toLocaleDateString() : 'No Date'}
                    </p>
                  </div>
                  <Check className="text-green-500" />
                </div>
              ))
            )}
          </div>
          
          <CreateAutomation />
        </div>
      </div>
    </div>
  )
}

export default Page