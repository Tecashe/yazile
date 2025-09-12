
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/payment(.*)", "/callback(.*)"])

// //for plans

// import { hasAccess } from "@/lib/subscription"

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   // Check if the path is a protected route
//   if (request.nextUrl.pathname.startsWith("/pro") || 
//       request.nextUrl.pathname.startsWith("/ai-features")) {
    

//     const userId = request.headers.get("x-user-id")
    
//     if (!userId) {
//       // Redirect to login if no user ID
//       return NextResponse.redirect(new URL("/sign-in", request.url))
//     }
    
//     // Check if the user has access to PRO features
//     const hasProAccess = await hasAccess(userId, "PRO")
    
//     if (!hasProAccess) {
//       // Redirect to upgrade page if no access
//       return NextResponse.redirect(new URL("/upgrade", request.url))
//     }
//   }
  
//   // Similarly for team features
//   if (request.nextUrl.pathname.startsWith("/team")) {
//     const userId = request.headers.get("x-user-id")
    
//     if (!userId) {
//       return NextResponse.redirect(new URL("/sign-in", request.url))
//     }
    
//     const hasTeamAccess = await hasAccess(userId, "TEAM")
    
//     if (!hasTeamAccess) {
//       return NextResponse.redirect(new URL("/upgrade?plan=team", request.url))
//     }
//   }
  
//   return NextResponse.next()
// }




// //for plans

// // This function will handle both referrals and affiliate tracking
// async function handleReferralsAndAffiliates(request: NextRequest) {
//   const { pathname, origin } = request.nextUrl

//   // Handle affiliate links: /ref/[referralCode]
//   if (pathname.startsWith("/ref/")) {
//     const referralCode = pathname.split("/ref/")[1]

//     // Set the affiliate referral code as a cookie
//     const response = NextResponse.redirect(new URL("/", request.url))
//     response.cookies.set("affiliate_ref", referralCode, {
//       maxAge: 60 * 60 * 24 * 30, // 30 days
//       path: "/",
//     })

//     // Track the click via API
//     try {
//       await fetch(`${origin}/api/affiliates/track?ref=${referralCode}`, {
//         headers: {
//           "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
//           "user-agent": request.headers.get("user-agent") || "",
//           referer: request.headers.get("referer") || "",
//         },
//       })
//     } catch (err) {
//       console.error("Error tracking affiliate click:", err)
//     }

//     return response
//   }

//   // Check if this is a signup page with a referral code (old system)
//   if (pathname === "/signup" && request.nextUrl.searchParams.has("ref")) {
//     const refCode = request.nextUrl.searchParams.get("ref")

//     if (refCode) {
//       try {
//         // Track the referral click (old system)
//         await fetch(`${origin}/api/referrals/track?code=${refCode}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
//             "User-Agent": request.headers.get("user-agent") || "",
//           },
//         })
//       } catch (error) {
//         console.error("Failed to track referral click:", error)
//       }

//       // Store the referral code in a cookie (old system)
//       const response = NextResponse.next()
//       response.cookies.set("referralCode", refCode, {
//         maxAge: 30 * 24 * 60 * 60, // 30 days
//         path: "/",
//       })

//       return response
//     }
//   }

//   // Continue with normal request processing
//   return NextResponse.next()
// }

// // Combine our referral handling with Clerk middleware
// export default clerkMiddleware(async (auth, req) => {
//   // First handle any referral or affiliate logic
//   const referralResponse = await handleReferralsAndAffiliates(req)

//   // Then protect routes as needed
//   if (isProtectedRoute(req)) await auth.protect()

//   return referralResponse
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//     // Add matcher for affiliate referral links
//     "/ref/:referralCode*",
//     "/pro/:path*", "/ai-features/:path*", "/team/:path*"
//   ],
// }

























// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { hasAccess } from "@/lib/subscription"

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)", 
//   "/onboarding(.*)",
//   "/api/payment(.*)", 
//   "/callback(.*)",
//   "/pro(.*)",
//   "/ai-features(.*)",
//   "/team(.*)"
// ])

// // This function will handle both referrals and affiliate tracking
// async function handleReferralsAndAffiliates(request: NextRequest) {
//   const { pathname, origin } = request.nextUrl

//   // Handle affiliate links: /ref/[referralCode]
//   if (pathname.startsWith("/ref/")) {
//     const referralCode = pathname.split("/ref/")[1]

//     // Set the affiliate referral code as a cookie
//     const response = NextResponse.redirect(new URL("/", request.url))
//     response.cookies.set("affiliate_ref", referralCode, {
//       maxAge: 60 * 60 * 24 * 30, // 30 days
//       path: "/",
//     })

//     // Track the click via API
//     try {
//       await fetch(`${origin}/api/affiliates/track?ref=${referralCode}`, {
//         headers: {
//           "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
//           "user-agent": request.headers.get("user-agent") || "",
//           referer: request.headers.get("referer") || "",
//         },
//       })
//     } catch (err) {
//       console.error("Error tracking affiliate click:", err)
//     }

//     return response
//   }

//   // Check if this is a signup page with a referral code (old system)
//   if (pathname === "/signup" && request.nextUrl.searchParams.has("ref")) {
//     const refCode = request.nextUrl.searchParams.get("ref")

//     if (refCode) {
//       try {
//         // Track the referral click (old system)
//         await fetch(`${origin}/api/referrals/track?code=${refCode}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
//             "User-Agent": request.headers.get("user-agent") || "",
//           },
//         })
//       } catch (error) {
//         console.error("Failed to track referral click:", error)
//       }

//       // Store the referral code in a cookie (old system)
//       const response = NextResponse.next()
//       response.cookies.set("referralCode", refCode, {
//         maxAge: 30 * 24 * 60 * 60, // 30 days
//         path: "/",
//       })

//       return response
//     }
//   }

//   return null // Return null to continue processing
// }

// // Handle subscription-based route protection
// async function handleSubscriptionProtection(request: NextRequest, userId: string) {
//   const { pathname } = request.nextUrl

//   // Check PRO routes
//   if (pathname.startsWith("/pro") || pathname.startsWith("/ai-features")) {
//     const hasProAccess = await hasAccess(userId, "PRO")
    
//     if (!hasProAccess) {
//       return NextResponse.redirect(new URL("/upgrade", request.url))
//     }
//   }
  
//   // Check TEAM routes
//   if (pathname.startsWith("/team")) {
//     const hasTeamAccess = await hasAccess(userId, "ENTERPRISE")
    
//     if (!hasTeamAccess) {
//       return NextResponse.redirect(new URL("/upgrade?plan=team", request.url))
//     }
//   }

//   return null // Return null to continue processing
// }

// // Main middleware using clerkMiddleware
// export default clerkMiddleware(async (auth, req) => {
//   // First handle any referral or affiliate logic
//   const referralResponse = await handleReferralsAndAffiliates(req)
//   if (referralResponse) {
//     return referralResponse
//   }

//   // Protect routes that require authentication
//   if (isProtectedRoute(req)) {
//     const { userId } = await auth.protect()
    
//     // Handle subscription-based protection for authenticated users
//     if (userId) {
//       const subscriptionResponse = await handleSubscriptionProtection(req, userId)
//       if (subscriptionResponse) {
//         return subscriptionResponse
//       }
//     }
//   }

//   // Continue with normal request processing
//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// }


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hasAccess } from "@/lib/subscription"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/onboarding(.*)",
  "/api/payment(.*)", 
  "/callback(.*)",
  "/pro(.*)",
  "/ai-features(.*)",
  "/team(.*)"
])

// Handle subscription-based route protection
async function handleSubscriptionProtection(request: NextRequest, userId: string) {
  const { pathname } = request.nextUrl

  // Check PRO routes
  if (pathname.startsWith("/pro") || pathname.startsWith("/ai-features")) {
    try {
      const hasProAccess = await hasAccess(userId, "PRO")
      
      if (!hasProAccess) {
        return NextResponse.redirect(new URL("/upgrade", request.url))
      }
    } catch (error) {
      console.error("Error checking PRO access:", error)
      // Continue processing instead of failing
    }
  }
  
  // Check TEAM routes
  if (pathname.startsWith("/team")) {
    try {
      const hasTeamAccess = await hasAccess(userId, "ENTERPRISE")
      
      if (!hasTeamAccess) {
        return NextResponse.redirect(new URL("/upgrade?plan=team", request.url))
      }
    } catch (error) {
      console.error("Error checking TEAM access:", error)
      // Continue processing instead of failing
    }
  }

  return null // Return null to continue processing
}

// Main middleware using clerkMiddleware
export default clerkMiddleware(async (auth, req) => {
  try {
    // Protect routes that require authentication
    if (isProtectedRoute(req)) {
      const authResult = await auth.protect()
      const { userId } = authResult
      
      // Handle subscription-based protection for authenticated users
      if (userId) {
        const subscriptionResponse = await handleSubscriptionProtection(req, userId)
        if (subscriptionResponse) {
          return subscriptionResponse
        }
      }
    }

    // Continue with normal request processing
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    
    // Handle the specific "Body has already been consumed" error
    if (error instanceof Error && error.message?.includes("Body has already been consumed")) {
      console.error("Body consumption error in middleware - continuing with request")
      return NextResponse.next()
    }
    
    // For other errors, continue processing to avoid breaking the app
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}