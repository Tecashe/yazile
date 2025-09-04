import {
  AutomationDuoToneBlue,
} from '@/icons'
import { Zap, PersonStanding, Cog, Cpu, Home, CogIcon } from 'lucide-react'

export const PAGE_BREAD_CRUMBS: string[] = [
  'automations',
  'integrations',
  'tools',
  'settings',
  'leads',
  
  
]

type Props = {
  [page in string]: React.ReactNode
}

export const PAGE_ICON: Props = {
  AUTOMATION: <AutomationDuoToneBlue />,
  AUTOMATIONS: <Zap />,
  INTEGRATIONS: <Cpu />,
  SETTINGS: <Cog />,
  HOME: <Home />,
  LEADS:<PersonStanding/>,
  TOOLS:<CogIcon/>
  
}

// export const PLANS = [
//   {
//     name: 'Free Plan',
//     description: 'Perfect for getting started',
//     price: '$0',
//     features: [
//       'Boost engagement with target responses',
//       'Automate comment replies to enhance audience interaction',
//       'Turn followers into customers with targeted messaging',
//     ],
//     cta: 'Get Started',
//   },
//   {
//     name: 'Smart AI Plan',
//     description: 'Advanced features for power users',
//     price: '$89',
//     features: [
//       'All features from Free Plan',
//       'AI-powered response generation',
//       'Advanced analytics and insights',
//       'Priority customer support',
//       'Custom branding options',
//     ],
//     cta: 'Upgrade Now',
//   },
// ]
