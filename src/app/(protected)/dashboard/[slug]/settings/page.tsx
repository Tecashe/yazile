'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Clock, 
  MessageSquare, 
  Zap,
  Building,
  Globe,
  Palette,
  Save,
  Loader2
} from 'lucide-react'
import { 
  updateUserProfile,
  updateUserPreferences,
  updateBusinessHours,
  updateHandoffSettings,
  updateCrmSyncSettings,
  getUserSettings
} from '@/actions/settings'

interface UserSettings {
  profile: {
    firstname: string | null
    lastname: string | null
    email: string
    phone: string | null
    phoneVerified: boolean
  }
  preferences: {
    soundEnabled: boolean
    desktopNotifications: boolean
    emailNotifications: boolean
    autoMarkAsRead: boolean
    theme: string
    language: string
  } | null
  businessHours: {
    timezone: string
    mondayStart: string | null
    mondayEnd: string | null
    tuesdayStart: string | null
    tuesdayEnd: string | null
    wednesdayStart: string | null
    wednesdayEnd: string | null
    thursdayStart: string | null
    thursdayEnd: string | null
    fridayStart: string | null
    fridayEnd: string | null
    saturdayStart: string | null
    saturdayEnd: string | null
    sundayStart: string | null
    sundayEnd: string | null
    isActive: boolean
  } | null
  handoffSettings: {
    isEnabled: boolean
    notificationEmail: string | null
    slackChannel: string | null
    defaultPriority: string
    businessHoursOnly: boolean
    autoAssign: boolean
    maxWaitTime: number
  } | null
  crmSyncSettings: {
    autoSyncQualified: boolean
    createDealsHighValue: boolean
    syncLeadScores: boolean
    realTimeSync: boolean
  } | null
  subscription: {
    plan: string
    status: string
  } | null
}

export default function SettingsPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    async function loadSettings() {
      if (!user) return
      
      try {
        const userSettings = await getUserSettings()
        setSettings(userSettings)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [user])

  const handleSaveProfile = async (formData: FormData) => {
    setSaving(true)
    try {
      await updateUserProfile(formData)
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async (formData: FormData) => {
    setSaving(true)
    try {
      await updateUserPreferences(formData)
      toast({
        title: "Success",
        description: "Preferences updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBusinessHours = async (formData: FormData) => {
    setSaving(true)
    try {
      await updateBusinessHours(formData)
      toast({
        title: "Success",
        description: "Business hours updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business hours",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveHandoffSettings = async (formData: FormData) => {
    setSaving(true)
    try {
      await updateHandoffSettings(formData)
      toast({
        title: "Success",
        description: "Handoff settings updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update handoff settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCrmSync = async (formData: FormData) => {
    setSaving(true)
    try {
      await updateCrmSyncSettings(formData)
      toast({
        title: "Success",
        description: "CRM sync settings updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update CRM sync settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <Card>
          <CardContent className="p-6">
            <p>Failed to load settings. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="handoff" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Handoff
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            CRM Sync
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">First Name</Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      defaultValue={settings.profile.firstname || ''}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      defaultValue={settings.profile.lastname || ''}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={settings.profile.email}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={settings.profile.phone || ''}
                      placeholder="Enter your phone number"
                    />
                    {settings.profile.phoneVerified && (
                      <Badge variant="secondary" className="self-center">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSavePreferences} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for new messages and alerts
                      </p>
                    </div>
                    <Switch
                      name="soundEnabled"
                      defaultChecked={settings.preferences?.soundEnabled ?? true}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Desktop Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show desktop notifications for important events
                      </p>
                    </div>
                    <Switch
                      name="desktopNotifications"
                      defaultChecked={settings.preferences?.desktopNotifications ?? true}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for leads and automations
                      </p>
                    </div>
                    <Switch
                      name="emailNotifications"
                      defaultChecked={settings.preferences?.emailNotifications ?? false}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Mark as Read</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically mark messages as read when viewed
                      </p>
                    </div>
                    <Switch
                      name="autoMarkAsRead"
                      defaultChecked={settings.preferences?.autoMarkAsRead ?? false}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select name="theme" defaultValue={settings.preferences?.theme ?? 'system'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select name="language" defaultValue={settings.preferences?.language ?? 'en'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
              <CardDescription>
                Set your business hours for automated responses and handoffs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveBusinessHours} className="space-y-6">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select name="timezone" defaultValue={settings.businessHours?.timezone ?? 'UTC'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const dayLower = day.toLowerCase()
                    const startField = `${dayLower}Start` as keyof typeof settings.businessHours
                    const endField = `${dayLower}End` as keyof typeof settings.businessHours
                    
                    return (
                      <div key={day} className="grid grid-cols-3 gap-4 items-center">
                        <Label>{day}</Label>
                        <Input
                          name={startField}
                          type="time"
                          defaultValue={settings.businessHours?.[startField] || ''}
                          placeholder="Start time"
                        />
                        <Input
                          name={endField}
                          type="time"
                          defaultValue={settings.businessHours?.[endField] || ''}
                          placeholder="End time"
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Business Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Use business hours to control when automations are active
                    </p>
                  </div>
                  <Switch
                    name="isActive"
                    defaultChecked={settings.businessHours?.isActive ?? true}
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Business Hours
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Human Handoff Settings */}
        <TabsContent value="handoff">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Human Handoff Settings
              </CardTitle>
              <CardDescription>
                Configure when and how conversations are handed off to human agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveHandoffSettings} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Human Handoff</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow conversations to be transferred to human agents
                    </p>
                  </div>
                  <Switch
                    name="isEnabled"
                    defaultChecked={settings.handoffSettings?.isEnabled ?? true}
                  />
                </div>

                <div>
                  <Label htmlFor="notificationEmail">Notification Email</Label>
                  <Input
                    id="notificationEmail"
                    name="notificationEmail"
                    type="email"
                    defaultValue={settings.handoffSettings?.notificationEmail || ''}
                    placeholder="Enter email for handoff notifications"
                  />
                </div>

                <div>
                  <Label htmlFor="slackChannel">Slack Channel</Label>
                  <Input
                    id="slackChannel"
                    name="slackChannel"
                    defaultValue={settings.handoffSettings?.slackChannel || ''}
                    placeholder="#customer-support"
                  />
                </div>

                <div>
                  <Label htmlFor="defaultPriority">Default Priority</Label>
                  <Select name="defaultPriority" defaultValue={settings.handoffSettings?.defaultPriority ?? 'MEDIUM'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxWaitTime">Max Wait Time (seconds)</Label>
                  <Input
                    id="maxWaitTime"
                    name="maxWaitTime"
                    type="number"
                    defaultValue={settings.handoffSettings?.maxWaitTime ?? 300}
                    min="30"
                    max="3600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Business Hours Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only allow handoffs during business hours
                    </p>
                  </div>
                  <Switch
                    name="businessHoursOnly"
                    defaultChecked={settings.handoffSettings?.businessHoursOnly ?? false}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Assign</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign handoffs to available agents
                    </p>
                  </div>
                  <Switch
                    name="autoAssign"
                    defaultChecked={settings.handoffSettings?.autoAssign ?? true}
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Handoff Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRM Sync Settings */}
        <TabsContent value="crm">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                CRM Sync Settings
              </CardTitle>
              <CardDescription>
                Configure how leads and data sync with your CRM system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveCrmSync} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Sync Qualified Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync qualified leads to your CRM
                    </p>
                  </div>
                  <Switch
                    name="autoSyncQualified"
                    defaultChecked={settings.crmSyncSettings?.autoSyncQualified ?? true}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Create Deals for High-Value Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Create deals/opportunities for high-value leads
                    </p>
                  </div>
                  <Switch
                    name="createDealsHighValue"
                    defaultChecked={settings.crmSyncSettings?.createDealsHighValue ?? true}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sync Lead Scores</Label>
                    <p className="text-sm text-muted-foreground">
                      Include lead scoring data in CRM sync
                    </p>
                  </div>
                  <Switch
                    name="syncLeadScores"
                    defaultChecked={settings.crmSyncSettings?.syncLeadScores ?? true}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-Time Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Sync data in real-time instead of batch processing
                    </p>
                  </div>
                  <Switch
                    name="realTimeSync"
                    defaultChecked={settings.crmSyncSettings?.realTimeSync ?? true}
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save CRM Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Subscription */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    You are currently on the {settings.subscription?.plan || 'FREE'} plan
                  </p>
                </div>
                <Badge variant={settings.subscription?.plan === 'FREE' ? 'secondary' : 'default'}>
                  {settings.subscription?.plan || 'FREE'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Your subscription is {settings.subscription?.status || 'ACTIVE'}
                  </p>
                </div>
                <Badge variant={settings.subscription?.status === 'ACTIVE' ? 'default' : 'destructive'}>
                  {settings.subscription?.status || 'ACTIVE'}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Manage Billing
                </Button>
                <Button variant="outline" className="w-full">
                  Download Invoices
                </Button>
                <Button variant="outline" className="w-full">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}