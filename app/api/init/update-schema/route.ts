import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Current schema version
const SCHEMA_VERSION = 2

export async function GET() {
  try {
    // Check if schema_versions table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "schema_versions")
      .single()

    // If schema_versions table doesn't exist, create it
    if (tableCheckError || !tableExists) {
      await supabase.rpc("execute_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS schema_versions (
            id SERIAL PRIMARY KEY,
            version INTEGER NOT NULL,
            applied_at TIMESTAMPTZ DEFAULT now()
          );
        `,
      })
    }

    // Get current schema version
    const { data: versionData, error: versionError } = await supabase
      .from("schema_versions")
      .select("version")
      .order("id", { ascending: false })
      .limit(1)
      .single()

    const currentVersion = versionData?.version || 0

    // If already at the latest version, return
    if (currentVersion >= SCHEMA_VERSION) {
      return NextResponse.json({
        status: "success",
        message: `Schema already at version ${currentVersion}`,
      })
    }

    // Apply migrations based on current version
    if (currentVersion < 1) {
      // Version 1: Add basic extended columns
      await supabase.rpc("execute_sql", {
        sql: `
          ALTER TABLE IF EXISTS submissions 
          ADD COLUMN IF NOT EXISTS radar_scores JSONB,
          ADD COLUMN IF NOT EXISTS skill_breakdown JSONB,
          ADD COLUMN IF NOT EXISTS recommended_certifications TEXT[];
        `,
      })
    }

    if (currentVersion < 2) {
      // Version 2: Add career path suggestion column
      await supabase.rpc("execute_sql", {
        sql: `
          ALTER TABLE IF EXISTS submissions 
          ADD COLUMN IF NOT EXISTS career_path_suggestion TEXT;
        `,
      })
    }

    // Update schema version
    await supabase.from("schema_versions").insert({ version: SCHEMA_VERSION })

    return NextResponse.json({
      status: "success",
      message: `Schema updated to version ${SCHEMA_VERSION}`,
    })
  } catch (error) {
    console.error("Schema update failed", error)
    return NextResponse.json({ error: "Failed to update schema", details: error }, { status: 500 })
  }
}
