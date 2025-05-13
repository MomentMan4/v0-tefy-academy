import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * Checks if a user with the given email exists in the admin_users table
 * @param email The email to check
 * @returns An object containing the result of the check
 */
export async function checkAdminStatus(email: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error) {
      return {
        isAdmin: false,
        error: error.message,
        errorCode: error.code,
        data: null,
      }
    }

    return {
      isAdmin: !!data,
      error: null,
      errorCode: null,
      data,
    }
  } catch (error: any) {
    return {
      isAdmin: false,
      error: error.message || "Unknown error checking admin status",
      errorCode: "UNKNOWN_ERROR",
      data: null,
    }
  }
}

/**
 * Creates a new admin user in the admin_users table
 * @param email The email of the admin user to create
 * @param name The name of the admin user
 * @param role The role of the admin user (default: "admin")
 * @returns An object containing the result of the operation
 */
export async function createAdminUser(email: string, name: string, role = "admin") {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (existingUser) {
      return {
        success: false,
        error: "Admin user already exists",
        data: existingUser,
      }
    }

    // Create new admin user
    const { data, error } = await supabase
      .from("admin_users")
      .insert([
        {
          email,
          name,
          role,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    return {
      success: true,
      error: null,
      data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error creating admin user",
      data: null,
    }
  }
}
