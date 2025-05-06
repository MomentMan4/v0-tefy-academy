import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

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
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com; object-src 'none';",
  )

  try {
    const supabase = createMiddlewareClient({ req: request, res: response })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the route is an admin route
    const isAdminRoute =
      request.nextUrl.pathname.startsWith("/admin") &&
      !request.nextUrl.pathname.startsWith("/admin/login") &&
      !request.nextUrl.pathname.includes("/_next") &&
      !request.nextUrl.pathname.includes("/favicon.ico")

    const isAdminLoginPage = request.nextUrl.pathname === "/auth/admin-login"
    const isLoginRedirectPage = request.nextUrl.pathname === "/admin/login"

    // Skip middleware processing for the /admin/login page
    // This allows the page component to handle the redirect
    if (isLoginRedirectPage) {
      return response
    }

    // If accessing admin routes without a session, redirect to login
    if (isAdminRoute && !session) {
      console.log("No session found, redirecting to login")
      const redirectUrl = new URL("/auth/admin-login", request.url)
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If accessing admin login with a session, check if they're an admin and redirect if needed
    if (isAdminLoginPage && session) {
      // We'll let the page component handle the admin check and redirect
      return response
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
