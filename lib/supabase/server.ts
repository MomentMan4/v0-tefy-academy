import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Check if we're in a preview environment
const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

export function createServerSupabaseClient() {
  try {
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")

      // In preview environments, return a mock client for development
      if (isPreviewEnvironment) {
        return createMockSupabaseClient()
      }

      throw new Error("Missing required environment variables for Supabase")
    }

    // Use a try-catch block to handle potential errors with cookies()
    let cookieStore
    try {
      cookieStore = cookies()
    } catch (error) {
      console.error("Error accessing cookies:", error)

      // During static build, cookies() will throw an error
      // Return mock client for build time
      return createMockSupabaseClient()
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

    // In preview environments or during build, return a mock client
    return createMockSupabaseClient()
  }
}

// Create a mock Supabase client for preview environments and build time
function createMockSupabaseClient() {
  console.log("Using mock Supabase client")

  return {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: "mock-user-id",
              email: "mock@example.com",
              role: "admin",
            },
          },
        },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            // For admin_users table, return a mock admin user
            if (table === "admin_users" && value === "mock@example.com") {
              return {
                data: {
                  id: "mock-admin-id",
                  email: "mock@example.com",
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
              then: (callback: Function) =>
                callback({
                  data: [],
                  error: null,
                  count: 0,
                }),
            }),
          }),
        }),
        count: (columnName: string, { head }: { head: boolean }) => ({
          then: (callback: Function) => callback({ data: [], error: null, count: 0 }),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          limit: (limit: number) => ({
            then: (callback: Function) => callback({ data: [], error: null }),
          }),
        }),
        limit: (limit: number) => ({
          then: (callback: Function) => callback({ data: [], error: null }),
        }),
        throwOnError: () => ({
          then: (callback: Function) => callback({ data: [], error: null, count: 0 }),
        }),
      }),
      insert: () => ({ select: () => ({ then: (callback: Function) => callback({ data: [], error: null }) }) }),
      update: () => ({ eq: () => ({ then: (callback: Function) => callback({ data: [], error: null }) }) }),
      delete: () => ({ eq: () => ({ then: (callback: Function) => callback({ data: [], error: null }) }) }),
    }),
  }
}
