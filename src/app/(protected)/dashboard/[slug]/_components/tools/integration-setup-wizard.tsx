"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import type { IntegrationDefinition, WebhookConfig } from "@/types/integration"
import { EnvironmentSelector } from "./environment-selector"
import { WebhookConfiguration } from "./webhook-configuration"
import { CredentialValidatorComponent } from "./credential-validator"
import { OAuthFlow } from "./oauth-flow"

interface IntegrationSetupWizardProps {
  integration: IntegrationDefinition
  onComplete: (config: IntegrationConfig) => void
  onCancel: () => void
}

interface IntegrationConfig {
  credentials: Record<string, string>
  environment: string
  webhookConfig?: WebhookConfig
  oauthTokens?: {
    access_token: string
    refresh_token?: string
    expires_in?: number
  }
}

interface ValidationResults {
  overall: boolean
  results: Array<{
    field: string
    valid: boolean
    error?: string
    warning?: string
  }>
  apiTestResult?: {
    success: boolean
    message: string
    responseTime?: number
  }
}

export function IntegrationSetupWizard({ integration, onComplete, onCancel }: IntegrationSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<IntegrationConfig>({
    credentials: {},
    environment: integration.environments?.[0]?.name || "production",
  })
  const [validationResults, setValidationResults] = useState<ValidationResults>({ overall: false, results: [] })
  const [isConnecting, setIsConnecting] = useState(false)

  const steps = [
    {
      id: "environment",
      title: "Environment",
      description: "Select your environment",
      required: !!integration.environments?.length,
    },
    {
      id: "authentication",
      title: "Authentication",
      description: integration.authType === "oauth2" ? "OAuth Authorization" : "API Credentials",
      required: true,
    },
    {
      id: "validation",
      title: "Validation",
      description: "Verify credentials",
      required: true,
    },
    {
      id: "webhooks",
      title: "Webhooks",
      description: "Configure webhooks (optional)",
      required: false,
    },
  ].filter((step) => step.required || (step.id === "webhooks" && integration.webhookSupport))

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsConnecting(true)
    try {
      // Final validation before completing
      if (!validationResults.overall) {
        throw new Error("Please ensure all credentials are valid before completing setup")
      }

      await onComplete(config)
    } catch (error) {
      console.error("Setup completion error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const canProceed = () => {
    switch (currentStepData.id) {
      case "environment":
        return !!config.environment
      case "authentication":
        if (integration.authType === "oauth2") {
          return !!config.oauthTokens?.access_token
        }
        return integration.fields.filter((f) => f.required).every((f) => config.credentials[f.key])
      case "validation":
        return validationResults.overall
      case "webhooks":
        return true // Optional step
      default:
        return true
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <integration.icon className="h-5 w-5" />
                Setup {integration.name}
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}: {currentStepData.description}
              </CardDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Environment Selection */}
        {currentStepData.id === "environment" && integration.environments && (
          <EnvironmentSelector
            environments={integration.environments}
            selectedEnvironment={config.environment}
            onEnvironmentChange={(env) => setConfig({ ...config, environment: env })}
            integrationName={integration.name}
          />
        )}

        {/* Authentication */}
        {currentStepData.id === "authentication" && (
          <>
            {integration.authType === "oauth2" ? (
              <OAuthFlow
                integration={integration}
                onSuccess={(tokens) => {
                  setConfig({ ...config, oauthTokens: tokens })
                  handleNext()
                }}
                onError={(error) => {
                  console.error("OAuth error:", error)
                }}
              />
            ) : (
              <CredentialValidatorComponent
                integration={integration}
                credentials={config.credentials}
                environment={config.environment}
                onValidationComplete={(results) => setValidationResults(results)}
                onCredentialChange={(key, value) => {
                  setConfig({
                    ...config,
                    credentials: { ...config.credentials, [key]: value },
                  })
                }}
              />
            )}
          </>
        )}

        {/* Validation */}
        {currentStepData.id === "validation" && integration.authType !== "oauth2" && (
          <CredentialValidatorComponent
            integration={integration}
            credentials={config.credentials}
            environment={config.environment}
            onValidationComplete={(results) => setValidationResults(results)}
            onCredentialChange={(key, value) => {
              setConfig({
                ...config,
                credentials: { ...config.credentials, [key]: value },
              })
            }}
          />
        )}

        {/* Webhook Configuration */}
        {currentStepData.id === "webhooks" && integration.webhookSupport && (
          <WebhookConfiguration
            integrationName={integration.name}
            integrationType={integration.type}
            webhookConfig={config.webhookConfig}
            onWebhookConfigChange={(webhookConfig) => {
              setConfig({ ...config, webhookConfig })
            }}
            environment={config.environment}
          />
        )}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={currentStep === 0 ? onCancel : handlePrevious} disabled={isConnecting}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? "Cancel" : "Previous"}
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index < currentStep
                      ? "bg-emerald-500"
                      : index === currentStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Button onClick={isLastStep ? handleComplete : handleNext} disabled={!canProceed() || isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isLastStep ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
