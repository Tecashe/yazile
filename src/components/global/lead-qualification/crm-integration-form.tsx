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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  provider: z.enum(["HUBSPOT", "SALESFORCE", "ZOHO", "PIPEDRIVE", "AIRTABLE", "NOTION", "CUSTOM"]),
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
  apiSecret: z.string().optional(),
  baseUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
})

export function CrmIntegrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>("HUBSPOT")
  
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""
    

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      provider: "HUBSPOT",
      apiKey: "",
      apiSecret: "",
      baseUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/crm/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create integration")
      }

      toast({
        title: "Integration created",
        description: "Your CRM integration has been created successfully.",
      })


      router.push(`/dashboard/${slug}/connections/crm`)
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

  // Update form fields based on selected provider
  const handleProviderChange = (value: string) => {
    setSelectedProvider(value)
    form.setValue("provider", value as any)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect to CRM</CardTitle>
        <CardDescription>Connect your CRM to sync qualified leads automatically.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My HubSpot Account" {...field} />
                  </FormControl>
                  <FormDescription>A friendly name to identify this integration.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRM Provider</FormLabel>
                  <Select onValueChange={handleProviderChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a CRM provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HUBSPOT">HubSpot</SelectItem>
                      <SelectItem value="SALESFORCE">Salesforce</SelectItem>
                      <SelectItem value="ZOHO">Zoho CRM</SelectItem>
                      <SelectItem value="PIPEDRIVE">Pipedrive</SelectItem>
                      <SelectItem value="AIRTABLE">Airtable</SelectItem>
                      <SelectItem value="NOTION">Notion</SelectItem>
                      <SelectItem value="CUSTOM">Custom CRM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your CRM provider.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {selectedProvider === "HUBSPOT" && "API Key"}
                    {selectedProvider === "SALESFORCE" && "Access Token"}
                    {selectedProvider === "ZOHO" && "API Key"}
                    {selectedProvider === "PIPEDRIVE" && "API Token"}
                    {selectedProvider === "AIRTABLE" && "API Key"}
                    {selectedProvider === "NOTION" && "Integration Token"}
                    {selectedProvider === "CUSTOM" && "API Key"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    {selectedProvider === "HUBSPOT" && "Your HubSpot API key."}
                    {selectedProvider === "SALESFORCE" && "Your Salesforce access token."}
                    {selectedProvider === "ZOHO" && "Your Zoho CRM API key."}
                    {selectedProvider === "PIPEDRIVE" && "Your Pipedrive API token."}
                    {selectedProvider === "AIRTABLE" && "Your Airtable API key."}
                    {selectedProvider === "NOTION" && "Your Notion integration token."}
                    {selectedProvider === "CUSTOM" && "Your API key for authentication."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(selectedProvider === "SALESFORCE" || selectedProvider === "ZOHO" || selectedProvider === "CUSTOM") && (
              <FormField
                control={form.control}
                name="apiSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedProvider === "SALESFORCE" && "Client Secret"}
                      {selectedProvider === "ZOHO" && "API Secret"}
                      {selectedProvider === "CUSTOM" && "API Secret"}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      {selectedProvider === "SALESFORCE" && "Your Salesforce client secret."}
                      {selectedProvider === "ZOHO" && "Your Zoho CRM API secret."}
                      {selectedProvider === "CUSTOM" && "Your API secret for authentication."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {(selectedProvider === "ZOHO" || selectedProvider === "AIRTABLE" || selectedProvider === "CUSTOM") && (
              <FormField
                control={form.control}
                name="baseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedProvider === "ZOHO" && "API Domain"}
                      {selectedProvider === "AIRTABLE" && "Base ID"}
                      {selectedProvider === "CUSTOM" && "API Base URL"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          selectedProvider === "ZOHO"
                            ? "https://www.zohoapis.com"
                            : selectedProvider === "AIRTABLE"
                              ? "appXXXXXXXXXXXXXX"
                              : "https://api.example.com"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {selectedProvider === "ZOHO" && "Your Zoho CRM API domain."}
                      {selectedProvider === "AIRTABLE" && "Your Airtable base ID."}
                      {selectedProvider === "CUSTOM" && "The base URL for your API."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
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
