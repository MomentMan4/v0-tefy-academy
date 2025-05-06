"use client"

import type React from "react"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, Save, Mail, Globe, CreditCard, Shield, Palette } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AdminHeader from "../components/AdminHeader"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)
  const supabase = createClientComponentClient()

  // General settings form state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "TEFY Academy",
    siteDescription: "Discover your path into Cybersecurity GRC. Practical training, flexible for all backgrounds.",
    contactEmail: "admissions@tefydigital.com",
    enableRegistrations: true,
    maintenanceMode: false,
    analyticsId: "",
    timezone: "America/Toronto",
  })

  // Email settings form state
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: "noreply@tefydigital.com",
    replyToEmail: "admissions@tefydigital.com",
    emailFooter: "© TEFY Digital Academy. All rights reserved.",
    enableEmailNotifications: true,
    adminNotificationEmail: "admin@tefydigital.com",
    emailBatchSize: "50",
    emailRetryAttempts: "3",
  })

  // Payment settings form state
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "CAD",
    programPrice: "700",
    internshipPrice: "300",
    enablePayments: true,
    taxRate: "13",
    stripeLiveMode: false,
    paymentMethods: ["card", "apple", "google"],
  })

  // Security settings form state
  const [securitySettings, setSecuritySettings] = useState({
    enableCaptcha: true,
    maxLoginAttempts: "5",
    sessionTimeout: "24",
    requireEmailVerification: true,
    enableTwoFactor: false,
    passwordMinLength: "8",
    passwordRequireSpecial: true,
  })

  // Email template settings
  const [templateSettings, setTemplateSettings] = useState({
    defaultTemplate: "results",
    customizeTemplates: true,
    enableHtmlEmails: true,
    enablePlainTextFallback: true,
  })

  // Email template content
  const [templateContent, setTemplateContent] = useState({
    results: {
      subject: "Your TEFY Academy Assessment Results",
      heading: "Your Cybersecurity Career Assessment Results",
      intro: "Congratulations on completing your assessment! Here are your personalized results.",
      ctaText: "Explore Your Career Path",
      ctaUrl: "https://tefydigital.com/program",
    },
    payment: {
      subject: "Payment Confirmation - TEFY Academy",
      heading: "Thank You for Your Payment",
      intro: "Your payment has been successfully processed. Here are your payment details.",
      ctaText: "Access Your Dashboard",
      ctaUrl: "https://tefydigital.com/dashboard",
    },
    onboarding: {
      subject: "Welcome to TEFY Academy",
      heading: "Welcome to Your Cybersecurity Journey",
      intro: "We're excited to have you join TEFY Academy. Here's how to get started.",
      ctaText: "Start Your Journey",
      ctaUrl: "https://tefydigital.com/onboarding",
    },
  })

  // Load settings from database on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // In a real implementation, you would fetch settings from your database
        // For now, we'll just use the default values
        console.log("Loading settings from database...")
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    loadSettings()
  }, [])

  // Handle general settings change
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle email settings change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle payment settings change
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle security settings change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle template settings change
  const handleTemplateSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTemplateSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Handle template content change
  const handleTemplateContentChange = (template: string, field: string, value: string) => {
    setTemplateContent((prev) => ({
      ...prev,
      [template]: {
        ...prev[template as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  // Handle switch change
  const handleSwitchChange = (section: string, name: string, checked: boolean) => {
    if (section === "general") {
      setGeneralSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (section === "email") {
      setEmailSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (section === "payment") {
      setPaymentSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (section === "security") {
      setSecuritySettings((prev) => ({ ...prev, [name]: checked }))
    } else if (section === "template") {
      setTemplateSettings((prev) => ({ ...prev, [name]: checked }))
    }
  }

  // Handle select change
  const handleSelectChange = (section: string, name: string, value: string) => {
    if (section === "general") {
      setGeneralSettings((prev) => ({ ...prev, [name]: value }))
    } else if (section === "email") {
      setEmailSettings((prev) => ({ ...prev, [name]: value }))
    } else if (section === "payment") {
      setPaymentSettings((prev) => ({ ...prev, [name]: value }))
    } else if (section === "security") {
      setSecuritySettings((prev) => ({ ...prev, [name]: value }))
    } else if (section === "template") {
      setTemplateSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true)
    setSaveStatus(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the settings to your database
      console.log("General Settings:", generalSettings)
      console.log("Email Settings:", emailSettings)
      console.log("Payment Settings:", paymentSettings)
      console.log("Security Settings:", securitySettings)
      console.log("Template Settings:", templateSettings)
      console.log("Template Content:", templateContent)

      setSaveStatus({
        success: true,
        message: "Settings saved successfully!",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveStatus({
        success: false,
        message: "Failed to save settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Test email template
  const testEmailTemplate = async (template: string) => {
    try {
      const testEmail = prompt("Enter email address to send test template:")
      if (!testEmail) return

      const response = await fetch("/api/admin/email/send-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: testEmail,
          template,
          name: "Test User",
          score: "85",
          roles: "GRC Analyst, Compliance Specialist, Risk Coordinator",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Test email sent successfully to ${testEmail}!`)
      } else {
        alert(`Failed to send test email: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      alert("An unexpected error occurred while sending the test email.")
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Settings" description="Manage your TEFY Academy platform settings" />

      {saveStatus && (
        <Alert variant={saveStatus.success ? "default" : "destructive"}>
          <div className="flex items-center">
            {saveStatus.success ? <Check className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
            <AlertTitle>{saveStatus.success ? "Success" : "Error"}</AlertTitle>
          </div>
          <AlertDescription>{saveStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="general" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="analyticsId">Google Analytics ID</Label>
                  <Input
                    id="analyticsId"
                    name="analyticsId"
                    value={generalSettings.analyticsId}
                    onChange={handleGeneralChange}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleSelectChange("general", "timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Toronto">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableRegistrations">Enable Registrations</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch
                    id="enableRegistrations"
                    checked={generalSettings.enableRegistrations}
                    onCheckedChange={(checked) => handleSwitchChange("general", "enableRegistrations", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSwitchChange("general", "maintenanceMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email sending settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyToEmail">Reply-To Email</Label>
                  <Input
                    id="replyToEmail"
                    name="replyToEmail"
                    type="email"
                    value={emailSettings.replyToEmail}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailFooter">Email Footer</Label>
                <Textarea
                  id="emailFooter"
                  name="emailFooter"
                  value={emailSettings.emailFooter}
                  onChange={handleEmailChange}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminNotificationEmail">Admin Notification Email</Label>
                  <Input
                    id="adminNotificationEmail"
                    name="adminNotificationEmail"
                    type="email"
                    value={emailSettings.adminNotificationEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailBatchSize">Email Batch Size</Label>
                  <Input
                    id="emailBatchSize"
                    name="emailBatchSize"
                    type="number"
                    value={emailSettings.emailBatchSize}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailRetryAttempts">Email Retry Attempts</Label>
                <Input
                  id="emailRetryAttempts"
                  name="emailRetryAttempts"
                  type="number"
                  value={emailSettings.emailRetryAttempts}
                  onChange={handleEmailChange}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send automated email notifications</p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("email", "enableEmailNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment and pricing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={paymentSettings.currency}
                    onValueChange={(value) => handleSelectChange("payment", "currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programPrice">Program Price</Label>
                  <Input
                    id="programPrice"
                    name="programPrice"
                    type="number"
                    value={paymentSettings.programPrice}
                    onChange={handlePaymentChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internshipPrice">Internship Price</Label>
                  <Input
                    id="internshipPrice"
                    name="internshipPrice"
                    type="number"
                    value={paymentSettings.internshipPrice}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    value={paymentSettings.taxRate}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enablePayments">Enable Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow users to make payments</p>
                  </div>
                  <Switch
                    id="enablePayments"
                    checked={paymentSettings.enablePayments}
                    onCheckedChange={(checked) => handleSwitchChange("payment", "enablePayments", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="stripeLiveMode">Stripe Live Mode</Label>
                    <p className="text-sm text-muted-foreground">Use Stripe live mode instead of test mode</p>
                  </div>
                  <Switch
                    id="stripeLiveMode"
                    checked={paymentSettings.stripeLiveMode}
                    onCheckedChange={(checked) => handleSwitchChange("payment", "stripeLiveMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    name="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    name="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    name="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={handleSecurityChange}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCaptcha">Enable CAPTCHA</Label>
                    <p className="text-sm text-muted-foreground">Protect forms with CAPTCHA</p>
                  </div>
                  <Switch
                    id="enableCaptcha"
                    checked={securitySettings.enableCaptcha}
                    onCheckedChange={(checked) => handleSwitchChange("security", "enableCaptcha", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require users to verify their email</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSwitchChange("security", "requireEmailVerification", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSwitchChange("security", "enableTwoFactor", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="passwordRequireSpecial">Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">Require special characters in passwords</p>
                  </div>
                  <Switch
                    id="passwordRequireSpecial"
                    checked={securitySettings.passwordRequireSpecial}
                    onCheckedChange={(checked) => handleSwitchChange("security", "passwordRequireSpecial", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize email templates and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTemplate">Default Template</Label>
                  <Select
                    value={templateSettings.defaultTemplate}
                    onValueChange={(value) => handleSelectChange("template", "defaultTemplate", value)}
                  >
                    <SelectTrigger id="defaultTemplate">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="results">Assessment Results</SelectItem>
                      <SelectItem value="payment">Payment Confirmation</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="customizeTemplates">Customize Templates</Label>
                    <p className="text-sm text-muted-foreground">Allow template customization</p>
                  </div>
                  <Switch
                    id="customizeTemplates"
                    checked={templateSettings.customizeTemplates}
                    onCheckedChange={(checked) => handleSwitchChange("template", "customizeTemplates", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableHtmlEmails">Enable HTML Emails</Label>
                    <p className="text-sm text-muted-foreground">Send emails in HTML format</p>
                  </div>
                  <Switch
                    id="enableHtmlEmails"
                    checked={templateSettings.enableHtmlEmails}
                    onCheckedChange={(checked) => handleSwitchChange("template", "enableHtmlEmails", checked)}
                  />
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="results" className="space-y-4">
                <TabsList className="grid grid-cols-3 gap-2">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                </TabsList>

                {/* Results Template */}
                <TabsContent value="results" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="results-subject">Subject</Label>
                    <Input
                      id="results-subject"
                      value={templateContent.results.subject}
                      onChange={(e) => handleTemplateContentChange("results", "subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="results-heading">Heading</Label>
                    <Input
                      id="results-heading"
                      value={templateContent.results.heading}
                      onChange={(e) => handleTemplateContentChange("results", "heading", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="results-intro">Introduction</Label>
                    <Textarea
                      id="results-intro"
                      value={templateContent.results.intro}
                      onChange={(e) => handleTemplateContentChange("results", "intro", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="results-ctaText">CTA Button Text</Label>
                      <Input
                        id="results-ctaText"
                        value={templateContent.results.ctaText}
                        onChange={(e) => handleTemplateContentChange("results", "ctaText", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="results-ctaUrl">CTA Button URL</Label>
                      <Input
                        id="results-ctaUrl"
                        value={templateContent.results.ctaUrl}
                        onChange={(e) => handleTemplateContentChange("results", "ctaUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => testEmailTemplate("results")} variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </TabsContent>

                {/* Payment Template */}
                <TabsContent value="payment" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-subject">Subject</Label>
                    <Input
                      id="payment-subject"
                      value={templateContent.payment.subject}
                      onChange={(e) => handleTemplateContentChange("payment", "subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-heading">Heading</Label>
                    <Input
                      id="payment-heading"
                      value={templateContent.payment.heading}
                      onChange={(e) => handleTemplateContentChange("payment", "heading", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-intro">Introduction</Label>
                    <Textarea
                      id="payment-intro"
                      value={templateContent.payment.intro}
                      onChange={(e) => handleTemplateContentChange("payment", "intro", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-ctaText">CTA Button Text</Label>
                      <Input
                        id="payment-ctaText"
                        value={templateContent.payment.ctaText}
                        onChange={(e) => handleTemplateContentChange("payment", "ctaText", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-ctaUrl">CTA Button URL</Label>
                      <Input
                        id="payment-ctaUrl"
                        value={templateContent.payment.ctaUrl}
                        onChange={(e) => handleTemplateContentChange("payment", "ctaUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => testEmailTemplate("payment")} variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </TabsContent>

                {/* Onboarding Template */}
                <TabsContent value="onboarding" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="onboarding-subject">Subject</Label>
                    <Input
                      id="onboarding-subject"
                      value={templateContent.onboarding.subject}
                      onChange={(e) => handleTemplateContentChange("onboarding", "subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onboarding-heading">Heading</Label>
                    <Input
                      id="onboarding-heading"
                      value={templateContent.onboarding.heading}
                      onChange={(e) => handleTemplateContentChange("onboarding", "heading", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onboarding-intro">Introduction</Label>
                    <Textarea
                      id="onboarding-intro"
                      value={templateContent.onboarding.intro}
                      onChange={(e) => handleTemplateContentChange("onboarding", "intro", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="onboarding-ctaText">CTA Button Text</Label>
                      <Input
                        id="onboarding-ctaText"
                        value={templateContent.onboarding.ctaText}
                        onChange={(e) => handleTemplateContentChange("onboarding", "ctaText", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="onboarding-ctaUrl">CTA Button URL</Label>
                      <Input
                        id="onboarding-ctaUrl"
                        value={templateContent.onboarding.ctaUrl}
                        onChange={(e) => handleTemplateContentChange("onboarding", "ctaUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => testEmailTemplate("onboarding")} variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
