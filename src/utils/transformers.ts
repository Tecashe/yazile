export interface VoiceflowResponse {
  text?: string
  quickReplies?: Array<{ name: string; payload: string }>
  buttons?: Array<{ name: string; payload: string }>
  carousel?: Array<{
    title: string
    subtitle?: string
    imageUrl?: string
    buttons?: Array<{ name: string; payload: string; url?: string }>
  }>
  attachment?: any
}

export interface InstagramMessage {
  text: string
  quickReplies?: Array<{
    content_type: "text"
    title: string
    payload: string
  }>
  buttons?: Array<{
    type: "web_url" | "postback"
    title: string
    url?: string
    payload?: string
  }>
  carousel?: Array<{
    title: string
    subtitle?: string
    image_url?: string
    buttons?: Array<{
      type: "web_url" | "postback"
      title: string
      url?: string
      payload?: string
    }>
  }>
  attachment?: any
}

export function transformVoiceflowToInstagram(voiceflowResponse: VoiceflowResponse): InstagramMessage {
  const result: InstagramMessage = {
    text: voiceflowResponse.text || "",
  }

  // Transform quick replies
  if (voiceflowResponse.quickReplies && voiceflowResponse.quickReplies.length > 0) {
    result.quickReplies = voiceflowResponse.quickReplies.slice(0, 13).map((reply) => ({
      content_type: "text" as const,
      title: String(reply.name || "").substring(0, 20) || "Option",
      payload: String(reply.payload || reply.name || "").substring(0, 1000),
    }))
  }

  // Transform buttons for button template
  if (voiceflowResponse.buttons && voiceflowResponse.buttons.length > 0) {
    result.buttons = voiceflowResponse.buttons.slice(0, 3).map((button) => ({
      type: "postback" as const,
      title: String(button.name || "").substring(0, 20) || "Button",
      payload: String(button.payload || button.name || "").substring(0, 1000),
    }))
  }

  // Transform carousel
  if (voiceflowResponse.carousel && voiceflowResponse.carousel.length > 0) {
    result.carousel = voiceflowResponse.carousel.slice(0, 10).map((card) => {
      const element: any = {
        title: String(card.title || "").substring(0, 80) || "Card",
        subtitle: card.subtitle ? String(card.subtitle).substring(0, 80) : undefined,
        image_url: card.imageUrl || undefined,
      }

      if (card.buttons && card.buttons.length > 0) {
        element.buttons = card.buttons.slice(0, 3).map((button) => ({
          type: button.url ? ("web_url" as const) : ("postback" as const),
          title: String(button.name || "").substring(0, 20) || "Button",
          url: button.url,
          payload: button.url ? undefined : String(button.payload || button.name || "").substring(0, 1000),
        }))
      }

      return element
    })
  }

  return result
}
