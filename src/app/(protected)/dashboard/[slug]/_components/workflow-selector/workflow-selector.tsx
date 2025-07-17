// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Calendar, Clock, DollarSign, MessageSquare, Users, Zap, CheckCircle, ArrowLeft, Sparkles } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   complexity: "Simple" | "Medium" | "Complex"
//   estimatedSetupTime: number
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS"],
//     complexity: "Medium",
//     estimatedSetupTime: 25,
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack"],
//     complexity: "Complex",
//     estimatedSetupTime: 35,
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs"],
//     complexity: "Complex",
//     estimatedSetupTime: 40,
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom"],
//     complexity: "Medium",
//     estimatedSetupTime: 30,
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS"],
//     complexity: "Simple",
//     estimatedSetupTime: 15,
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   additionalSettings?: Record<string, string>
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review">("selection")
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setStep("configuration")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//   }

//   const handleIntegrationConfig = (integration: string, config: Partial<IntegrationConfig>) => {
//     setIntegrationConfigs((prev) => ({
//       ...prev,
//       [integration]: { ...prev[integration], name: integration, ...config },
//     }))
//   }

//   const handleFinalSubmit = async () => {
//     // Here you would submit to your API
//     const workflowData = {
//       workflowType: selectedWorkflow,
//       businessInfo,
//       integrations: selectedIntegrations.map((name) => ({
//         name,
//         config: integrationConfigs[name] || { name },
//       })),
//     }

//     console.log("Submitting workflow configuration:", workflowData)
//     // API call would go here
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => handleWorkflowSelect(workflow)}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap">
//                           <Badge
//                             variant={
//                               workflow.complexity === "Simple"
//                                 ? "default"
//                                 : workflow.complexity === "Medium"
//                                   ? "secondary"
//                                   : "destructive"
//                             }
//                             className="text-xs"
//                           >
//                             {workflow.complexity}
//                           </Badge>
//                           <Badge variant="outline" className="text-xs">
//                             <Clock className="h-3 w-3 mr-1" />
//                             {workflow.estimatedSetupTime}min
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     {selectedWorkflow.icon}
//                     Workflow Overview
//                   </CardTitle>
//                   <CardDescription>Here&apos;s what your {selectedWorkflow.name} workflow will include</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-8">
//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                         <Sparkles className="h-4 w-4" />
//                         Process Flow:
//                       </h4>
//                       <div className="space-y-3">
//                         {selectedWorkflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-4">
//                             <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm font-medium">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                       <ul className="space-y-3">
//                         {selectedWorkflow.features.map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-3 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedWorkflow.integrations.map((integration, idx) => (
//                           <Badge key={idx} variant="outline" className="text-xs">
//                             {integration}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => (
//                 <Card
//                   key={integration}
//                   className={`glassEffect border-2 transition-all duration-300 ${
//                     selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                   }`}
//                 >
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-primary/10">
//                           <Zap className="h-5 w-5 text-primary" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg">{integration}</CardTitle>
//                           <CardDescription>Configure your {integration} integration</CardDescription>
//                         </div>
//                       </div>
//                       <Checkbox
//                         checked={selectedIntegrations.includes(integration)}
//                         onCheckedChange={() => handleIntegrationToggle(integration)}
//                         className="scale-125"
//                       />
//                     </div>
//                   </CardHeader>

//                   {selectedIntegrations.includes(integration) && (
//                     <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                       <div className="space-y-2">
//                         <Label htmlFor={`${integration}-api-key`} className="text-sm font-medium">
//                           API Key
//                         </Label>
//                         <Input
//                           id={`${integration}-api-key`}
//                           type="password"
//                           placeholder="Enter your API key"
//                           onChange={(e) => handleIntegrationConfig(integration, { apiKey: e.target.value })}
//                           className="bg-background/50 border-border/50 focus:border-primary"
//                         />
//                       </div>

//                       {["Stripe", "PayPal", "Salesforce"].includes(integration) && (
//                         <div className="space-y-2">
//                           <Label htmlFor={`${integration}-api-secret`} className="text-sm font-medium">
//                             API Secret
//                           </Label>
//                           <Input
//                             id={`${integration}-api-secret`}
//                             type="password"
//                             placeholder="Enter your API secret"
//                             onChange={(e) => handleIntegrationConfig(integration, { apiSecret: e.target.value })}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                           />
//                         </div>
//                       )}

//                       <div className="space-y-2">
//                         <Label htmlFor={`${integration}-webhook`} className="text-sm font-medium">
//                           Webhook URL (Optional)
//                         </Label>
//                         <Input
//                           id={`${integration}-webhook`}
//                           placeholder="https://your-webhook-url.com"
//                           onChange={(e) => handleIntegrationConfig(integration, { webhookUrl: e.target.value })}
//                           className="bg-background/50 border-border/50 focus:border-primary"
//                         />
//                       </div>
//                     </CardContent>
//                   )}
//                 </Card>
//               ))}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8">
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("integrations")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Integrations
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review & Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Selected Workflow:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{selectedWorkflow.name}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       {selectedWorkflow.estimatedSetupTime} minutes
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Zap className="h-5 w-5 text-primary" />
//                     Configured Integrations
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {selectedIntegrations.length > 0 ? (
//                     <div className="space-y-3">
//                       {selectedIntegrations.map((integration) => (
//                         <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                           <CheckCircle className="h-4 w-4 text-green-500" />
//                           <span className="text-sm font-medium">{integration}</span>
//                           <Badge variant="outline" className="ml-auto text-xs">
//                             Configured
//                           </Badge>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-sm text-muted-foreground">No integrations configured</p>
//                       <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   <li className="flex items-center gap-3">
//                     <div className="w-2 h-2 rounded-full bg-primary"></div>
//                     Your Voiceflow workflow will be automatically configured
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <div className="w-2 h-2 rounded-full bg-primary"></div>
//                     Integration connections will be tested and verified
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <div className="w-2 h-2 rounded-full bg-primary"></div>
//                     Your automation will be activated for social media DMs
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <div className="w-2 h-2 rounded-full bg-primary"></div>
//                     You&apos;ll receive a confirmation email with setup details
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep("integrations")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 Deploy Workflow 🚀
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }



// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   MessageSquare,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   BookOpen,
//   Globe,
//   LifeBuoy,
//   Loader2,
//   XCircle,
// } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   complexity: "Simple" | "Medium" | "Complex"
//   estimatedSetupTime: number
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
//   voiceflowProjectId: string // New: Voiceflow Project ID for this template
//   voiceflowVersionId: string // New: Voiceflow Version ID for this template
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS"],
//     complexity: "Medium",
//     estimatedSetupTime: 25,
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//     voiceflowProjectId: "vf_proj_appointment", // Placeholder
//     voiceflowVersionId: "vf_ver_appointment", // Placeholder
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack"],
//     complexity: "Complex",
//     estimatedSetupTime: 35,
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//     voiceflowProjectId: "vf_proj_quote", // Placeholder
//     voiceflowVersionId: "vf_ver_quote", // Placeholder
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs"],
//     complexity: "Complex",
//     estimatedSetupTime: 40,
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//     voiceflowProjectId: "vf_proj_product_high", // Placeholder
//     voiceflowVersionId: "vf_ver_product_high", // Placeholder
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom"],
//     complexity: "Medium",
//     estimatedSetupTime: 30,
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//     voiceflowProjectId: "vf_proj_course", // Placeholder
//     voiceflowVersionId: "vf_ver_course", // Placeholder
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS"],
//     complexity: "Simple",
//     estimatedSetupTime: 15,
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//     voiceflowProjectId: "vf_proj_quick", // Placeholder
//     voiceflowVersionId: "vf_ver_quick", // Placeholder
//   },
//   {
//     id: "education-training",
//     name: "Education & Training",
//     category: "GROUP_6",
//     description: "For online courses, workshops, certifications, and educational content delivery.",
//     icon: <BookOpen className="h-6 w-6" />,
//     features: [
//       "Course enrollment",
//       "Content access management",
//       "Quiz/assessment support",
//       "Certificate generation",
//       "Student progress tracking",
//       "Learning platform integration",
//     ],
//     integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing"],
//     complexity: "Medium",
//     estimatedSetupTime: 30,
//     operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
//     commonUseCase: "Online academies, certification bodies, corporate training",
//     borderClass: "card-border-document",
//     voiceflowProjectId: "vf_proj_education", // Placeholder
//     voiceflowVersionId: "vf_ver_education", // Placeholder
//   },
//   {
//     id: "community-management",
//     name: "Community Management",
//     category: "GROUP_7",
//     description: "For managing online communities, forums, membership sites, and social groups.",
//     icon: <Globe className="h-6 w-6" />,
//     features: [
//       "Member onboarding",
//       "Content moderation",
//       "Event announcements",
//       "Q&A support",
//       "Engagement tracking",
//       "Forum integration",
//     ],
//     integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing"],
//     complexity: "Medium",
//     estimatedSetupTime: 25,
//     operations: ["Join", "Onboarding", "Engagement", "Support"],
//     commonUseCase: "Online forums, membership communities, fan clubs",
//     borderClass: "card-border-communication",
//     voiceflowProjectId: "vf_proj_community", // Placeholder
//     voiceflowVersionId: "vf_ver_community", // Placeholder
//   },
//   {
//     id: "customer-support-advanced",
//     name: "Customer Support (Advanced)",
//     category: "GROUP_8",
//     description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
//     icon: <LifeBuoy className="h-6 w-6" />,
//     features: [
//       "Ticket creation",
//       "Issue diagnosis",
//       "Knowledge base lookup",
//       "Escalation to human agent",
//       "Feedback collection",
//       "CRM integration",
//     ],
//     integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email"],
//     complexity: "Complex",
//     estimatedSetupTime: 45,
//     operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
//     commonUseCase: "Software companies, tech support, complex service providers",
//     borderClass: "card-border-integration",
//     voiceflowProjectId: "vf_proj_support_adv", // Placeholder
//     voiceflowVersionId: "vf_ver_support_adv", // Placeholder
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   additionalSettings?: Record<string, string>
// }

// interface IntegrationTestResult {
//   isTesting: boolean
//   result: "success" | "failure" | null
//   message: string | null
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review" | "customization">(
//     "selection",
//   )
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(false)
//     setStep("configuration")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//   }

//   const handleIntegrationConfig = (integration: string, config: Partial<IntegrationConfig>) => {
//     setIntegrationConfigs((prev) => ({
//       ...prev,
//       [integration]: { ...prev[integration], name: integration, ...config },
//     }))
//     // Reset test result when credentials change
//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleTestIntegration = async (integrationName: string) => {
//     const config = integrationConfigs[integrationName]
//     if (!config || (!config.apiKey && !config.apiSecret && !config.webhookUrl)) {
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "No credentials provided." },
//       }))
//       return
//     }

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integrationName]: { isTesting: true, result: null, message: "Testing..." },
//     }))

//     try {
//       const response = await fetch("/api/integrations/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationName, credentials: config }),
//       })
//       const result = await response.json()

//       if (result.success) {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "success", message: result.message },
//         }))
//       } else {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
//         }))
//       }
//     } catch (error) {
//       console.error("Error testing integration:", error)
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
//       }))
//     }
//   }

//   const handleFinalSubmit = async () => {
//     const workflowData = {
//       workflowTemplateId: selectedWorkflow?.id, // Use template ID
//       businessId: "your_business_id_here", // Replace with actual business ID
//       businessInfo,
//       integrations: selectedIntegrations.map((name) => ({
//         name,
//         config: integrationConfigs[name] || { name },
//       })),
//       voiceflowProjectId: selectedWorkflow?.voiceflowProjectId,
//       voiceflowVersionId: selectedWorkflow?.voiceflowVersionId,
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//     }

//     console.log("Submitting workflow configuration:", workflowData)
//     // API call would go here, e.g.:
//     // const response = await fetch('/api/workflow-config', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(workflowData),
//     // });
//     // const result = await response.json();
//     // console.log(result);
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => handleWorkflowSelect(workflow)}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap">
//                           <Badge
//                             variant={
//                               workflow.complexity === "Simple"
//                                 ? "default"
//                                 : workflow.complexity === "Medium"
//                                   ? "secondary"
//                                   : "destructive"
//                             }
//                             className="text-xs"
//                           >
//                             {workflow.complexity}
//                           </Badge>
//                           <Badge variant="outline" className="text-xs">
//                             <Clock className="h-3 w-3 mr-1" />
//                             {workflow.estimatedSetupTime}min
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <Card
//                 className="cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6"
//                 onClick={() => {
//                   setIsCustomWorkflow(true)
//                   setSelectedWorkflow(null) // Clear selected workflow for custom path
//                   setStep("customization")
//                 }}
//               >
//                 <Sparkles className="h-10 w-10 text-primary mb-4" />
//                 <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
//                 <CardDescription className="text-sm leading-relaxed">
//                   Can't find what you need? Describe your unique requirements, and we'll build it for you.
//                 </CardDescription>
//                 <Button variant="outline" className="mt-4 bg-transparent">
//                   Get Started
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "customization") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Request a Custom Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Tell us what you need, and we'll create a tailored solution for your business.
//                 </p>
//               </div>
//             </div>

//             <Card className="glassEffect border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   Describe Your Needs
//                 </CardTitle>
//                 <CardDescription>
//                   Please provide as much detail as possible about the workflow you envision.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="customRequest" className="text-sm font-medium">
//                     Custom Workflow Description *
//                   </Label>
//                   <Textarea
//                     id="customRequest"
//                     value={customRequest}
//                     onChange={(e) => setCustomRequest(e.target.value)}
//                     placeholder="Describe the specific operations, features, and integrations you need. E.g., 'I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like 'urgent' are detected.'"
//                     rows={10}
//                     className="bg-background/50 border-border/50 focus:border-primary resize-y"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-end">
//               <Button
//                 onClick={() => setStep("review")}
//                 disabled={!customRequest.trim()}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Review Custom Request
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     {selectedWorkflow.icon}
//                     Workflow Overview
//                   </CardTitle>
//                   <CardDescription>Here's what your {selectedWorkflow.name} workflow will include</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-8">
//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                         <Sparkles className="h-4 w-4" />
//                         Process Flow:
//                       </h4>
//                       <div className="space-y-3">
//                         {selectedWorkflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-4">
//                             <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm font-medium">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                       <ul className="space-y-3">
//                         {selectedWorkflow.features.map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-3 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedWorkflow.integrations.map((integration, idx) => (
//                           <Badge key={idx} variant="outline" className="text-xs">
//                             {integration}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => {
//                 const testResult = integrationTestResults[integration]
//                 return (
//                   <Card
//                     key={integration}
//                     className={`glassEffect border-2 transition-all duration-300 ${
//                       selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10">
//                             <Zap className="h-5 w-5 text-primary" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-lg">{integration}</CardTitle>
//                             <CardDescription>Configure your {integration} integration</CardDescription>
//                           </div>
//                         </div>
//                         <Checkbox
//                           checked={selectedIntegrations.includes(integration)}
//                           onCheckedChange={() => handleIntegrationToggle(integration)}
//                           className="scale-125"
//                         />
//                       </div>
//                     </CardHeader>

//                     {selectedIntegrations.includes(integration) && (
//                       <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                         <div className="space-y-2">
//                           <Label htmlFor={`${integration}-api-key`} className="text-sm font-medium">
//                             API Key
//                           </Label>
//                           <Input
//                             id={`${integration}-api-key`}
//                             type="password"
//                             placeholder="Enter your API key"
//                             onChange={(e) => handleIntegrationConfig(integration, { apiKey: e.target.value })}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                             value={integrationConfigs[integration]?.apiKey || ""}
//                           />
//                         </div>

//                         {["Stripe", "PayPal", "Salesforce"].includes(integration) && (
//                           <div className="space-y-2">
//                             <Label htmlFor={`${integration}-api-secret`} className="text-sm font-medium">
//                               API Secret
//                             </Label>
//                             <Input
//                               id={`${integration}-api-secret`}
//                               type="password"
//                               placeholder="Enter your API secret"
//                               onChange={(e) => handleIntegrationConfig(integration, { apiSecret: e.target.value })}
//                               className="bg-background/50 border-border/50 focus:border-primary"
//                               value={integrationConfigs[integration]?.apiSecret || ""}
//                             />
//                           </div>
//                         )}

//                         <div>
//                           <Label htmlFor={`${integration}-webhook`} className="text-sm font-medium">
//                             Webhook URL (Optional)
//                           </Label>
//                           <Input
//                             id={`${integration}-webhook`}
//                             placeholder="https://your-webhook-url.com"
//                             onChange={(e) => handleIntegrationConfig(integration, { webhookUrl: e.target.value })}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                             value={integrationConfigs[integration]?.webhookUrl || ""}
//                           />
//                         </div>

//                         <div className="flex items-center gap-3 pt-2">
//                           <Button
//                             variant="outline"
//                             onClick={() => handleTestIntegration(integration)}
//                             disabled={testResult?.isTesting}
//                             className="flex items-center gap-2"
//                           >
//                             {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
//                             Test Credentials
//                           </Button>
//                           {testResult?.result === "success" && (
//                             <span className="text-green-500 flex items-center gap-1 text-sm">
//                               <CheckCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                           {testResult?.result === "failure" && (
//                             <span className="text-red-500 flex items-center gap-1 text-sm">
//                               <XCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                         </div>
//                       </CardContent>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8">
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 className="mb-6 hover:bg-accent"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review & Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isCustomWorkflow ? "Custom Workflow Request" : selectedWorkflow?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   {!isCustomWorkflow && selectedWorkflow && (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         {selectedWorkflow.estimatedSetupTime} minutes
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {isCustomWorkflow ? (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Custom Request Details
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Your Description:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground">
//                       Our team will review your request and contact you to discuss the custom workflow.
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="h-5 w-5 text-primary" />
//                       Configured Integrations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {selectedIntegrations.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedIntegrations.map((integration) => (
//                           <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm font-medium">{integration}</span>
//                             <Badge variant="outline" className="ml-auto text-xs">
//                               Configured
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <p className="text-sm text-muted-foreground">No integrations configured</p>
//                         <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isCustomWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Our team will review your custom workflow request.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will contact you within 1-2 business days to discuss details and next steps.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once finalized, your custom Voiceflow workflow will be built and deployed.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your Voiceflow workflow will be automatically configured
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration connections will be tested and verified
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your automation will be activated for social media DMs
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You'll receive a confirmation email with setup details
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 size="lg"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }




// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   MessageSquare,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   BookOpen,
//   Globe,
//   LifeBuoy,
//   Loader2,
//   XCircle,
// } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   complexity: "Simple" | "Medium" | "Complex"
//   estimatedSetupTime: number
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
//   // Removed voiceflowProjectId and voiceflowVersionId as they are now global environment variables
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS"],
//     complexity: "Medium",
//     estimatedSetupTime: 25,
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack"],
//     complexity: "Complex",
//     estimatedSetupTime: 35,
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs"],
//     complexity: "Complex",
//     estimatedSetupTime: 40,
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom"],
//     complexity: "Medium",
//     estimatedSetupTime: 30,
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS"],
//     complexity: "Simple",
//     estimatedSetupTime: 15,
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//   },
//   {
//     id: "education-training",
//     name: "Education & Training",
//     category: "GROUP_6",
//     description: "For online courses, workshops, certifications, and educational content delivery.",
//     icon: <BookOpen className="h-6 w-6" />,
//     features: [
//       "Course enrollment",
//       "Content access management",
//       "Quiz/assessment support",
//       "Certificate generation",
//       "Student progress tracking",
//       "Learning platform integration",
//     ],
//     integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing"],
//     complexity: "Medium",
//     estimatedSetupTime: 30,
//     operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
//     commonUseCase: "Online academies, certification bodies, corporate training",
//     borderClass: "card-border-document",
//   },
//   {
//     id: "community-management",
//     name: "Community Management",
//     category: "GROUP_7",
//     description: "For managing online communities, forums, membership sites, and social groups.",
//     icon: <Globe className="h-6 w-6" />,
//     features: [
//       "Member onboarding",
//       "Content moderation",
//       "Event announcements",
//       "Q&A support",
//       "Engagement tracking",
//       "Forum integration",
//     ],
//     integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing"],
//     complexity: "Medium",
//     estimatedSetupTime: 25,
//     operations: ["Join", "Onboarding", "Engagement", "Support"],
//     commonUseCase: "Online forums, membership communities, fan clubs",
//     borderClass: "card-border-communication",
//   },
//   {
//     id: "customer-support-advanced",
//     name: "Customer Support (Advanced)",
//     category: "GROUP_8",
//     description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
//     icon: <LifeBuoy className="h-6 w-6" />,
//     features: [
//       "Ticket creation",
//       "Issue diagnosis",
//       "Knowledge base lookup",
//       "Escalation to human agent",
//       "Feedback collection",
//       "CRM integration",
//     ],
//     integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email"],
//     complexity: "Complex",
//     estimatedSetupTime: 45,
//     operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
//     commonUseCase: "Software companies, tech support, complex service providers",
//     borderClass: "card-border-integration",
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   additionalSettings?: Record<string, string>
// }

// interface IntegrationTestResult {
//   isTesting: boolean
//   result: "success" | "failure" | null
//   message: string | null
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review" | "customization">(
//     "selection",
//   )
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(false)
//     setStep("configuration")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//   }

//   const handleIntegrationConfig = (integration: string, config: Partial<IntegrationConfig>) => {
//     setIntegrationConfigs((prev) => ({
//       ...prev,
//       [integration]: { ...prev[integration], name: integration, ...config },
//     }))
//     // Reset test result when credentials change
//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleTestIntegration = async (integrationName: string) => {
//     const config = integrationConfigs[integrationName]
//     if (!config || (!config.apiKey && !config.apiSecret && !config.webhookUrl)) {
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "No credentials provided." },
//       }))
//       return
//     }

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integrationName]: { isTesting: true, result: null, message: "Testing..." },
//     }))

//     try {
//       const response = await fetch("/api/integrations/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationName, credentials: config }),
//       })
//       const result = await response.json()

//       if (result.success) {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "success", message: result.message },
//         }))
//       } else {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
//         }))
//       }
//     } catch (error) {
//       console.error("Error testing integration:", error)
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
//       }))
//     }
//   }

//   const handleFinalSubmit = async () => {
//     const workflowData = {
//       workflowTemplateId: selectedWorkflow?.id, // Use template ID
//       businessId: "your_business_id_here", // Replace with actual business ID
//       businessInfo,
//       integrations: selectedIntegrations.map((name) => ({
//         name,
//         config: integrationConfigs[name] || { name },
//       })),
//       // Removed voiceflowProjectId and voiceflowVersionId as they are now global environment variables
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//     }

//     console.log("Submitting workflow configuration:", workflowData)
//     // API call would go here, e.g.:
//     // const response = await fetch('/api/workflow-config', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(workflowData),
//     // });
//     // const result = await response.json();
//     // console.log(result);
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => handleWorkflowSelect(workflow)}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap">
//                           <Badge
//                             variant={
//                               workflow.complexity === "Simple"
//                                 ? "default"
//                                 : workflow.complexity === "Medium"
//                                   ? "secondary"
//                                   : "destructive"
//                             }
//                             className="text-xs"
//                           >
//                             {workflow.complexity}
//                           </Badge>
//                           <Badge variant="outline" className="text-xs">
//                             <Clock className="h-3 w-3 mr-1" />
//                             {workflow.estimatedSetupTime}min
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <Card
//                 className="cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6"
//                 onClick={() => {
//                   setIsCustomWorkflow(true)
//                   setSelectedWorkflow(null) // Clear selected workflow for custom path
//                   setStep("customization")
//                 }}
//               >
//                 <Sparkles className="h-10 w-10 text-primary mb-4" />
//                 <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
//                 <CardDescription className="text-sm leading-relaxed">
//                   Can&apos;t find what you need? Describe your unique requirements, and we&apos;ll build it for you.
//                 </CardDescription>
//                 <Button variant="outline" className="mt-4 bg-transparent">
//                   Get Started
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "customization") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Request a Custom Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Tell us what you need, and we&apos;ll create a tailored solution for your business.
//                 </p>
//               </div>
//             </div>

//             <Card className="glassEffect border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   Describe Your Needs
//                 </CardTitle>
//                 <CardDescription>
//                   Please provide as much detail as possible about the workflow you envision.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="customRequest" className="text-sm font-medium">
//                     Custom Workflow Description *
//                   </Label>
//                   <Textarea
//                     id="customRequest"
//                     value={customRequest}
//                     onChange={(e) => setCustomRequest(e.target.value)}
//                     placeholder="Describe the specific operations, features, and integrations you need. E.g., 'I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like 'urgent' are detected.'"
//                     rows={10}
//                     className="bg-background/50 border-border/50 focus:border-primary resize-y"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-end">
//               <Button
//                 onClick={() => setStep("review")}
//                 disabled={!customRequest.trim()}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Review Custom Request
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     {selectedWorkflow.icon}
//                     Workflow Overview
//                   </CardTitle>
//                   <CardDescription>Here&apos;s what your {selectedWorkflow.name} workflow will include</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-8">
//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                         <Sparkles className="h-4 w-4" />
//                         Process Flow:
//                       </h4>
//                       <div className="space-y-3">
//                         {selectedWorkflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-4">
//                             <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm font-medium">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                       <ul className="space-y-3">
//                         {selectedWorkflow.features.map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-3 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedWorkflow.integrations.map((integration, idx) => (
//                           <Badge key={idx} variant="outline" className="text-xs">
//                             {integration}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => {
//                 const testResult = integrationTestResults[integration]
//                 return (
//                   <Card
//                     key={integration}
//                     className={`glassEffect border-2 transition-all duration-300 ${
//                       selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10">
//                             <Zap className="h-5 w-5 text-primary" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-lg">{integration}</CardTitle>
//                             <CardDescription>Configure your {integration} integration</CardDescription>
//                           </div>
//                         </div>
//                         <Checkbox
//                           checked={selectedIntegrations.includes(integration)}
//                           onCheckedChange={() => handleIntegrationToggle(integration)}
//                           className="scale-125"
//                         />
//                       </div>
//                     </CardHeader>

//                     {selectedIntegrations.includes(integration) && (
//                       <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                         <div className="space-y-2">
//                           <Label htmlFor={`${integration}-api-key`} className="text-sm font-medium">
//                             API Key
//                           </Label>
//                           <Input
//                             id={`${integration}-api-key`}
//                             type="password"
//                             placeholder="Enter your API key"
//                             onChange={(e) => handleIntegrationConfig(integration, { apiKey: e.target.value })}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                             value={integrationConfigs[integration]?.apiKey || ""}
//                           />
//                         </div>

//                         {["Stripe", "PayPal", "Salesforce"].includes(integration) && (
//                           <div className="space-y-2">
//                             <Label htmlFor={`${integration}-api-secret`} className="text-sm font-medium">
//                               API Secret
//                             </Label>
//                             <Input
//                               id={`${integration}-api-secret`}
//                               type="password"
//                               placeholder="Enter your API secret"
//                               onChange={(e) => handleIntegrationConfig(integration, { apiSecret: e.target.value })}
//                               className="bg-background/50 border-border/50 focus:border-primary"
//                               value={integrationConfigs[integration]?.apiSecret || ""}
//                             />
//                           </div>
//                         )}

//                         <div>
//                           <Label htmlFor={`${integration}-webhook`} className="text-sm font-medium">
//                             Webhook URL (Optional)
//                           </Label>
//                           <Input
//                             id={`${integration}-webhook`}
//                             placeholder="https://your-webhook-url.com"
//                             onChange={(e) => handleIntegrationConfig(integration, { webhookUrl: e.target.value })}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                             value={integrationConfigs[integration]?.webhookUrl || ""}
//                           />
//                         </div>

//                         <div className="flex items-center gap-3 pt-2">
//                           <Button
//                             variant="outline"
//                             onClick={() => handleTestIntegration(integration)}
//                             disabled={testResult?.isTesting}
//                             className="flex items-center gap-2"
//                           >
//                             {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
//                             Test Credentials
//                           </Button>
//                           {testResult?.result === "success" && (
//                             <span className="text-green-500 flex items-center gap-1 text-sm">
//                               <CheckCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                           {testResult?.result === "failure" && (
//                             <span className="text-red-500 flex items-center gap-1 text-sm">
//                               <XCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                         </div>
//                       </CardContent>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8">
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 className="mb-6 hover:bg-accent"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review & Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isCustomWorkflow ? "Custom Workflow Request" : selectedWorkflow?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   {!isCustomWorkflow && selectedWorkflow && (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         {selectedWorkflow.estimatedSetupTime} minutes
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {isCustomWorkflow ? (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Custom Request Details
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Your Description:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground">
//                       Our team will review your request and contact you to discuss the custom workflow.
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="h-5 w-5 text-primary" />
//                       Configured Integrations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {selectedIntegrations.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedIntegrations.map((integration) => (
//                           <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm font-medium">{integration}</span>
//                             <Badge variant="outline" className="ml-auto text-xs">
//                               Configured
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <p className="text-sm text-muted-foreground">No integrations configured</p>
//                         <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isCustomWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Our team will review your custom workflow request.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will contact you within 1-2 business days to discuss details and next steps.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once finalized, your custom Voiceflow workflow will be built and deployed.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your Voiceflow workflow will be automatically configured
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration connections will be tested and verified
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your automation will be activated for social media DMs
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You&apos;ll receive a confirmation email with setup details
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 size="lg"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }


















// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   MessageSquare,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   BookOpen,
//   Globe,
//   LifeBuoy,
//   Loader2,
//   XCircle,
// } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
//   howItWorks: string
//   scenarioExample: string
//   integrationDetails: {
//     [key: string]: {
//       purpose: string
//       setupInstructions: string
//       usageInWorkflow: string
//     }
//   }
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS"],
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//     howItWorks:
//       "This workflow automates the entire appointment booking process, from initial inquiry to post-appointment follow-up. It handles scheduling, sends confirmations and reminders, and can even manage rescheduling or cancellations, freeing up your staff's time.",
//     scenarioExample:
//       "A client DMs your salon asking to book a haircut. The bot asks for their preferred date/time, checks availability via Google Calendar, confirms the booking, sends a reminder 24 hours prior, and a thank-you message after the appointment.",
//     integrationDetails: {
//       "Google Calendar": {
//         purpose: "To check real-time availability and create new appointments.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Calendar API, and create an OAuth 2.0 Client ID for a Web Application. You'll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
//         usageInWorkflow:
//           "The bot will query your Google Calendar to find available slots and add new appointments directly to your calendar once confirmed by the user.",
//       },
//       Calendly: {
//         purpose: "To direct users to your Calendly booking page for self-service scheduling.",
//         setupInstructions:
//           "No API key needed. Simply provide your Calendly booking page URL. You can find this in your Calendly dashboard under 'Share Your Link'.",
//         usageInWorkflow:
//           "When a user expresses interest in booking, the bot will provide a direct link to your Calendly page, allowing them to choose a time that suits them.",
//       },
//       Acuity: {
//         purpose: "To integrate with your Acuity Scheduling account for booking and availability.",
//         setupInstructions:
//           "In your Acuity Scheduling account, go to Integrations > API. Generate a new API key. You&ap;ll need this key to connect.",
//         usageInWorkflow:
//           "The bot will use the Acuity API to check your schedule, book appointments, and manage client information directly within your Acuity account.",
//       },
//       Stripe: {
//         purpose: "To process payments for appointments or booking deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "If your service requires a deposit or full payment upfront, the bot will generate a secure payment link via Stripe for the user to complete the transaction.",
//       },
//       Zoom: {
//         purpose: "To automatically create Zoom meeting links for virtual appointments.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For virtual appointments, the bot will automatically generate a unique Zoom meeting link and include it in the appointment confirmation and reminder messages.",
//       },
//       SMS: {
//         purpose: "To send appointment confirmations and reminders via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "After booking, the bot will send an SMS confirmation. It will also send automated reminders before the appointment to reduce no-shows.",
//       },
//     },
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack"],
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//     howItWorks:
//       "This workflow streamlines the process of providing custom quotes. It guides the user through gathering necessary details, allows for dynamic pricing based on inputs, generates a professional quote, and can even handle negotiation steps.",
//     scenarioExample:
//       "A potential client DMs your photography studio asking for wedding photography pricing. The bot asks for date, location, hours needed, and guest count. Based on this, it generates an estimated quote and offers to schedule a consultation call.",
//     integrationDetails: {
//       "Google Drive": {
//         purpose: "To store collected documents, photos, or project specifications from clients.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Google Drive API, and create an OAuth 2.0 Client ID. You&apos;ll need the Client ID and Client Secret.",
//         usageInWorkflow:
//           "If the workflow requires clients to upload files (e.g., photos for a photography quote), the bot will provide a link or mechanism to upload directly to a designated Google Drive folder.",
//       },
//       Dropbox: {
//         purpose: "To store and share large files or project assets with clients.",
//         setupInstructions:
//           "Go to the Dropbox App Console, create a new app, and generate an access token. Ensure the app has the necessary permissions (e.g., files.content.write).",
//         usageInWorkflow:
//           "Similar to Google Drive, this allows for secure file uploads and sharing of project-related documents or drafts with clients.",
//       },
//       QuickBooks: {
//         purpose: "To generate professional invoices and manage client billing.",
//         setupInstructions:
//           "Log in to your QuickBooks Developer account. Create an app and obtain your Client ID and Client Secret. You&apos;ll also need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can automatically generate a draft invoice in QuickBooks based on the agreed-upon services and pricing.",
//       },
//       Stripe: {
//         purpose: "To process payments for accepted quotes or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "After a quote is finalized, the bot can send a secure Stripe payment link to the client for deposit or full payment.",
//       },
//       DocuSign: {
//         purpose: "To send and manage digital contracts or agreements for quotes.",
//         setupInstructions:
//           "Create a DocuSign Developer account. Create an integration key (Client ID) and generate a private key. You&apos;ll also need to configure OAuth 2.0.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can initiate a DocuSign envelope with the contract, allowing clients to digitally sign agreements.",
//       },
//       Slack: {
//         purpose: "To notify your team about new quote requests or accepted quotes.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new quote inquiry comes in or a quote is accepted, keeping your team informed.",
//       },
//     },
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs"],
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//     howItWorks:
//       "This workflow is designed for businesses with complex product sales, often involving customization, financing, or detailed consultations. It guides customers through product selection, gathers specific requirements, and facilitates the sales process up to delivery.",
//     scenarioExample:
//       "A customer DMs a car dealership asking about a specific model. The bot checks inventory, asks about desired features and financing needs, and then schedules a test drive with a sales representative.",
//     integrationDetails: {
//       Salesforce: {
//         purpose: "To create and update leads, contacts, and opportunities in your CRM.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes.",
//         usageInWorkflow:
//           "New inquiries will automatically create leads in Salesforce. As the conversation progresses, the bot can update lead status or add notes to the contact record.",
//       },
//       HubSpot: {
//         purpose: "To manage leads, contacts, and deals within your HubSpot CRM.",
//         setupInstructions:
//           "In HubSpot, go to Settings > Integrations > Private Apps. Create a new private app and obtain your Access Token. Ensure necessary CRM scopes are granted.",
//         usageInWorkflow:
//           "Similar to Salesforce, the bot will create new contacts or update existing ones in HubSpot, logging interactions and moving deals through your sales pipeline.",
//       },
//       Stripe: {
//         purpose: "To process payments for product purchases or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "When a customer is ready to purchase, the bot can generate a secure Stripe payment link for them to complete the transaction.",
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a payment option for product sales.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative payment gateway for customers who prefer to use PayPal for their purchases.",
//       },
//       Shopify: {
//         purpose: "To check product inventory, retrieve product details, and create orders.",
//         setupInstructions:
//           "In your Shopify admin, go to Apps > Develop apps > Create an app. Grant necessary permissions (e.g., read_products, write_orders) and install the app to get your API access token.",
//         usageInWorkflow:
//           "The bot can query your Shopify store for product availability, provide product descriptions, and even initiate draft orders based on customer selections.",
//       },
//       "Inventory APIs": {
//         purpose: "To integrate with external inventory management systems for real-time stock checks.",
//         setupInstructions:
//           "This depends on your specific inventory system (e.g., custom API, ERP system). You&apos;ll need the API endpoint and authentication details (API key, OAuth token, etc.) provided by your system.",
//         usageInWorkflow:
//           "Before confirming a product&apos;s availability, the bot will check your inventory system to ensure the item is in stock, preventing overselling.",
//       },
//     },
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom"],
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//     howItWorks:
//       "This workflow automates the enrollment process for online courses, coaching programs, or educational services. It qualifies leads, handles payments, grants access to course materials, and can even integrate with community platforms.",
//     scenarioExample:
//       "A prospective student DMs asking about your online coding course. The bot provides course details, answers FAQs, offers a free preview, and guides them through the enrollment and payment process.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To enroll students in your Teachable courses and manage access.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "Upon successful payment, the bot can automatically enroll the student in the specified Teachable course and provide them with access instructions.",
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, the bot can enroll students in Thinkific courses and ensure they receive the necessary login details.",
//       },
//       Discord: {
//         purpose: "To invite new students to your private Discord community.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "After enrollment, the bot can send an automated message to the student with an invite link to your exclusive Discord community.",
//       },
//       Slack: {
//         purpose: "To notify your team about new enrollments or student inquiries.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new student enrolls or has a question, keeping your team updated.",
//       },
//       Stripe: {
//         purpose: "To process payments for course enrollments.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will generate secure payment links via Stripe for students to purchase courses or programs.",
//       },
//       Zoom: {
//         purpose: "To schedule and manage live coaching calls or webinars.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
//       },
//     },
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS"],
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//     howItWorks:
//       "This workflow is designed for businesses that handle quick, high-volume transactions. It allows customers to quickly browse offerings, place orders or make simple bookings, and receive instant confirmations, ideal for fast-paced environments.",
//     scenarioExample:
//       "A customer DMs a restaurant asking to order takeout. The bot displays the menu, takes their order, processes payment via Stripe, and sends an order confirmation with an estimated pickup time.",
//     integrationDetails: {
//       Square: {
//         purpose: "To process payments and manage orders through Square POS.",
//         setupInstructions:
//           "Log in to your Square Developer Dashboard. Create an application to get your Application ID and Access Token.",
//         usageInWorkflow:
//           "The bot can integrate with your Square POS to process payments for orders placed through DMs and update order statuses.",
//       },
//       Stripe: {
//         purpose: "To process quick payments for orders or services.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "For immediate transactions, the bot will generate a secure Stripe payment link for the customer to complete their purchase.",
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a quick payment option.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative, fast payment method for customers who prefer PayPal for their purchases.",
//       },
//       DoorDash: {
//         purpose: "To integrate with DoorDash for food delivery orders.",
//         setupInstructions:
//           "This requires a partnership with DoorDash and access to their merchant API. You&apos;ll need specific API credentials provided by DoorDash.",
//         usageInWorkflow:
//           "If your restaurant offers DoorDash delivery, the bot can send orders directly to your DoorDash merchant account for fulfillment.",
//       },
//       "Uber Eats": {
//         purpose: "To integrate with Uber Eats for food delivery orders.",
//         setupInstructions:
//           "Similar to DoorDash, this requires an Uber Eats merchant account and access to their API. You&apos;ll need specific API credentials from Uber Eats.",
//         usageInWorkflow:
//           "The bot can pass orders to your Uber Eats merchant account for delivery, providing seamless integration with your delivery operations.",
//       },
//       SMS: {
//         purpose: "To send instant order confirmations and status updates via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "Customers will receive immediate SMS confirmations of their orders and updates on their order status (e.g., 'Order ready for pickup').",
//       },
//     },
//   },
//   {
//     id: "education-training",
//     name: "Education & Training",
//     category: "GROUP_6",
//     description: "For online courses, workshops, certifications, and educational content delivery.",
//     icon: <BookOpen className="h-6 w-6" />,
//     features: [
//       "Course enrollment",
//       "Content access management",
//       "Quiz/assessment support",
//       "Certificate generation",
//       "Student progress tracking",
//       "Learning platform integration",
//     ],
//     integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing"],
//     operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
//     commonUseCase: "Online academies, certification bodies, corporate training",
//     borderClass: "card-border-document",
//     howItWorks:
//       "This workflow automates the entire student lifecycle for educational platforms. From initial interest and enrollment to providing access to learning materials and tracking progress, it ensures a smooth educational journey.",
//     scenarioExample:
//       "A user DMs asking about a specific certification program. The bot provides details, answers FAQs, guides them through enrollment, processes payment, and grants access to the online course platform.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To manage course enrollments and student access on Teachable.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "The bot can automatically enroll students in courses and provide access links after successful registration.",
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, this integration allows the bot to handle student enrollment and access provisioning for Thinkific courses.",
//       },
//       Moodle: {
//         purpose: "To integrate with your Moodle LMS for course management and user synchronization.",
//         setupInstructions:
//           "In Moodle, enable web services (Site administration > Server > Web services > External services). Create a custom service and generate a token for a specific user with appropriate permissions.",
//         usageInWorkflow:
//           "The bot can create new user accounts in Moodle, enroll them in courses, and potentially retrieve basic progress information.",
//       },
//       Stripe: {
//         purpose: "To process payments for course fees or program subscriptions.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will securely handle course fee payments, generating links for students to complete their purchase.",
//       },
//       Zoom: {
//         purpose: "To schedule and manage live online classes, webinars, or tutoring sessions.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For live components of your courses, the bot can automatically create and share Zoom meeting links with enrolled students.",
//       },
//       "Email Marketing": {
//         purpose: "To add new students to your email lists for newsletters and updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "Upon enrollment, the bot can automatically add the student&apos;s email to your designated email marketing list for future communications.",
//       },
//     },
//   },
//   {
//     id: "community-management",
//     name: "Community Management",
//     category: "GROUP_7",
//     description: "For managing online communities, forums, membership sites, and social groups.",
//     icon: <Globe className="h-6 w-6" />,
//     features: [
//       "Member onboarding",
//       "Content moderation",
//       "Event announcements",
//       "Q&A support",
//       "Engagement tracking",
//       "Forum integration",
//     ],
//     integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing"],
//     operations: ["Join", "Onboarding", "Engagement", "Support"],
//     commonUseCase: "Online forums, membership communities, fan clubs",
//     borderClass: "card-border-communication",
//     howItWorks:
//       "This workflow helps manage and grow your online community. It automates member onboarding, facilitates Q&A, announces events, and can even assist with content moderation, fostering a vibrant and engaged community.",
//     scenarioExample:
//       "A new member DMs your community page. The bot welcomes them, provides links to community guidelines, introduces key channels, and answers initial questions, guiding them through the onboarding process.",
//     integrationDetails: {
//       Discord: {
//         purpose: "To manage roles, send announcements, and facilitate interactions within your Discord server.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL. For more advanced features, you might need a bot token and OAuth2 setup.",
//         usageInWorkflow:
//           "The bot can send welcome messages to new members, post event announcements, or even moderate certain types of messages in your Discord channels.",
//       },
//       Slack: {
//         purpose: "To manage team communications, share announcements, and provide quick support.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL. For interactive features, you might need a Slack App with specific permissions.",
//         usageInWorkflow:
//           "The bot can post updates, answer common questions in channels, or direct members to relevant resources within Slack.",
//       },
//       Circle: {
//         purpose: "To integrate with your Circle.so community platform for member management.",
//         setupInstructions:
//           "In your Circle community, go to Settings > Integrations > API. Generate an API token. You&apos;ll also need your community URL.",
//         usageInWorkflow:
//           "The bot can add new members to your Circle community, send direct messages, or post updates to specific spaces.",
//       },
//       "Mighty Networks": {
//         purpose: "To manage members and content within your Mighty Networks community.",
//         setupInstructions:
//           "Mighty Networks typically uses webhooks for integrations. You&apos;ll need to configure webhooks in your Mighty Networks settings to send data to your application.",
//         usageInWorkflow:
//           "The bot can welcome new members, share links to courses or content within Mighty Networks, and respond to common queries about the platform.",
//       },
//       Patreon: {
//         purpose: "To verify patron status and provide exclusive access or content.",
//         setupInstructions:
//           "In your Patreon Creator account, go to My Profile > My Apps. Create a new client to get your Client ID and Client Secret. You&apos;ll need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "The bot can check a user&apos;s Patreon pledge level and grant access to exclusive content or channels based on their tier.",
//       },
//       "Email Marketing": {
//         purpose: "To send community newsletters, event invitations, and important updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "The bot can add new community members to your email list for regular updates and event announcements.",
//       },
//     },
//   },
//   {
//     id: "customer-support-advanced",
//     name: "Customer Support (Advanced)",
//     category: "GROUP_8",
//     description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
//     icon: <LifeBuoy className="h-6 w-6" />,
//     features: [
//       "Ticket creation",
//       "Issue diagnosis",
//       "Knowledge base lookup",
//       "Escalation to human agent",
//       "Feedback collection",
//       "CRM integration",
//     ],
//     integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email"],
//     operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
//     commonUseCase: "Software companies, tech support, complex service providers",
//     borderClass: "card-border-integration",
//     howItWorks:
//       "This advanced support workflow handles complex customer inquiries, diagnoses issues, provides solutions from a knowledge base, and seamlessly escalates to human agents when needed. It ensures efficient and effective customer service.",
//     scenarioExample:
//       "A customer DMs with a technical issue. The bot asks diagnostic questions, searches the knowledge base for solutions, and if unable to resolve, creates a support ticket in Zendesk and notifies a human agent.",
//     integrationDetails: {
//       Zendesk: {
//         purpose: "To create, update, and manage support tickets.",
//         setupInstructions:
//           "In Zendesk, go to Admin > Channels > API > Token Access. Enable token access and create a new API token. You&apos;ll also need your Zendesk subdomain and email.",
//         usageInWorkflow:
//           "When a customer&apos;s issue requires human intervention, the bot will automatically create a new ticket in Zendesk, pre-filling it with conversation history and customer details.",
//       },
//       Freshdesk: {
//         purpose: "To create and manage support tickets in Freshdesk.",
//         setupInstructions:
//           "In Freshdesk, go to Admin > API Keys. Copy your API key. You&apos;ll also need your Freshdesk domain.",
//         usageInWorkflow:
//           "Similar to Zendesk, the bot can create new support tickets in Freshdesk, ensuring no customer inquiry falls through the cracks.",
//       },
//       "Salesforce Service Cloud": {
//         purpose: "To manage cases, contacts, and service interactions within Salesforce.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes for Service Cloud.",
//         usageInWorkflow:
//           "The bot can create new cases in Salesforce Service Cloud, update existing ones, and log all customer interactions directly to the case record.",
//       },
//       Intercom: {
//         purpose: "To manage customer conversations and provide in-app support.",
//         setupInstructions:
//           "In Intercom, go to Settings > Developers > Access Tokens. Generate a new access token with appropriate permissions (e.g., 'read_conversations', 'write_conversations').",
//         usageInWorkflow:
//           "The bot can respond to customer queries directly within Intercom, and if escalation is needed, it can assign the conversation to a human agent.",
//       },
//       Slack: {
//         purpose: "To notify support teams about urgent tickets or customer escalations.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "When a customer requests human assistance or an urgent issue is detected, the bot will send a real-time alert to your support team&apos;s Slack channel.",
//       },
//       Email: {
//         purpose: "To send automated email responses, confirmations, or follow-ups.",
//         setupInstructions:
//           "This typically involves an email sending service like SendGrid, Mailgun, or AWS SES. You&apos;ll need an API key and sender email configuration from your chosen service.",
//         usageInWorkflow:
//           "The bot can send automated email confirmations for ticket creation, provide knowledge base articles via email, or send follow-up surveys.",
//       },
//     },
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   additionalSettings?: Record<string, string>
// }

// interface IntegrationTestResult {
//   isTesting: boolean
//   result: "success" | "failure" | null
//   message: string | null
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review" | "customization">(
//     "selection",
//   )
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [modifyingWorkflowId, setModifyingWorkflowId] = useState<string | null>(null) // New state for modification
//   const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(false)
//     setModifyingWorkflowId(null) // Reset for new selection
//     setStep("configuration")
//   }

//   const handleRequestModifiedVersion = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(true)
//     setModifyingWorkflowId(workflow.id)
//     setCustomRequest(
//       `I&apos;d like to request a modified version of the "${workflow.name}" workflow. Please specify the changes you&apos;d like to make (e.g., add/remove integrations, modify process steps, adjust features):`,
//     )
//     setStep("customization")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//   }

//   const handleIntegrationConfig = (integration: string, config: Partial<IntegrationConfig>) => {
//     setIntegrationConfigs((prev) => ({
//       ...prev,
//       [integration]: { ...prev[integration], name: integration, ...config },
//     }))
//     // Reset test result when credentials change
//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleTestIntegration = async (integrationName: string) => {
//     const config = integrationConfigs[integrationName]
//     if (!config || (!config.apiKey && !config.apiSecret && !config.webhookUrl)) {
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "No credentials provided." },
//       }))
//       return
//     }

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integrationName]: { isTesting: true, result: null, message: "Testing..." },
//     }))

//     try {
//       const response = await fetch("/api/integrations/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationName, credentials: config }),
//       })
//       const result = await response.json()

//       if (result.success) {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "success", message: result.message },
//         }))
//       } else {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
//         }))
//       }
//     } catch (error) {
//       console.error("Error testing integration:", error)
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
//       }))
//     }
//   }

//   const handleFinalSubmit = async () => {
//     const workflowData = {
//       workflowTemplateId: selectedWorkflow?.id, // Use template ID
//       businessId: "your_business_id_here", // Replace with actual business ID
//       businessInfo,
//       integrations: selectedIntegrations.map((name) => ({
//         name,
//         config: integrationConfigs[name] || { name },
//       })),
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//     }

//     console.log("Submitting workflow configuration:", workflowData)
//     // API call would go here, e.g.:
//     // const response = await fetch('/api/workflow-config', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(workflowData),
//     // });
//     // const result = await response.json();
//     // console.log(result);
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap">
//                           {/* Removed complexity and estimatedSetupTime badges */}
//                         </div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                     <div className="flex gap-2 mt-4">
//                       <Button onClick={() => handleWorkflowSelect(workflow)} className="flex-1">
//                         Select Workflow
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => handleRequestModifiedVersion(workflow)}
//                         className="flex-1"
//                       >
//                         Request Modified Version
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <Card
//                 className="cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6"
//                 onClick={() => {
//                   setIsCustomWorkflow(true)
//                   setSelectedWorkflow(null) // Clear selected workflow for custom path
//                   setModifyingWorkflowId(null) // Ensure it's a new custom request
//                   setCustomRequest("") // Clear previous custom request
//                   setStep("customization")
//                 }}
//               >
//                 <Sparkles className="h-10 w-10 text-primary mb-4" />
//                 <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
//                 <CardDescription className="text-sm leading-relaxed">
//                   Can&apos;t find what you need? Describe your unique requirements, and we&apos;ll build it for you.
//                 </CardDescription>
//                 <Button variant="outline" className="mt-4 bg-transparent">
//                   Get Started
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "customization") {
//     const customizationTitle = modifyingWorkflowId
//       ? `Modify Your ${selectedWorkflow?.name} Workflow`
//       : "Request a Custom Workflow"
//     const customizationDescription = modifyingWorkflowId
//       ? "Tell us how you&apos;d like to adapt this existing workflow."
//       : "Tell us what you need, and we&apos;ll create a tailored solution for your business."
//     const textareaPlaceholder = modifyingWorkflowId
//       ? `Describe the specific changes you&apos;d like for the ${selectedWorkflow?.name} workflow. E.g., "Remove Google Calendar, add HubSpot CRM, and simplify the booking confirmation step."`
//       : "Describe the specific operations, features, and integrations you need. E.g., &apos;I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like &apos;urgent&apos; are detected.&apos;"

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   {customizationTitle}
//                 </h1>
//                 <p className="text-muted-foreground text-lg">{customizationDescription}</p>
//               </div>
//             </div>

//             <Card className="glassEffect border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   Describe Your Needs
//                 </CardTitle>
//                 <CardDescription>
//                   Please provide as much detail as possible about the workflow you envision.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="customRequest" className="text-sm font-medium">
//                     Custom Workflow Description *
//                   </Label>
//                   <Textarea
//                     id="customRequest"
//                     value={customRequest}
//                     onChange={(e) => setCustomRequest(e.target.value)}
//                     placeholder={textareaPlaceholder}
//                     rows={10}
//                     className="bg-background/50 border-border/50 focus:border-primary resize-y"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-end">
//               <Button
//                 onClick={() => setStep("review")}
//                 disabled={!customRequest.trim()}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Review Custom Request
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       {selectedWorkflow.icon}
//                       Workflow Overview
//                     </CardTitle>
//                     <CardDescription>
//                       Here&apos;s what your {selectedWorkflow.name} workflow will include
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-8">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {selectedWorkflow.operations.map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {selectedWorkflow.features.map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedWorkflow.integrations.map((integration, idx) => (
//                             <Badge key={idx} variant="outline" className="text-xs">
//                               {integration}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5 text-primary" />
//                       How This Workflow Works
//                     </CardTitle>
//                     <CardDescription>Understand the flow and see a real-world example.</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Explanation:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">{selectedWorkflow.howItWorks}</p>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Scenario Example:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">
//                         {selectedWorkflow.scenarioExample}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => {
//                 const testResult = integrationTestResults[integration]
//                 const details = selectedWorkflow.integrationDetails[integration]
//                 return (
//                   <Card
//                     key={integration}
//                     className={`glassEffect border-2 transition-all duration-300 ${
//                       selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10">
//                             <Zap className="h-5 w-5 text-primary" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-lg">{integration}</CardTitle>
//                             <CardDescription>
//                               {details?.purpose || `Configure your ${integration} integration`}
//                             </CardDescription>
//                           </div>
//                         </div>
//                         <Checkbox
//                           checked={selectedIntegrations.includes(integration)}
//                           onCheckedChange={() => handleIntegrationToggle(integration)}
//                           className="scale-125"
//                         />
//                       </div>
//                     </CardHeader>

//                     {selectedIntegrations.includes(integration) && (
//                       <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                         {details?.setupInstructions && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How to get credentials:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.setupInstructions}</p>
//                           </div>
//                         )}
//                         {details?.usageInWorkflow && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How we&apos;ll use it:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.usageInWorkflow}</p>
//                           </div>
//                         )}

//                         <div className="space-y-2">
//                           <Label htmlFor={`${integration}-api-key`} className="text-sm font-medium">
//                             API Key
//                           </Label>
//                           <Input
//                             id={`${integration}-api-key`}
//                             type="password"
//                             placeholder="Enter your API key"
//                             onChange={(e) => handleIntegrationConfig(integration, { apiKey: e.target.value })}
//                             className="bg-background/50 border-border/50 focus:border-primary"
//                             value={integrationConfigs[integration]?.apiKey || ""}
//                           />
//                         </div>

//                         {["Stripe", "PayPal", "Salesforce"].includes(integration) && (
//                           <div className="space-y-2">
//                             <Label htmlFor={`${integration}-api-secret`} className="text-sm font-medium">
//                               API Secret
//                             </Label>
//                             <Input
//                               id={`${integration}-api-secret`}
//                               type="password"
//                               placeholder="Enter your API secret"
//                               onChange={(e) => handleIntegrationConfig(integration, { apiSecret: e.target.value })}
//                               className="bg-background/50 border-border/50 focus:border-primary"
//                               value={integrationConfigs[integration]?.apiSecret || ""}
//                             />
//                           </div>
//                         )}

//                         {["Slack", "Discord"].includes(integration) && (
//                           <div>
//                             <Label htmlFor={`${integration}-webhook`} className="text-sm font-medium">
//                               Webhook URL (Optional)
//                             </Label>
//                             <Input
//                               id={`${integration}-webhook`}
//                               placeholder="https://your-webhook-url.com"
//                               onChange={(e) => handleIntegrationConfig(integration, { webhookUrl: e.target.value })}
//                               className="bg-background/50 border-border/50 focus:border-primary"
//                               value={integrationConfigs[integration]?.webhookUrl || ""}
//                             />
//                           </div>
//                         )}

//                         <div className="flex items-center gap-3 pt-2">
//                           <Button
//                             variant="outline"
//                             onClick={() => handleTestIntegration(integration)}
//                             disabled={testResult?.isTesting}
//                             className="flex items-center gap-2"
//                           >
//                             {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
//                             Test Credentials
//                           </Button>
//                           {testResult?.result === "success" && (
//                             <span className="text-green-500 flex items-center gap-1 text-sm">
//                               <CheckCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                           {testResult?.result === "failure" && (
//                             <span className="text-red-500 flex items-center gap-1 text-sm">
//                               <XCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                         </div>
//                       </CardContent>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8">
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 className="mb-6 hover:bg-accent"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isCustomWorkflow
//                         ? modifyingWorkflowId
//                           ? `Modified Version of ${selectedWorkflow?.name}`
//                           : "Custom Workflow Request"
//                         : selectedWorkflow?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   {!isCustomWorkflow && selectedWorkflow && (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         {/* Removed estimatedSetupTime from here as well */}
//                         N/A (Customizable)
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {isCustomWorkflow ? (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Custom Request Details
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Your Description:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground">
//                       Our team will review your request and contact you to discuss the custom workflow.
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="h-5 w-5 text-primary" />
//                       Configured Integrations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {selectedIntegrations.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedIntegrations.map((integration) => (
//                           <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm font-medium">{integration}</span>
//                             <Badge variant="outline" className="ml-auto text-xs">
//                               Configured
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <p className="text-sm text-muted-foreground">No integrations configured</p>
//                         <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isCustomWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Our team will review your custom workflow request.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will contact you within 1-2 business days to discuss details and next steps.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once finalized, your custom Voiceflow workflow will be built and deployed.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your Voiceflow workflow will be automatically configured
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration connections will be tested and verified
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your automation will be activated for social media DMs
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You&apos;ll receive a confirmation email with setup details
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 size="lg"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }













// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   MessageSquare,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   BookOpen,
//   Globe,
//   LifeBuoy,
//   Loader2,
//   XCircle,
//   PlayCircle,
//   PauseCircle,
// } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
//   howItWorks: string
//   scenarioExample: string
//   integrationDetails: {
//     [key: string]: {
//       purpose: string
//       setupInstructions: string
//       usageInWorkflow: string
//       credentialsFields: { id: string; label: string; type: string; optional?: boolean }[]
//     }
//   }
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS", "Voiceflow"],
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//     howItWorks:
//       "This workflow automates the entire appointment booking process, from initial inquiry to post-appointment follow-up. It handles scheduling, sends confirmations and reminders, and can even manage rescheduling or cancellations, freeing up your staff&apos;s time.",
//     scenarioExample:
//       "A client DMs your salon asking to book a haircut. The bot asks for their preferred date/time, checks availability via Google Calendar, confirms the booking, sends a reminder 24 hours prior, and a thank-you message after the appointment.",
//     integrationDetails: {
//       "Google Calendar": {
//         purpose: "To check real-time availability and create new appointments.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Calendar API, and create an OAuth 2.0 Client ID for a Web Application. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
//         usageInWorkflow:
//           "The bot will query your Google Calendar to find available slots and add new appointments directly to your calendar once confirmed by the user.",
//         credentialsFields: [{ id: "apiKey", label: "Client ID", type: "password" }],
//       },
//       Calendly: {
//         purpose: "To direct users to your Calendly booking page for self-service scheduling.",
//         setupInstructions:
//           "No API key needed. Simply provide your Calendly booking page URL. You can find this in your Calendly dashboard under 'Share Your Link'.",
//         usageInWorkflow:
//           "When a user expresses interest in booking, the bot will provide a direct link to your Calendly page, allowing them to choose a time that suits them.",
//         credentialsFields: [],
//       },
//       Acuity: {
//         purpose: "To integrate with your Acuity Scheduling account for booking and availability.",
//         setupInstructions:
//           "In your Acuity Scheduling account, go to Integrations > API. Generate a new API key. You&apos;ll need this key to connect.",
//         usageInWorkflow:
//           "The bot will use the Acuity API to check your schedule, book appointments, and manage client information directly within your Acuity account.",
//         credentialsFields: [{ id: "apiKey", label: "Acuity API Key", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process payments for appointments or booking deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "If your service requires a deposit or full payment upfront, the bot will generate a secure payment link via Stripe for the user to complete the transaction.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To automatically create Zoom meeting links for virtual appointments.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For virtual appointments, the bot will automatically generate a unique Zoom meeting link and include it in the appointment confirmation and reminder messages.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       SMS: {
//         purpose: "To send appointment confirmations and reminders via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "After booking, the bot will send an SMS confirmation. It will also send automated reminders before the appointment to reduce no-shows.",
//         credentialsFields: [
//           { id: "apiKey", label: "SMS Provider API Key", type: "password" },
//           { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack", "Voiceflow"],
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//     howItWorks:
//       "This workflow streamlines the process of providing custom quotes. It guides the user through gathering necessary details, allows for dynamic pricing based on inputs, generates a professional quote, and can even handle negotiation steps.",
//     scenarioExample:
//       "A potential client DMs your photography studio asking for wedding photography pricing. The bot asks for date, location, hours needed, and guest count. Based on this, it generates an estimated quote and offers to schedule a consultation call.",
//     integrationDetails: {
//       "Google Drive": {
//         purpose: "To store collected documents, photos, or project specifications from clients.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Google Drive API, and create an OAuth 2.0 Client ID. You&apos;ll need the Client ID and Client Secret.",
//         usageInWorkflow:
//           "If the workflow requires clients to upload files (e.g., photos for a photography quote), the bot will provide a link or mechanism to upload directly to a designated Google Drive folder.",
//         credentialsFields: [{ id: "apiKey", label: "Google Drive Client ID", type: "password" }],
//       },
//       Dropbox: {
//         purpose: "To store and share large files or project assets with clients.",
//         setupInstructions:
//           "Go to the Dropbox App Console, create a new app, and generate an access token. Ensure the app has the necessary permissions (e.g., files.content.write).",
//         usageInWorkflow:
//           "Similar to Google Drive, this allows for secure file uploads and sharing of project-related documents or drafts with clients.",
//         credentialsFields: [{ id: "apiKey", label: "Dropbox Access Token", type: "password" }],
//       },
//       QuickBooks: {
//         purpose: "To generate professional invoices and manage client billing.",
//         setupInstructions:
//           "Log in to your QuickBooks Developer account. Create an app and obtain your Client ID and Client Secret. You&apos;ll also need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can automatically generate a draft invoice in QuickBooks based on the agreed-upon services and pricing.",
//         credentialsFields: [
//           { id: "apiKey", label: "QuickBooks Client ID", type: "password" },
//           { id: "apiSecret", label: "QuickBooks Client Secret", type: "password" },
//         ],
//       },
//       Stripe: {
//         purpose: "To process payments for accepted quotes or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "After a quote is finalized, the bot can send a secure Stripe payment link to the client for deposit or full payment.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       DocuSign: {
//         purpose: "To send and manage digital contracts or agreements for quotes.",
//         setupInstructions:
//           "Create a DocuSign Developer account. Create an integration key (Client ID) and generate a private key. You&apos;ll also need to configure OAuth 2.0.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can initiate a DocuSign envelope with the contract, allowing clients to digitally sign agreements.",
//         credentialsFields: [{ id: "apiKey", label: "DocuSign Integration Key", type: "password" }],
//       },
//       Slack: {
//         purpose: "To notify your team about new quote requests or accepted quotes.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new quote inquiry comes in or a quote is accepted, keeping your team informed.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs", "Voiceflow"],
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//     howItWorks:
//       "This workflow is designed for businesses with complex product sales, often involving customization, financing, or detailed consultations. It guides customers through product selection, gathers specific requirements, and facilitates the sales process up to delivery.",
//     scenarioExample:
//       "A customer DMs a car dealership asking about a specific model. The bot checks inventory, asks about desired features and financing needs, and then schedules a test drive with a sales representative.",
//     integrationDetails: {
//       Salesforce: {
//         purpose: "To create and update leads, contacts, and opportunities in your CRM.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes.",
//         usageInWorkflow:
//           "New inquiries will automatically create leads in Salesforce. As the conversation progresses, the bot can update lead status or add notes to the contact record.",
//         credentialsFields: [
//           { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
//           { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
//         ],
//       },
//       HubSpot: {
//         purpose: "To manage leads, contacts, and deals within your HubSpot CRM.",
//         setupInstructions:
//           "In HubSpot, go to Settings > Integrations > Private Apps. Create a new private app and obtain your Access Token. Ensure necessary CRM scopes are granted.",
//         usageInWorkflow:
//           "Similar to Salesforce, the bot will create new contacts or update existing ones in HubSpot, logging interactions and moving deals through your sales pipeline.",
//         credentialsFields: [{ id: "apiKey", label: "HubSpot Access Token", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process payments for product purchases or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "When a customer is ready to purchase, the bot can generate a secure Stripe payment link for them to complete the transaction.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a payment option for product sales.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative payment gateway for customers who prefer to use PayPal for their purchases.",
//         credentialsFields: [
//           { id: "apiKey", label: "PayPal Client ID", type: "password" },
//           { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
//         ],
//       },
//       Shopify: {
//         purpose: "To check product inventory, retrieve product details, and create orders.",
//         setupInstructions:
//           "In your Shopify admin, go to Apps > Develop apps > Create an app. Grant necessary permissions (e.g., read_products, write_orders) and install the app to get your API access token.",
//         usageInWorkflow:
//           "The bot can query your Shopify store for product availability, provide product descriptions, and even initiate draft orders based on customer selections.",
//         credentialsFields: [{ id: "apiKey", label: "Shopify API Access Token", type: "password" }],
//       },
//       "Inventory APIs": {
//         purpose: "To integrate with external inventory management systems for real-time stock checks.",
//         setupInstructions:
//           "This depends on your specific inventory system (e.g., custom API, ERP system). You&apos;ll need the API endpoint and authentication details (API key, OAuth token, etc.) provided by your system.",
//         usageInWorkflow:
//           "Before confirming a product&apos;s availability, the bot will check your inventory system to ensure the item is in stock, preventing overselling.",
//         credentialsFields: [
//           { id: "apiKey", label: "Inventory System API Key", type: "password" },
//           { id: "additionalSettings.endpoint", label: "API Endpoint URL", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom", "Voiceflow"],
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//     howItWorks:
//       "This workflow automates the enrollment process for online courses, coaching programs, or educational services. It qualifies leads, handles payments, grants access to course materials, and can even integrate with community platforms.",
//     scenarioExample:
//       "A prospective student DMs asking about your online coding course. The bot provides course details, answers FAQs, offers a free preview, and guides them through the enrollment and payment process.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To enroll students in your Teachable courses and manage access.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "Upon successful payment, the bot can automatically enroll the student in the specified Teachable course and provide them with access instructions.",
//         credentialsFields: [
//           { id: "apiKey", label: "Teachable API Key", type: "password" },
//           { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
//         ],
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, the bot can enroll students in Thinkific courses and ensure they receive the necessary login details.",
//         credentialsFields: [
//           { id: "apiKey", label: "Thinkific API Key", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
//         ],
//       },
//       Discord: {
//         purpose: "To invite new students to your private Discord community.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "After enrollment, the bot can send an automated message to the student with an invite link to your exclusive Discord community.",
//         credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
//       },
//       Slack: {
//         purpose: "To notify your team about new enrollments or student inquiries.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new student enrolls or has a question, keeping your team updated.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Stripe: {
//         purpose: "To process payments for course enrollments.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will generate secure payment links via Stripe for students to purchase courses or programs.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To schedule and manage live coaching calls or webinars.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS", "Voiceflow"],
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//     howItWorks:
//       "This workflow is designed for businesses that handle quick, high-volume transactions. It allows customers to quickly browse offerings, place orders or make simple bookings, and receive instant confirmations, ideal for fast-paced environments.",
//     scenarioExample:
//       "A customer DMs a restaurant asking to order takeout. The bot displays the menu, takes their order, processes payment via Stripe, and sends an order confirmation with an estimated pickup time.",
//     integrationDetails: {
//       Square: {
//         purpose: "To process payments and manage orders through Square POS.",
//         setupInstructions:
//           "Log in to your Square Developer Dashboard. Create an application to get your Application ID and Access Token.",
//         usageInWorkflow:
//           "The bot can integrate with your Square POS to process payments for orders placed through DMs and update order statuses.",
//         credentialsFields: [{ id: "apiKey", label: "Square Access Token", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process quick payments for orders or services.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "For immediate transactions, the bot will generate a secure Stripe payment link for the customer to complete their purchase.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a quick payment option.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative, fast payment method for customers who prefer to use PayPal for their purchases.",
//         credentialsFields: [
//           { id: "apiKey", label: "PayPal Client ID", type: "password" },
//           { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
//         ],
//       },
//       DoorDash: {
//         purpose: "To integrate with DoorDash for food delivery orders.",
//         setupInstructions:
//           "This requires a partnership with DoorDash and access to their merchant API. You&apos;ll need specific API credentials provided by DoorDash.",
//         usageInWorkflow:
//           "If your restaurant offers DoorDash delivery, the bot can send orders directly to your DoorDash merchant account for fulfillment.",
//         credentialsFields: [{ id: "apiKey", label: "DoorDash API Key", type: "password" }],
//       },
//       "Uber Eats": {
//         purpose: "To integrate with Uber Eats for food delivery orders.",
//         setupInstructions:
//           "Similar to DoorDash, this requires an Uber Eats merchant account and access to their API. You&apos;ll need specific API credentials from Uber Eats.",
//         usageInWorkflow:
//           "The bot can pass orders to your Uber Eats merchant account for delivery, providing seamless integration with your delivery operations.",
//         credentialsFields: [{ id: "apiKey", label: "Uber Eats API Key", type: "password" }],
//       },
//       SMS: {
//         purpose: "To send instant order confirmations and status updates via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "Customers will receive immediate SMS confirmations of their orders and updates on their order status (e.g., 'Order ready for pickup').",
//         credentialsFields: [
//           { id: "apiKey", label: "SMS Provider API Key", type: "password" },
//           { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "education-training",
//     name: "Education & Training",
//     category: "GROUP_6",
//     description: "For online courses, workshops, certifications, and educational content delivery.",
//     icon: <BookOpen className="h-6 w-6" />,
//     features: [
//       "Course enrollment",
//       "Content access management",
//       "Quiz/assessment support",
//       "Certificate generation",
//       "Student progress tracking",
//       "Learning platform integration",
//     ],
//     integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing", "Voiceflow"],
//     operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
//     commonUseCase: "Online academies, certification bodies, corporate training",
//     borderClass: "card-border-document",
//     howItWorks:
//       "This workflow automates the entire student lifecycle for educational platforms. From initial interest and enrollment to providing access to learning materials and tracking progress, it ensures a smooth educational journey.",
//     scenarioExample:
//       "A user DMs asking about a specific certification program. The bot provides details, answers FAQs, guides them through enrollment, processes payment, and grants access to the online course platform.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To manage course enrollments and student access on Teachable.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "The bot can automatically enroll students in courses and provide access links after successful registration.",
//         credentialsFields: [
//           { id: "apiKey", label: "Teachable API Key", type: "password" },
//           { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
//         ],
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, this integration allows the bot to handle student enrollment and access provisioning for Thinkific courses.",
//         credentialsFields: [
//           { id: "apiKey", label: "Thinkific API Key", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
//         ],
//       },
//       Moodle: {
//         purpose: "To integrate with your Moodle LMS for course management and user synchronization.",
//         setupInstructions:
//           "In Moodle, enable web services (Site administration > Server > Web services > External services). Create a custom service and generate a token for a specific user with appropriate permissions.",
//         usageInWorkflow:
//           "The bot can create new user accounts in Moodle, enroll them in courses, and potentially retrieve basic progress information.",
//         credentialsFields: [
//           { id: "apiKey", label: "Moodle API Token", type: "password" },
//           { id: "additionalSettings.serviceUrl", label: "Moodle Web Service URL", type: "text" },
//         ],
//       },
//       Stripe: {
//         purpose: "To process payments for course fees or program subscriptions.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will securely handle course fee payments, generating links for students to complete their purchase.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To schedule and manage live online classes, webinars, or tutoring sessions.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create and share Zoom meeting links with enrolled students.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       "Email Marketing": {
//         purpose: "To add new students to your email lists for newsletters and updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "Upon enrollment, the bot can automatically add the student&apos;s email to your designated email marketing list for future communications.",
//         credentialsFields: [
//           { id: "apiKey", label: "Email Marketing API Key", type: "password" },
//           { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "community-management",
//     name: "Community Management",
//     category: "GROUP_7",
//     description: "For managing online communities, forums, membership sites, and social groups.",
//     icon: <Globe className="h-6 w-6" />,
//     features: [
//       "Member onboarding",
//       "Content moderation",
//       "Event announcements",
//       "Q&A support",
//       "Engagement tracking",
//       "Forum integration",
//     ],
//     integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing", "Voiceflow"],
//     operations: ["Join", "Onboarding", "Engagement", "Support"],
//     commonUseCase: "Online forums, membership communities, fan clubs",
//     borderClass: "card-border-communication",
//     howItWorks:
//       "This workflow helps manage and grow your online community. It automates member onboarding, facilitates Q&A, announces events, and can even assist with content moderation, fostering a vibrant and engaged community.",
//     scenarioExample:
//       "A new member DMs your community page. The bot welcomes them, provides links to community guidelines, introduces key channels, and answers initial questions, guiding them through the onboarding process.",
//     integrationDetails: {
//       Discord: {
//         purpose: "To manage roles, send announcements, and facilitate interactions within your Discord server.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "The bot can send welcome messages to new members, post event announcements, or even moderate certain types of messages in your Discord channels.",
//         credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
//       },
//       Slack: {
//         purpose: "To manage team communications, share announcements, and provide quick support.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot can post updates, answer common questions in channels, or direct members to relevant resources within Slack.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Circle: {
//         purpose: "To integrate with your Circle.so community platform for member management.",
//         setupInstructions:
//           "In your Circle community, go to Settings > Integrations > API. Generate an API token. You&apos;ll also need your community URL.",
//         usageInWorkflow:
//           "The bot can add new members to your Circle community, send direct messages, or post updates to specific spaces.",
//         credentialsFields: [
//           { id: "apiKey", label: "Circle.so API Token", type: "password" },
//           { id: "additionalSettings.communityUrl", label: "Circle Community URL", type: "text" },
//         ],
//       },
//       "Mighty Networks": {
//         purpose: "To manage members and content within your Mighty Networks community.",
//         setupInstructions:
//           "Mighty Networks typically uses webhooks for integrations. You&apos;ll need to configure webhooks in your Mighty Networks settings to send data to your application.",
//         usageInWorkflow:
//           "The bot can welcome new members, share links to courses or content within Mighty Networks, and respond to common queries about the platform.",
//         credentialsFields: [{ id: "webhookUrl", label: "Mighty Networks Webhook URL", type: "text", optional: true }],
//       },
//       Patreon: {
//         purpose: "To verify patron status and provide exclusive access or content.",
//         setupInstructions:
//           "In your Patreon Creator account, go to My Profile > My Apps. Create a new client to get your Client ID and Client Secret. You&apos;ll need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "The bot can check a user&apos;s Patreon pledge level and grant access to exclusive content or channels based on their tier.",
//         credentialsFields: [
//           { id: "apiKey", label: "Patreon Client ID", type: "password" },
//           { id: "apiSecret", label: "Patreon Client Secret", type: "password" },
//         ],
//       },
//       "Email Marketing": {
//         purpose: "To send community newsletters, event invitations, and important updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "Upon enrollment, the bot can automatically add the student&apos;s email to your designated email marketing list for future communications.",
//         credentialsFields: [
//           { id: "apiKey", label: "Email Marketing API Key", type: "password" },
//           { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "customer-support-advanced",
//     name: "Customer Support (Advanced)",
//     category: "GROUP_8",
//     description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
//     icon: <LifeBuoy className="h-6 w-6" />,
//     features: [
//       "Ticket creation",
//       "Issue diagnosis",
//       "Knowledge base lookup",
//       "Escalation to human agent",
//       "Feedback collection",
//       "CRM integration",
//     ],
//     integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email", "Voiceflow"],
//     operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
//     commonUseCase: "Software companies, tech support, complex service providers",
//     borderClass: "card-border-integration",
//     howItWorks:
//       "This advanced support workflow handles complex customer inquiries, diagnoses issues, provides solutions from a knowledge base, and seamlessly escalates to human agents when needed. It ensures efficient and effective customer service.",
//     scenarioExample:
//       "A customer DMs with a technical issue. The bot asks diagnostic questions, searches the knowledge base for solutions, and if unable to resolve, creates a support ticket in Zendesk and notifies a human agent.",
//     integrationDetails: {
//       Zendesk: {
//         purpose: "To create, update, and manage support tickets.",
//         setupInstructions:
//           "In Zendesk, go to Admin > Channels > API > Token Access. Enable token access and create a new API token. You&apos;ll also need your Zendesk subdomain and email.",
//         usageInWorkflow:
//           "When a customer&apos;s issue requires human intervention, the bot will automatically create a new ticket in Zendesk, pre-filling it with conversation history and customer details.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zendesk API Token", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Zendesk Subdomain", type: "text" },
//           { id: "additionalSettings.email", label: "Zendesk Email", type: "email" },
//         ],
//       },
//       Freshdesk: {
//         purpose: "To create and manage support tickets in Freshdesk.",
//         setupInstructions:
//           "In Freshdesk, go to Admin > API Keys. Copy your API key. You&apos;ll also need your Freshdesk domain.",
//         usageInWorkflow:
//           "Similar to Zendesk, the bot can create new support tickets in Freshdesk, ensuring no customer inquiry falls through the cracks.",
//         credentialsFields: [
//           { id: "apiKey", label: "Freshdesk API Key", type: "password" },
//           { id: "additionalSettings.domain", label: "Freshdesk Domain", type: "text" },
//         ],
//       },
//       "Salesforce Service Cloud": {
//         purpose: "To manage cases, contacts, and service interactions within Salesforce.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes for Service Cloud.",
//         usageInWorkflow:
//           "The bot can create new cases in Salesforce Service Cloud, update existing ones, and log all customer interactions directly to the case record.",
//         credentialsFields: [
//           { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
//           { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
//         ],
//       },
//       Intercom: {
//         purpose: "To manage customer conversations and provide in-app support.",
//         setupInstructions:
//           "In Intercom, go to Settings > Developers > Access Tokens. Generate a new access token with appropriate permissions (e.g., 'read_conversations', 'write_conversations').",
//         usageInWorkflow:
//           "The bot can respond to customer queries directly within Intercom, and if escalation is needed, it can assign the conversation to a human agent.",
//         credentialsFields: [{ id: "apiKey", label: "Intercom Access Token", type: "password" }],
//       },
//       Slack: {
//         purpose: "To notify support teams about urgent tickets or customer escalations.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "When a customer requests human assistance or an urgent issue is detected, the bot will send a real-time alert to your support team&apos;s Slack channel.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Email: {
//         purpose: "To send automated email responses, confirmations, or follow-ups.",
//         setupInstructions:
//           "This typically involves an email sending service like SendGrid, Mailgun, or AWS SES. You&apos;ll need an API key and sender email configuration from your chosen service.",
//         usageInWorkflow:
//           "The bot can send automated email confirmations for ticket creation, provide knowledge base articles via email, or send follow-up surveys.",
//         credentialsFields: [{ id: "apiKey", label: "Email Service API Key", type: "password" }],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   projectId?: string
//   versionId?: string
//   additionalSettings?: Record<string, string>
// }

// interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: IntegrationConfig }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   // NEW: Add credentials to the type to easily access them when fetching active workflow
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string // This will be a JSON string, parsed on client
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
// }

// interface IntegrationTestResult {
//   isTesting: boolean
//   result: "success" | "failure" | null
//   message: string | null
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review" | "customization">(
//     "selection",
//   )
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [modifyingWorkflowId, setModifyingWorkflowId] = useState<string | null>(null)
//   const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

//   // NEW STATES FOR ACTIVE WORKFLOW
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)

//   // In a real app, you'd get the current user's businessId from context/auth
//   // For this demo, let's assume a placeholder business ID.
//   // This needs to be replaced with actual user-specific business ID from a backend context
//   const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8" // Example placeholder. MUST BE REPLACED.

//   // Effect to fetch active workflow on component mount
//   useEffect(() => {
//     const fetchActiveWorkflow = async () => {
//       setIsFetchingActiveWorkflow(true)
//       try {
//         if (!currentBusinessId) {
//           console.warn("No business ID available to fetch active workflow.")
//           setIsFetchingActiveWorkflow(false)
//           return
//         }

//         const response = await fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`)
//         if (response.ok) {
//           const data = await response.json()
//           if (data.workflowConfigs && data.workflowConfigs.length > 0) {
//             const activeConfig = data.workflowConfigs[0] // Assuming only one active workflow per business
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)

//             // Pre-populate credentials if re-loading an active workflow
//             const loadedIntegrationConfigs: Record<string, IntegrationConfig> = {}
//             const loadedSelectedIntegrations: string[] = []
//             activeConfig.credentials.forEach((cred: any) => {
//               try {
//                 const parsedConfig = JSON.parse(cred.encryptedCredentials)
//                 loadedIntegrationConfigs[cred.integrationName] = {
//                   name: cred.integrationName,
//                   ...parsedConfig,
//                 }
//                 loadedSelectedIntegrations.push(cred.integrationName)
//               } catch (e) {
//                 console.error("Failed to parse credentials for", cred.integrationName, e)
//               }
//             })
//             setIntegrationConfigs(loadedIntegrationConfigs)
//             setSelectedIntegrations(loadedSelectedIntegrations)
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         } else {
//           console.error("Failed to fetch active workflow configurations:", await response.text())
//         }
//       } catch (error) {
//         console.error("Error fetching active workflow:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//       }
//     }

//     fetchActiveWorkflow()
//   }, [currentBusinessId])

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     if (activeWorkflowExists) return
//     setSelectedWorkflow(workflow)
//     // Clear any previous custom request or modification state
//     setIsCustomWorkflow(false)
//     setModifyingWorkflowId(null)
//     setCustomRequest("")
//     // Reset integration states for the new selection
//     setIntegrationConfigs({})
//     setSelectedIntegrations([])
//     setIntegrationTestResults({})
//     setStep("configuration")
//   }

//   // Moved to configuration step
//   const handleRequestModifiedVersion = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(true)
//     setModifyingWorkflowId(workflow.id)
//     setCustomRequest(
//       `I&apos;d like to request a modified version of the "${workflow.name}" workflow. Please specify the changes you&apos;d like to make (e.g., add/remove integrations, modify process steps, adjust features):`,
//     )
//     setStep("customization")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleIntegrationConfig = (integration: string, fieldId: string, value: string) => {
//     setIntegrationConfigs((prev) => {
//       const currentConfig = prev[integration] || { name: integration }
//       const updatedConfig = { ...currentConfig }

//       if (fieldId.includes(".")) {
//         const [mainField, subField] = fieldId.split(".")
//         if (!(updatedConfig as any)[mainField]) {
//           ;(updatedConfig as any)[mainField] = {}
//         }
//         ;(updatedConfig as any)[mainField][subField] = value
//       } else {
//         ;(updatedConfig as any)[fieldId] = value
//       }

//       return {
//         ...prev,
//         [integration]: updatedConfig,
//       }
//     })

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleTestIntegration = async (integrationName: string) => {
//     const config = integrationConfigs[integrationName]
//     const details = selectedWorkflow?.integrationDetails[integrationName]
//     const hasRequiredFields = details?.credentialsFields.every(
//       (field) =>
//         field.optional ||
//         (config as any)?.[field.id.split(".")[0]]?.[field.id.split(".")[1]] ||
//         (config as any)?.[field.id],
//     )

//     if (!hasRequiredFields) {
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Missing required credentials for test." },
//       }))
//       return
//     }

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integrationName]: { isTesting: true, result: null, message: "Testing..." },
//     }))

//     try {
//       const response = await fetch("/api/integrations/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationName, credentials: config }),
//       })
//       const result = await response.json()

//       if (result.success) {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "success", message: result.message },
//         }))
//       } else {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
//         }))
//       }
//     } catch (error) {
//       console.error("Error testing integration:", error)
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
//       }))
//     }
//   }

//   // NEW: Function to check if all selected integrations have been tested successfully
//   const areAllSelectedIntegrationsTestedSuccessfully = () => {
//     if (selectedIntegrations.length === 0) return true

//     for (const integration of selectedIntegrations) {
//       const testResult = integrationTestResults[integration]
//       const details = selectedWorkflow?.integrationDetails[integration]

//       // Only require testing if the integration has defined credential fields
//       if (details?.credentialsFields && details.credentialsFields.length > 0) {
//         // Also ensure all *required* fields for this integration actually have a value
//         const config = integrationConfigs[integration] || {}
//         const hasAllRequiredFields = details.credentialsFields.every(
//           (field) =>
//             field.optional ||
//             (field.id.includes(".")
//               ? (config as any)[field.id.split(".")[0]]?.[field.id.split(".")[1]]
//               : (config as any)[field.id]),
//         )

//         if (!hasAllRequiredFields || !testResult || testResult.result !== "success") {
//           return false
//         }
//       }
//     }
//     return true
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentBusinessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     const integrationsToSubmit = selectedIntegrations.map((name) => ({
//       name,
//       config: integrationConfigs[name] || { name },
//     }))

//     const workflowData = {
//       workflowTemplateId: selectedWorkflow?.id || null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: integrationsToSubmit,
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       isActive: !isCustomWorkflow, // Templates are active immediately, custom requests are not
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()
//       if (result.success) {
//         alert(isCustomWorkflow ? "Custom workflow request submitted successfully!" : "Workflow deployed successfully!")
//         setActiveWorkflowExists(true)
//         setActiveWorkflowDetails(result.workflowConfig)
//         setStep("review")
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     if (!window.confirm("Are you sure you want to deactivate this workflow? This will stop all automated responses.")) {
//       return
//     }

//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setSelectedWorkflow(null)
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setIntegrationConfigs({})
//         setSelectedIntegrations([])
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setModifyingWorkflowId(null)
//         setIntegrationTestResults({})
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   if (isFetchingActiveWorkflow) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   if (activeWorkflowExists && activeWorkflowDetails) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6 text-center">
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <PlayCircle className="h-8 w-8 text-green-500" />
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                 Your Workflow is Running!
//               </h1>
//             </div>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
//               Your &quot;{activeWorkflowDetails.workflowTemplate?.name || "Custom Workflow"}&quot; is active and
//               automating responses for your business.
//             </p>

//             <Card className="glassEffect border-2 border-green-500/50 mb-8 p-6">
//               <CardHeader className="p-0 mb-4">
//                 <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//                   <Sparkles className="h-6 w-6" />
//                   Active Workflow Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-left">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.workflowTemplate?.name || "Custom Workflow"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.businessInfo.businessName}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.businessInfo.businessType}
//                   </p>
//                 </div>
//                 {activeWorkflowDetails.customRequest && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Custom Request:</Label>
//                     <p className="text-base bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">
//                       {activeWorkflowDetails.customRequest}
//                     </p>
//                   </div>
//                 )}
//                 {activeWorkflowDetails.credentials && activeWorkflowDetails.credentials.length > 0 && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Configured Integrations:</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {activeWorkflowDetails.credentials.map((cred, idx) => (
//                         <Badge key={idx} variant="secondary" className="text-sm">
//                           {cred.integrationName}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Status:</Label>
//                   <Badge className="bg-green-600 text-green-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//                     <PlayCircle className="h-4 w-4 mr-2" />
//                     {activeWorkflowDetails.status}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-center gap-4">
//               <Button
//                 onClick={handleDeactivateWorkflow}
//                 disabled={isDeactivating}
//                 size="lg"
//                 className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-semibold"
//               >
//                 {isDeactivating ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <PauseCircle className="h-4 w-4 mr-2" />
//                 )}
//                 {isDeactivating ? "Deactivating..." : "Deactivate Workflow"}
//               </Button>
//             </div>
//             <p className="text-xs text-muted-foreground mt-6">
//               To choose a different workflow, please deactivate the current one first.
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => !activeWorkflowExists && handleWorkflowSelect(workflow)}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap"></div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                     <div className="flex gap-2 mt-4">
//                       <Button
//                         onClick={() => handleWorkflowSelect(workflow)}
//                         className="flex-1"
//                         disabled={activeWorkflowExists}
//                       >
//                         Select Workflow
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => {
//                   if (!activeWorkflowExists) {
//                     setIsCustomWorkflow(true)
//                     setSelectedWorkflow(null)
//                     setModifyingWorkflowId(null)
//                     setCustomRequest("")
//                     setStep("customization")
//                   }
//                 }}
//               >
//                 <Sparkles className="h-10 w-10 text-primary mb-4" />
//                 <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
//                 <CardDescription className="text-sm leading-relaxed">
//                   Can&apos;t find what you need? Describe your unique requirements, and we&apos;ll build it for you.
//                 </CardDescription>
//                 <Button variant="outline" className="mt-4 bg-transparent" disabled={activeWorkflowExists}>
//                   Get Started
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "customization") {
//     const customizationTitle = modifyingWorkflowId
//       ? `Modify Your ${selectedWorkflow?.name} Workflow`
//       : "Request a Custom Workflow"
//     const customizationDescription = modifyingWorkflowId
//       ? "Tell us how you&apos;d like to adapt this existing workflow."
//       : "Tell us what you need, and we&apos;ll create a tailored solution for your business."
//     const textareaPlaceholder = modifyingWorkflowId
//       ? `Describe the specific changes you&apos;d like for the ${selectedWorkflow?.name} workflow. E.g., "Remove Google Calendar, add HubSpot CRM, and simplify the booking confirmation step."`
//       : "Describe the specific operations, features, and integrations you need. E.g., &apos;I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like &apos;urgent&apos; are detected.&apos;"

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   {customizationTitle}
//                 </h1>
//                 <p className="text-muted-foreground text-lg">{customizationDescription}</p>
//               </div>
//             </div>

//             <Card className="glassEffect border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   Describe Your Needs
//                 </CardTitle>
//                 <CardDescription>
//                   Please provide as much detail as possible about the workflow you envision.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="customRequest" className="text-sm font-medium">
//                     Custom Workflow Description *
//                   </Label>
//                   <Textarea
//                     id="customRequest"
//                     value={customRequest}
//                     onChange={(e) => setCustomRequest(e.target.value)}
//                     placeholder={textareaPlaceholder}
//                     rows={10}
//                     className="bg-background/50 border-border/50 focus:border-primary resize-y"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-end">
//               <Button
//                 onClick={() => setStep("review")}
//                 disabled={!customRequest.trim()}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Review Custom Request
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       {selectedWorkflow.icon}
//                       Workflow Overview
//                     </CardTitle>
//                     <CardDescription>
//                       Here&apos;s what your {selectedWorkflow.name} workflow will include
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-8">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {selectedWorkflow.operations.map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {selectedWorkflow.features.map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedWorkflow.integrations.map((integration, idx) => (
//                             <Badge key={idx} variant="outline" className="text-xs">
//                               {integration}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5 text-primary" />
//                       How This Workflow Works
//                     </CardTitle>
//                     <CardDescription>Understand the flow and see a real-world example.</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Explanation:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">{selectedWorkflow.howItWorks}</p>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Scenario Example:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">
//                         {selectedWorkflow.scenarioExample}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <div className="flex justify-end mt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => handleRequestModifiedVersion(selectedWorkflow)}
//                     className="flex-1 bg-transparent hover:bg-accent"
//                   >
//                     Request Modified Version
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     const isReadyForReview = areAllSelectedIntegrationsTestedSuccessfully() && selectedIntegrations.length > 0

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => {
//                 const testResult = integrationTestResults[integration]
//                 const details = selectedWorkflow.integrationDetails[integration]
//                 return (
//                   <Card
//                     key={integration}
//                     className={`glassEffect border-2 transition-all duration-300 ${
//                       selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10">
//                             <Zap className="h-5 w-5 text-primary" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-lg">{integration}</CardTitle>
//                             <CardDescription>
//                               {details?.purpose || `Configure your ${integration} integration`}
//                             </CardDescription>
//                           </div>
//                         </div>
//                         <Checkbox
//                           checked={selectedIntegrations.includes(integration)}
//                           onCheckedChange={() => handleIntegrationToggle(integration)}
//                           className="scale-125"
//                         />
//                       </div>
//                     </CardHeader>

//                     {selectedIntegrations.includes(integration) && (
//                       <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                         {details?.setupInstructions && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How to get credentials:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.setupInstructions}</p>
//                           </div>
//                         )}
//                         {details?.usageInWorkflow && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How we&apos;ll use it:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.usageInWorkflow}</p>
//                           </div>
//                         )}

//                         {details?.credentialsFields.map((field) => {
//                           const fieldValue = field.id.includes(".")
//                             ? (integrationConfigs[integration] as any)?.[field.id.split(".")[0]]?.[
//                                 field.id.split(".")[1]
//                               ] || ""
//                             : (integrationConfigs[integration] as any)?.[field.id] || ""
//                           return (
//                             <div className="space-y-2" key={field.id}>
//                               <Label htmlFor={`${integration}-${field.id}`} className="text-sm font-medium">
//                                 {field.label} {field.optional ? "(Optional)" : "*"}
//                               </Label>
//                               <Input
//                                 id={`${integration}-${field.id}`}
//                                 type={field.type}
//                                 placeholder={`Enter your ${field.label.toLowerCase()}`}
//                                 onChange={(e) => handleIntegrationConfig(integration, field.id, e.target.value)}
//                                 className="bg-background/50 border-border/50 focus:border-primary"
//                                 value={fieldValue}
//                               />
//                             </div>
//                           )
//                         })}

//                         <div className="flex items-center gap-3 pt-2">
//                           <Button
//                             variant="outline"
//                             onClick={() => handleTestIntegration(integration)}
//                             disabled={testResult?.isTesting}
//                             className="flex items-center gap-2"
//                           >
//                             {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
//                             Test Credentials
//                           </Button>
//                           {testResult?.result === "success" && (
//                             <span className="text-green-500 flex items-center gap-1 text-sm">
//                               <CheckCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                           {testResult?.result === "failure" && (
//                             <span className="text-red-500 flex items-center gap-1 text-sm">
//                               <XCircle className="h-4 w-4" />
//                               {testResult.message}
//                             </span>
//                           )}
//                         </div>
//                       </CardContent>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8" disabled={!isReadyForReview}>
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 className="mb-6 hover:bg-accent"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isCustomWorkflow
//                         ? modifyingWorkflowId
//                           ? `Modified Version of ${selectedWorkflow?.name}`
//                           : "Custom Workflow Request"
//                         : selectedWorkflow?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   {!isCustomWorkflow && selectedWorkflow && (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         N/A (Customizable)
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {isCustomWorkflow ? (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Custom Request Details
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Your Description:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground">
//                       Our team will review your request and contact you to discuss the custom workflow.
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="h-5 w-5 text-primary" />
//                       Configured Integrations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {selectedIntegrations.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedIntegrations.map((integration) => (
//                           <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm font-medium">{integration}</span>
//                             <Badge variant="outline" className="ml-auto text-xs">
//                               Configured
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <p className="text-sm text-muted-foreground">No integrations configured</p>
//                         <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isCustomWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Our team will review your custom workflow request.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will contact you within 1-2 business days to discuss details and next steps.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once finalized, your custom Voiceflow workflow will be built and deployed.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your Voiceflow workflow will be automatically configured.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration connections will be tested and verified.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your automation will be activated for social media DMs.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 size="lg"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }



// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   MessageSquare,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   BookOpen,
//   Globe,
//   LifeBuoy,
//   Loader2,
//   XCircle,
//   PlayCircle,
//   PauseCircle,
// } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
//   howItWorks: string
//   scenarioExample: string
//   integrationDetails: {
//     [key: string]: {
//       purpose: string
//       setupInstructions: string
//       usageInWorkflow: string
//       credentialsFields?: { id: string; label: string; type: string; optional?: boolean }[] // Made optional
//     }
//   }
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS", "Voiceflow"],
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//     howItWorks:
//       "This workflow automates the entire appointment booking process, from initial inquiry to post-appointment follow-up. It handles scheduling, sends confirmations and reminders, and can even manage rescheduling or cancellations, freeing up your staff&apos;s time.",
//     scenarioExample:
//       "A client DMs your salon asking to book a haircut. The bot asks for their preferred date/time, checks availability via Google Calendar, confirms the booking, sends a reminder 24 hours prior, and a thank-you message after the appointment.",
//     integrationDetails: {
//       "Google Calendar": {
//         purpose: "To check real-time availability and create new appointments.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Calendar API, and create an OAuth 2.0 Client ID for a Web Application. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
//         usageInWorkflow:
//           "The bot will query your Google Calendar to find available slots and add new appointments directly to your calendar once confirmed by the user.",
//         credentialsFields: [{ id: "apiKey", label: "Client ID", type: "password" }],
//       },
//       Calendly: {
//         purpose: "To direct users to your Calendly booking page for self-service scheduling.",
//         setupInstructions:
//           "No API key needed. Simply provide your Calendly booking page URL. You can find this in your Calendly dashboard under 'Share Your Link'.",
//         usageInWorkflow:
//           "When a user expresses interest in booking, the bot will provide a direct link to your Calendly page, allowing them to choose a time that suits them.",
//         credentialsFields: [], // No API fields, so no test button
//       },
//       Acuity: {
//         purpose: "To integrate with your Acuity Scheduling account for booking and availability.",
//         setupInstructions:
//           "In your Acuity Scheduling account, go to Integrations > API. Generate a new API key. You&apos;ll need this key to connect.",
//         usageInWorkflow:
//           "The bot will use the Acuity API to check your schedule, book appointments, and manage client information directly within your Acuity account.",
//         credentialsFields: [{ id: "apiKey", label: "Acuity API Key", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process payments for appointments or booking deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "If your service requires a deposit or full payment upfront, the bot will generate a secure payment link via Stripe for the user to complete the transaction.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To automatically create Zoom meeting links for virtual appointments.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For virtual appointments, the bot will automatically generate a unique Zoom meeting link and include it in the appointment confirmation and reminder messages.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       SMS: {
//         purpose: "To send appointment confirmations and reminders via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "After booking, the bot will send an SMS confirmation. It will also send automated reminders before the appointment to reduce no-shows.",
//         credentialsFields: [
//           { id: "apiKey", label: "SMS Provider API Key", type: "password" },
//           { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack", "Voiceflow"],
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//     howItWorks:
//       "This workflow streamlines the process of providing custom quotes. It guides the user through gathering necessary details, allows for dynamic pricing based on inputs, generates a professional quote, and can even handle negotiation steps.",
//     scenarioExample:
//       "A potential client DMs your photography studio asking for wedding photography pricing. The bot asks for date, location, hours needed, and guest count. Based on this, it generates an estimated quote and offers to schedule a consultation call.",
//     integrationDetails: {
//       "Google Drive": {
//         purpose: "To store collected documents, photos, or project specifications from clients.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Google Drive API, and create an OAuth 2.0 Client ID. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
//         usageInWorkflow:
//           "If the workflow requires clients to upload files (e.g., photos for a photography quote), the bot will provide a link or mechanism to upload directly to a designated Google Drive folder.",
//         credentialsFields: [{ id: "apiKey", label: "Google Drive Client ID", type: "password" }],
//       },
//       Dropbox: {
//         purpose: "To store and share large files or project assets with clients.",
//         setupInstructions:
//           "Go to the Dropbox App Console, create a new app, and generate an access token. Ensure the app has the necessary permissions (e.g., files.content.write).",
//         usageInWorkflow:
//           "Similar to Google Drive, this allows for secure file uploads and sharing of project-related documents or drafts with clients.",
//         credentialsFields: [{ id: "apiKey", label: "Dropbox Access Token", type: "password" }],
//       },
//       QuickBooks: {
//         purpose: "To generate professional invoices and manage client billing.",
//         setupInstructions:
//           "Log in to your QuickBooks Developer account. Create an app and obtain your Client ID and Client Secret. You&apos;ll also need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can automatically generate a draft invoice in QuickBooks based on the agreed-upon services and pricing.",
//         credentialsFields: [
//           { id: "apiKey", label: "QuickBooks Client ID", type: "password" },
//           { id: "apiSecret", label: "QuickBooks Client Secret", type: "password" },
//         ],
//       },
//       Stripe: {
//         purpose: "To process payments for accepted quotes or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "After a quote is finalized, the bot can send a secure Stripe payment link to the client for deposit or full payment.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       DocuSign: {
//         purpose: "To send and manage digital contracts or agreements for quotes.",
//         setupInstructions:
//           "Create a DocuSign Developer account. Create an integration key (Client ID) and generate a private key. You&apos;ll also need to configure OAuth 2.0.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can initiate a DocuSign envelope with the contract, allowing clients to digitally sign agreements.",
//         credentialsFields: [{ id: "apiKey", label: "DocuSign Integration Key", type: "password" }],
//       },
//       Slack: {
//         purpose: "To notify your team about new quote requests or accepted quotes.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new quote inquiry comes in or a quote is accepted, keeping your team informed.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs", "Voiceflow"],
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//     howItWorks:
//       "This workflow is designed for businesses with complex product sales, often involving customization, financing, or detailed consultations. It guides customers through product selection, gathers specific requirements, and facilitates the sales process up to delivery.",
//     scenarioExample:
//       "A customer DMs a car dealership asking about a specific model. The bot checks inventory, asks about desired features and financing needs, and then schedules a test drive with a sales representative.",
//     integrationDetails: {
//       Salesforce: {
//         purpose: "To create and update leads, contacts, and opportunities in your CRM.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes.",
//         usageInWorkflow:
//           "New inquiries will automatically create leads in Salesforce. As the conversation progresses, the bot can update lead status or add notes to the contact record.",
//         credentialsFields: [
//           { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
//           { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
//         ],
//       },
//       HubSpot: {
//         purpose: "To manage leads, contacts, and deals within your HubSpot CRM.",
//         setupInstructions:
//           "In HubSpot, go to Settings > Integrations > Private Apps. Create a new private app and obtain your Access Token. Ensure necessary CRM scopes are granted.",
//         usageInWorkflow:
//           "Similar to Salesforce, the bot will create new contacts or update existing ones in HubSpot, logging interactions and moving deals through your sales pipeline.",
//         credentialsFields: [{ id: "apiKey", label: "HubSpot Access Token", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process payments for product purchases or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "When a customer is ready to purchase, the bot can generate a secure Stripe payment link for them to complete the transaction.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a payment option for product sales.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative payment gateway for customers who prefer to use PayPal for their purchases.",
//         credentialsFields: [
//           { id: "apiKey", label: "PayPal Client ID", type: "password" },
//           { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
//         ],
//       },
//       Shopify: {
//         purpose: "To check product inventory, retrieve product details, and create orders.",
//         setupInstructions:
//           "In your Shopify admin, go to Apps > Develop apps > Create an app. Grant necessary permissions (e.g., read_products, write_orders) and install the app to get your API access token.",
//         usageInWorkflow:
//           "The bot can query your Shopify store for product availability, provide product descriptions, and even initiate draft orders based on customer selections.",
//         credentialsFields: [{ id: "apiKey", label: "Shopify API Access Token", type: "password" }],
//       },
//       "Inventory APIs": {
//         purpose: "To integrate with external inventory management systems for real-time stock checks.",
//         setupInstructions:
//           "This depends on your specific inventory system (e.g., custom API, ERP system). You&apos;ll need the API endpoint and authentication details (API key, OAuth token, etc.) provided by your system.",
//         usageInWorkflow:
//           "Before confirming a product&apos;s availability, the bot will check your inventory system to ensure the item is in stock, preventing overselling.",
//         credentialsFields: [
//           { id: "apiKey", label: "Inventory System API Key", type: "password" },
//           { id: "additionalSettings.endpoint", label: "API Endpoint URL", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom", "Voiceflow"],
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//     howItWorks:
//       "This workflow automates the enrollment process for online courses, coaching programs, or educational services. It qualifies leads, handles payments, grants access to course materials, and can even integrate with community platforms.",
//     scenarioExample:
//       "A prospective student DMs asking about your online coding course. The bot provides course details, answers FAQs, offers a free preview, and guides them through the enrollment and payment process.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To enroll students in your Teachable courses and manage access.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "Upon successful payment, the bot can automatically enroll the student in the specified Teachable course and provide them with access instructions.",
//         credentialsFields: [
//           { id: "apiKey", label: "Teachable API Key", type: "password" },
//           { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
//         ],
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, the bot can enroll students in Thinkific courses and ensure they receive the necessary login details.",
//         credentialsFields: [
//           { id: "apiKey", label: "Thinkific API Key", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
//         ],
//       },
//       Discord: {
//         purpose: "To invite new students to your private Discord community.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "After enrollment, the bot can send an automated message to the student with an invite link to your exclusive Discord community.",
//         credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
//       },
//       Slack: {
//         purpose: "To notify your team about new enrollments or student inquiries.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new student enrolls or has a question, keeping your team updated.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Stripe: {
//         purpose: "To process payments for course enrollments.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will generate secure payment links via Stripe for students to purchase courses or programs.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To schedule and manage live coaching calls or webinars.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS", "Voiceflow"],
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//     howItWorks:
//       "This workflow is designed for businesses that handle quick, high-volume transactions. It allows customers to quickly browse offerings, place orders or make simple bookings, and receive instant confirmations, ideal for fast-paced environments.",
//     scenarioExample:
//       "A customer DMs a restaurant asking to order takeout. The bot displays the menu, takes their order, processes payment via Stripe, and sends an order confirmation with an `estimated pickup time.",
//     integrationDetails: {
//       Square: {
//         purpose: "To process payments and manage orders through Square POS.",
//         setupInstructions:
//           "Log in to your Square Developer Dashboard. Create an application to get your Application ID and Access Token.",
//         usageInWorkflow:
//           "The bot can integrate with your Square POS to process payments for orders placed through DMs and update order statuses.",
//         credentialsFields: [{ id: "apiKey", label: "Square Access Token", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process quick payments for orders or services.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "For immediate transactions, the bot will generate a secure Stripe payment link for the customer to complete their purchase.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a quick payment option.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative, fast payment method for customers who prefer to use PayPal for their purchases.",
//         credentialsFields: [
//           { id: "apiKey", label: "PayPal Client ID", type: "password" },
//           { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
//         ],
//       },
//       DoorDash: {
//         purpose: "To integrate with DoorDash for food delivery orders.",
//         setupInstructions:
//           "This requires a partnership with DoorDash and access to their merchant API. You&apos;ll need specific API credentials provided by DoorDash.",
//         usageInWorkflow:
//           "If your restaurant offers DoorDash delivery, the bot can send orders directly to your DoorDash merchant account for fulfillment.",
//         credentialsFields: [{ id: "apiKey", label: "DoorDash API Key", type: "password" }],
//       },
//       "Uber Eats": {
//         purpose: "To integrate with Uber Eats for food delivery orders.",
//         setupInstructions:
//           "Similar to DoorDash, this requires an Uber Eats merchant account and access to their API. You&apos;ll need specific API credentials from Uber Eats.",
//         usageInWorkflow:
//           "The bot can pass orders to your Uber Eats merchant account for delivery, providing seamless integration with your delivery operations.",
//         credentialsFields: [{ id: "apiKey", label: "Uber Eats API Key", type: "password" }],
//       },
//       SMS: {
//         purpose: "To send instant order confirmations and status updates via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "Customers will receive immediate SMS confirmations of their orders and updates on their order status (e.g., 'Order ready for pickup').",
//         credentialsFields: [
//           { id: "apiKey", label: "SMS Provider API Key", type: "password" },
//           { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "education-training",
//     name: "Education & Training",
//     category: "GROUP_6",
//     description: "For online courses, workshops, certifications, and educational content delivery.",
//     icon: <BookOpen className="h-6 w-6" />,
//     features: [
//       "Course enrollment",
//       "Content access management",
//       "Quiz/assessment support",
//       "Certificate generation",
//       "Student progress tracking",
//       "Learning platform integration",
//     ],
//     integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing", "Voiceflow"],
//     operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
//     commonUseCase: "Online academies, certification bodies, corporate training",
//     borderClass: "card-border-document",
//     howItWorks:
//       "This workflow automates the entire student lifecycle for educational platforms. From initial interest and enrollment to providing access to learning materials and tracking progress, it ensures a smooth educational journey.",
//     scenarioExample:
//       "A user DMs asking about a specific certification program. The bot provides details, answers FAQs, guides them through enrollment, processes payment, and grants access to the online course platform.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To manage course enrollments and student access on Teachable.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "The bot can automatically enroll students in courses and provide access links after successful registration.",
//         credentialsFields: [
//           { id: "apiKey", label: "Teachable API Key", type: "password" },
//           { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
//         ],
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, this integration allows the bot to handle student enrollment and access provisioning for Thinkific courses.",
//         credentialsFields: [
//           { id: "apiKey", label: "Thinkific API Key", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
//         ],
//       },
//       Moodle: {
//         purpose: "To integrate with your Moodle LMS for course management and user synchronization.",
//         setupInstructions:
//           "In Moodle, enable web services (Site administration > Server > Web services > External services). Create a custom service and generate a token for a specific user with appropriate permissions.",
//         usageInWorkflow:
//           "The bot can create new user accounts in Moodle, enroll them in courses, and potentially retrieve basic progress information.",
//         credentialsFields: [
//           { id: "apiKey", label: "Moodle API Token", type: "password" },
//           { id: "additionalSettings.serviceUrl", label: "Moodle Web Service URL", type: "text" },
//         ],
//       },
//       Stripe: {
//         purpose: "To process payments for course fees or program subscriptions.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will securely handle course fee payments, generating links for students to complete their purchase.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To schedule and manage live online classes, webinars, or tutoring sessions.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       "Email Marketing": {
//         purpose: "To add new students to your email lists for newsletters and updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "Upon enrollment, the bot can automatically add the student&apos;s email to your designated email marketing list for future communications.",
//         credentialsFields: [
//           { id: "apiKey", label: "Email Marketing API Key", type: "password" },
//           { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "community-management",
//     name: "Community Management",
//     category: "GROUP_7",
//     description: "For managing online communities, forums, membership sites, and social groups.",
//     icon: <Globe className="h-6 w-6" />,
//     features: [
//       "Member onboarding",
//       "Content moderation",
//       "Event announcements",
//       "Q&A support",
//       "Engagement tracking",
//       "Forum integration",
//     ],
//     integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing", "Voiceflow"],
//     operations: ["Join", "Onboarding", "Engagement", "Support"],
//     commonUseCase: "Online forums, membership communities, fan clubs",
//     borderClass: "card-border-communication",
//     howItWorks:
//       "This workflow helps manage and grow your online community. It automates member onboarding, facilitates Q&A, announces events, and can even assist with content moderation, fostering a vibrant and engaged community.",
//     scenarioExample:
//       "A new member DMs your community page. The bot welcomes them, provides links to community guidelines, introduces key channels, and answers initial questions, guiding them through the onboarding process.",
//     integrationDetails: {
//       Discord: {
//         purpose: "To manage roles, send announcements, and facilitate interactions within your Discord server.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "The bot can send welcome messages to new members, post event announcements, or even moderate certain types of messages in your Discord channels.",
//         credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
//       },
//       Slack: {
//         purpose: "To manage team communications, share announcements, and provide quick support.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot can post updates, answer common questions in channels, or direct members to relevant resources within Slack.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Circle: {
//         purpose: "To integrate with your Circle.so community platform for member management.",
//         setupInstructions:
//           "In your Circle community, go to Settings > Integrations > API. Generate an API token. You&apos;ll also need your community URL.",
//         usageInWorkflow:
//           "The bot can add new members to your Circle community, send direct messages, or post updates to specific spaces.",
//         credentialsFields: [
//           { id: "apiKey", label: "Circle.so API Token", type: "password" },
//           { id: "additionalSettings.communityUrl", label: "Circle Community URL", type: "text" },
//         ],
//       },
//       "Mighty Networks": {
//         purpose: "To manage members and content within your Mighty Networks community.",
//         setupInstructions:
//           "Mighty Networks typically uses webhooks for integrations. You&apos;ll need to configure webhooks in your Mighty Networks settings to send data to your application.",
//         usageInWorkflow:
//           "The bot can welcome new members, share links to courses or content within Mighty Networks, and respond to common queries about the platform.",
//         credentialsFields: [{ id: "webhookUrl", label: "Mighty Networks Webhook URL", type: "text", optional: true }],
//       },
//       Patreon: {
//         purpose: "To verify patron status and provide exclusive access or content.",
//         setupInstructions:
//           "In your Patreon Creator account, go to My Profile > My Apps. Create a new client to get your Client ID and Client Secret. You&apos;ll need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "The bot can check a user&apos;s Patreon pledge level and grant access to exclusive content or channels based on their tier.",
//         credentialsFields: [
//           { id: "apiKey", label: "Patreon Client ID", type: "password" },
//           { id: "apiSecret", label: "Patreon Client Secret", type: "password" },
//         ],
//       },
//       "Email Marketing": {
//         purpose: "To send community newsletters, event invitations, and important updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "The bot can add new community members to your email list for regular updates and event announcements.",
//         credentialsFields: [
//           { id: "apiKey", label: "Email Marketing API Key", type: "password" },
//           { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "customer-support-advanced",
//     name: "Customer Support (Advanced)",
//     category: "GROUP_8",
//     description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
//     icon: <LifeBuoy className="h-6 w-6" />,
//     features: [
//       "Ticket creation",
//       "Issue diagnosis",
//       "Knowledge base lookup",
//       "Escalation to human agent",
//       "Feedback collection",
//       "CRM integration",
//     ],
//     integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email", "Voiceflow"],
//     operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
//     commonUseCase: "Software companies, tech support, complex service providers",
//     borderClass: "card-border-integration",
//     howItWorks:
//       "This advanced support workflow handles complex customer inquiries, diagnoses issues, provides solutions from a knowledge base, and seamlessly escalates to human agents when needed. It ensures efficient and effective customer service.",
//     scenarioExample:
//       "A customer DMs with a technical issue. The bot asks diagnostic questions, searches the knowledge base for solutions, and if unable to resolve, creates a support ticket in Zendesk and notifies a human agent.",
//     integrationDetails: {
//       Zendesk: {
//         purpose: "To create, update, and manage support tickets.",
//         setupInstructions:
//           "In Zendesk, go to Admin > Channels > API > Token Access. Enable token access and create a new API token. You&apos;ll also need your Zendesk subdomain and email.",
//         usageInWorkflow:
//           "When a customer&apos;s issue requires human intervention, the bot will automatically create a new ticket in Zendesk, pre-filling it with conversation history and customer details.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zendesk API Token", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Zendesk Subdomain", type: "text" },
//           { id: "additionalSettings.email", label: "Zendesk Email", type: "email" },
//         ],
//       },
//       Freshdesk: {
//         purpose: "To create and manage support tickets in Freshdesk.",
//         setupInstructions:
//           "In Freshdesk, go to Admin > API Keys. Copy your API key. You&apos;ll also need your Freshdesk domain.",
//         usageInWorkflow:
//           "Similar to Zendesk, the bot can create new support tickets in Freshdesk, ensuring no customer inquiry falls through the cracks.",
//         credentialsFields: [
//           { id: "apiKey", label: "Freshdesk API Key", type: "password" },
//           { id: "additionalSettings.domain", label: "Freshdesk Domain", type: "text" },
//         ],
//       },
//       "Salesforce Service Cloud": {
//         purpose: "To manage cases, contacts, and service interactions within Salesforce.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes for Service Cloud.",
//         usageInWorkflow:
//           "The bot can create new cases in Salesforce Service Cloud, update existing ones, and log all customer interactions directly to the case record.",
//         credentialsFields: [
//           { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
//           { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
//         ],
//       },
//       Intercom: {
//         purpose: "To manage customer conversations and provide in-app support.",
//         setupInstructions:
//           "In Intercom, go to Settings > Developers > Access Tokens. Generate a new access token with appropriate permissions (e.g., 'read_conversations', 'write_conversations').",
//         usageInWorkflow:
//           "The bot can respond to customer queries directly within Intercom, and if escalation is needed, it can assign the conversation to a human agent.",
//         credentialsFields: [{ id: "apiKey", label: "Intercom Access Token", type: "password" }],
//       },
//       Slack: {
//         purpose: "To notify support teams about urgent tickets or customer escalations.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "When a customer requests human assistance or an urgent issue is detected, the bot will send a real-time alert to your support team&apos;s Slack channel.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Email: {
//         purpose: "To send automated email responses, confirmations, or follow-ups.",
//         setupInstructions:
//           "This typically involves an email sending service like SendGrid, Mailgun, or AWS SES. You&apos;ll need an API key and sender email configuration from your chosen service.",
//         usageInWorkflow:
//           "The bot can send automated email confirmations for ticket creation, provide knowledge base articles via email, or send follow-up surveys.",
//         credentialsFields: [{ id: "apiKey", label: "Email Service API Key", type: "password" }],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   projectId?: string
//   versionId?: string
//   additionalSettings?: Record<string, string>
// }

// interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: IntegrationConfig }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   // NEW: Add credentials to the type to easily access them when fetching active workflow
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string // This will be a JSON string, parsed on client
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
// }

// interface IntegrationTestResult {
//   isTesting: boolean
//   result: "success" | "failure" | null
//   message: string | null
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review" | "customization">(
//     "selection",
//   )
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [modifyingWorkflowId, setModifyingWorkflowId] = useState<string | null>(null)
//   const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

//   // NEW STATES FOR ACTIVE WORKFLOW
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)

//   // In a real app, you'd get the current user's businessId from context/auth
//   // For this demo, let's assume a placeholder business ID.
//   // This needs to be replaced with actual user-specific business ID from a backend context
//   const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8" // Example placeholder. MUST BE REPLACED.

//   // Effect to fetch active workflow on component mount
//   useEffect(() => {
//     const fetchActiveWorkflow = async () => {
//       setIsFetchingActiveWorkflow(true)
//       try {
//         if (!currentBusinessId) {
//           console.warn("No business ID available to fetch active workflow.")
//           setIsFetchingActiveWorkflow(false)
//           return
//         }

//         const response = await fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`)
//         if (response.ok) {
//           const data = await response.json()
//           if (data.workflowConfigs && data.workflowConfigs.length > 0) {
//             const activeConfig = data.workflowConfigs[0] // Assuming only one active workflow per business
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)

//             // Pre-populate credentials if re-loading an active workflow
//             const loadedIntegrationConfigs: Record<string, IntegrationConfig> = {}
//             const loadedSelectedIntegrations: string[] = []
//             activeConfig.credentials.forEach((cred: any) => {
//               try {
//                 const parsedConfig = JSON.parse(cred.encryptedCredentials)
//                 loadedIntegrationConfigs[cred.integrationName] = {
//                   name: cred.integrationName,
//                   ...parsedConfig,
//                 }
//                 loadedSelectedIntegrations.push(cred.integrationName)
//               } catch (e) {
//                 console.error("Failed to parse credentials for", cred.integrationName, e)
//               }
//             })
//             setIntegrationConfigs(loadedIntegrationConfigs)
//             setSelectedIntegrations(loadedSelectedIntegrations)
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         } else {
//           console.error("Failed to fetch active workflow configurations:", await response.text())
//         }
//       } catch (error) {
//         console.error("Error fetching active workflow:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//       }
//     }

//     fetchActiveWorkflow()
//   }, [currentBusinessId])

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     if (activeWorkflowExists) return
//     setSelectedWorkflow(workflow)
//     // Clear any previous custom request or modification state
//     setIsCustomWorkflow(false)
//     setModifyingWorkflowId(null)
//     setCustomRequest("")
//     // Reset integration states for the new selection
//     setIntegrationConfigs({})
//     setSelectedIntegrations([])
//     setIntegrationTestResults({})
//     setStep("configuration")
//   }

//   // Moved to configuration step
//   const handleRequestModifiedVersion = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(true)
//     setModifyingWorkflowId(workflow.id)
//     setCustomRequest(
//       `I&apos;d like to request a modified version of the "${workflow.name}" workflow. Please specify the changes you&apos;d like to make (e.g., add/remove integrations, modify process steps, adjust features):`,
//     )
//     setStep("customization")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleIntegrationConfig = (integration: string, fieldId: string, value: string) => {
//     setIntegrationConfigs((prev) => {
//       const currentConfig = prev[integration] || { name: integration }
//       const updatedConfig = { ...currentConfig }

//       if (fieldId.includes(".")) {
//         const [mainField, subField] = fieldId.split(".")
//         if (!(updatedConfig as any)[mainField]) {
//           ;(updatedConfig as any)[mainField] = {}
//         }
//         ;(updatedConfig as any)[mainField][subField] = value
//       } else {
//         ;(updatedConfig as any)[fieldId] = value
//       }

//       return {
//         ...prev,
//         [integration]: updatedConfig,
//       }
//     })

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleTestIntegration = async (integrationName: string) => {
//     const config = integrationConfigs[integrationName]
//     const details = selectedWorkflow?.integrationDetails[integrationName]
//     const hasRequiredFields = details?.credentialsFields?.every(
//       (field) =>
//         field.optional ||
//         (field.id.includes(".")
//           ? (config as any)?.[field.id.split(".")[0]]?.[field.id.split(".")[1]]
//           : (config as any)?.[field.id]),
//     )

//     if (!hasRequiredFields) {
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Missing required credentials for test." },
//       }))
//       return
//     }

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integrationName]: { isTesting: true, result: null, message: "Testing..." },
//     }))

//     try {
//       const response = await fetch("/api/integrations/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationName, credentials: config }),
//       })
//       const result = await response.json()

//       if (result.success) {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "success", message: result.message },
//         }))
//       } else {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
//         }))
//       }
//     } catch (error) {
//       console.error("Error testing integration:", error)
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
//       }))
//     }
//   }

//   // NEW: Function to check if all selected integrations have been tested successfully
//   const areAllSelectedIntegrationsTestedSuccessfully = () => {
//     if (selectedIntegrations.length === 0) return true

//     for (const integration of selectedIntegrations) {
//       const testResult = integrationTestResults[integration]
//       const details = selectedWorkflow?.integrationDetails[integration]

//       // Only require testing if the integration has defined credential fields
//       if (details?.credentialsFields && details.credentialsFields.length > 0) {
//         // Also ensure all *required* fields for this integration actually have a value
//         const config = integrationConfigs[integration] || {}
//         const hasAllRequiredFields = details.credentialsFields.every(
//           (field) =>
//             field.optional ||
//             (field.id.includes(".")
//               ? (config as any)[field.id.split(".")[0]]?.[field.id.split(".")[1]]
//               : (config as any)[field.id]),
//         )

//         // If it has required fields, it must be successfully tested
//         if (!hasAllRequiredFields || !testResult || testResult.result !== "success") {
//           return false
//         }
//       }
//     }
//     return true
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentBusinessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     const integrationsToSubmit = selectedIntegrations.map((name) => ({
//       name,
//       config: integrationConfigs[name] || { name },
//     }))

//     const workflowData = {
//       workflowTemplateId: selectedWorkflow?.id || null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: integrationsToSubmit,
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       isActive: !isCustomWorkflow, // Templates are active immediately, custom requests are not
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()
//       if (result.success) {
//         alert(isCustomWorkflow ? "Custom workflow request submitted successfully!" : "Workflow deployed successfully!")
//         setActiveWorkflowExists(true)
//         setActiveWorkflowDetails(result.workflowConfig)
//         setStep("review")
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     if (!window.confirm("Are you sure you want to deactivate this workflow? This will stop all automated responses.")) {
//       return
//     }

//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setSelectedWorkflow(null)
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setIntegrationConfigs({})
//         setSelectedIntegrations([])
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setModifyingWorkflowId(null)
//         setIntegrationTestResults({})
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   if (isFetchingActiveWorkflow) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   if (activeWorkflowExists && activeWorkflowDetails) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6 text-center">
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <PlayCircle className="h-8 w-8 text-green-500" />
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                 Your Workflow is Running!
//               </h1>
//             </div>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
//               Your &quot;{activeWorkflowDetails.workflowTemplate?.name || "Custom Workflow"}&quot; is active and
//               automating responses for your business.
//             </p>

//             <Card className="glassEffect border-2 border-green-500/50 mb-8 p-6">
//               <CardHeader className="p-0 mb-4">
//                 <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//                   <Sparkles className="h-6 w-6" />
//                   Active Workflow Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-left">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.workflowTemplate?.name || "Custom Workflow"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.businessInfo.businessName}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.businessInfo.businessType}
//                   </p>
//                 </div>
//                 {activeWorkflowDetails.customRequest && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Custom Request:</Label>
//                     <p className="text-base bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">
//                       {activeWorkflowDetails.customRequest}
//                     </p>
//                   </div>
//                 )}
//                 {activeWorkflowDetails.credentials && activeWorkflowDetails.credentials.length > 0 && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Configured Integrations:</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {activeWorkflowDetails.credentials.map((cred, idx) => (
//                         <Badge key={idx} variant="secondary" className="text-sm">
//                           {cred.integrationName}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Status:</Label>
//                   <Badge className="bg-green-600 text-green-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//                     <PlayCircle className="h-4 w-4 mr-2" />
//                     {activeWorkflowDetails.status}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-center gap-4">
//               <Button
//                 onClick={handleDeactivateWorkflow}
//                 disabled={isDeactivating}
//                 size="lg"
//                 className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-semibold"
//               >
//                 {isDeactivating ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <PauseCircle className="h-4 w-4 mr-2" />
//                 )}
//                 {isDeactivating ? "Deactivating..." : "Deactivate Workflow"}
//               </Button>
//             </div>
//             <p className="text-xs text-muted-foreground mt-6">
//               To choose a different workflow, please deactivate the current one first.
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => !activeWorkflowExists && handleWorkflowSelect(workflow)}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap"></div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                     <div className="flex gap-2 mt-4">
//                       <Button
//                         onClick={() => handleWorkflowSelect(workflow)}
//                         className="flex-1"
//                         disabled={activeWorkflowExists}
//                       >
//                         Select Workflow
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => {
//                   if (!activeWorkflowExists) {
//                     setIsCustomWorkflow(true)
//                     setSelectedWorkflow(null)
//                     setModifyingWorkflowId(null)
//                     setCustomRequest("")
//                     setStep("customization")
//                   }
//                 }}
//               >
//                 <Sparkles className="h-10 w-10 text-primary mb-4" />
//                 <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
//                 <CardDescription className="text-sm leading-relaxed">
//                   Can&apos;t find what you need? Describe your unique requirements, and we&apos;ll build it for you.
//                 </CardDescription>
//                 <Button variant="outline" className="mt-4 bg-transparent" disabled={activeWorkflowExists}>
//                   Get Started
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     const customizationTitle = modifyingWorkflowId
//       ? `Modify Your ${selectedWorkflow.name} Workflow`
//       : "Request a Custom Workflow"
//     const customizationDescription = modifyingWorkflowId
//       ? "Tell us how you&apos;d like to adapt this existing workflow."
//       : "Tell us what you need, and we&apos;ll create a tailored solution for your business."
//     const textareaPlaceholder = modifyingWorkflowId
//       ? `Describe the specific changes you&apos;d like for the ${selectedWorkflow.name} workflow. E.g., "Remove Google Calendar, add HubSpot CRM, and simplify the booking confirmation step."`
//       : "Describe the specific operations, features, and integrations you need. E.g., &apos;I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like &apos;urgent&apos; are detected.&apos;"

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       {selectedWorkflow.icon}
//                       Workflow Overview
//                     </CardTitle>
//                     <CardDescription>
//                       Here&apos;s what your {selectedWorkflow.name} workflow will include
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-8">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {selectedWorkflow.operations.map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {selectedWorkflow.features.map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedWorkflow.integrations.map((integration, idx) => (
//                             <Badge key={idx} variant="outline" className="text-xs">
//                               {integration}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5 text-primary" />
//                       How This Workflow Works
//                     </CardTitle>
//                     <CardDescription>Understand the flow and see a real-world example.</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Explanation:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">{selectedWorkflow.howItWorks}</p>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Scenario Example:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">
//                         {selectedWorkflow.scenarioExample}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <div className="flex justify-end mt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => handleRequestModifiedVersion(selectedWorkflow)}
//                     className="flex-1 bg-transparent hover:bg-accent"
//                   >
//                     Request Modified Version
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     const isReadyForReview = areAllSelectedIntegrationsTestedSuccessfully() && selectedIntegrations.length > 0

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => {
//                 const testResult = integrationTestResults[integration]
//                 const details = selectedWorkflow.integrationDetails[integration]
//                 const hasCredentialsFields = details?.credentialsFields && details.credentialsFields.length > 0

//                 return (
//                   <Card
//                     key={integration}
//                     className={`glassEffect border-2 transition-all duration-300 ${
//                       selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10">
//                             <Zap className="h-5 w-5 text-primary" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-lg">{integration}</CardTitle>
//                             <CardDescription>
//                               {details?.purpose || `Configure your ${integration} integration`}
//                             </CardDescription>
//                           </div>
//                         </div>
//                         <Checkbox
//                           checked={selectedIntegrations.includes(integration)}
//                           onCheckedChange={() => handleIntegrationToggle(integration)}
//                           className="scale-125"
//                         />
//                       </div>
//                     </CardHeader>

//                     {selectedIntegrations.includes(integration) && (
//                       <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                         {details?.setupInstructions && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How to get credentials:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.setupInstructions}</p>
//                           </div>
//                         )}
//                         {details?.usageInWorkflow && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How we&apos;ll use it:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.usageInWorkflow}</p>
//                           </div>
//                         )}

//                         {hasCredentialsFields &&
//                           details.credentialsFields?.map((field) => {
//                             const fieldValue = field.id.includes(".")
//                               ? (integrationConfigs[integration] as any)?.[field.id.split(".")[0]]?.[
//                                   field.id.split(".")[1]
//                                 ] || ""
//                               : (integrationConfigs[integration] as any)?.[field.id] || ""
//                             return (
//                               <div className="space-y-2" key={field.id}>
//                                 <Label htmlFor={`${integration}-${field.id}`} className="text-sm font-medium">
//                                   {field.label} {field.optional ? "(Optional)" : "*"}
//                                 </Label>
//                                 <Input
//                                   id={`${integration}-${field.id}`}
//                                   type={field.type}
//                                   placeholder={`Enter your ${field.label.toLowerCase()}`}
//                                   onChange={(e) => handleIntegrationConfig(integration, field.id, e.target.value)}
//                                   className="bg-background/50 border-border/50 focus:border-primary"
//                                   value={fieldValue}
//                                 />
//                               </div>
//                             )
//                           })}

//                         {hasCredentialsFields && ( // Only show test button if there are credentials to test
//                           <div className="flex items-center gap-3 pt-2">
//                             <Button
//                               variant="outline"
//                               onClick={() => handleTestIntegration(integration)}
//                               disabled={testResult?.isTesting}
//                               className="flex items-center gap-2"
//                             >
//                               {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
//                               Test Credentials
//                             </Button>
//                             {testResult?.result === "success" && (
//                               <span className="text-green-500 flex items-center gap-1 text-sm">
//                                 <CheckCircle className="h-4 w-4" />
//                                 {testResult.message}
//                               </span>
//                             )}
//                             {testResult?.result === "failure" && (
//                               <span className="text-red-500 flex items-center gap-1 text-sm">
//                                 <XCircle className="h-4 w-4" />
//                                 {testResult.message}
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </CardContent>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8" disabled={!isReadyForReview}>
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 className="mb-6 hover:bg-accent"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isCustomWorkflow
//                         ? modifyingWorkflowId
//                           ? `Modified Version of ${selectedWorkflow?.name}`
//                           : "Custom Workflow Request"
//                         : selectedWorkflow?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   {!isCustomWorkflow && selectedWorkflow && (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         N/A (Customizable)
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {isCustomWorkflow ? (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Custom Request Details
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Your Description:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground">
//                       Our team will review your request and contact you to discuss the custom workflow.
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="h-5 w-5 text-primary" />
//                       Configured Integrations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {selectedIntegrations.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedIntegrations.map((integration) => (
//                           <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm font-medium">{integration}</span>
//                             <Badge variant="outline" className="ml-auto text-xs">
//                               Configured
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <p className="text-sm text-muted-foreground">No integrations configured</p>
//                         <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isCustomWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Our team will review your custom workflow request.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will contact you within 1-2 business days to discuss details and next steps.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once finalized, your custom Voiceflow workflow will be built and deployed.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your Voiceflow workflow will be automatically configured.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration connections will be tested and verified.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your automation will be activated for social media DMs.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 size="lg"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }
















// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   MessageSquare,
//   Users,
//   Zap,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   BookOpen,
//   Globe,
//   LifeBuoy,
//   Loader2,
//   XCircle,
//   PlayCircle,
//   PauseCircle,
// } from "lucide-react"

// interface WorkflowType {
//   id: string
//   name: string
//   category: string
//   description: string
//   icon: React.ReactNode
//   features: string[]
//   integrations: string[]
//   operations: string[]
//   commonUseCase: string
//   borderClass: string
//   howItWorks: string
//   scenarioExample: string
//   integrationDetails: {
//     [key: string]: {
//       purpose: string
//       setupInstructions: string
//       usageInWorkflow: string
//       credentialsFields?: { id: string; label: string; type: string; optional?: boolean }[] // Made optional
//     }
//   }
// }

// const workflowTypes: WorkflowType[] = [
//   {
//     id: "appointment-based",
//     name: "Appointment-Based Services",
//     category: "GROUP_1",
//     description:
//       "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
//     icon: <Calendar className="h-6 w-6" />,
//     features: [
//       "Calendar integration",
//       "Availability checking",
//       "Automatic reminders",
//       "Rescheduling handling",
//       "No-show management",
//       "Follow-up sequences",
//     ],
//     integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS", "Voiceflow"],
//     operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
//     commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
//     borderClass: "card-border-marketing",
//     howItWorks:
//       "This workflow automates the entire appointment booking process, from initial inquiry to post-appointment follow-up. It handles scheduling, sends confirmations and reminders, and can even manage rescheduling or cancellations, freeing up your staff&apos;s time.",
//     scenarioExample:
//       "A client DMs your salon asking to book a haircut. The bot asks for their preferred date/time, checks availability via Google Calendar, confirms the booking, sends a reminder 24 hours prior, and a thank-you message after the appointment.",
//     integrationDetails: {
//       "Google Calendar": {
//         purpose: "To check real-time availability and create new appointments.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Calendar API, and create an OAuth 2.0 Client ID for a Web Application. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
//         usageInWorkflow:
//           "The bot will query your Google Calendar to find available slots and add new appointments directly to your calendar once confirmed by the user.",
//         credentialsFields: [{ id: "apiKey", label: "Client ID", type: "password" }],
//       },
//       Calendly: {
//         purpose: "To direct users to your Calendly booking page for self-service scheduling.",
//         setupInstructions:
//           "No API key needed. Simply provide your Calendly booking page URL. You can find this in your Calendly dashboard under 'Share Your Link'.",
//         usageInWorkflow:
//           "When a user expresses interest in booking, the bot will provide a direct link to your Calendly page, allowing them to choose a time that suits them.",
//         credentialsFields: [], // No API fields, so no test button
//       },
//       Acuity: {
//         purpose: "To integrate with your Acuity Scheduling account for booking and availability.",
//         setupInstructions:
//           "In your Acuity Scheduling account, go to Integrations > API. Generate a new API key. You&apos;ll need this key to connect.",
//         usageInWorkflow:
//           "The bot will use the Acuity API to check your schedule, book appointments, and manage client information directly within your Acuity account.",
//         credentialsFields: [{ id: "apiKey", label: "Acuity API Key", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process payments for appointments or booking deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "If your service requires a deposit or full payment upfront, the bot will generate a secure payment link via Stripe for the user to complete the transaction.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To automatically create Zoom meeting links for virtual appointments.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For virtual appointments, the bot will automatically generate a unique Zoom meeting link and include it in the appointment confirmation and reminder messages.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       SMS: {
//         purpose: "To send appointment confirmations and reminders via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "After booking, the bot will send an SMS confirmation. It will also send automated reminders before the appointment to reduce no-shows.",
//         credentialsFields: [
//           { id: "apiKey", label: "SMS Provider API Key", type: "password" },
//           { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "quote-based",
//     name: "Quote-Based Services",
//     category: "GROUP_2",
//     description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
//     icon: <DollarSign className="h-6 w-6" />,
//     features: [
//       "Photo/detail collection",
//       "Scope clarification",
//       "Pricing tier management",
//       "Project timeline tracking",
//       "Quote generation",
//       "Negotiation handling",
//     ],
//     integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack", "Voiceflow"],
//     operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
//     commonUseCase: "Contractors, photographers, event planners, auto services",
//     borderClass: "card-border-sales",
//     howItWorks:
//       "This workflow streamlines the process of providing custom quotes. It guides the user through gathering necessary details, allows for dynamic pricing based on inputs, generates a professional quote, and can even handle negotiation steps.",
//     scenarioExample:
//       "A potential client DMs your photography studio asking for wedding photography pricing. The bot asks for date, location, hours needed, and guest count. Based on this, it generates an estimated quote and offers to schedule a consultation call.",
//     integrationDetails: {
//       "Google Drive": {
//         purpose: "To store collected documents, photos, or project specifications from clients.",
//         setupInstructions:
//           "Go to Google Cloud Console, enable the Google Drive API, and create an OAuth 2.0 Client ID. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
//         usageInWorkflow:
//           "If the workflow requires clients to upload files (e.g., photos for a photography quote), the bot will provide a link or mechanism to upload directly to a designated Google Drive folder.",
//         credentialsFields: [{ id: "apiKey", label: "Google Drive Client ID", type: "password" }],
//       },
//       Dropbox: {
//         purpose: "To store and share large files or project assets with clients.",
//         setupInstructions:
//           "Go to the Dropbox App Console, create a new app, and generate an access token. Ensure the app has the necessary permissions (e.g., files.content.write).",
//         usageInWorkflow:
//           "Similar to Google Drive, this allows for secure file uploads and sharing of project-related documents or drafts with clients.",
//         credentialsFields: [{ id: "apiKey", label: "Dropbox Access Token", type: "password" }],
//       },
//       QuickBooks: {
//         purpose: "To generate professional invoices and manage client billing.",
//         setupInstructions:
//           "Log in to your QuickBooks Developer account. Create an app and obtain your Client ID and Client Secret. You&apos;ll also need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can automatically generate a draft invoice in QuickBooks based on the agreed-upon services and pricing.",
//         credentialsFields: [
//           { id: "apiKey", label: "QuickBooks Client ID", type: "password" },
//           { id: "apiSecret", label: "QuickBooks Client Secret", type: "password" },
//         ],
//       },
//       Stripe: {
//         purpose: "To process payments for accepted quotes or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "After a quote is finalized, the bot can send a secure Stripe payment link to the client for deposit or full payment.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       DocuSign: {
//         purpose: "To send and manage digital contracts or agreements for quotes.",
//         setupInstructions:
//           "Create a DocuSign Developer account. Create an integration key (Client ID) and generate a private key. You&apos;ll also need to configure OAuth 2.0.",
//         usageInWorkflow:
//           "Once a quote is accepted, the bot can initiate a DocuSign envelope with the contract, allowing clients to digitally sign agreements.",
//         credentialsFields: [{ id: "apiKey", label: "DocuSign Integration Key", type: "password" }],
//       },
//       Slack: {
//         purpose: "To notify your team about new quote requests or accepted quotes.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new quote inquiry comes in or a quote is accepted, keeping your team informed.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "product-sales-high-touch",
//     name: "Product Sales (High-Touch)",
//     category: "GROUP_3",
//     description:
//       "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
//     icon: <Users className="h-6 w-6" />,
//     features: [
//       "Inventory checking",
//       "Specification gathering",
//       "Financing options",
//       "Delivery scheduling",
//       "Lead qualification",
//       "CRM integration",
//     ],
//     integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs", "Voiceflow"],
//     operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
//     commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
//     borderClass: "card-border-customer-support",
//     howItWorks:
//       "This workflow is designed for businesses with complex product sales, often involving customization, financing, or detailed consultations. It guides customers through product selection, gathers specific requirements, and facilitates the sales process up to delivery.",
//     scenarioExample:
//       "A customer DMs a car dealership asking about a specific model. The bot checks inventory, asks about desired features and financing needs, and then schedules a test drive with a sales representative.",
//     integrationDetails: {
//       Salesforce: {
//         purpose: "To create and update leads, contacts, and opportunities in your CRM.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes.",
//         usageInWorkflow:
//           "New inquiries will automatically create leads in Salesforce. As the conversation progresses, the bot can update lead status or add notes to the contact record.",
//         credentialsFields: [
//           { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
//           { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
//         ],
//       },
//       HubSpot: {
//         purpose: "To manage leads, contacts, and deals within your HubSpot CRM.",
//         setupInstructions:
//           "In HubSpot, go to Settings > Integrations > Private Apps. Create a new private app and obtain your Access Token. Ensure necessary CRM scopes are granted.",
//         usageInWorkflow:
//           "Similar to Salesforce, the bot will create new contacts or update existing ones in HubSpot, logging interactions and moving deals through your sales pipeline.",
//         credentialsFields: [{ id: "apiKey", label: "HubSpot Access Token", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process payments for product purchases or deposits.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "When a customer is ready to purchase, the bot can generate a secure Stripe payment link for them to complete the transaction.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a payment option for product sales.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative payment gateway for customers who prefer to use PayPal for their purchases.",
//         credentialsFields: [
//           { id: "apiKey", label: "PayPal Client ID", type: "password" },
//           { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
//         ],
//       },
//       Shopify: {
//         purpose: "To check product inventory, retrieve product details, and create orders.",
//         setupInstructions:
//           "In your Shopify admin, go to Apps > Develop apps > Create an app. Grant necessary permissions (e.g., read_products, write_orders) and install the app to get your API access token.",
//         usageInWorkflow:
//           "The bot can query your Shopify store for product availability, provide product descriptions, and even initiate draft orders based on customer selections.",
//         credentialsFields: [{ id: "apiKey", label: "Shopify API Access Token", type: "password" }],
//       },
//       "Inventory APIs": {
//         purpose: "To integrate with external inventory management systems for real-time stock checks.",
//         setupInstructions:
//           "This depends on your specific inventory system (e.g., custom API, ERP system). You&apos;ll need the API endpoint and authentication details (API key, OAuth token, etc.) provided by your system.",
//         usageInWorkflow:
//           "Before confirming a product&apos;s availability, the bot will check your inventory system to ensure the item is in stock, preventing overselling.",
//         credentialsFields: [
//           { id: "apiKey", label: "Inventory System API Key", type: "password" },
//           { id: "additionalSettings.endpoint", label: "API Endpoint URL", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "course-program-sales",
//     name: "Course/Program Sales",
//     category: "GROUP_4",
//     description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
//     icon: <MessageSquare className="h-6 w-6" />,
//     features: [
//       "Lead qualification",
//       "Payment processing",
//       "Access provisioning",
//       "Community integration",
//       "Progress tracking",
//       "Upsell sequences",
//     ],
//     integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom", "Voiceflow"],
//     operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
//     commonUseCase: "Coaches, online course creators, fitness programs, educational services",
//     borderClass: "card-border-data-processing",
//     howItWorks:
//       "This workflow automates the enrollment process for online courses, coaching programs, or educational services. It qualifies leads, handles payments, grants access to course materials, and can even integrate with community platforms.",
//     scenarioExample:
//       "A prospective student DMs asking about your online coding course. The bot provides course details, answers FAQs, offers a free preview, and guides them through the enrollment and payment process.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To enroll students in your Teachable courses and manage access.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "Upon successful payment, the bot can automatically enroll the student in the specified Teachable course and provide them with access instructions.",
//         credentialsFields: [
//           { id: "apiKey", label: "Teachable API Key", type: "password" },
//           { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
//         ],
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, the bot can enroll students in Thinkific courses and ensure they receive the necessary login details.",
//         credentialsFields: [
//           { id: "apiKey", label: "Thinkific API Key", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
//         ],
//       },
//       Discord: {
//         purpose: "To invite new students to your private Discord community.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "After enrollment, the bot can send an automated message to the student with an invite link to your exclusive Discord community.",
//         credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
//       },
//       Slack: {
//         purpose: "To notify your team about new enrollments or student inquiries.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot will send real-time notifications to a designated Slack channel whenever a new student enrolls or has a question, keeping your team updated.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Stripe: {
//         purpose: "To process payments for course enrollments.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will generate secure payment links via Stripe for students to purchase courses or programs.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To schedule and manage live coaching calls or webinars.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "quick-transaction",
//     name: "Quick Transaction Services",
//     category: "GROUP_5",
//     description: "For restaurants, retail, and simple booking services that need immediate transactions.",
//     icon: <Zap className="h-6 w-6" />,
//     features: [
//       "Menu/catalog display",
//       "Quick payment processing",
//       "Order tracking",
//       "Instant confirmations",
//       "Simple booking",
//       "Status updates",
//     ],
//     integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS", "Voiceflow"],
//     operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
//     commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
//     borderClass: "card-border-social",
//     howItWorks:
//       "This workflow is designed for businesses that handle quick, high-volume transactions. It allows customers to quickly browse offerings, place orders or make simple bookings, and receive instant confirmations, ideal for fast-paced environments.",
//     scenarioExample:
//       "A customer DMs a restaurant asking to order takeout. The bot displays the menu, takes their order, processes payment via Stripe, and sends an order confirmation with an `estimated pickup time.",
//     integrationDetails: {
//       Square: {
//         purpose: "To process payments and manage orders through Square POS.",
//         setupInstructions:
//           "Log in to your Square Developer Dashboard. Create an application to get your Application ID and Access Token.",
//         usageInWorkflow:
//           "The bot can integrate with your Square POS to process payments for orders placed through DMs and update order statuses.",
//         credentialsFields: [{ id: "apiKey", label: "Square Access Token", type: "password" }],
//       },
//       Stripe: {
//         purpose: "To process quick payments for orders or services.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "For immediate transactions, the bot will generate a secure Stripe payment link for the customer to complete their purchase.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       PayPal: {
//         purpose: "To offer PayPal as a quick payment option.",
//         setupInstructions:
//           "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
//         usageInWorkflow:
//           "Provides an alternative, fast payment method for customers who prefer to use PayPal for their purchases.",
//         credentialsFields: [
//           { id: "apiKey", label: "PayPal Client ID", type: "password" },
//           { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
//         ],
//       },
//       DoorDash: {
//         purpose: "To integrate with DoorDash for food delivery orders.",
//         setupInstructions:
//           "This requires a partnership with DoorDash and access to their merchant API. You&apos;ll need specific API credentials provided by DoorDash.",
//         usageInWorkflow:
//           "If your restaurant offers DoorDash delivery, the bot can send orders directly to your DoorDash merchant account for fulfillment.",
//         credentialsFields: [{ id: "apiKey", label: "DoorDash API Key", type: "password" }],
//       },
//       "Uber Eats": {
//         purpose: "To integrate with Uber Eats for food delivery orders.",
//         setupInstructions:
//           "Similar to DoorDash, this requires an Uber Eats merchant account and access to their API. You&apos;ll need specific API credentials from Uber Eats.",
//         usageInWorkflow:
//           "The bot can pass orders to your Uber Eats merchant account for delivery, providing seamless integration with your delivery operations.",
//         credentialsFields: [{ id: "apiKey", label: "Uber Eats API Key", type: "password" }],
//       },
//       SMS: {
//         purpose: "To send instant order confirmations and status updates via text message.",
//         setupInstructions:
//           "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
//         usageInWorkflow:
//           "Customers will receive immediate SMS confirmations of their orders and updates on their order status (e.g., 'Order ready for pickup').",
//         credentialsFields: [
//           { id: "apiKey", label: "SMS Provider API Key", type: "password" },
//           { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "education-training",
//     name: "Education & Training",
//     category: "GROUP_6",
//     description: "For online courses, workshops, certifications, and educational content delivery.",
//     icon: <BookOpen className="h-6 w-6" />,
//     features: [
//       "Course enrollment",
//       "Content access management",
//       "Quiz/assessment support",
//       "Certificate generation",
//       "Student progress tracking",
//       "Learning platform integration",
//     ],
//     integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing", "Voiceflow"],
//     operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
//     commonUseCase: "Online academies, certification bodies, corporate training",
//     borderClass: "card-border-document",
//     howItWorks:
//       "This workflow automates the entire student lifecycle for educational platforms. From initial interest and enrollment to providing access to learning materials and tracking progress, it ensures a smooth educational journey.",
//     scenarioExample:
//       "A user DMs asking about a specific certification program. The bot provides details, answers FAQs, guides them through enrollment, processes payment, and grants access to the online course platform.",
//     integrationDetails: {
//       Teachable: {
//         purpose: "To manage course enrollments and student access on Teachable.",
//         setupInstructions:
//           "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
//         usageInWorkflow:
//           "The bot can automatically enroll students in courses and provide access links after successful registration.",
//         credentialsFields: [
//           { id: "apiKey", label: "Teachable API Key", type: "password" },
//           { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
//         ],
//       },
//       Thinkific: {
//         purpose: "To manage student enrollments and course access on Thinkific.",
//         setupInstructions:
//           "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
//         usageInWorkflow:
//           "Similar to Teachable, this integration allows the bot to handle student enrollment and access provisioning for Thinkific courses.",
//         credentialsFields: [
//           { id: "apiKey", label: "Thinkific API Key", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
//         ],
//       },
//       Moodle: {
//         purpose: "To integrate with your Moodle LMS for course management and user synchronization.",
//         setupInstructions:
//           "In Moodle, enable web services (Site administration > Server > Web services > External services). Create a custom service and generate a token for a specific user with appropriate permissions.",
//         usageInWorkflow:
//           "The bot can create new user accounts in Moodle, enroll them in courses, and potentially retrieve basic progress information.",
//         credentialsFields: [
//           { id: "apiKey", label: "Moodle API Token", type: "password" },
//           { id: "additionalSettings.serviceUrl", label: "Moodle Web Service URL", type: "text" },
//         ],
//       },
//       Stripe: {
//         purpose: "To process payments for course fees or program subscriptions.",
//         setupInstructions:
//           "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
//         usageInWorkflow:
//           "The bot will securely handle course fee payments, generating links for students to complete their purchase.",
//         credentialsFields: [
//           { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
//           { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
//         ],
//       },
//       Zoom: {
//         purpose: "To schedule and manage live online classes, webinars, or tutoring sessions.",
//         setupInstructions:
//           "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
//         usageInWorkflow:
//           "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zoom Client ID", type: "password" },
//           { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
//         ],
//       },
//       "Email Marketing": {
//         purpose: "To add new students to your email lists for newsletters and updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "Upon enrollment, the bot can automatically add the student&apos;s email to your designated email marketing list for future communications.",
//         credentialsFields: [
//           { id: "apiKey", label: "Email Marketing API Key", type: "password" },
//           { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "community-management",
//     name: "Community Management",
//     category: "GROUP_7",
//     description: "For managing online communities, forums, membership sites, and social groups.",
//     icon: <Globe className="h-6 w-6" />,
//     features: [
//       "Member onboarding",
//       "Content moderation",
//       "Event announcements",
//       "Q&A support",
//       "Engagement tracking",
//       "Forum integration",
//     ],
//     integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing", "Voiceflow"],
//     operations: ["Join", "Onboarding", "Engagement", "Support"],
//     commonUseCase: "Online forums, membership communities, fan clubs",
//     borderClass: "card-border-communication",
//     howItWorks:
//       "This workflow helps manage and grow your online community. It automates member onboarding, facilitates Q&A, announces events, and can even assist with content moderation, fostering a vibrant and engaged community.",
//     scenarioExample:
//       "A new member DMs your community page. The bot welcomes them, provides links to community guidelines, introduces key channels, and answers initial questions, guiding them through the onboarding process.",
//     integrationDetails: {
//       Discord: {
//         purpose: "To manage roles, send announcements, and facilitate interactions within your Discord server.",
//         setupInstructions:
//           "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
//         usageInWorkflow:
//           "The bot can send welcome messages to new members, post event announcements, or even moderate certain types of messages in your Discord channels.",
//         credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
//       },
//       Slack: {
//         purpose: "To manage team communications, share announcements, and provide quick support.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "The bot can post updates, answer common questions in channels, or direct members to relevant resources within Slack.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Circle: {
//         purpose: "To integrate with your Circle.so community platform for member management.",
//         setupInstructions:
//           "In your Circle community, go to Settings > Integrations > API. Generate an API token. You&apos;ll also need your community URL.",
//         usageInWorkflow:
//           "The bot can add new members to your Circle community, send direct messages, or post updates to specific spaces.",
//         credentialsFields: [
//           { id: "apiKey", label: "Circle.so API Token", type: "password" },
//           { id: "additionalSettings.communityUrl", label: "Circle Community URL", type: "text" },
//         ],
//       },
//       "Mighty Networks": {
//         purpose: "To manage members and content within your Mighty Networks community.",
//         setupInstructions:
//           "Mighty Networks typically uses webhooks for integrations. You&apos;ll need to configure webhooks in your Mighty Networks settings to send data to your application.",
//         usageInWorkflow:
//           "The bot can welcome new members, share links to courses or content within Mighty Networks, and respond to common queries about the platform.",
//         credentialsFields: [{ id: "webhookUrl", label: "Mighty Networks Webhook URL", type: "text", optional: true }],
//       },
//       Patreon: {
//         purpose: "To verify patron status and provide exclusive access or content.",
//         setupInstructions:
//           "In your Patreon Creator account, go to My Profile > My Apps. Create a new client to get your Client ID and Client Secret. You&apos;ll need to set up OAuth 2.0 redirect URIs.",
//         usageInWorkflow:
//           "The bot can check a user&apos;s Patreon pledge level and grant access to exclusive content or channels based on their tier.",
//         credentialsFields: [
//           { id: "apiKey", label: "Patreon Client ID", type: "password" },
//           { id: "apiSecret", label: "Patreon Client Secret", type: "password" },
//         ],
//       },
//       "Email Marketing": {
//         purpose: "To send community newsletters, event invitations, and important updates.",
//         setupInstructions:
//           "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
//         usageInWorkflow:
//           "The bot can add new community members to your email list for regular updates and event announcements.",
//         credentialsFields: [
//           { id: "apiKey", label: "Email Marketing API Key", type: "password" },
//           { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
//         ],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
//   {
//     id: "customer-support-advanced",
//     name: "Customer Support (Advanced)",
//     category: "GROUP_8",
//     description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
//     icon: <LifeBuoy className="h-6 w-6" />,
//     features: [
//       "Ticket creation",
//       "Issue diagnosis",
//       "Knowledge base lookup",
//       "Escalation to human agent",
//       "Feedback collection",
//       "CRM integration",
//     ],
//     integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email", "Voiceflow"],
//     operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
//     commonUseCase: "Software companies, tech support, complex service providers",
//     borderClass: "card-border-integration",
//     howItWorks:
//       "This advanced support workflow handles complex customer inquiries, diagnoses issues, provides solutions from a knowledge base, and seamlessly escalates to human agents when needed. It ensures efficient and effective customer service.",
//     scenarioExample:
//       "A customer DMs with a technical issue. The bot asks diagnostic questions, searches the knowledge base for solutions, and if unable to resolve, creates a support ticket in Zendesk and notifies a human agent.",
//     integrationDetails: {
//       Zendesk: {
//         purpose: "To create, update, and manage support tickets.",
//         setupInstructions:
//           "In Zendesk, go to Admin > Channels > API > Token Access. Enable token access and create a new API token. You&apos;ll also need your Zendesk subdomain and email.",
//         usageInWorkflow:
//           "When a customer&apos;s issue requires human intervention, the bot will automatically create a new ticket in Zendesk, pre-filling it with conversation history and customer details.",
//         credentialsFields: [
//           { id: "apiKey", label: "Zendesk API Token", type: "password" },
//           { id: "additionalSettings.subdomain", label: "Zendesk Subdomain", type: "text" },
//           { id: "additionalSettings.email", label: "Zendesk Email", type: "email" },
//         ],
//       },
//       Freshdesk: {
//         purpose: "To create and manage support tickets in Freshdesk.",
//         setupInstructions:
//           "In Freshdesk, go to Admin > API Keys. Copy your API key. You&apos;ll also need your Freshdesk domain.",
//         usageInWorkflow:
//           "Similar to Zendesk, the bot can create new support tickets in Freshdesk, ensuring no customer inquiry falls through the cracks.",
//         credentialsFields: [
//           { id: "apiKey", label: "Freshdesk API Key", type: "password" },
//           { id: "additionalSettings.domain", label: "Freshdesk Domain", type: "text" },
//         ],
//       },
//       "Salesforce Service Cloud": {
//         purpose: "To manage cases, contacts, and service interactions within Salesforce.",
//         setupInstructions:
//           "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes for Service Cloud.",
//         usageInWorkflow:
//           "The bot can create new cases in Salesforce Service Cloud, update existing ones, and log all customer interactions directly to the case record.",
//         credentialsFields: [
//           { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
//           { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
//         ],
//       },
//       Intercom: {
//         purpose: "To manage customer conversations and provide in-app support.",
//         setupInstructions:
//           "In Intercom, go to Settings > Developers > Access Tokens. Generate a new access token with appropriate permissions (e.g., 'read_conversations', 'write_conversations').",
//         usageInWorkflow:
//           "The bot can respond to customer queries directly within Intercom, and if escalation is needed, it can assign the conversation to a human agent.",
//         credentialsFields: [{ id: "apiKey", label: "Intercom Access Token", type: "password" }],
//       },
//       Slack: {
//         purpose: "To notify support teams about urgent tickets or customer escalations.",
//         setupInstructions:
//           "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
//         usageInWorkflow:
//           "When a customer requests human assistance or an urgent issue is detected, the bot will send a real-time alert to your support team&apos;s Slack channel.",
//         credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
//       },
//       Email: {
//         purpose: "To send automated email responses, confirmations, or follow-ups.",
//         setupInstructions:
//           "This typically involves an email sending service like SendGrid, Mailgun, or AWS SES. You&apos;ll need an API key and sender email configuration from your chosen service.",
//         usageInWorkflow:
//           "The bot can send automated email confirmations for ticket creation, provide knowledge base articles via email, or send follow-up surveys.",
//         credentialsFields: [{ id: "apiKey", label: "Email Service API Key", type: "password" }],
//       },
//       Voiceflow: {
//         purpose: "To power the conversational AI logic for the workflow.",
//         setupInstructions:
//           "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
//         usageInWorkflow:
//           "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
//         credentialsFields: [
//           { id: "apiKey", label: "Voiceflow API Key", type: "password" },
//           { id: "projectId", label: "Voiceflow Project ID", type: "text" },
//           { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
//         ],
//       },
//     },
//   },
// ]

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   projectId?: string
//   versionId?: string
//   additionalSettings?: Record<string, string>
// }

// interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: IntegrationConfig }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   // NEW: Add credentials to the type to easily access them when fetching active workflow
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string // This will be a JSON string, parsed on client
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
// }

// interface IntegrationTestResult {
//   isTesting: boolean
//   result: "success" | "failure" | null
//   message: string | null
// }

// export default function WorkflowSelector() {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
//   const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review" | "customization">(
//     "selection",
//   )
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [modifyingWorkflowId, setModifyingWorkflowId] = useState<string | null>(null)
//   const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

//   // NEW STATES FOR ACTIVE WORKFLOW
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)

//   // In a real app, you'd get the current user's businessId from context/auth
//   // For this demo, let's assume a placeholder business ID.
//   // This needs to be replaced with actual user-specific business ID from a backend context
//   const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8" // Example placeholder. MUST BE REPLACED.

//   // Effect to fetch active workflow on component mount
//   useEffect(() => {
//     const fetchActiveWorkflow = async () => {
//       setIsFetchingActiveWorkflow(true)
//       try {
//         if (!currentBusinessId) {
//           console.warn("No business ID available to fetch active workflow.")
//           setIsFetchingActiveWorkflow(false)
//           return
//         }

//         const response = await fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`)
//         if (response.ok) {
//           const data = await response.json()
//           if (data.workflowConfigs && data.workflowConfigs.length > 0) {
//             const activeConfig = data.workflowConfigs[0] // Assuming only one active workflow per business
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)

//             // Pre-populate credentials if re-loading an active workflow
//             const loadedIntegrationConfigs: Record<string, IntegrationConfig> = {}
//             const loadedSelectedIntegrations: string[] = []
//             activeConfig.credentials.forEach((cred: any) => {
//               try {
//                 const parsedConfig = JSON.parse(cred.encryptedCredentials)
//                 loadedIntegrationConfigs[cred.integrationName] = {
//                   name: cred.integrationName,
//                   ...parsedConfig,
//                 }
//                 loadedSelectedIntegrations.push(cred.integrationName)
//               } catch (e) {
//                 console.error("Failed to parse credentials for", cred.integrationName, e)
//               }
//             })
//             setIntegrationConfigs(loadedIntegrationConfigs)
//             setSelectedIntegrations(loadedSelectedIntegrations)
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         } else {
//           console.error("Failed to fetch active workflow configurations:", await response.text())
//         }
//       } catch (error) {
//         console.error("Error fetching active workflow:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//       }
//     }

//     fetchActiveWorkflow()
//   }, [currentBusinessId])

//   const handleWorkflowSelect = (workflow: WorkflowType) => {
//     if (activeWorkflowExists) return
//     setSelectedWorkflow(workflow)
//     // Clear any previous custom request or modification state
//     setIsCustomWorkflow(false)
//     setModifyingWorkflowId(null)
//     setCustomRequest("")
//     // Reset integration states for the new selection
//     setIntegrationConfigs({})
//     setSelectedIntegrations([])
//     setIntegrationTestResults({})
//     setStep("configuration")
//   }

//   // Moved to configuration step
//   const handleRequestModifiedVersion = (workflow: WorkflowType) => {
//     setSelectedWorkflow(workflow)
//     setIsCustomWorkflow(true)
//     setModifyingWorkflowId(workflow.id)
//     setCustomRequest(
//       `I&apos;d like to request a modified version of the "${workflow.name}" workflow. Please specify the changes you&apos;d like to make (e.g., add/remove integrations, modify process steps, adjust features):`,
//     )
//     setStep("customization")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("integrations")
//   }

//   const handleIntegrationToggle = (integration: string) => {
//     setSelectedIntegrations((prev) =>
//       prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//     )
//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleIntegrationConfig = (integration: string, fieldId: string, value: string) => {
//     setIntegrationConfigs((prev) => {
//       const currentConfig = prev[integration] || { name: integration }
//       const updatedConfig = { ...currentConfig }

//       if (fieldId.includes(".")) {
//         const [mainField, subField] = fieldId.split(".")
//         if (!(updatedConfig as any)[mainField]) {
//           ;(updatedConfig as any)[mainField] = {}
//         }
//         ;(updatedConfig as any)[mainField][subField] = value
//       } else {
//         ;(updatedConfig as any)[fieldId] = value
//       }

//       return {
//         ...prev,
//         [integration]: updatedConfig,
//       }
//     })

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integration]: { isTesting: false, result: null, message: null },
//     }))
//   }

//   const handleTestIntegration = async (integrationName: string) => {
//     const config = integrationConfigs[integrationName]
//     const details = selectedWorkflow?.integrationDetails[integrationName]
//     const hasRequiredFields = details?.credentialsFields?.every(
//       (field) =>
//         field.optional ||
//         (field.id.includes(".")
//           ? (config as any)?.[field.id.split(".")[0]]?.[field.id.split(".")[1]]
//           : (config as any)?.[field.id]),
//     )

//     if (!hasRequiredFields) {
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Missing required credentials for test." },
//       }))
//       return
//     }

//     setIntegrationTestResults((prev) => ({
//       ...prev,
//       [integrationName]: { isTesting: true, result: null, message: "Testing..." },
//     }))

//     try {
//       const response = await fetch("/api/integrations/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           integrationType: integrationName.toLowerCase().replace(/\s/g, ""),
//           credentials: config,
//         }),
//       })
//       const result = await response.json()

//       if (result.success) {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "success", message: result.message },
//         }))
//       } else {
//         setIntegrationTestResults((prev) => ({
//           ...prev,
//           [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
//         }))
//       }
//     } catch (error) {
//       console.error("Error testing integration:", error)
//       setIntegrationTestResults((prev) => ({
//         ...prev,
//         [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
//       }))
//     }
//   }

//   // NEW: Function to check if all selected integrations have been tested successfully
//   const areAllSelectedIntegrationsTestedSuccessfully = () => {
//     if (selectedIntegrations.length === 0) return true

//     for (const integration of selectedIntegrations) {
//       const testResult = integrationTestResults[integration]
//       const details = selectedWorkflow?.integrationDetails[integration]

//       // Only require testing if the integration has defined credential fields
//       if (details?.credentialsFields && details.credentialsFields.length > 0) {
//         // Also ensure all *required* fields for this integration actually have a value
//         const config = integrationConfigs[integration] || {}
//         const hasAllRequiredFields = details.credentialsFields.every(
//           (field) =>
//             field.optional ||
//             (field.id.includes(".")
//               ? (config as any)[field.id.split(".")[0]]?.[field.id.split(".")[1]]
//               : (config as any)[field.id]),
//         )

//         // If it has required fields, it must be successfully tested
//         if (!hasAllRequiredFields || !testResult || testResult.result !== "success") {
//           return false
//         }
//       }
//     }
//     return true
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentBusinessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     const integrationsToSubmit = selectedIntegrations.map((name) => ({
//       name,
//       config: integrationConfigs[name] || { name },
//     }))

//     const workflowData = {
//       workflowTemplateId: selectedWorkflow?.id || null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: integrationsToSubmit,
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       isActive: !isCustomWorkflow, // Templates are active immediately, custom requests are not
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()
//       if (result.success) {
//         alert(isCustomWorkflow ? "Custom workflow request submitted successfully!" : "Workflow deployed successfully!")
//         setActiveWorkflowExists(true)
//         setActiveWorkflowDetails(result.workflowConfig)
//         setStep("review")
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     if (!window.confirm("Are you sure you want to deactivate this workflow? This will stop all automated responses.")) {
//       return
//     }

//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setSelectedWorkflow(null)
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setIntegrationConfigs({})
//         setSelectedIntegrations([])
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setModifyingWorkflowId(null)
//         setIntegrationTestResults({})
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   if (isFetchingActiveWorkflow) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   if (activeWorkflowExists && activeWorkflowDetails) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6 text-center">
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <PlayCircle className="h-8 w-8 text-green-500" />
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                 Your Workflow is Running!
//               </h1>
//             </div>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
//               Your &quot;{activeWorkflowDetails.workflowTemplate?.name || "Custom Workflow"}&quot; is active and
//               automating responses for your business.
//             </p>

//             <Card className="glassEffect border-2 border-green-500/50 mb-8 p-6">
//               <CardHeader className="p-0 mb-4">
//                 <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//                   <Sparkles className="h-6 w-6" />
//                   Active Workflow Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-left">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.workflowTemplate?.name || "Custom Workflow"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.businessInfo.businessName}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {activeWorkflowDetails.businessInfo.businessType}
//                   </p>
//                 </div>
//                 {activeWorkflowDetails.customRequest && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Custom Request:</Label>
//                     <p className="text-base bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">
//                       {activeWorkflowDetails.customRequest}
//                     </p>
//                   </div>
//                 )}
//                 {activeWorkflowDetails.credentials && activeWorkflowDetails.credentials.length > 0 && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Configured Integrations:</Label>
//                     <div className="flex flex-wrap gap-2">
//                       {activeWorkflowDetails.credentials.map((cred, idx) => (
//                         <Badge key={idx} variant="secondary" className="text-sm">
//                           {cred.integrationName}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Status:</Label>
//                   <Badge className="bg-green-600 text-green-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//                     <PlayCircle className="h-4 w-4 mr-2" />
//                     {activeWorkflowDetails.status}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-8 flex justify-center gap-4">
//               <Button
//                 onClick={handleDeactivateWorkflow}
//                 disabled={isDeactivating}
//                 size="lg"
//                 className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-semibold"
//               >
//                 {isDeactivating ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <PauseCircle className="h-4 w-4 mr-2" />
//                 )}
//                 {isDeactivating ? "Deactivating..." : "Deactivate Workflow"}
//               </Button>
//             </div>
//             <p className="text-xs text-muted-foreground mt-6">
//               To choose a different workflow, please deactivate the current one first.
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "selection") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select the workflow type that best matches your business model for automated social media responses
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
//               {workflowTypes.map((workflow, index) => (
//                 <Card
//                   key={workflow.id}
//                   className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => !activeWorkflowExists && handleWorkflowSelect(workflow)}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
//                         <div className="flex gap-2 flex-wrap"></div>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                       <div className="space-y-2">
//                         {workflow.operations.map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-3">
//                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm text-muted-foreground">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                       <ul className="space-y-2">
//                         {workflow.features.slice(0, 3).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                         {workflow.features.length > 3 && (
//                           <li className="text-xs text-muted-foreground ml-6">
//                             +{workflow.features.length - 3} more features
//                           </li>
//                         )}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
//                     </div>
//                     <div className="flex gap-2 mt-4">
//                       <Button
//                         onClick={() => handleWorkflowSelect(workflow)}
//                         className="flex-1"
//                         disabled={activeWorkflowExists}
//                       >
//                         Select Workflow
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => {
//                   if (!activeWorkflowExists) {
//                     setIsCustomWorkflow(true)
//                     setSelectedWorkflow(null)
//                     setModifyingWorkflowId(null)
//                     setCustomRequest("")
//                     setStep("customization")
//                   }
//                 }}
//               >
//                 <Sparkles className="h-10 w-10 text-primary mb-4" />
//                 <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
//                 <CardDescription className="text-sm leading-relaxed">
//                   Can&apos;t find what you need? Describe your unique requirements, and we&apos;ll build it for you.
//                 </CardDescription>
//                 <Button variant="outline" className="mt-4 bg-transparent" disabled={activeWorkflowExists}>
//                   Get Started
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "configuration" && selectedWorkflow) {
//     const customizationTitle = modifyingWorkflowId
//       ? `Modify Your ${selectedWorkflow.name} Workflow`
//       : "Request a Custom Workflow"
//     const customizationDescription = modifyingWorkflowId
//       ? "Tell us how you&apos;d like to adapt this existing workflow."
//       : "Tell us what you need, and we&apos;ll create a tailored solution for your business."
//     const textareaPlaceholder = modifyingWorkflowId
//       ? `Describe the specific changes you&apos;d like for the ${selectedWorkflow.name} workflow. E.g., "Remove Google Calendar, add HubSpot CRM, and simplify the booking confirmation step."`
//       : "Describe the specific operations, features, and integrations you need. E.g., &apos;I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like &apos;urgent&apos; are detected.&apos;"

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-6xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {selectedWorkflow.name} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to customize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       {selectedWorkflow.icon}
//                       Workflow Overview
//                     </CardTitle>
//                     <CardDescription>
//                       Here&apos;s what your {selectedWorkflow.name} workflow will include
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-8">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {selectedWorkflow.operations.map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {selectedWorkflow.features.map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedWorkflow.integrations.map((integration, idx) => (
//                             <Badge key={idx} variant="outline" className="text-xs">
//                               {integration}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5 text-primary" />
//                       How This Workflow Works
//                     </CardTitle>
//                     <CardDescription>Understand the flow and see a real-world example.</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Explanation:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">{selectedWorkflow.howItWorks}</p>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 text-primary">Scenario Example:</h4>
//                       <p className="text-sm text-muted-foreground leading-relaxed">
//                         {selectedWorkflow.scenarioExample}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <div className="flex justify-end mt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => handleRequestModifiedVersion(selectedWorkflow)}
//                     className="flex-1 bg-transparent hover:bg-accent"
//                   >
//                     Request Modified Version
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Integrations
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "integrations" && selectedWorkflow) {
//     const isReadyForReview = areAllSelectedIntegrationsTestedSuccessfully() && selectedIntegrations.length > 0

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Setup Integrations
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Configure the integrations needed for your {selectedWorkflow.name} workflow
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {selectedWorkflow.integrations.map((integration, index) => {
//                 const testResult = integrationTestResults[integration]
//                 const details = selectedWorkflow.integrationDetails[integration]
//                 const hasCredentialsFields = details?.credentialsFields && details.credentialsFields.length > 0

//                 return (
//                   <Card
//                     key={integration}
//                     className={`glassEffect border-2 transition-all duration-300 ${
//                       selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10">
//                             <Zap className="h-5 w-5 text-primary" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-lg">{integration}</CardTitle>
//                             <CardDescription>
//                               {details?.purpose || `Configure your ${integration} integration`}
//                             </CardDescription>
//                           </div>
//                         </div>
//                         <Checkbox
//                           checked={selectedIntegrations.includes(integration)}
//                           onCheckedChange={() => handleIntegrationToggle(integration)}
//                           className="scale-125"
//                         />
//                       </div>
//                     </CardHeader>

//                     {selectedIntegrations.includes(integration) && (
//                       <CardContent className="space-y-4 border-t border-border/20 pt-6">
//                         {details?.setupInstructions && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How to get credentials:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.setupInstructions}</p>
//                           </div>
//                         )}
//                         {details?.usageInWorkflow && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-sm text-primary">How we&apos;ll use it:</h4>
//                             <p className="text-sm text-muted-foreground leading-relaxed">{details.usageInWorkflow}</p>
//                           </div>
//                         )}

//                         {hasCredentialsFields &&
//                           details.credentialsFields?.map((field) => {
//                             const fieldValue = field.id.includes(".")
//                               ? (integrationConfigs[integration] as any)?.[field.id.split(".")[0]]?.[
//                                   field.id.split(".")[1]
//                                 ] || ""
//                               : (integrationConfigs[integration] as any)?.[field.id] || ""
//                             return (
//                               <div className="space-y-2" key={field.id}>
//                                 <Label htmlFor={`${integration}-${field.id}`} className="text-sm font-medium">
//                                   {field.label} {field.optional ? "(Optional)" : "*"}
//                                 </Label>
//                                 <Input
//                                   id={`${integration}-${field.id}`}
//                                   type={field.type}
//                                   placeholder={`Enter your ${field.label.toLowerCase()}`}
//                                   onChange={(e) => handleIntegrationConfig(integration, field.id, e.target.value)}
//                                   className="bg-background/50 border-border/50 focus:border-primary"
//                                   value={fieldValue}
//                                 />
//                               </div>
//                             )
//                           })}

//                         {hasCredentialsFields && ( // Only show test button if there are credentials to test
//                           <div className="flex items-center gap-3 pt-2">
//                             <Button
//                               variant="outline"
//                               onClick={() => handleTestIntegration(integration)}
//                               disabled={testResult?.isTesting}
//                               className="flex items-center gap-2"
//                             >
//                               {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
//                               Test Credentials
//                             </Button>
//                             {testResult?.result === "success" && (
//                               <span className="text-green-500 flex items-center gap-1 text-sm">
//                                 <CheckCircle className="h-4 w-4" />
//                                 {testResult.message}
//                               </span>
//                             )}
//                             {testResult?.result === "failure" && (
//                               <span className="text-red-500 flex items-center gap-1 text-sm">
//                                 <XCircle className="h-4 w-4" />
//                                 {testResult.message}
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </CardContent>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>

//             <div className="mt-10 flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button onClick={() => setStep("review")} size="lg" className="px-8" disabled={!isReadyForReview}>
//                 Review Configuration
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radial--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 className="mb-6 hover:bg-accent"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isCustomWorkflow
//                         ? modifyingWorkflowId
//                           ? `Modified Version of ${selectedWorkflow?.name}`
//                           : "Custom Workflow Request"
//                         : selectedWorkflow?.name}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   {!isCustomWorkflow && selectedWorkflow && (
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         N/A (Customizable)
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {isCustomWorkflow ? (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Custom Request Details
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-semibold text-primary">Your Description:</Label>
//                       <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
//                     </div>
//                     <div className="mt-4 text-sm text-muted-foreground">
//                       Our team will review your request and contact you to discuss the custom workflow.
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="glassEffect border-2 border-border/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="h-5 w-5 text-primary" />
//                       Configured Integrations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {selectedIntegrations.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedIntegrations.map((integration) => (
//                           <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm font-medium">{integration}</span>
//                             <Badge variant="outline" className="ml-auto text-xs">
//                               Configured
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <p className="text-sm text-muted-foreground">No integrations configured</p>
//                         <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isCustomWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Our team will review your custom workflow request.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will contact you within 1-2 business days to discuss details and next steps.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once finalized, your custom Voiceflow workflow will be built and deployed.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your Voiceflow workflow will be automatically configured.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration connections will be tested and verified.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your automation will be activated for social media DMs.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
//                 size="lg"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }










"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Users,
  Zap,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Globe,
  LifeBuoy,
  Loader2,
  XCircle,
  FileText,
  AlertTriangle,
} from "lucide-react"
import WorkflowDashboard from "./workflow-dashboard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WorkflowType {
  id: string
  name: string
  category: string
  description: string
  icon: React.ReactNode
  features: string[]
  integrations: string[]
  operations: string[]
  commonUseCase: string
  borderClass: string
  howItWorks: string
  scenarioExample: string
  integrationDetails: {
    [key: string]: {
      purpose: string
      setupInstructions: string
      usageInWorkflow: string
      credentialsFields?: { id: string; label: string; type: string; optional?: boolean }[] // Made optional
    }
  }
}

const workflowTypes: WorkflowType[] = [
  {
    id: "appointment-based",
    name: "Appointment-Based Services",
    category: "GROUP_1",
    description:
      "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
    icon: <Calendar className="h-6 w-6" />,
    features: [
      "Calendar integration",
      "Availability checking",
      "Automatic reminders",
      "Rescheduling handling",
      "No-show management",
      "Follow-up sequences",
    ],
    integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS", "Voiceflow"],
    operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
    commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
    borderClass: "card-border-marketing",
    howItWorks:
      "This workflow automates the entire appointment booking process, from initial inquiry to post-appointment follow-up. It handles scheduling, sends confirmations and reminders, and can even manage rescheduling or cancellations, freeing up your staff&apos;s time.",
    scenarioExample:
      "A client DMs your salon asking to book a haircut. The bot asks for their preferred date/time, checks availability via Google Calendar, confirms the booking, sends a reminder 24 hours prior, and a thank-you message after the appointment.",
    integrationDetails: {
      "Google Calendar": {
        purpose: "To check real-time availability and create new appointments.",
        setupInstructions:
          "Go to Google Cloud Console, enable the Calendar API, and create an OAuth 2.0 Client ID for a Web Application. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
        usageInWorkflow:
          "The bot will query your Google Calendar to find available slots and add new appointments directly to your calendar once confirmed by the user.",
        credentialsFields: [{ id: "apiKey", label: "Client ID", type: "password" }],
      },
      Calendly: {
        purpose: "To direct users to your Calendly booking page for self-service scheduling.",
        setupInstructions:
          "No API key needed. Simply provide your Calendly booking page URL. You can find this in your Calendly dashboard under 'Share Your Link'.",
        usageInWorkflow:
          "When a user expresses interest in booking, the bot will provide a direct link to your Calendly page, allowing them to choose a time that suits them.",
        credentialsFields: [], // No API fields, so no test button
      },
      Acuity: {
        purpose: "To integrate with your Acuity Scheduling account for booking and availability.",
        setupInstructions:
          "In your Acuity Scheduling account, go to Integrations > API. Generate a new API key. You&apos;ll need this key to connect.",
        usageInWorkflow:
          "The bot will use the Acuity API to check your schedule, book appointments, and manage client information directly within your Acuity account.",
        credentialsFields: [{ id: "apiKey", label: "Acuity API Key", type: "password" }],
      },
      Stripe: {
        purpose: "To process payments for appointments or booking deposits.",
        setupInstructions:
          "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
        usageInWorkflow:
          "If your service requires a deposit or full payment upfront, the bot will generate a secure payment link via Stripe for the user to complete the transaction.",
        credentialsFields: [
          { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
          { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
        ],
      },
      Zoom: {
        purpose: "To automatically create Zoom meeting links for virtual appointments.",
        setupInstructions:
          "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
        usageInWorkflow:
          "For virtual appointments, the bot will automatically generate a unique Zoom meeting link and include it in the appointment confirmation and reminder messages.",
        credentialsFields: [
          { id: "apiKey", label: "Zoom Client ID", type: "password" },
          { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
        ],
      },
      SMS: {
        purpose: "To send appointment confirmations and reminders via text message.",
        setupInstructions:
          "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
        usageInWorkflow:
          "After booking, the bot will send an SMS confirmation. It will also send automated reminders before the appointment to reduce no-shows.",
        credentialsFields: [
          { id: "apiKey", label: "SMS Provider API Key", type: "password" },
          { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "quote-based",
    name: "Quote-Based Services",
    category: "GROUP_2",
    description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
    icon: <DollarSign className="h-6 w-6" />,
    features: [
      "Photo/detail collection",
      "Scope clarification",
      "Pricing tier management",
      "Project timeline tracking",
      "Quote generation",
      "Negotiation handling",
    ],
    integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack", "Voiceflow"],
    operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
    commonUseCase: "Contractors, photographers, event planners, auto services",
    borderClass: "card-border-sales",
    howItWorks:
      "This workflow streamlines the process of providing custom quotes. It guides the user through gathering necessary details, allows for dynamic pricing based on inputs, generates a professional quote, and can even handle negotiation steps.",
    scenarioExample:
      "A potential client DMs your photography studio asking for wedding photography pricing. The bot asks for date, location, hours needed, and guest count. Based on this, it generates an estimated quote and offers to schedule a consultation call.",
    integrationDetails: {
      "Google Drive": {
        purpose: "To store collected documents, photos, or project specifications from clients.",
        setupInstructions:
          "Go to Google Cloud Console, enable the Google Drive API, and create an OAuth 2.0 Client ID. You&apos;ll need the Client ID and Client Secret. Ensure your redirect URIs are correctly configured.",
        usageInWorkflow:
          "If the workflow requires clients to upload files (e.g., photos for a photography quote), the bot will provide a link or mechanism to upload directly to a designated Google Drive folder.",
        credentialsFields: [{ id: "apiKey", label: "Google Drive Client ID", type: "password" }],
      },
      Dropbox: {
        purpose: "To store and share large files or project assets with clients.",
        setupInstructions:
          "Go to the Dropbox App Console, create a new app, and generate an access token. Ensure the app has the necessary permissions (e.g., files.content.write).",
        usageInWorkflow:
          "Similar to Google Drive, this allows for secure file uploads and sharing of project-related documents or drafts with clients.",
        credentialsFields: [{ id: "apiKey", label: "Dropbox Access Token", type: "password" }],
      },
      QuickBooks: {
        purpose: "To generate professional invoices and manage client billing.",
        setupInstructions:
          "Log in to your QuickBooks Developer account. Create an app and obtain your Client ID and Client Secret. You&apos;ll also need to set up OAuth 2.0 redirect URIs.",
        usageInWorkflow:
          "Once a quote is accepted, the bot can automatically generate a draft invoice in QuickBooks based on the agreed-upon services and pricing.",
        credentialsFields: [
          { id: "apiKey", label: "QuickBooks Client ID", type: "password" },
          { id: "apiSecret", label: "QuickBooks Client Secret", type: "password" },
        ],
      },
      Stripe: {
        purpose: "To process payments for accepted quotes or deposits.",
        setupInstructions:
          "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
        usageInWorkflow:
          "After a quote is finalized, the bot can send a secure Stripe payment link to the client for deposit or full payment.",
        credentialsFields: [
          { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
          { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
        ],
      },
      DocuSign: {
        purpose: "To send and manage digital contracts or agreements for quotes.",
        setupInstructions:
          "Create a DocuSign Developer account. Create an integration key (Client ID) and generate a private key. You&apos;ll also need to configure OAuth 2.0.",
        usageInWorkflow:
          "Once a quote is accepted, the bot can initiate a DocuSign envelope with the contract, allowing clients to digitally sign agreements.",
        credentialsFields: [{ id: "apiKey", label: "DocuSign Integration Key", type: "password" }],
      },
      Slack: {
        purpose: "To notify your team about new quote requests or accepted quotes.",
        setupInstructions:
          "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
        usageInWorkflow:
          "The bot will send real-time notifications to a designated Slack channel whenever a new quote inquiry comes in or a quote is accepted, keeping your team informed.",
        credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "product-sales-high-touch",
    name: "Product Sales (High-Touch)",
    category: "GROUP_3",
    description:
      "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
    icon: <Users className="h-6 w-6" />,
    features: [
      "Inventory checking",
      "Specification gathering",
      "Financing options",
      "Delivery scheduling",
      "Lead qualification",
      "CRM integration",
    ],
    integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs", "Voiceflow"],
    operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
    commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
    borderClass: "card-border-customer-support",
    howItWorks:
      "This workflow is designed for businesses with complex product sales, often involving customization, financing, or detailed consultations. It guides customers through product selection, gathers specific requirements, and facilitates the sales process up to delivery.",
    scenarioExample:
      "A customer DMs a car dealership asking about a specific model. The bot checks inventory, asks about desired features and financing needs, and then schedules a test drive with a sales representative.",
    integrationDetails: {
      Salesforce: {
        purpose: "To create and update leads, contacts, and opportunities in your CRM.",
        setupInstructions:
          "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes.",
        usageInWorkflow:
          "New inquiries will automatically create leads in Salesforce. As the conversation progresses, the bot can update lead status or add notes to the contact record.",
        credentialsFields: [
          { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
          { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
        ],
      },
      HubSpot: {
        purpose: "To manage leads, contacts, and deals within your HubSpot CRM.",
        setupInstructions:
          "In HubSpot, go to Settings > Integrations > Private Apps. Create a new private app and obtain your Access Token. Ensure necessary CRM scopes are granted.",
        usageInWorkflow:
          "Similar to Salesforce, the bot will create new contacts or update existing ones in HubSpot, logging interactions and moving deals through your sales pipeline.",
        credentialsFields: [{ id: "apiKey", label: "HubSpot Access Token", type: "password" }],
      },
      Stripe: {
        purpose: "To process payments for product purchases or deposits.",
        setupInstructions:
          "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
        usageInWorkflow:
          "When a customer is ready to purchase, the bot can generate a secure Stripe payment link for them to complete the transaction.",
        credentialsFields: [
          { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
          { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
        ],
      },
      PayPal: {
        purpose: "To offer PayPal as a payment option for product sales.",
        setupInstructions:
          "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
        usageInWorkflow:
          "Provides an alternative payment gateway for customers who prefer to use PayPal for their purchases.",
        credentialsFields: [
          { id: "apiKey", label: "PayPal Client ID", type: "password" },
          { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
        ],
      },
      Shopify: {
        purpose: "To check product inventory, retrieve product details, and create orders.",
        setupInstructions:
          "In your Shopify admin, go to Apps > Develop apps > Create an app. Grant necessary permissions (e.g., read_products, write_orders) and install the app to get your API access token.",
        usageInWorkflow:
          "The bot can query your Shopify store for product availability, provide product descriptions, and even initiate draft orders based on customer selections.",
        credentialsFields: [{ id: "apiKey", label: "Shopify API Access Token", type: "password" }],
      },
      "Inventory APIs": {
        purpose: "To integrate with external inventory management systems for real-time stock checks.",
        setupInstructions:
          "This depends on your specific inventory system (e.g., custom API, ERP system). You&apos;ll need the API endpoint and authentication details (API key, OAuth token, etc.) provided by your system.",
        usageInWorkflow:
          "Before confirming a product&apos;s availability, the bot will check your inventory system to ensure the item is in stock, preventing overselling.",
        credentialsFields: [
          { id: "apiKey", label: "Inventory System API Key", type: "password" },
          { id: "additionalSettings.endpoint", label: "API Endpoint URL", type: "text" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "course-program-sales",
    name: "Course/Program Sales",
    category: "GROUP_4",
    description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
    icon: <MessageSquare className="h-6 w-6" />,
    features: [
      "Lead qualification",
      "Payment processing",
      "Access provisioning",
      "Community integration",
      "Progress tracking",
      "Upsell sequences",
    ],
    integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom", "Voiceflow"],
    operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
    commonUseCase: "Coaches, online course creators, fitness programs, educational services",
    borderClass: "card-border-data-processing",
    howItWorks:
      "This workflow automates the enrollment process for online courses, coaching programs, or educational services. It qualifies leads, handles payments, grants access to course materials, and can even integrate with community platforms.",
    scenarioExample:
      "A prospective student DMs asking about your online coding course. The bot provides course details, answers FAQs, offers a free preview, and guides them through the enrollment and payment process.",
    integrationDetails: {
      Teachable: {
        purpose: "To enroll students in your Teachable courses and manage access.",
        setupInstructions:
          "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
        usageInWorkflow:
          "Upon successful payment, the bot can automatically enroll the student in the specified Teachable course and provide them with access instructions.",
        credentialsFields: [
          { id: "apiKey", label: "Teachable API Key", type: "password" },
          { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
        ],
      },
      Thinkific: {
        purpose: "To manage student enrollments and course access on Thinkific.",
        setupInstructions:
          "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
        usageInWorkflow:
          "Similar to Teachable, the bot can enroll students in Thinkific courses and ensure they receive the necessary login details.",
        credentialsFields: [
          { id: "apiKey", label: "Thinkific API Key", type: "password" },
          { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
        ],
      },
      Discord: {
        purpose: "To invite new students to your private Discord community.",
        setupInstructions:
          "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
        usageInWorkflow:
          "After enrollment, the bot can send an automated message to the student with an invite link to your exclusive Discord community.",
        credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
      },
      Slack: {
        purpose: "To notify your team about new enrollments or student inquiries.",
        setupInstructions:
          "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
        usageInWorkflow:
          "The bot will send real-time notifications to a designated Slack channel whenever a new student enrolls or has a question, keeping your team updated.",
        credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
      },
      Stripe: {
        purpose: "To process payments for course enrollments.",
        setupInstructions:
          "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
        usageInWorkflow:
          "The bot will generate secure payment links via Stripe for students to purchase courses or programs.",
        credentialsFields: [
          { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
          { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
        ],
      },
      Zoom: {
        purpose: "To schedule and manage live coaching calls or webinars.",
        setupInstructions:
          "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
        usageInWorkflow:
          "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
        credentialsFields: [
          { id: "apiKey", label: "Zoom Client ID", type: "password" },
          { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "quick-transaction",
    name: "Quick Transaction Services",
    category: "GROUP_5",
    description: "For restaurants, retail, and simple booking services that need immediate transactions.",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Menu/catalog display",
      "Quick payment processing",
      "Order tracking",
      "Instant confirmations",
      "Simple booking",
      "Status updates",
    ],
    integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS", "Voiceflow"],
    operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
    commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
    borderClass: "card-border-social",
    howItWorks:
      "This workflow is designed for businesses that handle quick, high-volume transactions. It allows customers to quickly browse offerings, place orders or make simple bookings, and receive instant confirmations, ideal for fast-paced environments.",
    scenarioExample:
      "A customer DMs a restaurant asking to order takeout. The bot displays the menu, takes their order, processes payment via Stripe, and sends an order confirmation with an `estimated pickup time.",
    integrationDetails: {
      Square: {
        purpose: "To process payments and manage orders through Square POS.",
        setupInstructions:
          "Log in to your Square Developer Dashboard. Create an application to get your Application ID and Access Token.",
        usageInWorkflow:
          "The bot can integrate with your Square POS to process payments for orders placed through DMs and update order statuses.",
        credentialsFields: [{ id: "apiKey", label: "Square Access Token", type: "password" }],
      },
      Stripe: {
        purpose: "To process quick payments for orders or services.",
        setupInstructions:
          "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
        usageInWorkflow:
          "For immediate transactions, the bot will generate a secure Stripe payment link for the customer to complete their purchase.",
        credentialsFields: [
          { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
          { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
        ],
      },
      PayPal: {
        purpose: "To offer PayPal as a quick payment option.",
        setupInstructions:
          "Log in to your PayPal Developer Dashboard. Create a REST API app to get your Client ID and Secret.",
        usageInWorkflow:
          "Provides an alternative, fast payment method for customers who prefer to use PayPal for their purchases.",
        credentialsFields: [
          { id: "apiKey", label: "PayPal Client ID", type: "password" },
          { id: "apiSecret", label: "PayPal Client Secret", type: "password" },
        ],
      },
      DoorDash: {
        purpose: "To integrate with DoorDash for food delivery orders.",
        setupInstructions:
          "This requires a partnership with DoorDash and access to their merchant API. You&apos;ll need specific API credentials provided by DoorDash.",
        usageInWorkflow:
          "If your restaurant offers DoorDash delivery, the bot can send orders directly to your DoorDash merchant account for fulfillment.",
        credentialsFields: [{ id: "apiKey", label: "DoorDash API Key", type: "password" }],
      },
      "Uber Eats": {
        purpose: "To integrate with Uber Eats for food delivery orders.",
        setupInstructions:
          "Similar to DoorDash, this requires an Uber Eats merchant account and access to their API. You&apos;ll need specific API credentials from Uber Eats.",
        usageInWorkflow:
          "The bot can pass orders to your Uber Eats merchant account for delivery, providing seamless integration with your delivery operations.",
        credentialsFields: [{ id: "apiKey", label: "Uber Eats API Key", type: "password" }],
      },
      SMS: {
        purpose: "To send instant order confirmations and status updates via text message.",
        setupInstructions:
          "This typically requires a third-party SMS provider like Twilio or MessageBird. You&apos;ll need an API Key and API Secret from your chosen provider.",
        usageInWorkflow:
          "Customers will receive immediate SMS confirmations of their orders and updates on their order status (e.g., 'Order ready for pickup').",
        credentialsFields: [
          { id: "apiKey", label: "SMS Provider API Key", type: "password" },
          { id: "apiSecret", label: "SMS Provider API Secret", type: "password" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "education-training",
    name: "Education & Training",
    category: "GROUP_6",
    description: "For online courses, workshops, certifications, and educational content delivery.",
    icon: <BookOpen className="h-6 w-6" />,
    features: [
      "Course enrollment",
      "Content access management",
      "Quiz/assessment support",
      "Certificate generation",
      "Student progress tracking",
      "Learning platform integration",
    ],
    integrations: ["Teachable", "Thinkific", "Moodle", "Stripe", "Zoom", "Email Marketing", "Voiceflow"],
    operations: ["Inquiry", "Enrollment", "Access", "Progress tracking"],
    commonUseCase: "Online academies, certification bodies, corporate training",
    borderClass: "card-border-document",
    howItWorks:
      "This workflow automates the entire student lifecycle for educational platforms. From initial interest and enrollment to providing access to learning materials and tracking progress, it ensures a smooth educational journey.",
    scenarioExample:
      "A user DMs asking about a specific certification program. The bot provides details, answers FAQs, guides them through enrollment, processes payment, and grants access to the online course platform.",
    integrationDetails: {
      Teachable: {
        purpose: "To manage course enrollments and student access on Teachable.",
        setupInstructions:
          "In your Teachable admin, go to Settings > API. Generate a new API key. You&apos;ll also need your Teachable school URL.",
        usageInWorkflow:
          "The bot can automatically enroll students in courses and provide access links after successful registration.",
        credentialsFields: [
          { id: "apiKey", label: "Teachable API Key", type: "password" },
          { id: "additionalSettings.schoolUrl", label: "Teachable School URL", type: "text" },
        ],
      },
      Thinkific: {
        purpose: "To manage student enrollments and course access on Thinkific.",
        setupInstructions:
          "In your Thinkific admin, go to Settings > Code & Analytics > API. Generate an API key. You&apos;ll also need your Thinkific subdomain.",
        usageInWorkflow:
          "Similar to Teachable, this integration allows the bot to handle student enrollment and access provisioning for Thinkific courses.",
        credentialsFields: [
          { id: "apiKey", label: "Thinkific API Key", type: "password" },
          { id: "additionalSettings.subdomain", label: "Thinkific Subdomain", type: "text" },
        ],
      },
      Moodle: {
        purpose: "To integrate with your Moodle LMS for course management and user synchronization.",
        setupInstructions:
          "In Moodle, enable web services (Site administration > Server > Web services > External services). Create a custom service and generate a token for a specific user with appropriate permissions.",
        usageInWorkflow:
          "The bot can create new user accounts in Moodle, enroll them in courses, and potentially retrieve basic progress information.",
        credentialsFields: [
          { id: "apiKey", label: "Moodle API Token", type: "password" },
          { id: "additionalSettings.serviceUrl", label: "Moodle Web Service URL", type: "text" },
        ],
      },
      Stripe: {
        purpose: "To process payments for course fees or program subscriptions.",
        setupInstructions:
          "Log in to your Stripe Dashboard. Go to Developers > API keys. You&apos;ll need your Publishable key (pk_live_...) and Secret key (sk_live_...).",
        usageInWorkflow:
          "The bot will securely handle course fee payments, generating links for students to complete their purchase.",
        credentialsFields: [
          { id: "apiKey", label: "Stripe Publishable Key", type: "password" },
          { id: "apiSecret", label: "Stripe Secret Key", type: "password" },
        ],
      },
      Zoom: {
        purpose: "To schedule and manage live online classes, webinars, or tutoring sessions.",
        setupInstructions:
          "Log in to your Zoom App Marketplace. Create a new OAuth app or JWT app. You&apos;ll need the Client ID, Client Secret, and potentially an Account ID.",
        usageInWorkflow:
          "For programs that include live sessions, the bot can automatically create Zoom meeting links and send them to enrolled students.",
        credentialsFields: [
          { id: "apiKey", label: "Zoom Client ID", type: "password" },
          { id: "apiSecret", label: "Zoom Client Secret", type: "password" },
        ],
      },
      "Email Marketing": {
        purpose: "To add new students to your email lists for newsletters and updates.",
        setupInstructions:
          "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
        usageInWorkflow:
          "Upon enrollment, the bot can automatically add the student&apos;s email to your designated email marketing list for future communications.",
        credentialsFields: [
          { id: "apiKey", label: "Email Marketing API Key", type: "password" },
          { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "community-management",
    name: "Community Management",
    category: "GROUP_7",
    description: "For managing online communities, forums, membership sites, and social groups.",
    icon: <Globe className="h-6 w-6" />,
    features: [
      "Member onboarding",
      "Content moderation",
      "Event announcements",
      "Q&A support",
      "Engagement tracking",
      "Forum integration",
    ],
    integrations: ["Discord", "Slack", "Circle", "Mighty Networks", "Patreon", "Email Marketing", "Voiceflow"],
    operations: ["Join", "Onboarding", "Engagement", "Support"],
    commonUseCase: "Online forums, membership communities, fan clubs",
    borderClass: "card-border-communication",
    howItWorks:
      "This workflow helps manage and grow your online community. It automates member onboarding, facilitates Q&A, announces events, and can even assist with content moderation, fostering a vibrant and engaged community.",
    scenarioExample:
      "A new member DMs your community page. The bot welcomes them, provides links to community guidelines, introduces key channels, and answers initial questions, guiding them through the onboarding process.",
    integrationDetails: {
      Discord: {
        purpose: "To manage roles, send announcements, and facilitate interactions within your Discord server.",
        setupInstructions:
          "In your Discord server, go to Server Settings > Integrations > Webhooks. Create a new webhook and copy its URL.",
        usageInWorkflow:
          "The bot can send welcome messages to new members, post event announcements, or even moderate certain types of messages in your Discord channels.",
        credentialsFields: [{ id: "webhookUrl", label: "Discord Webhook URL", type: "text" }],
      },
      Slack: {
        purpose: "To manage team communications, share announcements, and provide quick support.",
        setupInstructions:
          "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
        usageInWorkflow:
          "The bot can post updates, answer common questions in channels, or direct members to relevant resources within Slack.",
        credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
      },
      Circle: {
        purpose: "To integrate with your Circle.so community platform for member management.",
        setupInstructions:
          "In your Circle community, go to Settings > Integrations > API. Generate an API token. You&apos;ll also need your community URL.",
        usageInWorkflow:
          "The bot can add new members to your Circle community, send direct messages, or post updates to specific spaces.",
        credentialsFields: [
          { id: "apiKey", label: "Circle.so API Token", type: "password" },
          { id: "additionalSettings.communityUrl", label: "Circle Community URL", type: "text" },
        ],
      },
      "Mighty Networks": {
        purpose: "To manage members and content within your Mighty Networks community.",
        setupInstructions:
          "Mighty Networks typically uses webhooks for integrations. You&apos;ll need to configure webhooks in your Mighty Networks settings to send data to your application.",
        usageInWorkflow:
          "The bot can welcome new members, share links to courses or content within Mighty Networks, and respond to common queries about the platform.",
        credentialsFields: [{ id: "webhookUrl", label: "Mighty Networks Webhook URL", type: "text", optional: true }],
      },
      Patreon: {
        purpose: "To verify patron status and provide exclusive access or content.",
        setupInstructions:
          "In your Patreon Creator account, go to My Profile > My Apps. Create a new client to get your Client ID and Client Secret. You&apos;ll need to set up OAuth 2.0 redirect URIs.",
        usageInWorkflow:
          "The bot can check a user&apos;s Patreon pledge level and grant access to exclusive content or channels based on their tier.",
        credentialsFields: [
          { id: "apiKey", label: "Patreon Client ID", type: "password" },
          { id: "apiSecret", label: "Patreon Client Secret", type: "password" },
        ],
      },
      "Email Marketing": {
        purpose: "To send community newsletters, event invitations, and important updates.",
        setupInstructions:
          "This depends on your email marketing platform (e.g., Mailchimp, ConvertKit). You&apos;ll typically need an API key and list ID from your platform&apos;s settings.",
        usageInWorkflow:
          "The bot can add new community members to your email list for regular updates and event announcements.",
        credentialsFields: [
          { id: "apiKey", label: "Email Marketing API Key", type: "password" },
          { id: "additionalSettings.listId", label: "Audience/List ID", type: "text" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  {
    id: "customer-support-advanced",
    name: "Customer Support (Advanced)",
    category: "GROUP_8",
    description: "For businesses requiring complex ticketing, troubleshooting, and knowledge base integration.",
    icon: <LifeBuoy className="h-6 w-6" />,
    features: [
      "Ticket creation",
      "Issue diagnosis",
      "Knowledge base lookup",
      "Escalation to human agent",
      "Feedback collection",
      "CRM integration",
    ],
    integrations: ["Zendesk", "Freshdesk", "Salesforce Service Cloud", "Intercom", "Slack", "Email", "Voiceflow"],
    operations: ["Inquiry", "Diagnosis", "Resolution", "Escalation", "Feedback"],
    commonUseCase: "Software companies, tech support, complex service providers",
    borderClass: "card-border-integration",
    howItWorks:
      "This advanced support workflow handles complex customer inquiries, diagnoses issues, provides solutions from a knowledge base, and seamlessly escalates to human agents when needed. It ensures efficient and effective customer service.",
    scenarioExample:
      "A customer DMs with a technical issue. The bot asks diagnostic questions, searches the knowledge base for solutions, and if unable to resolve, creates a support ticket in Zendesk and notifies a human agent.",
    integrationDetails: {
      Zendesk: {
        purpose: "To create, update, and manage support tickets.",
        setupInstructions:
          "In Zendesk, go to Admin > Channels > API > Token Access. Enable token access and create a new API token. You&apos;ll also need your Zendesk subdomain and email.",
        usageInWorkflow:
          "When a customer&apos;s issue requires human intervention, the bot will automatically create a new ticket in Zendesk, pre-filling it with conversation history and customer details.",
        credentialsFields: [
          { id: "apiKey", label: "Zendesk API Token", type: "password" },
          { id: "additionalSettings.subdomain", label: "Zendesk Subdomain", type: "text" },
          { id: "additionalSettings.email", label: "Zendesk Email", type: "email" },
        ],
      },
      Freshdesk: {
        purpose: "To create and manage support tickets in Freshdesk.",
        setupInstructions:
          "In Freshdesk, go to Admin > API Keys. Copy your API key. You&apos;ll also need your Freshdesk domain.",
        usageInWorkflow:
          "Similar to Zendesk, the bot can create new support tickets in Freshdesk, ensuring no customer inquiry falls through the cracks.",
        credentialsFields: [
          { id: "apiKey", label: "Freshdesk API Key", type: "password" },
          { id: "additionalSettings.domain", label: "Freshdesk Domain", type: "text" },
        ],
      },
      "Salesforce Service Cloud": {
        purpose: "To manage cases, contacts, and service interactions within Salesforce.",
        setupInstructions:
          "In Salesforce, create a Connected App (Setup > App Manager > New Connected App). Obtain Consumer Key (Client ID) and Consumer Secret (Client Secret). Configure OAuth scopes for Service Cloud.",
        usageInWorkflow:
          "The bot can create new cases in Salesforce Service Cloud, update existing ones, and log all customer interactions directly to the case record.",
        credentialsFields: [
          { id: "apiKey", label: "Salesforce Consumer Key", type: "password" },
          { id: "apiSecret", label: "Salesforce Consumer Secret", type: "password" },
        ],
      },
      Intercom: {
        purpose: "To manage customer conversations and provide in-app support.",
        setupInstructions:
          "In Intercom, go to Settings > Developers > Access Tokens. Generate a new access token with appropriate permissions (e.g., 'read_conversations', 'write_conversations').",
        usageInWorkflow:
          "The bot can respond to customer queries directly within Intercom, and if escalation is needed, it can assign the conversation to a human agent.",
        credentialsFields: [{ id: "apiKey", label: "Intercom Access Token", type: "password" }],
      },
      Slack: {
        purpose: "To notify support teams about urgent tickets or customer escalations.",
        setupInstructions:
          "In your Slack workspace, go to 'Incoming Webhooks' and create a new webhook. Copy the generated Webhook URL.",
        usageInWorkflow:
          "When a customer requests human assistance or an urgent issue is detected, the bot will send a real-time alert to your support team&apos;s Slack channel.",
        credentialsFields: [{ id: "webhookUrl", label: "Slack Webhook URL", type: "text" }],
      },
      Email: {
        purpose: "To send automated email responses, confirmations, or follow-ups.",
        setupInstructions:
          "This typically involves an email sending service like SendGrid, Mailgun, or AWS SES. You&apos;ll need an API key and sender email configuration from your chosen service.",
        usageInWorkflow:
          "The bot can send automated email confirmations for ticket creation, provide knowledge base articles via email, or send follow-up surveys.",
        credentialsFields: [{ id: "apiKey", label: "Email Service API Key", type: "password" }],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  // NEW: Google Sheets Integration Workflow
  {
    id: "google-sheets-integration",
    name: "Google Sheets Integration",
    category: "GROUP_9", // New category
    description: "A simple workflow to demonstrate integration with Google Sheets for data logging or retrieval.",
    icon: <FileText className="h-6 w-6" />,
    features: ["Data logging", "Data retrieval", "Simple record keeping"],
    integrations: ["Google Sheets", "Voiceflow"],
    operations: ["Receive data", "Log to sheet", "Retrieve from sheet"],
    commonUseCase: "Simple lead capture, inventory tracking, basic data management",
    borderClass: "card-border-data-processing", // Reusing an existing border class
    howItWorks:
      "This workflow allows your bot to interact directly with a Google Sheet. It can be configured to append new rows of data (e.g., lead information, order details) or retrieve specific data points from your sheet based on user queries.",
    scenarioExample:
      "A user DMs asking to log a new lead. The bot collects the lead's name and email, then uses the Google Sheets integration to add this information as a new row in your specified spreadsheet.",
    integrationDetails: {
      "Google Sheets": {
        purpose: "To read from and write data to a Google Sheet.",
        setupInstructions:
          "Go to Google Cloud Console, enable the Google Sheets API, and create a Service Account. Download the JSON key file. You'll need the 'client_email' and 'private_key' from this file. Share your Google Sheet with the service account's email address.",
        usageInWorkflow:
          "The bot will use the provided credentials to append new rows to your sheet or fetch data from specific cells/ranges based on the conversation flow.",
        credentialsFields: [
          { id: "apiKey", label: "Service Account Client Email", type: "email" }, // Using apiKey for client_email
          { id: "apiSecret", label: "Service Account Private Key", type: "password" }, // Using apiSecret for private_key
          { id: "additionalSettings.spreadsheetId", label: "Google Sheet ID", type: "text" },
          { id: "additionalSettings.sheetName", label: "Sheet Name (e.g., Sheet1)", type: "text" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
  // NEW: Google Sheets Only Workflow
  {
    id: "google-sheets-only",
    name: "Google Sheets Only Workflow",
    category: "GROUP_10", // New category for simple Google Sheets
    description: "A minimal workflow focused solely on logging data to Google Sheets.",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    features: ["Data logging to Google Sheets", "Simple record keeping"],
    integrations: ["Google Sheets", "Voiceflow"],
    operations: ["Receive data", "Log to sheet"],
    commonUseCase: "Quick data capture, simple lead forms, attendance tracking",
    borderClass: "card-border-data-processing",
    howItWorks:
      "This streamlined workflow is designed for direct data entry into a Google Sheet. It collects specific pieces of information from the user and immediately appends them as a new row in your designated Google Sheet, making it perfect for simple data collection tasks.",
    scenarioExample:
      "A user DMs to sign up for a newsletter. The bot asks for their name and email, then logs this directly into a Google Sheet for your marketing team.",
    integrationDetails: {
      "Google Sheets": {
        purpose: "To append new rows of data to a Google Sheet.",
        setupInstructions:
          "Go to Google Cloud Console, enable the Google Sheets API, and create a Service Account. Download the JSON key file. You'll need the 'client_email' and 'private_key' from this file. Share your Google Sheet with the service account's email address.",
        usageInWorkflow:
          "The bot will use the provided credentials to append new rows to your sheet based on the conversation flow.",
        credentialsFields: [
          { id: "apiKey", label: "Service Account Client Email", type: "email" },
          { id: "apiSecret", label: "Service Account Private Key", type: "password" },
          { id: "additionalSettings.spreadsheetId", label: "Google Sheet ID", type: "text" },
          { id: "additionalSettings.sheetName", label: "Sheet Name (e.g., Sheet1)", type: "text" },
        ],
      },
      Voiceflow: {
        purpose: "To power the conversational AI logic for the workflow.",
        setupInstructions:
          "Log in to your Voiceflow account. Find your API Key under 'Workspace Settings' -> 'API Keys'. Get your Project ID and Version ID from your specific Voiceflow project settings.",
        usageInWorkflow:
          "The bot will use Voiceflow to understand user queries, manage conversation flow, and generate responses based on the configured workflow.",
        credentialsFields: [
          { id: "apiKey", label: "Voiceflow API Key", type: "password" },
          { id: "projectId", label: "Voiceflow Project ID", type: "text" },
          { id: "versionId", label: "Voiceflow Version ID", type: "text", optional: true },
        ],
      },
    },
  },
]

interface IntegrationConfig {
  name: string
  apiKey?: string
  apiSecret?: string
  webhookUrl?: string
  projectId?: string
  versionId?: string
  additionalSettings?: Record<string, string>
}

interface BusinessWorkflowConfig {
  id: string
  userId: string
  businessId: string
  workflowTemplateId: string | null
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  integrations: { name: string; config: IntegrationConfig }[]
  customRequest?: string
  status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  workflowTemplate?: {
    id: string
    name: string
    category: string
    description: string
  }
  credentials: {
    id: string
    integrationName: string
    integrationType: string
    encryptedCredentials: string
    isActive: boolean
    lastVerified: Date | null
  }[]
}

interface IntegrationTestResult {
  isTesting: boolean
  result: "success" | "failure" | null
  message: string | null
}

export default function WorkflowSelector() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
  // FIX: Updated step type to include "dashboard"
  const [step, setStep] = useState<
    "selection" | "configuration" | "integrations" | "review" | "customization" | "dashboard"
  >("selection")
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    phone: "",
    email: "",
  })
  const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [customRequest, setCustomRequest] = useState("")
  const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
  const [modifyingWorkflowId, setModifyingWorkflowId] = useState<string | null>(null)
  const [integrationTestResults, setIntegrationTestResults] = useState<Record<string, IntegrationTestResult>>({})

  // NEW STATES FOR ACTIVE WORKFLOW
  const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
  const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
  const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

  // In a real app, you'd get the current user's businessId from context/auth
  // For this demo, let's assume a placeholder business ID.
  // This needs to be replaced with actual user-specific business ID from a backend context
  const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8" // Example placeholder. MUST BE REPLACED.

  // Effect to fetch active workflow on component mount
  useEffect(() => {
    const fetchActiveWorkflow = async () => {
      setIsFetchingActiveWorkflow(true)
      try {
        if (!currentBusinessId) {
          console.warn("No business ID available to fetch active workflow.")
          setIsFetchingActiveWorkflow(false)
          return
        }

        const response = await fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`)
        if (response.ok) {
          const data = await response.json()
          if (data.workflowConfigs && data.workflowConfigs.length > 0) {
            const activeConfig = data.workflowConfigs[0] // Assuming only one active workflow per business
            setActiveWorkflowExists(true)
            setActiveWorkflowDetails(activeConfig)
            setStep("dashboard") // Automatically go to dashboard if active workflow found

            // Pre-populate credentials if re-loading an active workflow
            const loadedIntegrationConfigs: Record<string, IntegrationConfig> = {}
            const loadedSelectedIntegrations: string[] = []
            activeConfig.credentials.forEach((cred: any) => {
              try {
                const parsedConfig = JSON.parse(cred.encryptedCredentials)
                loadedIntegrationConfigs[cred.integrationName] = {
                  name: cred.integrationName,
                  ...parsedConfig,
                }
                loadedSelectedIntegrations.push(cred.integrationName)
              } catch (e) {
                console.error("Failed to parse credentials for", cred.integrationName, e)
              }
            })
            setIntegrationConfigs(loadedIntegrationConfigs)
            setSelectedIntegrations(loadedSelectedIntegrations)
          } else {
            setActiveWorkflowExists(false)
            setActiveWorkflowDetails(null)
          }
        } else {
          console.error("Failed to fetch active workflow configurations:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching active workflow:", error)
      } finally {
        setIsFetchingActiveWorkflow(false)
      }
    }

    fetchActiveWorkflow()
  }, [currentBusinessId])

  const handleWorkflowSelect = (workflow: WorkflowType) => {
    if (activeWorkflowExists) return // Prevent selection if an active workflow exists
    setSelectedWorkflow(workflow)
    // Clear any previous custom request or modification state
    setIsCustomWorkflow(false)
    setModifyingWorkflowId(null)
    setCustomRequest("")
    // Reset integration states for the new selection
    setIntegrationConfigs({})
    setSelectedIntegrations([])
    setIntegrationTestResults({})
    setStep("configuration")
  }

  const handleRequestModifiedVersion = (workflow: WorkflowType) => {
    setSelectedWorkflow(workflow)
    setIsCustomWorkflow(true)
    setModifyingWorkflowId(workflow.id)
    setCustomRequest(
      `I&apos;d like to request a modified version of the "${workflow.name}" workflow. Please specify the changes you&apos;d like to make (e.g., add/remove integrations, modify process steps, adjust features):`,
    )
    setStep("customization") // Correctly set the step to customization
  }

  const handleBusinessInfoSubmit = () => {
    setStep("integrations")
  }

  const handleIntegrationToggle = (integration: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
    )
    setIntegrationTestResults((prev) => ({
      ...prev,
      [integration]: { isTesting: false, result: null, message: null },
    }))
  }

  const handleIntegrationConfig = (integration: string, fieldId: string, value: string) => {
    setIntegrationConfigs((prev) => {
      const currentConfig = prev[integration] || { name: integration }
      const updatedConfig = { ...currentConfig }

      if (fieldId.includes(".")) {
        const [mainField, subField] = fieldId.split(".")
        if (!(updatedConfig as any)[mainField]) {
          ;(updatedConfig as any)[mainField] = {}
        }
        ;(updatedConfig as any)[mainField][subField] = value
      } else {
        ;(updatedConfig as any)[fieldId] = value
      }

      return {
        ...prev,
        [integration]: updatedConfig,
      }
    })

    setIntegrationTestResults((prev) => ({
      ...prev,
      [integration]: { isTesting: false, result: null, message: null },
    }))
  }

  const handleTestIntegration = async (integrationName: string) => {
    const config = integrationConfigs[integrationName]
    const details = selectedWorkflow?.integrationDetails[integrationName]
    const hasRequiredFields = details?.credentialsFields?.every(
      (field) =>
        field.optional ||
        (field.id.includes(".")
          ? (config as any)?.[field.id.split(".")[0]]?.[field.id.split(".")[1]]
          : (config as any)?.[field.id]),
    )

    if (!hasRequiredFields) {
      setIntegrationTestResults((prev) => ({
        ...prev,
        [integrationName]: { isTesting: false, result: "failure", message: "Missing required credentials for test." },
      }))
      return
    }

    setIntegrationTestResults((prev) => ({
      ...prev,
      [integrationName]: { isTesting: true, result: null, message: "Testing..." },
    }))

    try {
      const response = await fetch("/api/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrationType: integrationName.toLowerCase().replace(/\s/g, ""),
          credentials: config,
        }),
      })
      const result = await response.json()

      if (result.success) {
        setIntegrationTestResults((prev) => ({
          ...prev,
          [integrationName]: { isTesting: false, result: "success", message: result.message },
        }))
      } else {
        setIntegrationTestResults((prev) => ({
          ...prev,
          [integrationName]: { isTesting: false, result: "failure", message: result.message || "Test failed." },
        }))
      }
    } catch (error) {
      console.error("Error testing integration:", error)
      setIntegrationTestResults((prev) => ({
        ...prev,
        [integrationName]: { isTesting: false, result: "failure", message: "Network error or server issue." },
      }))
    }
  }

  // NEW: Function to check if all selected integrations have been tested successfully
  const areAllSelectedIntegrationsTestedSuccessfully = () => {
    if (selectedIntegrations.length === 0) return true

    for (const integration of selectedIntegrations) {
      const testResult = integrationTestResults[integration]
      const details = selectedWorkflow?.integrationDetails[integration]

      // Only require testing if the integration has defined credential fields
      if (details?.credentialsFields && details.credentialsFields.length > 0) {
        // Also ensure all *required* fields for this integration actually have a value
        const config = integrationConfigs[integration] || {}
        const hasAllRequiredFields = details.credentialsFields.every(
          (field) =>
            field.optional ||
            (field.id.includes(".")
              ? (config as any)[field.id.split(".")[0]]?.[field.id.split(".")[1]]
              : (config as any)[field.id]),
        )

        // If it has required fields, it must be successfully tested
        if (!hasAllRequiredFields || !testResult || testResult.result !== "success") {
          return false
        }
      }
    }
    return true
  }

  const handleFinalSubmit = async () => {
    const businessIdToUse = currentBusinessId

    if (!businessIdToUse) {
      alert("Error: Business ID is missing. Cannot deploy workflow.")
      return
    }

    const integrationsToSubmit = selectedIntegrations.map((name) => ({
      name,
      config: integrationConfigs[name] || { name },
    }))

    const workflowData = {
      workflowTemplateId: selectedWorkflow?.id || null,
      businessId: businessIdToUse,
      businessInfo,
      integrations: integrationsToSubmit,
      customRequest: isCustomWorkflow ? customRequest : undefined,
      isActive: !isCustomWorkflow, // Templates are active immediately, custom requests are not
    }

    console.log("Submitting workflow configuration:", workflowData)

    try {
      const response = await fetch("/api/workflow-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      })
      const result = await response.json()
      if (result.success) {
        alert(isCustomWorkflow ? "Custom workflow request submitted successfully!" : "Workflow deployed successfully!")
        setActiveWorkflowExists(true)
        setActiveWorkflowDetails(result.workflowConfig)
        setStep("dashboard") // Transition to the new dashboard step
      } else {
        alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting workflow configuration:", error)
      alert("An unexpected error occurred during submission.")
    }
  }

  const handleDeactivateWorkflow = async () => {
    if (!activeWorkflowDetails?.id) {
      alert("No active workflow to deactivate.")
      return
    }

    setShowDeactivateConfirm(true) // Show confirmation dialog
  }

  const confirmDeactivate = async () => {
    setShowDeactivateConfirm(false) // Close dialog
    setIsDeactivating(true)
    try {
      const response = await fetch("/api/workflow-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeWorkflowDetails?.id,
          isActive: false,
          status: "INACTIVE",
        }),
      })

      if (response.ok) {
        alert("Workflow deactivated successfully!")
        setActiveWorkflowExists(false)
        setActiveWorkflowDetails(null)
        setStep("selection")
        setSelectedWorkflow(null)
        setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
        setIntegrationConfigs({})
        setSelectedIntegrations([])
        setCustomRequest("")
        setIsCustomWorkflow(false)
        setModifyingWorkflowId(null)
        setIntegrationTestResults({})
      } else {
        const errorData = await response.json()
        alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deactivating workflow:", error)
      alert("An unexpected error occurred during deactivation.")
    } finally {
      setIsDeactivating(false)
    }
  }

  // --- Conditional Rendering based on Step ---

  if (isFetchingActiveWorkflow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
      </div>
    )
  }

  // NEW: Render the dashboard if an active workflow exists
  if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
    return (
      <>
        <WorkflowDashboard
          workflowDetails={activeWorkflowDetails}
          onDeactivate={handleDeactivateWorkflow}
          isDeactivating={isDeactivating}
        />
        <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-6 w-6" />
                Confirm Deactivation
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate your current workflow? This will stop all automated responses and
                you will need to set up a new one to resume automation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
                Deactivate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // If an active workflow exists and we are not on the dashboard, redirect to dashboard
  if (activeWorkflowExists && activeWorkflowDetails && step !== "dashboard") {
    // This handles cases where a user might try to navigate back to selection/config
    // while an active workflow is present.
    setStep("dashboard")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg text-muted-foreground">Redirecting to your active workflow dashboard...</span>
      </div>
    )
  }

  if (step === "selection") {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Choose Your Business Workflow
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Select the workflow type that best matches your business model for automated social media responses
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
              {workflowTypes.map((workflow, index) => (
                <Card
                  key={workflow.id}
                  className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => !activeWorkflowExists && handleWorkflowSelect(workflow)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
                        <div className="flex gap-2 flex-wrap"></div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
                      <div className="space-y-2">
                        {workflow.operations.map((operation, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-muted-foreground">{operation}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
                      <ul className="space-y-2">
                        {workflow.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                        {workflow.features.length > 3 && (
                          <li className="text-xs text-muted-foreground ml-6">
                            +{workflow.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleWorkflowSelect(workflow)}
                        className="flex-1"
                        disabled={activeWorkflowExists}
                      >
                        Select Workflow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col items-center justify-center text-center p-6 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (!activeWorkflowExists) {
                    setIsCustomWorkflow(true)
                    setSelectedWorkflow(null)
                    setModifyingWorkflowId(null)
                    setCustomRequest("")
                    setStep("customization")
                  }
                }}
              >
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl mb-2">Request a Custom Workflow</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Can&apos;t find what you need? Describe your unique requirements, and we&apos;ll build it for you.
                </CardDescription>
                <Button variant="outline" className="mt-4 bg-transparent" disabled={activeWorkflowExists}>
                  Get Started
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "configuration" && selectedWorkflow) {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Configure Your {selectedWorkflow.name} Workflow
                </h1>
                <p className="text-muted-foreground text-lg">
                  Provide your business information to customize the workflow
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    This information will be used to personalize your automated responses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-medium">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Your Business Name"
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-sm font-medium">
                      Business Type *
                    </Label>
                    <Input
                      id="businessType"
                      value={businessInfo.businessType}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
                      placeholder="e.g., Hair Salon, Photography Studio"
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Business Description
                    </Label>
                    <Textarea
                      id="description"
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your services..."
                      rows={3}
                      className="bg-background/50 border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@yourbusiness.com"
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedWorkflow.icon}
                      Workflow Overview
                    </CardTitle>
                    <CardDescription>
                      Here&apos;s what your {selectedWorkflow.name} workflow will include
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Process Flow:
                        </h4>
                        <div className="space-y-3">
                          {selectedWorkflow.operations.map((operation, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                                {idx + 1}
                              </div>
                              <span className="text-sm font-medium">{operation}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
                        <ul className="space-y-3">
                          {selectedWorkflow.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorkflow.integrations.map((integration, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glassEffect border-2 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      How This Workflow Works
                    </CardTitle>
                    <CardDescription>Understand the flow and see a real-world example.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-primary">Explanation:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedWorkflow.howItWorks}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-primary">Scenario Example:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedWorkflow.scenarioExample}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleRequestModifiedVersion(selectedWorkflow)}
                    className="flex-1 bg-transparent hover:bg-accent"
                  >
                    Request Modified Version
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleBusinessInfoSubmit}
                disabled={!businessInfo.businessName || !businessInfo.businessType}
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                Continue to Integrations
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "customization" && (selectedWorkflow || isCustomWorkflow)) {
    const customizationTitle = modifyingWorkflowId
      ? `Modify Your ${selectedWorkflow?.name} Workflow`
      : "Request a Custom Workflow"
    const customizationDescription = modifyingWorkflowId
      ? "Tell us how you&apos;d like to adapt this existing workflow."
      : "Tell us what you need, and we&apos;ll create a tailored solution for your business."
    const textareaPlaceholder = modifyingWorkflowId
      ? `Describe the specific changes you&apos;d like for the ${selectedWorkflow?.name} workflow. E.g., "Remove Google Calendar, add HubSpot CRM, and simplify the booking confirmation step."`
      : "Describe the specific operations, features, and integrations you need. E.g., &apos;I need a workflow that handles customer support tickets, integrates with Zendesk, and can escalate to a human agent if keywords like &apos;urgent&apos; are detected.&apos;"

    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-3xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {customizationTitle}
                </h1>
                <p className="text-muted-foreground text-lg">{customizationDescription}</p>
              </div>
            </div>

            <Card className="glassEffect border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Custom Workflow Details
                </CardTitle>
                <CardDescription>
                  Please provide as much detail as possible for our team to understand your needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customRequest" className="text-sm font-medium">
                    Describe your custom workflow or modifications *
                  </Label>
                  <Textarea
                    id="customRequest"
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder={textareaPlaceholder}
                    rows={8}
                    className="bg-background/50 border-border/50 focus:border-primary resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessNameCustom" className="text-sm font-medium">
                    Business Name *
                  </Label>
                  <Input
                    id="businessNameCustom"
                    value={businessInfo.businessName}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Business Name"
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessTypeCustom" className="text-sm font-medium">
                    Business Type *
                  </Label>
                  <Input
                    id="businessTypeCustom"
                    value={businessInfo.businessType}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
                    placeholder="e.g., Hair Salon, Photography Studio"
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="mt-10 flex justify-between">
              <Button variant="outline" onClick={() => setStep("selection")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                disabled={!customRequest || !businessInfo.businessName || !businessInfo.businessType}
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                Submit Custom Request
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "integrations" && selectedWorkflow) {
    const isReadyForReview = areAllSelectedIntegrationsTestedSuccessfully() && selectedIntegrations.length > 0

    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Setup Integrations
                </h1>
                <p className="text-muted-foreground text-lg">
                  Configure the integrations needed for your {selectedWorkflow.name} workflow
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {selectedWorkflow.integrations.map((integration, index) => {
                const testResult = integrationTestResults[integration]
                const details = selectedWorkflow.integrationDetails[integration]
                const hasCredentialsFields = details?.credentialsFields && details.credentialsFields.length > 0

                return (
                  <Card
                    key={integration}
                    className={`glassEffect border-2 transition-all duration-300 ${
                      selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration}</CardTitle>
                            <CardDescription>
                              {details?.purpose || `Configure your ${integration} integration`}
                            </CardDescription>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedIntegrations.includes(integration)}
                          onCheckedChange={() => handleIntegrationToggle(integration)}
                          className="scale-125"
                        />
                      </div>
                    </CardHeader>

                    {selectedIntegrations.includes(integration) && (
                      <CardContent className="space-y-4 border-t border-border/20 pt-6">
                        {details?.setupInstructions && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-primary">How to get credentials:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{details.setupInstructions}</p>
                          </div>
                        )}
                        {details?.usageInWorkflow && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-primary">How we&apos;ll use it:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{details.usageInWorkflow}</p>
                          </div>
                        )}

                        {hasCredentialsFields &&
                          details.credentialsFields?.map((field) => {
                            const fieldValue = field.id.includes(".")
                              ? (integrationConfigs[integration] as any)?.[field.id.split(".")[0]]?.[
                                  field.id.split(".")[1]
                                ] || ""
                              : (integrationConfigs[integration] as any)?.[field.id] || ""
                            return (
                              <div className="space-y-2" key={field.id}>
                                <Label htmlFor={`${integration}-${field.id}`} className="text-sm font-medium">
                                  {field.label} {field.optional ? "(Optional)" : "*"}
                                </Label>
                                <Input
                                  id={`${integration}-${field.id}`}
                                  type={field.type}
                                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                                  onChange={(e) => handleIntegrationConfig(integration, field.id, e.target.value)}
                                  className="bg-background/50 border-border/50 focus:border-primary"
                                  value={fieldValue}
                                />
                              </div>
                            )
                          })}

                        {hasCredentialsFields && ( // Only show test button if there are credentials to test
                          <div className="flex items-center gap-3 pt-2">
                            <Button
                              variant="outline"
                              onClick={() => handleTestIntegration(integration)}
                              disabled={testResult?.isTesting}
                              className="flex items-center gap-2"
                            >
                              {testResult?.isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
                              Test Credentials
                            </Button>
                            {testResult?.result === "success" && (
                              <span className="text-green-500 flex items-center gap-1 text-sm">
                                <CheckCircle className="h-4 w-4" />
                                {testResult.message}
                              </span>
                            )}
                            {testResult?.result === "failure" && (
                              <span className="text-red-500 flex items-center gap-1 text-sm">
                                <XCircle className="h-4 w-4" />
                                {testResult.message}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>

            <div className="mt-10 flex justify-between">
              <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep("review")} size="lg" className="px-8" disabled={!isReadyForReview}>
                Review Configuration
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "review") {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
                className="mb-6 hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Review &amp; Deploy
                </h1>
                <p className="text-muted-foreground text-lg">
                  Review your configuration before deploying your workflow
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 mb-10">
              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Workflow Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">
                      {isCustomWorkflow
                        ? modifyingWorkflowId
                          ? `Modified Version of ${selectedWorkflow?.name}`
                          : "Custom Workflow Request"
                        : selectedWorkflow?.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Business Name:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Business Type:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
                  </div>
                  {!isCustomWorkflow && selectedWorkflow && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
                      <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        N/A (Customizable)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {isCustomWorkflow ? (
                <Card className="glassEffect border-2 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Custom Request Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-primary">Your Description:</Label>
                      <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">{customRequest}</p>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      Our team will review your request and contact you to discuss the custom workflow.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glassEffect border-2 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Configured Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedIntegrations.length > 0 ? (
                      <div className="space-y-3">
                        {selectedIntegrations.map((integration) => (
                          <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{integration}</span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              Configured
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No integrations configured</p>
                        <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="glassEffect border-2 border-primary/30 mb-10">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  What happens next?
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {isCustomWorkflow ? (
                    <>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Our team will review your custom workflow request.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        We will contact you within 1-2 business days to discuss details and next steps.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Once finalized, your custom Voiceflow workflow will be built and deployed.
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Your Voiceflow workflow will be automatically configured.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Integration connections will be tested and verified.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Your automation will be activated for social media DMs.
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(isCustomWorkflow ? "customization" : "integrations")}
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isCustomWorkflow ? "Submit Custom Request" : "Deploy Workflow 🚀"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
