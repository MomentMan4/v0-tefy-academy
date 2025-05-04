"use client"

import Link from "next/link"
import { useState } from "react"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"
import CookiesModal from "./CookiesModal"
import { Mail } from "lucide-react"

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCookies, setShowCookies] = useState(false)

  return (
    <>
      <footer className="bg-gray-50 mt-auto py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png"
                alt="TEFY Digital Academy"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering professionals to transition into cybersecurity GRC careers through practical, accessible
              training.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/program" className="text-muted-foreground hover:text-primary transition-colors">
                  Program Details
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-muted-foreground hover:text-primary transition-colors">
                  GRC Assessment
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-muted-foreground hover:text-primary transition-colors">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={14} />
                <a href="mailto:admissions@tefydigital.com" className="hover:text-primary transition-colors">
                  admissions@tefydigital.com
                </a>
              </li>
              <li>
                <a
                  href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Book a consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowCookies(true)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-200 flex justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TEFY Digital Academy. All rights reserved.
          </p>
        </div>
      </footer>

      <PrivacyModal open={showPrivacy} setOpen={setShowPrivacy} />
      <TermsModal open={showTerms} setOpen={setShowTerms} />
      <CookiesModal open={showCookies} setOpen={setShowCookies} />
    </>
  )
}
