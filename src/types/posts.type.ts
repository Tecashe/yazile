// export type InstagramPostProps = {
//   id: string
//   media_type: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
//   media_url: string
//   timestamp: Date
//   caption?: string
// }

export type InstagramPostProps = {
  id: string
  caption?: string
  media_url: string
  media_type: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
  timestamp?: string
  thumbnail_url?: string  // Add this
  children?: {            // Add this
    data: Array<{
      id: string
      media_url: string
      media_type: string
      thumbnail_url?: string
    }>
  }
}