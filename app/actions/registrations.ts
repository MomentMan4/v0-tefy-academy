"use server"

import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
)

export async function getRegistrations(page = 1, limit = 10) {
  try {
    const { data, error, count } = await supabase
      .from("registrations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("Failed to get registrations:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data, count }
  } catch (error) {
    console.error("Error getting registrations:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getRegistrationStats() {
  try {
    // Get total registrations
    const { count: totalCount, error: countError } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Failed to get registration count:", countError.message)
      return { success: false, error: countError.message }
    }

    // Get registrations with internship
    const { count: internshipCount, error: internshipError } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("has_internship", true)

    if (internshipError) {
      console.error("Failed to get internship count:", internshipError.message)
      return { success: false, error: internshipError.message }
    }

    // Get registrations by month
    const { data: monthlyData, error: monthlyError } = await supabase.rpc("get_monthly_registrations")

    if (monthlyError) {
      console.error("Failed to get monthly registrations:", monthlyError.message)
      // Continue with other stats
    }

    return {
      success: true,
      data: {
        totalRegistrations: totalCount || 0,
        internshipRegistrations: internshipCount || 0,
        monthlyRegistrations: monthlyData || [],
      },
    }
  } catch (error) {
    console.error("Error getting registration stats:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
