import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance to prevent multiple instances
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

// Add detailed logging in development
const isDevEnvironment = process.env.NODE_ENV === "development"

export function createClientSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  if (isDevEnvironment) {
    console.log("Creating new Supabase client with:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKeyAvailable: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }

  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
  }

  try {
    // Add custom fetch with timeout to prevent hanging requests
    const fetchWithTimeout = (url: RequestInfo | URL, options: RequestInit = {}) => {
      // Default timeout of 15 seconds
      const timeout = 15000

      const controller = new AbortController()
      const { signal } = controller

      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)

      return fetch(url, {
        ...options,
        signal,
      }).finally(() => {
        clearTimeout(timeoutId)
      })
    }

    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        global: {
          fetch: fetchWithTimeout,
        },
        cookies: {
          name: "sb-auth-token",
          lifetime: 60 * 60 * 24 * 7, // 1 week
          domain: "",
          path: "/",
          sameSite: "lax",
        },
      },
    )

    if (isDevEnvironment) {
      console.log("Supabase client created successfully")
    }

    return supabaseClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)

    // Fallback to a basic client that won't throw errors
    // This helps prevent app crashes but won't work for auth
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
    )
  }
}

// Function to clear the client (useful for testing and debugging)
export function clearClientSupabaseClient() {
  supabaseClient = null
}

// Function to test Supabase connectivity
export async function testSupabaseConnectivity() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      reachable: false,
      error: "Missing Supabase configuration",
      details: {
        urlAvailable: !!supabaseUrl,
        keyAvailable: !!supabaseKey,
      },
    }
  }

  try {
    // Try to ping the Supabase health endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: supabaseKey,
      },
      signal: AbortSignal.timeout(5000),
    })

    return {
      reachable: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (error: any) {
    return {
      reachable: false,
      error: error.message,
      errorName: error.name,
    }
  }
}
