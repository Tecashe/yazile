// 'use client'

// import { ChevronRight, PencilIcon } from 'lucide-react'
// import React from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import ActivateAutomationButton from '../../activate-automation-button'
// import { useQueryAutomation } from '@/hooks/user-queries'
// import { useEditAutomation } from '@/hooks/use-automations'
// import { useMutationDataState } from '@/hooks/use-mutation-data'
// import { Input } from '@/components/ui/input'

// type Props = {
//   id: string
// }

// const AutomationsBreadCrumb = ({ id }: Props) => {
//   const { data } = useQueryAutomation(id)
//   const { edit, enableEdit, inputRef, isPending } = useEditAutomation(id)
//   const { latestVariable } = useMutationDataState(['update-automation'])
//   const pathname = usePathname();

//   // Extract the slug from the pathname
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : ''

//   const automationsLink = `/dashboard/${slug}/automations`
//   const currentAutomationLink = `/dashboard/${slug}/automations/${id}`

//   return (
//     <div className="rounded-full w-full p-5 bg-[#18181B1A] flex items-center">
//       <div className="flex items-center gap-x-3 min-w-0">
//         <Link href={automationsLink} className="text-[#9B9CA0] hover:text-white transition-colors duration-200">
//           Automations
//         </Link>
//         <ChevronRight
//           className="flex-shrink-0"
//           color="#9B9CA0"
//         />
//         <span className="flex gap-x-3 items-center min-w-0">
//           {edit ? (
//             <Input
//               ref={inputRef}
//               placeholder={
//                 isPending ? latestVariable.variables : 'rename'
//               }
//               className="bg-transparent h-auto outline-none text-base border-none p-0"
//             />
//           ) : (
//             <Link 
//               href={currentAutomationLink}
//               className="text-[#9B9CA0] hover:text-white transition-colors duration-200 truncate"
//             >
//               {latestVariable?.variables
//                 ? latestVariable?.variables.name
//                 : data?.data?.name}
//             </Link>
//           )}
//           {edit ? (
//             <></>
//           ) : (
//             <span
//               className="cursor-pointer hover:opacity-75 duration-100 transition flex-shrink-0 mr-4"
//               onClick={enableEdit}
//             >
//               <PencilIcon size={14} />
//             </span>
//           )}
//         </span>
//       </div>

//       <div className="flex items-center gap-x-5 ml-auto">
//         <p className="hidden md:block text-text-secondary/60 text-sm truncate min-w-0">
//           Changes Saved Automatically!
//         </p>
//         <div className="flex gap-x-5 flex-shrink-0">
//           <p className="text-text-secondary text-sm truncate min-w-0">
//             {/* Changes Saved */}
//           </p>
//         </div>
//       </div>
//       <ActivateAutomationButton id={id} />
//     </div>
//   )
// }

// export default AutomationsBreadCrumb

"use client"

import { ChevronRight, PencilIcon, Check, X, Save, Clock, Wifi, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ActivateAutomationButton from "../../activate-automation-button"
import { useQueryAutomation } from "@/hooks/user-queries"
import { useEditAutomation } from "@/hooks/use-automations"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  id: string
}

const AutomationsBreadCrumb = ({ id }: Props) => {
  const { data } = useQueryAutomation(id)
  const { edit, enableEdit, inputRef, isPending } = useEditAutomation(id)
  const { latestVariable } = useMutationDataState(["update-automation"])
  const pathname = usePathname()

  // Enhanced state management
  const [isOnline, setIsOnline] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | "idle">("idle")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Extract the slug from the pathname
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  const automationsLink = `/dashboard/${slug}/automations`
  const currentAutomationLink = `/dashboard/${slug}/automations/${id}`

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Update save status based on mutation state
  useEffect(() => {
    if (isPending) {
      setSaveStatus("saving")
      setHasUnsavedChanges(false)
    } else if (latestVariable) {
      setSaveStatus("saved")
      setLastSaved(new Date())
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }, [isPending, latestVariable])

  // Format last saved time
  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Enhanced save status component
  const SaveStatus = () => {
    const getStatusConfig = () => {
      switch (saveStatus) {
        case "saving":
          return {
            icon: <Save className="w-3 h-3 animate-pulse" />,
            text: "Saving...",
            className: "text-blue-400",
          }
        case "saved":
          return {
            icon: <Check className="w-3 h-3" />,
            text: "Saved",
            className: "text-green-400",
          }
        case "error":
          return {
            icon: <X className="w-3 h-3" />,
            text: "Error",
            className: "text-red-400",
          }
        default:
          return {
            icon: <Clock className="w-3 h-3" />,
            text: lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : "Auto-save enabled",
            className: "text-slate-400",
          }
      }
    }

    const config = getStatusConfig()

    return (
      <div className={cn("flex items-center gap-1.5 text-xs transition-all duration-200", config.className)}>
        {config.icon}
        <span className="hidden sm:inline">{config.text}</span>
      </div>
    )
  }

  // Connection status indicator
  const ConnectionStatus = () => (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs transition-all duration-200",
        isOnline ? "text-green-400" : "text-red-400",
      )}
    >
      {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      <span className="hidden md:inline">{isOnline ? "Online" : "Offline"}</span>
    </div>
  )

  return (
    <div className="rounded-xl w-full p-4 bg-gradient-to-r from-slate-900/40 to-slate-800/40 backdrop-blur-sm border border-slate-700/30 flex items-center shadow-lg">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-x-3 min-w-0">
        <Link
          href={automationsLink}
          className="text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium hover:bg-slate-700/30 px-2 py-1 rounded-md"
        >
          Automations
        </Link>
        <ChevronRight className="flex-shrink-0 text-slate-500" size={16} />
        <div className="flex gap-x-2 items-center min-w-0">
          {edit ? (
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                placeholder={isPending ? latestVariable.variables : "Enter automation name"}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 h-8 text-sm focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
                onChange={() => setHasUnsavedChanges(true)}
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                  onClick={() => {
                    // Handle save logic here
                    setHasUnsavedChanges(false)
                  }}
                >
                  <Check size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => {
                    // Handle cancel logic here
                    setHasUnsavedChanges(false)
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href={currentAutomationLink}
                className="text-slate-300 hover:text-white transition-all duration-200 truncate text-sm font-medium hover:bg-slate-700/30 px-2 py-1 rounded-md"
              >
                {latestVariable?.variables?.name || data?.data?.name || "Untitled Automation"}
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/30 transition-all duration-200"
                onClick={enableEdit}
              >
                <PencilIcon size={14} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status and Controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Connection Status */}
        <ConnectionStatus />

        {/* Save Status */}
        <SaveStatus />

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="hidden sm:inline">Unsaved changes</span>
          </div>
        )}

        {/* Activation Button */}
        <div className="flex-shrink-0">
          <ActivateAutomationButton id={id} />
        </div>
      </div>
    </div>
  )
}

export default AutomationsBreadCrumb
