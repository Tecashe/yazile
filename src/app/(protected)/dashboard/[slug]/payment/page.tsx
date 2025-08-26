
'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  BarChart3, 
  Settings, 
  Zap, 
  Users, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Calendar,
  ExternalLink
} from 'lucide-react'

// Types
interface Tenant {
  id: string
  name: string
  domain?: string
  isActive: boolean
  integrations: Integration[]
}

interface Integration {
  id: string
  type: string
  name: string
  isActive: boolean
  lastSyncAt?: string
  lastErrorAt?: string
  lastError?: string
  syncCount: number
  errorCount: number
  hasValidToken: boolean
  tokenExpiresAt?: string
}

interface Session {
  id: string
  sessionId: string
  userId?: string
  platform: string
  status: string
  startedAt: string
  lastActiveAt: string
  endedAt?: string
  lastStep?: string
}

interface Analytics {
  totalSessions: number
  activeSessions: number
  completedSessions: number
  completionRate: number
  sessionsByPlatform: { platform: string; count: number }[]
}

interface ApiLog {
  id: string
  endpoint: string
  method: string
  statusCode: number
  duration?: number
  timestamp: string
  error?: string
  integration?: { name: string; type: string }
}

const Dashboard = () => {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddIntegration, setShowAddIntegration] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('7d')
  const [sessionPage, setSessionPage] = useState(1)
  const [logPage, setLogPage] = useState(1)

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessions()
    } else if (activeTab === 'logs') {
      loadLogs()
    }
  }, [activeTab, sessionPage, logPage, filterStatus, dateRange])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const tenantRes = await fetch('/api/dashboard/tenant')
      
      if (!tenantRes.ok) {
        throw new Error('Failed to load tenant data')
      }

      const tenantData = await tenantRes.json()
      setTenant(tenantData.tenant)

      // Load initial sessions for overview
      await loadSessions(1, 10)
      await loadLogs(1, 20)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadSessions = async (page = sessionPage, limit = 50) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (filterStatus !== 'all') params.append('status', filterStatus)
      
      // Convert dateRange to actual dates
      const endDate = new Date()
      const startDate = new Date()
      const days = parseInt(dateRange.replace('d', ''))
      startDate.setDate(startDate.getDate() - days)
      
      params.append('startDate', startDate.toISOString())
      params.append('endDate', endDate.toISOString())

      const response = await fetch(`/api/dashboard/sessions?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
        setAnalytics(data.analytics)
      }
    } catch (err) {
      console.error('Failed to load sessions:', err)
    }
  }

  const loadLogs = async (page = logPage, limit = 100) => {
    try {
      const params = new URLSearchParams({
        type: 'api',
        page: page.toString(),
        limit: limit.toString(),
      })
      
      // Convert dateRange to actual dates
      const endDate = new Date()
      const startDate = new Date()
      const days = parseInt(dateRange.replace('d', ''))
      startDate.setDate(startDate.getDate() - days)
      
      params.append('startDate', startDate.toISOString())
      params.append('endDate', endDate.toISOString())

      const response = await fetch(`/api/dashboard/logs?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setApiLogs(data.logs || [])
      }
    } catch (err) {
      console.error('Failed to load logs:', err)
    }
  }

  const createIntegration = async (integrationData: any) => {
    try {
      const response = await fetch('/api/dashboard/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrationData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create integration')
      }

      await loadDashboardData()
      setShowAddIntegration(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create integration')
    }
  }

  const updateIntegration = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/dashboard/integrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update integration')
      }

      await loadDashboardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update integration')
    }
  }

  const deleteIntegration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return

    try {
      const response = await fetch(`/api/dashboard/integrations/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete integration')
      }

      await loadDashboardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete integration')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error loading dashboard</span>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'STRIPE': return '💳'
      case 'HUBSPOT': return '🟠'
      case 'SALESFORCE': return '⚡'
      case 'PIPEDRIVE': return '🔵'
      default: return '🔧'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              {tenant?.name || 'Your Workspace'} • Voiceflow Integration
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'integrations', label: 'Integrations', icon: Zap },
            { id: 'sessions', label: 'Sessions', icon: MessageSquare },
            { id: 'logs', label: 'Logs', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalSessions || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">12% from last week</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.activeSessions || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">Currently active conversations</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{Math.round(analytics?.completionRate || 0)}%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">Conversations completed</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Integrations</p>
                    <p className="text-3xl font-bold text-gray-900">{tenant?.integrations?.length || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">Connected services</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(session.status)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.platform.charAt(0).toUpperCase() + session.platform.slice(1)} Session
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(session.startedAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Health</h3>
                <div className="space-y-3">
                  {tenant?.integrations?.slice(0, 5).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getIntegrationIcon(integration.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                          <p className="text-xs text-gray-500">
                            {integration.syncCount} syncs • {integration.errorCount} errors
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {integration.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
              <button
                onClick={() => setShowAddIntegration(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Integration</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenant?.integrations?.map((integration) => (
                <div key={integration.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedIntegration(integration)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteIntegration(integration.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        integration.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {integration.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Syncs</span>
                      <span className="text-sm font-medium text-gray-900">{integration.syncCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Errors</span>
                      <span className={`text-sm font-medium ${
                        integration.errorCount > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {integration.errorCount}
                      </span>
                    </div>

                    {integration.lastSyncAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Sync</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(integration.lastSyncAt)}
                        </span>
                      </div>
                    )}

                    {integration.lastErrorAt && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-800">Last Error</span>
                        </div>
                        <p className="text-xs text-red-700 mt-1">
                          {integration.lastError || 'Unknown error occurred'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Conversation Sessions</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ERROR">Error</option>
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Started
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session.sessionId.substring(0, 12)}...
                            </div>
                            {session.lastStep && (
                              <div className="text-sm text-gray-500">{session.lastStep}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {session.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(session.status)}
                            <span className="text-sm text-gray-900">{session.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(session.startedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(session.lastActiveAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">API Logs</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Endpoints</option>
                  <option>/stripe/payment-link</option>
                  <option>/crm/create-contact</option>
                  <option>/stripe/verify-payment</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Integration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {log.endpoint}
                          </div>
                          {log.error && (
                            <div className="text-sm text-red-600 mt-1">{log.error}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            log.method === 'POST' ? 'bg-green-100 text-green-800' :
                            log.method === 'PATCH' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.statusCode >= 200 && log.statusCode < 300 
                              ? 'bg-green-100 text-green-800'
                              : log.statusCode >= 400
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.duration ? `${log.duration}ms` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.integration ? (
                            <div className="flex items-center space-x-2">
                              <span>{getIntegrationIcon(log.integration.type)}</span>
                              <span>{log.integration.name}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Integration Modal */}
      {showAddIntegration && (
        <AddIntegrationModal
          onClose={() => setShowAddIntegration(false)}
          onSubmit={createIntegration}
        />
      )}

      {/* Edit Integration Modal */}
      {selectedIntegration && (
        <EditIntegrationModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onSubmit={(updateData) => {
            updateIntegration(selectedIntegration.id, updateData)
            setSelectedIntegration(null)
          }}
        />
      )}
    </div>
  )
}

// Add Integration Modal Component
const AddIntegrationModal = ({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (data: any) => void
}) => {
  const [formData, setFormData] = useState({
    type: 'STRIPE',
    name: '',
    credentials: {} as Record<string, string>,
    config: {} as Record<string, any>
  })
  const [showCredentials, setShowCredentials] = useState(false)
  const [loading, setLoading] = useState(false)

  const integrationTypes = [
    { value: 'STRIPE', label: 'Stripe', icon: '💳', fields: [
      { key: 'secretKey', label: 'Secret Key', type: 'password', required: true },
      { key: 'publishableKey', label: 'Publishable Key', type: 'text', required: true }
    ]},
    { value: 'HUBSPOT', label: 'HubSpot', icon: '🟠', fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
      { key: 'portalId', label: 'Portal ID', type: 'text', required: false }
    ]},
    { value: 'SALESFORCE', label: 'Salesforce', icon: '⚡', fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'instanceUrl', label: 'Instance URL', type: 'text', required: true }
    ]},
    { value: 'PIPEDRIVE', label: 'Pipedrive', icon: '🔵', fields: [
      { key: 'apiToken', label: 'API Token', type: 'password', required: true },
      { key: 'companyDomain', label: 'Company Domain', type: 'text', required: true }
    ]}
  ]

  const selectedType = integrationTypes.find(t => t.value === formData.type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error creating integration:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCredential = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [key]: value
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add Integration</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Integration Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Integration Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {integrationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value, credentials: {} }))}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium text-gray-900">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Integration Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Integration Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`My ${selectedType?.label} Integration`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Credentials */}
          {selectedType && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Credentials
                </label>
                <button
                  type="button"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showCredentials ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                {selectedType.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type={showCredentials ? 'text' : field.type}
                      value={formData.credentials[field.key] || ''}
                      onChange={(e) => updateCredential(field.key, e.target.value)}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={field.required}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Your credentials are secure</p>
                <p className="mt-1">All API keys and tokens are encrypted before storage and can only be accessed by your Voiceflow automations.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Creating...' : 'Create Integration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Integration Modal Component
const EditIntegrationModal = ({ integration, onClose, onSubmit }: {
  integration: Integration
  onClose: () => void
  onSubmit: (data: any) => void
}) => {
  const [formData, setFormData] = useState({
    name: integration.name,
    isActive: integration.isActive
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error updating integration:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Integration</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Integration Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Active Status</p>
              <p className="text-xs text-gray-500 mt-1">Enable or disable this integration</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.isActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Updating...' : 'Update Integration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Dashboard