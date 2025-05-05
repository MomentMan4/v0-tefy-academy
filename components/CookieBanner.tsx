"use client"

import { useState, useEffect } from "react"
import CookieModal from "./CookieModal"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"
import CookiesModal from "./CookiesModal"

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCookies, setShowCookies] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (consent) {
      try {
        const { timestamp } = JSON.parse(consent)
        const expired = Date.now() - timestamp > 180 * 24 * 60 * 60 * 1000 // 180 days
        if (expired) {
          localStorage.removeItem("cookie-consent")
          setShow(true)
        }
      } catch (error) {
        console.error("Error parsing cookie consent:", error)
        setShow(true)
      }
    } else {
      setShow(true)
    }
  }, [])

  const handleConsent = (choice: "accept" | "reject") => {
    const config =
      choice === "accept"
        ? { essential: true, analytics: true, marketing: true, timestamp: Date.now() }
        : { essential: true, analytics: false, marketing: false, timestamp: Date.now() }

    localStorage.setItem("cookie-consent", JSON.stringify(config))

    // Dispatch a custom event to notify components about consent change
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie-consent-changed"))
    }

    setShow(false)
  }

  return (
    <>
      {show && (
        <div className="fixed bottom-4 right-4 z-50 bg-white border shadow-lg p-4 rounded-lg w-[320px]">
          <p className="text-sm mb-2">
            We use cookies to enhance your experience, analyze usage, and support marketing efforts. You can customize
            your preferences anytime.
          </p>
          <div className="flex justify-between gap-2 mt-2">
            <button onClick={() => handleConsent("reject")} className="text-sm underline text-muted-foreground">
              Reject All
            </button>
            <button onClick={() => setShowModal(true)} className="text-sm border rounded px-3 py-1 hover:bg-muted">
              Select Options
            </button>
            <button onClick={() => handleConsent("accept")} className="text-sm bg-primary text-white px-3 py-1 rounded">
              Accept All
            </button>
          </div>
          <div className="mt-3 text-center">
            <button onClick={() => setShowPrivacy(true)} className="text-xs underline text-muted-foreground mx-1">
              Privacy Policy
            </button>
            <button onClick={() => setShowTerms(true)} className="text-xs underline text-muted-foreground mx-1">
              Terms of Use
            </button>
            <button onClick={() => setShowCookies(true)} className="text-xs underline text-muted-foreground mx-1">
              Cookie Policy
            </button>
          </div>
        </div>
      )}

      <CookieModal open={showModal} setOpen={setShowModal} setBannerVisible={setShow} />
      <PrivacyModal open={showPrivacy} setOpen={setShowPrivacy} />
      <TermsModal open={showTerms} setOpen={setShowTerms} />
      <CookiesModal open={showCookies} setOpen={setShowCookies} />
    </>
  )
}
