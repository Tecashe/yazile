import { InstagramBlue, PlaneBlue } from "@/icons"
import { Zap, Brain, Clock, Calendar, Target } from "lucide-react"
import { MessageCircle, Send } from "lucide-react"

export const AUTOMATION_TRIGGERS = [
  {
    id: "1",
    label: "Comment",
    description: "Respond to comments on your posts",
    type: "COMMENT" as const,
    icon: <MessageCircle className="h-4 w-4" />,
    category: "engagement",
  },
  {
    id: "2",
    label: "Direct Message",
    description: "Respond to direct messages",
    type: "DM" as const,
    icon: <Send className="h-4 w-4" />,
    category: "messaging",
  },
  // ... add other triggers with proper types
]

export type TriggerType = (typeof AUTOMATION_TRIGGERS)[number]["type"]



export const TRIGGER_MODES = [
  {
    id: "keywords",
    label: "Keyword Triggers",
    description: "Respond only to specific keywords or phrases",
    type: "KEYWORDS",
    icon: <Target className="h-5 w-5" />,
    color: "blue",
    pros: ["Precise targeting", "Low false positives", "Easy to control"],
    cons: ["May miss variations", "Requires keyword management"],
    useCase: "Best for specific product inquiries or support topics",
  },
  {
    id: "any_message",
    label: "Universal Response",
    description: "Respond to any message or comment received",
    type: "ANY_MESSAGE",
    icon: <Zap className="h-5 w-5" />,
    color: "purple",
    pros: ["Never miss a message", "Maximum coverage", "Simple setup"],
    cons: ["High response volume", "May respond to spam", "Less targeted"],
    useCase: "Perfect for customer service or general inquiries",
  },
  {
    id: "smart_ai",
    label: "AI Smart Filter",
    description: "AI analyzes message intent and responds intelligently",
    type: "SMART_AI",
    icon: <Brain className="h-5 w-5" />,
    color: "yellow",
    pros: ["Intelligent filtering", "Context awareness", "Spam protection"],
    cons: ["AI processing time", "Requires training", "More complex"],
    useCase: "Ideal for businesses with high message volume",
  },
  {
    id: "scheduled",
    label: "Time-Based Triggers",
    description: "Trigger automations at specific times or intervals",
    type: "SCHEDULED",
    icon: <Clock className="h-5 w-5" />,
    color: "green",
    pros: ["Predictable timing", "Great for campaigns", "No user input needed"],
    cons: ["Not interactive", "Fixed schedule", "May not be relevant"],
    useCase: "Perfect for newsletters, reminders, or promotional content",
  },
  {
    id: "event_based",
    label: "Event Triggers",
    description: "Trigger based on user actions or milestones",
    type: "EVENT",
    icon: <Calendar className="h-5 w-5" />,
    color: "orange",
    pros: ["Highly relevant", "Action-based", "Personalized timing"],
    cons: ["Complex setup", "Requires event tracking", "Technical integration"],
    useCase: "Great for onboarding, milestones, or behavior-based responses",
  },
]
