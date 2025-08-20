"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { NotificationDropdown } from "./notification-dropdown"
import { useMediaQuery } from "@/hooks/use-media-query"

interface DashboardHeaderProps {
  adminName: string
  adminEmail?: string
  adminImage?: string
}

export function DashboardHeader({ adminName, adminEmail, adminImage }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    setCurrentDate(new Date().toLocaleDateString("en-US", options))
  }, [])

  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showMobileSearch])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="flex h-16 items-center px-4 border-b bg-background z-10">
        {/* Logo and title */}
        <div className="flex items-center">
          <h2 className="text-xl font-bold hidden md:block">Admin Dashboard</h2>
        </div>

        {/* Search and actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Desktop search */}
          <div className="relative hidden md:block">
            {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
            {!isMobile && <Input type="search" placeholder="Search..." className="h-9 md:w-[200px] lg:w-[300px]" />}
          </div>

          {/* Mobile search toggle */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button> */}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          {/* <NotificationDropdown /> */}
          <div className="flex items-center gap-4">{isMobile && <NotificationDropdown />}</div>

          {/* Admin profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {adminImage ? (
                    <AvatarImage src={adminImage} alt={adminName || "Admin"} />
                  ) : (
                    <AvatarFallback>{getInitials(adminName || "Admin User")}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{adminName || "Admin User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{adminEmail || "admin@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/dashboard" className="flex w-full">
                  Back to App
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="p-2 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

