"use client"

import type React from "react"

import { useState } from "react"
import { Save, Mail, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)

  // General settings form state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "TEFY Academy",
    siteDescription: "Discover your path into Cybersecurity GRC. Practical training, flexible for all backgrounds.",
    contactEmail: "admissions@tefydigital.com",
    enableRegistrations: true,
  })

  // Email settings form state
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: "noreply@tefydigital.com",
    replyToEmail: "admissions@tefydigital.com",
    emailFooter: "© TEFY Digital Academy. All rights reserved.",
    enableEmailNotifications: true,
  })

  // Payment settings form state
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "CAD",
    programPrice: "700",
    internshipPrice: "300",
    enablePayments: true,
  })

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

  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    if (activeTab === "general") {
      setGeneralSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (activeTab === "email") {
      setEmailSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (activeTab === "payment") {
      setPaymentSettings((prev) => ({ ...prev, [name]: checked }))
    }
  }

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save the settings to your database
    console.log("General Settings:", generalSettings)
    console.log("Email Settings:", emailSettings)
    console.log("Payment Settings:", paymentSettings)

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general settings for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" name="siteName" value={generalSettings.siteName} onChange={handleGeneralChange} />
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

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableRegistrations">Enable Registrations</Label>
                  <p className="text-sm text-muted-foreground">Allow users to register for programs</p>
                </div>
                <Switch
                  id="enableRegistrations"
                  checked={generalSettings.enableRegistrations}
                  onCheckedChange={(checked) => handleSwitchChange("enableRegistrations", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>Configure email settings for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input id="fromEmail" name="fromEmail" value={emailSettings.fromEmail} onChange={handleEmailChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email</Label>
                <Input
                  id="replyToEmail"
                  name="replyToEmail"
                  value={emailSettings.replyToEmail}
                  onChange={handleEmailChange}
                />
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

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications for various events</p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("enableEmailNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage email templates used in the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Assessment Results</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Template
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Payment Confirmation</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Template
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Onboarding</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Template
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Application Follow-up</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Template
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>Configure payment settings for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" value={paymentSettings.currency} onChange={handlePaymentChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="programPrice">Program Price</Label>
                  <Input
                    id="programPrice"
                    name="programPrice"
                    value={paymentSettings.programPrice}
                    onChange={handlePaymentChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internshipPrice">Internship Price</Label>
                  <Input
                    id="internshipPrice"
                    name="internshipPrice"
                    value={paymentSettings.internshipPrice}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enablePayments">Enable Payments</Label>
                  <p className="text-sm text-muted-foreground">Allow users to make payments</p>
                </div>
                <Switch
                  id="enablePayments"
                  checked={paymentSettings.enablePayments}
                  onCheckedChange={(checked) => handleSwitchChange("enablePayments", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Products</CardTitle>
              <CardDescription>Manage products available for purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">GRC Program</CardTitle>
                      <CardDescription>Standard program without internship</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="font-medium">
                        {paymentSettings.currency} {paymentSettings.programPrice}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Product
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">GRC Program with Internship</CardTitle>
                      <CardDescription>Program with 4-week internship</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="font-medium">
                        {paymentSettings.currency}{" "}
                        {(
                          Number.parseInt(paymentSettings.programPrice) +
                          Number.parseInt(paymentSettings.internshipPrice)
                        ).toString()}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Product
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
