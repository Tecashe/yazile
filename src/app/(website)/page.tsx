
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Users,
  BarChart3,
  Bot,
  Workflow,
  Database,
  Award,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/yazzil-logos.png" alt="Yazzil logo" className="h-16 w-16" />
          <span className="text-xl font-bold">Yazzil</span>
        </div>


          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Button>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-primary/10 via-transparent to-blue-500/10 rounded-full blur-3xl animate-spin"
              style={{ animationDuration: "20s" }}
            />
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content Side */}
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                      <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                        Automate Your
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        Social Media
                      </span>
                      <br />
                      <span className="text-muted-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium">
                        & Influencer Marketing
                      </span>
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0 leading-relaxed">
                      The all-in-one platform for businesses to automate social media engagement, manage influencer
                      campaigns, and qualify leads—all powered by AI.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="h-4 w-4" />
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 hover:bg-muted/50 transition-all duration-300"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Book a Demo
                  </Button>
                </div>

                <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-10 w-10 rounded-full border-3 border-background bg-gradient-to-br from-primary/20 to-blue-500/20 overflow-hidden ring-2 ring-primary/20"
                      >
                        <Image
                          src={`/ten.png?height=40&width=40&text=${i}`}
                          alt={`Customer avatar ${i}`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">500+ businesses</div>
                    <div className="text-muted-foreground">already growing with Yazzil</div>
                  </div>
                </div>
              </div>

              {/* Visual Side - Stylistic Screenshots Layout */}
              <div className="relative flex items-center justify-center lg:justify-end">
                {/* Main Dashboard Screenshot - Floating */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70" />
                  <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 p-2">
                    <Image
                      src="/eight.png?height=400&width=600&text=Main+Dashboard"
                      alt="Yazzil Main Dashboard"
                      width={600}
                      height={400}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Floating Screenshots */}
                <div className="absolute -top-8 -left-8 lg:-left-16">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
                    <div className="relative bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 p-1.5 hover:rotate-2">
                      <Image
                        src="/eleven.png?height=200&width=300&text=Automation+Rules"
                        alt="Automation Rules Interface"
                        width={300}
                        height={200}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-4 lg:-right-12">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
                    <div className="relative bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 p-1.5 hover:-rotate-2">
                      <Image
                        src="/six.png?height=180&width=280&text=Influencer+Discovery"
                        alt="Influencer Discovery Tool"
                        width={280}
                        height={180}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="absolute top-1/2 -right-8 lg:-right-20 transform -translate-y-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
                    <div className="relative bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 p-1.5">
                      <Image
                        src="/six.png?height=150&width=250&text=Analytics+Chart"
                        alt="Analytics Dashboard"
                        width={250}
                        height={150}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div> */}

                {/* <div className="absolute top-60 left-1 lg:left-1 lg:top-72">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
                    <div className="relative bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 p-1.5 hover:rotate-1">
                      <Image
                        src="/four.png?height=120&width=200&text=Lead+Scoring"
                        alt="Lead Scoring Interface"
                        width={200}
                        height={120}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div> */}

                {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 lg:left-8 lg:transform-none">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
                    <div className="relative bg-background/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 p-1.5 hover:rotate-1">
                      <Image
                        src="/four.png?height=160&width=260&text=Lead+Scoring"
                        alt="Lead Scoring Interface"
                        width={260}
                        height={160}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Floating Icons */}
                {/* <div
                  className="absolute top-1/4 left-1/4 animate-bounce"
                  style={{ animationDelay: "0s", animationDuration: "3s" }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center border border-primary/30 backdrop-blur-sm">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div
                  className="absolute bottom-1/4 left-1/3 animate-bounce"
                  style={{ animationDelay: "1s", animationDuration: "3s" }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30 backdrop-blur-sm">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                </div> */}

                {/* <div
                  className="absolute top-1/3 right-1/4 animate-bounce"
                  style={{ animationDelay: "2s", animationDuration: "3s" }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30 backdrop-blur-sm">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/50 bg-muted/30 py-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Influencers Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5M+</div>
                <div className="text-sm text-muted-foreground">Messages Automated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                  Powerful Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to grow your online presence
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our platform combines automation, influencer marketing, and lead qualification in one powerful
                  solution.
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Bot className="h-10 w-10 text-blue-500" />
                    <h3 className="text-xl font-semibold">AI-Powered Automation</h3>
                    <p className="text-muted-foreground">
                      Automate responses to comments, messages, and engage with your audience using our smart AI system.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Users className="h-10 w-10 text-purple-500" />
                    <h3 className="text-xl font-semibold">Influencer Management</h3>
                    <p className="text-muted-foreground">
                      Discover, vet, and collaborate with influencers that align with your brand values and audience.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <BarChart3 className="h-10 w-10 text-green-500" />
                    <h3 className="text-xl font-semibold">Lead Qualification</h3>
                    <p className="text-muted-foreground">
                      Automatically score and qualify leads based on engagement patterns and conversation sentiment.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <MessageSquare className="h-10 w-10 text-emerald-500" />
                    <h3 className="text-xl font-semibold">Multi-Channel Messaging</h3>
                    <p className="text-muted-foreground">
                      Manage conversations across Instagram, WhatsApp, Facebook, and more from a single dashboard.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Workflow className="h-10 w-10 text-orange-500" />
                    <h3 className="text-xl font-semibold">Custom Workflows</h3>
                    <p className="text-muted-foreground">
                      Create custom automation workflows with our visual editor, no coding required.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Database className="h-10 w-10 text-cyan-500" />
                    <h3 className="text-xl font-semibold">CRM Integration</h3>
                    <p className="text-muted-foreground">
                      Seamlessly connect with your existing CRM systems to maintain a single source of truth.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                  Tailored Solutions
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Solutions for every business need
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Whether you&apos;re a small business or an enterprise, we have the right solution for you.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Tabs defaultValue="automation" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="automation">Social Automation</TabsTrigger>
                  <TabsTrigger value="influencer">Influencer Marketing</TabsTrigger>
                  <TabsTrigger value="leads">Lead Management</TabsTrigger>
                </TabsList>
                <TabsContent value="automation" className="mt-6">
                  <div className="flex items-center justify-center p-8">
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                      <Image
                        src="/three.png?height=400&width=600&text=Social+Automation+Dashboard"
                        alt="Social Automation Dashboard Screenshot"
                        width={800}
                        height={400}
                        className="rounded-lg w-full max-w-4xl shadow-lg"
                      />
                    </div>
                  </div>
                </TabsContent>
                {/* <TabsContent value="automation" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                      <h3 className="text-2xl font-bold">Automate your social media presence</h3>
                      <p className="text-muted-foreground">
                        Our AI-powered automation tools help you engage with your audience 24/7, respond to comments and
                        messages, and build meaningful relationships at scale.
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Smart response system",
                          "Scheduled content posting",
                          "Engagement tracking",
                          "Custom automation rules",
                          "Multi-platform support",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-fit">
                        Learn more
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/30 p-6">
                      <Image
                        src="/three.png?height=400&width=600&text=Social+Automation+Dashboard"
                        alt="Social Automation Dashboard Screenshot"
                        width={600}
                        height={400}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </TabsContent> */}
                <TabsContent value="influencer" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                      <h3 className="text-2xl font-bold">Streamline influencer campaigns</h3>
                      <p className="text-muted-foreground">
                        Find the perfect influencers for your brand, manage relationships, track campaign performance,
                        and measure ROI all in one place.
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Influencer discovery",
                          "Campaign management",
                          "Performance analytics",
                          "Content approval workflow",
                          "Automated payments",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-fit">
                        Learn more
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/30 p-6">
                      <Image
                        src="/one.png?height=400&width=600&text=Influencer+Management+Dashboard"
                        alt="Influencer Management Dashboard Screenshot"
                        width={600}
                        height={400}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="leads" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                      <h3 className="text-2xl font-bold">Convert social interactions into sales</h3>
                      <p className="text-muted-foreground">
                        Automatically identify, score, and nurture leads from your social media interactions, turning
                        conversations into conversions.
                      </p>
                      <ul className="space-y-2">
                        {[
                          "AI lead scoring",
                          "Automated qualification",
                          "Nurturing sequences",
                          "CRM integration",
                          "Performance analytics",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-fit">
                        Learn more
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/30 p-6">
                      <Image
                        src="/two.png?height=400&width=600&text=Lead+Qualification+Dashboard"
                        alt="Lead Qualification Dashboard Screenshot"
                        width={600}
                        height={400}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                  Testimonials
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Trusted by businesses worldwide
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  See what our customers have to say about how Yazzil has transformed their social media strategy.
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">
                      &quot;Yazzil has completely transformed how we manage our social media presence. The automation
                      features have saved us countless hours.&quot;
                    </p>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">Marketing Director, TechCorp</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">
                      &quot;The influencer management tools are incredible. We&apos;ve been able to run campaigns that
                      would have taken months to organize manually.&quot;
                    </p>
                    <div>
                      <div className="font-semibold">Michael Chen</div>
                      <div className="text-sm text-muted-foreground">Brand Manager, FashionHub</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">
                      &quot;Lead qualification has never been easier. We&apos;re converting social media interactions
                      into sales at a rate we never thought possible.&quot;
                    </p>
                    <div>
                      <div className="font-semibold">Jessica Williams</div>
                      <div className="text-sm text-muted-foreground">Sales Director, GrowthPartners</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary w-fit">
                    Get Started Today
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Ready to transform your social media strategy?
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of businesses already using Yazzil to automate their social media, manage influencer
                    campaigns, and qualify leads.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1.5">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Book a Demo
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Card className="w-full border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">No credit card required</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Start your 14-day free trial today. No credit card required. Cancel anytime.
                      </p>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Full access to all features</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get complete access to all features during your trial period.
                      </p>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Dedicated support</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Our team is available to help you get the most out of Yazzil.
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
