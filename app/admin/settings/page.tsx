"use client"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AdminHeader from "../components/AdminHeader"

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
      <AdminHeader title="Settings" description="Manage your TEFY Academy platform settings" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">General Settings</h3>
            <p className="text-gray-500">Configure general platform settings.</p>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
            <p className="text-gray-500">Customize the look and feel of your platform.</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
            <p className="text-gray-500">Configure email and system notifications.</p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Security Settings</h3>
            <p className="text-gray-500">Manage security and access controls.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
