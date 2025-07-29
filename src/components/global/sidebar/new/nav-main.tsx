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

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebars"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltips"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    description?: string
    items?: {
      title: string
      url: string
      description?: string
    }[]
  }[]
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="hover:bg-accent/50 transition-colors"
                        asChild={!item.items}
                      >
                        {item.items ? (
                          <div className="flex items-center w-full">
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </div>
                        ) : (
                          <Link href={item.url} className="flex items-center w-full">
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </TooltipTrigger>
                  {item.description && (
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                {item.items?.length && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuSubButton asChild className="hover:bg-accent/30 transition-colors">
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </TooltipTrigger>
                            {subItem.description && (
                              <TooltipContent side="right" className="max-w-xs">
                                <p className="font-medium">{subItem.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{subItem.description}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  )
}
