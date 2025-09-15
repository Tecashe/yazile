// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   Activity, 
//   BarChart3, 
//   Zap, 
//   Users, 
//   MessageSquare, 
//   AlertTriangle, 
//   CheckCircle, 
//   XCircle, 
//   Clock, 
//   Plus,
//   Trash2,
//   Edit,
//   Eye,
//   EyeOff,
//   RefreshCw,
//   TrendingUp,
//   ExternalLink
// } from 'lucide-react'

// // Types
// interface Tenant {
//   id: string
//   name: string
//   domain?: string
//   isActive: boolean
//   integrations: Integration[]
// }

// interface Integration {
//   id: string
//   type: string
//   name: string
//   isActive: boolean
//   lastSyncAt?: string
//   lastErrorAt?: string
//   lastError?: string
//   syncCount: number
//   errorCount: number
//   hasValidToken: boolean
//   tokenExpiresAt?: string
// }

// interface Session {
//   id: string
//   sessionId: string
//   userId?: string
//   platform: string
//   status: string
//   startedAt: string
//   lastActiveAt: string
//   endedAt?: string
//   lastStep?: string
// }

// interface Analytics {
//   totalSessions: number
//   activeSessions: number
//   completedSessions: number
//   completionRate: number
//   sessionsByPlatform: { platform: string; count: number }[]
// }

// interface ApiLog {
//   id: string
//   endpoint: string
//   method: string
//   statusCode: number
//   duration?: number
//   timestamp: string
//   error?: string
//   integration?: { name: string; type: string }
// }

// const Dashboard = () => {
//   const [tenant, setTenant] = useState<Tenant | null>(null)
//   const [sessions, setSessions] = useState<Session[]>([])
//   const [analytics, setAnalytics] = useState<Analytics | null>(null)
//   const [apiLogs, setApiLogs] = useState<ApiLog[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState('overview')
//   const [showAddIntegration, setShowAddIntegration] = useState(false)
//   const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
//   const [filterStatus, setFilterStatus] = useState<string>('all')
//   const [dateRange, setDateRange] = useState<string>('7d')
//   const [sessionPage, setSessionPage] = useState(1)
//   const [logPage, setLogPage] = useState(1)

//   // Load initial data
//   useEffect(() => {
//     loadDashboardData()
//   }, [])

//   useEffect(() => {
//     if (activeTab === 'sessions') {
//       loadSessions()
//     } else if (activeTab === 'logs') {
//       loadLogs()
//     }
//   }, [activeTab, sessionPage, logPage, filterStatus, dateRange])

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       const tenantRes = await fetch('/api/dashboard/tenant')
      
//       if (!tenantRes.ok) {
//         throw new Error('Failed to load tenant data')
//       }

//       const tenantData = await tenantRes.json()
//       setTenant(tenantData.tenant)

//       // Load initial sessions for overview
//       await loadSessions(1, 10)
//       await loadLogs(1, 20)
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load dashboard')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadSessions = async (page = sessionPage, limit = 50) => {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       })
      
//       if (filterStatus !== 'all') params.append('status', filterStatus)
      
//       // Convert dateRange to actual dates
//       const endDate = new Date()
//       const startDate = new Date()
//       const days = parseInt(dateRange.replace('d', ''))
//       startDate.setDate(startDate.getDate() - days)
      
//       params.append('startDate', startDate.toISOString())
//       params.append('endDate', endDate.toISOString())

//       const response = await fetch(`/api/dashboard/sessions?${params}`)
      
//       if (response.ok) {
//         const data = await response.json()
//         setSessions(data.sessions || [])
//         setAnalytics(data.analytics)
//       }
//     } catch (err) {
//       console.error('Failed to load sessions:', err)
//     }
//   }

//   const loadLogs = async (page = logPage, limit = 100) => {
//     try {
//       const params = new URLSearchParams({
//         type: 'api',
//         page: page.toString(),
//         limit: limit.toString(),
//       })
      
//       // Convert dateRange to actual dates
//       const endDate = new Date()
//       const startDate = new Date()
//       const days = parseInt(dateRange.replace('d', ''))
//       startDate.setDate(startDate.getDate() - days)
      
//       params.append('startDate', startDate.toISOString())
//       params.append('endDate', endDate.toISOString())

//       const response = await fetch(`/api/dashboard/logs?${params}`)
      
//       if (response.ok) {
//         const data = await response.json()
//         setApiLogs(data.logs || [])
//       }
//     } catch (err) {
//       console.error('Failed to load logs:', err)
//     }
//   }

//   const createIntegration = async (integrationData: any) => {
//     try {
//       const response = await fetch('/api/dashboard/integrations', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(integrationData)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to create integration')
//       }

//       await loadDashboardData()
//       setShowAddIntegration(false)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to create integration')
//     }
//   }

//   const updateIntegration = async (id: string, updateData: any) => {
//     try {
//       const response = await fetch(`/api/dashboard/integrations/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updateData)
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update integration')
//       }

//       await loadDashboardData()
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to update integration')
//     }
//   }

//   const deleteIntegration = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this integration?')) return

//     try {
//       const response = await fetch(`/api/dashboard/integrations/${id}`, {
//         method: 'DELETE'
//       })

//       if (!response.ok) {
//         throw new Error('Failed to delete integration')
//       }

//       await loadDashboardData()
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to delete integration')
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background p-6">
//         <div className="max-w-md mx-auto mt-20 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
//           <div className="flex items-center space-x-3 text-destructive-foreground">
//             <AlertTriangle className="h-5 w-5" />
//             <span className="font-medium">Error loading dashboard</span>
//           </div>
//           <p className="mt-2 text-sm text-destructive-foreground/80">{error}</p>
//           <button 
//             onClick={loadDashboardData}
//             className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-500" />
//       case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-blue-500" />
//       case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />
//       default: return <Clock className="h-4 w-4 text-muted-foreground" />
//     }
//   }

//   const getIntegrationIcon = (type: string) => {
//     switch (type) {
//       case 'STRIPE': return '💳'
//       case 'HUBSPOT': return '🟠'
//       case 'SALESFORCE': return '⚡'
//       case 'PIPEDRIVE': return '🔵'
//       default: return '🔧'
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <div className="bg-card border-b border-border px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
//             <p className="text-sm text-muted-foreground mt-1">
//               {tenant?.name || 'Your Workspace'} • Voiceflow Integration
//             </p>
//           </div>
//           <button
//             onClick={loadDashboardData}
//             className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//           >
//             <RefreshCw className="h-4 w-4" />
//             <span>Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-card border-b border-border px-6">
//         <div className="flex space-x-8">
//           {[
//             { id: 'overview', label: 'Overview', icon: BarChart3 },
//             { id: 'integrations', label: 'Integrations', icon: Zap },
//             { id: 'sessions', label: 'Sessions', icon: MessageSquare },
//             { id: 'logs', label: 'Logs', icon: Activity }
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
//                 activeTab === tab.id
//                   ? 'border-primary text-primary'
//                   : 'border-transparent text-muted-foreground hover:text-foreground'
//               }`}
//             >
//               <tab.icon className="h-4 w-4" />
//               <span>{tab.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="p-6">
//         {/* Overview Tab */}
//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
//                     <p className="text-3xl font-bold text-foreground">{analytics?.totalSessions || 0}</p>
//                   </div>
//                   <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
//                     <Users className="h-6 w-6 text-blue-500" />
//                   </div>
//                 </div>
//                 <div className="mt-4 flex items-center text-sm">
//                   <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                   <span className="text-green-500">12% from last week</span>
//                 </div>
//               </div>

//               <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
//                     <p className="text-3xl font-bold text-foreground">{analytics?.activeSessions || 0}</p>
//                   </div>
//                   <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
//                     <Activity className="h-6 w-6 text-green-500" />
//                   </div>
//                 </div>
//                 <div className="mt-4 flex items-center text-sm">
//                   <span className="text-muted-foreground">Currently active conversations</span>
//                 </div>
//               </div>

//               <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
//                     <p className="text-3xl font-bold text-foreground">{Math.round(analytics?.completionRate || 0)}%</p>
//                   </div>
//                   <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
//                     <TrendingUp className="h-6 w-6 text-purple-500" />
//                   </div>
//                 </div>
//                 <div className="mt-4 flex items-center text-sm">
//                   <span className="text-muted-foreground">Conversations completed</span>
//                 </div>
//               </div>

//               <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Integrations</p>
//                     <p className="text-3xl font-bold text-foreground">{tenant?.integrations?.length || 0}</p>
//                   </div>
//                   <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
//                     <Zap className="h-6 w-6 text-orange-500" />
//                   </div>
//                 </div>
//                 <div className="mt-4 flex items-center text-sm">
//                   <span className="text-muted-foreground">Connected services</span>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                 <h3 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h3>
//                 <div className="space-y-3">
//                   {sessions.slice(0, 5).map((session) => (
//                     <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                       <div className="flex items-center space-x-3">
//                         {getStatusIcon(session.status)}
//                         <div>
//                           <p className="text-sm font-medium text-foreground">
//                             {session.platform.charAt(0).toUpperCase() + session.platform.slice(1)} Session
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {formatDate(session.startedAt)}
//                           </p>
//                         </div>
//                       </div>
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         session.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' :
//                         session.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500' :
//                         'bg-muted-foreground/20 text-muted-foreground'
//                       }`}>
//                         {session.status}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                 <h3 className="text-lg font-semibold text-foreground mb-4">Integration Health</h3>
//                 <div className="space-y-3">
//                   {tenant?.integrations?.slice(0, 5).map((integration) => (
//                     <div key={integration.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                       <div className="flex items-center space-x-3">
//                         <span className="text-lg">{getIntegrationIcon(integration.type)}</span>
//                         <div>
//                           <p className="text-sm font-medium text-foreground">{integration.name}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {integration.syncCount} syncs • {integration.errorCount} errors
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {integration.isActive ? (
//                           <CheckCircle className="h-4 w-4 text-green-500" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-500" />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Integrations Tab */}
//         {activeTab === 'integrations' && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
//               <button
//                 onClick={() => setShowAddIntegration(true)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Add Integration</span>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {tenant?.integrations?.map((integration) => (
//                 <div key={integration.id} className="bg-card rounded-xl p-6 shadow-sm border border-border">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
//                       <div>
//                         <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
//                         <p className="text-sm text-muted-foreground">{integration.type}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => setSelectedIntegration(integration)}
//                         className="p-2 text-muted-foreground hover:text-foreground transition-colors"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => deleteIntegration(integration.id)}
//                         className="p-2 text-muted-foreground hover:text-destructive transition-colors"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-muted-foreground">Status</span>
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         integration.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
//                       }`}>
//                         {integration.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-muted-foreground">Syncs</span>
//                       <span className="text-sm font-medium text-foreground">{integration.syncCount}</span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-muted-foreground">Errors</span>
//                       <span className={`text-sm font-medium ${
//                         integration.errorCount > 0 ? 'text-red-500' : 'text-green-500'
//                       }`}>
//                         {integration.errorCount}
//                       </span>
//                     </div>

//                     {integration.lastSyncAt && (
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Last Sync</span>
//                         <span className="text-sm text-foreground">
//                           {formatDate(integration.lastSyncAt)}
//                         </span>
//                       </div>
//                     )}

//                     {integration.lastErrorAt && (
//                       <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
//                         <div className="flex items-center space-x-2">
//                           <AlertTriangle className="h-4 w-4 text-destructive" />
//                           <span className="text-sm font-medium text-destructive-foreground">Last Error</span>
//                         </div>
//                         <p className="text-xs text-destructive-foreground/80 mt-1">
//                           {integration.lastError || 'Unknown error occurred'}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Sessions Tab */}
//         {activeTab === 'sessions' && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-foreground">Conversation Sessions</h2>
//               <div className="flex items-center space-x-4">
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="px-3 py-2 border border-border rounded-lg text-sm bg-input text-foreground"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="ACTIVE">Active</option>
//                   <option value="COMPLETED">Completed</option>
//                   <option value="ERROR">Error</option>
//                 </select>
//                 <select
//                   value={dateRange}
//                   onChange={(e) => setDateRange(e.target.value)}
//                   className="px-3 py-2 border border-border rounded-lg text-sm bg-input text-foreground"
//                 >
//                   <option value="1d">Last 24 hours</option>
//                   <option value="7d">Last 7 days</option>
//                   <option value="30d">Last 30 days</option>
//                 </select>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-muted">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Session
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Platform
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Started
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Last Active
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-card divide-y divide-border">
//                     {sessions.map((session) => (
//                       <tr key={session.id} className="hover:bg-muted/50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>
//                             <div className="text-sm font-medium text-foreground">
//                               {session.sessionId.substring(0, 12)}...
//                             </div>
//                             {session.lastStep && (
//                               <div className="text-sm text-muted-foreground">{session.lastStep}</div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 py-1 text-xs font-medium bg-muted text-foreground rounded-full">
//                             {session.platform}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center space-x-2">
//                             {getStatusIcon(session.status)}
//                             <span className="text-sm text-foreground">{session.status}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                           {formatDate(session.startedAt)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                           {formatDate(session.lastActiveAt)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button className="text-primary hover:text-primary/80 mr-3">
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button className="text-muted-foreground hover:text-foreground">
//                             <ExternalLink className="h-4 w-4" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Logs Tab */}
//         {activeTab === 'logs' && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-foreground">API Logs</h2>
//               <div className="flex items-center space-x-4">
//                 <input
//                   type="text"
//                   placeholder="Search logs..."
//                   className="px-3 py-2 border border-border rounded-lg text-sm bg-input text-foreground"
//                 />
//                 <select className="px-3 py-2 border border-border rounded-lg text-sm bg-input text-foreground">
//                   <option>All Endpoints</option>
//                   <option>Payment-link</option>
//                   <option>Create-contact</option>
//                   <option>Verify-payment</option>
//                 </select>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-muted">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Endpoint
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Method
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Duration
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Integration
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                         Timestamp
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-card divide-y divide-border">
//                     {apiLogs.map((log) => (
//                       <tr key={log.id} className="hover:bg-muted/50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-foreground">
//                             {log.endpoint}
//                           </div>
//                           {log.error && (
//                             <div className="text-sm text-destructive mt-1">{log.error}</div>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                             log.method === 'GET' ? 'bg-blue-500/20 text-blue-500' :
//                             log.method === 'POST' ? 'bg-green-500/20 text-green-500' :
//                             log.method === 'PATCH' ? 'bg-yellow-500/20 text-yellow-500' :
//                             'bg-red-500/20 text-red-500'
//                           }`}>
//                             {log.method}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                             log.statusCode >= 200 && log.statusCode < 300 
//                               ? 'bg-green-500/20 text-green-500'
//                               : log.statusCode >= 400
//                               ? 'bg-red-500/20 text-red-500'
//                               : 'bg-yellow-500/20 text-yellow-500'
//                           }`}>
//                             {log.statusCode}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                           {log.duration ? `${log.duration}ms` : '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                           {log.integration ? (
//                             <div className="flex items-center space-x-2">
//                               <span>{getIntegrationIcon(log.integration.type)}</span>
//                               <span>{log.integration.name}</span>
//                             </div>
//                           ) : (
//                             '-'
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
//                           {formatDate(log.timestamp)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add Integration Modal */}
//       {showAddIntegration && (
//         <AddIntegrationModal
//           onClose={() => setShowAddIntegration(false)}
//           onSubmit={createIntegration}
//         />
//       )}

//       {/* Edit Integration Modal */}
//       {selectedIntegration && (
//         <EditIntegrationModal
//           integration={selectedIntegration}
//           onClose={() => setSelectedIntegration(null)}
//           onSubmit={(updateData) => {
//             updateIntegration(selectedIntegration.id, updateData)
//             setSelectedIntegration(null)
//           }}
//         />
//       )}
//     </div>
//   )
// }

// // Add Integration Modal Component
// const AddIntegrationModal = ({ onClose, onSubmit }: {
//   onClose: () => void
//   onSubmit: (data: any) => void
// }) => {
//   const [formData, setFormData] = useState({
//     type: 'STRIPE',
//     name: '',
//     credentials: {} as Record<string, string>,
//     config: {} as Record<string, any>
//   })
//   const [showCredentials, setShowCredentials] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const integrationTypes = [
//     { value: 'STRIPE', label: 'Stripe', icon: '💳', fields: [
//       { key: 'secretKey', label: 'Secret Key', type: 'password', required: true },
//       { key: 'publishableKey', label: 'Publishable Key', type: 'text', required: true }
//     ]},
//     { value: 'HUBSPOT', label: 'HubSpot', icon: '🟠', fields: [
//       { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
//       { key: 'portalId', label: 'Portal ID', type: 'text', required: false }
//     ]},
//     { value: 'SALESFORCE', label: 'Salesforce', icon: '⚡', fields: [
//       { key: 'clientId', label: 'Client ID', type: 'text', required: true },
//       { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
//       { key: 'instanceUrl', label: 'Instance URL', type: 'text', required: true }
//     ]},
//     { value: 'PIPEDRIVE', label: 'Pipedrive', icon: '🔵', fields: [
//       { key: 'apiToken', label: 'API Token', type: 'password', required: true },
//       { key: 'companyDomain', label: 'Company Domain', type: 'text', required: true }
//     ]}
//   ]

//   const selectedType = integrationTypes.find(t => t.value === formData.type)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       await onSubmit(formData)
//     } catch (error) {
//       console.error('Error creating integration:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateCredential = (key: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       credentials: {
//         ...prev.credentials,
//         [key]: value
//       }
//     }))
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
//         <div className="p-6 border-b border-border">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-foreground">Add Integration</h2>
//             <button
//               onClick={onClose}
//               className="text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <XCircle className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Integration Type */}
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-3">
//               Integration Type
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               {integrationTypes.map((type) => (
//                 <button
//                   key={type.value}
//                   type="button"
//                   onClick={() => setFormData(prev => ({ ...prev, type: type.value, credentials: {} }))}
//                   className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors ${
//                     formData.type === type.value
//                       ? 'border-primary bg-primary/10'
//                       : 'border-border hover:border-foreground/30'
//                   }`}
//                 >
//                   <span className="text-2xl">{type.icon}</span>
//                   <span className="font-medium text-foreground">{type.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Integration Name */}
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Integration Name
//             </label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//               placeholder={`My ${selectedType?.label} Integration`}
//               className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
//               required
//             />
//           </div>

//           {/* Credentials */}
//           {selectedType && (
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="block text-sm font-medium text-foreground">
//                   Credentials
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowCredentials(!showCredentials)}
//                   className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
//                 >
//                   {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   <span>{showCredentials ? 'Hide' : 'Show'}</span>
//                 </button>
//               </div>
//               <div className="space-y-4 p-4 bg-muted rounded-lg">
//                 {selectedType.fields.map((field) => (
//                   <div key={field.key}>
//                     <label className="block text-sm font-medium text-foreground mb-1">
//                       {field.label}
//                       {field.required && <span className="text-destructive ml-1">*</span>}
//                     </label>
//                     <input
//                       type={showCredentials ? 'text' : field.type}
//                       value={formData.credentials[field.key] || ''}
//                       onChange={(e) => updateCredential(field.key, e.target.value)}
//                       placeholder={`Enter your ${field.label.toLowerCase()}`}
//                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
//                       required={field.required}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Security Notice */}
//           <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
//               </div>
//               <div className="text-sm text-primary-foreground">
//                 <p className="font-medium">Your credentials are secure</p>
//                 <p className="mt-1">All API keys and tokens are encrypted before storage and can only be accessed by your Voiceflow automations.</p>
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !formData.name.trim()}
//               className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//             >
//               {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
//               <span>{loading ? 'Creating...' : 'Create Integration'}</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // Edit Integration Modal Component
// const EditIntegrationModal = ({ integration, onClose, onSubmit }: {
//   integration: Integration
//   onClose: () => void
//   onSubmit: (data: any) => void
// }) => {
//   const [formData, setFormData] = useState({
//     name: integration.name,
//     isActive: integration.isActive
//   })
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       await onSubmit(formData)
//     } catch (error) {
//       console.error('Error updating integration:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-card rounded-xl max-w-md w-full border border-border">
//         <div className="p-6 border-b border-border">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-foreground">Edit Integration</h2>
//             <button
//               onClick={onClose}
//               className="text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <XCircle className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Integration Name
//             </label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//               className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
//               required
//             />
//           </div>

//           <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
//             <div>
//               <p className="text-sm font-medium text-foreground">Active Status</p>
//               <p className="text-xs text-muted-foreground mt-1">Enable or disable this integration</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
//                 formData.isActive ? 'bg-primary' : 'bg-muted-foreground/30'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   formData.isActive ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//           </div>

//           <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//             >
//               {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
//               <span>{loading ? 'Updating...' : 'Update Integration'}</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Dashboard








"use client"

import { Suspense, useState } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics } from "@/lib/lead-qualification"
import { UnifiedCRMIntegration } from "../_components/crm/unified"

async function getCRMData(userId: string) {
  try {
    console.log(`Fetching CRM data for user: ${userId}`)

    const [analytics, allLeads] = await Promise.all([
      getPremiumLeadAnalytics(userId).catch((error) => {
        console.error("Error getting analytics:", error)
        return {
          totalLeads: 0,
          qualifiedLeads: 0,
          convertedLeads: 0,
          conversionRate: 0,
          qualificationRate: 0,
          recentInteractions: [],
          revenueMetrics: {
            totalEstimatedRevenue: 0,
            totalExpectedRevenue: 0,
            averageROI: 0,
            revenueGrowth: 0,
          },
          tierDistribution: {
            platinum: 0,
            gold: 0,
            silver: 0,
            bronze: 0,
          },
          premiumInsights: {
            highValueLeads: 0,
            averageLeadValue: 0,
            conversionProbability: 0,
            totalPipelineValue: 0,
          },
          crmStatus: {
            connected: false,
            integrations: [],
            lastSync: null,
          },
        }
      }),

      // Get all leads for CRM integration
      client.lead
        .findMany({
          where: { userId },
          include: {
            qualificationData: true,
            interactions: {
              take: 3,
              orderBy: { timestamp: "desc" },
            },
          },
          orderBy: { lastContactDate: "desc" },
        })
        .catch((error) => {
          console.error("Error getting leads:", error)
          return []
        }),
    ])

    console.log(`Found ${allLeads.length} leads for CRM integration`)

    return {
      analytics,
      allLeads,
    }
  } catch (error) {
    console.error("Error fetching CRM data:", error)
    return {
      analytics: {
        totalLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        qualificationRate: 0,
        recentInteractions: [],
        revenueMetrics: {
          totalEstimatedRevenue: 0,
          totalExpectedRevenue: 0,
          averageROI: 0,
          revenueGrowth: 0,
        },
        tierDistribution: {
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
        },
        premiumInsights: {
          highValueLeads: 0,
          averageLeadValue: 0,
          conversionProbability: 0,
          totalPipelineValue: 0,
        },
        crmStatus: {
          connected: false,
          integrations: [],
          lastSync: null,
        },
      },
      allLeads: [],
    }
  }
}

function CRMIntegrationPage({ userId, analytics, allLeads }: any) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  const handleLeadSelectionChange = (leads: string[]) => {
    setSelectedLeads(leads)
  }

  return (
    <UnifiedCRMIntegration
      userId={userId}
      analytics={analytics}
      selectedLeads={selectedLeads}
      onLeadSelectionChange={handleLeadSelectionChange}
    />
  )
}

export default async function CRMPage() {
  const user = await onUserInfor()

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const { analytics, allLeads } = await getCRMData(user.data.id)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">CRM Integration</h1>
          <p className="text-muted-foreground mt-2">Connect and sync your leads with your favorite CRM platform</p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <div className="text-center">
                  <p className="text-lg font-medium">Loading CRM Integration...</p>
                  <p className="text-sm text-muted-foreground">Preparing your CRM connection interface</p>
                </div>
              </div>
            </div>
          }
        >
          <CRMIntegrationPage userId={user.data.id} analytics={analytics} allLeads={allLeads} />
        </Suspense>
      </div>
    </div>
  )
}
