'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Clock,
  Lightbulb,
  Zap,
  Users,
  BarChart3,
  Bot,
  Globe,
  Shield,
  Smartphone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q1 2024",
      status: "completed",
      items: [
        {
          title: "Advanced AI Response Engine",
          description: "Improved natural language processing for more human-like automated responses",
          icon: <Bot className="h-5 w-5" />,
          category: "AI & Automation",
        },
        {
          title: "Multi-Language Support",
          description: "Support for 15+ languages in automation and interface",
          icon: <Globe className="h-5 w-5" />,
          category: "Platform",
        },
        {
          title: "Enhanced Analytics Dashboard",
          description: "Real-time metrics and advanced reporting capabilities",
          icon: <BarChart3 className="h-5 w-5" />,
          category: "Analytics",
        },
      ],
    },
    {
      quarter: "Q2 2024",
      status: "completed",
      items: [
        {
          title: "Influencer Marketplace",
          description: "Built-in marketplace to discover and connect with verified influencers",
          icon: <Users className="h-5 w-5" />,
          category: "Influencer Marketing",
        },
        {
          title: "Advanced Lead Scoring",
          description: "Machine learning-powered lead qualification and scoring system",
          icon: <Zap className="h-5 w-5" />,
          category: "Lead Management",
        },
        {
          title: "Team Collaboration Tools",
          description: "Role-based access control and team workflow management",
          icon: <Users className="h-5 w-5" />,
          category: "Platform",
        },
      ],
    },
    {
      quarter: "Q3 2024",
      status: "in-progress",
      items: [
        {
          title: "Mobile App (iOS & Android)",
          description: "Native mobile apps for on-the-go social media management",
          icon: <Smartphone className="h-5 w-5" />,
          category: "Mobile",
        },
        {
          title: "Video Content Automation",
          description: "AI-powered video content creation and scheduling",
          icon: <Bot className="h-5 w-5" />,
          category: "Content Creation",
        },
        {
          title: "Advanced Security Features",
          description: "SOC 2 compliance and enhanced data protection",
          icon: <Shield className="h-5 w-5" />,
          category: "Security",
        },
      ],
    },
    {
      quarter: "Q4 2024",
      status: "planned",
      items: [
        {
          title: "AI Content Generator",
          description: "Generate posts, captions, and responses using advanced AI",
          icon: <Lightbulb className="h-5 w-5" />,
          category: "AI & Automation",
        },
        {
          title: "Advanced Workflow Builder",
          description: "Visual workflow builder with conditional logic and branching",
          icon: <Zap className="h-5 w-5" />,
          category: "Automation",
        },
        {
          title: "Enterprise SSO",
          description: "Single sign-on integration for enterprise customers",
          icon: <Shield className="h-5 w-5" />,
          category: "Enterprise",
        },
      ],
    },
    {
      quarter: "Q1 2025",
      status: "planned",
      items: [
        {
          title: "Voice Message Automation",
          description: "AI-powered voice message responses for social platforms",
          icon: <Bot className="h-5 w-5" />,
          category: "AI & Automation",
        },
        {
          title: "Predictive Analytics",
          description: "Forecast engagement trends and optimal posting times",
          icon: <BarChart3 className="h-5 w-5" />,
          category: "Analytics",
        },
        {
          title: "White-Label Solution",
          description: "Fully customizable white-label platform for agencies",
          icon: <Globe className="h-5 w-5" />,
          category: "Enterprise",
        },
      ],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "planned":
        return <Lightbulb className="h-5 w-5 text-orange-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            In Progress
          </Badge>
        )
      case "planned":
        return (
          <Badge variant="default" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            Planned
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="sticky top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img src="/yazzil-logos.png" alt="Yazzil logo" className="h-16 w-16" />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 radial--gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Product Roadmap
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">The Future of Yazzil</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                See what we&apos;re building next. Our roadmap is driven by customer feedback and the latest innovations in
                AI and social media technology.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="space-y-12">
              {roadmapItems.map((quarter, i) => (
                <div key={i} className="relative">
                  {/* Timeline Line */}
                  {i < roadmapItems.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-full bg-border/50 -z-10" />
                  )}

                  {/* Quarter Header */}
                  <div className="flex items-center gap-4 mb-6">
                    {getStatusIcon(quarter.status)}
                    <h2 className="text-2xl font-bold">{quarter.quarter}</h2>
                    {getStatusBadge(quarter.status)}
                  </div>

                  {/* Quarter Items */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ml-9">
                    {quarter.items.map((item, j) => (
                      <Card
                        key={j}
                        className={`border-border/50 bg-background/50 ${
                          quarter.status === "completed"
                            ? "border-green-500/20 bg-green-500/5"
                            : quarter.status === "in-progress"
                              ? "border-blue-500/20 bg-blue-500/5"
                              : "border-orange-500/20 bg-orange-500/5"
                        }`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            {item.icon}
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <h3 className="font-bold">{item.title}</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Requests */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Shape Our Roadmap</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your feedback drives our development. Vote on features or suggest new ones.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-bold">TikTok Integration</h3>
                  <p className="text-sm text-muted-foreground">Automate TikTok comments and direct messages</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">247 votes</span>
                    <Button size="sm" variant="outline">
                      Vote
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-bold">Bulk Content Scheduler</h3>
                  <p className="text-sm text-muted-foreground">Schedule multiple posts across platforms at once</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">189 votes</span>
                    <Button size="sm" variant="outline">
                      Vote
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-bold">Advanced Reporting</h3>
                  <p className="text-sm text-muted-foreground">Custom reports with advanced filtering options</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">156 votes</span>
                    <Button size="sm" variant="outline">
                      Vote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button>Submit Feature Request</Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Be Part of Our Journey</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of businesses already using Yazzil and help shape the future of social media automation.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Start Free Trial</Button>
                <Button size="lg" variant="outline">
                  Join Beta Program
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/yazzil-logos.png" alt="Yazzil logo" className="h-16 w-16" />
              </div>

              <p className="text-sm text-muted-foreground">
                The all-in-one platform for social media automation, influencer marketing, and lead qualification.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="h-5 w-5" style={{ color: "#E4405F" }} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" style={{ color: "#1877F2" }} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" style={{ color: "#1DA1F2" }} />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" style={{ color: "#0A66C2" }} />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#solutions" className="text-muted-foreground hover:text-foreground">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-muted-foreground hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Yazzil. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
