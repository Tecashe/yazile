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
// } from "@/components/ui/breadcrumbs"
// import { usePathname } from "next/navigation"
// import { Bell, Search, Cog } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badges"
// import { useClerk } from "@clerk/nextjs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// type Props = {
//   slug: string
// }

// const Navbar = ({ slug }: Props) => {
//   const pathname = usePathname()
//   const { user } = useClerk()

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
//     <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="flex h-16 items-center gap-4 px-4">
//         {/* Sidebar Trigger - wrapped in try-catch for safety */}
//         <React.Suspense fallback={<div className="w-7 h-7" />}>
//           <SidebarTrigger className="-ml-1" />
//         </React.Suspense>
//         <Separator orientation="vertical" className="mr-2 h-4" />

//         {/* Breadcrumbs */}
//         <div className="flex-1">
//           <Breadcrumb>
//             <BreadcrumbList>
//               {breadcrumbs.map((crumb, index) => (
//                 <React.Fragment key={crumb.href}>
//                   <BreadcrumbItem className="hidden md:block">
//                     {crumb.isActive ? (
//                       <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
//                     ) : (
//                       <BreadcrumbLink href={crumb.href} className="transition-colors hover:text-foreground">
//                         {crumb.label}
//                       </BreadcrumbLink>
//                     )}
//                   </BreadcrumbItem>
//                   {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
//                 </React.Fragment>
//               ))}
//             </BreadcrumbList>
//           </Breadcrumb>

//           {/* Mobile: Show only current page */}
//           <div className="md:hidden">
//             <h1 className="font-semibold text-lg">{displayName}</h1>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="hidden lg:flex items-center space-x-2">
//           <div className="relative">
//             <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input placeholder="Search..." className="pl-8 w-64 bg-muted/50 border-border/50" />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center space-x-2">
//           {/* Search Button (Mobile) */}
//           <Button variant="ghost" size="icon" className="lg:hidden">
//             <Search className="h-4 w-4" />
//             <span className="sr-only">Search</span>
//           </Button>

//           {/* Notifications */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="relative">
//                 <Bell className="h-4 w-4" />
//                 <Badge
//                   variant="destructive"
//                   className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
//                 >
//                   3
//                 </Badge>
//                 <span className="sr-only">Notifications</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-80">
//               <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">New automation completed</p>
//                   <p className="text-xs text-muted-foreground">Your Instagram automation finished successfully</p>
//                 </div>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">Agent response received</p>
//                   <p className="text-xs text-muted-foreground">AI agent has processed 15 new leads</p>
//                 </div>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">Integration update</p>
//                   <p className="text-xs text-muted-foreground">WhatsApp integration is now active</p>
//                 </div>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="text-center">
//                 <span className="text-sm text-muted-foreground">View all notifications</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Settings */}
//           <Button variant="ghost" size="icon" asChild>
//             <a href={`/dashboard/${slug}/settings`}>
//               <Cog className="h-4 w-4" />
//               <span className="sr-only">Settings</span>
//             </a>
//           </Button>

//           {/* User Menu */}
//           {/* <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
//                   <AvatarFallback>
//                     {user?.fullName
//                       ?.split(" ")
//                       .map((n) => n[0])
//                       .join("") || "U"}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{user?.fullName}</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {user?.primaryEmailAddress?.emailAddress}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <a href={`/dashboard/${slug}/profile`}>Profile</a>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <a href={`/dashboard/${slug}/billing`}>Billing</a>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <a href={`/dashboard/${slug}/settings`}>Settings</a>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Support</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu> */}
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Navbar


// "use client"

// import React, { useState, useEffect } from "react"
// import { Separator } from "@/components/ui/separator"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { usePathname } from "next/navigation"
// import { Bell, Search, Cog, Menu } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { useClerk } from "@clerk/nextjs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { GlobalSearchDialog } from "./global-search-dialog"
// import dynamic from "next/dynamic"

// // Dynamically import SidebarTrigger with no SSR to avoid context issues
// const DynamicSidebarTrigger = dynamic(
//   () => import("@/components/ui/sidebar").then((mod) => ({ default: mod.SidebarTrigger })),
//   {
//     ssr: false,
//     loading: () => (
//       <Button variant="ghost" size="icon" className="-ml-1">
//         <Menu className="h-4 w-4" />
//         <span className="sr-only">Toggle Menu</span>
//       </Button>
//     ),
//   },
// )

// // Safe wrapper for SidebarTrigger
// const SafeSidebarTrigger = () => {
//   const [mounted, setMounted] = useState(false)
//   const [hasSidebarProvider, setHasSidebarProvider] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     // Check if we're in a context that has SidebarProvider
//     try {
//       // This is a simple check - you might need to adjust based on your app structure
//       const sidebarElement = document.querySelector("[data-sidebar]")
//       setHasSidebarProvider(!!sidebarElement)
//     } catch {
//       setHasSidebarProvider(false)
//     }
//   }, [])

//   if (!mounted) {
//     return (
//       <Button variant="ghost" size="icon" className="-ml-1">
//         <Menu className="h-4 w-4" />
//         <span className="sr-only">Toggle Menu</span>
//       </Button>
//     )
//   }

//   if (hasSidebarProvider) {
//     return <DynamicSidebarTrigger className="-ml-1" />
//   }

//   return (
//     <Button variant="ghost" size="icon" className="-ml-1">
//       <Menu className="h-4 w-4" />
//       <span className="sr-only">Toggle Menu</span>
//     </Button>
//   )
// }

// type Props = {
//   slug: string
// }

// const Navbar = ({ slug }: Props) => {
//   const pathname = usePathname()
//   const { user } = useClerk()
//   const [searchOpen, setSearchOpen] = useState(false)

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
//           {/* Sidebar Trigger - with proper error handling */}
//           <SafeSidebarTrigger />
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

//             {/* Mobile: Show only current page */}
//             <div className="md:hidden">
//               <h1 className="font-semibold text-lg">{displayName}</h1>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="hidden lg:flex items-center space-x-2">
//             <div className="relative">
//               <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search..."
//                 className="pl-8 w-64 bg-muted/50 border-border/50 cursor-pointer"
//                 onClick={() => setSearchOpen(true)}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             {/* Search Button (Mobile) */}
//             <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)}>
//               <Search className="h-4 w-4" />
//               <span className="sr-only">Search</span>
//             </Button>

//             {/* Notifications */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative">
//                   <Bell className="h-4 w-4" />
//                   <Badge
//                     variant="destructive"
//                     className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
//                   >
//                     3
//                   </Badge>
//                   <span className="sr-only">Notifications</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-80">
//                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">New automation completed</p>
//                     <p className="text-xs text-muted-foreground">Your Instagram automation finished successfully</p>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">Agent response received</p>
//                     <p className="text-xs text-muted-foreground">AI agent has processed 15 new leads</p>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">Integration update</p>
//                     <p className="text-xs text-muted-foreground">WhatsApp integration is now active</p>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem className="text-center">
//                   <span className="text-sm text-muted-foreground">View all notifications</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Settings */}
//             <Button variant="ghost" size="icon" asChild>
//               <a href={`/dashboard/${slug}/settings`}>
//                 <Cog className="h-4 w-4" />
//                 <span className="sr-only">Settings</span>
//               </a>
//             </Button>

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
//                     <AvatarFallback>
//                       {user?.fullName
//                         ?.split(" ")
//                         .map((n) => n[0])
//                         .join("") || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">{user?.fullName}</p>
//                     <p className="text-xs leading-none text-muted-foreground">
//                       {user?.primaryEmailAddress?.emailAddress}
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <a href={`/dashboard/${slug}/profile`}>Profile</a>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <a href={`/dashboard/${slug}/billing`}>Billing</a>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <a href={`/dashboard/${slug}/settings`}>Settings</a>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Support</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Global Search Dialog */}
//       <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
//     </>
//   )
// }

// export default Navbar





// "use client"

// import React from "react"
// import { Separator } from "@/components/ui/separator"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { usePathname } from "next/navigation"
// import { Bell, Search, Cog, Menu } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { useClerk } from "@clerk/nextjs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { GlobalSearchDialog } from "./global-search-dialog"
// import { useState } from "react"

// type Props = {
//   slug: string
// }

// const Navbar = ({ slug }: Props) => {
//   const pathname = usePathname()
//   const { user } = useClerk()
//   const [searchOpen, setSearchOpen] = useState(false)

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
//           {/* Simple Menu Button - No sidebar dependency */}
//           <Button variant="ghost" size="icon" className="-ml-1">
//             <Menu className="h-4 w-4" />
//             <span className="sr-only">Toggle Menu</span>
//           </Button>
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

//             {/* Mobile: Show only current page */}
//             <div className="md:hidden">
//               <h1 className="font-semibold text-lg">{displayName}</h1>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="hidden lg:flex items-center space-x-2">
//             <div className="relative">
//               <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search..."
//                 className="pl-8 w-64 bg-muted/50 border-border/50 cursor-pointer"
//                 onClick={() => setSearchOpen(true)}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             {/* Search Button (Mobile) */}
//             <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)}>
//               <Search className="h-4 w-4" />
//               <span className="sr-only">Search</span>
//             </Button>

//             {/* Notifications */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative">
//                   <Bell className="h-4 w-4" />
//                   <Badge
//                     variant="destructive"
//                     className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
//                   >
//                     3
//                   </Badge>
//                   <span className="sr-only">Notifications</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-80">
//                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">New automation completed</p>
//                     <p className="text-xs text-muted-foreground">Your Instagram automation finished successfully</p>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">Agent response received</p>
//                     <p className="text-xs text-muted-foreground">AI agent has processed 15 new leads</p>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">Integration update</p>
//                     <p className="text-xs text-muted-foreground">WhatsApp integration is now active</p>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem className="text-center">
//                   <span className="text-sm text-muted-foreground">View all notifications</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Settings */}
//             <Button variant="ghost" size="icon" asChild>
//               <a href={`/dashboard/${slug}/settings`}>
//                 <Cog className="h-4 w-4" />
//                 <span className="sr-only">Settings</span>
//               </a>
//             </Button>

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
//                     <AvatarFallback>
//                       {user?.fullName
//                         ?.split(" ")
//                         .map((n) => n[0])
//                         .join("") || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">{user?.fullName}</p>
//                     <p className="text-xs leading-none text-muted-foreground">
//                       {user?.primaryEmailAddress?.emailAddress}
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <a href={`/dashboard/${slug}/profile`}>Profile</a>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <a href={`/dashboard/${slug}/billing`}>Billing</a>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <a href={`/dashboard/${slug}/settings`}>Settings</a>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Support</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Global Search Dialog */}
//       <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
//     </>
//   )
// }

// export default Navbar

// "use client"

// import React from "react"
// import { Separator } from "@/components/ui/separator"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { usePathname } from "next/navigation"
// import { Search, Cog, Menu } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useClerk } from "@clerk/nextjs"
// import { GlobalSearchDialog } from "./global-search-dialog"
// import { NotificationDropdown } from "./notifications/notification-dropdown" // Updated import
// import { useState } from "react"

// type Props = {
//   slug: string
// }

// const Navbar = ({ slug }: Props) => {
//   const pathname = usePathname()
//   const [searchOpen, setSearchOpen] = useState(false)

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
//           {/* Simple Menu Button - No sidebar dependency */}
//           <Button variant="ghost" size="icon" className="-ml-1">
//             <Menu className="h-4 w-4" />
//             <span className="sr-only">Toggle Menu</span>
//           </Button>
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

//             {/* Mobile: Show only current page */}
//             <div className="md:hidden">
//               <h1 className="font-semibold text-lg">{displayName}</h1>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="hidden lg:flex items-center space-x-2">
//             <div className="relative">
//               <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search..."
//                 className="pl-8 w-64 bg-muted/50 border-border/50 cursor-pointer"
//                 onClick={() => setSearchOpen(true)}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             {/* Search Button (Mobile) */}
//             <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)}>
//               <Search className="h-4 w-4" />
//               <span className="sr-only">Search</span>
//             </Button>

//             {/* Real-time Notifications */}
//             <NotificationDropdown />

//             {/* Settings */}
//             <Button variant="ghost" size="icon" asChild>
//               <a href={`/dashboard/${slug}/settings`}>
//                 <Cog className="h-4 w-4" />
//                 <span className="sr-only">Settings</span>
//               </a>
//             </Button>

//           </div>
//         </div>
//       </header>

//       {/* Global Search Dialog */}
//       <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
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
import { Search, Cog, HelpCircleIcon, PlusCircleIcon, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import CreateAutomation from "../create-automation"
import { NotificationCenter } from "./notifications/notifications"

type Props = {
  slug: string
}

const Navbar = ({ slug }: Props) => {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

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

            {/* Mobile: Show only current page */}
            <div className="md:hidden">
              <h1 className="font-semibold text-lg">{displayName}</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-64 bg-muted/50 border-border/50 cursor-pointer"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Search Button (Mobile) */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`/dashboard/${slug}/settings`}>
                <Cog className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`/dashboard/${slug}/settings`}>
                <HelpCircleIcon className="h-4 w-4" />
                <span className="sr-only">Help</span>
              </a>
            </Button>
             <NotificationCenter />
             <CreateAutomation />
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
