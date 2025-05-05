import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the route is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAdminLoginPage = request.nextUrl.pathname === "/auth/admin-login"

  // If accessing admin routes without a session, redirect to login
  if (isAdminRoute && !session) {
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
}

export const config = {
  matcher: ["/admin/:path*", "/auth/admin-login"],
}
