"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Instagram,
  TrendingUp,
  Brain,
  Target,
  DollarSign,
  Crown,
  Award,
  Star,
  Users,
  MessageSquare,
  Activity,
  ExternalLink,
  Edit,
  Copy,
  BarChart3,
  Timer,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface LeadDetailsModalProps {
  lead: any
  isOpen: boolean
  onClose: () => void
  onEdit?: (leadId: string) => void
  onSync?: (leadId: string) => void
}

function getStatusColor(status: string) {
  const colors = {
    NEW: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    QUALIFYING:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    QUALIFIED:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    CONVERTED:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    LOST: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  }
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
}

function getTierBadge(tier: string) {
  const tierConfig = {
    PLATINUM: {
      icon: Crown,
      color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400",
      label: "Platinum",
    },
    GOLD: {
      icon: Award,
      color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400",
      label: "Gold",
    },
    SILVER: {
      icon: Star,
      color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Silver",
    },
    BRONZE: {
      icon: Users,
      color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400",
      label: "Bronze",
    },
  }

  const config = tierConfig[tier as keyof typeof tierConfig]
  if (!config) return null

  const IconComponent = config.icon

  return (
    <Badge className={`${config.color} px-3 py-1`}>
      <IconComponent className="w-4 h-4 mr-2" />
      {config.label}
    </Badge>
  )
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-purple-600 dark:text-purple-400"
  if (score >= 70) return "text-green-600 dark:text-green-400"
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400"
  if (score >= 30) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

function getRevenueDisplay(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

export function LeadDetailsModal({ lead, isOpen, onClose, onEdit, onSync }: LeadDetailsModalProps) {
  if (!lead) return null

  const lastAnalysis = lead.metadata?.lastAnalysis
  const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
  const displayName = lead.name || `Instagram User ${lead.instagramUserId?.slice(-4) || "Unknown"}`

  // Calculate completion percentage for different sections
  const contactCompletion = ([lead.name, lead.email, lead.phone].filter(Boolean).length / 3) * 100
  const analysisCompletion = lastAnalysis ? 100 : 0
  const engagementCompletion = lead.interactions?.length > 0 ? 100 : 0

  const handleCopyId = () => {
    navigator.clipboard.writeText(lead.id)
  }

  const handleCopyInstagram = () => {
    navigator.clipboard.writeText(`@${lead.instagramUserId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  {displayName}
                  {lastAnalysis?.leadTier && getTierBadge(lastAnalysis.leadTier)}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Instagram className="h-4 w-4" />@{lead.instagramUserId}
                  </span>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  <span className={`font-semibold ${getScoreColor(lead.score)}`}>Score: {lead.score}/100</span>
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(lead.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onSync && (
                <Button variant="outline" size="sm" onClick={() => onSync(lead.id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sync CRM
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopyId}>
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{Math.round(contactCompletion)}%</span>
                      <CheckCircle
                        className={`h-5 w-5 ${contactCompletion === 100 ? "text-green-500" : "text-gray-400"}`}
                      />
                    </div>
                    <Progress value={contactCompletion} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Profile completion</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{analysisCompletion}%</span>
                      <Brain className={`h-5 w-5 ${analysisCompletion === 100 ? "text-blue-500" : "text-gray-400"}`} />
                    </div>
                    <Progress value={analysisCompletion} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Analysis complete</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{lead.interactions?.length || 0}</span>
                      <MessageSquare
                        className={`h-5 w-5 ${engagementCompletion === 100 ? "text-green-500" : "text-gray-400"}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Total interactions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Lead Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Lead Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.firstContactDate))} ago
                        </p>
                      </div>
                    </div>

                    {lead.qualifiedDate && (
                      <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Lead Qualified</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(lead.qualifiedDate))} ago
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Last Contact</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.lastContactDate))} ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Actions */}
              {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Recommended Next Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lastAnalysis.nextActions.map((action: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                          <Timer className="h-4 w-4 text-primary" />
                          <span className="capitalize">{action.replace(/_/g, " ")}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Full Name</span>
                        <span className="text-sm">{lead.name || "Not provided"}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Email</span>
                        <span className="text-sm">{lead.email || "Not provided"}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Phone</span>
                        <span className="text-sm">{lead.phone || "Not provided"}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Instagram</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">@{lead.instagramUserId}</span>
                          <Button variant="ghost" size="sm" onClick={handleCopyInstagram}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Profile Completeness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Name</span>
                          <span className="text-sm">{lead.name ? "✓" : "✗"}</span>
                        </div>
                        <Progress value={lead.name ? 100 : 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Email</span>
                          <span className="text-sm">{lead.email ? "✓" : "✗"}</span>
                        </div>
                        <Progress value={lead.email ? 100 : 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Phone</span>
                          <span className="text-sm">{lead.phone ? "✓" : "✗"}</span>
                        </div>
                        <Progress value={lead.phone ? 100 : 0} className="h-2" />
                      </div>
                      <Separator />
                      <div className="text-center">
                        <span className="text-lg font-bold">{Math.round(contactCompletion)}%</span>
                        <p className="text-sm text-muted-foreground">Overall Completion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {lastAnalysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Qualification Scores
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Overall Score</span>
                            <span className={`text-sm font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
                          </div>
                          <Progress value={lead.score} className="h-2" />
                        </div>

                        {lead.qualificationData && (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Intent Score</span>
                                <span className="text-sm">{lead.qualificationData.intentScore || 0}/20</span>
                              </div>
                              <Progress value={(lead.qualificationData.intentScore || 0) * 5} className="h-2" />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Sentiment Score</span>
                                <span className="text-sm">{lead.qualificationData.sentimentScore || 0}/15</span>
                              </div>
                              <Progress
                                value={Math.max(0, (lead.qualificationData.sentimentScore || 0) + 10) * 6.67}
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Engagement Score</span>
                                <span className="text-sm">{lead.qualificationData.engagementScore || 0}/15</span>
                              </div>
                              <Progress value={(lead.qualificationData.engagementScore || 0) * 6.67} className="h-2" />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Lead Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Lead Tier</span>
                          {lastAnalysis.leadTier && getTierBadge(lastAnalysis.leadTier)}
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Buyer Persona</span>
                          <span className="text-sm capitalize">
                            {lastAnalysis.buyerPersona?.replace(/_/g, " ") || "Unknown"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Follow-up Strategy</span>
                          <span className="text-sm capitalize">
                            {lastAnalysis.followUpStrategy?.replace(/_/g, " ") || "Standard"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">ROI Potential</span>
                          <span className="text-sm font-bold text-green-600">{lastAnalysis.roi || 0}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {lastAnalysis.notificationMessage && (
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          AI Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-blue-800 dark:text-blue-200 font-medium">
                            {lastAnalysis.notificationMessage}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No AI Analysis Available</h3>
                    <p className="text-muted-foreground mb-4">This lead hasn&apos;t been analyzed by our AI system yet.</p>
                    <Button>
                      <Brain className="h-4 w-4 mr-2" />
                      Run AI Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="interactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Interaction History ({lead.interactions?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.interactions && lead.interactions.length > 0 ? (
                    <ScrollArea className="h-64">
                      <div className="space-y-4">
                        {lead.interactions.map((interaction: any, index: number) => (
                          <div key={index} className="flex gap-4 p-4 border rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="capitalize">
                                  {interaction.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(interaction.timestamp))} ago
                                </span>
                              </div>
                              <p className="text-sm mb-2">{interaction.content}</p>
                              {interaction.sentiment && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs">Sentiment:</span>
                                  <Badge
                                    variant={interaction.sentiment > 0 ? "default" : "destructive"}
                                    className="text-xs"
                                  >
                                    {interaction.sentiment > 0 ? "Positive" : "Negative"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No interactions recorded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Revenue Potential
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {lastAnalysis?.estimatedValue ? getRevenueDisplay(lastAnalysis.estimatedValue) : "$0"}
                      </div>
                      <p className="text-sm text-muted-foreground">Estimated Value</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ROI Potential</span>
                        <span className="text-sm font-bold text-green-600">{lastAnalysis?.roi || 0}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Lead Tier</span>
                        {lastAnalysis?.leadTier && getTierBadge(lastAnalysis.leadTier)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Conversion Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Conversion Probability</span>
                          <span className="text-sm font-bold">
                            {lastAnalysis?.leadTier === "PLATINUM"
                              ? "80%"
                              : lastAnalysis?.leadTier === "GOLD"
                                ? "60%"
                                : lastAnalysis?.leadTier === "SILVER"
                                  ? "30%"
                                  : "15%"}
                          </span>
                        </div>
                        <Progress
                          value={
                            lastAnalysis?.leadTier === "PLATINUM"
                              ? 80
                              : lastAnalysis?.leadTier === "GOLD"
                                ? 60
                                : lastAnalysis?.leadTier === "SILVER"
                                  ? 30
                                  : 15
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Lead Quality</span>
                          <span className={`text-sm font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score >= 85
                              ? "Excellent"
                              : lead.score >= 70
                                ? "Good"
                                : lead.score >= 50
                                  ? "Average"
                                  : "Poor"}
                          </span>
                        </div>
                        <Progress value={lead.score} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {lastAnalysis?.estimatedValue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {getRevenueDisplay(lastAnalysis.estimatedValue)}
                        </div>
                        <p className="text-xs text-muted-foreground">Estimated Value</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{lastAnalysis.roi || 0}%</div>
                        <p className="text-xs text-muted-foreground">ROI Potential</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{lastAnalysis.leadTier || "BRONZE"}</div>
                        <p className="text-xs text-muted-foreground">Lead Tier</p>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{lead.score}</div>
                        <p className="text-xs text-muted-foreground">Lead Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
