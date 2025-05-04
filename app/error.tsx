"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-red-500">Something went wrong</h1>
      <p className="text-muted-foreground mt-4 mb-6 max-w-md">
        We apologize for the inconvenience. Please try again later.
      </p>
      <button
        onClick={reset}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
