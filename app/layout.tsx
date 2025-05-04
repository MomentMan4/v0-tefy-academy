import "./globals.css"
import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import CookieBanner from "@/components/CookieBanner"
import ConditionalAnalytics from "@/components/ConditionalAnalytics"
import { Suspense } from "react"

export const metadata = {
  title: "TEFY Digital Academy – Cybersecurity GRC Program",
  description: "Discover your path into Cybersecurity GRC. Practical training, flexible for all backgrounds.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js" async></script>
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-grow">{children}</main>
          <Footer />
          <CookieBanner />
          <ConditionalAnalytics />
        </Suspense>
      </body>
    </html>
  )
}
