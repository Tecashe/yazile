'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Target, Globe, Heart, Lightbulb, Shield, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function AboutPage() {
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
                About Yazzil
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Empowering Businesses Through Social Innovation
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We&apos;re on a mission to democratize social media marketing and influencer collaboration, making powerful
                automation tools accessible to businesses of all sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Target className="h-12 w-12 text-primary" />
                  <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
                  <p className="text-muted-foreground md:text-lg">
                    To empower businesses of all sizes with intelligent social media automation and influencer marketing
                    tools that drive real growth and meaningful connections with their audiences.
                  </p>
                </div>
                <div className="space-y-4">
                  <Lightbulb className="h-12 w-12 text-primary" />
                  <h2 className="text-3xl font-bold tracking-tighter">Our Vision</h2>
                  <p className="text-muted-foreground md:text-lg">
                    A world where every business can harness the power of social media to build authentic relationships,
                    drive growth, and create lasting impact in their communities.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=Team+Photo"
                  alt="Yazzil Team"
                  width={600}
                  height={500}
                  className="rounded-lg border border-border/50"
                />
                {/* Photo needed: Professional team photo or office environment showcasing your company culture */}
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
                The principles that guide everything we do at Yazzil.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Customer First</h3>
                  <p className="text-sm text-muted-foreground">
                    Every decision we make is guided by what&apos;s best for our customers and their success.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    We constantly push boundaries to create cutting-edge solutions for modern businesses.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Trust & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    We protect our customers data and privacy with the highest security standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Global Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re building tools that help businesses worldwide connect and grow together.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Our Impact</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Numbers that showcase the difference we&apos;re making for businesses worldwide.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Active Businesses</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Influencers Connected</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5M+</div>
                <p className="text-muted-foreground">Messages Automated</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Meet Our Team</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The passionate individuals behind Yazzil&apos;s success.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 bg-background/50">
                <CardContent className="p-6 text-center">
                  <Image
                    src="/placeholder.svg?height=120&width=120&text=CEO"
                    alt="CEO"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-bold mb-1">Alex Johnson</h3>
                  <p className="text-sm text-primary mb-2">CEO & Founder</p>
                  <p className="text-sm text-muted-foreground">
                    Former VP of Marketing at TechCorp with 10+ years in social media strategy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardContent className="p-6 text-center">
                  <Image
                    src="/placeholder.svg?height=120&width=120&text=CTO"
                    alt="CTO"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-bold mb-1">Sarah Chen</h3>
                  <p className="text-sm text-primary mb-2">CTO & Co-Founder</p>
                  <p className="text-sm text-muted-foreground">
                    AI/ML expert with experience at Google and Microsoft, specializing in automation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardContent className="p-6 text-center">
                  <Image
                    src="/placeholder.svg?height=120&width=120&text=CPO"
                    alt="CPO"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-bold mb-1">Michael Rodriguez</h3>
                  <p className="text-sm text-primary mb-2">Head of Product</p>
                  <p className="text-sm text-muted-foreground">
                    Product strategist with a passion for creating user-centric solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join Our Journey</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Be part of the social media revolution. Start your free trial today.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Start Free Trial</Button>
                <Button size="lg" variant="outline">
                  Contact Us
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
