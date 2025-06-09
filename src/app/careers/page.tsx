'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  Coffee,
  Laptop,
  Zap,
  Globe,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      description:
        "Join our frontend team to build beautiful, responsive user interfaces for our social media automation platform.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "UI/UX design skills"],
    },
    {
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$140k - $180k",
      description: "Help us build the next generation of AI-powered social media automation tools.",
      requirements: ["Machine Learning expertise", "Python/TensorFlow", "NLP experience"],
    },
    {
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$90k - $120k",
      description: "Drive product positioning, messaging, and go-to-market strategies for our platform.",
      requirements: ["B2B SaaS experience", "Content creation skills", "Analytics proficiency"],
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      salary: "$70k - $90k",
      description: "Help our customers achieve success with Yazzil and drive retention and growth.",
      requirements: ["Customer success experience", "SaaS background", "Excellent communication"],
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$110k - $140k",
      description: "Build and maintain our cloud infrastructure to support millions of social media interactions.",
      requirements: ["AWS/GCP experience", "Kubernetes", "CI/CD pipelines"],
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      salary: "$50k - $70k + Commission",
      description: "Generate and qualify leads for our enterprise sales team.",
      requirements: ["B2B sales experience", "CRM proficiency", "Goal-oriented mindset"],
    },
  ]

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Market-rate compensation with equity options",
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance",
      icon: <Heart className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Remote-First",
      description: "Work from anywhere with flexible hours",
      icon: <Globe className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Learning Budget",
      description: "$2,000 annual budget for courses and conferences",
      icon: <Laptop className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Team Retreats",
      description: "Quarterly team gatherings and annual company retreat",
      icon: <Users className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Unlimited PTO",
      description: "Take time off when you need it",
      icon: <Coffee className="h-6 w-6 text-cyan-500" />,
    },
  ]

  const values = [
    {
      title: "Customer Obsession",
      description: "We put our customers at the center of everything we do",
      icon: <Heart className="h-8 w-8 text-red-500" />,
    },
    {
      title: "Innovation",
      description: "We constantly push boundaries to create cutting-edge solutions",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: "Transparency",
      description: "We believe in open communication and honest feedback",
      icon: <Globe className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Growth Mindset",
      description: "We embrace challenges and learn from every experience",
      icon: <Users className="h-8 w-8 text-green-500" />,
    },
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
                Join Our Team
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Build the Future of Social Media Automation
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join a passionate team of innovators working to democratize social media marketing and help businesses
                of all sizes succeed online.
              </p>
              <Button size="lg">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Work at Yazzil?</h2>
                <p className="text-muted-foreground md:text-lg">
                  We&apos;re building something special at Yazzil. Our team is passionate about creating tools that help
                  businesses connect with their audiences in meaningful ways. We believe in fostering a culture of
                  innovation, collaboration, and continuous learning.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span>Work on products that make a real impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Collaborate with talented, passionate people</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Shape the future of social media automation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Work remotely with flexible schedules</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=Team+Culture"
                  alt="Yazzil Team Culture"
                  width={500}
                  height={400}
                  className="rounded-lg border border-border/50"
                />
                {/* Photo needed: Team collaboration photo or office culture image */}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Our Values</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The principles that guide how we work and make decisions every day.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <Card key={i} className="border-border/50 bg-background/50 text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">{value.icon}</div>
                    <h3 className="font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Benefits & Perks</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We take care of our team so they can do their best work.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, i) => (
                <Card key={i} className="border-border/50 bg-background/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      {benefit.icon}
                      <h3 className="font-bold">{benefit.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Open Positions</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join our growing team and help shape the future of social media automation.
              </p>
            </div>
            <div className="space-y-4">
              {openPositions.map((position, i) => (
                <Card key={i} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="grid gap-4 lg:grid-cols-4 lg:items-center">
                      <div className="lg:col-span-2">
                        <h3 className="font-bold text-lg mb-1">{position.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{position.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {position.requirements.slice(0, 2).map((req, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>{position.salary}</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Don&apos;t See the Right Role?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future
                opportunities.
              </p>
              <Button size="lg">Send Us Your Resume</Button>
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
