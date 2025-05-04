"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const industryOptions = [
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Legal",
  "Technology",
  "Government",
  "Telecom",
  "Logistics",
  "Other",
]

const saveLeadToSupabase = async (lead: { name: string; email: string; industry: string }) => {
  const { error } = await supabase.from("leads").insert(lead)
  if (error) console.error("Failed to log lead:", error.message)
}

export default function AssessmentStartPageClient() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    otherIndustry: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.industry) {
      alert("Please complete all fields.")
      setIsSubmitting(false)
      return
    }

    const industryFinal = formData.industry === "Other" ? formData.otherIndustry : formData.industry

    const userInfo = {
      name: formData.name,
      email: formData.email,
      industry: industryFinal,
    }

    // Save to localStorage
    localStorage.setItem("assessment-user", JSON.stringify(userInfo))

    // Save to Supabase
    try {
      await saveLeadToSupabase(userInfo)
    } catch (error) {
      console.error("Error saving lead:", error)
      // Continue even if Supabase save fails
    }

    router.push("/assessment/questions")
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Let&apos;s Discover Your GRC Fit</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Industry</Label>
          <Select onValueChange={(value) => handleChange("industry", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.industry === "Other" && (
            <div className="mt-4">
              <Label>Specify Industry</Label>
              <Input
                type="text"
                placeholder="Your industry"
                value={formData.otherIndustry}
                onChange={(e) => handleChange("otherIndustry", e.target.value)}
                required
              />
            </div>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Start Assessment"}
        </Button>
      </form>
    </div>
  )
}
