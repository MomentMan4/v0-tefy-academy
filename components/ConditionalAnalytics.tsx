"use client"

import { Analytics } from "@vercel/analytics/react"
import { useEffect, useState } from "react"

export default function ConditionalAnalytics() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    try {
      const consent = JSON.parse(localStorage.getItem("cookie-consent") || "{}")
      setShowAnalytics(consent?.analytics === true)
    } catch (error) {
      console.error("Error parsing cookie consent:", error)
      setShowAnalytics(false)
    }
  }, [])

  if (!showAnalytics) return null
  return <Analytics />
}
