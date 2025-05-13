
"use client"

import { useState, useEffect } from "react"
import { SubscriptionPlan } from "../subscription-plan"
import UpgradeCard from "../sidebar/upgrade"
import UpgradedCard from "../sidebar/upgraded"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp,Instagram } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { SIDEBAR_MENU, type SideBarItemProps, type SideBarGroupProps } from "@/constants/menu"
import ChatalLogo from "@/svgs/chatal-logo"
import YazilLogo from "@/svgs/yazil-logo"
import { useClerk } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import FixedNavbar from "../mainNavBar/navber"
import MainBreadCrumb from "../bread-crumbs/main-bread-crumb"
import UserProfile from "../sidebar/userProfile"
import { useSheetState } from "@/hooks/useSheetState"
import ArrowTrigger from "@/components/global/arrow/arrowTrigger"

type Props = {
  slug: string
  className?: string;
}

const Navbar = ({ slug }: Props) => {
  const pathname = usePathname()
  const { isOpen, openSheet, closeSheet } = useSheetState()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const { signOut, user } = useClerk()
  const [showSubscriptionPlan, setShowSubscriptionPlan] = useState(false)

  const toggleSubscriptionPlan = () => setShowSubscriptionPlan(!showSubscriptionPlan)

  const getPageInfo = () => {
    const fullPageName = pathname === `/dashboard/${slug}` ? "home" : pathname.split("/").pop() || ""
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isUUID = uuidPattern.test(fullPageName)
    const displayName = isUUID ? "id" : fullPageName
    return { fullPageName, displayName, isUUID }
  }

  const { fullPageName, displayName, isUUID } = getPageInfo()

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

     // Special case for AI Agents group
    if (groupLabel.toLowerCase() === "agents") {
      // For direct children of AI Agents
      if (!parentPath) {
        return `${basePath}/agents/${itemPath}`
      }

      // For subitems in the AI Agents group, we need to handle the case where the parent is "Agents"
      const formattedParentPath = parentPath.startsWith("/agents") ? parentPath.replace("/agents", "") : parentPath

      return `${basePath}/agents${formattedParentPath}/${itemPath}`
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
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          {/* Make the main item clickable for navigation */}
          <Link
            href={itemUrl}
            className={cn(
              "flex items-center gap-x-2 rounded-lg p-2 transition-colors duration-200 flex-grow",
              isActive ? "bg-[#0f0f0f] text-white" : "text-[#9B9CA0] hover:bg-[#0f0f0f] hover:text-white",
              parentPath && "pl-8",
            )}
            onClick={() => {
              if (!hasSubItems) {
                closeSheet()
              }
            }}
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
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {hasSubItems && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-4 mt-2"
            >
              {item.subItems!.map((subItem) =>
                renderMenuItem(subItem, groupLabel, `${parentPath}/${item.label.toLowerCase()}`),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  const renderGroup = (group: SideBarGroupProps) => {
    const isExpanded = expandedGroups[group.id] !== false // Default to expanded

    return (
      <motion.div
        key={group.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="mb-4"
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
              className="pl-4"
            >
              {group.items.map((item) => renderMenuItem(item, group.label))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col">
      <ArrowTrigger isOpen={isOpen} onClick={isOpen ? closeSheet : openSheet} />
      <Sheet open={isOpen} onOpenChange={closeSheet}>
        <SheetContent side="left" className="w-[260px] bg-[#0e0e0e] text-white p-1 mb-2 mt-2 rounded-2xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <motion.div transition={{ duration: 0.5 }}>
              
                {/* <YazilLogo width={150} height={150} color="#0066cc" /> */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-white" />
                    <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm -z-10 opacity-50"></div>
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    Yazil
                  </span>
                </Link>

                {/* <ChatalLogo width={60} height={60} color="#0066cc" /> */}
              </motion.div>
            </div>
            <div className="px-16 m-2">
              <Separator orientation="horizontal" className="bg-[#333336]" />
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-2">{SIDEBAR_MENU.map((group) => renderGroup(group))}</div>
            <div className="px-16 m-2">
              <Separator orientation="horizontal" className="bg-[#333336]" />
            </div>
            {/* <div className="mt-4">
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
                    <SubscriptionPlan type="FREE">
                      <div className="flex-1 flex flex-col justify-end">
                        <UpgradeCard />
                      </div>
                    </SubscriptionPlan>
                    <SubscriptionPlan type="PRO">
                      <div className="flex-1 flex flex-col justify-end">
                        <UpgradedCard userName={user?.firstName || ""} />
                      </div>
                    </SubscriptionPlan>
                  </motion.div>
                )}
              </AnimatePresence>
            </div> */}
            <div className="relative">
              <UserProfile onSignOut={signOut} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex gap-x-3 lg:gap-x-5 mb-10 items-center justify-between px-4 py-2">
        <FixedNavbar slug={slug} fullPageName={fullPageName} displayName={displayName} isUUID={isUUID} />
      </div>
      <div>
        <MainBreadCrumb page={fullPageName} displayName={displayName} slug={slug} isUUID={isUUID} />
      </div>
    </div>
  )
}

export default Navbar

