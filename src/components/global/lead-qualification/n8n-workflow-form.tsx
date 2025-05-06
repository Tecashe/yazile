"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  workflowId: z.string().min(1, {
    message: "Workflow ID is required.",
  }),
  workflowType: z.enum(["LEAD_QUALIFICATION", "LEAD_NURTURING", "CRM_SYNC", "NOTIFICATION", "CUSTOM"]),
  triggerUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  webhookUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
})

interface N8nWorkflowFormProps {
  connectionId: string
}

export function N8nWorkflowForm({ connectionId }: N8nWorkflowFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      workflowId: "",
      workflowType: "LEAD_QUALIFICATION",
      triggerUrl: "",
      webhookUrl: "",
      isActive: true,
    },
  })

  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/n8n/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          connectionId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create workflow")
      }

      toast({
        title: "Workflow created",
        description: "Your n8n workflow has been created successfully.",
      })

      router.push(`/dashboard/${slug}/connections/${connectionId}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add n8n Workflow</CardTitle>
        <CardDescription>Configure a workflow from your n8n instance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lead Qualification Workflow" {...field} />
                  </FormControl>
                  <FormDescription>A friendly name to identify this workflow.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="This workflow processes qualified leads..." {...field} />
                  </FormControl>
                  <FormDescription>Optional description of what this workflow does.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workflowId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow ID</FormLabel>
                  <FormControl>
                    <Input placeholder="123e4567-e89b-12d3-a456-426614174000" {...field} />
                  </FormControl>
                  <FormDescription>
                    The ID of your workflow in n8n. You can find this in the workflow settings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workflowType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workflow type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LEAD_QUALIFICATION">Lead Qualification</SelectItem>
                      <SelectItem value="LEAD_NURTURING">Lead Nurturing</SelectItem>
                      <SelectItem value="CRM_SYNC">CRM Sync</SelectItem>
                      <SelectItem value="NOTIFICATION">Notification</SelectItem>
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The type of workflow determines how it will be used in the system.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="triggerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://n8n.yourdomain.com/webhook/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The webhook URL to trigger this workflow. This is the URL of the webhook node in your n8n workflow.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Callback Webhook URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourdomain.com/api/webhook/n8n" {...field} />
                  </FormControl>
                  <FormDescription>
                    If your workflow needs to send data back to your application, use this URL in your n8n workflow.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>Enable or disable this workflow.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workflow"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
