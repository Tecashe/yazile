'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ArrowLeft,
  Bot,
  Users,
  BarChart3,
  MessageSquare,
  Workflow,
  Database,
  Sparkles,
  CheckCircle,
  Zap,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function FeaturesPage() {
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
                Platform Features
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Powerful Features for Modern Businesses
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover all the tools and capabilities that make Yazzil the ultimate platform for social media
                automation, influencer marketing, and lead management.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <Bot className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold">AI-Powered Automation</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Leverage advanced AI to automate your social media interactions with intelligent responses.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Smart comment responses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automated DM handling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Sentiment analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom response templates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold">Influencer Discovery</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Find and connect with the perfect influencers for your brand using our advanced search tools.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced filtering options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Audience demographics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Engagement rate analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Brand safety checks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold">Advanced Analytics</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Get deep insights into your social media performance and campaign effectiveness.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Real-time performance metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">ROI tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automated reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <MessageSquare className="h-12 w-12 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold">Multi-Platform Management</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage all your social media accounts from one unified dashboard.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Instagram, Facebook, Twitter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">WhatsApp Business</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">LinkedIn, TikTok</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unified inbox</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <Workflow className="h-12 w-12 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold">Custom Workflows</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create sophisticated automation workflows without any coding knowledge.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Visual workflow builder</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Trigger-based actions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Conditional logic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Pre-built templates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <Database className="h-12 w-12 text-cyan-500 mb-4" />
                  <h3 className="text-xl font-bold">CRM Integration</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Seamlessly connect with your existing CRM and business tools.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">HubSpot, Salesforce</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Zapier integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Data synchronization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Additional features that make Yazzil the complete solution for your business.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <Zap className="h-8 w-8 text-yellow-500" />
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Instant responses and real-time updates</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Shield className="h-8 w-8 text-green-500" />
                <h3 className="font-semibold">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">Bank-level security and data protection</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="h-8 w-8 text-blue-500" />
                <h3 className="font-semibold">24/7 Automation</h3>
                <p className="text-sm text-muted-foreground">Never miss an opportunity to engage</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Globe className="h-8 w-8 text-purple-500" />
                <h3 className="font-semibold">Global Scale</h3>
                <p className="text-sm text-muted-foreground">Support for multiple languages and regions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary w-fit">
                  Lead Qualification
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Turn Conversations into Customers
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Our AI-powered lead qualification system automatically identifies high-value prospects from your
                  social media interactions and nurtures them through personalized sequences.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Intelligent lead scoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Automated nurturing sequences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Conversion tracking</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=Lead+Qualification+Interface"
                  alt="Lead Qualification Interface"
                  width={600}
                  height={500}
                  className="rounded-lg border border-border/50"
                />
                {/* Screenshot needed: Your lead qualification interface showing lead scores, conversation history, and qualification criteria */}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Experience These Features?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Start your free trial today and see how Yazzil can transform your social media strategy.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Start Free Trial</Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
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
