// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter,usePathname } from "next/navigation"
// import { Loader2, PlusCircle, KeyRound, Trash, Check, Lock } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { toast } from "@/hooks/use-toast"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// interface WorkflowCredentialsFormProps {
//   workflowId: string
//   requiredIntegrations: string[]
//   existingCredentials: Array<{
//     id: string
//     name: string
//     type: string
//   }>
//   onUpdate?: () => void
// }

// // Credential type options based on integration type
// const CREDENTIAL_TYPES: Record<string, Array<{ value: string; label: string }>> = {
//   // Example credential types
//   API: [
//     { value: "api_key", label: "API Key" },
//     { value: "oauth2", label: "OAuth 2.0" },
//     { value: "basic_auth", label: "Basic Authentication" },
//   ],
//   DATABASE: [
//     { value: "connection_string", label: "Connection String" },
//     { value: "username_password", label: "Username/Password" },
//   ],
//   PAYMENT: [
//     { value: "api_key", label: "API Key" },
//     { value: "secret_key", label: "Secret Key" },
//   ],
//   EMAIL: [
//     { value: "smtp", label: "SMTP" },
//     { value: "api_key", label: "API Key" },
//   ],
//   STORAGE: [
//     { value: "access_key", label: "Access Key" },
//     { value: "connection_string", label: "Connection String" },
//   ],
//   // Add more types as needed
//   DEFAULT: [
//     { value: "api_key", label: "API Key" },
//     { value: "oauth2", label: "OAuth 2.0" },
//     { value: "secret_key", label: "Secret Key" },
//     { value: "username_password", label: "Username/Password" },
//   ],
// }

// // Map integration name to category
// const getIntegrationCategory = (integration: string): string => {
//   const integrationUppercase = integration.toUpperCase()
//   if (integrationUppercase.includes("DATABASE") || integrationUppercase.includes("SQL")) return "DATABASE"
//   if (integrationUppercase.includes("PAYMENT") || integrationUppercase.includes("STRIPE")) return "PAYMENT"
//   if (integrationUppercase.includes("EMAIL") || integrationUppercase.includes("MAIL")) return "EMAIL"
//   if (integrationUppercase.includes("STORAGE") || integrationUppercase.includes("S3")) return "STORAGE"
//   if (integrationUppercase.includes("API")) return "API"
//   return "DEFAULT"
// }

// export function WorkflowCredentialsForm({
//   workflowId,
//   requiredIntegrations,
//   existingCredentials,
//   onUpdate,
// }: WorkflowCredentialsFormProps) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group
  

//   // State
//   const [isAddingCredential, setIsAddingCredential] = useState(false)
//   const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // New credential state
//   const [newCredential, setNewCredential] = useState({
//     name: "",
//     type: "",
//     value: "",
//     expiresAt: "",
//   })

//   // Handle adding a new credential
//   const handleAddCredential = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!newCredential.name.trim()) {
//       toast({
//         title: "Missing information",
//         description: "Please enter a name for the credential",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!newCredential.type) {
//       toast({
//         title: "Missing information",
//         description: "Please select a credential type",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!newCredential.value.trim()) {
//       toast({
//         title: "Missing information",
//         description: "Please enter the credential value",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: newCredential.name.trim(),
//           type: newCredential.type,
//           value: newCredential.value.trim(),
//           expiresAt: newCredential.expiresAt ? new Date(newCredential.expiresAt) : null,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to add credential")
//       }

//       toast({
//         title: "Credential added",
//         description: "Your credential has been added successfully",
//       })

//       // Reset form and close dialog
//       setNewCredential({
//         name: "",
//         type: "",
//         value: "",
//         expiresAt: "",
//       })
//       setIsAddingCredential(false)

//       // Trigger parent update callback
//       if (onUpdate) {
//         onUpdate()
//       }
//     } catch (error) {
//       console.error("Error adding credential:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Handle deleting a credential
//   const handleDeleteCredential = async () => {
//     if (!credentialToDelete) return

//     setIsSubmitting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials/${credentialToDelete}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to delete credential")
//       }

//       toast({
//         title: "Credential deleted",
//         description: "Your credential has been deleted successfully",
//       })

//       // Close dialog and clear selection
//       setCredentialToDelete(null)

//       // Trigger parent update callback
//       if (onUpdate) {
//         onUpdate()
//       }
//     } catch (error) {
//       console.error("Error deleting credential:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Get credential types for the selected integration
//   const getCredentialTypes = (integration: string) => {
//     const category = getIntegrationCategory(integration)
//     return CREDENTIAL_TYPES[category] || CREDENTIAL_TYPES.DEFAULT
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-medium">Credentials</h2>
//         <p className="text-sm text-muted-foreground">Manage secure credentials for your workflow</p>
//       </div>

//       {/* Required Integrations */}
//       {requiredIntegrations && requiredIntegrations.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Required Integrations</CardTitle>
//             <CardDescription>This workflow requires credentials for the following integrations</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {requiredIntegrations.map((integration) => {
//                 const hasCredential = existingCredentials.some(
//                   (cred) =>
//                     cred.name.toLowerCase().includes(integration.toLowerCase()) ||
//                     cred.type.toLowerCase().includes(integration.toLowerCase()),
//                 )

//                 return (
//                   <li key={integration} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <KeyRound className="h-4 w-4 text-muted-foreground" />
//                       <span>{integration}</span>
//                     </div>
//                     {hasCredential ? (
//                       <span className="text-green-600 flex items-center text-sm">
//                         <Check className="h-4 w-4 mr-1" /> Configured
//                       </span>
//                     ) : (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setNewCredential({
//                             ...newCredential,
//                             name: `${integration} Credential`,
//                           })
//                           setIsAddingCredential(true)
//                         }}
//                       >
//                         Configure
//                       </Button>
//                     )}
//                   </li>
//                 )
//               })}
//             </ul>
//           </CardContent>
//         </Card>
//       )}

//       {/* Existing Credentials */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Stored Credentials</CardTitle>
//           <CardDescription>Securely stored credentials for this workflow</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {existingCredentials && existingCredentials.length > 0 ? (
//             <ul className="space-y-3">
//               {existingCredentials.map((credential) => (
//                 <li key={credential.id} className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium">{credential.name}</div>
//                     <div className="text-sm text-muted-foreground">{credential.type}</div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
//                           <Trash className="h-4 w-4 mr-1" />
//                           Remove
//                         </Button>
//                       </AlertDialogTrigger>
//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                           <AlertDialogDescription>
//                             This will permanently delete the credential &quot;{credential.name}&quot;. This action
//                             cannot be undone and may cause your workflow to stop working.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                           <AlertDialogAction
//                             onClick={(e) => {
//                               e.preventDefault()
//                               setCredentialToDelete(credential.id)
//                               handleDeleteCredential()
//                             }}
//                             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                           >
//                             {isSubmitting && credentialToDelete === credential.id ? (
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             ) : (
//                               <Trash className="mr-2 h-4 w-4" />
//                             )}
//                             Delete
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-center py-6 text-muted-foreground">No credentials configured yet</div>
//           )}
//         </CardContent>
//         <CardFooter>
//           <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
//             <DialogTrigger asChild>
//               <Button>
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Add Credential
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add New Credential</DialogTitle>
//                 <DialogDescription>
//                   Add a new credential for your workflow. Credentials are stored securely and encrypted.
//                 </DialogDescription>
//               </DialogHeader>

//               <form onSubmit={handleAddCredential} className="space-y-4 mt-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="credential-name">Credential Name</Label>
//                   <Input
//                     id="credential-name"
//                     placeholder="e.g., API Key for Service X"
//                     value={newCredential.name}
//                     onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="credential-type">Credential Type</Label>
//                   <Select
//                     value={newCredential.type}
//                     onValueChange={(value) => setNewCredential({ ...newCredential, type: value })}
//                   >
//                     <SelectTrigger id="credential-type">
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {requiredIntegrations && requiredIntegrations.length > 0 ? (
//                         <>
//                           {requiredIntegrations.map((integration) => (
//                             <SelectItem key={integration} value={integration} disabled>
//                               {integration}
//                             </SelectItem>
//                           ))}
//                           <div className="px-2 py-1.5 text-xs text-muted-foreground">Credential Types</div>
//                           {requiredIntegrations.flatMap((integration) =>
//                             getCredentialTypes(integration).map((type) => (
//                               <SelectItem key={`${integration}-${type.value}`} value={type.value}>
//                                 {type.label}
//                               </SelectItem>
//                             )),
//                           )}
//                         </>
//                       ) : (
//                         CREDENTIAL_TYPES.DEFAULT.map((type) => (
//                           <SelectItem key={type.value} value={type.value}>
//                             {type.label}
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="credential-value">Credential Value</Label>
//                   <div className="relative">
//                     <Input
//                       id="credential-value"
//                       type="password"
//                       placeholder="Enter the secret value"
//                       value={newCredential.value}
//                       onChange={(e) => setNewCredential({ ...newCredential, value: e.target.value })}
//                     />
//                     <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">This value will be encrypted and stored securely.</p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="credential-expiry">Expiration Date (Optional)</Label>
//                   <Input
//                     id="credential-expiry"
//                     type="date"
//                     value={newCredential.expiresAt}
//                     onChange={(e) => setNewCredential({ ...newCredential, expiresAt: e.target.value })}
//                   />
//                 </div>

//                 <DialogFooter>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setIsAddingCredential(false)}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                     Save Credential
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </CardFooter>
//       </Card>

//       <div className="flex justify-end">
//         <Button
//           onClick={() => {
//             if (onUpdate) {
//               onUpdate()
//             } else {
//               router.push(`/dashboard/${slug}/agents/workflows/${workflowId}`)
//             }
//           }}
//         >
//           Done
//         </Button>
//       </div>
//     </div>
//   )
// }


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { 
//   Loader2, 
//   PlusCircle, 
//   KeyRound, 
//   Trash, 
//   Check, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   AlertCircle,
//   ExternalLink 
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { toast } from "@/hooks/use-toast"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"

// // n8n credential field types
// type FieldType = 'string' | 'password' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'multiline'

// interface CredentialField {
//   name: string
//   displayName: string
//   type: FieldType
//   required: boolean
//   description?: string
//   placeholder?: string
//   default?: any
//   options?: Array<{ name: string; value: string }>
//   validation?: {
//     pattern?: string
//     minLength?: number
//     maxLength?: number
//   }
// }

// interface IntegrationCredentialSchema {
//   name: string
//   displayName: string
//   description: string
//   documentationUrl?: string
//   authType: 'apiKey' | 'oauth2' | 'basic' | 'custom'
//   fields: CredentialField[]
//   testable: boolean
// }

// interface StoredCredential {
//   id: string
//   integrationName?: string
//   displayName?: string
//   isValid?: boolean
//   lastTested?: string
//   expiresAt?: string
// }

// interface WorkflowCredentialsFormProps {
//   workflowId: string
//   requiredIntegrations: string[]
//   existingCredentials: StoredCredential[]
//   onUpdate?: () => void
// }

// // n8n integration credential schemas
// const INTEGRATION_SCHEMAS: Record<string, IntegrationCredentialSchema> = {
//   gmail: {
//     name: 'gmail',
//     displayName: 'Gmail',
//     description: 'Connect to Gmail using OAuth2 authentication',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/google/',
//     authType: 'oauth2',
//     testable: true,
//     fields: [
//       {
//         name: 'clientId',
//         displayName: 'Client ID',
//         type: 'string',
//         required: true,
//         description: 'The Client ID from your Google Cloud Console',
//         placeholder: 'your-client-id.googleusercontent.com'
//       },
//       {
//         name: 'clientSecret',
//         displayName: 'Client Secret',
//         type: 'password',
//         required: true,
//         description: 'The Client Secret from your Google Cloud Console'
//       }
//     ]
//   },
//   slack: {
//     name: 'slack',
//     displayName: 'Slack',
//     description: 'Connect to Slack using OAuth2 or Bot Token',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/slack/',
//     authType: 'oauth2',
//     testable: true,
//     fields: [
//       {
//         name: 'accessToken',
//         displayName: 'Access Token',
//         type: 'password',
//         required: true,
//         description: 'Bot User OAuth Token (starts with xoxb-)',
//         placeholder: 'xoxb-your-token-here'
//       }
//     ]
//   },
//   notion: {
//     name: 'notion',
//     displayName: 'Notion',
//     description: 'Connect to Notion using Internal Integration Token',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/notion/',
//     authType: 'apiKey',
//     testable: true,
//     fields: [
//       {
//         name: 'apiKey',
//         displayName: 'Internal Integration Token',
//         type: 'password',
//         required: true,
//         description: 'Create an integration at https://www.notion.so/my-integrations',
//         placeholder: 'secret_...'
//       }
//     ]
//   },
//   stripe: {
//     name: 'stripe',
//     displayName: 'Stripe',
//     description: 'Connect to Stripe using API keys',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/stripe/',
//     authType: 'apiKey',
//     testable: true,
//     fields: [
//       {
//         name: 'secretKey',
//         displayName: 'Secret Key',
//         type: 'password',
//         required: true,
//         description: 'Your Stripe secret key (live or test)',
//         placeholder: 'sk_live_... or sk_test_...'
//       },
//       {
//         name: 'publishableKey',
//         displayName: 'Publishable Key',
//         type: 'string',
//         required: false,
//         description: 'Your Stripe publishable key (for client-side operations)',
//         placeholder: 'pk_live_... or pk_test_...'
//       }
//     ]
//   },
//   postgresql: {
//     name: 'postgresql',
//     displayName: 'PostgreSQL',
//     description: 'Connect to PostgreSQL database',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/postgres/',
//     authType: 'basic',
//     testable: true,
//     fields: [
//       {
//         name: 'host',
//         displayName: 'Host',
//         type: 'string',
//         required: true,
//         description: 'Database host address',
//         placeholder: 'localhost',
//         default: 'localhost'
//       },
//       {
//         name: 'port',
//         displayName: 'Port',
//         type: 'number',
//         required: true,
//         description: 'Database port',
//         default: 5432
//       },
//       {
//         name: 'database',
//         displayName: 'Database',
//         type: 'string',
//         required: true,
//         description: 'Database name'
//       },
//       {
//         name: 'username',
//         displayName: 'Username',
//         type: 'string',
//         required: true,
//         description: 'Database username'
//       },
//       {
//         name: 'password',
//         displayName: 'Password',
//         type: 'password',
//         required: true,
//         description: 'Database password'
//       },
//       {
//         name: 'ssl',
//         displayName: 'SSL',
//         type: 'boolean',
//         required: false,
//         description: 'Use SSL connection',
//         default: false
//       }
//     ]
//   },
//   openai: {
//     name: 'openai',
//     displayName: 'OpenAI',
//     description: 'Connect to OpenAI API',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/openai/',
//     authType: 'apiKey',
//     testable: true,
//     fields: [
//       {
//         name: 'apiKey',
//         displayName: 'API Key',
//         type: 'password',
//         required: true,
//         description: 'Your OpenAI API key',
//         placeholder: 'sk-...'
//       },
//       {
//         name: 'organizationId',
//         displayName: 'Organization ID',
//         type: 'string',
//         required: false,
//         description: 'Optional organization ID',
//         placeholder: 'org-...'
//       }
//     ]
//   }
// }

// export function WorkflowCredentialsForm({
//   workflowId,
//   requiredIntegrations,
//   existingCredentials,
//   onUpdate,
// }: WorkflowCredentialsFormProps) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : ""

//   const [isAddingCredential, setIsAddingCredential] = useState(false)
//   const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
//   const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isTesting, setIsTesting] = useState(false)
//   const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  
//   const [credentialData, setCredentialData] = useState<Record<string, any>>({})

//   // Reset form when integration changes
//   useEffect(() => {
//     if (selectedIntegration) {
//       const schema = INTEGRATION_SCHEMAS[selectedIntegration]
//       if (schema) {
//         const initialData: Record<string, any> = {}
//         schema.fields.forEach(field => {
//           if (field.default !== undefined) {
//             initialData[field.name] = field.default
//           } else {
//             initialData[field.name] = field.type === 'boolean' ? false : ''
//           }
//         })
//         setCredentialData(initialData)
//       }
//     }
//   }, [selectedIntegration])

//   const handleFieldChange = (fieldName: string, value: any) => {
//     setCredentialData(prev => ({
//       ...prev,
//       [fieldName]: value
//     }))
//   }

//   const togglePasswordVisibility = (fieldName: string) => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [fieldName]: !prev[fieldName]
//     }))
//   }

//   const validateCredentialData = (integration: string, data: Record<string, any>) => {
//     const schema = INTEGRATION_SCHEMAS[integration]
//     if (!schema) return { isValid: false, errors: ['Unknown integration'] }

//     const errors: string[] = []
    
//     schema.fields.forEach(field => {
//       const value = data[field.name]
      
//       if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
//         errors.push(`${field.displayName} is required`)
//       }
      
//       if (field.validation && value) {
//         if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
//           errors.push(`${field.displayName} format is invalid`)
//         }
//         if (field.validation.minLength && value.length < field.validation.minLength) {
//           errors.push(`${field.displayName} must be at least ${field.validation.minLength} characters`)
//         }
//         if (field.validation.maxLength && value.length > field.validation.maxLength) {
//           errors.push(`${field.displayName} must be no more than ${field.validation.maxLength} characters`)
//         }
//       }
//     })

//     return { isValid: errors.length === 0, errors }
//   }

//   const testCredential = async (integration: string, data: Record<string, any>) => {
//     setIsTesting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials/test`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ integration, data })
//       })

//       const result = await response.json()
      
//       if (result.success) {
//         toast({
//           title: "Connection successful",
//           description: "Credentials are valid and working",
//         })
//         return true
//       } else {
//         toast({
//           title: "Connection failed",
//           description: result.error || "Unable to connect with these credentials",
//           variant: "destructive",
//         })
//         return false
//       }
//     } catch (error) {
//       toast({
//         title: "Test failed",
//         description: "Unable to test credentials",
//         variant: "destructive",
//       })
//       return false
//     } finally {
//       setIsTesting(false)
//     }
//   }

//   const handleSaveCredential = async () => {
//     if (!selectedIntegration) return

//     const validation = validateCredentialData(selectedIntegration, credentialData)
//     if (!validation.isValid) {
//       toast({
//         title: "Validation failed",
//         description: validation.errors.join(', '),
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           integration: selectedIntegration,
//           data: credentialData,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to save credential')
//       }

//       toast({
//         title: "Credential saved",
//         description: "Your credential has been saved successfully",
//       })

//       setIsAddingCredential(false)
//       setSelectedIntegration(null)
//       setCredentialData({})
      
//       if (onUpdate) onUpdate()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteCredential = async (credentialId: string) => {
//     setIsSubmitting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials/${credentialId}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to delete credential')
//       }

//       toast({
//         title: "Credential deleted",
//         description: "Your credential has been deleted successfully",
//       })

//       if (onUpdate) onUpdate()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//       setCredentialToDelete(null)
//     }
//   }

//   const renderCredentialField = (field: CredentialField, integration: string) => {
//     const fieldKey = `${integration}-${field.name}`
//     const value = credentialData[field.name] || ''

//     switch (field.type) {
//       case 'boolean':
//         return (
//           <div key={fieldKey} className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>{field.displayName}</Label>
//               {field.description && (
//                 <p className="text-sm text-muted-foreground">{field.description}</p>
//               )}
//             </div>
//             <Switch
//               checked={value}
//               onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
//             />
//           </div>
//         )

//       case 'multiline':
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Textarea
//               placeholder={field.placeholder}
//               value={value}
//               onChange={(e) => handleFieldChange(field.name, e.target.value)}
//               rows={4}
//             />
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )

//       case 'password':
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="relative">
//               <Input
//                 type={showPasswords[fieldKey] ? 'text' : 'password'}
//                 placeholder={field.placeholder}
//                 value={value}
//                 onChange={(e) => handleFieldChange(field.name, e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                 onClick={() => togglePasswordVisibility(fieldKey)}
//               >
//                 {showPasswords[fieldKey] ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )

//       case 'number':
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               type="number"
//               placeholder={field.placeholder}
//               value={value}
//               onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || '')}
//             />
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )

//       default:
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
//               placeholder={field.placeholder}
//               value={value}
//               onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             />
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )
//     }
//   }

//   const getCredentialStatus = (integration: string) => {
//     return existingCredentials.find(cred => cred.integrationName === integration)
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-medium">Workflow Credentials</h2>
//         <p className="text-sm text-muted-foreground">
//           Configure secure credentials for your workflow integrations
//         </p>
//       </div>

//       {/* Required Integrations */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Required Integrations</CardTitle>
//           <CardDescription>
//             This workflow requires credentials for the following integrations
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {requiredIntegrations.map((integration) => {
//               const schema = INTEGRATION_SCHEMAS[integration]
//               const credential = getCredentialStatus(integration)
              
//               if (!schema) {
//                 return (
//                   <div key={integration} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
//                     <div className="flex items-center gap-3">
//                       <AlertCircle className="h-5 w-5 text-amber-500" />
//                       <div>
//                         <p className="font-medium">{integration}</p>
//                         <p className="text-sm text-muted-foreground">Integration not supported yet</p>
//                       </div>
//                     </div>
//                     <Badge variant="secondary">Unsupported</Badge>
//                   </div>
//                 )
//               }

//               return (
//                 <div key={integration} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <KeyRound className="h-5 w-5 text-muted-foreground" />
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <p className="font-medium">{schema.displayName}</p>
//                         {schema.documentationUrl && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-auto p-0 text-xs"
//                             onClick={() => window.open(schema.documentationUrl, '_blank')}
//                           >
//                             <ExternalLink className="h-3 w-3" />
//                           </Button>
//                         )}
//                       </div>
//                       <p className="text-sm text-muted-foreground">{schema.description}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="outline" className="text-xs">
//                           {schema.authType}
//                         </Badge>
//                         {schema.testable && (
//                           <Badge variant="outline" className="text-xs">
//                             Testable
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3">
//                     {credential ? (
//                       <div className="flex items-center gap-2">
//                         <div className="text-right">
//                           <div className="flex items-center gap-1 text-green-600">
//                             <Check className="h-4 w-4" />
//                             <span className="text-sm font-medium">Configured</span>
//                           </div>
//                           {credential.lastTested && (
//                             <p className="text-xs text-muted-foreground">
//                               Last tested: {new Date(credential.lastTested).toLocaleDateString()}
//                             </p>
//                           )}
//                         </div>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="outline" size="sm">
//                               <Trash className="h-4 w-4 mr-1" />
//                               Remove
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Remove Credential</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This will remove the {schema.displayName} credential. Your workflow may stop working until you add new credentials.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDeleteCredential(credential.id)}
//                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               >
//                                 Remove
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     ) : (
//                       <Button
//                         onClick={() => {
//                           setSelectedIntegration(integration)
//                           setIsAddingCredential(true)
//                         }}
//                       >
//                         Configure
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add/Edit Credential Dialog */}
//       <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
//         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               Configure {selectedIntegration && INTEGRATION_SCHEMAS[selectedIntegration]?.displayName}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedIntegration && INTEGRATION_SCHEMAS[selectedIntegration]?.description}
//             </DialogDescription>
//           </DialogHeader>

//           {selectedIntegration && INTEGRATION_SCHEMAS[selectedIntegration] && (
//             <div className="space-y-6 py-4">
//               {INTEGRATION_SCHEMAS[selectedIntegration].documentationUrl && (
//                 <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//                   <AlertCircle className="h-4 w-4 text-blue-600" />
//                   <div className="flex-1">
//                     <p className="text-sm">Need help setting this up?</p>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => window.open(INTEGRATION_SCHEMAS[selectedIntegration!].documentationUrl, '_blank')}
//                   >
//                     <ExternalLink className="h-4 w-4 mr-1" />
//                     View Guide
//                   </Button>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 {INTEGRATION_SCHEMAS[selectedIntegration].fields.map(field => 
//                   renderCredentialField(field, selectedIntegration)
//                 )}
//               </div>

//               {INTEGRATION_SCHEMAS[selectedIntegration].testable && (
//                 <>
//                   <Separator />
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => testCredential(selectedIntegration, credentialData)}
//                       disabled={isTesting}
//                     >
//                       {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                       Test Connection
//                     </Button>
//                     <p className="text-sm text-muted-foreground">
//                       Test your credentials before saving
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsAddingCredential(false)
//                 setSelectedIntegration(null)
//                 setCredentialData({})
//               }}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSaveCredential} disabled={isSubmitting}>
//               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Save Credential
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <div className="flex justify-end">
//         <Button
//           onClick={() => {
//             if (onUpdate) {
//               onUpdate()
//             } else {
//               router.push(`/dashboard/${slug}/agents/workflows/${workflowId}`)
//             }
//           }}
//         >
//           Done
//         </Button>
//       </div>
//     </div>
//   )
// }

// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { 
//   Loader2, 
//   PlusCircle, 
//   KeyRound, 
//   Trash, 
//   Check, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   AlertCircle,
//   ExternalLink,
//   RefreshCw,
//   Shield,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   Globe,
//   AlertTriangle
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { toast } from "@/hooks/use-toast"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"

// // n8n credential field types
// type FieldType = 'string' | 'password' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'multiline'

// interface CredentialField {
//   name: string
//   displayName: string
//   type: FieldType
//   required: boolean
//   description?: string
//   placeholder?: string
//   default?: any
//   options?: Array<{ name: string; value: string }>
//   validation?: {
//     pattern?: string
//     minLength?: number
//     maxLength?: number
//   }
// }

// interface OAuthConfig {
//   authorizationUrl: string
//   tokenUrl: string
//   scopes: string[]
//   pkce?: boolean
//   state?: boolean
//   redirectUri?: string
//   refreshTokenSupported: boolean
//   customParams?: Record<string, string>
// }

// interface IntegrationCredentialSchema {
//   name: string
//   displayName: string
//   description: string
//   documentationUrl?: string
//   authType: 'apiKey' | 'oauth2' | 'basic' | 'custom'
//   fields: CredentialField[]
//   testable: boolean
//   oauth?: OAuthConfig
// }

// interface StoredCredential {
//   id: string
//   integrationName?: string
//   displayName?: string
//   isValid?: boolean
//   lastTested?: string
//   expiresAt?: string
//   tokenExpiresAt?: string
//   hasRefreshToken?: boolean
//   authType?: string
//   scopes?: string[]
// }

// interface WorkflowCredentialsFormProps {
//   workflowId: string
//   requiredIntegrations: string[]
//   existingCredentials: StoredCredential[]
//   onUpdate?: () => void
// }

// interface OAuthState {
//   isAuthenticating: boolean
//   authUrl?: string
//   pollInterval?: NodeJS.Timeout
//   state?: string
// }

// // Enhanced n8n integration credential schemas with OAuth
// const INTEGRATION_SCHEMAS: Record<string, IntegrationCredentialSchema> = {
//   gmail: {
//     name: 'gmail',
//     displayName: 'Gmail',
//     description: 'Connect to Gmail using OAuth2 authentication',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/google/',
//     authType: 'oauth2',
//     testable: true,
//     oauth: {
//       authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
//       tokenUrl: 'https://oauth2.googleapis.com/token',
//       scopes: [
//         'https://www.googleapis.com/auth/gmail.readonly',
//         'https://www.googleapis.com/auth/gmail.send',
//         'https://www.googleapis.com/auth/gmail.modify'
//       ],
//       pkce: true,
//       state: true,
//       refreshTokenSupported: true,
//       customParams: {
//         access_type: 'offline',
//         prompt: 'consent'
//       }
//     },
//     fields: [
//       {
//         name: 'clientId',
//         displayName: 'Client ID',
//         type: 'string',
//         required: true,
//         description: 'The Client ID from your Google Cloud Console',
//         placeholder: 'your-client-id.googleusercontent.com'
//       },
//       {
//         name: 'clientSecret',
//         displayName: 'Client Secret',
//         type: 'password',
//         required: true,
//         description: 'The Client Secret from your Google Cloud Console'
//       }
//     ]
//   },
//   slack: {
//     name: 'slack',
//     displayName: 'Slack',
//     description: 'Connect to Slack using OAuth2 authentication',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/slack/',
//     authType: 'oauth2',
//     testable: true,
//     oauth: {
//       authorizationUrl: 'https://slack.com/oauth/v2/authorize',
//       tokenUrl: 'https://slack.com/api/oauth.v2.access',
//       scopes: [
//         'channels:read',
//         'chat:write',
//         'users:read',
//         'files:write'
//       ],
//       state: true,
//       refreshTokenSupported: true
//     },
//     fields: [
//       {
//         name: 'clientId',
//         displayName: 'Client ID',
//         type: 'string',
//         required: true,
//         description: 'Client ID from your Slack app',
//         placeholder: 'your-client-id'
//       },
//       {
//         name: 'clientSecret',
//         displayName: 'Client Secret',
//         type: 'password',
//         required: true,
//         description: 'Client Secret from your Slack app'
//       }
//     ]
//   },
//   notion: {
//     name: 'notion',
//     displayName: 'Notion',
//     description: 'Connect to Notion using OAuth2 or Internal Integration Token',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/notion/',
//     authType: 'oauth2',
//     testable: true,
//     oauth: {
//       authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
//       tokenUrl: 'https://api.notion.com/v1/oauth/token',
//       scopes: [],
//       state: true,
//       refreshTokenSupported: false
//     },
//     fields: [
//       {
//         name: 'clientId',
//         displayName: 'Client ID',
//         type: 'string',
//         required: true,
//         description: 'OAuth Client ID from your Notion integration',
//         placeholder: 'your-client-id'
//       },
//       {
//         name: 'clientSecret',
//         displayName: 'Client Secret',
//         type: 'password',
//         required: true,
//         description: 'OAuth Client Secret from your Notion integration'
//       },
//       {
//         name: 'apiKey',
//         displayName: 'Internal Integration Token (Alternative)',
//         type: 'password',
//         required: false,
//         description: 'Use this instead of OAuth for internal integrations',
//         placeholder: 'secret_...'
//       }
//     ]
//   },
//   stripe: {
//     name: 'stripe',
//     displayName: 'Stripe',
//     description: 'Connect to Stripe using OAuth2 or API keys',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/stripe/',
//     authType: 'oauth2',
//     testable: true,
//     oauth: {
//       authorizationUrl: 'https://connect.stripe.com/oauth/authorize',
//       tokenUrl: 'https://connect.stripe.com/oauth/token',
//       scopes: ['read_write'],
//       state: true,
//       refreshTokenSupported: false
//     },
//     fields: [
//       {
//         name: 'clientId',
//         displayName: 'Client ID',
//         type: 'string',
//         required: false,
//         description: 'Client ID for OAuth (Stripe Connect)',
//         placeholder: 'ca_...'
//       },
//       {
//         name: 'clientSecret',
//         displayName: 'Client Secret',
//         type: 'password',
//         required: false,
//         description: 'Client Secret for OAuth (Stripe Connect)'
//       },
//       {
//         name: 'secretKey',
//         displayName: 'Secret Key (Alternative)',
//         type: 'password',
//         required: false,
//         description: 'Your Stripe secret key (live or test)',
//         placeholder: 'sk_live_... or sk_test_...'
//       },
//       {
//         name: 'publishableKey',
//         displayName: 'Publishable Key',
//         type: 'string',
//         required: false,
//         description: 'Your Stripe publishable key (for client-side operations)',
//         placeholder: 'pk_live_... or pk_test_...'
//       }
//     ]
//   },
//   postgresql: {
//     name: 'postgresql',
//     displayName: 'PostgreSQL',
//     description: 'Connect to PostgreSQL database',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/postgres/',
//     authType: 'basic',
//     testable: true,
//     fields: [
//       {
//         name: 'host',
//         displayName: 'Host',
//         type: 'string',
//         required: true,
//         description: 'Database host address',
//         placeholder: 'localhost',
//         default: 'localhost'
//       },
//       {
//         name: 'port',
//         displayName: 'Port',
//         type: 'number',
//         required: true,
//         description: 'Database port',
//         default: 5432
//       },
//       {
//         name: 'database',
//         displayName: 'Database',
//         type: 'string',
//         required: true,
//         description: 'Database name'
//       },
//       {
//         name: 'username',
//         displayName: 'Username',
//         type: 'string',
//         required: true,
//         description: 'Database username'
//       },
//       {
//         name: 'password',
//         displayName: 'Password',
//         type: 'password',
//         required: true,
//         description: 'Database password'
//       },
//       {
//         name: 'ssl',
//         displayName: 'SSL',
//         type: 'boolean',
//         required: false,
//         description: 'Use SSL connection',
//         default: false
//       }
//     ]
//   },
//   openai: {
//     name: 'openai',
//     displayName: 'OpenAI',
//     description: 'Connect to OpenAI API',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/openai/',
//     authType: 'apiKey',
//     testable: true,
//     fields: [
//       {
//         name: 'apiKey',
//         displayName: 'API Key',
//         type: 'password',
//         required: true,
//         description: 'Your OpenAI API key',
//         placeholder: 'sk-...'
//       },
//       {
//         name: 'organizationId',
//         displayName: 'Organization ID',
//         type: 'string',
//         required: false,
//         description: 'Optional organization ID',
//         placeholder: 'org-...'
//       }
//     ]
//   },
//   microsoft: {
//     name: 'microsoft',
//     displayName: 'Microsoft Graph',
//     description: 'Connect to Microsoft services using OAuth2',
//     documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/microsoft/',
//     authType: 'oauth2',
//     testable: true,
//     oauth: {
//       authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
//       tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
//       scopes: [
//         'https://graph.microsoft.com/User.Read',
//         'https://graph.microsoft.com/Mail.ReadWrite',
//         'https://graph.microsoft.com/Calendars.ReadWrite'
//       ],
//       pkce: true,
//       state: true,
//       refreshTokenSupported: true
//     },
//     fields: [
//       {
//         name: 'clientId',
//         displayName: 'Application (client) ID',
//         type: 'string',
//         required: true,
//         description: 'Application ID from Azure Portal',
//         placeholder: 'your-app-id'
//       },
//       {
//         name: 'clientSecret',
//         displayName: 'Client Secret',
//         type: 'password',
//         required: true,
//         description: 'Client secret from Azure Portal'
//       },
//       {
//         name: 'tenantId',
//         displayName: 'Directory (tenant) ID',
//         type: 'string',
//         required: false,
//         description: 'Tenant ID for organization-specific access',
//         placeholder: 'common'
//       }
//     ]
//   }
// }

// export function WorkflowCredentialsForm({
//   workflowId,
//   requiredIntegrations,
//   existingCredentials,
//   onUpdate,
// }: WorkflowCredentialsFormProps) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : ""

//   const [isAddingCredential, setIsAddingCredential] = useState(false)
//   const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
//   const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isTesting, setIsTesting] = useState(false)
//   const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
//   const [oauthState, setOAuthState] = useState<OAuthState>({
//     isAuthenticating: false
//   })
//   const [credentialData, setCredentialData] = useState<Record<string, any>>({})

//   // Reset form when integration changes
//   useEffect(() => {
//     if (selectedIntegration) {
//       const schema = INTEGRATION_SCHEMAS[selectedIntegration]
//       if (schema) {
//         const initialData: Record<string, any> = {}
//         schema.fields.forEach(field => {
//           if (field.default !== undefined) {
//             initialData[field.name] = field.default
//           } else {
//             initialData[field.name] = field.type === 'boolean' ? false : ''
//           }
//         })
//         setCredentialData(initialData)
//       }
//     }
//   }, [selectedIntegration])

//   // Cleanup OAuth polling on unmount
//   useEffect(() => {
//     return () => {
//       if (oauthState.pollInterval) {
//         clearInterval(oauthState.pollInterval)
//       }
//     }
//   }, [oauthState.pollInterval])

//   const handleFieldChange = (fieldName: string, value: any) => {
//     setCredentialData(prev => ({
//       ...prev,
//       [fieldName]: value
//     }))
//   }

//   const togglePasswordVisibility = (fieldName: string) => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [fieldName]: !prev[fieldName]
//     }))
//   }

//   const generateOAuthState = () => {
//     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
//   }

//   const generateCodeChallenge = async () => {
//     const codeVerifier = Math.random().toString(36).substring(2, 128)
//     const encoder = new TextEncoder()
//     const data = encoder.encode(codeVerifier)
//     const digest = await crypto.subtle.digest('SHA-256', data)
//     const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=/g, '')
    
//     return { codeVerifier, codeChallenge }
//   }

//   const initiateOAuthFlow = async (integration: string) => {
//     const schema = INTEGRATION_SCHEMAS[integration]
//     if (!schema?.oauth) return

//     try {
//       setOAuthState({ isAuthenticating: true })

//       // Generate state for CSRF protection
//       const state = generateOAuthState()
//       let authUrl = new URL(schema.oauth.authorizationUrl)
      
//       // Add required OAuth parameters
//       const params = new URLSearchParams({
//         client_id: credentialData.clientId,
//         response_type: 'code',
//         redirect_uri: `${window.location.origin}/api/oauth/callback`,
//         scope: schema.oauth.scopes.join(' '),
//         ...(schema.oauth.customParams || {})
//       })

//       if (schema.oauth.state) {
//         params.append('state', state)
//       }

//       // Add PKCE if supported
//       let codeVerifier = ''
//       if (schema.oauth.pkce) {
//         const { codeVerifier: cv, codeChallenge } = await generateCodeChallenge()
//         codeVerifier = cv
//         params.append('code_challenge', codeChallenge)
//         params.append('code_challenge_method', 'S256')
//       }

//       // Add tenant ID for Microsoft
//       if (integration === 'microsoft' && credentialData.tenantId) {
//         authUrl.pathname = authUrl.pathname.replace('/common/', `/${credentialData.tenantId}/`)
//       }

//       authUrl.search = params.toString()

//       // Store OAuth session
//       const response = await fetch(`/api/workflows/${workflowId}/oauth/initiate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           integration,
//           state,
//           codeVerifier,
//           clientId: credentialData.clientId,
//           clientSecret: credentialData.clientSecret,
//           redirectUri: `${window.location.origin}/api/oauth/callback`
//         })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to initiate OAuth flow')
//       }

//       // Open OAuth popup
//       const popup = window.open(
//         authUrl.toString(),
//         'oauth',
//         'width=600,height=700,scrollbars=yes,resizable=yes'
//       )

//       if (!popup) {
//         throw new Error('Popup blocked. Please allow popups for this site.')
//       }

//       setOAuthState({
//         isAuthenticating: true,
//         authUrl: authUrl.toString(),
//         state
//       })

//       // Poll for OAuth completion
//       const pollInterval = setInterval(async () => {
//         try {
//           const pollResponse = await fetch(`/api/workflows/${workflowId}/oauth/status/${state}`)
//           const pollData = await pollResponse.json()

//           if (pollData.completed) {
//             clearInterval(pollInterval)
//             popup.close()

//             if (pollData.success) {
//               toast({
//                 title: "OAuth authentication successful",
//                 description: "Your credentials have been saved",
//               })
              
//               setOAuthState({ isAuthenticating: false })
//               setIsAddingCredential(false)
//               setSelectedIntegration(null)
//               setCredentialData({})
              
//               if (onUpdate) onUpdate()
//             } else {
//               throw new Error(pollData.error || 'OAuth authentication failed')
//             }
//           }
//         } catch (error) {
//           clearInterval(pollInterval)
//           popup.close()
//           throw error
//         }
//       }, 2000)

//       setOAuthState(prev => ({ ...prev, pollInterval }))

//       // Handle popup close
//       const checkClosed = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(checkClosed)
//           clearInterval(pollInterval)
//           setOAuthState({ isAuthenticating: false })
//         }
//       }, 1000)

//     } catch (error) {
//       setOAuthState({ isAuthenticating: false })
//       toast({
//         title: "OAuth authentication failed",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     }
//   }

//   const refreshOAuthToken = async (credentialId: string) => {
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials/${credentialId}/refresh`, {
//         method: 'POST'
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to refresh token')
//       }

//       toast({
//         title: "Token refreshed",
//         description: "Your OAuth token has been refreshed successfully",
//       })

//       if (onUpdate) onUpdate()
//     } catch (error) {
//       toast({
//         title: "Token refresh failed",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     }
//   }

//   const validateCredentialData = (integration: string, data: Record<string, any>) => {
//     const schema = INTEGRATION_SCHEMAS[integration]
//     if (!schema) return { isValid: false, errors: ['Unknown integration'] }

//     const errors: string[] = []
    
//     schema.fields.forEach(field => {
//       const value = data[field.name]
      
//       if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
//         errors.push(`${field.displayName} is required`)
//       }
      
//       if (field.validation && value) {
//         if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
//           errors.push(`${field.displayName} format is invalid`)
//         }
//         if (field.validation.minLength && value.length < field.validation.minLength) {
//           errors.push(`${field.displayName} must be at least ${field.validation.minLength} characters`)
//         }
//         if (field.validation.maxLength && value.length > field.validation.maxLength) {
//           errors.push(`${field.displayName} must be no more than ${field.validation.maxLength} characters`)
//         }
//       }
//     })

//     return { isValid: errors.length === 0, errors }
//   }

//   const testCredential = async (integration: string, data: Record<string, any>) => {
//     setIsTesting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials/test`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ integration, data })
//       })

//       const result = await response.json()
      
//       if (result.success) {
//         toast({
//           title: "Connection successful",
//           description: "Credentials are valid and working",
//         })
//         return true
//       } else {
//         toast({
//           title: "Connection failed",
//           description: result.error || "Unable to connect with these credentials",
//           variant: "destructive",
//         })
//         return false
//       }
//     } catch (error) {
//       toast({
//         title: "Test failed",
//         description: "Unable to test credentials",
//         variant: "destructive",
//       })
//       return false
//     } finally {
//       setIsTesting(false)
//     }
//   }

//   const handleSaveCredential = async () => {
//     if (!selectedIntegration) return

//     const schema = INTEGRATION_SCHEMAS[selectedIntegration]
//     if (schema?.authType === 'oauth2' && schema.oauth) {
//       // For OAuth, initiate the flow instead
//       await initiateOAuthFlow(selectedIntegration)
//       return
//     }

//     const validation = validateCredentialData(selectedIntegration, credentialData)
//     if (!validation.isValid) {
//       toast({
//         title: "Validation failed",
//         description: validation.errors.join(', '),
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           integration: selectedIntegration,
//           data: credentialData,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to save credential')
//       }

//       toast({
//         title: "Credential saved",
//         description: "Your credential has been saved successfully",
//       })

//       setIsAddingCredential(false)
//       setSelectedIntegration(null)
//       setCredentialData({})
      
//       if (onUpdate) onUpdate()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteCredential = async (credentialId: string) => {
//     setIsSubmitting(true)
//     try {
//       const response = await fetch(`/api/workflows/${workflowId}/credentials/${credentialId}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to delete credential')
//       }

//       toast({
//         title: "Credential deleted",
//         description: "Your credential has been deleted successfully",
//       })

//       if (onUpdate) onUpdate()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//       setCredentialToDelete(null)
//     }
//   }

//   const renderCredentialField = (field: CredentialField, integration: string) => {
//     const fieldKey = `${integration}-${field.name}`
//     const value = credentialData[field.name] || ''

//     switch (field.type) {
//       case 'boolean':
//         return (
//           <div key={fieldKey} className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>{field.displayName}</Label>
//               {field.description && (
//                 <p className="text-sm text-muted-foreground">{field.description}</p>
//               )}
//             </div>
//             <Switch
//               checked={value}
//               onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
//             />
//           </div>
//         )

//       case 'multiline':
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Textarea
//               placeholder={field.placeholder}
//               value={value}
//               onChange={(e) => handleFieldChange(field.name, e.target.value)}
//               rows={4}
//             />
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )

//       case 'password':
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="relative">
//               <Input
//                 type={showPasswords[fieldKey] ? 'text' : 'password'}
//                 placeholder={field.placeholder}
//                 value={value}
//                 onChange={(e) => handleFieldChange(field.name, e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                 onClick={() => togglePasswordVisibility(fieldKey)}
//               >
//                 {showPasswords[fieldKey] ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )

//       case 'number':
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               type="number"
//               placeholder={field.placeholder}
//               value={value}
//               onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || '')}
//             />
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )

//       default:
//         return (
//           <div key={fieldKey} className="space-y-2">
//             <Label>
//               {field.displayName}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
//               placeholder={field.placeholder}
//               value={value}
//               onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             />
//             {field.description && (
//               <p className="text-sm text-muted-foreground">{field.description}</p>
//             )}
//           </div>
//         )
//     }
//   }

//   const getCredentialStatus = (integration: string) => {
//     return existingCredentials.find(cred => cred.integrationName === integration)
//   }

//   const isTokenExpiringSoon = (credential: StoredCredential) => {
//     if (!credential.tokenExpiresAt) return false
//     const expiryDate = new Date(credential.tokenExpiresAt)
//     const now = new Date()
//     const dayInMs = 24 * 60 * 60 * 1000
//     return expiryDate.getTime() - now.getTime() < dayInMs * 7 // Expiring within 7 days
//   }

//   const isTokenExpired = (credential: StoredCredential) => {
//     if (!credential.tokenExpiresAt) return false
//     return new Date(credential.tokenExpiresAt) < new Date()
//   }

//   const renderCredentialStatus =

// app/(dashboard)/workflows/[workflowId]/credentials/components/workflow-credentials-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Loader2, 
  PlusCircle, 
  KeyRound, 
  Trash, 
  Check, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ExternalLink 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type FieldType = 'string' | 'password' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'multiline'

interface CredentialField {
  name: string
  displayName: string
  type: FieldType
  required: boolean
  description?: string
  placeholder?: string
  default?: any
  options?: Array<{ name: string; value: string }>
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
  }
}

interface IntegrationCredentialSchema {
  name: string
  displayName: string
  description: string
  documentationUrl?: string
  authType: 'apiKey' | 'oauth2' | 'basic' | 'custom'
  fields: CredentialField[]
  testable: boolean
  oauthUrl?: string
  oauthScopes?: string[]
}

interface StoredCredential {
  id: string
  integrationName?: string
  displayName?: string
  isValid?: boolean
  lastTested?: string
  expiresAt?: string
}

interface WorkflowCredentialsFormProps {
  workflowId: string
  requiredIntegrations: string[]
  existingCredentials: StoredCredential[]
  onUpdate?: () => void
}

const INTEGRATION_SCHEMAS: Record<string, IntegrationCredentialSchema> = {
  gmail: {
    name: 'gmail',
    displayName: 'Gmail',
    description: 'Connect to Gmail using OAuth2 authentication',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/google/',
    authType: 'oauth2',
    testable: true,
    oauthUrl: '/api/oauth/gmail',
    oauthScopes: ['https://www.googleapis.com/auth/gmail.send'],
    fields: [
      {
        name: 'clientId',
        displayName: 'Client ID',
        type: 'string',
        required: true,
        description: 'The Client ID from your Google Cloud Console',
        placeholder: 'your-client-id.googleusercontent.com'
      },
      {
        name: 'clientSecret',
        displayName: 'Client Secret',
        type: 'password',
        required: true,
        description: 'The Client Secret from your Google Cloud Console'
      }
    ]
  },
  slack: {
    name: 'slack',
    displayName: 'Slack',
    description: 'Connect to Slack using OAuth2 or Bot Token',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/slack/',
    authType: 'oauth2',
    testable: true,
    oauthUrl: '/api/oauth/slack',
    oauthScopes: ['incoming-webhook', 'commands', 'chat:write'],
    fields: [
      {
        name: 'accessToken',
        displayName: 'Access Token',
        type: 'password',
        required: true,
        description: 'Bot User OAuth Token (starts with xoxb-)',
        placeholder: 'xoxb-your-token-here'
      }
    ]
  },
  
notion: {
    name: 'notion',
    displayName: 'Notion',
    description: 'Connect to Notion using OAuth2 or Internal Integration Token',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/notion/',
    authType: 'oauth2',
    testable: true,
    oauthUrl:'/api/oauth/slack',
    fields: [
      {
        name: 'clientId',
        displayName: 'Client ID',
        type: 'string',
        required: true,
        description: 'OAuth Client ID from your Notion integration',
        placeholder: 'your-client-id'
      },
      {
        name: 'clientSecret',
        displayName: 'Client Secret',
        type: 'password',
        required: true,
        description: 'OAuth Client Secret from your Notion integration'
      },
      {
        name: 'apiKey',
        displayName: 'Internal Integration Token (Alternative)',
        type: 'password',
        required: false,
        description: 'Use this instead of OAuth for internal integrations',
        placeholder: 'secret_...'
      }
    ]
  },
  stripe: {
    name: 'stripe',
    displayName: 'Stripe',
    description: 'Connect to Stripe using OAuth2 or API keys',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/stripe/',
    authType: 'oauth2',
    testable: true,
    oauthUrl:'/api/oauth/slack',
    fields: [
      {
        name: 'clientId',
        displayName: 'Client ID',
        type: 'string',
        required: false,
        description: 'Client ID for OAuth (Stripe Connect)',
        placeholder: 'ca_...'
      },
      {
        name: 'clientSecret',
        displayName: 'Client Secret',
        type: 'password',
        required: false,
        description: 'Client Secret for OAuth (Stripe Connect)'
      },
      {
        name: 'secretKey',
        displayName: 'Secret Key (Alternative)',
        type: 'password',
        required: false,
        description: 'Your Stripe secret key (live or test)',
        placeholder: 'sk_live_... or sk_test_...'
      },
      {
        name: 'publishableKey',
        displayName: 'Publishable Key',
        type: 'string',
        required: false,
        description: 'Your Stripe publishable key (for client-side operations)',
        placeholder: 'pk_live_... or pk_test_...'
      }
    ]
  },
  postgresql: {
    name: 'postgresql',
    displayName: 'PostgreSQL',
    description: 'Connect to PostgreSQL database',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/postgres/',
    authType: 'basic',
    testable: true,
    fields: [
      {
        name: 'host',
        displayName: 'Host',
        type: 'string',
        required: true,
        description: 'Database host address',
        placeholder: 'localhost',
        default: 'localhost'
      },
      {
        name: 'port',
        displayName: 'Port',
        type: 'number',
        required: true,
        description: 'Database port',
        default: 5432
      },
      {
        name: 'database',
        displayName: 'Database',
        type: 'string',
        required: true,
        description: 'Database name'
      },
      {
        name: 'username',
        displayName: 'Username',
        type: 'string',
        required: true,
        description: 'Database username'
      },
      {
        name: 'password',
        displayName: 'Password',
        type: 'password',
        required: true,
        description: 'Database password'
      },
      {
        name: 'ssl',
        displayName: 'SSL',
        type: 'boolean',
        required: false,
        description: 'Use SSL connection',
        default: false
      }
    ]
  },
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    description: 'Connect to OpenAI API',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/openai/',
    authType: 'apiKey',
    testable: true,
    fields: [
      {
        name: 'apiKey',
        displayName: 'API Key',
        type: 'password',
        required: true,
        description: 'Your OpenAI API key',
        placeholder: 'sk-...'
      },
      {
        name: 'organizationId',
        displayName: 'Organization ID',
        type: 'string',
        required: false,
        description: 'Optional organization ID',
        placeholder: 'org-...'
      }
    ]
  },
  microsoft: {
    name: 'microsoft',
    displayName: 'Microsoft Graph',
    description: 'Connect to Microsoft services using OAuth2',
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/credentials/microsoft/',
    authType: 'oauth2',
    testable: true,
    oauthUrl:'/api/oauth/slack',
    fields: [
      {
        name: 'clientId',
        displayName: 'Application (client) ID',
        type: 'string',
        required: true,
        description: 'Application ID from Azure Portal',
        placeholder: 'your-app-id'
      },
      {
        name: 'clientSecret',
        displayName: 'Client Secret',
        type: 'password',
        required: true,
        description: 'Client secret from Azure Portal'
      },
      {
        name: 'tenantId',
        displayName: 'Directory (tenant) ID',
        type: 'string',
        required: false,
        description: 'Tenant ID for organization-specific access',
        placeholder: 'common'
      }
    ]
  }

}



const OAuthButton = ({ 
  integration,
  workflowId 
}: { 
  integration: string, 
  workflowId: string 
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const schema = INTEGRATION_SCHEMAS[integration]

  const handleOAuth = async () => {
    setIsLoading(true)
    try {
      // Store workflow context in session
      await fetch('/api/oauth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, integration })
      })
      
      // Redirect to OAuth endpoint
      router.push(schema.oauthUrl!)
    } catch (error) {
      console.error('OAuth initiation failed:', error)
      toast({
        title: "Error",
        description: "Failed to initiate OAuth flow",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleOAuth}
      variant="outline"
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <KeyRound className="h-4 w-4" />
      )}
      <span>Connect with OAuth</span>
    </Button>
  )
}

export function WorkflowCredentialsForm({
  workflowId,
  requiredIntegrations,
  existingCredentials,
  onUpdate,
}: WorkflowCredentialsFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [oauthStatus, setOauthStatus] = useState<{
    success: boolean
    integration?: string
    message?: string
  } | null>(null)

  const [isAddingCredential, setIsAddingCredential] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [credentialData, setCredentialData] = useState<Record<string, any>>({})

  // Handle OAuth callback
  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success')
    const oauthError = searchParams.get('oauth_error')
    const integration = searchParams.get('integration')

    if (oauthSuccess && integration) {
      setOauthStatus({ success: true, integration })
      toast({
        title: "Connection successful",
        description: `${INTEGRATION_SCHEMAS[integration]?.displayName} has been connected`,
      })
      if (onUpdate) onUpdate()
    } else if (oauthError) {
      setOauthStatus({ 
        success: false, 
        message: searchParams.get('error') || 'OAuth connection failed',
        integration: searchParams.get('integration') || undefined
      })
      toast({
        title: "Connection failed",
        description: searchParams.get('error') || 'OAuth connection failed',
        variant: "destructive",
      })
    }
  }, [searchParams, onUpdate])

  // Reset form when integration changes
  useEffect(() => {
    if (selectedIntegration) {
      const schema = INTEGRATION_SCHEMAS[selectedIntegration]
      if (schema) {
        const initialData: Record<string, any> = {}
        schema.fields.forEach(field => {
          if (field.default !== undefined) {
            initialData[field.name] = field.default
          } else {
            initialData[field.name] = field.type === 'boolean' ? false : ''
          }
        })
        setCredentialData(initialData)
      }
    }
  }, [selectedIntegration])

  const handleFieldChange = (fieldName: string, value: any) => {
    setCredentialData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const validateCredentialData = (integration: string, data: Record<string, any>) => {
    const schema = INTEGRATION_SCHEMAS[integration]
    if (!schema) return { isValid: false, errors: ['Unknown integration'] }

    const errors: string[] = []
    
    schema.fields.forEach(field => {
      const value = data[field.name]
      
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push(`${field.displayName} is required`)
      }
      
      if (field.validation && value) {
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          errors.push(`${field.displayName} format is invalid`)
        }
        if (field.validation.minLength && value.length < field.validation.minLength) {
          errors.push(`${field.displayName} must be at least ${field.validation.minLength} characters`)
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          errors.push(`${field.displayName} must be no more than ${field.validation.maxLength} characters`)
        }
      }
    })

    return { isValid: errors.length === 0, errors }
  }

  const testCredential = async (integration: string, data: Record<string, any>) => {
    setIsTesting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowId}/credentials/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration, data })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Connection successful",
          description: "Credentials are valid and working",
        })
        return true
      } else {
        toast({
          title: "Connection failed",
          description: result.error || "Unable to connect with these credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Unable to test credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setIsTesting(false)
    }
  }

  const handleSaveCredential = async () => {
    if (!selectedIntegration) return

    const validation = validateCredentialData(selectedIntegration, credentialData)
    if (!validation.isValid) {
      toast({
        title: "Validation failed",
        description: validation.errors.join(', '),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowId}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integration: selectedIntegration,
          data: credentialData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save credential')
      }

      toast({
        title: "Credential saved",
        description: "Your credential has been saved successfully",
      })

      setIsAddingCredential(false)
      setSelectedIntegration(null)
      setCredentialData({})
      
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCredential = async (credentialId: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowId}/credentials/${credentialId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete credential')
      }

      toast({
        title: "Credential deleted",
        description: "Your credential has been deleted successfully",
      })

      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setCredentialToDelete(null)
    }
  }

  const renderCredentialField = (field: CredentialField, integration: string) => {
    const fieldKey = `${integration}-${field.name}`
    const value = credentialData[field.name] || ''

    switch (field.type) {
      case 'boolean':
        return (
          <div key={fieldKey} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{field.displayName}</Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
          </div>
        )

      case 'multiline':
        return (
          <div key={fieldKey} className="space-y-2">
            <Label>
              {field.displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              rows={4}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'password':
        return (
          <div key={fieldKey} className="space-y-2">
            <Label>
              {field.displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                type={showPasswords[fieldKey] ? 'text' : 'password'}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility(fieldKey)}
              >
                {showPasswords[fieldKey] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      default:
        return (
          <div key={fieldKey} className="space-y-2">
            <Label>
              {field.displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        )
    }
  }

  const getCredentialStatus = (integration: string) => {
    return existingCredentials.find(cred => cred.integrationName === integration)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Workflow Credentials</h2>
        <p className="text-sm text-muted-foreground">
          Configure secure credentials for your workflow integrations
        </p>
      </div>

      {/* Required Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Required Integrations</CardTitle>
          <CardDescription>
            This workflow requires credentials for the following integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredIntegrations.map((integration) => {
              const schema = INTEGRATION_SCHEMAS[integration]
              const credential = getCredentialStatus(integration)
              
              if (!schema) {
                return (
                  <div key={integration} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">{integration}</p>
                        <p className="text-sm text-muted-foreground">Integration not supported yet</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Unsupported</Badge>
                  </div>
                )
              }

              return (
                <div key={integration} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{schema.displayName}</p>
                        {schema.documentationUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => window.open(schema.documentationUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{schema.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {schema.authType}
                        </Badge>
                        {schema.testable && (
                          <Badge variant="outline" className="text-xs">
                            Testable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {credential ? (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Configured</span>
                          </div>
                          {credential.lastTested && (
                            <p className="text-xs text-muted-foreground">
                              Last tested: {new Date(credential.lastTested).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Credential</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the {schema.displayName} credential. Your workflow may stop working until you add new credentials.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCredential(credential.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {schema.authType === 'oauth2' && schema.oauthUrl && (
                          <OAuthButton 
                            integration={integration}
                            workflowId={workflowId}
                          />
                        )}
                        <Button
                          onClick={() => {
                            setSelectedIntegration(integration)
                            setIsAddingCredential(true)
                          }}
                          variant={schema.authType === 'oauth2' ? 'outline' : 'default'}
                        >
                          {schema.authType === 'oauth2' ? 'Manual Setup' : 'Configure'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Credential Dialog */}
      <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedIntegration && INTEGRATION_SCHEMAS[selectedIntegration]?.displayName}
            </DialogTitle>
            <DialogDescription>
              {selectedIntegration && INTEGRATION_SCHEMAS[selectedIntegration]?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedIntegration && INTEGRATION_SCHEMAS[selectedIntegration] && (
            <div className="space-y-6 py-4">
              {INTEGRATION_SCHEMAS[selectedIntegration].documentationUrl && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm">Need help setting this up?</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(INTEGRATION_SCHEMAS[selectedIntegration!].documentationUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Guide
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {INTEGRATION_SCHEMAS[selectedIntegration].fields.map(field => 
                  renderCredentialField(field, selectedIntegration)
                )}
              </div>

              {INTEGRATION_SCHEMAS[selectedIntegration].testable && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => testCredential(selectedIntegration, credentialData)}
                      disabled={isTesting}
                    >
                      {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Test Connection
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Test your credentials before saving
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingCredential(false)
                setSelectedIntegration(null)
                setCredentialData({})
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCredential} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Credential
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (onUpdate) {
              onUpdate()
            } else {
              router.push(`/dashboard/workflows/${workflowId}`)
            }
          }}
        >
          Done
        </Button>
      </div>
    </div>
  )
}