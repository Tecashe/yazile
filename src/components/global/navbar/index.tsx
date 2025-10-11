"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebars"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname, useRouter } from "next/navigation"
import { Cog } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreateAutomation from "../create-automation/plusButton"
import { NotificationCenter } from "./notifications/notifications"
import Search from "./search"

type Props = {
  slug: string
}

const Navbar = ({ slug }: Props) => {
  const pathname = usePathname()
  

  // Enhanced page info extraction
  const getPageInfo = () => {
    const segments = pathname.split("/").filter(Boolean)
    const fullPageName = pathname === `/dashboard/${slug}` ? "home" : segments[segments.length - 1] || ""
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isUUID = uuidPattern.test(fullPageName)
    const displayName = isUUID ? "Details" : fullPageName.replace(/-/g, " ")

    return {
      fullPageName,
      displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      isUUID,
      segments: segments.slice(2), // Remove 'dashboard' and slug
    }
  }

  const { displayName, segments } = getPageInfo()

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const breadcrumbs = []

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: `/dashboard/${slug}`,
      isActive: pathname === `/dashboard/${slug}`,
    })

    // Add intermediate segments
    let currentPath = `/dashboard/${slug}`
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      const label = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Sidebar Trigger - wrapped in try-catch for safety */}
          <React.Suspense fallback={<div className="w-7 h-7" />}>
            <SidebarTrigger className="-ml-1" />
          </React.Suspense>
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Breadcrumbs */}
          <div className="flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem className="hidden md:block">
                      {crumb.isActive ? (
                        <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href} className="transition-colors hover:text-foreground">
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="md:hidden">
              <h1 className="font-semibold text-lg">{displayName}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/${slug}/settings`}>
                <Cog className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <NotificationCenter />
            {/* <CreateAutomation /> */}
            <Search/>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
