"use client"
import { useQueryAutomation } from "@/hooks/user-queries"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Calendar, Clock, Instagram, Users, Eye, BarChart3 } from "lucide-react"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl relative px-4 sm:px-0"
    >
      <div className="absolute h-20 left-1/2 -top-20 flex flex-col items-center z-10">
        <FancyConnector direction="vertical" style="gradient" length={55} color={theme.secondary} />
      </div>

      <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-background-90 rounded-xl">
              <Instagram className="h-6 w-6 text-[#768BDD]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Monitored Posts</h3>
              <p className="text-text-secondary">
                Your automation is monitoring {hasPublishedPosts ? data.data.posts.length : 0} published
                {hasScheduledPosts ? ` and ${data.data.scheduledPosts.length} scheduled` : ""} posts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left section - Stats */}
            <div className="lg:col-span-1">
              <div className="bg-background-90 rounded-xl p-4 staggeredFadeIn">
                <h4 className="text-lg font-medium mb-4">Post Metrics</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#3352CC]/20 rounded-lg">
                        <Eye className="h-4 w-4 text-[#768BDD]" />
                      </div>
                      <span>Total Impressions</span>
                    </div>
                    <span className="font-bold">12.4K</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#3352CC]/20 rounded-lg">
                        <MessageCircle className="h-4 w-4 text-[#768BDD]" />
                      </div>
                      <span>Comments</span>
                    </div>
                    <span className="font-bold">342</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#3352CC]/20 rounded-lg">
                        <Heart className="h-4 w-4 text-[#768BDD]" />
                      </div>
                      <span>Engagement Rate</span>
                    </div>
                    <span className="font-bold">4.8%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#3352CC]/20 rounded-lg">
                        <Users className="h-4 w-4 text-[#768BDD]" />
                      </div>
                      <span>Audience Reach</span>
                    </div>
                    <span className="font-bold">8.7K</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </div>

            {/* Right section - Posts Grid */}
            <div className="lg:col-span-2">
              {/* Published Posts Section */}
              {hasPublishedPosts && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium">Published Posts</h4>
                    <Badge variant="outline" className="bg-background-90/50 text-xs">
                      {data.data.posts.length} Posts
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {data.data.posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          transition: { delay: index * 0.1 },
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square rounded-lg overflow-hidden shadow-md group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <Image
                          fill
                          sizes="100vw"
                          src={post.media || "/placeholder.svg"}
                          alt="post image"
                          className="object-cover transition-all duration-300 group-hover:scale-110"
                        />

                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-keyword-red" />
                              <span className="text-white text-xs">1.2k</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-light-blue" />
                              <span className="text-white text-xs">48</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduled Posts Section */}
              {hasScheduledPosts && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#768BDD]" />
                      Scheduled Posts
                    </h4>
                    <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {data.data.scheduledPosts.length} Posts
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {data.data.scheduledPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          transition: { delay: (index + (hasPublishedPosts ? data.data.posts.length : 0)) * 0.1 },
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square rounded-lg overflow-hidden shadow-md group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <Image
                          fill
                          sizes="100vw"
                          src={post.mediaUrl || "/placeholder.svg"}
                          alt="scheduled post"
                          className="object-cover transition-all duration-300 group-hover:scale-110"
                        />

                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="secondary" className="bg-background-90/80 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(parseISO(post.status), "MMM d")}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-xs line-clamp-2">{post.caption}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add post button */}
          <div className="mt-6 flex justify-end">
            <PostButton id={id} theme={theme} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PostNode

