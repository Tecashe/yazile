// import React, { useState, useCallback, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
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
//   PlayCircle,
//   ArrowRight,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   Calendar,
//   BarChart3,
//   Shield,
//   Globe,
//   Smartphone,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket
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
//   estimatedTime?: string;
//   icon?: React.ComponentType<{ className?: string }>;
//   color?: string;
//   details?: string[];
// }

// interface Integration {
//   name: string;
//   type: string;
//   description: string;
//   required: boolean;
//   setupInstructions: string;
//   status?: 'available' | 'requires_setup' | 'premium';
//   icon?: React.ComponentType<{ className?: string }>;
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
//   metrics?: {
//     automationRate: string;
//     responseTime: string;
//     accuracy: string;
//     scalability: string;
//   };
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

// interface LoadingPhase {
//   id: string;
//   title: string;
//   description: string;
//   icon: React.ComponentType<{ className?: string }>;
//   duration: number;
//   color: string;
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

// // Loading phases for AI workflow generation
// const loadingPhases: LoadingPhase[] = [
//   {
//     id: "analyze",
//     title: "Analyzing Requirements",
//     description: "Our AI is understanding your business needs and automation goals",
//     icon: Brain,
//     duration: 15,
//     color: "text-blue-500"
//   },
//   {
//     id: "design",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and automation pathways",
//     icon: Code,
//     duration: 25,
//     color: "text-purple-500"
//   },
//   {
//     id: "optimize",
//     title: "Optimizing Performance",
//     description: "Fine-tuning automation rules and response accuracy",
//     icon: Cpu,
//     duration: 20,
//     color: "text-green-500"
//   },
//   {
//     id: "integrate",
//     title: "Planning Integrations",
//     description: "Mapping platform APIs and data flow connections",
//     icon: Zap,
//     duration: 15,
//     color: "text-orange-500"
//   },
//   {
//     id: "validate",
//     title: "Validating Solution",
//     description: "Running quality checks and business logic validation",
//     icon: Shield,
//     duration: 15,
//     color: "text-cyan-500"
//   },
//   {
//     id: "finalize",
//     title: "Finalizing Design",
//     description: "Compiling comprehensive automation blueprint",
//     icon: Rocket,
//     duration: 10,
//     color: "text-pink-500"
//   }
// ];

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
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  
//   // Enhanced loading states
//   const [currentPhase, setCurrentPhase] = useState<number>(0);
//   const [phaseProgress, setPhaseProgress] = useState<number>(0);
//   const [overallProgress, setOverallProgress] = useState<number>(0);
//   const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
//   const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0);

//   const n8nWebhookUrl = "/api/n8n-proxy";

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

//   // Enhanced loading simulation
//   useEffect(() => {
//     if (!isLoadingAI) return;

//     const totalDuration = loadingPhases.reduce((sum, phase) => sum + phase.duration, 0);
//     let elapsed = 0;
    
//     const interval = setInterval(() => {
//       elapsed += 1;
      
//       // Calculate current phase
//       let currentElapsed = 0;
//       let newPhase = 0;
//       for (let i = 0; i < loadingPhases.length; i++) {
//         if (currentElapsed + loadingPhases[i].duration >= elapsed) {
//           newPhase = i;
//           break;
//         }
//         currentElapsed += loadingPhases[i].duration;
//       }
      
//       setCurrentPhase(newPhase);
      
//       // Calculate phase progress
//       const phaseElapsed = elapsed - currentElapsed;
//       const currentPhaseDuration = loadingPhases[newPhase]?.duration || 1;
//       const newPhaseProgress = Math.min((phaseElapsed / currentPhaseDuration) * 100, 100);
//       setPhaseProgress(newPhaseProgress);
      
//       // Calculate overall progress
//       const newOverallProgress = Math.min((elapsed / totalDuration) * 100, 95);
//       setOverallProgress(newOverallProgress);
      
//       // Update estimated time remaining
//       setEstimatedTimeRemaining(Math.max(totalDuration - elapsed, 0));
      
//       // Add loading messages
//       if (elapsed % 8 === 0 && newPhase < loadingPhases.length) {
//         const messages = [
//           `🧠 Processing ${selectedChannels.length} platform${selectedChannels.length > 1 ? 's' : ''}...`,
//           `⚡ Analyzing ${automationFeatures.length} automation feature${automationFeatures.length > 1 ? 's' : ''}...`,
//           `🔄 Designing workflow for ${businessInfo.businessType}...`,
//           `📊 Calculating ROI and performance metrics...`,
//           `🎯 Optimizing for customer satisfaction...`,
//           `🚀 Preparing enterprise-grade solution...`
//         ];
        
//         setLoadingMessages(prev => {
//           const newMessages = [...prev, messages[Math.floor(Math.random() * messages.length)]];
//           return newMessages.slice(-4); // Keep only last 4 messages
//         });
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isLoadingAI, selectedChannels.length, automationFeatures.length, businessInfo.businessType]);

//   // Enhanced function to parse AI markdown response into structured workflow
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
//         deploymentChannels: selectedChannels,
//         metrics: {
//           automationRate: "85%",
//           responseTime: "< 2 seconds",
//           accuracy: "92%",
//           scalability: "High"
//         }
//       };

//       let currentSection = '';
//       let stepCounter = 1;

//       // Step type mapping for icons and colors
//       const stepTypeMapping: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
//         'trigger': { icon: PlayCircle, color: 'text-green-500' },
//         'filter': { icon: Filter, color: 'text-blue-500' },
//         'analysis': { icon: BarChart3, color: 'text-purple-500' },
//         'response': { icon: MessageCircle, color: 'text-orange-500' },
//         'notification': { icon: Bell, color: 'text-red-500' },
//         'integration': { icon: Zap, color: 'text-yellow-500' },
//         'storage': { icon: Database, color: 'text-gray-500' },
//         'routing': { icon: GitBranch, color: 'text-indigo-500' },
//         'validation': { icon: Shield, color: 'text-cyan-500' },
//         'automation': { icon: Bot, color: 'text-pink-500' }
//       };

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
            
//             // Determine step type based on keywords
//             let stepType = 'automation';
//             const titleLower = title.toLowerCase();
//             if (titleLower.includes('trigger') || titleLower.includes('start') || titleLower.includes('receive')) stepType = 'trigger';
//             else if (titleLower.includes('filter') || titleLower.includes('check') || titleLower.includes('validate')) stepType = 'filter';
//             else if (titleLower.includes('analyze') || titleLower.includes('sentiment') || titleLower.includes('intent')) stepType = 'analysis';
//             else if (titleLower.includes('respond') || titleLower.includes('reply') || titleLower.includes('send')) stepType = 'response';
//             else if (titleLower.includes('notify') || titleLower.includes('alert') || titleLower.includes('escalate')) stepType = 'notification';
//             else if (titleLower.includes('store') || titleLower.includes('save') || titleLower.includes('log')) stepType = 'storage';
//             else if (titleLower.includes('route') || titleLower.includes('assign') || titleLower.includes('forward')) stepType = 'routing';

//             const typeInfo = stepTypeMapping[stepType] || stepTypeMapping['automation'];
            
//             workflow.steps?.push({
//               stepNumber: stepCounter++,
//               title: title.trim(),
//               description: descParts.join(':').trim() || title.trim(),
//               type: stepType,
//               icon: typeInfo.icon,
//               color: typeInfo.color,
//               estimatedTime: stepType === 'trigger' ? '< 1s' : stepType === 'analysis' ? '2-3s' : '1-2s',
//               inputs: stepType === 'trigger' ? ['User Message'] : ['Previous Step Output'],
//               outputs: stepType === 'response' ? ['Automated Response'] : ['Processed Data'],
//               details: [
//                 `Processes ${stepType} logic automatically`,
//                 `Integrates with selected platforms`,
//                 `Maintains conversation context`
//               ]
//             });
//           }
//         } else if (currentSection.includes('integration')) {
//           if (line.startsWith('- ') || line.startsWith('* ')) {
//             const integrationText = line.substring(2);
//             const [name, ...descParts] = integrationText.split(':');
            
//             // Determine integration icon
//             let integrationIcon = Zap;
//             const nameLower = name.toLowerCase();
//             if (nameLower.includes('instagram') || nameLower.includes('facebook')) integrationIcon = MessageSquare;
//             else if (nameLower.includes('whatsapp') || nameLower.includes('telegram')) integrationIcon = Phone;
//             else if (nameLower.includes('email') || nameLower.includes('smtp')) integrationIcon = Mail;
//             else if (nameLower.includes('database') || nameLower.includes('storage')) integrationIcon = Database;
//             else if (nameLower.includes('api') || nameLower.includes('webhook')) integrationIcon = Globe;

//             workflow.integrations?.push({
//               name: name.trim(),
//               type: "api",
//               description: descParts.join(':').trim() || "Integration required for workflow",
//               required: true,
//               setupInstructions: "Configuration required during implementation",
//               status: 'requires_setup',
//               icon: integrationIcon
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
//     setCurrentPhase(0);
//     setPhaseProgress(0);
//     setOverallProgress(0);
//     setLoadingMessages([]);
//     setEstimatedTimeRemaining(100);
//     setResponseStatus("🚀 Initializing AI workflow designer...");
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

//       // Complete loading animation
//       setCurrentPhase(loadingPhases.length - 1);
//       setPhaseProgress(100);
//       setOverallProgress(100);

//       if (result.status === "success" && result.workflowDesign) {
//         setAiRawResponse(result.workflowDesign);
//         const parsed = parseAIResponse(result.workflowDesign);
        
//         if (parsed) {
//           setParsedWorkflow(parsed);
//           setResponseStatus("✅ Enterprise-grade workflow generated successfully!");
//         } else {
//           setResponseStatus("⚠️ Generated workflow but had parsing issues. Check raw response.");
//         }
        
//         if (!requestId && result.requestId) {
//           setRequestId(result.requestId);
//         }
//       } else if (result.status === "retry_needed") {
//         setResponseStatus("🔄 Enhancing workflow quality - generating improved version...");
//         // The N8N workflow will handle retry automatically
//       } else {
//         throw new Error(result.message || "AI did not return a valid workflow design");
//       }
//     } catch (error) {
//       console.error("❌ Workflow generation error:", error);
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
//       setOverallProgress(100);
//       setCurrentPhase(loadingPhases.length - 1);
      
//       if (errorMessage.includes("fetch")) {
//         setResponseStatus("🔌 Cannot connect to workflow engine. Please ensure the system is running.");
//       } else if (errorMessage.includes("HTTP 404")) {
//         setResponseStatus("📍 Workflow endpoint not found. Please check system configuration.");
//       } else if (errorMessage.includes("HTTP 500")) {
//         setResponseStatus("⚙️ Server error detected. Our team has been notified and is investigating.");
//       } else {
//         setResponseStatus(`❌ Generation Error: ${errorMessage}`);
//       }
//     } finally {
//       setTimeout(() => {
//         setIsLoadingAI(false);
//         setLoadingMessages([]);
//       }, 1000);
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
//     setCurrentPhase(0);
//     setPhaseProgress(0);
//     setOverallProgress(0);
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

//       if (result.status === "success") {
//         setOverallProgress(100);
//         setResponseStatus("✅ Automation approved! Development team has been notified.");
        
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
        
//         setTimeout(() => {
//           if (setStep) {
//             setStep("dashboard");
//           }
//         }, 3000);
//       } else {
//         throw new Error(result.message || "Approval failed");
//       }
//     } catch (error) {
//       console.error("❌ Approval error:", error);
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
//       setResponseStatus(`❌ Approval failed: ${errorMessage}`);
//       setOverallProgress(100);
//     } finally {
//       setTimeout(() => {
//         setIsLoadingAI(false);
//       }, 1000);
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

//   const toggleStepExpansion = (stepNumber: number): void => {
//     setExpandedSteps(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber);
//       } else {
//         newSet.add(stepNumber);
//       }
//       return newSet;
//     });
//   };

//   // Enhanced Loading Component
//   const LoadingDisplay: React.FC = () => {
//     if (!isLoadingAI) return null;

//     const currentPhaseData = loadingPhases[currentPhase] || loadingPhases[0];
//     const IconComponent = currentPhaseData.icon;

//     return (
//       <div className="flex flex-col items-center justify-center py-16 px-8">
//         {/* Main Loading Visual */}
//         <div className="relative mb-8">
//           <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
//             {/* Animated background */}
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
//             {/* Rotating border */}
//             <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            
//             {/* Inner circle with icon */}
//             <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg">
//               <IconComponent className={`h-10 w-10 ${currentPhaseData.color} animate-pulse`} />
//             </div>
            
//             {/* Floating particles */}
//             <div className="absolute top-4 left-8 w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
//             <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
//             <div className="absolute bottom-6 left-6 w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
//           </div>
//         </div>

//         {/* Progress Information */}
//         <div className="text-center mb-8 max-w-md">
//           <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             {currentPhaseData.title}
//           </h3>
//           <p className="text-muted-foreground mb-4">{currentPhaseData.description}</p>
          
//           {/* Overall Progress Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between text-sm text-muted-foreground mb-2">
//               <span>Overall Progress</span>
//               <span>{Math.round(overallProgress)}%</span>
//             </div>
//             <Progress value={overallProgress} className="h-3 mb-2" />
//             <div className="flex justify-between text-xs text-muted-foreground">
//               <span>{currentPhase + 1} of {loadingPhases.length} phases</span>
//               <span>{estimatedTimeRemaining}s remaining</span>
//             </div>
//           </div>

//           {/* Phase Progress Bar */}
//           <div className="mb-6">
//             <div className="flex justify-between text-sm text-muted-foreground mb-2">
//               <span>Current Phase</span>
//               <span>{Math.round(phaseProgress)}%</span>
//             </div>
//             <Progress value={phaseProgress} className="h-2" />
//           </div>
//         </div>

//         {/* Phase Timeline */}
//         <div className="grid grid-cols-6 gap-4 mb-8 max-w-2xl">
//           {loadingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon;
//             const isCompleted = index < currentPhase;
//             const isCurrent = index === currentPhase;
            
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
//                   isCompleted 
//                     ? 'bg-green-500 border-green-500 text-white' 
//                     : isCurrent 
//                       ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20 ${phase.color}` 
//                       : 'border-gray-300 bg-gray-50 dark:bg-gray-800 text-gray-400'
//                 }`}>
//                   {isCompleted ? (
//                     <CheckCircle className="h-6 w-6" />
//                   ) : (
//                     <PhaseIcon className={`h-6 w-6 ${isCurrent ? 'animate-pulse' : ''}`} />
//                   )}
//                 </div>
//                 <span className={`text-xs mt-2 text-center font-medium ${
//                   isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
//                 }`}>
//                   {phase.title.split(' ')[0]}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         {/* Live Status Messages */}
//         <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-w-md w-full">
//           <div className="flex items-center gap-2 mb-3">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-sm font-medium text-green-600 dark:text-green-400">Live Status</span>
//           </div>
//           <div className="space-y-2 max-h-24 overflow-hidden">
//             {loadingMessages.slice(-3).map((message, index) => (
//               <div key={index} className={`text-xs text-muted-foreground transition-opacity duration-500 ${
//                 index === loadingMessages.length - 1 ? 'opacity-100' : 'opacity-60'
//               }`}>
//                 {message}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Fun Facts */}
//         <div className="mt-8 text-center max-w-md">
//           <div className="text-xs text-muted-foreground p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
//             <Lightbulb className="h-4 w-4 inline mr-2 text-yellow-500" />
//             <strong>Did you know?</strong> Our AI analyzes over 50 automation patterns and 100+ business scenarios to create your perfect workflow.
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Enhanced Workflow Display Component
//   const WorkflowDisplay: React.FC = () => {
//     if (!parsedWorkflow) return null;

//     return (
//       <div className="space-y-8">
//         {/* Header with Metrics */}
//         <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 dark:border-blue-700/50">
//           <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
//           <div className="relative p-8">
//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-3 mb-3">
//                 <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
//                   <Workflow className="h-8 w-8 text-white" />
//                 </div>
//                 <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   {parsedWorkflow.title}
//                 </h3>
//                 <Badge variant="secondary" className="ml-2">
//                   <Star className="h-3 w-3 mr-1" />
//                   AI Generated
//                 </Badge>
//               </div>
//               <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{parsedWorkflow.description}</p>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//               <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-blue-500 mb-1">{parsedWorkflow.metrics?.automationRate}</div>
//                   <div className="text-sm text-muted-foreground">Automation Rate</div>
//                 </CardContent>
//               </Card>
//               <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-green-500 mb-1">{parsedWorkflow.metrics?.responseTime}</div>
//                   <div className="text-sm text-muted-foreground">Response Time</div>
//                 </CardContent>
//               </Card>
//               <Card className="border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-purple-500 mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                   <div className="text-sm text-muted-foreground">Accuracy</div>
//                 </CardContent>
//               </Card>
//               <Card className="border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-orange-500 mb-1">{parsedWorkflow.metrics?.scalability}</div>
//                   <div className="text-sm text-muted-foreground">Scalability</div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="flex items-center justify-center gap-4">
//               <Badge variant="outline" className="font-medium px-4 py-2">
//                 <Settings className="h-4 w-4 mr-2" />
//                 {parsedWorkflow.platform}
//               </Badge>
//               <Badge variant="secondary" className="font-medium px-4 py-2">
//                 <Clock className="h-4 w-4 mr-2" />
//                 {parsedWorkflow.estimatedBuildTime}
//               </Badge>
//               <Badge variant="secondary" className="font-medium px-4 py-2">
//                 <Target className="h-4 w-4 mr-2" />
//                 {parsedWorkflow.complexity}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Interactive Workflow Steps */}
//         <Card className="border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
//             <CardTitle className="flex items-center gap-3">
//               <div className="p-2 bg-blue-500 rounded-lg">
//                 <PlayCircle className="h-5 w-5 text-white" />
//               </div>
//               Workflow Execution Steps
//               <Badge variant="outline" className="ml-auto">
//                 {parsedWorkflow.steps.length} Steps
//               </Badge>
//             </CardTitle>
//             <CardDescription>
//               Click on any step to view detailed implementation information
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="relative">
//               {/* Workflow Timeline */}
//               <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
//               {parsedWorkflow.steps.map((step, index) => {
//                 const isExpanded = expandedSteps.has(step.stepNumber);
//                 const IconComponent = step.icon || Bot;
                
//                 return (
//                   <div key={index} className="relative">
//                     {/* Step Container */}
//                     <div 
//                       className={`ml-16 mr-6 my-4 transition-all duration-300 cursor-pointer ${
//                         isExpanded ? 'transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'
//                       }`}
//                       onClick={() => toggleStepExpansion(step.stepNumber)}
//                     >
//                       <div className={`rounded-xl border-2 transition-all duration-300 ${
//                         isExpanded 
//                           ? 'border-blue-300 dark:border-blue-600 shadow-lg bg-blue-50/50 dark:bg-blue-900/20' 
//                           : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-gray-900'
//                       }`}>
//                         {/* Step Header */}
//                         <div className="p-6">
//                           <div className="flex items-center gap-4">
//                             <div className={`p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg min-w-[3rem] text-center`}>
//                               {step.stepNumber}
//                             </div>
//                             <div className="flex-grow">
//                               <div className="flex items-center gap-3 mb-2">
//                                 <IconComponent className={`h-6 w-6 ${step.color}`} />
//                                 <h4 className="text-xl font-semibold">{step.title}</h4>
//                                 <Badge variant="outline" className="text-xs">
//                                   {step.type}
//                                 </Badge>
//                                 {step.estimatedTime && (
//                                   <Badge variant="secondary" className="text-xs">
//                                     <Clock className="h-3 w-3 mr-1" />
//                                     {step.estimatedTime}
//                                   </Badge>
//                                 )}
//                               </div>
//                               <p className="text-muted-foreground mb-3">{step.description}</p>
                              
//                               {/* Input/Output Preview */}
//                               <div className="flex items-center gap-4 text-sm">
//                                 {step.inputs && (
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                     <span className="text-green-700 dark:text-green-300">
//                                       Input: {step.inputs.join(', ')}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {step.outputs && (
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                     <span className="text-blue-700 dark:text-blue-300">
//                                       Output: {step.outputs.join(', ')}
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {isExpanded ? (
//                                 <ChevronDown className="h-5 w-5 text-muted-foreground" />
//                               ) : (
//                                 <ChevronRight className="h-5 w-5 text-muted-foreground" />
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Expanded Details */}
//                         {isExpanded && (
//                           <div className="border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 p-6">
//                             <div className="grid md:grid-cols-3 gap-6">
//                               <div>
//                                 <h5 className="font-semibold mb-3 flex items-center gap-2">
//                                   <Eye className="h-4 w-4 text-blue-500" />
//                                   Step Details
//                                 </h5>
//                                 <ul className="space-y-2 text-sm text-muted-foreground">
//                                   {step.details?.map((detail, idx) => (
//                                     <li key={idx} className="flex items-start gap-2">
//                                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
//                                       {detail}
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
                              
//                               <div>
//                                 <h5 className="font-semibold mb-3 flex items-center gap-2">
//                                   <Zap className="h-4 w-4 text-yellow-500" />
//                                   Processing
//                                 </h5>
//                                 <div className="space-y-2 text-sm">
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Execution Time:</span>
//                                     <span className="font-medium">{step.estimatedTime}</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Auto-retry:</span>
//                                     <span className="font-medium text-green-600">Enabled</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Error Handling:</span>
//                                     <span className="font-medium text-blue-600">Advanced</span>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div>
//                                 <h5 className="font-semibold mb-3 flex items-center gap-2">
//                                   <GitBranch className="h-4 w-4 text-purple-500" />
//                                   Flow Control
//                                 </h5>
//                                 <div className="space-y-2 text-sm">
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                                     <span>Success Path</span>
//                                   </div>
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                                     <span>Validation Branch</span>
//                                   </div>
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                                     <span>Error Fallback</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Step Number Circle */}
//                     <div className="absolute left-6 top-8 z-20">
//                       <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <IconComponent className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Additional sections would continue here... */}
//         {/* For brevity, I'll include the key sections */}

//         {/* Required Integrations */}
//         {parsedWorkflow.integrations.length > 0 && (
//           <Card className="border-2 border-orange-200 dark:border-orange-800">
//             <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
//               <CardTitle className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-500 rounded-lg">
//                   <Zap className="h-5 w-5 text-white" />
//                 </div>
//                 Required Platform Integrations
//                 <Badge variant="outline" className="ml-auto">
//                   {parsedWorkflow.integrations.filter(i => i.required).length} Required
//                 </Badge>
//               </CardTitle>
//               <CardDescription>
//                 These integrations will be configured during the development phase
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {parsedWorkflow.integrations.map((integration, index) => {
//                   const IconComponent = integration.icon || Globe;
//                   return (
//                     <div key={index} className="group relative overflow-hidden rounded-lg border border-orange-200 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 transition-all hover:shadow-md hover:scale-105">
//                       <div className="flex items-start gap-3 mb-3">
//                         <div className="p-2 bg-orange-500 rounded-lg">
//                           <IconComponent className="h-4 w-4 text-white" />
//                         </div>
//                         <div className="flex-grow min-w-0">
//                           <h5 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{integration.name}</h5>
//                           <div className="flex items-center gap-2 mt-1">
//                             {integration.required && (
//                               <Badge variant="destructive" className="text-xs">Required</Badge>
//                             )}
//                             <Badge variant="outline" className="text-xs">
//                               {integration.status?.replace('_', ' ')}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{integration.description}</p>
//                       <div className="text-xs text-muted-foreground border-t border-orange-200/50 dark:border-orange-700/50 pt-2">
//                         <div className="flex items-center gap-1">
//                           <Settings className="h-3 w-3" />
//                           {integration.setupInstructions}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Raw AI Response Toggle */}
//         <Card className="border border-gray-200 dark:border-gray-700">
//           <CardContent className="p-6">
//             <Button
//               variant="outline"
//               onClick={() => setShowRawResponse(!showRawResponse)}
//               className="mb-4 flex items-center gap-2"
//             >
//               <FileText className="h-4 w-4" />
//               {showRawResponse ? "Hide" : "Show"} Raw AI Response
//             </Button>
//             {showRawResponse && (
//               <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96">
//                   {aiRawResponse}
//                 </pre>
//               </div>
//             )}
//           </CardContent>
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
//               Describe your automation needs and our enterprise-grade AI will design a complete workflow for Instagram, Facebook, and other social platforms.
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
//                       Generate Enterprise Automation
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
//                         Approve & Deploy
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
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto">
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                       Enterprise Ready
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription>
//                   Real-time AI-designed automation workflow for your social media platforms
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Loading State */}
//                 {isLoadingAI && <LoadingDisplay />}
                
//                 {/* Success State - Show Workflow */}
//                 {!isLoadingAI && parsedWorkflow && <WorkflowDisplay />}
                
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
//                     </div>
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
//                       Describe your social media automation needs and our enterprise-grade AI will generate a complete, production-ready workflow design.
//                     </p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Enterprise AI</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Production Ready</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Team Integration</span>
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














// "use client"

// import type React from "react"
// import { useState, useCallback, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
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
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Globe,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket,
// } from "lucide-react"

// // TypeScript interfaces
// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   selectedWorkflowId?: string | null
//   setStep?: (step: "selection" | "dashboard") => void
//   setActiveWorkflowExists?: (exists: boolean) => void
//   setActiveWorkflowDetails?: (details: any) => void
// }

// interface WorkflowStep {
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   integrations?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   details?: string[]
// }

// interface Integration {
//   name: string
//   type: string
//   description: string
//   required: boolean
//   setupInstructions: string
//   status?: "available" | "requires_setup" | "premium"
//   icon?: React.ComponentType<{ className?: string }>
// }

// interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits: string[]
//   exampleScenario: string
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface LoadingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   duration: number
//   color: string
// }

// // Mock business info for demo
// const mockBusinessInfo = {
//   businessName: "TechCorp Solutions",
//   businessType: "Technology Company",
//   description: "We provide innovative tech solutions for businesses",
//   website: "https://techcorp.com",
//   phone: "+1-555-0123",
//   email: "contact@techcorp.com",
// }

// // Loading phases for AI workflow generation
// const loadingPhases: LoadingPhase[] = [
//   {
//     id: "analyze",
//     title: "Analyzing Requirements",
//     description: "Our AI is understanding your business needs and automation goals",
//     icon: Brain,
//     duration: 15,
//     color: "text-blue-500",
//   },
//   {
//     id: "design",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and automation pathways",
//     icon: Code,
//     duration: 25,
//     color: "text-purple-500",
//   },
//   {
//     id: "optimize",
//     title: "Optimizing Performance",
//     description: "Fine-tuning automation rules and response accuracy",
//     icon: Cpu,
//     duration: 20,
//     color: "text-green-500",
//   },
//   {
//     id: "integrate",
//     title: "Planning Integrations",
//     description: "Mapping platform APIs and data flow connections",
//     icon: Zap,
//     duration: 15,
//     color: "text-orange-500",
//   },
//   {
//     id: "validate",
//     title: "Validating Solution",
//     description: "Running quality checks and business logic validation",
//     icon: Shield,
//     duration: 15,
//     color: "text-cyan-500",
//   },
//   {
//     id: "finalize",
//     title: "Finalizing Design",
//     description: "Compiling comprehensive automation blueprint",
//     icon: Rocket,
//     duration: 10,
//     color: "text-pink-500",
//   },
// ]

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = mockBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [aiRawResponse, setAiRawResponse] = useState<string>("")
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
//   const [responseStatus, setResponseStatus] = useState<string | null>(null)
//   const [requestId, setRequestId] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [showRawResponse, setShowRawResponse] = useState<boolean>(false)
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

//   // Enhanced loading states
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [phaseProgress, setPhaseProgress] = useState<number>(0)
//   const [overallProgress, setOverallProgress] = useState<number>(0)
//   const [loadingMessages, setLoadingMessages] = useState<string[]>([])
//   const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0)

//   const n8nWebhookUrl = "/api/n8n-proxy" // This will be proxied to your actual n8n webhook

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//   ]

//   // Enhanced loading simulation
//   useEffect(() => {
//     if (!isLoadingAI) return

//     const totalDuration = loadingPhases.reduce((sum, phase) => sum + phase.duration, 0)
//     let elapsed = 0

//     const interval = setInterval(() => {
//       elapsed += 1

//       // Calculate current phase
//       let currentElapsed = 0
//       let newPhase = 0
//       for (let i = 0; i < loadingPhases.length; i++) {
//         if (currentElapsed + loadingPhases[i].duration >= elapsed) {
//           newPhase = i
//           break
//         }
//         currentElapsed += loadingPhases[i].duration
//       }

//       setCurrentPhase(newPhase)

//       // Calculate phase progress
//       const phaseElapsed = elapsed - currentElapsed
//       const currentPhaseDuration = loadingPhases[newPhase]?.duration || 1
//       const newPhaseProgress = Math.min((phaseElapsed / currentPhaseDuration) * 100, 100)
//       setPhaseProgress(newPhaseProgress)

//       // Calculate overall progress
//       const newOverallProgress = Math.min((elapsed / totalDuration) * 100, 95)
//       setOverallProgress(newOverallProgress)

//       // Update estimated time remaining
//       setEstimatedTimeRemaining(Math.max(totalDuration - elapsed, 0))

//       // Add loading messages
//       if (elapsed % 8 === 0 && newPhase < loadingPhases.length) {
//         const messages = [
//           `🧠 Processing ${selectedChannels.length} platform${selectedChannels.length > 1 ? "s" : ""}...`,
//           `⚡ Analyzing ${automationFeatures.length} automation feature${automationFeatures.length > 1 ? "s" : ""}...`,
//           `🔄 Designing workflow for ${businessInfo.businessType}...`,
//           `📊 Calculating ROI and performance metrics...`,
//           `🎯 Optimizing for customer satisfaction...`,
//           `🚀 Preparing enterprise-grade solution...`,
//         ]

//         setLoadingMessages((prev) => {
//           const newMessages = [...prev, messages[Math.floor(Math.random() * messages.length)]]
//           return newMessages.slice(-4) // Keep only last 4 messages
//         })
//       }
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [isLoadingAI, selectedChannels.length, automationFeatures.length, businessInfo.businessType])

//   // Enhanced function to parse AI markdown response into structured workflow
//   const parseAIResponse = (markdownText: string): ParsedWorkflow | null => {
//     try {
//       if (!markdownText || markdownText.trim().length === 0) {
//         return null
//       }

//       const lines = markdownText.split("\n")
//       const workflow: Partial<ParsedWorkflow> = {
//         steps: [],
//         integrations: [],
//         benefits: [],
//         technicalRequirements: [],
//         deploymentChannels: selectedChannels,
//         metrics: {
//           automationRate: "85%",
//           responseTime: "< 2 seconds",
//           accuracy: "92%",
//           scalability: "High",
//         },
//       }

//       let currentSection = ""
//       let stepCounter = 1

//       // Step type mapping for icons and colors
//       const stepTypeMapping: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
//         trigger: { icon: PlayCircle, color: "text-green-500" },
//         filter: { icon: Filter, color: "text-blue-500" },
//         analysis: { icon: BarChart3, color: "text-purple-500" },
//         response: { icon: MessageCircle, color: "text-orange-500" },
//         notification: { icon: Bell, color: "text-red-500" },
//         integration: { icon: Zap, color: "text-yellow-500" },
//         storage: { icon: Database, color: "text-gray-500" },
//         routing: { icon: GitBranch, color: "text-indigo-500" },
//         validation: { icon: Shield, color: "text-cyan-500" },
//         automation: { icon: Bot, color: "text-pink-500" },
//       }

//       for (let i = 0; i < lines.length; i++) {
//         const line = lines[i].trim()

//         if (line.startsWith("# ")) {
//           workflow.title = line.substring(2).trim()
//         } else if (line.startsWith("## ")) {
//           currentSection = line.substring(3).toLowerCase().trim()
//         } else if (line.includes("**Description:**")) {
//           workflow.description = line.replace(/.*\*\*Description:\*\*\s*/, "").trim()
//         } else if (line.includes("**Platform:**")) {
//           workflow.platform = line.replace(/.*\*\*Platform:\*\*\s*/, "").trim()
//         } else if (line.includes("**Estimated Build Time:**")) {
//           workflow.estimatedBuildTime = line.replace(/.*\*\*Estimated Build Time:\*\*\s*/, "").trim()
//         } else if (line.includes("**Complexity:**")) {
//           workflow.complexity = line.replace(/.*\*\*Complexity:\*\*\s*/, "").trim()
//         } else if (
//           currentSection.includes("workflow") ||
//           currentSection.includes("steps") ||
//           currentSection.includes("process")
//         ) {
//           if (line.match(/^\d+\./)) {
//             const stepText = line.replace(/^\d+\.\s*/, "")
//             const [title, ...descParts] = stepText.split(":")

//             // Determine step type based on keywords
//             let stepType = "automation"
//             const titleLower = title.toLowerCase()
//             if (titleLower.includes("trigger") || titleLower.includes("start") || titleLower.includes("receive"))
//               stepType = "trigger"
//             else if (titleLower.includes("filter") || titleLower.includes("check") || titleLower.includes("validate"))
//               stepType = "filter"
//             else if (
//               titleLower.includes("analyze") ||
//               titleLower.includes("sentiment") ||
//               titleLower.includes("intent")
//             )
//               stepType = "analysis"
//             else if (titleLower.includes("respond") || titleLower.includes("reply") || titleLower.includes("send"))
//               stepType = "response"
//             else if (titleLower.includes("notify") || titleLower.includes("alert") || titleLower.includes("escalate"))
//               stepType = "notification"
//             else if (titleLower.includes("store") || titleLower.includes("save") || titleLower.includes("log"))
//               stepType = "storage"
//             else if (titleLower.includes("route") || titleLower.includes("assign") || titleLower.includes("forward"))
//               stepType = "routing"

//             const typeInfo = stepTypeMapping[stepType] || stepTypeMapping["automation"]

//             workflow.steps?.push({
//               stepNumber: stepCounter++,
//               title: title.trim(),
//               description: descParts.join(":").trim() || title.trim(),
//               type: stepType,
//               icon: typeInfo.icon,
//               color: typeInfo.color,
//               estimatedTime: stepType === "trigger" ? "< 1s" : stepType === "analysis" ? "2-3s" : "1-2s",
//               inputs: stepType === "trigger" ? ["User Message"] : ["Previous Step Output"],
//               outputs: stepType === "response" ? ["Automated Response"] : ["Processed Data"],
//               details: [
//                 `Processes ${stepType} logic automatically`,
//                 `Integrates with selected platforms`,
//                 `Maintains conversation context`,
//               ],
//             })
//           }
//         } else if (currentSection.includes("integration")) {
//           if (line.startsWith("- ") || line.startsWith("* ")) {
//             const integrationText = line.substring(2)
//             const [name, ...descParts] = integrationText.split(":")

//             // Determine integration icon
//             let integrationIcon = Zap
//             const nameLower = name.toLowerCase()
//             if (nameLower.includes("instagram") || nameLower.includes("facebook")) integrationIcon = MessageSquare
//             else if (nameLower.includes("whatsapp") || nameLower.includes("telegram")) integrationIcon = Phone
//             else if (nameLower.includes("email") || nameLower.includes("smtp")) integrationIcon = Mail
//             else if (nameLower.includes("database") || nameLower.includes("storage")) integrationIcon = Database
//             else if (nameLower.includes("api") || nameLower.includes("webhook")) integrationIcon = Globe

//             workflow.integrations?.push({
//               name: name.trim(),
//               type: "api",
//               description: descParts.join(":").trim() || "Integration required for workflow",
//               required: true,
//               setupInstructions: "Configuration required during implementation",
//               status: "requires_setup",
//               icon: integrationIcon,
//             })
//           }
//         } else if (currentSection.includes("benefit")) {
//           if (line.startsWith("- ") || line.startsWith("* ")) {
//             workflow.benefits?.push(line.substring(2).trim())
//           }
//         } else if (currentSection.includes("scenario") || currentSection.includes("example")) {
//           if (line.length > 0 && !line.startsWith("#") && !line.startsWith("*")) {
//             workflow.exampleScenario = (workflow.exampleScenario || "") + line + " "
//           }
//         } else if (currentSection.includes("technical") || currentSection.includes("requirement")) {
//           if (line.startsWith("- ") || line.startsWith("* ")) {
//             workflow.technicalRequirements?.push(line.substring(2).trim())
//           }
//         }
//       }

//       // Set defaults if not found
//       workflow.title = workflow.title || "AI-Generated Social Media Automation"
//       workflow.description = workflow.description || "Custom automation workflow for social media platforms"
//       workflow.platform = workflow.platform || "Multi-Platform"
//       workflow.estimatedBuildTime = workflow.estimatedBuildTime || "2-3 weeks"
//       workflow.complexity = workflow.complexity || "Medium"
//       workflow.exampleScenario = workflow.exampleScenario?.trim() || "Automated customer interaction workflow"

//       return workflow as ParsedWorkflow
//     } catch (error) {
//       console.error("Error parsing AI response:", error)
//       return null
//     }
//   }

 




// const generateWorkflow = useCallback(
//     async (action: "initial" | "refine", instructions?: string, currentDesign?: string): Promise<void> => {
//       setIsLoadingAI(true)
//       setCurrentPhase(0)
//       setPhaseProgress(0)
//       setOverallProgress(0)
//       setLoadingMessages([])
//       setEstimatedTimeRemaining(100)
//       setResponseStatus("🚀 Initializing AI workflow designer...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       // Create AbortController for request cancellation
//       const abortController = new AbortController()
//       const timeoutId = setTimeout(() => {
//         abortController.abort()
//       }, 300000) // 5 minutes timeout

//       try {
//         const payload = {
//           action: action,
//           platform: "social-media-automation",
//           userEmail: businessInfo.email || "no-email@example.com",
//           businessName: businessInfo.businessName,
//           businessType: businessInfo.businessType,
//           businessDescription: businessInfo.description,
//           website: businessInfo.website,
//           phone: businessInfo.phone,
//           selectedChannels: selectedChannels,
//           automationFeatures: automationFeatures,
//           workflowRequest: workflowRequest,
//           initialPrompt:
//             action === "initial"
//               ? workflowRequest
//               : `Previous request: ${workflowRequest}. Refinement: ${instructions || ""}`,
//           ...(requestId && { requestId }),
//           ...(instructions && { refinementInstructions: instructions }),
//           ...(currentDesign && { currentWorkflowDesign: currentDesign }),
//         }

//         console.log("🚀 Sending request to N8N proxy:", {
//           action: payload.action,
//           platform: payload.platform,
//           businessName: payload.businessName,
//           channelsCount: payload.selectedChannels.length,
//         })

//         setResponseStatus("🔗 Connecting to AI workflow engine...")

//         const response = await fetch(n8nWebhookUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-Client-Version": "1.0",
//             "X-Request-Source": "workflow-builder-ui",
//           },
//           body: JSON.stringify(payload),
//           signal: abortController.signal,
//         })

//         clearTimeout(timeoutId)
//         console.log("📡 API Response status:", response.status)

//         // Handle different HTTP status codes
//         if (!response.ok) {
//           let errorMessage = `HTTP ${response.status}: ${response.statusText}`
//           let userFriendlyMessage = "🔧 Technical issue detected."

//           try {
//             const errorData = await response.json()
//             errorMessage = errorData.error || errorMessage
//             userFriendlyMessage = getErrorMessage(response.status, errorData.details || errorMessage)
//           } catch {
//             // If JSON parsing fails, use the default error message
//             userFriendlyMessage = getErrorMessage(response.status, errorMessage)
//           }

//           throw new Error(userFriendlyMessage)
//         }

//         const result = await response.json()
//         console.log("📋 API Response data:", {
//           status: result.status,
//           hasWorkflowDesign: !!result.workflowDesign,
//           requestId: result.requestId,
//           processingTime: result.processingTime,
//         })

//         // Complete loading animation
//         setCurrentPhase(loadingPhases.length - 1)
//         setPhaseProgress(100)
//         setOverallProgress(100)

//         if (result.status === "success" && result.workflowDesign) {
//           setAiRawResponse(result.workflowDesign)
//           const parsed = parseAIResponse(result.workflowDesign)

//           if (parsed) {
//             setParsedWorkflow(parsed)
//             setResponseStatus(
//               `✅ Enterprise-grade workflow generated successfully! ${
//                 result.processingTime ? `(${Math.round(result.processingTime / 1000)}s)` : ""
//               }`
//             )
//           } else {
//             setResponseStatus("⚠️ Generated workflow but had parsing issues. Check raw response.")
//           }

//           if (!requestId && result.requestId) {
//             setRequestId(result.requestId)
//           }
//         } else if (result.status === "retry_needed") {
//           setResponseStatus("🔄 Enhancing workflow quality - AI is refining the design...")
//           // The proxy will handle retry automatically
//         } else if (result.status === "error") {
//           throw new Error(result.message || "AI workflow generation failed")
//         } else {
//           throw new Error(`Unexpected response status: ${result.status}`)
//         }
//       } catch (error) {
//         clearTimeout(timeoutId)
//         console.error("❌ Workflow generation error:", error)
        
//         setOverallProgress(100)
//         setCurrentPhase(loadingPhases.length - 1)

//         let errorMessage = "Unknown error occurred"
        
//         if (error instanceof Error) {
//           if (error.name === 'AbortError') {
//             errorMessage = "⏱️ Request timeout: The AI is working on a complex design. Please try again in a moment."
//           } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
//             errorMessage = "🌐 Connection error: Please check your internet connection and try again."
//           } else if (error.message.startsWith('🔧') || error.message.startsWith('⚠️') || error.message.startsWith('⏱️')) {
//             // User-friendly messages from the error handler
//             errorMessage = error.message
//           } else {
//             errorMessage = `❌ Generation Error: ${error.message}`
//           }
//         }

//         setResponseStatus(errorMessage)
//       } finally {
//         clearTimeout(timeoutId)
//         setTimeout(() => {
//           setIsLoadingAI(false)
//           setLoadingMessages([])
//         }, 1000)
//       }
//     },
//     [n8nWebhookUrl, businessInfo, selectedChannels, automationFeatures, workflowRequest, requestId],
//   )

//   // Helper function to get user-friendly error messages
//   const getErrorMessage = (status: number, details: string): string => {
//     switch (status) {
//       case 400:
//         return "⚠️ Invalid request: Please check your input and try again."
//       case 408:
//         return "⏱️ Request timeout: The AI is working on a complex design. Please try again in a moment."
//       case 429:
//         return "🚦 Too many requests: Please wait a moment before trying again."
//       case 500:
//         return "🔧 Server error: Our team has been notified and is investigating."
//       case 502:
//       case 503:
//       case 504:
//         return "🔌 Service temporarily unavailable: Please try again in a few minutes."
//       default:
//         return `🔧 Technical issue (${status}): ${details}`
//     }
//   }




//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your social media automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one social media platform")
//       return
//     }
//     generateWorkflow("initial")
//   }

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions")
//       return
//     }
//     generateWorkflow("refine", refinementInput, aiRawResponse)
//     setRefinementInput("")
//   }

//   const handleApprove = async (): Promise<void> => {
//     setIsLoadingAI(true)
//     setCurrentPhase(0)
//     setPhaseProgress(0)
//     setOverallProgress(0)
//     setResponseStatus("📧 Sending final automation design to the development team...")
//     setCurrentAction("approve")

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
//       }

//       const response = await fetch(n8nWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }

//       const result = await response.json()

//       if (result.status === "success") {
//         setOverallProgress(100)
//         setResponseStatus("✅ Automation approved! Development team has been notified.")

//         if (setActiveWorkflowExists) {
//           setActiveWorkflowExists(true)
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
//           })
//         }

//         setTimeout(() => {
//           if (setStep) {
//             setStep("dashboard")
//           }
//         }, 3000)
//       } else {
//         throw new Error(result.message || "Approval failed")
//       }
//     } catch (error) {
//       console.error("❌ Approval error:", error)
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
//       setResponseStatus(`❌ Approval failed: ${errorMessage}`)
//       setOverallProgress(100)
//     } finally {
//       setTimeout(() => {
//         setIsLoadingAI(false)
//       }, 1000)
//     }
//   }

//   const handleChannelToggle = (channelId: string): void => {
//     setSelectedChannels((prev) =>
//       prev.includes(channelId) ? prev.filter((c) => c !== channelId) : [...prev, channelId],
//     )
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures((prev) => [...prev, featureId])
//     } else {
//       setAutomationFeatures((prev) => prev.filter((f) => f !== featureId))
//     }
//   }

//   const toggleStepExpansion = (stepNumber: number): void => {
//     setExpandedSteps((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   // Enhanced Loading Component
//   const LoadingDisplay: React.FC = () => {
//     if (!isLoadingAI) return null

//     const currentPhaseData = loadingPhases[currentPhase] || loadingPhases[0]
//     const IconComponent = currentPhaseData.icon

//     return (
//       <div className="flex flex-col items-center justify-center py-16 px-8">
//         {/* Main Loading Visual */}
//         <div className="relative mb-8">
//           <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
//             {/* Animated background */}
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

//             {/* Rotating border */}
//             <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>

//             {/* Inner circle with icon */}
//             <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg">
//               <IconComponent className={`h-10 w-10 ${currentPhaseData.color} animate-pulse`} />
//             </div>

//             {/* Floating particles */}
//             <div
//               className="absolute top-4 left-8 w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//               style={{ animationDelay: "0s" }}
//             ></div>
//             <div
//               className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
//               style={{ animationDelay: "0.5s" }}
//             ></div>
//             <div
//               className="absolute bottom-6 left-6 w-1 h-1 bg-pink-500 rounded-full animate-bounce"
//               style={{ animationDelay: "1s" }}
//             ></div>
//           </div>
//         </div>

//         {/* Progress Information */}
//         <div className="text-center mb-8 max-w-md">
//           <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             {currentPhaseData.title}
//           </h3>
//           <p className="text-muted-foreground mb-4">{currentPhaseData.description}</p>

//           {/* Overall Progress Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between text-sm text-muted-foreground mb-2">
//               <span>Overall Progress</span>
//               <span>{Math.round(overallProgress)}%</span>
//             </div>
//             <Progress value={overallProgress} className="h-3 mb-2" />
//             <div className="flex justify-between text-xs text-muted-foreground">
//               <span>
//                 {currentPhase + 1} of {loadingPhases.length} phases
//               </span>
//               <span>{estimatedTimeRemaining}s remaining</span>
//             </div>
//           </div>

//           {/* Phase Progress Bar */}
//           <div className="mb-6">
//             <div className="flex justify-between text-sm text-muted-foreground mb-2">
//               <span>Current Phase</span>
//               <span>{Math.round(phaseProgress)}%</span>
//             </div>
//             <Progress value={phaseProgress} className="h-2" />
//           </div>
//         </div>

//         {/* Phase Timeline */}
//         <div className="grid grid-cols-6 gap-4 mb-8 max-w-2xl">
//           {loadingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             const isCompleted = index < currentPhase
//             const isCurrent = index === currentPhase

//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
//                     isCompleted
//                       ? "bg-green-500 border-green-500 text-white"
//                       : isCurrent
//                         ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20 ${phase.color}`
//                         : "border-gray-300 bg-gray-50 dark:bg-gray-800 text-gray-400"
//                   }`}
//                 >
//                   {isCompleted ? (
//                     <CheckCircle className="h-6 w-6" />
//                   ) : (
//                     <PhaseIcon className={`h-6 w-6 ${isCurrent ? "animate-pulse" : ""}`} />
//                   )}
//                 </div>
//                 <span
//                   className={`text-xs mt-2 text-center font-medium ${
//                     isCurrent ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
//                   }`}
//                 >
//                   {phase.title.split(" ")[0]}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* Live Status Messages */}
//         <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-w-md w-full">
//           <div className="flex items-center gap-2 mb-3">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-sm font-medium text-green-600 dark:text-green-400">Live Status</span>
//           </div>
//           <div className="space-y-2 max-h-24 overflow-hidden">
//             {loadingMessages.slice(-3).map((message, index) => (
//               <div
//                 key={index}
//                 className={`text-xs text-muted-foreground transition-opacity duration-500 ${
//                   index === loadingMessages.length - 1 ? "opacity-100" : "opacity-60"
//                 }`}
//               >
//                 {message}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Fun Facts */}
//         <div className="mt-8 text-center max-w-md">
//           <div className="text-xs text-muted-foreground p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
//             <Lightbulb className="h-4 w-4 inline mr-2 text-yellow-500" />
//             <strong>Did you know?</strong> Our AI analyzes over 50 automation patterns and 100+ business scenarios to
//             create your perfect workflow.
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Enhanced Workflow Display Component
//   const WorkflowDisplay: React.FC = () => {
//     if (!parsedWorkflow) return null

//     return (
//       <div className="space-y-8">
//         {/* Header with Metrics */}
//         <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 dark:border-blue-700/50">
//           <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
//           <div className="relative p-8">
//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-3 mb-3">
//                 <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
//                   <Workflow className="h-8 w-8 text-white" />
//                 </div>
//                 <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   {parsedWorkflow.title}
//                 </h3>
//                 <Badge variant="secondary" className="ml-2">
//                   <Star className="h-3 w-3 mr-1" />
//                   AI Generated
//                 </Badge>
//               </div>
//               <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{parsedWorkflow.description}</p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//               <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-blue-500 mb-1">{parsedWorkflow.metrics?.automationRate}</div>
//                   <div className="text-sm text-muted-foreground">Automation Rate</div>
//                 </CardContent>
//               </Card>
//               <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-green-500 mb-1">{parsedWorkflow.metrics?.responseTime}</div>
//                   <div className="text-sm text-muted-foreground">Response Time</div>
//                 </CardContent>
//               </Card>
//               <Card className="border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-purple-500 mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                   <div className="text-sm text-muted-foreground">Accuracy</div>
//                 </CardContent>
//               </Card>
//               <Card className="border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-orange-500 mb-1">{parsedWorkflow.metrics?.scalability}</div>
//                   <div className="text-sm text-muted-foreground">Scalability</div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="flex items-center justify-center gap-4">
//               <Badge variant="outline" className="font-medium px-4 py-2">
//                 <Settings className="h-4 w-4 mr-2" />
//                 {parsedWorkflow.platform}
//               </Badge>
//               <Badge variant="secondary" className="font-medium px-4 py-2">
//                 <Clock className="h-4 w-4 mr-2" />
//                 {parsedWorkflow.estimatedBuildTime}
//               </Badge>
//               <Badge variant="secondary" className="font-medium px-4 py-2">
//                 <Target className="h-4 w-4 mr-2" />
//                 {parsedWorkflow.complexity}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Interactive Workflow Steps */}
//         <Card className="border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
//             <CardTitle className="flex items-center gap-3">
//               <div className="p-2 bg-blue-500 rounded-lg">
//                 <PlayCircle className="h-5 w-5 text-white" />
//               </div>
//               Workflow Execution Steps
//               <Badge variant="outline" className="ml-auto">
//                 {parsedWorkflow.steps.length} Steps
//               </Badge>
//             </CardTitle>
//             <CardDescription>Click on any step to view detailed implementation information</CardDescription>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="relative">
//               {/* Workflow Timeline */}
//               <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>

//               {parsedWorkflow.steps.map((step, index) => {
//                 const isExpanded = expandedSteps.has(step.stepNumber)
//                 const IconComponent = step.icon || Bot

//                 return (
//                   <div key={index} className="relative">
//                     {/* Step Container */}
//                     <div
//                       className={`ml-16 mr-6 my-4 transition-all duration-300 cursor-pointer ${
//                         isExpanded ? "transform scale-[1.02]" : "hover:transform hover:scale-[1.01]"
//                       }`}
//                       onClick={() => toggleStepExpansion(step.stepNumber)}
//                     >
//                       <div
//                         className={`rounded-xl border-2 transition-all duration-300 ${
//                           isExpanded
//                             ? "border-blue-300 dark:border-blue-600 shadow-lg bg-blue-50/50 dark:bg-blue-900/20"
//                             : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-gray-900"
//                         }`}
//                       >
//                         {/* Step Header */}
//                         <div className="p-6">
//                           <div className="flex items-center gap-4">
//                             <div
//                               className={`p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg min-w-[3rem] text-center`}
//                             >
//                               {step.stepNumber}
//                             </div>
//                             <div className="flex-grow">
//                               <div className="flex items-center gap-3 mb-2">
//                                 <IconComponent className={`h-6 w-6 ${step.color}`} />
//                                 <h4 className="text-xl font-semibold">{step.title}</h4>
//                                 <Badge variant="outline" className="text-xs">
//                                   {step.type}
//                                 </Badge>
//                                 {step.estimatedTime && (
//                                   <Badge variant="secondary" className="text-xs">
//                                     <Clock className="h-3 w-3 mr-1" />
//                                     {step.estimatedTime}
//                                   </Badge>
//                                 )}
//                               </div>
//                               <p className="text-muted-foreground mb-3">{step.description}</p>

//                               {/* Input/Output Preview */}
//                               <div className="flex items-center gap-4 text-sm">
//                                 {step.inputs && (
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                     <span className="text-green-700 dark:text-green-300">
//                                       Input: {step.inputs.join(", ")}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {step.outputs && (
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                     <span className="text-blue-700 dark:text-blue-300">
//                                       Output: {step.outputs.join(", ")}
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {isExpanded ? (
//                                 <ChevronDown className="h-5 w-5 text-muted-foreground" />
//                               ) : (
//                                 <ChevronRight className="h-5 w-5 text-muted-foreground" />
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Expanded Details */}
//                         {isExpanded && (
//                           <div className="border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 p-6">
//                             <div className="grid md:grid-cols-3 gap-6">
//                               <div>
//                                 <h5 className="font-semibold mb-3 flex items-center gap-2">
//                                   <Eye className="h-4 w-4 text-blue-500" />
//                                   Step Details
//                                 </h5>
//                                 <ul className="space-y-2 text-sm text-muted-foreground">
//                                   {step.details?.map((detail, idx) => (
//                                     <li key={idx} className="flex items-start gap-2">
//                                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
//                                       {detail}
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>

//                               <div>
//                                 <h5 className="font-semibold mb-3 flex items-center gap-2">
//                                   <Zap className="h-4 w-4 text-yellow-500" />
//                                   Processing
//                                 </h5>
//                                 <div className="space-y-2 text-sm">
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Execution Time:</span>
//                                     <span className="font-medium">{step.estimatedTime}</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Auto-retry:</span>
//                                     <span className="font-medium text-green-600">Enabled</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Error Handling:</span>
//                                     <span className="font-medium text-blue-600">Advanced</span>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div>
//                                 <h5 className="font-semibold mb-3 flex items-center gap-2">
//                                   <GitBranch className="h-4 w-4 text-purple-500" />
//                                   Flow Control
//                                 </h5>
//                                 <div className="space-y-2 text-sm">
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                                     <span>Success Path</span>
//                                   </div>
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                                     <span>Validation Branch</span>
//                                   </div>
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                                     <span>Error Fallback</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Step Number Circle */}
//                     <div className="absolute left-6 top-8 z-20">
//                       <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <IconComponent className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Required Integrations */}
//         {parsedWorkflow.integrations.length > 0 && (
//           <Card className="border-2 border-orange-200 dark:border-orange-800">
//             <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
//               <CardTitle className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-500 rounded-lg">
//                   <Zap className="h-5 w-5 text-white" />
//                 </div>
//                 Required Platform Integrations
//                 <Badge variant="outline" className="ml-auto">
//                   {parsedWorkflow.integrations.filter((i) => i.required).length} Required
//                 </Badge>
//               </CardTitle>
//               <CardDescription>These integrations will be configured during the development phase</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {parsedWorkflow.integrations.map((integration, index) => {
//                   const IconComponent = integration.icon || Globe
//                   return (
//                     <div
//                       key={index}
//                       className="group relative overflow-hidden rounded-lg border border-orange-200 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 transition-all hover:shadow-md hover:scale-105"
//                     >
//                       <div className="flex items-start gap-3 mb-3">
//                         <div className="p-2 bg-orange-500 rounded-lg">
//                           <IconComponent className="h-4 w-4 text-white" />
//                         </div>
//                         <div className="flex-grow min-w-0">
//                           <h5 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
//                             {integration.name}
//                           </h5>
//                           <div className="flex items-center gap-2 mt-1">
//                             {integration.required && (
//                               <Badge variant="destructive" className="text-xs">
//                                 Required
//                               </Badge>
//                             )}
//                             <Badge variant="outline" className="text-xs">
//                               {integration.status?.replace("_", " ")}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{integration.description}</p>
//                       <div className="text-xs text-muted-foreground border-t border-orange-200/50 dark:border-orange-700/50 pt-2">
//                         <div className="flex items-center gap-1">
//                           <Settings className="h-3 w-3" />
//                           {integration.setupInstructions}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Raw AI Response Toggle */}
//         <Card className="border border-gray-200 dark:border-gray-700">
//           <CardContent className="p-6">
//             <Button
//               variant="outline"
//               onClick={() => setShowRawResponse(!showRawResponse)}
//               className="mb-4 flex items-center gap-2"
//             >
//               <FileText className="h-4 w-4" />
//               {showRawResponse ? "Hide" : "Show"} Raw AI Response
//             </Button>
//             {showRawResponse && (
//               <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96">{aiRawResponse}</pre>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

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
//               Describe your automation needs and our enterprise-grade AI will design a complete workflow for Instagram,
//               Facebook, and other social platforms.
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
//                     : "Provide feedback to improve the automation design"}
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
//                                 ? "bg-blue-500 text-white border-blue-500"
//                                 : "bg-background border-border hover:border-blue-300"
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
//                           <label key={feature.id} className="flex items-center gap-2 cursor-pointer">
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
//                       Generate Enterprise Automation
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
//                         {isLoadingAI && currentAction === "refine" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <RefreshCw className="h-4 w-4" />
//                         )}
//                         Refine
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isLoadingAI || !parsedWorkflow}
//                         className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                       >
//                         {isLoadingAI && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Approve & Deploy
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
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
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
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto">
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                       Enterprise Ready
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription>
//                   Real-time AI-designed automation workflow for your social media platforms
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Loading State */}
//                 {isLoadingAI && <LoadingDisplay />}

//                 {/* Success State - Show Workflow */}
//                 {!isLoadingAI && parsedWorkflow && <WorkflowDisplay />}

//                 {/* Error State */}
//                 {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("❌") && (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
//                       <AlertCircle className="h-8 w-8 text-red-500" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-red-600 mb-2">Generation Failed</h3>
//                     <p className="text-sm text-muted-foreground text-center max-w-md mb-4">{responseStatus}</p>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           setResponseStatus(null)
//                           setHasInitialRequest(false)
//                           setParsedWorkflow(null) // Clear previous parsed workflow on retry
//                           setAiRawResponse("") // Clear raw response
//                           setWorkflowRequest("") // Clear initial request
//                           setRefinementInput("") // Clear refinement input
//                         }}
//                         className="flex items-center gap-2"
//                       >
//                         <RefreshCw className="h-4 w-4" />
//                         Try Again
//                       </Button>
//                     </div>
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
//                       Describe your social media automation needs and our enterprise-grade AI will generate a complete,
//                       production-ready workflow design.
//                     </p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Enterprise AI</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Production Ready</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Team Integration</span>
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
//   )
// }

// export default VoiceflowWorkflowBuilder





// "use client"

// import React, { useState, useCallback, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
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
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Globe,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket,
//   Users,
//   Heart,
//   Share,
//   Search,
//   Gauge,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
// } from "lucide-react"

// // TypeScript interfaces
// interface BusinessInfo {
//   businessName: string
//   businessType: string
//   description?: string
//   website?: string
//   phone?: string
//   email?: string
// }

// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: BusinessInfo
//   selectedWorkflowId?: string | null
//   setStep?: (step: "selection" | "dashboard") => void
//   setActiveWorkflowExists?: (exists: boolean) => void
//   setActiveWorkflowDetails?: (details: any) => void
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   integrations?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
// }

// interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: any[]
//   benefits: string[]
//   exampleScenario: string
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// interface StepTemplate {
//   title: string
//   description: string
//   type: string
//   details: string[]
// }

// // Mock business info
// const mockBusinessInfo: BusinessInfo = {
//   businessName: "TechCorp Solutions",
//   businessType: "Technology Company",
//   description: "We provide innovative tech solutions for businesses",
//   website: "https://techcorp.com",
//   phone: "+1-555-0123",
//   email: "contact@techcorp.com",
// }

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50"
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50"
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50"
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50"
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50"
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50"
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50"
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50"
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50"
//   },
// }

// // Streaming phases for AI generation
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Understanding Requirements",
//     description: "Analyzing your automation needs and business context",
//     icon: Brain,
//     color: "text-blue-500",
//     duration: 2000
//   },
//   {
//     id: "designing",
//     title: "Designing Workflow",
//     description: "Creating intelligent automation logic",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 3000
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Steps",
//     description: "Fine-tuning for performance and accuracy",
//     icon: Gauge,
//     color: "text-green-500",
//     duration: 2000
//   }
// ]

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = mockBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isGenerating, setIsGenerating] = useState<boolean>(false)
//   const [responseStatus, setResponseStatus] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  
//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//   ]

//   // Simulate AI workflow generation with streaming
//   const generateWorkflowWithAI = useCallback(async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<void> => {
//     setIsGenerating(true)
//     setIsStreaming(true)
//     setCurrentPhase(0)
//     setStreamingProgress(0)
//     setStreamingSteps([])
//     setResponseStatus("🤖 AI is analyzing your requirements...")
//     setCurrentAction(action)
//     setHasInitialRequest(true)

//     try {
//       // Phase 1: Understanding
//       setCurrentPhase(0)
//       await new Promise(resolve => setTimeout(resolve, streamingPhases[0].duration))
      
//       setCurrentPhase(1)
//       setResponseStatus("🎨 AI is designing your workflow...")
      
//       // Simulate workflow step generation
//       const workflowSteps = await simulateStreamingStepGeneration()
      
//       setCurrentPhase(2)
//       setResponseStatus("⚡ AI is optimizing the workflow...")
//       await new Promise(resolve => setTimeout(resolve, streamingPhases[2].duration))
      
//       // Create complete workflow
//       const workflow: ParsedWorkflow = {
//         title: `${businessInfo.businessName} Social Media Automation`,
//         description: `Intelligent automation workflow for ${selectedChannels.length} social media platform${selectedChannels.length > 1 ? 's' : ''}`,
//         platform: "Multi-Platform AI Automation",
//         estimatedBuildTime: "2-3 weeks",
//         complexity: "Enterprise",
//         steps: workflowSteps,
//         integrations: [],
//         benefits: [
//           "95% reduction in response time",
//           "24/7 automated customer support",
//           "Intelligent sentiment analysis",
//           "Seamless human handoff",
//           "Real-time analytics and insights"
//         ],
//         exampleScenario: "Customer sends Instagram DM about product inquiry → AI analyzes intent → Provides personalized response → Logs interaction → Sends follow-up if needed",
//         technicalRequirements: [
//           "Social media platform API access",
//           "AI/ML processing pipeline", 
//           "Customer database integration",
//           "Analytics dashboard setup"
//         ],
//         deploymentChannels: selectedChannels,
//         metrics: {
//           automationRate: "92%",
//           responseTime: "< 2 seconds",
//           accuracy: "94%",
//           scalability: "Enterprise"
//         }
//       }

//       setParsedWorkflow(workflow)
//       setStreamingProgress(100)
//       setResponseStatus("✅ AI workflow generated successfully!")
      
//     } catch (error) {
//       console.error("AI generation error:", error)
//       setResponseStatus("❌ AI generation failed. Please try again.")
//     } finally {
//       setIsStreaming(false)
//       setTimeout(() => {
//         setIsGenerating(false)
//       }, 1000)
//     }
//   }, [businessInfo, selectedChannels, automationFeatures])

//   // Simulate streaming step generation
//   const simulateStreamingStepGeneration = async (): Promise<WorkflowStep[]> => {
//     const stepTemplates: StepTemplate[] = [
//       {
//         title: "Message Reception",
//         description: "Capture incoming messages from social media platforms",
//         type: "trigger",
//         details: ["Monitors all connected platforms", "Real-time message detection", "Metadata extraction"]
//       },
//       {
//         title: "Intent Analysis", 
//         description: "AI analyzes message content to understand customer intent",
//         type: "analysis",
//         details: ["Natural language processing", "Intent classification", "Confidence scoring"]
//       },
//       {
//         title: "Content Filtering",
//         description: "Filter spam, inappropriate content, and irrelevant messages",
//         type: "filter", 
//         details: ["Spam detection algorithms", "Content moderation", "Priority scoring"]
//       },
//       {
//         title: "Sentiment Assessment",
//         description: "Evaluate customer emotion and urgency level",
//         type: "analysis",
//         details: ["Emotional intelligence", "Urgency detection", "Customer satisfaction prediction"]
//       },
//       {
//         title: "Response Generation",
//         description: "Generate personalized responses based on business context",
//         type: "response",
//         details: ["Brand voice consistency", "Personalization engine", "Multi-language support"]
//       },
//       {
//         title: "Human Escalation Check",
//         description: "Determine if human intervention is needed",
//         type: "routing",
//         details: ["Complexity assessment", "Escalation triggers", "Agent availability check"]
//       },
//       {
//         title: "Response Delivery",
//         description: "Send automated response to customer",
//         type: "automation",
//         details: ["Platform-specific formatting", "Delivery confirmation", "Response tracking"]
//       },
//       {
//         title: "Interaction Logging",
//         description: "Store conversation data for analytics and training",
//         type: "storage",
//         details: ["Conversation archiving", "Analytics data points", "Performance metrics"]
//       },
//       {
//         title: "Follow-up Scheduling",
//         description: "Schedule automatic follow-up messages when appropriate",
//         type: "automation",
//         details: ["Timing optimization", "Conditional follow-ups", "Customer journey mapping"]
//       },
//       {
//         title: "Performance Monitoring",
//         description: "Track workflow performance and customer satisfaction",
//         type: "validation",
//         details: ["Success rate monitoring", "Customer feedback analysis", "Continuous improvement"]
//       }
//     ]

//     const steps: WorkflowStep[] = []
    
//     for (let i = 0; i < stepTemplates.length; i++) {
//       const template = stepTemplates[i]
//       const config = stepTypeConfigs[template.type] || stepTypeConfigs.automation
      
//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: template.title,
//         description: template.description,
//         type: template.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: i === 0 ? "< 1s" : i < 4 ? "1-2s" : "< 1s",
//         inputs: i === 0 ? ["Social Media Message"] : ["Previous Step Output"],
//         outputs: i === stepTemplates.length - 1 ? ["Workflow Completion"] : ["Processed Data"],
//         details: template.details,
//         isAnimating: true
//       }

//       // Add step with animation
//       setStreamingSteps(prevSteps => [...prevSteps, step])
      
//       // Update progress
//       const progress = ((i + 1) / stepTemplates.length) * 80 // Reserve 20% for final processing
//       setStreamingProgress(progress)
      
//       // Scroll to new step
//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
//           }
//         }
//       }, 100)
      
//       // Wait between steps for streaming effect
//       await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
      
//       // Remove animation class
//       setStreamingSteps(prevSteps => 
//         prevSteps.map(s => s.id === step.id ? { ...s, isAnimating: false } : s)
//       )
//     }

//     return steps
//   }

//   // Handle approval and send to designers via N8N
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Sending workflow design to development team...")

//     try {
//       const payload = {
//         action: "send_to_designers",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         approvedAt: new Date().toISOString()
//       }

//       // Simple N8N call to email designers
//       const response = await fetch('/api/send-to-designers', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to send to designers: ${response.statusText}`)
//       }

//       setResponseStatus("✅ Workflow design sent to development team!")
      
//       if (setActiveWorkflowExists) setActiveWorkflowExists(true)
//       if (setActiveWorkflowDetails) {
//         setActiveWorkflowDetails({
//           id: `workflow-${Date.now()}`,
//           workflowTemplate: { name: parsedWorkflow?.title || "Social Media Automation" },
//           businessInfo: businessInfo,
//           parsedWorkflow: parsedWorkflow,
//           status: "SENT_TO_DESIGNERS",
//           platform: "social-media-automation",
//           channels: selectedChannels,
//           features: automationFeatures,
//           approvedAt: new Date().toISOString(),
//         })
//       }

//       setTimeout(() => {
//         if (setStep) setStep("dashboard")
//       }, 2000)

//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to send to designers. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
//       return
//     }
//     generateWorkflowWithAI("initial")
//   }

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions")
//       return
//     }
//     generateWorkflowWithAI("refine", refinementInput)
//     setRefinementInput("")
//   }

//   const toggleStepExpansion = (stepNumber: number): void => {
//     setExpandedSteps(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter(c => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures(prev => [...prev, featureId])
//     } else {
//       setAutomationFeatures(prev => prev.filter(f => f !== featureId))
//     }
//   }

//   // Streaming Progress Component
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
//               <IconComponent className={`h-8 w-8 ${currentPhaseData?.color || 'text-blue-500'} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground text-sm">{currentPhaseData?.description || "Working on your workflow..."}</p>
//         </div>

//         <div className="mb-4">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-2" />
//         </div>

//         <div className="flex justify-center gap-4">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                   index < currentPhase ? 'bg-green-500 text-white' :
//                   index === currentPhase ? 'bg-blue-500 text-white animate-pulse' :
//                   'bg-gray-200 text-gray-400'
//                 }`}>
//                   {index < currentPhase ? <CheckCircle className="h-4 w-4" /> : 
//                    index === currentPhase ? <PhaseIcon className="h-4 w-4" /> :
//                    <div className="w-2 h-2 bg-current rounded-full" />}
//                 </div>
//                 <span className="text-xs mt-1 text-center">{phase.title.split(' ')[0]}</span>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   // Enhanced Step Component
//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div 
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${
//           step.isAnimating ? 'animate-pulse' : ''
//         }`}
//         style={{
//           animation: step.isAnimating ? 'slideInFromLeft 0.5s ease-out' : 'none'
//         }}
//       >
//         <div className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//           config.bgColor} ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//           isExpanded ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md hover:scale-[1.01]'
//         }`}
//         onClick={() => toggleStepExpansion(step.stepNumber)}>
          
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Step Number with Icon */}
//               <div className="relative">
//                 <div className={`w-14 h-14 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
//                   <IconComponent className={`h-3 w-3 ${config.color}`} />
//                 </div>
//               </div>

//               {/* Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-2">
//                   <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs">
//                     {step.type}
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3">{step.description}</p>
                
//                 {/* Input/Output Flow */}
//                 <div className="flex items-center gap-4 text-sm">
//                   {step.inputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       <span className="text-green-700 dark:text-green-300">
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       <span className="text-blue-700 dark:text-blue-300">
//                         Output: {step.outputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Expand Icon */}
//               <div className="flex items-center">
//                 {isExpanded ? (
//                   <ChevronDown className="h-5 w-5 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-5 w-5 text-muted-foreground" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Expanded Details */}
//           {isExpanded && (
//             <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Layers className="h-4 w-4 text-blue-500" />
//                     Implementation Details
//                   </h5>
//                   <ul className="space-y-2 text-sm text-muted-foreground">
//                     {step.details?.map((detail, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                         <span>{detail}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Activity className="h-4 w-4 text-green-500" />
//                     Performance Metrics
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Success Rate:</span>
//                       <Badge variant="secondary" className="text-green-600">99.2%</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Error Handling:</span>
//                       <Badge variant="secondary" className="text-blue-600">Advanced</Badge>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
//           <div className="flex justify-center my-4">
//             <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800"></div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//               🤖 AI Workflow Designer
//             </h1>
//             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//               Watch as our AI creates your personalized social media automation workflow step by step in real-time.
//             </p>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-blue-200 dark:border-blue-800">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-blue-500" />
//                   {!hasInitialRequest ? "Design Your Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your social media automation needs"
//                     : "Provide feedback to improve the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Platform Selection */}
//                     <div className="space-y-2">
//                       <Label>Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-2">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-3 rounded-lg border text-left transition-all ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                                   : "bg-background border-border hover:border-blue-300 hover:bg-blue-50"
//                               }`}
//                             >
//                               <div className="flex items-center gap-2">
//                                 <IconComponent className="h-4 w-4" />
//                                 <span className="text-sm font-medium">{channel.label}</span>
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Feature Selection */}
//                     <div className="space-y-2">
//                       <Label>Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label key={feature.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-accent">
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

//                 {/* Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="workflowRequest">Describe your automation needs</Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I want to automatically respond to Instagram DMs about product inquiries, analyze customer sentiment, and escalate urgent issues to human agents. Also include follow-up sequences for potential customers.'"
//                         rows={6}
//                         className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
//                     >
//                       {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                       Generate AI Workflow
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
//                         placeholder="e.g., 'Add Shopify integration', 'Include more personalized responses', 'Add scheduling capabilities'"
//                         rows={4}
//                         className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         onClick={handleRefine}
//                         disabled={isGenerating || !refinementInput.trim()}
//                         className="flex-1 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
//                       >
//                         {isGenerating && currentAction === "refine" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <RefreshCw className="h-4 w-4" />
//                         )}
//                         Refine
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isGenerating || !parsedWorkflow}
//                         className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                       >
//                         {isGenerating && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Send to Designers
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Business Context */}
//             <Card className="border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-blue-500" />
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
//                 {selectedChannels.length > 0 && (
//                   <div>
//                     <span className="font-semibold text-blue-500">Platforms:</span>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-blue-200 dark:border-blue-800 min-h-[600px]">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-5 w-5 text-blue-500" />
//                   AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto">
//                       <Star className="h-3 w-3 mr-1" />
//                       AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription>
//                   Watch as AI creates your workflow step by step in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Status Message */}
//                 {responseStatus && (
//                   <div className={`mb-6 p-4 rounded-lg border ${
//                     responseStatus.includes("✅") ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" :
//                     responseStatus.includes("❌") ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" :
//                     "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
//                   }`}>
//                     <div className="flex items-center gap-2">
//                       {responseStatus.includes("✅") ? <CheckCircle className="h-4 w-4" /> :
//                        responseStatus.includes("❌") ? <AlertCircle className="h-4 w-4" /> :
//                        <Loader2 className="h-4 w-4 animate-spin" />}
//                       <span className="text-sm font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-blue-200 dark:border-blue-700">
//                     <div className="text-center mb-6">
//                       <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                         {parsedWorkflow.title}
//                       </h3>
//                       <p className="text-muted-foreground">{parsedWorkflow.description}</p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="text-center p-3 bg-white/50 rounded-lg">
//                         <div className="text-xl font-bold text-blue-600">{parsedWorkflow.metrics?.automationRate}</div>
//                         <div className="text-xs text-muted-foreground">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-3 bg-white/50 rounded-lg">
//                         <div className="text-xl font-bold text-green-600">{parsedWorkflow.metrics?.responseTime}</div>
//                         <div className="text-xs text-muted-foreground">Response Time</div>
//                       </div>
//                       <div className="text-center p-3 bg-white/50 rounded-lg">
//                         <div className="text-xl font-bold text-purple-600">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground">Accuracy</div>
//                       </div>
//                       <div className="text-center p-3 bg-white/50 rounded-lg">
//                         <div className="text-xl font-bold text-orange-600">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground">Build Time</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-6">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-2 bg-blue-500 rounded-lg">
//                         <Workflow className="h-5 w-5 text-white" />
//                       </div>
//                       <h3 className="text-xl font-semibold">Workflow Steps</h3>
//                       <Badge variant="outline">
//                         {isStreaming ? `${streamingSteps.length} steps generated...` : `${streamingSteps.length} steps`}
//                       </Badge>
//                     </div>
                    
//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}
                    
//                     {isStreaming && (
//                       <div className="flex justify-center py-4">
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                           <span className="text-sm">Generating more steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
//                     <div className="relative mb-6">
//                       <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-10 w-10 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-3 w-3 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2">Ready to Generate Your Workflow</h3>
//                     <p className="text-center max-w-md mb-6">
//                       Describe your automation needs and watch as our AI creates a complete workflow design in real-time.
//                     </p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Real-time Generation</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Visual Step Creation</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3 text-green-500" />
//                         <span>Designer Ready</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceflowWorkflowBuilder


// "use client"

// import React, { useState, useCallback, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
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
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Globe,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket,
//   Users,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
//   Plus,
//   X,
//   Check,
//   ExternalLink,
//   Building,
//   Cloud,
//   ShoppingCart,
//   CreditCard,
//   Calendar,
//   Briefcase,
//   Headphones,
//   BarChart,
//   Lock,
//   Webhook,
//   Link2,
//   Puzzle,
//   Search,
//   Package,
//   Gauge
// } from "lucide-react"

// // TypeScript interfaces
// interface BusinessInfo {
//   businessName: string
//   businessType: string
//   description?: string
//   website?: string
//   phone?: string
//   email?: string
// }

// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: BusinessInfo
//   selectedWorkflowId?: string | null
//   setStep?: (step: "selection" | "dashboard") => void
//   setActiveWorkflowExists?: (exists: boolean) => void
//   setActiveWorkflowDetails?: (details: any) => void
// }

// interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   icon: React.ComponentType<{ className?: string }>
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
// }

// interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits: string[]
//   exampleScenario: string
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// // Comprehensive Integration Database
// const INTEGRATION_DATABASE: Integration[] = [
//   // CRM Systems
//   {
//     id: "hubspot",
//     name: "HubSpot",
//     description: "Comprehensive CRM and marketing automation platform",
//     category: "crm",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 95,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
//     setupTime: "15-30 minutes",
//     website: "https://hubspot.com"
//   },
//   {
//     id: "salesforce",
//     name: "Salesforce",
//     description: "World's leading CRM platform for sales and customer service",
//     category: "crm",
//     icon: Cloud,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
//     setupTime: "30-60 minutes",
//     website: "https://salesforce.com"
//   },
//   {
//     id: "zoho-crm",
//     name: "Zoho CRM",
//     description: "Complete CRM solution for businesses of all sizes",
//     category: "crm",
//     icon: Briefcase,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Sales Automation", "Contact Management", "Analytics", "Mobile App"],
//     setupTime: "20-40 minutes",
//     website: "https://zoho.com/crm"
//   },
//   {
//     id: "pipedrive",
//     name: "Pipedrive",
//     description: "Sales-focused CRM designed for small and medium businesses",
//     category: "crm",
//     icon: BarChart,
//     pricing: "paid",
//     popularity: 80,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Pipeline Management", "Activity Tracking", "Email Integration", "Reports"],
//     setupTime: "15-25 minutes",
//     website: "https://pipedrive.com"
//   },

//   // E-commerce Platforms
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Leading e-commerce platform for online stores",
//     category: "ecommerce",
//     icon: ShoppingCart,
//     pricing: "paid",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Management", "Order Processing", "Inventory", "Payments"],
//     setupTime: "20-30 minutes",
//     website: "https://shopify.com"
//   },
//   {
//     id: "woocommerce",
//     name: "WooCommerce",
//     description: "Open-source e-commerce plugin for WordPress",
//     category: "ecommerce",
//     icon: Package,
//     pricing: "free",
//     popularity: 85,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Catalog", "Order Management", "Payment Gateways", "Extensions"],
//     setupTime: "30-45 minutes",
//     website: "https://woocommerce.com"
//   },
//   {
//     id: "magento",
//     name: "Magento",
//     description: "Flexible e-commerce platform for enterprise businesses",
//     category: "ecommerce",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 70,
//     difficulty: "hard",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Multi-store", "B2B Features", "Advanced SEO", "Customization"],
//     setupTime: "60-120 minutes",
//     website: "https://magento.com"
//   },

//   // Email Marketing
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "All-in-one email marketing and automation platform",
//     category: "email",
//     icon: Mail,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
//     setupTime: "10-20 minutes",
//     website: "https://mailchimp.com"
//   },
//   {
//     id: "sendgrid",
//     name: "SendGrid",
//     description: "Cloud-based email delivery service",
//     category: "email",
//     icon: Send,
//     pricing: "freemium",
//     popularity: 82,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Transactional Email", "Marketing Campaigns", "Analytics", "Templates"],
//     setupTime: "15-30 minutes",
//     website: "https://sendgrid.com"
//   },
//   {
//     id: "klaviyo",
//     name: "Klaviyo",
//     description: "Advanced email and SMS marketing platform",
//     category: "email",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 78,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Marketing", "SMS Marketing", "Segmentation", "Automation"],
//     setupTime: "20-35 minutes",
//     website: "https://klaviyo.com"
//   },

//   // Payment Systems
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Complete payment processing platform for businesses",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 95,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
//     setupTime: "25-40 minutes",
//     website: "https://stripe.com"
//   },
//   {
//     id: "paypal",
//     name: "PayPal",
//     description: "Global payment platform for online transactions",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Express Checkout", "Subscriptions", "Invoicing"],
//     setupTime: "15-25 minutes",
//     website: "https://paypal.com"
//   },

//   // Analytics & Tracking
//   {
//     id: "google-analytics",
//     name: "Google Analytics",
//     description: "Web analytics service for tracking website traffic",
//     category: "analytics",
//     icon: BarChart3,
//     pricing: "freemium",
//     popularity: 98,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
//     setupTime: "20-30 minutes",
//     website: "https://analytics.google.com"
//   },
//   {
//     id: "mixpanel",
//     name: "Mixpanel",
//     description: "Advanced product analytics platform",
//     category: "analytics",
//     icon: TrendingUp,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Event Tracking", "Funnel Analysis", "Cohort Analysis", "A/B Testing"],
//     setupTime: "30-45 minutes",
//     website: "https://mixpanel.com"
//   },

//   // Customer Support
//   {
//     id: "zendesk",
//     name: "Zendesk",
//     description: "Customer service and support ticketing platform",
//     category: "support",
//     icon: Headphones,
//     pricing: "paid",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Ticket Management", "Live Chat", "Knowledge Base", "Analytics"],
//     setupTime: "25-40 minutes",
//     website: "https://zendesk.com"
//   },
//   {
//     id: "intercom",
//     name: "Intercom",
//     description: "Conversational customer engagement platform",
//     category: "support",
//     icon: MessageCircle,
//     pricing: "paid",
//     popularity: 80,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Live Chat", "Help Desk", "Product Tours", "Automation"],
//     setupTime: "20-30 minutes",
//     website: "https://intercom.com"
//   },

//   // Calendar & Scheduling
//   {
//     id: "calendly",
//     name: "Calendly",
//     description: "Automated scheduling and calendar management",
//     category: "scheduling",
//     icon: Calendar,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Meeting Scheduling", "Calendar Integration", "Automated Reminders", "Analytics"],
//     setupTime: "10-15 minutes",
//     website: "https://calendly.com"
//   },
//   {
//     id: "acuity",
//     name: "Acuity Scheduling",
//     description: "Advanced appointment scheduling software",
//     category: "scheduling",
//     icon: Clock,
//     pricing: "paid",
//     popularity: 75,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Online Scheduling", "Payment Processing", "Intake Forms", "Packages"],
//     setupTime: "20-35 minutes",
//     website: "https://acuityscheduling.com"
//   },

//   // Databases & Storage
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database and spreadsheet hybrid",
//     category: "database",
//     icon: Database,
//     pricing: "freemium",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Database Management", "Forms", "Views", "Automations"],
//     setupTime: "15-25 minutes",
//     website: "https://airtable.com"
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "All-in-one workspace for notes, docs, and databases",
//     category: "database",
//     icon: FileText,
//     pricing: "freemium",
//     popularity: 82,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Databases", "Documents", "Wikis", "Project Management"],
//     setupTime: "20-30 minutes",
//     website: "https://notion.so"
//   },

//   // Communication
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Business communication and collaboration platform",
//     category: "communication",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
//     setupTime: "10-20 minutes",
//     website: "https://slack.com"
//   },
//   {
//     id: "discord",
//     name: "Discord",
//     description: "Voice, video, and text communication for communities",
//     category: "communication",
//     icon: MessageCircle,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Voice Chat", "Text Channels", "Bots", "Screen Sharing"],
//     setupTime: "15-25 minutes",
//     website: "https://discord.com"
//   },

//   // Webhooks & APIs
//   {
//     id: "zapier",
//     name: "Zapier",
//     description: "Automation platform connecting thousands of apps",
//     category: "automation",
//     icon: Zap,
//     pricing: "freemium",
//     popularity: 90,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["App Integrations", "Workflow Automation", "Multi-step Zaps", "Filters"],
//     setupTime: "5-15 minutes",
//     website: "https://zapier.com"
//   },
//   {
//     id: "make",
//     name: "Make (Integromat)",
//     description: "Advanced automation platform for complex workflows",
//     category: "automation",
//     icon: Puzzle,
//     pricing: "freemium",
//     popularity: 78,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Visual Automation", "Complex Logic", "Error Handling", "Scheduling"],
//     setupTime: "20-40 minutes",
//     website: "https://make.com"
//   }
// ]

// // Default business info - you can remove this in production
// const defaultBusinessInfo: BusinessInfo = {
//   businessName: "Your Business",
//   businessType: "Technology Company",
//   description: "We provide innovative solutions for businesses",
//   website: "https://yourbusiness.com",
//   phone: "+1-555-0123",
//   email: "contact@yourbusiness.com",
// }

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50"
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50"
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50"
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50"
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50"
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50"
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50"
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50"
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50"
//   },
//   payment: {
//     icon: CreditCard,
//     color: "text-green-600",
//     bgColor: "from-green-50 to-emerald-100",
//     borderColor: "border-green-300",
//     accentColor: "bg-green-500",
//     darkBg: "dark:from-green-900/20 dark:to-emerald-900/30",
//     darkBorder: "dark:border-green-600/50"
//   },
//   communication: {
//     icon: MessageSquare,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-sky-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-sky-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
// }

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs and automation goals",
//     icon: Search,
//     color: "text-blue-500",
//     duration: 3000
//   },
//   {
//     id: "designing",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and step sequences",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 4000
//   },
//   {
//     id: "integrations",
//     title: "Matching Integrations",
//     description: "Finding the best tools and platforms for each step",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 3000
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Performance",
//     description: "Fine-tuning for maximum efficiency and reliability",
//     icon: Gauge,
//     color: "text-orange-500",
//     duration: 2000
//   }
// ]

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = defaultBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isGenerating, setIsGenerating] = useState<boolean>(false)
//   const [responseStatus, setResponseStatus] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  
//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//     { id: "email", label: "Email Marketing", icon: Mail },
//     { id: "sms", label: "SMS Marketing", icon: Phone },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//     { id: "lead-scoring", label: "Lead Scoring" },
//     { id: "personalization", label: "Dynamic Personalization" },
//     { id: "escalation", label: "Intelligent Escalation" },
//   ]

//   // Real AI workflow generation with OpenAI/Anthropic
//   const generateWorkflowWithAI = useCallback(async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<void> => {
//     setIsGenerating(true)
//     setIsStreaming(true)
//     setCurrentPhase(0)
//     setStreamingProgress(0)
//     setStreamingSteps([])
//     setAiThoughts([])
//     setResponseStatus("🤖 Connecting to AI workflow engine...")
//     setCurrentAction(action)
//     setHasInitialRequest(true)

//     try {
//       // Phase progression with realistic timing
//       for (let phase = 0; phase < streamingPhases.length; phase++) {
//         setCurrentPhase(phase)
//         setResponseStatus(`${streamingPhases[phase].description}...`)
        
//         // Add AI thoughts during processing
//         addAiThought(getAiThoughtForPhase(phase))
        
//         await new Promise(resolve => setTimeout(resolve, streamingPhases[phase].duration))
//       }

//       // Generate workflow via AI API
//       const aiResponse = await callAIWorkflowGeneration(action, instructions)
      
//       if (aiResponse.success) {
//         setParsedWorkflow(aiResponse.workflow)
//         setStreamingProgress(100)
//         setResponseStatus("✅ Enterprise AI workflow generated successfully!")
//         addAiThought("🎉 Workflow generation complete! Ready for designer implementation.")
//       } else {
//         throw new Error(aiResponse.error || "AI generation failed")
//       }
      
//     } catch (error) {
//       console.error("AI generation error:", error)
//       setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//     } finally {
//       setIsStreaming(false)
//       setTimeout(() => {
//         setIsGenerating(false)
//       }, 1000)
//     }
//   }, [businessInfo, selectedChannels, automationFeatures, workflowRequest])

//   // Real AI API call (replace with your preferred AI provider)
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<{ success: boolean; workflow?: ParsedWorkflow; error?: string }> => {
//     try {
//       const systemPrompt = `You are an expert workflow automation designer. Create detailed social media automation workflows with specific integrations and technical specifications.

// BUSINESS CONTEXT:
// - Company: ${businessInfo.businessName}
// - Type: ${businessInfo.businessType}
// - Description: ${businessInfo.description}
// - Platforms: ${selectedChannels.join(", ")}
// - Features needed: ${automationFeatures.join(", ")}

// USER REQUEST: ${workflowRequest}
// ${instructions ? `REFINEMENT: ${instructions}` : ""}

// Generate a comprehensive workflow with 8-12 steps. For each step, specify:
// 1. Title and detailed description
// 2. Step type (trigger, analysis, filter, response, routing, storage, etc.)
// 3. Estimated execution time
// 4. Business impact explanation
// 5. Suggested integrations from categories: CRM, email, ecommerce, payment, analytics, support, etc.
// 6. AI reasoning for why this step is important

// Return JSON format with complete workflow details, estimated costs, ROI projections, and technical requirements.`

//       const response = await fetch('/api/ai/generate-workflow', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           systemPrompt,
//           userRequest: workflowRequest,
//           businessInfo,
//           selectedChannels,
//           automationFeatures,
//           action,
//           refinementInstructions: instructions
//         })
//       })

//       if (!response.ok) {
//         throw new Error(`AI API failed: ${response.statusText}`)
//       }

//       const result = await response.json()
      
//       // Process the AI response and generate steps
//       const workflowSteps = await processAIResponseIntoSteps(result.workflowData)
      
//       const workflow: ParsedWorkflow = {
//         title: result.title || `${businessInfo.businessName} Social Media Automation`,
//         description: result.description || `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? 's' : ''}`,
//         platform: "Multi-Platform AI Automation",
//         estimatedBuildTime: result.estimatedBuildTime || "2-4 weeks",
//         complexity: result.complexity || "Enterprise",
//         steps: workflowSteps,
//         integrations: getUniqueIntegrations(workflowSteps),
//         benefits: result.benefits || [
//           "95% reduction in response time",
//           "24/7 automated customer engagement",
//           "Intelligent sentiment analysis and routing",
//           "Seamless human handoff when needed",
//           "Real-time analytics and insights",
//           "Scalable across multiple platforms"
//         ],
//         exampleScenario: result.exampleScenario || "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
//         technicalRequirements: result.technicalRequirements || [
//           "Social media platform API access",
//           "AI/ML processing pipeline", 
//           "Customer database integration",
//           "Real-time webhook handling",
//           "Analytics dashboard setup"
//         ],
//         deploymentChannels: selectedChannels,
//         estimatedCost: result.estimatedCost || "$500-2000/month",
//         roi: result.roi || "300-500% within 6 months",
//         metrics: {
//           automationRate: result.metrics?.automationRate || "92%",
//           responseTime: result.metrics?.responseTime || "< 2 seconds",
//           accuracy: result.metrics?.accuracy || "94%",
//           scalability: result.metrics?.scalability || "Enterprise"
//         }
//       }

//       return { success: true, workflow }
      
//     } catch (error) {
//       console.error("AI API call failed:", error)
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : "AI generation failed" 
//       }
//     }
//   }

//   // Process AI response into workflow steps with streaming
//   const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const stepsData = workflowData?.steps || generateFallbackSteps()
    
//     for (let i = 0; i < stepsData.length; i++) {
//       const stepData = stepsData[i]
//       const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation
      
//       // Get suggested integrations for this step
//       const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)
      
//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: stepData.title,
//         description: stepData.description,
//         type: stepData.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
//         inputs: stepData.inputs || (i === 0 ? ["Social Media Message"] : ["Previous Step Output"]),
//         outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Workflow Completion"] : ["Processed Data"]),
//         details: stepData.details || [`Processes ${stepData.type} logic automatically`, "Integrates with selected platforms", "Maintains conversation context"],
//         isAnimating: true,
//         suggestedIntegrations,
//         selectedIntegrations: suggestedIntegrations.slice(0, 1), // Auto-select top integration
//         aiReasoning: stepData.aiReasoning || `This step is crucial for ${stepData.type} processing in your automation workflow.`,
//         complexity: stepData.complexity || "medium",
//         businessImpact: stepData.businessImpact || `Improves ${stepData.type} efficiency and customer satisfaction.`,
//         alternatives: stepData.alternatives || [`Alternative ${stepData.type} approaches`, "Custom implementation options"]
//       }

//       // Add step with animation
//       setStreamingSteps(prevSteps => [...prevSteps, step])
      
//       // Update progress
//       const progress = ((i + 1) / stepsData.length) * 70 + 25 // Start at 25%, end at 95%
//       setStreamingProgress(progress)
      
//       // Add AI thought
//       addAiThought(`🔧 Generated step ${i + 1}: ${step.title}`)
      
//       // Scroll to new step
//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
//           }
//         }
//       }, 100)
      
//       // Wait between steps for streaming effect
//       await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      
//       // Remove animation class
//       setStreamingSteps(prevSteps => 
//         prevSteps.map(s => s.id === step.id ? { ...s, isAnimating: false } : s)
//       )

//       steps.push(step)
//     }

//     return steps
//   }

//   // Get suggested integrations for a specific step type
//   const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
//     const suggestions: Integration[] = []
//     const title = stepTitle.toLowerCase()
    
//     // Smart integration matching based on step type and content
//     if (stepType === "trigger" || title.includes("message") || title.includes("reception")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "storage" || title.includes("log") || title.includes("store") || title.includes("save")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "database"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
//     }
    
//     if (stepType === "response" || title.includes("email") || title.includes("message") || title.includes("notification")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "email"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "payment" || title.includes("payment") || title.includes("billing") || title.includes("checkout")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "payment"))
//     }
    
//     if (stepType === "analysis" || title.includes("track") || title.includes("analyz") || title.includes("metric")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "analytics"))
//     }
    
//     if (title.includes("support") || title.includes("help") || title.includes("ticket")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "support"))
//     }
    
//     if (title.includes("schedule") || title.includes("appointment") || title.includes("calendar")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "scheduling"))
//     }
    
//     if (title.includes("product") || title.includes("order") || title.includes("inventory")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "ecommerce"))
//     }
    
//     // Always include automation tools as they're universally applicable
//     suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "automation"))
    
//     // Remove duplicates and sort by popularity
//     const uniqueSuggestions = suggestions.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
    
//     return uniqueSuggestions
//       .sort((a, b) => b.popularity - a.popularity)
//       .slice(0, 5) // Top 5 suggestions per step
//   }

//   // Helper functions
//   const getEstimatedTimeForStep = (stepType: string): string => {
//     const timeMap: Record<string, string> = {
//       trigger: "< 1s",
//       analysis: "2-3s",
//       filter: "1-2s",
//       response: "1-2s",
//       routing: "< 1s",
//       storage: "2-4s",
//       validation: "1-3s",
//       automation: "1-2s",
//       payment: "3-5s",
//       communication: "1-2s"
//     }
//     return timeMap[stepType] || "1-2s"
//   }

//   const generateFallbackSteps = () => [
//     {
//       title: "Message Reception & Processing",
//       description: "Capture and process incoming messages from all connected social media platforms",
//       type: "trigger",
//       aiReasoning: "Essential entry point for all customer interactions"
//     },
//     {
//       title: "Intent Analysis & Classification",
//       description: "AI analyzes message content to understand customer intent and urgency",
//       type: "analysis",
//       aiReasoning: "Critical for providing relevant and contextual responses"
//     },
//     {
//       title: "Content Filtering & Validation",
//       description: "Filter spam, inappropriate content, and validate message authenticity",
//       type: "filter",
//       aiReasoning: "Protects brand reputation and ensures quality interactions"
//     },
//     {
//       title: "Customer Data Enrichment",
//       description: "Enhance customer profile with available data from CRM and other sources",
//       type: "integration",
//       aiReasoning: "Enables personalized responses and better customer service"
//     },
//     {
//       title: "Intelligent Response Generation",
//       description: "Generate personalized responses based on customer context and business rules",
//       type: "response",
//       aiReasoning: "Provides immediate value to customers while maintaining brand voice"
//     },
//     {
//       title: "Human Escalation Assessment",
//       description: "Determine if human intervention is needed based on complexity and sentiment",
//       type: "routing",
//       aiReasoning: "Ensures complex issues receive appropriate human attention"
//     },
//     {
//       title: "CRM Integration & Updates",
//       description: "Update customer records and create relevant tasks in CRM system",
//       type: "storage",
//       aiReasoning: "Maintains comprehensive customer interaction history"
//     },
//     {
//       title: "Follow-up Sequence Automation",
//       description: "Schedule and send automated follow-up messages based on customer journey",
//       type: "automation",
//       aiReasoning: "Maximizes engagement and conversion opportunities"
//     },
//     {
//       title: "Performance Analytics & Reporting",
//       description: "Track workflow performance and generate insights for continuous improvement",
//       type: "validation",
//       aiReasoning: "Enables data-driven optimization of the automation workflow"
//     }
//   ]

//   const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     const allIntegrations = steps.flatMap(step => step.selectedIntegrations || [])
//     return allIntegrations.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts(prev => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5) // Keep only last 5 thoughts
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//     const thoughts = [
//       "🔍 Analyzing your business requirements and social media automation needs...",
//       "🎨 Designing optimal workflow architecture with enterprise-grade components...",
//       "🔗 Matching your needs with the best available integrations and tools...",
//       "⚡ Optimizing workflow for maximum performance and reliability..."
//     ]
//     return thoughts[phase] || "🤖 Processing your workflow requirements..."
//   }

//   // Handle approval and send to designers via N8N
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Sending comprehensive workflow design to development team...")

//     try {
//       const payload = {
//         action: "send_to_designers",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         approvedAt: new Date().toISOString(),
//         estimatedCost: parsedWorkflow?.estimatedCost,
//         roi: parsedWorkflow?.roi,
//         integrations: parsedWorkflow?.integrations
//       }

//       const response = await fetch('/api/send-to-designers', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to send to designers: ${response.statusText}`)
//       }

//       const result = await response.json()
//       setResponseStatus("✅ Enterprise workflow design sent to development team successfully!")
      
//       if (setActiveWorkflowExists) setActiveWorkflowExists(true)
//       if (setActiveWorkflowDetails) {
//         setActiveWorkflowDetails({
//           id: `workflow-${Date.now()}`,
//           workflowTemplate: { name: parsedWorkflow?.title || "AI Social Media Automation" },
//           businessInfo: businessInfo,
//           parsedWorkflow: parsedWorkflow,
//           status: "SENT_TO_DESIGNERS",
//           platform: "social-media-automation",
//           channels: selectedChannels,
//           features: automationFeatures,
//           approvedAt: new Date().toISOString(),
//           estimatedCost: parsedWorkflow?.estimatedCost,
//           roi: parsedWorkflow?.roi
//         })
//       }

//       setTimeout(() => {
//         if (setStep) setStep("dashboard")
//       }, 2000)

//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to send to designers. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
//       return
//     }
//     generateWorkflowWithAI("initial")
//   }

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions")
//       return
//     }
//     generateWorkflowWithAI("refine", refinementInput)
//     setRefinementInput("")
//   }

//   const toggleStepExpansion = (stepNumber: number): void => {
//     setExpandedSteps(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter(c => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures(prev => [...prev, featureId])
//     } else {
//       setAutomationFeatures(prev => prev.filter(f => f !== featureId))
//     }
//   }

//   const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
//     setStreamingSteps(prevSteps => 
//       prevSteps.map(step => {
//         if (step.id === stepId) {
//           const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
//           const newSelected = isSelected
//             ? step.selectedIntegrations?.filter(i => i.id !== integration.id) || []
//             : [...(step.selectedIntegrations || []), integration]
          
//           return { ...step, selectedIntegrations: newSelected }
//         }
//         return step
//       })
//     )
//   }

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || 'text-blue-500'} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">{currentPhaseData?.description || "Working on your workflow..."}</p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Overall Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                   index < currentPhase ? 'bg-green-500 text-white shadow-lg' :
//                   index === currentPhase ? 'bg-blue-500 text-white animate-pulse shadow-lg' :
//                   'bg-gray-200 text-gray-400'
//                 }`}>
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : 
//                    <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span className={`text-xs mt-2 text-center font-medium ${
//                   index === currentPhase ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
//                 }`}>
//                   {phase.title.split(' ')[0]}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* AI Thoughts */}
//         {aiThoughts.length > 0 && (
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
//                   }`}
//                 >
//                   {thought}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

//     return (
//       <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
//         <h6 className="font-semibold mb-3 flex items-center gap-2">
//           <Puzzle className="h-4 w-4 text-purple-500" />
//           Suggested Integrations
//           <Badge variant="outline" className="text-xs">
//             {step.suggestedIntegrations.length} available
//           </Badge>
//         </h6>
        
//         <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
//           {step.suggestedIntegrations.map((integration) => {
//             const IconComponent = integration.icon
//             const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
            
//             return (
//               <div
//                 key={integration.id}
//                 onClick={() => handleIntegrationToggle(step.id, integration)}
//                 className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
//                   isSelected
//                     ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                     : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className="h-5 w-5 flex-shrink-0" />
//                   <div className="flex-grow min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-sm truncate">{integration.name}</span>
//                       <Badge 
//                         variant={isSelected ? "secondary" : "outline"} 
//                         className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
//                       >
//                         {integration.pricing}
//                       </Badge>
//                     </div>
//                     <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
//                       {integration.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Timer className="h-3 w-3" />
//                         {integration.setupTime}
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Star className="h-3 w-3" />
//                         {integration.popularity}%
//                       </div>
//                     </div>
//                   </div>
//                   {isSelected ? (
//                     <Check className="h-4 w-4 text-white" />
//                   ) : (
//                     <Plus className="h-4 w-4 text-gray-400" />
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div 
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${
//           step.isAnimating ? 'animate-pulse' : ''
//         }`}
//         style={{
//           animation: step.isAnimating ? 'slideInFromLeft 0.6s ease-out' : 'none'
//         }}
//       >
//         <div className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//           config.bgColor} ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//           isExpanded ? 'shadow-xl scale-[1.02] border-opacity-100' : 'hover:shadow-lg hover:scale-[1.01] border-opacity-60'
//         }`}
//         onClick={() => toggleStepExpansion(step.stepNumber)}>
          
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Enhanced Step Number with Icon */}
//               <div className="relative">
//                 <div className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                   <IconComponent className={`h-4 w-4 ${config.color}`} />
//                 </div>
//               </div>

//               {/* Enhanced Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   <Badge variant="secondary" className={`text-xs ${
//                     step.complexity === "high" ? "bg-red-100 text-red-700" :
//                     step.complexity === "medium" ? "bg-yellow-100 text-yellow-700" :
//                     "bg-green-100 text-green-700"
//                   }`}>
//                     {step.complexity} complexity
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                
//                 {/* Enhanced Input/Output Flow */}
//                 <div className="flex items-center gap-6 text-sm">
//                   {step.inputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-700 dark:text-green-300 font-medium">
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Integration Preview */}
//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map(i => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Expand Icon */}
//               <div className="flex items-center">
//                 {isExpanded ? (
//                   <ChevronDown className="h-6 w-6 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-6 w-6 text-muted-foreground" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Expanded Details */}
//           {isExpanded && (
//             <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
//               {/* AI Reasoning */}
//               {step.aiReasoning && (
//                 <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
//                   <h6 className="font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
//                     <Brain className="h-4 w-4" />
//                     AI Reasoning
//                   </h6>
//                   <p className="text-sm text-purple-600 dark:text-purple-400">{step.aiReasoning}</p>
//                 </div>
//               )}

//               <div className="grid lg:grid-cols-3 gap-6">
//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Layers className="h-4 w-4 text-blue-500" />
//                     Implementation Details
//                   </h5>
//                   <ul className="space-y-2 text-sm text-muted-foreground">
//                     {step.details?.map((detail, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                         <span>{detail}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Activity className="h-4 w-4 text-green-500" />
//                     Performance & Impact
//                   </h5>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Business Impact:</span>
//                       <Badge variant="secondary" className="text-green-600">High</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Reliability:</span>
//                       <Badge variant="secondary" className="text-blue-600">99.9%</Badge>
//                     </div>
//                     {step.businessImpact && (
//                       <p className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
//                         {step.businessImpact}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-orange-500" />
//                     Configuration Options
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span>Auto-retry enabled</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       <span>Real-time monitoring</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                       <span>Custom error handling</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                       <span>Performance optimization</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Integration Selector */}
//               <IntegrationSelector step={step} />
//             </div>
//           )}
//         </div>

//         {/* Enhanced Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
//           <div className="flex justify-center my-6">
//             <div className="relative">
//               <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-blue-300 to-gray-100 dark:from-gray-600 dark:via-blue-600 dark:to-gray-800"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
      
//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//               🤖 Enterprise AI Workflow Designer
//             </h1>
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Watch as our advanced AI creates your personalized social media automation workflow with smart integrations and enterprise-grade architecture.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span>Real-time AI Generation</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Smart Integration Matching</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Enterprise Architecture</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Enhanced Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-blue-500" />
//                   {!hasInitialRequest ? "Design Your Enterprise Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your automation needs and our AI will create the perfect workflow"
//                     : "Provide feedback to enhance and customize the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Enhanced Platform Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-3">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105"
//                                   : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:transform hover:scale-102"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <IconComponent className="h-5 w-5" />
//                                 <span className="font-medium">{channel.label}</span>
//                                 {selectedChannels.includes(channel.id) && (
//                                   <Check className="h-4 w-4 ml-auto" />
//                                 )}
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Enhanced Feature Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">AI Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label key={feature.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors">
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="w-4 h-4 rounded border-border"
//                             />
//                             <span className="text-sm font-medium">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Enhanced Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Describe Your Automation Vision
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I want to create an intelligent Instagram automation that responds to product inquiries, analyzes customer sentiment, integrates with our Shopify store, updates our HubSpot CRM, and escalates complex issues to human agents. Include payment processing for quick purchases and follow-up sequences for abandoned carts.'"
//                         rows={8}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
//                       Generate Enterprise AI Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refine Your Workflow
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add Salesforce integration instead of HubSpot', 'Include advanced analytics dashboard', 'Add WhatsApp Business API integration', 'Implement multi-language support'"
//                         rows={5}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <div className="flex gap-3">
//                       <Button
//                         onClick={handleRefine}
//                         disabled={isGenerating || !refinementInput.trim()}
//                         className="flex-1 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium"
//                       >
//                         {isGenerating && currentAction === "refine" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <RefreshCw className="h-4 w-4" />
//                         )}
//                         Refine Design
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isGenerating || !parsedWorkflow}
//                         className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center gap-2 font-medium"
//                       >
//                         {isGenerating && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Send to Designers
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Enhanced Business Context */}
//             <Card className="border-2 border-border/50 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building className="h-5 w-5 text-blue-500" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-sm">
//                 <div className="p-3 bg-white/50 rounded-lg">
//                   <span className="font-semibold text-blue-600">Business:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
//                 </div>
//                 <div className="p-3 bg-white/50 rounded-lg">
//                   <span className="font-semibold text-blue-600">Industry:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div className="p-3 bg-white/50 rounded-lg">
//                     <span className="font-semibold text-blue-600">Description:</span>
//                     <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div className="p-3 bg-white/50 rounded-lg">
//                     <span className="font-semibold text-blue-600">Selected Platforms:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {automationFeatures.length > 0 && (
//                   <div className="p-3 bg-white/50 rounded-lg">
//                     <span className="font-semibold text-blue-600">AI Features:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {automationFeatures.map((feature) => (
//                         <Badge key={feature} variant="outline" className="text-xs">
//                           {automationFeatureOptions.find((f) => f.id === feature)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Enhanced Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-blue-200 dark:border-blue-800 min-h-[700px] bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-6 w-6 text-blue-500" />
//                   Enterprise AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                       <Star className="h-3 w-3 mr-1" />
//                       AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Advanced AI creates production-ready workflows with smart integrations in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Enhanced Status Message */}
//                 {responseStatus && (
//                   <div className={`mb-6 p-4 rounded-xl border-2 ${
//                     responseStatus.includes("✅") ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 dark:text-green-300" :
//                     responseStatus.includes("❌") ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700 dark:text-red-300" :
//                     "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-700 dark:text-blue-300"
//                   }`}>
//                     <div className="flex items-center gap-3">
//                       {responseStatus.includes("✅") ? <CheckCircle className="h-5 w-5" /> :
//                        responseStatus.includes("❌") ? <AlertCircle className="h-5 w-5" /> :
//                        <Loader2 className="h-5 w-5 animate-spin" />}
//                       <span className="font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Enhanced Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200 dark:border-blue-700">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                         {parsedWorkflow.title}
//                       </h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-blue-600 mb-1">{parsedWorkflow.metrics?.automationRate}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-green-600 mb-1">{parsedWorkflow.metrics?.responseTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-purple-600 mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-orange-600 mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Enhanced ROI and Cost Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
//                         <div className="flex items-center gap-2 mb-2">
//                           <TrendingUp className="h-4 w-4 text-green-600" />
//                           <span className="font-semibold text-green-700 dark:text-green-300">Expected ROI</span>
//                         </div>
//                         <div className="text-xl font-bold text-green-600">{parsedWorkflow.roi}</div>
//                       </div>
//                       <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CreditCard className="h-4 w-4 text-blue-600" />
//                           <span className="font-semibold text-blue-700 dark:text-blue-300">Monthly Cost</span>
//                         </div>
//                         <div className="text-xl font-bold text-blue-600">{parsedWorkflow.estimatedCost}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Intelligent Workflow Steps</h3>
//                         <p className="text-muted-foreground">AI-designed automation with smart integrations</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {isStreaming ? `${streamingSteps.length} steps generated...` : `${streamingSteps.length} total steps`}
//                       </Badge>
//                     </div>
                    
//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}
                    
//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">AI is generating more intelligent steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Enhanced Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-12 w-12 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Create Enterprise-Grade Automation</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Our advanced AI will analyze your requirements and generate a complete, production-ready workflow with intelligent integrations and enterprise architecture.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">AI-Powered</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Smart Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Rocket className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">Enterprise Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <TrendingUp className="h-5 w-5 text-orange-500" />
//                         <span className="font-medium">ROI Optimized</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceflowWorkflowBuilder



// "use client"

// import React, { useState, useCallback, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
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
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Globe,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket,
//   Users,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
//   Plus,
//   X,
//   Check,
//   ExternalLink,
//   Building,
//   Cloud,
//   ShoppingCart,
//   CreditCard,
//   Calendar,
//   Briefcase,
//   Headphones,
//   BarChart,
//   Lock,
//   Webhook,
//   Link2,
//   Puzzle,
//   Search,
//   Package,
//   Gauge
// } from "lucide-react"

// // TypeScript interfaces
// interface BusinessInfo {
//   businessName: string
//   businessType: string
//   description?: string
//   website?: string
//   phone?: string
//   email?: string
// }

// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: BusinessInfo
//   selectedWorkflowId?: string | null
//   setStep?: (step: "selection" | "dashboard") => void
//   setActiveWorkflowExists?: (exists: boolean) => void
//   setActiveWorkflowDetails?: (details: any) => void
// }

// interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   icon: React.ComponentType<{ className?: string }>
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
// }

// interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits: string[]
//   exampleScenario: string
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// // Comprehensive Integration Database
// const INTEGRATION_DATABASE: Integration[] = [
//   // CRM Systems
//   {
//     id: "hubspot",
//     name: "HubSpot",
//     description: "Comprehensive CRM and marketing automation platform",
//     category: "crm",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 95,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
//     setupTime: "15-30 minutes",
//     website: "https://hubspot.com"
//   },
//   {
//     id: "salesforce",
//     name: "Salesforce",
//     description: "World's leading CRM platform for sales and customer service",
//     category: "crm",
//     icon: Cloud,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
//     setupTime: "30-60 minutes",
//     website: "https://salesforce.com"
//   },
//   {
//     id: "zoho-crm",
//     name: "Zoho CRM",
//     description: "Complete CRM solution for businesses of all sizes",
//     category: "crm",
//     icon: Briefcase,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Sales Automation", "Contact Management", "Analytics", "Mobile App"],
//     setupTime: "20-40 minutes",
//     website: "https://zoho.com/crm"
//   },
//   {
//     id: "pipedrive",
//     name: "Pipedrive",
//     description: "Sales-focused CRM designed for small and medium businesses",
//     category: "crm",
//     icon: BarChart,
//     pricing: "paid",
//     popularity: 80,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Pipeline Management", "Activity Tracking", "Email Integration", "Reports"],
//     setupTime: "15-25 minutes",
//     website: "https://pipedrive.com"
//   },

//   // E-commerce Platforms
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Leading e-commerce platform for online stores",
//     category: "ecommerce",
//     icon: ShoppingCart,
//     pricing: "paid",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Management", "Order Processing", "Inventory", "Payments"],
//     setupTime: "20-30 minutes",
//     website: "https://shopify.com"
//   },
//   {
//     id: "woocommerce",
//     name: "WooCommerce",
//     description: "Open-source e-commerce plugin for WordPress",
//     category: "ecommerce",
//     icon: Package,
//     pricing: "free",
//     popularity: 85,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Catalog", "Order Management", "Payment Gateways", "Extensions"],
//     setupTime: "30-45 minutes",
//     website: "https://woocommerce.com"
//   },
//   {
//     id: "magento",
//     name: "Magento",
//     description: "Flexible e-commerce platform for enterprise businesses",
//     category: "ecommerce",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 70,
//     difficulty: "hard",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Multi-store", "B2B Features", "Advanced SEO", "Customization"],
//     setupTime: "60-120 minutes",
//     website: "https://magento.com"
//   },

//   // Email Marketing
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "All-in-one email marketing and automation platform",
//     category: "email",
//     icon: Mail,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
//     setupTime: "10-20 minutes",
//     website: "https://mailchimp.com"
//   },
//   {
//     id: "sendgrid",
//     name: "SendGrid",
//     description: "Cloud-based email delivery service",
//     category: "email",
//     icon: Send,
//     pricing: "freemium",
//     popularity: 82,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Transactional Email", "Marketing Campaigns", "Analytics", "Templates"],
//     setupTime: "15-30 minutes",
//     website: "https://sendgrid.com"
//   },
//   {
//     id: "klaviyo",
//     name: "Klaviyo",
//     description: "Advanced email and SMS marketing platform",
//     category: "email",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 78,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Marketing", "SMS Marketing", "Segmentation", "Automation"],
//     setupTime: "20-35 minutes",
//     website: "https://klaviyo.com"
//   },

//   // Payment Systems
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Complete payment processing platform for businesses",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 95,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
//     setupTime: "25-40 minutes",
//     website: "https://stripe.com"
//   },
//   {
//     id: "paypal",
//     name: "PayPal",
//     description: "Global payment platform for online transactions",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Express Checkout", "Subscriptions", "Invoicing"],
//     setupTime: "15-25 minutes",
//     website: "https://paypal.com"
//   },

//   // Analytics & Tracking
//   {
//     id: "google-analytics",
//     name: "Google Analytics",
//     description: "Web analytics service for tracking website traffic",
//     category: "analytics",
//     icon: BarChart3,
//     pricing: "freemium",
//     popularity: 98,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
//     setupTime: "20-30 minutes",
//     website: "https://analytics.google.com"
//   },
//   {
//     id: "mixpanel",
//     name: "Mixpanel",
//     description: "Advanced product analytics platform",
//     category: "analytics",
//     icon: TrendingUp,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Event Tracking", "Funnel Analysis", "Cohort Analysis", "A/B Testing"],
//     setupTime: "30-45 minutes",
//     website: "https://mixpanel.com"
//   },

//   // Customer Support
//   {
//     id: "zendesk",
//     name: "Zendesk",
//     description: "Customer service and support ticketing platform",
//     category: "support",
//     icon: Headphones,
//     pricing: "paid",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Ticket Management", "Live Chat", "Knowledge Base", "Analytics"],
//     setupTime: "25-40 minutes",
//     website: "https://zendesk.com"
//   },
//   {
//     id: "intercom",
//     name: "Intercom",
//     description: "Conversational customer engagement platform",
//     category: "support",
//     icon: MessageCircle,
//     pricing: "paid",
//     popularity: 80,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Live Chat", "Help Desk", "Product Tours", "Automation"],
//     setupTime: "20-30 minutes",
//     website: "https://intercom.com"
//   },

//   // Calendar & Scheduling
//   {
//     id: "calendly",
//     name: "Calendly",
//     description: "Automated scheduling and calendar management",
//     category: "scheduling",
//     icon: Calendar,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Meeting Scheduling", "Calendar Integration", "Automated Reminders", "Analytics"],
//     setupTime: "10-15 minutes",
//     website: "https://calendly.com"
//   },
//   {
//     id: "acuity",
//     name: "Acuity Scheduling",
//     description: "Advanced appointment scheduling software",
//     category: "scheduling",
//     icon: Clock,
//     pricing: "paid",
//     popularity: 75,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Online Scheduling", "Payment Processing", "Intake Forms", "Packages"],
//     setupTime: "20-35 minutes",
//     website: "https://acuityscheduling.com"
//   },

//   // Databases & Storage
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database and spreadsheet hybrid",
//     category: "database",
//     icon: Database,
//     pricing: "freemium",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Database Management", "Forms", "Views", "Automations"],
//     setupTime: "15-25 minutes",
//     website: "https://airtable.com"
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "All-in-one workspace for notes, docs, and databases",
//     category: "database",
//     icon: FileText,
//     pricing: "freemium",
//     popularity: 82,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Databases", "Documents", "Wikis", "Project Management"],
//     setupTime: "20-30 minutes",
//     website: "https://notion.so"
//   },

//   // Communication
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Business communication and collaboration platform",
//     category: "communication",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
//     setupTime: "10-20 minutes",
//     website: "https://slack.com"
//   },
//   {
//     id: "discord",
//     name: "Discord",
//     description: "Voice, video, and text communication for communities",
//     category: "communication",
//     icon: MessageCircle,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Voice Chat", "Text Channels", "Bots", "Screen Sharing"],
//     setupTime: "15-25 minutes",
//     website: "https://discord.com"
//   },

//   // Webhooks & APIs
//   {
//     id: "zapier",
//     name: "Zapier",
//     description: "Automation platform connecting thousands of apps",
//     category: "automation",
//     icon: Zap,
//     pricing: "freemium",
//     popularity: 90,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["App Integrations", "Workflow Automation", "Multi-step Zaps", "Filters"],
//     setupTime: "5-15 minutes",
//     website: "https://zapier.com"
//   },
//   {
//     id: "make",
//     name: "Make (Integromat)",
//     description: "Advanced automation platform for complex workflows",
//     category: "automation",
//     icon: Puzzle,
//     pricing: "freemium",
//     popularity: 78,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Visual Automation", "Complex Logic", "Error Handling", "Scheduling"],
//     setupTime: "20-40 minutes",
//     website: "https://make.com"
//   }
// ]

// // Default business info - you can remove this in production
// const defaultBusinessInfo: BusinessInfo = {
//   businessName: "Your Business",
//   businessType: "Technology Company",
//   description: "We provide innovative solutions for businesses",
//   website: "https://yourbusiness.com",
//   phone: "+1-555-0123",
//   email: "contact@yourbusiness.com",
// }

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50"
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50"
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50"
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50"
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50"
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50"
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50"
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50"
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50"
//   },
//   payment: {
//     icon: CreditCard,
//     color: "text-green-600",
//     bgColor: "from-green-50 to-emerald-100",
//     borderColor: "border-green-300",
//     accentColor: "bg-green-500",
//     darkBg: "dark:from-green-900/20 dark:to-emerald-900/30",
//     darkBorder: "dark:border-green-600/50"
//   },
//   communication: {
//     icon: MessageSquare,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-sky-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-sky-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
// }

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs and automation goals",
//     icon: Search,
//     color: "text-blue-500",
//     duration: 3000
//   },
//   {
//     id: "designing",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and step sequences",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 4000
//   },
//   {
//     id: "integrations",
//     title: "Matching Integrations",
//     description: "Finding the best tools and platforms for each step",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 3000
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Performance",
//     description: "Fine-tuning for maximum efficiency and reliability",
//     icon: Gauge,
//     color: "text-orange-500",
//     duration: 2000
//   }
// ]

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = defaultBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isGenerating, setIsGenerating] = useState<boolean>(false)
//   const [responseStatus, setResponseStatus] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  
//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//     { id: "email", label: "Email Marketing", icon: Mail },
//     { id: "sms", label: "SMS Marketing", icon: Phone },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//     { id: "lead-scoring", label: "Lead Scoring" },
//     { id: "personalization", label: "Dynamic Personalization" },
//     { id: "escalation", label: "Intelligent Escalation" },
//   ]

//   // Real AI workflow generation with OpenAI/Anthropic
//   const generateWorkflowWithAI = useCallback(async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<void> => {
//     setIsGenerating(true)
//     setIsStreaming(true)
//     setCurrentPhase(0)
//     setStreamingProgress(0)
//     setStreamingSteps([])
//     setAiThoughts([])
//     setResponseStatus("🤖 Connecting to AI workflow engine...")
//     setCurrentAction(action)
//     setHasInitialRequest(true)

//     try {
//       // Phase progression with realistic timing
//       for (let phase = 0; phase < streamingPhases.length; phase++) {
//         setCurrentPhase(phase)
//         setResponseStatus(`${streamingPhases[phase].description}...`)
        
//         // Add AI thoughts during processing
//         addAiThought(getAiThoughtForPhase(phase))
        
//         await new Promise(resolve => setTimeout(resolve, streamingPhases[phase].duration))
//       }

//       // Generate workflow via AI API
//       const aiResponse = await callAIWorkflowGeneration(action, instructions)
      
//       if (aiResponse.success && aiResponse.workflowData) {
//         setParsedWorkflow(aiResponse.workflowData)
//         setStreamingProgress(100)
//         setResponseStatus("✅ Enterprise AI workflow generated successfully!")
//         addAiThought("🎉 Workflow generation complete! Ready for designer implementation.")
//       } else {
//         throw new Error(aiResponse.error || "AI generation failed")
//       }
      
//     } catch (error) {
//       console.error("AI generation error:", error)
//       setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//     } finally {
//       setIsStreaming(false)
//       setTimeout(() => {
//         setIsGenerating(false)
//       }, 1000)
//     }
//   }, [businessInfo, selectedChannels, automationFeatures, workflowRequest])

//   // Real AI API call (replace with your preferred AI provider)
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       const systemPrompt = `You are an expert workflow automation designer. Create detailed social media automation workflows with specific integrations and technical specifications.

// BUSINESS CONTEXT:
// - Company: ${businessInfo.businessName}
// - Type: ${businessInfo.businessType}
// - Description: ${businessInfo.description}
// - Platforms: ${selectedChannels.join(", ")}
// - Features needed: ${automationFeatures.join(", ")}

// USER REQUEST: ${workflowRequest}
// ${instructions ? `REFINEMENT: ${instructions}` : ""}

// Generate a comprehensive workflow with 8-12 steps. For each step, specify:
// 1. Title and detailed description
// 2. Step type (trigger, analysis, filter, response, routing, storage, etc.)
// 3. Estimated execution time
// 4. Business impact explanation
// 5. Suggested integrations from categories: CRM, email, ecommerce, payment, analytics, support, etc.
// 6. AI reasoning for why this step is important

// Return JSON format with complete workflow details, estimated costs, ROI projections, and technical requirements.`

//       const response = await fetch('/api/ai/generate-workflow', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           systemPrompt,
//           userRequest: workflowRequest,
//           businessInfo,
//           selectedChannels,
//           automationFeatures,
//           action,
//           refinementInstructions: instructions
//         })
//       })

//       if (!response.ok) {
//         throw new Error(`AI API failed: ${response.statusText}`)
//       }

//       const result = await response.json()
      
//       // Process the AI response and generate steps
//       const workflowSteps = await processAIResponseIntoSteps(result.workflowData)
      
//       const workflow: ParsedWorkflow = {
//         title: result.title || `${businessInfo.businessName} Social Media Automation`,
//         description: result.description || `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? 's' : ''}`,
//         platform: "Multi-Platform AI Automation",
//         estimatedBuildTime: result.estimatedBuildTime || "2-4 weeks",
//         complexity: result.complexity || "Enterprise",
//         steps: workflowSteps,
//         integrations: getUniqueIntegrations(workflowSteps),
//         benefits: result.benefits || [
//           "95% reduction in response time",
//           "24/7 automated customer engagement",
//           "Intelligent sentiment analysis and routing",
//           "Seamless human handoff when needed",
//           "Real-time analytics and insights",
//           "Scalable across multiple platforms"
//         ],
//         exampleScenario: result.exampleScenario || "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
//         technicalRequirements: result.technicalRequirements || [
//           "Social media platform API access",
//           "AI/ML processing pipeline", 
//           "Customer database integration",
//           "Real-time webhook handling",
//           "Analytics dashboard setup"
//         ],
//         deploymentChannels: selectedChannels,
//         estimatedCost: result.estimatedCost || "$500-2000/month",
//         roi: result.roi || "300-500% within 6 months",
//         metrics: {
//           automationRate: result.metrics?.automationRate || "92%",
//           responseTime: result.metrics?.responseTime || "< 2 seconds",
//           accuracy: result.metrics?.accuracy || "94%",
//           scalability: result.metrics?.scalability || "Enterprise"
//         }
//       }

//       return { success: true, workflowData: workflow }
      
//     } catch (error) {
//       console.error("AI API call failed:", error)
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : "AI generation failed" 
//       }
//     }
//   }

//   // Process AI response into workflow steps with streaming
//   const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const stepsData = workflowData?.steps || generateFallbackSteps()
    
//     for (let i = 0; i < stepsData.length; i++) {
//       const stepData = stepsData[i]
//       const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation
      
//       // Get suggested integrations for this step
//       const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)
      
//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: stepData.title,
//         description: stepData.description,
//         type: stepData.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
//         inputs: stepData.inputs || (i === 0 ? ["Social Media Message"] : ["Previous Step Output"]),
//         outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Workflow Completion"] : ["Processed Data"]),
//         details: stepData.details || [`Processes ${stepData.type} logic automatically`, "Integrates with selected platforms", "Maintains conversation context"],
//         isAnimating: true,
//         suggestedIntegrations,
//         selectedIntegrations: suggestedIntegrations.slice(0, 1), // Auto-select top integration
//         aiReasoning: stepData.aiReasoning || `This step is crucial for ${stepData.type} processing in your automation workflow.`,
//         complexity: stepData.complexity || "medium",
//         businessImpact: stepData.businessImpact || `Improves ${stepData.type} efficiency and customer satisfaction.`,
//         alternatives: stepData.alternatives || [`Alternative ${stepData.type} approaches`, "Custom implementation options"]
//       }

//       // Add step with animation
//       setStreamingSteps(prevSteps => [...prevSteps, step])
      
//       // Update progress
//       const progress = ((i + 1) / stepsData.length) * 70 + 25 // Start at 25%, end at 95%
//       setStreamingProgress(progress)
      
//       // Add AI thought
//       addAiThought(`🔧 Generated step ${i + 1}: ${step.title}`)
      
//       // Scroll to new step
//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
//           }
//         }
//       }, 100)
      
//       // Wait between steps for streaming effect
//       await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      
//       // Remove animation class
//       setStreamingSteps(prevSteps => 
//         prevSteps.map(s => s.id === step.id ? { ...s, isAnimating: false } : s)
//       )

//       steps.push(step)
//     }

//     return steps
//   }

//   // Get suggested integrations for a specific step type
//   const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
//     const suggestions: Integration[] = []
//     const title = stepTitle.toLowerCase()
    
//     // Smart integration matching based on step type and content
//     if (stepType === "trigger" || title.includes("message") || title.includes("reception")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "storage" || title.includes("log") || title.includes("store") || title.includes("save")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "database"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
//     }
    
//     if (stepType === "response" || title.includes("email") || title.includes("message") || title.includes("notification")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "email"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "payment" || title.includes("payment") || title.includes("billing") || title.includes("checkout")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "payment"))
//     }
    
//     if (stepType === "analysis" || title.includes("track") || title.includes("analyz") || title.includes("metric")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "analytics"))
//     }
    
//     if (title.includes("support") || title.includes("help") || title.includes("ticket")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "support"))
//     }
    
//     if (title.includes("schedule") || title.includes("appointment") || title.includes("calendar")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "scheduling"))
//     }
    
//     if (title.includes("product") || title.includes("order") || title.includes("inventory")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "ecommerce"))
//     }
    
//     // Always include automation tools as they're universally applicable
//     suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "automation"))
    
//     // Remove duplicates and sort by popularity
//     const uniqueSuggestions = suggestions.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
    
//     return uniqueSuggestions
//       .sort((a, b) => b.popularity - a.popularity)
//       .slice(0, 5) // Top 5 suggestions per step
//   }

//   // Helper functions
//   const getEstimatedTimeForStep = (stepType: string): string => {
//     const timeMap: Record<string, string> = {
//       trigger: "< 1s",
//       analysis: "2-3s",
//       filter: "1-2s",
//       response: "1-2s",
//       routing: "< 1s",
//       storage: "2-4s",
//       validation: "1-3s",
//       automation: "1-2s",
//       payment: "3-5s",
//       communication: "1-2s"
//     }
//     return timeMap[stepType] || "1-2s"
//   }

//   const generateFallbackSteps = () => [
//     {
//       title: "Message Reception & Processing",
//       description: "Capture and process incoming messages from all connected social media platforms",
//       type: "trigger",
//       aiReasoning: "Essential entry point for all customer interactions"
//     },
//     {
//       title: "Intent Analysis & Classification",
//       description: "AI analyzes message content to understand customer intent and urgency",
//       type: "analysis",
//       aiReasoning: "Critical for providing relevant and contextual responses"
//     },
//     {
//       title: "Content Filtering & Validation",
//       description: "Filter spam, inappropriate content, and validate message authenticity",
//       type: "filter",
//       aiReasoning: "Protects brand reputation and ensures quality interactions"
//     },
//     {
//       title: "Customer Data Enrichment",
//       description: "Enhance customer profile with available data from CRM and other sources",
//       type: "integration",
//       aiReasoning: "Enables personalized responses and better customer service"
//     },
//     {
//       title: "Intelligent Response Generation",
//       description: "Generate personalized responses based on customer context and business rules",
//       type: "response",
//       aiReasoning: "Provides immediate value to customers while maintaining brand voice"
//     },
//     {
//       title: "Human Escalation Assessment",
//       description: "Determine if human intervention is needed based on complexity and sentiment",
//       type: "routing",
//       aiReasoning: "Ensures complex issues receive appropriate human attention"
//     },
//     {
//       title: "CRM Integration & Updates",
//       description: "Update customer records and create relevant tasks in CRM system",
//       type: "storage",
//       aiReasoning: "Maintains comprehensive customer interaction history"
//     },
//     {
//       title: "Follow-up Sequence Automation",
//       description: "Schedule and send automated follow-up messages based on customer journey",
//       type: "automation",
//       aiReasoning: "Maximizes engagement and conversion opportunities"
//     },
//     {
//       title: "Performance Analytics & Reporting",
//       description: "Track workflow performance and generate insights for continuous improvement",
//       type: "validation",
//       aiReasoning: "Enables data-driven optimization of the automation workflow"
//     }
//   ]

//   const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     const allIntegrations = steps.flatMap(step => step.selectedIntegrations || [])
//     return allIntegrations.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts(prev => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5) // Keep only last 5 thoughts
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//     const thoughts = [
//       "🔍 Analyzing your business requirements and social media automation needs...",
//       "🎨 Designing optimal workflow architecture with enterprise-grade components...",
//       "🔗 Matching your needs with the best available integrations and tools...",
//       "⚡ Optimizing workflow for maximum performance and reliability..."
//     ]
//     return thoughts[phase] || "🤖 Processing your workflow requirements..."
//   }

//   // Handle approval and send to designers via N8N
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Sending comprehensive workflow design to development team...")

//     try {
//       const payload = {
//         action: "send_to_designers",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         approvedAt: new Date().toISOString(),
//         estimatedCost: parsedWorkflow?.estimatedCost,
//         roi: parsedWorkflow?.roi,
//         integrations: parsedWorkflow?.integrations
//       }

//       const response = await fetch('/api/send-to-designers', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to send to designers: ${response.statusText}`)
//       }

//       const result = await response.json()
//       setResponseStatus("✅ Enterprise workflow design sent to development team successfully!")
      
//       if (setActiveWorkflowExists) setActiveWorkflowExists(true)
//       if (setActiveWorkflowDetails) {
//         setActiveWorkflowDetails({
//           id: `workflow-${Date.now()}`,
//           workflowTemplate: { name: parsedWorkflow?.title || "AI Social Media Automation" },
//           businessInfo: businessInfo,
//           parsedWorkflow: parsedWorkflow,
//           status: "SENT_TO_DESIGNERS",
//           platform: "social-media-automation",
//           channels: selectedChannels,
//           features: automationFeatures,
//           approvedAt: new Date().toISOString(),
//           estimatedCost: parsedWorkflow?.estimatedCost,
//           roi: parsedWorkflow?.roi
//         })
//       }

//       setTimeout(() => {
//         if (setStep) setStep("dashboard")
//       }, 2000)

//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to send to designers. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
//       return
//     }
//     generateWorkflowWithAI("initial")
//   }

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions")
//       return
//     }
//     generateWorkflowWithAI("refine", refinementInput)
//     setRefinementInput("")
//   }

//   const toggleStepExpansion = (stepNumber: number): void => {
//     setExpandedSteps(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter(c => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures(prev => [...prev, featureId])
//     } else {
//       setAutomationFeatures(prev => prev.filter(f => f !== featureId))
//     }
//   }

//   const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
//     setStreamingSteps(prevSteps => 
//       prevSteps.map(step => {
//         if (step.id === stepId) {
//           const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
//           const newSelected = isSelected
//             ? step.selectedIntegrations?.filter(i => i.id !== integration.id) || []
//             : [...(step.selectedIntegrations || []), integration]
          
//           return { ...step, selectedIntegrations: newSelected }
//         }
//         return step
//       })
//     )
//   }

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || 'text-blue-500'} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">{currentPhaseData?.description || "Working on your workflow..."}</p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Overall Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                   index < currentPhase ? 'bg-green-500 text-white shadow-lg' :
//                   index === currentPhase ? 'bg-blue-500 text-white animate-pulse shadow-lg' :
//                   'bg-gray-200 text-gray-400'
//                 }`}>
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : 
//                    <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span className={`text-xs mt-2 text-center font-medium ${
//                   index === currentPhase ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
//                 }`}>
//                   {phase.title.split(' ')[0]}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* AI Thoughts */}
//         {aiThoughts.length > 0 && (
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
//                   }`}
//                 >
//                   {thought}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

//     return (
//       <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
//         <h6 className="font-semibold mb-3 flex items-center gap-2">
//           <Puzzle className="h-4 w-4 text-purple-500" />
//           Suggested Integrations
//           <Badge variant="outline" className="text-xs">
//             {step.suggestedIntegrations.length} available
//           </Badge>
//         </h6>
        
//         <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
//           {step.suggestedIntegrations.map((integration) => {
//             const IconComponent = integration.icon
//             const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
            
//             return (
//               <div
//                 key={integration.id}
//                 onClick={() => handleIntegrationToggle(step.id, integration)}
//                 className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
//                   isSelected
//                     ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                     : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className="h-5 w-5 flex-shrink-0" />
//                   <div className="flex-grow min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-sm truncate">{integration.name}</span>
//                       <Badge 
//                         variant={isSelected ? "secondary" : "outline"} 
//                         className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
//                       >
//                         {integration.pricing}
//                       </Badge>
//                     </div>
//                     <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
//                       {integration.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Timer className="h-3 w-3" />
//                         {integration.setupTime}
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Star className="h-3 w-3" />
//                         {integration.popularity}%
//                       </div>
//                     </div>
//                   </div>
//                   {isSelected ? (
//                     <Check className="h-4 w-4 text-white" />
//                   ) : (
//                     <Plus className="h-4 w-4 text-gray-400" />
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div 
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${
//           step.isAnimating ? 'animate-pulse' : ''
//         }`}
//         style={{
//           animation: step.isAnimating ? 'slideInFromLeft 0.6s ease-out' : 'none'
//         }}
//       >
//         <div className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//           config.bgColor} ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//           isExpanded ? 'shadow-xl scale-[1.02] border-opacity-100' : 'hover:shadow-lg hover:scale-[1.01] border-opacity-60'
//         }`}
//         onClick={() => toggleStepExpansion(step.stepNumber)}>
          
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Enhanced Step Number with Icon */}
//               <div className="relative">
//                 <div className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                   <IconComponent className={`h-4 w-4 ${config.color}`} />
//                 </div>
//               </div>

//               {/* Enhanced Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   <Badge variant="secondary" className={`text-xs ${
//                     step.complexity === "high" ? "bg-red-100 text-red-700" :
//                     step.complexity === "medium" ? "bg-yellow-100 text-yellow-700" :
//                     "bg-green-100 text-green-700"
//                   }`}>
//                     {step.complexity} complexity
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                
//                 {/* Enhanced Input/Output Flow */}
//                 <div className="flex items-center gap-6 text-sm">
//                   {step.inputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-700 dark:text-green-300 font-medium">
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Integration Preview */}
//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map(i => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Expand Icon */}
//               <div className="flex items-center">
//                 {isExpanded ? (
//                   <ChevronDown className="h-6 w-6 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-6 w-6 text-muted-foreground" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Expanded Details */}
//           {isExpanded && (
//             <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
//               {/* AI Reasoning */}
//               {step.aiReasoning && (
//                 <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
//                   <h6 className="font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
//                     <Brain className="h-4 w-4" />
//                     AI Reasoning
//                   </h6>
//                   <p className="text-sm text-purple-600 dark:text-purple-400">{step.aiReasoning}</p>
//                 </div>
//               )}

//               <div className="grid lg:grid-cols-3 gap-6">
//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Layers className="h-4 w-4 text-blue-500" />
//                     Implementation Details
//                   </h5>
//                   <ul className="space-y-2 text-sm text-muted-foreground">
//                     {step.details?.map((detail, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                         <span>{detail}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Activity className="h-4 w-4 text-green-500" />
//                     Performance & Impact
//                   </h5>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Business Impact:</span>
//                       <Badge variant="secondary" className="text-green-600">High</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Reliability:</span>
//                       <Badge variant="secondary" className="text-blue-600">99.9%</Badge>
//                     </div>
//                     {step.businessImpact && (
//                       <p className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
//                         {step.businessImpact}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-orange-500" />
//                     Configuration Options
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span>Auto-retry enabled</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       <span>Real-time monitoring</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                       <span>Custom error handling</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                       <span>Performance optimization</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Integration Selector */}
//               <IntegrationSelector step={step} />
//             </div>
//           )}
//         </div>

//         {/* Enhanced Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
//           <div className="flex justify-center my-6">
//             <div className="relative">
//               <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-blue-300 to-gray-100 dark:from-gray-600 dark:via-blue-600 dark:to-gray-800"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
      
//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//               🤖 Enterprise AI Workflow Designer
//             </h1>
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Watch as our advanced AI creates your personalized social media automation workflow with smart integrations and enterprise-grade architecture.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span>Real-time AI Generation</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Smart Integration Matching</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Enterprise Architecture</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Enhanced Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-blue-500" />
//                   {!hasInitialRequest ? "Design Your Enterprise Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your automation needs and our AI will create the perfect workflow"
//                     : "Provide feedback to enhance and customize the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Enhanced Platform Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-3">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105"
//                                   : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:transform hover:scale-102"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <IconComponent className="h-5 w-5" />
//                                 <span className="font-medium">{channel.label}</span>
//                                 {selectedChannels.includes(channel.id) && (
//                                   <Check className="h-4 w-4 ml-auto" />
//                                 )}
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Enhanced Feature Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">AI Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label key={feature.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors">
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="w-4 h-4 rounded border-border"
//                             />
//                             <span className="text-sm font-medium">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Enhanced Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Describe Your Automation Vision
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I want to create an intelligent Instagram automation that responds to product inquiries, analyzes customer sentiment, integrates with our Shopify store, updates our HubSpot CRM, and escalates complex issues to human agents. Include payment processing for quick purchases and follow-up sequences for abandoned carts.'"
//                         rows={8}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
//                       Generate Enterprise AI Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refine Your Workflow
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add Salesforce integration instead of HubSpot', 'Include advanced analytics dashboard', 'Add WhatsApp Business API integration', 'Implement multi-language support'"
//                         rows={5}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <div className="flex gap-3">
//                       <Button
//                         onClick={handleRefine}
//                         disabled={isGenerating || !refinementInput.trim()}
//                         className="flex-1 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium"
//                       >
//                         {isGenerating && currentAction === "refine" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <RefreshCw className="h-4 w-4" />
//                         )}
//                         Refine Design
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isGenerating || !parsedWorkflow}
//                         className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center gap-2 font-medium"
//                       >
//                         {isGenerating && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Send to Designers
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Enhanced Business Context */}
//             <Card className="border-2 border-border/50 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building className="h-5 w-5 text-blue-500" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-sm">
//                 <div className="p-3 bg-white/50 rounded-lg">
//                   <span className="font-semibold text-blue-600">Business:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
//                 </div>
//                 <div className="p-3 bg-white/50 rounded-lg">
//                   <span className="font-semibold text-blue-600">Industry:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div className="p-3 bg-white/50 rounded-lg">
//                     <span className="font-semibold text-blue-600">Description:</span>
//                     <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div className="p-3 bg-white/50 rounded-lg">
//                     <span className="font-semibold text-blue-600">Selected Platforms:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {automationFeatures.length > 0 && (
//                   <div className="p-3 bg-white/50 rounded-lg">
//                     <span className="font-semibold text-blue-600">AI Features:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {automationFeatures.map((feature) => (
//                         <Badge key={feature} variant="outline" className="text-xs">
//                           {automationFeatureOptions.find((f) => f.id === feature)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Enhanced Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-blue-200 dark:border-blue-800 min-h-[700px] bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-6 w-6 text-blue-500" />
//                   Enterprise AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                       <Star className="h-3 w-3 mr-1" />
//                       AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Advanced AI creates production-ready workflows with smart integrations in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Enhanced Status Message */}
//                 {responseStatus && (
//                   <div className={`mb-6 p-4 rounded-xl border-2 ${
//                     responseStatus.includes("✅") ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 dark:text-green-300" :
//                     responseStatus.includes("❌") ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700 dark:text-red-300" :
//                     "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-700 dark:text-blue-300"
//                   }`}>
//                     <div className="flex items-center gap-3">
//                       {responseStatus.includes("✅") ? <CheckCircle className="h-5 w-5" /> :
//                        responseStatus.includes("❌") ? <AlertCircle className="h-5 w-5" /> :
//                        <Loader2 className="h-5 w-5 animate-spin" />}
//                       <span className="font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Enhanced Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200 dark:border-blue-700">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                         {parsedWorkflow.title}
//                       </h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-blue-600 mb-1">{parsedWorkflow.metrics?.automationRate}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-green-600 mb-1">{parsedWorkflow.metrics?.responseTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-purple-600 mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
//                         <div className="text-2xl font-bold text-orange-600 mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Enhanced ROI and Cost Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
//                         <div className="flex items-center gap-2 mb-2">
//                           <TrendingUp className="h-4 w-4 text-green-600" />
//                           <span className="font-semibold text-green-700 dark:text-green-300">Expected ROI</span>
//                         </div>
//                         <div className="text-xl font-bold text-green-600">{parsedWorkflow.roi}</div>
//                       </div>
//                       <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CreditCard className="h-4 w-4 text-blue-600" />
//                           <span className="font-semibold text-blue-700 dark:text-blue-300">Monthly Cost</span>
//                         </div>
//                         <div className="text-xl font-bold text-blue-600">{parsedWorkflow.estimatedCost}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Intelligent Workflow Steps</h3>
//                         <p className="text-muted-foreground">AI-designed automation with smart integrations</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {isStreaming ? `${streamingSteps.length} steps generated...` : `${streamingSteps.length} total steps`}
//                       </Badge>
//                     </div>
                    
//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}
                    
//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">AI is generating more intelligent steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Enhanced Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-12 w-12 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Create Enterprise-Grade Automation</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Our advanced AI will analyze your requirements and generate a complete, production-ready workflow with intelligent integrations and enterprise architecture.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">AI-Powered</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Smart Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Rocket className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">Enterprise Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <TrendingUp className="h-5 w-5 text-orange-500" />
//                         <span className="font-medium">ROI Optimized</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceflowWorkflowBuilder












// "use client"

// import React, { useState, useCallback, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
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
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Globe,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket,
//   Users,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
//   Plus,
//   X,
//   Check,
//   ExternalLink,
//   Building,
//   Cloud,
//   ShoppingCart,
//   CreditCard,
//   Calendar,
//   Briefcase,
//   Headphones,
//   BarChart,
//   Lock,
//   Webhook,
//   Link2,
//   Puzzle,
//   Search,
//   Package,
//   Gauge
// } from "lucide-react"

// // TypeScript interfaces
// interface BusinessInfo {
//   businessName: string
//   businessType: string
//   description?: string
//   website?: string
//   phone?: string
//   email?: string
// }

// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: BusinessInfo
//   selectedWorkflowId?: string | null
//   setStep?: (step: "selection" | "dashboard") => void
//   setActiveWorkflowExists?: (exists: boolean) => void
//   setActiveWorkflowDetails?: (details: any) => void
// }

// interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   icon: React.ComponentType<{ className?: string }>
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
// }

// interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits: string[]
//   exampleScenario: string
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// // Comprehensive Integration Database
// const INTEGRATION_DATABASE: Integration[] = [
//   // CRM Systems
//   {
//     id: "hubspot",
//     name: "HubSpot",
//     description: "Comprehensive CRM and marketing automation platform",
//     category: "crm",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 95,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
//     setupTime: "15-30 minutes",
//     website: "https://hubspot.com"
//   },
//   {
//     id: "salesforce",
//     name: "Salesforce",
//     description: "World's leading CRM platform for sales and customer service",
//     category: "crm",
//     icon: Cloud,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
//     setupTime: "30-60 minutes",
//     website: "https://salesforce.com"
//   },
//   {
//     id: "zoho-crm",
//     name: "Zoho CRM",
//     description: "Complete CRM solution for businesses of all sizes",
//     category: "crm",
//     icon: Briefcase,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Sales Automation", "Contact Management", "Analytics", "Mobile App"],
//     setupTime: "20-40 minutes",
//     website: "https://zoho.com/crm"
//   },
//   {
//     id: "pipedrive",
//     name: "Pipedrive",
//     description: "Sales-focused CRM designed for small and medium businesses",
//     category: "crm",
//     icon: BarChart,
//     pricing: "paid",
//     popularity: 80,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Pipeline Management", "Activity Tracking", "Email Integration", "Reports"],
//     setupTime: "15-25 minutes",
//     website: "https://pipedrive.com"
//   },

//   // E-commerce Platforms
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Leading e-commerce platform for online stores",
//     category: "ecommerce",
//     icon: ShoppingCart,
//     pricing: "paid",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Management", "Order Processing", "Inventory", "Payments"],
//     setupTime: "20-30 minutes",
//     website: "https://shopify.com"
//   },
//   {
//     id: "woocommerce",
//     name: "WooCommerce",
//     description: "Open-source e-commerce plugin for WordPress",
//     category: "ecommerce",
//     icon: Package,
//     pricing: "free",
//     popularity: 85,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Catalog", "Order Management", "Payment Gateways", "Extensions"],
//     setupTime: "30-45 minutes",
//     website: "https://woocommerce.com"
//   },
//   {
//     id: "magento",
//     name: "Magento",
//     description: "Flexible e-commerce platform for enterprise businesses",
//     category: "ecommerce",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 70,
//     difficulty: "hard",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Multi-store", "B2B Features", "Advanced SEO", "Customization"],
//     setupTime: "60-120 minutes",
//     website: "https://magento.com"
//   },

//   // Email Marketing
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "All-in-one email marketing and automation platform",
//     category: "email",
//     icon: Mail,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
//     setupTime: "10-20 minutes",
//     website: "https://mailchimp.com"
//   },
//   {
//     id: "sendgrid",
//     name: "SendGrid",
//     description: "Cloud-based email delivery service",
//     category: "email",
//     icon: Send,
//     pricing: "freemium",
//     popularity: 82,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Transactional Email", "Marketing Campaigns", "Analytics", "Templates"],
//     setupTime: "15-30 minutes",
//     website: "https://sendgrid.com"
//   },
//   {
//     id: "klaviyo",
//     name: "Klaviyo",
//     description: "Advanced email and SMS marketing platform",
//     category: "email",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 78,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Marketing", "SMS Marketing", "Segmentation", "Automation"],
//     setupTime: "20-35 minutes",
//     website: "https://klaviyo.com"
//   },

//   // Payment Systems
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Complete payment processing platform for businesses",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 95,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
//     setupTime: "25-40 minutes",
//     website: "https://stripe.com"
//   },
//   {
//     id: "paypal",
//     name: "PayPal",
//     description: "Global payment platform for online transactions",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Express Checkout", "Subscriptions", "Invoicing"],
//     setupTime: "15-25 minutes",
//     website: "https://paypal.com"
//   },

//   // Analytics & Tracking
//   {
//     id: "google-analytics",
//     name: "Google Analytics",
//     description: "Web analytics service for tracking website traffic",
//     category: "analytics",
//     icon: BarChart3,
//     pricing: "freemium",
//     popularity: 98,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
//     setupTime: "20-30 minutes",
//     website: "https://analytics.google.com"
//   },
//   {
//     id: "mixpanel",
//     name: "Mixpanel",
//     description: "Advanced product analytics platform",
//     category: "analytics",
//     icon: TrendingUp,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Event Tracking", "Funnel Analysis", "Cohort Analysis", "A/B Testing"],
//     setupTime: "30-45 minutes",
//     website: "https://mixpanel.com"
//   },

//   // Customer Support
//   {
//     id: "zendesk",
//     name: "Zendesk",
//     description: "Customer service and support ticketing platform",
//     category: "support",
//     icon: Headphones,
//     pricing: "paid",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Ticket Management", "Live Chat", "Knowledge Base", "Analytics"],
//     setupTime: "25-40 minutes",
//     website: "https://zendesk.com"
//   },
//   {
//     id: "intercom",
//     name: "Intercom",
//     description: "Conversational customer engagement platform",
//     category: "support",
//     icon: MessageCircle,
//     pricing: "paid",
//     popularity: 80,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Live Chat", "Help Desk", "Product Tours", "Automation"],
//     setupTime: "20-30 minutes",
//     website: "https://intercom.com"
//   },

//   // Calendar & Scheduling
//   {
//     id: "calendly",
//     name: "Calendly",
//     description: "Automated scheduling and calendar management",
//     category: "scheduling",
//     icon: Calendar,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Meeting Scheduling", "Calendar Integration", "Automated Reminders", "Analytics"],
//     setupTime: "10-15 minutes",
//     website: "https://calendly.com"
//   },
//   {
//     id: "acuity",
//     name: "Acuity Scheduling",
//     description: "Advanced appointment scheduling software",
//     category: "scheduling",
//     icon: Clock,
//     pricing: "paid",
//     popularity: 75,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Online Scheduling", "Payment Processing", "Intake Forms", "Packages"],
//     setupTime: "20-35 minutes",
//     website: "https://acuityscheduling.com"
//   },

//   // Databases & Storage
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database and spreadsheet hybrid",
//     category: "database",
//     icon: Database,
//     pricing: "freemium",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Database Management", "Forms", "Views", "Automations"],
//     setupTime: "15-25 minutes",
//     website: "https://airtable.com"
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "All-in-one workspace for notes, docs, and databases",
//     category: "database",
//     icon: FileText,
//     pricing: "freemium",
//     popularity: 82,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Databases", "Documents", "Wikis", "Project Management"],
//     setupTime: "20-30 minutes",
//     website: "https://notion.so"
//   },

//   // Communication
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Business communication and collaboration platform",
//     category: "communication",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
//     setupTime: "10-20 minutes",
//     website: "https://slack.com"
//   },
//   {
//     id: "discord",
//     name: "Discord",
//     description: "Voice, video, and text communication for communities",
//     category: "communication",
//     icon: MessageCircle,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Voice Chat", "Text Channels", "Bots", "Screen Sharing"],
//     setupTime: "15-25 minutes",
//     website: "https://discord.com"
//   },

//   // Webhooks & APIs
//   {
//     id: "zapier",
//     name: "Zapier",
//     description: "Automation platform connecting thousands of apps",
//     category: "automation",
//     icon: Zap,
//     pricing: "freemium",
//     popularity: 90,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["App Integrations", "Workflow Automation", "Multi-step Zaps", "Filters"],
//     setupTime: "5-15 minutes",
//     website: "https://zapier.com"
//   },
//   {
//     id: "make",
//     name: "Make (Integromat)",
//     description: "Advanced automation platform for complex workflows",
//     category: "automation",
//     icon: Puzzle,
//     pricing: "freemium",
//     popularity: 78,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Visual Automation", "Complex Logic", "Error Handling", "Scheduling"],
//     setupTime: "20-40 minutes",
//     website: "https://make.com"
//   }
// ]

// // Default business info - you can remove this in production
// const defaultBusinessInfo: BusinessInfo = {
//   businessName: "Your Business",
//   businessType: "Technology Company",
//   description: "We provide innovative solutions for businesses",
//   website: "https://yourbusiness.com",
//   phone: "+1-555-0123",
//   email: "contact@yourbusiness.com",
// }

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50"
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50"
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50"
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50"
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50"
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50"
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50"
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50"
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50"
//   },
//   payment: {
//     icon: CreditCard,
//     color: "text-green-600",
//     bgColor: "from-green-50 to-emerald-100",
//     borderColor: "border-green-300",
//     accentColor: "bg-green-500",
//     darkBg: "dark:from-green-900/20 dark:to-emerald-900/30",
//     darkBorder: "dark:border-green-600/50"
//   },
//   communication: {
//     icon: MessageSquare,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-sky-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-sky-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
// }

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs and automation goals",
//     icon: Search,
//     color: "text-blue-500",
//     duration: 3000
//   },
//   {
//     id: "designing",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and step sequences",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 4000
//   },
//   {
//     id: "integrations",
//     title: "Matching Integrations",
//     description: "Finding the best tools and platforms for each step",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 3000
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Performance",
//     description: "Fine-tuning for maximum efficiency and reliability",
//     icon: Gauge,
//     color: "text-orange-500",
//     duration: 2000
//   }
// ]

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = defaultBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isGenerating, setIsGenerating] = useState<boolean>(false)
//   const [responseStatus, setResponseStatus] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  
//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//     { id: "email", label: "Email Marketing", icon: Mail },
//     { id: "sms", label: "SMS Marketing", icon: Phone },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//     { id: "lead-scoring", label: "Lead Scoring" },
//     { id: "personalization", label: "Dynamic Personalization" },
//     { id: "escalation", label: "Intelligent Escalation" },
//   ]

//   // Real AI workflow generation with OpenAI/Anthropic
//   const generateWorkflowWithAI = useCallback(async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<void> => {
//     setIsGenerating(true)
//     setIsStreaming(true)
//     setCurrentPhase(0)
//     setStreamingProgress(0)
//     setStreamingSteps([])
//     setAiThoughts([])
//     setResponseStatus("🤖 Connecting to AI workflow engine...")
//     setCurrentAction(action)
//     setHasInitialRequest(true)

//     try {
//       // Phase progression with realistic timing
//       for (let phase = 0; phase < streamingPhases.length; phase++) {
//         setCurrentPhase(phase)
//         setResponseStatus(`${streamingPhases[phase].description}...`)
        
//         // Add AI thoughts during processing
//         addAiThought(getAiThoughtForPhase(phase))
        
//         await new Promise(resolve => setTimeout(resolve, streamingPhases[phase].duration))
//       }

//       // Generate workflow via AI API
//       const aiResponse = await callAIWorkflowGeneration(action, instructions)
      
//       if (aiResponse.success && aiResponse.workflowData) {
//         setParsedWorkflow(aiResponse.workflowData)
//         setStreamingProgress(100)
//         setResponseStatus("✅ Enterprise AI workflow generated successfully!")
//         addAiThought("🎉 Workflow generation complete! Ready for designer implementation.")
//       } else {
//         throw new Error(aiResponse.error || "AI generation failed")
//       }
      
//     } catch (error) {
//       console.error("AI generation error:", error)
//       setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//     } finally {
//       setIsStreaming(false)
//       setTimeout(() => {
//         setIsGenerating(false)
//       }, 1000)
//     }
//   }, [businessInfo, selectedChannels, automationFeatures, workflowRequest])

//   // Real AI API call (replace with your preferred AI provider)
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       const systemPrompt = `You are an expert workflow automation designer. Create detailed social media automation workflows with specific integrations and technical specifications.

// BUSINESS CONTEXT:
// - Company: ${businessInfo.businessName}
// - Type: ${businessInfo.businessType}
// - Description: ${businessInfo.description}
// - Platforms: ${selectedChannels.join(", ")}
// - Features needed: ${automationFeatures.join(", ")}

// USER REQUEST: ${workflowRequest}
// ${instructions ? `REFINEMENT: ${instructions}` : ""}

// Generate a comprehensive workflow with 8-12 steps. For each step, specify:
// 1. Title and detailed description
// 2. Step type (trigger, analysis, filter, response, routing, storage, etc.)
// 3. Estimated execution time
// 4. Business impact explanation
// 5. Suggested integrations from categories: CRM, email, ecommerce, payment, analytics, support, etc.
// 6. AI reasoning for why this step is important

// Return JSON format with complete workflow details, estimated costs, ROI projections, and technical requirements.`

//       const response = await fetch('/api/ai/generate-workflow', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           systemPrompt,
//           userRequest: workflowRequest,
//           businessInfo,
//           selectedChannels,
//           automationFeatures,
//           action,
//           refinementInstructions: instructions
//         })
//       })

//       if (!response.ok) {
//         throw new Error(`AI API failed: ${response.statusText}`)
//       }

//       const result = await response.json()
      
//       // Process the AI response and generate steps
//       const workflowSteps = await processAIResponseIntoSteps(result.workflowData)
      
//       const workflow: ParsedWorkflow = {
//         title: result.title || `${businessInfo.businessName} Social Media Automation`,
//         description: result.description || `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? 's' : ''}`,
//         platform: "Multi-Platform AI Automation",
//         estimatedBuildTime: result.estimatedBuildTime || "2-4 weeks",
//         complexity: result.complexity || "Enterprise",
//         steps: workflowSteps,
//         integrations: getUniqueIntegrations(workflowSteps),
//         benefits: result.benefits || [
//           "95% reduction in response time",
//           "24/7 automated customer engagement",
//           "Intelligent sentiment analysis and routing",
//           "Seamless human handoff when needed",
//           "Real-time analytics and insights",
//           "Scalable across multiple platforms"
//         ],
//         exampleScenario: result.exampleScenario || "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
//         technicalRequirements: result.technicalRequirements || [
//           "Social media platform API access",
//           "AI/ML processing pipeline", 
//           "Customer database integration",
//           "Real-time webhook handling",
//           "Analytics dashboard setup"
//         ],
//         deploymentChannels: selectedChannels,
//         estimatedCost: result.estimatedCost || "$500-2000/month",
//         roi: result.roi || "300-500% within 6 months",
//         metrics: {
//           automationRate: result.metrics?.automationRate || "92%",
//           responseTime: result.metrics?.responseTime || "< 2 seconds",
//           accuracy: result.metrics?.accuracy || "94%",
//           scalability: result.metrics?.scalability || "Enterprise"
//         }
//       }

//       return { success: true, workflowData: workflow }
      
//     } catch (error) {
//       console.error("AI API call failed:", error)
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : "AI generation failed" 
//       }
//     }
//   }

//   // Process AI response into workflow steps with streaming
//   const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const stepsData = workflowData?.steps || generateFallbackSteps()
    
//     for (let i = 0; i < stepsData.length; i++) {
//       const stepData = stepsData[i]
//       const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation
      
//       // Get suggested integrations for this step
//       const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)
      
//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: stepData.title,
//         description: stepData.description,
//         type: stepData.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
//         inputs: stepData.inputs || (i === 0 ? ["Social Media Message"] : ["Previous Step Output"]),
//         outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Workflow Completion"] : ["Processed Data"]),
//         details: stepData.details || [`Processes ${stepData.type} logic automatically`, "Integrates with selected platforms", "Maintains conversation context"],
//         isAnimating: true,
//         suggestedIntegrations,
//         selectedIntegrations: suggestedIntegrations.slice(0, 1), // Auto-select top integration
//         aiReasoning: stepData.aiReasoning || `This step is crucial for ${stepData.type} processing in your automation workflow.`,
//         complexity: stepData.complexity || "medium",
//         businessImpact: stepData.businessImpact || `Improves ${stepData.type} efficiency and customer satisfaction.`,
//         alternatives: stepData.alternatives || [`Alternative ${stepData.type} approaches`, "Custom implementation options"]
//       }

//       // Add step with animation
//       setStreamingSteps(prevSteps => [...prevSteps, step])
      
//       // Update progress
//       const progress = ((i + 1) / stepsData.length) * 70 + 25 // Start at 25%, end at 95%
//       setStreamingProgress(progress)
      
//       // Add AI thought
//       addAiThought(`🔧 Generated step ${i + 1}: ${step.title}`)
      
//       // Scroll to new step
//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
//           }
//         }
//       }, 100)
      
//       // Wait between steps for streaming effect
//       await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      
//       // Remove animation class
//       setStreamingSteps(prevSteps => 
//         prevSteps.map(s => s.id === step.id ? { ...s, isAnimating: false } : s)
//       )

//       steps.push(step)
//     }

//     return steps
//   }

//   // Get suggested integrations for a specific step type
//   const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
//     const suggestions: Integration[] = []
//     const title = stepTitle.toLowerCase()
    
//     // Smart integration matching based on step type and content
//     if (stepType === "trigger" || title.includes("message") || title.includes("reception")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "storage" || title.includes("log") || title.includes("store") || title.includes("save")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "database"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
//     }
    
//     if (stepType === "response" || title.includes("email") || title.includes("message") || title.includes("notification")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "email"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "payment" || title.includes("payment") || title.includes("billing") || title.includes("checkout")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "payment"))
//     }
    
//     if (stepType === "analysis" || title.includes("track") || title.includes("analyz") || title.includes("metric")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "analytics"))
//     }
    
//     if (title.includes("support") || title.includes("help") || title.includes("ticket")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "support"))
//     }
    
//     if (title.includes("schedule") || title.includes("appointment") || title.includes("calendar")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "scheduling"))
//     }
    
//     if (title.includes("product") || title.includes("order") || title.includes("inventory")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "ecommerce"))
//     }
    
//     // Always include automation tools as they're universally applicable
//     suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "automation"))
    
//     // Remove duplicates and sort by popularity
//     const uniqueSuggestions = suggestions.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
    
//     return uniqueSuggestions
//       .sort((a, b) => b.popularity - a.popularity)
//       .slice(0, 5) // Top 5 suggestions per step
//   }

//   // Helper functions
//   const getEstimatedTimeForStep = (stepType: string): string => {
//     const timeMap: Record<string, string> = {
//       trigger: "< 1s",
//       analysis: "2-3s",
//       filter: "1-2s",
//       response: "1-2s",
//       routing: "< 1s",
//       storage: "2-4s",
//       validation: "1-3s",
//       automation: "1-2s",
//       payment: "3-5s",
//       communication: "1-2s"
//     }
//     return timeMap[stepType] || "1-2s"
//   }

//   const generateFallbackSteps = () => [
//     {
//       title: "Message Reception & Processing",
//       description: "Capture and process incoming messages from all connected social media platforms",
//       type: "trigger",
//       aiReasoning: "Essential entry point for all customer interactions"
//     },
//     {
//       title: "Intent Analysis & Classification",
//       description: "AI analyzes message content to understand customer intent and urgency",
//       type: "analysis",
//       aiReasoning: "Critical for providing relevant and contextual responses"
//     },
//     {
//       title: "Content Filtering & Validation",
//       description: "Filter spam, inappropriate content, and validate message authenticity",
//       type: "filter",
//       aiReasoning: "Protects brand reputation and ensures quality interactions"
//     },
//     {
//       title: "Customer Data Enrichment",
//       description: "Enhance customer profile with available data from CRM and other sources",
//       type: "integration",
//       aiReasoning: "Enables personalized responses and better customer service"
//     },
//     {
//       title: "Intelligent Response Generation",
//       description: "Generate personalized responses based on customer context and business rules",
//       type: "response",
//       aiReasoning: "Provides immediate value to customers while maintaining brand voice"
//     },
//     {
//       title: "Human Escalation Assessment",
//       description: "Determine if human intervention is needed based on complexity and sentiment",
//       type: "routing",
//       aiReasoning: "Ensures complex issues receive appropriate human attention"
//     },
//     {
//       title: "CRM Integration & Updates",
//       description: "Update customer records and create relevant tasks in CRM system",
//       type: "storage",
//       aiReasoning: "Maintains comprehensive customer interaction history"
//     },
//     {
//       title: "Follow-up Sequence Automation",
//       description: "Schedule and send automated follow-up messages based on customer journey",
//       type: "automation",
//       aiReasoning: "Maximizes engagement and conversion opportunities"
//     },
//     {
//       title: "Performance Analytics & Reporting",
//       description: "Track workflow performance and generate insights for continuous improvement",
//       type: "validation",
//       aiReasoning: "Enables data-driven optimization of the automation workflow"
//     }
//   ]

//   const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     const allIntegrations = steps.flatMap(step => step.selectedIntegrations || [])
//     return allIntegrations.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts(prev => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5) // Keep only last 5 thoughts
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//     const thoughts = [
//       "🔍 Analyzing your business requirements and social media automation needs...",
//       "🎨 Designing optimal workflow architecture with enterprise-grade components...",
//       "🔗 Matching your needs with the best available integrations and tools...",
//       "⚡ Optimizing workflow for maximum performance and reliability..."
//     ]
//     return thoughts[phase] || "🤖 Processing your workflow requirements..."
//   }

//   // Handle approval and send to designers via N8N
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Sending comprehensive workflow design to development team...")

//     try {
//       const payload = {
//         action: "send_to_designers",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         approvedAt: new Date().toISOString(),
//         estimatedCost: parsedWorkflow?.estimatedCost,
//         roi: parsedWorkflow?.roi,
//         integrations: parsedWorkflow?.integrations
//       }

//       const response = await fetch('/api/send-to-designers', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to send to designers: ${response.statusText}`)
//       }

//       const result = await response.json()
//       setResponseStatus("✅ Enterprise workflow design sent to development team successfully!")
      
//       if (setActiveWorkflowExists) setActiveWorkflowExists(true)
//       if (setActiveWorkflowDetails) {
//         setActiveWorkflowDetails({
//           id: `workflow-${Date.now()}`,
//           workflowTemplate: { name: parsedWorkflow?.title || "AI Social Media Automation" },
//           businessInfo: businessInfo,
//           parsedWorkflow: parsedWorkflow,
//           status: "SENT_TO_DESIGNERS",
//           platform: "social-media-automation",
//           channels: selectedChannels,
//           features: automationFeatures,
//           approvedAt: new Date().toISOString(),
//           estimatedCost: parsedWorkflow?.estimatedCost,
//           roi: parsedWorkflow?.roi
//         })
//       }

//       setTimeout(() => {
//         if (setStep) setStep("dashboard")
//       }, 2000)

//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to send to designers. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
//       return
//     }
//     generateWorkflowWithAI("initial")
//   }

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions")
//       return
//     }
//     generateWorkflowWithAI("refine", refinementInput)
//     setRefinementInput("")
//   }

//   const toggleStepExpansion = (stepNumber: number): void => {
//     setExpandedSteps(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter(c => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures(prev => [...prev, featureId])
//     } else {
//       setAutomationFeatures(prev => prev.filter(f => f !== featureId))
//     }
//   }

//   const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
//     setStreamingSteps(prevSteps => 
//       prevSteps.map(step => {
//         if (step.id === stepId) {
//           const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
//           const newSelected = isSelected
//             ? step.selectedIntegrations?.filter(i => i.id !== integration.id) || []
//             : [...(step.selectedIntegrations || []), integration]
          
//           return { ...step, selectedIntegrations: newSelected }
//         }
//         return step
//       })
//     )
//   }

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || 'text-blue-500'} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">{currentPhaseData?.description || "Working on your workflow..."}</p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Overall Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                   index < currentPhase ? 'bg-green-500 text-white shadow-lg' :
//                   index === currentPhase ? 'bg-blue-500 text-white animate-pulse shadow-lg' :
//                   'bg-gray-200 text-gray-400'
//                 }`}>
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : 
//                    <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span className={`text-xs mt-2 text-center font-medium ${
//                   index === currentPhase ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
//                 }`}>
//                   {phase.title.split(' ')[0]}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* AI Thoughts */}
//         {aiThoughts.length > 0 && (
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
//                   }`}
//                 >
//                   {thought}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

//     return (
//       <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
//         <h6 className="font-semibold mb-3 flex items-center gap-2">
//           <Puzzle className="h-4 w-4 text-purple-500" />
//           Suggested Integrations
//           <Badge variant="outline" className="text-xs">
//             {step.suggestedIntegrations.length} available
//           </Badge>
//         </h6>
        
//         <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
//           {step.suggestedIntegrations.map((integration) => {
//             const IconComponent = integration.icon
//             const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
            
//             return (
//               <div
//                 key={integration.id}
//                 onClick={() => handleIntegrationToggle(step.id, integration)}
//                 className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
//                   isSelected
//                     ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                     : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className="h-5 w-5 flex-shrink-0" />
//                   <div className="flex-grow min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-sm truncate">{integration.name}</span>
//                       <Badge 
//                         variant={isSelected ? "secondary" : "outline"} 
//                         className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
//                       >
//                         {integration.pricing}
//                       </Badge>
//                     </div>
//                     <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
//                       {integration.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Timer className="h-3 w-3" />
//                         {integration.setupTime}
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Star className="h-3 w-3" />
//                         {integration.popularity}%
//                       </div>
//                     </div>
//                   </div>
//                   {isSelected ? (
//                     <Check className="h-4 w-4 text-white" />
//                   ) : (
//                     <Plus className="h-4 w-4 text-gray-400" />
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div 
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${
//           step.isAnimating ? 'animate-pulse' : ''
//         }`}
//         style={{
//           animation: step.isAnimating ? 'slideInFromLeft 0.6s ease-out' : 'none'
//         }}
//       >
//         <div className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//           config.bgColor} ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//           isExpanded ? 'shadow-xl scale-[1.02] border-opacity-100' : 'hover:shadow-lg hover:scale-[1.01] border-opacity-60'
//         }`}
//         onClick={() => toggleStepExpansion(step.stepNumber)}>
          
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Enhanced Step Number with Icon */}
//               <div className="relative">
//                 <div className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                   <IconComponent className={`h-4 w-4 ${config.color}`} />
//                 </div>
//               </div>

//               {/* Enhanced Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   <Badge variant="secondary" className={`text-xs ${
//                     step.complexity === "high" ? "bg-red-100 text-red-700" :
//                     step.complexity === "medium" ? "bg-yellow-100 text-yellow-700" :
//                     "bg-green-100 text-green-700"
//                   }`}>
//                     {step.complexity} complexity
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                
//                 {/* Enhanced Input/Output Flow */}
//                 <div className="flex items-center gap-6 text-sm">
//                   {step.inputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-700 dark:text-green-300 font-medium">
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Integration Preview */}
//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map(i => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Expand Icon */}
//               <div className="flex items-center">
//                 {isExpanded ? (
//                   <ChevronDown className="h-6 w-6 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-6 w-6 text-muted-foreground" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Expanded Details */}
//           {isExpanded && (
//             <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
//               {/* AI Reasoning */}
//               {step.aiReasoning && (
//                 <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
//                   <h6 className="font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
//                     <Brain className="h-4 w-4" />
//                     AI Reasoning
//                   </h6>
//                   <p className="text-sm text-purple-600 dark:text-purple-400">{step.aiReasoning}</p>
//                 </div>
//               )}

//               <div className="grid lg:grid-cols-3 gap-6">
//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Layers className="h-4 w-4 text-blue-500" />
//                     Implementation Details
//                   </h5>
//                   <ul className="space-y-2 text-sm text-muted-foreground">
//                     {step.details?.map((detail, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                         <span>{detail}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Activity className="h-4 w-4 text-green-500" />
//                     Performance & Impact
//                   </h5>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Business Impact:</span>
//                       <Badge variant="secondary" className="text-green-600">High</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Reliability:</span>
//                       <Badge variant="secondary" className="text-blue-600">99.9%</Badge>
//                     </div>
//                     {step.businessImpact && (
//                       <p className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
//                         {step.businessImpact}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-orange-500" />
//                     Configuration Options
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span>Auto-retry enabled</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       <span>Real-time monitoring</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                       <span>Custom error handling</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                       <span>Performance optimization</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Integration Selector */}
//               <IntegrationSelector step={step} />
//             </div>
//           )}
//         </div>

//         {/* Enhanced Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
//           <div className="flex justify-center my-6">
//             <div className="relative">
//               <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-blue-300 to-gray-100 dark:from-gray-600 dark:via-blue-600 dark:to-gray-800"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
      
//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//               🤖 Enterprise AI Workflow Designer
//             </h1>
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Watch as our advanced AI creates your personalized social media automation workflow with smart integrations and enterprise-grade architecture.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span>Real-time AI Generation</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Smart Integration Matching</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Enterprise Architecture</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Enhanced Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-primary" />
//                   {!hasInitialRequest ? "Design Your Enterprise Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your automation needs and our AI will create the perfect workflow"
//                     : "Provide feedback to enhance and customize the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Enhanced Platform Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-3">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
//                                   : "bg-card border-border hover:border-primary/50 hover:bg-accent hover:transform hover:scale-102"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <IconComponent className="h-5 w-5" />
//                                 <span className="font-medium">{channel.label}</span>
//                                 {selectedChannels.includes(channel.id) && (
//                                   <Check className="h-4 w-4 ml-auto" />
//                                 )}
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Enhanced Feature Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">AI Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label key={feature.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors">
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="w-4 h-4 rounded border-border"
//                             />
//                             <span className="text-sm font-medium">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Enhanced Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Describe Your Automation Vision
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I want to create an intelligent Instagram automation that responds to product inquiries, analyzes customer sentiment, integrates with our Shopify store, updates our HubSpot CRM, and escalates complex issues to human agents. Include payment processing for quick purchases and follow-up sequences for abandoned carts.'"
//                         rows={8}
//                         className="bg-black border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
//                       Generate Enterprise AI Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refine Your Workflow
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add Salesforce integration instead of HubSpot', 'Include advanced analytics dashboard', 'Add WhatsApp Business API integration', 'Implement multi-language support'"
//                         rows={5}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <div className="flex gap-3">
//                       <Button
//                         onClick={handleRefine}
//                         disabled={isGenerating || !refinementInput.trim()}
//                         className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
//                       >
//                         {isGenerating && currentAction === "refine" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <RefreshCw className="h-4 w-4" />
//                         )}
//                         Refine Design
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isGenerating || !parsedWorkflow}
//                         className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center gap-2 font-medium"
//                       >
//                         {isGenerating && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Send to Designers
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Enhanced Business Context */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building className="h-5 w-5 text-primary" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-sm">
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Business:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
//                 </div>
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Industry:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Description:</span>
//                     <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Selected Platforms:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {automationFeatures.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">AI Features:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {automationFeatures.map((feature) => (
//                         <Badge key={feature} variant="outline" className="text-xs">
//                           {automationFeatureOptions.find((f) => f.id === feature)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Enhanced Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-6 w-6 text-primary" />
//                   Enterprise AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
//                       <Star className="h-3 w-3 mr-1" />
//                       AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Advanced AI creates production-ready workflows with smart integrations in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Enhanced Status Message */}
//                 {responseStatus && (
//                   <div className={`mb-6 p-4 rounded-xl border-2 ${
//                     responseStatus.includes("✅") ? "bg-secondary/50 border-secondary text-secondary-foreground" :
//                     responseStatus.includes("❌") ? "bg-destructive/10 border-destructive/50 text-destructive" :
//                     "bg-primary/10 border-primary/50 text-primary"
//                   }`}>
//                     <div className="flex items-center gap-3">
//                       {responseStatus.includes("✅") ? <CheckCircle className="h-5 w-5" /> :
//                        responseStatus.includes("❌") ? <AlertCircle className="h-5 w-5" /> :
//                        <Loader2 className="h-5 w-5 animate-spin" />}
//                       <span className="font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Enhanced Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-muted/30 border-2 border-border backdrop-blur-sm">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 text-foreground">
//                         {parsedWorkflow.title}
//                       </h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.automationRate}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.responseTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Enhanced ROI and Cost Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-secondary/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <TrendingUp className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Expected ROI</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.roi}</div>
//                       </div>
//                       <div className="p-4 bg-accent/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CreditCard className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Monthly Cost</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.estimatedCost}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Intelligent Workflow Steps</h3>
//                         <p className="text-muted-foreground">AI-designed automation with smart integrations</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {isStreaming ? `${streamingSteps.length} steps generated...` : `${streamingSteps.length} total steps`}
//                       </Badge>
//                     </div>
                    
//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}
                    
//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">AI is generating more intelligent steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Enhanced Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-12 w-12 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Create Enterprise-Grade Automation</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Our advanced AI will analyze your requirements and generate a complete, production-ready workflow with intelligent integrations and enterprise architecture.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">AI-Powered</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Smart Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Rocket className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">Enterprise Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <TrendingUp className="h-5 w-5 text-orange-500" />
//                         <span className="font-medium">ROI Optimized</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceflowWorkflowBuilder






"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle,
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
  MessageSquare,
  Zap,
  AlertCircle,
  FileText,
  PlayCircle,
  Workflow,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Eye,
  Database,
  Filter,
  Mail,
  Bell,
  BarChart3,
  Shield,
  Globe,
  Star,
  TrendingUp,
  Cpu,
  Code,
  Brain,
  Lightbulb,
  Rocket,
  Users,
  Timer,
  Layers,
  Activity,
  Wand2,
  Plus,
  X,
  Check,
  ExternalLink,
  Building,
  Cloud,
  ShoppingCart,
  CreditCard,
  Calendar,
  Briefcase,
  Headphones,
  BarChart,
  Lock,
  Webhook,
  Link2,
  Puzzle,
  Search,
  Package,
  Gauge
} from "lucide-react"

// TypeScript interfaces
interface BusinessInfo {
  businessName: string
  businessType: string
  description?: string
  website?: string
  phone?: string
  email?: string
}

interface VoiceflowWorkflowBuilderProps {
  businessInfo?: BusinessInfo
  selectedWorkflowId?: string | null
  setStep?: (step: "selection" | "dashboard" | "pending") => void
  setActiveWorkflowExists?: (exists: boolean) => void
  setActiveWorkflowDetails?: (details: any) => void
}

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  pricing: "free" | "freemium" | "paid" | "enterprise"
  popularity: number
  difficulty: "easy" | "medium" | "hard"
  apiAvailable: boolean
  webhookSupport: boolean
  realTimeSync: boolean
  features: string[]
  setupTime: string
  website?: string
}

interface WorkflowStep {
  id: string
  stepNumber: number
  title: string
  description: string
  type: string
  inputs?: string[]
  outputs?: string[]
  conditions?: string[]
  estimatedTime?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  bgColor?: string
  borderColor?: string
  details?: string[]
  isAnimating?: boolean
  suggestedIntegrations?: Integration[]
  selectedIntegrations?: Integration[]
  aiReasoning?: string
  complexity?: "low" | "medium" | "high"
  businessImpact?: string
  alternatives?: string[]
}

interface StreamingPhase {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  duration: number
}

interface ParsedWorkflow {
  title: string
  description: string
  platform: string
  estimatedBuildTime: string
  complexity: string
  steps: WorkflowStep[]
  integrations: Integration[]
  benefits: string[]
  exampleScenario: string
  technicalRequirements: string[]
  deploymentChannels: string[]
  estimatedCost?: string
  roi?: string
  metrics?: {
    automationRate: string
    responseTime: string
    accuracy: string
    scalability: string
  }
}

interface ChannelOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface AutomationFeature {
  id: string
  label: string
}

interface StepTypeConfig {
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
  accentColor: string
  darkBg: string
  darkBorder: string
}

// Comprehensive Integration Database
const INTEGRATION_DATABASE: Integration[] = [
  // CRM Systems
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Comprehensive CRM and marketing automation platform",
    category: "crm",
    icon: Building,
    pricing: "freemium",
    popularity: 95,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
    setupTime: "15-30 minutes",
    website: "https://hubspot.com"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "World's leading CRM platform for sales and customer service",
    category: "crm",
    icon: Cloud,
    pricing: "paid",
    popularity: 90,
    difficulty: "medium",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
    setupTime: "30-60 minutes",
    website: "https://salesforce.com"
  },
  {
    id: "zoho-crm",
    name: "Zoho CRM",
    description: "Complete CRM solution for businesses of all sizes",
    category: "crm",
    icon: Briefcase,
    pricing: "freemium",
    popularity: 75,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Sales Automation", "Contact Management", "Analytics", "Mobile App"],
    setupTime: "20-40 minutes",
    website: "https://zoho.com/crm"
  },

  // E-commerce Platforms
  {
    id: "shopify",
    name: "Shopify",
    description: "Leading e-commerce platform for online stores",
    category: "ecommerce",
    icon: ShoppingCart,
    pricing: "paid",
    popularity: 92,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Product Management", "Order Processing", "Inventory", "Payments"],
    setupTime: "20-30 minutes",
    website: "https://shopify.com"
  },

  // Email Marketing
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "All-in-one email marketing and automation platform",
    category: "email",
    icon: Mail,
    pricing: "freemium",
    popularity: 88,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
    setupTime: "10-20 minutes",
    website: "https://mailchimp.com"
  },

  // Payment Systems
  {
    id: "stripe",
    name: "Stripe",
    description: "Complete payment processing platform for businesses",
    category: "payment",
    icon: CreditCard,
    pricing: "paid",
    popularity: 95,
    difficulty: "medium",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
    setupTime: "25-40 minutes",
    website: "https://stripe.com"
  },

  // Analytics & Tracking
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web analytics service for tracking website traffic",
    category: "analytics",
    icon: BarChart3,
    pricing: "freemium",
    popularity: 98,
    difficulty: "medium",
    apiAvailable: true,
    webhookSupport: false,
    realTimeSync: true,
    features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
    setupTime: "20-30 minutes",
    website: "https://analytics.google.com"
  },

  // Communication
  {
    id: "slack",
    name: "Slack",
    description: "Business communication and collaboration platform",
    category: "communication",
    icon: MessageSquare,
    pricing: "freemium",
    popularity: 92,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
    setupTime: "10-20 minutes",
    website: "https://slack.com"
  },

  // Databases & Storage
  {
    id: "airtable",
    name: "Airtable",
    description: "Cloud-based database and spreadsheet hybrid",
    category: "database",
    icon: Database,
    pricing: "freemium",
    popularity: 85,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Database Management", "Forms", "Views", "Automations"],
    setupTime: "15-25 minutes",
    website: "https://airtable.com"
  }
]

// Default business info
const defaultBusinessInfo: BusinessInfo = {
  businessName: "Your Business",
  businessType: "Technology Company",
  description: "We provide innovative solutions for businesses",
  website: "https://yourbusiness.com",
  phone: "+1-555-0123",
  email: "contact@yourbusiness.com",
}

// Step type configurations with unique styling
const stepTypeConfigs: Record<string, StepTypeConfig> = {
  trigger: {
    icon: PlayCircle,
    color: "text-emerald-600",
    bgColor: "from-emerald-50 to-green-100",
    borderColor: "border-emerald-300",
    accentColor: "bg-emerald-500",
    darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
    darkBorder: "dark:border-emerald-600/50"
  },
  analysis: {
    icon: Brain,
    color: "text-purple-600",
    bgColor: "from-purple-50 to-violet-100",
    borderColor: "border-purple-300",
    accentColor: "bg-purple-500",
    darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
    darkBorder: "dark:border-purple-600/50"
  },
  filter: {
    icon: Filter,
    color: "text-blue-600",
    bgColor: "from-blue-50 to-cyan-100",
    borderColor: "border-blue-300",
    accentColor: "bg-blue-500",
    darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
    darkBorder: "dark:border-blue-600/50"
  },
  response: {
    icon: MessageCircle,
    color: "text-orange-600",
    bgColor: "from-orange-50 to-amber-100",
    borderColor: "border-orange-300",
    accentColor: "bg-orange-500",
    darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
    darkBorder: "dark:border-orange-600/50"
  },
  notification: {
    icon: Bell,
    color: "text-red-600",
    bgColor: "from-red-50 to-pink-100",
    borderColor: "border-red-300",
    accentColor: "bg-red-500",
    darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
    darkBorder: "dark:border-red-600/50"
  },
  integration: {
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "from-yellow-50 to-orange-100",
    borderColor: "border-yellow-300",
    accentColor: "bg-yellow-500",
    darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
    darkBorder: "dark:border-yellow-600/50"
  },
  storage: {
    icon: Database,
    color: "text-gray-600",
    bgColor: "from-gray-50 to-slate-100",
    borderColor: "border-gray-300",
    accentColor: "bg-gray-500",
    darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
    darkBorder: "dark:border-gray-600/50"
  },
  routing: {
    icon: GitBranch,
    color: "text-indigo-600",
    bgColor: "from-indigo-50 to-blue-100",
    borderColor: "border-indigo-300",
    accentColor: "bg-indigo-500",
    darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
    darkBorder: "dark:border-indigo-600/50"
  },
  validation: {
    icon: Shield,
    color: "text-cyan-600",
    bgColor: "from-cyan-50 to-teal-100",
    borderColor: "border-cyan-300",
    accentColor: "bg-cyan-500",
    darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
    darkBorder: "dark:border-cyan-600/50"
  },
  automation: {
    icon: Bot,
    color: "text-pink-600",
    bgColor: "from-pink-50 to-rose-100",
    borderColor: "border-pink-300",
    accentColor: "bg-pink-500",
    darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
    darkBorder: "dark:border-pink-600/50"
  }
}

// AI Processing phases
const streamingPhases: StreamingPhase[] = [
  {
    id: "understanding",
    title: "Analyzing Requirements",
    description: "AI is understanding your business needs and automation goals",
    icon: Search,
    color: "text-blue-500",
    duration: 3000
  },
  {
    id: "designing",
    title: "Designing Architecture",
    description: "Creating intelligent workflow logic and step sequences",
    icon: Wand2,
    color: "text-purple-500",
    duration: 4000
  },
  {
    id: "integrations",
    title: "Matching Integrations",
    description: "Finding the best tools and platforms for each step",
    icon: Link2,
    color: "text-green-500",
    duration: 3000
  },
  {
    id: "optimizing",
    title: "Optimizing Performance",
    description: "Fine-tuning for maximum efficiency and reliability",
    icon: Gauge,
    color: "text-orange-500",
    duration: 2000
  }
]

const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
  businessInfo = defaultBusinessInfo,
  selectedWorkflowId,
  setStep,
  setActiveWorkflowExists,
  setActiveWorkflowDetails,
}) => {
  const [workflowRequest, setWorkflowRequest] = useState<string>("")
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
  const [refinementInput, setRefinementInput] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [responseStatus, setResponseStatus] = useState<string | null>(null)
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
  const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
  const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  
  // Streaming states
  const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [streamingProgress, setStreamingProgress] = useState<number>(0)
  const [aiThoughts, setAiThoughts] = useState<string[]>([])
  const stepContainerRef = useRef<HTMLDivElement>(null)

  const channelOptions: ChannelOption[] = [
    { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
    { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
    { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
    { id: "telegram", label: "Telegram Bot", icon: Bot },
    { id: "web", label: "Website Chat", icon: Mic },
    { id: "email", label: "Email Marketing", icon: Mail },
    { id: "sms", label: "SMS Marketing", icon: Phone },
  ]

  const automationFeatureOptions: AutomationFeature[] = [
    { id: "auto-reply", label: "Automatic Responses" },
    { id: "sentiment-analysis", label: "Sentiment Analysis" },
    { id: "intent-detection", label: "Intent Recognition" },
    { id: "multilingual", label: "Multi-language Support" },
    { id: "smart-routing", label: "Smart Agent Routing" },
    { id: "lead-scoring", label: "Lead Scoring" },
    { id: "personalization", label: "Dynamic Personalization" },
    { id: "escalation", label: "Intelligent Escalation" },
  ]

  // Real AI workflow generation
  const generateWorkflowWithAI = useCallback(async (
    action: "initial" | "refine", 
    instructions?: string
  ): Promise<void> => {
    setIsGenerating(true)
    setIsStreaming(true)
    setCurrentPhase(0)
    setStreamingProgress(0)
    setStreamingSteps([])
    setAiThoughts([])
    setResponseStatus("🤖 Connecting to AI workflow engine...")
    setCurrentAction(action)
    setHasInitialRequest(true)

    try {
      // Phase progression with realistic timing
      for (let phase = 0; phase < streamingPhases.length; phase++) {
        setCurrentPhase(phase)
        setResponseStatus(`${streamingPhases[phase].description}...`)
        
        addAiThought(getAiThoughtForPhase(phase))
        
        await new Promise(resolve => setTimeout(resolve, streamingPhases[phase].duration))
      }

      // Generate workflow via AI API
      const aiResponse = await callAIWorkflowGeneration(action, instructions)
      
      if (aiResponse.success && aiResponse.workflowData) {
        setParsedWorkflow(aiResponse.workflowData)
        setStreamingProgress(100)
        setResponseStatus("✅ Custom AI workflow generated successfully!")
        addAiThought("🎉 Workflow generation complete! Ready for development team submission.")
      } else {
        throw new Error(aiResponse.error || "AI generation failed")
      }
      
    } catch (error) {
      console.error("AI generation error:", error)
      setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      addAiThought("❌ Generation failed. Please try again with more specific requirements.")
    } finally {
      setIsStreaming(false)
      setTimeout(() => {
        setIsGenerating(false)
      }, 1000)
    }
  }, [businessInfo, selectedChannels, automationFeatures, workflowRequest])

  // Simulate AI API call
  const callAIWorkflowGeneration = async (
    action: "initial" | "refine", 
    instructions?: string
  ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const workflowSteps = await processAIResponseIntoSteps({})
      
      const workflow: ParsedWorkflow = {
        title: `${businessInfo.businessName} Custom AI Automation`,
        description: `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? 's' : ''}`,
        platform: "Custom AI Automation",
        estimatedBuildTime: "3-5 weeks",
        complexity: "Custom Enterprise",
        steps: workflowSteps,
        integrations: getUniqueIntegrations(workflowSteps),
        benefits: [
          "100% customized to your specific requirements",
          "Advanced AI-powered automation",
          "Seamless integration with your existing tools",
          "Scalable architecture for future growth",
          "Dedicated development and support",
          "Priority marketplace listing"
        ],
        exampleScenario: "Custom workflow tailored to your exact specifications with intelligent routing and processing",
        technicalRequirements: [
          "Custom API integrations",
          "Advanced AI/ML processing", 
          "Real-time data synchronization",
          "Scalable cloud infrastructure",
          "Security compliance setup"
        ],
        deploymentChannels: selectedChannels,
        estimatedCost: "$2000-5000/month",
        roi: "400-800% within 6 months",
        metrics: {
          automationRate: "98%",
          responseTime: "< 1 second",
          accuracy: "96%",
          scalability: "Enterprise+"
        }
      }

      return { success: true, workflowData: workflow }
      
    } catch (error) {
      console.error("AI API call failed:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "AI generation failed" 
      }
    }
  }

  // Process AI response into workflow steps with streaming
  const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
    const steps: WorkflowStep[] = []
    const stepsData = generateCustomSteps()
    
    for (let i = 0; i < stepsData.length; i++) {
      const stepData = stepsData[i]
      const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation
      
      const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)
      
      const step: WorkflowStep = {
        id: `step-${i + 1}`,
        stepNumber: i + 1,
        title: stepData.title,
        description: stepData.description,
        type: stepData.type,
        icon: config.icon,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
        estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
        inputs: stepData.inputs || (i === 0 ? ["User Request"] : ["Previous Step Output"]),
        outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Custom Solution"] : ["Processed Data"]),
        details: stepData.details || [`Custom ${stepData.type} processing`, "Tailored to your specific requirements", "Enterprise-grade implementation"],
        isAnimating: true,
        suggestedIntegrations,
        selectedIntegrations: suggestedIntegrations.slice(0, 1),
        aiReasoning: stepData.aiReasoning || `This custom step is designed specifically for your ${stepData.type} requirements.`,
        complexity: stepData.complexity || "high",
        businessImpact: stepData.businessImpact || `Delivers custom ${stepData.type} functionality tailored to your business needs.`,
        alternatives: stepData.alternatives || [`Alternative ${stepData.type} implementations`, "Custom enhancement options"]
      }

      setStreamingSteps(prevSteps => [...prevSteps, step])
      
      const progress = ((i + 1) / stepsData.length) * 70 + 25
      setStreamingProgress(progress)
      
      addAiThought(`🔧 Generated custom step ${i + 1}: ${step.title}`)
      
      setTimeout(() => {
        if (stepContainerRef.current) {
          const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
          if (newStepElement) {
            newStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }
      }, 100)
      
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      
      setStreamingSteps(prevSteps => 
        prevSteps.map(s => s.id === step.id ? { ...s, isAnimating: false } : s)
      )

      steps.push(step)
    }

    return steps
  }

  // Generate custom workflow steps
  const generateCustomSteps = () => [
    {
      title: "Custom Request Analysis",
      description: "Advanced AI analyzes your specific requirements and business context",
      type: "analysis",
      estimatedTime: "2-3s",
      inputs: ["User Requirements", "Business Context"],
      outputs: ["Analyzed Requirements", "Context Mapping"],
      details: [
        "Advanced NLP processing of user requirements",
        "Business context analysis and mapping", 
        "Requirement validation and clarification",
        "Custom rule generation based on specifications"
      ],
      complexity: "high" as const,
      businessImpact: "Ensures the automation perfectly aligns with your unique business needs and requirements",
      alternatives: ["Standard requirement processing", "Manual requirement analysis"],
      aiReasoning: "Essential for understanding your unique automation needs"
    },
    {
      title: "Intelligent Message Processing",
      description: "Custom NLP and ML models trained for your specific business domain",
      type: "trigger",
      estimatedTime: "< 1s",
      inputs: ["Incoming Messages", "Domain Models"],
      outputs: ["Processed Content", "Intent Classification"],
      details: [
        "Domain-specific NLP model deployment",
        "Real-time message classification and routing",
        "Custom entity recognition and extraction",
        "Multi-language processing capabilities"
      ],
      complexity: "high" as const,
      businessImpact: "Provides industry-specific understanding and processing of customer communications",
      alternatives: ["Generic NLP processing", "Rule-based message handling"],
      aiReasoning: "Tailored message processing for optimal accuracy"
    },
    {
      title: "Dynamic Content Filtering",
      description: "Advanced filtering with custom rules based on your business logic",
      type: "filter",
      estimatedTime: "< 1s",
      inputs: ["Processed Messages", "Custom Rules"],
      outputs: ["Filtered Content", "Quality Score"],
      details: [
        "Custom filtering rules based on business logic",
        "Content quality assessment and scoring",
        "Spam and inappropriate content detection",
        "Compliance and regulatory filtering"
      ],
      complexity: "medium" as const,
      businessImpact: "Ensures only relevant, high-quality interactions are processed, maintaining brand reputation",
      alternatives: ["Basic content filtering", "Manual content review"],
      aiReasoning: "Ensures only relevant interactions are processed"
    },
    {
      title: "Custom Integration Hub",
      description: "Seamlessly connects with your existing tools and workflows",
      type: "integration",
      estimatedTime: "1-2s",
      inputs: ["Filtered Data", "System Credentials"],
      outputs: ["Integrated Data", "System Updates"],
      details: [
        "Custom API integrations with existing systems",
        "Real-time data synchronization across platforms",
        "Error handling and retry mechanisms",
        "Data transformation and mapping"
      ],
      complexity: "high" as const,
      businessImpact: "Maximizes value from your current technology stack without disrupting existing workflows",
      alternatives: ["Standard API integrations", "Manual data transfer"],
      aiReasoning: "Maximizes value from your current technology stack"
    },
    {
      title: "AI-Powered Response Engine",
      description: "Generates contextual responses using your brand voice and guidelines",
      type: "response",
      estimatedTime: "1-2s",
      inputs: ["Context Data", "Brand Guidelines"],
      outputs: ["Generated Response", "Confidence Score"],
      details: [
        "Brand voice training and implementation",
        "Contextual response generation with personalization",
        "Multi-channel response optimization",
        "A/B testing for response effectiveness"
      ],
      complexity: "high" as const,
      businessImpact: "Maintains consistent brand experience at scale while providing personalized customer interactions",
      alternatives: ["Template-based responses", "Generic AI responses"],
      aiReasoning: "Maintains consistent brand experience at scale"
    },
    {
      title: "Smart Routing & Escalation",
      description: "Intelligent decision making for complex scenarios and human handoffs",
      type: "routing",
      estimatedTime: "< 1s",
      inputs: ["Response Data", "Escalation Rules"],
      outputs: ["Routing Decision", "Escalation Alert"],
      details: [
        "Intelligent escalation based on complexity and sentiment",
        "Workload balancing across team members",
        "Priority scoring and urgent issue detection",
        "Custom routing rules based on expertise"
      ],
      complexity: "medium" as const,
      businessImpact: "Ensures complex issues receive appropriate human attention while optimizing team efficiency",
      alternatives: ["Rule-based routing", "Manual escalation"],
      aiReasoning: "Ensures complex issues receive appropriate attention"
    },
    {
      title: "Custom Data Management",
      description: "Sophisticated data handling tailored to your privacy and compliance needs",
      type: "storage",
      estimatedTime: "2-4s",
      inputs: ["Process Data", "Compliance Rules"],
      outputs: ["Stored Data", "Audit Trail"],
      details: [
        "GDPR and privacy compliance handling",
        "Custom data retention and archival policies",
        "Encrypted storage with audit trails",
        "Data analytics and reporting capabilities"
      ],
      complexity: "high" as const,
      businessImpact: "Maintains data integrity and regulatory compliance while enabling advanced analytics",
      alternatives: ["Basic data storage", "Manual compliance management"],
      aiReasoning: "Maintains data integrity and regulatory compliance"
    },
    {
      title: "Advanced Analytics Engine",
      description: "Custom reporting and insights dashboard for your specific KPIs",
      type: "validation",
      estimatedTime: "3-5s",
      inputs: ["Historical Data", "KPI Definitions"],
      outputs: ["Analytics Report", "Performance Metrics"],
      details: [
        "Custom KPI tracking and measurement",
        "Real-time performance monitoring and alerts",
        "Predictive analytics for capacity planning",
        "Custom dashboard creation and visualization"
      ],
      complexity: "high" as const,
      businessImpact: "Provides actionable insights for continuous improvement and strategic decision making",
      alternatives: ["Basic reporting", "Manual analytics"],
      aiReasoning: "Provides actionable insights for continuous improvement"
    }
  ]

  // Helper functions
  const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
    const suggestions: Integration[] = []
    const title = stepTitle.toLowerCase()
    
    // Smart integration matching based on step type and content
    if (stepType === "trigger" || title.includes("message") || title.includes("processing")) {
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
    }
    
    if (stepType === "storage" || title.includes("data") || title.includes("management")) {
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "database"))
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
    }
    
    if (stepType === "response" || title.includes("email") || title.includes("notification")) {
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "email"))
    }
    
    if (stepType === "integration" || title.includes("hub") || title.includes("connect")) {
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "ecommerce"))
    }
    
    if (stepType === "validation" || title.includes("analytics") || title.includes("reporting")) {
      suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "analytics"))
    }
    
    // Remove duplicates and sort by popularity
    const uniqueSuggestions = suggestions.filter((integration, index, self) => 
      index === self.findIndex(i => i.id === integration.id)
    )
    
    return uniqueSuggestions
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4)
  }

  const getEstimatedTimeForStep = (stepType: string): string => {
    return "< 2s" // Custom workflows are optimized
  }

  const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
    const allIntegrations = steps.flatMap(step => step.selectedIntegrations || [])
    return allIntegrations.filter((integration, index, self) => 
      index === self.findIndex(i => i.id === integration.id)
    )
  }

  const addAiThought = (thought: string): void => {
    setAiThoughts(prev => {
      const newThoughts = [...prev, thought]
      return newThoughts.slice(-5)
    })
  }

  const getAiThoughtForPhase = (phase: number): string => {
    const thoughts = [
      "🔍 Analyzing your custom requirements and business constraints...",
      "🎨 Designing bespoke workflow architecture with enterprise capabilities...",
      "🔗 Identifying optimal integrations for your specific use case...",
      "⚡ Fine-tuning for maximum performance and scalability..."
    ]
    return thoughts[phase] || "🤖 Processing your custom workflow requirements..."
  }

  // Updated handleApprove to go to pending instead of dashboard
  const handleApprove = async (): Promise<void> => {
    setIsGenerating(true)
    setResponseStatus("📧 Submitting custom workflow to development team...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const payload = {
        action: "submit_custom_workflow",
        businessInfo: businessInfo,
        workflowDesign: parsedWorkflow,
        selectedChannels: selectedChannels,
        automationFeatures: automationFeatures,
        customRequest: workflowRequest,
        baseWorkflowId: selectedWorkflowId,
        submittedAt: new Date().toISOString(),
        status: "PENDING_CREATION",
        estimatedCost: parsedWorkflow?.estimatedCost,
        roi: parsedWorkflow?.roi,
        integrations: parsedWorkflow?.integrations
      }

      setResponseStatus("✅ Custom workflow submitted to development team successfully!")
      
      // Store pending workflow data in localStorage
      const pendingData = {
        id: `custom-workflow-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'PENDING_CREATION',
        workflowType: selectedWorkflowId 
          ? `Modified ${selectedWorkflowId}` 
          : "Custom Workflow",
        estimatedCompletion: "3-5"
      }
      
      localStorage.setItem('pendingWorkflow', JSON.stringify(pendingData))
      
      setTimeout(() => {
        if (setStep) setStep("pending") // Go to pending instead of dashboard
      }, 2000)

    } catch (error) {
      console.error("Approval error:", error)
      setResponseStatus("❌ Failed to submit to development team. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInitialSubmit = (): void => {
    if (!workflowRequest.trim()) {
      setResponseStatus("❌ Please describe your automation needs")
      return
    }
    if (selectedChannels.length === 0) {
      setResponseStatus("❌ Please select at least one platform")
      return
    }
    generateWorkflowWithAI("initial")
  }

  const handleRefine = (): void => {
    if (!refinementInput.trim()) {
      setResponseStatus("❌ Please provide refinement instructions")
      return
    }
    generateWorkflowWithAI("refine", refinementInput)
    setRefinementInput("")
  }

  const toggleStepExpansion = (stepNumber: number): void => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber)
      } else {
        newSet.add(stepNumber)
      }
      return newSet
    })
  }

  const handleChannelToggle = (channelId: string): void => {
    const newChannels = selectedChannels.includes(channelId)
      ? selectedChannels.filter(c => c !== channelId)
      : [...selectedChannels, channelId]
    setSelectedChannels(newChannels)
  }

  const handleFeatureToggle = (featureId: string, checked: boolean): void => {
    if (checked) {
      setAutomationFeatures(prev => [...prev, featureId])
    } else {
      setAutomationFeatures(prev => prev.filter(f => f !== featureId))
    }
  }

  const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
    setStreamingSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === stepId) {
          const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
          const newSelected = isSelected
            ? step.selectedIntegrations?.filter(i => i.id !== integration.id) || []
            : [...(step.selectedIntegrations || []), integration]
          
          return { ...step, selectedIntegrations: newSelected }
        }
        return step
      })
    )
  }

  // Enhanced components
  const StreamingProgress: React.FC = () => {
    if (!isGenerating) return null

    const currentPhaseData = streamingPhases[currentPhase]
    const IconComponent = currentPhaseData?.icon || Brain

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
              <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || 'text-blue-500'} animate-pulse`} />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
          <p className="text-muted-foreground">{currentPhaseData?.description || "Working on your custom workflow..."}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(streamingProgress)}%</span>
          </div>
          <Progress value={streamingProgress} className="h-3 mb-4" />
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {streamingPhases.map((phase, index) => {
            const PhaseIcon = phase.icon
            return (
              <div key={phase.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index < currentPhase ? 'bg-green-500 text-white shadow-lg' :
                  index === currentPhase ? 'bg-blue-500 text-white animate-pulse shadow-lg' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : 
                   <PhaseIcon className="h-6 w-6" />}
                </div>
                <span className={`text-xs mt-2 text-center font-medium ${
                  index === currentPhase ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                }`}>
                  {phase.title.split(' ')[0]}
                </span>
              </div>
            )
          })}
        </div>

        {/* AI Thoughts */}
        {aiThoughts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
            </div>
            <div className="space-y-2 max-h-24 overflow-hidden">
              {aiThoughts.slice(-3).map((thought, index) => (
                <div
                  key={index}
                  className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
                    index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {thought}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
    if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

    return (
      <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <Puzzle className="h-4 w-4 text-purple-500" />
          Suggested Integrations
          <Badge variant="outline" className="text-xs">
            {step.suggestedIntegrations.length} available
          </Badge>
        </h6>
        
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {step.suggestedIntegrations.map((integration) => {
            const IconComponent = integration.icon
            const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
            
            return (
              <div
                key={integration.id}
                onClick={() => handleIntegrationToggle(step.id, integration)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{integration.name}</span>
                      <Badge 
                        variant={isSelected ? "secondary" : "outline"} 
                        className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
                      >
                        {integration.pricing}
                      </Badge>
                    </div>
                    <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                        <Timer className="h-3 w-3" />
                        {integration.setupTime}
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                        <Star className="h-3 w-3" />
                        {integration.popularity}%
                      </div>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
    const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
    const IconComponent = step.icon || config.icon
    const isExpanded = expandedSteps.has(step.stepNumber)

    return (
      <div 
        data-step-id={step.id}
        className={`relative transition-all duration-500 ${
          step.isAnimating ? 'animate-pulse' : ''
        }`}
        style={{
          animation: step.isAnimating ? 'slideInFromLeft 0.6s ease-out' : 'none'
        }}
      >
        <div className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
          config.bgColor} ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
          isExpanded ? 'shadow-xl scale-[1.02] border-opacity-100' : 'hover:shadow-lg hover:scale-[1.01] border-opacity-60'
        }`}
        onClick={() => toggleStepExpansion(step.stepNumber)}>
          
          {/* Step Header */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              {/* Enhanced Step Number with Icon */}
              <div className="relative">
                <div className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
                  {step.stepNumber}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                  <IconComponent className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {/* Enhanced Step Content */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
                  <Badge variant="outline" className="text-xs font-medium">
                    {step.type}
                  </Badge>
                  <Badge variant="secondary" className={`text-xs ${
                    step.complexity === "high" ? "bg-red-100 text-red-700" :
                    step.complexity === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {step.complexity} complexity
                  </Badge>
                  {step.estimatedTime && (
                    <Badge variant="secondary" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {step.estimatedTime}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                
                {/* Enhanced Input/Output Flow */}
                <div className="flex items-center gap-6 text-sm">
                  {step.inputs && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 dark:text-green-300 font-medium">
                        Input: {step.inputs.join(", ")}
                      </span>
                    </div>
                  )}
                  {step.outputs && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Output: {step.outputs.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Integration Preview */}
                {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                      Integrations: {step.selectedIntegrations.map(i => i.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Expand Icon */}
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
              {/* AI Reasoning */}
              {step.aiReasoning && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h6 className="font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Brain className="h-4 w-4" />
                    AI Reasoning
                  </h6>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{step.aiReasoning}</p>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-500" />
                    Implementation Details
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {step.details?.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    Performance & Impact
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Execution Time:</span>
                      <Badge variant="secondary">{step.estimatedTime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Business Impact:</span>
                      <Badge variant="secondary" className="text-green-600">High</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Reliability:</span>
                      <Badge variant="secondary" className="text-blue-600">99.9%</Badge>
                    </div>
                    {step.businessImpact && (
                      <p className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        {step.businessImpact}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-orange-500" />
                    Configuration Options
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Auto-retry enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Real-time monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Custom error handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Performance optimization</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Selector */}
              <IntegrationSelector step={step} />
            </div>
          )}
        </div>

        {/* Enhanced Connection Line */}
        {step.stepNumber < (streamingSteps.length || 1) && (
          <div className="flex justify-center my-6">
            <div className="relative">
              <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-blue-300 to-gray-100 dark:from-gray-600 dark:via-blue-600 dark:to-gray-800"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Design a completely custom workflow tailored to your unique business needs.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Custom AI Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Bespoke Integration Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span>Enterprise Development</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enhanced Left Column - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  {!hasInitialRequest ? "Design Your Custom Automation" : "Refine Your Custom Workflow"}
                </CardTitle>
                <CardDescription>
                  {!hasInitialRequest
                    ? "Describe your unique automation needs and our AI will create a tailored solution"
                    : "Provide feedback to enhance and customize the design"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasInitialRequest && (
                  <>
                    {/* Enhanced Platform Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Social Media Platforms</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {channelOptions.map((channel) => {
                          const IconComponent = channel.icon
                          return (
                            <button
                              key={channel.id}
                              onClick={() => handleChannelToggle(channel.id)}
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                selectedChannels.includes(channel.id)
                                  ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
                                  : "bg-card border-border hover:border-primary/50 hover:bg-accent hover:transform hover:scale-102"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5" />
                                <span className="font-medium">{channel.label}</span>
                                {selectedChannels.includes(channel.id) && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Enhanced Feature Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">AI Automation Features</Label>
                      <div className="space-y-2">
                        {automationFeatureOptions.map((feature) => (
                          <label key={feature.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors">
                            <input
                              type="checkbox"
                              checked={automationFeatures.includes(feature.id)}
                              onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm font-medium">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Enhanced Request Input */}
                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="workflowRequest" className="text-base font-semibold">
                        Describe Your Custom Automation Vision
                      </Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I need a custom workflow that automatically processes customer support tickets in multiple languages, integrates with our proprietary CRM system, uses machine learning to categorize issues, routes them to specialized teams based on expertise and workload, and provides real-time performance analytics with custom dashboards.'"
                        rows={8}
                        className="bg-background border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
                        disabled={isGenerating}
                      />
                    </div>
                    <Button
                      onClick={handleInitialSubmit}
                      disabled={isGenerating || !workflowRequest.trim()}
                      className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
                    >
                      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                      Generate Custom AI Workflow
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="refinementInput" className="text-base font-semibold">
                        Refine Your Custom Workflow
                      </Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add integration with our custom database API', 'Include advanced sentiment analysis for priority routing', 'Add compliance checks for GDPR requirements', 'Implement predictive analytics for capacity planning'"
                        rows={5}
                        className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
                        disabled={isGenerating}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleRefine}
                        disabled={isGenerating || !refinementInput.trim()}
                        className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      >
                        {isGenerating && currentAction === "refine" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Refine Design
                      </Button>
                      <Button
                        onClick={handleApprove}
                        disabled={isGenerating || !parsedWorkflow}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2 font-medium"
                      >
                        {isGenerating && currentAction === "approve" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsUp className="h-4 w-4" />
                        )}
                        Approve design
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Business Context */}
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Business Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-semibold text-primary">Business:</span>
                  <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-semibold text-primary">Industry:</span>
                  <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
                </div>
                {businessInfo.description && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-primary">Description:</span>
                    <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
                  </div>
                )}
                {selectedChannels.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-primary">Selected Platforms:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedChannels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channelOptions.find((c) => c.id === channel)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {automationFeatures.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-primary">AI Features:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {automationFeatures.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {automationFeatureOptions.find((f) => f.id === feature)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Right Column - AI Generated Workflow */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Custom AI Workflow Generation
                  {parsedWorkflow && (
                    <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Custom AI Generated
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced AI creates bespoke enterprise workflows with custom integrations in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Enhanced Status Message */}
                {responseStatus && (
                  <div className={`mb-6 p-4 rounded-xl border-2 ${
                    responseStatus.includes("✅") ? "bg-secondary/50 border-secondary text-secondary-foreground" :
                    responseStatus.includes("❌") ? "bg-destructive/10 border-destructive/50 text-destructive" :
                    "bg-primary/10 border-primary/50 text-primary"
                  }`}>
                    <div className="flex items-center gap-3">
                      {responseStatus.includes("✅") ? <CheckCircle className="h-5 w-5" /> :
                       responseStatus.includes("❌") ? <AlertCircle className="h-5 w-5" /> :
                       <Loader2 className="h-5 w-5 animate-spin" />}
                      <span className="font-medium">{responseStatus}</span>
                    </div>
                  </div>
                )}

                {/* Enhanced Streaming Progress */}
                {isGenerating && <StreamingProgress />}

                {/* Enhanced Workflow Header */}
                {parsedWorkflow && !isGenerating && (
                  <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-2 border-primary/20 backdrop-blur-sm">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-3 text-foreground">
                        {parsedWorkflow.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        {parsedWorkflow.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.automationRate}</div>
                        <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.responseTime}</div>
                        <div className="text-xs text-muted-foreground font-medium">Response Time</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.accuracy}</div>
                        <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.estimatedBuildTime}</div>
                        <div className="text-xs text-muted-foreground font-medium">Build Time</div>
                      </div>
                    </div>

                    {/* Enhanced ROI and Cost Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">Expected ROI</span>
                        </div>
                        <div className="text-xl font-bold text-primary">{parsedWorkflow.roi}</div>
                      </div>
                      <div className="p-4 bg-accent/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">Monthly Cost</span>
                        </div>
                        <div className="text-xl font-bold text-primary">{parsedWorkflow.estimatedCost}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Streaming Steps */}
                {(isStreaming || streamingSteps.length > 0) && (
                  <div ref={stepContainerRef} className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                        <Workflow className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Custom Workflow Steps</h3>
                        <p className="text-muted-foreground">AI-designed automation tailored to your specific needs</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-base px-3 py-1">
                        {isStreaming ? `${streamingSteps.length} steps generated...` : `${streamingSteps.length} total steps`}
                      </Badge>
                    </div>
                    
                    {streamingSteps.map((step) => (
                      <StepComponent key={step.id} step={step} />
                    ))}
                    
                    {isStreaming && (
                      <div className="flex justify-center py-8">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="font-medium">AI is generating more custom steps...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Initial State */}
                {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                        <Brain className="h-12 w-12 text-blue-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Ready to Create Your Custom Workflow</h3>
                    <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
                      Our advanced AI will analyze your unique requirements and generate a completely custom, enterprise-grade workflow with bespoke integrations and architecture.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Custom AI</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Zap className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Bespoke Integrations</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Rocket className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Enterprise Ready</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Maximum ROI</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceflowWorkflowBuilder