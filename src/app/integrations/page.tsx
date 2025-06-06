import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Sparkles,
  Search,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Database,
  Zap,
  Mail,
  BarChart3,
  CheckCircle,
  ExternalLink,
} from "lucide-react"

export default function IntegrationsPage() {
  const integrationCategories = [
    {
      name: "Social Media",
      count: 8,
      integrations: [
        {
          name: "Instagram",
          icon: <Instagram className="h-8 w-8" style={{ color: "#E4405F" }} />,
          description: "Automate comments, DMs, and story interactions",
          features: ["Comment automation", "DM management", "Story engagement", "Analytics"],
          status: "Available",
        },
        {
          name: "Facebook",
          icon: <Facebook className="h-8 w-8" style={{ color: "#1877F2" }} />,
          description: "Manage pages, groups, and messenger conversations",
          features: ["Page management", "Group automation", "Messenger bots", "Ad insights"],
          status: "Available",
        },
        {
          name: "Twitter",
          icon: <Twitter className="h-8 w-8" style={{ color: "#1DA1F2" }} />,
          description: "Engage with tweets, mentions, and direct messages",
          features: ["Tweet automation", "Mention tracking", "DM responses", "Hashtag monitoring"],
          status: "Available",
        },
        {
          name: "LinkedIn",
          icon: <Linkedin className="h-8 w-8" style={{ color: "#0A66C2" }} />,
          description: "Professional networking and B2B lead generation",
          features: ["Connection requests", "Message automation", "Post engagement", "Lead tracking"],
          status: "Available",
        },
      ],
    },
    {
      name: "Messaging",
      count: 4,
      integrations: [
        {
          name: "WhatsApp Business",
          icon: <MessageSquare className="h-8 w-8" style={{ color: "#25D366" }} />,
          description: "Automate customer support and marketing messages",
          features: ["Message templates", "Broadcast lists", "Chatbots", "Media sharing"],
          status: "Available",
        },
        {
          name: "Telegram",
          icon: <MessageSquare className="h-8 w-8" style={{ color: "#0088CC" }} />,
          description: "Manage channels and group communications",
          features: ["Channel automation", "Group management", "Bot integration", "File sharing"],
          status: "Beta",
        },
      ],
    },
    {
      name: "CRM & Sales",
      count: 6,
      integrations: [
        {
          name: "HubSpot",
          icon: <Database className="h-8 w-8" style={{ color: "#FF7A59" }} />,
          description: "Sync leads and customer data seamlessly",
          features: ["Contact sync", "Deal tracking", "Email sequences", "Analytics"],
          status: "Available",
        },
        {
          name: "Salesforce",
          icon: <Database className="h-8 w-8" style={{ color: "#00A1E0" }} />,
          description: "Enterprise CRM integration for large teams",
          features: ["Lead management", "Opportunity tracking", "Custom fields", "Workflows"],
          status: "Available",
        },
        {
          name: "Pipedrive",
          icon: <Database className="h-8 w-8" style={{ color: "#1A1A1A" }} />,
          description: "Simple CRM for small to medium businesses",
          features: ["Pipeline management", "Activity tracking", "Email integration", "Reports"],
          status: "Available",
        },
      ],
    },
    {
      name: "Automation",
      count: 5,
      integrations: [
        {
          name: "Zapier",
          icon: <Zap className="h-8 w-8" style={{ color: "#FF4A00" }} />,
          description: "Connect with 5000+ apps through Zapier",
          features: ["Custom workflows", "Trigger actions", "Data mapping", "Multi-step zaps"],
          status: "Available",
        },
        {
          name: "Make (Integromat)",
          icon: <Zap className="h-8 w-8" style={{ color: "#6366F1" }} />,
          description: "Advanced automation scenarios and workflows",
          features: ["Visual builder", "Complex logic", "Error handling", "Scheduling"],
          status: "Available",
        },
      ],
    },
    {
      name: "Email Marketing",
      count: 4,
      integrations: [
        {
          name: "Mailchimp",
          icon: <Mail className="h-8 w-8" style={{ color: "#FFE01B" }} />,
          description: "Sync leads to email marketing campaigns",
          features: ["List management", "Campaign automation", "Segmentation", "Analytics"],
          status: "Available",
        },
        {
          name: "ConvertKit",
          icon: <Mail className="h-8 w-8" style={{ color: "#FB6970" }} />,
          description: "Creator-focused email marketing platform",
          features: ["Subscriber tagging", "Sequence automation", "Landing pages", "Forms"],
          status: "Available",
        },
      ],
    },
    {
      name: "Analytics",
      count: 3,
      integrations: [
        {
          name: "Google Analytics",
          icon: <BarChart3 className="h-8 w-8" style={{ color: "#E37400" }} />,
          description: "Track social media traffic and conversions",
          features: ["Traffic tracking", "Goal conversion", "Attribution", "Custom events"],
          status: "Available",
        },
        {
          name: "Mixpanel",
          icon: <BarChart3 className="h-8 w-8" style={{ color: "#7856FF" }} />,
          description: "Advanced product analytics and user tracking",
          features: ["Event tracking", "Funnel analysis", "Cohort reports", "A/B testing"],
          status: "Coming Soon",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="sticky top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Yazzil</span>
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
                Integrations
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Connect Yazzil with Your Favorite Tools
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Seamlessly integrate with 50+ platforms to create a unified workflow that powers your social media
                automation and business growth.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search integrations..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Popular Integrations</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Connect with the tools you already use to streamline your workflow.
              </p>
            </div>

            {integrationCategories.map((category, i) => (
              <div key={i} className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <Badge variant="secondary">{category.count} integrations</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.integrations.map((integration, j) => (
                    <Card key={j} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {integration.icon}
                            <h4 className="font-bold">{integration.name}</h4>
                          </div>
                          <Badge
                            variant={
                              integration.status === "Available"
                                ? "default"
                                : integration.status === "Beta"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {integration.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 mb-4">
                          {integration.features.map((feature, k) => (
                            <li key={k} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                              <span className="text-xs">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={integration.status === "Coming Soon"}
                        >
                          {integration.status === "Coming Soon" ? "Coming Soon" : "Connect"}
                          {integration.status !== "Coming Soon" && <ExternalLink className="ml-2 h-3 w-3" />}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary w-fit">
                  Developer API
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Build Custom Integrations with Our API
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Don&apos;t see the integration you need? Use our comprehensive REST API to build custom connections with
                  any platform or service.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>RESTful API with comprehensive documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Webhooks for real-time data synchronization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>SDKs for popular programming languages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Rate limiting and authentication</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button>View API Docs</Button>
                  <Button variant="outline">Contact Developer Support</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=API+Documentation"
                  alt="API Documentation"
                  width={500}
                  height={400}
                  className="rounded-lg border border-border/50"
                />
                {/* Screenshot needed: Your API documentation interface showing endpoints, examples, and code snippets */}
              </div>
            </div>
          </div>
        </section>

        {/* Request Integration */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Card className="border-primary/20 bg-primary/5 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Don&apos;t See Your Integration?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Let us know what integration you need and we&apos;ll prioritize it in our development roadmap.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input placeholder="What integration do you need?" className="flex-1" />
                <Button>Request Integration</Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
