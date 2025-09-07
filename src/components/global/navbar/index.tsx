// "use client"

// import React from "react"
// import { SidebarTrigger } from "@/components/ui/sidebars"
// import { Separator } from "@/components/ui/separator"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { usePathname, useRouter } from "next/navigation"
// import { Cog } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import CreateAutomation from "../create-automation"
// import { NotificationCenter } from "./notifications/notifications"

// type Props = {
//   slug: string
// }

// const Navbar = ({ slug }: Props) => {
//   const pathname = usePathname()
  

//   // Enhanced page info extraction
//   const getPageInfo = () => {
//     const segments = pathname.split("/").filter(Boolean)
//     const fullPageName = pathname === `/dashboard/${slug}` ? "home" : segments[segments.length - 1] || ""
//     const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//     const isUUID = uuidPattern.test(fullPageName)
//     const displayName = isUUID ? "Details" : fullPageName.replace(/-/g, " ")

//     return {
//       fullPageName,
//       displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
//       isUUID,
//       segments: segments.slice(2), // Remove 'dashboard' and slug
//     }
//   }

//   const { displayName, segments } = getPageInfo()

//   // Generate breadcrumbs from pathname
//   const generateBreadcrumbs = () => {
//     const breadcrumbs = []

//     // Always start with Dashboard
//     breadcrumbs.push({
//       label: "Dashboard",
//       href: `/dashboard/${slug}`,
//       isActive: pathname === `/dashboard/${slug}`,
//     })

//     // Add intermediate segments
//     let currentPath = `/dashboard/${slug}`
//     segments.forEach((segment, index) => {
//       currentPath += `/${segment}`
//       const isLast = index === segments.length - 1
//       const label = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

//       breadcrumbs.push({
//         label,
//         href: currentPath,
//         isActive: isLast,
//       })
//     })

//     return breadcrumbs
//   }

//   const breadcrumbs = generateBreadcrumbs()

  
//   return (
//     <>
//       <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex h-16 items-center gap-4 px-4">
//           {/* Sidebar Trigger - wrapped in try-catch for safety */}
//           <React.Suspense fallback={<div className="w-7 h-7" />}>
//             <SidebarTrigger className="-ml-1" />
//           </React.Suspense>
//           <Separator orientation="vertical" className="mr-2 h-4" />

//           {/* Breadcrumbs */}
//           <div className="flex-1">
//             <Breadcrumb>
//               <BreadcrumbList>
//                 {breadcrumbs.map((crumb, index) => (
//                   <React.Fragment key={crumb.href}>
//                     <BreadcrumbItem className="hidden md:block">
//                       {crumb.isActive ? (
//                         <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
//                       ) : (
//                         <BreadcrumbLink href={crumb.href} className="transition-colors hover:text-foreground">
//                           {crumb.label}
//                         </BreadcrumbLink>
//                       )}
//                     </BreadcrumbItem>
//                     {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
//                   </React.Fragment>
//                 ))}
//               </BreadcrumbList>
//             </Breadcrumb>

//             <div className="md:hidden">
//               <h1 className="font-semibold text-lg">{displayName}</h1>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button variant="ghost" size="icon" asChild>
//               <Link href={`/dashboard/${slug}/settings`}>
//                 <Cog className="h-4 w-4" />
//                 <span className="sr-only">Settings</span>
//               </Link>
//             </Button>
//             <NotificationCenter />
//             <CreateAutomation />
//           </div>
//         </div>
//       </header>
//     </>
//   )
// }

// export default Navbar

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
import { usePathname } from "next/navigation"
import { Cog, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreateAutomation from "../create-automation"
import { NotificationCenter } from "./notifications/notifications"
import { cn } from "@/lib/utils"

type Props = {
  slug: string
}

const Navbar = ({ slug }: Props) => {
  const pathname = usePathname()

  // Enhanced page info extraction with better handling
  const getPageInfo = () => {
    const segments = pathname.split("/").filter(Boolean)
    const fullPageName = pathname === `/dashboard/${slug}` ? "home" : segments[segments.length - 1] || ""
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isUUID = uuidPattern.test(fullPageName)
    
    // Better display name formatting
    const formatDisplayName = (name: string) => {
      if (isUUID) return "Details"
      return name
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

    return {
      fullPageName,
      displayName: formatDisplayName(fullPageName),
      isUUID,
      segments: segments.slice(2), // Remove 'dashboard' and slug
    }
  }

  const { displayName, segments } = getPageInfo()

  // Enhanced breadcrumb generation with better formatting
  const generateBreadcrumbs = () => {
    const breadcrumbs = []

    // Dashboard home
    breadcrumbs.push({
      label: "Dashboard",
      href: `/dashboard/${slug}`,
      isActive: pathname === `/dashboard/${slug}`,
    })

    // Build breadcrumbs from segments
    let currentPath = `/dashboard/${slug}`
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const isUUID = uuidPattern.test(segment)
      
      const label = isUUID 
        ? "Details" 
        : segment
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <React.Suspense fallback={<div className="w-6 h-6" />}>
            <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
          </React.Suspense>
        </div>

        <Separator orientation="vertical" className="mr-4 h-6" />

        {/* Enhanced Breadcrumbs */}
        <div className="flex flex-1 items-center space-x-2">
          <nav className="flex items-center space-x-1 text-sm font-medium">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <div className="flex items-center">
                  {crumb.isActive ? (
                    <span className="font-medium text-foreground">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Mobile title fallback */}
        <div className="sm:hidden flex-1">
          <h1 className="font-semibold text-base truncate">{displayName}</h1>
        </div>

        {/* Action buttons with improved spacing and styling */}
        <div className="flex items-center space-x-1 ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors" 
            asChild
          >
            <Link href={`/dashboard/${slug}/settings`}>
              <Cog className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          
          <NotificationCenter />
          
          <div className="ml-2">
            <CreateAutomation />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar