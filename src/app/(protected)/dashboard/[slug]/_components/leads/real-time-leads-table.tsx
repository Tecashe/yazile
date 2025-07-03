"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Clock,
  Star,
  Crown,
  Award,
  Mail,
  Phone,
  Eye,
  Search,
  Filter,
  Settings,
  Download,
  User,
  Brain,
  Timer,
  Instagram,
  RefreshCw,
  RotateCcw,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { LeadDetailsModal } from "./lead-details-modal"
import { useLeadsData } from "@/hooks/use-leads-data"
import { toast } from "sonner"

interface RealTimeLeadsTableProps {
  onExport?: (format: string, selectedIds: string[]) => void
  onBulkAction?: (action: string, selectedIds: string[]) => void
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

function getScoreColor(score: number) {
  if (score >= 85) return "text-purple-600 font-bold dark:text-purple-400"
  if (score >= 70) return "text-green-600 font-bold dark:text-green-400"
  if (score >= 50) return "text-yellow-600 font-semibold dark:text-yellow-400"
  if (score >= 30) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
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
    <Badge className={`${config.color} ml-2 px-2 py-1`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

function getRevenueDisplay(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

export function RealTimeLeadsTable({ onExport, onBulkAction }: RealTimeLeadsTableProps) {
  const { leads, isLoading, error, filters, syncToCRM, reanalyzeLead, updateFilters, refreshData } = useLeadsData()

  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(leads.map((lead) => lead.id))
    }
  }

  const handleSelectLead = (leadId: string) => {
    const newSelection = selectedLeads.includes(leadId)
      ? selectedLeads.filter((id) => id !== leadId)
      : [...selectedLeads, leadId]
    setSelectedLeads(newSelection)
  }

  const handleViewDetails = (lead: any) => {
    setSelectedLead(lead)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false)
    setSelectedLead(null)
  }

  const handleSyncToCRM = async (leadIds: string[]) => {
    await syncToCRM(leadIds)
    setSelectedLeads([]) // Clear selection after sync
  }

  const handleReanalyze = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead || !lead.interactions?.[0]?.content) {
      toast.error("No message content found for re-analysis")
      return
    }

    await reanalyzeLead(leadId, lead.interactions[0].content)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads first")
      return
    }

    switch (action) {
      case "sync-crm":
        await handleSyncToCRM(selectedLeads)
        break
      case "reanalyze":
        for (const leadId of selectedLeads) {
          await handleReanalyze(leadId)
        }
        setSelectedLeads([])
        break
      default:
        if (onBulkAction) {
          onBulkAction(action, selectedLeads)
        }
    }
  }

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format, selectedLeads.length > 0 ? selectedLeads : leads.map((l) => l.id))
    }
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="text-center py-12">
          <div className="text-red-600 mb-4">Error loading leads: {error}</div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Live Lead Pipeline
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
              </CardTitle>
              <CardDescription>
                Real-time AI-qualified leads with comprehensive contact information ({leads.length} leads)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
              {selectedLeads.length > 0 && (
                <>
                  <Select onValueChange={handleBulkAction}>
                    <SelectTrigger className="w-32">
                      <Settings className="h-4 w-4 mr-2" />
                      Actions
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sync-crm">Sync to CRM</SelectItem>
                      <SelectItem value="reanalyze">Re-analyze</SelectItem>
                      <SelectItem value="send-email">Send Email</SelectItem>
                      <SelectItem value="update-status">Update Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={handleExport}>
                    <SelectTrigger className="w-32">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or Instagram handle..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status} onValueChange={(status) => updateFilters({ status })}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="QUALIFYING">Qualifying</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.tier} onValueChange={(tier) => updateFilters({ tier })}>
              <SelectTrigger className="w-40">
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="PLATINUM">Platinum</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="BRONZE">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select All */}
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All ({selectedLeads.length} selected)</span>
          </div>

          <Separator className="mb-4" />

          {/* Leads List */}
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {isLoading && leads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="h-16 w-16 mx-auto mb-4 animate-spin opacity-50" />
                  <p className="text-lg font-medium">Loading leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No leads found</p>
                  <p className="text-sm">
                    Try adjusting your filters or start engaging with customers to generate AI-qualified leads!
                  </p>
                </div>
              ) : (
                leads.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id)

                  return (
                    <div
                      key={lead.id}
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 ${
                        isSelected ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Checkbox checked={isSelected} onCheckedChange={() => handleSelectLead(lead.id)} />

                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {lead.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Lead Name and Tier */}
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium truncate">{lead.displayName}</p>
                            {getTierBadge(lead.revenueData.tier)}
                            {lead.name && (
                              <Badge variant="outline" className="text-xs">
                                <User className="w-3 h-3 mr-1" />
                                Named
                              </Badge>
                            )}
                          </div>

                          {/* Contact Information */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Instagram className="h-3 w-3" />@{lead.instagramUserId}
                            </span>
                            {lead.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </span>
                            )}
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </span>
                            )}
                            <span>Score: {lead.score}</span>
                            <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
                          </div>

                          {/* Score Progress Bar */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">Lead Score</span>
                              <span className={`text-xs font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Contact Completeness */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">Profile Completeness</span>
                              <span className="text-xs font-bold text-blue-600">{lead.marketingCompleteness}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${lead.marketingCompleteness}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Revenue Information */}
                          {lead.revenueData.estimatedValue > 0 && (
                            <div className="flex items-center gap-4 text-xs mb-2">
                              <span className="text-green-600 font-medium">
                                Est: {getRevenueDisplay(lead.revenueData.estimatedValue)}
                              </span>
                              {lead.revenueData.roi > 0 && (
                                <span className="text-blue-600 font-medium">
                                  ROI: {lead.revenueData.roi.toFixed(0)}%
                                </span>
                              )}
                            </div>
                          )}

                          {/* AI Notification */}
                          {lead.aiInsights.notificationMessage && (
                            <p className="text-xs text-blue-600 mb-2 font-medium flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              {lead.aiInsights.notificationMessage}
                            </p>
                          )}

                          {/* Next Actions */}
                          {lead.aiInsights.nextActions && lead.aiInsights.nextActions.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {lead.aiInsights.nextActions.slice(0, 2).map((action: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Timer className="w-2 h-2 mr-1" />
                                  {action.replace(/_/g, " ")}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        <div className={`text-sm font-medium ${getScoreColor(lead.score)} min-w-[3rem] text-center`}>
                          {lead.score}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReanalyze(lead.id)}
                          title="Re-analyze lead"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(lead)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onEdit={(leadId) => toast.info(`Edit functionality for lead ${leadId}`)}
        onSync={(leadId) => handleSyncToCRM([leadId])}
      />
    </>
  )
}
