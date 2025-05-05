import { Suspense } from "react"
import { CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Table from "../dashboard/components/Table"
import { createClient } from "@supabase/supabase-js"

async function getRegistrations() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
    )

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
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "program", label: "Program", sortable: true },
    {
      key: "has_internship",
      label: "Internship",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      key: "payment_amount",
      label: "Amount",
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "payment_status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "completed"
              ? "bg-green-100 text-green-800"
              : value === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "payment_date",
      label: "Payment Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row: any) => (
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Program Registrations</h1>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading registrations...</div>}>
        <Table
          columns={columns}
          data={registrations}
          title="Program Registrations"
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
