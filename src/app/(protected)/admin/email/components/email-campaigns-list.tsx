"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getEmailCampaigns, deleteEmailCampaign } from "../../actions/email-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Copy, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export function EmailCampaignsList() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true)
      try {
        const result = await getEmailCampaigns()
        if (result.success) {
          setCampaigns(result.campaigns || [])
        } else {
          toast({
            title: "Error",
            description: "Failed to load campaigns",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading campaigns:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteEmailCampaign(id)
      if (result.success) {
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id))
        toast({
          title: "Campaign deleted",
          description: "The email campaign has been deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete campaign",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleViewStats = (campaign: any) => {
    setSelectedCampaign(campaign)
    setIsStatsDialogOpen(true)
  }

  const getStatusBadge = (status: string, scheduledDate?: Date | null) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "sending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Sending
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // For demo purposes, let's create some sample campaigns if none exist
  if (campaigns.length === 0) {
    const sampleCampaigns = [
      {
        id: "1",
        name: "Welcome Email Series",
        description: "Automated welcome emails for new users",
        status: "active",
        subject: "Welcome to our platform!",
        stats: {
          totalEmails: 1250,
          sentEmails: 1250,
          openedEmails: 875,
          clickedEmails: 430,
          failedEmails: 0,
          openRate: 70,
          clickRate: 34.4,
        },
        createdAt: new Date("2023-01-15"),
        sentAt: new Date("2023-01-15"),
        scheduledDate: null,
      },
      {
        id: "2",
        name: "Monthly Newsletter - March",
        description: "Monthly update with new features and tips",
        status: "scheduled",
        subject: "See what's new this month!",
        stats: {
          totalEmails: 5000,
          sentEmails: 0,
          openedEmails: 0,
          clickedEmails: 0,
          failedEmails: 0,
          openRate: 0,
          clickRate: 0,
        },
        createdAt: new Date("2023-03-01"),
        sentAt: null,
        scheduledDate: new Date("2023-03-15"),
      },
      {
        id: "3",
        name: "Product Launch Announcement",
        description: "Announcing our new premium features",
        status: "sent",
        subject: "Introducing our new premium features!",
        stats: {
          totalEmails: 8500,
          sentEmails: 8450,
          openedEmails: 6200,
          clickedEmails: 3100,
          failedEmails: 50,
          openRate: 73.4,
          clickRate: 36.7,
        },
        createdAt: new Date("2023-02-10"),
        sentAt: new Date("2023-02-12"),
        scheduledDate: new Date("2023-02-12"),
      },
    ]

    return (
      <div className="space-y-6">
        {sampleCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                {getStatusBadge(campaign.status, campaign.scheduledDate)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <div>
                  <span className="font-medium">Created:</span> {format(campaign.createdAt, "PPP")}
                </div>
                <div>
                  {campaign.sentAt ? (
                    <>
                      <span className="font-medium">Sent:</span> {format(campaign.sentAt, "PPP")}
                    </>
                  ) : campaign.scheduledDate ? (
                    <>
                      <span className="font-medium">Scheduled:</span> {format(campaign.scheduledDate, "PPP")}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium">Subject:</span> {campaign.subject}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Open Rate</span>
                  <span className="font-medium">{campaign.stats.openRate}%</span>
                </div>
                <Progress value={campaign.stats.openRate} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Click Rate</span>
                  <span className="font-medium">{campaign.stats.clickRate}%</span>
                </div>
                <Progress value={campaign.stats.clickRate} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleViewStats(campaign)}>
                View Stats
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the &quot;{campaign.name}&quot; campaign. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                {getStatusBadge(campaign.status, campaign.scheduledDate)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <div>
                  <span className="font-medium">Created:</span> {format(new Date(campaign.createdAt), "PPP")}
                </div>
                <div>
                  {campaign.sentAt ? (
                    <>
                      <span className="font-medium">Sent:</span> {format(new Date(campaign.sentAt), "PPP")}
                    </>
                  ) : campaign.scheduledDate ? (
                    <>
                      <span className="font-medium">Scheduled:</span> {format(new Date(campaign.scheduledDate), "PPP")}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="text-sm mb-2">
                <span className="font-medium">Subject:</span> {campaign.subject}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Open Rate</span>
                  <span className="font-medium">{campaign.stats.openRate}%</span>
                </div>
                <Progress value={campaign.stats.openRate} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Click Rate</span>
                  <span className="font-medium">{campaign.stats.clickRate}%</span>
                </div>
                <Progress value={campaign.stats.clickRate} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleViewStats(campaign)}>
                View Stats
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <AlertDialog
                  open={isDeleteDialogOpen && selectedCampaign?.id === campaign.id}
                  onOpenChange={(open) => {
                    if (!open) setIsDeleteDialogOpen(false)
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the &quote;{campaign.name}&quote; campaign. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Campaign Stats Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Campaign Statistics: {selectedCampaign?.name}</DialogTitle>
            <DialogDescription>Detailed performance metrics for this email campaign.</DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCampaign.stats.totalEmails.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCampaign.stats.sentEmails.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((selectedCampaign.stats.sentEmails / selectedCampaign.stats.totalEmails) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Opens</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCampaign.stats.openedEmails.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{selectedCampaign.stats.openRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Clicks</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedCampaign.stats.clickedEmails.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{selectedCampaign.stats.clickRate}%</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Delivery Rate</span>
                        <span className="text-sm font-medium">
                          {((selectedCampaign.stats.sentEmails / selectedCampaign.stats.totalEmails) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={(selectedCampaign.stats.sentEmails / selectedCampaign.stats.totalEmails) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Open Rate</span>
                        <span className="text-sm font-medium">{selectedCampaign.stats.openRate}%</span>
                      </div>
                      <Progress value={selectedCampaign.stats.openRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Click Rate</span>
                        <span className="text-sm font-medium">{selectedCampaign.stats.clickRate}%</span>
                      </div>
                      <Progress value={selectedCampaign.stats.clickRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Click-to-Open Rate</span>
                        <span className="text-sm font-medium">
                          {((selectedCampaign.stats.clickedEmails / selectedCampaign.stats.openedEmails) * 100).toFixed(
                            1,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(selectedCampaign.stats.clickedEmails / selectedCampaign.stats.openedEmails) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

