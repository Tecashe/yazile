"use client"

import React from "react"

import { SidebarTrigger } from "@/components/ui/sidebars"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

type Props = {
  slug: string
}

const Navbar = ({ slug }: Props) => {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs = pathSegments.slice(2) // Remove 'dashboard' and slug

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={`/dashboard/${slug}`}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((segment, index) => (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="capitalize">{segment.replace("-", " ")}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/dashboard/${slug}/${breadcrumbs.slice(0, index + 1).join("/")}`}
                    className="capitalize"
                  >
                    {segment.replace("-", " ")}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export default Navbar
