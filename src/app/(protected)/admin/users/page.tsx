// import { UsersTable } from "./users-table"

// export default function UsersPage() {
//   return (
//     <div className="container p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
//         <p className="text-muted-foreground">View and manage all users on the platform.</p>
//       </div>

//       <UsersTable />
//     </div>
//   )
// }

// import { getAllUsers } from "../actions"
// import { UsersTable } from "./users-table"
// import { Suspense } from "react"
// import { Skeleton } from "@/components/ui/skeleton"

// interface UsersPageProps {
//   searchParams: {
//     page?: string
//     search?: string
//   }
// }

// export default async function UsersPage({ searchParams }: UsersPageProps) {
//   const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
//   const search = searchParams.search || ""

//   return (
//     <div className="container mx-auto py-6">
//       <Suspense fallback={<UsersTableSkeleton />}>
//         <UsersTableWrapper page={page} search={search} />
//       </Suspense>
//     </div>
//   )
// }

// async function UsersTableWrapper({ page, search }: { page: number; search: string }) {
//   const { users, totalCount, totalPages } = await getAllUsers(page, 10, search)

//   return (
//     <UsersTable
//       initialUsers={users}
//       totalPages={totalPages}
//       currentPage={page}
//       totalUsers={totalCount}
//       searchQuery={search}
//     />
//   )
// }

// function UsersTableSkeleton() {
//   return (
//     <div className="rounded-lg border shadow-sm">
//       <div className="p-6 flex flex-col space-y-4">
//         <Skeleton className="h-8 w-1/3" />
//         <Skeleton className="h-4 w-1/4" />
//         <div className="flex justify-between items-center">
//           <Skeleton className="h-10 w-1/4" />
//           <div className="flex space-x-2">
//             <Skeleton className="h-10 w-[250px]" />
//             <Skeleton className="h-10 w-10" />
//             <Skeleton className="h-10 w-24" />
//             <Skeleton className="h-10 w-24" />
//           </div>
//         </div>
//       </div>
//       <div className="p-6">
//         <Skeleton className="h-[400px] w-full" />
//       </div>
//     </div>
//   )
// }

import { getAllUsers } from "../actions"
import { UsersTable } from "./users-table"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface UsersPageProps {
  searchParams: {
    page?: string
    search?: string
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTableWrapper page={page} search={search} />
      </Suspense>
    </div>
  )
}

async function UsersTableWrapper({ page, search }: { page: number; search: string }) {
  const { users, totalCount, totalPages } = await getAllUsers(page, 10, search)

  // Ensure status is strictly "active" or "inactive"
  const typedUsers = users.map((user) => ({
    ...user,
    status: user.status === "active" ? "active" : ("inactive" as "active" | "inactive"),
  }))

  return (
    <UsersTable
      initialUsers={typedUsers}
      totalPages={totalPages}
      currentPage={page}
      totalUsers={totalCount}
      searchQuery={search}
    />
  )
}

function UsersTableSkeleton() {
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="p-6 flex flex-col space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}
