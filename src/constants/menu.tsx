
import { v4 as uuid } from "uuid"
import {
  Home,
  Zap,
  Users,
  Settings,
  Target,
  BarChart2,
  Sparkles,
  MessageCircle,
  Clock,
  DollarSign,
  Gift,
  Award,
  Plug,
  PanelTop,
  Search,
  Upload,
  PlusCircle,
  Layout,
  HelpCircle,
  CreditCard,
  Info,
  Send,
  Instagram,
} from "lucide-react"
import type React from "react"
import { ZapDouToneBlack } from "@/icons"

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

// Helper function to add color to icons
const colorIcon = (Icon: React.ComponentType<any>, color: string, size = 20) => {
  return <Icon size={size} className={`${color} transition-colors duration-200`} />
}

export const SIDEBAR_MENU: SideBarGroupProps[] = [
  {
    id: uuid(),
    label: "Main",
    items: [
      {
        id: uuid(),
        label: "Home",
        icon: colorIcon(Home, "text-blue-400"),
      },
      {
        id: uuid(),
        label: "Automations",
        icon: colorIcon(Zap, "text-yellow-400"),
      },
      {
        id: uuid(),
        label: "Leads",
        icon: colorIcon(Users, "text-green-400"),
      },
      {
        id: uuid(),
        label: "Messages",
        icon: colorIcon(MessageCircle, "text-green-400"),
      },
      {
        id: uuid(),
        label: "Customize",
        icon: colorIcon(Target, "text-purple-400"),
      },
    ],
  },
  // {
  //   id: uuid(),
  //   label: "Influencer",
  //   items: [
  //     {
  //       id: uuid(),
  //       label: "Integrations",
  //       icon: colorIcon(Plug, "text-cyan-400"),
  //     },
  //     {
  //       id: uuid(),
  //       label: "Campaigns",
  //       icon: colorIcon(Target, "text-pink-400"),
  //       subItems: [
  //         { id: uuid(), label: "Create New", icon: colorIcon(PlusCircle, "text-green-400", 18) },
  //         { id: uuid(), label: "Templates", icon: colorIcon(Layout, "text-blue-400", 18) },
  //         { id: uuid(), label: "Analytics", icon: colorIcon(BarChart2, "text-purple-400", 18) },
  //       ],
  //     },
  //     {
  //       id: uuid(),
  //       label: "Influencers",
  //       icon: colorIcon(Instagram, "text-rose-400"),
  //       subItems: [
  //         { id: uuid(), label: "AI-Discovery", icon: colorIcon(Sparkles, "text-yellow-400", 18) },
  //         { id: uuid(), label: "Discover", icon: colorIcon(Search, "text-blue-400", 18) },
  //         { id: uuid(), label: "Import", icon: colorIcon(Upload, "text-green-400", 18) },
  //       ],
  //     },
  //     {
  //       id: uuid(),
  //       label: "Portal",
  //       icon: colorIcon(PanelTop, "text-indigo-400"),
  //       subItems: [{ id: uuid(), label: "Settings", icon: colorIcon(Settings, "text-gray-400", 18) }],
  //     },
  //   ],
  // },
  {
    id: uuid(),
    label: "System",
    items: [
      // Communication group
      // {
      //   id: uuid(),
      //   label: "Chat",
      //   icon: colorIcon(MessageCircle, "text-green-400"),
      // },
      {
        id: uuid(),
        label: "Whatsapp",
        icon: colorIcon(Send, "text-green-500"),
      },
      {
        id: uuid(),
        label: "Posting",
        icon: colorIcon(Clock, "text-blue-400"),
      },

      // // Financial group
      // {
      //   id: uuid(),
      //   label: "Payment",
      //   icon: colorIcon(CreditCard, "text-purple-400"),
      // },
      {
        id: uuid(),
        label: "Pricing",
        icon: colorIcon(DollarSign, "text-emerald-400"),
      },
      {
        id: uuid(),
        label: "Integrations",
        icon: colorIcon(Gift, "text-pink-400"),
      },
      {
        id: uuid(),
        label: "Connections",
        icon: colorIcon(ZapDouToneBlack, "text-teal-400"),
      },
      

      {
        id: uuid(),
        label: "Opportunities",
        icon: colorIcon(Award, "text-green-400"),
      },


      // Information group
      {
        id: uuid(),
        label: "Information",
        icon: colorIcon(Info, "text-cyan-400"),
      },
      {
        id: uuid(),
        label: "Help",
        icon: colorIcon(HelpCircle, "text-blue-400"),
      },
    ],
  },
]
