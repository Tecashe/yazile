// "use client"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import Image from "next/image"
// import { motion } from "framer-motion"
// import { Heart, MessageCircle, Calendar, Clock, Instagram, Users, Eye, BarChart3 } from "lucide-react"
// import { FancyConnector } from "../connector"
// import PostButton from "../post"
// import { Badge } from "@/components/ui/badge"
// import { format, parseISO } from "date-fns"
// import { Button } from "@/components/ui/button"

// type Props = {
//   id: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
// }

// const PostNode = ({ id, theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" } }: Props) => {
//   const { data } = useQueryAutomation(id)

//   if (!data?.data) {
//     return null
//   }

//   // Check if there are any posts (published or scheduled)
//   const hasPublishedPosts = data.data.posts && data.data.posts.length > 0
//   const hasScheduledPosts = data.data.scheduledPosts && data.data.scheduledPosts.length > 0

//   if (!hasPublishedPosts && !hasScheduledPosts) {
//     return null
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-5xl relative px-4 sm:px-0"
//     >
//       <div className="absolute h-20 left-1/2 -top-20 flex flex-col items-center z-10">
//         <FancyConnector direction="vertical" style="gradient" length={55} color={theme.secondary} />
//       </div>

//       <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
//         {/* Top accent bar */}
//         <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

//         <div className="p-4 sm:p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-background-90 rounded-xl">
//               <Instagram className="h-6 w-6 text-[#768BDD]" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold">Monitored Posts</h3>
//               <p className="text-text-secondary">
//                 Your automation is monitoring {hasPublishedPosts ? data.data.posts.length : 0} published
//                 {hasScheduledPosts ? ` and ${data.data.scheduledPosts.length} scheduled` : ""} posts
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             {/* Left section - Stats */}
//             <div className="lg:col-span-1">
//               <div className="bg-background-90 rounded-xl p-4 staggeredFadeIn">
//                 <h4 className="text-lg font-medium mb-4">Post Metrics</h4>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="p-2 bg-[#3352CC]/20 rounded-lg">
//                         <Eye className="h-4 w-4 text-[#768BDD]" />
//                       </div>
//                       <span>Total Impressions</span>
//                     </div>
//                     <span className="font-bold">12.4K</span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="p-2 bg-[#3352CC]/20 rounded-lg">
//                         <MessageCircle className="h-4 w-4 text-[#768BDD]" />
//                       </div>
//                       <span>Comments</span>
//                     </div>
//                     <span className="font-bold">342</span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="p-2 bg-[#3352CC]/20 rounded-lg">
//                         <Heart className="h-4 w-4 text-[#768BDD]" />
//                       </div>
//                       <span>Engagement Rate</span>
//                     </div>
//                     <span className="font-bold">4.8%</span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="p-2 bg-[#3352CC]/20 rounded-lg">
//                         <Users className="h-4 w-4 text-[#768BDD]" />
//                       </div>
//                       <span>Audience Reach</span>
//                     </div>
//                     <span className="font-bold">8.7K</span>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <Button variant="outline" className="w-full flex items-center gap-2">
//                     <BarChart3 className="h-4 w-4" />
//                     View Detailed Analytics
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Right section - Posts Grid */}
//             <div className="lg:col-span-2">
//               {/* Published Posts Section */}
//               {hasPublishedPosts && (
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="text-lg font-medium">Published Posts</h4>
//                     <Badge variant="outline" className="bg-background-90/50 text-xs">
//                       {data.data.posts.length} Posts
//                     </Badge>
//                   </div>

//                   <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
//                     {data.data.posts.map((post, index) => (
//                       <motion.div
//                         key={post.id}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{
//                           opacity: 1,
//                           scale: 1,
//                           transition: { delay: index * 0.1 },
//                         }}
//                         whileHover={{ scale: 1.05 }}
//                         className="relative aspect-square rounded-lg overflow-hidden shadow-md group"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         <Image
//                           fill
//                           sizes="100vw"
//                           src={post.media || "/placeholder.svg"}
//                           alt="post image"
//                           className="object-cover transition-all duration-300 group-hover:scale-110"
//                         />

//                         <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <div className="flex items-center gap-3">
//                             <div className="flex items-center gap-1">
//                               <Heart className="h-3 w-3 text-keyword-red" />
//                               <span className="text-white text-xs">1.2k</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <MessageCircle className="h-3 w-3 text-light-blue" />
//                               <span className="text-white text-xs">48</span>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Scheduled Posts Section */}
//               {hasScheduledPosts && (
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="text-lg font-medium flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-[#768BDD]" />
//                       Scheduled Posts
//                     </h4>
//                     <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       {data.data.scheduledPosts.length} Posts
//                     </Badge>
//                   </div>

//                   <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
//                     {data.data.scheduledPosts.map((post, index) => (
//                       <motion.div
//                         key={post.id}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{
//                           opacity: 1,
//                           scale: 1,
//                           transition: { delay: (index + (hasPublishedPosts ? data.data.posts.length : 0)) * 0.1 },
//                         }}
//                         whileHover={{ scale: 1.05 }}
//                         className="relative aspect-square rounded-lg overflow-hidden shadow-md group"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                         <Image
//                           fill
//                           sizes="100vw"
//                           src={post.mediaUrl || "/placeholder.svg"}
//                           alt="scheduled post"
//                           className="object-cover transition-all duration-300 group-hover:scale-110"
//                         />

//                         <div className="absolute top-2 right-2 z-10">
//                           <Badge variant="secondary" className="bg-background-90/80 flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                             {format(parseISO(post.status), "MMM d")}
//                           </Badge>
//                         </div>

//                         <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <p className="text-white text-xs line-clamp-2">{post.caption}</p>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Add post button */}
//           <div className="mt-6 flex justify-end">
//             <PostButton id={id} theme={theme} />
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default PostNode

"use client"
import { useQueryAutomation } from "@/hooks/user-queries"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Clock, Instagram, Archive, Grid, Layers, Play, Camera, ImageIcon } from "lucide-react"
import { FancyConnector } from "../connector"
import PostButton from "../post"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

const PostNode = ({ id, theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" } }: Props) => {
  const { data } = useQueryAutomation(id)

  if (!data?.data) {
    return null
  }

  // Check if there are any posts (published or scheduled)
  const hasPublishedPosts = data.data.posts && data.data.posts.length > 0
  const hasScheduledPosts = data.data.scheduledPosts && data.data.scheduledPosts.length > 0

  if (!hasPublishedPosts && !hasScheduledPosts) {
    return null
  }

  // Calculate dynamic metrics from posts
  const publishedPostsCount = data.data.posts?.length || 0
  const scheduledPostsCount = data.data.scheduledPosts?.length || 0
  const totalPosts = publishedPostsCount + scheduledPostsCount

  // Get media type distribution
  const mediaTypeStats = data.data.posts?.reduce((acc, post) => {
    const type = post.mediaType || 'IMAGE'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Calculate posts with captions
  const postsWithCaptions = data.data.posts?.filter(post => post.caption && post.caption.trim().length > 0).length || 0
  const captionRate = publishedPostsCount > 0 ? ((postsWithCaptions / publishedPostsCount) * 100).toFixed(0) : "0"

  // Get automation status
  const isActive = data.data.active
  const automationName = data.data.name || "Instagram Automation"

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'VIDEO': return <Play className="h-3 w-3" />
      case 'CAROSEL_ALBUM': return <Layers className="h-3 w-3" />
      default: return <ImageIcon className="h-3 w-3" />
    }
  }

  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case 'VIDEO': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'CAROSEL_ALBUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl relative px-4 sm:px-0"
    >
      {/* Elegant Connector */}
      <div className="absolute h-24 left-1/2 -top-24 flex flex-col items-center z-10">
        <FancyConnector direction="vertical" style="gradient" length={70} color={theme.secondary} />
        <motion.div 
          className="w-2 h-2 rounded-full bg-[#768BDD] shadow-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Master Container - Sophisticated Layout */}
      <div className="bg-gradient-to-br from-background-80/95 via-background-85 to-background-90/95 backdrop-blur-sm rounded-2xl w-full overflow-hidden shadow-2xl border border-background-80/30 relative">
        
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#3352CC]/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#768BDD]/10 to-transparent rounded-tl-full" />
        
        {/* Status Bar - Refined Elegance */}
        <div className="relative">
          <div className={`h-2 w-full ${
            isActive 
              ? "bg-gradient-to-r from-[#3352CC]/80 via-[#768BDD] to-[#3352CC]/80"
              : "bg-gradient-to-r from-gray-400/60 via-gray-500/80 to-gray-400/60"
          }`}>
            <motion.div 
              className="h-full bg-gradient-to-r from-white/20 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Header Section - Architectural Precision */}
        <div className="p-8 pb-6">
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-background-90 to-background-95 rounded-xl shadow-inner border border-background-80/50">
                <Instagram className="h-7 w-7 text-[#768BDD]" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'} shadow-lg`} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {automationName}
                </h2>
                <Badge 
                  variant={isActive ? "default" : "secondary"} 
                  className={`px-3 py-1 font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border-green-500/30' 
                      : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30'
                  }`}
                >
                  {isActive ? "⚡ Active" : "⏸️ Paused"}
                </Badge>
              </div>
              <p className="text-text-secondary text-lg">
                Curating <span className="font-semibold text-[#768BDD]">{publishedPostsCount}</span> published
                {scheduledPostsCount > 0 && (
                  <> and <span className="font-semibold text-amber-400">{scheduledPostsCount}</span> scheduled</>
                )} masterpieces
              </p>
            </div>
          </motion.div>

          {/* Content Analytics Bar - Minimalist Elegance */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-background-90/80 to-background-95/80 rounded-xl p-4 border border-background-80/30">
              <div className="flex items-center gap-2 mb-1">
                <Archive className="h-4 w-4 text-[#768BDD]" />
                <span className="text-xs text-text-secondary uppercase tracking-wide">Total</span>
              </div>
              <div className="text-2xl font-bold">{totalPosts}</div>
            </div>
            
            <div className="bg-gradient-to-br from-background-90/80 to-background-95/80 rounded-xl p-4 border border-background-80/30">
              <div className="flex items-center gap-2 mb-1">
                <Grid className="h-4 w-4 text-green-400" />
                <span className="text-xs text-text-secondary uppercase tracking-wide">Live</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{publishedPostsCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-background-90/80 to-background-95/80 rounded-xl p-4 border border-background-80/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-text-secondary uppercase tracking-wide">Queue</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{scheduledPostsCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-background-90/80 to-background-95/80 rounded-xl p-4 border border-background-80/30">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="h-4 w-4 text-[#768BDD]" />
                <span className="text-xs text-text-secondary uppercase tracking-wide">Captions</span>
              </div>
              <div className="text-2xl font-bold">{captionRate}%</div>
            </div>
          </motion.div>
        </div>

        {/* Content Gallery - Museum-Quality Display */}
        <div className="px-8 pb-8">
          {/* Published Posts - Main Exhibition */}
          {hasPublishedPosts && (
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#3352CC] to-[#768BDD] rounded-full" />
                  <h3 className="text-xl font-bold">Published Collection</h3>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-background-90/50 to-background-95/50 border-[#768BDD]/20">
                  {publishedPostsCount} Pieces
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {data.data.posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                      transition: { 
                        delay: index * 0.08,
                        duration: 0.5,
                        ease: "easeOut"
                      },
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      rotateY: 2,
                      z: 10,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-background-90 to-background-95 border border-background-80/20"
                  >
                    {/* Image with Sophisticated Overlay */}
                    <div className="absolute inset-0">
                      <Image
                        fill
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        src={post.media || "/placeholder.svg"}
                        alt={post.caption ? `${post.caption.slice(0, 30)}...` : "Published content"}
                        className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                      
                      {/* Elegant Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3352CC]/10 to-[#768BDD]/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>

                    {/* Media Type Indicator - Top Corner Jewel */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className={`px-2 py-1 rounded-lg border backdrop-blur-sm ${getMediaTypeColor(post.mediaType || 'IMAGE')}`}>
                        {getMediaIcon(post.mediaType || 'IMAGE')}
                      </div>
                    </div>

                    {/* Content Preview - Bottom Reveal */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg" />
                        <span className="text-white text-xs font-medium uppercase tracking-wider">Published</span>
                      </div>
                      
                      {post.caption && (
                        <p className="text-white text-xs leading-relaxed line-clamp-3 opacity-90">
                          {post.caption}
                        </p>
                      )}
                    </div>

                    {/* Sophisticated Border Effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#768BDD]/30 transition-all duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Scheduled Posts - Future Exhibition */}
          {hasScheduledPosts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full" />
                  <h3 className="text-xl font-bold">Scheduled Showcase</h3>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-400/20 text-amber-400">
                  {scheduledPostsCount} Queued
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {data.data.scheduledPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotateX: 0,
                      transition: { 
                        delay: (index + publishedPostsCount) * 0.08,
                        duration: 0.5,
                        ease: "easeOut"
                      },
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      rotateX: 2,
                      z: 10,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-background-90 to-background-95 border-2 border-dashed border-amber-400/30"
                  >
                    {/* Future Content Preview */}
                    <div className="absolute inset-0">
                      <Image
                        fill
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        src={post.mediaUrl || "/placeholder.svg"}
                        alt={post.caption ? `Scheduled: ${post.caption.slice(0, 30)}...` : "Scheduled content"}
                        className="object-cover transition-all duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                      
                      {/* Scheduled Content Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>

                    {/* Schedule Badge - Prominent Display */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className="px-3 py-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-lg border border-amber-400/30">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-white text-xs font-medium">
                            {post.status && format(parseISO(post.status), "MMM d")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Future Preview Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg animate-pulse" />
                        <span className="text-white text-xs font-medium uppercase tracking-wider">Scheduled</span>
                        {post.status && (
                          <span className="text-amber-200 text-xs ml-auto">
                            {format(parseISO(post.status), "HH:mm")}
                          </span>
                        )}
                      </div>
                      
                      {post.caption && (
                        <p className="text-white text-xs leading-relaxed line-clamp-3 opacity-90">
                          {post.caption}
                        </p>
                      )}
                    </div>

                    {/* Scheduled Border Animation */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-amber-400/40 transition-all duration-300" />
                    
                    {/* Subtle Animation Indicator */}
                    <motion.div 
                      className="absolute top-2 left-2 w-2 h-2 bg-amber-400 rounded-full opacity-60"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Section - Command Center */}
          <motion.div 
            className="mt-10 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <PostButton id={id} theme={theme} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default PostNode