import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // First, ensure the submissions table exists
    await ensureSubmissionsTable()

    // Then check for each column and add if missing
    const columnsToAdd = [
      { name: "radar_scores", type: "jsonb" },
      { name: "skill_breakdown", type: "jsonb" },
      { name: "recommended_certifications", type: "text[]" },
      { name: "career_path_suggestion", type: "text" },
    ]

    for (const column of columnsToAdd) {
      await ensureColumnExists("submissions", column.name, column.type)
    }

    return NextResponse.json({
      status: "success",
      message: "All required columns have been checked and added if missing",
    })
  } catch (error) {
    console.error("Column check/add failed", error)
    return NextResponse.json({ error: "Failed to ensure columns exist", details: error }, { status: 500 })
  }
}

// Helper function to ensure the submissions table exists
async function ensureSubmissionsTable() {
  try {
    // Check if submissions table exists
    const { count, error } = await supabase.from("submissions").select("*", { count: "exact", head: true })

    if (error) {
      // Table likely doesn't exist, create it
      await supabase.rpc("execute_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS submissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            industry TEXT,
            score INTEGER,
            roles TEXT[],
            is_bridge BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT now()
          );
        `,
      })
    }
  } catch (error) {
    console.error("Error checking/creating submissions table:", error)
    throw error
  }
}

// Helper function to ensure a column exists
async function ensureColumnExists(table: string, column: string, type: string) {
  try {
    // Try to select the column to see if it exists
    const { error } = await supabase.from(table).select(column).limit(1)

    if (error && error.message.includes("column")) {
      // Column doesn't exist, add it
      await supabase.rpc("execute_sql", {
        sql: `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${type};`,
      })
      console.log(`Added column ${column} to ${table}`)
    }
  } catch (error) {
    console.error(`Error checking/adding column ${column}:`, error)
    // Don't throw, just log the error and continue with other columns
  }
}
