import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // SQL query to add missing columns
    const sqlQuery = `
    -- Add missing columns to submissions table
    ALTER TABLE IF EXISTS submissions 
    ADD COLUMN IF NOT EXISTS radar_scores JSONB,
    ADD COLUMN IF NOT EXISTS skill_breakdown JSONB,
    ADD COLUMN IF NOT EXISTS recommended_certifications TEXT[],
    ADD COLUMN IF NOT EXISTS career_path_suggestion TEXT;
    `

    // Execute the SQL query
    await supabase.rpc("execute_sql", { sql: sqlQuery })

    return NextResponse.json({ status: "Submissions table updated successfully" })
  } catch (error) {
    console.error("Table update failed", error)
    return NextResponse.json({ error: "Failed to update submissions table" }, { status: 500 })
  }
}
