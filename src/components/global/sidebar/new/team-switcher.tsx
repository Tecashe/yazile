// "use client"

// import * as React from "react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
// import { ChevronsUpDown, Plus } from "lucide-react"

// export function TeamSwitcher({
//   teams,
// }: {
//   teams: {
//     name: string
//     logo: React.ElementType
//     plan: string
//   }[]
// }) {
//   const { isMobile } = useSidebar()
//   const [activeTeam, setActiveTeam] = React.useState(teams[0])

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//                 <activeTeam.logo className="size-4" />
//               </div>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">{activeTeam.name}</span>
//                 <span className="truncate text-xs">{activeTeam.plan}</span>
//               </div>
//               <ChevronsUpDown className="ml-auto" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//             align="start"
//             side={isMobile ? "bottom" : "right"}
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
//             {teams.map((team, index) => (
//               <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
//                 <div className="flex size-6 items-center justify-center rounded-sm border">
//                   <team.logo className="size-4 shrink-0" />
//                 </div>
//                 {team.name}
//                 <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="gap-2 p-2">
//               <div className="flex size-6 items-center justify-center rounded-md border bg-background">
//                 <Plus className="size-4" />
//               </div>
//               <div className="font-medium text-muted-foreground">Add team</div>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }

// "use client"

// import * as React from "react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
// import { ChevronsUpDown, Plus } from "lucide-react"

// export function TeamSwitcher({
//   teams,
// }: {
//   teams: {
//     name: string
//     logo: React.ElementType
//     plan: string
//   }[]
// }) {
//   const { isMobile } = useSidebar()
//   const [activeTeam, setActiveTeam] = React.useState(teams[0])

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent/50"
//             >
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md">
//                 <activeTeam.logo className="size-4" />
//               </div>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">{activeTeam.name}</span>
//                 <span className="truncate text-xs text-muted-foreground">{activeTeam.plan}</span>
//               </div>
//               <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background border-border"
//             align="start"
//             side={isMobile ? "bottom" : "right"}
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
//             {teams.map((team, index) => (
//               <DropdownMenuItem
//                 key={team.name}
//                 onClick={() => setActiveTeam(team)}
//                 className="gap-2 p-2 hover:bg-accent/50"
//               >
//                 <div className="flex size-6 items-center justify-center rounded-sm border bg-gradient-to-tr from-blue-600 to-blue-400 text-white">
//                   <team.logo className="size-4 shrink-0" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{team.name}</span>
//                   <span className="text-xs text-muted-foreground">{team.plan}</span>
//                 </div>
//                 <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="gap-2 p-2 hover:bg-accent/50">
//               <div className="flex size-6 items-center justify-center rounded-md border bg-background">
//                 <Plus className="size-4" />
//               </div>
//               <div className="font-medium text-muted-foreground">Add team</div>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }


"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebars"
import { ChevronsUpDown, Plus } from "lucide-react"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const sidebar = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  let isMobile = false

  try {
    isMobile = sidebar.isMobile
  } catch (error) {
    // Fallback when not in sidebar context
    console.warn("TeamSwitcher used outside SidebarProvider context")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent/50"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md">
                {React.createElement(activeTeam.logo, { className: "size-4" })}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs text-muted-foreground">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background border-border"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 hover:bg-accent/50"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-gradient-to-tr from-blue-600 to-blue-400 text-white">
                  {React.createElement(team.logo, { className: "size-4 shrink-0" })}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{team.name}</span>
                  <span className="text-xs text-muted-foreground">{team.plan}</span>
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 hover:bg-accent/50">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
