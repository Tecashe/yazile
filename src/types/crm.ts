export interface CrmSyncSettings {
  id: string
  userId: string
  autoSyncQualified: boolean
  createDealsHighValue: boolean
  syncLeadScores: boolean
  realTimeSync: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CrmSyncSettingsUpdate {
  autoSyncQualified: boolean
  createDealsHighValue: boolean
  syncLeadScores: boolean
  realTimeSync: boolean
}

export interface CrmSyncSettingsResponse {
  success: boolean
  settings: CrmSyncSettingsUpdate
  error?: string
}
