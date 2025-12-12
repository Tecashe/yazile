"use client"

import { useState } from "react"
import { useQueryAutomation } from "@/hooks/user-queries"
import ThenNode from "./node"
import Configure from "./configure"

type Props = {
  id: string
}

export default function ThenSection({ id }: Props) {
  const { data, isLoading } = useQueryAutomation(id)
  const hasListener = !!data?.data?.listener

  const [isEditing, setIsEditing] = useState(false)

  console.log("[v0] ThenSection render:", { isLoading, hasListener, isEditing })

  const handleEdit = () => {
    console.log("[v0] handleEdit called!")
    setIsEditing(true)
  }

  const handleSave = () => {
    console.log("[v0] handleSave called!")
    setIsEditing(false)
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!hasListener || isEditing) {
    console.log("[v0] Rendering Configure")
    return <Configure id={id} onSave={handleSave} />
  }

  console.log("[v0] Rendering ThenNode with onEdit:", typeof handleEdit)
  return <ThenNode id={id} onEdit={handleEdit} />
}
