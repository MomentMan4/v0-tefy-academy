"use client"

import "./globals.css"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <a href="/" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors">
          Return to Home
        </a>
      </body>
    </html>
  )
}
