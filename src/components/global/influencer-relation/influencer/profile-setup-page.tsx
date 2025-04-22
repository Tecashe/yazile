
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon } from "lucide-react"
// import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { saveInfluencerProfile } from "@/actions/influencer-relations/save-profile"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  niche: z.string().min(2, {
    message: "Niche must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  postRate: z.string().refine(
    (value) => {
      try {
        const num = Number.parseFloat(value)
        return !isNaN(num) && num >= 0
      } catch (e) {
        return false
      }
    },
    {
      message: "Post Rate must be a valid number.",
    },
  ),
  storyRate: z.string().refine(
    (value) => {
      try {
        const num = Number.parseFloat(value)
        return !isNaN(num) && num >= 0
      } catch (e) {
        return false
      }
    },
    {
      message: "Story Rate must be a valid number.",
    },
  ),
  videoRate: z.string().refine(
    (value) => {
      try {
        const num = Number.parseFloat(value)
        return !isNaN(num) && num >= 0
      } catch (e) {
        return false
      }
    },
    {
      message: "Video Rate must be a valid number.",
    },
  ),
  contentStyle: z.string().min(2, {
    message: "Content Style must be at least 2 characters.",
  }),
  incomeGoal: z.string().refine(
    (value) => {
      try {
        const num = Number.parseFloat(value)
        return !isNaN(num) && num >= 0
      } catch (e) {
        return false
      }
    },
    {
      message: "Income Goal must be a valid number.",
    },
  ),
  contentFrequency: z.string().min(2, {
    message: "Content Frequency must be at least 2 characters.",
  }),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
})

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function ProfileSetupPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedContentDays, setSelectedContentDays] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      location: "",
      niche: "",
      email: "",
      postRate: "0",
      storyRate: "0",
      videoRate: "0",
      contentStyle: "",
      incomeGoal: "0",
      contentFrequency: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: "",
    },
  })

  const handleImageUpload = async (e: any) => {
    setLoading(true)
    try {
      const file = e.target.files[0]
      if (!file) {
        toast({
          title: "Error",
          description: "Please select an image to upload.",
          variant: "destructive",
        })
        return
      }

      // Delete the previous image if it exists
    //   if (profileImage) {
    //     const publicId = profileImage.split("/").pop()?.split(".")[0]
    //     if (publicId) {
    //       await deleteFromCloudinary(publicId)
    //     }
    //   }

    //   const imageUrl = await uploadToCloudinary(file)
    const imageUrl = 'https://exampleurl'
      setProfileImage(imageUrl)
      toast({
        title: "Success",
        description: "Profile image uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDayToggle = (day: string) => {
    setSelectedContentDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day],
    )
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  const formData = form.watch()

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Prepare the data for saving
      const profileData = {
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        // profilePicture: formData.name,
        location: formData.location,
        niche: formData.niche,
        email: formData.email,
        website: "",
        socialAccounts: [
          ...(formData.instagram ? [{ platform: "Instagram", username: formData.instagram }] : []),
          ...(formData.tiktok ? [{ platform: "TikTok", username: formData.tiktok }] : []),
          ...(formData.youtube ? [{ platform: "YouTube", username: formData.youtube }] : []),
          ...(formData.twitter ? [{ platform: "Twitter", username: formData.twitter }] : []),
        ],
        rates: {
          postRate: Number.parseFloat(formData.postRate) || 0,
          storyRate: Number.parseFloat(formData.storyRate) || 0,
          videoRate: Number.parseFloat(formData.videoRate) || 0,
        },
        contentStyle: formData.contentStyle,
        // selectedContentDays: selectedContentDays,
        incomeGoal: Number.parseFloat(formData.incomeGoal) || 0,
        contentFrequency: formData.contentFrequency,
        onboardingCompleted: true,
      }

      // Save the profile data
      const result = await saveInfluencerProfile(profileData)

      if (result.status === 200) {
        // Redirect to dashboard
        router.push("/influencers")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Profile Setup</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div>
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile Picture" />
                      ) : (
                        <AvatarFallback>
                          {loading ? (
                            <Skeleton className="w-full h-full rounded-full" />
                          ) : (
                            <ImageIcon className="w-8 h-8" />
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="space-y-2">
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="profileImage"
                        className={cn(
                          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
                          loading && "cursor-not-allowed opacity-50",
                        )}
                      >
                        {loading ? "Uploading..." : "Upload Image"}
                      </label>
                      <FormDescription>Upload a profile picture for your account.</FormDescription>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Niche */}
            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niche</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Niche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Post Rate */}
            <FormField
              control={form.control}
              name="postRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormDescription>The rate you charge per post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Story Rate */}
            <FormField
              control={form.control}
              name="storyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormDescription>The rate you charge per story.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Rate */}
            <FormField
              control={form.control}
              name="videoRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormDescription>The rate you charge per video.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Style */}
            <FormField
              control={form.control}
              name="contentStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Style</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Content Style" {...field} />
                  </FormControl>
                  <FormDescription>Describe your content style.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Income Goal */}
            <FormField
              control={form.control}
              name="incomeGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Goal</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Your monthly income goal.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Frequency */}
            <FormField
              control={form.control}
              name="contentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Content Frequency" {...field} />
                  </FormControl>
                  <FormDescription>How often do you post content?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Content Days */}
          <div>
            <FormItem>
              <FormLabel>Content Days</FormLabel>
              <FormDescription>Select the days you typically create content.</FormDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {days.map((day) => (
                  <Badge
                    key={day}
                    variant={selectedContentDays.includes(day) ? "default" : "outline"}
                    onClick={() => handleDayToggle(day)}
                    className="cursor-pointer"
                  >
                    {day}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instagram */}
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Instagram Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TikTok */}
            <FormField
              control={form.control}
              name="tiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl>
                    <Input placeholder="Your TikTok Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* YouTube */}
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="Your YouTube Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Twitter */}
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Twitter Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
