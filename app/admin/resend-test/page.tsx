"use client"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import type React from "react"

import { useState } from "react"
import { Mail, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResendTestPage() {
  const [activeTab, setActiveTab] = useState("simple")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)

  // Simple email form state
  const [simpleForm, setSimpleForm] = useState({
    to: "",
    subject: "Test Email from TEFY Academy",
    text: "This is a test email sent from the TEFY Academy admin dashboard.",
  })

  // Template email form state
  const [templateForm, setTemplateForm] = useState({
    to: "",
    template: "results",
    name: "Test User",
    score: "85",
    roles: "GRC Analyst, Compliance Specialist, Risk Coordinator",
  })

  // Handle simple form change
  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSimpleForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle template form change
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTemplateForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setTemplateForm((prev) => ({ ...prev, [name]: value }))
  }

  // Send simple email
  const sendSimpleEmail = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/email/send-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simpleForm),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Email sent successfully!",
          data,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send email",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Send template email
  const sendTemplateEmail = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/email/send-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateForm),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Template email sent successfully!",
          data,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send template email",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Resend Email Test Interface</h1>
      </div>

      <Tabs defaultValue="simple" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple Email</TabsTrigger>
          <TabsTrigger value="template">Template Email</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Simple Email</CardTitle>
              <CardDescription>Test sending a simple text email using Resend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">Recipient Email</Label>
                <Input
                  id="to"
                  name="to"
                  value={simpleForm.to}
                  onChange={handleSimpleChange}
                  placeholder="recipient@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={simpleForm.subject}
                  onChange={handleSimpleChange}
                  placeholder="Email Subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Email Content</Label>
                <Textarea
                  id="text"
                  name="text"
                  value={simpleForm.text}
                  onChange={handleSimpleChange}
                  placeholder="Email content..."
                  rows={5}
                />
              </div>

              <Button className="w-full" onClick={sendSimpleEmail} disabled={isLoading || !simpleForm.to}>
                <Mail className="mr-2 h-4 w-4" />
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Template Email</CardTitle>
              <CardDescription>Test sending an email using a predefined template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">Recipient Email</Label>
                <Input
                  id="to"
                  name="to"
                  value={templateForm.to}
                  onChange={handleTemplateChange}
                  placeholder="recipient@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Email Template</Label>
                <Select value={templateForm.template} onValueChange={(value) => handleSelectChange("template", value)}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="results">Assessment Results</SelectItem>
                    <SelectItem value="payment">Payment Confirmation</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="followup">Application Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={templateForm.name}
                    onChange={handleTemplateChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    name="score"
                    value={templateForm.score}
                    onChange={handleTemplateChange}
                    placeholder="85"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roles">Recommended Roles (comma separated)</Label>
                <Input
                  id="roles"
                  name="roles"
                  value={templateForm.roles}
                  onChange={handleTemplateChange}
                  placeholder="GRC Analyst, Compliance Specialist"
                />
              </div>

              <Button className="w-full" onClick={sendTemplateEmail} disabled={isLoading || !templateForm.to}>
                <Mail className="mr-2 h-4 w-4" />
                {isLoading ? "Sending..." : "Send Template Email"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Result display */}
      {result && (
        <Card className={result.success ? "border-green-500" : "border-red-500"}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              {result.success ? (
                <>
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-500">Success</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-500">Error</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{result.message}</p>
            {result.data && (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
