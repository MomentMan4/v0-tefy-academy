"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowRight, Shield, Calendar, Users, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { savePartialApplication, markApplicationConverted } from "@/app/actions/applications"
import { CAL_BOOKING_URL, PAYMENT_OPTIONS } from "@/lib/constants"

export default function ApplyPage() {
  const [includeInternship, setIncludeInternship] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStripeRedirect, setIsStripeRedirect] = useState(false)
  const [applicationSaved, setApplicationSaved] = useState(false)

  useEffect(() => {
    // Check if this is a redirect from Stripe
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("stripe_redirect")) {
      setIsStripeRedirect(true)

      // If we have stored application data, mark it as converted
      const storedData = localStorage.getItem("enrollment-data")
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          if (parsedData.email) {
            markApplicationConverted(parsedData.email).catch((err) =>
              console.error("Error marking application as converted:", err),
            )
          }
        } catch (e) {
          console.error("Error parsing stored enrollment data:", e)
        }
      }
    }

    // Check for saved application data
    const storedData = localStorage.getItem("enrollment-data")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setFormData((prevData) => ({
          ...prevData,
          ...parsedData,
        }))
      } catch (e) {
        console.error("Error parsing stored enrollment data:", e)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = async () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      alert("Please enter your name and email")
      return
    }

    setIsSubmitting(true)

    try {
      // Save partial application data
      const result = await savePartialApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        completed: false,
        step: 1,
      })

      if (result.success) {
        setApplicationSaved(true)

        // Store form data in localStorage for potential use later
        localStorage.setItem("enrollment-data", JSON.stringify(formData))

        // Proceed to next step
        setStep(2)
        window.scrollTo(0, 0)
      } else {
        console.error("Failed to save application:", result.error)
        // Still proceed to next step even if saving fails
        setStep(2)
        window.scrollTo(0, 0)
      }
    } catch (error) {
      console.error("Error saving application:", error)
      // Still proceed to next step even if saving fails
      setStep(2)
      window.scrollTo(0, 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApply = async () => {
    // Validate form
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email")
      return
    }

    setIsSubmitting(true)

    try {
      // Update application with final step
      await savePartialApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        completed: false,
        step: 2,
      })

      // Store form data in localStorage for potential use later
      localStorage.setItem("enrollment-data", JSON.stringify(formData))

      // Redirect to Stripe checkout
      const url = includeInternship ? PAYMENT_OPTIONS.programWithInternship.str : PAYMENT_OPTIONS.programOnly.str

      window.location.href = url
    } catch (error) {
      console.error("Error updating application before payment:", error)

      // Still redirect to Stripe even if saving fails
      const url = includeInternship ? PAYMENT_OPTIONS.programWithInternship.str : PAYMENT_OPTIONS.programOnly.str

      window.location.href = url
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Back button for Stripe redirects */}
      {isStripeRedirect && (
        <div className="w-full bg-amber-50 p-4 border-b border-amber-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-amber-800">Need more time to decide?</p>
            <Link href="/program" className="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-medium">
              <ArrowLeft size={16} />
              Back to Program Details
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Apply for the GRC Mastery Program</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take the first step toward your new career in cybersecurity governance, risk, and compliance.
          </p>
        </div>
      </section>

      {/* Application Process */}
      <section className="w-full py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                } font-bold`}
              >
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                } font-bold`}
              >
                2
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                } font-bold`}
              >
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span className="w-20 text-center">Your Info</span>
              <span className="w-20 text-center">Program Options</span>
              <span className="w-20 text-center">Payment</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-base">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="mt-1 h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="mt-1 h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="mt-1 h-12"
                  />
                </div>

                <Button onClick={handleNextStep} className="w-full h-12 mt-4" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Continue"} <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">Choose Your Program Option</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Standard Option */}
                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    !includeInternship
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                  onClick={() => setIncludeInternship(false)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Standard Program</h3>
                      <p className="text-primary font-medium text-lg">$700 CAD</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        !includeInternship ? "border-primary bg-primary text-white" : "border-gray-300"
                      }`}
                    >
                      {!includeInternship && <CheckCircle size={14} />}
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">5-week intensive program</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">15 live interactive sessions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">Hands-on labs and case studies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">Completion certificate</span>
                    </li>
                  </ul>
                </div>

                {/* Premium Option */}
                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    includeInternship
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                  onClick={() => setIncludeInternship(true)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Program + Internship</h3>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">RECOMMENDED</span>
                      </div>
                      <p className="text-primary font-medium text-lg">$1,000 CAD</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        includeInternship ? "border-primary bg-primary text-white" : "border-gray-300"
                      }`}
                    >
                      {includeInternship && <CheckCircle size={14} />}
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">Everything in Standard Program</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">4-week hands-on internship</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">Real-world project experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">Portfolio-building opportunity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-sm">Enhanced job placement support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleApply} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          )}

          {/* Program Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Industry-Recognized</h3>
              <p className="text-sm text-muted-foreground">
                Our curriculum is aligned with industry standards and developed by GRC experts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Weekend-focused schedule designed for working professionals with recordings available.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Career Support</h3>
              <p className="text-sm text-muted-foreground">
                Resume reviews, interview preparation, and networking opportunities in a supportive community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Community Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image src="/community.jpeg" alt="GRC Program Community" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Our graduates have successfully transitioned into GRC roles at companies across various industries,
                including finance, healthcare, and technology.
              </p>
              <div className="flex justify-center">
                <a
                  href={CAL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  Schedule a call with our admissions team <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">When does the next cohort start?</h3>
              <p className="text-muted-foreground">
                Our next cohort begins on the first Wednesday of next month. We run cohorts quarterly, so if you miss
                this one, you can join the next one.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">What is your refund policy?</h3>
              <p className="text-muted-foreground">
                All payments are final. However, you may defer your enrollment to a future cohort if your circumstances
                change. Special cases for refunds are considered on an individual basis.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">How does the internship work?</h3>
              <p className="text-muted-foreground">
                The 4-week internship follows the main program and provides hands-on experience with real-world GRC
                projects. You'll work on compliance documentation, risk assessments, and more. You will also get close
                mentoring and career support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-gradient-to-br from-primary to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-lg mb-8 opacity-90">
            Secure your spot in our next cohort and take the first step toward a rewarding career in cybersecurity GRC.
          </p>
          <Button variant="secondary" size="lg" asChild className="px-8">
            <a href="#top" onClick={() => setStep(1)}>
              Apply Now
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
