
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { 
  Instagram,
  Share2,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Navigation items
const navItems = [
 
  { name: "Post", icon: Instagram, href: "/posting", color: "green" },
  { name: "Become an Affiliate", icon: Share2, href: "/affiliate", color: "green" },
]

export default function AutomationDashboardHeader() {
  const [showNotification, setShowNotification] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("Automations")

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

          </div>
        </CardContent>
      </Card>
    </div>
  )
}