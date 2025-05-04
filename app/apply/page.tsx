"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ApplyPage() {
  const [includeInternship, setIncludeInternship] = useState(false)

  const handleApply = () => {
    const url = includeInternship
      ? "https://buy.stripe.com/cN2aGAg6U2mPdb2bIK"
      : "https://buy.stripe.com/4gw9Cwf2Qd1tdb23cd"

    window.location.href = url
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Apply for the Cybersecurity GRC Program</h1>
      <p className="text-muted-foreground text-center text-lg">
        Secure your seat for our next 5-week cohort. Includes live classes, case studies, and a capstone project. You
        may also opt-in for a practical internship after the course.
      </p>

      <div className="bg-muted p-6 rounded-md space-y-4 text-sm">
        <p>
          <strong>Class Only:</strong> $700 CAD
        </p>
        <p>
          <strong>Class + Internship (Optional):</strong> $1000 CAD
        </p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeInternship}
            onChange={() => setIncludeInternship(!includeInternship)}
          />
          Include 4-week hands-on internship (+$300 CAD)
        </label>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          All payments are final. You may defer to a future session, but refunds are not issued except in special cases.
        </p>
        <Button onClick={handleApply}>Proceed to Payment</Button>
      </div>
    </div>
  )
}
