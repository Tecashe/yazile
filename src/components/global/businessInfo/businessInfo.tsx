'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createNewBusiness } from '@/actions/businfo'
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from 'lucide-react'

export const FormSchema = z.object({
  id: z.string().optional(),
  businessName: z.string().min(1, { message: 'Business name is required' }),
  website: z.string().min(1, { message: 'Website url required' }),
  targetAudience: z.string().min(1, { message: 'target audience required' }),
  businessType: z.string().min(1, { message: 'Business type is required' }),
  businessDescription: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  industry: z.string().min(1, { message: 'Industry is required' }),
  instagramHandle: z.string().min(1, { message: 'Instagram handle is required' }),
  welcomeMessage: z.string().min(1, { message: 'Welcome message is required' }),
  responseLanguage: z.string().min(1, { message: 'Response language is required' }),
  businessHours: z.string().min(1, { message: 'Business hours are required' }),
  promotionMessage: z.string().min(1, { message: 'Promotion message is required' }),
  autoReplyEnabled: z.boolean().default(false),
})

export type FormSchema = z.infer<typeof FormSchema>

interface BusinessFormProps {
  onBusinessCreated: (newBusiness: FormSchema) => void
}

const businessTypes = ['Retail', 'Service', 'Manufacturing', 'Tech']
const industries = ['Fashion', 'Food', 'Technology', 'Healthcare']
const languages = ['English', 'Spanish', 'French', 'German']

function BusinessForm({ onBusinessCreated }: BusinessFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      autoReplyEnabled: false,
    },
  })
  const { toast } = useToast()

  const formSteps = [
    ['businessName', 'businessType', 'industry'],
    ['businessDescription', 'instagramHandle'],
    ['welcomeMessage', 'responseLanguage', 'businessHours'],
    ['promotionMessage', 'autoReplyEnabled'],
    ['targetAudience', 'website'],
  ]

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await createNewBusiness(data)
      if (result.status === 200 && result.res) {
        toast({
          title: "Success",
          description: "Business information submitted successfully!",
        })
        onBusinessCreated(data)
      } else {
        setError(result.data || 'An unknown error occurred')
        toast({
          title: "Error",
          description: result.data || "Failed to submit business information. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating business:', error)
      setError('An unexpected error occurred')
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / formSteps.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-gray-100 shadow-xl overflow-hidden">
      <CardHeader className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <CardTitle className="text-3xl font-bold text-center relative z-10 py-4">
          <Sparkles className="inline-block mr-2 text-yellow-400" />
          Create Your Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {formSteps[currentStep].map((field) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <Label htmlFor={field} className="text-gray-300">{field}</Label>
                  <Controller
                    name={field as keyof FormSchema}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      if (field === 'businessType' || field === 'industry' || field === 'responseLanguage') {
                        return (
                          <Select onValueChange={onChange} value={value as string}>
                            <SelectTrigger className="mt-1 bg-gray-800 text-white border-gray-700">
                              <SelectValue placeholder={`Select ${field}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-700">
                              {(field === 'businessType' ? businessTypes :
                                field === 'industry' ? industries :
                                languages).map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )
                      } else if (field === 'businessDescription' || field === 'website' || field === 'targetAudience' || field === 'welcomeMessage' || field === 'promotionMessage') {
                        return (
                          <Textarea
                            id={field}
                            value={value as string}
                            onChange={onChange}
                            className="mt-1 bg-gray-800 text-white border-gray-700"
                            placeholder={`Enter your ${field}`}
                          />
                        )
                      } else if (field === 'autoReplyEnabled') {
                        return (
                          <div className="flex items-center space-x-2 mt-1">
                            <Switch
                              id={field}
                              checked={value as boolean}
                              onCheckedChange={onChange}
                            />
                            <Label htmlFor={field} className="text-gray-300">Enable Auto Reply</Label>
                          </div>
                        )
                      } else {
                        return (
                          <Input
                            id={field}
                            value={value as string}
                            onChange={onChange}
                            className="mt-1 bg-gray-800 text-white border-gray-700"
                            placeholder={`Enter your ${field}`}
                          />
                        )
                      }
                    }}
                  />
                  {errors[field as keyof FormSchema] && (
                    <p className="text-red-400 text-sm mt-1">{errors[field as keyof FormSchema]?.message}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Previous
            </Button>
            {currentStep < formSteps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Creating...' : 'Create Business Profile'}
              </Button>
            )}
          </div>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default BusinessForm

