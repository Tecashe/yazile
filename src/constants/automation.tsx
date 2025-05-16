import { PlaneBlue, SmartAi, TinyInstagram } from '@/icons'
import { v4 } from 'uuid'

export type AutomationListenerProps = {
  id: string
  label: string
  icon: JSX.Element
  description: string
  type: 'SMARTAI' | 'MESSAGE'
}
export type AutomationsTriggerProps = {
  id: string
  label: string
  icon: JSX.Element
  description: string
  type: 'COMMENT' | 'DM'
}

export const AUTOMATION_TRIGGERS: AutomationsTriggerProps[] = [
  {
    id: v4(),
    label: 'User comments on my post',
    icon: <TinyInstagram />,
    description: 'Select if you want to automate comments on your post',
    type: 'COMMENT',
  },
  {
    id: v4(),
    label: 'User sends me a dm with a keyword',
    icon: <TinyInstagram />,
    description: 'Select if you want to automate DMs on your profile',
    type: 'DM',
  },
]

export const AUTOMATION_LISTENERS: AutomationListenerProps[] = [
  {
    id: v4(),
    label: 'Manually write the message to be automatically sent to the user',
    icon: <PlaneBlue />,
    description: 'Enter the message that you want to send a user.',
    type: 'MESSAGE',
  },
  {
    id: v4(),
    label: 'Use a custom trained Agent',
    icon: <SmartAi />,
    description: 'Your data is Used to train your custom agent for custom responses',
    type: 'SMARTAI',
  },
]
