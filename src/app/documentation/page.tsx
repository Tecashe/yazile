// 'use client'
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import {
//   ArrowLeft,
//   Sparkles,
//   Search,
//   Book,
//   Code,
//   Zap,
//   Users,
//   BarChart3,
//   Settings,
//   Shield,
//   ExternalLink,
//   ChevronRight,
// } from "lucide-react"

// export default function DocumentationPage() {
//   const docSections = [
//     {
//       title: "Getting Started",
//       icon: <Book className="h-6 w-6 text-blue-500" />,
//       description: "Everything you need to know to get up and running with Yazzil",
//       articles: [
//         { title: "Quick Start Guide", readTime: "5 min", popular: true },
//         { title: "Account Setup", readTime: "3 min", popular: true },
//         { title: "Connecting Social Accounts", readTime: "7 min", popular: true },
//         { title: "First Automation Setup", readTime: "10 min", popular: false },
//         { title: "Understanding the Dashboard", readTime: "8 min", popular: false },
//       ],
//     },
//     {
//       title: "Automation",
//       icon: <Zap className="h-6 w-6 text-yellow-500" />,
//       description: "Learn how to create and manage automated social media workflows",
//       articles: [
//         { title: "Creating Your First Automation", readTime: "12 min", popular: true },
//         { title: "Response Templates", readTime: "6 min", popular: true },
//         { title: "Conditional Logic", readTime: "15 min", popular: false },
//         { title: "Scheduling Automations", readTime: "8 min", popular: false },
//         { title: "Testing and Debugging", readTime: "10 min", popular: false },
//       ],
//     },
//     {
//       title: "Influencer Marketing",
//       icon: <Users className="h-6 w-6 text-purple-500" />,
//       description: "Discover, manage, and collaborate with influencers effectively",
//       articles: [
//         { title: "Finding the Right Influencers", readTime: "10 min", popular: true },
//         { title: "Campaign Management", readTime: "15 min", popular: true },
//         { title: "Performance Tracking", readTime: "8 min", popular: false },
//         { title: "Payment Processing", readTime: "5 min", popular: false },
//         { title: "Contract Templates", readTime: "7 min", popular: false },
//       ],
//     },
//     {
//       title: "Analytics & Reporting",
//       icon: <BarChart3 className="h-6 w-6 text-green-500" />,
//       description: "Understand your performance with detailed analytics and reports",
//       articles: [
//         { title: "Understanding Analytics", readTime: "12 min", popular: true },
//         { title: "Custom Reports", readTime: "10 min", popular: false },
//         { title: "ROI Tracking", readTime: "8 min", popular: true },
//         { title: "Exporting Data", readTime: "5 min", popular: false },
//         { title: "Setting Up Alerts", readTime: "6 min", popular: false },
//       ],
//     },
//     {
//       title: "API Reference",
//       icon: <Code className="h-6 w-6 text-orange-500" />,
//       description: "Technical documentation for developers and integrations",
//       articles: [
//         { title: "Authentication", readTime: "8 min", popular: true },
//         { title: "Endpoints Overview", readTime: "15 min", popular: true },
//         { title: "Webhooks", readTime: "12 min", popular: false },
//         { title: "Rate Limiting", readTime: "5 min", popular: false },
//         { title: "SDKs and Libraries", readTime: "10 min", popular: false },
//       ],
//     },
//     {
//       title: "Account Management",
//       icon: <Settings className="h-6 w-6 text-cyan-500" />,
//       description: "Manage your account settings, billing, and team members",
//       articles: [
//         { title: "Account Settings", readTime: "5 min", popular: true },
//         { title: "Billing and Subscriptions", readTime: "7 min", popular: true },
//         { title: "Team Management", readTime: "10 min", popular: false },
//         { title: "Security Settings", readTime: "8 min", popular: false },
//         { title: "Data Export", readTime: "6 min", popular: false },
//       ],
//     },
//   ]

//   const popularArticles = [
//     { title: "Quick Start Guide", category: "Getting Started", readTime: "5 min" },
//     { title: "Creating Your First Automation", category: "Automation", readTime: "12 min" },
//     { title: "Finding the Right Influencers", category: "Influencer Marketing", readTime: "10 min" },
//     { title: "Understanding Analytics", category: "Analytics", readTime: "12 min" },
//     { title: "API Authentication", category: "API Reference", readTime: "8 min" },
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
//                 Documentation
//               </Badge>
//               <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                 Everything You Need to Know About Yazzil
//               </h1>
//               <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//                 Comprehensive guides, tutorials, and API documentation to help you get the most out of Yazzil&apos;s social
//                 media automation platform.
//               </p>
//               <div className="w-full max-w-md">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input placeholder="Search documentation..." className="pl-10" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Popular Articles */}
//         <section className="py-12 md:py-24">
//           <div className="container px-4 md:px-6">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold mb-4">Popular Articles</h2>
//               <p className="text-muted-foreground">Most viewed documentation articles</p>
//             </div>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {popularArticles.map((article, i) => (
//                 <Card key={i} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <Badge variant="secondary" className="text-xs">
//                         {article.category}
//                       </Badge>
//                       <span className="text-xs text-muted-foreground">{article.readTime}</span>
//                     </div>
//                     <h3 className="font-semibold mb-2">{article.title}</h3>
//                     <Button variant="ghost" size="sm" className="p-0 h-auto">
//                       Read article
//                       <ChevronRight className="ml-1 h-3 w-3" />
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Documentation Sections */}
//         <section className="py-12 md:py-24 bg-muted/30">
//           <div className="container px-4 md:px-6">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
//               <p className="text-muted-foreground">Find detailed guides for every aspect of Yazzil</p>
//             </div>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {docSections.map((section, i) => (
//                 <Card key={i} className="border-border/50 bg-background/50">
//                   <CardHeader>
//                     <div className="flex items-center gap-3 mb-2">
//                       {section.icon}
//                       <h3 className="font-bold">{section.title}</h3>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{section.description}</p>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       {section.articles.map((article, j) => (
//                         <div key={j} className="flex items-center justify-between py-1">
//                           <div className="flex items-center gap-2">
//                             <Link
//                               href="#"
//                               className="text-sm hover:text-primary transition-colors flex items-center gap-1"
//                             >
//                               {article.title}
//                               {article.popular && (
//                                 <Badge variant="secondary" className="text-xs px-1 py-0">
//                                   Popular
//                                 </Badge>
//                               )}
//                             </Link>
//                           </div>
//                           <span className="text-xs text-muted-foreground">{article.readTime}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <Button variant="outline" size="sm" className="w-full mt-4">
//                       View All Articles
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* API Documentation */}
//         <section className="py-12 md:py-24">
//           <div className="container px-4 md:px-6">
//             <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
//               <div className="flex flex-col justify-center space-y-4">
//                 <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary w-fit">
//                   Developer Resources
//                 </Badge>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Build with Yazzil&apos;s API</h2>
//                 <p className="text-muted-foreground md:text-lg">
//                   Comprehensive API documentation with code examples, SDKs, and interactive testing tools to help you
//                   integrate Yazzil into your applications.
//                 </p>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Code className="h-4 w-4 text-primary" />
//                     <span className="text-sm">RESTful API with JSON responses</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Shield className="h-4 w-4 text-primary" />
//                     <span className="text-sm">OAuth 2.0 authentication</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-primary" />
//                     <span className="text-sm">Real-time webhooks</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button>
//                     View API Docs
//                     <ExternalLink className="ml-2 h-4 w-4" />
//                   </Button>
//                   <Button variant="outline">Try Interactive Demo</Button>
//                 </div>
//               </div>
//               <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
//                 <div className="mb-4">
//                   <Badge variant="secondary">Example Request</Badge>
//                 </div>
//                 <pre className="text-sm text-muted-foreground overflow-x-auto">
//                                         <code>{`curl -X POST https://api.yazzil.com/v1/automations \\
//                         -H "Authorization: Bearer YOUR_API_KEY" \\
//                         -H "Content-Type: application/json" \\
//                         -d '{
//                             "name": "Welcome Message",
//                             "trigger": "new_follower",
//                             "action": {
//                             "type": "send_message",
//                             "template": "Thanks for following!"
//                             }
//                         }'`}</code>
//                 </pre>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Help Section */}
//         <section className="py-12 md:py-24 bg-muted/30">
//           <div className="container px-4 md:px-6">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
//               <p className="text-muted-foreground mb-8 max-w-md mx-auto">
//                 Can&apos;t find what you&apos;re looking for? Our support team is here to help.
//               </p>
//               <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
//                 <Button>Contact Support</Button>
//                 <Button variant="outline">Join Community</Button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }
'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Sparkles,
  Search,
  Book,
  Code,
  Zap,
  Users,
  BarChart3,
  Settings,
  Shield,
  ExternalLink,
  ChevronRight,
} from "lucide-react"

export default function DocumentationPage() {
  const docSections = [
    {
      title: "Getting Started",
      icon: <Book className="h-6 w-6 text-blue-500" />,
      description: "Everything you need to know to get up and running with Yazzil",
      articles: [
        { title: "Quick Start Guide", readTime: "5 min", popular: true },
        { title: "Account Setup", readTime: "3 min", popular: true },
        { title: "Connecting Social Accounts", readTime: "7 min", popular: true },
        { title: "First Automation Setup", readTime: "10 min", popular: false },
        { title: "Understanding the Dashboard", readTime: "8 min", popular: false },
      ],
      url: "/documentation/getting-started",
    },
    {
      title: "Automation",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      description: "Learn how to create and manage automated social media workflows",
      articles: [
        { title: "Creating Your First Automation", readTime: "12 min", popular: true },
        { title: "Response Templates", readTime: "6 min", popular: true },
        { title: "Conditional Logic", readTime: "15 min", popular: false },
        { title: "Scheduling Automations", readTime: "8 min", popular: false },
        { title: "Testing and Debugging", readTime: "10 min", popular: false },
      ],
      url: "/documentation/automation",
    },
    {
      title: "Influencer Marketing",
      icon: <Users className="h-6 w-6 text-purple-500" />,
      description: "Discover, manage, and collaborate with influencers effectively",
      articles: [
        { title: "Finding the Right Influencers", readTime: "10 min", popular: true },
        { title: "Campaign Management", readTime: "15 min", popular: true },
        { title: "Performance Tracking", readTime: "8 min", popular: false },
        { title: "Payment Processing", readTime: "5 min", popular: false },
        { title: "Contract Templates", readTime: "7 min", popular: false },
      ],
      url: "/documentation/influencer-marketing",
    },
    {
      title: "Analytics & Reporting",
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      description: "Understand your performance with detailed analytics and reports",
      articles: [
        { title: "Understanding Analytics", readTime: "12 min", popular: true },
        { title: "Custom Reports", readTime: "10 min", popular: false },
        { title: "ROI Tracking", readTime: "8 min", popular: true },
        { title: "Exporting Data", readTime: "5 min", popular: false },
        { title: "Setting Up Alerts", readTime: "6 min", popular: false },
      ],
      url: "/documentation/analytics",
    },
    {
      title: "API Reference",
      icon: <Code className="h-6 w-6 text-orange-500" />,
      description: "Technical documentation for developers and integrations",
      articles: [
        { title: "Authentication", readTime: "8 min", popular: true },
        { title: "Endpoints Overview", readTime: "15 min", popular: true },
        { title: "Webhooks", readTime: "12 min", popular: false },
        { title: "Rate Limiting", readTime: "5 min", popular: false },
        { title: "SDKs and Libraries", readTime: "10 min", popular: false },
      ],
      url: "/documentation/api",
    },
    {
      title: "Account Management",
      icon: <Settings className="h-6 w-6 text-cyan-500" />,
      description: "Manage your account settings, billing, and team members",
      articles: [
        { title: "Account Settings", readTime: "5 min", popular: true },
        { title: "Billing and Subscriptions", readTime: "7 min", popular: true },
        { title: "Team Management", readTime: "10 min", popular: false },
        { title: "Security Settings", readTime: "8 min", popular: false },
        { title: "Data Export", readTime: "6 min", popular: false },
      ],
      url: "/documentation/account",
    },
  ]

  const popularArticles = [
    {
      title: "Quick Start Guide",
      category: "Getting Started",
      readTime: "5 min",
      url: "/documentation/getting-started/quick-start-guide",
    },
    {
      title: "Creating Your First Automation",
      category: "Automation",
      readTime: "12 min",
      url: "/documentation/automation/creating-first-automation",
    },
    { title: "Finding the Right Influencers", category: "Influencer Marketing", readTime: "10 min" },
    { title: "Understanding Analytics", category: "Analytics", readTime: "12 min" },
    { title: "API Authentication", category: "API Reference", readTime: "8 min" },
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
                Documentation
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Everything You Need to Know About Yazzil
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Comprehensive guides, tutorials, and API documentation to help you get the most out of Yazzil's social
                media automation platform.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search documentation..." className="pl-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Popular Articles</h2>
              <p className="text-muted-foreground">Most viewed documentation articles</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popularArticles.map((article, i) => (
                <Card key={i} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{article.title}</h3>
                    <Link href={article.url || "#"}>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        Read article
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">Find detailed guides for every aspect of Yazzil</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {docSections.map((section, i) => (
                <Card key={i} className="border-border/50 bg-background/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {section.icon}
                      <h3 className="font-bold">{section.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.articles.map((article, j) => (
                        <div key={j} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href="#"
                              className="text-sm hover:text-primary transition-colors flex items-center gap-1"
                            >
                              {article.title}
                              {article.popular && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  Popular
                                </Badge>
                              )}
                            </Link>
                          </div>
                          <span className="text-xs text-muted-foreground">{article.readTime}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={section.url || "#"}>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View All Articles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary w-fit">
                  Developer Resources
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Build with Yazzil's API</h2>
                <p className="text-muted-foreground md:text-lg">
                  Comprehensive API documentation with code examples, SDKs, and interactive testing tools to help you
                  integrate Yazzil into your applications.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="text-sm">RESTful API with JSON responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">OAuth 2.0 authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm">Real-time webhooks</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>
                    View API Docs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Try Interactive Demo</Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
                <div className="mb-4">
                  <Badge variant="secondary">Example Request</Badge>
                </div>
                <pre className="text-sm text-muted-foreground overflow-x-auto">
                  <code>{`curl -X POST https://api.yazzil.com/v1/automations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Welcome Message",
    "trigger": "new_follower",
    "action": {
      "type": "send_message",
      "template": "Thanks for following!"
    }
  }'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button>Contact Support</Button>
                <Button variant="outline">Join Community</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
