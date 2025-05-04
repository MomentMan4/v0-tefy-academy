"use client"

import { Dialog } from "@headlessui/react"
import { useState } from "react"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"
import CookiesModal from "./CookiesModal"

export default function CookieModal({
  open,
  setOpen,
  setBannerVisible,
}: {
  open: boolean
  setOpen: (val: boolean) => void
  setBannerVisible: (val: boolean) => void
}) {
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  })
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCookies, setShowCookies] = useState(false)

  const updatePref = (key: keyof typeof prefs) => {
    if (key === "essential") return // cannot toggle
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const savePrefs = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        ...prefs,
        timestamp: Date.now(),
      }),
    )
    setOpen(false)
    setBannerVisible(false)
  }

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full p-6 rounded shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-medium">Manage Cookie Preferences</Dialog.Title>

            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between items-center">
                  <p>
                    <strong>Essential</strong> (Required)
                  </p>
                  <span className="text-muted-foreground">Always On</span>
                </div>
                <p className="text-muted-foreground">These cookies are necessary for core site functionality.</p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <p>
                    <strong>Analytics</strong>
                  </p>
                  <input type="checkbox" checked={prefs.analytics} onChange={() => updatePref("analytics")} />
                </div>
                <p className="text-muted-foreground">Helps us understand site usage to improve user experience.</p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <p>
                    <strong>Marketing</strong>
                  </p>
                  <input type="checkbox" checked={prefs.marketing} onChange={() => updatePref("marketing")} />
                </div>
                <p className="text-muted-foreground">Used for email campaigns and future retargeting tools.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setOpen(false)} className="text-sm underline">
                Cancel
              </button>
              <button onClick={savePrefs} className="text-sm bg-primary text-white px-4 py-1 rounded">
                Save Preferences
              </button>
            </div>

            <div className="pt-2 border-t text-center">
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
          </Dialog.Panel>
        </div>
      </Dialog>

      <PrivacyModal open={showPrivacy} setOpen={setShowPrivacy} />
      <TermsModal open={showTerms} setOpen={setShowTerms} />
      <CookiesModal open={showCookies} setOpen={setShowCookies} />
    </>
  )
}
