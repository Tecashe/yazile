// 'use client'

// import { useState, useEffect } from 'react'
// import { useUser } from '@clerk/nextjs'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Textarea } from '@/components/ui/textarea'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { toast } from '@/hooks/use-toast'
// import { 
//   User, 
//   Bell, 
//   Shield, 
//   CreditCard, 
//   Clock, 
//   MessageSquare, 
//   Zap,
//   Building,
//   Globe,
//   Palette,
//   Save,
//   Loader2
// } from 'lucide-react'
// import { 
//   updateUserProfile,
//   updateUserPreferences,
//   updateBusinessHours,
//   updateHandoffSettings,
//   updateCrmSyncSettings,
//   getUserSettings
// } from '@/actions/settings'

// interface UserSettings {
//   profile: {
//     firstname: string | null
//     lastname: string | null
//     email: string
//     phone: string | null
//     phoneVerified: boolean
//   }
//   preferences: {
//     soundEnabled: boolean
//     desktopNotifications: boolean
//     emailNotifications: boolean
//     autoMarkAsRead: boolean
//     theme: string
//     language: string
//   } | null
//   businessHours: {
//     timezone: string
//     mondayStart: string | null
//     mondayEnd: string | null
//     tuesdayStart: string | null
//     tuesdayEnd: string | null
//     wednesdayStart: string | null
//     wednesdayEnd: string | null
//     thursdayStart: string | null
//     thursdayEnd: string | null
//     fridayStart: string | null
//     fridayEnd: string | null
//     saturdayStart: string | null
//     saturdayEnd: string | null
//     sundayStart: string | null
//     sundayEnd: string | null
//     isActive: boolean
//   } | null
//   handoffSettings: {
//     isEnabled: boolean
//     notificationEmail: string | null
//     slackChannel: string | null
//     defaultPriority: string
//     businessHoursOnly: boolean
//     autoAssign: boolean
//     maxWaitTime: number
//   } | null
//   crmSyncSettings: {
//     autoSyncQualified: boolean
//     createDealsHighValue: boolean
//     syncLeadScores: boolean
//     realTimeSync: boolean
//   } | null
//   subscription: {
//     plan: string
//     status: string
//   } | null
// }

// export default function SettingsPage() {
//   const { user } = useUser()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [settings, setSettings] = useState<UserSettings | null>(null)

//   useEffect(() => {
//     async function loadSettings() {
//       if (!user) return
      
//       try {
//         const userSettings = await getUserSettings()
//         setSettings(userSettings)
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load settings",
//           variant: "destructive"
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadSettings()
//   }, [user])

//   const handleSaveProfile = async (formData: FormData) => {
//     setSaving(true)
//     try {
//       await updateUserProfile(formData)
//       toast({
//         title: "Success",
//         description: "Profile updated successfully"
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update profile",
//         variant: "destructive"
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleSavePreferences = async (formData: FormData) => {
//     setSaving(true)
//     try {
//       await updateUserPreferences(formData)
//       toast({
//         title: "Success",
//         description: "Preferences updated successfully"
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update preferences",
//         variant: "destructive"
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleSaveBusinessHours = async (formData: FormData) => {
//     setSaving(true)
//     try {
//       await updateBusinessHours(formData)
//       toast({
//         title: "Success",
//         description: "Business hours updated successfully"
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update business hours",
//         variant: "destructive"
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleSaveHandoffSettings = async (formData: FormData) => {
//     setSaving(true)
//     try {
//       await updateHandoffSettings(formData)
//       toast({
//         title: "Success",
//         description: "Handoff settings updated successfully"
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update handoff settings",
//         variant: "destructive"
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleSaveCrmSync = async (formData: FormData) => {
//     setSaving(true)
//     try {
//       await updateCrmSyncSettings(formData)
//       toast({
//         title: "Success",
//         description: "CRM sync settings updated successfully"
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update CRM sync settings",
//         variant: "destructive"
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!settings) {
//     return (
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-8">Settings</h1>
//         <Card>
//           <CardContent className="p-6">
//             <p>Failed to load settings. Please try again.</p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-4xl">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Settings</h1>
//         <p className="text-muted-foreground mt-2">
//           Manage your account settings and preferences
//         </p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList className="grid grid-cols-6 w-full">
//           <TabsTrigger value="profile" className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             Profile
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="flex items-center gap-2">
//             <Bell className="h-4 w-4" />
//             Notifications
//           </TabsTrigger>
//           <TabsTrigger value="business" className="flex items-center gap-2">
//             <Clock className="h-4 w-4" />
//             Business
//           </TabsTrigger>
//           <TabsTrigger value="handoff" className="flex items-center gap-2">
//             <MessageSquare className="h-4 w-4" />
//             Handoff
//           </TabsTrigger>
//           <TabsTrigger value="crm" className="flex items-center gap-2">
//             <Zap className="h-4 w-4" />
//             CRM Sync
//           </TabsTrigger>
//           <TabsTrigger value="billing" className="flex items-center gap-2">
//             <CreditCard className="h-4 w-4" />
//             Billing
//           </TabsTrigger>
//         </TabsList>

//         {/* Profile Settings */}
//         <TabsContent value="profile">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Profile Information
//               </CardTitle>
//               <CardDescription>
//                 Update your personal information and contact details
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form action={handleSaveProfile} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="firstname">First Name</Label>
//                     <Input
//                       id="firstname"
//                       name="firstname"
//                       defaultValue={settings.profile.firstname || ''}
//                       placeholder="Enter your first name"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="lastname">Last Name</Label>
//                     <Input
//                       id="lastname"
//                       name="lastname"
//                       defaultValue={settings.profile.lastname || ''}
//                       placeholder="Enter your last name"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     defaultValue={settings.profile.email}
//                     placeholder="Enter your email"
//                   />
//                 </div>
                
//                 <div>
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       id="phone"
//                       name="phone"
//                       defaultValue={settings.profile.phone || ''}
//                       placeholder="Enter your phone number"
//                     />
//                     {settings.profile.phoneVerified && (
//                       <Badge variant="secondary" className="self-center">
//                         Verified
//                       </Badge>
//                     )}
//                   </div>
//                 </div>

//                 <Button type="submit" disabled={saving}>
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//                   Save Profile
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Notification Preferences */}
//         <TabsContent value="notifications">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bell className="h-5 w-5" />
//                 Notification Preferences
//               </CardTitle>
//               <CardDescription>
//                 Configure how you want to be notified about important events
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form action={handleSavePreferences} className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label>Sound Notifications</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Play sounds for new messages and alerts
//                       </p>
//                     </div>
//                     <Switch
//                       name="soundEnabled"
//                       defaultChecked={settings.preferences?.soundEnabled ?? true}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label>Desktop Notifications</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Show desktop notifications for important events
//                       </p>
//                     </div>
//                     <Switch
//                       name="desktopNotifications"
//                       defaultChecked={settings.preferences?.desktopNotifications ?? true}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label>Email Notifications</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Receive email notifications for leads and automations
//                       </p>
//                     </div>
//                     <Switch
//                       name="emailNotifications"
//                       defaultChecked={settings.preferences?.emailNotifications ?? false}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label>Auto Mark as Read</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Automatically mark messages as read when viewed
//                       </p>
//                     </div>
//                     <Switch
//                       name="autoMarkAsRead"
//                       defaultChecked={settings.preferences?.autoMarkAsRead ?? false}
//                     />
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="theme">Theme</Label>
//                     <Select name="theme" defaultValue={settings.preferences?.theme ?? 'system'}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="light">Light</SelectItem>
//                         <SelectItem value="dark">Dark</SelectItem>
//                         <SelectItem value="system">System</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label htmlFor="language">Language</Label>
//                     <Select name="language" defaultValue={settings.preferences?.language ?? 'en'}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="en">English</SelectItem>
//                         <SelectItem value="es">Spanish</SelectItem>
//                         <SelectItem value="fr">French</SelectItem>
//                         <SelectItem value="de">German</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <Button type="submit" disabled={saving}>
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//                   Save Preferences
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Business Hours */}
//         <TabsContent value="business">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Business Hours
//               </CardTitle>
//               <CardDescription>
//                 Set your business hours for automated responses and handoffs
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form action={handleSaveBusinessHours} className="space-y-6">
//                 <div>
//                   <Label htmlFor="timezone">Timezone</Label>
//                   <Select name="timezone" defaultValue={settings.businessHours?.timezone ?? 'UTC'}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="UTC">UTC</SelectItem>
//                       <SelectItem value="America/New_York">Eastern Time</SelectItem>
//                       <SelectItem value="America/Chicago">Central Time</SelectItem>
//                       <SelectItem value="America/Denver">Mountain Time</SelectItem>
//                       <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
//                       <SelectItem value="Europe/London">London</SelectItem>
//                       <SelectItem value="Europe/Paris">Paris</SelectItem>
//                       <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-4">
//                   {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
//                     const dayLower = day.toLowerCase()
//                     const startField = `${dayLower}Start` as keyof typeof settings.businessHours
//                     const endField = `${dayLower}End` as keyof typeof settings.businessHours
                    
//                     return (
//                       <div key={day} className="grid grid-cols-3 gap-4 items-center">
//                         <Label>{day}</Label>
//                         <Input
//                           name={startField}
//                           type="time"
//                           defaultValue={settings.businessHours?.[startField] || ''}
//                           placeholder="Start time"
//                         />
//                         <Input
//                           name={endField}
//                           type="time"
//                           defaultValue={settings.businessHours?.[endField] || ''}
//                           placeholder="End time"
//                         />
//                       </div>
//                     )
//                   })}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Enable Business Hours</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Use business hours to control when automations are active
//                     </p>
//                   </div>
//                   <Switch
//                     name="isActive"
//                     defaultChecked={settings.businessHours?.isActive ?? true}
//                   />
//                 </div>

//                 <Button type="submit" disabled={saving}>
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//                   Save Business Hours
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Human Handoff Settings */}
//         <TabsContent value="handoff">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MessageSquare className="h-5 w-5" />
//                 Human Handoff Settings
//               </CardTitle>
//               <CardDescription>
//                 Configure when and how conversations are handed off to human agents
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form action={handleSaveHandoffSettings} className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Enable Human Handoff</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Allow conversations to be transferred to human agents
//                     </p>
//                   </div>
//                   <Switch
//                     name="isEnabled"
//                     defaultChecked={settings.handoffSettings?.isEnabled ?? true}
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="notificationEmail">Notification Email</Label>
//                   <Input
//                     id="notificationEmail"
//                     name="notificationEmail"
//                     type="email"
//                     defaultValue={settings.handoffSettings?.notificationEmail || ''}
//                     placeholder="Enter email for handoff notifications"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="slackChannel">Slack Channel</Label>
//                   <Input
//                     id="slackChannel"
//                     name="slackChannel"
//                     defaultValue={settings.handoffSettings?.slackChannel || ''}
//                     placeholder="#customer-support"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="defaultPriority">Default Priority</Label>
//                   <Select name="defaultPriority" defaultValue={settings.handoffSettings?.defaultPriority ?? 'MEDIUM'}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="LOW">Low</SelectItem>
//                       <SelectItem value="MEDIUM">Medium</SelectItem>
//                       <SelectItem value="HIGH">High</SelectItem>
//                       <SelectItem value="URGENT">Urgent</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="maxWaitTime">Max Wait Time (seconds)</Label>
//                   <Input
//                     id="maxWaitTime"
//                     name="maxWaitTime"
//                     type="number"
//                     defaultValue={settings.handoffSettings?.maxWaitTime ?? 300}
//                     min="30"
//                     max="3600"
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Business Hours Only</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Only allow handoffs during business hours
//                     </p>
//                   </div>
//                   <Switch
//                     name="businessHoursOnly"
//                     defaultChecked={settings.handoffSettings?.businessHoursOnly ?? false}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Auto Assign</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Automatically assign handoffs to available agents
//                     </p>
//                   </div>
//                   <Switch
//                     name="autoAssign"
//                     defaultChecked={settings.handoffSettings?.autoAssign ?? true}
//                   />
//                 </div>

//                 <Button type="submit" disabled={saving}>
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//                   Save Handoff Settings
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* CRM Sync Settings */}
//         <TabsContent value="crm">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Zap className="h-5 w-5" />
//                 CRM Sync Settings
//               </CardTitle>
//               <CardDescription>
//                 Configure how leads and data sync with your CRM system
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form action={handleSaveCrmSync} className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Auto Sync Qualified Leads</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Automatically sync qualified leads to your CRM
//                     </p>
//                   </div>
//                   <Switch
//                     name="autoSyncQualified"
//                     defaultChecked={settings.crmSyncSettings?.autoSyncQualified ?? true}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Create Deals for High-Value Leads</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Create deals/opportunities for high-value leads
//                     </p>
//                   </div>
//                   <Switch
//                     name="createDealsHighValue"
//                     defaultChecked={settings.crmSyncSettings?.createDealsHighValue ?? true}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Sync Lead Scores</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Include lead scoring data in CRM sync
//                     </p>
//                   </div>
//                   <Switch
//                     name="syncLeadScores"
//                     defaultChecked={settings.crmSyncSettings?.syncLeadScores ?? true}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Real-Time Sync</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Sync data in real-time instead of batch processing
//                     </p>
//                   </div>
//                   <Switch
//                     name="realTimeSync"
//                     defaultChecked={settings.crmSyncSettings?.realTimeSync ?? true}
//                   />
//                 </div>

//                 <Button type="submit" disabled={saving}>
//                   {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//                   Save CRM Settings
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Billing & Subscription */}
//         <TabsContent value="billing">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Billing & Subscription
//               </CardTitle>
//               <CardDescription>
//                 Manage your subscription and billing information
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between p-4 border rounded-lg">
//                 <div>
//                   <h3 className="font-semibold">Current Plan</h3>
//                   <p className="text-sm text-muted-foreground">
//                     You are currently on the {settings.subscription?.plan || 'FREE'} plan
//                   </p>
//                 </div>
//                 <Badge variant={settings.subscription?.plan === 'FREE' ? 'secondary' : 'default'}>
//                   {settings.subscription?.plan || 'FREE'}
//                 </Badge>
//               </div>

//               <div className="flex items-center justify-between p-4 border rounded-lg">
//                 <div>
//                   <h3 className="font-semibold">Status</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Your subscription is {settings.subscription?.status || 'ACTIVE'}
//                   </p>
//                 </div>
//                 <Badge variant={settings.subscription?.status === 'ACTIVE' ? 'default' : 'destructive'}>
//                   {settings.subscription?.status || 'ACTIVE'}
//                 </Badge>
//               </div>

//               <div className="space-y-2">
//                 <Button variant="outline" className="w-full">
//                   Manage Billing
//                 </Button>
//                 <Button variant="outline" className="w-full">
//                   Download Invoices
//                 </Button>
//                 <Button variant="outline" className="w-full">
//                   Upgrade Plan
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { getBusinessProfile, updateBusinessProfile, getUserAutomations } from "@/actions/business"
// import { Building2, Globe, MessageSquare, Briefcase, Loader2 } from "lucide-react"

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   platform: string
//   createdAt: Date
// }

// export default function BusinessSetupPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)
//   const [isLoadingProfile, setIsLoadingProfile] = useState(true)
//   const [automationsLoading, setAutomationsLoading] = useState(true)
//   const [automations, setAutomations] = useState<Automation[]>([])
//   const [formData, setFormData] = useState({
//     name: "",
//     businessName: "",
//     businessType: "",
//     businessDescription: "",
//     website: "",
//     responseLanguage: "English",
//     automationId: "",
//   })

//   const businessTypes = [
//     "Restaurant",
//     "Retail Store",
//     "E-commerce",
//     "Professional Services",
//     "Healthcare",
//     "Technology",
//     "Education",
//     "Real Estate",
//     "Manufacturing",
//     "Other",
//   ]

//   const languages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Italian",
//     "Portuguese",
//     "Chinese",
//     "Japanese",
//     "Korean",
//     "Arabic",
//   ]

//   useEffect(() => {
//     const loadBusinessProfile = async () => {
//       try {
//         const result = await getBusinessProfile()
//         if (result.status === 200 && result.data) {
//           const business = result.data
//           setFormData({
//             name: business.name || "",
//             businessName: business.businessName || "",
//             businessType: business.businessType || "",
//             businessDescription: business.businessDescription || "",
//             website: business.website || "",
//             responseLanguage: business.responseLanguage || "English",
//             automationId: business.automationId || "",
//           })
//         }
//       } catch (error) {
//         console.error("Error loading business profile:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load business profile.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoadingProfile(false)
//       }
//     }

//     loadBusinessProfile()
//   }, [toast])

//   // Load user automations on component mount
//   useEffect(() => {
//     const loadAutomations = async () => {
//       try {
//         const result = await getUserAutomations()
//         if (result.status === 200) {
//           setAutomations(result.data)
//           // Auto-select first automation if available and no automation is set
//           if (result.data.length > 0 && !formData.automationId) {
//             setFormData((prev) => ({
//               ...prev,
//               automationId: result.data[0].id,
//             }))
//           }
//         } else {
//           toast({
//             title: "Warning",
//             description: "Could not load your automations. You may need to create one first.",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Error loading automations:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load automations.",
//           variant: "destructive",
//         })
//       } finally {
//         setAutomationsLoading(false)
//       }
//     }

//     loadAutomations()
//   }, [toast, formData.automationId])

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.businessName || !formData.businessType || !formData.businessDescription) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)

//     try {
//       const result = await updateBusinessProfile({
//         name: formData.name,
//         businessName: formData.businessName,
//         businessType: formData.businessType,
//         businessDescription: formData.businessDescription,
//         website: formData.website,
//         responseLanguage: formData.responseLanguage,
//       })

//       if (result.status === 200) {
//         toast({
//           title: "Success!",
//           description: "Your business profile has been updated successfully.",
//         })
//         router.push("/dashboard")
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to update business profile",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Submit error:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoadingProfile) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           <span>Loading business profile...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background p-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
//           <h1 className="text-3xl font-bold text-foreground mb-2">Business Setup</h1>
//           <p className="text-muted-foreground">Update your business information</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Briefcase className="h-5 w-5 text-primary" />
//               Business Information
//             </CardTitle>
//             <CardDescription>Update your business details to personalize your automation experience.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Your Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessName">Business Name *</Label>
//                   <Input
//                     id="businessName"
//                     placeholder="Acme Corporation"
//                     value={formData.businessName}
//                     onChange={(e) => handleInputChange("businessName", e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="businessType">Business Type *</Label>
//                 <Select
//                   value={formData.businessType}
//                   onValueChange={(value) => handleInputChange("businessType", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select your business type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {businessTypes.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="website">Website</Label>
//                 <div className="relative">
//                   <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="website"
//                     placeholder="https://www.example.com"
//                     value={formData.website}
//                     onChange={(e) => handleInputChange("website", e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="responseLanguage">Response Language</Label>
//                 <Select
//                   value={formData.responseLanguage}
//                   onValueChange={(value) => handleInputChange("responseLanguage", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {languages.map((language) => (
//                       <SelectItem key={language} value={language}>
//                         {language}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="businessDescription">Business Description *</Label>
//                 <div className="relative">
//                   <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Textarea
//                     id="businessDescription"
//                     placeholder="Describe your business in detail - what you do, your target audience, your unique value proposition, your products/services, your communication style, and any specific information that would help AI understand your business better for customer interactions..."
//                     value={formData.businessDescription}
//                     onChange={(e) => handleInputChange("businessDescription", e.target.value)}
//                     className="pl-10 min-h-[200px]"
//                     required
//                   />
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Provide a comprehensive description to help AI better understand your business and respond to
//                   customers effectively. Include details about your products/services, target audience, communication
//                   style, and any specific information relevant to customer interactions.
//                 </p>
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     Updating Profile...
//                   </>
//                 ) : (
//                   "Update Business Profile"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { AgentCard } from "../_components/agent/agent-card"
// import { AgentCustomizationModal } from "../_components/agent/agent-customization-model"
// import { agentTemplates, getAgentTypeInfo } from "@/lib/agent-templates"
// import type { AgentTemplate } from "@/types/ai-agents"
// import { Bot, Plus, Search, Sparkles, Zap, Users, MessageSquare } from "lucide-react"

// export default function AIAgentPersonalityPage() {
//   const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
//   const [customizingAgent, setCustomizingAgent] = useState<AgentTemplate | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterType, setFilterType] = useState<string>("all")

//   const filteredAgents = agentTemplates.filter((agent) => {
//     const matchesSearch =
//       agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

//     const matchesType = filterType === "all" || agent.agentType === filterType

//     return matchesSearch && matchesType
//   })

//   const agentTypes = Array.from(new Set(agentTemplates.map((agent) => agent.agentType)))

//   const handleCustomizeAgent = (agent: AgentTemplate) => {
//     setCustomizingAgent({ ...agent })
//   }

//   const handleSaveCustomAgent = (customizedAgent: AgentTemplate) => {
//     // Here you would typically save to your backend
//     console.log("Saving customized agent:", customizedAgent)
//     setSelectedAgent(customizedAgent.id)
//   }

//   return (
//     <div className="min-h-screen bg-background dark">
//       {/* Header */}
//       <div className="border-b border-border bg-card">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="p-3 bg-primary/10 rounded-xl">
//               <Bot className="h-8 w-8 text-primary" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">AI Agent Personalities</h1>
//               <p className="text-muted-foreground mt-1">
//                 Choose or customize an AI assistant to handle your DMs with the perfect personality
//               </p>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Sparkles className="h-8 w-8 text-chart-1" />
//                 <div>
//                   <div className="text-2xl font-bold">{agentTemplates.length}</div>
//                   <div className="text-sm text-muted-foreground">Agent Templates</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Zap className="h-8 w-8 text-chart-2" />
//                 <div>
//                   <div className="text-2xl font-bold">7</div>
//                   <div className="text-sm text-muted-foreground">Personality Traits</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Users className="h-8 w-8 text-chart-3" />
//                 <div>
//                   <div className="text-2xl font-bold">{agentTypes.length}</div>
//                   <div className="text-sm text-muted-foreground">Agent Types</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <MessageSquare className="h-8 w-8 text-chart-4" />
//                 <div>
//                   <div className="text-2xl font-bold">10+</div>
//                   <div className="text-sm text-muted-foreground">Languages</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-8">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search agents by name, description, or tags..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="flex gap-2 flex-wrap">
//             <Button
//               variant={filterType === "all" ? "default" : "outline"}
//               size="sm"
//               onClick={() => setFilterType("all")}
//             >
//               All Types
//             </Button>
//             {agentTypes.map((type) => {
//               const info = getAgentTypeInfo(type)
//               return (
//                 <Button
//                   key={type}
//                   variant={filterType === type ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterType(type)}
//                 >
//                   {info.icon} {info.title}
//                 </Button>
//               )
//             })}
//           </div>
//         </div>

//         {/* Agent Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredAgents.map((agent) => (
//             <AgentCard
//               key={agent.id}
//               agent={agent}
//               isSelected={selectedAgent === agent.id}
//               onSelect={() => setSelectedAgent(agent.id)}
//               onCustomize={() => handleCustomizeAgent(agent)}
//             />
//           ))}
//         </div>

//         {/* Create Custom Agent */}
//         <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
//           <CardContent className="p-8 text-center">
//             <div className="flex flex-col items-center gap-4">
//               <div className="p-4 bg-primary/10 rounded-full">
//                 <Plus className="h-8 w-8 text-primary" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Create Custom Agent</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Build your own AI agent from scratch with custom personality traits and settings
//                 </p>
//                 <Button>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create New Agent
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Selected Agent Summary */}
//         {selectedAgent && (
//           <Card className="mt-8 border-primary/20 bg-primary/5">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bot className="h-5 w-5 text-primary" />
//                 Selected Agent
//               </CardTitle>
//               <CardDescription>Your chosen AI assistant is ready to handle DMs with this personality</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {(() => {
//                 const agent = agentTemplates.find((a) => a.id === selectedAgent)
//                 if (!agent) return null

//                 return (
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
//                         <span className="text-lg font-semibold text-primary">
//                           {agent.name.slice(0, 2).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="font-semibold">{agent.name}</div>
//                         <div className="text-sm text-muted-foreground">{getAgentTypeInfo(agent.agentType).title}</div>
//                       </div>
//                     </div>
//                     <div className="flex-1" />
//                     <Button onClick={() => handleCustomizeAgent(agent)}>Customize Further</Button>
//                   </div>
//                 )
//               })()}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Customization Modal */}
//       <AgentCustomizationModal
//         agent={customizingAgent}
//         isOpen={!!customizingAgent}
//         onClose={() => setCustomizingAgent(null)}
//         onSave={handleSaveCustomAgent}
//       />
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { AgentCard } from "../_components/agent/agent-card"
// import { AgentCustomizationModal } from "../_components/agent/agent-customization-model"
// import { agentTemplates, getAgentTypeInfo } from "@/lib/agent-templates"
// import { getBusinessProfile, updateBusinessProfile, getUserAutomations } from "@/actions/business"
// import { getAIAgents, createAIAgent } from "@/actions/ai-agents"
// import type { AgentTemplate } from "@/types/ai-agents"
// import {
//   Bot,
//   Plus,
//   Search,
//   Sparkles,
//   Zap,
//   Users,
//   MessageSquare,
//   Building2,
//   Globe,
//   Briefcase,
//   Loader2,
// } from "lucide-react"

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   platform: string
//   createdAt: Date
// }

// export default function AIAgentPersonalityPage() {
//   const router = useRouter()
//   const { toast } = useToast()

//   // Business setup state
//   const [isLoading, setIsLoading] = useState(false)
//   const [isLoadingProfile, setIsLoadingProfile] = useState(true)
//   const [automationsLoading, setAutomationsLoading] = useState(true)
//   const [automations, setAutomations] = useState<Automation[]>([])
//   const [formData, setFormData] = useState({
//     name: "",
//     businessName: "",
//     businessType: "",
//     businessDescription: "",
//     website: "",
//     responseLanguage: "English",
//     automationId: "",
//   })

//   // AI Agent state
//   const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
//   const [customizingAgent, setCustomizingAgent] = useState<AgentTemplate | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterType, setFilterType] = useState<string>("all")
//   const [showBusinessSetup, setShowBusinessSetup] = useState(true)
//   const [existingAgents, setExistingAgents] = useState<any[]>([])

//   const businessTypes = [
//     "Restaurant",
//     "Retail Store",
//     "E-commerce",
//     "Professional Services",
//     "Healthcare",
//     "Technology",
//     "Education",
//     "Real Estate",
//     "Manufacturing",
//     "Other",
//   ]

//   const languages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Italian",
//     "Portuguese",
//     "Chinese",
//     "Japanese",
//     "Korean",
//     "Arabic",
//   ]

//   useEffect(() => {
//     const loadBusinessProfile = async () => {
//       try {
//         const result = await getBusinessProfile()
//         if (result.status === 200 && result.data) {
//           const business = result.data
//           setFormData({
//             name: business.name || "",
//             businessName: business.businessName || "",
//             businessType: business.businessType || "",
//             businessDescription: business.businessDescription || "",
//             website: business.website || "",
//             responseLanguage: business.responseLanguage || "English",
//             automationId: business.automationId || "",
//           })
//           // If business profile is complete, show AI agents
//           if (business.businessName && business.businessType && business.businessDescription) {
//             setShowBusinessSetup(false)
//           }
//         }
//       } catch (error) {
//         console.error("Error loading business profile:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load business profile.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoadingProfile(false)
//       }
//     }

//     const loadAutomations = async () => {
//       try {
//         const result = await getUserAutomations()
//         if (result.status === 200) {
//           setAutomations(result.data)
//           if (result.data.length > 0 && !formData.automationId) {
//             setFormData((prev) => ({
//               ...prev,
//               automationId: result.data[0].id,
//             }))
//           }
//         }
//       } catch (error) {
//         console.error("Error loading automations:", error)
//       } finally {
//         setAutomationsLoading(false)
//       }
//     }

//     const loadAgents = async () => {
//       try {
//         const result = await getAIAgents()
//         if (result.status === 200) {
//           setExistingAgents(result.data)
//         }
//       } catch (error) {
//         console.error("Error loading agents:", error)
//       }
//     }

//     loadBusinessProfile()
//     loadAutomations()
//     loadAgents()
//   }, [toast])

//   const filteredAgents = agentTemplates.filter((agent) => {
//     const matchesSearch =
//       agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

//     const matchesType = filterType === "all" || agent.agentType === filterType

//     return matchesSearch && matchesType
//   })

//   const agentTypes = Array.from(new Set(agentTemplates.map((agent) => agent.agentType)))

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleBusinessSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.businessName || !formData.businessType || !formData.businessDescription) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)

//     try {
//       const result = await updateBusinessProfile({
//         name: formData.name,
//         businessName: formData.businessName,
//         businessType: formData.businessType,
//         businessDescription: formData.businessDescription,
//         website: formData.website,
//         responseLanguage: formData.responseLanguage,
//       })

//       if (result.status === 200) {
//         toast({
//           title: "Success!",
//           description: "Your business profile has been updated successfully.",
//         })
//         setShowBusinessSetup(false)
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to update business profile",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Submit error:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCustomizeAgent = (agent: AgentTemplate) => {
//     setCustomizingAgent({ ...agent })
//   }

//   const handleSaveCustomAgent = async (customizedAgent: AgentTemplate) => {
//     try {
//       const result = await createAIAgent({
//         name: customizedAgent.name,
//         description: customizedAgent.description,
//         avatar: customizedAgent.avatar,
//         agentType: customizedAgent.agentType,
//         friendliness: customizedAgent.personality.friendliness,
//         formality: customizedAgent.personality.formality,
//         enthusiasm: customizedAgent.personality.enthusiasm,
//         empathy: customizedAgent.personality.empathy,
//         humor: customizedAgent.personality.humor,
//         patience: customizedAgent.personality.patience,
//         expertise: customizedAgent.personality.expertise,
//         primaryLanguage: customizedAgent.languageSettings.primaryLanguage,
//         detectLanguage: customizedAgent.languageSettings.detectLanguage,
//         supportedLanguages: customizedAgent.languageSettings.supportedLanguages,
//         responseStyle: customizedAgent.languageSettings.responseStyle,
//         isCustom: true,
//       })

//       if (result.status === 201) {
//         toast({
//           title: "Success!",
//           description: "Your AI agent has been created successfully.",
//         })
//         setSelectedAgent(result.data?.id || null)
//         // Reload agents
//         const agentsResult = await getAIAgents()
//         if (agentsResult.status === 200) {
//           setExistingAgents(agentsResult.data)
//         }
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to create AI agent",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error saving agent:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateNewAgent = () => {
//     const newAgent: AgentTemplate = {
//       id: `custom-${Date.now()}`,
//       name: "Laura",
//       description: "A custom AI agent tailored to your needs",
//       avatar: "/professional-ai-assistant.jpg",
//       agentType: "general-assistant",
//       tags: ["custom", "personalized"],
//       personality: {
//         friendliness: 7,
//         formality: 5,
//         enthusiasm: 6,
//         empathy: 7,
//         humor: 4,
//         patience: 8,
//         expertise: 6,
//       },
//       languageSettings: {
//         primaryLanguage: formData.responseLanguage || "English",
//         detectLanguage: true,
//         supportedLanguages: ["English"],
//         responseStyle: "professional",
//       },
//       introductoryStatement: `Hi, I'm your AI assistant from ${formData.businessName || "our company"}. How can I help you today?`,
//       tone: "professional",
//     }
//     setCustomizingAgent(newAgent)
//   }

//   if (isLoadingProfile) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           <span>Loading business profile...</span>
//         </div>
//       </div>
//     )
//   }

//   if (showBusinessSetup) {
//     return (
//       <div className="min-h-screen bg-background p-4">
//         <div className="max-w-2xl mx-auto">
//           <div className="text-center mb-8">
//             <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
//             <h1 className="text-3xl font-bold text-foreground mb-2">Business Setup</h1>
//             <p className="text-muted-foreground">Set up your business information before creating AI agents</p>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Briefcase className="h-5 w-5 text-primary" />
//                 Business Information
//               </CardTitle>
//               <CardDescription>Update your business details to personalize your AI agents.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleBusinessSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Your Name</Label>
//                     <Input
//                       id="name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange("name", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessName">Business Name *</Label>
//                     <Input
//                       id="businessName"
//                       placeholder="Acme Corporation"
//                       value={formData.businessName}
//                       onChange={(e) => handleInputChange("businessName", e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessType">Business Type *</Label>
//                   <Select
//                     value={formData.businessType}
//                     onValueChange={(value) => handleInputChange("businessType", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select your business type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {businessTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="website">Website</Label>
//                   <div className="relative">
//                     <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="website"
//                       placeholder="https://www.example.com"
//                       value={formData.website}
//                       onChange={(e) => handleInputChange("website", e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="responseLanguage">Response Language</Label>
//                   <Select
//                     value={formData.responseLanguage}
//                     onValueChange={(value) => handleInputChange("responseLanguage", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {languages.map((language) => (
//                         <SelectItem key={language} value={language}>
//                           {language}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessDescription">Business Description *</Label>
//                   <div className="relative">
//                     <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Textarea
//                       id="businessDescription"
//                       placeholder="Describe your business in detail - what you do, your target audience, your unique value proposition, your products/services, your communication style, and any specific information that would help AI understand your business better for customer interactions..."
//                       value={formData.businessDescription}
//                       onChange={(e) => handleInputChange("businessDescription", e.target.value)}
//                       className="pl-10 min-h-[200px]"
//                       required
//                     />
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     Provide a comprehensive description to help AI better understand your business and respond to
//                     customers effectively.
//                   </p>
//                 </div>

//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       Updating Profile...
//                     </>
//                   ) : (
//                     "Continue to AI Agent Setup"
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background dark">
//       {/* Header */}
//       <div className="border-b border-border bg-card">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-primary/10 rounded-xl">
//                 <Bot className="h-8 w-8 text-primary" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground">AI Agent Personalities</h1>
//                 <p className="text-muted-foreground mt-1">
//                   Choose or customize an AI assistant for {formData.businessName} to handle your DMs
//                 </p>
//               </div>
//             </div>
//             <Button variant="outline" onClick={() => setShowBusinessSetup(true)}>
//               <Building2 className="h-4 w-4 mr-2" />
//               Edit Business Info
//             </Button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Sparkles className="h-8 w-8 text-chart-1" />
//                 <div>
//                   <div className="text-2xl font-bold">{agentTemplates.length}</div>
//                   <div className="text-sm text-muted-foreground">Agent Templates</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Zap className="h-8 w-8 text-chart-2" />
//                 <div>
//                   <div className="text-2xl font-bold">7</div>
//                   <div className="text-sm text-muted-foreground">Personality Traits</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Users className="h-8 w-8 text-chart-3" />
//                 <div>
//                   <div className="text-2xl font-bold">{existingAgents.length}</div>
//                   <div className="text-sm text-muted-foreground">Your Agents</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <MessageSquare className="h-8 w-8 text-chart-4" />
//                 <div>
//                   <div className="text-2xl font-bold">10+</div>
//                   <div className="text-sm text-muted-foreground">Languages</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-8">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search agents by name, description, or tags..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="flex gap-2 flex-wrap">
//             <Button
//               variant={filterType === "all" ? "default" : "outline"}
//               size="sm"
//               onClick={() => setFilterType("all")}
//             >
//               All Types
//             </Button>
//             {agentTypes.map((type) => {
//               const info = getAgentTypeInfo(type)
//               return (
//                 <Button
//                   key={type}
//                   variant={filterType === type ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterType(type)}
//                 >
//                   {info.icon} {info.title}
//                 </Button>
//               )
//             })}
//           </div>
//         </div>

//         {/* Agent Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredAgents.map((agent) => (
//             <AgentCard
//               key={agent.id}
//               agent={agent}
//               isSelected={selectedAgent === agent.id}
//               onSelect={() => setSelectedAgent(agent.id)}
//               onCustomize={() => handleCustomizeAgent(agent)}
//             />
//           ))}
//         </div>

//         {/* Create Custom Agent */}
//         <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
//           <CardContent className="p-8 text-center">
//             <div className="flex flex-col items-center gap-4">
//               <div className="p-4 bg-primary/10 rounded-full">
//                 <Plus className="h-8 w-8 text-primary" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Create Custom Agent</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Build your own AI agent from scratch with custom personality traits and settings
//                 </p>
//                 <Button onClick={handleCreateNewAgent}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create New Agent
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Selected Agent Summary */}
//         {selectedAgent && (
//           <Card className="mt-8 border-primary/20 bg-primary/5">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bot className="h-5 w-5 text-primary" />
//                 Selected Agent
//               </CardTitle>
//               <CardDescription>Your chosen AI assistant is ready to handle DMs with this personality</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {(() => {
//                 const agent =
//                   agentTemplates.find((a) => a.id === selectedAgent) ||
//                   existingAgents.find((a) => a.id === selectedAgent)
//                 if (!agent) return null

//                 return (
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
//                         <span className="text-lg font-semibold text-primary">
//                           {agent.name.slice(0, 2).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="font-semibold">{agent.name}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {getAgentTypeInfo(agent.agentType || agent.agent_type)?.title || "AI Assistant"}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1" />
//                     <Button onClick={() => handleCustomizeAgent(agent)}>Customize Further</Button>
//                   </div>
//                 )
//               })()}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Customization Modal */}
//       <AgentCustomizationModal
//         agent={customizingAgent}
//         isOpen={!!customizingAgent}
//         onClose={() => setCustomizingAgent(null)}
//         onSave={handleSaveCustomAgent}
//         businessName={formData.businessName}
//       />
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { AgentCard } from "../_components/agent/agent-card"
// import { AgentCustomizationModal } from "../_components/agent/agent-customization-model"
// import { agentTemplates, getAgentTypeInfo } from "@/lib/agent-templates"
// import { getBusinessProfile, updateBusinessProfile, getUserAutomations } from "@/actions/business"
// import { getAIAgents, createAIAgent } from "@/actions/ai-agents"
// import type { AgentTemplate } from "@/types/ai-agents"
// import { AgentDashboard } from "../_components/agent/agent-dashboard"
// import {
//   Bot,
//   Plus,
//   Search,
//   Sparkles,
//   Zap,
//   Users,
//   MessageSquare,
//   Building2,
//   Globe,
//   Briefcase,
//   Loader2,
// } from "lucide-react"

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   platform: string
//   createdAt: Date
// }

// export default function AIAgentPersonalityPage() {
//   const router = useRouter()
//   const { toast } = useToast()

//   // Business setup state
//   const [isLoading, setIsLoading] = useState(false)
//   const [isLoadingProfile, setIsLoadingProfile] = useState(true)
//   const [automationsLoading, setAutomationsLoading] = useState(true)
//   const [automations, setAutomations] = useState<Automation[]>([])
//   const [formData, setFormData] = useState({
//     name: "",
//     businessName: "",
//     businessType: "",
//     businessDescription: "",
//     website: "",
//     responseLanguage: "English",
//     automationId: "",
//   })

//   // AI Agent state
//   const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
//   const [customizingAgent, setCustomizingAgent] = useState<AgentTemplate | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterType, setFilterType] = useState<string>("all")
//   const [showBusinessSetup, setShowBusinessSetup] = useState(true)
//   const [existingAgents, setExistingAgents] = useState<any[]>([])
//   const [showDashboard, setShowDashboard] = useState(false)

//   const businessTypes = [
//     "Restaurant",
//     "Retail Store",
//     "E-commerce",
//     "Professional Services",
//     "Healthcare",
//     "Technology",
//     "Education",
//     "Real Estate",
//     "Manufacturing",
//     "Other",
//   ]

//   const languages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Italian",
//     "Portuguese",
//     "Chinese",
//     "Japanese",
//     "Korean",
//     "Arabic",
//   ]

//   useEffect(() => {
//     const loadBusinessProfile = async () => {
//       try {
//         const result = await getBusinessProfile()
//         if (result.status === 200 && result.data) {
//           const business = result.data
//           setFormData({
//             name: business.name || "",
//             businessName: business.businessName || "",
//             businessType: business.businessType || "",
//             businessDescription: business.businessDescription || "",
//             website: business.website || "",
//             responseLanguage: business.responseLanguage || "English",
//             automationId: business.automationId || "",
//           })
//           // If business profile is complete, show AI agents
//           if (business.businessName && business.businessType && business.businessDescription) {
//             setShowBusinessSetup(false)
//           }
//         }
//       } catch (error) {
//         console.error("Error loading business profile:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load business profile.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoadingProfile(false)
//       }
//     }

//     const loadAutomations = async () => {
//       try {
//         const result = await getUserAutomations()
//         if (result.status === 200) {
//           setAutomations(result.data)
//           if (result.data.length > 0 && !formData.automationId) {
//             setFormData((prev) => ({
//               ...prev,
//               automationId: result.data[0].id,
//             }))
//           }
//         }
//       } catch (error) {
//         console.error("Error loading automations:", error)
//       } finally {
//         setAutomationsLoading(false)
//       }
//     }

//     const loadAgents = async () => {
//       try {
//         const result = await getAIAgents()
//         if (result.status === 200) {
//           setExistingAgents(result.data)
//         }
//       } catch (error) {
//         console.error("Error loading agents:", error)
//       }
//     }

//     loadBusinessProfile()
//     loadAutomations()
//     loadAgents()
//   }, [toast])

//   const filteredAgents = agentTemplates.filter((agent) => {
//     const matchesSearch =
//       agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

//     const matchesType = filterType === "all" || agent.agentType === filterType

//     return matchesSearch && matchesType
//   })

//   const agentTypes = Array.from(new Set(agentTemplates.map((agent) => agent.agentType)))

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleBusinessSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.businessName || !formData.businessType || !formData.businessDescription) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)

//     try {
//       const result = await updateBusinessProfile({
//         name: formData.name,
//         businessName: formData.businessName,
//         businessType: formData.businessType,
//         businessDescription: formData.businessDescription,
//         website: formData.website,
//         responseLanguage: formData.responseLanguage,
//       })

//       if (result.status === 200) {
//         toast({
//           title: "Success!",
//           description: "Your business profile has been updated successfully.",
//         })
//         setShowBusinessSetup(false)
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to update business profile",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Submit error:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCustomizeAgent = (agent: AgentTemplate) => {
//     setCustomizingAgent({ ...agent })
//   }

//   const handleSaveCustomAgent = async (customizedAgent: AgentTemplate) => {
//     try {
//       const result = await createAIAgent({
//         name: customizedAgent.name,
//         description: customizedAgent.description,
//         avatar: customizedAgent.avatar,
//         agentType: customizedAgent.agentType,
//         friendliness: customizedAgent.personality.friendliness,
//         formality: customizedAgent.personality.formality,
//         enthusiasm: customizedAgent.personality.enthusiasm,
//         empathy: customizedAgent.personality.empathy,
//         humor: customizedAgent.personality.humor,
//         patience: customizedAgent.personality.patience,
//         expertise: customizedAgent.personality.expertise,
//         primaryLanguage: customizedAgent.languageSettings.primaryLanguage,
//         detectLanguage: customizedAgent.languageSettings.detectLanguage,
//         supportedLanguages: customizedAgent.languageSettings.supportedLanguages,
//         responseStyle: customizedAgent.languageSettings.responseStyle,
//         isCustom: true,
//         introductoryStatement: customizedAgent.introductoryStatement,
//         tone: customizedAgent.tone,
//       })

//       if (result.status === 201) {
//         toast({
//           title: "Success!",
//           description: "Your AI agent has been created successfully.",
//         })
//         setSelectedAgent(result.data?.id || null)
//         setShowDashboard(true)
//         const agentsResult = await getAIAgents()
//         if (agentsResult.status === 200) {
//           setExistingAgents(agentsResult.data)
//         }
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to create AI agent",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error saving agent:", error)
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateNewAgent = () => {
//     const newAgent: AgentTemplate = {
//       id: `custom-${Date.now()}`,
//       name: "Custom Agent",
//       description: "A custom AI agent tailored to your needs",
//       avatar: "/professional-ai-assistant.jpg",
//       agentType: "general-assistant",
//       tags: ["custom", "personalized"],
//       personality: {
//         friendliness: 7,
//         formality: 5,
//         enthusiasm: 6,
//         empathy: 7,
//         humor: 4,
//         patience: 8,
//         expertise: 6,
//       },
//       languageSettings: {
//         primaryLanguage: formData.responseLanguage || "English",
//         detectLanguage: true,
//         supportedLanguages: ["English"],
//         responseStyle: "professional",
//       },
//       introductoryStatement: `Hi, I'm your AI assistant from ${formData.businessName || "our company"}. How can I help you today?`,
//       tone: "professional",
//     }
//     setCustomizingAgent(newAgent)
//   }

//   if (isLoadingProfile) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           <span>Loading business profile...</span>
//         </div>
//       </div>
//     )
//   }

//   if (showDashboard) {
//     return <AgentDashboard onEdit={() => setShowDashboard(false)} />
//   }

//   if (showBusinessSetup) {
//     return (
//       <div className="min-h-screen bg-background p-4">
//         <div className="max-w-2xl mx-auto">
//           <div className="text-center mb-8">
//             <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
//             <h1 className="text-3xl font-bold text-foreground mb-2">Business Setup</h1>
//             <p className="text-muted-foreground">Set up your business information before creating AI agents</p>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Briefcase className="h-5 w-5 text-primary" />
//                 Business Information
//               </CardTitle>
//               <CardDescription>Update your business details to personalize your AI agents.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleBusinessSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Your Name</Label>
//                     <Input
//                       id="name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange("name", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessName">Business Name *</Label>
//                     <Input
//                       id="businessName"
//                       placeholder="Acme Corporation"
//                       value={formData.businessName}
//                       onChange={(e) => handleInputChange("businessName", e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessType">Business Type *</Label>
//                   <Select
//                     value={formData.businessType}
//                     onValueChange={(value) => handleInputChange("businessType", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select your business type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {businessTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="website">Website</Label>
//                   <div className="relative">
//                     <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="website"
//                       placeholder="https://www.example.com"
//                       value={formData.website}
//                       onChange={(e) => handleInputChange("website", e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="responseLanguage">Response Language</Label>
//                   <Select
//                     value={formData.responseLanguage}
//                     onValueChange={(value) => handleInputChange("responseLanguage", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {languages.map((language) => (
//                         <SelectItem key={language} value={language}>
//                           {language}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessDescription">Business Description *</Label>
//                   <div className="relative">
//                     <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Textarea
//                       id="businessDescription"
//                       placeholder="Describe your business in detail - what you do, your target audience, your unique value proposition, your products/services, your communication style, and any specific information that would help AI understand your business better for customer interactions..."
//                       value={formData.businessDescription}
//                       onChange={(e) => handleInputChange("businessDescription", e.target.value)}
//                       className="pl-10 min-h-[200px]"
//                       required
//                     />
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     Provide a comprehensive description to help AI better understand your business and respond to
//                     customers effectively.
//                   </p>
//                 </div>

//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       Updating Profile...
//                     </>
//                   ) : (
//                     "Continue to AI Agent Setup"
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background dark">
//       {/* Header */}
//       <div className="border-b border-border bg-card">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-primary/10 rounded-xl">
//                 <Bot className="h-8 w-8 text-primary" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground">AI Agent Personalities</h1>
//                 <p className="text-muted-foreground mt-1">
//                   Choose or customize an AI assistant for {formData.businessName} to handle your DMs
//                 </p>
//               </div>
//             </div>
//             <Button variant="outline" onClick={() => setShowBusinessSetup(true)}>
//               <Building2 className="h-4 w-4 mr-2" />
//               Edit Business Info
//             </Button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Sparkles className="h-8 w-8 text-chart-1" />
//                 <div>
//                   <div className="text-2xl font-bold">{agentTemplates.length}</div>
//                   <div className="text-sm text-muted-foreground">Agent Templates</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Zap className="h-8 w-8 text-chart-2" />
//                 <div>
//                   <div className="text-2xl font-bold">7</div>
//                   <div className="text-sm text-muted-foreground">Personality Traits</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <Users className="h-8 w-8 text-chart-3" />
//                 <div>
//                   <div className="text-2xl font-bold">{existingAgents.length}</div>
//                   <div className="text-sm text-muted-foreground">Your Agents</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <MessageSquare className="h-8 w-8 text-chart-4" />
//                 <div>
//                   <div className="text-2xl font-bold">10+</div>
//                   <div className="text-sm text-muted-foreground">Languages</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-8">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search agents by name, description, or tags..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="flex gap-2 flex-wrap">
//             <Button
//               variant={filterType === "all" ? "default" : "outline"}
//               size="sm"
//               onClick={() => setFilterType("all")}
//             >
//               All Types
//             </Button>
//             {agentTypes.map((type) => {
//               const info = getAgentTypeInfo(type)
//               return (
//                 <Button
//                   key={type}
//                   variant={filterType === type ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterType(type)}
//                 >
//                   {info.icon} {info.title}
//                 </Button>
//               )
//             })}
//           </div>
//         </div>

//         {/* Agent Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredAgents.map((agent) => (
//             <AgentCard
//               key={agent.id}
//               agent={agent}
//               isSelected={selectedAgent === agent.id}
//               onSelect={() => setSelectedAgent(agent.id)}
//               onCustomize={() => handleCustomizeAgent(agent)}
//             />
//           ))}
//         </div>

//         {/* Create Custom Agent */}
//         <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
//           <CardContent className="p-8 text-center">
//             <div className="flex flex-col items-center gap-4">
//               <div className="p-4 bg-primary/10 rounded-full">
//                 <Plus className="h-8 w-8 text-primary" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Create Custom Agent</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Build your own AI agent from scratch with custom personality traits and settings
//                 </p>
//                 <Button onClick={handleCreateNewAgent}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create New Agent
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Selected Agent Summary */}
//         {selectedAgent && (
//           <Card className="mt-8 border-primary/20 bg-primary/5">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bot className="h-5 w-5 text-primary" />
//                 Selected Agent
//               </CardTitle>
//               <CardDescription>Your chosen AI assistant is ready to handle DMs with this personality</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {(() => {
//                 const agent =
//                   agentTemplates.find((a) => a.id === selectedAgent) ||
//                   existingAgents.find((a) => a.id === selectedAgent)
//                 if (!agent) return null

//                 return (
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
//                         <span className="text-lg font-semibold text-primary">
//                           {agent.name.slice(0, 2).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="font-semibold">{agent.name}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {getAgentTypeInfo(agent.agentType || agent.agent_type)?.title || "AI Assistant"}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1" />
//                     <Button onClick={() => handleCustomizeAgent(agent)}>Customize Further</Button>
//                   </div>
//                 )
//               })()}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Customization Modal */}
//       <AgentCustomizationModal
//         agent={customizingAgent}
//         isOpen={!!customizingAgent}
//         onClose={() => setCustomizingAgent(null)}
//         onSave={handleSaveCustomAgent}
//         businessName={formData.businessName}
//       />
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AgentCard } from "../_components/agent/agent-card"
import { AgentCustomizationModal } from "../_components/agent/agent-customization-model"
import { agentTemplates, getAgentTypeInfo } from "@/lib/agent-templates"
import { getBusinessProfile, updateBusinessProfile, getUserAutomations } from "@/actions/business"
import { getAIAgents, createAIAgent } from "@/actions/ai-agents"
import type { AgentTemplate } from "@/types/ai-agents"
import { AgentDashboard } from "../_components/agent/agent-dashboard"
import {
  Bot,
  Plus,
  Search,
  Sparkles,
  Zap,
  Users,
  MessageSquare,
  Building2,
  Globe,
  Briefcase,
  Loader2,
} from "lucide-react"

interface Automation {
  id: string
  name: string
  active: boolean
  platform: string
  createdAt: Date
}

export default function AIAgentPersonalityPage() {
  
  const { toast } = useToast()

  // Business setup state
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [automationsLoading, setAutomationsLoading] = useState(true)
  const [automations, setAutomations] = useState<Automation[]>([])
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessType: "",
    businessDescription: "",
    website: "",
    responseLanguage: "English",
    automationId: "",
  })

  // AI Agent state
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [customizingAgent, setCustomizingAgent] = useState<AgentTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [showBusinessSetup, setShowBusinessSetup] = useState(true)
  const [existingAgents, setExistingAgents] = useState<any[]>([])
  const [showDashboard, setShowDashboard] = useState(false)
  const [hasActiveAgent, setHasActiveAgent] = useState(false)

  const businessTypes = [
    "Restaurant",
    "Retail Store",
    "E-commerce",
    "Professional Services",
    "Healthcare",
    "Technology",
    "Education",
    "Real Estate",
    "Manufacturing",
    "Other",
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ]

  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        const result = await getBusinessProfile()
        if (result.status === 200 && result.data) {
          const business = result.data
          setFormData({
            name: business.name || "",
            businessName: business.businessName || "",
            businessType: business.businessType || "",
            businessDescription: business.businessDescription || "",
            website: business.website || "",
            responseLanguage: business.responseLanguage || "English",
            automationId: business.automationId || "",
          })
          // If business profile is complete, check for agents
          if (business.businessName && business.businessType && business.businessDescription) {
            setShowBusinessSetup(false)
          }
        }
      } catch (error) {
        console.error("Error loading business profile:", error)
        toast({
          title: "Error",
          description: "Failed to load business profile.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    const loadAutomations = async () => {
      try {
        const result = await getUserAutomations()
        if (result.status === 200) {
          setAutomations(result.data)
          if (result.data.length > 0 && !formData.automationId) {
            setFormData((prev) => ({
              ...prev,
              automationId: result.data[0].id,
            }))
          }
        }
      } catch (error) {
        console.error("Error loading automations:", error)
      } finally {
        setAutomationsLoading(false)
      }
    }

    const loadAgents = async () => {
      try {
        const result = await getAIAgents()
        if (result.status === 200) {
          setExistingAgents(result.data)
          const activeAgent = result.data.find((agent: any) => agent.isActive)
          if (activeAgent) {
            setHasActiveAgent(true)
            setShowDashboard(true)
            setShowBusinessSetup(false)
          }
        }
      } catch (error) {
        console.error("Error loading agents:", error)
      }
    }

    loadBusinessProfile()
    loadAutomations()
    loadAgents()
  }, [toast])

  const filteredAgents = agentTemplates.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = filterType === "all" || agent.agentType === filterType

    return matchesSearch && matchesType
  })

  const agentTypes = Array.from(new Set(agentTemplates.map((agent) => agent.agentType)))

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.businessName || !formData.businessType || !formData.businessDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await updateBusinessProfile({
        name: formData.name,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription,
        website: formData.website,
        responseLanguage: formData.responseLanguage,
      })

      if (result.status === 200) {
        toast({
          title: "Success!",
          description: "Your business profile has been updated successfully.",
        })
        setShowBusinessSetup(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update business profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomizeAgent = (agent: AgentTemplate) => {
    setCustomizingAgent({ ...agent })
  }

  const handleSaveCustomAgent = async (customizedAgent: AgentTemplate) => {
    try {
      const result = await createAIAgent({
        name: customizedAgent.name,
        description: customizedAgent.description,
        avatar: customizedAgent.avatar,
        agentType: customizedAgent.agentType,
        friendliness: customizedAgent.personality.friendliness,
        formality: customizedAgent.personality.formality,
        enthusiasm: customizedAgent.personality.enthusiasm,
        empathy: customizedAgent.personality.empathy,
        humor: customizedAgent.personality.humor,
        patience: customizedAgent.personality.patience,
        expertise: customizedAgent.personality.expertise,
        primaryLanguage: customizedAgent.languageSettings.primaryLanguage,
        detectLanguage: customizedAgent.languageSettings.detectLanguage,
        supportedLanguages: customizedAgent.languageSettings.supportedLanguages,
        responseStyle: customizedAgent.languageSettings.responseStyle,
        isCustom: true,
        introductoryStatement: customizedAgent.introductoryStatement,
        tone: customizedAgent.tone,
      })

      if (result.status === 201) {
        toast({
          title: "Success!",
          description: "Your AI agent has been created successfully.",
        })
        setSelectedAgent(result.data?.id || null)
        setHasActiveAgent(true)
        setShowDashboard(true)
        const agentsResult = await getAIAgents()
        if (agentsResult.status === 200) {
          setExistingAgents(agentsResult.data)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create AI agent",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving agent:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewAgent = () => {
    const newAgent: AgentTemplate = {
      id: `custom-${Date.now()}`,
      name: "Custom Agent",
      description: "A custom AI agent tailored to your needs",
      avatar: "/professional-ai-assistant.jpg",
      agentType: "general-assistant",
      tags: ["custom", "personalized"],
      personality: {
        friendliness: 7,
        formality: 5,
        enthusiasm: 6,
        empathy: 7,
        humor: 4,
        patience: 8,
        expertise: 6,
      },
      languageSettings: {
        primaryLanguage: formData.responseLanguage || "English",
        detectLanguage: true,
        supportedLanguages: ["English"],
        responseStyle: "professional",
      },
      introductoryStatement: `Hi, I'm your AI assistant from ${formData.businessName || "our company"}. How can I help you today?`,
      tone: "professional",
    }
    setCustomizingAgent(newAgent)
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading business profile...</span>
        </div>
      </div>
    )
  }

  if (showDashboard && hasActiveAgent) {
    return (
      <AgentDashboard
        onEdit={() => {
          setShowDashboard(false)
          setHasActiveAgent(false)
        }}
      />
    )
  }

  if (showBusinessSetup) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Business Setup</h1>
            <p className="text-muted-foreground">Set up your business information before creating AI agents</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Business Information
              </CardTitle>
              <CardDescription>Update your business details to personalize your AI agents.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Acme Corporation"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleInputChange("businessType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      placeholder="https://www.example.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responseLanguage">Response Language</Label>
                  <Select
                    value={formData.responseLanguage}
                    onValueChange={(value) => handleInputChange("responseLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="businessDescription"
                      placeholder="Describe your business in detail - what you do, your target audience, your unique value proposition, your products/services, your communication style, and any specific information that would help AI understand your business better for customer interactions..."
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                      className="pl-10 min-h-[200px]"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Provide a comprehensive description to help AI better understand your business and respond to
                    customers effectively.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating Profile...
                    </>
                  ) : (
                    "Continue to AI Agent Setup"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Agent Personalities</h1>
                <p className="text-muted-foreground mt-1">
                  Choose or customize an AI assistant for {formData.businessName} to handle your DMs
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowBusinessSetup(true)}>
              <Building2 className="h-4 w-4 mr-2" />
              Edit Business Info
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-chart-1" />
                <div>
                  <div className="text-2xl font-bold">{agentTemplates.length}</div>
                  <div className="text-sm text-muted-foreground">Agent Templates</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Zap className="h-8 w-8 text-chart-2" />
                <div>
                  <div className="text-2xl font-bold">7</div>
                  <div className="text-sm text-muted-foreground">Personality Traits</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-8 w-8 text-chart-3" />
                <div>
                  <div className="text-2xl font-bold">{existingAgents.length}</div>
                  <div className="text-sm text-muted-foreground">Your Agents</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-chart-4" />
                <div>
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All Types
            </Button>
            {agentTypes.map((type) => {
              const info = getAgentTypeInfo(type)
              return (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                >
                  {info.icon} {info.title}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent === agent.id}
              onSelect={() => setSelectedAgent(agent.id)}
              onCustomize={() => handleCustomizeAgent(agent)}
            />
          ))}
        </div>

        {/* Create Custom Agent */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Create Custom Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Build your own AI agent from scratch with custom personality traits and settings
                </p>
                <Button onClick={handleCreateNewAgent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Agent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Agent Summary */}
        {selectedAgent && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Selected Agent
              </CardTitle>
              <CardDescription>Your chosen AI assistant is ready to handle DMs with this personality</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const agent =
                  agentTemplates.find((a) => a.id === selectedAgent) ||
                  existingAgents.find((a) => a.id === selectedAgent)
                if (!agent) return null

                return (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {agent.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {getAgentTypeInfo(agent.agentType || agent.agent_type)?.title || "AI Assistant"}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
                    <Button onClick={() => handleCustomizeAgent(agent)}>Customize Further</Button>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customization Modal */}
      <AgentCustomizationModal
        agent={customizingAgent}
        isOpen={!!customizingAgent}
        onClose={() => setCustomizingAgent(null)}
        onSave={handleSaveCustomAgent}
        businessName={formData.businessName}
      />
    </div>
  )
}
