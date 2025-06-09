// 'use client'
// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import {
//   ArrowLeft,
//   Sparkles,
//   Search,
//   Calendar,
//   User,
//   ArrowRight,
//   TrendingUp,
//   Users,
//   Bot,
//   BarChart3,
// } from "lucide-react"

// export default function BlogPage() {
//   const blogPosts = [
//     {
//       title: "The Future of Social Media Automation: AI-Powered Engagement",
//       excerpt:
//         "Discover how artificial intelligence is revolutionizing the way businesses interact with their audiences on social media platforms.",
//       author: "Sarah Chen",
//       date: "Dec 15, 2024",
//       category: "AI & Automation",
//       readTime: "5 min read",
//       image: "/placeholder.svg?height=200&width=400&text=AI+Automation+Blog",
//       featured: true,
//     },
//     {
//       title: "10 Proven Strategies for Influencer Marketing Success",
//       excerpt:
//         "Learn the essential tactics that top brands use to build successful influencer partnerships and drive real ROI.",
//       author: "Michael Rodriguez",
//       date: "Dec 12, 2024",
//       category: "Influencer Marketing",
//       readTime: "8 min read",
//       image: "/placeholder.svg?height=200&width=400&text=Influencer+Marketing",
//       featured: false,
//     },
//     {
//       title: "Lead Qualification 101: Turning Social Interactions into Sales",
//       excerpt:
//         "A comprehensive guide to identifying, scoring, and nurturing leads from your social media conversations.",
//       author: "Alex Johnson",
//       date: "Dec 10, 2024",
//       category: "Lead Generation",
//       readTime: "6 min read",
//       image: "/placeholder.svg?height=200&width=400&text=Lead+Generation",
//       featured: false,
//     },
//     {
//       title: "Social Media Analytics: Metrics That Actually Matter",
//       excerpt: "Cut through the noise and focus on the social media metrics that truly impact your business growth.",
//       author: "Jessica Williams",
//       date: "Dec 8, 2024",
//       category: "Analytics",
//       readTime: "7 min read",
//       image: "/placeholder.svg?height=200&width=400&text=Social+Analytics",
//       featured: false,
//     },
//     {
//       title: "Building Authentic Brand Relationships in the Digital Age",
//       excerpt:
//         "Explore how modern brands are creating genuine connections with their audiences through strategic social media engagement.",
//       author: "David Kim",
//       date: "Dec 5, 2024",
//       category: "Brand Strategy",
//       readTime: "4 min read",
//       image: "/placeholder.svg?height=200&width=400&text=Brand+Strategy",
//       featured: false,
//     },
//     {
//       title: "The Complete Guide to Multi-Platform Social Media Management",
//       excerpt:
//         "Master the art of managing multiple social media accounts efficiently while maintaining consistent brand voice.",
//       author: "Emma Thompson",
//       date: "Dec 3, 2024",
//       category: "Social Media",
//       readTime: "9 min read",
//       image: "/placeholder.svg?height=200&width=400&text=Multi+Platform",
//       featured: false,
//     },
//   ]

//   const categories = [
//     { name: "All Posts", count: 24, icon: <BarChart3 className="h-4 w-4" /> },
//     { name: "AI & Automation", count: 8, icon: <Bot className="h-4 w-4" /> },
//     { name: "Influencer Marketing", count: 6, icon: <Users className="h-4 w-4" /> },
//     { name: "Lead Generation", count: 5, icon: <TrendingUp className="h-4 w-4" /> },
//     { name: "Analytics", count: 3, icon: <BarChart3 className="h-4 w-4" /> },
//     { name: "Brand Strategy", count: 2, icon: <User className="h-4 w-4" /> },
//   ]

//   return (
//     <div className="flex min-h-screen flex-col dark">
//       {/* Navigation */}
//       <header className="sticky top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link href="/" className="flex items-center gap-2">
//               <Sparkles className="h-8 w-8 text-primary" />
//               <span className="text-xl font-bold">Yazzil</span>
//             </Link>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
//               <ArrowLeft className="h-4 w-4" />
//               Back to Home
//             </Link>
//             <Button>Get Started</Button>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1">
//         {/* Hero Section */}
//         <section className="py-20 md:py-32 radial--gradient">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
//                 Yazzil Blog
//               </Badge>
//               <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                 Insights & Strategies for Social Media Success
//               </h1>
//               <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//                 Stay ahead of the curve with expert insights, industry trends, and actionable strategies for social
//                 media automation and influencer marketing.
//               </p>
//               <div className="w-full max-w-md">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input placeholder="Search articles..." className="pl-10" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Featured Post */}
//         <section className="py-12 md:py-24">
//           <div className="container px-4 md:px-6">
//             <div className="mb-8">
//               <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary mb-4">
//                 Featured Article
//               </Badge>
//             </div>
//             <Card className="overflow-hidden border-border/50 bg-background/50">
//               <div className="grid gap-6 lg:grid-cols-2">
//                 <div className="relative h-64 lg:h-full">
//                   <Image
//                     src={blogPosts[0].image || "/placeholder.svg"}
//                     alt={blogPosts[0].title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="p-6 lg:p-8 flex flex-col justify-center">
//                   <Badge variant="secondary" className="w-fit mb-4">
//                     {blogPosts[0].category}
//                   </Badge>
//                   <h2 className="text-2xl font-bold mb-4">{blogPosts[0].title}</h2>
//                   <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
//                   <div className="flex items-center gap-4 mb-6">
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">{blogPosts[0].author}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">{blogPosts[0].date}</span>
//                     </div>
//                     <span className="text-sm text-muted-foreground">{blogPosts[0].readTime}</span>
//                   </div>
//                   <Button className="w-fit">
//                     Read Article
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </section>

//         {/* Blog Grid */}
//         <section className="py-12 md:py-24 bg-muted/30">
//           <div className="container px-4 md:px-6">
//             <div className="grid gap-8 lg:grid-cols-4">
//               {/* Sidebar */}
//               <div className="lg:col-span-1">
//                 <Card className="border-border/50 bg-background/50 p-6">
//                   <h3 className="font-bold mb-4">Categories</h3>
//                   <div className="space-y-2">
//                     {categories.map((category, i) => (
//                       <Link
//                         key={i}
//                         href="#"
//                         className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
//                       >
//                         <div className="flex items-center gap-2">
//                           {category.icon}
//                           <span className="text-sm">{category.name}</span>
//                         </div>
//                         <span className="text-xs text-muted-foreground">{category.count}</span>
//                       </Link>
//                     ))}
//                   </div>
//                 </Card>
//               </div>

//               {/* Articles Grid */}
//               <div className="lg:col-span-3">
//                 <div className="grid gap-6 md:grid-cols-2">
//                   {blogPosts.slice(1).map((post, i) => (
//                     <Card
//                       key={i}
//                       className="overflow-hidden border-border/50 bg-background/50 hover:border-primary/50 transition-all"
//                     >
//                       <div className="relative h-48">
//                         <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
//                       </div>
//                       <CardHeader className="pb-2">
//                         <Badge variant="secondary" className="w-fit mb-2">
//                           {post.category}
//                         </Badge>
//                         <h3 className="font-bold line-clamp-2">{post.title}</h3>
//                       </CardHeader>
//                       <CardContent>
//                         <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
//                         <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
//                           <div className="flex items-center gap-1">
//                             <User className="h-3 w-3" />
//                             <span>{post.author}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             <span>{post.date}</span>
//                           </div>
//                           <span>{post.readTime}</span>
//                         </div>
//                         <Button variant="outline" size="sm" className="w-full">
//                           Read More
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Load More */}
//                 <div className="text-center mt-12">
//                   <Button variant="outline" size="lg">
//                     Load More Articles
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Newsletter Signup */}
//         <section className="py-12 md:py-24">
//           <div className="container px-4 md:px-6">
//             <Card className="border-primary/20 bg-primary/5 p-8 text-center">
//               <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
//               <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//                 Get the latest insights and strategies delivered to your inbox weekly.
//               </p>
//               <div className="flex gap-2 max-w-md mx-auto">
//                 <Input placeholder="Enter your email" className="flex-1" />
//                 <Button>Subscribe</Button>
//               </div>
//             </Card>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }
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
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Users,
  Bot,
  BarChart3,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      slug: "future-of-social-media-automation",
      title: "The Future of Social Media Automation: AI-Powered Engagement",
      excerpt:
        "Discover how artificial intelligence is revolutionizing the way businesses interact with their audiences on social media platforms.",
      author: "Sarah Chen",
      date: "Dec 15, 2024",
      category: "AI & Automation",
      readTime: "5 min read",
      image: "/placeholder.svg?height=200&width=400&text=AI+Automation+Blog",
      featured: true,
    },
    {
      slug: "influencer-marketing-strategies",
      title: "10 Proven Strategies for Influencer Marketing Success",
      excerpt:
        "Learn the essential tactics that top brands use to build successful influencer partnerships and drive real ROI.",
      author: "Michael Rodriguez",
      date: "Dec 12, 2024",
      category: "Influencer Marketing",
      readTime: "8 min read",
      image: "/placeholder.svg?height=200&width=400&text=Influencer+Marketing",
      featured: false,
    },
    {
      slug: "lead-qualification-guide",
      title: "Lead Qualification 101: Turning Social Interactions into Sales",
      excerpt:
        "A comprehensive guide to identifying, scoring, and nurturing leads from your social media conversations.",
      author: "Alex Johnson",
      date: "Dec 10, 2024",
      category: "Lead Generation",
      readTime: "6 min read",
      image: "/placeholder.svg?height=200&width=400&text=Lead+Generation",
      featured: false,
    },
    {
      slug: "social-media-analytics-guide",
      title: "Social Media Analytics: Metrics That Actually Matter",
      excerpt: "Cut through the noise and focus on the social media metrics that truly impact your business growth.",
      author: "Jessica Williams",
      date: "Dec 8, 2024",
      category: "Analytics",
      readTime: "7 min read",
      image: "/placeholder.svg?height=200&width=400&text=Social+Analytics",
      featured: false,
    },
    {
      slug: "building-authentic-brand-relationships",
      title: "Building Authentic Brand Relationships in the Digital Age",
      excerpt:
        "Explore how modern brands are creating genuine connections with their audiences through strategic social media engagement.",
      author: "David Kim",
      date: "Dec 5, 2024",
      category: "Brand Strategy",
      readTime: "4 min read",
      image: "/placeholder.svg?height=200&width=400&text=Brand+Strategy",
      featured: false,
    },
    {
      slug: "multi-platform-social-media-management",
      title: "The Complete Guide to Multi-Platform Social Media Management",
      excerpt:
        "Master the art of managing multiple social media accounts efficiently while maintaining consistent brand voice.",
      author: "Emma Thompson",
      date: "Dec 3, 2024",
      category: "Social Media",
      readTime: "9 min read",
      image: "/placeholder.svg?height=200&width=400&text=Multi+Platform",
      featured: false,
    },
  ]

  const categories = [
    { name: "All Posts", count: 24, icon: <BarChart3 className="h-4 w-4" /> },
    { name: "AI & Automation", count: 8, icon: <Bot className="h-4 w-4" /> },
    { name: "Influencer Marketing", count: 6, icon: <Users className="h-4 w-4" /> },
    { name: "Lead Generation", count: 5, icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Analytics", count: 3, icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Brand Strategy", count: 2, icon: <User className="h-4 w-4" /> },
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
                Yazzil Blog
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Insights & Strategies for Social Media Success
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Stay ahead of the curve with expert insights, industry trends, and actionable strategies for social
                media automation and influencer marketing.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search articles..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary mb-4">
                Featured Article
              </Badge>
            </div>
            <Card className="overflow-hidden border-border/50 bg-background/50">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={blogPosts[0].image || "/placeholder.svg"}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {blogPosts[0].category}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-4">{blogPosts[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{blogPosts[0].date}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{blogPosts[0].readTime}</span>
                  </div>
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    <Button className="w-fit">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Blog Grid */}
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

              {/* Articles Grid */}
              <div className="lg:col-span-3">
                <div className="grid gap-6 md:grid-cols-2">
                  {blogPosts.slice(1).map((post, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden border-border/50 bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <div className="relative h-48">
                        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                      </div>
                      <CardHeader className="pb-2">
                        <Badge variant="secondary" className="w-fit mb-2">
                          {post.category}
                        </Badge>
                        <h3 className="font-bold line-clamp-2">{post.title}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Read More
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Articles
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
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get the latest insights and strategies delivered to your inbox weekly.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
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
