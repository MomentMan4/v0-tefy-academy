import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Add detailed logging in development
const isDevEnvironment = process.env.NODE_ENV === "development"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Add Content-Security-Policy header
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.stripe.com https://*.vercel-insights.com; frame-src https://js.stripe.com; object-src 'none';",
  )

  try {
    // Check if the route is an admin route
    const isAdminRoute =
      request.nextUrl.pathname.startsWith("/admin") &&
      !request.nextUrl.pathname.startsWith("/admin/login") &&
      !request.nextUrl.pathname.includes("/_next") &&
      !request.nextUrl.pathname.includes("/favicon.ico")

    const isAdminLoginPage = request.nextUrl.pathname === "/auth/admin-login"
    const isLoginRedirectPage = request.nextUrl.pathname === "/admin/login"

    // Skip middleware processing for the /admin/login page
    if (isLoginRedirectPage) {
      if (isDevEnvironment) {
        console.log("Skipping middleware for login redirect page")
      }
      return response
    }

    // Create Supabase client
    const supabase = createMiddlewareClient({ req: request, res: response })

    // Get session with error handling
    let session = null
    try {
      const { data } = await supabase.auth.getSession()
      session = data.session

      if (isDevEnvironment) {
        console.log("Session in middleware:", session ? "Found" : "Not found")
        if (session) {
          console.log("User email:", session.user.email)
        }
      }
    } catch (sessionError) {
      console.error("Error getting session in middleware:", sessionError)
      // Continue without session
    }

    // If accessing admin routes without a session, redirect to login
    if (isAdminRoute && !session) {
      if (isDevEnvironment) {
        console.log("No session found, redirecting to login from middleware")
      }

      const redirectUrl = new URL("/auth/admin-login", request.url)
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If accessing admin login with a session, check if they're an admin
    if (isAdminLoginPage && session) {
      try {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (isDevEnvironment) {
          console.log("Admin check in middleware:", adminError ? "Error" : adminData ? "Is admin" : "Not admin")
        }

        if (!adminError && adminData) {
          // User is an admin, redirect to dashboard
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        }

        // If not an admin, let the page component handle it
      } catch (error) {
        console.error("Error checking admin status in middleware:", error)
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to continue
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)", "/admin/:path*", "/auth/admin-login"],
}
