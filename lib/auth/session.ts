import { createClientSupabaseClient } from "@/lib/supabase/client"

/**
 * Stores a flag in localStorage to indicate successful admin login
 * This helps with session persistence across page navigations
 */
export function markAdminLoginSuccess() {
  localStorage.setItem("adminLoginSuccess", "true")
  localStorage.setItem("adminLoginTime", Date.now().toString())
}

/**
 * Clears the admin login success flag from localStorage
 */
export function clearAdminLoginSuccess() {
  localStorage.removeItem("adminLoginSuccess")
  localStorage.removeItem("adminLoginTime")
}

/**
 * Checks if there is a recent admin login success flag in localStorage
 * @param maxAgeMinutes Maximum age of the login flag in minutes (default: 5)
 * @returns True if there is a recent admin login success flag
 */
export function hasRecentAdminLoginSuccess(maxAgeMinutes = 5): boolean {
  const loginSuccess = localStorage.getItem("adminLoginSuccess")
  const loginTime = localStorage.getItem("adminLoginTime")

  if (loginSuccess !== "true" || !loginTime) {
    return false
  }

  const loginTimeMs = Number.parseInt(loginTime, 10)
  const isRecent = Date.now() - loginTimeMs < maxAgeMinutes * 60 * 1000

  return isRecent
}

/**
 * Verifies the current admin session by checking both client-side and server-side
 * @returns An object containing the result of the verification
 */
export async function verifyAdminSession() {
  try {
    const supabase = createClientSupabaseClient()

    // Check client-side session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: sessionError.message,
        user: null,
      }
    }

    if (!session) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: "No active session found",
        user: null,
      }
    }

    // Check admin status
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (adminError) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        error: adminError.message,
        user: session.user,
      }
    }

    if (!adminData) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        error: "User is not an admin",
        user: session.user,
      }
    }

    // Verify with server-side check
    try {
      const response = await fetch("/api/admin/auth/verify")

      if (!response.ok) {
        const errorData = await response.json()
        return {
          isAuthenticated: true,
          isAdmin: false,
          error: errorData.error || "Server verification failed",
          user: session.user,
        }
      }

      const data = await response.json()

      if (!data.success) {
        return {
          isAuthenticated: true,
          isAdmin: false,
          error: data.error || "Server verification failed",
          user: session.user,
        }
      }

      // All checks passed
      return {
        isAuthenticated: true,
        isAdmin: true,
        error: null,
        user: {
          ...session.user,
          name: adminData.name,
          role: adminData.role,
        },
      }
    } catch (error: any) {
      // Server verification failed, but we still have client-side verification
      return {
        isAuthenticated: true,
        isAdmin: true,
        error: `Server verification failed: ${error.message}`,
        user: {
          ...session.user,
          name: adminData.name,
          role: adminData.role,
        },
      }
    }
  } catch (error: any) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      error: error.message || "Unknown error verifying session",
      user: null,
    }
  }
}
