// export const PLATFORMS = {
//   INSTAGRAM: "INSTAGRAM",
//   FACEBOOK: "FACEBOOK",
//   LINKEDIN: "LINKEDIN",
//   WHATSAPP: "WHATSAPP",
// } as const

// export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS]

// export const PLATFORM_CONFIG: Record<
//   Platform,
//   {
//     name: string
//     icon: string
//     color: string
//     description: string
//     capabilities: {
//       hasDMs: boolean
//       hasComments: boolean
//       hasPosts: boolean
//       hasPages: boolean
//     }
//     triggerTypes: string[]
//     responseTypes: string[]
//   }
// > = {
//   INSTAGRAM: {
//     name: "Instagram",
//     icon: "📷",
//     color: "from-pink-500 to-purple-600",
//     description: "Automate Instagram DMs and comments",
//     capabilities: {
//       hasDMs: true,
//       hasComments: true,
//       hasPosts: true,
//       hasPages: false,
//     },
//     triggerTypes: ["DM", "COMMENT", "MENTION"],
//     responseTypes: ["MESSAGE", "SMARTAI", "TEMPLATE"],
//   },
//   FACEBOOK: {
//     name: "Facebook",
//     icon: "f",
//     color: "from-blue-600 to-blue-700",
//     description: "Automate Facebook page messages and comments",
//     capabilities: {
//       hasDMs: true,
//       hasComments: true,
//       hasPosts: true,
//       hasPages: true,
//     },
//     triggerTypes: ["DM", "COMMENT", "PAGE_MESSAGE"],
//     responseTypes: ["MESSAGE", "SMARTAI", "TEMPLATE"],
//   },
//   LINKEDIN: {
//     name: "LinkedIn",
//     icon: "in",
//     color: "from-blue-700 to-blue-800",
//     description: "Automate LinkedIn messages and comments",
//     capabilities: {
//       hasDMs: true,
//       hasComments: true,
//       hasPosts: true,
//       hasPages: false,
//     },
//     triggerTypes: ["DM", "COMMENT", "CONNECTION_REQUEST"],
//     responseTypes: ["MESSAGE", "SMARTAI", "TEMPLATE"],
//   },
//   WHATSAPP: {
//     name: "WhatsApp",
//     icon: "💬",
//     color: "from-green-500 to-green-600",
//     description: "Automate WhatsApp Business messages",
//     capabilities: {
//       hasDMs: true,
//       hasComments: false,
//       hasPosts: false,
//       hasPages: false,
//     },
//     triggerTypes: ["MESSAGE", "TEMPLATE_MESSAGE"],
//     responseTypes: ["MESSAGE", "SMARTAI", "TEMPLATE"],
//   },
// }

// export const getPlatformConfig = (platform: Platform) => PLATFORM_CONFIG[platform]



export const PLATFORMS = {
  INSTAGRAM: "INSTAGRAM",
  FACEBOOK: "FACEBOOK",
  LINKEDIN: "LINKEDIN",
  WHATSAPP: "WHATSAPP",
} as const

export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS]

export const PLATFORM_CONFIG: Record<
  Platform,
  {
    name: string
    icon: string
    color: string
    description: string
    capabilities: {
      hasDMs: boolean
      hasComments: boolean
      hasPosts: boolean
      hasPages: boolean
    }
    triggerTypes: string[]
    responseTypes: ("SMARTAI" | "MESSAGE")[]
  }
> = {
  INSTAGRAM: {
    name: "Instagram",
    icon: "📷",
    color: "from-pink-500 to-purple-600",
    description: "Automate Instagram DMs and comments",
    capabilities: {
      hasDMs: true,
      hasComments: true,
      hasPosts: true,
      hasPages: false,
    },
    triggerTypes: ["DM", "COMMENT", "MENTION"],
    responseTypes: ["MESSAGE", "SMARTAI"],
  },
  FACEBOOK: {
    name: "Facebook",
    icon: "f",
    color: "from-blue-600 to-blue-700",
    description: "Automate Facebook page messages and comments",
    capabilities: {
      hasDMs: true,
      hasComments: true,
      hasPosts: true,
      hasPages: true,
    },
    triggerTypes: ["DM", "COMMENT", "PAGE_MESSAGE"],
    responseTypes: ["MESSAGE", "SMARTAI"],
  },
  LINKEDIN: {
    name: "LinkedIn",
    icon: "in",
    color: "from-blue-700 to-blue-800",
    description: "Automate LinkedIn messages and comments",
    capabilities: {
      hasDMs: true,
      hasComments: true,
      hasPosts: true,
      hasPages: false,
    },
    triggerTypes: ["DM", "COMMENT", "CONNECTION_REQUEST"],
    responseTypes: ["MESSAGE", "SMARTAI"],
  },
  WHATSAPP: {
    name: "WhatsApp",
    icon: "💬",
    color: "from-green-500 to-green-600",
    description: "Automate WhatsApp Business messages",
    capabilities: {
      hasDMs: true,
      hasComments: false,
      hasPosts: false,
      hasPages: false,
    },
    triggerTypes: ["MESSAGE", "TEMPLATE_MESSAGE"],
    responseTypes: ["MESSAGE", "SMARTAI"],
  },
}

export const getPlatformConfig = (platform: Platform) => PLATFORM_CONFIG[platform]

