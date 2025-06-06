'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ArrowLeft,
  Sparkles,
  Building2,
  Store,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Target,
  Globe,
  Shield,
} from "lucide-react"

export default function SolutionsPage() {
  const solutions = [
    {
      title: "Small Business",
      icon: <Store className="h-12 w-12 text-blue-500" />,
      description: "Perfect for local businesses and startups looking to establish their social media presence.",
      features: [
        "1-3 social media accounts",
        "Basic automation templates",
        "Local influencer discovery",
        "Simple lead tracking",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      title: "Growing Business",
      icon: <TrendingUp className="h-12 w-12 text-green-500" />,
      description: "Ideal for businesses scaling their operations and expanding their market reach.",
      features: [
        "5-10 social media accounts",
        "Advanced automation workflows",
        "Regional influencer network",
        "Lead scoring & qualification",
        "Priority support",
        "Custom integrations",
      ],
      cta: "Schedule Demo",
      popular: true,
    },
    {
      title: "Enterprise",
      icon: <Building2 className="h-12 w-12 text-purple-500" />,
      description: "Comprehensive solution for large organizations with complex requirements.",
      features: [
        "Unlimited accounts",
        "Custom AI models",
        "Global influencer network",
        "Advanced analytics",
        "Dedicated account manager",
        "White-label options",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  const industries = [
    {
      name: "E-commerce",
      icon: <Store className="h-8 w-8 text-orange-500" />,
      description: "Drive sales and customer engagement for online retailers.",
      benefits: ["Product promotion automation", "Customer service chatbots", "Influencer partnerships"],
    },
    {
      name: "SaaS",
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      description: "Generate leads and nurture prospects for software companies.",
      benefits: ["Lead qualification", "Demo scheduling", "Customer onboarding"],
    },
    {
      name: "Healthcare",
      icon: <Shield className="h-8 w-8 text-green-500" />,
      description: "Build trust and educate patients while maintaining compliance.",
      benefits: ["Patient education", "Appointment reminders", "Community building"],
    },
    {
      name: "Real Estate",
      icon: <Building2 className="h-8 w-8 text-purple-500" />,
      description: "Connect with buyers and sellers in your local market.",
      benefits: ["Property showcasing", "Lead generation", "Market insights"],
    },
    {
      name: "Agencies",
      icon: <Users className="h-8 w-8 text-pink-500" />,
      description: "Manage multiple client accounts efficiently.",
      benefits: ["Multi-client dashboard", "White-label reporting", "Team collaboration"],
    },
    {
      name: "Non-Profit",
      icon: <Globe className="h-8 w-8 text-cyan-500" />,
      description: "Amplify your mission and engage supporters.",
      benefits: ["Volunteer recruitment", "Donation campaigns", "Event promotion"],
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
                Tailored Solutions
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Solutions Built for Your Business Size & Industry
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Whether you&apos;re a startup or enterprise, we have the perfect solution to help you automate social media,
                manage influencers, and convert leads.
              </p>
            </div>
          </div>
        </section>

        {/* Solutions by Business Size */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Solutions by Business Size</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the solution that fits your current needs and scales with your growth.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {solutions.map((solution, i) => (
                <Card
                  key={i}
                  className={`border-border/50 bg-background/50 ${
                    solution.popular ? "border-primary/50 shadow-md shadow-primary/10" : ""
                  }`}
                >
                  <CardHeader className="text-center">
                    {solution.popular && (
                      <Badge
                        variant="outline"
                        className="mb-4 w-fit mx-auto border-primary/20 bg-primary/10 text-primary"
                      >
                        Most Popular
                      </Badge>
                    )}
                    <div className="mb-4">{solution.icon}</div>
                    <h3 className="text-xl font-bold">{solution.title}</h3>
                    <p className="text-muted-foreground">{solution.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {solution.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={solution.popular ? "default" : "outline"}>
                      {solution.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Solutions */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Industry Solutions</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Specialized features and workflows designed for your industry&apos;s unique needs.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry, i) => (
                <Card key={i} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {industry.icon}
                      <h3 className="font-bold">{industry.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{industry.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {industry.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                          <span className="text-xs">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Case Showcase */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary w-fit">
                  Success Story
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  How TechCorp Increased Leads by 300%
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  See how a growing SaaS company used Yazzil&apos;s automation and lead qualification features to triple
                  their qualified leads in just 3 months.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>300% increase in qualified leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>50% reduction in response time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>25 new enterprise customers</span>
                  </li>
                </ul>
                <Button className="w-fit">
                  Read Full Case Study
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=500&width=600&text=TechCorp+Success+Story"
                  alt="TechCorp Success Story"
                  width={600}
                  height={500}
                  className="rounded-lg border border-border/50"
                />
                {/* Screenshot needed: Case study infographic showing before/after metrics and key results */}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Find Your Perfect Solution?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Let&apos;s discuss your specific needs and find the best Yazzil solution for your business.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Start Free Trial</Button>
                <Button size="lg" variant="outline">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
