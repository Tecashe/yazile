
// import React, { useState, useCallback } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { 
//   ArrowLeft, 
//   Sparkles, 
//   Loader2, 
//   CheckCircle, 
//   XCircle, 
//   Send, 
//   Clock, 
//   Settings, 
//   Target, 
//   ThumbsUp, 
//   Bot, 
//   Mic, 
//   Phone, 
//   MessageCircle,
//   RefreshCw,
//   Users,
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle
// } from 'lucide-react';

// // TypeScript interfaces
// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: {
//     businessName: string;
//     businessType: string;
//     description?: string;
//     website?: string;
//     phone?: string;
//     email?: string;
//   };
//   selectedWorkflowId?: string | null;
//   setStep?: (step: "selection" | "dashboard") => void;
//   setActiveWorkflowExists?: (exists: boolean) => void;
//   setActiveWorkflowDetails?: (details: any) => void;
// }

// interface WorkflowStep {
//   stepNumber: number;
//   title: string;
//   description: string;
//   type: string;
//   inputs?: string[];
//   outputs?: string[];
//   conditions?: string[];
//   integrations?: string[];
// }

// interface Integration {
//   name: string;
//   type: string;
//   description: string;
//   required: boolean;
//   setupInstructions: string;
// }

// interface ParsedWorkflow {
//   title: string;
//   description: string;
//   platform: string;
//   estimatedBuildTime: string;
//   complexity: string;
//   steps: WorkflowStep[];
//   integrations: Integration[];
//   benefits: string[];
//   exampleScenario: string;
//   technicalRequirements: string[];
//   deploymentChannels: string[];
// }

// interface ChannelOption {
//   id: string;
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// interface AutomationFeature {
//   id: string;
//   label: string;
// }

// // Mock business info for demo
// const mockBusinessInfo = {
//   businessName: "TechCorp Solutions",
//   businessType: "Technology Company",
//   description: "We provide innovative tech solutions for businesses",
//   website: "https://techcorp.com",
//   phone: "+1-555-0123",
//   email: "contact@techcorp.com"
// };

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = mockBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("");
//   const [aiRawResponse, setAiRawResponse] = useState<string>("");
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null);
//   const [refinementInput, setRefinementInput] = useState<string>("");
//   const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
//   const [responseStatus, setResponseStatus] = useState<string | null>(null);
//   const [requestId, setRequestId] = useState<string | null>(null);
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial");
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false);
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"]);
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"]);
//   const [showRawResponse, setShowRawResponse] = useState<boolean>(false);

//   const n8nWebhookUrl = "/api/n8n-proxy"; // Use Next.js API proxy to avoid CORS issues

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic }
//   ];

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" }
//   ];

//   // Function to parse AI markdown response into structured workflow
//   const parseAIResponse = (markdownText: string): ParsedWorkflow | null => {
//     try {
//       if (!markdownText || markdownText.trim().length === 0) {
//         return null;
//       }

//       const lines = markdownText.split('\n');
//       let workflow: Partial<ParsedWorkflow> = {
//         steps: [],
//         integrations: [],
//         benefits: [],
//         technicalRequirements: [],
//         deploymentChannels: selectedChannels
//       };

//       let currentSection = '';
//       let stepCounter = 1;

//       for (let i = 0; i < lines.length; i++) {
//         const line = lines[i].trim();
        
//         if (line.startsWith('# ')) {
//           workflow.title = line.substring(2).trim();
//         } else if (line.startsWith('## ')) {
//           currentSection = line.substring(3).toLowerCase().trim();
//         } else if (line.includes('**Description:**')) {
//           workflow.description = line.replace(/.*\*\*Description:\*\*\s*/, '').trim();
//         } else if (line.includes('**Platform:**')) {
//           workflow.platform = line.replace(/.*\*\*Platform:\*\*\s*/, '').trim();
//         } else if (line.includes('**Estimated Build Time:**')) {
//           workflow.estimatedBuildTime = line.replace(/.*\*\*Estimated Build Time:\*\*\s*/, '').trim();
//         } else if (line.includes('**Complexity:**')) {
//           workflow.complexity = line.replace(/.*\*\*Complexity:\*\*\s*/, '').trim();
//         } else if (currentSection.includes('workflow') || currentSection.includes('steps') || currentSection.includes('process')) {
//           if (line.match(/^\d+\./)) {
//             const stepText = line.replace(/^\d+\.\s*/, '');
//             const [title, ...descParts] = stepText.split(':');
//             workflow.steps?.push({
//               stepNumber: stepCounter++,
//               title: title.trim(),
//               description: descParts.join(':').trim() || title.trim(),
//               type: "automation",
//               inputs: [],
//               outputs: []
//             });
//           }
//         } else if (currentSection.includes('integration')) {
//           if (line.startsWith('- ') || line.startsWith('* ')) {
//             const integrationText = line.substring(2);
//             const [name, ...descParts] = integrationText.split(':');
//             workflow.integrations?.push({
//               name: name.trim(),
//               type: "api",
//               description: descParts.join(':').trim() || "Integration required for workflow",
//               required: true,
//               setupInstructions: "Configuration required during implementation"
//             });
//           }
//         } else if (currentSection.includes('benefit')) {
//           if (line.startsWith('- ') || line.startsWith('* ')) {
//             workflow.benefits?.push(line.substring(2).trim());
//           }
//         } else if (currentSection.includes('scenario') || currentSection.includes('example')) {
//           if (line.length > 0 && !line.startsWith('#') && !line.startsWith('*')) {
//             workflow.exampleScenario = (workflow.exampleScenario || '') + line + ' ';
//           }
//         } else if (currentSection.includes('technical') || currentSection.includes('requirement')) {
//           if (line.startsWith('- ') || line.startsWith('* ')) {
//             workflow.technicalRequirements?.push(line.substring(2).trim());
//           }
//         }
//       }

//       // Set defaults if not found
//       workflow.title = workflow.title || "AI-Generated Social Media Automation";
//       workflow.description = workflow.description || "Custom automation workflow for social media platforms";
//       workflow.platform = workflow.platform || "Multi-Platform";
//       workflow.estimatedBuildTime = workflow.estimatedBuildTime || "2-3 weeks";
//       workflow.complexity = workflow.complexity || "Medium";
//       workflow.exampleScenario = workflow.exampleScenario?.trim() || "Automated customer interaction workflow";

//       return workflow as ParsedWorkflow;
//     } catch (error) {
//       console.error("Error parsing AI response:", error);
//       return null;
//     }
//   };

//   const generateWorkflow = useCallback(async (
//     action: "initial" | "refine", 
//     instructions?: string, 
//     currentDesign?: string
//   ): Promise<void> => {
//     setIsLoadingAI(true);
//     setResponseStatus("🤖 AI is designing your social media automation workflow...");
//     setCurrentAction(action);
//     setHasInitialRequest(true);

//     try {
//       const payload = {
//         action: action,
//         platform: "social-media-automation",
//         userEmail: businessInfo.email || "no-email@example.com",
//         businessName: businessInfo.businessName,
//         businessType: businessInfo.businessType,
//         businessDescription: businessInfo.description,
//         website: businessInfo.website,
//         phone: businessInfo.phone,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         workflowRequest: workflowRequest,
//         initialPrompt: action === "initial" ? workflowRequest : 
//           `Previous request: ${workflowRequest}. Refinement: ${instructions || ""}`,
//         ...(requestId && { requestId }),
//         ...(instructions && { refinementInstructions: instructions }),
//         ...(currentDesign && { currentWorkflowDesign: currentDesign })
//       };

//       console.log("🚀 Sending request to N8N:", payload);

//       const response = await fetch(n8nWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       console.log("📡 N8N Response status:", response.status);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const result = await response.json();
//       console.log("📋 N8N Response data:", result);

//       if (result.status === "success" && result.workflowDesign) {
//         // Store the raw AI response
//         setAiRawResponse(result.workflowDesign);
        
//         // Parse the AI response into structured data
//         const parsed = parseAIResponse(result.workflowDesign);
        
//         if (parsed) {
//           setParsedWorkflow(parsed);
//           setResponseStatus("✅ Social media automation workflow generated successfully!");
//         } else {
//           setResponseStatus("⚠️ Generated workflow but had parsing issues. Check raw response.");
//         }
        
//         if (!requestId && result.requestId) {
//           setRequestId(result.requestId);
//         }
//       } else {
//         throw new Error(result.message || "AI did not return a valid workflow design");
//       }
//     } catch (error) {
//       console.error("❌ Workflow generation error:", error);
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
//       if (errorMessage.includes("fetch")) {
//         setResponseStatus("🔌 Cannot connect to N8N. Please ensure N8N is running and accessible.");
//       } else if (errorMessage.includes("HTTP 404")) {
//         setResponseStatus("📍 N8N webhook endpoint not found. Check the webhook URL configuration.");
//       } else if (errorMessage.includes("HTTP 500")) {
//         setResponseStatus("⚙️ N8N server error. Check N8N logs and configuration.");
//       } else {
//         setResponseStatus(`❌ Error: ${errorMessage}`);
//       }
//     } finally {
//       setIsLoadingAI(false);
//     }
//   }, [n8nWebhookUrl, businessInfo, selectedChannels, automationFeatures, workflowRequest, requestId]);

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your social media automation needs");
//       return;
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one social media platform");
//       return;
//     }
//     generateWorkflow("initial");
//   };

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions");
//       return;
//     }
//     generateWorkflow("refine", refinementInput, aiRawResponse);
//     setRefinementInput("");
//   };

//   const handleApprove = async (): Promise<void> => {
//     setIsLoadingAI(true);
//     setResponseStatus("📧 Sending final automation design to the development team...");
//     setCurrentAction("approve");

//     try {
//       const payload = {
//         action: "approve",
//         platform: "social-media-automation",
//         requestId: requestId,
//         userEmail: businessInfo.email || "no-email@example.com",
//         aiRawResponse: aiRawResponse,
//         parsedWorkflow: parsedWorkflow,
//         businessName: businessInfo.businessName,
//         businessType: businessInfo.businessType,
//         businessDescription: businessInfo.description,
//         website: businessInfo.website,
//         phone: businessInfo.phone,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//       };

//       console.log("📤 Sending approval to N8N:", payload);

//       const response = await fetch(n8nWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const result = await response.json();
//       console.log("✅ Approval response:", result);

//       if (result.status === "success") {
//         setResponseStatus("✅ Automation approved! Development team has been notified.");
        
//         // Update parent component state
//         if (setActiveWorkflowExists) {
//           setActiveWorkflowExists(true);
//         }
        
//         if (setActiveWorkflowDetails) {
//           setActiveWorkflowDetails({
//             id: requestId || "social-automation-" + Date.now(),
//             workflowTemplate: { name: parsedWorkflow?.title || "Social Media Automation" },
//             businessInfo: businessInfo,
//             aiResponse: aiRawResponse,
//             parsedWorkflow: parsedWorkflow,
//             status: "APPROVED_PENDING_DEVELOPMENT",
//             platform: "social-media-automation",
//             channels: selectedChannels,
//             features: automationFeatures,
//             approvedAt: new Date().toISOString(),
//           });
//         }
        
//         // Navigate after successful approval
//         setTimeout(() => {
//           if (setStep) {
//             setStep("dashboard");
//           }
//         }, 2000);
//       } else {
//         throw new Error(result.message || "Approval failed");
//       }
//     } catch (error) {
//       console.error("❌ Approval error:", error);
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
//       setResponseStatus(`❌ Approval failed: ${errorMessage}`);
//     } finally {
//       setIsLoadingAI(false);
//     }
//   };

//   const handleChannelToggle = (channelId: string): void => {
//     setSelectedChannels(prev => 
//       prev.includes(channelId) 
//         ? prev.filter(c => c !== channelId)
//         : [...prev, channelId]
//     );
//   };

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures(prev => [...prev, featureId]);
//     } else {
//       setAutomationFeatures(prev => prev.filter(f => f !== featureId));
//     }
//   };

//   // Component to display the parsed workflow
//   const WorkflowDisplay: React.FC = () => {
//     if (!parsedWorkflow) return null;

//     return (
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
//           <h3 className="text-2xl font-bold mb-2 text-primary flex items-center justify-center gap-2">
//             <Bot className="h-6 w-6" />
//             {parsedWorkflow.title}
//           </h3>
//           <p className="text-muted-foreground">{parsedWorkflow.description}</p>
//           <div className="flex items-center justify-center gap-4 mt-4">
//             <Badge variant="outline" className="font-medium">
//               <Settings className="h-3 w-3 mr-1" />
//               {parsedWorkflow.platform}
//             </Badge>
//             <Badge variant="secondary" className="font-medium">
//               <Clock className="h-3 w-3 mr-1" />
//               {parsedWorkflow.estimatedBuildTime}
//             </Badge>
//             <Badge variant="secondary" className="font-medium">
//               <Target className="h-3 w-3 mr-1" />
//               {parsedWorkflow.complexity}
//             </Badge>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <div className="text-2xl font-bold text-blue-500">{parsedWorkflow.steps.length}</div>
//             <div className="text-sm text-muted-foreground">Workflow Steps</div>
//           </Card>
//           <Card className="p-4 text-center">
//             <div className="text-2xl font-bold text-green-500">{parsedWorkflow.integrations.length}</div>
//             <div className="text-sm text-muted-foreground">Integrations</div>
//           </Card>
//           <Card className="p-4 text-center">
//             <div className="text-2xl font-bold text-purple-500">{selectedChannels.length}</div>
//             <div className="text-sm text-muted-foreground">Platforms</div>
//           </Card>
//           <Card className="p-4 text-center">
//             <div className="text-2xl font-bold text-orange-500">{parsedWorkflow.benefits.length}</div>
//             <div className="text-sm text-muted-foreground">Benefits</div>
//           </Card>
//         </div>

//         {/* Workflow Steps */}
//         <Card className="p-6">
//           <h4 className="font-semibold mb-4 flex items-center gap-2">
//             <PlayCircle className="h-5 w-5 text-blue-500" />
//             Automation Workflow Steps
//           </h4>
//           <div className="space-y-4">
//             {parsedWorkflow.steps.map((step, index) => (
//               <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
//                     {step.stepNumber}
//                   </div>
//                 </div>
//                 <div className="flex-grow">
//                   <h5 className="font-semibold text-lg mb-1">{step.title}</h5>
//                   <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
//                   <Badge variant="outline" className="text-xs">
//                     {step.type}
//                   </Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Required Integrations */}
//         {parsedWorkflow.integrations.length > 0 && (
//           <Card className="p-6">
//             <h4 className="font-semibold mb-4 flex items-center gap-2">
//               <Zap className="h-5 w-5 text-orange-500" />
//               Required Integrations
//             </h4>
//             <div className="grid gap-4 md:grid-cols-2">
//               {parsedWorkflow.integrations.map((integration, index) => (
//                 <div key={index} className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                     <h5 className="font-semibold">{integration.name}</h5>
//                     {integration.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
//                   </div>
//                   <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
//                   <p className="text-xs text-muted-foreground italic">{integration.setupInstructions}</p>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         )}

//         {/* Key Benefits */}
//         {parsedWorkflow.benefits.length > 0 && (
//           <Card className="p-6">
//             <h4 className="font-semibold mb-4 flex items-center gap-2">
//               <ThumbsUp className="h-5 w-5 text-green-500" />
//               Key Benefits
//             </h4>
//             <div className="grid gap-2 md:grid-cols-2">
//               {parsedWorkflow.benefits.map((benefit, index) => (
//                 <div key={index} className="flex items-start gap-2 text-sm">
//                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                   <span>{benefit}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         )}

//         {/* Example Scenario */}
//         {parsedWorkflow.exampleScenario && (
//           <Card className="p-6">
//             <h4 className="font-semibold mb-4 flex items-center gap-2">
//               <MessageSquare className="h-5 w-5 text-purple-500" />
//               How It Works - Example Scenario
//             </h4>
//             <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border">
//               <p className="text-sm leading-relaxed italic">
//                 {parsedWorkflow.exampleScenario}
//               </p>
//             </div>
//           </Card>
//         )}

//         {/* Raw AI Response Toggle */}
//         <Card className="p-6">
//           <Button
//             variant="outline"
//             onClick={() => setShowRawResponse(!showRawResponse)}
//             className="mb-4 flex items-center gap-2"
//           >
//             <FileText className="h-4 w-4" />
//             {showRawResponse ? "Hide" : "Show"} Raw AI Response
//           </Button>
//           {showRawResponse && (
//             <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
//               <pre className="text-xs overflow-auto whitespace-pre-wrap">
//                 {aiRawResponse}
//               </pre>
//             </div>
//           )}
//         </Card>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
//               🤖 AI Social Media Automation Designer
//             </h1>
//             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//               Describe your automation needs and our AI will design a complete workflow for Instagram, Facebook, and other social platforms.
//             </p>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-blue-200 dark:border-blue-800">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Send className="h-5 w-5 text-blue-500" />
//                   {!hasInitialRequest ? "Design Your Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest 
//                     ? "Tell us what social media automation you need"
//                     : "Provide feedback to improve the automation design"
//                   }
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {!hasInitialRequest && (
//                   <>
//                     <div className="space-y-2">
//                       <Label>Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-2">
//                         {channelOptions.map((channel) => (
//                           <button
//                             key={channel.id}
//                             onClick={() => handleChannelToggle(channel.id)}
//                             className={`p-3 rounded-lg border text-left transition-all ${
//                               selectedChannels.includes(channel.id)
//                                 ? 'bg-blue-500 text-white border-blue-500'
//                                 : 'bg-background border-border hover:border-blue-300'
//                             }`}
//                           >
//                             <div className="flex items-center gap-2">
//                               <channel.icon className="h-4 w-4" />
//                               <span className="text-sm font-medium">{channel.label}</span>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label>Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label
//                             key={feature.id}
//                             className="flex items-center gap-2 cursor-pointer"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="rounded border-border"
//                             />
//                             <span className="text-sm">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="workflowRequest">Describe your automation needs</Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I want to automatically respond to Instagram DMs about product inquiries, analyze sentiment, and escalate angry customers to human agents. Also send follow-up messages for abandoned carts.'"
//                         rows={6}
//                         className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
//                         disabled={isLoadingAI}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isLoadingAI || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
//                     >
//                       {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                       Generate Automation Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="refinementInput">How should we improve it?</Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add Shopify integration for order status', 'Include more personalized responses', 'Add scheduling for follow-ups'"
//                         rows={4}
//                         className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
//                         disabled={isLoadingAI}
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         onClick={handleRefine}
//                         disabled={isLoadingAI || !refinementInput.trim()}
//                         className="flex-1 flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
//                       >
//                         {isLoadingAI && currentAction === "refine" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//                         Refine
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isLoadingAI || !parsedWorkflow}
//                         className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                       >
//                         {isLoadingAI && currentAction === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
//                         Approve & Send to Dev Team
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CheckCircle className="h-5 w-5 text-blue-500" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 text-sm">
//                 <div>
//                   <span className="font-semibold text-blue-500">Business:</span>
//                   <p className="text-muted-foreground">{businessInfo.businessName}</p>
//                 </div>
//                 <div>
//                   <span className="font-semibold text-blue-500">Type:</span>
//                   <p className="text-muted-foreground">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div>
//                     <span className="font-semibold text-blue-500">Description:</span>
//                     <p className="text-muted-foreground">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div>
//                     <span className="font-semibold text-blue-500">Platforms:</span>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {selectedChannels.map(channel => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find(c => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Output */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-blue-200 dark:border-blue-800 min-h-[600px]">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Bot className="h-5 w-5 text-blue-500" />
//                   AI-Generated Automation Workflow
//                 </CardTitle>
//                 <CardDescription>
//                   Real-time AI-designed automation workflow for your social media platforms
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Loading State */}
//                 {isLoadingAI && (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="relative">
//                       <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//                       <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500 animate-pulse" />
//                     </div>
//                     <p className="mt-6 text-lg font-medium text-blue-500">{responseStatus}</p>
//                     <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                       <span className="ml-2">AI is analyzing your requirements...</span>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Success State - Show Workflow */}
//                 {!isLoadingAI && parsedWorkflow && (
//                   <WorkflowDisplay />
//                 )}
                
//                 {/* Error State */}
//                 {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("❌") && (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
//                       <AlertCircle className="h-8 w-8 text-red-500" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-red-600 mb-2">Generation Failed</h3>
//                     <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
//                       {responseStatus}
//                     </p>
//                     <div className="flex gap-2">
//                       <Button 
//                         variant="outline" 
//                         onClick={() => {
//                           setResponseStatus(null);
//                           setHasInitialRequest(false);
//                         }}
//                         className="flex items-center gap-2"
//                       >
//                         <RefreshCw className="h-4 w-4" />
//                         Try Again
//                       </Button>
//                       <Button 
//                         variant="outline" 
//                         onClick={() => setShowRawResponse(true)}
//                         className="flex items-center gap-2"
//                       >
//                         <FileText className="h-4 w-4" />
//                         Debug Info
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Warning State - Partial Success */}
//                 {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("⚠️") && (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
//                       <AlertCircle className="h-8 w-8 text-yellow-500" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-yellow-600 mb-2">Partial Success</h3>
//                     <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
//                       {responseStatus}
//                     </p>
//                     <Button 
//                       variant="outline" 
//                       onClick={() => setShowRawResponse(true)}
//                       className="flex items-center gap-2"
//                     >
//                       <FileText className="h-4 w-4" />
//                       View Raw Response
//                     </Button>
//                     {showRawResponse && aiRawResponse && (
//                       <div className="mt-4 w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
//                         <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-64">
//                           {aiRawResponse}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Initial State */}
//                 {!isLoadingAI && !parsedWorkflow && !responseStatus && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
//                     <div className="relative mb-6">
//                       <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
//                         <Bot className="h-10 w-10 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-3 w-3 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2">Ready to Create Your Automation</h3>
//                     <p className="text-center max-w-md mb-6">
//                       Describe your social media automation needs and our AI will generate a complete, production-ready workflow design.
//                     </p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Real AI Generation</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Production Ready</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Team Notifications</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Success Status */}
//                 {!isLoadingAI && responseStatus && responseStatus.includes("✅") && (
//                   <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
//                     <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
//                       <CheckCircle className="h-4 w-4" />
//                       <span className="text-sm font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceflowWorkflowBuilder;



import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Send, 
  Clock, 
  Settings, 
  Target, 
  ThumbsUp, 
  Bot, 
  Mic, 
  Phone, 
  MessageCircle,
  RefreshCw,
  Users,
  MessageSquare,
  Zap,
  AlertCircle,
  FileText,
  PlayCircle,
  ArrowRight,
  Workflow,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Eye,
  Database,
  Filter,
  Mail,
  Bell,
  Calendar,
  BarChart3,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';

// TypeScript interfaces
interface VoiceflowWorkflowBuilderProps {
  businessInfo?: {
    businessName: string;
    businessType: string;
    description?: string;
    website?: string;
    phone?: string;
    email?: string;
  };
  selectedWorkflowId?: string | null;
  setStep?: (step: "selection" | "dashboard") => void;
  setActiveWorkflowExists?: (exists: boolean) => void;
  setActiveWorkflowDetails?: (details: any) => void;
}

interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  type: string;
  inputs?: string[];
  outputs?: string[];
  conditions?: string[];
  integrations?: string[];
  estimatedTime?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  details?: string[];
}

interface Integration {
  name: string;
  type: string;
  description: string;
  required: boolean;
  setupInstructions: string;
  status?: 'available' | 'requires_setup' | 'premium';
  icon?: React.ComponentType<{ className?: string }>;
}

interface ParsedWorkflow {
  title: string;
  description: string;
  platform: string;
  estimatedBuildTime: string;
  complexity: string;
  steps: WorkflowStep[];
  integrations: Integration[];
  benefits: string[];
  exampleScenario: string;
  technicalRequirements: string[];
  deploymentChannels: string[];
  metrics?: {
    automationRate: string;
    responseTime: string;
    accuracy: string;
    scalability: string;
  };
}

interface ChannelOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AutomationFeature {
  id: string;
  label: string;
}

// Mock business info for demo
const mockBusinessInfo = {
  businessName: "TechCorp Solutions",
  businessType: "Technology Company",
  description: "We provide innovative tech solutions for businesses",
  website: "https://techcorp.com",
  phone: "+1-555-0123",
  email: "contact@techcorp.com"
};

const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
  businessInfo = mockBusinessInfo,
  selectedWorkflowId,
  setStep,
  setActiveWorkflowExists,
  setActiveWorkflowDetails,
}) => {
  const [workflowRequest, setWorkflowRequest] = useState<string>("");
  const [aiRawResponse, setAiRawResponse] = useState<string>("");
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null);
  const [refinementInput, setRefinementInput] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial");
  const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"]);
  const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"]);
  const [showRawResponse, setShowRawResponse] = useState<boolean>(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const n8nWebhookUrl = "/api/n8n-proxy";

  const channelOptions: ChannelOption[] = [
    { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
    { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
    { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
    { id: "telegram", label: "Telegram Bot", icon: Bot },
    { id: "web", label: "Website Chat", icon: Mic }
  ];

  const automationFeatureOptions: AutomationFeature[] = [
    { id: "auto-reply", label: "Automatic Responses" },
    { id: "sentiment-analysis", label: "Sentiment Analysis" },
    { id: "intent-detection", label: "Intent Recognition" },
    { id: "multilingual", label: "Multi-language Support" },
    { id: "smart-routing", label: "Smart Agent Routing" }
  ];

  // Enhanced function to parse AI markdown response into structured workflow
  const parseAIResponse = (markdownText: string): ParsedWorkflow | null => {
    try {
      if (!markdownText || markdownText.trim().length === 0) {
        return null;
      }

      const lines = markdownText.split('\n');
      let workflow: Partial<ParsedWorkflow> = {
        steps: [],
        integrations: [],
        benefits: [],
        technicalRequirements: [],
        deploymentChannels: selectedChannels,
        metrics: {
          automationRate: "85%",
          responseTime: "< 2 seconds",
          accuracy: "92%",
          scalability: "High"
        }
      };

      let currentSection = '';
      let stepCounter = 1;

      // Step type mapping for icons and colors
      const stepTypeMapping: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
        'trigger': { icon: PlayCircle, color: 'text-green-500' },
        'filter': { icon: Filter, color: 'text-blue-500' },
        'analysis': { icon: BarChart3, color: 'text-purple-500' },
        'response': { icon: MessageCircle, color: 'text-orange-500' },
        'notification': { icon: Bell, color: 'text-red-500' },
        'integration': { icon: Zap, color: 'text-yellow-500' },
        'storage': { icon: Database, color: 'text-gray-500' },
        'routing': { icon: GitBranch, color: 'text-indigo-500' },
        'validation': { icon: Shield, color: 'text-cyan-500' },
        'automation': { icon: Bot, color: 'text-pink-500' }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('# ')) {
          workflow.title = line.substring(2).trim();
        } else if (line.startsWith('## ')) {
          currentSection = line.substring(3).toLowerCase().trim();
        } else if (line.includes('**Description:**')) {
          workflow.description = line.replace(/.*\*\*Description:\*\*\s*/, '').trim();
        } else if (line.includes('**Platform:**')) {
          workflow.platform = line.replace(/.*\*\*Platform:\*\*\s*/, '').trim();
        } else if (line.includes('**Estimated Build Time:**')) {
          workflow.estimatedBuildTime = line.replace(/.*\*\*Estimated Build Time:\*\*\s*/, '').trim();
        } else if (line.includes('**Complexity:**')) {
          workflow.complexity = line.replace(/.*\*\*Complexity:\*\*\s*/, '').trim();
        } else if (currentSection.includes('workflow') || currentSection.includes('steps') || currentSection.includes('process')) {
          if (line.match(/^\d+\./)) {
            const stepText = line.replace(/^\d+\.\s*/, '');
            const [title, ...descParts] = stepText.split(':');
            
            // Determine step type based on keywords
            let stepType = 'automation';
            const titleLower = title.toLowerCase();
            if (titleLower.includes('trigger') || titleLower.includes('start') || titleLower.includes('receive')) stepType = 'trigger';
            else if (titleLower.includes('filter') || titleLower.includes('check') || titleLower.includes('validate')) stepType = 'filter';
            else if (titleLower.includes('analyze') || titleLower.includes('sentiment') || titleLower.includes('intent')) stepType = 'analysis';
            else if (titleLower.includes('respond') || titleLower.includes('reply') || titleLower.includes('send')) stepType = 'response';
            else if (titleLower.includes('notify') || titleLower.includes('alert') || titleLower.includes('escalate')) stepType = 'notification';
            else if (titleLower.includes('store') || titleLower.includes('save') || titleLower.includes('log')) stepType = 'storage';
            else if (titleLower.includes('route') || titleLower.includes('assign') || titleLower.includes('forward')) stepType = 'routing';

            const typeInfo = stepTypeMapping[stepType] || stepTypeMapping['automation'];
            
            workflow.steps?.push({
              stepNumber: stepCounter++,
              title: title.trim(),
              description: descParts.join(':').trim() || title.trim(),
              type: stepType,
              icon: typeInfo.icon,
              color: typeInfo.color,
              estimatedTime: stepType === 'trigger' ? '< 1s' : stepType === 'analysis' ? '2-3s' : '1-2s',
              inputs: stepType === 'trigger' ? ['User Message'] : ['Previous Step Output'],
              outputs: stepType === 'response' ? ['Automated Response'] : ['Processed Data'],
              details: [
                `Processes ${stepType} logic automatically`,
                `Integrates with selected platforms`,
                `Maintains conversation context`
              ]
            });
          }
        } else if (currentSection.includes('integration')) {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const integrationText = line.substring(2);
            const [name, ...descParts] = integrationText.split(':');
            
            // Determine integration icon
            let integrationIcon = Zap;
            const nameLower = name.toLowerCase();
            if (nameLower.includes('instagram') || nameLower.includes('facebook')) integrationIcon = MessageSquare;
            else if (nameLower.includes('whatsapp') || nameLower.includes('telegram')) integrationIcon = Phone;
            else if (nameLower.includes('email') || nameLower.includes('smtp')) integrationIcon = Mail;
            else if (nameLower.includes('database') || nameLower.includes('storage')) integrationIcon = Database;
            else if (nameLower.includes('api') || nameLower.includes('webhook')) integrationIcon = Globe;

            workflow.integrations?.push({
              name: name.trim(),
              type: "api",
              description: descParts.join(':').trim() || "Integration required for workflow",
              required: true,
              setupInstructions: "Configuration required during implementation",
              status: 'requires_setup',
              icon: integrationIcon
            });
          }
        } else if (currentSection.includes('benefit')) {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            workflow.benefits?.push(line.substring(2).trim());
          }
        } else if (currentSection.includes('scenario') || currentSection.includes('example')) {
          if (line.length > 0 && !line.startsWith('#') && !line.startsWith('*')) {
            workflow.exampleScenario = (workflow.exampleScenario || '') + line + ' ';
          }
        } else if (currentSection.includes('technical') || currentSection.includes('requirement')) {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            workflow.technicalRequirements?.push(line.substring(2).trim());
          }
        }
      }

      // Set defaults if not found
      workflow.title = workflow.title || "AI-Generated Social Media Automation";
      workflow.description = workflow.description || "Custom automation workflow for social media platforms";
      workflow.platform = workflow.platform || "Multi-Platform";
      workflow.estimatedBuildTime = workflow.estimatedBuildTime || "2-3 weeks";
      workflow.complexity = workflow.complexity || "Medium";
      workflow.exampleScenario = workflow.exampleScenario?.trim() || "Automated customer interaction workflow";

      return workflow as ParsedWorkflow;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return null;
    }
  };

  const generateWorkflow = useCallback(async (
    action: "initial" | "refine", 
    instructions?: string, 
    currentDesign?: string
  ): Promise<void> => {
    setIsLoadingAI(true);
    setResponseStatus("🤖 AI is designing your social media automation workflow...");
    setCurrentAction(action);
    setHasInitialRequest(true);

    try {
      const payload = {
        action: action,
        platform: "social-media-automation",
        userEmail: businessInfo.email || "no-email@example.com",
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
        businessDescription: businessInfo.description,
        website: businessInfo.website,
        phone: businessInfo.phone,
        selectedChannels: selectedChannels,
        automationFeatures: automationFeatures,
        workflowRequest: workflowRequest,
        initialPrompt: action === "initial" ? workflowRequest : 
          `Previous request: ${workflowRequest}. Refinement: ${instructions || ""}`,
        ...(requestId && { requestId }),
        ...(instructions && { refinementInstructions: instructions }),
        ...(currentDesign && { currentWorkflowDesign: currentDesign })
      };

      console.log("🚀 Sending request to N8N:", payload);

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 N8N Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📋 N8N Response data:", result);

      if (result.status === "success" && result.workflowDesign) {
        setAiRawResponse(result.workflowDesign);
        const parsed = parseAIResponse(result.workflowDesign);
        
        if (parsed) {
          setParsedWorkflow(parsed);
          setResponseStatus("✅ Social media automation workflow generated successfully!");
        } else {
          setResponseStatus("⚠️ Generated workflow but had parsing issues. Check raw response.");
        }
        
        if (!requestId && result.requestId) {
          setRequestId(result.requestId);
        }
      } else {
        throw new Error(result.message || "AI did not return a valid workflow design");
      }
    } catch (error) {
      console.error("❌ Workflow generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (errorMessage.includes("fetch")) {
        setResponseStatus("🔌 Cannot connect to N8N. Please ensure N8N is running and accessible.");
      } else if (errorMessage.includes("HTTP 404")) {
        setResponseStatus("📍 N8N webhook endpoint not found. Check the webhook URL configuration.");
      } else if (errorMessage.includes("HTTP 500")) {
        setResponseStatus("⚙️ N8N server error. Check N8N logs and configuration.");
      } else {
        setResponseStatus(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setIsLoadingAI(false);
    }
  }, [n8nWebhookUrl, businessInfo, selectedChannels, automationFeatures, workflowRequest, requestId]);

  const handleInitialSubmit = (): void => {
    if (!workflowRequest.trim()) {
      setResponseStatus("❌ Please describe your social media automation needs");
      return;
    }
    if (selectedChannels.length === 0) {
      setResponseStatus("❌ Please select at least one social media platform");
      return;
    }
    generateWorkflow("initial");
  };

  const handleRefine = (): void => {
    if (!refinementInput.trim()) {
      setResponseStatus("❌ Please provide refinement instructions");
      return;
    }
    generateWorkflow("refine", refinementInput, aiRawResponse);
    setRefinementInput("");
  };

  const handleApprove = async (): Promise<void> => {
    setIsLoadingAI(true);
    setResponseStatus("📧 Sending final automation design to the development team...");
    setCurrentAction("approve");

    try {
      const payload = {
        action: "approve",
        platform: "social-media-automation",
        requestId: requestId,
        userEmail: businessInfo.email || "no-email@example.com",
        aiRawResponse: aiRawResponse,
        parsedWorkflow: parsedWorkflow,
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
        businessDescription: businessInfo.description,
        website: businessInfo.website,
        phone: businessInfo.phone,
        selectedChannels: selectedChannels,
        automationFeatures: automationFeatures,
      };

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        setResponseStatus("✅ Automation approved! Development team has been notified.");
        
        if (setActiveWorkflowExists) {
          setActiveWorkflowExists(true);
        }
        
        if (setActiveWorkflowDetails) {
          setActiveWorkflowDetails({
            id: requestId || "social-automation-" + Date.now(),
            workflowTemplate: { name: parsedWorkflow?.title || "Social Media Automation" },
            businessInfo: businessInfo,
            aiResponse: aiRawResponse,
            parsedWorkflow: parsedWorkflow,
            status: "APPROVED_PENDING_DEVELOPMENT",
            platform: "social-media-automation",
            channels: selectedChannels,
            features: automationFeatures,
            approvedAt: new Date().toISOString(),
          });
        }
        
        setTimeout(() => {
          if (setStep) {
            setStep("dashboard");
          }
        }, 2000);
      } else {
        throw new Error(result.message || "Approval failed");
      }
    } catch (error) {
      console.error("❌ Approval error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setResponseStatus(`❌ Approval failed: ${errorMessage}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleChannelToggle = (channelId: string): void => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handleFeatureToggle = (featureId: string, checked: boolean): void => {
    if (checked) {
      setAutomationFeatures(prev => [...prev, featureId]);
    } else {
      setAutomationFeatures(prev => prev.filter(f => f !== featureId));
    }
  };

  const toggleStepExpansion = (stepNumber: number): void => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  // Enhanced Workflow Display Component
  const WorkflowDisplay: React.FC = () => {
    if (!parsedWorkflow) return null;

    return (
      <div className="space-y-8">
        {/* Header with Metrics */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 dark:border-blue-700/50">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="relative p-8">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Workflow className="h-8 w-8 text-blue-500" />
                {parsedWorkflow.title}
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{parsedWorkflow.description}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{parsedWorkflow.metrics?.automationRate}</div>
                <div className="text-sm text-muted-foreground">Automation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{parsedWorkflow.metrics?.responseTime}</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{parsedWorkflow.metrics?.accuracy}</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{parsedWorkflow.metrics?.scalability}</div>
                <div className="text-sm text-muted-foreground">Scalability</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="font-medium px-4 py-2">
                <Settings className="h-4 w-4 mr-2" />
                {parsedWorkflow.platform}
              </Badge>
              <Badge variant="secondary" className="font-medium px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                {parsedWorkflow.estimatedBuildTime}
              </Badge>
              <Badge variant="secondary" className="font-medium px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                {parsedWorkflow.complexity}
              </Badge>
            </div>
          </div>
        </div>

        {/* Interactive Workflow Steps */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <PlayCircle className="h-5 w-5 text-white" />
              </div>
              Workflow Execution Steps
            </CardTitle>
            <CardDescription>
              Click on any step to view detailed information about its functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {/* Workflow Timeline */}
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {parsedWorkflow.steps.map((step, index) => {
                const isExpanded = expandedSteps.has(step.stepNumber);
                const IconComponent = step.icon || Bot;
                
                return (
                  <div key={index} className="relative">
                    {/* Step Container */}
                    <div 
                      className={`ml-16 mr-6 my-4 transition-all duration-300 cursor-pointer ${
                        isExpanded ? 'transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'
                      }`}
                      onClick={() => toggleStepExpansion(step.stepNumber)}
                    >
                      <div className={`rounded-xl border-2 transition-all duration-300 ${
                        isExpanded 
                          ? 'border-blue-300 dark:border-blue-600 shadow-lg bg-blue-50/50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-gray-900'
                      }`}>
                        {/* Step Header */}
                        <div className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg min-w-[3rem] text-center`}>
                              {step.stepNumber}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <IconComponent className={`h-6 w-6 ${step.color}`} />
                                <h4 className="text-xl font-semibold">{step.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {step.type}
                                </Badge>
                                {step.estimatedTime && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {step.estimatedTime}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-3">{step.description}</p>
                              
                              {/* Input/Output Preview */}
                              <div className="flex items-center gap-4 text-sm">
                                {step.inputs && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700 dark:text-green-300">
                                      Input: {step.inputs.join(', ')}
                                    </span>
                                  </div>
                                )}
                                {step.outputs && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-blue-700 dark:text-blue-300">
                                      Output: {step.outputs.join(', ')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 p-6">
                            <div className="grid md:grid-cols-3 gap-6">
                              <div>
                                <h5 className="font-semibold mb-3 flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-blue-500" />
                                  Step Details
                                </h5>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                  {step.details?.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold mb-3 flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-yellow-500" />
                                  Processing
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Execution Time:</span>
                                    <span className="font-medium">{step.estimatedTime}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Auto-retry:</span>
                                    <span className="font-medium text-green-600">Enabled</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Error Handling:</span>
                                    <span className="font-medium text-blue-600">Advanced</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold mb-3 flex items-center gap-2">
                                  <GitBranch className="h-4 w-4 text-purple-500" />
                                  Flow Control
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Success Path</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>Validation Branch</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>Error Fallback</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step Connection Line */}
                    {index < parsedWorkflow.steps.length - 1 && (
                      <div className="absolute left-8 -bottom-2 z-10">
                        <div className="w-4 h-4 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-2 w-2 text-blue-500" />
                        </div>
                      </div>
                    )}

                    {/* Step Number Circle */}
                    <div className="absolute left-6 top-8 z-20">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{parsedWorkflow.steps.length}</div>
              <div className="text-sm text-muted-foreground">Automation Steps</div>
              <div className="text-xs text-green-600 mt-1">Fully Automated</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{parsedWorkflow.integrations.length}</div>
              <div className="text-sm text-muted-foreground">Integrations</div>
              <div className="text-xs text-blue-600 mt-1">API Connected</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{selectedChannels.length}</div>
              <div className="text-sm text-muted-foreground">Platforms</div>
              <div className="text-xs text-purple-600 mt-1">Multi-Channel</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
              <div className="text-xs text-orange-600 mt-1">Enterprise Grade</div>
            </CardContent>
          </Card>
        </div>

        {/* Required Integrations */}
        {parsedWorkflow.integrations.length > 0 && (
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Required Platform Integrations
              </CardTitle>
              <CardDescription>
                These integrations will be configured during the development phase
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {parsedWorkflow.integrations.map((integration, index) => {
                  const IconComponent = integration.icon || Globe;
                  return (
                    <div key={index} className="group relative overflow-hidden rounded-lg border border-orange-200 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 transition-all hover:shadow-md hover:scale-105">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{integration.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            {integration.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {integration.status?.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{integration.description}</p>
                      <div className="text-xs text-muted-foreground border-t border-orange-200/50 dark:border-orange-700/50 pt-2">
                        <div className="flex items-center gap-1">
                          <Settings className="h-3 w-3" />
                          {integration.setupInstructions}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Benefits Section */}
        {parsedWorkflow.benefits.length > 0 && (
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <ThumbsUp className="h-5 w-5 text-white" />
                </div>
                Business Benefits & ROI
              </CardTitle>
              <CardDescription>
                Expected improvements and value delivered by this automation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {parsedWorkflow.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="p-1 bg-green-500 rounded-full mt-0.5">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Scenario */}
        {parsedWorkflow.exampleScenario && (
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                Real-World Usage Example
              </CardTitle>
              <CardDescription>
                See how this automation workflow works in practice
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Customer Journey Example</h4>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 italic">
                      {parsedWorkflow.exampleScenario}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Implementation Details */}
        {parsedWorkflow.technicalRequirements.length > 0 && (
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gray-500 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                Technical Implementation
              </CardTitle>
              <CardDescription>
                Technical requirements and implementation details for developers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-3 md:grid-cols-2">
                {parsedWorkflow.technicalRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raw AI Response Toggle */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <Button
              variant="outline"
              onClick={() => setShowRawResponse(!showRawResponse)}
              className="mb-4 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {showRawResponse ? "Hide" : "Show"} Raw AI Response
            </Button>
            {showRawResponse && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96">
                  {aiRawResponse}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              🤖 AI Social Media Automation Designer
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Describe your automation needs and our AI will design a complete workflow for Instagram, Facebook, and other social platforms.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  {!hasInitialRequest ? "Design Your Automation" : "Refine Your Workflow"}
                </CardTitle>
                <CardDescription>
                  {!hasInitialRequest 
                    ? "Tell us what social media automation you need"
                    : "Provide feedback to improve the automation design"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasInitialRequest && (
                  <>
                    <div className="space-y-2">
                      <Label>Social Media Platforms</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {channelOptions.map((channel) => (
                          <button
                            key={channel.id}
                            onClick={() => handleChannelToggle(channel.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedChannels.includes(channel.id)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-background border-border hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <channel.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{channel.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Automation Features</Label>
                      <div className="space-y-2">
                        {automationFeatureOptions.map((feature) => (
                          <label
                            key={feature.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={automationFeatures.includes(feature.id)}
                              onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
                              className="rounded border-border"
                            />
                            <span className="text-sm">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="workflowRequest">Describe your automation needs</Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I want to automatically respond to Instagram DMs about product inquiries, analyze sentiment, and escalate angry customers to human agents. Also send follow-up messages for abandoned carts.'"
                        rows={6}
                        className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
                        disabled={isLoadingAI}
                      />
                    </div>
                    <Button
                      onClick={handleInitialSubmit}
                      disabled={isLoadingAI || !workflowRequest.trim()}
                      className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                    >
                      {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Generate Automation Workflow
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="refinementInput">How should we improve it?</Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add Shopify integration for order status', 'Include more personalized responses', 'Add scheduling for follow-ups'"
                        rows={4}
                        className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
                        disabled={isLoadingAI}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRefine}
                        disabled={isLoadingAI || !refinementInput.trim()}
                        className="flex-1 flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                      >
                        {isLoadingAI && currentAction === "refine" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Refine
                      </Button>
                      <Button
                        onClick={handleApprove}
                        disabled={isLoadingAI || !parsedWorkflow}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        {isLoadingAI && currentAction === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                        Approve & Send to Dev Team
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  Business Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-blue-500">Business:</span>
                  <p className="text-muted-foreground">{businessInfo.businessName}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-500">Type:</span>
                  <p className="text-muted-foreground">{businessInfo.businessType}</p>
                </div>
                {businessInfo.description && (
                  <div>
                    <span className="font-semibold text-blue-500">Description:</span>
                    <p className="text-muted-foreground">{businessInfo.description}</p>
                  </div>
                )}
                {selectedChannels.length > 0 && (
                  <div>
                    <span className="font-semibold text-blue-500">Platforms:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedChannels.map(channel => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channelOptions.find(c => c.id === channel)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-200 dark:border-blue-800 min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  AI-Generated Automation Workflow
                </CardTitle>
                <CardDescription>
                  Real-time AI-designed automation workflow for your social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {isLoadingAI && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500 animate-pulse" />
                    </div>
                    <p className="mt-6 text-lg font-medium text-blue-500">{responseStatus}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="ml-2">AI is analyzing your requirements...</span>
                    </div>
                  </div>
                )}
                
                {/* Success State - Show Workflow */}
                {!isLoadingAI && parsedWorkflow && (
                  <WorkflowDisplay />
                )}
                
                {/* Error State */}
                {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("❌") && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Generation Failed</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      {responseStatus}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setResponseStatus(null);
                          setHasInitialRequest(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRawResponse(true)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Debug Info
                      </Button>
                    </div>
                  </div>
                )}

                {/* Warning State - Partial Success */}
                {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("⚠️") && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-600 mb-2">Partial Success</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      {responseStatus}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRawResponse(true)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Raw Response
                    </Button>
                    {showRawResponse && aiRawResponse && (
                      <div className="mt-4 w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                        <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-64">
                          {aiRawResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Initial State */}
                {!isLoadingAI && !parsedWorkflow && !responseStatus && !hasInitialRequest && (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <Bot className="h-10 w-10 text-blue-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Create Your Automation</h3>
                    <p className="text-center max-w-md mb-6">
                      Describe your social media automation needs and our AI will generate a complete, production-ready workflow design.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Real AI Generation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Production Ready</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Team Notifications</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Status */}
                {!isLoadingAI && responseStatus && responseStatus.includes("✅") && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{responseStatus}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceflowWorkflowBuilder;