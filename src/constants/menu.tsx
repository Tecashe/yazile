
// import { v4 as uuid } from "uuid"
// import {
//   Home,
//   Zap,
//   Users,
//   Settings,
//   Target,
//   BarChart2,
//   Sparkles,
//   MessageCircle,
//   Clock,
//   DollarSign,
//   Gift,
//   Award,
//   Plug,
//   PanelTop,
//   Search,
//   Upload,
//   PlusCircle,
//   Layout,
//   HelpCircle,
//   CreditCard,
//   Info,
//   Send,
//   Instagram,
//   Webhook,
//   Cog,
//   Album,
//   Cpu,
//   Split,
//   GitGraph,
//   ChartAreaIcon,
//   Calculator,
//   Grid,
//   Bot,
//   CogIcon,
// } from "lucide-react"
// import type React from "react"
// import { ZapDouToneBlack } from "@/icons"

// export type SideBarItemProps = {
//   id: string
//   label: string
//   icon: React.ReactNode
//   subItems?: Omit<SideBarItemProps, "subItems">[]
// }

// export type SideBarGroupProps = {
//   id: string
//   label: string
//   items: SideBarItemProps[]
// }

// // Helper function to add color to icons
// const colorIcon = (Icon: React.ComponentType<any>, color: string, size = 20) => {
//   return <Icon size={size} className={`${color} transition-colors duration-200`} />
// }

// export const SIDEBAR_MENU: SideBarGroupProps[] = [
//   {
//     id: uuid(),
//     label: "Main",
//     items: [
//       {
//         id: uuid(),
//         label: "Home",
//         icon: colorIcon(Home, "text-blue-400"),
//       },
//       {
//         id: uuid(),
//         label: "Automations",
//         icon: colorIcon(Zap, "text-maroon-400"),
//       },
//       {
//         id: uuid(),
//         label: "Leads",
//         icon: colorIcon(Users, "text-green-400"),
//       },
//       {
//         id: uuid(),
//         label: "Messages",
//         icon: colorIcon(MessageCircle, "text-amber-400"),
//       },
//     ],
//   },
//   {
//     id: uuid(),
//     label: "Agents",
//     items: [
  
//       {
//         id: uuid(),
//         label: "Agents",
//         icon: colorIcon(Bot, "text-pink-400"),
//         subItems: [
//           { id: uuid(), label: "Workflows", icon: colorIcon(Webhook, "text-green-400", 18) },
//           { id: uuid(), label: "Templates", icon: colorIcon(Layout, "text-blue-400", 18) },
//           { id: uuid(), label: "Custom-requests", icon: colorIcon(Split, "text-purple-400", 18) },
//           { id: uuid(), label: "Stats", icon: colorIcon(Calculator, "text-cyan-400", 18) },
//         ],
//       },
      
//     ],
//   },
//   {
//     id: uuid(),
//     label: "System",
//     items: [
//       {
//         id: uuid(),
//         label: "Whatsapp",
//         icon: colorIcon(Send, "text-green-500"),
//       },
//       {
//         id: uuid(),
//         label: "Pricing",
//         icon: colorIcon(DollarSign, "text-emerald-400"),
//       },

//       {
//         id: uuid(),
//         label: "Integrations",
//         icon: colorIcon(Cpu, "text-blue-400"),
//       },
//       {
//         id: uuid(),
//         label: "Connections",
//         icon: colorIcon(ZapDouToneBlack, "text-teal-400"),
//       },
      

//       {
//         id: uuid(),
//         label: "Opportunities",
//         icon: colorIcon(Award, "text-magenta-400"),
//       },
//       {
//         id: uuid(),
//         label: "Settings",
//         icon: colorIcon(CogIcon, "text-brown-400"),
//       },

//     ],
//   },
  
// ]


import { v4 as uuid } from "uuid"
import {
  Home,
  Users,
  MessageCircle,
  Bot,
  Zap,
  Send,
  Cpu,
  DollarSign,
  Award,
  Layout,
  Webhook,
  Split,
  Calculator,
  Cog,
  Route,
} from "lucide-react"
import type React from "react"

export type SideBarItemProps = {
  id: string
  label: string
  icon: React.ReactNode
  subItems?: Omit<SideBarItemProps, "subItems">[]
}

export type SideBarGroupProps = {
  id: string
  label: string
  items: SideBarItemProps[]
}

// Helper function for colored icons
const icon = (Icon: React.ComponentType<any>, color: string, size = 20) => (
  <Icon size={size} className={`${color} transition-colors duration-200`} />
)

export const SIDEBAR_MENU: SideBarGroupProps[] = [
  {
    id: uuid(),
    label: "Dashboard",
    items: [
      {
        id: uuid(),
        label: "Home",
        icon: icon(Home, "text-blue-600"),
      },
      {
        id: uuid(),
        label: "Automations",
        icon: icon(Zap, "text-amber-600"),
      },
    ],
  },
  {
    id: uuid(),
    label: "Agents",
    items: [
      {
        id: uuid(),
        label: "Agents",
        icon: icon(Bot, "text-rose-600"),
        subItems: [
          { id: uuid(), label: "Workflows", icon: icon(Webhook, "text-teal-500", 18) },
          { id: uuid(), label: "Templates", icon: icon(Layout, "text-indigo-500", 18) },
          { id: uuid(), label: "Custom Requests", icon: icon(Split, "text-purple-500", 18) },
          { id: uuid(), label: "Analytics", icon: icon(Calculator, "text-orange-500", 18) },
        ],
      },
    ],
  },
  {
    id: uuid(),
    label: "Integrations",
    items: [
      {
        id: uuid(),
        label: "WhatsApp",
        icon: icon(Send, "text-green-600"),
      },
      {
        id: uuid(),
        label: "Connections",
        icon: icon(Route, "text-cyan-600"),
      },
      {
        id: uuid(),
        label: "Integrations",
        icon: icon(Cpu, "text-slate-600"),
      },
    ],
  },
  {
    id: uuid(),
    label: "Business",
    items: [
       {
        id: uuid(),
        label: "Leads",
        icon: icon(Users, "text-emerald-600"),
      },
      {
        id: uuid(),
        label: "Messages",
        icon: icon(MessageCircle, "text-violet-600"),
      },
      {
        id: uuid(),
        label: "Pricing",
        icon: icon(DollarSign, "text-green-700"),
      },
      {
        id: uuid(),
        label: "Opportunities",
        icon: icon(Award, "text-yellow-600"),
      },
      {
        id: uuid(),
        label: "Settings",
        icon: icon(Cog, "text-gray-600"),
      },
    ],
  },
]