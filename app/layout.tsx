import "./globals.css"
import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Script from "next/script"

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
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* Use Next.js Script component for better loading */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
          integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
