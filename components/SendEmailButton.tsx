"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SendEmailButtonProps {
  email: string
  name: string
  topRoles: string[]
}

export default function SendEmailButton({ email, name, topRoles }: SendEmailButtonProps) {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/assessment/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, topRoles }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        console.error("Failed to send email:", await res.text())
      }
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSend} disabled={sent || isLoading}>
      {isLoading ? "Sending..." : sent ? "📧 Sent to your Email" : "📬 Email My Results"}
    </Button>
  )
}
