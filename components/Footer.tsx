"use client"

import Link from "next/link"
import { useState } from "react"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"
import CookiesModal from "./CookiesModal"

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCookies, setShowCookies] = useState(false)

  return (
    <>
      <footer className="bg-muted mt-20 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TEFY Digital Academy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/assessment" className="hover:text-primary">
              Self-Assessment
            </Link>
            <Link href="/program" className="hover:text-primary">
              Program
            </Link>
            <Link href="/apply" className="hover:text-primary">
              Apply
            </Link>
            <Link href="mailto:admissions@tefydigital.com" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-gray-200 flex justify-center gap-6 text-xs text-muted-foreground">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-primary">
            Privacy Policy
          </button>
          <button onClick={() => setShowTerms(true)} className="hover:text-primary">
            Terms & Conditions
          </button>
          <button onClick={() => setShowCookies(true)} className="hover:text-primary">
            Cookie Policy
          </button>
        </div>
      </footer>

      <PrivacyModal open={showPrivacy} setOpen={setShowPrivacy} />
      <TermsModal open={showTerms} setOpen={setShowTerms} />
      <CookiesModal open={showCookies} setOpen={setShowCookies} />
    </>
  )
}
