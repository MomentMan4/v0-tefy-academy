import "./globals.css"
import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Suspense } from "react"
import Script from "next/script"
import CookieBanner from "@/components/CookieBanner"
import ConditionalAnalytics from "@/components/ConditionalAnalytics"

export const metadata = {
  title: "TEFY Digital Academy – Cybersecurity GRC Program",
  description: "Discover your path into Cybersecurity GRC. Practical training, flexible for all backgrounds.",
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-grow">{children}</main>
          <Footer />
          <CookieBanner />
          <ConditionalAnalytics />
        </Suspense>

        {/* Use Next.js Script component for better loading */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
          integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
          crossOrigin="anonymous"
          strategy="lazyOnload"
          onLoad={() => {
            console.log("html2pdf loaded via Next.js Script")
            // Set a global flag that the script is loaded
            if (typeof window !== "undefined") {
              window.html2pdfLoaded = true
            }
          }}
        />
      </body>
    </html>
  )
}
