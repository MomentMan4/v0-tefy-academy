import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Create a more robust server Supabase client
export function createServerSupabaseClient() {
  // Check if we're in a build/preview environment
  const isBuildOrPreview =
    process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development" || typeof window === "undefined"

  // Add detailed logging in development
  const isDevEnvironment = process.env.NODE_ENV === "development"

  if (isDevEnvironment) {
    console.log("Creating server Supabase client in environment:", process.env.NODE_ENV)
    console.log("VERCEL_ENV:", process.env.VERCEL_ENV)
    console.log("URL available:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Service role key available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log("Anon key available:", !!process.env.SUPABASE_ANON_KEY)
  }

  try {
    // Try to get cookies, but handle errors that might occur during build
    let cookieStore
    try {
      cookieStore = cookies()
    } catch (error) {
      if (isDevEnvironment) {
        console.warn("Error accessing cookies, using fallback cookie handler:", error)
      }

      // Return a mock client for build time or when cookies are not available
      return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: () => undefined,
            set: () => {},
            remove: () => {},
          },
          auth: {
            persistSession: false,
          },
        },
      )
    }

    // Create the actual client with proper cookie handling
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return cookieStore.get(name)?.value
            } catch (error) {
              if (isDevEnvironment) {
                console.error("Error getting cookie:", error)
              }
              return undefined
            }
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie setting errors silently in production
              if (isDevEnvironment) {
                console.error("Error setting cookie:", error)
              }
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              // Handle cookie removal errors silently in production
              if (isDevEnvironment) {
                console.error("Error removing cookie:", error)
              }
            }
          },
        },
        auth: {
          persistSession: true,
        },
      },
    )
  } catch (error) {
    if (isDevEnvironment) {
      console.error("Error creating server Supabase client:", error)
    }

    // Return a mock client for build time or when cookies are not available
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: () => undefined,
          set: () => {},
          remove: () => {},
        },
        auth: {
          persistSession: false,
        },
      },
    )
  }
}
