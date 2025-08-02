// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
// import { Clock, CheckCircle, AlertTriangle, Database, Activity } from "lucide-react"

// interface AnalyticsData {
//   totalRequests: number
//   requestsByStatus: Record<string, number>
//   requestsByUrgency: Record<string, number>
//   completionRate: number
//   averageCompletionTime: number
//   templateUsage: Array<{
//     id: string
//     name: string
//     _count: { businessConfigs: number }
//   }>
//   recentActivity: Array<{
//     id: string
//     title: string
//     status: string
//     createdAt: string
//     user: {
//       firstname: string
//       lastname: string
//       email: string
//     }
//   }>
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

// export default function WorkflowAnalytics() {
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchAnalytics()
//   }, [])

//   const fetchAnalytics = async () => {
//     try {
//       const response = await fetch("/api/admin/workflow-analytics")
//       const data = await response.json()
//       setAnalytics(data.analytics)
//     } catch (error) {
//       console.error("Error fetching analytics:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!analytics) {
//     return (
//       <div className="p-6">
//         <Card>
//           <CardContent className="p-8 text-center">
//             <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Unable to Load Analytics</h3>
//             <p className="text-muted-foreground">There was an error loading the analytics data.</p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   // Prepare chart data
//   const statusData = Object.entries(analytics.requestsByStatus).map(([status, count]) => ({
//     status: status.replace("_", " "),
//     count,
//   }))

//   const urgencyData = Object.entries(analytics.requestsByUrgency).map(([urgency, count]) => ({
//     urgency,
//     count,
//   }))

//   const templateUsageData = analytics.templateUsage.slice(0, 10).map((template) => ({
//     name: template.name.length > 20 ? template.name.substring(0, 20) + "..." : template.name,
//     usage: template._count.businessConfigs,
//   }))

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Workflow Analytics</h1>
//           <p className="text-muted-foreground">Comprehensive insights into workflow requests and performance</p>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Database className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Requests</p>
//                   <p className="text-2xl font-bold">{analytics.totalRequests}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Completion Rate</p>
//                   <p className="text-2xl font-bold">{analytics.completionRate}%</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-100 rounded-lg">
//                   <Clock className="h-5 w-5 text-orange-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Avg. Completion</p>
//                   <p className="text-2xl font-bold">{analytics.averageCompletionTime}d</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <Activity className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Active Templates</p>
//                   <p className="text-2xl font-bold">{analytics.templateUsage.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Request Status Distribution */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Request Status Distribution</CardTitle>
//               <CardDescription>Current status of all workflow requests</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={statusData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="status" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#8884d8" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Urgency Distribution */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Request Urgency Distribution</CardTitle>
//               <CardDescription>Priority levels of incoming requests</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={urgencyData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ urgency, percent }) => `${urgency} ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="count"
//                   >
//                     {urgencyData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Template Usage */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Most Popular Templates</CardTitle>
//               <CardDescription>Templates with highest user adoption</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={templateUsageData} layout="horizontal">
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" />
//                   <YAxis dataKey="name" type="category" width={100} />
//                   <Tooltip />
//                   <Bar dataKey="usage" fill="#82ca9d" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Recent Activity */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Activity</CardTitle>
//               <CardDescription>Latest workflow request updates</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4 max-h-[300px] overflow-y-auto">
//                 {analytics.recentActivity.slice(0, 10).map((activity) => (
//                   <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium truncate">{activity.title}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {activity.user.firstname} {activity.user.lastname} •{" "}
//                         {new Date(activity.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <Badge variant="outline" className="text-xs">
//                       {activity.status.replace("_", " ")}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Performance Metrics */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Performance Overview</CardTitle>
//             <CardDescription>Key performance indicators for workflow management</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Completion Rate</span>
//                   <span className="text-sm text-muted-foreground">{analytics.completionRate}%</span>
//                 </div>
//                 <Progress value={analytics.completionRate} className="h-2" />
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Response Time</span>
//                   <span className="text-sm text-muted-foreground">
//                     {analytics.averageCompletionTime < 7
//                       ? "Excellent"
//                       : analytics.averageCompletionTime < 14
//                         ? "Good"
//                         : "Needs Improvement"}
//                   </span>
//                 </div>
//                 <Progress value={Math.max(0, 100 - analytics.averageCompletionTime * 5)} className="h-2" />
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">User Satisfaction</span>
//                   <span className="text-sm text-muted-foreground">
//                     {analytics.completionRate > 80 ? "High" : analytics.completionRate > 60 ? "Medium" : "Low"}
//                   </span>
//                 </div>
//                 <Progress value={analytics.completionRate} className="h-2" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Clock, CheckCircle, AlertTriangle, Database, Activity } from "lucide-react"

interface AnalyticsData {
  totalRequests: number
  requestsByStatus: Record<string, number>
  requestsByUrgency: Record<string, number>
  completionRate: number
  averageCompletionTime: number
  templateUsage: Array<{
    id: string
    name: string
    _count: { businessConfigs: number }
  }>
  recentActivity: Array<{
    id: string
    title: string
    status: string
    createdAt: string
    user: {
      firstname: string
      lastname: string
      email: string
    }
  }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

export default function WorkflowAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/workflow-analytics")
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Analytics</h3>
            <p className="text-muted-foreground">There was an error loading the analytics data.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare chart data
  const statusData = Object.entries(analytics.requestsByStatus).map(([status, count]) => ({
    status: status.replace("_", " "),
    count,
  }))

  const urgencyData = Object.entries(analytics.requestsByUrgency).map(([urgency, count]) => ({
    urgency,
    count,
  }))

  const templateUsageData = analytics.templateUsage.slice(0, 10).map((template) => ({
    name: template.name.length > 20 ? template.name.substring(0, 20) + "..." : template.name,
    usage: template._count.businessConfigs,
  }))

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workflow Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into workflow requests and performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{analytics.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Completion</p>
                  <p className="text-2xl font-bold">{analytics.averageCompletionTime}d</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Templates</p>
                  <p className="text-2xl font-bold">{analytics.templateUsage.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Request Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
              <CardDescription>Current status of all workflow requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Urgency Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Request Urgency Distribution</CardTitle>
              <CardDescription>Priority levels of incoming requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={urgencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ urgency, percent }) => `${urgency} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {urgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Template Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Templates</CardTitle>
              <CardDescription>Templates with highest user adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={templateUsageData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest workflow request updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {analytics.recentActivity.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user.firstname} {activity.user.lastname} •{" "}
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key performance indicators for workflow management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.completionRate}%</span>
                </div>
                <Progress value={analytics.completionRate} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-muted-foreground">
                    {analytics.averageCompletionTime < 7
                      ? "Excellent"
                      : analytics.averageCompletionTime < 14
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </div>
                <Progress value={Math.max(0, 100 - analytics.averageCompletionTime * 5)} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Satisfaction</span>
                  <span className="text-sm text-muted-foreground">
                    {analytics.completionRate > 80 ? "High" : analytics.completionRate > 60 ? "Medium" : "Low"}
                  </span>
                </div>
                <Progress value={analytics.completionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
