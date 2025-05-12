import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance to prevent multiple instances
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClientSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  // Add detailed logging in development
  const isDevEnvironment = process.env.NODE_ENV === "development"

  if (isDevEnvironment) {
    console.log("Creating new Supabase client with:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKeyAvailable: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }

  try {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
