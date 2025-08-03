import type { Metadata } from "next"
import WorkflowSelector from "../_components/workflow-selector/workflow-selector"

export const metadata: Metadata = {
  title: "Workflow Selector | Choose Your Business Automation",
  description:
    "Select the perfect workflow template for your business type and automate your social media responses with AI-powered conversations.",
}

// export default function WorkflowSelectorPage() {
//   return (
//     <div className="min-h-screen">
//       <WorkflowSelector />
//     </div>
//   )
// }


import { getAllBusinesses } from '@/actions/businfo'; // Adjust path
import { useEffect, useState } from 'react';

export default function WorkflowSelectorPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const result = await getAllBusinesses();
        if (result.status === 200 && result.data.businesses.length > 0) {
          // Get the first business ID
          setBusinessId(result.data.businesses[0].id);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
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

  return (
    <div className="min-h-screen">
      <WorkflowSelector 
        businessId={businessId}
        onWorkflowSelected={handleWorkflowSelected}
      />
    </div>
  );
}