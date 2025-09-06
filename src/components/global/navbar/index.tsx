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
// import { usePathname } from "next/navigation"
// import { Search, Cog, HelpCircleIcon, PlusCircleIcon, Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useState } from "react"
// import CreateAutomation from "../create-automation"
// import { NotificationCenter } from "./notifications/notifications"

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
//             <Button variant="ghost" size="icon" asChild>
//               <a href={`/dashboard/${slug}/settings`}>
//                 <Cog className="h-4 w-4" />
//                 <span className="sr-only">Settings</span>
//               </a>
//             </Button>
//             <Button variant="ghost" size="icon" asChild>
//               <a href={`/dashboard/${slug}/settings`}>
//                 <HelpCircleIcon className="h-4 w-4" />
//                 <span className="sr-only">Help</span>
//               </a>
//             </Button>
//              <NotificationCenter />
//              <CreateAutomation />
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { 
  Search, 
  Cog, 
  HelpCircleIcon, 
  PlusCircleIcon, 
  Bell, 
  BookOpen, 
  PlayCircle, 
  MessageSquare, 
  FileText,
  Lightbulb,
  Mail,
  ExternalLink 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import CreateAutomation from "../create-automation"
import { NotificationCenter } from "./notifications/notifications"

type Props = {
  slug: string
}

const Navbar = ({ slug }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
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

  // Get contextual help based on current page
  const getContextualHelp = () => {
    const currentPage = segments[segments.length - 1] || 'dashboard'
    
    const helpMap: Record<string, { title: string; description: string; href: string }> = {
      'dashboard': {
        title: 'Dashboard Overview',
        description: 'Learn about your automation metrics and performance',
        href: `/dashboard/${slug}/help/dashboard`
      },
      'automations': {
        title: 'Automation Management',
        description: 'How to create and manage your Instagram DM automations',
        href: `/dashboard/${slug}/help/automations`
      },
      'integrations': {
        title: 'Integration Setup',
        description: 'Connect your CRM, payment systems, and other tools',
        href: `/dashboard/${slug}/help/integrations`
      },
      'analytics': {
        title: 'Analytics & Reporting',
        description: 'Understanding your automation performance metrics',
        href: `/dashboard/${slug}/help/analytics`
      },
      'settings': {
        title: 'Account Settings',
        description: 'Manage your profile and preferences',
        href: `/dashboard/${slug}/help/settings`
      },
    }

    return helpMap[currentPage] || {
      title: 'General Help',
      description: 'Get help with this feature',
      href: `/dashboard/${slug}/help`
    }
  }

  const contextualHelp = getContextualHelp()

  // Start guided tour function (you'll need to implement this with a tour library)
  const startTour = () => {
    // Implementation would depend on your chosen tour library
    // For now, just show an alert
    alert("Guided tour coming soon! This will walk you through the key features.")
  }

  // Handle help article navigation
  const navigateToHelp = (section: string) => {
    router.push(`/dashboard/${slug}/help/${section}`)
  }

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
                placeholder="Search help articles..."
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
            
            {/* Settings Button */}
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/${slug}/settings`}>
                <Cog className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>

            {/* Enhanced Help Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircleIcon className="h-4 w-4" />
                  <span className="sr-only">Help & Support</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {/* Contextual Help */}
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-sm">Get help</span>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={contextualHelp.href} className="block">
                      <div>
                        <div className="font-medium">{contextualHelp.title}</div>
                        <div className="text-sm text-muted-foreground">{contextualHelp.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                {/* General Help Options */}
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${slug}/help`} className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Documentation Center
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${slug}/help/getting-started`} className="cursor-pointer">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Getting Started Guide
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${slug}/help/video-tutorials`} className="cursor-pointer">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Video Tutorials
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${slug}/help/faq`} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    FAQ
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={startTour} className="cursor-pointer">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Take a Product Tour
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Support Options */}
                <DropdownMenuItem asChild>
                  <a href="https://www.yazzil.com/help/contact" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a href="mailto:support@yourapp.com" className="cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </a>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Quick Links */}
                <div className="px-2 py-1">
                  <div className="text-xs text-muted-foreground mb-1">Quick Links</div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="justify-start h-auto py-1 px-2 text-xs"
                      onClick={() => navigateToHelp('instagram-setup')}
                    >
                      Instagram Setup
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="justify-start h-auto py-1 px-2 text-xs"
                      onClick={() => navigateToHelp('automation-best-practices')}
                    >
                      Automation Best Practices
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="justify-start h-auto py-1 px-2 text-xs"
                      onClick={() => navigateToHelp('troubleshooting')}
                    >
                      Troubleshooting
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications and Create Automation */}
            <NotificationCenter />
            <CreateAutomation />
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar