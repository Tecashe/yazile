"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Linkedin, Facebook } from "lucide-react"
import LinkedInAutomationsPage from "./linkedin/page"
import WhatsAppAutomationsPage from "./whatsapp/page"
import FacebookAutomationsPage from "./facebook/page"

export default function AutomationsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DM Automations</h1>
        <p className="text-muted-foreground mt-2">Manage automated responses across all your messaging platforms</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="linkedin" className="gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="facebook" className="gap-2">
            <Facebook className="w-4 h-4" />
            Facebook
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">Across all platforms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Get your automations up and running</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Connect Your Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Integrations and connect your LinkedIn, WhatsApp, or Facebook account
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Create an Automation</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up triggers (keywords, welcome messages) and responses
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Enable Voiceflow Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect your Voiceflow bot to handle intelligent conversations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linkedin">
          <LinkedInAutomationsPage />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppAutomationsPage />
        </TabsContent>

        <TabsContent value="facebook">
          <FacebookAutomationsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
