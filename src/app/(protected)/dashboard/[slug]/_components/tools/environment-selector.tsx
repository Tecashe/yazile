"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Globe, TestTube, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react"
import type { EnvironmentConfig } from "@/types/integration"

interface EnvironmentSelectorProps {
  environments: EnvironmentConfig[]
  selectedEnvironment: string
  onEnvironmentChange: (environment: string) => void
  integrationName: string
}

export function EnvironmentSelector({
  environments,
  selectedEnvironment,
  onEnvironmentChange,
  integrationName,
}: EnvironmentSelectorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getEnvironmentIcon = (envName: string) => {
    switch (envName.toLowerCase()) {
      case "production":
      case "live":
        return <Globe className="h-4 w-4" />
      case "sandbox":
      case "test":
      case "development":
        return <TestTube className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getEnvironmentColor = (envName: string) => {
    switch (envName.toLowerCase()) {
      case "production":
      case "live":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "sandbox":
      case "test":
      case "development":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const isProductionEnvironment = (envName: string) => {
    return ["production", "live"].includes(envName.toLowerCase())
  }

  const selectedEnv = environments.find((env) => env.name === selectedEnvironment)

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Environment Configuration
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Select the environment for your {integrationName} integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Selection */}
        <RadioGroup value={selectedEnvironment} onValueChange={onEnvironmentChange}>
          <div className="space-y-3">
            {environments.map((env) => (
              <div key={env.name} className="flex items-start space-x-3">
                <RadioGroupItem value={env.name} id={env.name} className="mt-1" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor={env.name} className="flex items-center gap-2 cursor-pointer">
                    {getEnvironmentIcon(env.name)}
                    <span className="font-medium">{env.label}</span>
                    <Badge variant="secondary" className={getEnvironmentColor(env.name)}>
                      {env.name}
                    </Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">{env.description}</p>
                  {env.baseUrl && showDetails && (
                    <div className="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded">
                      Base URL: {env.baseUrl}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Production Warning */}
        {selectedEnv && isProductionEnvironment(selectedEnv.name) && (
          <Alert className="border-yellow-500/20 bg-yellow-500/5">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-600">
              <strong>Production Environment Selected</strong>
              <br />
              You're connecting to the live {integrationName} environment. All actions will affect real data and may
              incur charges.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Environment Info */}
        {selectedEnv && !isProductionEnvironment(selectedEnv.name) && (
          <Alert className="border-blue-500/20 bg-blue-500/5">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-600">
              <strong>Test Environment Selected</strong>
              <br />
              You're connecting to the {integrationName} sandbox. This is safe for testing and development.
            </AlertDescription>
          </Alert>
        )}

        {/* Environment Details */}
        {showDetails && selectedEnv && (
          <div className="space-y-3 p-3 rounded-lg bg-muted/20 border">
            <h4 className="font-medium text-sm">Environment Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-mono">{selectedEnv.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{isProductionEnvironment(selectedEnv.name) ? "Production" : "Development"}</span>
              </div>
              {selectedEnv.baseUrl && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Base URL:</span>
                  <span className="ml-2 font-mono text-xs">{selectedEnv.baseUrl}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Credential Matching Warning */}
        <Alert className="border-orange-500/20 bg-orange-500/5">
          <Info className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-600">
            <strong>Important:</strong> Ensure your API credentials match the selected environment. Production
            credentials won't work in sandbox and vice versa.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
