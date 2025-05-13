"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface TemplateDescriptionModalProps {
  title: string
  description: string
}

export function TemplateDescriptionModal({ title, description }: TemplateDescriptionModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary"
        onClick={() => setOpen(true)}
      >
        <Info className="h-3 w-3" />
        <span className="sr-only">View full description</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
