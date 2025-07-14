// import { type NextRequest, NextResponse } from "next/server"
// import { client } from "@/lib/prisma"

// export async function POST(request: NextRequest) {
//   try {
//     // Verify authorization
//     const authHeader = request.headers.get("authorization")
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { leadId, userId, leadData, forceSync } = body

//     console.log(`🔄 CRM sync request for lead ${leadId}`)

//     // Get lead with full data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: {
//         qualificationData: true,
//         interactions: {
//           take: 1,
//           orderBy: { timestamp: "desc" },
//         },
//       },
//     })

//     if (!lead) {
//       return NextResponse.json({ error: "Lead not found" }, { status: 404 })
//     }

//     // Get user's CRM integration
//     const crmIntegration = await client.crmIntegration.findFirst({
//       where: {
//         userId: userId,
//         isActive: true,
//       },
//     })

//     if (!crmIntegration) {
//       return NextResponse.json(
//         {
//           error: "No active CRM integration found",
//           requiresSetup: true,
//         },
//         { status: 400 },
//       )
//     }

//     // Prepare CRM data
//     const crmData = {
//       leadId: lead.id,
//       name: lead.name || `Instagram User ${lead.instagramUserId}`,
//       email: lead.email,
//       phone: lead.phone,
//       source: "Instagram",
//       status: leadData.stage || lead.status,
//       score: leadData.score || lead.score,
//       leadTier: leadData.tier,
//       estimatedValue: leadData.revenueData?.estimatedValue,
//       lastInteraction: leadData.lastInteraction,
//       tags: [`Score:${lead.score}`, `Tier:${leadData.tier}`, ...lead.tags],
//     }

//     // Sync to CRM based on provider
//     let syncResult
//     try {
//       switch (crmIntegration.provider) {
//         case "HUBSPOT":
//           syncResult = await syncToHubSpot(crmData, crmIntegration)
//           break
//         case "SALESFORCE":
//           syncResult = await syncToSalesforce(crmData, crmIntegration)
//           break
//         case "PIPEDRIVE":
//           syncResult = await syncToPipedrive(crmData, crmIntegration)
//           break
//         default:
//           throw new Error(`Unsupported CRM provider: ${crmIntegration.provider}`)
//       }

//       // Update lead with sync info
//       await client.lead.update({
//         where: { id: leadId },
//         data: {
//           metadata: {
//             ...((lead.metadata as any) || {}),
//             crmSyncData: {
//               syncedAt: new Date().toISOString(),
//               crmId: syncResult.crmId,
//               provider: crmIntegration.provider,
//               syncStatus: "success",
//             },
//           },
//         },
//       })

//       console.log(`✅ Lead ${leadId} synced to ${crmIntegration.provider}`)

//       return NextResponse.json({
//         success: true,
//         crmId: syncResult.crmId,
//         provider: crmIntegration.provider,
//         syncedAt: new Date().toISOString(),
//       })
//     } catch (syncError) {
//       console.error(`❌ CRM sync failed:`, syncError)

//       // Update lead with error info
//       await client.lead.update({
//         where: { id: leadId },
//         data: {
//           metadata: {
//             ...((lead.metadata as any) || {}),
//             crmSyncData: {
//               syncedAt: new Date().toISOString(),
//               provider: crmIntegration.provider,
//               syncStatus: "failed",
//               error: syncError instanceof Error ? syncError.message : "Unknown error",
//             },
//           },
//         },
//       })

//       return NextResponse.json(
//         {
//           success: false,
//           error: syncError instanceof Error ? syncError.message : "CRM sync failed",
//           provider: crmIntegration.provider,
//         },
//         { status: 500 },
//       )
//     }
//   } catch (error) {
//     console.error("❌ CRM sync webhook error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // CRM sync functions (simplified versions)
// async function syncToHubSpotE(crmData: any, crmIntegration: any) {
//   const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${crmIntegration.accessToke}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       properties: {
//         firstname: crmData.name.split(" ")[0] || "",
//         lastname: crmData.name.split(" ").slice(1).join(" ") || "",
//         email: crmData.email || "",
//         phone: crmData.phone || "",
//         lifecyclestage: "lead",
//         lead_status: crmData.status,
//         hs_lead_status: crmData.leadTier,
//         lead_score: crmData.score,
//         estimated_value: crmData.estimatedValue,
//       },
//     }),
//   })

//   if (!response.ok) {
//     throw new Error(`HubSpot sync failed: ${response.statusText}`)
//   }

//   const contact = await response.json()
//   return { crmId: contact.id, provider: "HUBSPOT" }
// }

// async function syncToSalesforce(crmData: any, crmIntegration: any) {
//   const response = await fetch(`${crmIntegration.baseUrl}/services/data/v57.0/sobjects/Lead`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${crmIntegration.accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       FirstName: crmData.name.split(" ")[0] || "",
//       LastName: crmData.name.split(" ").slice(1).join(" ") || "Unknown",
//       Email: crmData.email || "",
//       Phone: crmData.phone || "",
//       Status: "Open - Not Contacted",
//       LeadSource: crmData.source,
//       Lead_Score__c: crmData.score,
//     }),
//   })

//   if (!response.ok) {
//     throw new Error(`Salesforce sync failed: ${response.statusText}`)
//   }

//   const lead = await response.json()
//   return { crmId: lead.id, provider: "SALESFORCE" }
// }

// async function syncToPipedrive(crmData: any, crmIntegration: any) {
//   const response = await fetch(`${crmIntegration.baseUrl}/v1/persons?api_token=${crmIntegration.apiKey}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name: crmData.name,
//       email: [{ value: crmData.email, primary: true }],
//       phone: [{ value: crmData.phone, primary: true }],
//     }),
//   })

//   if (!response.ok) {
//     throw new Error(`Pipedrive sync failed: ${response.statusText}`)
//   }

//   const person = await response.json()
//   return { crmId: person.data.id, provider: "PIPEDRIVE" }
// }




// async function syncToHubSpotEE(crmData: any, crmIntegration: any) {
//   // Validate required data
//   if (!crmIntegration.accessToken) {
//     throw new Error("HubSpot access token is missing")
//   }

//   // Prepare properties with validation
//   const properties: any = {
//     lifecyclestage: "lead",
//   }

//   // Only add properties if they exist and are valid
//   if (crmData.name) {
//     const nameParts = crmData.name.split(" ")
//     properties.firstname = nameParts[0] || ""
//     properties.lastname = nameParts.slice(1).join(" ") || ""
//   }

//   if (crmData.email) {
//     properties.email = crmData.email
//   }

//   if (crmData.phone) {
//     properties.phone = crmData.phone
//   }

//   if (crmData.status) {
//     properties.lead_status = crmData.status
//   }

//   if (crmData.leadTier) {
//     properties.hs_lead_status = crmData.leadTier
//   }

//   if (crmData.score) {
//     properties.lead_score = crmData.score.toString()
//   }

//   if (crmData.estimatedValue) {
//     properties.estimated_value = crmData.estimatedValue.toString()
//   }

//   console.log("📤 Sending to HubSpot:", { properties })

//   const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${crmIntegration.accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       properties,
//     }),
//   })

//   // Enhanced error handling
//   if (!response.ok) {
//     let errorMessage = `HubSpot sync failed: ${response.status} ${response.statusText}`
    
//     try {
//       const errorBody = await response.json()
//       console.error("🔴 HubSpot error details:", errorBody)
      
//       if (errorBody.message) {
//         errorMessage = `HubSpot sync failed: ${errorBody.message}`
//       }
      
//       // Handle specific HubSpot error cases
//       if (errorBody.category === "VALIDATION_ERROR") {
//         errorMessage = `HubSpot validation error: ${errorBody.message}`
//       }
      
//       if (response.status === 401) {
//         errorMessage = "HubSpot authentication failed. Please check your access token."
//       }
      
//     } catch (parseError) {
//       console.error("🔴 Could not parse HubSpot error response:", parseError)
//     }
    
//     throw new Error(errorMessage)
//   }

//   const contact = await response.json()
//   console.log("✅ HubSpot contact created:", contact.id)
  
//   return { crmId: contact.id, provider: "HUBSPOT" }
// }




// async function syncToHubSpot(crmData: any, crmIntegration: any) {
//   let accessToken = crmIntegration.accessToken;
  
//   // If no access token but have apiKey/apiSecret, this is OAuth flow
//   if (!accessToken && crmIntegration.apiKey && crmIntegration.apiSecret) {
//     // For OAuth, you need to exchange refresh token for access token
//     // This requires a refresh token stored in your database
//     if (!crmIntegration.refreshToken) {
//       throw new Error("HubSpot OAuth refresh token is missing. Please re-authenticate.");
//     }
    
//     try {
//       const tokenResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           grant_type: "refresh_token",
//           client_id: crmIntegration.apiKey,
//           client_secret: crmIntegration.apiSecret,
//           refresh_token: crmIntegration.refreshToken,
//         }),
//       });

//       if (!tokenResponse.ok) {
//         const errorBody = await tokenResponse.json();
//         throw new Error(`OAuth token refresh failed: ${errorBody.message}`);
//       }

//       const tokenData = await tokenResponse.json();
//       accessToken = tokenData.access_token;
      
//       // Update the access token in database for future use
//       await client.crmIntegration.update({
//         where: { id: crmIntegration.id },
//         data: { 
//           accessToken: accessToken,
//           refreshToken: tokenData.refresh_token, // Update refresh token if provided
//         },
//       });
      
//     } catch (error) {
//       throw new Error(`Failed to refresh HubSpot token:`);
//     }
//   }

//   if (!accessToken) {
//     throw new Error("HubSpot access token is missing. Please check your integration setup.");
//   }

//   // Rest of your sync logic remains the same...
//   const properties: any = {
//     lifecyclestage: "lead",
//   };

//   if (crmData.name) {
//     const nameParts = crmData.name.split(" ");
//     properties.firstname = nameParts[0] || "";
//     properties.lastname = nameParts.slice(1).join(" ") || "";
//   }

//   if (crmData.email) {
//     properties.email = crmData.email;
//   }

//   if (crmData.phone) {
//     properties.phone = crmData.phone;
//   }

//   if (crmData.status) {
//     properties.lead_status = crmData.status;
//   }

//   if (crmData.leadTier) {
//     properties.hs_lead_status = crmData.leadTier;
//   }

//   if (crmData.score) {
//     properties.lead_score = crmData.score.toString();
//   }

//   if (crmData.estimatedValue) {
//     properties.estimated_value = crmData.estimatedValue.toString();
//   }

//   console.log("📤 Sending to HubSpot:", { properties });

//   const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       properties,
//     }),
//   });

//   if (!response.ok) {
//     let errorMessage = `HubSpot sync failed: ${response.status} ${response.statusText}`;
    
//     try {
//       const errorBody = await response.json();
//       console.error("🔴 HubSpot error details:", errorBody);
      
//       if (errorBody.message) {
//         errorMessage = `HubSpot sync failed: ${errorBody.message}`;
//       }
      
//       if (response.status === 401) {
//         errorMessage = "HubSpot authentication failed. Please re-authenticate your HubSpot integration.";
//       }
      
//     } catch (parseError) {
//       console.error("🔴 Could not parse HubSpot error response:", parseError);
//     }
    
//     throw new Error(errorMessage);
//   }

//   const contact = await response.json();
//   console.log("✅ HubSpot contact created:", contact.id);
  
//   return { crmId: contact.id, provider: "HUBSPOT" };
// }



import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { leadId, userId, leadData, forceSync } = body

    console.log(`🔄 CRM sync request for lead ${leadId}`)

    // Get lead with full data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          take: 1,
          orderBy: { timestamp: "desc" },
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Get user's CRM integration
    const crmIntegration = await client.crmIntegration.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
    })

    if (!crmIntegration) {
      return NextResponse.json(
        {
          error: "No active CRM integration found",
          requiresSetup: true,
        },
        { status: 400 },
      )
    }

    // Prepare CRM data
    const crmData = {
      leadId: lead.id,
      name: lead.name || `Instagram User ${lead.instagramUserId}`,
      email: lead.email,
      phone: lead.phone,
      source: "Instagram",
      status: leadData.stage || lead.status,
      score: leadData.score || lead.score,
      leadTier: leadData.tier,
      estimatedValue: leadData.revenueData?.estimatedValue,
      lastInteraction: leadData.lastInteraction,
      tags: [`Score:${lead.score}`, `Tier:${leadData.tier}`, ...lead.tags],
    }

    // Sync to CRM based on provider
    let syncResult
    try {
      switch (crmIntegration.provider) {
        case "HUBSPOT":
          syncResult = await syncToHubSpot(crmData, crmIntegration)
          break
        case "SALESFORCE":
          syncResult = await syncToSalesforce(crmData, crmIntegration)
          break
        case "PIPEDRIVE":
          syncResult = await syncToPipedrive(crmData, crmIntegration)
          break
        default:
          throw new Error(`Unsupported CRM provider: ${crmIntegration.provider}`)
      }

      // Update lead with sync info
      await client.lead.update({
        where: { id: leadId },
        data: {
          metadata: {
            ...((lead.metadata as any) || {}),
            crmSyncData: {
              syncedAt: new Date().toISOString(),
              crmId: syncResult.crmId,
              provider: crmIntegration.provider,
              syncStatus: "success",
            },
          },
        },
      })

      console.log(`✅ Lead ${leadId} synced to ${crmIntegration.provider}`)

      return NextResponse.json({
        success: true,
        crmId: syncResult.crmId,
        provider: crmIntegration.provider,
        syncedAt: new Date().toISOString(),
      })
    } catch (syncError) {
      console.error(`❌ CRM sync failed:`, syncError)

      // Update lead with error info
      await client.lead.update({
        where: { id: leadId },
        data: {
          metadata: {
            ...((lead.metadata as any) || {}),
            crmSyncData: {
              syncedAt: new Date().toISOString(),
              provider: crmIntegration.provider,
              syncStatus: "failed",
              error: syncError instanceof Error ? syncError.message : "Unknown error",
            },
          },
        },
      })

      return NextResponse.json(
        {
          success: false,
          error: syncError instanceof Error ? syncError.message : "CRM sync failed",
          provider: crmIntegration.provider,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ CRM sync webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function syncToHubSpotE(crmData: any, crmIntegration: any) {
  // Handle both OAuth and direct token storage
  let accessToken = crmIntegration.accessToken || crmIntegration.apiKey;
  let refreshToken = crmIntegration.refreshToken || crmIntegration.apiSecret;
  
  // If no access token but have refresh token, refresh it
  if (!accessToken && refreshToken) {
    try {
      const tokenResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.HUBSPOT_CLIENT_ID!,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
          refresh_token: refreshToken,
        }),
      });

      if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.json();
        throw new Error(`OAuth token refresh failed: ${errorBody.message}`);
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
      
      // Update both sets of fields for compatibility
      await client.crmIntegration.update({
        where: { id: crmIntegration.id },
        data: { 
          apiKey: accessToken,
          apiSecret: tokenData.refresh_token || refreshToken,
          accessToken: accessToken,
          refreshToken: tokenData.refresh_token || refreshToken,
        },
      });
      
    } catch (error) {
      throw new Error(`Failed to refresh HubSpot token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (!accessToken) {
    throw new Error("HubSpot access token is missing. Please re-authenticate your HubSpot integration.");
  }

  // Prepare properties with validation
  const properties: any = {
    lifecyclestage: "lead",
  };

  if (crmData.name) {
    const nameParts = crmData.name.split(" ");
    properties.firstname = nameParts[0] || "";
    properties.lastname = nameParts.slice(1).join(" ") || "";
  }

  if (crmData.email) {
    properties.email = crmData.email;
  }

  if (crmData.phone) {
    properties.phone = crmData.phone;
  }

  if (crmData.status) {
    properties.lead_status = crmData.status;
  }

  if (crmData.leadTier) {
    properties.hs_lead_status = crmData.leadTier;
  }

  if (crmData.score) {
    properties.lead_score = crmData.score.toString();
  }

  if (crmData.estimatedValue) {
    properties.estimated_value = crmData.estimatedValue.toString();
  }

  console.log("📤 Sending to HubSpot:", { properties });

  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties,
    }),
  });

  if (!response.ok) {
    let errorMessage = `HubSpot sync failed: ${response.status} ${response.statusText}`;
    
    try {
      const errorBody = await response.json();
      console.error("🔴 HubSpot error details:", errorBody);
      
      if (errorBody.message) {
        errorMessage = `HubSpot sync failed: ${errorBody.message}`;
      }
      
      if (response.status === 401) {
        errorMessage = "HubSpot authentication failed. Please re-authenticate your HubSpot integration.";
      }
      
    } catch (parseError) {
      console.error("🔴 Could not parse HubSpot error response:", parseError);
    }
    
    throw new Error(errorMessage);
  }

  const contact = await response.json();
  console.log("✅ HubSpot contact created:", contact.id);
  
  return { crmId: contact.id, provider: "HUBSPOT" };
}

async function syncToSalesforce(crmData: any, crmIntegration: any) {
  const response = await fetch(`${crmIntegration.baseUrl}/services/data/v57.0/sobjects/Lead`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${crmIntegration.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FirstName: crmData.name.split(" ")[0] || "",
      LastName: crmData.name.split(" ").slice(1).join(" ") || "Unknown",
      Email: crmData.email || "",
      Phone: crmData.phone || "",
      Status: "Open - Not Contacted",
      LeadSource: crmData.source,
      Lead_Score__c: crmData.score,
    }),
  })

  if (!response.ok) {
    throw new Error(`Salesforce sync failed: ${response.statusText}`)
  }

  const lead = await response.json()
  return { crmId: lead.id, provider: "SALESFORCE" }
}

async function syncToPipedrive(crmData: any, crmIntegration: any) {
  const response = await fetch(`${crmIntegration.baseUrl}/v1/persons?api_token=${crmIntegration.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: crmData.name,
      email: [{ value: crmData.email, primary: true }],
      phone: [{ value: crmData.phone, primary: true }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Pipedrive sync failed: ${response.statusText}`)
  }

  const person = await response.json()
  return { crmId: person.data.id, provider: "PIPEDRIVE" }
}


async function syncToHubSpot(crmData: any, crmIntegration: any) {
  let accessToken = crmIntegration.accessToken || crmIntegration.apiKey;
  let refreshToken = crmIntegration.refreshToken || crmIntegration.apiSecret;
  
  // Function to refresh the access token
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      throw new Error("HubSpot refresh token is missing. Please re-authenticate your HubSpot integration.");
    }

    if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_CLIENT_SECRET) {
      throw new Error("HubSpot OAuth credentials are not configured. Please check your environment variables.");
    }

    try {
      const tokenResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          refresh_token: refreshToken,
        }),
      });

      if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.json();
        throw new Error(`OAuth token refresh failed: ${errorBody.message || 'Unknown error'}`);
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
      
      // Update the database with new tokens
      await client.crmIntegration.update({
        where: { id: crmIntegration.id },
        data: { 
          apiKey: accessToken,
          apiSecret: tokenData.refresh_token || refreshToken,
          accessToken: accessToken,
          refreshToken: tokenData.refresh_token || refreshToken,
          // Store token expiry for future proactive refresh
          tokenExpiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
        },
      });
      
      console.log("🔄 HubSpot access token refreshed successfully");
      return accessToken;
      
    } catch (error) {
      throw new Error(`Failed to refresh HubSpot token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to make the API call with retry logic
  const makeHubSpotRequest = async (token: string, attempt: number = 1): Promise<any> => {
    const properties: any = {
      lifecyclestage: "lead",
    };

    if (crmData.name) {
      const nameParts = crmData.name.split(" ");
      properties.firstname = nameParts[0] || "";
      properties.lastname = nameParts.slice(1).join(" ") || "";
    }

    if (crmData.email) {
      properties.email = crmData.email;
    }

    if (crmData.phone) {
      properties.phone = crmData.phone;
    }

    if (crmData.leadTier) {
      const leadTierToHubSpotStatus: { [key: string]: string } = {
        'PLATINUM': 'OPEN_DEAL',
        'GOLD': 'IN_PROGRESS', 
        'SILVER': 'OPEN',
        'BRONZE': 'NEW',
        'HOT': 'OPEN_DEAL',
        'QUALIFIED': 'IN_PROGRESS',
        'QUALIFYING': 'OPEN',
        'NEW': 'NEW',
        'CONVERTED': 'CONNECTED',
        'LOST': 'UNQUALIFIED'
      };
      
      properties.hs_lead_status = leadTierToHubSpotStatus[crmData.leadTier as string] || 'NEW';
    }

    console.log(`📤 Sending to HubSpot (attempt ${attempt}):`, { properties });

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties,
      }),
    });

    // If we get a 401 (unauthorized) and this is our first attempt, try refreshing the token
    if (response.status === 401 && attempt === 1) {
      console.log("🔄 Access token expired, attempting to refresh...");
      const newToken = await refreshAccessToken();
      return makeHubSpotRequest(newToken, 2); // Retry with new token
    }

    if (!response.ok) {
      let errorMessage = `HubSpot sync failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorBody = await response.json();
        console.error("🔴 HubSpot error details:", errorBody);
        
        if (errorBody.message) {
          errorMessage = `HubSpot sync failed: ${errorBody.message}`;
        }
        
        if (response.status === 401) {
          errorMessage = "HubSpot authentication failed. Please re-authenticate your HubSpot integration.";
        }
        
      } catch (parseError) {
        console.error("🔴 Could not parse HubSpot error response:", parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  };

  // Check if we need to refresh the token proactively
  if (crmIntegration.tokenExpiresAt && new Date() > new Date(crmIntegration.tokenExpiresAt)) {
    console.log("🔄 Access token expired, refreshing proactively...");
    accessToken = await refreshAccessToken();
  }

  // If we still don't have an access token, try refreshing
  if (!accessToken && refreshToken) {
    accessToken = await refreshAccessToken();
  }

  if (!accessToken) {
    throw new Error("HubSpot access token is missing. Please re-authenticate your HubSpot integration.");
  }

  // Make the API request with retry logic
  const contact = await makeHubSpotRequest(accessToken);
  console.log("✅ HubSpot contact created:", contact.id);
  
  return { crmId: contact.id, provider: "HUBSPOT" };
}