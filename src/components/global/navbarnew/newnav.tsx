
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Menu, 
  PlusCircle, 
  GitMerge,
  Bell,
  Cpu,
  Grid,
  Instagram,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Share2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobiles"

// Navigation items
const navItems = [
  { name: "Automations", icon: Cpu, href: "/automations", color: "blue" },
  { name: "Posting", icon: Instagram, href: "/posting", color: "green" },
  { name: "Chats", icon: MessageSquare, href: "/chat", color: "blue" },
  { name: "Integrations", icon: Grid, href: "/integrations", color: "blue" },
  { name: "Affiliates", icon: Share2, href: "/affiliate", color: "green" },
]

export default function AutomationDashboardHeader() {
  const [isHovering, setIsHovering] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("Automations")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobile()

  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  // Unified navigation handler
  const handleNavigation = (path: string) => {
    router.push(`/dashboard/${slug}/${path}`);
  };

  // Show notification dot periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(true)
      const timeout = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full space-y-1">
      <Card className="shadow-md overflow-hidden relative border-0">
        <CardContent className="p-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left Section - Navigation */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
              {navItems.map((item) => (
                <Link 
                  href={`/dashboard/${slug}${item.href}`}
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href.replace(/^\//, ''));
                    setActiveNavItem(item.name);
                  }}
                >
                  <Button
                    variant="ghost"
                    className={`px-3 h-10 rounded-full flex items-center gap-2 whitespace-nowrap ${
                      activeNavItem === item.name
                        ? item.color === "blue"
                          ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                          : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${item.color === "blue" ? "text-blue-500" : "text-green-500"}`} />
                    <span
                      className={
                        activeNavItem === item.name
                          ? item.color === "blue"
                            ? "text-blue-500"
                            : "text-green-500"
                          : "text-gray-700"
                      }
                    >
                      {item.name}
                    </span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <div className="flex md:hidden items-center gap-2">
                {/* Sidebar Toggle Button */}
                <Button
                  variant="outline"
                  className="h-10 px-3 rounded-full border-blue-500/20 hover:border-blue-500/40 hover:bg-transparent"
                >
                  <Menu className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-blue-500 text-sm">Menu</span>
                </Button>

                {/* Create Automation Button */}
                <Button
                  onClick={() => handleNavigation("automations")}
                  variant="outline"
                  className="h-10 px-3 rounded-full border-green-500/20 hover:border-green-500/40 hover:bg-transparent"
                >
                  <PlusCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-blue-500 text-sm">Create</span>
                </Button>

                {/* Integrate Account Button */}
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("integrations")}
                  className="h-10 px-3 rounded-full border-purple-500/20 hover:border-purple-500/40 hover:bg-transparent"
                >
                  <GitMerge className="h-4 w-4 text-purple-500 mr-0" />
                </Button>
              </div>

              {/* Search Input/Button - Responsive */}
              <AnimatePresence mode="wait">
                {!isMobile ? (
                  <motion.div
                    key="search-input-desktop"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="relative"
                  >
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 border-blue-500/30 focus-visible:ring-blue-500/50 w-[200px] rounded-full"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search-button-mobile"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10"
                        >
                          <Search className="h-5 w-5 text-green-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="p-2">
                        <Input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="border-blue-500/30 focus-visible:ring-blue-500/50"
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Action Buttons */}
              <div className="flex gap-2">
                {/* Settings Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleNavigation("pricing")}
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10"
                      >
                        <Settings className="h-5 w-5 text-green-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Notifications Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10 relative"
                      >
                        <Bell className="h-5 w-5 text-blue-500" />
                        <AnimatePresence>
                          {showNotification && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                            />
                          )}
                        </AnimatePresence>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}