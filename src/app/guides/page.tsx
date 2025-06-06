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
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Target,
  ArrowRight,
} from "lucide-react"

export default function GuidesPage() {
  const guides = [
    {
      title: "The Complete Guide to Social Media Automation",
      description:
        "Learn how to set up automated workflows that engage your audience 24/7 while maintaining authentic interactions.",
      author: "Sarah Chen",
      readTime: "15 min read",
      category: "Automation",
      level: "Beginner",
      image: "/placeholder.svg?height=200&width=400&text=Automation+Guide",
      featured: true,
    },
    {
      title: "Influencer Marketing ROI: How to Measure Success",
      description:
        "Discover the key metrics and strategies to track and optimize your influencer marketing campaigns for maximum ROI.",
      author: "Michael Rodriguez",
      readTime: "12 min read",
      category: "Influencer Marketing",
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=400&text=ROI+Guide",
      featured: false,
    },
    {
      title: "Lead Qualification Best Practices",
      description:
        "Master the art of identifying and nurturing high-quality leads from your social media interactions.",
      author: "Alex Johnson",
      readTime: "10 min read",
      category: "Lead Generation",
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=400&text=Lead+Guide",
      featured: false,
    },
    {
      title: "Building Your First Automation Workflow",
      description:
        "Step-by-step tutorial on creating your first automated response system using Yazzil's workflow builder.",
      author: "Emma Thompson",
      readTime: "8 min read",
      category: "Getting Started",
      level: "Beginner",
      image: "/placeholder.svg?height=200&width=400&text=Workflow+Guide",
      featured: false,
    },
    {
      title: "Advanced Analytics: Understanding Your Data",
      description:
        "Deep dive into Yazzil's analytics features and learn how to interpret data to improve your social media strategy.",
      author: "David Kim",
      readTime: "18 min read",
      category: "Analytics",
      level: "Advanced",
      image: "/placeholder.svg?height=200&width=400&text=Analytics+Guide",
      featured: false,
    },
    {
      title: "Multi-Platform Strategy: Managing All Your Accounts",
      description:
        "Learn how to efficiently manage multiple social media accounts while maintaining consistent brand voice.",
      author: "Jessica Williams",
      readTime: "14 min read",
      category: "Strategy",
      level: "Intermediate",
      image: "/placeholder.svg?height=200&width=400&text=Multi+Platform+Guide",
      featured: false,
    },
  ]

  const categories = [
    { name: "All Guides", count: 24, icon: <BookOpen className="h-4 w-4" /> },
    { name: "Getting Started", count: 6, icon: <Zap className="h-4 w-4" /> },
    { name: "Automation", count: 8, icon: <Zap className="h-4 w-4" /> },
    { name: "Influencer Marketing", count: 5, icon: <Users className="h-4 w-4" /> },
    { name: "Lead Generation", count: 4, icon: <Target className="h-4 w-4" /> },
    { name: "Analytics", count: 3, icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Strategy", count: 2, icon: <TrendingUp className="h-4 w-4" /> },
  ]

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Beginner</Badge>
      case "Intermediate":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Intermediate</Badge>
      case "Advanced":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Advanced</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

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
                Expert Guides
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Master Social Media Automation
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                In-depth guides and tutorials to help you become an expert at social media automation, influencer
                marketing, and lead generation.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search guides..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Guide */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary mb-4">
                Featured Guide
              </Badge>
            </div>
            <Card className="overflow-hidden border-border/50 bg-background/50">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={guides[0].image || "/placeholder.svg"}
                    alt={guides[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{guides[0].category}</Badge>
                    {getLevelBadge(guides[0].level)}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{guides[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{guides[0].description}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{guides[0].author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{guides[0].readTime}</span>
                    </div>
                  </div>
                  <Button className="w-fit">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-border/50 bg-background/50 p-6">
                  <h3 className="font-bold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{category.count}</span>
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Guides Grid */}
              <div className="lg:col-span-3">
                <div className="grid gap-6 md:grid-cols-2">
                  {guides.slice(1).map((guide, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden border-border/50 bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <div className="relative h-48">
                        <Image
                          src={guide.image || "/placeholder.svg"}
                          alt={guide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{guide.category}</Badge>
                          {getLevelBadge(guide.level)}
                        </div>
                        <h3 className="font-bold line-clamp-2">{guide.title}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{guide.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{guide.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{guide.readTime}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Read Guide
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Guides
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Card className="border-primary/20 bg-primary/5 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Get New Guides First</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Subscribe to our newsletter and be the first to know when we publish new guides and tutorials.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
