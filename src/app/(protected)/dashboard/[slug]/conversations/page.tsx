"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Brain,
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  BookOpen,
  Eye,
  Settings,
  Upload,
  Play,
  Pause,
  BarChart3,
  Lightbulb,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface ConversationAnalytics {
  totalConversations: number
  completedConversations: number
  averageSessionLength: number
  averageResponseTime: number
  completionRate: number
  userSatisfactionAvg: number
  topIntents: Array<{ intent: string; count: number }>
  dropOffPoints: Array<{ step: string; dropOffRate: number }>
  sentimentDistribution: { positive: number; neutral: number; negative: number }
  conversionRate: number
  engagementScore: number
}

interface ABTest {
  id: string
  name: string
  description?: string
  status: string
  variants: any[]
  metrics: string[]
  startDate: string
  endDate: string
}

interface BusinessKnowledge {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  sourceType: string
  createdAt: string
}

interface UserAutomation {
  id: string
  name: string
  active: boolean
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function VoiceflowAnalyticsPage() {
  const { user } = useUser()
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null)
  const [abTests, setABTests] = useState<ABTest[]>([])
  const [knowledgeBase, setKnowledgeBase] = useState<BusinessKnowledge[]>([])
  const [activeConversations, setActiveConversations] = useState<any[]>([])
  const [userAutomations, setUserAutomations] = useState<UserAutomation[]>([])
  const [selectedAutomation, setSelectedAutomation] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Knowledge Base Upload State
  const [newKnowledge, setNewKnowledge] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  // A/B Test Creation State
  const [newABTest, setNewABTest] = useState({
    name: "",
    description: "",
    variants: [
      { name: "Control", trafficPercentage: 50 },
      { name: "Variant A", trafficPercentage: 50 },
    ],
    metrics: ["conversion_rate", "engagement_time"],
  })

  useEffect(() => {
    if (user) {
      loadUserAutomations()
    }
  }, [user])

  useEffect(() => {
    if (selectedAutomation) {
      loadAnalytics()
      loadABTests()
      loadKnowledgeBase()
      loadActiveConversations()
    }
  }, [selectedAutomation])

  const loadUserAutomations = async () => {
    try {
      const response = await fetch("/api/user/automations")
      const data = await response.json()
      setUserAutomations(data.automations || [])
      if (data.automations?.length > 0) {
        setSelectedAutomation(data.automations[0].id)
      }
    } catch (error) {
      console.error("Error loading user automations:", error)
    }
  }

  const loadAnalytics = async () => {
    if (!selectedAutomation) return
    setLoading(true)
    try {
      const response = await fetch(`/api/voiceflow/analytics?automationId=${selectedAutomation}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadABTests = async () => {
    if (!selectedAutomation) return
    try {
      const response = await fetch(`/api/voiceflow/ab-tests?automationId=${selectedAutomation}`)
      const data = await response.json()
      setABTests(data)
    } catch (error) {
      console.error("Error loading A/B tests:", error)
    }
  }

  const loadKnowledgeBase = async () => {
    if (!selectedAutomation) return
    try {
      const response = await fetch(`/api/voiceflow/knowledge-base?automationId=${selectedAutomation}`)
      const data = await response.json()
      setKnowledgeBase(data)
    } catch (error) {
      console.error("Error loading knowledge base:", error)
    }
  }

  const loadActiveConversations = async () => {
    if (!selectedAutomation) return
    try {
      const response = await fetch(`/api/voiceflow/active-conversations?automationId=${selectedAutomation}`)
      const data = await response.json()
      setActiveConversations(data.conversations || [])
    } catch (error) {
      console.error("Error loading active conversations:", error)
    }
  }

  const handleUploadKnowledge = async () => {
    if (!newKnowledge.title || !newKnowledge.content || !selectedAutomation) return

    try {
      const response = await fetch("/api/voiceflow/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId: selectedAutomation,
          documents: [
            {
              title: newKnowledge.title,
              content: newKnowledge.content,
              category: newKnowledge.category || "general",
              tags: newKnowledge.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            },
          ],
        }),
      })

      if (response.ok) {
        setNewKnowledge({ title: "", content: "", category: "", tags: "" })
        loadKnowledgeBase()
      }
    } catch (error) {
      console.error("Error uploading knowledge:", error)
    }
  }

  const handleSyncBusinessProfile = async () => {
    if (!selectedAutomation) return
    setSyncing(true)
    try {
      const response = await fetch("/api/voiceflow/sync-business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automationId: selectedAutomation }),
      })

      if (response.ok) {
        loadKnowledgeBase()
      }
    } catch (error) {
      console.error("Error syncing business profile:", error)
    } finally {
      setSyncing(false)
    }
  }

  const handleCreateABTest = async () => {
    if (!newABTest.name || !selectedAutomation) return

    try {
      const response = await fetch("/api/voiceflow/ab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId: selectedAutomation,
          testConfig: {
            ...newABTest,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        }),
      })

      if (response.ok) {
        setNewABTest({
          name: "",
          description: "",
          variants: [
            { name: "Control", trafficPercentage: 50 },
            { name: "Variant A", trafficPercentage: 50 },
          ],
          metrics: ["conversion_rate", "engagement_time"],
        })
        loadABTests()
      }
    } catch (error) {
      console.error("Error creating A/B test:", error)
    }
  }

  const handleTakeoverConversation = async (instagramUserId: string) => {
    if (!selectedAutomation) return
    try {
      await fetch("/api/voiceflow/takeover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId: selectedAutomation,
          instagramUserId,
          agentId: user?.id || "current_user",
          reason: "manual_intervention",
        }),
      })
      loadActiveConversations()
    } catch (error) {
      console.error("Error taking over conversation:", error)
    }
  }

  if (!selectedAutomation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Automation</CardTitle>
            <CardDescription>Choose an automation to view Voiceflow analytics</CardDescription>
          </CardHeader>
          <CardContent>
            {userAutomations.length > 0 ? (
              <Select onValueChange={setSelectedAutomation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an automation..." />
                </SelectTrigger>
                <SelectContent>
                  {userAutomations.map((automation) => (
                    <SelectItem key={automation.id} value={automation.id}>
                      {automation.name} {automation.active ? "✅" : "⏸️"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No automations found. Create an automation first.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voiceflow Analytics</h1>
          <p className="text-muted-foreground">Advanced AI conversation insights and management</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedAutomation} onValueChange={setSelectedAutomation}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {userAutomations.map((automation) => (
                <SelectItem key={automation.id} value={automation.id}>
                  {automation.name} {automation.active ? "✅" : "⏸️"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="ab-testing" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Live Monitoring
          </TabsTrigger>
          <TabsTrigger value="intents" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Intent Analysis
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalConversations}</div>
                    <p className="text-xs text-muted-foreground">{analytics.completedConversations} completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics.averageSessionLength)}min</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(analytics.averageResponseTime)}ms avg response
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics.completionRate * 100)}%</div>
                    <Progress value={analytics.completionRate * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.userSatisfactionAvg.toFixed(1)}/5</div>
                    <p className="text-xs text-muted-foreground">{Math.round(analytics.engagementScore)}% engagement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Intents</CardTitle>
                    <CardDescription>Most common user intents detected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.topIntents}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="intent" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Distribution</CardTitle>
                    <CardDescription>User sentiment analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Positive", value: analytics.sentimentDistribution.positive },
                            { name: "Neutral", value: analytics.sentimentDistribution.neutral },
                            { name: "Negative", value: analytics.sentimentDistribution.negative },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: "Positive", value: analytics.sentimentDistribution.positive },
                            { name: "Neutral", value: analytics.sentimentDistribution.neutral },
                            { name: "Negative", value: analytics.sentimentDistribution.negative },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create A/B Test */}
            <Card>
              <CardHeader>
                <CardTitle>Create A/B Test</CardTitle>
                <CardDescription>Test different conversation flows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input
                    id="test-name"
                    value={newABTest.name}
                    onChange={(e) => setNewABTest({ ...newABTest, name: e.target.value })}
                    placeholder="Welcome message test"
                  />
                </div>

                <div>
                  <Label htmlFor="test-description">Description</Label>
                  <Textarea
                    id="test-description"
                    value={newABTest.description}
                    onChange={(e) => setNewABTest({ ...newABTest, description: e.target.value })}
                    placeholder="Describe what you're testing..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Variants</Label>
                  {newABTest.variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <Input
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...newABTest.variants]
                          newVariants[index].name = e.target.value
                          setNewABTest({ ...newABTest, variants: newVariants })
                        }}
                        placeholder="Variant name"
                      />
                      <Input
                        type="number"
                        value={variant.trafficPercentage}
                        onChange={(e) => {
                          const newVariants = [...newABTest.variants]
                          newVariants[index].trafficPercentage = Number.parseInt(e.target.value)
                          setNewABTest({ ...newABTest, variants: newVariants })
                        }}
                        placeholder="50"
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  ))}
                </div>

                <Button onClick={handleCreateABTest} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start A/B Test
                </Button>
              </CardContent>
            </Card>

            {/* Active A/B Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Active Tests</CardTitle>
                <CardDescription>Currently running A/B tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {abTests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{test.name}</h4>
                        <Badge variant={test.status === "ACTIVE" ? "default" : "secondary"}>{test.status}</Badge>
                      </div>
                      {test.description && <p className="text-sm text-muted-foreground mb-2">{test.description}</p>}
                      <div className="text-sm text-muted-foreground">
                        <p>Variants: {test.variants?.length || 0}</p>
                        <p>Metrics: {test.metrics?.join(", ")}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Results
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      </div>
                    </div>
                  ))}

                  {abTests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No A/B tests created yet. Create your first test to optimize conversations.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Business Knowledge</CardTitle>
                <CardDescription>Add business-specific information for better responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleSyncBusinessProfile} variant="outline" disabled={syncing} className="flex-1">
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                    Sync Business Profile
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div>
                    <Label htmlFor="kb-title">Title</Label>
                    <Input
                      id="kb-title"
                      value={newKnowledge.title}
                      onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                      placeholder="Product pricing information"
                    />
                  </div>

                  <div>
                    <Label htmlFor="kb-content">Content</Label>
                    <Textarea
                      id="kb-content"
                      value={newKnowledge.content}
                      onChange={(e) => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                      placeholder="Detailed information about your products, services, policies..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kb-category">Category</Label>
                      <Select onValueChange={(value) => setNewKnowledge({ ...newKnowledge, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="products">Products</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="policies">Policies</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="kb-tags">Tags (comma-separated)</Label>
                      <Input
                        id="kb-tags"
                        value={newKnowledge.tags}
                        onChange={(e) => setNewKnowledge({ ...newKnowledge, tags: e.target.value })}
                        placeholder="pricing, products, support"
                      />
                    </div>
                  </div>

                  <Button onClick={handleUploadKnowledge} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Knowledge
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Base Items */}
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Business-specific information available to AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {knowledgeBase.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex gap-1">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.sourceType === "business_profile" && <Badge variant="secondary">Auto-synced</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.content.substring(0, 100)}...</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  {knowledgeBase.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No knowledge base entries yet. Upload some content or sync your business profile.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Conversations</CardTitle>
              <CardDescription>Monitor and manage active conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeConversations.map((conversation) => (
                  <div key={conversation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">User: {conversation.instagramUserId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Active since: {new Date(conversation.lastActivity).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Messages: {conversation.messageCount} | Duration: {Math.round(conversation.duration / 60)}min
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant={conversation.priority === "high" ? "destructive" : "default"}>
                          {conversation.priority}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTakeoverConversation(conversation.instagramUserId)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Take Over
                        </Button>
                        <Badge variant={conversation.isActive ? "default" : "secondary"}>
                          {conversation.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    {conversation.currentStep && <p className="text-sm">Current step: {conversation.currentStep}</p>}
                    {conversation.tags && conversation.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {conversation.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {activeConversations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No active conversations at the moment</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intent Analysis</CardTitle>
              <CardDescription>Understand what users are trying to accomplish</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Intent analysis dashboard coming soon...</p>
                <p className="text-sm">This will show real-time intent detection and confidence scores</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization</CardTitle>
              <CardDescription>Automated improvements and suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>AI optimization recommendations coming soon...</p>
                <p className="text-sm">This will provide automated suggestions for improving conversation flows</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
