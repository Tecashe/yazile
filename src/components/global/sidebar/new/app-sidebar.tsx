// "use client"
// import { useState } from "react"
// import {
//   AudioWaveform,
//   Bot,
//   Command,
//   Frame,
//   Settings2,
//   Instagram,
//   Home,
//   Users,
//   BarChart3,
//   Zap,
//   Mail,
//   Bell,
//   CreditCard,
//   Search,
// } from "lucide-react"

// import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
// import { NavUser } from "./nav-user"
// import { TeamSwitcher } from "./team-switcher"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarInput,
//   SidebarSeparator,
// } from "@/components/ui/sidebars"
// import { usePathname } from "next/navigation"
// import { useClerk } from "@clerk/nextjs"
// import Link from "next/link"

// // This is sample data - replace with your actual menu structure
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "Yazzil",
//       logo: Instagram,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: Home,
//       isActive: true,
//     },
//     {
//       title: "Automations",
//       url: "/automations",
//       icon: Bot,
//       items: [
//         {
//           title: "Create Automation",
//           url: "/automations/create",
//         },
//         {
//           title: "Active Automations",
//           url: "/automations/active",
//         },
//         {
//           title: "Templates",
//           url: "/automations/templates",
//         },
//       ],
//     },
//     {
//       title: "Integrations",
//       url: "/integrations",
//       icon: Zap,
//       items: [
//         {
//           title: "Instagram",
//           url: "/integrations/instagram",
//         },
//         {
//           title: "Facebook",
//           url: "/integrations/facebook",
//         },
//         {
//           title: "Twitter",
//           url: "/integrations/twitter",
//         },
//       ],
//     },
//     {
//       title: "Analytics",
//       url: "/analytics",
//       icon: BarChart3,
//       items: [
//         {
//           title: "Overview",
//           url: "/analytics/overview",
//         },
//         {
//           title: "Engagement",
//           url: "/analytics/engagement",
//         },
//         {
//           title: "Growth",
//           url: "/analytics/growth",
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: "Instagram Campaign",
//       url: "/projects/instagram",
//       icon: Frame,
//     },
//     {
//       name: "Email Automation",
//       url: "/projects/email",
//       icon: Mail,
//     },
//     {
//       name: "Lead Generation",
//       url: "/projects/leads",
//       icon: Users,
//     },
//   ],
// }

// type Props = {
//   slug: string
// }

// export function AppSidebar({ slug }: Props) {
//   const pathname = usePathname()
//   const { user, signOut } = useClerk()
//   const [searchQuery, setSearchQuery] = useState("")

//   // Transform your menu data to match the new structure
//   const transformedNavMain = data.navMain.map((item) => ({
//     ...item,
//     url: `/dashboard/${slug}${item.url}`,
//     items: item.items?.map((subItem) => ({
//       ...subItem,
//       url: `/dashboard/${slug}${subItem.url}`,
//     })),
//     isActive: pathname.startsWith(`/dashboard/${slug}${item.url}`),
//   }))

//   const transformedProjects = data.projects.map((project) => ({
//     ...project,
//     url: `/dashboard/${slug}${project.url}`,
//   }))

//   const userData = {
//     name: user?.fullName || "User",
//     email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
//     avatar: user?.imageUrl || "/avatars/default.jpg",
//   }

//   return (
//     <Sidebar variant="inset" className="border-r-0">
//       <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
//         <div className="px-2 py-2">
//           <div className="relative">
//             <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <SidebarInput
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-8"
//             />
//           </div>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={transformedNavMain} />
//         <SidebarSeparator />
//         <NavProjects projects={transformedProjects} />
//         <SidebarSeparator />
//         <SidebarGroup>
//           <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href={`/dashboard/${slug}/settings`}>
//                     <Settings2 />
//                     <span>Settings</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href={`/dashboard/${slug}/billing`}>
//                     <CreditCard />
//                     <span>Billing</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href={`/dashboard/${slug}/notifications`}>
//                     <Bell />
//                     <span>Notifications</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={userData} onSignOut={signOut} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   )
// }

"use client"
import { useState } from "react"
import { Plus, GitBranch } from "lucide-react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { PlanSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarSeparator,
  SidebarGroupAction,
} from "@/components/ui/sidebars"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { SIDEBAR_MENU } from "@/constants/menu"
import { Instagram } from "lucide-react"

// Transform your menu data to work with the new sidebar
const transformMenuData = (slug: string, pathname: string) => {
  return SIDEBAR_MENU.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      url: buildItemUrl(item, group.label, slug),
      isActive: isPathActive(item, group.label, slug, pathname),
      items: item.subItems?.map((subItem) => ({
        ...subItem,
        url: buildSubItemUrl(subItem, item, group.label, slug),
        isActive: isPathActive(subItem, group.label, slug, pathname, item),
      })),
    })),
  }))
}

// Helper function to build URLs
const buildItemUrl = (item: any, groupLabel: string, slug: string) => {
  const basePath = `/dashboard/${slug}`
  const itemPath = item.label.toLowerCase()

  if (itemPath === "home") return basePath
  if (groupLabel.toLowerCase() === "agents" && itemPath === "agents") return `${basePath}/agents`

  return `${basePath}/${itemPath}`
}

const buildSubItemUrl = (subItem: any, parentItem: any, groupLabel: string, slug: string) => {
  const basePath = `/dashboard/${slug}`
  const subItemPath = subItem.label.toLowerCase().replace(/\s+/g, "-")

  if (groupLabel.toLowerCase() === "agents") {
    return `${basePath}/agents/${subItemPath}`
  }

  return `${basePath}/${parentItem.label.toLowerCase()}/${subItemPath}`
}

// Helper function to check if path is active
const isPathActive = (item: any, groupLabel: string, slug: string, pathname: string, parentItem?: any) => {
  const itemUrl = parentItem
    ? buildSubItemUrl(item, parentItem, groupLabel, slug)
    : buildItemUrl(item, groupLabel, slug)

  return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`)
}

const teams = [
  {
    name: "Yazzil",
    logo: Instagram,
    plan: "PRO",
  },
]

type Props = {
  slug: string
}

export function AppSidebar({ slug }: Props) {
  const pathname = usePathname()
  const { user, signOut } = useClerk()
  const [searchQuery, setSearchQuery] = useState("")

  const transformedMenu = transformMenuData(slug, pathname)

  const userData = {
    name: user?.fullName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
    avatar: user?.imageUrl || "/placeholder.svg",
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r-0 bg-background">
      <SidebarHeader className="bg-background border-b border-border/50">
        <PlanSwitcher />
        {/* <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <SidebarInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-muted/50 border-border/50"
            />
          </div>
        </div> */}
      </SidebarHeader>

      <SidebarContent className="bg-background">
        {transformedMenu.map((group) => (
          <SidebarGroup key={group.id} className="px-2">
            <SidebarGroupLabel className="text-muted-foreground/70 font-medium text-xs uppercase tracking-wider">
              {group.label}
              <SidebarGroupAction asChild>
                <Plus className="h-4 w-4 opacity-60 hover:opacity-100 transition-opacity" />
              </SidebarGroupAction>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMain items={group.items} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarSeparator className="mx-4 bg-border/50" />

        {/* Quick Actions */}
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-muted-foreground/70 font-medium text-xs uppercase tracking-wider">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-accent/50">
                  <Link href={`/dashboard/${slug}/automations`}>
                    <Plus className="h-4 w-4" />
                    <span>New Automation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-accent/50">
                  <Link href={`/dashboard/${slug}/agents`}>
                    <Plus className="h-4 w-4" />
                    <span>New Agent</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-accent/50">
                  <Link href={`/dashboard/${slug}/posting`}>
                    <Instagram className="h-4 w-4" />
                    <span>Schedule Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-accent/50">
                  <Link href={`/dashboard/${slug}/affiliate`}>
                    <GitBranch className="h-4 w-4" />
                    <span>Refer & Earn</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-background border-t border-border/50">
        <NavUser user={userData} onSignOut={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
