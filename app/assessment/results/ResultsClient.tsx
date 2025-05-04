"use client"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function logAssessmentToSupabase({
  name,
  email,
  industry,
  score,
  roles,
  isBridge,
}: {
  name: string
  email: string
  industry: string
  score: number
  roles: string[]
  isBridge: boolean
}) {
  const { error } = await supabase.from("submissions").insert({
    name,
    email,
    industry,
    score,
    roles,
    is_bridge: isBridge,
  })

  if (error) {
    console.error("Supabase logging failed:", error.message)
  }
}

export default function ResultsClient() {
  return <p>Results Client</p>
}
