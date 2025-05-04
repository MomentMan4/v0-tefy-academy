"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SendEmailButtonProps {
  email: string
  html: string
}

export default function SendEmailButton({ email, html }: SendEmailButtonProps) {
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    const res = await fetch("/api/assessment/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, html }),
    })

    if (res.ok) setSent(true)
  }

  return (
    <Button onClick={handleSend} disabled={sent}>
      {sent ? "📧 Sent to your Email" : "📬 Email My Results"}
    </Button>
  )
}
