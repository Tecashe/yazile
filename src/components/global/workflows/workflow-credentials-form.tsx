"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, PlusCircle, KeyRound, Trash, Check, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface WorkflowCredentialsFormProps {
  workflowId: string
  requiredIntegrations: string[]
  existingCredentials: Array<{
    id: string
    name: string
    type: string
  }>
  onUpdate?: () => void
}

// Credential type options based on integration type
const CREDENTIAL_TYPES: Record<string, Array<{ value: string; label: string }>> = {
  // Example credential types
  API: [
    { value: "api_key", label: "API Key" },
    { value: "oauth2", label: "OAuth 2.0" },
    { value: "basic_auth", label: "Basic Authentication" },
  ],
  DATABASE: [
    { value: "connection_string", label: "Connection String" },
    { value: "username_password", label: "Username/Password" },
  ],
  PAYMENT: [
    { value: "api_key", label: "API Key" },
    { value: "secret_key", label: "Secret Key" },
  ],
  EMAIL: [
    { value: "smtp", label: "SMTP" },
    { value: "api_key", label: "API Key" },
  ],
  STORAGE: [
    { value: "access_key", label: "Access Key" },
    { value: "connection_string", label: "Connection String" },
  ],
  // Add more types as needed
  DEFAULT: [
    { value: "api_key", label: "API Key" },
    { value: "oauth2", label: "OAuth 2.0" },
    { value: "secret_key", label: "Secret Key" },
    { value: "username_password", label: "Username/Password" },
  ],
}

// Map integration name to category
const getIntegrationCategory = (integration: string): string => {
  const integrationUppercase = integration.toUpperCase()
  if (integrationUppercase.includes("DATABASE") || integrationUppercase.includes("SQL")) return "DATABASE"
  if (integrationUppercase.includes("PAYMENT") || integrationUppercase.includes("STRIPE")) return "PAYMENT"
  if (integrationUppercase.includes("EMAIL") || integrationUppercase.includes("MAIL")) return "EMAIL"
  if (integrationUppercase.includes("STORAGE") || integrationUppercase.includes("S3")) return "STORAGE"
  if (integrationUppercase.includes("API")) return "API"
  return "DEFAULT"
}

export function WorkflowCredentialsForm({
  workflowId,
  requiredIntegrations,
  existingCredentials,
  onUpdate,
}: WorkflowCredentialsFormProps) {
  const router = useRouter()

  // State
  const [isAddingCredential, setIsAddingCredential] = useState(false)
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New credential state
  const [newCredential, setNewCredential] = useState({
    name: "",
    type: "",
    value: "",
    expiresAt: "",
  })

  // Handle adding a new credential
  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCredential.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a name for the credential",
        variant: "destructive",
      })
      return
    }

    if (!newCredential.type) {
      toast({
        title: "Missing information",
        description: "Please select a credential type",
        variant: "destructive",
      })
      return
    }

    if (!newCredential.value.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter the credential value",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowId}/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCredential.name.trim(),
          type: newCredential.type,
          value: newCredential.value.trim(),
          expiresAt: newCredential.expiresAt ? new Date(newCredential.expiresAt) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add credential")
      }

      toast({
        title: "Credential added",
        description: "Your credential has been added successfully",
      })

      // Reset form and close dialog
      setNewCredential({
        name: "",
        type: "",
        value: "",
        expiresAt: "",
      })
      setIsAddingCredential(false)

      // Trigger parent update callback
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error adding credential:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting a credential
  const handleDeleteCredential = async () => {
    if (!credentialToDelete) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowId}/credentials/${credentialToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete credential")
      }

      toast({
        title: "Credential deleted",
        description: "Your credential has been deleted successfully",
      })

      // Close dialog and clear selection
      setCredentialToDelete(null)

      // Trigger parent update callback
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error deleting credential:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get credential types for the selected integration
  const getCredentialTypes = (integration: string) => {
    const category = getIntegrationCategory(integration)
    return CREDENTIAL_TYPES[category] || CREDENTIAL_TYPES.DEFAULT
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Credentials</h2>
        <p className="text-sm text-muted-foreground">Manage secure credentials for your workflow</p>
      </div>

      {/* Required Integrations */}
      {requiredIntegrations && requiredIntegrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Required Integrations</CardTitle>
            <CardDescription>This workflow requires credentials for the following integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {requiredIntegrations.map((integration) => {
                const hasCredential = existingCredentials.some(
                  (cred) =>
                    cred.name.toLowerCase().includes(integration.toLowerCase()) ||
                    cred.type.toLowerCase().includes(integration.toLowerCase()),
                )

                return (
                  <li key={integration} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                      <span>{integration}</span>
                    </div>
                    {hasCredential ? (
                      <span className="text-green-600 flex items-center text-sm">
                        <Check className="h-4 w-4 mr-1" /> Configured
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewCredential({
                            ...newCredential,
                            name: `${integration} Credential`,
                          })
                          setIsAddingCredential(true)
                        }}
                      >
                        Configure
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Existing Credentials */}
      <Card>
        <CardHeader>
          <CardTitle>Stored Credentials</CardTitle>
          <CardDescription>Securely stored credentials for this workflow</CardDescription>
        </CardHeader>
        <CardContent>
          {existingCredentials && existingCredentials.length > 0 ? (
            <ul className="space-y-3">
              {existingCredentials.map((credential) => (
                <li key={credential.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{credential.name}</div>
                    <div className="text-sm text-muted-foreground">{credential.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the credential &quot;{credential.name}&quot;. This action
                            cannot be undone and may cause your workflow to stop working.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.preventDefault()
                              setCredentialToDelete(credential.id)
                              handleDeleteCredential()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isSubmitting && credentialToDelete === credential.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="mr-2 h-4 w-4" />
                            )}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-muted-foreground">No credentials configured yet</div>
          )}
        </CardContent>
        <CardFooter>
          <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Credential
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Credential</DialogTitle>
                <DialogDescription>
                  Add a new credential for your workflow. Credentials are stored securely and encrypted.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddCredential} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="credential-name">Credential Name</Label>
                  <Input
                    id="credential-name"
                    placeholder="e.g., API Key for Service X"
                    value={newCredential.name}
                    onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential-type">Credential Type</Label>
                  <Select
                    value={newCredential.type}
                    onValueChange={(value) => setNewCredential({ ...newCredential, type: value })}
                  >
                    <SelectTrigger id="credential-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requiredIntegrations && requiredIntegrations.length > 0 ? (
                        <>
                          {requiredIntegrations.map((integration) => (
                            <SelectItem key={integration} value={integration} disabled>
                              {integration}
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-xs text-muted-foreground">Credential Types</div>
                          {requiredIntegrations.flatMap((integration) =>
                            getCredentialTypes(integration).map((type) => (
                              <SelectItem key={`${integration}-${type.value}`} value={type.value}>
                                {type.label}
                              </SelectItem>
                            )),
                          )}
                        </>
                      ) : (
                        CREDENTIAL_TYPES.DEFAULT.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential-value">Credential Value</Label>
                  <div className="relative">
                    <Input
                      id="credential-value"
                      type="password"
                      placeholder="Enter the secret value"
                      value={newCredential.value}
                      onChange={(e) => setNewCredential({ ...newCredential, value: e.target.value })}
                    />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">This value will be encrypted and stored securely.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential-expiry">Expiration Date (Optional)</Label>
                  <Input
                    id="credential-expiry"
                    type="date"
                    value={newCredential.expiresAt}
                    onChange={(e) => setNewCredential({ ...newCredential, expiresAt: e.target.value })}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingCredential(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Credential
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (onUpdate) {
              onUpdate()
            } else {
              router.push(`/workflows/${workflowId}`)
            }
          }}
        >
          Done
        </Button>
      </div>
    </div>
  )
}
