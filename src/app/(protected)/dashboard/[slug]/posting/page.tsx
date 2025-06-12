// import { onCurrentUser } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { PostScheduler } from "../_components/newSchedule/post-scheduler"
// import { ScheduledPosts } from "../_components/newSchedule/scheduled-post"
// import { ContentSuggestions } from "../_components/newSchedule/content-suggestions"
// import { CaptionGenerator } from "../_components/newSchedule/caption-generator"
// import { HashtagAnalyzer } from "../_components/newSchedule/hashtag-analyzer"
// import { PostTimeSuggester } from "../_components/newSchedule/post-time-suggester"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { CalendarDays, Clock, Sparkles, Hash, Zap, MessageSquareText } from "lucide-react"

// export default async function SchedulePage() {
//   const user = await onCurrentUser()

//   if (!user) {
//     redirect("/sign-in")
//   }
 
//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto py-4 px-4 sm:py-8">
//         <div className="space-y-8">
//           {/* Header Section */}
//           <div className="relative">
//             <div className="relative overflow-hidden bg-gray-900/30 rounded-xl p-6 sm:p-8 border border-gray-800 backdrop-blur-sm">
//               <div className="relative z-10">
//                 <p className="text-sm text-gray-400 max-w-2xl mb-4">
//                   Your all-in-one Instagram content powerhouse. Create, schedule, and optimize your posts with
//                   AI-powered tools designed to maximize engagement.
//                 </p>
//                 <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-400">
//                   <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1">
//                     <CalendarDays className="w-4 h-4" />
//                     <span>Smart Scheduling</span>
//                   </div>
//                   <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1">
//                     <Sparkles className="w-4 h-4" />
//                     <span>AI Content Generation</span>
//                   </div>
//                   <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1">
//                     <Hash className="w-4 h-4" />
//                     <span>Hashtag Analytics</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
//               <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
//               <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
//             </div>
//           </div>

//           {/* Tools Section */}
//           <Tabs defaultValue="schedule" className="space-y-6">
//             <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 h-auto p-1 bg-gray-900/50 backdrop-blur-sm">
//               <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-800">
//                 <CalendarDays className="w-4 h-4 mr-2" />
//                 Schedule
//               </TabsTrigger>
//               <TabsTrigger value="content" className="data-[state=active]:bg-gray-800">
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 Ideas
//               </TabsTrigger>
//               <TabsTrigger value="captions" className="data-[state=active]:bg-gray-800">
//                 <MessageSquareText className="w-4 h-4 mr-2" />
//                 Captions
//               </TabsTrigger>
//               {/* <TabsTrigger value="hashtags" className="data-[state=active]:bg-gray-800">
//                 <Hash className="w-4 h-4 mr-2" />
//                 Hashtags
//               </TabsTrigger> */}
//             </TabsList>

//             <TabsContent value="schedule" className="space-y-6 mt-6">
//               <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
//                 <PostScheduler userId={user.id} />
//                 <div className="space-y-4">
//                   <PostTimeSuggester />
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="content" className="mt-6">
//               <ContentSuggestions />
//             </TabsContent>

//             <TabsContent value="captions" className="mt-6">
//               <CaptionGenerator />
//             </TabsContent>

//             <TabsContent value="hashtags" className="mt-6">
//               <HashtagAnalyzer />
//             </TabsContent>
//           </Tabs>

//           {/* Scheduled Posts Carousel */}
//           <section className="w-full">
//             <div className="space-y-4">
//               <div className="relative">
//                 <div className="relative bg-gray-900/30 rounded-lg p-4 border border-gray-800 backdrop-blur-sm">
//                   <h2 className="text-xl font-semibold text-gray-200">Scheduled Posts</h2>
//                   <p className="text-sm text-gray-400">Your upcoming content calendar</p>
//                 </div>
//               </div>
//               <ScheduledPosts userId={user.id} />
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   )
// }
// Updated page.tsx
import { onCurrentUser } from "@/actions/user"
import { redirect } from "next/navigation"
import { PostScheduler } from "../_components/newSchedule/post-scheduler"
import { ScheduledPosts } from "../_components/newSchedule/scheduled-post"
import { ContentSuggestions } from "../_components/newSchedule/content-suggestions"
import { CaptionGenerator } from "../_components/newSchedule/caption-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Sparkles, MessageSquareText, Clock, LayoutGrid } from "lucide-react"
import { useState } from "react" // Added for calendar visibility state

export default async function SchedulePage() {
  const user = await onCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-6 px-4 sm:py-8">
        {/* Header Section - Simplified */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Content Scheduler</h1>
          <p className="text-muted-foreground text-sm">
            Create, schedule, and optimize your Instagram posts with AI-powered tools.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          {/* Tools Navigation */}
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid grid-cols-3 h-auto p-1 bg-card border border-border rounded-lg gap-1">
              <TabsTrigger 
                value="schedule" 
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground py-2 rounded-md"
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground py-2 rounded-md"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ideas
              </TabsTrigger>
              <TabsTrigger 
                value="captions" 
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground py-2 rounded-md"
              >
                <MessageSquareText className="w-4 h-4 mr-2" />
                Captions
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <div className="mt-4">
              <TabsContent value="schedule" className="mt-0">
                <div className="bg-card border border-border rounded-lg p-4">
                  <PostScheduler userId={user.id} />
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-0">
                <div className="bg-card border border-border rounded-lg p-4">
                  <ContentSuggestions />
                </div>
              </TabsContent>

              <TabsContent value="captions" className="mt-0">
                <div className="bg-card border border-border rounded-lg p-4">
                  <CaptionGenerator />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Upcoming Posts Section */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Posts</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                View All
              </button>
            </div>
            <ScheduledPosts userId={user.id} />
          </div>
        </div>

        {/* Quick Actions - Moved to bottom for mobile-first design */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex items-center gap-2 p-3 text-left rounded-lg bg-card border border-border hover:bg-secondary transition-colors">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Content Templates</span>
            </button>
            <button className="flex items-center gap-2 p-3 text-left rounded-lg bg-card border border-border hover:bg-secondary transition-colors">
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Scheduling Insights</span>
            </button>
            <button className="flex items-center gap-2 p-3 text-left rounded-lg bg-card border border-border hover:bg-secondary transition-colors">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Performance Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}