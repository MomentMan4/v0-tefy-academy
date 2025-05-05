// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminHeader from "../components/AdminHeader"
import Table from "../dashboard/components/Table"

async function getRegistrations() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return []
  }
}

export default async function RegistrationsPage() {
  const registrations = await getRegistrations()

  // Prepare columns for registrations table
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
        return amount !== undefined && amount !== null ? `$${Number.parseFloat(amount).toFixed(2)}` : "$0.00"
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
        title="Program Registrations"
        description="Manage program enrollments and payments"
        action={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        }
      />

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading registrations...</div>}>
        <Table
          columns={columns}
          data={registrations}
          title="Program Registrations"
          searchable={true}
          pagination={{ pageSize: 10 }}
          emptyState={
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold">No registrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Registrations will appear here when users enroll in a program.
              </p>
            </div>
          }
        />
      </Suspense>
    </div>
  )
}
