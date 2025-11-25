
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sparkles, Loader2 } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// interface AIReplyVariationsGeneratorProps {
//   baseReply: string
//   onVariationsGenerated: (variations: string[]) => void
//   disabled?: boolean
// }

// export function AIReplyVariationsGenerator({
//   baseReply,
//   onVariationsGenerated,
//   disabled,
// }: AIReplyVariationsGeneratorProps) {
//   const [isGenerating, setIsGenerating] = useState(false)

//   const handleGenerate = async () => {
//     if (!baseReply.trim()) {
//       toast({
//         title: "Base reply required",
//         description: "Please enter a comment reply text first",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGenerating(true)
//     try {
//       const response = await fetch("/api/generate-reply-variations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ baseReply, count: 8 }),
//       })

//       if (!response.ok) throw new Error("Failed to generate variations")

//       const data = await response.json()
//       onVariationsGenerated(data.variations)
//     } catch (error) {
//       console.error("Error generating variations:", error)
//       toast({
//         title: "Generation failed",
//         description: "Could not generate variations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <Button
//       type="button"
//       onClick={handleGenerate}
//       disabled={isGenerating || !baseReply.trim() || disabled}
//       className="w-full bg-transparent"
//       variant="outline"
//     >
//       {isGenerating ? (
//         <>
//           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//           Generating AI variations...
//         </>
//       ) : (
//         <>
//           <Sparkles className="h-4 w-4 mr-2" />
//           Generate AI Variations
//         </>
//       )}
//     </Button>
//   )
// }
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AIReplyVariationsGeneratorProps {
  baseReply: string
  onVariationsGenerated: (variations: string[]) => void
  disabled?: boolean
}

export function AIReplyVariationsGenerator({
  baseReply,
  onVariationsGenerated,
  disabled,
}: AIReplyVariationsGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!baseReply.trim()) {
      toast({
        title: "Base reply required",
        description: "Please enter a comment reply text first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-reply-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseReply, count: 8 }),
      })

      if (!response.ok) throw new Error("Failed to generate variations")

      const data = await response.json()
      onVariationsGenerated(data.variations)
    } catch (error) {
      console.error("Error generating variations:", error)
      toast({
        title: "Generation failed",
        description: "Could not generate variations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGenerate}
      disabled={isGenerating || !baseReply.trim() || disabled}
      className="w-full h-14 text-base font-semibold bg-transparent hover:bg-purple-500/10 border-2 border-purple-500/30 text-purple-300"
      variant="outline"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
          Generating AI variations...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 mr-3" />
          Generate AI Variations
        </>
      )}
    </Button>
  )
}
