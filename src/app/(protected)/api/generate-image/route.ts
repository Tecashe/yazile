
// import { NextResponse } from "next/server"
// import axios from "axios"

// const MAX_RETRIES = 3
// const INITIAL_RETRY_DELAY = 1000

// async function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// async function retryRequest<T>(requestFunction: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
//   let lastError: Error | null = null

//   for (let i = 0; i < retries; i++) {
//     try {
//       return await requestFunction()
//     } catch (error) {
//       console.error(`Request failed (attempt ${i + 1}):`, error)
//       lastError = error as Error
//       await delay(INITIAL_RETRY_DELAY * Math.pow(2, i))
//     }
//   }

//   throw lastError || new Error("All retries failed")
// }

// async function generateImage(prompt: string): Promise<string> {
//   // Using Lorem Picsum for random images
//   const width = 1024
//   const height = 1024
//   const imageId = Math.floor(Math.random() * 1000) // Random image ID
//   return `https://picsum.photos/seed/${imageId}/${width}/${height}`
// }

// async function generateCaption(prompt: string): Promise<string> {
//   const response = await retryRequest(() =>
//     axios.post(
//       "https://api-inference.huggingface.co/models/gpt2",
//       {
//         inputs: `Create an Instagram caption for: ${prompt}\nMake it engaging and include relevant hashtags.\nKeep it under 150 characters.\n\nCaption:`,
//         parameters: {
//           max_length: 150,
//           temperature: 0.7,
//           top_p: 0.9,
//           return_full_text: false,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//         },
//       },
//     ),
//   )

//   let caption = response.data[0]?.generated_text || ""

//   // Add hashtags if none present
//   if (!caption.includes("#")) {
//     const promptWords = prompt.toLowerCase().split(" ")
//     const hashtags = promptWords
//       .filter((word) => word.length > 2)
//       .map((word) => `#${word.replace(/[^a-z0-9]/g, "")}`)
//       .slice(0, 3)
//       .join(" ")
//     caption = `${caption.trim()} ${hashtags} #photography #instagood`
//   }

//   return caption
// }

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json()
//     const cleanPrompt = prompt.replace(/--style \w+/, "").trim()

//     // Generate image and caption
//     const [imageUrl, caption] = await Promise.all([generateImage(prompt), generateCaption(cleanPrompt)])

//     return NextResponse.json({
//       imageUrl,
//       caption,
//       modelUsed: {
//         image: "Lorem Picsum",
//         caption: "Hugging Face GPT-2",
//       },
//     })
//   } catch (error) {
//     console.error("Error generating content:", error)

//     let errorMessage = "Failed to generate content. Please try again."
//     if (error instanceof Error) {
//       if (error.message.includes("429")) {
//         errorMessage = "Services are busy. Please wait a moment and try again."
//       } else if (error.message.includes("All retries failed")) {
//         errorMessage = "Failed to generate content after multiple attempts. Please try again later."
//       }
//     }

//     return NextResponse.json({ error: errorMessage }, { status: 500 })
//   }
// }

// import { NextResponse } from "next/server"
// import axios from "axios"

// const MAX_RETRIES = 3
// const INITIAL_RETRY_DELAY = 1000

// async function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// async function retryRequest<T>(requestFunction: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
//   let lastError: Error | null = null

//   for (let i = 0; i < retries; i++) {
//     try {
//       return await requestFunction()
//     } catch (error) {
//       console.error(`Request failed (attempt ${i + 1}):`, error)
//       lastError = error as Error
//       await delay(INITIAL_RETRY_DELAY * Math.pow(2, i))
//     }
//   }

//   throw lastError || new Error("All retries failed")
// }

// async function generateImageWithStability(prompt: string): Promise<{ url: string; success: boolean }> {
//   try {
//     const response = await retryRequest(() =>
//       axios.post(
//         "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
//         {
//           text_prompts: [
//             {
//               text: prompt,
//               weight: 1,
//             },
//           ],
//           cfg_scale: 7,
//           height: 1024,
//           width: 1024,
//           samples: 1,
//           steps: 30,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
//           },
//         },
//       ),
//     )

//     // API returns base64 encoded images - we take the first one
//     const generatedImage = response.data.artifacts[0]
    
//     // In a real implementation, you'd likely want to save this image to your storage 
//     // and return a URL. For demo purposes, let's assume we have a function to do that.
//     const imageUrl = await saveBase64ImageAndGetUrl(generatedImage.base64)
    
//     return { url: imageUrl, success: true }
//   } catch (error) {
//     console.error("Stability AI generation failed:", error)
//     return { url: "", success: false }
//   }
// }

// // This is a placeholder function. In a real implementation, you would:
// // 1. Decode the base64 string
// // 2. Save it to a storage provider (S3, Azure Blob, etc.)
// // 3. Return the public URL
// async function saveBase64ImageAndGetUrl(base64String: string): Promise<string> {
//   // Implementation would depend on your storage solution
//   // For demonstration purposes:
//   return "https://your-storage-url.com/generated-image.png"
// }

// async function generateImageWithPicsum(prompt: string): Promise<string> {
//   // Using Lorem Picsum for random images as fallback
//   const width = 1024
//   const height = 1024
//   const imageId = Math.floor(Math.random() * 1000) // Random image ID
//   return `https://picsum.photos/seed/${imageId}/${width}/${height}`
// }

// async function generateImage(prompt: string): Promise<{ url: string; provider: string }> {
//   // First try with Stability AI
//   const stabilityResult = await generateImageWithStability(prompt)
  
//   if (stabilityResult.success) {
//     return { url: stabilityResult.url, provider: "Stability AI" }
//   }
  
//   // Fall back to Lorem Picsum if Stability fails
//   const picsumUrl = await generateImageWithPicsum(prompt)
//   return { url: picsumUrl, provider: "Lorem Picsum" }
// }

// async function generateCaption(prompt: string): Promise<string> {
//   const response = await retryRequest(() =>
//     axios.post(
//       "https://api-inference.huggingface.co/models/gpt2",
//       {
//         inputs: `Create an Instagram caption for: ${prompt}\nMake it engaging and include relevant hashtags.\nKeep it under 150 characters.\n\nCaption:`,
//         parameters: {
//           max_length: 150,
//           temperature: 0.7,
//           top_p: 0.9,
//           return_full_text: false,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//         },
//       },
//     ),
//   )

//   let caption = response.data[0]?.generated_text || ""

//   // Add hashtags if none present
//   if (!caption.includes("#")) {
//     const promptWords = prompt.toLowerCase().split(" ")
//     const hashtags = promptWords
//       .filter((word) => word.length > 2)
//       .map((word) => `#${word.replace(/[^a-z0-9]/g, "")}`)
//       .slice(0, 3)
//       .join(" ")
//     caption = `${caption.trim()} ${hashtags} #photography #instagood`
//   }

//   return caption
// }

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json()
//     const cleanPrompt = prompt.replace(/--style \w+/, "").trim()

//     // Generate image and caption
//     const [imageResult, caption] = await Promise.all([
//       generateImage(prompt), 
//       generateCaption(cleanPrompt)
//     ])

//     return NextResponse.json({
//       imageUrl: imageResult.url,
//       caption,
//       modelUsed: {
//         image: imageResult.provider,
//         caption: "Hugging Face GPT-2",
//       },
//     })
//   } catch (error) {
//     console.error("Error generating content:", error)

//     let errorMessage = "Failed to generate content. Please try again."
//     if (error instanceof Error) {
//       if (error.message.includes("429")) {
//         errorMessage = "Services are busy. Please wait a moment and try again."
//       } else if (error.message.includes("All retries failed")) {
//         errorMessage = "Failed to generate content after multiple attempts. Please try again later."
//       }
//     }

//     return NextResponse.json({ error: errorMessage }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import axios from "axios"
import { put } from "@vercel/blob"

const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function retryRequest<T>(requestFunction: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < retries; i++) {
    try {
      return await requestFunction()
    } catch (error) {
      console.error(`Request failed (attempt ${i + 1}):`, error)
      lastError = error as Error
      await delay(INITIAL_RETRY_DELAY * Math.pow(2, i))
    }
  }

  throw lastError || new Error("All retries failed")
}

async function generateImageWithStability(prompt: string): Promise<{ url: string; success: boolean }> {
  try {
    const response = await retryRequest(() =>
      axios.post(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          },
        },
      ),
    )

    // API returns base64 encoded images
    const generatedImage = response.data.artifacts[0]
    
    // Upload to Vercel Blob
    const base64Data = generatedImage.base64
    const binaryData = Buffer.from(base64Data, 'base64')
    
    // Create a unique filename
    const timestamp = new Date().getTime()
    const filename = `stability-${timestamp}.png`
    
    // Upload to Vercel Blob
    const blob = await put(filename, binaryData, {
      access: "public",
      contentType: "image/png",
    })
    
    return { url: blob.url, success: true }
  } catch (error) {
    console.error("Stability AI generation failed:", error)
    return { url: "", success: false }
  }
}

async function generateImageWithPicsum(prompt: string): Promise<string> {
  // Using Lorem Picsum for random images as fallback
  const width = 1024
  const height = 1024
  const imageId = Math.floor(Math.random() * 1000) // Random image ID
  return `https://picsum.photos/seed/${imageId}/${width}/${height}`
}

async function generateImage(prompt: string): Promise<{ url: string; provider: string }> {
  // First try with Stability AI
  const stabilityResult = await generateImageWithStability(prompt)
  
  if (stabilityResult.success) {
    return { url: stabilityResult.url, provider: "Stability AI" }
  }
  
  // Fall back to Lorem Picsum if Stability fails
  const picsumUrl = await generateImageWithPicsum(prompt)
  return { url: picsumUrl, provider: "Lorem Picsum" }
}

async function generateCaption(prompt: string): Promise<string> {
  const response = await retryRequest(() =>
    axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        inputs: `Create an Instagram caption for: ${prompt}\nMake it engaging and include relevant hashtags.\nKeep it under 150 characters.\n\nCaption:`,
        parameters: {
          max_length: 150,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      },
    ),
  )

  let caption = response.data[0]?.generated_text || ""

  // Add hashtags if none present
  if (!caption.includes("#")) {
    const promptWords = prompt.toLowerCase().split(" ")
    const hashtags = promptWords
      .filter((word) => word.length > 2)
      .map((word) => `#${word.replace(/[^a-z0-9]/g, "")}`)
      .slice(0, 3)
      .join(" ")
    caption = `${caption.trim()} ${hashtags} #photography #instagood`
  }

  return caption
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const cleanPrompt = prompt.replace(/--style \w+/, "").trim()

    // Generate image and caption
    const [imageResult, caption] = await Promise.all([
      generateImage(prompt), 
      generateCaption(cleanPrompt)
    ])

    return NextResponse.json({
      imageUrl: imageResult.url,
      caption,
      modelUsed: {
        image: imageResult.provider,
        caption: "Hugging Face GPT-2",
      },
    })
  } catch (error) {
    console.error("Error generating content:", error)

    let errorMessage = "Failed to generate content. Please try again."
    if (error instanceof Error) {
      if (error.message.includes("429")) {
        errorMessage = "Services are busy. Please wait a moment and try again."
      } else if (error.message.includes("All retries failed")) {
        errorMessage = "Failed to generate content after multiple attempts. Please try again later."
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}