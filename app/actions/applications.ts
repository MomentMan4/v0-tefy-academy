"use server"

import { createClient } from "@supabase/supabase-js"
import { sendApplicationFollowupEmail } from "@/lib/email"

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
)

export async function savePartialApplication(data: {
  name: string
  email: string
  phone?: string
  completed: boolean
  step: number
}) {
  try {
    // Check if this email already exists in the applications table
    const { data: existingApp, error: queryError } = await supabase
      .from("applications")
      .select("*")
      .eq("email", data.email)
      .maybeSingle()

    if (queryError) {
      console.error("Error checking for existing application:", queryError)
      return { success: false, error: queryError.message }
    }

    if (existingApp) {
      // Update the existing record
      const { error: updateError } = await supabase
        .from("applications")
        .update({
          name: data.name,
          phone: data.phone,
          completed: data.completed,
          step: data.step,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingApp.id)

      if (updateError) {
        console.error("Error updating application:", updateError)
        return { success: false, error: updateError.message }
      }

      return { success: true, data: existingApp.id }
    } else {
      // Insert a new record
      const { data: newApp, error: insertError } = await supabase
        .from("applications")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          completed: data.completed,
          step: data.step,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating application:", insertError)
        return { success: false, error: insertError.message }
      }

      return { success: true, data: newApp.id }
    }
  } catch (error: any) {
    console.error("Unexpected error saving application:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export async function scheduleFollowupEmails() {
  try {
    // Get incomplete applications that haven't been followed up in the last 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const { data: incompleteApps, error } = await supabase
      .from("applications")
      .select("*")
      .eq("completed", false)
      .lt("last_followup", oneDayAgo.toISOString())
      .is("converted", null)

    if (error) {
      console.error("Error fetching incomplete applications:", error)
      return { success: false, error: error.message }
    }

    // Send follow-up emails
    for (const app of incompleteApps || []) {
      try {
        await sendApplicationFollowupEmail(app.email, app.name)

        // Update the last_followup timestamp
        await supabase.from("applications").update({ last_followup: new Date().toISOString() }).eq("id", app.id)
      } catch (emailError) {
        console.error(`Failed to send follow-up email to ${app.email}:`, emailError)
      }
    }

    return { success: true, count: incompleteApps?.length || 0 }
  } catch (error: any) {
    console.error("Error scheduling follow-up emails:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export async function markApplicationConverted(email: string) {
  try {
    const { error } = await supabase
      .from("applications")
      .update({
        completed: true,
        converted: true,
        conversion_date: new Date().toISOString(),
      })
      .eq("email", email)

    if (error) {
      console.error("Error marking application as converted:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error marking conversion:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
