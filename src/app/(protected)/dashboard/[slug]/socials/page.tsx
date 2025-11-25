

// import IntegrationsPage from "@/components/global/integrations/integrations-page"
// import { Suspense } from "react"

// export default function Page() {
//   return (
//     <Suspense>
//       <IntegrationsPage />
//     </Suspense>
//   )
// }
import { Suspense } from "react"
import { SocialIntegrationsPage } from "@/components/global/integrations/integrations-page"
import { onUserInfo } from "@/actions/user"
import {
  refreshInstagramData as refreshInstagramDataAction,
  onOAuthInstagram as onOAuthInstagramAction,
} from "@/actions/integrations"
import { deauthorizeInstagram as deauthorizeInstagramAction } from "@/lib/deauth"

function IntegrationsPageSkeleton() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-80 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<IntegrationsPageSkeleton />}>
      <SocialIntegrationsPage
        onUserInfo={onUserInfo}
        onOAuthInstagram={onOAuthInstagramAction}
        onDeauthorize={deauthorizeInstagramAction}
        onRefreshData={refreshInstagramDataAction}
      />
    </Suspense>
  )
}
