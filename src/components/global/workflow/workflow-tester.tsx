"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react"
import { testWorkflow, validateWorkflow, type TestResult } from "@/actions/workflows/test-actions"
import { useWorkflowStore } from "@/lib/workflow-store"

export function WorkflowTester() {
  const { nodes, connections } = useWorkflowStore()
  const [testMessage, setTestMessage] = useState("Hello, this is a test message")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)

  const handleValidateWorkflow = async () => {
    setIsLoading(true)
    try {
      const result = await validateWorkflow(nodes, connections)
      setValidationResult(result)
    } catch (error) {
      console.error("Validation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestWorkflow = async () => {
    setIsLoading(true)
    try {
      const result = await testWorkflow({
        nodes,
        connections,
        testMessage,
        userId: "test_user", // In real app, get from auth
      })
      setTestResult(result)
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Workflow Testing
          </CardTitle>
          <CardDescription>Test your workflow with sample messages to see how it responds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-message">Test Message</Label>
            <Input
              id="test-message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a test message..."
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleValidateWorkflow} variant="outline" disabled={isLoading}>
              Validate Workflow
            </Button>
            <Button onClick={handleTestWorkflow} disabled={isLoading || nodes.length === 0}>
              {isLoading ? "Testing..." : "Test Workflow"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validationResult.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2">Errors</h4>
                <ul className="space-y-1">
                  {validationResult.errors.map((error: string, index: number) => (
                    <li key={index} className="text-sm text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-600 mb-2">Warnings</h4>
                <ul className="space-y-1">
                  {validationResult.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-600 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.isValid &&
              validationResult.errors.length === 0 &&
              validationResult.warnings.length === 0 && (
                <div className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Workflow is valid and ready to use!
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Test Results
            </CardTitle>
            <CardDescription>Execution time: {testResult.executionTime}ms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResult.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{testResult.error}</p>
              </div>
            )}

            {testResult.responses.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Generated Responses ({testResult.responses.length})
                </h4>
                <div className="space-y-3">
                  {testResult.responses.map((response, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{response.type}</Badge>
                        </div>

                        {response.text && <p className="text-sm mb-2">{response.text}</p>}

                        {response.buttons && response.buttons.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">Buttons:</p>
                            {response.buttons.map((button: any, btnIndex: number) => (
                              <Badge key={btnIndex} variant="outline" className="mr-1">
                                {button.title}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {response.attachment && (
                          <div className="text-xs text-gray-600">
                            Attachment: {response.attachment.type} - {response.attachment.url}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {testResult.success && testResult.responses.length === 0 && (
              <div className="text-gray-600 text-sm">Workflow executed successfully but generated no responses.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
