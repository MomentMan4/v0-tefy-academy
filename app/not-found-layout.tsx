import "./globals.css"
import type { ReactNode } from "react"

export default function NotFoundLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Page Not Found | TEFY Digital Academy</title>
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  )
}
