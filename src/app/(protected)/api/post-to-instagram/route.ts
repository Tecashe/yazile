
// import { NextResponse } from "next/server";
// import axios from "axios";
// import { client } from "@/lib/prisma";
// import type { INTEGRATIONS } from "@prisma/client";

// interface InstagramIntegration {
//   id: string;
//   createdAt: Date;
//   name: INTEGRATIONS;
//   userId: string | null;
//   token: string;
//   expiresAt: Date | null;
//   instagramId: string | null;
//   username: string | null;
//   lastUpdated: Date;
// }

// const safeStringify = (obj: any) => {
//   try {
//     return JSON.stringify(obj, null, 2);
//   } catch (error) {
//     return "Error stringifying object";
//   }
// };

// const logError = (message: string, error: any) => {
//   console.error(message, safeStringify(error));
// };

// async function refreshToken(token: string): Promise<string> {
//   try {
//     const response = await axios.get(`https://graph.instagram.com/refresh_access_token`, {
//       params: {
//         grant_type: "ig_refresh_token",
//         access_token: token,
//       },
//     });
//     return response.data.access_token;
//   } catch (error) {
//     logError("refreshing token", error);
//     throw new Error("Failed to refresh token");
//   }
// }

// async function createMediaContainer(
//   instagramId: string,
//   token: string,
//   mediaUrl: string,
//   mediaType: string,
//   isCarouselItem = false,
//   caption?: string,
// ) {
//   try {
//     const params: any = {
//       [mediaType === "VIDEO" ? "video_url" : "image_url"]: mediaUrl,
//       media_type: mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
//       ...(isCarouselItem && { is_carousel_item: true }),
//     };

//     if (caption && !isCarouselItem) {
//       params.caption = caption;
//     }

//     const response = await axios.post(`https://graph.instagram.com/v22.0/${instagramId}/media`, params, {
//       params: { access_token: token },
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data.id;
//   } catch (error) {
//     logError("creating media container", error);
//     throw new Error("Failed to create media container");
//   }
// }

// async function createCarouselContainer(instagramId: string, token: string, containerIds: string[], caption: string) {
//   try {
//     const response = await axios.post(`https://graph.instagram.com/v22.0/${instagramId}/media`, null, {
//       params: {
//         media_type: "CAROUSEL",
//         caption,
//         children: containerIds.join(","),
//         access_token: token,
//       },
//     });
//     return response.data.id;
//   } catch (error) {
//     logError("creating carousel container", error);
//     throw new Error("Failed to create carousel container");
//   }
// }

// async function publishMedia(instagramId: string, token: string, containerId: string) {
//   try {
//     const response = await axios.post(`https://graph.instagram.com/v22.0/${instagramId}/media_publish`, null, {
//       params: {
//         creation_id: containerId,
//         access_token: token,
//       },
//     });
//     return response.data.id;
//   } catch (error) {
//     logError("publishing media", error);
//     throw new Error("Failed to publish media");
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const { userId, caption, mediaUrls, mediaType } = await request.json();

//     // Fetch the user's Instagram integration
//     const user = await client.user.findUnique({
//       where: { clerkId: userId },
//       include: { integrations: { where: { name: "INSTAGRAM" } } },
//     });

//     if (!user || !user.integrations[0]) {
//       return NextResponse.json({ error: "User not found or Instagram not integrated" }, { status: 404 });
//     }

//     const instagramIntegration = user.integrations[0] as InstagramIntegration;

//     if (!instagramIntegration.instagramId) {
//       return NextResponse.json({ error: "Instagram ID not found" }, { status: 400 });
//     }

//     // Refresh the token before using it
//     const refreshedToken = await refreshToken(instagramIntegration.token);

//     let finalContainerId: string;
//     const containerIds: string[] = [];

//     // Handle different media types
//     if (mediaUrls.length > 1) {
//       // Create individual containers for carousel items
//       for (const mediaUrl of mediaUrls) {
//         const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov");
//         const containerMediaType = isVideo ? "VIDEO" : "IMAGE";

//         const containerId = await createMediaContainer(
//           instagramIntegration.instagramId,
//           refreshedToken,
//           mediaUrl,
//           containerMediaType,
//           true,
//         );
//         containerIds.push(containerId);
//       }

//       // Create and use carousel container
//       finalContainerId = await createCarouselContainer(
//         instagramIntegration.instagramId,
//         refreshedToken,
//         containerIds,
//         caption,
//       );
//     } else {
//       // Single media post
//       const isVideo = mediaUrls[0].endsWith(".mp4") || mediaUrls[0].endsWith(".mov");
//       const containerMediaType = isVideo ? "VIDEO" : "IMAGE";

//       finalContainerId = await createMediaContainer(
//         instagramIntegration.instagramId,
//         refreshedToken,
//         mediaUrls[0],
//         containerMediaType,
//         false,
//         caption,
//       );
//     }

//     // Publish the media
//     const postId = await publishMedia(instagramIntegration.instagramId, refreshedToken, finalContainerId);

//     // Store the post in the database
//     const now = new Date();
//     const storedPost = await client.scheduledContent.create({
//       data: {
//         instagramPostId: postId,
//         caption,
//         mediaType,
//         mediaUrl: mediaUrls.join(","),
//         status: "published",
//         scheduledDate: now,
//         publishedDate: now,
//         userId: user.id,
//       },
//     });

//     // Update the refreshed token in the database
//     await client.integrations.update({
//       where: { id: instagramIntegration.id },
//       data: { token: refreshedToken },
//     });

//     return NextResponse.json({ success: true, postId, storedPostId: storedPost.id });
//   } catch (error) {
//     logError("overall post process", error);
//     return NextResponse.json({ error: "Failed to post to Instagram" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { client } from "@/lib/prisma";
import type { INTEGRATIONS } from "@prisma/client";
import { z } from "zod";

interface InstagramIntegration {
  id: string;
  createdAt: Date;
  name: INTEGRATIONS;
  userId: string | null;
  token: string;
  expiresAt: Date | null;
  instagramId: string | null;
  username: string | null;
  lastUpdated: Date;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Input validation schema
const requestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  caption: z.string().max(2200, "Caption too long (max 2200 characters)"),
  mediaUrls: z.array(z.string().url("Invalid media URL")).min(1, "At least one media URL required").max(10, "Maximum 10 media items allowed"),
  mediaType: z.enum(["IMAGE", "VIDEO", "CAROUSEL"], { errorMap: () => ({ message: "Invalid media type" }) })
});

// Structured logging
const logger = {
  info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta, null, 2) : ''),
  error: (message: string, error?: any, meta?: any) => console.error(`[ERROR] ${message}`, error?.message || error, meta ? JSON.stringify(meta, null, 2) : ''),
  warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta, null, 2) : '')
};

// Retry mechanism with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${attempt + 1} failed, retrying...`, { error: (error as Error).message });
      
      if (attempt === maxRetries - 1) break;
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Enhanced fetch wrapper
async function instagramApiCall(
  url: string, 
  options: RequestInit = {},
  timeout = 30000
): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      logger.error(`Instagram API Error ${response.status}`, null, {
        url,
        status: response.status,
        error: errorData
      });
      
      throw new Error(`Instagram API Error: ${response.status} - ${errorData.error?.message || errorData.message || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    // if (error.name === 'AbortError') {
    //   throw new Error('Request timeout');
    // }
    throw error;
  }
}

// Media type detection
function getMediaType(url: string): 'VIDEO' | 'IMAGE' {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
  
  const lowerUrl = url.toLowerCase();
  
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'VIDEO';
  }
  
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'IMAGE';
  }
  
  // Fallback to IMAGE for unknown types
  logger.warn('Unknown media type, defaulting to IMAGE', { url });
  return 'IMAGE';
}

// Token refresh
async function refreshInstagramToken(currentToken: string): Promise<string> {
  logger.info('Refreshing Instagram token');
  
  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', currentToken);
  
  const response = await retryWithBackoff(() => 
    instagramApiCall(url.toString(), { method: 'GET' })
  );
  
  if (!response.access_token) {
    throw new Error('Invalid token refresh response');
  }
  
  logger.info('Token refreshed successfully');
  return response.access_token;
}

// Create media container
async function createMediaContainer(
  instagramId: string,
  token: string,
  mediaUrl: string,
  mediaType: 'VIDEO' | 'IMAGE',
  isCarouselItem = false,
  caption?: string
): Promise<string> {
  logger.info('Creating media container', { mediaType, isCarouselItem });
  
  const url = `https://graph.instagram.com/v22.0/${instagramId}/media`;
  const params = new URLSearchParams();
  
  // Set media URL parameter
  params.set(mediaType === 'VIDEO' ? 'video_url' : 'image_url', mediaUrl);
  params.set('media_type', mediaType);
  params.set('access_token', token);
  
  if (isCarouselItem) {
    params.set('is_carousel_item', 'true');
  }
  
  if (caption && !isCarouselItem) {
    params.set('caption', caption);
  }
  
  const response = await retryWithBackoff(() => 
    instagramApiCall(`${url}?${params.toString()}`, { method: 'POST' })
  );
  
  if (!response.id) {
    throw new Error('Invalid media container response');
  }
  
  logger.info('Media container created', { containerId: response.id });
  return response.id;
}

// Create carousel container
async function createCarouselContainer(
  instagramId: string,
  token: string,
  containerIds: string[],
  caption: string
): Promise<string> {
  logger.info('Creating carousel container', { itemCount: containerIds.length });
  
  const url = `https://graph.instagram.com/v22.0/${instagramId}/media`;
  const params = new URLSearchParams();
  params.set('media_type', 'CAROUSEL');
  params.set('caption', caption);
  params.set('children', containerIds.join(','));
  params.set('access_token', token);
  
  const response = await retryWithBackoff(() => 
    instagramApiCall(`${url}?${params.toString()}`, { method: 'POST' })
  );
  
  if (!response.id) {
    throw new Error('Invalid carousel container response');
  }
  
  logger.info('Carousel container created', { containerId: response.id });
  return response.id;
}

// Publish media
async function publishMedia(
  instagramId: string,
  token: string,
  containerId: string
): Promise<string> {
  logger.info('Publishing media', { containerId });
  
  const url = `https://graph.instagram.com/v22.0/${instagramId}/media_publish`;
  const params = new URLSearchParams();
  params.set('creation_id', containerId);
  params.set('access_token', token);
  
  const response = await retryWithBackoff(() => 
    instagramApiCall(`${url}?${params.toString()}`, { method: 'POST' })
  );
  
  if (!response.id) {
    throw new Error('Invalid publish response');
  }
  
  logger.info('Media published successfully', { postId: response.id });
  return response.id;
}

export async function POST(request: Request): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    const { userId, caption, mediaUrls, mediaType } = validatedData;
    
    logger.info('Instagram post request received', {
      userId,
      mediaCount: mediaUrls.length,
      mediaType
    });
    
    // Fetch user and Instagram integration
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: { 
        integrations: { 
          where: { name: "INSTAGRAM" },
          orderBy: { lastUpdated: 'desc' }
        } 
      },
    });
    
    if (!user) {
      logger.warn('User not found', { userId });
      return NextResponse.json({
        success: false,
        error: "User not found",
        timestamp: new Date().toISOString()
      } satisfies ApiResponse, { status: 404 });
    }
    
    if (!user.integrations || user.integrations.length === 0) {
      logger.warn('Instagram integration not found', { userId });
      return NextResponse.json({
        success: false,
        error: "Instagram integration not found",
        timestamp: new Date().toISOString()
      } satisfies ApiResponse, { status: 400 });
    }
    
    const instagramIntegration = user.integrations[0] as InstagramIntegration;
    
    if (!instagramIntegration.instagramId) {
      logger.warn('Instagram ID missing', { userId, integrationId: instagramIntegration.id });
      return NextResponse.json({
        success: false,
        error: "Instagram ID not configured",
        timestamp: new Date().toISOString()
      } satisfies ApiResponse, { status: 400 });
    }
    
    // Check token expiration
    const now = new Date();
    const shouldRefreshToken = !instagramIntegration.expiresAt || 
      instagramIntegration.expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days
    
    let currentToken = instagramIntegration.token;
    
    if (shouldRefreshToken) {
      try {
        currentToken = await refreshInstagramToken(instagramIntegration.token);
        
        // Update token in database
        await client.integrations.update({
          where: { id: instagramIntegration.id },
          data: { 
            token: currentToken,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            lastUpdated: now
          },
        });
        
        logger.info('Token updated in database');
      } catch (error) {
        logger.error('Token refresh failed', error, { userId });
        return NextResponse.json({
          success: false,
          error: "Instagram token refresh failed. Please reconnect your Instagram account.",
          timestamp: new Date().toISOString()
        } satisfies ApiResponse, { status: 401 });
      }
    }
    
    let finalContainerId: string;
    
    // Handle media posting
    if (mediaUrls.length > 1) {
      // Carousel post
      logger.info('Creating carousel post');
      const containerIds: string[] = [];
      
      for (let index = 0; index < mediaUrls.length; index++) {
        const mediaUrl = mediaUrls[index];
        try {
          const detectedMediaType = getMediaType(mediaUrl);
          const containerId = await createMediaContainer(
            instagramIntegration.instagramId,
            currentToken,
            mediaUrl,
            detectedMediaType,
            true
          );
          containerIds.push(containerId);
          logger.info(`Carousel item ${index + 1} created`, { containerId });
        } catch (error) {
          logger.error(`Failed to create carousel item ${index + 1}`, error as Error, { mediaUrl });
          throw new Error(`Failed to process media item ${index + 1}: ${(error as Error).message}`);
        }
      }
      
      finalContainerId = await createCarouselContainer(
        instagramIntegration.instagramId,
        currentToken,
        containerIds,
        caption
      );
    } else {
      // Single media post
      logger.info('Creating single media post');
      const detectedMediaType = getMediaType(mediaUrls[0]);
      
      finalContainerId = await createMediaContainer(
        instagramIntegration.instagramId,
        currentToken,
        mediaUrls[0],
        detectedMediaType,
        false,
        caption
      );
    }
    
    // Publish the media
    const instagramPostId = await publishMedia(
      instagramIntegration.instagramId,
      currentToken,
      finalContainerId
    );
    
    // Store in database using transaction
    const storedPost = await client.$transaction(async (tx) => {
      const post = await tx.scheduledContent.create({
        data: {
          instagramPostId,
          caption,
          mediaType: mediaUrls.length > 1 ? "CAROUSEL" : mediaType,
          mediaUrl: mediaUrls.join(","),
          status: "published",
          scheduledDate: now,
          publishedDate: now,
          userId: user.id,
        },
      });
      
      // Update integration last used timestamp
      await tx.integrations.update({
        where: { id: instagramIntegration.id },
        data: { lastUpdated: now },
      });
      
      return post;
    });
    
    const duration = Date.now() - startTime;
    logger.info('Instagram post completed successfully', {
      userId,
      instagramPostId,
      storedPostId: storedPost.id,
      duration: `${duration}ms`
    });
    
    return NextResponse.json({
      success: true,
      data: {
        instagramPostId,
        storedPostId: storedPost.id,
        publishedAt: now.toISOString()
      },
      timestamp: new Date().toISOString()
    } satisfies ApiResponse);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error instanceof z.ZodError) {
      logger.warn('Invalid request data', { errors: error.errors });
      return NextResponse.json({
        success: false,
        error: `Invalid request: ${error.errors.map(e => e.message).join(', ')}`,
        timestamp: new Date().toISOString()
      } satisfies ApiResponse, { status: 400 });
    }
    
    logger.error('Instagram post failed', error as Error, { duration: `${duration}ms` });
    
    return NextResponse.json({
      success: false,
      error: (error as Error).message || "Failed to post to Instagram",
      timestamp: new Date().toISOString()
    } satisfies ApiResponse, { status: 500 });
  }
}
