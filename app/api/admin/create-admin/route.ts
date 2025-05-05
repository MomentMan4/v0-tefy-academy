import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if the request is authorized
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow this operation from an existing admin
    const { data: adminCheck } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get the email from the request
    const { email, role = "admin" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if the user exists in Supabase Auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    if (userError) {
      return NextResponse.json({ error: "User not found in authentication system" }, { status: 404 })
    }

    // Add the user to the admin_users table
    const { data, error } = await supabase.from("admin_users").insert([{ email, role }]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
