"use client"

import { Analytics } from "@vercel/analytics/react"
import { useEffect, useState } from "react"

export default function ConditionalAnalytics() {
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true)

    try {
      // Check if user has consented to analytics cookies
      const consent = JSON.parse(localStorage.getItem("cookie-consent") || "{}")
      setShowAnalytics(consent?.analytics === true)

      // Add event listener to update analytics if consent changes
      const handleConsentChange = (event: CustomEvent) => {
        try {
          const updatedConsent = event.detail || JSON.parse(localStorage.getItem("cookie-consent") || "{}")
          setShowAnalytics(updatedConsent?.analytics === true)
          console.log("Analytics consent updated:", updatedConsent?.analytics === true)
        } catch (error) {
          console.error("Error parsing updated cookie consent:", error)
          setShowAnalytics(false)
        }
      }

      // Listen for a custom event that might be triggered when consent changes
      window.addEventListener("cookie-consent-changed", handleConsentChange as EventListener)

      return () => {
        window.removeEventListener("cookie-consent-changed", handleConsentChange as EventListener)
      }
    } catch (error) {
      console.error("Error parsing cookie consent:", error)
      setShowAnalytics(false)
    }
  }, [])

  // Only render Analytics component if user has consented and we're on client side
  if (!isClient) return null

  return showAnalytics ? (
    <>
      <Analytics debug={process.env.NODE_ENV === "development"} />
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-0 right-0 bg-green-100 text-green-800 text-xs p-1 z-50">Analytics Enabled</div>
      )}
    </>
  ) : null
}
