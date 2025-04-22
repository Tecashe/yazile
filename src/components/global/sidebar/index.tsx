
"use client"

import { useState, useEffect } from "react"
import ChatalLogo from "@/svgs/chatal-logo"
import { Separator } from "@/components/ui/separator"
import UpgradeCard from "./upgrade"
import UpgradedCard from "./upgraded"
import { SubscriptionPlan } from "../subscription-plan"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SIDEBAR_MENU, type SideBarItemProps, type SideBarGroupProps } from "@/constants/menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import UserProfile from "./userProfile"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  slug: string
}

const Sidebar = ({ slug }: Props) => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [showSubscriptionPlan, setShowSubscriptionPlan] = useState(false)
  const { signOut, user } = useClerk()

  const toggleSubscriptionPlan = () => setShowSubscriptionPlan(!showSubscriptionPlan)

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Helper function to build the correct URL for each item
  const buildItemUrl = (item: SideBarItemProps, groupLabel: string, parentPath = "") => {
    const basePath = `/dashboard/${slug}`
    const itemPath = item.label.toLowerCase() === "home" ? "/" : item.label.toLowerCase()

    // Special case for Influencer group - include group name in path
    if (groupLabel.toLowerCase() === "influencer") {
      // If this is a direct child of the Influencer group (not a subitem)
      if (!parentPath) {
        return `${basePath}/influencer/${itemPath}`
      }

      // For subitems in the Influencer group, use the parent path
      return `${basePath}/influencer${parentPath}/${itemPath}`
    }

    // For all other groups, direct path without group name
    return `${basePath}/${itemPath}`
  }

  // Auto-expand parent items when a child route is active
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {}

    // Helper function to check if any child is active
    const checkChildrenActive = (item: SideBarItemProps, groupLabel: string, parentPath = "") => {
      if (!item.subItems) return false

      for (const subItem of item.subItems) {
        const subItemUrl = buildItemUrl(subItem, groupLabel, `${parentPath}/${item.label.toLowerCase()}`)
        if (isPathActive(subItemUrl)) {
          return true
        }
      }

      return false
    }

    // Check all items in all groups
    SIDEBAR_MENU.forEach((group) => {
      let hasActiveChild = false

      group.items.forEach((item) => {
        if (checkChildrenActive(item, group.label)) {
          newExpandedItems[item.id] = true
          hasActiveChild = true
        }
      })

      // Auto-expand the group if it has an active child
      if (hasActiveChild) {
        setExpandedGroups((prev) => ({ ...prev, [group.id]: true }))
      }
    })

    setExpandedItems(newExpandedItems)
  }, [pathname, slug])

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const renderMenuItem = (item: SideBarItemProps, groupLabel: string, parentPath = "") => {
    const itemUrl = buildItemUrl(item, groupLabel, parentPath)
    const isActive = isPathActive(itemUrl)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems[item.id] || false

    return (
      <TooltipProvider key={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center">
                {/* Make the main item clickable for navigation */}
                <Link
                  href={itemUrl}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg p-2 transition-colors duration-200 flex-grow",
                    isActive ? "bg-[#0f0f0f] text-white" : "text-[#9B9CA0] hover:bg-[#0f0f0f] hover:text-white",
                    parentPath && "pl-8",
                  )}
                >
                  <span className={cn("transition-colors duration-200", isActive && "text-white")}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>

                {/* Separate expand button for items with subitems */}
                {hasSubItems && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleItem(item.id)
                    }}
                    className="p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors duration-200"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")}
                    />
                  </button>
                )}
              </motion.div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {hasSubItems && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-4"
            >
              {item.subItems!.map((subItem) =>
                renderMenuItem(subItem, groupLabel, `${parentPath}/${item.label.toLowerCase()}`),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    )
  }

  const renderGroup = (group: SideBarGroupProps) => {
    const isExpanded = expandedGroups[group.id] !== false // Default to expanded

    return (
      <motion.div
        key={group.id}
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          onClick={() => toggleGroup(group.id)}
          className="flex items-center cursor-pointer mb-2 text-[#9B9CA0] hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className={cn("mr-2 transition-transform duration-200", !isExpanded && "rotate-180")} />
          <span className="text-xs uppercase font-semibold">{group.label}</span>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {group.items.map((item) => renderMenuItem(item, group.label))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div
      className="
        w-[250px]
        border-[2px]
        fixed
        left-0
        lg:inline-block
        border-[#545454]
        bg-gradient-to-b from-[#768BDD]
        via-[#171717]
        to-[#768BDD]
        hidden
        bottom-2
        top-2
        m-3
        rounded-3xl
        overflow-hidden
      "
    >
      <div
        className="
          flex
          flex-col
          gap-y-5
          w-full
          h-full
          p-3
          bg-[#0e0e0e]
          bg-opacity-90
          backdrop-filter
          backdrop-blur-3xl
          overflow-hidden
        "
      >
        <div className="flex items-center justify-center p-2">
          <ChatalLogo width={60} height={60} color="#0066cc" />
        </div>

        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {SIDEBAR_MENU.map((group) => renderGroup(group))}
        </div>

        <div className="px-16">
          <Separator orientation="horizontal" className="bg-[#333336]" />
        </div>

        <div className="mt-4">
          <motion.button
            onClick={toggleSubscriptionPlan}
            className="w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md flex items-center justify-between"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{showSubscriptionPlan ? "Hide" : "Show"} Current Plan</span>
            {showSubscriptionPlan ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>
          <AnimatePresence>
            {showSubscriptionPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <SubscriptionPlan type="PRO">
                  <div className="flex-1 flex flex-col justify-end">
                    <UpgradedCard userName={user?.firstName || "Member"} />
                  </div>
                </SubscriptionPlan>
                <SubscriptionPlan type="FREE">
                  <div className="flex-1 flex flex-col justify-end">
                    <UpgradeCard />
                  </div>
                </SubscriptionPlan>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-16">
          <Separator orientation="horizontal" className="bg-[#333336]" />
        </div>

        <div className="w-full">
          <UserProfile onSignOut={signOut} />
        </div>
      </div>
    </div>
  )
}

export default Sidebar

