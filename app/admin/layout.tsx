import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminLayoutClient from "./components/AdminLayoutClient"

// Force dynamic rendering for all admin pages
export const dynamic = "force-dynamic"

// Add detailed logging in development
const isDevEnvironment = process.env.NODE_ENV === "development"

// Check if we're in a preview environment
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    // Check if user is authenticated and has admin role
    const supabase = createServerSupabaseClient()

    // Get session
    let session = null
    let sessionError = null

    try {
      const sessionResult = await supabase.auth.getSession()
      session = sessionResult.data.session
      sessionError = sessionResult.error

      if (isDevEnvironment) {
        console.log("Session in admin layout:", session ? "Found" : "Not found")
        if (sessionError) {
          console.error("Session error in admin layout:", sessionError)
        }
      }
    } catch (error) {
      console.error("Error getting session in admin layout:", error)
      sessionError = error
    }

    if (sessionError && !isPreviewEnvironment) {
      console.error("Session error:", sessionError)
      redirect("/auth/admin-login?error=session_error")
    }

    // If no session and not in preview, redirect to login
    if (!session && !isPreviewEnvironment) {
      if (isDevEnvironment) {
        console.log("No session found, redirecting to login from admin layout")
      }
      redirect("/auth/admin-login")
    }

    // In preview environment, use mock user if no session
    const user =
      session?.user ||
      (isPreviewEnvironment
        ? {
            id: "preview-user-id",
            email: "preview@example.com",
            role: "admin",
          }
        : null)

    // If no user (shouldn't happen with the above logic, but just in case)
    if (!user) {
      if (isDevEnvironment) {
        console.log("No user found, redirecting to login from admin layout")
      }
      redirect("/auth/admin-login")
    }

    // Check if user is in admin_users table (skip in preview environment)
    if (!isPreviewEnvironment && session) {
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", user.email)
          .single()

        if (adminError) {
          console.error("Admin check error:", adminError)
          // Sign out the user if there was an error checking admin status
          await supabase.auth.signOut()
          redirect("/auth/admin-login?error=admin_check_failed")
        }

        if (!adminUser) {
          if (isDevEnvironment) {
            console.log("User not found in admin_users table, signing out and redirecting")
          }
          // Sign out the user if they're not an admin
          await supabase.auth.signOut()
          redirect("/auth/admin-login?error=not_admin")
        }
      } catch (adminCheckError) {
        console.error("Error checking admin status:", adminCheckError)
        // In case of error, redirect to login
        redirect("/auth/admin-login?error=admin_check_error")
      }
    }

    // Pass the user data to the client component
    return <AdminLayoutClient user={user} children={children} />
  } catch (error) {
    console.error("Admin layout error:", error)

    // In preview environment, render the layout with mock data
    if (isPreviewEnvironment) {
      const previewUser = {
        id: "preview-user-id",
        email: "preview@example.com",
        role: "admin",
      }

      return <AdminLayoutClient user={previewUser} children={children} />
    }

    // Redirect to login page with error
    redirect("/auth/admin-login?error=server_error")
  }
}
