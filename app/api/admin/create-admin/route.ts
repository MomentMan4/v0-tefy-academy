import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// This endpoint should be secured in production
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Add the user to the admin_users table
    const { error: dbError } = await supabase.from("admin_users").insert({
      email,
      role: "admin",
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Error adding user to admin_users table:", dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
