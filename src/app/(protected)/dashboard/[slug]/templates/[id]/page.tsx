import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user" 
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

import { TemplateDetail } from "@/components/global/n8n/n8n/template-detail"

interface TemplateDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TemplateDetailPageProps): Promise<Metadata> {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    return {
      title: "Template | n8n Integration Platform",
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/templates/${params.id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.data.id}`,
      },
    })

    if (!response.ok) {
      return {
        title: "Template | n8n Integration Platform",
      }
    }

    const template = await response.json()

    return {
      title: `${template.name} | n8n Integration Platform`,
      description: template.description,
    }
  } catch (error) {
    return {
      title: "Template | n8n Integration Platform",
    }
  }
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id } = params

  // Verify the template exists
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/templates/${id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.data.id}`,
      },
    })

    if (!response.ok) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  return (
    <div>
      <TemplateDetail templateId={id} />
    </div>
  )
}
