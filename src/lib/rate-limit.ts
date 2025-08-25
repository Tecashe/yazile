//lib/rate-limit.ts - Rate limiting for API calls
import { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function rateLimit(
  request: NextRequest,
  limit: number = 60, // requests per minute
  windowMs: number = 60000 // 1 minute
): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const now = Date.now()
  const key = `${ip}-${Math.floor(now / windowMs)}`
  
  const current = rateLimitMap.get(key) || { count: 0, timestamp: now }
  
  if (now - current.timestamp > windowMs) {
    // Reset the count for new window
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  rateLimitMap.set(key, { count: current.count + 1, timestamp: current.timestamp })
  return true
}

// Clean up old entries periodically - Fixed version
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  // Collect keys to delete first
  rateLimitMap.forEach((value, key) => {
    if (now - value.timestamp > 60000) {
      keysToDelete.push(key)
    }
  })
  
  // Delete the collected keys
  keysToDelete.forEach(key => {
    rateLimitMap.delete(key)
  })
}, 60000)