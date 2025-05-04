"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ApplyPage() {
  const [includeInternship, setIncludeInternship] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleApply = () => {
    // Validate form
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email")
      return
    }

    // Store form data in localStorage for potential use later
    localStorage.setItem("enrollment-data", JSON.stringify(formData))

    // Redirect to Stripe checkout
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>
      </div>

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

      <div className="border-t mt-8 pt-6 text-center">
        <p className="mb-3 text-muted-foreground">Need more clarity before enrolling?</p>
        <a
          href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          Book a Free Info Session
        </a>
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
