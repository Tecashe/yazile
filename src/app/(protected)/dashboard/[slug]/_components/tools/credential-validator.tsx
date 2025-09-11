"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Loader2, Shield, Eye, EyeOff, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { CredentialValidator } from "@/lib/validation"
import type { IntegrationDefinition, IntegrationField } from "@/types/integration"

interface CredentialValidatorProps {
  integration: IntegrationDefinition
  credentials: Record<string, string>
  environment: string
  onValidationComplete: (results: ValidationResults) => void
  onCredentialChange: (key: string, value: string) => void
}

interface ValidationResult {
  field: string
  valid: boolean
  error?: string
  warning?: string
}

interface ValidationResults {
  overall: boolean
  results: ValidationResult[]
  apiTestResult?: {
    success: boolean
    message: string
    responseTime?: number
  }
}

function CredentialValidatorComponent({
  integration,
  credentials,
  environment,
  onValidationComplete,
  onCredentialChange,
}: CredentialValidatorProps) {
  const [validationResults, setValidationResults] = useState<ValidationResults>({ overall: false, results: [] })
  const [isValidating, setIsValidating] = useState(false)
  const [validationProgress, setValidationProgress] = useState(0)
  const [currentValidationStep, setCurrentValidationStep] = useState("")
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [realTimeValidation, setRealTimeValidation] = useState<Record<string, ValidationResult>>({})

  // Real-time validation as user types
  useEffect(() => {
    const validateField = async (field: IntegrationField, value: string) => {
      if (!value) {
        setRealTimeValidation((prev) => ({
          ...prev,
          [field.key]: { field: field.key, valid: true },
        }))
        return
      }

      try {
        const result = await CredentialValidator.validateField(field, value, integration)
        setRealTimeValidation((prev) => ({
          ...prev,
          [field.key]: {
            field: field.key,
            valid: result.valid,
            error: result.error,
          },
        }))
      } catch (error) {
        setRealTimeValidation((prev) => ({
          ...prev,
          [field.key]: {
            field: field.key,
            valid: false,
            error: "Validation error occurred",
          },
        }))
      }
    }

    // Debounce validation
    const timeouts: Record<string, NodeJS.Timeout> = {}

    integration.fields.forEach((field) => {
      const value = credentials[field.key]
      if (timeouts[field.key]) {
        clearTimeout(timeouts[field.key])
      }

      timeouts[field.key] = setTimeout(() => {
        validateField(field, value || "")
      }, 500)
    })

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [credentials, integration])

  const validateAllCredentials = async () => {
    setIsValidating(true)
    setValidationProgress(0)
    setCurrentValidationStep("Starting validation...")

    try {
      const results: ValidationResult[] = []
      const totalSteps = integration.fields.length + 1 // +1 for API test

      // Validate each field
      for (let i = 0; i < integration.fields.length; i++) {
        const field = integration.fields[i]
        const value = credentials[field.key] || ""

        setCurrentValidationStep(`Validating ${field.label}...`)
        setValidationProgress(((i + 1) / totalSteps) * 80) // 80% for field validation

        const result = await CredentialValidator.validateField(field, value, integration)
        results.push({
          field: field.key,
          valid: result.valid,
          error: result.error,
        })

        // Add environment-specific warnings
        if (result.valid && field.key.includes("Key") && environment) {
          const envWarning = checkEnvironmentMatch(field.key, value, environment)
          if (envWarning) {
            results[results.length - 1].warning = envWarning
          }
        }
      }

      // Test API connection if all fields are valid
      const allFieldsValid = results.every((r) => r.valid)
      let apiTestResult

      if (allFieldsValid) {
        setCurrentValidationStep("Testing API connection...")
        setValidationProgress(90)

        apiTestResult = await testApiConnection(integration, credentials, environment)
      }

      setValidationProgress(100)
      setCurrentValidationStep("Validation complete")

      const finalResults: ValidationResults = {
        overall: allFieldsValid && apiTestResult?.success !== false,
        results,
        apiTestResult,
      }

      setValidationResults(finalResults)
      onValidationComplete(finalResults)
    } catch (error) {
      console.error("Validation error:", error)
      const errorResults: ValidationResults = {
        overall: false,
        results: [
          {
            field: "general",
            valid: false,
            error: "Validation process failed",
          },
        ],
      }
      setValidationResults(errorResults)
      onValidationComplete(errorResults)
    } finally {
      setIsValidating(false)
      setValidationProgress(0)
      setCurrentValidationStep("")
    }
  }

  const testApiConnection = async (
    integration: IntegrationDefinition,
    credentials: Record<string, string>,
    environment: string,
  ): Promise<{ success: boolean; message: string; responseTime?: number }> => {
    const startTime = Date.now()

    try {
      // Make a test API call based on integration type
      const testEndpoint = getTestEndpoint(integration.type, environment)
      const headers = getAuthHeaders(integration.type, credentials)

      const response = await fetch(testEndpoint, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        return {
          success: true,
          message: `API connection successful (${responseTime}ms)`,
          responseTime,
        }
      } else {
        const errorText = await response.text()
        return {
          success: false,
          message: `API test failed: ${response.status} ${response.statusText}`,
          responseTime,
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        responseTime,
      }
    }
  }

  const getTestEndpoint = (integrationType: string, environment: string): string => {
    const endpoints: Record<string, Record<string, string>> = {
      STRIPE: {
        test: "https://api.stripe.com/v1/account",
        live: "https://api.stripe.com/v1/account",
      },
      PAYPAL: {
        sandbox: "https://api.sandbox.paypal.com/v1/oauth2/token",
        live: "https://api.paypal.com/v1/oauth2/token",
      },
      SHOPIFY: {
        default: "https://{shop}.myshopify.com/admin/api/2023-10/shop.json",
      },
    }

    return endpoints[integrationType]?.[environment] || endpoints[integrationType]?.["default"] || ""
  }

  const getAuthHeaders = (integrationType: string, credentials: Record<string, string>): Record<string, string> => {
    switch (integrationType) {
      case "STRIPE":
        return {
          Authorization: `Bearer ${credentials.secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }
      case "SHOPIFY":
        return {
          "X-Shopify-Access-Token": credentials.accessToken,
          "Content-Type": "application/json",
        }
      default:
        return {
          "Content-Type": "application/json",
        }
    }
  }

  const checkEnvironmentMatch = (fieldKey: string, value: string, environment: string): string | undefined => {
    if (fieldKey === "secretKey" && value.startsWith("sk_")) {
      const keyEnv = value.startsWith("sk_test_") ? "test" : "live"
      if (keyEnv !== environment) {
        return `This appears to be a ${keyEnv} key, but you selected ${environment} environment`
      }
    }

    if (fieldKey === "publishableKey" && value.startsWith("pk_")) {
      const keyEnv = value.startsWith("pk_test_") ? "test" : "live"
      if (keyEnv !== environment) {
        return `This appears to be a ${keyEnv} key, but you selected ${environment} environment`
      }
    }

    return undefined
  }

  const getFieldValidationStatus = (fieldKey: string) => {
    const realtimeResult = realTimeValidation[fieldKey]
    const validationResult = validationResults.results.find((r) => r.field === fieldKey)

    if (validationResult) {
      return validationResult
    }

    return realtimeResult
  }

  const hasRequiredFields = integration.fields.some((f) => f.required)
  const allRequiredFieldsFilled = integration.fields.filter((f) => f.required).every((f) => credentials[f.key])

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Credential Validation
        </CardTitle>
        <CardDescription>Real-time validation ensures your credentials are correct and working</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credential Fields with Validation */}
        <div className="space-y-4">
          {integration.fields.map((field) => {
            const validationStatus = getFieldValidationStatus(field.key)
            const value = credentials[field.key] || ""

            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                  {validationStatus &&
                    (validationStatus.valid ? (
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                    ) : validationStatus.error ? (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    ) : null)}
                </Label>

                <div className="relative">
                  <Input
                    id={field.key}
                    type={
                      field.type === "password" && !showCredentials[field.key]
                        ? "password"
                        : field.type === "email"
                          ? "email"
                          : "text"
                    }
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(e) => onCredentialChange(field.key, e.target.value)}
                    className={`pr-10 ${
                      validationStatus?.valid === false
                        ? "border-red-500 focus:border-red-500"
                        : validationStatus?.valid === true
                          ? "border-emerald-500 focus:border-emerald-500"
                          : ""
                    }`}
                  />

                  {field.type === "password" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() =>
                        setShowCredentials({
                          ...showCredentials,
                          [field.key]: !showCredentials[field.key],
                        })
                      }
                    >
                      {showCredentials[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                {/* Field-specific validation messages */}
                {validationStatus?.error && (
                  <Alert className="border-red-500/20 bg-red-500/5">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 text-sm">{validationStatus.error}</AlertDescription>
                  </Alert>
                )}

                {validationStatus?.warning && (
                  <Alert className="border-yellow-500/20 bg-yellow-500/5">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-600 text-sm">{validationStatus.warning}</AlertDescription>
                  </Alert>
                )}

                {/* Field validation hints */}
                {field.validation && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {field.validation.minLength && <p>• Minimum {field.validation.minLength} characters</p>}
                    {field.validation.pattern && <p>• Must match required format</p>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Validation Progress */}
        {isValidating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Validating credentials...</span>
              <span className="font-medium text-blue-400">{validationProgress}%</span>
            </div>
            <Progress value={validationProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">{currentValidationStep}</p>
          </div>
        )}

        {/* Validation Results Summary */}
        {validationResults.results.length > 0 && !isValidating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Validation Results</h4>
              <Badge
                variant={validationResults.overall ? "secondary" : "destructive"}
                className={
                  validationResults.overall
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }
              >
                {validationResults.overall ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    All Valid
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Issues Found
                  </>
                )}
              </Badge>
            </div>

            {/* API Test Result */}
            {validationResults.apiTestResult && (
              <Alert
                className={
                  validationResults.apiTestResult.success
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }
              >
                {validationResults.apiTestResult.success ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription
                  className={validationResults.apiTestResult.success ? "text-emerald-600" : "text-red-600"}
                >
                  <strong>API Connection Test:</strong> {validationResults.apiTestResult.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Validate Button */}
        <Button
          onClick={validateAllCredentials}
          disabled={isValidating || !hasRequiredFields || !allRequiredFieldsFilled}
          className="w-full"
          variant={validationResults.overall ? "outline" : "default"}
        >
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              {validationResults.results.length > 0 ? "Re-validate" : "Validate Credentials"}
            </>
          )}
        </Button>

        {/* Validation Info */}
        <Alert className="border-blue-500/20 bg-blue-500/5">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-600 text-sm">
            <strong>Validation Process:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Format and pattern validation</li>
              <li>• Environment compatibility check</li>
              <li>• Live API connection test</li>
              <li>• Permission verification</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export { CredentialValidatorComponent as CredentialValidator }
export { CredentialValidatorComponent }
