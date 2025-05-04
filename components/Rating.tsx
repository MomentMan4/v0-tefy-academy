"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const emojis = ["😡", "😐", "🙂", "😀", "🤩"]

export default function Rating({ email }: { email: string }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleRating = async (rating: number) => {
    setSelected(rating)
    setSubmitted(true)

    const { error } = await supabase.from("ratings").insert({
      email,
      rating,
    })

    if (error) console.error("Rating save failed:", error.message)
  }

  return (
    <div className="text-center space-y-2 mt-10">
      <p className="text-sm text-muted-foreground">How helpful was this tool?</p>
      <div className="flex justify-center gap-3 text-3xl">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleRating(index + 1)}
            className={cn("transition hover:scale-110", selected === index + 1 && "scale-125")}
            disabled={submitted}
            aria-label={`Rate ${index + 1} out of 5`}
          >
            {emoji}
          </button>
        ))}
      </div>
      {submitted && <p className="text-sm text-primary mt-2">Thanks for your feedback!</p>}
    </div>
  )
}
