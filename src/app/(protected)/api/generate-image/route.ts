
import { NextResponse } from "next/server"
import axios from "axios"

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

async function generateImage(prompt: string): Promise<string> {
  // Using Lorem Picsum for random images
  const width = 1024
  const height = 1024
  const imageId = Math.floor(Math.random() * 1000) // Random image ID
  return `https://picsum.photos/seed/${imageId}/${width}/${height}`
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
    const [imageUrl, caption] = await Promise.all([generateImage(prompt), generateCaption(cleanPrompt)])

    return NextResponse.json({
      imageUrl,
      caption,
      modelUsed: {
        image: "Lorem Picsum",
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

