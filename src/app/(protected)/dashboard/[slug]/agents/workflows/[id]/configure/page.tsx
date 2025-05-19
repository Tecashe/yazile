// import type { Metadata } from "next"
// // import { auth } from "@/lib/auth"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"

// import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

// interface WorkflowConfigPageProps {
//   params: {
//     id: string
//   }
//   searchParams: {
//     tab?: string
//   }
// }

// export const metadata: Metadata = {
//   title: "Configure Workflow | n8n Integration Platform",
//   description: "Configure your n8n workflow",
// }

// export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id } = params
//   const { tab } = searchParams

//   // Verify the workflow exists and belongs to the userr
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/${id}`, {
//       headers: {
//         Cookie: `next-auth.session-token=${session.data.id}`,
//       },
//     })

//     if (!response.ok) {
//       notFound()
//     }
//   } catch (error) {
//     notFound()
//   }

//   return (
//     <div>
//       <WorkflowConfigurationForm workflowId={id} activateAfterSave={false} />
//     </div>
//   )
// }

// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"
// import { client } from "@/lib/prisma"
// import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

// interface WorkflowConfigPageProps {
//   params: {
//     id: string
//   }
//   searchParams: {
//     tab?: string
//   }
// }

// export const metadata: Metadata = {
//   title: "Configure Workflow | n8n Integration Platform",
//   description: "Configure your n8n workflow",
// }

// export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
//   const session = await onUserInfor()
  
//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id } = params
//   const { tab } = searchParams

//   // Verify the workflow exists and belongs to the user
//   try {
//     const workflow = await client.userWorkflow.findUnique({
//       where: {
//         id,
//         userId: session.data.id, // Ensure the workflow belongs to the authenticated user
//       },
//       include: {
//         template: true,
//         credentials: {
//           select: {
//             id: true,
//             name: true,
//             type: true,
//             expiresAt: true,
//           },
//         },
//       },
//     })

//     if (!workflow) {
//       notFound()
//     }

//     return (
//       <div>
//          <WorkflowConfigurationForm workflowId={id} activateAfterSave={false} />
//       </div>
//     )
//   } catch (error) {
//     console.error("Error fetching workflow:", error)
//     notFound()
//   }
// }


// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"
// import { client } from "@/lib/prisma"
// import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

// interface WorkflowConfigPageProps {
//   params: {
//     id: string
//   }
//   searchParams: {
//     tab?: string
//   }
// }

// export const metadata: Metadata = {
//   title: "Configure Workflow | n8n Integration Platform",
//   description: "Configure your n8n workflow",
// }

// export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
//   const session = await onUserInfor()
  
//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id } = params
//   const { tab } = searchParams

//   // Verify the workflow exists and belongs to the user
//   try {
//     const workflow = await client.userWorkflow.findUnique({
//       where: {
//         id,
//         userId: session.data.id, // Ensure the workflow belongs to the authenticated user
//       },
//       include: {
//         template: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             configurationSchema: true, // Include the JSON field
//             requiredIntegrations: true,
//           },
//         },
//         credentials: {
//           select: {
//             id: true,
//             name: true,
//             type: true,
//             expiresAt: true,
//           },
//         },
//         executions: {
//           take: 5,
//           orderBy: { startedAt: "desc" },
//           select: {
//             id: true,
//             status: true,
//             startedAt: true,
//             completedAt: true,
//             success: true,
//           },
//         },
//       },
//     })

//     if (!workflow) {
//       notFound()
//     }

//     // Add debugging
//     console.log("Workflow data:", workflow)
//     console.log("Credentials:", workflow.credentials)
//     console.log("Executions:", workflow.executions)

//     // Ensure arrays exist even if empty and provide safe defaults
//     const safeWorkflow = {
//       ...workflow,
//       credentials: workflow.credentials || [],
//       executions: workflow.executions || [],
//       template: {
//         ...workflow.template,
//         configurationSchema: workflow.template?.configurationSchema || {
//           sections: [],
//         },
//         requiredIntegrations: workflow.template?.requiredIntegrations || [],
//       },
//     }

//     return (
//       <div>
//         <WorkflowConfigurationForm 
//           workflowId={id} 
//           activateAfterSave={false}
//         />
//       </div>
//     )
//   } catch (error) {
//     console.error("Error fetching workflow:", error)
//     notFound()
//   }
// }

// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"
// import { notFound } from "next/navigation"
// import { client } from "@/lib/prisma"
// import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

// // Define proper interfaces for your data structures
// interface ConfigurationField {
//   id: string;
//   name: string;
//   type: string;
//   required?: boolean;
//   options?: Array<{value: string; label: string}>;
//   // Add other field properties as needed
// }

// interface ConfigurationSection {
//   id: string;
//   title: string;
//   fields: ConfigurationField[];
// }

// interface ConfigurationSchema {
//   sections: ConfigurationSection[];
//   // Add other schema properties as needed
// }

// interface WorkflowTemplate {
//   id: string;
//   name: string;
//   description: string;
//   configurationSchema: ConfigurationSchema | null;
//   requiredIntegrations: string[];
// }

// interface WorkflowCredential {
//   id: string;
//   name: string;
//   type: string;
//   expiresAt: Date | null;
// }

// interface WorkflowExecution {
//   id: string;
//   status: string;
//   startedAt: Date;
//   completedAt: Date | null;
//   success: boolean;
// }

// interface Workflow {
//   id: string;
//   template: WorkflowTemplate | null;
//   credentials: WorkflowCredential[];
//   executions: WorkflowExecution[];
// }

// interface WorkflowConfigPageProps {
//   params: {
//     id: string
//   }
//   searchParams: {
//     tab?: string
//   }
// }

// export const metadata: Metadata = {
//   title: "Configure Workflow | n8n Integration Platform",
//   description: "Configure your n8n workflow",
// }

// export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
//   const session = await onUserInfor()
  
//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   const { id } = params
//   const { tab } = searchParams

//   // Verify the workflow exists and belongs to the user
//   try {
//     const workflow = await client.userWorkflow.findUnique({
//       where: {
//         id,
//         userId: session.data.id, // Ensure the workflow belongs to the authenticated user
//       },
//       include: {
//         template: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             configurationSchema: true, // Include the JSON field
//             requiredIntegrations: true,
//           },
//         },
//         credentials: {
//           select: {
//             id: true,
//             name: true,
//             type: true,
//             expiresAt: true,
//           },
//         },
//         executions: {
//           take: 5,
//           orderBy: { startedAt: "desc" },
//           select: {
//             id: true,
//             status: true,
//             startedAt: true,
//             completedAt: true,
//             success: true,
//           },
//         },
//       },
//     }) as Workflow | null;

//     if (!workflow) {
//       notFound()
//     }

//     // Add debugging
//     console.log("Workflow data:", workflow)
//     console.log("Template:", workflow.template)
//     console.log("ConfigurationSchema:", workflow.template?.configurationSchema)
//     console.log("Sections:", workflow.template?.configurationSchema?.sections)
//     console.log("RequiredIntegrations:", workflow.template?.requiredIntegrations)

//     // Safely process the configuration schema with proper type checking
//     const configSchema: ConfigurationSchema = {
//       sections: []
//     };

//     // Only process sections if they exist and are an array
//     if (workflow.template?.configurationSchema && 
//         typeof workflow.template.configurationSchema === 'object' && 
//         workflow.template.configurationSchema !== null &&
//         Array.isArray((workflow.template.configurationSchema as ConfigurationSchema).sections)) {
      
//       configSchema.sections = (workflow.template.configurationSchema as ConfigurationSchema).sections.map((section: ConfigurationSection) => {
//         return {
//           ...section,
//           fields: Array.isArray(section.fields) ? section.fields.map((field: ConfigurationField) => ({
//             ...field,
//             options: Array.isArray(field.options) ? field.options : []
//           })) : []
//         };
//       });
//     }


//     return (
//       <div>
//         <WorkflowConfigurationForm 
//           workflowId={id} 
//           activateAfterSave={false}
//         />
//       </div>
//     )
//   } catch (error) {
//     console.error("Error fetching workflow:", error)
//     notFound()
//   }
// }

import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { client } from "@/lib/prisma"
import { WorkflowConfigurationForm } from "@/components/global/workflows/workflow-configuration-form"

// Updated interfaces to match the actual JSON Schema structure
interface JsonSchemaProperty {
  type: string;
  title?: string;
  description?: string;
  required?: string[];
  properties?: Record<string, JsonSchemaProperty>;
  dependencies?: Record<string, any>;
  enum?: string[];
  default?: any;
  // Add other JSON Schema properties as needed
}

interface ConfigurationSchema {
  type: string;
  required?: string[];
  properties: Record<string, JsonSchemaProperty>;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  configurationSchema: ConfigurationSchema | null;
  requiredIntegrations: string[];
}

interface WorkflowCredential {
  id: string;
  name: string;
  type: string;
  expiresAt: Date | null;
}

interface WorkflowExecution {
  id: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  success: boolean;
}

interface Workflow {
  id: string;
  template: WorkflowTemplate | null;
  credentials: WorkflowCredential[];
  executions: WorkflowExecution[];
}

interface WorkflowConfigPageProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: string
  }
}

export const metadata: Metadata = {
  title: "Configure Workflow | n8n Integration Platform",
  description: "Configure your n8n workflow",
}

export default async function WorkflowConfigPage({ params, searchParams }: WorkflowConfigPageProps) {
  const session = await onUserInfor()
  
  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id } = params
  const { tab } = searchParams

  // Verify the workflow exists and belongs to the user
  try {
    const workflow = await client.userWorkflow.findUnique({
      where: {
        id,
        userId: session.data.id, // Ensure the workflow belongs to the authenticated user
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
            configurationSchema: true, // Include the JSON field
            requiredIntegrations: true,
          },
        },
        credentials: {
          select: {
            id: true,
            name: true,
            type: true,
            expiresAt: true,
          },
        },
        executions: {
          take: 5,
          orderBy: { startedAt: "desc" },
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            success: true,
          },
        },
      },
    }) as Workflow | null;

    if (!workflow) {
      notFound()
    }

    // Add debugging
    console.log("Workflow data:", workflow)
    console.log("Template:", workflow.template)
    console.log("ConfigurationSchema:", workflow.template?.configurationSchema)
    console.log("Schema properties:", workflow.template?.configurationSchema?.properties)
    console.log("RequiredIntegrations:", workflow.template?.requiredIntegrations)

    // Validate the configuration schema structure
    let validConfigSchema: ConfigurationSchema | null = null;

    if (workflow.template?.configurationSchema && 
        typeof workflow.template.configurationSchema === 'object' && 
        workflow.template.configurationSchema !== null) {
      
      const schema = workflow.template.configurationSchema as ConfigurationSchema;
      
      // Ensure it has the proper JSON Schema structure
      if (schema.type === 'object' && schema.properties && typeof schema.properties === 'object') {
        validConfigSchema = schema;
      }
    }

    return (
      <div>
         <WorkflowConfigurationForm 
          workflowId={id} 
          activateAfterSave={false}
        />
        {/* <WorkflowConfigurationForm 
          workflowId={id} 
          activateAfterSave={false}
          configurationSchema={validConfigSchema}
          template={workflow.template}
          credentials={workflow.credentials}
          executions={workflow.executions}
        /> */}
      </div>
    )
  } catch (error) {
    console.error("Error fetching workflow:", error)
    notFound()
  }
}