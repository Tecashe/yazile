import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Sparkles,
  Search,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react"

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: <Book className="h-6 w-6 text-blue-500" />,
      description: "Learn the basics of setting up and using Yazzil",
      articles: [
        "How to create your first automation",
        "Connecting your social media accounts",
        "Understanding the dashboard",
        "Setting up your profile",
      ],
    },
    {
      title: "Automation",
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      description: "Master automated responses and workflows",
      articles: [
        "Creating response templates",
        "Setting up triggers",
        "Managing automation rules",
        "Testing your automations",
      ],
    },
    {
      title: "Billing & Account",
      icon: <HelpCircle className="h-6 w-6 text-purple-500" />,
      description: "Manage your subscription and account settings",
      articles: [
        "Changing your plan",
        "Updating payment methods",
        "Managing team members",
        "Canceling your subscription",
      ],
    },
    {
      title: "Troubleshooting",
      icon: <HelpCircle className="h-6 w-6 text-red-500" />,
      description: "Solve common issues and problems",
      articles: ["Automation not working", "Connection issues", "Missing notifications", "Performance problems"],
    },
  ]

  const popularArticles = [
    { title: "How to create your first automation", views: "12.5k views" },
    { title: "Connecting Instagram to Yazzil", views: "8.2k views" },
    { title: "Understanding automation triggers", views: "6.8k views" },
    { title: "Setting up response templates", views: "5.4k views" },
    { title: "Managing your subscription", views: "4.1k views" },
  ]

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      availability: "Available 24/7",
      action: "Start Chat",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      availability: "Response within 2 hours",
      action: "Send Email",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: <Phone className="h-6 w-6 text-purple-500" />,
      availability: "Mon-Fri, 9AM-6PM PST",
      action: "Call Now",
    },
    {
      title: "Video Call",
      description: "Schedule a screen-sharing session",
      icon: <Video className="h-6 w-6 text-orange-500" />,
      availability: "By appointment",
      action: "Schedule Call",
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
                Help Center
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">How can we help you?</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find answers to your questions, learn how to use Yazzil effectively, or get in touch with our support
                team.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search for help..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Popular Articles</h2>
              <p className="text-muted-foreground">Most searched help topics</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popularArticles.map((article, i) => (
                <Card key={i} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.views}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">Find help articles organized by topic</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {helpCategories.map((category, i) => (
                <Card key={i} className="border-border/50 bg-background/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {category.icon}
                      <h3 className="font-bold">{category.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article, j) => (
                        <Link key={j} href="#" className="block text-sm hover:text-primary transition-colors py-1">
                          {article}
                        </Link>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View All Articles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground">Get in touch with our support team</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {contactOptions.map((option, i) => (
                <Card key={i} className="border-border/50 bg-background/50 text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-2">{option.icon}</div>
                    <h3 className="font-bold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{option.availability}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
              <p className="text-muted-foreground">Jump to commonly needed resources</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/documentation" className="block">
                <Card className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Book className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">Documentation</h3>
                    <p className="text-sm text-muted-foreground">Technical guides</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/guides" className="block">
                <Card className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Video className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step guides</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/contact" className="block">
                <Card className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-medium">Contact Us</h3>
                    <p className="text-sm text-muted-foreground">Get in touch</p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                <CardContent className="p-4 text-center">
                  <ExternalLink className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <h3 className="font-medium">Community</h3>
                  <p className="text-sm text-muted-foreground">Join discussions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
