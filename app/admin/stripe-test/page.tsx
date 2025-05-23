"use client"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import type React from "react"

import { useState } from "react"
import { CreditCard, Check, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function StripeTestPage() {
  const [activeTab, setActiveTab] = useState("checkout")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)

  // Checkout session form state
  const [checkoutForm, setCheckoutForm] = useState({
    amount: "700",
    currency: "usd",
    productName: "GRC Program",
    successUrl: typeof window !== "undefined" ? `${window.location.origin}/admin/stripe-test?success=true` : "",
    cancelUrl: typeof window !== "undefined" ? `${window.location.origin}/admin/stripe-test?canceled=true` : "",
  })

  // Webhook test form state
  const [webhookForm, setWebhookForm] = useState({
    eventType: "checkout.session.completed",
    customerId: "cus_" + Math.random().toString(36).substring(2, 10),
    customerEmail: "test@example.com",
    customerName: "Test User",
    amount: "700",
  })

  // Handle checkout form change
  const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCheckoutForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle webhook form change
  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWebhookForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    if (activeTab === "checkout") {
      setCheckoutForm((prev) => ({ ...prev, [name]: value }))
    } else {
      setWebhookForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Create checkout session
  const createCheckoutSession = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Validate amount is a number
      const amount = Number.parseFloat(checkoutForm.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid positive number for the amount")
      }

      const response = await fetch("/api/admin/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutForm,
          amount: amount.toString(), // Ensure it's a string but validated as a number
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Checkout session created successfully!",
          data,
        })

        // Redirect to Stripe Checkout
        if (data.url) {
          window.open(data.url, "_blank")
        }
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create checkout session",
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Test webhook
  const testWebhook = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Validate amount is a number
      const amount = Number.parseFloat(webhookForm.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid positive number for the amount")
      }

      const response = await fetch("/api/admin/stripe/test-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...webhookForm,
          amount: amount.toString(), // Ensure it's a string but validated as a number
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Webhook test completed successfully!",
          data,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to test webhook",
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stripe Test Interface</h1>
          <p className="text-muted-foreground mt-1">Test Stripe integration for payment processing</p>
        </div>
        <Button asChild variant="outline">
          <a href="https://dashboard.stripe.com/test/dashboard" target="_blank" rel="noopener noreferrer">
            Stripe Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <Tabs defaultValue="checkout" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checkout">Checkout Session</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Test</TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Checkout Session</CardTitle>
              <CardDescription>Test creating a Stripe checkout session for program registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={checkoutForm.amount}
                      onChange={handleCheckoutChange}
                      placeholder="700"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter amount in dollars (e.g., 700 for $700.00)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={checkoutForm.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="cad">CAD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={checkoutForm.productName}
                  onChange={handleCheckoutChange}
                  placeholder="GRC Program"
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="successUrl">Success URL</Label>
                <Input
                  id="successUrl"
                  name="successUrl"
                  value={checkoutForm.successUrl}
                  onChange={handleCheckoutChange}
                  placeholder="http://localhost:3000/success"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancelUrl">Cancel URL</Label>
                <Input
                  id="cancelUrl"
                  name="cancelUrl"
                  value={checkoutForm.cancelUrl}
                  onChange={handleCheckoutChange}
                  placeholder="http://localhost:3000/cancel"
                />
              </div>

              <Button className="w-full" onClick={createCheckoutSession} disabled={isLoading}>
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Checkout Session"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Webhook</CardTitle>
              <CardDescription>Simulate a Stripe webhook event to test your webhook handler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={webhookForm.eventType} onValueChange={(value) => handleSelectChange("eventType", value)}>
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkout.session.completed">checkout.session.completed</SelectItem>
                    <SelectItem value="payment_intent.succeeded">payment_intent.succeeded</SelectItem>
                    <SelectItem value="payment_intent.payment_failed">payment_intent.payment_failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    value={webhookForm.customerEmail}
                    onChange={handleWebhookChange}
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={webhookForm.customerName}
                    onChange={handleWebhookChange}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookAmount">Amount (in dollars)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="webhookAmount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={webhookForm.amount}
                    onChange={handleWebhookChange}
                    placeholder="700"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter amount in dollars (e.g., 700 for $700.00)</p>
              </div>

              <Button className="w-full" onClick={testWebhook} disabled={isLoading}>
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? "Testing..." : "Test Webhook"}
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
          <CardFooter>
            {result.success && result.data?.url && (
              <Button asChild className="w-full">
                <a href={result.data.url} target="_blank" rel="noopener noreferrer">
                  Open Checkout Page
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
