import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Create Supabase client
    const supabase = createServerSupabaseClient()

    // Get session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    // Get all cookies for debugging
    let cookieList: Record<string, string> = {}
    try {
      const cookieStore = cookies()
      cookieStore.getAll().forEach((cookie) => {
        cookieList[cookie.name] = cookie.value.substring(0, 10) + "..." // Only show first 10 chars for security
      })
    } catch (cookieError) {
      cookieList = { error: "Could not access cookies" }
    }

    // Check admin status if session exists
    let adminCheckResult = null
    let adminCheckError = null

    if (sessionData.session) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", sessionData.session.user.email)
          .single()

        adminCheckResult = data ? { exists: true, email: data.email } : { exists: false }
        adminCheckError = error ? { message: error.message, code: error.code } : null
      } catch (error: any) {
        adminCheckError = { message: error.message }
      }
    }

    // Get environment info without VERCEL_REGION
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || "not set",
      SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      ANON_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SERVICE_ROLE_KEY_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: sessionData.session
        ? {
            user: {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email,
              lastSignInAt: sessionData.session.user.last_sign_in_at,
            },
            expiresAt: new Date(sessionData.session.expires_at * 1000).toISOString(),
            refreshToken: sessionData.session.refresh_token ? "present" : "missing",
          }
        : null,
      sessionError: sessionError ? { message: sessionError.message } : null,
      adminCheck: adminCheckResult,
      adminCheckError,
      environment: envInfo,
      cookieInfo: {
        count: Object.keys(cookieList).length,
        list: cookieList,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error", stack: process.env.NODE_ENV === "development" ? error.stack : null },
      { status: 500 },
    )
  }
}
