"use client"

import { useState, useEffect } from "react"
import CookieModal from "./CookieModal"

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) setShow(true)
  }, [])

  const handleConsent = (choice: "accept" | "reject") => {
    const config =
      choice === "accept"
        ? { essential: true, analytics: true, marketing: true }
        : { essential: true, analytics: false, marketing: false }

    localStorage.setItem("cookie-consent", JSON.stringify(config))
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
        </div>
      )}

      <CookieModal open={showModal} setOpen={setShowModal} setBannerVisible={setShow} />
    </>
  )
}
