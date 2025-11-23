"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Users,
  CreditCard,
  Settings,
  LogOut,
  MessageSquare,
  Zap,
  Calendar,
  Home,
  Mail,
  FileText,
  Send,
  BarChart2,
  Instagram,
  Bot,
  Activity,
  Menu,
  Gift,
  ChevronRight,
  Award,
  User,
  DollarSignIcon,
  Group,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NotificationDropdown } from "./notification-dropdown"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function EnhancedSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [systemStatus, setSystemStatus] = useState<"healthy" | "warning" | "error">("healthy")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [emailSubmenuOpen, setEmailSubmenuOpen] = useState(pathname.startsWith("/admin/email"))
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Simulate system status check
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly set system status for demo purposes
      const statuses = ["healthy", "warning", "error"] as const
      const randomStatus = statuses[Math.floor(Math.random() * 10) % 3]
      setSystemStatus(randomStatus)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    } else {
      setIsCollapsed(false)
    }
  }, [isMobile])

  const getStatusColor = (status: "healthy" | "warning" | "error") => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleNavigation = (href: string) => {
    if (isMobile) {
      setIsSheetOpen(false)
    }
    router.push(href)
  }

  const MenuItem = ({
    href,
    icon: Icon,
    label,
    isActive,
    color,
    badge,
  }: {
    href: string
    icon: React.ElementType
    label: string
    isActive: boolean
    color: string
    badge?: string
  }) => (
    <li>
      <button
        onClick={() => handleNavigation(href)}
        className={cn(
          "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
          isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground",
        )}
      >
        <Icon className={cn("h-4 w-4 transition-colors duration-200", isActive ? color : "text-muted-foreground")} />
        {!isCollapsed && (
          <>
            <span>{label}</span>
            {badge && (
              <Badge className="ml-auto" variant="outline">
                {badge}
              </Badge>
            )}
          </>
        )}
      </button>
    </li>
  )

  const SidebarContent = () => (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      <div className="border-b py-4 px-2 flex items-center justify-between">
        {isCollapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto hover:bg-accent/50 transition-all duration-200"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarImage src="/placeholder.svg" alt="Logo" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="font-semibold">Vavi&apos;s Dashboard</div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/50 transition-all duration-200"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-auto py-2 scrollbar-thin">
        <nav className="grid gap-1 px-2">
          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overview
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin"
                icon={Home}
                label="Dashboard"
                isActive={pathname === "/admin"}
                color="text-blue-500"
              />
              <MenuItem
                href="/admin/users"
                icon={Users}
                label="Users"
                isActive={pathname === "/admin/users"}
                color="text-indigo-500"
              />
              <MenuItem
                href="/admin/subscriptions"
                icon={CreditCard}
                label="Subscriptions"
                isActive={pathname === "/admin/subscriptions"}
                color="text-emerald-500"
              />
            </ul>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Communication
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/chat"
                icon={MessageSquare}
                label="Chat"
                isActive={pathname === "/admin/chat"}
                color="text-violet-500"
                badge="3"
              />

              {isCollapsed ? (
                <MenuItem
                  href="/admin/email"
                  icon={Mail}
                  label="Email"
                  isActive={pathname.startsWith("/admin/email")}
                  color="text-sky-500"
                />
              ) : (
                <Collapsible open={emailSubmenuOpen} onOpenChange={setEmailSubmenuOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-3 py-2 text-sm font-normal transition-all duration-200",
                        pathname.startsWith("/admin/email") ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                      )}
                    >
                      <Mail
                        className={cn(
                          "mr-3 h-4 w-4 transition-colors duration-200",
                          pathname.startsWith("/admin/email") ? "text-sky-500" : "text-muted-foreground",
                        )}
                      />
                      <span>Email</span>
                      <ChevronRight
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform duration-200",
                          emailSubmenuOpen && "rotate-90",
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="animate-accordion-down">
                    <ul className="grid gap-1 pl-6 pt-1">
                      <MenuItem
                        href="/admin/email/templates"
                        icon={FileText}
                        label="Templates"
                        isActive={pathname === "/admin/email/templates"}
                        color="text-sky-400"
                      />
                      <MenuItem
                        href="/admin/email/campaigns"
                        icon={Send}
                        label="Campaigns"
                        isActive={pathname === "/admin/email/campaigns"}
                        color="text-sky-400"
                      />
                      <MenuItem
                        href="/admin/email/analytics"
                        icon={BarChart2}
                        label="Analytics"
                        isActive={pathname === "/admin/email/analytics"}
                        color="text-sky-400"
                      />
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </ul>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Automation
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/automations"
                icon={Zap}
                label="Automations"
                isActive={pathname === "/admin/automations"}
                color="text-amber-500"
              />
              <MenuItem
                href="/admin/scheduled-content"
                icon={Calendar}
                label="Scheduled Content"
                isActive={pathname === "/admin/scheduled-content"}
                color="text-orange-500"
              />
              <MenuItem
                href="/admin/templates"
                icon={FileText}
                label="Message Templates"
                isActive={pathname === "/admin/templates"}
                color="text-yellow"
                badge="New"
              />
            </ul>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Finance
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/invoices"
                icon={FileText}
                label="Invoices"
                isActive={pathname === "/admin/invoices"}
                color="text-green-500"
                badge="New"
              />
            </ul>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Marketing
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/referrals"
                icon={Gift}
                label="Referral Program"
                isActive={pathname === "/admin/referrals"}
                color="text-purple-500"
                badge="New"
              />
            </ul>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Affiliates
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/affiliates"
                icon={Award}
                label="Dashboard"
                isActive={pathname === "/admin/affiliates"}
                color="text-magenta-500"
                badge="New"
              />
              <MenuItem
                href="/admin/affiliates/programs/new"
                icon={Group}
                label="Programs"
                isActive={pathname === "/admin/affiliates/programs/new"}
                color="text-cyan-500"
                badge="New"
              />
               <MenuItem
                href="/admin/affiliates/users"
                icon={User}
                label="Users"
                isActive={pathname === "/admin/affiliates/users"}
                color="text-green-500"
                badge="New"
              />
              <MenuItem
                href="/admin/affiliates/payouts"
                icon={DollarSignIcon}
                label="Payouts"
                isActive={pathname === "/admin/affiliates/payouts"}
                color="text-brown-500"
                badge="New"
              />
            </ul>
          </div>

          

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Integrations
              </h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/instagram-accounts"
                icon={Instagram}
                label="Instagram Accounts"
                isActive={pathname === "/admin/instagram-accounts"}
                color="text-pink-500"
                badge="New"
              />
              <MenuItem
                href="/admin/ai-assistant"
                icon={Bot}
                label="AI Assistant"
                isActive={pathname === "/admin/ai-assistant"}
                color="text-cyan-500"
                badge="New"
              />
            </ul>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</h3>
            )}
            <ul className="grid gap-1">
              <MenuItem
                href="/admin/settings"
                icon={Settings}
                label="Settings"
                isActive={pathname === "/admin/settings"}
                color="text-gray-500"
              />
              <MenuItem
                href="/admin/status"
                icon={Activity}
                label="System Status"
                isActive={pathname === "/admin/status"}
                color="text-green-500"
              />
              <li>
                <div className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm")}>
                  <div
                    className={cn("h-2 w-2 rounded-full transition-colors duration-500", getStatusColor(systemStatus))}
                  />
                  {!isCollapsed && (
                    <>
                      <span>Status Indicator</span>
                      <span className="ml-auto capitalize text-xs">{systemStatus}</span>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t p-4">
        {isCollapsed ? (
          <Button variant="ghost" size="icon" className="mx-auto hover:bg-accent/50 transition-all duration-200">
            <LogOut className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors duration-200" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-primary/10">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-muted-foreground">Cashe@yazzil.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto hover:bg-accent/50 transition-all duration-200">
              <LogOut className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors duration-200" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  // For mobile devices, we'll use a Sheet component
  if (isMobile) {
    return (
      <>
        <div className="fixed left-4 top-4 z-50 md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r shadow-xl w-[60px] sm:max-w-[60px]">
              <div className="absolute right-4 top-4 z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent/50"
                  onClick={() => setIsSheetOpen(false)}
                >
                </Button>
              </div>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:block">
          <SidebarContent />
        </div>
      </>
    )
  }

  return <SidebarContent />
}

