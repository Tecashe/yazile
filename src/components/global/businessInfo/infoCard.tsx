
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateBusinessInfo } from '@/actions/businfo'
import { useToast } from "@/hooks/use-toast"
import { FormSchema } from './businessInfo'
import { Edit, Save, X, Sparkles } from 'lucide-react'

interface BusinessInfoProps {
  business: FormSchema
}

const editableFields = [
  'businessName',
  'businessType',
  'targetAudience',
  'website',
  'businessDescription',
  'industry',
  'instagramHandle',
  'welcomeMessage',
  'responseLanguage',
  'businessHours',
  'promotionMessage',
  'autoReplyEnabled'
]

const businessTypes = ['Retail', 'Service', 'Manufacturing', 'Tech']
const industries = ['Fashion', 'Food', 'Technology', 'Healthcare']
const languages = ['English', 'Spanish', 'French', 'German']

function BusinessInfo({ business }: BusinessInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBusiness, setEditedBusiness] = useState<FormSchema>(business)
  const { toast } = useToast()

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedBusiness(business)
  }

  const handleSave = async () => {
    try {
      if (business.id) {
        const result = await updateBusinessInfo(business.id, editedBusiness)
        if (result.status === 200) {
          setIsEditing(false)
          toast({
            title: "Success",
            description: "Business information updated successfully!",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to update business information.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Business ID is missing.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating business:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating business information.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (name: string, value: string | boolean) => {
    setEditedBusiness(prev => ({ ...prev, [name]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 bg-gray-900 rounded-lg shadow-xl"
    >
      <Card className="bg-gray-800 text-gray-100 border-gray-700">
        <CardHeader className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-50"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <CardTitle className="text-2xl font-bold relative z-10 flex items-center justify-between">
            <span className="flex items-center">
              <Sparkles className="inline-block mr-2 text-yellow-400" />
              {business.businessName}
            </span>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600">
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <div className="space-x-2">
                <Button onClick={handleSave} variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600">
                  <Save className="h-4 w-4" />
                </Button>
                <Button onClick={handleCancel} variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {editableFields.map((key) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor={key} className="text-sm font-medium text-gray-400">{key}</Label>
                {isEditing ? (
                  key === 'businessType' || key === 'industry' || key === 'responseLanguage' ? (
                    <Select
                      value={editedBusiness[key as keyof FormSchema] as string}
                      onValueChange={(value) => handleChange(key, value)}
                    >
                      <SelectTrigger className="w-full mt-1 bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder={`Select ${key}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        {(key === 'businessType' ? businessTypes :
                          key === 'industry' ? industries :
                          languages).map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : key === 'businessDescription' || key === 'targetAudience' || key === 'website' || key === 'welcomeMessage' || key === 'promotionMessage' ? (
                    <Textarea
                      id={key}
                      value={editedBusiness[key as keyof FormSchema] as string}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="mt-1 bg-gray-700 text-white border-gray-600"
                    />
                  ) : key === 'autoReplyEnabled' ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Label htmlFor={key} className="text-gray-300">Auto Reply {editedBusiness[key as keyof FormSchema] ? 'Enabled' : 'Disabled'}</Label>
                    </div>
                  ) : (
                    <Input
                      id={key}
                      value={editedBusiness[key as keyof FormSchema] as string}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="mt-1 bg-gray-700 text-white border-gray-600"
                    />
                  )
                ) : (
                  <p className="mt-1 text-lg">
                   yes
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BusinessInfo