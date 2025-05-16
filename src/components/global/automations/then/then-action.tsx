// "use client"

// import { useListener } from "@/hooks/use-automations"
// import { AUTOMATION_LISTENERS } from "@/constants/automation"
// import { SubscriptionPlan } from "../../subscription-plan"
// import { cn } from "@/lib/utils"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import Loader from "../../loader"
// import { motion } from "framer-motion"
// import { Lightbulb, PlusCircle, MessageSquare } from "lucide-react"
// import FloatingPanel from "../../panel"
// import ResponseLibrary from "../response"
// import { ContextCard } from "../context"
// import { useState } from "react"

// type Props = {
//   id: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
// }

// const ThenAction = ({
//   id,
//   theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
// }: Props) => {
//   const { onSetListener, listener: Listener, onFormSubmit, register, isPending } = useListener(id)
//   const [showTip, setShowTip] = useState(true)
//   const [selectedTemplate, setSelectedTemplate] = useState<string>("")

//   // AI suggestion examples
//   const aiSuggestions = [
//     "Thank them for their comment and ask a follow-up question about their experience",
//     "Offer a personalized discount code based on their comment",
//     "Provide more information about the product they're interested in",
//     "Ask them to share their experience on social media",
//   ]

//   // Message templates
//   const messageTemplates = [
//     "Thanks for your comment! We appreciate your feedback.",
//     "Hello! Thanks for reaching out. How can I help you today?",
//     "We're glad you're interested in our products! Would you like more information?",
//     "Thank you for your support! We'd love to hear more about your experience.",
//   ]

//   const handleSelectTemplate = (content: string) => {
//     setSelectedTemplate(content)
//     const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
//     if (textarea) {
//       textarea.value = content
//       textarea.focus()
//     }
//   }

//   return (
//     <FloatingPanel
//       title="Then"
//       trigger={
//         <motion.div
//           className="group relative overflow-hidden rounded-xl mt-4 w-full"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           {/* Border with animation */}
//           <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
//           <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

//           {/* Inner content */}
//           <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
//             <div className="flex items-center justify-center gap-3">
//               <PlusCircle className="h-5 w-5 text-[#768BDD]" />
//               <p className="text-[#768BDD] font-bold">Then</p>
//             </div>
//           </div>
//         </motion.div>
//       }
//     >
//       <div className="flex flex-col gap-4">
//         {showTip && <ContextCard context="response" onClose={() => setShowTip(false)} />}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {AUTOMATION_LISTENERS.map((listener) =>
//             listener.type === "SMARTAI" ? (
//               <SubscriptionPlan key={listener.type} type="PRO">
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => onSetListener(listener.type)}
//                   className={cn(
//                     Listener === listener.type ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]" : "bg-background-80",
//                     "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
//                   )}
//                 >
//                   <div className="flex gap-x-2 items-center">
//                     {listener.icon}
//                     <p>{listener.label}</p>
//                   </div>
//                   <p className="text-sm">{listener.description}</p>
//                 </motion.div>
//               </SubscriptionPlan>
//             ) : (
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => onSetListener(listener.type)}
//                 key={listener.id}
//                 className={cn(
//                   Listener === listener.type ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]" : "bg-background-80",
//                   "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
//                 )}
//               >
//                 <div className="flex gap-x-2 items-center">
//                   {listener.icon}
//                   <p>{listener.label}</p>
//                 </div>
//                 <p className="text-sm">{listener.description}</p>
//               </motion.div>
//             ),
//           )}
//         </div>

//         <form onSubmit={onFormSubmit} className="flex flex-col gap-4 mt-2">
//           {Listener && (
//             <div className={`bg-background-80 p-4 rounded-xl mb-2`}>
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-white font-medium flex items-center">
//                   {Listener === "SMARTAI" ? (
//                     <>
//                       {/* <Lightbulb className="h-5 w-5 mr-2 text-keyword-purple" />
//                       AI Suggestions */}
//                     </>
//                   ) : (
//                     <>
//                       {/* <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
//                       Quick Responses */}
//                     </>
//                   )}
//                 </h3>
//                 <ResponseLibrary
//                   isAI={Listener === "SMARTAI"}
//                   onSelectTemplate={handleSelectTemplate}
//                   selectedTemplate={selectedTemplate}
//                   userSubscription={Listener}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 {(Listener === "SMARTAI" ? aiSuggestions : messageTemplates).map((suggestion, index) => (
//                   <motion.div
//                     key={index}
//                     whileHover={{ scale: 1.02 }}
//                     className={`bg-background-90 p-2 rounded-lg text-sm cursor-pointer ${Listener === "SMARTAI" ? "text-keyword-purple" : "text-light-blue"}`}
//                     onClick={() => {
//                       const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
//                       if (textarea) {
//                         textarea.value = suggestion
//                         textarea.focus()
//                       }
//                     }}
//                   >
//                     {suggestion}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="space-y-2">
//             <label className="text-sm text-text-secondary">
//               {Listener === "SMARTAI"
//                 ? "Add a prompt that your smart AI can use..."
//                 : "Add a message you want to send to your customers"}
//             </label>
//             <Textarea
//               placeholder={
//                 Listener === "SMARTAI"
//                   ? "Add a prompt that your smart AI can use..."
//                   : "Add a message you want to send to your customers"
//               }
//               {...register("prompt")}
//               className="bg-background-80 outline-none border-none ring-0 focus:ring-0 min-h-[120px]"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-text-secondary">Add a reply for comments (Optional)</label>
//             <Input
//               {...register("reply")}
//               placeholder="Add a reply for comments (Optional)"
//               className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
//             />
//           </div>

//           <Button
//             className={cn(
//               "bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]",
//               Listener === "SMARTAI" && "from-[#7C21D6] to-[#4A1480]",
//             )}
//           >
//             <Loader state={isPending}>Add a listener</Loader>
//           </Button>
//         </form>
//       </div>
//     </FloatingPanel>
//   )
// }

// export default ThenAction


"use client"

import type React from "react"

import { useListener } from "@/hooks/use-automations"
import { AUTOMATION_LISTENERS } from "@/constants/automation"
import { SubscriptionPlan } from "../../subscription-plan"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "../../loader"
import { motion } from "framer-motion"
import {
  Lightbulb,
  PlusCircle,
  MessageSquare,
  Building,
  Users,
  ShoppingBag,
  HelpCircle,
  Award,
  Clock,
  Briefcase,
  FileText,
  Target,
  Zap,
  Bookmark,
  Star,
} from "lucide-react"
import FloatingPanel from "../../panel"
import ResponseLibrary from "../response"
import { ContextCard } from "../context"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

type BusinessTemplate = {
  id: string
  title: string
  icon: React.ReactNode
  category: string
  description: string
  content: string
}

const ThenAction = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const { onSetListener, listener: Listener, onFormSubmit, register, isPending } = useListener(id)
  const [showTip, setShowTip] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Business profile templates - comprehensive and detailed
  const businessTemplates: BusinessTemplate[] = [
    {
      id: "company-overview",
      title: "Company Overview",
      icon: <Building className="h-5 w-5" />,
      category: "core",
      description: "Comprehensive overview of your business",
      content: `# [Company Name] - Complete Business Overview

## Basic Information
- **Company Name**: [Full legal name]
- **Founded**: [Year]
- **Headquarters**: [City, State/Province, Country]
- **Website**: [URL]
- **Industry**: [Primary industry]
- **Business Type**: [B2B, B2C, or both]
- **Company Size**: [Number of employees]

## Mission & Vision
- **Mission Statement**: [Your company's mission statement]
- **Vision**: [Your company's long-term vision]
- **Core Values**: [List 3-5 core values that guide your business]

## Company Description
[Provide a detailed 2-3 paragraph description of what your company does, who you serve, and what makes you unique in the marketplace. Include your company history, major milestones, and evolution.]

## Legal Structure
- **Business Structure**: [LLC, Corporation, Partnership, etc.]
- **Parent Company** (if applicable): [Name]
- **Subsidiaries** (if applicable): [Names]

## Contact Information
- **General Inquiries**: [Email and phone]
- **Customer Support**: [Email, phone, hours of operation]
- **Media/Press Contact**: [Name, email, phone]
- **Physical Address**: [Full address for headquarters and any significant locations]`,
    },
    {
      id: "products-services",
      title: "Products & Services",
      icon: <ShoppingBag className="h-5 w-5" />,
      category: "offerings",
      description: "Detailed information about what you offer",
      content: `# [Company Name] - Products & Services Catalog

## Product/Service Line Overview
[Provide a high-level overview of your product/service categories and how they relate to each other]

## Primary Products/Services
[For each major product or service, include the following information:]

### [Product/Service Name 1]
- **Description**: [Detailed description]
- **Key Features**: [List main features]
- **Benefits**: [How it helps customers]
- **Target Users**: [Who this product/service is designed for]
- **Pricing Model**: [Brief description of pricing structure]
- **Availability**: [Regions where available, delivery options]
- **Technical Specifications** (if applicable): [Key specs]

### [Product/Service Name 2]
- **Description**: [Detailed description]
- **Key Features**: [List main features]
- **Benefits**: [How it helps customers]
- **Target Users**: [Who this product/service is designed for]
- **Pricing Model**: [Brief description of pricing structure]
- **Availability**: [Regions where available, delivery options]
- **Technical Specifications** (if applicable): [Key specs]

## Flagship Product/Service
- **Name**: [Name of your most important offering]
- **What makes it special**: [Unique selling points]
- **Success stories**: [Brief mention of notable successes]

## Complementary Products/Services
[List any additional offerings that complement your main products/services]

## Product Roadmap
[Brief overview of upcoming products or features if this can be shared publicly]`,
    },
    {
      id: "target-audience",
      title: "Target Audience",
      icon: <Target className="h-5 w-5" />,
      category: "customers",
      description: "Detailed customer personas and market segments",
      content: `# [Company Name] - Target Audience Profile

## Primary Market Segments
[List and describe your main market segments]

## Customer Personas
[For each major customer type, include:]

### Persona 1: [Name]
- **Demographics**: 
  - Age range: [e.g., 25-34]
  - Gender: [if relevant]
  - Income level: [e.g., middle-income]
  - Education: [e.g., college degree]
  - Location: [e.g., urban areas, specific regions]
  - Occupation: [e.g., marketing professionals]

- **Psychographics**:
  - Values: [What they care about]
  - Interests: [What they enjoy]
  - Lifestyle: [How they live]
  - Pain points: [Problems they face]
  - Goals: [What they want to achieve]

- **Buying Behavior**:
  - Decision factors: [What influences their purchase decisions]
  - Purchase frequency: [How often they buy]
  - Price sensitivity: [How important price is to them]
  - Brand loyalty: [How loyal they are to brands]

- **How Our Products/Services Help Them**:
  [Explain how your offerings specifically address this persona's needs and pain points]

### Persona 2: [Name]
[Repeat the structure above for additional personas]

## Geographic Markets
- **Primary regions**: [List main geographic areas you serve]
- **Secondary markets**: [List other areas where you have presence]
- **Expansion plans**: [Areas you plan to expand to, if applicable]

## Industry-Specific Segments (for B2B)
- **Industries served**: [List main industries]
- **Company sizes**: [e.g., SMBs, enterprise, etc.]
- **Departmental focus**: [e.g., IT, Marketing, HR, etc.]`,
    },
    {
      id: "pricing-plans",
      title: "Pricing & Plans",
      icon: <FileText className="h-5 w-5" />,
      category: "offerings",
      description: "Comprehensive pricing structure information",
      content: `# [Company Name] - Pricing & Plans

## Pricing Philosophy
[Explain your overall approach to pricing and the value you provide]

## Pricing Models
[Describe the type of pricing you use: subscription, one-time purchase, freemium, usage-based, etc.]

## Plan Details

### [Plan Name 1] - $[Price]
- **Target Customer**: [Who this plan is ideal for]
- **Billing Cycle**: [Monthly/Annual/One-time]
- **Features Included**:
  - [Feature 1]
  - [Feature 2]
  - [Feature 3]
  - [etc.]
- **Limitations**:
  - [Any usage caps or restrictions]
- **Support Level**: [What kind of support is included]

### [Plan Name 2] - $[Price]
- **Target Customer**: [Who this plan is ideal for]
- **Billing Cycle**: [Monthly/Annual/One-time]
- **Features Included**:
  - [Feature 1]
  - [Feature 2]
  - [Feature 3]
  - [etc.]
- **Limitations**:
  - [Any usage caps or restrictions]
- **Support Level**: [What kind of support is included]

## Enterprise/Custom Solutions
- **Starting Price**: [If applicable]
- **Custom Features Available**: [List examples]
- **Implementation Services**: [What's included]
- **Dedicated Support**: [Details on enterprise support]

## Payment Options
- **Accepted Payment Methods**: [List methods]
- **Billing Frequency Options**: [Monthly, annual, etc.]
- **Discounts**: [Volume, annual payment, etc.]

## Refund Policy
[Summarize your refund policy]

## Pricing FAQs
[List 3-5 common questions about pricing with answers]`,
    },
    {
      id: "unique-selling-points",
      title: "Unique Selling Points",
      icon: <Zap className="h-5 w-5" />,
      category: "marketing",
      description: "What makes your business stand out",
      content: `# [Company Name] - Unique Selling Propositions

## Core Differentiators
[List and explain 3-5 key factors that set your business apart from competitors]

## Competitive Advantages

### [Advantage 1]
- **Description**: [Detailed explanation]
- **Why it matters to customers**: [Impact on customer experience]
- **How we deliver on this**: [Specific examples or processes]

### [Advantage 2]
- **Description**: [Detailed explanation]
- **Why it matters to customers**: [Impact on customer experience]
- **How we deliver on this**: [Specific examples or processes]

### [Advantage 3]
- **Description**: [Detailed explanation]
- **Why it matters to customers**: [Impact on customer experience]
- **How we deliver on this**: [Specific examples or processes]

## Proprietary Technology/Methodology
- **Name**: [If applicable]
- **What it does**: [Explanation]
- **Benefits it provides**: [List key benefits]
- **Development story**: [Brief background if relevant]

## Awards & Recognition
- [List significant awards, certifications, or industry recognition]

## Customer Success Metrics
- **Satisfaction rate**: [e.g., 98% customer satisfaction]
- **Retention rate**: [e.g., 95% customer retention]
- **Results achieved**: [e.g., average 30% increase in efficiency]

## Brand Promise
[Your core promise to customers in 1-2 sentences]

## Testimonial Highlights
[2-3 brief but powerful testimonials that highlight your USPs]`,
    },
    {
      id: "customer-support",
      title: "Customer Support",
      icon: <HelpCircle className="h-5 w-5" />,
      category: "operations",
      description: "Support channels and policies",
      content: `# [Company Name] - Customer Support Information

## Support Channels
- **Email Support**: [Email address, response time]
- **Phone Support**: [Number, hours of operation]
- **Live Chat**: [Availability, hours]
- **Help Center/Knowledge Base**: [URL]
- **Community Forum**: [URL if applicable]
- **Social Media Support**: [Platforms where you provide support]

## Support Hours
- **Standard Hours**: [Days and times]
- **Extended Hours** (if applicable): [Days and times]
- **Holiday Schedule**: [Any special hours or closures]
- **Time Zones Covered**: [List time zones]

## Support Tiers
[For each support tier you offer, include:]

### [Tier Name]
- **Eligibility**: [Who qualifies for this tier]
- **Response Time SLA**: [Guaranteed response time]
- **Available Channels**: [Which support channels are included]
- **Hours of Availability**: [When support is available]
- **Special Features**: [Any additional benefits]

## Support Team
- **Team Size**: [Number of support staff]
- **Languages Supported**: [List languages]
- **Specialist Areas**: [Any specialized support teams]

## Support Process
- **Ticket System**: [How issues are tracked]
- **Escalation Process**: [How issues get escalated]
- **Follow-up Procedures**: [How you ensure resolution]

## Self-Service Resources
- **Documentation**: [Types available]
- **Video Tutorials**: [If available]
- **FAQs**: [Where to find them]
- **Troubleshooting Guides**: [Where to find them]

## Support Philosophy
[1-2 paragraphs about your approach to customer support]`,
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="h-5 w-5" />,
      category: "support",
      description: "Common questions and detailed answers",
      content: `# [Company Name] - Comprehensive FAQ

## Product/Service Questions

### Q: [Common question about your product/service]
**A**: [Detailed answer that provides complete information]

### Q: [Common question about your product/service]
**A**: [Detailed answer that provides complete information]

### Q: [Common question about your product/service]
**A**: [Detailed answer that provides complete information]

## Pricing & Billing Questions

### Q: [Common question about pricing or billing]
**A**: [Detailed answer that provides complete information]

### Q: [Common question about pricing or billing]
**A**: [Detailed answer that provides complete information]

## Technical Questions

### Q: [Common technical question]
**A**: [Detailed answer that provides complete information]

### Q: [Common technical question]
**A**: [Detailed answer that provides complete information]

## Account & Setup Questions

### Q: [Common account or setup question]
**A**: [Detailed answer that provides complete information]

### Q: [Common account or setup question]
**A**: [Detailed answer that provides complete information]

## Support & Troubleshooting Questions

### Q: [Common support question]
**A**: [Detailed answer that provides complete information]

### Q: [Common support question]
**A**: [Detailed answer that provides complete information]

## Business Policies Questions

### Q: [Common policy question]
**A**: [Detailed answer that provides complete information]

### Q: [Common policy question]
**A**: [Detailed answer that provides complete information]`,
    },
    {
      id: "team-expertise",
      title: "Team & Expertise",
      icon: <Users className="h-5 w-5" />,
      category: "core",
      description: "Information about your team and expertise",
      content: `# [Company Name] - Team & Expertise Profile

## Leadership Team
[For each key leader, include:]

### [Name], [Title]
- **Background**: [Brief professional background]
- **Expertise**: [Areas of specialty]
- **Experience**: [Years in the industry, previous roles]
- **Education**: [Degrees, certifications]
- **Notable Achievements**: [Key accomplishments]

## Company Expertise
[List and describe 3-5 core areas of expertise your company possesses]

### [Expertise Area 1]
- **Description**: [What this expertise entails]
- **How it benefits customers**: [Value it provides]
- **Development**: [How you've developed this expertise]
- **Case example**: [Brief example showing this expertise in action]

### [Expertise Area 2]
- **Description**: [What this expertise entails]
- **How it benefits customers**: [Value it provides]
- **Development**: [How you've developed this expertise]
- **Case example**: [Brief example showing this expertise in action]

## Team Composition
- **Department Structure**: [Overview of your team organization]
- **Specialist Teams**: [Any specialized groups within your company]
- **Certifications & Qualifications**: [Important certifications held by team members]

## Professional Partnerships
- **Technology Partners**: [Key technology relationships]
- **Industry Associations**: [Memberships in professional organizations]
- **Research Collaborations**: [Any academic or research partnerships]

## Training & Development
- **Ongoing Education**: [How your team stays current]
- **Knowledge Sharing**: [Internal processes for expertise development]`,
    },
    {
      id: "industry-knowledge",
      title: "Industry Knowledge",
      icon: <Briefcase className="h-5 w-5" />,
      category: "expertise",
      description: "Insights about your industry and market position",
      content: `# [Company Name] - Industry Knowledge Base

## Industry Overview
- **Industry Name**: [Specific industry or sector]
- **Market Size**: [Current market size and growth projections]
- **Key Trends**: [3-5 major trends shaping the industry]
- **Challenges**: [Major challenges facing the industry]
- **Opportunities**: [Emerging opportunities in the space]

## Market Position
- **Market Share**: [Your approximate market share if known]
- **Competitive Landscape**: [Overview of the competitive environment]
- **Growth Trajectory**: [Your company's growth compared to industry]

## Major Competitors
[For each major competitor, include:]

### [Competitor Name]
- **Overview**: [Brief description]
- **Strengths**: [What they do well]
- **Weaknesses**: [Where they fall short]
- **How we differentiate**: [How your offering differs]

## Industry Terminology
[List and define 10-15 key industry terms that customers might need to understand]

## Regulatory Environment
- **Key Regulations**: [Important laws or regulations affecting your industry]
- **Compliance Requirements**: [How your company ensures compliance]
- **Recent/Upcoming Changes**: [Any regulatory changes that might impact customers]

## Industry Resources
- **Publications**: [Important industry publications]
- **Associations**: [Relevant industry associations]
- **Events**: [Major industry events]
- **Research Sources**: [Where to find reliable industry information]

## Our Industry Contributions
- **Thought Leadership**: [Content, research, or insights your company has published]
- **Innovations**: [How your company has helped advance the industry]
- **Community Involvement**: [Industry initiatives you participate in]`,
    },
    {
      id: "case-studies",
      title: "Case Studies & Success Stories",
      icon: <Award className="h-5 w-5" />,
      category: "marketing",
      description: "Real examples of customer success",
      content: `# [Company Name] - Case Studies & Success Stories

## Featured Case Study: [Client/Project Name]

### Client Profile
- **Industry**: [Client's industry]
- **Size**: [Company size]
- **Location**: [Geographic location]

### Challenge
[Detailed description of the problem or challenge the client faced before working with you]

### Solution
[Comprehensive explanation of how your product/service was implemented to address the challenge]

### Results
- **Quantitative Results**: [Specific metrics and improvements achieved]
- **Qualitative Benefits**: [Non-numerical benefits experienced]
- **ROI**: [Return on investment if available]
- **Timeline**: [How quickly results were achieved]

### Client Testimonial
[Direct quote from the client about their experience]

## Additional Success Stories

### [Client/Project Name]
- **Industry**: [Client's industry]
- **Challenge**: [Brief description of challenge]
- **Solution**: [Brief description of solution]
- **Key Results**: [2-3 key outcomes]
- **Quote**: [Brief testimonial]

### [Client/Project Name]
- **Industry**: [Client's industry]
- **Challenge**: [Brief description of challenge]
- **Solution**: [Brief description of solution]
- **Key Results**: [2-3 key outcomes]
- **Quote**: [Brief testimonial]

## Success Metrics
- **Average improvement in [key metric]**: [Percentage or figure]
- **Typical ROI timeframe**: [Time period]
- **Customer satisfaction rate**: [Percentage]
- **Implementation success rate**: [Percentage]

## Implementation Process
[Overview of how you typically implement solutions for clients]

## Follow-up Support
[Description of ongoing support provided after implementation]`,
    },
    {
      id: "policies",
      title: "Business Policies",
      icon: <FileText className="h-5 w-5" />,
      category: "operations",
      description: "Key policies customers should know about",
      content: `# [Company Name] - Business Policies

## Privacy Policy Overview
- **Data Collection**: [Summary of what data you collect]
- **Data Usage**: [How you use customer data]
- **Data Protection**: [How you protect customer data]
- **Third-Party Sharing**: [If/how you share data with third parties]
- **Customer Rights**: [Summary of customer rights regarding their data]
- **Full Policy**: [Link to complete privacy policy]

## Terms of Service Summary
- **User Obligations**: [Key responsibilities of users]
- **Prohibited Activities**: [What users cannot do]
- **Intellectual Property**: [Ownership of content and IP]
- **Limitation of Liability**: [Your liability limitations]
- **Full Terms**: [Link to complete terms of service]

## Return & Refund Policy
- **Return Eligibility**: [What can be returned/refunded]
- **Return Timeframe**: [How long customers have to request returns]
- **Return Process**: [Steps to initiate a return]
- **Refund Processing**: [How and when refunds are processed]
- **Exceptions**: [Any products/situations not eligible]

## Shipping Policy (if applicable)
- **Shipping Methods**: [Available shipping options]
- **Shipping Timeframes**: [Expected delivery times]
- **Shipping Costs**: [How shipping is calculated]
- **International Shipping**: [Information on international orders]
- **Order Tracking**: [How customers can track orders]

## Warranty Information
- **Coverage**: [What's covered under warranty]
- **Duration**: [Length of warranty periods]
- **Claim Process**: [How to make a warranty claim]
- **Limitations**: [What's not covered]

## Cancellation Policy
- **Subscription Cancellations**: [How to cancel recurring services]
- **Order Cancellations**: [Policy on canceling orders]
- **Fees**: [Any cancellation fees that may apply]
- **Notice Period**: [Required advance notice for cancellations]

## Security Practices
- **Payment Security**: [How payment information is protected]
- **Account Security**: [Security measures for user accounts]
- **Breach Notification**: [Process for notifying of security incidents]
- **Certifications**: [Any security certifications you hold]`,
    },
    {
      id: "business-hours",
      title: "Business Hours & Availability",
      icon: <Clock className="h-5 w-5" />,
      category: "operations",
      description: "When and how customers can reach you",
      content: `# [Company Name] - Business Hours & Availability

## Standard Business Hours
- **Monday-Friday**: [Opening time] to [Closing time]
- **Saturday**: [Opening time] to [Closing time] (or Closed)
- **Sunday**: [Opening time] to [Closing time] (or Closed)
- **Time Zone**: [Your operating time zone]

## Holiday Schedule
- **Annual Closures**: [List major holidays when you're closed]
- **Reduced Hours Periods**: [Any periods with modified hours]
- **Holiday Support**: [Availability of support during holidays]

## Department-Specific Hours
- **Sales**: [Hours, if different from standard]
- **Customer Support**: [Hours, if different from standard]
- **Technical Support**: [Hours, if different from standard]
- **Administrative**: [Hours, if different from standard]

## Response Time Expectations
- **Phone Inquiries**: [Expected response time]
- **Emails**: [Expected response time]
- **Support Tickets**: [Expected response time]
- **Social Media Messages**: [Expected response time]

## After-Hours Support
- **Emergency Contact**: [Process for urgent after-hours needs]
- **Self-Service Options**: [Resources available outside business hours]
- **Automated Systems**: [Any 24/7 automated support]

## Appointment/Consultation Booking
- **Scheduling Process**: [How to book appointments]
- **Lead Time Required**: [How far in advance to book]
- **Cancellation Policy**: [Policy for appointment cancellations]

## Seasonal Variations
- **Summer Hours**: [Any seasonal changes]
- **Holiday Season Hours**: [Any changes during holiday periods]
- **Other Seasonal Adjustments**: [Any other variations]`,
    },
    {
      id: "values-culture",
      title: "Values & Company Culture",
      icon: <Star className="h-5 w-5" />,
      category: "core",
      description: "What your company stands for",
      content: `# [Company Name] - Values & Company Culture

## Core Values
[For each core value, include:]

### [Value 1]
- **Description**: [What this value means to your company]
- **In Practice**: [How this value is demonstrated in your operations]
- **Customer Impact**: [How customers benefit from this value]

### [Value 2]
- **Description**: [What this value means to your company]
- **In Practice**: [How this value is demonstrated in your operations]
- **Customer Impact**: [How customers benefit from this value]

### [Value 3]
- **Description**: [What this value means to your company]
- **In Practice**: [How this value is demonstrated in your operations]
- **Customer Impact**: [How customers benefit from this value]

## Company Culture
- **Work Environment**: [Description of your workplace culture]
- **Team Dynamics**: [How your team works together]
- **Communication Style**: [Your approach to communication]
- **Innovation Approach**: [How you foster innovation]
- **Customer-Centricity**: [How customers fit into your culture]

## Social Responsibility
- **Environmental Initiatives**: [Your environmental practices]
- **Community Involvement**: [How you give back]
- **Ethical Commitments**: [Ethical standards you uphold]
- **Diversity & Inclusion**: [Your approach to D&I]

## Employee Development
- **Training Philosophy**: [How you develop your team]
- **Career Growth**: [Opportunities for advancement]
- **Continuous Learning**: [How ongoing education is supported]

## Recognition & Achievements
- **Industry Recognition**: [Awards and accolades]
- **Employee Recognition**: [How you celebrate team success]
- **Milestones**: [Significant company achievements]

## Customer Relationship Philosophy
- **Partnership Approach**: [How you view customer relationships]
- **Long-term Vision**: [Your commitment to customers over time]
- **Feedback Culture**: [How you incorporate customer input]`,
    },
  ]

  // Standard message templates
  const messageTemplates = [
    "Thanks for your comment! We appreciate your feedback.",
    "Hello! Thanks for reaching out. How can I help you today?",
    "We're glad you're interested in our products! Would you like more information?",
    "Thank you for your support! We'd love to hear more about your experience.",
  ]

  // Filter templates based on search and category
  const filteredTemplates = businessTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelectTemplate = (content: string) => {
    setSelectedTemplate(content)
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
    if (textarea) {
      textarea.value = content
      textarea.focus()
    }
  }

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  const handleExpandTemplate = (id: string) => {
    setExpandedTemplate(expandedTemplate === id ? null : id)
  }

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "core", label: "Core Business" },
    { id: "offerings", label: "Products & Pricing" },
    { id: "customers", label: "Customers" },
    { id: "marketing", label: "Marketing" },
    { id: "operations", label: "Operations" },
    { id: "expertise", label: "Expertise" },
    { id: "support", label: "Support" },
  ]

  return (
    <FloatingPanel
      title="Then"
      trigger={
        <motion.div
          className="group relative overflow-hidden rounded-xl mt-4 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Border with animation */}
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

          {/* Inner content */}
          <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
            <div className="flex items-center justify-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#768BDD]" />
              <p className="text-[#768BDD] font-bold">Then</p>
            </div>
          </div>
        </motion.div>
      }
    >
      <div className="flex flex-col gap-4">
        {showTip && <ContextCard context="response" onClose={() => setShowTip(false)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AUTOMATION_LISTENERS.map((listener) =>
            listener.type === "SMARTAI" ? (
              <SubscriptionPlan key={listener.type} type="PRO">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSetListener(listener.type)}
                  className={cn(
                    Listener === listener.type ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]" : "bg-background-80",
                    "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
                  )}
                >
                  <div className="flex gap-x-2 items-center">
                    {listener.icon}
                    <p>{listener.label}</p>
                  </div>
                  <p className="text-sm">{listener.description}</p>
                </motion.div>
              </SubscriptionPlan>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSetListener(listener.type)}
                key={listener.id}
                className={cn(
                  Listener === listener.type ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]" : "bg-background-80",
                  "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
                )}
              >
                <div className="flex gap-x-2 items-center">
                  {listener.icon}
                  <p>{listener.label}</p>
                </div>
                <p className="text-sm">{listener.description}</p>
              </motion.div>
            ),
          )}
        </div>

        <form onSubmit={onFormSubmit} className="flex flex-col gap-4 mt-2">
          {Listener && (
            <div className={`bg-background-80 p-4 rounded-xl mb-2`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  {Listener === "SMARTAI" ? (
                    <>
                      <Lightbulb className="h-5 w-5 mr-2 text-keyword-purple" />
                      Business Knowledge Hub
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                      Quick Responses
                    </>
                  )}
                </h3>
                <ResponseLibrary
                  isAI={Listener === "SMARTAI"}
                  onSelectTemplate={handleSelectTemplate}
                  selectedTemplate={selectedTemplate}
                  userSubscription={Listener}
                />
              </div>

              {Listener === "SMARTAI" ? (
                <Tabs defaultValue="templates" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="templates">Business Templates</TabsTrigger>
                    <TabsTrigger value="preview">Template Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4">
                    <div className="flex flex-col space-y-3">
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background-90 border-none"
                      />

                      <ScrollArea className="h-[50px] whitespace-nowrap rounded-md">
                        <div className="flex space-x-2 p-1">
                          {categories.map((category) => (
                            <Badge
                              key={category.id}
                              variant={selectedCategory === category.id ? "default" : "outline"}
                              className={`cursor-pointer ${selectedCategory === category.id ? "bg-keyword-purple" : ""}`}
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              {category.label}
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <ScrollArea className="h-[300px]">
                      <div className="grid grid-cols-1 gap-3">
                        {filteredTemplates.map((template) => (
                          <motion.div
                            key={template.id}
                            whileHover={{ scale: 1.01 }}
                            className="bg-background-90 p-3 rounded-lg border border-background-70 hover:border-keyword-purple transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-2">
                                <div className="mt-1 text-keyword-purple">{template.icon}</div>
                                <div>
                                  <h4 className="font-medium text-white">{template.title}</h4>
                                  <p className="text-sm text-gray-400">{template.description}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full hover:bg-keyword-purple/20"
                                        onClick={() => handleExpandTemplate(template.id)}
                                      >
                                        <FileText className="h-4 w-4 text-keyword-purple" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Preview template</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full hover:bg-keyword-purple/20"
                                        onClick={() => handleCopyToClipboard(template.content)}
                                      >
                                        <Bookmark className="h-4 w-4 text-keyword-purple" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Copy to clipboard</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs hover:bg-keyword-purple hover:text-white"
                                  onClick={() => handleSelectTemplate(template.content)}
                                >
                                  Use
                                </Button>
                              </div>
                            </div>

                            {expandedTemplate === template.id && (
                              <div className="mt-3 p-3 bg-background-100 rounded-md border border-background-70 text-sm">
                                <ScrollArea className="h-[200px]">
                                  <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300">
                                    {template.content}
                                  </pre>
                                </ScrollArea>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="preview">
                    {selectedTemplate ? (
                      <ScrollArea className="h-[400px] bg-background-90 p-4 rounded-lg border border-background-70">
                        <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300">{selectedTemplate}</pre>
                      </ScrollArea>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] bg-background-90 p-4 rounded-lg border border-background-70">
                        <FileText className="h-16 w-16 text-gray-500 mb-4" />
                        <p className="text-gray-400 text-center">Select a template to preview its content</p>
                        <p className="text-gray-500 text-sm text-center mt-2">
                          Templates provide comprehensive business information for your AI assistant
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {messageTemplates.map((message, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-background-90 p-2 rounded-lg text-sm cursor-pointer text-light-blue"
                      onClick={() => handleSelectTemplate(message)}
                    >
                      {message}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              {Listener === "SMARTAI"
                ? "Add business knowledge for your AI assistant"
                : "Add a message you want to send to your customers"}
            </label>
            <Textarea
              placeholder={
                Listener === "SMARTAI"
                  ? "Paste or type detailed information about your business..."
                  : "Add a message you want to send to your customers"
              }
              {...register("prompt")}
              className="bg-background-80 outline-none border-none ring-0 focus:ring-0 min-h-[200px]"
            />
            {Listener === "SMARTAI" && (
              <p className="text-xs text-gray-400">
                Provide comprehensive information about your business. The more detailed your knowledge base, the better
                your AI can answer customer questions.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Add a reply for comments (Optional)</label>
            <Input
              {...register("reply")}
              placeholder="Add a reply for comments (Optional)"
              className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
            />
          </div>

          <Button
            className={cn(
              "bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]",
              Listener === "SMARTAI" && "from-[#7C21D6] to-[#4A1480]",
            )}
          >
            <Loader state={isPending}>{Listener === "SMARTAI" ? "Add business knowledge" : "Add a listener"}</Loader>
          </Button>
        </form>
      </div>
    </FloatingPanel>
  )
}

export default ThenAction
