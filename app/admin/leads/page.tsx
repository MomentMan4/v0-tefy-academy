// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Table from "../dashboard/components/Table"
import { createClient } from "@supabase/supabase-js"

async function getLeads() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching leads:", error)
    return []
  }
}

export default async function LeadsPage() {
  const leads = await getLeads()

  // Prepare columns for leads table
  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "industry", label: "Industry", sortable: true },
    {
      key: "created_at",
      label: "Submission Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "converted",
      label: "Status",
      render: (_, row: any) => {
        // Check if this lead has a corresponding submission
        // In a real app, you would query the submissions table
        const hasSubmission = Math.random() > 0.5 // Simulating for demo
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${hasSubmission ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            {hasSubmission ? "Completed Assessment" : "Lead Only"}
          </span>
        )
      },
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
        <h1 className="text-2xl font-bold tracking-tight">Assessment Leads</h1>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading leads...</div>}>
        <Table
          columns={columns}
          data={leads}
          title="Assessment Leads"
          emptyState={
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">Leads will appear here when users start the assessment.</p>
            </div>
          }
        />
      </Suspense>
    </div>
  )
}
