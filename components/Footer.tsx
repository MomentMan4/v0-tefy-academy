"use client"

import Link from "next/link"
import { useState } from "react"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"
import CookiesModal from "./CookiesModal"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCookies, setShowCookies] = useState(false)

  return (
    <>
      <footer className="bg-gray-50 mt-auto py-12 px-6 border-t">
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
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={14} />
                <span>+1 (647) 555-1234</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                <span>Toronto, ON, Canada</span>
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
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TEFY Digital Academy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com/tefydigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/tefydigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <PrivacyModal open={showPrivacy} setOpen={setShowPrivacy} />
      <TermsModal open={showTerms} setOpen={setShowTerms} />
      <CookiesModal open={showCookies} setOpen={setShowCookies} />
    </>
  )
}
