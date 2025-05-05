import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Check if we're in a preview environment
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

export function createServerSupabaseClient() {
  try {
    const cookieStore = cookies()

    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")

      // In preview environments, return a mock client for development
      if (isPreviewEnvironment) {
        return createMockSupabaseClient()
      }

      throw new Error("Missing required environment variables for Supabase")
    }

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // This can happen in middleware or other contexts where cookies are read-only
              console.error("Error setting cookie:", error)
            }
          },
          remove(name: string, options: { path: string; domain?: string }) {
            try {
              cookieStore.set({ name, value: "", ...options, maxAge: 0 })
            } catch (error) {
              console.error("Error removing cookie:", error)
            }
          },
        },
        global: {
          fetch: (...args) => {
            return fetch(...args)
          },
        },
      },
    )
  } catch (error) {
    console.error("Error creating Supabase client:", error)

    // In preview environments, return a mock client for development
    if (isPreviewEnvironment) {
      return createMockSupabaseClient()
    }

    throw new Error("Failed to initialize Supabase client")
  }
}

// Create a mock Supabase client for preview environments
function createMockSupabaseClient() {
  console.log("Using mock Supabase client for preview environment")

  return {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: "preview-user-id",
              email: "preview@example.com",
              role: "admin",
            },
          },
        },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            // For admin_users table, return a mock admin user
            if (table === "admin_users" && value === "preview@example.com") {
              return {
                data: {
                  id: "preview-admin-id",
                  email: "preview@example.com",
                  role: "admin",
                  created_at: new Date().toISOString(),
                },
                error: null,
              }
            }

            // For other tables or queries, return empty data
            return { data: null, error: null }
          },
          limit: (limit: number) => ({
            order: (column: string, { ascending }: { ascending: boolean }) => ({
              range: (from: number, to: number) => ({
                then: (callback: Function) =>
                  callback({
                    data: [],
                    error: null,
                    count: 0,
                  }),
              }),
            }),
          }),
        }),
      }),
      insert: () => ({ select: () => ({ then: (callback: Function) => callback({ data: [], error: null }) }) }),
      update: () => ({ eq: () => ({ then: (callback: Function) => callback({ data: [], error: null }) }) }),
      delete: () => ({ eq: () => ({ then: (callback: Function) => callback({ data: [], error: null }) }) }),
    }),
  }
}
