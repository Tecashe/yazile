// 'use'
// import type { Metadata } from "next"
// import WorkflowSelector from "../_components/workflow-selector/workflow-selector"

// export const metadata: Metadata = {
//   title: "Workflow Selector | Choose Your Business Automation",
//   description:
//     "Select the perfect workflow template for your business type and automate your social media responses with AI-powered conversations.",
// }

// export default function WorkflowSelectorPage() {
//   return (
//     <div className="min-h-screen">
//       <WorkflowSelector />
//     </div>
//   )
// }

// 'use client'

// import WorkflowSelector from "../_components/workflow-selector/workflow-selector"

// import { getAllBusinesses } from '@/actions/businfo'; 
// import { useEffect, useState } from 'react';
// import { onUserInfor } from "@/actions/user";



// export default function WorkflowSelectorPage() {
//   const [businessId, setBusinessId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusiness = async () => {
//       try {
//         const result = await getAllBusinesses();
//         if (result.status === 200 && result.data.businesses.length > 0) {
//           // Get the first business ID
//           setBusinessId(result.data.businesses[0].id);
//         }
//       } catch (error) {
//         console.error('Error fetching businesses:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusiness();
//   }, []);

//   const handleWorkflowSelected = (workflow: any) => {
//     // Handle workflow selection
//     console.log("Selected workflow:", workflow);
//   };

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   if (!businessId) {
//     return <div className="min-h-screen flex items-center justify-center">No business found</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <WorkflowSelector 
//         businessId={businessId}
//         onWorkflowSelected={handleWorkflowSelected}
//       />
//     </div>
//   );
// }

'use client'

import WorkflowSelector from "../_components/workflow-selector/workflow-selector"
import { getAllBusinesses } from '@/actions/businfo';
import { onUserInfor } from "@/actions/user";
import { useEffect, useState } from 'react';

export default function WorkflowSelectorPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user information
        const userResult = await onUserInfor();
        if (userResult.status === 200 && userResult.data) {
          setUserId(userResult.data.id);
        }

        // Get business information
        const businessResult = await getAllBusinesses();
        if (businessResult.status === 200 && businessResult.data.businesses.length > 0) {
          setBusinessId(businessResult.data.businesses[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWorkflowSelected = (workflow: any) => {
    // Handle workflow selection
    console.log("Selected workflow:", workflow);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!businessId) {
    return <div className="min-h-screen flex items-center justify-center">No business found</div>;
  }

  if (!userId) {
    return <div className="min-h-screen flex items-center justify-center">User not authenticated</div>;
  }

  return (
    <div className="min-h-screen">
      <WorkflowSelector 
        userId={userId}
        businessId={businessId}
        onWorkflowSelected={handleWorkflowSelected}
      />
    </div>
  );
}