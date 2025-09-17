"use client"

import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import Loader from "../loader"
import { useCreateAutomation } from "@/hooks/use-automations"
import { v4 } from "uuid"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, PlusCircle, Zap } from "lucide-react"

const CreateAutomation = () => {
  const mutationId = useMemo(() => v4(), [])
  const router = useRouter()
  const pathname = usePathname()
  const [showSuccess, setShowSuccess] = useState(false)

  const { isPending, mutate } = useCreateAutomation(mutationId)

  const handleCreateAutomation = () => {
    const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
    const slug = slugMatch ? slugMatch[1] : ""

    // Create a unique ID for this automation
    const newAutomationId = `temp-${Date.now()}`

    mutate(
      {
        name: "Untitled",
        id: newAutomationId,
        // createdAt: new Date().toISOString(),
        keywords: [],
        // Add any other required fields for your automation
        active: false,
        listener: null,
      },
      {
        onSuccess: (data: any) => {
          // Show success animation
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 2000)

          // Optional: Navigate to the new automation if you have the real ID
          if (data?.data?.id) {
            //Uncomment if you want to navigate to the new automation
            setTimeout(() => {
              router.push(`/dashboard/${slug}/automations/${data.data.id}`)
            }, 1000)
          }
        },
        // onError: (error) => {
        //   console.error("Failed to create automation:", error)
        //   // The error toast is already handled in the hook
        // },
      },
    )
  }

  const particles = useMemo(() => Array.from({ length: 20 }), [])

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
        onClick={handleCreateAutomation}
        disabled={isPending || showSuccess}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="bg-green-500 rounded-full p-2"
              >
                <Check className="text-white" size={24} />
              </motion.div>
              {particles.map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    opacity: 0,
                    scale: Math.random() * 3 + 1,
                  }}
                  transition={{ duration: 1, delay: index * 0.02 }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="button-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <Loader state={isPending}>
                <PlusCircle />
                <span className="lg:inline hidden">Create Automation</span>
              </Loader>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

export default CreateAutomation