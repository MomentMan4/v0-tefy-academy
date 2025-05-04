import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // Read the SQL file content
    const sqlQuery = `
    -- Create registrations table
    CREATE TABLE IF NOT EXISTS registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      program TEXT NOT NULL,
      cohort TEXT,
      has_internship BOOLEAN DEFAULT FALSE,
      payment_id TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      payment_amount INTEGER NOT NULL,
      payment_date TIMESTAMPTZ NOT NULL,
      source TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Create index on email for faster lookups
    CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations(email);

    -- Create index on payment_id for faster lookups
    CREATE INDEX IF NOT EXISTS registrations_payment_id_idx ON registrations(payment_id);

    -- Add RLS policies
    ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

    -- Create function to update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to update the updated_at timestamp
    CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    `

    // Execute the SQL query
    await supabase.rpc("execute_sql", { sql: sqlQuery })

    return NextResponse.json({ status: "Registrations table initialized" })
  } catch (error) {
    console.error("Table creation failed", error)
    return NextResponse.json({ error: "Failed to initialize registrations table" }, { status: 500 })
  }
}
