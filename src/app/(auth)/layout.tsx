import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import {
  MessageCircle,
  Bot,
  Target,
  LineChartIcon as ChartLine,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Instagram,
  Database,
  Brain,
  UserCheck,
  DollarSign,
  Settings,
  Heart,
} from "lucide-react"

const slides = [
  {
    title: "Instagram DM Automation",
    description:
      "Automatically respond to Instagram comments and DMs with intelligent, personalized messages that convert followers into customers.",
    icon: <Instagram size={48} className="text-white" />,
    color: "from-primary to-accent",
    stats: "90% faster response times",
  },
  {
    title: "AI Lead Qualification",
    description:
      "Advanced message analysis identifies high-value prospects automatically, scoring leads based on intent and engagement patterns.",
    icon: <Brain size={48} className="text-white" />,
    color: "from-chart-1 to-chart-2",
    stats: "3x more qualified leads",
  },
  {
    title: "Smart Sentiment Analysis",
    description:
      "Real-time sentiment tracking helps you understand customer emotions and respond appropriately to maintain positive relationships.",
    icon: <Heart size={48} className="text-white" />,
    color: "from-chart-2 to-chart-3",
    stats: "95% sentiment accuracy",
  },
  {
    title: "Revenue Opportunity Tracking",
    description:
      "Identify platinum, gold, silver, and bronze leads with estimated revenue potential and conversion probability scoring.",
    icon: <DollarSign size={48} className="text-white" />,
    color: "from-chart-4 to-chart-5",
    stats: "Track $100K+ in opportunities",
  },
  {
    title: "Influencer Marketing Hub",
    description:
      "Discover, manage, and collaborate with influencers. Track campaigns, manage applications, and measure ROI all in one place.",
    icon: <Users size={48} className="text-white" />,
    color: "from-chart-5 to-chart-1",
    stats: "10,000+ influencer network",
  },
  {
    title: "CRM Integration",
    description:
      "Seamlessly sync qualified leads with HubSpot, Salesforce, Pipedrive, and other CRMs. Never lose a potential customer again.",
    icon: <Database size={48} className="text-white" />,
    color: "from-secondary to-accent",
    stats: "15+ CRM integrations",
  },
  {
    title: "Human Handoff System",
    description:
      "When automation reaches its limits, seamlessly transfer conversations to human agents with full context and conversation history.",
    icon: <UserCheck size={48} className="text-white" />,
    color: "from-chart-3 to-chart-4",
    stats: "Instant agent notifications",
  },
  {
    title: "Advanced Analytics",
    description:
      "Track engagement rates, conversion metrics, revenue attribution, and ROI with comprehensive dashboards and reports.",
    icon: <ChartLine size={48} className="text-white" />,
    color: "from-chart-1 to-chart-3",
    stats: "Real-time performance insights",
  },
  {
    title: "Multi-Platform Support",
    description:
      "Expand beyond Instagram with WhatsApp Business, Facebook, and other social platforms for comprehensive social commerce.",
    icon: <MessageCircle size={48} className="text-white" />,
    color: "from-chart-2 to-chart-4",
    stats: "5+ social platforms",
  },
  {
    title: "Custom Workflow Builder",
    description:
      "Create sophisticated automation workflows with n8n integration, custom triggers, and business-specific logic.",
    icon: <Settings size={48} className="text-white" />,
    color: "from-primary to-secondary",
    stats: "Unlimited custom workflows",
  },
  {
    title: "Lead Nurturing Sequences",
    description:
      "Automated follow-up sequences keep prospects engaged with personalized messages based on their behavior and interests.",
    icon: <Target size={48} className="text-white" />,
    color: "from-chart-4 to-chart-2",
    stats: "40% higher conversion rates",
  },
  {
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, audit logs, and compliance with global data protection standards.",
    icon: <Shield size={48} className="text-white" />,
    color: "from-muted to-accent",
    stats: "SOC 2 & GDPR compliant",
  },
  {
    title: "Lightning Fast Performance",
    description:
      "Sub-second response times ensure your customers never wait. Optimized for high-volume social media interactions.",
    icon: <Zap size={48} className="text-white" />,
    color: "from-chart-5 to-chart-3",
    stats: "< 100ms response time",
  },
  {
    title: "Revenue Growth Tracking",
    description:
      "Monitor revenue attribution from social media interactions, track customer lifetime value, and optimize for profitability.",
    icon: <TrendingUp size={48} className="text-white" />,
    color: "from-chart-3 to-chart-5",
    stats: "Track revenue impact",
  },
  {
    title: "Smart AI Triggers",
    description:
      "Advanced AI understands context, intent, and urgency to trigger the right automation at the perfect moment for maximum impact.",
    icon: <Bot size={48} className="text-white" />,
    color: "from-accent to-primary",
    stats: "99% trigger accuracy",
  },
]

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.02]" />
      </div>

      {/* Floating geometric shapes with enhanced glow */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse glow" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700 glow" />

      {/* Additional floating elements */}
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      {/* Glowing lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shimmerBorder" />
      <div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shimmerBorder"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 flex min-h-screen">
        {/* Left sidebar with brand elements - increased width to 45% */}
        <div className="hidden lg:flex w-[45%] bg-card/30 backdrop-blur-xl flex-col justify-between p-8 border-r border-border/50">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow shadow-lg">
                <Instagram className="text-primary-foreground w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Yazzil</h1>
            </div>

            {/* Dynamic Card Showcase */}
            
          </div>

          {/* Footer with enhanced styling */}
          <div className="text-muted-foreground text-sm border-t border-border/30 pt-4 mt-4">
            <p className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>© 2025 Yazzil.
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Animated progress bar at the top */}
          <div className="h-1 bg-muted w-full">
            <div
              className="h-full bg-gradient-to-r from-primary via-chart-1 to-chart-2 animate-shimmer"
              style={{
                width: `20%`,
                transition: "width 0.5s ease-out",
              }}
            ></div>
          </div>

          <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[600px]">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <div className="absolute inset-0 h-12 w-12 rounded-full blur-lg bg-primary/20 animate-pulse"></div>
                    </div>
                    <span className="mt-4 text-foreground">Loading your experience...</span>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </main>

          {/* Floating help button with enhanced glow effect */}
          <div className="fixed bottom-6 right-6 z-50">
            <button className="group flex items-center space-x-2 bg-card/80 hover:bg-card backdrop-blur-lg rounded-full py-2 px-4 text-foreground transition-all duration-300 border border-border/50 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center group-hover:shadow-[0_0_10px_hsl(var(--primary)/0.8)] text-primary-foreground text-sm font-bold">
                ?
              </span>
              <span className="hidden group-hover:inline transition-all duration-300">Need help?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
