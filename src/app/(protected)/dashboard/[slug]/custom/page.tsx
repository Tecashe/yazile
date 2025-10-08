// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Calendar, Mail, MessageSquare, Send, Clock } from "lucide-react"

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("Form submitted:", formData)
//     // Handle form submission logic here
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-12 max-w-7xl">
//         {/* Header Section */}
//         <div className="text-center mb-12 staggeredFadeIn">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in Touch</h1>
//           <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
//             Have a question or need support? We&apos;re here to help. Reach out to us and we&apos;ll get back to you as soon as
//             possible.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8 items-start">
//           {/* Contact Form */}
//           <Card className="glassEffect border-border/50 glow">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MessageSquare className="w-5 h-5" />
//                 Send us a Message
//               </CardTitle>
//               <CardDescription>Fill out the form below and we&apos;ll respond within 24 hours</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Name</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="bg-secondary/50 border-border/50"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="john@example.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="bg-secondary/50 border-border/50"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="subject">Subject</Label>
//                   <Input
//                     id="subject"
//                     name="subject"
//                     placeholder="How can we help?"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     className="bg-secondary/50 border-border/50"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="message">Message</Label>
//                   <Textarea
//                     id="message"
//                     name="message"
//                     placeholder="Tell us more about your inquiry..."
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows={6}
//                     className="bg-secondary/50 border-border/50 resize-none"
//                   />
//                 </div>

//                 <Button type="submit" className="w-full glowHover" size="lg">
//                   <Send className="w-4 h-4 mr-2" />
//                   Send Message
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Right Column - Info Cards */}
//           <div className="space-y-6">
//             {/* Schedule a Call Card */}
//             <Card className="glassEffect border-border/50 glow float">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="w-5 h-5" />
//                   Schedule a Call
//                 </CardTitle>
//                 <CardDescription>Book a time that works best for you</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Prefer to talk? Schedule a call with our team to discuss your needs in detail.
//                 </p>
//                 <Button
//                   variant="outline"
//                   className="w-full glowHover bg-transparent"
//                   onClick={() => window.open("https://calendly.com/your-calendly-link", "_blank")}
//                 >
//                   <Calendar className="w-4 h-4 mr-2" />
//                   Open Calendly
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Quick Contact Info */}
//             <Card className="glassEffect border-border/50 glow">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Mail className="w-5 h-5" />
//                   Other Ways to Reach Us
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <div className="p-2 rounded-lg bg-secondary/50">
//                     <Mail className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-sm">Email</p>
//                     <p className="text-sm text-muted-foreground">support@yazzil.com</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <div className="p-2 rounded-lg bg-secondary/50">
//                     <Clock className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-sm">Response Time</p>
//                     <p className="text-sm text-muted-foreground">Within 24 hours</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* FAQ Hint Card */}
//             <Card className="glassEffect border-border/50 shimmerBorder">
//               <CardContent className="pt-6">
//                 <p className="text-sm text-muted-foreground text-center">
//                   Looking for quick answers? Check out our{" "}
//                   <a href="#" className="text-primary hover:underline font-medium">
//                     FAQ section
//                   </a>{" "}
//                   for common questions.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Mail, MessageSquare, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { sendContactEmail } from "@/actions/contact-us/contact"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you within 24 hours.",
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to send message. Please try again.",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12 staggeredFadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Have a question or need support? We&apos;re here to help. Reach out to us and we&apos;ll get back to you as soon as
            possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <Card className="glassEffect border-border/50 glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send us a Message
              </CardTitle>
              <CardDescription>Fill out the form below and we&apos;ll respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${submitStatus.type === "success" ? "text-green-500" : "text-red-500"}`}>
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={6}
                    className="bg-secondary/50 border-border/50 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full glowHover" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Schedule a Call Card */}
            <Card className="glassEffect border-border/50 glow float">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule a Call
                </CardTitle>
                <CardDescription>Book a time that works best for you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer to talk? Schedule a call with our team to discuss your needs in detail.
                </p>
                <Button
                  variant="outline"
                  className="w-full glowHover bg-transparent"
                  onClick={() => window.open("https://calendly.com/your-calendly-link", "_blank")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Open Calendly
                </Button>
              </CardContent>
            </Card>

            {/* Quick Contact Info */}
            <Card className="glassEffect border-border/50 glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Other Ways to Reach Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-sm text-muted-foreground">support@yazzil.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Hint Car */}
            <Card className="glassEffect border-border/50 shimmerBorder">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Looking for quick answers? Check out our{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    FAQ section
                  </a>{" "}
                  for common questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

