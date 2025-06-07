"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Phone, Smartphone } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Mock verification service
const sendVerificationCode = async (phoneNumber: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true, code: "123456" }
}

interface PhoneVerificationProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  onVerified: (verified: boolean) => void
}

export default function PhoneVerification({ formData, updateFormData, onVerified }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber || "")
  const [verificationCode, setVerificationCode] = useState("")
  const [expectedCode, setExpectedCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStep, setVerificationStep] = useState<"input" | "verify">("input")
  const [isVerified, setIsVerified] = useState(false)

  const handleVerifyPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      // Call the verification service
      const result = await sendVerificationCode(phoneNumber)

      if (result.success) {
        setExpectedCode(result.code)
        setVerificationStep("verify")
        updateFormData("phoneNumber", phoneNumber)

        toast({
          title: "Verification Code Sent",
          description: `We've sent a code to ${phoneNumber}. For demo purposes, the code is: ${result.code}`,
        })
      } else {
        toast({
          title: "Verification Failed",
          description: "Could not send verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not send verification code",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCheckVerificationCode = async () => {
    if (!verificationCode) {
      toast({
        title: "Missing Code",
        description: "Please enter the verification code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      // For demo purposes, we'll check against the expected code directly
      const isValid = verificationCode === expectedCode

      if (isValid) {
        setIsVerified(true)
        updateFormData("phoneVerified", true)

        toast({
          title: "Phone Verified",
          description: "Your phone number has been verified successfully!",
        })

        onVerified(true)
      } else {
        toast({
          title: "Invalid Code",
          description: "The code you entered is incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify code",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Phone Verification</h2>
          <p className="text-muted-foreground">
            {verificationStep === "input"
              ? "Add and verify your phone number"
              : "Enter the verification code sent to your phone"}
          </p>
        </div>

        <div className="space-y-6">
          {verificationStep === "input" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <Button onClick={handleVerifyPhone} className="w-full" disabled={!phoneNumber || isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Verification Code
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 text-center text-xl tracking-widest"
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  For demo purposes, the code is: <span className="font-mono font-bold">{expectedCode}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setVerificationStep("input")}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCheckVerificationCode}
                  className="flex-1"
                  disabled={!verificationCode || verificationCode.length < 6 || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
