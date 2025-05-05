"use client"

import { Analytics } from "@vercel/analytics/react"
import { useEffect, useState } from "react"

export default function ConditionalAnalytics() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    try {
      // Check if user has consented to analytics cookies
      const consent = JSON.parse(localStorage.getItem("cookie-consent") || "{}")
      setShowAnalytics(consent?.analytics === true)

      // Add event listener to update analytics if consent changes
      const handleConsentChange = () => {
        try {
          const updatedConsent = JSON.parse(localStorage.getItem("cookie-consent") || "{}")
          setShowAnalytics(updatedConsent?.analytics === true)
        } catch (error) {
          console.error("Error parsing updated cookie consent:", error)
          setShowAnalytics(false)
        }
      }

      // Listen for a custom event that might be triggered when consent changes
      window.addEventListener("cookie-consent-changed", handleConsentChange)

      return () => {
        window.removeEventListener("cookie-consent-changed", handleConsentChange)
      }
    } catch (error) {
      console.error("Error parsing cookie consent:", error)
      setShowAnalytics(false)
    }
  }, [])

  // Only render Analytics component if user has consented
  return showAnalytics ? <Analytics /> : null
}
