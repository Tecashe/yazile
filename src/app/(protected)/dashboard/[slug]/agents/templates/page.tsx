// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"

// import { TemplateList } from "@/components/global/n8n/n8n/template-list"

// export const metadata: Metadata = {
//   title: "Templates | n8n Integration Platform",
//   description: "Browse workflow templates",
// }

// export default async function TemplatesPage() {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Workflow Templates</h1>
//         <p className="text-muted-foreground">Browse and select from our library of pre-built workflow templates</p>
//       </div>

//       <TemplateList showFilters={true} showSearch={true} limit={50} />
//     </div>
//   )
// }

"use client"

import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import {
  Zap,
  Workflow,
  Mail,
  Calendar,
  FileText,
  Database,
  MessageSquare,
  Share2,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react"

import { TemplateList } from "@/components/global/n8n/n8n/template-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function TemplatesPageClient() {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Popular integration categories
  const integrationCategories = [
    {
      name: "Email",
      icon: <Mail className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    },
    {
      name: "Calendar",
      icon: <Calendar className="h-4 w-4" />,
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    },
    {
      name: "Documents",
      icon: <FileText className="h-4 w-4" />,
      color:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    },
    {
      name: "Database",
      icon: <Database className="h-4 w-4" />,
      color:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    },
    {
      name: "Chat",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
    },
    {
      name: "Social",
      icon: <Share2 className="h-4 w-4" />,
      color: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    },
  ]

  // Key benefits
  const benefits = [
    {
      title: "Save Time",
      description: "Start with pre-built workflows instead of building from scratch",
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
    },
    {
      title: "Best Practices",
      description: "Templates follow industry best practices and optimization techniques",
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: "Easy Integration",
      description: "Connect with popular services like Gmail, Slack, and more with minimal setup",
      icon: <Share2 className="h-5 w-5 text-blue-500" />,
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Hero section with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-sky-950/10 p-8 mb-12">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        {/* Floating icons in background */}
        <div className="absolute top-12 right-12 opacity-10 dark:opacity-5">
          <Workflow className="h-32 w-32 text-indigo-500" />
        </div>
        <div className="absolute bottom-8 right-32 opacity-10 dark:opacity-5">
          <Mail className="h-16 w-16 text-blue-500" />
        </div>
        <div className="absolute top-24 left-[10%] opacity-10 dark:opacity-5">
          <Calendar className="h-20 w-20 text-purple-500" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-black/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
            >
              n8n Integration Platform
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-700 dark:from-indigo-300 dark:via-blue-300 dark:to-sky-300 bg-clip-text text-transparent mb-4">
            Workflow Templates
          </h1>

          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mb-6">
            Accelerate your automation journey with our library of pre-built workflow templates. Connect your favorite
            services, customize to your needs, and deploy in minutes.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {integrationCategories.map((category, index) => (
              <div
                key={index}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${category.color} transition-all hover:scale-105`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <Button className="group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-500 dark:hover:to-blue-500 transition-all">
              Browse Templates
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 dark:bg-black/20 border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-black/30"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
            variants={itemVariants}
          >
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              {benefit.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and filter section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-slate-500" />
            <h2 className="text-xl font-semibold">Find Your Perfect Workflow</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="h-4 w-4" />
            <span>Filter by category, complexity, or integration</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 cursor-pointer">
            All Templates
          </Badge>
          <Badge variant="outline" className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Marketing
          </Badge>
          <Badge variant="outline" className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Sales
          </Badge>
          <Badge variant="outline" className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Customer Support
          </Badge>
          <Badge variant="outline" className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Data Processing
          </Badge>
          <Badge variant="outline" className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Document Management
          </Badge>
        </div>
      </div>

      {/* Template list */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950 opacity-0 pointer-events-none h-20 -top-20"></div>
        <TemplateList showFilters={true} showSearch={true} limit={50} />
      </div>
    </div>
  )
}
