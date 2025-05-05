// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Table from "../dashboard/components/Table"
import { createClient } from "@supabase/supabase-js"

async function getSubmissions() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return []
  }
}

export default function SubmissionsPage() {
  // Your existing code...
  const getSubmissionsPromise = getSubmissions()

  // Prepare columns for submissions table
  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "industry", label: "Industry", sortable: true },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (value: number) => (value ? `${value}%` : "-"),
    },
    {
      key: "roles",
      label: "Recommended Roles",
      render: (value: string[]) => (value && Array.isArray(value) ? value.join(", ") : "-"),
    },
    {
      key: "is_bridge",
      label: "Bridge Role",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      key: "created_at",
      label: "Submission Date",
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
        <h1 className="text-2xl font-bold tracking-tight">Assessment Submissions</h1>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading submissions...</div>}>
        <Table
          columns={columns}
          data={getSubmissionsPromise}
          title="Assessment Submissions"
          emptyState={
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold">No submissions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Submissions will appear here once users complete the assessment.
              </p>
            </div>
          }
        />
      </Suspense>
    </div>
  )
}
