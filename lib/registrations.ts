import { createClient } from "@supabase/supabase-js"
import type { RegistrationInsert } from "@/types/registration"

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
)

export async function createRegistration(registration: RegistrationInsert) {
  try {
    const { data, error } = await supabase.from("registrations").insert(registration).select().single()

    if (error) {
      console.error("Failed to create registration:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error creating registration:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getRegistrationByPaymentId(paymentId: string) {
  try {
    const { data, error } = await supabase.from("registrations").select("*").eq("payment_id", paymentId).single()

    if (error) {
      console.error("Failed to get registration:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting registration:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getRegistrationsByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("registrations").select("*").eq("email", email)

    if (error) {
      console.error("Failed to get registrations:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting registrations:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateRegistration(id: string, updates: Partial<RegistrationInsert>) {
  try {
    const { data, error } = await supabase.from("registrations").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Failed to update registration:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error updating registration:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
