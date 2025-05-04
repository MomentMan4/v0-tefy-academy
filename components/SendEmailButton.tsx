"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface SendEmailButtonProps {
  email: string
  name: string
  topRoles: string[]
  radarScores?: { skill: string; value: number }[]
}

export default function SendEmailButton({ email, name, topRoles, radarScores }: SendEmailButtonProps) {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/assessment/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          topRoles: topRoles.slice(0, 3), // Ensure we only send top 3 roles
          radarScores: radarScores || [],
        }),
      })

      const data = await res.json()

      if (res.ok && data.status === "ok") {
        setSent(true)
      } else {
        console.error("Failed to send email:", data)
        setError(data.message || "Failed to send email. Please try again.")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Button onClick={handleSend} disabled={sent || isLoading} className="flex items-center gap-2">
        <Mail size={16} />
        {isLoading ? "Sending..." : sent ? "Email Sent Successfully" : "Email My Results"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {sent && <p className="text-green-500 text-sm mt-2">Check your inbox for your results!</p>}
    </div>
  )
}
