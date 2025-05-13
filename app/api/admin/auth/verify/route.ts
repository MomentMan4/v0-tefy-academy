import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Create Supabase client
    const supabase = createServerSupabaseClient()

    // Get session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.json(
        {
          success: false,
          error: sessionError.message,
          code: "SESSION_ERROR",
        },
        { status: 401 },
      )
    }

    if (!sessionData.session) {
      return NextResponse.json(
        {
          success: false,
          error: "No active session found",
          code: "NO_SESSION",
        },
        { status: 401 },
      )
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", sessionData.session.user.email)
      .single()

    if (adminError) {
      return NextResponse.json(
        {
          success: false,
          error: adminError.message,
          code: adminError.code,
        },
        { status: 403 },
      )
    }

    if (!adminData) {
      return NextResponse.json(
        {
          success: false,
          error: "User is not an admin",
          code: "NOT_ADMIN",
        },
        { status: 403 },
      )
    }

    // Return success with admin data
    return NextResponse.json({
      success: true,
      user: {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        name: adminData.name,
        role: adminData.role,
      },
      session: {
        expiresAt: new Date(sessionData.session.expires_at * 1000).toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        code: "SERVER_ERROR",
      },
      { status: 500 },
    )
  }
}
