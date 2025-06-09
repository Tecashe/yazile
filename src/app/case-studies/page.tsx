'use client'
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
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Building2,
  Store,
  Heart,
  ArrowRight,
  Target,
  BarChart3,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      title: "TechCorp Increases Lead Generation by 300%",
      company: "TechCorp",
      industry: "SaaS",
      description:
        "How a B2B SaaS company used Yazzil's automation and lead qualification to triple their qualified leads in 3 months.",
      results: [
        { metric: "Lead Increase", value: "300%", icon: <TrendingUp className="h-4 w-4" /> },
        { metric: "Response Time", value: "50% faster", icon: <Clock className="h-4 w-4" /> },
        { metric: "New Customers", value: "25", icon: <Users className="h-4 w-4" /> },
      ],
      image: "/placeholder.svg?height=300&width=500&text=TechCorp+Case+Study",
      featured: true,
      readTime: "8 min read",
    },
    {
      title: "FashionHub's Influencer Marketing Success",
      company: "FashionHub",
      industry: "E-commerce",
      description:
        "A fashion retailer leveraged Yazzil's influencer management tools to scale their campaigns and increase sales.",
      results: [
        { metric: "Sales Increase", value: "150%", icon: <DollarSign className="h-4 w-4" /> },
        { metric: "Influencers Managed", value: "200+", icon: <Users className="h-4 w-4" /> },
        { metric: "Campaign ROI", value: "400%", icon: <TrendingUp className="h-4 w-4" /> },
      ],
      image: "/placeholder.svg?height=300&width=500&text=FashionHub+Case+Study",
      featured: false,
      readTime: "6 min read",
    },
    {
      title: "LocalBiz Automates Customer Service",
      company: "LocalBiz",
      industry: "Local Business",
      description:
        "A local restaurant chain used Yazzil to automate customer inquiries and improve satisfaction scores.",
      results: [
        { metric: "Response Time", value: "90% faster", icon: <Clock className="h-4 w-4" /> },
        { metric: "Customer Satisfaction", value: "95%", icon: <Heart className="h-4 w-4" /> },
        { metric: "Staff Time Saved", value: "20 hrs/week", icon: <Users className="h-4 w-4" /> },
      ],
      image: "/placeholder.svg?height=300&width=500&text=LocalBiz+Case+Study",
      featured: false,
      readTime: "5 min read",
    },
    {
      title: "HealthCare Plus Builds Patient Community",
      company: "HealthCare Plus",
      industry: "Healthcare",
      description:
        "A healthcare provider used Yazzil to build an engaged patient community and improve health outcomes.",
      results: [
        { metric: "Community Growth", value: "500%", icon: <Users className="h-4 w-4" /> },
        { metric: "Patient Engagement", value: "80% increase", icon: <Heart className="h-4 w-4" /> },
        { metric: "Appointment Bookings", value: "200% more", icon: <TrendingUp className="h-4 w-4" /> },
      ],
      image: "/placeholder.svg?height=300&width=500&text=HealthCare+Case+Study",
      featured: false,
      readTime: "7 min read",
    },
    {
      title: "RealEstate Pro Generates Quality Leads",
      company: "RealEstate Pro",
      industry: "Real Estate",
      description:
        "A real estate agency transformed their lead generation process using Yazzil's social media automation.",
      results: [
        { metric: "Qualified Leads", value: "250% more", icon: <Target className="h-4 w-4" /> },
        { metric: "Conversion Rate", value: "40% higher", icon: <TrendingUp className="h-4 w-4" /> },
        { metric: "Properties Sold", value: "60% increase", icon: <DollarSign className="h-4 w-4" /> },
      ],
      image: "/placeholder.svg?height=300&width=500&text=RealEstate+Case+Study",
      featured: false,
      readTime: "6 min read",
    },
    {
      title: "NonProfit Connect Amplifies Their Mission",
      company: "NonProfit Connect",
      industry: "Non-Profit",
      description: "A non-profit organization used Yazzil to increase volunteer engagement and donation campaigns.",
      results: [
        { metric: "Volunteer Signups", value: "180% more", icon: <Users className="h-4 w-4" /> },
        { metric: "Donation Increase", value: "120%", icon: <DollarSign className="h-4 w-4" /> },
        { metric: "Event Attendance", value: "300% higher", icon: <Heart className="h-4 w-4" /> },
      ],
      image: "/placeholder.svg?height=300&width=500&text=NonProfit+Case+Study",
      featured: false,
      readTime: "5 min read",
    },
  ]

  const industries = [
    { name: "All Industries", count: 24, icon: <Building2 className="h-4 w-4" /> },
    { name: "SaaS", count: 8, icon: <BarChart3 className="h-4 w-4" /> },
    { name: "E-commerce", count: 6, icon: <Store className="h-4 w-4" /> },
    { name: "Healthcare", count: 4, icon: <Heart className="h-4 w-4" /> },
    { name: "Real Estate", count: 3, icon: <Building2 className="h-4 w-4" /> },
    { name: "Non-Profit", count: 2, icon: <Users className="h-4 w-4" /> },
    { name: "Local Business", count: 1, icon: <Store className="h-4 w-4" /> },
  ]

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
                Success Stories
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Real Results from Real Businesses
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover how businesses across industries are using Yazzil to automate their social media, grow their
                audience, and drive real business results.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search case studies..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary mb-4">
                Featured Success Story
              </Badge>
            </div>
            <Card className="overflow-hidden border-border/50 bg-background/50">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={caseStudies[0].image || "/placeholder.svg"}
                    alt={caseStudies[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{caseStudies[0].industry}</Badge>
                    <span className="text-sm text-muted-foreground">{caseStudies[0].readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{caseStudies[0].title}</h2>
                  <p className="text-lg font-medium text-primary mb-4">{caseStudies[0].company}</p>
                  <p className="text-muted-foreground mb-6">{caseStudies[0].description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {caseStudies[0].results.map((result, i) => (
                      <div key={i} className="text-center">
                        <div className="flex items-center justify-center mb-2">{result.icon}</div>
                        <div className="text-2xl font-bold text-primary">{result.value}</div>
                        <div className="text-xs text-muted-foreground">{result.metric}</div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-fit">
                    Read Full Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-border/50 bg-background/50 p-6">
                  <h3 className="font-bold mb-4">Filter by Industry</h3>
                  <div className="space-y-2">
                    {industries.map((industry, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {industry.icon}
                          <span className="text-sm">{industry.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{industry.count}</span>
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Case Studies Grid */}
              <div className="lg:col-span-3">
                <div className="grid gap-6 md:grid-cols-2">
                  {caseStudies.slice(1).map((study, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden border-border/50 bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <div className="relative h-48">
                        <Image
                          src={study.image || "/placeholder.svg"}
                          alt={study.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{study.industry}</Badge>
                          <span className="text-xs text-muted-foreground">{study.readTime}</span>
                        </div>
                        <h3 className="font-bold line-clamp-2">{study.title}</h3>
                        <p className="text-sm font-medium text-primary">{study.company}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{study.description}</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {study.results.slice(0, 3).map((result, j) => (
                            <div key={j} className="text-center">
                              <div className="text-sm font-bold text-primary">{result.value}</div>
                              <div className="text-xs text-muted-foreground">{result.metric}</div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Read Case Study
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Case Studies
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Card className="border-primary/20 bg-primary/5 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join thousands of businesses already achieving amazing results with Yazzil.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button size="lg">Start Free Trial</Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </Card>
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
