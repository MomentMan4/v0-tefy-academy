import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET() {
  try {
    // Leads table
    await supabase.rpc("execute_sql", {
      sql: `
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        industry TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      `,
    })

    // Submissions table
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

    // Ratings table
    await supabase.rpc("execute_sql", {
      sql: `
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMPTZ DEFAULT now()
      );
      `,
    })

    return NextResponse.json({ status: "Tables initialized" })
  } catch (error) {
    console.error("Table creation failed", error)
    return NextResponse.json({ error: "Failed to initialize tables" }, { status: 500 })
  }
}
