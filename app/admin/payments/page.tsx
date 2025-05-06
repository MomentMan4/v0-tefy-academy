// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminHeader from "../components/AdminHeader"
import Table from "../dashboard/components/Table"
import ChartPreview from "../dashboard/components/ChartPreview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getPayments() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("registrations").select("*").order("payment_date", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching payments:", error)
    return []
  }
}

async function getPaymentStatusData() {
  try {
    const supabase = createServerSupabaseClient()

    // Get counts for different payment statuses
    const [completedResult, pendingResult, failedResult] = await Promise.all([
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "completed"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "failed"),
    ])

    return [
      { name: "Completed", value: completedResult.count || 0 },
      { name: "Pending", value: pendingResult.count || 0 },
      { name: "Failed", value: failedResult.count || 0 },
    ]
  } catch (error) {
    console.error("Error fetching payment status data:", error)
    return [
      { name: "Completed", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Failed", value: 0 },
    ]
  }
}

export default async function PaymentsPage() {
  const payments = await getPayments()
  const paymentStatusData = await getPaymentStatusData()

  // Calculate total revenue
  const totalRevenue = payments
    .filter((payment) => payment.payment_status === "completed")
    .reduce((sum, payment) => sum + (payment.payment_amount || 0), 0)

  // Prepare columns for payments table
  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "program", header: "Program", sortable: true },
    {
      key: "has_internship",
      header: "Internship",
      cell: (row: any) => (row.has_internship ? "Yes" : "No"),
    },
    {
      key: "payment_amount",
      header: "Amount",
      sortable: true,
      cell: (row: any) => {
        const amount = row.payment_amount
        return amount !== undefined && amount !== null ? `$${Number(amount).toFixed(2)}` : "$0.00"
      },
    },
    {
      key: "payment_status",
      header: "Status",
      sortable: true,
      cell: (row: any) => {
        const status = row.payment_status || "pending"
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "completed"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
      },
    },
    {
      key: "payment_date",
      header: "Payment Date",
      sortable: true,
      cell: (row: any) => {
        const date = row.payment_date
        return date ? new Date(date).toLocaleDateString() : "N/A"
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Payment Management"
        description="Track and manage program payments"
        action={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentStatusData.find((item) => item.name === "Completed")?.value || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentStatusData.find((item) => item.name === "Pending")?.value || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Overview of all payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPreview
              title=""
              description=""
              data={paymentStatusData}
              type="pie"
              height={250}
              colors={["#10b981", "#f59e0b", "#ef4444"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPreview
              title=""
              description=""
              data={[
                { name: "Credit Card", value: 75 },
                { name: "PayPal", value: 20 },
                { name: "Bank Transfer", value: 5 },
              ]}
              type="pie"
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading payments...</div>}>
        <Table
          columns={columns}
          data={payments}
          title="All Payments"
          searchable={true}
          pagination={{ pageSize: 10 }}
          emptyState={
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">Payments will appear here when users complete transactions.</p>
            </div>
          }
        />
      </Suspense>
    </div>
  )
}
