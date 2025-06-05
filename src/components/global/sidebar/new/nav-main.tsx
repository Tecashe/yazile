// "use client"

// import { ChevronRight, type LucideIcon } from "lucide-react"

// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebars"
// import Link from "next/link"

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string
//     url: string
//     icon?: LucideIcon
//     isActive?: boolean
//     items?: {
//       title: string
//       url: string
//     }[]
//   }[]
// }) {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Platform</SidebarGroupLabel>
//       <SidebarMenu>
//         {items.map((item) => (
//           <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
//             <SidebarMenuItem>
//               <CollapsibleTrigger asChild>
//                 <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
//                   {item.icon && <item.icon />}
//                   <span>{item.title}</span>
//                   {item.items && (
//                     <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                   )}
//                 </SidebarMenuButton>
//               </CollapsibleTrigger>
//               {item.items && (
//                 <CollapsibleContent>
//                   <SidebarMenuSub>
//                     {item.items?.map((subItem) => (
//                       <SidebarMenuSubItem key={subItem.title}>
//                         <SidebarMenuSubButton asChild>
//                           <Link href={subItem.url}>
//                             <span>{subItem.title}</span>
//                           </Link>
//                         </SidebarMenuSubButton>
//                       </SidebarMenuSubItem>
//                     ))}
//                   </SidebarMenuSub>
//                 </CollapsibleContent>
//               )}
//             </SidebarMenuItem>
//           </Collapsible>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   )
// }

// "use client"

// import type React from "react"

// import { ChevronRight } from "lucide-react"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebars"
// import Link from "next/link"

// export function NavMain({
//   items,
// }: {
//   items: {
//     id: string
//     label: string
//     icon: React.ReactNode
//     url: string
//     isActive?: boolean
//     items?: {
//       id: string
//       label: string
//       icon: React.ReactNode
//       url: string
//       isActive?: boolean
//     }[]
//   }[]
// }) {
//   return (
//     <SidebarMenu>
//       {items.map((item) => (
//         <Collapsible
//           key={item.id}
//           asChild
//           defaultOpen={item.isActive || item.items?.some((subItem) => subItem.isActive)}
//           className="group/collapsible"
//         >
//           <SidebarMenuItem>
//             <CollapsibleTrigger asChild>
//               <SidebarMenuButton
//                 tooltip={item.label}
//                 isActive={item.isActive}
//                 className="hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
//                 asChild={!item.items}
//               >
//                 {item.items ? (
//                   <div className="flex items-center w-full">
//                     <span className="flex items-center justify-center w-5 h-5 mr-2">{item.icon}</span>
//                     <span className="flex-1">{item.label}</span>
//                     <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                   </div>
//                 ) : (
//                   <Link href={item.url} className="flex items-center w-full">
//                     <span className="flex items-center justify-center w-5 h-5 mr-2">{item.icon}</span>
//                     <span className="flex-1">{item.label}</span>
//                   </Link>
//                 )}
//               </SidebarMenuButton>
//             </CollapsibleTrigger>
//             {item.items && (
//               <CollapsibleContent>
//                 <SidebarMenuSub>
//                   {item.items.map((subItem) => (
//                     <SidebarMenuSubItem key={subItem.id}>
//                       <SidebarMenuSubButton
//                         asChild
//                         isActive={subItem.isActive}
//                         className="hover:bg-accent/30 data-[active=true]:bg-accent/50"
//                       >
//                         <Link href={subItem.url} className="flex items-center">
//                           <span className="flex items-center justify-center w-4 h-4 mr-2">{subItem.icon}</span>
//                           <span>{subItem.label}</span>
//                         </Link>
//                       </SidebarMenuSubButton>
//                     </SidebarMenuSubItem>
//                   ))}
//                 </SidebarMenuSub>
//               </CollapsibleContent>
//             )}
//           </SidebarMenuItem>
//         </Collapsible>
//       ))}
//     </SidebarMenu>
//   )
// }

"use client"

import type React from "react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebars"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    id: string
    label: string
    icon: React.ReactNode
    url: string
    isActive?: boolean
    items?: {
      id: string
      label: string
      icon: React.ReactNode
      url: string
      isActive?: boolean
    }[]
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible
          key={item.id}
          asChild
          defaultOpen={item.isActive || item.items?.some((subItem) => subItem.isActive)}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            {item.items ? (
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={item.isActive}
                  className="hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                >
                  <div className="flex items-center w-full">
                    <span className="flex items-center justify-center w-5 h-5 mr-2">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            ) : (
              <SidebarMenuButton
                tooltip={item.label}
                isActive={item.isActive}
                className="hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                asChild
              >
                <Link href={item.url} className="flex items-center w-full">
                  <span className="flex items-center justify-center w-5 h-5 mr-2">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            )}
            {item.items && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.isActive}
                        className="hover:bg-accent/30 data-[active=true]:bg-accent/50"
                      >
                        <Link href={subItem.url} className="flex items-center">
                          <span className="flex items-center justify-center w-4 h-4 mr-2">{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  )
}
