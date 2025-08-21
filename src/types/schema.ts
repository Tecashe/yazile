import type {
    AutomationGoalsData,
    CustomerJourneyData,
    FeatureSelectionData,
    BusinessTypeData,
    WebsiteAnalysisData,
  } from "./business" // Update this path
  
  export interface FormSchema {
  id?: string
  name?: string
  businessName: string
  businessType: string
  businessDescription: string
  website: string
  responseLanguage: string
  }
  
  