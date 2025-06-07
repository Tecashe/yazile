import { InstagramBlue, PlaneBlue } from "@/icons"
import { Zap, Brain, Clock, Calendar, Target } from "lucide-react"

export const AUTOMATION_TRIGGERS = [
  {
    id: "1",
    label: "Instagram Comments",
    description: "Trigger when someone comments on your posts",
    type: "COMMENT",
    icon: <InstagramBlue />,
    category: "social",
  },
  {
    id: "2",
    label: "Direct Messages",
    description: "Trigger when someone sends you a DM",
    type: "DM",
    icon: <PlaneBlue />,
    category: "social",
  },
]

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
